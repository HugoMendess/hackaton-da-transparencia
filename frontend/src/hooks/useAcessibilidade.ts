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
 * Lê do localStorage no first render (lazy initial state) para evitar
 * flash sem estilo. O script inline em index.html aplica as classes
 * ANTES do React montar, garantindo persistência entre navegações.
 *
 * Quando uma instância muda config, dispara CustomEvent para outras
 * instâncias do hook reagirem (ex: Header e BottomNav exibirem o
 * mesmo estado em sincronia).
 */
const EVENTO_MUDANCA = "transparama:a11y:changed"

export function useAcessibilidade() {
  // Lazy initial state: lê localStorage no primeiro render, sem flash
  const [config, setConfig] = useState<ConfigA11y>(() => carregar())

  // Aplica e salva sempre que mudar (não roda com PADRAO antes de carregar)
  useEffect(() => {
    aplicar(config)
    salvar(config)
    // Notifica outras instâncias do hook que houve mudança
    window.dispatchEvent(
      new CustomEvent<ConfigA11y>(EVENTO_MUDANCA, { detail: config })
    )
  }, [config])

  // Sincroniza com mudanças de outras instâncias (multi-componente)
  useEffect(() => {
    function onMudanca(e: Event) {
      const detail = (e as CustomEvent<ConfigA11y>).detail
      if (!detail) return
      setConfig((atual) => {
        // Evita re-render se for o mesmo objeto
        if (
          atual.altoContraste === detail.altoContraste &&
          atual.fonte === detail.fonte &&
          atual.reduzirMovimento === detail.reduzirMovimento
        ) {
          return atual
        }
        return detail
      })
    }
    window.addEventListener(EVENTO_MUDANCA, onMudanca)
    return () => window.removeEventListener(EVENTO_MUDANCA, onMudanca)
  }, [])

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
