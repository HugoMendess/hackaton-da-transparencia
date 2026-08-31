import { useState } from "react"
import { GLOSSARIO_TERMOS, type TermoGlossario } from "@/data/glossario"

export type Termo = TermoGlossario

type State = {
  termos: Termo[]
  loading: boolean
}

export function useGlossario(): State {
  const [state] = useState<State>({
    termos: GLOSSARIO_TERMOS,
    loading: false,
  })

  return state
}
