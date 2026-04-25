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

function sanitizarFontes(fontes: Fonte[]): Fonte[] {
  return fontes.filter((f) => {
    if (!f.url || typeof f.url !== "string") return false
    // Aceita apenas https, http (gov.br pode estar sem TLS) e paths internos
    return (
      f.url.startsWith("https://") ||
      f.url.startsWith("http://") ||
      f.url.startsWith("/")
    )
  })
}

/** Mantém o histórico limitado a MAX_MENSAGENS, descartando o início */
function capMensagens(arr: MensagemConversa[]): MensagemConversa[] {
  return arr.length > MAX_MENSAGENS ? arr.slice(-MAX_MENSAGENS) : arr
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
            body: { pergunta: limpo, contexto: ctxFinal },
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
    [contexto, perguntando]
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
