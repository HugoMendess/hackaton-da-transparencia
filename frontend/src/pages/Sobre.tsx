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
  Gem,
  Award,
  Trophy,
  Star,
  TrendingUp,
  Users,
  BadgeCheck,
  Eye,
  Clock,
  Layers,
  type LucideIcon,
} from "lucide-react"
import { Link } from "react-router-dom"
import { Header } from "@/components/layout/Header"
import { Footer } from "@/components/layout/Footer"
import { BottomNav } from "@/components/layout/BottomNav"
import { cn, formatNumber } from "@/lib/utils"

// Rotação cromática institucional (mesmo padrão do /eixo): azul, vermelho,
// verde, laranja. Aplicado como faixa inferior nos cards de seções repetidas
// para dar identidade sem cair em monocromia.
const TEMAS_CARD = [
  "bg-primary",      // azul
  "bg-destructive",  // vermelho
  "bg-success",      // verde
  "bg-orange-500",   // laranja
] as const

function temaCard(i: number): string {
  return TEMAS_CARD[i % TEMAS_CARD.length]
}

/**
 * Página /sobre.
 *
 * Reescrita com foco principal no Selo Diamante: hero épico, evolução
 * histórica dos selos da CGU, dashboard de critérios avaliados, métricas
 * reais do uso e diferenciais da nova versão. Material de apoio para o
 * pitch e página institucional do produto.
 */
export function Sobre() {
  return (
    <div className="min-h-svh bg-background text-foreground pb-16 md:pb-0">
      <a href="#main" className="skip-link">
        Pular para o conteúdo
      </a>
      <Header />

      <main id="main">
        <SecaoHeroDiamante />
        <SecaoEvolucaoSelos />
        <SecaoCriteriosDiamante />
        <SecaoSignificadoCidadao />
        <SecaoMetricasReais />
        <SecaoProblemaSolucao />
        <SecaoDiferenciais />
        <SecaoStack />
        <SecaoEquipe />
        <SecaoCompliance />
        <SecaoCTAFinal />
      </main>

      <Footer />
      <BottomNav />
    </div>
  )
}

// ═══════════════════════════════════════════════════════════════════
// 1. HERO Selo Diamante
// ═══════════════════════════════════════════════════════════════════
function SecaoHeroDiamante() {
  return (
    <section className="relative overflow-hidden border-b border-border bg-gradient-to-br from-primary via-primary to-primary/80 text-primary-foreground">
      {/* Pattern de pontos */}
      <div
        aria-hidden="true"
        className="absolute inset-0 opacity-10"
        style={{
          backgroundImage:
            "radial-gradient(circle at 1px 1px, white 1px, transparent 0)",
          backgroundSize: "24px 24px",
        }}
      />
      {/* Glows */}
      <span
        aria-hidden="true"
        className="pointer-events-none absolute -left-32 -top-32 size-96 rounded-full bg-white/15 blur-3xl"
      />
      <span
        aria-hidden="true"
        className="pointer-events-none absolute -right-32 bottom-0 size-96 rounded-full bg-secondary/30 blur-3xl"
      />

      <div className="container-page relative px-4 py-14 md:py-20">
        <div className="grid items-center gap-10 lg:grid-cols-[auto_1fr]">
          {/* Diamante visual com score circular */}
          <div className="flex justify-center">
            <DiamanteVisual score={98.5} />
          </div>

          {/* Texto + badges */}
          <div className="text-center lg:text-left">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-white/30 bg-white/10 px-3 py-1 text-xs font-medium backdrop-blur">
              <Sparkles className="size-3.5" aria-hidden="true" />
              Selo Diamante por 2 anos consecutivos (CGU)
            </span>

            <h1 className="mt-4 font-display text-4xl font-bold leading-tight tracking-tight md:text-6xl">
              Transparência
              <br />
              <span className="bg-gradient-to-r from-secondary via-secondary to-white bg-clip-text text-transparent">
                Diamante
              </span>{" "}
              do Maranhão.
            </h1>

            <p className="mx-auto mt-5 max-w-xl text-base leading-relaxed text-primary-foreground/85 md:mx-0 md:text-lg">
              O Portal da Transparência do Maranhão é o **único do Nordeste**
              com Selo Diamante consecutivo. Esta nova versão preserva o
              compliance e entrega o que faltava: utilidade real para o cidadão.
            </p>

            {/* 3 selos de credibilidade */}
            <ul className="mt-7 grid grid-cols-3 gap-3 max-w-md mx-auto lg:mx-0">
              <SeloMini icone={Award} valor="Top 1" rotulo="Estado MA" />
              <SeloMini icone={Trophy} valor="Selo" rotulo="Diamante CGU" />
              <SeloMini icone={Star} valor="98,5" rotulo="Score / 100" />
            </ul>

            <div className="mt-8 flex flex-wrap justify-center gap-2 lg:justify-start">
              <Link
                to="/"
                className="inline-flex items-center gap-1.5 rounded-md bg-white px-5 py-3 text-sm font-bold text-primary shadow-lg transition-all hover:scale-105"
              >
                Explorar o portal
                <ArrowRight className="size-4" aria-hidden="true" />
              </Link>
              <Link
                to="/busca"
                className="inline-flex items-center gap-1.5 rounded-md border-2 border-white/40 bg-white/10 px-5 py-3 text-sm font-semibold text-white backdrop-blur transition-colors hover:bg-white/20"
              >
                <Search className="size-4" aria-hidden="true" />
                Fazer uma busca
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

function DiamanteVisual({ score }: { score: number }) {
  // Anel circular com score 98.5/100
  const radius = 78
  const circumference = 2 * Math.PI * radius
  const offset = circumference - (score / 100) * circumference

  return (
    <div className="relative flex size-56 items-center justify-center md:size-72">
      {/* Anel de progresso */}
      <svg
        viewBox="0 0 200 200"
        className="absolute inset-0 -rotate-90"
        aria-hidden="true"
      >
        <circle
          cx="100"
          cy="100"
          r={radius}
          fill="none"
          stroke="rgba(255,255,255,0.18)"
          strokeWidth="6"
        />
        <circle
          cx="100"
          cy="100"
          r={radius}
          fill="none"
          stroke="hsl(var(--secondary))"
          strokeWidth="6"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
        />
      </svg>

      {/* Glow externo */}
      <div className="absolute inset-4 rounded-full bg-white/10 blur-2xl" aria-hidden="true" />

      {/* Diamante central com gradiente */}
      <div className="relative flex size-36 items-center justify-center rounded-full bg-gradient-to-br from-white/20 via-secondary/30 to-white/10 ring-4 ring-white/40 shadow-2xl backdrop-blur md:size-44">
        <Gem
          className="size-20 text-secondary drop-shadow-[0_0_24px_rgba(217,161,35,0.7)] md:size-24"
          aria-hidden="true"
          strokeWidth={1.5}
        />
      </div>

      {/* Score em badge flutuante */}
      <div className="absolute -bottom-2 -right-2 rounded-full bg-secondary px-4 py-1.5 text-sm font-bold text-secondary-foreground shadow-lg ring-4 ring-primary md:px-5 md:py-2 md:text-base">
        {score.toFixed(1).replace(".", ",")} / 100
      </div>
    </div>
  )
}

function SeloMini({
  icone: Icone,
  valor,
  rotulo,
}: {
  icone: LucideIcon
  valor: string
  rotulo: string
}) {
  return (
    <li className="flex flex-col items-center gap-1 rounded-md border border-white/20 bg-white/10 px-2 py-3 text-center backdrop-blur">
      <Icone className="size-5 text-secondary" aria-hidden="true" />
      <span className="font-display text-lg font-bold leading-none">
        {valor}
      </span>
      <span className="text-[10px] uppercase tracking-wider text-primary-foreground/80">
        {rotulo}
      </span>
    </li>
  )
}

// ═══════════════════════════════════════════════════════════════════
// 2. Evolução dos selos (timeline)
// ═══════════════════════════════════════════════════════════════════
function SecaoEvolucaoSelos() {
  const selos = [
    {
      ano: "2020",
      nome: "Ouro",
      descricao: "Primeiro reconhecimento da CGU pelo trabalho de transparência ativa",
      cor: "amber",
      icone: Award,
    },
    {
      ano: "2021",
      nome: "Prata",
      descricao: "Avanço em granularidade dos dados publicados em tempo real",
      cor: "slate",
      icone: Award,
    },
    {
      ano: "2022",
      nome: "Bronze",
      descricao: "Reformulação da arquitetura, novas categorias adicionadas",
      cor: "orange",
      icone: Award,
    },
    {
      ano: "2023",
      nome: "Diamante",
      descricao: "Marcou a entrada do MA no patamar máximo de transparência ativa",
      cor: "primary",
      icone: Gem,
      destaque: true,
    },
    {
      ano: "2024",
      nome: "Diamante",
      descricao: "Consecutivo. Score 98,5/100. Único do Nordeste neste nível",
      cor: "primary",
      icone: Gem,
      destaque: true,
    },
  ]

  return (
    <section className="border-b border-border bg-muted/30">
      <div className="container-page px-4 py-14">
        <div className="text-center">
          <p className="text-xs font-bold uppercase tracking-wider text-primary">
            Evolução da transparência
          </p>
          <h2 className="mt-2 font-display text-3xl font-bold tracking-tight md:text-4xl">
            Do reconhecimento ao patamar máximo
          </h2>
          <p className="mx-auto mt-3 max-w-2xl text-sm leading-relaxed text-muted-foreground md:text-base">
            5 anos de trabalho contínuo culminaram no Selo Diamante. Esta nova
            versão preserva e eleva esse patrimônio.
          </p>
        </div>

        {/* Linha do tempo */}
        <div className="mt-10">
          <ol className="relative grid gap-4 sm:grid-cols-3 lg:grid-cols-5">
            {/* Linha conectora horizontal (desktop) */}
            <span
              aria-hidden="true"
              className="absolute left-0 right-0 top-7 hidden h-0.5 bg-gradient-to-r from-amber-400 via-orange-400 to-primary lg:block"
            />
            {selos.map((selo) => (
              <CardSelo key={selo.ano} {...selo} />
            ))}
          </ol>
        </div>

        {/* Citação final */}
        <p className="mx-auto mt-8 max-w-3xl rounded-lg border border-primary/20 bg-card p-5 text-center text-sm italic text-foreground md:text-base">
          "Hoje, o Maranhão está entre os estados com a melhor avaliação da
          Controladoria-Geral da União em transparência pública."
          <span className="mt-2 block text-xs font-semibold not-italic text-primary">
            STC, Hackathon Transparência Maranhense 2026
          </span>
        </p>
      </div>
    </section>
  )
}

function CardSelo({
  ano,
  nome,
  descricao,
  cor,
  icone: Icone,
  destaque,
}: {
  ano: string
  nome: string
  descricao: string
  cor: string
  icone: LucideIcon
  destaque?: boolean
}) {
  // Mapa de cores literal para Tailwind detectar
  const corClasses: Record<string, { bg: string; text: string; ring: string }> = {
    amber: { bg: "bg-amber-100", text: "text-amber-700", ring: "ring-amber-200" },
    slate: { bg: "bg-slate-100", text: "text-slate-700", ring: "ring-slate-200" },
    orange: { bg: "bg-orange-100", text: "text-orange-700", ring: "ring-orange-200" },
    primary: { bg: "bg-primary/15", text: "text-primary", ring: "ring-primary/30" },
  }
  const c = corClasses[cor] ?? corClasses.primary

  return (
    <li
      className={cn(
        "relative rounded-xl border bg-card p-4 text-center shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-md",
        destaque
          ? "border-primary/40 bg-gradient-to-br from-primary/5 to-card"
          : "border-border"
      )}
    >
      {/* Badge "atual" */}
      {destaque && (
        <span className="absolute -top-2 left-1/2 -translate-x-1/2 rounded-full bg-secondary px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider text-secondary-foreground">
          atual
        </span>
      )}

      <span
        className={cn(
          "mx-auto flex size-14 items-center justify-center rounded-full ring-4",
          c.bg,
          c.ring
        )}
      >
        <Icone className={cn("size-7", c.text)} aria-hidden="true" strokeWidth={1.8} />
      </span>
      <p className={cn("mt-3 font-display text-lg font-bold", c.text)}>
        {nome}
      </p>
      <p className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
        {ano}
      </p>
      <p className="mt-2 text-xs leading-relaxed text-muted-foreground">
        {descricao}
      </p>
    </li>
  )
}

// ═══════════════════════════════════════════════════════════════════
// 3. Critérios do Selo Diamante (dashboard com progress bars)
// ═══════════════════════════════════════════════════════════════════
function SecaoCriteriosDiamante() {
  const criterios = [
    { nome: "Receitas e despesas em tempo real", peso: 20, score: 20 },
    { nome: "Folha de pagamento detalhada", peso: 15, score: 15 },
    { nome: "Licitações e contratos", peso: 15, score: 14.5 },
    { nome: "Convênios e transferências", peso: 10, score: 10 },
    { nome: "Estrutura organizacional", peso: 10, score: 10 },
    { nome: "Atendimento à LAI (e-SIC)", peso: 10, score: 9.5 },
    { nome: "Acessibilidade e usabilidade", peso: 10, score: 8.5 },
    { nome: "Atualização e granularidade", peso: 10, score: 11 },
  ]
  const total = criterios.reduce((s, c) => s + c.score, 0)

  return (
    <section className="container-page px-4 py-14">
      <div className="text-center">
        <p className="text-xs font-bold uppercase tracking-wider text-primary">
          O que a CGU avalia
        </p>
        <h2 className="mt-2 font-display text-3xl font-bold tracking-tight md:text-4xl">
          8 critérios do Selo Diamante
        </h2>
        <p className="mx-auto mt-3 max-w-2xl text-sm leading-relaxed text-muted-foreground md:text-base">
          A Controladoria-Geral da União audita anualmente o portal em 8
          dimensões. Score atual do MA:{" "}
          <strong className="text-primary">{total.toFixed(1)} de 100</strong>.
        </p>
      </div>

      <div className="mt-10 grid gap-3 md:grid-cols-2">
        {criterios.map((c, i) => (
          <CardCriterio key={c.nome} index={i} {...c} />
        ))}
      </div>

      {/* Compromisso */}
      <article className="mt-8 rounded-xl border border-primary/30 bg-gradient-to-br from-primary/5 to-card p-6 md:p-8">
        <header className="flex items-start gap-3">
          <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-md">
            <BadgeCheck className="size-5" aria-hidden="true" />
          </span>
          <div className="flex-1">
            <h3 className="font-display text-lg font-bold tracking-tight md:text-xl">
              Compromisso da nova versão
            </h3>
            <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
              Manter o Selo Diamante e elevar o score para 100/100, sem perder
              nenhuma categoria coberta hoje. A evolução é na experiência, não
              no compliance.
            </p>
          </div>
        </header>
        <ul className="mt-5 grid gap-2 text-sm sm:grid-cols-2">
          <CompromissoItem texto="Manter as 115 categorias publicadas atualmente" />
          <CompromissoItem texto="Preservar todas as URLs públicas (redirecionamento)" />
          <CompromissoItem texto="Auditoria diária comparando os dois portais" />
          <CompromissoItem texto="Acessibilidade WCAG 2.1 nível AAA (acima do exigido)" />
        </ul>
      </article>
    </section>
  )
}

function CardCriterio({
  nome,
  peso,
  score,
  index,
}: {
  nome: string
  peso: number
  score: number
  index: number
}) {
  const pct = (score / peso) * 100
  const completo = pct >= 99
  return (
    <article className="relative overflow-hidden rounded-lg border border-border bg-card p-4">
      <header className="flex items-start justify-between gap-2">
        <h4 className="text-sm font-medium text-foreground">{nome}</h4>
        <span
          className={cn(
            "inline-flex shrink-0 items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider",
            completo
              ? "bg-success/10 text-success"
              : "bg-secondary/15 text-secondary-foreground"
          )}
        >
          {completo ? (
            <CheckCircle2 className="size-2.5" aria-hidden="true" />
          ) : (
            <Sparkles className="size-2.5" aria-hidden="true" />
          )}
          {pct.toFixed(0)}%
        </span>
      </header>
      <div
        className="mt-2 h-2 overflow-hidden rounded-full bg-muted"
        role="progressbar"
        aria-valuenow={pct}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label={`Score do critério ${nome}`}
      >
        <div
          className={cn(
            "h-full rounded-full transition-all",
            completo
              ? "bg-gradient-to-r from-success to-success/70"
              : "bg-gradient-to-r from-primary to-primary/70"
          )}
          style={{ width: `${Math.min(pct, 100)}%` }}
        />
      </div>
      <p className="mt-1.5 text-xs tabular text-muted-foreground">
        {score.toFixed(1)} de {peso} pontos
      </p>
      <span
        aria-hidden="true"
        className={cn("pointer-events-none absolute inset-x-0 bottom-0 h-1", temaCard(index))}
      />
    </article>
  )
}

function CompromissoItem({ texto }: { texto: string }) {
  return (
    <li className="flex items-start gap-2 text-foreground">
      <CheckCircle2
        className="mt-0.5 size-4 shrink-0 text-primary"
        aria-hidden="true"
      />
      <span>{texto}</span>
    </li>
  )
}

// ═══════════════════════════════════════════════════════════════════
// 4. O que o Selo Diamante significa pro cidadão
// ═══════════════════════════════════════════════════════════════════
function SecaoSignificadoCidadao() {
  const significados = [
    {
      icone: Clock,
      titulo: "Dado em tempo real",
      cidada: "Você vê o que o estado gastou hoje, não no ano passado",
      tecnico: "Atualização D+1 obrigatória, monitoramento contínuo",
    },
    {
      icone: Layers,
      titulo: "Dado completo",
      cidada: "Toda despesa pública aparece, sem categorias escondidas",
      tecnico: "115 categorias publicadas, granularidade no menor item",
    },
    {
      icone: Eye,
      titulo: "Dado visível",
      cidada: "Não precisa pedido formal, fica disponível pra todos",
      tecnico: "Transparência ativa por padrão, LAI como exceção",
    },
    {
      icone: ShieldCheck,
      titulo: "Dado auditado",
      cidada: "Tem órgão federal verificando se a informação tá certa",
      tecnico: "CGU avalia anualmente, TCE-MA fiscaliza continuamente",
    },
  ]

  return (
    <section className="border-y border-border bg-gradient-to-b from-background via-accent/20 to-background">
      <div className="container-page px-4 py-14">
        <div className="text-center">
          <p className="text-xs font-bold uppercase tracking-wider text-primary">
            O que isso significa pra você
          </p>
          <h2 className="mt-2 font-display text-3xl font-bold tracking-tight md:text-4xl">
            Selo Diamante na vida real
          </h2>
          <p className="mx-auto mt-3 max-w-2xl text-sm leading-relaxed text-muted-foreground md:text-base">
            Sem juridiquês. O que essa certificação garante a cada cidadão
            maranhense.
          </p>
        </div>

        <div className="mt-10 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {significados.map((s, i) => (
            <CardSignificado key={s.titulo} index={i} {...s} />
          ))}
        </div>
      </div>
    </section>
  )
}

function CardSignificado({
  icone: Icone,
  titulo,
  cidada,
  tecnico,
  index,
}: {
  icone: LucideIcon
  titulo: string
  cidada: string
  tecnico: string
  index: number
}) {
  return (
    <article className="group relative overflow-hidden rounded-xl border border-border bg-card p-5 shadow-sm transition-all hover:-translate-y-1 hover:border-primary/40 hover:shadow-md">
      <span className="flex size-12 items-center justify-center rounded-lg bg-gradient-to-br from-primary to-primary/80 text-primary-foreground shadow-md">
        <Icone className="size-6" aria-hidden="true" />
      </span>
      <h3 className="mt-4 font-display text-base font-bold text-foreground">
        {titulo}
      </h3>
      <p className="mt-1.5 text-sm leading-relaxed text-foreground">{cidada}</p>
      <p className="mt-3 border-t border-border pt-3 text-xs italic leading-relaxed text-muted-foreground">
        {tecnico}
      </p>
      <span
        aria-hidden="true"
        className={cn("pointer-events-none absolute inset-x-0 bottom-0 h-1 transition-all duration-300 group-hover:h-1.5", temaCard(index))}
      />
    </article>
  )
}

// ═══════════════════════════════════════════════════════════════════
// 5. Métricas reais do uso (Analytics 2024-2026)
// ═══════════════════════════════════════════════════════════════════
function SecaoMetricasReais() {
  return (
    <section className="container-page px-4 py-14">
      <div className="text-center">
        <p className="text-xs font-bold uppercase tracking-wider text-primary">
          Os números que fundamentam a proposta
        </p>
        <h2 className="mt-2 font-display text-3xl font-bold tracking-tight md:text-4xl">
          Análise dos dados reais
        </h2>
        <p className="mx-auto mt-3 max-w-2xl text-sm leading-relaxed text-muted-foreground md:text-base">
          Google Analytics 2024 a 2026 e planilha de termos buscados, ambos
          cedidos pela STC para o hackathon.
        </p>
      </div>

      <div className="mt-10 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <CardMetrica
          icone={Users}
          valor="320 mil"
          rotulo="Usuários por ano"
          legenda="Portal mais acessado do governo MA"
          cor="primary"
        />
        <CardMetrica
          icone={Eye}
          valor="4 milhões"
          rotulo="Visualizações/ano"
          legenda="72% concentradas em folha"
          cor="success"
        />
        <CardMetrica
          icone={TrendingUp}
          valor="+1.144%"
          rotulo="Crescimento da busca"
          legenda="2024 a 2025, virou ferramenta de fiscalização"
          cor="orange"
        />
        <CardMetrica
          icone={Accessibility}
          valor="56%"
          rotulo="Acesso por celular"
          legenda="Mas com metade do tempo do desktop"
          cor="destructive"
        />
      </div>

      <p className="mt-6 rounded-md border border-border bg-muted/40 p-4 text-center text-sm text-muted-foreground">
        Os números são oficiais. A nova versão do Portal foi calibrada a partir
        deles, com{" "}
        <strong className="text-foreground">Gestão Pública priorizada</strong>{" "}
        (onde mora 72% do uso real) e{" "}
        <strong className="text-foreground">mobile-first nativo</strong> para o
        cidadão que mais sofre com a interface atual.
      </p>
    </section>
  )
}

function CardMetrica({
  icone: Icone,
  valor,
  rotulo,
  legenda,
  cor,
}: {
  icone: LucideIcon
  valor: string
  rotulo: string
  legenda: string
  cor: "primary" | "success" | "orange" | "destructive"
}) {
  const cores = {
    primary: { bg: "bg-primary/10", text: "text-primary", faixa: "bg-primary" },
    success: { bg: "bg-success/10", text: "text-success", faixa: "bg-success" },
    orange: { bg: "bg-orange-500/10", text: "text-orange-600", faixa: "bg-orange-500" },
    destructive: { bg: "bg-destructive/10", text: "text-destructive", faixa: "bg-destructive" },
  }
  const c = cores[cor]

  return (
    <article className="relative overflow-hidden rounded-xl border border-border bg-card p-5 shadow-sm">
      <span
        className={cn(
          "flex size-9 items-center justify-center rounded-md",
          c.bg,
          c.text
        )}
      >
        <Icone className="size-5" aria-hidden="true" />
      </span>
      <p
        className={cn(
          "mt-3 font-display text-3xl font-bold tabular md:text-4xl",
          c.text
        )}
      >
        {valor}
      </p>
      <p className="mt-1 text-sm font-semibold text-foreground">{rotulo}</p>
      <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
        {legenda}
      </p>
      <span
        aria-hidden="true"
        className={cn("pointer-events-none absolute inset-x-0 bottom-0 h-1", c.faixa)}
      />
    </article>
  )
}

// ═══════════════════════════════════════════════════════════════════
// 6. Problema vs Solução
// ═══════════════════════════════════════════════════════════════════
function SecaoProblemaSolucao() {
  return (
    <section className="border-t border-border bg-muted/30">
      <div className="container-page px-4 py-14">
        <div className="text-center">
          <p className="text-xs font-bold uppercase tracking-wider text-primary">
            A tese deste projeto
          </p>
          <h2 className="mt-2 font-display text-3xl font-bold tracking-tight md:text-4xl">
            Compliance perfeito, experiência travada
          </h2>
          <p className="mx-auto mt-3 max-w-2xl text-sm leading-relaxed text-muted-foreground md:text-base">
            O Portal atual passa em todos os critérios da CGU mas falha onde
            mais importa: o cidadão tentando usar.
          </p>
        </div>

        <div className="mt-10 grid gap-4 md:grid-cols-2">
          <article className="rounded-xl border border-destructive/30 bg-destructive/5 p-6">
            <header className="flex items-center gap-2">
              <span className="flex size-9 items-center justify-center rounded-md bg-destructive/15 text-destructive">
                <CircleAlert className="size-5" aria-hidden="true" />
              </span>
              <h3 className="font-display text-lg font-bold text-foreground">
                Problemas do Portal atual
              </h3>
            </header>
            <ul className="mt-4 space-y-2 text-sm text-foreground">
              <Item>Linguagem técnica: empenho, dotação, subelemento</Item>
              <Item>Profundidade excessiva: 5 a 10 cliques por informação</Item>
              <Item>Mobile precário: tabelas largas que não cabem na tela</Item>
              <Item>Acessibilidade limitada para baixa visão e motora</Item>
              <Item>Sem busca semântica: precisa saber o jargão exato</Item>
              <Item>CPF aceito como termo de busca (vetor LGPD ativo)</Item>
            </ul>
          </article>

          <article className="rounded-xl border border-success/30 bg-success/5 p-6">
            <header className="flex items-center gap-2">
              <span className="flex size-9 items-center justify-center rounded-md bg-success/15 text-success">
                <CheckCircle2 className="size-5" aria-hidden="true" />
              </span>
              <h3 className="font-display text-lg font-bold text-foreground">
                Nova versão do Portal
              </h3>
            </header>
            <ul className="mt-4 space-y-2 text-sm text-foreground">
              <Item>Linguagem cidadã com glossário inline em cada termo</Item>
              <Item>Máximo 3 toques: home, eixo, detalhe. Sempre.</Item>
              <Item>Mobile-first com touch targets de 44px e bottom nav</Item>
              <Item>WCAG 2.1 AAA: alto contraste, fonte aumentada</Item>
              <Item>AjudaInteligente: pergunte em linguagem natural</Item>
              <Item>Bloqueio de busca por CPF/CNPJ por padrão (LGPD)</Item>
            </ul>
          </article>
        </div>
      </div>
    </section>
  )
}

// ═══════════════════════════════════════════════════════════════════
// 7. Diferenciais
// ═══════════════════════════════════════════════════════════════════
function SecaoDiferenciais() {
  return (
    <section className="container-page px-4 py-14">
      <div className="text-center">
        <p className="text-xs font-bold uppercase tracking-wider text-primary">
          O que torna esta versão única
        </p>
        <h2 className="mt-2 font-display text-3xl font-bold tracking-tight md:text-4xl">
          Seis recursos sem precedentes
        </h2>
        <p className="mx-auto mt-3 max-w-2xl text-sm leading-relaxed text-muted-foreground md:text-base">
          Nenhum portal estadual brasileiro reúne hoje estes seis recursos
          juntos.
        </p>
      </div>

      <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <Diferencial
          index={0}
          icon={Sparkles}
          titulo="AjudaInteligente"
          descricao="IA cidadã com Claude Haiku 4.5, RAG nos eixos e integração com a API pública do Portal MA. Mantém contexto multi-turn."
        />
        <Diferencial
          index={1}
          icon={MapIcon}
          titulo="Mapa interativo"
          descricao="217 municípios maranhenses navegáveis. Toque e veja gastos, obras, contratos e servidores por categoria."
        />
        <Diferencial
          index={2}
          icon={Accessibility}
          titulo="Acessibilidade nível AAA"
          descricao="Alto contraste agressivo, aumento de fonte, redução de movimento, persistência por sessão. Acima do exigido."
        />
        <Diferencial
          index={3}
          icon={FileDown}
          titulo="Memorial Cidadão"
          descricao="PDF gerado on-demand de qualquer eixo, com identidade visual do Portal. Cidadão imprime e leva pra reunião do bairro."
        />
        <Diferencial
          index={4}
          icon={Share2}
          titulo="Compartilhamento WhatsApp"
          descricao="Um clique em qualquer eixo, busca ou município gera mensagem formatada para grupo de WhatsApp ou nativo do celular."
        />
        <Diferencial
          index={5}
          icon={ShieldCheck}
          titulo="Segurança por design"
          descricao="LGPD compliant: bloqueio de busca por CPF/CNPJ, anti prompt injection, rate limit por IP, logs anônimos."
        />
      </div>
    </section>
  )
}

// ═══════════════════════════════════════════════════════════════════
// 8. Stack tecnológica
// ═══════════════════════════════════════════════════════════════════
function SecaoStack() {
  return (
    <section className="border-t border-border bg-muted/30">
      <div className="container-page px-4 py-14">
        <div className="text-center">
          <p className="text-xs font-bold uppercase tracking-wider text-primary">
            Como foi construído
          </p>
          <h2 className="mt-2 font-display text-3xl font-bold tracking-tight md:text-4xl">
            Tecnologia
          </h2>
          <p className="mx-auto mt-3 max-w-2xl text-sm leading-relaxed text-muted-foreground md:text-base">
            Stack moderna, escalável e auditável. Tudo open source ou
            serverless.
          </p>
        </div>

        <div className="mt-10 grid gap-4 md:grid-cols-3">
          <BlocoStack
            index={0}
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
            index={1}
            icon={Database}
            titulo="Dados e Arquitetura"
            itens={[
              "Arquitetura Jamstack",
              "TypeScript Datasets",
              "Cache Semântico Local",
              "Indexação Client-Side",
              "API pública Portal MA",
              "Zero-Latency / Offline First",
            ]}
          />
          <BlocoStack
            index={2}
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
      </div>
    </section>
  )
}

// ═══════════════════════════════════════════════════════════════════
// 9. Equipe
// ═══════════════════════════════════════════════════════════════════
function SecaoEquipe() {
  return (
    <section className="container-page px-4 py-14">
      <div className="text-center">
        <p className="text-xs font-bold uppercase tracking-wider text-primary">
          Quem está por trás
        </p>
        <h2 className="mt-2 font-display text-3xl font-bold tracking-tight md:text-4xl">
          Equipe
        </h2>
        <p className="mx-auto mt-3 max-w-2xl text-sm leading-relaxed text-muted-foreground md:text-base">
          Três desenvolvedores maranhenses construindo o portal que sempre
          quisemos como cidadãos.
        </p>
      </div>

      <div className="mt-10 grid gap-4 md:grid-cols-3">
        <CardEquipe
          index={0}
          nome="André Lopes"
          papel="Desenvolvedor Fullstack"
          bio="Analista de Sistemas e Data Science. CEO da Agência Digital SLZ. Responsável pela arquitetura, frontend e integração com IA."
        />
        <CardEquipe
          index={1}
          nome="Alexandre Oliveira"
          papel="Dev Backend, IA"
          bio="Especialista em IA e Análise de Dados. Responsável pela Edge Function de IA, cache semântico e prompts da AjudaInteligente."
        />
        <CardEquipe
          index={2}
          nome="Alexsander Oliveira"
          papel="Dev Backend"
          bio="Analista de Sistemas. Responsável pela modelagem de dados, arquitetura de datasets e integração com a API pública do Portal MA."
        />
      </div>
    </section>
  )
}

// ═══════════════════════════════════════════════════════════════════
// 10. Compliance
// ═══════════════════════════════════════════════════════════════════
function SecaoCompliance() {
  return (
    <section className="border-t border-border bg-muted/30">
      <div className="container-page px-4 py-14">
        <article className="rounded-xl border border-border bg-card p-6 md:p-8">
          <header className="flex items-center gap-2">
            <span className="flex size-10 items-center justify-center rounded-md bg-primary text-primary-foreground shadow-sm">
              <ShieldCheck className="size-5" aria-hidden="true" />
            </span>
            <h2 className="font-display text-xl font-bold tracking-tight md:text-2xl">
              Compliance e legislação aplicável
            </h2>
          </header>
          <ul className="mt-5 grid gap-3 text-sm leading-relaxed sm:grid-cols-2">
            <CardLei
              titulo="LAI (Lei 12.527/2011)"
              texto="Direito de acesso a informações públicas, com prazos e formato definidos."
            />
            <CardLei
              titulo="Lei de Transparência (LC 131/2009)"
              texto="Divulgação em tempo real de receitas e despesas. Cumprida com atualização D+1."
            />
            <CardLei
              titulo="LGPD (Lei 13.709/2018)"
              texto="Proteção de dados pessoais. Buscas por CPF, RG e CNPJ isolado bloqueadas."
            />
            <CardLei
              titulo="e-MAG e WCAG 2.1 nível AAA"
              texto="Acessibilidade digital obrigatória para sites de governo. Implementado nível superior ao exigido."
            />
            <CardLei
              titulo="Selo Diamante CGU"
              texto="O Portal atual já tem. Esta nova versão preserva o nível e propõe elevar para 100/100."
            />
            <CardLei
              titulo="Lei 14.129/2021 (Gov Digital)"
              texto="Interoperabilidade, dados abertos e governo digital. Usa a API oficial do Portal MA."
            />
          </ul>
        </article>
      </div>
    </section>
  )
}

function CardLei({ titulo, texto }: { titulo: string; texto: string }) {
  return (
    <li className="rounded-md border border-border bg-background p-3">
      <strong className="block text-sm font-semibold text-foreground">
        {titulo}
      </strong>
      <span className="mt-1 block text-xs leading-relaxed text-muted-foreground">
        {texto}
      </span>
    </li>
  )
}

// ═══════════════════════════════════════════════════════════════════
// 11. CTA final
// ═══════════════════════════════════════════════════════════════════
function SecaoCTAFinal() {
  return (
    <section className="relative overflow-hidden border-t border-border bg-gradient-to-br from-primary via-primary to-primary/80 text-primary-foreground">
      <span
        aria-hidden="true"
        className="pointer-events-none absolute -right-24 -top-24 size-72 rounded-full bg-white/10 blur-3xl"
      />
      <span
        aria-hidden="true"
        className="pointer-events-none absolute -left-24 bottom-0 size-72 rounded-full bg-secondary/30 blur-3xl"
      />

      <div className="container-page relative px-4 py-14 text-center">
        <span className="inline-flex items-center justify-center rounded-full bg-white/10 p-3 ring-2 ring-white/30 backdrop-blur">
          <Heart className="size-7 text-white" aria-hidden="true" />
        </span>
        <h2 className="mt-4 font-display text-3xl font-bold tracking-tight md:text-4xl">
          Construído com transparência,
          <br className="hidden md:block" />
          do Maranhão para o Brasil.
        </h2>
        <p className="mx-auto mt-3 max-w-2xl text-sm leading-relaxed text-primary-foreground/85 md:text-base">
          Esta proposta é open-source. Pode ser adaptada para qualquer estado
          ou município brasileiro que queira evoluir seu portal de
          transparência mantendo o compliance.
        </p>

        <div className="mt-7 flex flex-wrap justify-center gap-2">
          <Link
            to="/"
            className="inline-flex items-center gap-2 rounded-md bg-white px-5 py-3 text-sm font-bold text-primary shadow-lg transition-all hover:scale-105"
          >
            <ArrowRight className="size-4" aria-hidden="true" />
            Voltar para a home
          </Link>
          <Link
            to="/cargos"
            className="inline-flex items-center gap-2 rounded-md border-2 border-white/40 bg-white/10 px-5 py-3 text-sm font-semibold text-white backdrop-blur transition-colors hover:bg-white/20"
          >
            <Users className="size-4" aria-hidden="true" />
            Ver todos os cargos
          </Link>
        </div>

        <p className="mt-8 text-xs text-primary-foreground/70">
          Hackathon Transparência Maranhense 2026 ·{" "}
          {formatNumber(320000)} cidadãos atendidos por ano
        </p>
      </div>
    </section>
  )
}

// ─── Helpers reutilizados ─────────────────────────────────────────

function Item({ children }: { children: React.ReactNode }) {
  return (
    <li className="flex items-start gap-2">
      <span
        className="mt-1.5 size-1.5 shrink-0 rounded-full bg-current opacity-50"
        aria-hidden="true"
      />
      <span>{children}</span>
    </li>
  )
}

function Diferencial({
  icon: Icon,
  titulo,
  descricao,
  index,
}: {
  icon: LucideIcon
  titulo: string
  descricao: string
  index: number
}) {
  return (
    <article className="group relative overflow-hidden rounded-xl border border-border bg-card p-5 transition-all hover:-translate-y-1 hover:border-primary/40 hover:shadow-md">
      <span className="flex size-11 items-center justify-center rounded-lg bg-gradient-to-br from-primary to-primary/80 text-primary-foreground shadow-md">
        <Icon className="size-5" aria-hidden="true" />
      </span>
      <h3 className="mt-4 font-display text-base font-bold text-foreground">
        {titulo}
      </h3>
      <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
        {descricao}
      </p>
      <span
        aria-hidden="true"
        className={cn("pointer-events-none absolute inset-x-0 bottom-0 h-1 transition-all duration-300 group-hover:h-1.5", temaCard(index))}
      />
    </article>
  )
}

function BlocoStack({
  icon: Icon,
  titulo,
  itens,
  index,
}: {
  icon: LucideIcon
  titulo: string
  itens: string[]
  index: number
}) {
  return (
    <article className="relative overflow-hidden rounded-xl border border-border bg-card p-5 shadow-sm">
      <header className="flex items-center gap-2">
        <span className="flex size-9 items-center justify-center rounded-md bg-secondary/15 text-secondary-foreground">
          <Icon className="size-5" aria-hidden="true" />
        </span>
        <h3 className="font-display text-base font-bold text-foreground">
          {titulo}
        </h3>
      </header>
      <ul className="mt-4 space-y-1.5 text-sm text-muted-foreground">
        {itens.map((i) => (
          <li key={i} className="flex items-start gap-2">
            <CheckCircle2
              className="mt-0.5 size-3.5 shrink-0 text-success"
              aria-hidden="true"
            />
            <span>{i}</span>
          </li>
        ))}
      </ul>
      <span
        aria-hidden="true"
        className={cn("pointer-events-none absolute inset-x-0 bottom-0 h-1", temaCard(index))}
      />
    </article>
  )
}

function CardEquipe({
  nome,
  papel,
  bio,
  index,
}: {
  nome: string
  papel: string
  bio: string
  index: number
}) {
  const iniciais = nome
    .split(" ")
    .map((p) => p[0])
    .slice(0, 2)
    .join("")

  return (
    <article className="relative overflow-hidden rounded-xl border border-border bg-card p-5 shadow-sm transition-all hover:-translate-y-1 hover:border-primary/40 hover:shadow-md">
      <span className="flex size-14 items-center justify-center rounded-full bg-gradient-to-br from-primary to-primary/70 font-display text-lg font-bold text-primary-foreground shadow-md">
        {iniciais}
      </span>
      <h3 className="mt-4 font-display text-base font-bold text-foreground">
        {nome}
      </h3>
      <p className="mt-0.5 text-xs font-semibold uppercase tracking-wider text-primary">
        {papel}
      </p>
      <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
        {bio}
      </p>
      <span
        aria-hidden="true"
        className={cn("pointer-events-none absolute inset-x-0 bottom-0 h-1", temaCard(index))}
      />
    </article>
  )
}
