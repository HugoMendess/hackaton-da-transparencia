import { Header } from "@/components/layout/Header"
import { Footer } from "@/components/layout/Footer"
import { BottomNav } from "@/components/layout/BottomNav"
import { EixoGrid } from "@/components/eixos/EixoGrid"
import { Hero } from "@/components/home/Hero"
import { MetricasDestaque } from "@/components/home/MetricasDestaque"

export default function App() {
  return (
    <div className="min-h-svh bg-background text-foreground pb-16 md:pb-0">
      <a href="#main" className="skip-link">Pular para o conteúdo</a>
      <Header />

      <main id="main">
        <Hero />
        <MetricasDestaque />

        <div id="eixos">
          <EixoGrid />
        </div>
      </main>

      <Footer />
      <BottomNav />
    </div>
  )
}
