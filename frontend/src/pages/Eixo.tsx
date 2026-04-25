import { useEffect, useState } from "react"
import { Link, useParams } from "react-router-dom"
import {
  ArrowLeft,
  AlertCircle,
  ExternalLink,
  Sparkles,
} from "lucide-react"
import { Header } from "@/components/layout/Header"
import { Footer } from "@/components/layout/Footer"
import { BottomNav } from "@/components/layout/BottomNav"
import { CardResumo } from "@/components/dashboard/CardResumo"
import { GraficoBarra } from "@/components/dashboard/GraficoBarra"
import { SerieHistorica } from "@/components/dashboard/SerieHistorica"
import { TextoComGlossario } from "@/components/glossario/TermoTooltip"
import { EIXOS } from "@/data/eixos"
import { getDadosEixo } from "@/data/eixos-dataset"
import { portalApi, PortalApiError } from "@/services/portalApi"
import { cn } from "@/lib/utils"

type StatusFonte = "carregando" | "oficial" | "fallback"

export function Eixo() {
  const { slug = "" } = useParams<{ slug: string }>()
  const eixo = EIXOS.find((e) => e.slug === slug)
  const dados = getDadosEixo(slug)

  const [statusFonte, setStatusFonte] = useState<StatusFonte>("carregando")
  const [erroApi, setErroApi] = useState<string | null>(null)

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
        <section className="border-b border-border bg-gradient-to-b from-accent/30 via-background to-background">
          <div className="container-page px-4 py-6">
            <Link
              to="/"
              className="inline-flex items-center gap-1.5 text-xs font-medium text-muted-foreground transition-colors hover:text-primary"
            >
              <ArrowLeft className="size-3.5" aria-hidden="true" />
              Voltar para a tela inicial
            </Link>

            <div className="mt-3 flex flex-wrap items-baseline gap-3">
              <h1 className="text-2xl font-semibold tracking-tight md:text-3xl">
                {eixo.nome}
              </h1>
              <span className="text-sm text-muted-foreground">
                {eixo.descricaoCidada}
              </span>
            </div>

            {/* Pergunta-âncora respondida em linguagem cidadã */}
            <article className="mt-4 max-w-3xl rounded-lg border border-primary/20 bg-card p-4">
              <header className="mb-2 flex items-center gap-2">
                <span className="flex size-7 items-center justify-center rounded-md bg-primary/10 text-primary">
                  <Sparkles className="size-4" aria-hidden="true" />
                </span>
                <p className="text-xs font-medium uppercase tracking-wide text-primary">
                  Pergunta cidadã respondida
                </p>
              </header>

              <p className="text-base font-medium text-foreground">
                {dados.perguntaAncora}
              </p>

              <div className="mt-2 text-sm leading-relaxed text-muted-foreground">
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

        {/* Destaques (lista) */}
        <section className="container-page px-4 pb-10">
          <SectionHeader numero="03" titulo="Destaques" descricao="Iniciativas e órgãos com maior peso neste eixo" />
          <ul className="grid gap-3 sm:grid-cols-3">
            {dados.destaques.map((d) => (
              <li key={d.titulo}>
                <article className="flex h-full flex-col gap-1 rounded-lg border border-border bg-card p-4 shadow-sm">
                  <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                    {d.subtitulo}
                  </p>
                  <h3 className="font-semibold text-foreground">{d.titulo}</h3>
                  <p className="mt-1 text-base font-semibold tabular text-primary">
                    {d.valor}
                  </p>
                </article>
              </li>
            ))}
          </ul>
        </section>
      </main>

      <Footer />
      <BottomNav />
    </div>
  )
}

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
    <header className="mb-4 flex items-baseline gap-3">
      <span className="font-display text-2xl font-bold text-primary/40">
        {numero}
      </span>
      <div>
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
    <div className="mt-4 flex flex-wrap items-center gap-2 text-xs">
      <span
        className={cn(
          "inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 font-medium",
          status === "oficial" && "bg-success/10 text-success",
          status === "fallback" && "bg-secondary/15 text-secondary-foreground",
          status === "carregando" && "bg-muted text-muted-foreground"
        )}
      >
        <span
          className={cn(
            "size-1.5 rounded-full",
            status === "oficial" && "bg-success",
            status === "fallback" && "bg-secondary",
            status === "carregando" && "animate-pulse bg-muted-foreground"
          )}
          aria-hidden="true"
        />
        {status === "oficial" && "Conexão com o Portal confirmada"}
        {status === "fallback" && "Dados curados (Portal indisponível)"}
        {status === "carregando" && "Verificando o Portal..."}
      </span>

      <a
        href={fonte.url}
        target="_blank"
        rel="noreferrer"
        className="inline-flex items-center gap-1 text-muted-foreground transition-colors hover:text-primary"
      >
        Fonte oficial: {fonte.nome}
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
        <h1 className="text-2xl font-semibold">Eixo não encontrado</h1>
        <p className="mt-2 max-w-md text-sm text-muted-foreground">
          Não conhecemos um eixo com o identificador <code className="rounded bg-muted px-1.5 py-0.5 text-xs">{slug}</code>.
          Volte para a tela inicial e escolha um dos eixos disponíveis.
        </p>
        <Link
          to="/"
          className="mt-6 inline-flex items-center gap-2 rounded-md bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
        >
          <ArrowLeft className="size-4" aria-hidden="true" />
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
        <span className="rounded-full bg-secondary/15 px-3 py-1 text-xs font-medium text-secondary-foreground">
          Em construção
        </span>
        <h1 className="mt-4 text-2xl font-semibold">{eixo}</h1>
        <p className="mt-2 max-w-md text-sm leading-relaxed text-muted-foreground">
          Este eixo aparece no mapa do portal mas o dashboard detalhado ainda
          está sendo curado. Os eixos em produção no MVP são{" "}
          <strong>Gestão Pública</strong>, <strong>Educação</strong> e{" "}
          <strong>Saúde</strong>.
        </p>
        <Link
          to="/"
          className="mt-6 inline-flex items-center gap-2 rounded-md border border-border bg-background px-4 py-2.5 text-sm font-medium transition-colors hover:bg-muted"
        >
          <ArrowLeft className="size-4" aria-hidden="true" />
          Voltar
        </Link>
      </main>
    </div>
  )
}
