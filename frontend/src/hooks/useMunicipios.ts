import { useEffect, useState } from "react"

export type Municipio = {
  id: number
  nome: string
}

let cache: Map<number, string> | null = null
let pending: Promise<Map<number, string>> | null = null

async function carregar(): Promise<Map<number, string>> {
  if (cache !== null) return cache
  if (pending !== null) return pending

  pending = (async () => {
    try {
      const res = await fetch("/geojson/municipios-ma.json")
      if (!res.ok) return new Map<number, string>()
      const data = (await res.json()) as Municipio[]
      const map = new Map<number, string>()
      for (const m of data) map.set(m.id, m.nome)
      cache = map
      return map
    } finally {
      pending = null
    }
  })()

  return pending
}

export function useMunicipios() {
  const [mapa, setMapa] = useState<Map<number, string>>(cache ?? new Map())
  const [loading, setLoading] = useState(cache === null)

  useEffect(() => {
    if (cache !== null) return
    let cancelled = false
    carregar().then((m) => {
      if (cancelled) return
      setMapa(m)
      setLoading(false)
    })
    return () => {
      cancelled = true
    }
  }, [])

  return { mapa, loading }
}
