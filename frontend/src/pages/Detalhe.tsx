import { useEffect, useMemo, useState } from "react"
import { Link, useSearchParams } from "react-router-dom"
import {
  Search,
  Calendar,
  TrendingUp,
  ArrowLeft,
  ExternalLink,
  Building2,
  MapPin,
  Briefcase,
  User,
  FileText,
  type LucideIcon,
} from "lucide-react"
import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts"
import { Header } from "@/components/layout/Header"
import { Footer } from "@/components/layout/Footer"
import { BottomNav } from "@/components/layout/BottomNav"
import { CardResumo } from "@/components/dashboard/CardResumo"
import { TextoComGlossario } from "@/components/glossario/TermoTooltip"
import { BotaoCompartilhar } from "@/components/compartilhar/BotaoCompartilhar"
import { EIXOS } from "@/data/eixos"
import { cn, formatBRL, formatNumber } from "@/lib/utils"

const TIPO_ICONS: Record<string, LucideIcon> = {
  fornecedor: Briefcase,
  municipio: MapPin,
  orgao: Building2,
  cargo: User,
  termo: Search,
}

const TIPO_LABELS: Record<string, string> = {
  fornecedor: "Fornecedor",
  municipio: "Município",
  orgao: "Órgão",
  cargo: "Cargo",
  termo: "Termo",
}

type Transacao = {
  data: string
  descricao: string
  orgao: string
  natureza: string
  valor: number
  status: "Pago" | "Liquidado" | "Empenhado"
}

type EvolucaoMes = {
  mes: string
  valor: number
}

export function Detalhe() {
  const [params] = useSearchParams()
  const termo = params.get("q") ?? ""
  const tipoParam = (params.get("tipo") ?? "termo").toLowerCase()
  const eixoSlug = params.get("eixo") ?? "gestao-publica"
  const tipo = tipoParam in TIPO_LABELS ? tipoParam : "termo"

  const [carregando, setCarregando] = useState(true)

  const eixo = useMemo(
    () => EIXOS.find((e) => e.slug === eixoSlug) ?? EIXOS[0],
    [eixoSlug]
  )

  const dados = useMemo(() => gerarDadosDetalhe(termo, tipo, eixoSlug), [
    termo,
    tipo,
    eixoSlug,
  ])

  useEffect(() => {
    // Pequeno loading para indicar carregamento (UX de feedback)
    setCarregando(true)
    const t = setTimeout(() => setCarregando(false), 350)
    return () => clearTimeout(t)
  }, [termo, tipo, eixoSlug])

  if (!termo) {
    return <SemTermo />
  }

  const Icon = TIPO_ICONS[tipo] ?? Search
  const tipoLabel = TIPO_LABELS[tipo] ?? "Termo"

  return (
    <div className="min-h-svh bg-background text-foreground pb-16 md:pb-0">
      <a href="#main" className="skip-link">Pular para o conteúdo</a>
      <Header />

      <main id="main">
        {/* Cabeçalho com contexto */}
        <section className="border-b border-border bg-gradient-to-b from-accent/30 via-background to-background">
          <div className="container-page px-4 py-6">
            <Link
              to="/busca"
              className="inline-flex items-center gap-1.5 text-xs font-medium text-muted-foreground transition-colors hover:text-primary"
            >
              <ArrowLeft className="size-3.5" aria-hidden="true" />
              Voltar para os resultados da busca
            </Link>

            <div className="mt-3 flex flex-wrap items-start gap-3">
              <span className="flex size-11 shrink-0 items-center justify-center rounded-md bg-primary text-primary-foreground">
                <Icon className="size-5" aria-hidden="true" />
              </span>
              <div className="min-w-0 flex-1">
                <p className="text-xs font-medium uppercase tracking-wider text-primary">
                  Detalhamento por {tipoLabel}
                </p>
                <h1 className="mt-0.5 break-words font-display text-2xl font-bold leading-tight tracking-tight md:text-3xl">
                  {termo}
                </h1>
                <p className="mt-1 text-sm text-muted-foreground">
                  Eixo aplicável:{" "}
                  <Link
                    to={`/eixo/${eixo.slug}`}
                    className="font-medium text-primary underline-offset-2 hover:underline"
                  >
                    {eixo.nome}
                  </Link>
                </p>
              </div>
            </div>

            {/* Resposta cidadã contextualizada */}
            <article className="mt-4 max-w-3xl rounded-md border border-primary/20 bg-card p-3 text-sm leading-relaxed">
              <TextoComGlossario>{dados.resposta}</TextoComGlossario>
            </article>
          </div>
        </section>

        {/* Cards de resumo */}
        <section className="container-page px-4 py-6">
          <h2 className="sr-only">Resumo do detalhamento</h2>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {dados.cards.map((card, i) => (
              <CardResumo key={card.label} card={card} destaque={i === 0} />
            ))}
          </div>
        </section>

        {/* Gráfico de evolução mensal */}
        <section className="container-page px-4 pb-6">
          <article className="rounded-lg border border-border bg-card p-4 shadow-sm">
            <header className="mb-3 flex items-start gap-2">
              <span className="mt-0.5 flex size-7 items-center justify-center rounded-md bg-primary/10 text-primary">
                <TrendingUp className="size-4" aria-hidden="true" />
              </span>
              <div>
                <h3 className="font-semibold text-foreground">
                  Evolução nos últimos 12 meses
                </h3>
                <p className="mt-0.5 text-xs leading-relaxed text-muted-foreground">
                  Valor empenhado por mês (em milhões de reais)
                </p>
              </div>
            </header>

            <div role="img" aria-label="Gráfico de evolução mensal">
              <ResponsiveContainer width="100%" height={240}>
                <BarChart data={dados.evolucao} margin={{ top: 4, right: 12, left: 0, bottom: 4 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis dataKey="mes" stroke="hsl(var(--muted-foreground))" fontSize={12} />
                  <YAxis
                    stroke="hsl(var(--muted-foreground))"
                    tickFormatter={(v) => `R$ ${(v / 1000).toFixed(1)} mi`}
                    fontSize={11}
                  />
                  <Tooltip
                    contentStyle={{
                      borderRadius: "0.5rem",
                      border: "1px solid hsl(var(--border))",
                      background: "hsl(var(--card))",
                      fontSize: "0.875rem",
                    }}
                    formatter={(value) => {
                      const num = typeof value === "number" ? value : Number(value)
                      return formatBRL(num * 1000)
                    }}
                    labelFormatter={(mes) => `Mês: ${mes}`}
                  />
                  <Bar dataKey="valor" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* Tabela alternativa para acessibilidade */}
            <table className="sr-only">
              <caption>Evolução mensal de {termo}</caption>
              <thead>
                <tr>
                  <th scope="col">Mês</th>
                  <th scope="col">Valor</th>
                </tr>
              </thead>
              <tbody>
                {dados.evolucao.map((m) => (
                  <tr key={m.mes}>
                    <th scope="row">{m.mes}</th>
                    <td>{formatBRL(m.valor * 1000)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </article>
        </section>

        {/* Tabela de transações detalhadas */}
        <section className="container-page px-4 pb-10">
          <article className="rounded-lg border border-border bg-card shadow-sm">
            <header className="flex items-start gap-2 border-b border-border p-4">
              <span className="mt-0.5 flex size-7 items-center justify-center rounded-md bg-primary/10 text-primary">
                <FileText className="size-4" aria-hidden="true" />
              </span>
              <div className="flex-1">
                <h3 className="font-semibold text-foreground">
                  Últimas {dados.transacoes.length} transações
                </h3>
                <p className="mt-0.5 text-xs leading-relaxed text-muted-foreground">
                  Notas de empenho, liquidação e pagamento
                </p>
              </div>
            </header>

            {carregando ? (
              <div className="space-y-2 p-4">
                {[0, 1, 2, 3, 4].map((i) => (
                  <div
                    key={i}
                    className="h-14 animate-pulse rounded-md bg-muted"
                    style={{ animationDelay: `${i * 60}ms` }}
                  />
                ))}
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="border-b border-border bg-muted/40">
                    <tr>
                      <th scope="col" className="px-4 py-2 text-left font-medium text-muted-foreground">
                        Data
                      </th>
                      <th scope="col" className="px-4 py-2 text-left font-medium text-muted-foreground">
                        Descrição
                      </th>
                      <th scope="col" className="hidden px-4 py-2 text-left font-medium text-muted-foreground md:table-cell">
                        Órgão
                      </th>
                      <th scope="col" className="hidden px-4 py-2 text-left font-medium text-muted-foreground lg:table-cell">
                        Natureza
                      </th>
                      <th scope="col" className="px-4 py-2 text-right font-medium text-muted-foreground">
                        Valor
                      </th>
                      <th scope="col" className="px-4 py-2 text-center font-medium text-muted-foreground">
                        Status
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {dados.transacoes.map((t, i) => (
                      <tr
                        key={i}
                        className="border-b border-border last:border-0 transition-colors hover:bg-accent/20"
                      >
                        <td className="px-4 py-2.5 text-xs tabular text-muted-foreground">
                          <span className="inline-flex items-center gap-1">
                            <Calendar className="size-3" aria-hidden="true" />
                            {t.data}
                          </span>
                        </td>
                        <td className="px-4 py-2.5 font-medium text-foreground">
                          {t.descricao}
                        </td>
                        <td className="hidden px-4 py-2.5 text-xs text-muted-foreground md:table-cell">
                          {t.orgao}
                        </td>
                        <td className="hidden px-4 py-2.5 text-xs text-muted-foreground lg:table-cell">
                          {t.natureza}
                        </td>
                        <td className="px-4 py-2.5 text-right tabular font-semibold text-foreground">
                          {formatBRL(t.valor)}
                        </td>
                        <td className="px-4 py-2.5 text-center">
                          <span
                            className={cn(
                              "inline-flex items-center rounded-full px-2 py-0.5 text-[11px] font-medium",
                              t.status === "Pago" && "bg-success/10 text-success",
                              t.status === "Liquidado" && "bg-info/10 text-info",
                              t.status === "Empenhado" && "bg-secondary/15 text-secondary-foreground"
                            )}
                          >
                            {t.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </article>

          {/* Ações */}
          <div className="mt-4 flex flex-wrap gap-2">
            <Link
              to={`/eixo/${eixo.slug}`}
              className="inline-flex items-center gap-1.5 rounded-md border border-border bg-background px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-muted"
            >
              <ExternalLink className="size-4" aria-hidden="true" />
              Ver eixo {eixo.nome}
            </Link>
            <Link
              to="/busca"
              className="inline-flex items-center gap-1.5 rounded-md bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90"
            >
              <Search className="size-4" aria-hidden="true" />
              Nova busca
            </Link>
            <BotaoCompartilhar
              caminho={`/detalhe?q=${encodeURIComponent(termo)}&tipo=${tipo}&eixo=${eixo.slug}`}
              mensagem={`🔍 Olha o que descobri sobre "${termo}" (${tipoLabel}) no Portal da Transparência: ${dados.resposta}`}
              rotulo="Compartilhar"
              variante="primario"
            />
          </div>

          <p className="mt-4 rounded-md border border-secondary/30 bg-secondary/10 p-2 text-xs text-foreground">
            Dados gerados a partir de modelo de consolidação. Em produção,
            virão diretamente do SIAFEM via Edge Function.
          </p>
        </section>
      </main>

      <Footer />
      <BottomNav />
    </div>
  )
}

function SemTermo() {
  return (
    <div className="min-h-svh bg-background text-foreground">
      <Header />
      <main className="container-page flex flex-col items-center px-4 py-16 text-center">
        <Search className="mx-auto size-8 text-muted-foreground/60" aria-hidden="true" />
        <h1 className="mt-3 text-2xl font-semibold">Nenhum termo informado</h1>
        <p className="mt-2 max-w-md text-sm text-muted-foreground">
          Esta página mostra o detalhamento de um termo buscado. Volte para
          a busca e selecione um resultado.
        </p>
        <Link
          to="/busca"
          className="mt-6 inline-flex items-center gap-2 rounded-md bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
        >
          <ArrowLeft className="size-4" aria-hidden="true" />
          Ir para a busca
        </Link>
      </main>
    </div>
  )
}

// --------------------------------------------------------------------
// Geração de dados determinística por termo
// --------------------------------------------------------------------
function gerarDadosDetalhe(termo: string, tipo: string, eixoSlug: string) {
  const seed = hashString(`${termo}-${tipo}-${eixoSlug}`)

  const valorTotal = Math.round(((seed % 480) + 25) * 1_000_000)
  const numNotas = (seed % 88) + 12
  const numContratos = (seed % 18) + 2
  const valorMedio = Math.round(valorTotal / numNotas)

  const respostas: Record<string, string> = {
    fornecedor: `${capitalize(termo)} é um fornecedor com ${formatNumber(numContratos)} contratos vigentes no ${eixoNome(eixoSlug)}. Recebeu um total de ${formatBRL(valorTotal)} consolidados em ${formatNumber(numNotas)} notas de empenho nos últimos 12 meses.`,
    municipio: `O município ${capitalize(termo)} concentra ${formatBRL(valorTotal)} em gastos públicos no ${eixoNome(eixoSlug)} ao longo dos últimos 12 meses, distribuídos em ${formatNumber(numNotas)} despesas e ${formatNumber(numContratos)} contratos firmados.`,
    orgao: `${capitalize(termo)} executou ${formatBRL(valorTotal)} no ${eixoNome(eixoSlug)} no período. Foram ${formatNumber(numNotas)} notas de empenho processadas e ${formatNumber(numContratos)} contratos vigentes em execução.`,
    cargo: `O cargo "${capitalize(termo)}" tem em média ${formatBRL(valorMedio / 100)} em remuneração mensal. Considerando todos os servidores neste cargo, somou ${formatBRL(valorTotal)} em folha nos últimos 12 meses.`,
    termo: `Resultados consolidados para "${capitalize(termo)}" no ${eixoNome(eixoSlug)}: ${formatBRL(valorTotal)} em ${formatNumber(numNotas)} notas, ${formatNumber(numContratos)} contratos relacionados.`,
  }

  const cards = [
    {
      label: "Valor total",
      valor: formatBRL(valorTotal),
      legenda: "Acumulado 12 meses",
      variacao: { texto: `+${(seed % 12) + 2}% vs ano anterior`, positiva: true },
    },
    {
      label: "Notas de empenho",
      valor: formatNumber(numNotas),
      legenda: "Processadas no período",
    },
    {
      label: "Contratos vigentes",
      valor: formatNumber(numContratos),
      legenda: "Em execução",
    },
    {
      label: "Valor médio por nota",
      valor: formatBRL(valorMedio),
      legenda: "Média do período",
    },
  ]

  // Evolução mensal (últimos 12 meses)
  const meses = [
    "Mai/25", "Jun/25", "Jul/25", "Ago/25", "Set/25", "Out/25",
    "Nov/25", "Dez/25", "Jan/26", "Fev/26", "Mar/26", "Abr/26",
  ]
  const evolucao: EvolucaoMes[] = meses.map((mes, i) => ({
    mes,
    valor: ((seed + i * 73) % 38) + 4, // 4 a 41 (em milhões)
  }))

  // Transações detalhadas (15 itens)
  const orgaos = ["SEDUC", "SES", "SEAD", "SINFRA", "PMMA", "SEINC"]
  const naturezas = ["Material de consumo", "Serviços de terceiros", "Pessoal", "Equipamentos", "Obras"]
  const statusOpcoes: Transacao["status"][] = ["Pago", "Liquidado", "Empenhado"]

  const transacoes: Transacao[] = Array.from({ length: 15 }, (_, i) => {
    const dia = ((seed + i * 7) % 28) + 1
    const mes = ((seed + i * 11) % 12) + 1
    const valor = ((seed + i * 137) % 280 + 12) * 100_000
    return {
      data: `${String(dia).padStart(2, "0")}/${String(mes).padStart(2, "0")}/2026`,
      descricao: gerarDescricaoTransacao(termo, tipo, i, seed),
      orgao: orgaos[(seed + i * 3) % orgaos.length],
      natureza: naturezas[(seed + i * 5) % naturezas.length],
      valor,
      status: statusOpcoes[(seed + i * 13) % statusOpcoes.length],
    }
  })

  return {
    resposta: respostas[tipo] ?? respostas.termo,
    cards,
    evolucao,
    transacoes,
  }
}

function gerarDescricaoTransacao(termo: string, tipo: string, i: number, seed: number): string {
  const acoes = [
    "Aquisição de",
    "Serviço prestado por",
    "Manutenção contratada com",
    "Locação de equipamento de",
    "Consultoria contratada com",
    "Material adquirido de",
  ]
  const acao = acoes[(seed + i * 7) % acoes.length]
  if (tipo === "fornecedor") return `${acao} ${capitalize(termo)}`
  if (tipo === "municipio") return `Despesa em ${capitalize(termo)}`
  if (tipo === "orgao") return `Empenho da ${capitalize(termo)}`
  if (tipo === "cargo") return `Folha de ${capitalize(termo)}`
  return `Despesa relacionada a ${capitalize(termo)}`
}

function eixoNome(slug: string): string {
  const e = EIXOS.find((x) => x.slug === slug)
  return e?.nome ?? "eixo público"
}

function hashString(s: string): number {
  let h = 5381
  for (let i = 0; i < s.length; i++) {
    h = ((h << 5) + h + s.charCodeAt(i)) | 0
  }
  return Math.abs(h) % 99999
}

function capitalize(s: string): string {
  return s.replace(/\b\w/g, (c) => c.toUpperCase())
}
