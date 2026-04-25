import { useEffect, useState } from "react"
import { ArrowRight, Search, Sparkles } from "lucide-react"
import { Link } from "react-router-dom"
import { Header } from "@/components/layout/Header"
import { EixoGrid } from "@/components/eixos/EixoGrid"
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
    <div className="min-h-svh bg-background text-foreground">
      <a href="#main" className="skip-link">Pular para o conteúdo</a>
      <Header />

      <main id="main">
        <section className="border-b border-border bg-gradient-to-b from-accent/30 via-background to-background">
          <div className="container-page px-4 py-10 md:py-14">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-primary/20 bg-primary/5 px-3 py-1 text-xs font-medium text-primary">
              <Sparkles className="size-3.5" aria-hidden="true" />
              Hackathon da Transparência Maranhense 2026
            </span>

            <h1 className="mt-4 max-w-3xl text-3xl font-semibold tracking-tight text-foreground md:text-4xl lg:text-5xl">
              O futuro Portal da Transparência do{" "}
              <span className="text-primary">Maranhão</span>
            </h1>

            <p className="mt-4 max-w-2xl text-base leading-relaxed text-muted-foreground md:text-lg">
              Construído para o cidadão, do celular para o desktop, sem jargão e
              em até 3 passos.
            </p>

            <div className="mt-6 flex flex-wrap gap-3">
              <Link
                to="/busca"
                className="inline-flex items-center gap-2 rounded-md bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground shadow-sm transition-colors hover:bg-primary/90 focus-visible:bg-primary/90"
              >
                <Search className="size-4" aria-hidden="true" />
                Pesquisar no portal
              </Link>
              <a
                href="#eixos"
                className="inline-flex items-center gap-2 rounded-md border border-border bg-background px-4 py-2.5 text-sm font-medium text-foreground transition-colors hover:bg-muted"
              >
                Ver áreas
                <ArrowRight className="size-4" aria-hidden="true" />
              </a>
            </div>
          </div>
        </section>

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
    </div>
  )
}
