import { useCallback, useState } from "react"
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

  const abrir = useCallback((ctx?: ContextoAjuda) => {
    if (ctx) setContexto(ctx)
    setAberto(true)
  }, [])

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

      setMensagens((m) => [
        ...m,
        { tipo: "pergunta", texto: limpo, quando: new Date() },
      ])
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

        setMensagens((m) => [
          ...m,
          { tipo: "resposta", data, quando: new Date() },
        ])
      } catch (e) {
        setMensagens((m) => [
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
      } finally {
        setPerguntando(false)
      }
    },
    [contexto, perguntando]
  )

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
