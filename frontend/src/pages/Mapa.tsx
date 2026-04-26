import { Header } from "@/components/layout/Header"
import { Footer } from "@/components/layout/Footer"
import { BottomNav } from "@/components/layout/BottomNav"
import { MapaMA } from "@/components/mapa/MapaMA"
import { Map as MapIcon, MousePointer2, Search } from "lucide-react"

export function Mapa() {
  return (
    <div className="min-h-svh bg-background text-foreground pb-16 md:pb-0">
      <a href="#main" className="skip-link">Pular para o conteúdo</a>
      <Header />

      <main id="main">
        <section className="relative overflow-hidden border-b border-border bg-gradient-to-b from-accent/40 via-background to-background">
          {/* Glow azul decorativo */}
          <span
            aria-hidden="true"
            className="pointer-events-none absolute -right-24 -top-16 size-72 rounded-full bg-primary/10 blur-3xl"
          />

          <div className="container-page relative px-4 py-8">
            <span
              className="inline-flex items-center gap-1.5 rounded-full border border-primary/30 bg-primary/10 px-3 py-1 text-xs font-bold uppercase tracking-wider text-primary shadow-sm"
              data-badge-hero-mapa="true"
            >
              <MapIcon className="size-3.5" aria-hidden="true" />
              Mapa do Maranhão
            </span>

            <h1 className="mt-4 font-display text-3xl font-bold tracking-tight md:text-4xl">
              Veja o lugar onde você mora
            </h1>
            <p className="mt-2 max-w-2xl text-sm leading-relaxed text-muted-foreground md:text-base">
              217 municípios maranhenses. Toque no mapa para ver os números
              consolidados do seu município, ou use o filtro de cidade ao
              lado para selecionar diretamente pelo nome.
            </p>

            {/* Dicas de uso */}
            <ul className="mt-4 flex flex-wrap gap-2 text-xs">
              <li className="inline-flex items-center gap-1.5 rounded-full border border-border/70 bg-card px-2.5 py-1 text-muted-foreground">
                <MousePointer2 className="size-3.5 text-primary" aria-hidden="true" />
                <span>Toque em um município no mapa</span>
              </li>
              <li className="inline-flex items-center gap-1.5 rounded-full border border-border/70 bg-card px-2.5 py-1 text-muted-foreground">
                <Search className="size-3.5 text-primary" aria-hidden="true" />
                <span>Ou busque pelo nome no painel ao lado</span>
              </li>
            </ul>
          </div>
        </section>

        <section className="container-page px-4 py-6">
          <MapaMA />
        </section>
      </main>

      <Footer />
      <BottomNav />
    </div>
  )
}
