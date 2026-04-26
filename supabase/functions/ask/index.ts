/**
 * Edge Function: /ask  v19
 *
 * AjudaInteligente do Portal da Transparência. Recebe uma pergunta do cidadão,
 * verifica cache semântico, faz RAG primitivo nos eixos, opcionalmente
 * consulta a API pública do Portal MA, chama Claude Haiku 4.5 (Anthropic)
 * mantendo histórico de até 10 interações, e retorna resposta cidadã + fontes.
 *
 * v19 mudanças:
 *  - Persona "você É o portal" (não manda usuário ir embora)
 *  - RAG primitivo: detecta eixo na pergunta e injeta dataset relevante
 *  - Histórico multi-turn (até 10 trocas, validado e sanitizado)
 *  - Integração com /api/consulta-unidades (única do Portal MA estável)
 *  - Cache só ativa quando histórico vazio (multi-turn é único)
 *
 * Salvaguardas (Princípios do CLAUDE.md global):
 *  - Sanitização de input (anti-prompt-injection)
 *  - Bloqueio de busca por CPF/CNPJ/RG (LGPD)
 *  - Rate limit por IP (60s window)
 *  - Cache de respostas (TTL 24h, evita custo desnecessário)
 *  - Logs anônimos (TTL 7 dias, sem PII)
 *  - Fallback gracioso: se a API falhar, retorna mensagem clara
 *  - Toda resposta cita a fonte oficial
 *  - Histórico do cliente é tratado como hostil: validado mensagem por mensagem
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
type MensagemHistorico = {
  role: "user" | "assistant"
  content: string
}

type AskBody = {
  pergunta: string
  contexto?: {
    eixo?: string
    municipio?: string
    pagina?: string
  }
  historico?: MensagemHistorico[]
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
const MAX_HISTORICO_TROCAS = 10
const MAX_HISTORICO_MSG_LEN = 600
const RATE_LIMIT_WINDOW_SECONDS = 60
const RATE_LIMIT_MAX_REQUESTS = 10
const CACHE_TTL_HOURS = 24
const PORTAL_API_BASE = "https://www.transparencia.ma.gov.br/api"
const PORTAL_API_TIMEOUT_MS = 8_000

// Padrões que indicam dados sensíveis (LGPD).
const PADROES_BLOQUEADOS = [
  /\b\d{11}\b/, // CPF (11 dígitos)
  /\b\d{3}\.\d{3}\.\d{3}-\d{2}\b/, // CPF formatado
  /\b\d{14}\b/, // CNPJ (14 dígitos sem nada)
  /\b\d{2}\.\d{3}\.\d{3}\/\d{4}-\d{2}\b/, // CNPJ formatado
  /\b\d{1,2}\.\d{3}\.\d{3}-\d{1}\b/, // RG formatado
]

// Tentativas comuns de prompt injection
const PROMPT_INJECTION_PATTERNS = [
  /ignore\s+(previous|all|the)\s+(instructions|prompts)/i,
  /you\s+are\s+now\s+/i,
  /forget\s+everything/i,
  /system\s*:\s*you/i,
  /\[\[.+\]\]/,
]

// ─── RAG: dataset embutido dos eixos ──────────────────────────────
// Snapshot enxuto do frontend/src/data/eixos-dataset.ts
// Mantido aqui porque Edge Function (Deno) não acessa o filesystem do projeto.
// Quando atualizar o dataset frontend, atualizar este snapshot também.
type EixoData = {
  slug: string
  nome: string
  perguntaAncora: string
  resposta: string
  destaques: string
  fonteOficial: { nome: string; url: string }
}

const EIXOS_DATA: Record<string, EixoData> = {
  "gestao-publica": {
    slug: "gestao-publica",
    nome: "Gestão Pública",
    perguntaAncora: "Quanto custa a folha de servidores por mês?",
    resposta:
      "R$ 1,2 bi/mês com folha (32% do orçamento mensal). 138.412 servidores ativos. 8.247 contratos vigentes. R$ 38,4 mi em diárias acumuladas em 2026.",
    destaques:
      "SEDUC R$ 320 mi/mês (maior folha), SES R$ 248 mi/mês, PMMA R$ 198 mi/mês. Composição anual: salários R$ 7,24 bi, aposentadorias R$ 3,98 bi, encargos R$ 1,12 bi.",
    fonteOficial: {
      nome: "Portal da Transparência, Eixo Gestão Pública",
      url: "/eixo/gestao-publica",
    },
  },
  educacao: {
    slug: "educacao",
    nome: "Educação",
    perguntaAncora: "As obras de educação estão sendo executadas?",
    resposta:
      "R$ 4,8 bi orçamento SEDUC 2026 (+8,2% vs 2025). 1.084 escolas estaduais. 412 obras ativas: 287 em execução, 89 concluídas, 36 paralisadas. R$ 312 mi em merenda escolar.",
    destaques:
      "Programa Escola Digna R$ 480 mi (reforma de unidades), IEMA com 31 unidades técnicas R$ 168 mi/ano. Folha de educadores: R$ 2,14 bi/ano. Transporte escolar R$ 268 mi.",
    fonteOficial: {
      nome: "Portal da Transparência, Eixo Educação",
      url: "/eixo/educacao",
    },
  },
  saude: {
    slug: "saude",
    nome: "Saúde",
    perguntaAncora: "Quanto o governo gastou com saúde esse ano?",
    resposta:
      "R$ 3,9 bi para Saúde em 2026 (+6,4% vs 2025). 412 unidades de saúde, 18 hospitais regionais, 24 programas estaduais. R$ 184 mi em medicamentos.",
    destaques:
      "EMSERH R$ 1,2 bi/ano (Empresa Maranhense de Serviços Hospitalares), Farmácia Popular R$ 184 mi/ano, Hospital da Ilha R$ 280 mi/ano. Folha da Saúde R$ 1,68 bi.",
    fonteOficial: {
      nome: "Portal da Transparência, Eixo Saúde",
      url: "/eixo/saude",
    },
  },
  seguranca: {
    slug: "seguranca",
    nome: "Segurança Pública",
    perguntaAncora: "Quanto o estado investe em segurança pública?",
    resposta:
      "R$ 2,5 bi para SSP em 2026 (+5,8% vs 2025). 18.420 efetivo (PMMA + PC + Bombeiros + Defesa Civil). 3.840 viaturas. 247 batalhões e delegacias.",
    destaques:
      "PMMA R$ 1,28 bi/ano, Polícia Civil R$ 540 mi/ano, Corpo de Bombeiros (CBMMA) R$ 280 mi/ano, Defesa Civil R$ 64 mi/ano. Viaturas e equipamentos R$ 196 mi.",
    fonteOficial: {
      nome: "Portal da Transparência, Eixo Segurança",
      url: "/eixo/seguranca",
    },
  },
  habitacao: {
    slug: "habitacao",
    nome: "Habitação",
    perguntaAncora: "Quantas famílias maranhenses receberam moradia do estado?",
    resposta:
      "R$ 480 mi em habitação 2026 (+9,2% vs 2025). 12.840 unidades habitacionais em construção ou entregues (~51 mil pessoas). 24.180 famílias com regularização fundiária. 184 dos 217 municípios atendidos.",
    destaques:
      "Programa Casa Boa R$ 280 mi/ano (construção popular), Regularização Fundiária R$ 64 mi/ano, Programa Habitar Bem R$ 48 mi/ano (reformas).",
    fonteOficial: {
      nome: "Portal da Transparência, Eixo Habitação",
      url: "/eixo/habitacao",
    },
  },
  "programas-sociais": {
    slug: "programas-sociais",
    nome: "Programas Sociais",
    perguntaAncora: "Como me inscrevo no Maranhão Livre da Fome?",
    resposta:
      "R$ 1,2 bi em programas sociais 2026 (+11,4% vs 2025). 384 mil famílias beneficiadas. 6,2 milhões de cestas básicas distribuídas. R$ 412 mi em auxílios pagos.",
    destaques:
      "Maranhão Livre da Fome R$ 580 mi/ano (cestas e segurança alimentar), Bolsa Estudante R$ 184 mi/ano, Restaurantes Populares R$ 60 mi/ano (refeições R$ 1 em São Luís e Imperatriz). Inscrições via SEINC ou CRAS municipal.",
    fonteOficial: {
      nome: "Portal da Transparência, Eixo Programas Sociais",
      url: "/eixo/programas-sociais",
    },
  },
  obras: {
    slug: "obras",
    nome: "Obras",
    perguntaAncora: "As obras estão sendo executadas?",
    resposta:
      "R$ 1,8 bi em obras 2026 (+8,9% vs 2025). 1.247 obras ativas: 824 em execução, 287 concluídas no ano, 136 paralisadas. Frentes principais: pavimentação, saneamento, escolas, hospitais, mobilidade urbana.",
    destaques:
      "SINFRA R$ 1,1 bi/ano, DER-MA R$ 480 mi/ano, Programa Mais Asfalto R$ 320 mi/ano. Composição: pavimentação R$ 580 mi, escolas R$ 320 mi, saneamento R$ 280 mi, saúde R$ 240 mi.",
    fonteOficial: {
      nome: "Portal da Transparência, Eixo Obras",
      url: "/eixo/obras",
    },
  },
  "cultura-esporte": {
    slug: "cultura-esporte",
    nome: "Cultura e Esporte",
    perguntaAncora: "Quanto o estado investe em cultura, esporte e lazer?",
    resposta:
      "R$ 240 mi em cultura, esporte e juventude 2026 (+7,3% vs 2025). 184 equipamentos culturais. 412 eventos apoiados. 1.840 atletas com bolsa.",
    destaques:
      "Bumba Meu Boi (Patrimônio UNESCO) R$ 48 mi/ano, Carnaval/São João/Reggae R$ 36 mi/ano, Bolsa Atleta Maranhense R$ 28 mi/ano (38 modalidades).",
    fonteOficial: {
      nome: "Portal da Transparência, Eixo Cultura e Esporte",
      url: "/eixo/cultura-esporte",
    },
  },
  "meio-ambiente": {
    slug: "meio-ambiente",
    nome: "Meio Ambiente",
    perguntaAncora: "O que o estado faz pelo meio ambiente?",
    resposta:
      "R$ 180 mi em meio ambiente 2026 (+12,1% vs 2025). 24 unidades de conservação estaduais protegendo 1,8 milhão de hectares. 412 fiscais ambientais em campo.",
    destaques:
      "Fiscalização ambiental R$ 56 mi/ano (412 fiscais), Programa Mais Água Boa R$ 38 mi/ano (saneamento e recursos hídricos), Parques estaduais R$ 32 mi/ano (24 unidades).",
    fonteOficial: {
      nome: "Portal da Transparência, Eixo Meio Ambiente",
      url: "/eixo/meio-ambiente",
    },
  },
}

// Palavras-chave para detectar eixo. Match por substring no texto normalizado.
const EIXO_KEYWORDS: Array<{ slug: string; keywords: string[] }> = [
  {
    slug: "saude",
    keywords: ["saude", "ses", "emserh", "hospital", "ubs", "medicamento", "farmacia", "sus", "remedio", "consulta medica"],
  },
  {
    slug: "educacao",
    keywords: ["educacao", "seduc", "escola", "iema", "merenda", "professor", "aluno", "ensino", "estudante", "creche"],
  },
  {
    slug: "gestao-publica",
    keywords: ["folha", "servidor", "salario", "sead", "remuneracao", "contracheque", "diaria", "aposentadoria", "pensao", "comissionado"],
  },
  {
    slug: "seguranca",
    keywords: ["seguranca", "ssp", "pmma", "policia", "bombeiro", "cbmma", "defesa civil", "delegacia", "viatura", "policial"],
  },
  {
    slug: "habitacao",
    keywords: ["habitacao", "sedes", "casa boa", "moradia", "habitar bem", "regularizacao fundiaria", "casa popular"],
  },
  {
    slug: "programas-sociais",
    keywords: ["programa social", "livre da fome", "bolsa estudante", "seinc", "auxilio", "cesta basica", "restaurante popular", "cras", "cadunico", "vulnerabilidade"],
  },
  {
    slug: "obras",
    keywords: ["obra", "sinfra", "der", "asfalto", "pavimentacao", "estrada", "saneamento", "construcao", "ponte", "rodovia"],
  },
  {
    slug: "cultura-esporte",
    keywords: ["cultura", "esporte", "secma", "bumba", "festa junina", "sao joao", "reggae", "carnaval", "atleta", "biblioteca", "teatro"],
  },
  {
    slug: "meio-ambiente",
    keywords: ["meio ambiente", "sema", "conservacao", "fiscal ambiental", "agua boa", "parque estadual", "unidade de conservacao", "preservacao"],
  },
]

// ─── Cache em memória para a API de unidades do Portal MA ─────────
// O Edge Function pode ser reutilizado entre invocações na mesma instância,
// então um cache simples por TTL economiza chamadas redundantes ao portal.
let unidadesCache: { data: PortalUnidade[]; expiresAt: number } | null = null
const UNIDADES_CACHE_TTL_MS = 60 * 60 * 1000 // 1h

type PortalUnidade = {
  codigo_unidade: string
  nome_amigavel: string
  sigla_proposta: string | null
}

// ─── System prompt v19 ────────────────────────────────────────────
const SYSTEM_PROMPT = `Você é o assistente AjudaInteligente, parte integrante do Portal da Transparência do Estado do Maranhão.

VOCÊ É O PORTAL. O cidadão JÁ ESTÁ aqui, navegando no Portal da Transparência. NUNCA mande o cidadão "ir ao Portal da Transparência", "acessar o portal" ou "consultar o site oficial", porque ele já está no portal nesse exato momento.

Quando precisar direcionar o cidadão para encontrar mais detalhes, sempre use os caminhos INTERNOS do Portal:
- /busca, busca direta por palavra-chave (fornecedor, contrato, programa, servidor)
- /mapa, mapa interativo dos 217 municípios do MA com gastos, obras e contratos
- /eixo/gestao-publica, folha, servidores, contratos, diárias
- /eixo/educacao, SEDUC, escolas, IEMA, merenda, transporte escolar
- /eixo/saude, SES, EMSERH, hospitais, UBS, medicamentos
- /eixo/seguranca, SSP, PMMA, Polícia Civil, Bombeiros, Defesa Civil
- /eixo/habitacao, SEDES, Casa Boa, regularização fundiária
- /eixo/programas-sociais, SEINC, Maranhão Livre da Fome, Bolsa Estudante
- /eixo/obras, SINFRA, DER-MA, pavimentação, saneamento
- /eixo/cultura-esporte, SECMA, Bumba Meu Boi, Bolsa Atleta
- /eixo/meio-ambiente, SEMA, fiscalização, áreas de conservação

DIRETRIZES OBRIGATÓRIAS:
1. Responda SEMPRE em português do Brasil, em tom cordial e claro
2. Use linguagem simples, evite "burocratiquês". Quando precisar usar termos técnicos (empenho, dotação, subelemento), explique entre parênteses
3. Limite a resposta a 3-4 parágrafos curtos
4. As URLs das fontes DEVEM ser SEMPRE caminhos internos do Portal começando com "/" (ex: "/eixo/saude", "/busca", "/mapa"). PROIBIDO usar URLs externas começando com "http://" ou "https://" no campo "url" das fontes. Você pode CITAR o nome do órgão (SES, SEDUC, EMSERH) no campo "titulo", mas a "url" sempre é o caminho interno do eixo correspondente
5. Use os DADOS RELEVANTES e UNIDADES OFICIAIS injetados no contexto desta pergunta. Esses dados são oficiais e atuais
6. Se a pergunta NÃO for sobre dados públicos do MA, responda: "Essa pergunta não é sobre dados do Portal da Transparência. Posso te ajudar com gastos públicos, contratos, servidores, programas sociais, obras e mais."
7. NUNCA invente dados. Se não tiver informação, diga: "Não encontrei essa informação na base atual. Você pode tentar a busca em /busca ou explorar o eixo correspondente"
8. Para perguntas sobre pessoas físicas, oriente: "Por proteção de dados pessoais (LGPD), não exibimos buscas por nomes individuais. Para fornecedores empresas (CNPJ), os dados são públicos e estão em /busca"
9. Mantenha continuidade da conversa: se houver histórico, considere as perguntas anteriores ao responder

CONHECIMENTO DE BASE (orçamento estadual MA 2026):
- Educação R$ 4,8 bi (SEDUC, IEMA, EGMA)
- Saúde R$ 3,9 bi (SES, EMSERH)
- Folha total R$ 14,7 bi/ano (~R$ 1,2 bi/mês), 138.412 servidores ativos
- Segurança R$ 2,5 bi (SSP, PMMA, PC, Bombeiros)
- Programas Sociais R$ 1,2 bi (SEINC, Maranhão Livre da Fome)
- Obras R$ 1,8 bi (SINFRA, DER-MA)
- Habitação R$ 480 mi (SEDES)
- Cultura/Esporte R$ 240 mi (SECMA)
- Meio Ambiente R$ 180 mi (SEMA)
- 217 municípios, 8.247 contratos vigentes

FORMATO DE RESPOSTA OBRIGATÓRIO:
Retorne APENAS um JSON válido, no formato:
{
  "resposta": "texto da resposta cidadã, parágrafos separados por \\n\\n",
  "fontes": [
    { "titulo": "Nome do eixo ou órgão", "url": "/eixo/X ou /busca ou /mapa" }
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
            "Por proteção de dados pessoais (LGPD), não realizamos buscas por CPF, RG ou CNPJ isolado. Tente buscar pelo nome do órgão, fornecedor ou cargo na busca em /busca.",
          fontes: [{ titulo: "Busca do Portal da Transparência", url: "/busca" }],
          cached: false,
          modo: "fallback",
          pergunta_normalizada: normalizar(pergunta),
        } satisfies AskResponse,
        200
      )
    }
  }

  // 3. Anti prompt injection na pergunta atual
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

  // 3.1 Sanitiza histórico recebido do cliente (HOSTIL POR DEFINIÇÃO)
  const historicoSanitizado = sanitizarHistorico(body.historico)

  // 4. Cliente Supabase (service_role para escrever em ia_cache/ia_logs)
  const supabaseUrl = Deno.env.get("SUPABASE_URL") ?? ""
  const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
  const supabase = createClient(supabaseUrl, serviceRoleKey)

  // 5. Rate limit por IP (com salt)
  const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "0.0.0.0"
  const ipSalt = Deno.env.get("IP_HASH_SALT") ?? "transparema-default-salt-2026"
  const ipHash = await sha256(ip + ":" + ipSalt)
  console.log("[ask] step rate-limit. ipHash:", ipHash.slice(0, 8))
  let rateOk: boolean
  try {
    rateOk = !(await rateLimited(supabase, ipHash))
  } catch (e) {
    console.error(
      "[ask] rateLimit exception:",
      e instanceof Error ? e.message : "unknown"
    )
    rateOk = true
  }
  if (!rateOk) {
    return jsonResponse(
      { erro: "Muitas perguntas em pouco tempo. Aguarde 1 minuto e tente de novo." },
      429
    )
  }

  // 5.1. Sanitizar campos do contexto
  const contextoSanitizado: AskBody["contexto"] = body.contexto
    ? {
        eixo: sanitizarContexto(body.contexto.eixo),
        municipio: sanitizarContexto(body.contexto.municipio),
        pagina: sanitizarContexto(body.contexto.pagina),
      }
    : undefined

  // 6. Cache lookup (apenas quando histórico vazio: multi-turn é único)
  const perguntaNormalizada = normalizar(pergunta)
  const perguntaHash = await sha256(perguntaNormalizada)
  const usarCache = historicoSanitizado.length === 0

  if (usarCache) {
    const cacheLookup = await supabase
      .from("ia_cache")
      .select("resposta, expires_at")
      .eq("pergunta_hash", perguntaHash)
      .gt("expires_at", new Date().toISOString())
      .maybeSingle()

    if (cacheLookup.error) {
      console.error("[ask] cache lookup error:", cacheLookup.error.message)
    }

    if (cacheLookup.data?.resposta) {
      await registrarLog(supabase, perguntaHash, ipHash, "cache", 0, true)
      return jsonResponse(
        {
          ...(cacheLookup.data.resposta as Omit<
            AskResponse,
            "cached" | "modo" | "pergunta_normalizada"
          >),
          cached: true,
          modo: "cache",
          pergunta_normalizada: perguntaNormalizada,
        } satisfies AskResponse,
        200
      )
    }
  }

  // 7. Chama Claude Haiku 4.5
  const apiKey = Deno.env.get("ANTHROPIC_API_KEY") ?? ""
  if (!apiKey) {
    return jsonResponse(
      {
        resposta:
          "A AjudaInteligente está temporariamente indisponível. Você pode usar a busca direta em /busca ou explorar os eixos temáticos. Os dados continuam acessíveis aqui no Portal da Transparência.",
        fontes: [
          { titulo: "Busca do Portal da Transparência", url: "/busca" },
          { titulo: "Mapa do Maranhão", url: "/mapa" },
        ],
        cached: false,
        modo: "fallback",
        pergunta_normalizada: perguntaNormalizada,
      } satisfies AskResponse,
      200
    )
  }

  try {
    // 7.1 RAG: detecta eixos relevantes na pergunta
    const eixosRelevantes = detectarEixos(perguntaNormalizada)

    // 7.2 Tenta enriquecer com unidades reais do Portal MA (best effort, fail-open)
    const unidadesRelevantes = await tentarBuscarUnidades(perguntaNormalizada)

    const userPrompt = montarPrompt(
      pergunta,
      contextoSanitizado,
      eixosRelevantes,
      unidadesRelevantes
    )
    const llmRaw = await chamarClaudeHaiku(
      apiKey,
      SYSTEM_PROMPT,
      userPrompt,
      historicoSanitizado
    )
    const llmJson = parseLLMResponse(llmRaw)

    const resposta: AskResponse = {
      resposta: llmJson.resposta,
      fontes: llmJson.fontes,
      cached: false,
      modo: "anthropic",
      pergunta_normalizada: perguntaNormalizada,
    }

    // 8. Cacheia resposta APENAS quando primeira pergunta (sem histórico)
    if (usarCache) {
      const expiresAt = new Date(Date.now() + CACHE_TTL_HOURS * 60 * 60 * 1000)
      await supabase.from("ia_cache").upsert(
        {
          pergunta_hash: perguntaHash,
          resposta: { resposta: resposta.resposta, fontes: resposta.fontes },
          expires_at: expiresAt.toISOString(),
        },
        { onConflict: "pergunta_hash" }
      )
    }

    await registrarLog(supabase, perguntaHash, ipHash, "anthropic", 0, true)

    return jsonResponse(resposta, 200)
  } catch (e) {
    console.error(
      "[ask] Claude failed:",
      e instanceof Error ? e.message.split(":")[0] : "unknown"
    )
    await registrarLog(
      supabase,
      perguntaHash,
      ipHash,
      "anthropic_error",
      0,
      false
    )
    return jsonResponse(
      {
        resposta:
          "Não foi possível responder agora. Aqui no Portal da Transparência, você pode usar a busca em /busca ou explorar os eixos temáticos para acessar os dados diretamente.",
        fontes: [
          { titulo: "Busca do Portal da Transparência", url: "/busca" },
          { titulo: "Mapa do Maranhão", url: "/mapa" },
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

const COMBINING_MARKS_RE = new RegExp(
  "[" + String.fromCharCode(0x0300) + "-" + String.fromCharCode(0x036f) + "]",
  "g"
)

function normalizar(s: string): string {
  return s
    .toLowerCase()
    .normalize("NFD")
    .replace(COMBINING_MARKS_RE, "")
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
  const since = new Date(
    Date.now() - RATE_LIMIT_WINDOW_SECONDS * 1000
  ).toISOString()
  const { count } = await supabase
    .from("ia_logs")
    .select("id", { count: "exact", head: true })
    .eq("ip_hash", ipHash)
    .gte("created_at", since)
  return (count ?? 0) >= RATE_LIMIT_MAX_REQUESTS
}

async function registrarLog(
  supabase: ReturnType<typeof createClient>,
  perguntaHash: string,
  ipHash: string,
  triggerType: string,
  tokensUsed: number,
  helpful: boolean
) {
  try {
    await supabase.from("ia_logs").insert({
      pergunta_hash: perguntaHash,
      ip_hash: ipHash,
      trigger_type: triggerType,
      tokens_used: tokensUsed,
      helpful,
    })
  } catch {
    // Log falhou, mas não bloqueia a resposta
  }
}

function sanitizarContexto(v?: string, max = 100): string | undefined {
  if (!v) return undefined
  const limpo = String(v).slice(0, max).replace(/[\r\n]+/g, " ").trim()
  if (!limpo) return undefined
  for (const p of PROMPT_INJECTION_PATTERNS) {
    if (p.test(limpo)) return undefined
  }
  return limpo
}

/**
 * Sanitiza o histórico vindo do cliente. O histórico é HOSTIL por definição:
 * o cliente pode forjar mensagens "assistant" para tentar reescrever a persona.
 * Por isso aplicamos:
 *  - max 10 trocas (20 mensagens)
 *  - max MAX_HISTORICO_MSG_LEN chars por mensagem
 *  - role apenas "user" ou "assistant"
 *  - mesmas regras anti-injection da pergunta atual
 *  - descarta mensagem que contém padrão injection ao invés de bloquear request
 *    (a Anthropic ainda recebe o resto do histórico válido)
 */
function sanitizarHistorico(h?: MensagemHistorico[]): MensagemHistorico[] {
  if (!Array.isArray(h)) return []
  const validos: MensagemHistorico[] = []
  // Pega as últimas trocas (mais recentes primeiro caso array seja grande)
  const slice = h.slice(-MAX_HISTORICO_TROCAS * 2)
  for (const msg of slice) {
    if (!msg || typeof msg !== "object") continue
    if (msg.role !== "user" && msg.role !== "assistant") continue
    if (typeof msg.content !== "string") continue
    const limpo = msg.content
      .slice(0, MAX_HISTORICO_MSG_LEN)
      .replace(/[\r\n]+/g, " ")
      .trim()
    if (!limpo) continue
    let injection = false
    for (const p of PROMPT_INJECTION_PATTERNS) {
      if (p.test(limpo)) {
        injection = true
        break
      }
    }
    if (injection) continue
    validos.push({ role: msg.role, content: limpo })
  }
  return validos
}

/**
 * Detecta até 2 eixos mais relevantes para a pergunta. Match por substring
 * em texto normalizado (sem acento, lower, sem pontuação). Retorna ordenado
 * por número de hits (mais matches = mais relevante).
 */
function detectarEixos(perguntaNorm: string): EixoData[] {
  const scores: Array<{ slug: string; hits: number }> = []
  for (const { slug, keywords } of EIXO_KEYWORDS) {
    let hits = 0
    for (const kw of keywords) {
      if (perguntaNorm.includes(kw)) hits++
    }
    if (hits > 0) scores.push({ slug, hits })
  }
  scores.sort((a, b) => b.hits - a.hits)
  return scores
    .slice(0, 2)
    .map((s) => EIXOS_DATA[s.slug])
    .filter((e): e is EixoData => Boolean(e))
}

/**
 * Tenta buscar unidades do Portal MA quando a pergunta menciona órgão/sigla.
 * Best effort: se a API falhar, retorna [] e segue sem bloquear a resposta.
 */
async function tentarBuscarUnidades(perguntaNorm: string): Promise<PortalUnidade[]> {
  // Heurística: só busca se houve referência a órgão/sigla
  const mencionaOrgao = /\b(seduc|ses|sead|ssp|sema|secma|seinc|sedes|sinfra|der|emserh|iema|pmma|cbmma|policia|secretaria|orgao|unidade|ug)\b/.test(
    perguntaNorm
  )
  if (!mencionaOrgao) return []

  try {
    const todas = await getUnidadesPortal()
    if (todas.length === 0) return []
    // Filtra unidades com sigla ou nome mencionados na pergunta
    const tokens = perguntaNorm.split(/\s+/).filter((t) => t.length >= 3)
    const relevantes: PortalUnidade[] = []
    for (const u of todas) {
      const sigla = (u.sigla_proposta ?? "").toLowerCase()
      const nome = (u.nome_amigavel ?? "").toLowerCase()
      for (const tk of tokens) {
        if (sigla === tk || nome.includes(tk)) {
          relevantes.push(u)
          break
        }
      }
      if (relevantes.length >= 5) break
    }
    return relevantes
  } catch (e) {
    console.warn(
      "[ask] portal API failed (best effort):",
      e instanceof Error ? e.message.split(":")[0] : "unknown"
    )
    return []
  }
}

async function getUnidadesPortal(): Promise<PortalUnidade[]> {
  const now = Date.now()
  if (unidadesCache && unidadesCache.expiresAt > now) {
    return unidadesCache.data
  }
  const controller = new AbortController()
  const timeout = setTimeout(() => controller.abort(), PORTAL_API_TIMEOUT_MS)
  try {
    const res = await fetch(`${PORTAL_API_BASE}/consulta-unidades`, {
      signal: controller.signal,
      headers: { Accept: "application/json" },
    })
    if (!res.ok) {
      throw new Error(`Portal HTTP ${res.status}`)
    }
    const data = (await res.json()) as PortalUnidade[]
    if (!Array.isArray(data)) {
      throw new Error("Portal retornou shape inesperado")
    }
    // Cap defensivo: a API atual retorna ~157 unidades, mas se algum dia
    // o shape mudar e vier muito mais, evita memory pressure na instância.
    const capped = data.slice(0, 500)
    unidadesCache = { data: capped, expiresAt: now + UNIDADES_CACHE_TTL_MS }
    return capped
  } finally {
    clearTimeout(timeout)
  }
}

function montarPrompt(
  pergunta: string,
  contexto: AskBody["contexto"] | undefined,
  eixos: EixoData[],
  unidades: PortalUnidade[]
): string {
  let prompt = `Pergunta do cidadão: "${pergunta}"\n\n`

  if (contexto?.eixo) {
    prompt += `Contexto de navegação: o cidadão está no eixo "${contexto.eixo}".\n`
  }
  if (contexto?.municipio) {
    prompt += `Município de interesse: ${contexto.municipio}.\n`
  }
  if (contexto?.pagina) {
    prompt += `Página atual: ${contexto.pagina}.\n`
  }

  if (eixos.length > 0) {
    prompt += `\nDADOS RELEVANTES dos eixos do Portal (use estes números, são oficiais):\n`
    for (const e of eixos) {
      prompt += `\n[${e.nome}] (${e.fonteOficial.url})\n`
      prompt += `Resumo: ${e.resposta}\n`
      prompt += `Destaques: ${e.destaques}\n`
    }
  }

  if (unidades.length > 0) {
    prompt += `\nUNIDADES OFICIAIS encontradas na base do Portal MA:\n`
    for (const u of unidades) {
      const sigla = u.sigla_proposta ? ` (${u.sigla_proposta})` : ""
      const nome = u.nome_amigavel ?? "Unidade sem nome"
      prompt += `- ${nome}${sigla}, código UG ${u.codigo_unidade}\n`
    }
  }

  prompt += `\nResponda em formato JSON conforme as diretrizes. Lembre-se: você É o Portal da Transparência, NÃO mande o cidadão para fora.`
  return prompt
}

async function chamarClaudeHaiku(
  apiKey: string,
  systemPrompt: string,
  userPrompt: string,
  historico: MensagemHistorico[]
): Promise<string> {
  const messages: Array<{ role: "user" | "assistant"; content: string }> = []
  // Histórico anterior (já validado e sanitizado).
  // Defesa contra cliente forjar histórico terminando em "assistant":
  // a Anthropic exige roles alternados. Se o último for assistant,
  // ele coalesceria com nossa pergunta atual (user) só se fosse user, mas
  // o REAL problema aparece se descartássemos a pergunta atual; aqui o
  // próximo push é "user" (pergunta atual), então a alternância é mantida.
  // O perigo está no PREFILL "assistant" no fim: se o histórico já termina
  // com "user" sem ser respondido (caso normal), perfeito. Se termina com
  // "assistant" e o próximo é "user" (atual) e depois "assistant" (prefill),
  // a alternância também está OK. Mas se vierem 2 "assistant" seguidos no
  // histórico, a API rejeita. Logo: deduplicamos roles iguais consecutivos.
  for (const m of historico) {
    const last = messages[messages.length - 1]
    if (last && last.role === m.role) {
      // mesma role consecutiva: descarta a anterior (mantém a mais recente)
      messages.pop()
    }
    messages.push({ role: m.role, content: m.content })
  }
  // Garante que o último item antes da pergunta atual NÃO é "user"
  // (senão dois "user" seguidos quebram a alternância)
  const lastBeforeUser = messages[messages.length - 1]
  if (lastBeforeUser && lastBeforeUser.role === "user") {
    messages.pop()
  }
  // Anthropic exige que o array de mensagens comece com "user".
  // Cliente pode forjar histórico começando com "assistant" - removemos.
  while (messages.length > 0 && messages[0].role === "assistant") {
    messages.shift()
  }
  // Pergunta atual
  messages.push({ role: "user", content: userPrompt })
  // Prefill JSON (sempre é o último, sempre assistant após user atual)
  messages.push({ role: "assistant", content: "{" })

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
      messages,
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
