import {
  ArrowRight,
  Sparkles,
  ShieldCheck,
  Accessibility,
  Map as MapIcon,
  Search,
  FileDown,
  Share2,
  Database,
  Cpu,
  Code2,
  Heart,
  CircleAlert,
  CheckCircle2,
} from "lucide-react"
import { Link } from "react-router-dom"
import { Header } from "@/components/layout/Header"
import { Footer } from "@/components/layout/Footer"
import { BottomNav } from "@/components/layout/BottomNav"

/**
 * Página /sobre.
 *
 * Apresenta a visão, problema, solução, diferenciais, stack e equipe
 * do Portal da Transparência. Funciona como apoio durante o pitch (cada seção
 * é um talking point) e como página institucional do projeto.
 */
export function Sobre() {
  return (
    <div className="min-h-svh bg-background text-foreground pb-16 md:pb-0">
      <a href="#main" className="skip-link">
        Pular para o conteúdo
      </a>
      <Header />

      <main id="main">
        {/* Hero */}
        <section className="border-b border-border bg-gradient-to-b from-primary/10 via-background to-background">
          <div className="container-page px-4 py-12 md:py-16">
            <div className="max-w-3xl">
              <span className="inline-flex items-center gap-1.5 rounded-full border border-primary/30 bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
                <Sparkles className="size-3.5" aria-hidden="true" />
                Hackathon Transparência Maranhense 2026
              </span>

              <h1 className="mt-4 font-display text-3xl font-bold tracking-tight md:text-5xl">
                A transparência que o cidadão maranhense merece.
              </h1>

              <p className="mt-4 text-base leading-relaxed text-muted-foreground md:text-lg">
                Esta é a nova versão do Portal da Transparência do Maranhão.
                Construída para o cidadão, do celular para o desktop, sem jargão
                e em até 3 passos para qualquer informação.
              </p>

              <div className="mt-6 flex flex-wrap gap-2">
                <Link
                  to="/"
                  className="inline-flex items-center gap-1.5 rounded-md bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90"
                >
                  Explorar o portal
                  <ArrowRight className="size-4" aria-hidden="true" />
                </Link>
                <Link
                  to="/busca"
                  className="inline-flex items-center gap-1.5 rounded-md border border-border bg-background px-4 py-2.5 text-sm font-medium transition-colors hover:bg-muted"
                >
                  <Search className="size-4" aria-hidden="true" />
                  Fazer uma busca
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Problema vs Solução */}
        <section className="container-page px-4 py-12">
          <h2 className="font-display text-2xl font-bold tracking-tight md:text-3xl">
            Por que renovar o Portal da Transparência?
          </h2>
          <p className="mt-2 max-w-2xl text-sm leading-relaxed text-muted-foreground md:text-base">
            O Portal da Transparência atual é tecnicamente competente (Selo
            Diamante CGU), mas foi pensado para auditores e técnicos. O cidadão
            comum se perde no caminho.
          </p>

          <div className="mt-8 grid gap-4 md:grid-cols-2">
            {/* Problema */}
            <article className="rounded-lg border border-destructive/20 bg-destructive/5 p-5">
              <header className="flex items-center gap-2">
                <span className="flex size-8 items-center justify-center rounded-md bg-destructive/15 text-destructive">
                  <CircleAlert className="size-4" aria-hidden="true" />
                </span>
                <h3 className="font-semibold text-foreground">Problema</h3>
              </header>
              <ul className="mt-4 space-y-2 text-sm text-muted-foreground">
                <Item>Linguagem técnica: empenho, dotação, subelemento sem explicação</Item>
                <Item>Profundidade excessiva: até 8 cliques para chegar em um dado</Item>
                <Item>Mobile precário: tabelas largas que não cabem na tela</Item>
                <Item>Acessibilidade limitada para pessoas com baixa visão</Item>
                <Item>Sem busca semântica: cidadão precisa saber o jargão certo</Item>
              </ul>
            </article>

            {/* Solução */}
            <article className="rounded-lg border border-success/30 bg-success/5 p-5">
              <header className="flex items-center gap-2">
                <span className="flex size-8 items-center justify-center rounded-md bg-success/15 text-success">
                  <CheckCircle2 className="size-4" aria-hidden="true" />
                </span>
                <h3 className="font-semibold text-foreground">Nossa solução</h3>
              </header>
              <ul className="mt-4 space-y-2 text-sm text-muted-foreground">
                <Item>Linguagem cidadã com glossário inline em cada termo técnico</Item>
                <Item>Máximo 3 passos: home, eixo, detalhe. Sempre.</Item>
                <Item>Mobile-first com touch targets de 44px e bottom nav</Item>
                <Item>WCAG 2.1 AAA: alto contraste, fonte aumentada, reduzir movimento</Item>
                <Item>AjudaInteligente: pergunte em linguagem natural com Claude Haiku 4.5</Item>
              </ul>
            </article>
          </div>
        </section>

        {/* Diferenciais */}
        <section className="border-y border-border bg-muted/30">
          <div className="container-page px-4 py-12">
            <h2 className="font-display text-2xl font-bold tracking-tight md:text-3xl">
              O que nos diferencia
            </h2>
            <p className="mt-2 max-w-2xl text-sm leading-relaxed text-muted-foreground md:text-base">
              Cinco recursos que nenhum portal estadual tem hoje no Brasil.
            </p>

            <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              <Diferencial
                icon={Sparkles}
                titulo="AjudaInteligente"
                descricao="IA cidadã com Claude Haiku 4.5, RAG nos eixos e integração com a API pública do Portal MA. Mantém contexto multi-turn."
              />
              <Diferencial
                icon={MapIcon}
                titulo="Mapa interativo"
                descricao="217 municípios maranhenses navegáveis. Toque e veja gastos, obras, contratos e servidores por categoria."
              />
              <Diferencial
                icon={Accessibility}
                titulo="Acessibilidade nível AAA"
                descricao="Alto contraste agressivo (não apenas dark mode), aumento de fonte, redução de movimento, persistência por sessão."
              />
              <Diferencial
                icon={FileDown}
                titulo="Memorial Cidadão"
                descricao="PDF gerado on-demand de qualquer eixo, com identidade visual do Portal. Cidadão imprime e leva pra reunião do bairro."
              />
              <Diferencial
                icon={Share2}
                titulo="Compartilhamento WhatsApp"
                descricao="Um clique em qualquer eixo, busca ou município gera mensagem formatada para grupo de WhatsApp ou nativo do celular."
              />
              <Diferencial
                icon={ShieldCheck}
                titulo="Segurança por design"
                descricao="LGPD compliant: bloqueio de busca por CPF/CNPJ, anti prompt injection, rate limit por IP, logs anônimos."
              />
            </div>
          </div>
        </section>

        {/* Stack tecnológica */}
        <section className="container-page px-4 py-12">
          <h2 className="font-display text-2xl font-bold tracking-tight md:text-3xl">
            Tecnologia
          </h2>
          <p className="mt-2 max-w-2xl text-sm leading-relaxed text-muted-foreground md:text-base">
            Stack moderna, escalável e auditável. Tudo open source ou serverless.
          </p>

          <div className="mt-8 grid gap-4 md:grid-cols-3">
            <BlocoStack
              icon={Code2}
              titulo="Frontend"
              itens={[
                "React 19 + Vite",
                "TypeScript 5",
                "Tailwind 3 + shadcn/ui",
                "React Router 7",
                "Recharts + Leaflet",
                "Lucide Icons",
              ]}
            />
            <BlocoStack
              icon={Database}
              titulo="Backend e dados"
              itens={[
                "Supabase Postgres",
                "Row Level Security",
                "Edge Functions Deno",
                "Cache semântico SHA-256",
                "API pública Portal MA",
                "pgvector (semantic search)",
              ]}
            />
            <BlocoStack
              icon={Cpu}
              titulo="IA e DevOps"
              itens={[
                "Claude Haiku 4.5 (Anthropic)",
                "RAG primitivo nos eixos",
                "Multi-turn 10 interações",
                "Rate limiting com salt",
                "Anti prompt injection",
                "WCAG 2.1 AAA + e-MAG",
              ]}
            />
          </div>
        </section>

        {/* Equipe */}
        <section className="border-t border-border bg-gradient-to-b from-background to-accent/20">
          <div className="container-page px-4 py-12">
            <h2 className="font-display text-2xl font-bold tracking-tight md:text-3xl">
              Equipe
            </h2>
            <p className="mt-2 max-w-2xl text-sm leading-relaxed text-muted-foreground md:text-base">
              Três desenvolvedores maranhenses construindo o portal que sempre
              quisemos como cidadãos.
            </p>

            <div className="mt-8 grid gap-4 md:grid-cols-3">
              <CardEquipe
                nome="André Lopes"
                papel="Desenvolvedor Fullstack"
                bio="Analista de Sistemas e Data Science. CEO da Agência Digital SLZ. Responsável pela arquitetura, frontend e integração com IA."
              />
              <CardEquipe
                nome="Alexandre Oliveira"
                papel="Dev Backend, IA"
                bio="Especialista em IA e Análise de Dados. Responsável pela Edge Function de IA, cache semântico e prompts da AjudaInteligente."
              />
              <CardEquipe
                nome="Alexsander Oliveira"
                papel="Dev Backend"
                bio="Analista de Sistemas. Responsável pelo schema do Supabase, RLS e integração com a API pública do Portal MA."
              />
            </div>
          </div>
        </section>

        {/* Compliance */}
        <section className="container-page px-4 py-12">
          <article className="rounded-lg border border-border bg-card p-6">
            <header className="flex items-center gap-2">
              <span className="flex size-8 items-center justify-center rounded-md bg-primary/10 text-primary">
                <ShieldCheck className="size-4" aria-hidden="true" />
              </span>
              <h2 className="font-display text-xl font-bold tracking-tight">
                Compliance e legislação aplicável
              </h2>
            </header>
            <ul className="mt-4 grid gap-3 text-sm leading-relaxed text-muted-foreground sm:grid-cols-2">
              <li>
                <strong className="text-foreground">LAI (Lei 12.527/2011)</strong>:
                garantia do direito de acesso a informações públicas, com prazos
                e formato definidos.
              </li>
              <li>
                <strong className="text-foreground">Lei de Transparência (LC 131/2009)</strong>:
                obrigatoriedade da divulgação em tempo real de receitas e despesas.
              </li>
              <li>
                <strong className="text-foreground">LGPD (Lei 13.709/2018)</strong>:
                proteção a dados pessoais. Buscas por CPF, RG e CNPJ isolado são
                bloqueadas.
              </li>
              <li>
                <strong className="text-foreground">e-MAG e WCAG 2.1</strong>:
                acessibilidade digital obrigatória para sites de governo.
                Implementamos nível AAA.
              </li>
              <li>
                <strong className="text-foreground">Selo Diamante CGU</strong>:
                o Portal MA atual já tem. Esta nova versão mantém o nível com
                upgrade na experiência do cidadão.
              </li>
              <li>
                <strong className="text-foreground">Lei 14.129/2021 (Gov Digital)</strong>:
                interoperabilidade, dados abertos e governo digital. Usamos a
                API pública oficial do Portal MA.
              </li>
            </ul>
          </article>
        </section>

        {/* CTA final */}
        <section className="border-t border-border bg-primary/5">
          <div className="container-page px-4 py-12 text-center">
            <Heart className="mx-auto size-8 text-primary" aria-hidden="true" />
            <h2 className="mt-3 font-display text-2xl font-bold tracking-tight md:text-3xl">
              Construído com transparência, do Maranhão para o Brasil.
            </h2>
            <p className="mx-auto mt-2 max-w-2xl text-sm leading-relaxed text-muted-foreground md:text-base">
              Esta nova versão do Portal é uma proposta open-source. Pode ser adaptada para
              qualquer estado ou município brasileiro que queira evoluir seu
              portal de transparência.
            </p>

            <div className="mt-6 flex flex-wrap justify-center gap-2">
              <Link
                to="/"
                className="inline-flex items-center gap-2 rounded-md bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90"
              >
                <ArrowRight className="size-4" aria-hidden="true" />
                Voltar para a home
              </Link>
            </div>
          </div>
        </section>
      </main>

      <Footer />
      <BottomNav />
    </div>
  )
}

// ─── Subcomponentes ───────────────────────────────────────────────

function Item({ children }: { children: React.ReactNode }) {
  return (
    <li className="flex items-start gap-2">
      <span className="mt-1.5 size-1.5 shrink-0 rounded-full bg-current opacity-50" aria-hidden="true" />
      <span>{children}</span>
    </li>
  )
}

function Diferencial({
  icon: Icon,
  titulo,
  descricao,
}: {
  icon: typeof Sparkles
  titulo: string
  descricao: string
}) {
  return (
    <article className="rounded-lg border border-border bg-card p-5 transition-colors hover:border-primary/40">
      <span className="flex size-10 items-center justify-center rounded-md bg-primary text-primary-foreground shadow-sm">
        <Icon className="size-5" aria-hidden="true" />
      </span>
      <h3 className="mt-4 font-semibold text-foreground">{titulo}</h3>
      <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">
        {descricao}
      </p>
    </article>
  )
}

function BlocoStack({
  icon: Icon,
  titulo,
  itens,
}: {
  icon: typeof Code2
  titulo: string
  itens: string[]
}) {
  return (
    <article className="rounded-lg border border-border bg-card p-5">
      <header className="flex items-center gap-2">
        <span className="flex size-8 items-center justify-center rounded-md bg-secondary/15 text-secondary-foreground">
          <Icon className="size-4" aria-hidden="true" />
        </span>
        <h3 className="font-semibold text-foreground">{titulo}</h3>
      </header>
      <ul className="mt-4 space-y-1.5 text-sm text-muted-foreground">
        {itens.map((i) => (
          <li key={i} className="flex items-start gap-2">
            <CheckCircle2 className="mt-0.5 size-3.5 shrink-0 text-success" aria-hidden="true" />
            <span>{i}</span>
          </li>
        ))}
      </ul>
    </article>
  )
}

function CardEquipe({
  nome,
  papel,
  bio,
}: {
  nome: string
  papel: string
  bio: string
}) {
  const iniciais = nome
    .split(" ")
    .map((p) => p[0])
    .slice(0, 2)
    .join("")

  return (
    <article className="rounded-lg border border-border bg-card p-5">
      <span className="flex size-12 items-center justify-center rounded-full bg-gradient-to-br from-primary to-primary-dark font-display text-base font-bold text-primary-foreground shadow-sm">
        {iniciais}
      </span>
      <h3 className="mt-3 font-semibold text-foreground">{nome}</h3>
      <p className="mt-0.5 text-xs font-medium uppercase tracking-wide text-primary">
        {papel}
      </p>
      <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
        {bio}
      </p>
    </article>
  )
}
