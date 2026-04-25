import { useCallback, useEffect, useState } from "react"

const STORAGE_KEY = "transparama:a11y"

export type ConfigA11y = {
  altoContraste: boolean
  fonte: 0 | 1 | 2 // 0 = normal, 1 = +10%, 2 = +20%
  reduzirMovimento: boolean
}

const PADRAO: ConfigA11y = {
  altoContraste: false,
  fonte: 0,
  reduzirMovimento: false,
}

const CLASSES_FONTE = ["", "font-size-larger", "font-size-larger-2"] as const

function aplicar(config: ConfigA11y) {
  if (typeof document === "undefined") return
  const html = document.documentElement
  html.classList.toggle("high-contrast", config.altoContraste)
  html.classList.toggle("reduce-motion", config.reduzirMovimento)
  // Remove qualquer classe de fonte e aplica a atual
  html.classList.remove("font-size-larger", "font-size-larger-2")
  const cls = CLASSES_FONTE[config.fonte]
  if (cls) html.classList.add(cls)
}

function carregar(): ConfigA11y {
  if (typeof localStorage === "undefined") return PADRAO
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return PADRAO
    const parsed = JSON.parse(raw) as Partial<ConfigA11y>
    return {
      altoContraste: Boolean(parsed.altoContraste),
      fonte: ([0, 1, 2] as const).includes(parsed.fonte as 0 | 1 | 2)
        ? (parsed.fonte as 0 | 1 | 2)
        : 0,
      reduzirMovimento: Boolean(parsed.reduzirMovimento),
    }
  } catch {
    return PADRAO
  }
}

function salvar(config: ConfigA11y) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(config))
  } catch {
    // Storage indisponível, ignora
  }
}

/**
 * Hook que mantém preferências de acessibilidade do cidadão.
 * Aplica classes no <html> e persiste em localStorage.
 *
 * Usar uma única vez na raiz da app para sincronização entre páginas.
 */
export function useAcessibilidade() {
  const [config, setConfig] = useState<ConfigA11y>(PADRAO)

  // Carrega config ao montar e aplica
  useEffect(() => {
    const inicial = carregar()
    setConfig(inicial)
    aplicar(inicial)
  }, [])

  // Aplica e salva sempre que mudar
  useEffect(() => {
    aplicar(config)
    salvar(config)
  }, [config])

  const toggleAltoContraste = useCallback(() => {
    setConfig((c) => ({ ...c, altoContraste: !c.altoContraste }))
  }, [])

  const ajustarFonte = useCallback((delta: 1 | -1) => {
    setConfig((c) => {
      const novo = c.fonte + delta
      const valido = Math.max(0, Math.min(2, novo)) as 0 | 1 | 2
      return { ...c, fonte: valido }
    })
  }, [])

  const setFonte = useCallback((fonte: 0 | 1 | 2) => {
    setConfig((c) => ({ ...c, fonte }))
  }, [])

  const toggleReduzirMovimento = useCallback(() => {
    setConfig((c) => ({ ...c, reduzirMovimento: !c.reduzirMovimento }))
  }, [])

  const restaurar = useCallback(() => {
    setConfig(PADRAO)
  }, [])

  return {
    config,
    toggleAltoContraste,
    ajustarFonte,
    setFonte,
    toggleReduzirMovimento,
    restaurar,
  }
}
