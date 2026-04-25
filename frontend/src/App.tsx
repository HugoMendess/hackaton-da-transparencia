import { useEffect, useState } from "react"
import { Header } from "@/components/layout/Header"
import { Footer } from "@/components/layout/Footer"
import { BottomNav } from "@/components/layout/BottomNav"
import { EixoGrid } from "@/components/eixos/EixoGrid"
import { Hero } from "@/components/home/Hero"
import { MetricasDestaque } from "@/components/home/MetricasDestaque"
import { supabase } from "@/lib/supabase"
import { cn } from "@/lib/utils"

type SupabaseStatus = "verificando" | "ok" | "erro"

export default function App() {
  const [supabaseStatus, setSupabaseStatus] = useState<SupabaseStatus>("verificando")

  useEffect(() => {
    let cancelled = false
    supabase
      .from("eixos")
      .select("id", { count: "exact", head: true })
      .then(({ error }) => {
        if (cancelled) return
        setSupabaseStatus(error && error.code !== "42P01" ? "erro" : "ok")
      })
    return () => {
      cancelled = true
    }
  }, [])

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

        <section className="container-page px-4 pb-10">
          <div
            className={cn(
              "rounded-md border p-3 text-xs",
              supabaseStatus === "ok"
                ? "border-success/30 bg-success/5 text-success"
                : supabaseStatus === "erro"
                ? "border-destructive/30 bg-destructive/5 text-destructive"
                : "border-border bg-muted/50 text-muted-foreground"
            )}
            role="status"
            aria-live="polite"
          >
            {supabaseStatus === "verificando" && "Verificando conexão com a base de dados..."}
            {supabaseStatus === "ok" && "Base de dados conectada e operando."}
            {supabaseStatus === "erro" && "Erro ao conectar à base de dados, alguns dados podem não aparecer."}
          </div>
        </section>
      </main>

      <Footer />
      <BottomNav />
    </div>
  )
}
