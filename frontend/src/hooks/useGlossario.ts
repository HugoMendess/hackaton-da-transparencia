import { useEffect, useState } from "react"
import { supabase } from "@/lib/supabase"

export type Termo = {
  termo: string
  termo_normalizado: string
  explicacao_cidada: string
  exemplo: string | null
}

type State = {
  termos: Termo[]
  loading: boolean
}

let cache: Termo[] | null = null

export function useGlossario(): State {
  const [state, setState] = useState<State>({
    termos: cache ?? [],
    loading: cache === null,
  })

  useEffect(() => {
    if (cache !== null) return
    let cancelled = false

    supabase
      .from("glossario")
      .select("termo, termo_normalizado, explicacao_cidada, exemplo")
      .then(({ data, error }) => {
        if (cancelled) return
        if (error || !data) {
          setState({ termos: [], loading: false })
          return
        }
        cache = data
        setState({ termos: data, loading: false })
      })

    return () => {
      cancelled = true
    }
  }, [])

  return state
}
