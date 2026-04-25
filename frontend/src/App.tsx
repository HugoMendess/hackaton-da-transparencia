import { useEffect, useState } from "react"
import { Header } from "@/components/layout/Header"
import { EixoGrid } from "@/components/eixos/EixoGrid"
import { supabase } from "@/lib/supabase"

export default function App() {
  const [supabaseStatus, setSupabaseStatus] = useState<
    "verificando" | "ok" | "erro"
  >("verificando")

  useEffect(() => {
    supabase
      .from("eixos")
      .select("id", { count: "exact", head: true })
      .then(({ error }) => {
        if (error && error.code !== "42P01") {
          setSupabaseStatus("erro")
          return
        }
        setSupabaseStatus("ok")
      })
  }, [])

  return (
    <div className="min-h-svh bg-background text-foreground">
      <Header />

      <main>
        <section className="container py-8">
          <p className="text-sm text-muted-foreground">
            Hackathon da Transparência Maranhense 2026
          </p>
          <h1 className="mt-2 text-3xl font-semibold tracking-tight md:text-4xl">
            O futuro Portal da Transparência do Maranhão
          </h1>
          <p className="mt-3 max-w-2xl text-base text-muted-foreground md:text-lg">
            Construído para o cidadão, do celular para o desktop, sem jargão e
            em até 3 passos.
          </p>
        </section>

        <EixoGrid />

        <section className="container py-6">
          <div className="rounded-lg border border-dashed border-border p-4 text-sm text-muted-foreground">
            <strong>Status do setup:</strong>{" "}
            {supabaseStatus === "verificando" && "verificando conexão Supabase..."}
            {supabaseStatus === "ok" && "Supabase conectado ✅"}
            {supabaseStatus === "erro" && "erro ao conectar com Supabase ⚠️"}
          </div>
        </section>
      </main>
    </div>
  )
}
