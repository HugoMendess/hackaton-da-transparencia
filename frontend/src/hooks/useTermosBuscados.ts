import { useEffect, useState } from "react"
import { supabase } from "@/lib/supabase"

export type TermoBuscado = {
  termo: string
  total_buscas: number
}

type State = {
  termos: TermoBuscado[]
  loading: boolean
  error: string | null
}

export function useTermosBuscados(limit = 12) {
  const [state, setState] = useState<State>({
    termos: [],
    loading: true,
    error: null,
  })

  useEffect(() => {
    let cancelled = false

    supabase
      .from("termos_buscados")
      .select("termo, total_buscas")
      .eq("bloqueado", false)
      .order("total_buscas", { ascending: false })
      .limit(limit)
      .then(({ data, error }) => {
        if (cancelled) return
        if (error) {
          setState({ termos: [], loading: false, error: error.message })
          return
        }
        setState({ termos: data ?? [], loading: false, error: null })
      })

    return () => {
      cancelled = true
    }
  }, [limit])

  return state
}
