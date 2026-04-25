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
let pending: Promise<Termo[]> | null = null

async function carregarGlossario(): Promise<Termo[]> {
  if (cache !== null) return cache
  if (pending !== null) return pending

  pending = (async () => {
    try {
      const { data, error } = await supabase
        .from("glossario")
        .select("termo, termo_normalizado, explicacao_cidada, exemplo")

      if (error || !data) return []
      cache = data
      return data
    } finally {
      pending = null
    }
  })()

  return pending
}

export function useGlossario(): State {
  const [state, setState] = useState<State>({
    termos: cache ?? [],
    loading: cache === null,
  })

  useEffect(() => {
    if (cache !== null) return
    let cancelled = false

    carregarGlossario().then((termos) => {
      if (cancelled) return
      setState({ termos, loading: false })
    })

    return () => {
      cancelled = true
    }
  }, [])

  return state
}
