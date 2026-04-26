import { useCallback, useRef, useState } from "react"
import { supabase } from "@/lib/supabase"

export type Fonte = { titulo: string; url: string }

export type RespostaIA = {
  resposta: string
  fontes: Fonte[]
  cached: boolean
  modo: "anthropic" | "cache" | "fallback"
  pergunta_normalizada: string
}

export type MensagemConversa =
  | { tipo: "pergunta"; texto: string; quando: Date }
  | { tipo: "resposta"; data: RespostaIA; quando: Date }
  | { tipo: "erro"; texto: string; quando: Date }

export type ContextoAjuda = {
  eixo?: string
  municipio?: string
  pagina?: string
}

const MAX_MENSAGENS = 50
const MAX_HISTORICO_TROCAS = 10
const MAX_HISTORICO_MSG_LEN = 600

function sanitizarFontes(fontes: Fonte[]): Fonte[] {
  return fontes.filter((f) => {
    if (!f.url || typeof f.url !== "string") return false
    // A Edge Function instrui o LLM a retornar apenas paths internos.
    // Defesa em profundidade: aceita só caminho relativo (/) ou https
    // de domínios .gov.br. Bloqueia http:// e qualquer outro domínio
    // para evitar exfiltração caso o LLM seja induzido por prompt injection.
    if (f.url.startsWith("/")) return true
    if (f.url.startsWith("https://")) {
      try {
        const host = new URL(f.url).hostname.toLowerCase()
        return host === "ma.gov.br" || host.endsWith(".ma.gov.br") || host.endsWith(".gov.br")
      } catch {
        return false
      }
    }
    return false
  })
}

/** Mantém o histórico limitado a MAX_MENSAGENS, descartando o início */
function capMensagens(arr: MensagemConversa[]): MensagemConversa[] {
  return arr.length > MAX_MENSAGENS ? arr.slice(-MAX_MENSAGENS) : arr
}

/**
 * Converte as mensagens da UI no formato da Anthropic. Pega as últimas
 * MAX_HISTORICO_TROCAS trocas (perguntas + respostas), descarta erros e
 * trunca cada mensagem para limitar o consumo de tokens.
 */
function montarHistoricoParaIA(
  arr: MensagemConversa[]
): Array<{ role: "user" | "assistant"; content: string }> {
  const fim: Array<{ role: "user" | "assistant"; content: string }> = []
  // Pega as últimas trocas (cada troca = 1 pergunta + 1 resposta = 2 itens)
  const slice = arr.slice(-(MAX_HISTORICO_TROCAS * 2))
  for (const m of slice) {
    if (m.tipo === "pergunta") {
      fim.push({
        role: "user",
        content: m.texto.slice(0, MAX_HISTORICO_MSG_LEN),
      })
    } else if (m.tipo === "resposta") {
      fim.push({
        role: "assistant",
        content: m.data.resposta.slice(0, MAX_HISTORICO_MSG_LEN),
      })
    }
    // mensagens "erro" são descartadas: não fazem parte da conversa válida
  }
  return fim
}

/**
 * Hook da AjudaInteligente.
 *
 * Mantém o estado do drawer (aberto/fechado), histórico da conversa
 * na sessão atual e expõe a função de fazer perguntas chamando a
 * Edge Function /ask do Supabase.
 *
 * Não persiste em localStorage por padrão (privacidade).
 */
export function useAjudaInteligente() {
  const [aberto, setAberto] = useState(false)
  const [contexto, setContexto] = useState<ContextoAjuda>({})
  const [mensagens, setMensagens] = useState<MensagemConversa[]>([])
  const [perguntando, setPerguntando] = useState(false)

  // Ref para a função perguntar atual, permitindo abrir() chamar
  // sem criar dependência circular nas declarações useCallback
  const perguntarRef = useRef<
    (pergunta: string, ctx?: ContextoAjuda) => Promise<void>
  >(async () => {})

  const abrir = useCallback(
    (ctx?: ContextoAjuda, perguntaInicial?: string) => {
      if (ctx) setContexto(ctx)
      setAberto(true)
      // Se veio com pergunta inicial, dispara automaticamente
      // (UX do toast "Posso ajudar?")
      if (perguntaInicial?.trim()) {
        setTimeout(() => perguntarRef.current(perguntaInicial.trim(), ctx), 100)
      }
    },
    []
  )

  const fechar = useCallback(() => {
    setAberto(false)
  }, [])

  const limpar = useCallback(() => {
    setMensagens([])
  }, [])

  const perguntar = useCallback(
    async (pergunta: string, ctx?: ContextoAjuda) => {
      const limpo = pergunta.trim()
      if (!limpo || perguntando) return

      const ctxFinal = { ...contexto, ...(ctx ?? {}) }

      // Snapshot do histórico ANTES de adicionar a pergunta atual.
      // Isso garante que o multi-turn vai pra Anthropic com as N trocas
      // anteriores como contexto, e a pergunta atual como nova "user".
      const historicoParaIA = montarHistoricoParaIA(mensagens)

      setMensagens((m) =>
        capMensagens([
          ...m,
          { tipo: "pergunta", texto: limpo, quando: new Date() },
        ])
      )
      setPerguntando(true)

      try {
        const { data, error } = await supabase.functions.invoke<RespostaIA>(
          "ask",
          {
            body: {
              pergunta: limpo,
              contexto: ctxFinal,
              historico: historicoParaIA,
            },
          }
        )

        if (error) {
          throw error
        }
        if (!data) {
          throw new Error("Resposta vazia")
        }

        // Sanitiza fontes (defesa em profundidade contra URLs inválidas)
        const dataSegura: RespostaIA = {
          ...data,
          fontes: sanitizarFontes(data.fontes ?? []),
        }

        setMensagens((m) =>
          capMensagens([
            ...m,
            { tipo: "resposta", data: dataSegura, quando: new Date() },
          ])
        )
      } catch (e) {
        setMensagens((m) =>
          capMensagens([
            ...m,
            {
              tipo: "erro",
              texto:
                e instanceof Error
                  ? e.message
                  : "Não foi possível obter resposta agora.",
              quando: new Date(),
            },
          ])
        )
      } finally {
        setPerguntando(false)
      }
    },
    [contexto, perguntando, mensagens]
  )

  // Sincroniza a ref com a função atual a cada render
  perguntarRef.current = perguntar

  return {
    aberto,
    contexto,
    mensagens,
    perguntando,
    abrir,
    fechar,
    limpar,
    perguntar,
  }
}
