import { ArrowRight, Search, Sparkles } from "lucide-react"
import { Link } from "react-router-dom"

/**
 * Hero da home com identidade institucional do MA.
 *
 * Quando a equipe gerar a imagem hero (ver IMAGENS_NECESSARIAS.md),
 * substituir o background gradient por url("/hero-ma.webp") via CSS
 * vars. Por enquanto, padrão geométrico SVG inline mantém a estética
 * mesmo sem assets externos.
 */
export function Hero() {
  return (
    <section
      className="relative overflow-hidden border-b border-border bg-primary text-primary-foreground"
      aria-labelledby="hero-titulo"
    >
      {/* Padrão geométrico decorativo (substituível por imagem futura) */}
      <DecoracaoHero />

      <div className="container-page relative z-10 px-4 py-12 md:py-20">
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

/**
 * Decoração geométrica do hero. Linhas finas inspiradas em padrão
 * institucional. Sem dependência de assets externos.
 */
function DecoracaoHero() {
  return (
    <>
      <svg
        className="pointer-events-none absolute inset-0 z-0 h-full w-full text-primary-foreground/[0.06]"
        aria-hidden="true"
      >
        <defs>
          <pattern
            id="padrao-hero"
            x="0"
            y="0"
            width="48"
            height="48"
            patternUnits="userSpaceOnUse"
          >
            <path
              d="M 48 0 L 0 0 0 48"
              fill="none"
              stroke="currentColor"
              strokeWidth="1"
            />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#padrao-hero)" />
      </svg>
      <div
        className="pointer-events-none absolute -right-32 -top-32 size-96 rounded-full bg-secondary/10 blur-3xl"
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute -left-32 bottom-0 size-72 rounded-full bg-primary-foreground/5 blur-3xl"
        aria-hidden="true"
      />
    </>
  )
}
