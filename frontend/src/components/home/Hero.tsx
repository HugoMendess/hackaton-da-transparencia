import { ArrowRight, Search, Sparkles } from "lucide-react"
import { Link } from "react-router-dom"

/**
 * Hero da home com identidade institucional MA.
 *
 * Composição em camadas (z-index):
 *  -30  Foto do palácio (background, object-cover, dessaturado)
 *  -20  Overlay verde primário com mix-blend-multiply (unifica)
 *  -10  Gradiente vertical para legibilidade do texto
 *    0  Pinceladas (fundo-identidade.png) como acento decorativo
 *       no canto superior direito, opacity baixa
 *    1  Padrão geométrico SVG (sobreposto sutil)
 *   10  Conteúdo (título, descrição, CTAs)
 *
 * As imagens estão em /images/palacio.png e /images/fundo-identidade.png.
 * Substituíveis sem alterar este componente, basta sobrescrever os arquivos.
 */
export function Hero() {
  return (
    <section
      className="relative isolate overflow-hidden border-b border-border bg-primary text-primary-foreground"
      aria-labelledby="hero-titulo"
    >
      {/* Camada -30: foto do palácio */}
      <img
        src="/images/palacio.png"
        alt=""
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-30 size-full object-cover object-center"
        style={{
          filter: "saturate(0.6) brightness(0.7) contrast(1.05)",
        }}
      />

      {/* Camada -20: overlay verde primário (mix-blend-multiply unifica com a foto) */}
      <div
        className="pointer-events-none absolute inset-0 -z-20 bg-primary"
        style={{ mixBlendMode: "multiply", opacity: 0.85 }}
        aria-hidden="true"
      />

      {/* Camada -10: gradiente vertical para legibilidade do texto */}
      <div
        className="pointer-events-none absolute inset-0 -z-10"
        style={{
          background:
            "linear-gradient(180deg, hsl(var(--primary) / 0.55) 0%, hsl(var(--primary) / 0.4) 50%, hsl(var(--primary) / 0.85) 100%)",
        }}
        aria-hidden="true"
      />

      {/* Camada 0: pinceladas como acento decorativo (canto direito) */}
      <img
        src="/images/fundo-identidade.png"
        alt=""
        aria-hidden="true"
        className="pointer-events-none absolute -right-10 -top-6 z-0 h-48 w-auto opacity-25 sm:-right-4 sm:h-64 md:h-80"
        style={{
          mixBlendMode: "screen",
          maskImage:
            "radial-gradient(ellipse at top right, black 30%, transparent 75%)",
          WebkitMaskImage:
            "radial-gradient(ellipse at top right, black 30%, transparent 75%)",
        }}
      />

      {/* Camada 1: padrão geométrico SVG (sutil) */}
      <DecoracaoHero />

      {/* Camada 10: conteúdo */}
      <div className="container-page relative z-10 px-4 py-12 md:py-20">
        <span className="inline-flex items-center gap-1.5 rounded-full border border-secondary/40 bg-secondary/15 px-3 py-1 text-xs font-medium text-secondary backdrop-blur-sm">
          <Sparkles className="size-3.5" aria-hidden="true" />
          Hackathon Transparência Maranhense 2026
        </span>

        <h1
          id="hero-titulo"
          className="mt-5 max-w-3xl font-display text-4xl font-bold leading-[1.05] tracking-tight md:text-5xl lg:text-6xl"
          style={{ textShadow: "0 2px 8px rgba(0, 0, 0, 0.25)" }}
        >
          O futuro Portal da Transparência do{" "}
          <span className="relative inline-block">
            <span className="relative z-10">Maranhão</span>
            <span
              className="absolute bottom-1 left-0 right-0 h-2 bg-secondary/60"
              aria-hidden="true"
            />
          </span>
        </h1>

        <p
          className="mt-5 max-w-2xl text-base leading-relaxed text-primary-foreground/95 md:text-lg"
          style={{ textShadow: "0 1px 4px rgba(0, 0, 0, 0.25)" }}
        >
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
            className="inline-flex items-center gap-2 rounded-md border border-primary-foreground/30 bg-primary-foreground/10 px-5 py-3 text-sm font-semibold text-primary-foreground backdrop-blur-sm transition-colors hover:bg-primary-foreground/20"
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
 * Padrão geométrico decorativo (linhas finas) sobreposto a tudo.
 */
function DecoracaoHero() {
  return (
    <>
      <svg
        className="pointer-events-none absolute inset-0 z-0 h-full w-full text-primary-foreground/[0.05]"
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
        className="pointer-events-none absolute -bottom-20 -left-20 size-72 rounded-full bg-primary-foreground/5 blur-3xl"
        aria-hidden="true"
      />
    </>
  )
}
