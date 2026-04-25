import { Header } from "@/components/layout/Header"
import { Footer } from "@/components/layout/Footer"
import { BottomNav } from "@/components/layout/BottomNav"
import { MapaMA } from "@/components/mapa/MapaMA"
import { Map as MapIcon } from "lucide-react"

export function Mapa() {
  return (
    <div className="min-h-svh bg-background text-foreground pb-16 md:pb-0">
      <a href="#main" className="skip-link">Pular para o conteúdo</a>
      <Header />

      <main id="main">
        <section className="border-b border-border bg-gradient-to-b from-accent/30 via-background to-background">
          <div className="container-page px-4 py-8">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-primary/20 bg-primary/5 px-3 py-1 text-xs font-medium text-primary">
              <MapIcon className="size-3.5" aria-hidden="true" />
              Mapa do Maranhão
            </span>

            <h1 className="mt-3 font-display text-3xl font-bold tracking-tight md:text-4xl">
              Veja o lugar onde você mora
            </h1>
            <p className="mt-2 max-w-2xl text-sm leading-relaxed text-muted-foreground md:text-base">
              217 municípios maranhenses. Toque no mapa para ver os números
              consolidados do seu município: gasto público, obras ativas e
              servidores em exercício.
            </p>
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
