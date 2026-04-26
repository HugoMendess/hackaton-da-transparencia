import { useCallback, useEffect, useState } from "react"

const STORAGE_KEY = "portal-transparencia:busca:historico"
const MAX_ITEMS = 5

/**
 * Hook que mantém as últimas 5 buscas do cidadão em localStorage.
 * Sem PII: apenas o texto digitado é salvo. Não envia para servidor.
 */
export function useBuscaHistorico() {
  const [historico, setHistorico] = useState<string[]>([])

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY)
      if (raw) {
        const parsed = JSON.parse(raw) as unknown
        if (Array.isArray(parsed)) {
          setHistorico(parsed.filter((x): x is string => typeof x === "string"))
        }
      }
    } catch {
      // Storage indisponível (modo privado, quota), apenas ignora
    }
  }, [])

  const adicionar = useCallback((termo: string) => {
    const limpo = termo.trim()
    if (!limpo) return
    setHistorico((prev) => {
      const semDuplicata = prev.filter(
        (t) => t.toLowerCase() !== limpo.toLowerCase()
      )
      const novo = [limpo, ...semDuplicata].slice(0, MAX_ITEMS)
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(novo))
      } catch {
        // ignora
      }
      return novo
    })
  }, [])

  const remover = useCallback((termo: string) => {
    setHistorico((prev) => {
      const novo = prev.filter((t) => t !== termo)
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(novo))
      } catch {
        // ignora
      }
      return novo
    })
  }, [])

  const limpar = useCallback(() => {
    setHistorico([])
    try {
      localStorage.removeItem(STORAGE_KEY)
    } catch {
      // ignora
    }
  }, [])

  return { historico, adicionar, remover, limpar }
}
