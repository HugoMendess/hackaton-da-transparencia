import { useEffect, useState } from "react"
import { Link, useParams } from "react-router-dom"
import {
  ArrowLeft,
  AlertCircle,
  ExternalLink,
  Sparkles,
  FileDown,
  Loader2,
} from "lucide-react"
import { Header } from "@/components/layout/Header"
import { Footer } from "@/components/layout/Footer"
import { BottomNav } from "@/components/layout/BottomNav"
import { CardResumo } from "@/components/dashboard/CardResumo"
import { ConsultaEspecifica } from "@/components/dashboard/ConsultaEspecifica"
import { GraficoBarra } from "@/components/dashboard/GraficoBarra"
import { SerieHistorica } from "@/components/dashboard/SerieHistorica"
import { TextoComGlossario } from "@/components/glossario/TermoTooltip"
import { BotaoCompartilhar } from "@/components/compartilhar/BotaoCompartilhar"
import { EIXOS } from "@/data/eixos"
import { getDadosEixo } from "@/data/eixos-dataset"
import { portalApi, PortalApiError } from "@/services/portalApi"
import { gerarPDFEixo } from "@/lib/gerarPDFEixo"
import { cn } from "@/lib/utils"

type StatusFonte = "carregando" | "oficial" | "fallback"

const EIXOS_COM_CONSULTA: Record<string, string> = {
  "gestao-publica": "Consulte receitas, despesas, contratos, licitações, adiantamentos e ordem cronológica",
  obras: "Consulte o andamento, valores e execução das obras públicas do Maranhão",
  pessoal: "Consulte o quadro de servidores públicos estaduais e a tabela de remunerações",
  "emendas-parlamentares": "Consulte as emendas parlamentares estaduais da ALEMA e os repasses federais",
}

export function Eixo() {
  const { slug = "" } = useParams<{ slug: string }>()
  const eixo = EIXOS.find((e) => e.slug === slug)
  const dados = getDadosEixo(slug)

  const [statusFonte, setStatusFonte] = useState<StatusFonte>("carregando")
  const [erroApi, setErroApi] = useState<string | null>(null)
  const [gerandoPDF, setGerandoPDF] = useState(false)

  async function baixarPDF() {
    if (!dados || gerandoPDF) return
    setGerandoPDF(true)
    try {
      await gerarPDFEixo(eixo!.nome, dados)
    } finally {
      setGerandoPDF(false)
    }
  }

  // Tenta a API real do Portal MA. Em caso de timeout/erro, mantém fallback.
  // Apenas para os 3 eixos com dataset detalhado (gestao-publica, educacao, saude).
  useEffect(() => {
    if (!dados) {
      setStatusFonte("fallback")
      return
    }

    let cancelled = false
    setStatusFonte("carregando")
    portalApi
      .unidades()
      .then(() => {
        if (cancelled) return
        // Sucesso na conexão à API significa que o Portal está acessível.
        // Os dados ainda vêm do dataset curado porque /consulta-despesas
        // está com timeouts longos. Quando a API estabilizar, esta chamada
        // será substituída por /consulta-despesas filtrada.
        setStatusFonte("oficial")
      })
      .catch((e: unknown) => {
        if (cancelled) return
        const msg =
          e instanceof PortalApiError
            ? e.message
            : "Não foi possível confirmar conexão com o Portal"
        setErroApi(msg)
        setStatusFonte("fallback")
      })

    return () => {
      cancelled = true
    }
  }, [dados])

  if (!eixo) {
    return <NaoEncontrado slug={slug} />
  }

  if (!dados) {
    return <EmConstrucao eixo={eixo.nome} />
  }

  const totalAnualMilhoes = dados.serieHistorica
    .filter((d) => d.ano === 2025)
    .reduce((s, d) => s + d.empenhado, 0)

  return (
    <div className="min-h-svh bg-background text-foreground pb-16 md:pb-0">
      <a href="#main" className="skip-link">Pular para o conteúdo</a>
      <Header />

      <main id="main">
        {/* Breadcrumb + título */}
        <section className="relative overflow-hidden border-b border-border bg-gradient-to-b from-accent/40 via-background to-background">
          {/* Glow azul decorativo */}
          <span
            aria-hidden="true"
            className="pointer-events-none absolute -right-24 -top-16 size-72 rounded-full bg-primary/10 blur-3xl"
          />

          <div className="container-page relative px-4 py-6">
            <Link
              to="/"
              className="inline-flex items-center gap-1.5 text-xs font-medium text-muted-foreground transition-colors hover:text-primary"
            >
              <ArrowLeft className="size-3.5" aria-hidden="true" />
              Voltar para a tela inicial
            </Link>

            <div className="mt-3 flex flex-wrap items-baseline gap-3">
              <h1 className="font-display text-3xl font-bold tracking-tight md:text-4xl">
                {eixo.nome}
              </h1>
              <span className="text-sm text-muted-foreground">
                {eixo.descricaoCidada}
              </span>
              <div className="ml-auto flex items-center gap-2">
                <button
                  type="button"
                  onClick={baixarPDF}
                  disabled={gerandoPDF}
                  data-btn-pdf="true"
                  className={cn(
                    "group inline-flex items-center gap-1.5 rounded-lg min-h-touch px-3.5 py-1.5 text-sm font-semibold",
                    "bg-gradient-to-br from-primary to-primary/85 text-primary-foreground",
                    "shadow-[0_2px_4px_rgba(34,90,161,0.20),_0_8px_18px_-6px_rgba(34,90,161,0.40)]",
                    "ring-1 ring-primary/30",
                    "transition-all duration-300 ease-out",
                    "hover:-translate-y-0.5 hover:shadow-[0_4px_8px_rgba(34,90,161,0.25),_0_12px_24px_-6px_rgba(34,90,161,0.55)]",
                    "disabled:cursor-progress disabled:opacity-70 disabled:hover:translate-y-0",
                    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
                  )}
                  aria-label={`Baixar relatório PDF do eixo ${eixo.nome}`}
                  title="Baixar Memorial Cidadão (PDF)"
                >
                  {gerandoPDF ? (
                    <Loader2 className="size-4 animate-spin" aria-hidden="true" />
                  ) : (
                    <FileDown className="size-4 transition-transform duration-300 group-hover:translate-y-0.5" aria-hidden="true" />
                  )}
                  <span>{gerandoPDF ? "Gerando..." : "Baixar PDF"}</span>
                </button>
                <BotaoCompartilhar
                  caminho={`/eixo/${slug}`}
                  mensagem={`📊 ${eixo.nome} no Portal da Transparência: ${dados.resposta}`}
                  rotulo="Compartilhar"
                  variante="padrao"
                />
              </div>
            </div>

            {/* Pergunta-âncora respondida em linguagem cidadã */}
            <article
              data-pergunta-ancora="true"
              className={cn(
                "group relative mt-5 max-w-3xl overflow-hidden rounded-xl border border-primary/30 p-5",
                "bg-gradient-to-br from-accent/30 via-card to-card",
                "shadow-[0_2px_4px_rgba(34,90,161,0.06),_0_10px_28px_-10px_rgba(34,90,161,0.18)]"
              )}
            >
              {/* Glow azul no canto */}
              <span
                aria-hidden="true"
                data-pergunta-glow="true"
                className="pointer-events-none absolute -right-8 -top-8 size-28 rounded-full bg-primary/15 blur-2xl"
              />

              <header className="relative mb-3 flex items-center gap-2.5">
                <span
                  className="flex size-9 items-center justify-center rounded-lg bg-gradient-to-br from-primary to-primary/80 text-primary-foreground shadow-md shadow-primary/30"
                  data-pergunta-icon="true"
                >
                  <Sparkles className="size-4" aria-hidden="true" />
                </span>
                <p className="text-[10px] font-bold uppercase tracking-wider text-primary">
                  Pergunta cidadã respondida pela IA
                </p>
              </header>

              <p className="relative text-base font-semibold leading-snug text-foreground md:text-lg">
                {dados.perguntaAncora}
              </p>

              <div className="relative mt-2 text-sm leading-relaxed text-muted-foreground">
                <TextoComGlossario>{dados.resposta}</TextoComGlossario>
              </div>
            </article>

            <BadgeFonte
              status={statusFonte}
              fonte={dados.fonteOficial}
              erro={erroApi}
            />
          </div>
        </section>

        {/* Cards de resumo */}
        <section className="container-page px-4 py-8">
          <SectionHeader numero="01" titulo="Visão geral" descricao="Os números que importam para o cidadão" />
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {dados.cardsResumo.map((card, i) => (
              <CardResumo key={card.label} card={card} destaque={i === 0} />
            ))}
          </div>
        </section>

        {/* Gráficos */}
        <section className="container-page px-4 pb-8">
          <SectionHeader numero="02" titulo="Como o dinheiro foi usado" descricao={`Composição e evolução do orçamento de R$ ${(totalAnualMilhoes / 1000).toFixed(1)} bilhões em 2025`} />
          <div className="grid gap-4 lg:grid-cols-2">
            <GraficoBarra
              titulo="Composição dos gastos"
              legenda="Onde foi aplicado o orçamento (em milhões de reais)"
              dados={dados.composicaoGastos}
            />
            <SerieHistorica
              titulo="Série histórica anual"
              legenda="Empenhado, liquidado e pago de 2022 a 2026 (parcial)"
              dados={dados.serieHistorica}
            />
          </div>
        </section>

        {/* Destaques (lista com tema rotativo: azul, mostarda, verde) */}
        <section className="container-page px-4 pb-8">
          <SectionHeader numero="03" titulo="Destaques" descricao="Iniciativas e órgãos com maior peso neste eixo" />
          <ul className="grid gap-4 sm:grid-cols-3">
            {dados.destaques.map((d, i) => {
              const tema = TEMAS_DESTAQUE[i % TEMAS_DESTAQUE.length]
              return (
                <li key={d.titulo}>
                  <article
                    data-destaque-card="true"
                    data-destaque-tema={tema.nome}
                    className={cn(
                      "group relative flex h-full flex-col gap-2 overflow-hidden rounded-xl border border-border/70 bg-card p-5",
                      "shadow-[0_1px_2px_rgba(0,0,0,0.04),_0_8px_22px_-10px_rgba(0,0,0,0.08)]",
                      "transition-all duration-300 ease-out",
                      "hover:-translate-y-0.5 hover:border-primary/30 hover:shadow-[0_4px_12px_rgba(34,90,161,0.06),_0_16px_36px_-12px_rgba(34,90,161,0.14)]"
                    )}
                  >
                    {/* Glow no canto */}
                    <span
                      aria-hidden="true"
                      data-destaque-glow="true"
                      className={cn(
                        "pointer-events-none absolute -right-6 -top-6 size-20 rounded-full blur-2xl",
                        tema.glow
                      )}
                    />

                    <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                      {d.subtitulo}
                    </p>
                    <h3 className="font-semibold text-foreground transition-colors group-hover:text-primary">
                      {d.titulo}
                    </h3>
                    <p
                      className={cn(
                        "mt-auto pt-2 font-display text-lg font-bold tabular",
                        tema.textoValor
                      )}
                    >
                      {d.valor}
                    </p>

                    {/* Faixa colorida na base */}
                    <span
                      aria-hidden="true"
                      data-destaque-faixa="true"
                      className={cn(
                        "absolute inset-x-0 bottom-0 h-1 transition-all duration-300 group-hover:h-1.5",
                        tema.faixa
                      )}
                    />
                  </article>
                </li>
              )
            })}
          </ul>
        </section>

        {/* Consulta específica (apenas para os eixos com abas/cards definidos) */}
        {EIXOS_COM_CONSULTA[slug] && (
          <section className="container-page px-4 pb-10">
            <SectionHeader
              numero="04"
              titulo="Consulta específica"
              descricao={EIXOS_COM_CONSULTA[slug]}
            />
            <ConsultaEspecifica eixoSlug={slug} />
          </section>
        )}
      </main>

      <Footer />
      <BottomNav />
    </div>
  )
}

/**
 * Temas rotativos para os 3 cards de destaques.
 * Cada destaque pega uma cor da paleta institucional (azul/mostarda/verde),
 * dando variedade visual sem perder coerência. Strings literais para
 * Tailwind detectar no scan estático.
 */
const TEMAS_DESTAQUE = [
  {
    nome: "azul",
    faixa: "bg-primary",
    glow: "bg-primary/15",
    textoValor: "text-primary",
  },
  {
    nome: "mostarda",
    faixa: "bg-secondary",
    glow: "bg-secondary/20",
    textoValor: "text-secondary-foreground",
  },
  {
    nome: "verde",
    faixa: "bg-success",
    glow: "bg-success/15",
    textoValor: "text-success",
  },
] as const

// --------------------------------------------------------------------
// Cabeçalho de seção numerado (01, 02, 03)
// --------------------------------------------------------------------
function SectionHeader({
  numero,
  titulo,
  descricao,
}: {
  numero: string
  titulo: string
  descricao?: string
}) {
  return (
    <header className="mb-5 flex items-start gap-4">
      <span
        aria-hidden="true"
        data-section-numero="true"
        className={cn(
          "flex size-12 shrink-0 items-center justify-center rounded-xl",
          "bg-gradient-to-br from-primary/15 via-primary/10 to-accent",
          "ring-1 ring-primary/20",
          "font-display text-xl font-bold tabular text-primary"
        )}
      >
        {numero}
      </span>
      <div className="min-w-0 flex-1 pt-1">
        <h2 className="text-lg font-semibold tracking-tight text-foreground md:text-xl">
          {titulo}
        </h2>
        {descricao && (
          <p className="mt-0.5 text-sm leading-relaxed text-muted-foreground">
            {descricao}
          </p>
        )}
      </div>
    </header>
  )
}

// --------------------------------------------------------------------
// Indicador de fonte dos dados (oficial vs fallback)
// --------------------------------------------------------------------
function BadgeFonte({
  status,
  fonte,
  erro,
}: {
  status: StatusFonte
  fonte: { nome: string; url: string }
  erro: string | null
}) {
  return (
    <div className="relative mt-4 flex flex-wrap items-center gap-2 text-xs">
      <span
        data-status-fonte={status}
        className={cn(
          "inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 font-semibold ring-1",
          status === "oficial" && "bg-success/10 text-success ring-success/30",
          status === "fallback" && "bg-secondary/15 text-secondary-foreground ring-secondary/40",
          status === "carregando" && "bg-muted text-muted-foreground ring-border"
        )}
      >
        <span
          className={cn(
            "relative flex size-2 items-center justify-center",
            status === "oficial" && "text-success",
            status === "fallback" && "text-secondary",
            status === "carregando" && "text-muted-foreground"
          )}
          aria-hidden="true"
        >
          {status === "oficial" && (
            <span className="absolute inset-0 animate-ping rounded-full bg-current opacity-50" />
          )}
          <span className="relative size-1.5 rounded-full bg-current" />
        </span>
        {status === "oficial" && "Conexão com o Portal confirmada"}
        {status === "fallback" && "Dados curados (Portal indisponível)"}
        {status === "carregando" && "Verificando o Portal..."}
      </span>

      <a
        href={fonte.url}
        target="_blank"
        rel="noreferrer"
        className="inline-flex items-center gap-1 rounded-full border border-border/70 bg-background px-2.5 py-1 text-muted-foreground transition-colors hover:border-primary/40 hover:text-primary"
      >
        Fonte oficial: <span className="font-semibold text-foreground">{fonte.nome}</span>
        <ExternalLink className="size-3" aria-hidden="true" />
      </a>

      {status === "fallback" && erro && (
        <span className="inline-flex items-center gap-1 text-muted-foreground">
          <AlertCircle className="size-3" aria-hidden="true" />
          {erro}
        </span>
      )}
    </div>
  )
}

// --------------------------------------------------------------------
// Estado: eixo não encontrado
// --------------------------------------------------------------------
function NaoEncontrado({ slug }: { slug: string }) {
  return (
    <div className="min-h-svh bg-background text-foreground">
      <Header />
      <main className="container-page flex flex-col items-center px-4 py-16 text-center">
        <span className="flex size-16 items-center justify-center rounded-full bg-destructive/10 text-destructive">
          <AlertCircle className="size-8" aria-hidden="true" />
        </span>
        <h1 className="mt-4 font-display text-2xl font-bold tracking-tight md:text-3xl">
          Eixo não encontrado
        </h1>
        <p className="mt-2 max-w-md text-sm text-muted-foreground">
          Não conhecemos um eixo com o identificador <code className="rounded bg-muted px-1.5 py-0.5 text-xs font-semibold text-foreground">{slug}</code>.
          Volte para a tela inicial e escolha um dos eixos disponíveis.
        </p>
        <Link
          to="/"
          className={cn(
            "group mt-6 inline-flex items-center gap-2 rounded-lg px-5 py-3 text-sm font-semibold",
            "bg-gradient-to-br from-primary to-primary/85 text-primary-foreground",
            "shadow-[0_2px_4px_rgba(34,90,161,0.20),_0_8px_18px_-6px_rgba(34,90,161,0.40)]",
            "ring-1 ring-primary/30",
            "transition-all duration-300 ease-out",
            "hover:-translate-y-0.5 hover:shadow-[0_4px_8px_rgba(34,90,161,0.25),_0_12px_24px_-6px_rgba(34,90,161,0.55)]"
          )}
        >
          <ArrowLeft className="size-4 transition-transform duration-300 group-hover:-translate-x-0.5" aria-hidden="true" />
          Voltar para a tela inicial
        </Link>
      </main>
    </div>
  )
}

// --------------------------------------------------------------------
// Estado: eixo existe mas dataset detalhado ainda não foi mapeado
// --------------------------------------------------------------------
function EmConstrucao({ eixo }: { eixo: string }) {
  return (
    <div className="min-h-svh bg-background text-foreground">
      <Header />
      <main className="container-page flex flex-col items-center px-4 py-16 text-center">
        <span className="inline-flex items-center gap-1.5 rounded-full border border-secondary/40 bg-secondary/15 px-3 py-1 text-xs font-bold uppercase tracking-wider text-secondary-foreground">
          <Sparkles className="size-3.5" aria-hidden="true" />
          Em construção
        </span>
        <h1 className="mt-4 font-display text-2xl font-bold tracking-tight md:text-3xl">{eixo}</h1>
        <p className="mt-2 max-w-md text-sm leading-relaxed text-muted-foreground">
          Este eixo aparece no mapa do portal mas o dashboard detalhado ainda
          está sendo curado. Os eixos em produção no MVP são{" "}
          <strong className="text-foreground">Gestão Pública</strong>, <strong className="text-foreground">Educação</strong> e{" "}
          <strong className="text-foreground">Saúde</strong>.
        </p>
        <Link
          to="/"
          className={cn(
            "group mt-6 inline-flex items-center gap-2 rounded-lg border border-border bg-background px-5 py-3 text-sm font-semibold text-foreground",
            "shadow-[0_1px_2px_rgba(0,0,0,0.04)]",
            "transition-all duration-300 ease-out",
            "hover:-translate-y-0.5 hover:border-primary/40 hover:shadow-md"
          )}
        >
          <ArrowLeft className="size-4 transition-transform duration-300 group-hover:-translate-x-0.5" aria-hidden="true" />
          Voltar
        </Link>
      </main>
    </div>
  )
}
