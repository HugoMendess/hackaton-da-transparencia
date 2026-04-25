import { useState } from "react"
import { Search, Sparkles } from "lucide-react"
import { Header } from "@/components/layout/Header"
import { DashboardInicial } from "@/components/busca/DashboardInicial"
import { cn } from "@/lib/utils"

export function Busca() {
  const [query, setQuery] = useState("")
  const [submitted, setSubmitted] = useState("")

  function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    setSubmitted(query.trim())
  }

  function aplicarTermo(termo: string) {
    setQuery(termo)
    setSubmitted(termo)
  }

  return (
    <div className="min-h-svh bg-background text-foreground">
      <Header />

      <main>
        <section className="container py-6">
          <p className="text-sm text-muted-foreground">Busca em linguagem natural</p>
          <h1 className="mt-2 text-2xl font-semibold tracking-tight md:text-3xl">
            Pergunte ou digite o que você procura
          </h1>

          <form onSubmit={onSubmit} className="mt-4 flex gap-2" role="search" aria-label="Buscar no portal">
            <div className="relative flex-1">
              <Search
                className="pointer-events-none absolute left-3 top-1/2 size-5 -translate-y-1/2 text-muted-foreground"
                aria-hidden="true"
              />
              <input
                type="search"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                maxLength={500}
                placeholder="Ex: quanto foi gasto com merenda em São Luís este mês"
                aria-label="Termo ou pergunta"
                className={cn(
                  "h-12 w-full rounded-md border border-border bg-background pl-10 pr-3 text-base",
                  "placeholder:text-muted-foreground/70",
                  "focus-visible:border-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                )}
              />
            </div>
            <button
              type="submit"
              className="inline-flex h-12 items-center gap-2 rounded-md bg-primary px-4 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90 disabled:opacity-50"
              disabled={query.trim().length === 0}
            >
              <Sparkles className="size-4" aria-hidden="true" />
              <span>Buscar</span>
            </button>
          </form>

          {submitted && (
            <div className="mt-4 rounded-md border border-dashed border-border bg-muted/40 p-4">
              <p className="text-sm">
                <strong>Buscando:</strong>{" "}
                <span className="font-mono">{submitted}</span>
              </p>
              <p className="mt-1 text-xs text-muted-foreground">
                Carregando resultados...
              </p>
            </div>
          )}
        </section>

        <section className="container py-6">
          <DashboardInicial onTermoClick={aplicarTermo} />
        </section>
      </main>
    </div>
  )
}
