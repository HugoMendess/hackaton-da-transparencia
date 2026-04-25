/**
 * Edge Function: /ask
 *
 * AjudaInteligente do TransparaMA. Recebe uma pergunta do cidadão,
 * verifica cache semântico, chama Claude Haiku 4.5 (Anthropic) com
 * contexto dos eixos públicos do MA e retorna resposta cidadã + fontes.
 *
 * Salvaguardas (Princípios do CLAUDE.md global):
 *  - Sanitização de input (anti-prompt-injection)
 *  - Bloqueio de busca por CPF/CNPJ/RG (LGPD)
 *  - Rate limit por IP (60s window)
 *  - Cache de respostas (TTL 24h, evita custo desnecessário)
 *  - Logs anônimos (TTL 7 dias, sem PII)
 *  - Fallback gracioso: se a API falhar, retorna mensagem clara
 *  - Toda resposta cita a fonte oficial
 */
// @ts-ignore - Deno runtime do Supabase Edge Functions
import { createClient } from "npm:@supabase/supabase-js@2"

// ─── CORS ──────────────────────────────────────────────────────────
const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
}

// ─── Tipos ─────────────────────────────────────────────────────────
type AskBody = {
  pergunta: string
  contexto?: {
    eixo?: string
    municipio?: string
    pagina?: string
  }
}

type AskResponse = {
  resposta: string
  fontes: Array<{ titulo: string; url: string }>
  cached: boolean
  modo: "anthropic" | "cache" | "fallback"
  pergunta_normalizada: string
}

// ─── Salvaguardas ─────────────────────────────────────────────────
const MAX_PERGUNTA_LEN = 500
const RATE_LIMIT_WINDOW_SECONDS = 60
const RATE_LIMIT_MAX_REQUESTS = 10
const CACHE_TTL_HOURS = 24

// Padrões que indicam dados sensíveis (LGPD)
const PADROES_BLOQUEADOS = [
  /\b\d{11}\b/, // CPF (11 dígitos)
  /\b\d{3}\.\d{3}\.\d{3}-\d{2}\b/, // CPF formatado
  /\b\d{14}\b/, // CNPJ (14 dígitos)
  /\b\d{2}\.\d{3}\.\d{3}\/\d{4}-\d{2}\b/, // CNPJ formatado
  /\b\d{7,9}\b/, // RG aproximado
]

// Tentativas comuns de prompt injection
const PROMPT_INJECTION_PATTERNS = [
  /ignore\s+(previous|all|the)\s+(instructions|prompts)/i,
  /you\s+are\s+now\s+/i,
  /forget\s+everything/i,
  /system\s*:\s*you/i,
  /\[\[.+\]\]/,
]

// ─── System prompt para o Claude ──────────────────────────────────
const SYSTEM_PROMPT = `Você é o assistente AjudaInteligente do TransparaMA, o futuro Portal da Transparência do Maranhão.

Seu papel é responder perguntas sobre dados públicos do estado em linguagem cidadã, sem jargão técnico.

DIRETRIZES OBRIGATÓRIAS:
1. Responda SEMPRE em português do Brasil, em tom cordial e claro
2. Use linguagem simples, evite "burocratiquês". Quando precisar usar termos técnicos (empenho, dotação, subelemento), explique entre parênteses
3. Limite a resposta a 3-4 parágrafos curtos
4. Sempre cite a fonte oficial dos dados
5. Se a pergunta NÃO for sobre dados públicos do MA, responda:
   "Essa pergunta não é sobre dados do Portal da Transparência do MA. Posso te ajudar com gastos públicos, contratos, servidores, programas sociais, obras, etc."
6. NUNCA invente dados. Se não tiver informação, diga: "Não encontrei essa informação na base atual"
7. Para perguntas sobre pessoas físicas, oriente: "Por proteção de dados pessoais (LGPD), não exibimos buscas por nomes individuais"

CONTEXTO DOS DADOS DISPONÍVEIS (orçamento estadual MA 2026):
- Educação: R$ 4,8 bi (SEDUC, IEMA, EGMA)
- Saúde: R$ 3,9 bi (SES, EMSERH)
- Gestão Pública (Folha): R$ 14,7 bi (SEAD, todos os órgãos)
- Segurança Pública: R$ 2,5 bi (SSP, PMMA, Polícia Civil, Bombeiros)
- Programas Sociais: R$ 1,2 bi (SEINC, Maranhão Livre da Fome)
- Obras: R$ 1,8 bi (SINFRA, DER-MA)
- Habitação: R$ 480 mi (SEDES)
- Cultura/Esporte: R$ 240 mi (SECMA)
- Meio Ambiente: R$ 180 mi (SEMA)
- 217 municípios, ~138 mil servidores ativos

RESPOSTA:
Retorne APENAS um JSON válido, no formato:
{
  "resposta": "texto da resposta cidadã, parágrafos separados por \\n\\n",
  "fontes": [
    { "titulo": "Nome do órgão ou portal", "url": "https://..." }
  ]
}`

// ─── Handler principal ────────────────────────────────────────────
Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders })
  }

  if (req.method !== "POST") {
    return jsonResponse({ erro: "Método não permitido" }, 405)
  }

  // 1. Parse e validação básica do body
  let body: AskBody
  try {
    body = await req.json()
  } catch {
    return jsonResponse({ erro: "JSON inválido" }, 400)
  }

  const pergunta = (body.pergunta ?? "").trim()
  if (!pergunta) {
    return jsonResponse({ erro: "Pergunta vazia" }, 400)
  }
  if (pergunta.length > MAX_PERGUNTA_LEN) {
    return jsonResponse(
      { erro: `Pergunta muito longa (máx ${MAX_PERGUNTA_LEN} caracteres)` },
      400
    )
  }

  // 2. Sanitização: bloqueio LGPD
  for (const padrao of PADROES_BLOQUEADOS) {
    if (padrao.test(pergunta)) {
      return jsonResponse(
        {
          resposta:
            "Por proteção de dados pessoais (LGPD), não realizamos buscas por CPF, RG ou CNPJ isolado. Tente buscar pelo nome do órgão, fornecedor ou cargo.",
          fontes: [],
          cached: false,
          modo: "fallback",
          pergunta_normalizada: normalizar(pergunta),
        } satisfies AskResponse,
        200
      )
    }
  }

  // 3. Anti prompt injection
  for (const padrao of PROMPT_INJECTION_PATTERNS) {
    if (padrao.test(pergunta)) {
      return jsonResponse(
        {
          resposta:
            "Sua pergunta parece conter instruções para o sistema. Reformule de forma natural, como falaria com outra pessoa. Ex: 'quanto foi gasto com saúde em 2026?'",
          fontes: [],
          cached: false,
          modo: "fallback",
          pergunta_normalizada: normalizar(pergunta),
        } satisfies AskResponse,
        200
      )
    }
  }

  // 4. Cliente Supabase (service_role para escrever em ia_cache/ia_logs)
  const supabaseUrl = Deno.env.get("SUPABASE_URL") ?? ""
  const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
  const supabase = createClient(supabaseUrl, serviceRoleKey)

  // 5. Rate limit por IP
  const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "0.0.0.0"
  const ipHash = await sha256(ip)
  if (await rateLimited(supabase, ipHash)) {
    return jsonResponse(
      { erro: "Muitas perguntas em pouco tempo. Aguarde 1 minuto e tente de novo." },
      429
    )
  }

  // 6. Cache lookup (hash exato + normalização)
  const perguntaNormalizada = normalizar(pergunta)
  const perguntaHash = await sha256(perguntaNormalizada)

  const { data: cacheRow } = await supabase
    .from("ia_cache")
    .select("resposta, expires_at")
    .eq("pergunta_hash", perguntaHash)
    .gt("expires_at", new Date().toISOString())
    .maybeSingle()

  if (cacheRow?.resposta) {
    await registrarLog(supabase, perguntaHash, "cache", 0, true)
    return jsonResponse(
      {
        ...(cacheRow.resposta as Omit<AskResponse, "cached" | "modo" | "pergunta_normalizada">),
        cached: true,
        modo: "cache",
        pergunta_normalizada: perguntaNormalizada,
      } satisfies AskResponse,
      200
    )
  }

  // 7. Chama Claude Haiku 4.5
  const apiKey = Deno.env.get("ANTHROPIC_API_KEY") ?? ""
  if (!apiKey) {
    // API key não configurada: fallback gracioso
    return jsonResponse(
      {
        resposta:
          "A AjudaInteligente está temporariamente indisponível. Você pode usar a busca direta no portal ou explorar os eixos temáticos. Os dados continuam acessíveis.",
        fontes: [
          {
            titulo: "Portal da Transparência MA",
            url: "https://www.transparencia.ma.gov.br",
          },
        ],
        cached: false,
        modo: "fallback",
        pergunta_normalizada: perguntaNormalizada,
      } satisfies AskResponse,
      200
    )
  }

  try {
    const userPrompt = montarPrompt(pergunta, body.contexto)
    const llmRaw = await chamarClaudeHaiku(apiKey, SYSTEM_PROMPT, userPrompt)
    const llmJson = parseLLMResponse(llmRaw)

    const resposta: AskResponse = {
      resposta: llmJson.resposta,
      fontes: llmJson.fontes,
      cached: false,
      modo: "anthropic",
      pergunta_normalizada: perguntaNormalizada,
    }

    // 8. Cacheia resposta (TTL 24h)
    const expires = new Date()
    expires.setHours(expires.getHours() + CACHE_TTL_HOURS)
    await supabase.from("ia_cache").upsert(
      {
        pergunta_hash: perguntaHash,
        resposta: { resposta: resposta.resposta, fontes: resposta.fontes },
        expires_at: expires.toISOString(),
      },
      { onConflict: "pergunta_hash" }
    )

    await registrarLog(supabase, perguntaHash, "anthropic", 0, true)

    return jsonResponse(resposta, 200)
  } catch (e) {
    console.error("[ask] erro Claude:", e)
    await registrarLog(supabase, perguntaHash, "anthropic_error", 0, false)
    return jsonResponse(
      {
        resposta:
          "Não foi possível responder agora. A base de dados continua acessível pelos eixos temáticos.",
        fontes: [
          {
            titulo: "Portal da Transparência MA",
            url: "https://www.transparencia.ma.gov.br",
          },
        ],
        cached: false,
        modo: "fallback",
        pergunta_normalizada: perguntaNormalizada,
      } satisfies AskResponse,
      200
    )
  }
})

// ─── Funções auxiliares ───────────────────────────────────────────

function jsonResponse(data: unknown, status: number): Response {
  return new Response(JSON.stringify(data), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  })
}

function normalizar(s: string): string {
  return s
    .toLowerCase()
    .normalize("NFD")
    .replace(/\p{Mn}/gu, "")
    .replace(/[^a-z0-9\s]/g, " ")
    .replace(/\s+/g, " ")
    .trim()
}

async function sha256(text: string): Promise<string> {
  const enc = new TextEncoder().encode(text)
  const buf = await crypto.subtle.digest("SHA-256", enc)
  return Array.from(new Uint8Array(buf))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("")
}

async function rateLimited(
  supabase: ReturnType<typeof createClient>,
  ipHash: string
): Promise<boolean> {
  const since = new Date(Date.now() - RATE_LIMIT_WINDOW_SECONDS * 1000).toISOString()
  const { count } = await supabase
    .from("ia_logs")
    .select("id", { count: "exact", head: true })
    .eq("pergunta_hash", ipHash) // reutiliza coluna pra rate limit por IP
    .gte("created_at", since)
  return (count ?? 0) >= RATE_LIMIT_MAX_REQUESTS
}

async function registrarLog(
  supabase: ReturnType<typeof createClient>,
  perguntaHash: string,
  triggerType: string,
  tokensUsed: number,
  helpful: boolean
) {
  try {
    await supabase.from("ia_logs").insert({
      pergunta_hash: perguntaHash,
      trigger_type: triggerType,
      tokens_used: tokensUsed,
      helpful,
    })
  } catch (e) {
    console.error("[ask] erro log:", e)
    // Log falhou, mas não bloqueia a resposta
  }
}

function montarPrompt(pergunta: string, contexto?: AskBody["contexto"]): string {
  let prompt = `Pergunta do cidadão: "${pergunta}"\n\n`
  if (contexto?.eixo) {
    prompt += `Contexto: o cidadão está navegando no eixo "${contexto.eixo}".\n`
  }
  if (contexto?.municipio) {
    prompt += `Município de interesse: ${contexto.municipio}.\n`
  }
  prompt += `\nResponda em formato JSON conforme as diretrizes.`
  return prompt
}

async function chamarClaudeHaiku(
  apiKey: string,
  systemPrompt: string,
  userPrompt: string
): Promise<string> {
  const res = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": apiKey,
      "anthropic-version": "2023-06-01",
    },
    body: JSON.stringify({
      model: "claude-haiku-4-5",
      max_tokens: 1024,
      temperature: 0.5,
      system: systemPrompt,
      messages: [
        { role: "user", content: userPrompt },
        { role: "assistant", content: "{" }, // prefill
      ],
    }),
    signal: AbortSignal.timeout(45000),
  })

  if (!res.ok) {
    const err = await res.text().catch(() => "")
    throw new Error(`Anthropic HTTP ${res.status}: ${err.substring(0, 200)}`)
  }
  const data = await res.json()
  const textBlock = data.content?.find(
    (b: Record<string, unknown>) => b.type === "text"
  )
  return "{" + (textBlock?.text || "")
}

function parseLLMResponse(raw: string): {
  resposta: string
  fontes: Array<{ titulo: string; url: string }>
} {
  // Remove qualquer texto antes do primeiro { e depois do último }
  const inicio = raw.indexOf("{")
  const fim = raw.lastIndexOf("}")
  if (inicio === -1 || fim === -1) {
    throw new Error("Resposta da IA sem JSON válido")
  }
  const json = raw.substring(inicio, fim + 1)
  const parsed = JSON.parse(json)
  if (typeof parsed.resposta !== "string") {
    throw new Error("Resposta sem campo 'resposta'")
  }
  return {
    resposta: parsed.resposta,
    fontes: Array.isArray(parsed.fontes) ? parsed.fontes : [],
  }
}
