import { ArrowRight, Search, Sparkles } from "lucide-react"
import { Link } from "react-router-dom"
import { BarraInstitucional } from "@/components/layout/BarraInstitucional"

/**
 * Hero da home com identidade institucional MA.
 *
 * Composição em camadas (z-index):
 *  -30  Foto do palácio (background, object-cover, dessaturado)
 *  -20  Overlay azul primário com mix-blend-multiply (unifica)
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
      className="relative isolate overflow-hidden bg-primary text-primary-foreground"
      aria-labelledby="hero-titulo"
    >
      {/* Camada -30: foto do palácio quase natural (mantém a beleza institucional) */}
      <img
        src="/images/palacio.png"
        alt=""
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-30 size-full object-cover object-center"
        style={{
          filter: "saturate(0.95) brightness(0.92) contrast(1.05)",
        }}
      />

      {/* Camada -20: overlay preto com gradiente horizontal esquerda → direita.
          Lado esquerdo bem escuro (legibilidade do título e descrição).
          Lado direito quase limpo (palácio aparece com força). */}
      <div
        className="pointer-events-none absolute inset-0 -z-20"
        style={{
          background:
            "linear-gradient(90deg, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0.70) 30%, rgba(0,0,0,0.45) 60%, rgba(0,0,0,0.15) 100%)",
        }}
        aria-hidden="true"
      />

      {/* Camada -10: gradiente preto suave apenas no rodapé (legibilidade dos CTAs
          sem cobrir o tom natural da foto) */}
      <div
        className="pointer-events-none absolute inset-0 -z-10"
        style={{
          background:
            "linear-gradient(180deg, transparent 0%, transparent 50%, rgba(0,0,0,0.25) 85%, rgba(0,0,0,0.45) 100%)",
        }}
        aria-hidden="true"
      />

      {/* Camada 0: pinceladas como faixa superior largura total
          com fade de cima (opaco) para baixo (transparente) */}
      <div
        className="pointer-events-none absolute inset-0 z-0"
        data-decorative-bg="true"
        style={{
          backgroundImage: "url('/images/fundo-identidade.png')",
          backgroundSize: "cover",
          backgroundPosition: "center top",
          backgroundRepeat: "no-repeat",
          opacity: 0.55,
          mixBlendMode: "screen",
          maskImage:
            "linear-gradient(to bottom, black 0%, black 25%, transparent 75%)",
          WebkitMaskImage:
            "linear-gradient(to bottom, black 0%, black 25%, transparent 75%)",
        }}
        aria-hidden="true"
      />

      {/* Camada 1: padrão geométrico SVG (sutil) */}
      <DecoracaoHero />

      {/* Camada 10: conteúdo */}
      <div className="container-page relative z-10 px-4 py-20 md:py-28">
        <span
          data-badge-hero="true"
          className="inline-flex items-center gap-2 rounded-full border border-secondary/50 bg-black/30 px-3.5 py-1.5 text-xs font-semibold uppercase tracking-wider text-primary-foreground shadow-lg ring-1 ring-white/10 backdrop-blur-md"
        >
          <Sparkles className="size-3.5 text-secondary" aria-hidden="true" />
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
              data-marca-titulo="true"
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
            data-cta-hero="primario"
            className="group inline-flex items-center gap-2 rounded-lg bg-gradient-to-br from-secondary to-secondary/85 px-5 py-3 text-sm font-semibold text-secondary-foreground shadow-[0_4px_8px_rgba(217,161,35,0.30),_0_12px_28px_-6px_rgba(217,161,35,0.50)] ring-1 ring-secondary/40 transition-all duration-300 ease-out hover:-translate-y-0.5 hover:shadow-[0_6px_12px_rgba(217,161,35,0.35),_0_18px_36px_-6px_rgba(217,161,35,0.60)]"
          >
            <Search className="size-4 transition-transform duration-300 group-hover:scale-110" aria-hidden="true" />
            Pesquisar no portal
          </Link>
          <a
            href="#eixos"
            className="group inline-flex items-center gap-2 rounded-lg border border-primary-foreground/30 bg-primary-foreground/10 px-5 py-3 text-sm font-semibold text-primary-foreground shadow-md backdrop-blur-md transition-all duration-300 ease-out hover:-translate-y-0.5 hover:border-primary-foreground/50 hover:bg-primary-foreground/20 hover:shadow-lg"
          >
            Explorar áreas
            <ArrowRight className="size-4 transition-transform duration-300 group-hover:translate-x-1" aria-hidden="true" />
          </a>
        </div>
      </div>

      {/* Barra colorida institucional como acabamento do hero */}
      <BarraInstitucional className="relative z-10 h-2" />
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
