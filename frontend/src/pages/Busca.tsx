import { useState } from "react"
import { Search, Sparkles, Loader2 } from "lucide-react"
import { Header } from "@/components/layout/Header"
import { Footer } from "@/components/layout/Footer"
import { BottomNav } from "@/components/layout/BottomNav"
import { DashboardInicial } from "@/components/busca/DashboardInicial"
import { cn } from "@/lib/utils"

export function Busca() {
  const [query, setQuery] = useState("")
  const [submitted, setSubmitted] = useState("")
  const [searching, setSearching] = useState(false)

  function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    const value = query.trim()
    if (!value) return
    setSubmitted(value)
    setSearching(true)
    // Stub: integração real virá com a AjudaInteligente
    setTimeout(() => setSearching(false), 700)
  }

  function aplicarTermo(termo: string) {
    setQuery(termo)
    setSubmitted(termo)
    setSearching(true)
    setTimeout(() => setSearching(false), 700)
  }

  return (
    <div className="min-h-svh bg-background text-foreground pb-16 md:pb-0">
      <a href="#main" className="skip-link">Pular para o conteúdo</a>
      <Header />

      <main id="main">
        <section className="border-b border-border bg-gradient-to-b from-accent/30 via-background to-background">
          <div className="container-page px-4 py-8 md:py-10">
            <span className="text-xs font-medium uppercase tracking-wider text-primary">
              Busca em linguagem natural
            </span>
            <h1 className="mt-2 text-2xl font-semibold tracking-tight md:text-3xl">
              O que você procura no portal?
            </h1>
            <p className="mt-2 max-w-xl text-sm leading-relaxed text-muted-foreground md:text-base">
              Pergunte como você falaria com outra pessoa. Nada de termos técnicos.
            </p>

            <form
              onSubmit={onSubmit}
              role="search"
              aria-label="Buscar no portal"
              className="mt-5 flex flex-col gap-2 sm:flex-row"
            >
              <label htmlFor="campo-busca" className="sr-only">
                Termo ou pergunta
              </label>
              <div className="relative flex-1">
                <Search
                  className="pointer-events-none absolute left-3 top-1/2 size-5 -translate-y-1/2 text-muted-foreground"
                  aria-hidden="true"
                />
                <input
                  id="campo-busca"
                  type="search"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  maxLength={500}
                  autoComplete="off"
                  placeholder="Ex: quanto foi gasto com merenda em São Luís este mês"
                  className={cn(
                    "h-12 w-full rounded-md border border-border bg-background pl-10 pr-3 text-base text-foreground",
                    "placeholder:text-muted-foreground/60",
                    "transition-colors duration-200",
                    "focus-visible:border-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                  )}
                />
              </div>
              <button
                type="submit"
                disabled={query.trim().length === 0 || searching}
                className={cn(
                  "inline-flex h-12 items-center justify-center gap-2 rounded-md px-4 text-sm font-medium transition-colors duration-200",
                  "bg-primary text-primary-foreground hover:bg-primary/90",
                  "disabled:opacity-50 disabled:hover:bg-primary"
                )}
              >
                {searching ? (
                  <Loader2 className="size-4 animate-spin" aria-hidden="true" />
                ) : (
                  <Sparkles className="size-4" aria-hidden="true" />
                )}
                <span>Buscar</span>
              </button>
            </form>

            {submitted && (
              <div className="mt-4 flex items-start gap-2 rounded-md border border-dashed border-border bg-card p-3 text-sm">
                <span className="mt-0.5 flex size-6 items-center justify-center rounded-full bg-primary/10 text-primary">
                  {searching ? (
                    <Loader2 className="size-3.5 animate-spin" aria-hidden="true" />
                  ) : (
                    <Search className="size-3.5" aria-hidden="true" />
                  )}
                </span>
                <div>
                  <p className="text-foreground">
                    {searching ? "Buscando" : "Buscando por"}:{" "}
                    <span className="font-medium">{submitted}</span>
                  </p>
                  {!searching && (
                    <p className="mt-0.5 text-xs text-muted-foreground">
                      A integração real com a base do portal entra na próxima sprint.
                    </p>
                  )}
                </div>
              </div>
            )}
          </div>
        </section>

        <section className="container-page px-4 py-6">
          <DashboardInicial onTermoClick={aplicarTermo} />
        </section>
      </main>

      <Footer />
      <BottomNav />
    </div>
  )
}
