import { createContext, useContext, type ReactNode } from "react"
import {
  useAjudaInteligente,
  type ContextoAjuda,
  type MensagemConversa,
} from "@/hooks/useAjudaInteligente"

type AjudaCtx = {
  aberto: boolean
  contexto: ContextoAjuda
  mensagens: MensagemConversa[]
  perguntando: boolean
  abrir: (ctx?: ContextoAjuda) => void
  fechar: () => void
  limpar: () => void
  perguntar: (pergunta: string, ctx?: ContextoAjuda) => Promise<void>
}

const Ctx = createContext<AjudaCtx | null>(null)

export function AjudaInteligenteProvider({
  children,
}: {
  children: ReactNode
}) {
  const value = useAjudaInteligente()
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>
}

/**
 * Hook para acessar o estado global da AjudaInteligente.
 * Permite abrir/fechar o drawer e fazer perguntas de qualquer página.
 */
export function useAjudaInteligenteContext(): AjudaCtx {
  const v = useContext(Ctx)
  if (!v) {
    throw new Error(
      "useAjudaInteligenteContext deve ser usado dentro de <AjudaInteligenteProvider>"
    )
  }
  return v
}
