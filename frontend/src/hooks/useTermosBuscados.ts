import { useMemo } from "react"
import { TERMOS_BUSCADOS, type TermoBuscado } from "@/data/termos-buscados"

export type { TermoBuscado }

type State = {
  termos: TermoBuscado[]
  loading: boolean
  error: string | null
}

export function useTermosBuscados(limit = 12): State {
  const safeLimit = Math.min(Math.max(1, Math.floor(limit)), 50)

  const termos = useMemo(() => {
    return TERMOS_BUSCADOS.slice(0, safeLimit)
  }, [safeLimit])

  return {
    termos,
    loading: false,
    error: null,
  }
}
