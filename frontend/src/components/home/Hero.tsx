import { ArrowRight, Search, Sparkles } from "lucide-react"
import { Link } from "react-router-dom"

/**
 * Hero da home com identidade institucional do MA.
 *
 * Background: /images/hero-ma.svg (placeholder atual)
 *
 * Quando a equipe entregar a imagem fotográfica (ver IMAGENS_NECESSARIAS.md):
 *   1. Salvar como /images/hero-ma.webp
 *   2. Trocar a extensão na linha do <img> de .svg para .webp
 *   3. (opcional) Adicionar /images/hero-ma-mobile.webp via media-query
 */
export function Hero() {
  return (
    <section
      className="relative isolate overflow-hidden border-b border-border bg-primary text-primary-foreground"
      aria-labelledby="hero-titulo"
    >
      {/* Imagem de fundo (placeholder SVG, substituível por foto real) */}
      <img
        src="/images/hero-ma.svg"
        alt=""
        aria-hidden="true"
        className="absolute inset-0 -z-10 size-full object-cover"
      />

      <div className="container-page relative px-4 py-12 md:py-20">
        <span className="inline-flex items-center gap-1.5 rounded-full border border-secondary/40 bg-secondary/15 px-3 py-1 text-xs font-medium text-secondary">
          <Sparkles className="size-3.5" aria-hidden="true" />
          Hackathon Transparência Maranhense 2026
        </span>

        <h1
          id="hero-titulo"
          className="mt-5 max-w-3xl font-display text-4xl font-bold leading-[1.05] tracking-tight md:text-5xl lg:text-6xl"
        >
          O futuro Portal da Transparência do{" "}
          <span className="relative inline-block">
            <span className="relative z-10">Maranhão</span>
            <span
              className="absolute bottom-1 left-0 right-0 h-2 bg-secondary/50"
              aria-hidden="true"
            />
          </span>
        </h1>

        <p className="mt-5 max-w-2xl text-base leading-relaxed text-primary-foreground/85 md:text-lg">
          Construído para o cidadão maranhense. Do celular para o desktop, sem
          jargão e em até 3 passos.
        </p>

        <div className="mt-7 flex flex-wrap gap-3">
          <Link
            to="/busca"
            className="inline-flex items-center gap-2 rounded-md bg-secondary px-5 py-3 text-sm font-semibold text-secondary-foreground shadow-lg transition-colors hover:bg-secondary/90"
          >
            <Search className="size-4" aria-hidden="true" />
            Pesquisar no portal
          </Link>
          <a
            href="#eixos"
            className="inline-flex items-center gap-2 rounded-md border border-primary-foreground/30 bg-primary-foreground/10 px-5 py-3 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary-foreground/20"
          >
            Explorar áreas
            <ArrowRight className="size-4" aria-hidden="true" />
          </a>
        </div>
      </div>
    </section>
  )
}
