import { useEffect } from "react"
import { useLocation } from "react-router-dom"

/**
 * Faz scroll para o topo a cada mudança de rota.
 *
 * Coloque uma única vez dentro do <BrowserRouter>, antes das <Routes>.
 * Sem isso, ao navegar de uma página rolada para outra, a nova página
 * herda a posição de scroll da anterior.
 *
 * Respeita prefers-reduced-motion: usa "instant" para evitar animação
 * indesejada para usuários com sensibilidade a movimento.
 */
export function ScrollToTop() {
  const { pathname, hash } = useLocation()

  useEffect(() => {
    if (hash) {
      // Hash navigation: o elemento alvo pode ainda não estar no DOM
      // (cenário "Começar Aqui" vindo de outra rota). requestAnimationFrame
      // garante que o React montou tudo antes de tentar scroll.
      const id = hash.slice(1)
      requestAnimationFrame(() => {
        const el = document.getElementById(id)
        if (el) {
          el.scrollIntoView({ behavior: "smooth", block: "start" })
        } else {
          window.scrollTo({ top: 0, left: 0, behavior: "instant" })
        }
      })
      return
    }

    window.scrollTo({ top: 0, left: 0, behavior: "instant" })
  }, [pathname, hash])

  return null
}
