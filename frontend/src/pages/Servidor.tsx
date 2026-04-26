import { useMemo } from "react"
import { Link, useSearchParams } from "react-router-dom"
import {
  ArrowLeft,
  User,
  Calendar,
  Briefcase,
  MapPin,
  TrendingUp,
  PieChart as PieIcon,
  Wallet,
  Hash,
  ExternalLink,
} from "lucide-react"
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts"
import { Header } from "@/components/layout/Header"
import { Footer } from "@/components/layout/Footer"
import { BottomNav } from "@/components/layout/BottomNav"
import { EIXOS } from "@/data/eixos"
import {
  gerarServidores,
  gerarHistoricoMensal,
  hashTermo,
  identificarCargo,
} from "@/data/servidores"
import { cn, formatBRL } from "@/lib/utils"

/**
 * Extrato completo do servidor.
 *
 * URL: /servidor?cargo=Professor&eixo=educacao&idx=3
 *
 * O servidor é regerado deterministicamente pelos mesmos parâmetros usados
 * em /detalhe (mesma seed, mesmo cargoMeta, mesma posição na lista). Isso
 * permite navegação direta sem persistir estado.
 */

export function Servidor() {
  const [params] = useSearchParams()
  const cargo = params.get("cargo") ?? "Professor"
  const eixoParam = params.get("eixo") ?? "educacao"
  const idx = Math.max(0, parseInt(params.get("idx") ?? "0", 10) || 0)

  // Reaproveita a correção automática do eixo: se o cargo é "Professor"
  // e o eixo veio errado, força para o correto (mesmo comportamento de /detalhe)
  const eixoSlug = useMemo(() => {
    const cargoMeta = identificarCargo(cargo)
    return cargoMeta?.slug ?? eixoParam
  }, [cargo, eixoParam])

  const eixo = useMemo(
    () => EIXOS.find((e) => e.slug === eixoSlug) ?? EIXOS[0],
    [eixoSlug]
  )

  // Regera a lista completa e seleciona o servidor pelo índice. Total fixo
  // em 12 garante que /servidor?idx=11 sempre retorne o mesmo registro.
  const servidor = useMemo(() => {
    const seed = hashTermo(`${cargo}-${eixoSlug}`)
    const cargoMeta = identificarCargo(cargo)
    const lista = gerarServidores(cargo, eixoSlug, seed, cargoMeta, 12)
    return lista[Math.min(idx, lista.length - 1)] ?? lista[0]
  }, [cargo, eixoSlug, idx])

  const historico = useMemo(() => gerarHistoricoMensal(servidor), [servidor])

  const proventosAno = historico.reduce((s, m) => s + m.totalProventos, 0)
  const descontosAno = historico.reduce((s, m) => s + m.totalDescontos, 0)
  const liquidoAno = historico.reduce((s, m) => s + m.liquido, 0)

  // Composição do mês de janeiro (referência) para o gráfico de pizza
  const composicaoProventos = [
    { nome: "Vencimento", valor: servidor.vencimento, cor: "hsl(var(--primary))" },
    { nome: "Gratificação", valor: servidor.gratificacao, cor: "hsl(var(--info))" },
    { nome: "Adicional Tempo", valor: servidor.adicionalTempo, cor: "hsl(var(--secondary))" },
    { nome: "Outros", valor: servidor.outrosProventos, cor: "hsl(var(--success))" },
  ]

  return (
    <div className="min-h-svh bg-background text-foreground pb-16 md:pb-0">
      <a href="#main" className="skip-link">
        Pular para o conteúdo
      </a>
      <Header />

      <main id="main">
        {/* Cabeçalho com identificação do servidor */}
        <section className="relative overflow-hidden border-b border-border bg-gradient-to-b from-accent/40 via-background to-background">
          <span
            aria-hidden="true"
            className="pointer-events-none absolute -right-24 -top-16 size-72 rounded-full bg-primary/10 blur-3xl"
          />
          <div className="container-page relative px-4 py-6">
            <Link
              to={`/detalhe?q=${encodeURIComponent(cargo)}&tipo=cargo&eixo=${eixoSlug}`}
              className="inline-flex items-center gap-1.5 text-xs font-medium text-muted-foreground transition-colors hover:text-primary"
            >
              <ArrowLeft className="size-3.5" aria-hidden="true" />
              Voltar para a lista de servidores
            </Link>

            <div className="mt-3 flex flex-wrap items-start gap-4">
              <span className="flex size-14 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
                <User className="size-7" aria-hidden="true" />
              </span>
              <div className="min-w-0 flex-1">
                <p className="text-xs font-medium uppercase tracking-wider text-primary">
                  Extrato completo do servidor
                </p>
                <h1 className="mt-0.5 break-words font-display text-2xl font-bold leading-tight tracking-tight md:text-3xl">
                  {servidor.nome}
                </h1>
                <p className="mt-1 text-sm text-foreground">
                  {servidor.cargoNivel}
                </p>
                <Link
                  to={`/eixo/${eixo.slug}`}
                  className="mt-1 inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-primary"
                >
                  Eixo: <span className="font-medium underline-offset-2 hover:underline">{eixo.nome}</span>
                  <ExternalLink className="size-3" aria-hidden="true" />
                </Link>
              </div>
            </div>

            {/* Grid de identificação */}
            <dl className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-4">
              <CardIdentificacao
                icone={Briefcase}
                label="Órgão"
                valor={servidor.orgao}
              />
              <CardIdentificacao
                icone={MapPin}
                label="Lotação"
                valor={servidor.lotacao}
              />
              <CardIdentificacao
                icone={Calendar}
                label="Admissão"
                valor={servidor.admissao}
              />
              <CardIdentificacao
                icone={Hash}
                label="CPF"
                valor="***.***.***-**"
                aviso="Mascarado por LGPD"
              />
            </dl>
          </div>
        </section>

        {/* Cards-resumo: panorama anual */}
        <section className="container-page px-4 py-6">
          <h2 className="mb-3 text-sm font-semibold uppercase tracking-wider text-muted-foreground">
            Panorama de 2026
          </h2>
          <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
            <CardResumoPainel
              label="Líquido mensal"
              valor={formatBRL(servidor.liquido)}
              cor="text-primary"
              icone={Wallet}
              destaque
            />
            <CardResumoPainel
              label="Proventos no ano"
              valor={formatBRL(proventosAno)}
              cor="text-success"
              legenda="Vencimentos + gratificações + 13º"
              icone={TrendingUp}
            />
            <CardResumoPainel
              label="Descontos no ano"
              valor={formatBRL(descontosAno)}
              cor="text-destructive"
              legenda="Previdência + IRPF + outros"
            />
            <CardResumoPainel
              label="Líquido no ano"
              valor={formatBRL(liquidoAno)}
              cor="text-foreground"
              legenda="O que efetivamente recebeu"
            />
          </div>
        </section>

        {/* Dashboard: gráficos no topo */}
        <section className="container-page px-4 pb-6">
          <div className="grid gap-4 lg:grid-cols-3">
            {/* Linha: evolução do líquido mensal */}
            <article className="rounded-lg border border-border bg-card p-4 shadow-sm lg:col-span-2">
              <header className="mb-3 flex items-start gap-2">
                <span className="mt-0.5 flex size-7 items-center justify-center rounded-md bg-primary/10 text-primary">
                  <TrendingUp className="size-4" aria-hidden="true" />
                </span>
                <div>
                  <h3 className="font-semibold text-foreground">
                    Evolução mensal em 2026
                  </h3>
                  <p className="mt-0.5 text-xs leading-relaxed text-muted-foreground">
                    Picos em Junho (terço de férias) e Dezembro (13º salário)
                  </p>
                </div>
              </header>
              <div role="img" aria-label="Gráfico de linha da evolução mensal do líquido">
                <ResponsiveContainer width="100%" height={240}>
                  <LineChart data={historico} margin={{ top: 4, right: 12, left: 0, bottom: 4 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                    <XAxis dataKey="mes" stroke="hsl(var(--muted-foreground))" fontSize={11} />
                    <YAxis
                      stroke="hsl(var(--muted-foreground))"
                      tickFormatter={(v) => `${(v / 1000).toFixed(1)}k`}
                      fontSize={11}
                    />
                    <Tooltip
                      contentStyle={{
                        borderRadius: "0.5rem",
                        border: "1px solid hsl(var(--border))",
                        background: "hsl(var(--card))",
                        fontSize: "0.875rem",
                      }}
                      formatter={(value, name) => [
                        formatBRL(Number(value)),
                        name === "totalProventos"
                          ? "Proventos"
                          : name === "totalDescontos"
                          ? "Descontos"
                          : "Líquido",
                      ]}
                      labelFormatter={(mes) => `Mês: ${mes}/2026`}
                    />
                    <Legend
                      wrapperStyle={{ fontSize: "0.75rem", paddingTop: "0.5rem" }}
                      formatter={(name: string) =>
                        name === "totalProventos"
                          ? "Proventos"
                          : name === "totalDescontos"
                          ? "Descontos"
                          : "Líquido"
                      }
                    />
                    <Line
                      type="monotone"
                      dataKey="totalProventos"
                      stroke="hsl(var(--success))"
                      strokeWidth={2}
                      dot={{ r: 3 }}
                    />
                    <Line
                      type="monotone"
                      dataKey="totalDescontos"
                      stroke="hsl(var(--destructive))"
                      strokeWidth={2}
                      dot={{ r: 3 }}
                    />
                    <Line
                      type="monotone"
                      dataKey="liquido"
                      stroke="hsl(var(--primary))"
                      strokeWidth={3}
                      dot={{ r: 4 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </article>

            {/* Pizza: composição dos proventos */}
            <article className="rounded-lg border border-border bg-card p-4 shadow-sm">
              <header className="mb-3 flex items-start gap-2">
                <span className="mt-0.5 flex size-7 items-center justify-center rounded-md bg-primary/10 text-primary">
                  <PieIcon className="size-4" aria-hidden="true" />
                </span>
                <div>
                  <h3 className="font-semibold text-foreground">
                    Composição dos proventos
                  </h3>
                  <p className="mt-0.5 text-xs leading-relaxed text-muted-foreground">
                    Como o salário base se distribui em janeiro
                  </p>
                </div>
              </header>
              <div role="img" aria-label="Gráfico de pizza com composição dos proventos">
                <ResponsiveContainer width="100%" height={200}>
                  <PieChart>
                    <Pie
                      data={composicaoProventos}
                      dataKey="valor"
                      nameKey="nome"
                      cx="50%"
                      cy="50%"
                      innerRadius={42}
                      outerRadius={72}
                      paddingAngle={2}
                    >
                      {composicaoProventos.map((c) => (
                        <Cell key={c.nome} fill={c.cor} />
                      ))}
                    </Pie>
                    <Tooltip
                      contentStyle={{
                        borderRadius: "0.5rem",
                        border: "1px solid hsl(var(--border))",
                        background: "hsl(var(--card))",
                        fontSize: "0.875rem",
                      }}
                      formatter={(value) => formatBRL(Number(value))}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <ul className="mt-2 space-y-1 text-xs">
                {composicaoProventos.map((c) => (
                  <li
                    key={c.nome}
                    className="flex items-center justify-between gap-2"
                  >
                    <span className="flex items-center gap-1.5">
                      <span
                        className="size-2.5 shrink-0 rounded-sm"
                        style={{ background: c.cor }}
                      />
                      <span className="text-muted-foreground">{c.nome}</span>
                    </span>
                    <span className="tabular font-medium text-foreground">
                      {formatBRL(c.valor)}
                    </span>
                  </li>
                ))}
              </ul>
            </article>
          </div>
        </section>

        {/* Barras empilhadas: proventos e descontos lado a lado */}
        <section className="container-page px-4 pb-6">
          <article className="rounded-lg border border-border bg-card p-4 shadow-sm">
            <header className="mb-3 flex items-start gap-2">
              <span className="mt-0.5 flex size-7 items-center justify-center rounded-md bg-primary/10 text-primary">
                <Wallet className="size-4" aria-hidden="true" />
              </span>
              <div>
                <h3 className="font-semibold text-foreground">
                  Proventos vs Descontos por mês
                </h3>
                <p className="mt-0.5 text-xs leading-relaxed text-muted-foreground">
                  Comparativo direto, em reais, ao longo de 2026
                </p>
              </div>
            </header>
            <div role="img" aria-label="Gráfico de barras agrupadas comparando proventos e descontos por mês">
              <ResponsiveContainer width="100%" height={260}>
                <BarChart data={historico} margin={{ top: 4, right: 12, left: 0, bottom: 4 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis dataKey="mes" stroke="hsl(var(--muted-foreground))" fontSize={11} />
                  <YAxis
                    stroke="hsl(var(--muted-foreground))"
                    tickFormatter={(v) => `${(v / 1000).toFixed(1)}k`}
                    fontSize={11}
                  />
                  <Tooltip
                    contentStyle={{
                      borderRadius: "0.5rem",
                      border: "1px solid hsl(var(--border))",
                      background: "hsl(var(--card))",
                      fontSize: "0.875rem",
                    }}
                    formatter={(value, name) => [
                      formatBRL(Number(value)),
                      name === "totalProventos" ? "Proventos" : "Descontos",
                    ]}
                  />
                  <Legend
                    wrapperStyle={{ fontSize: "0.75rem", paddingTop: "0.5rem" }}
                    formatter={(name: string) =>
                      name === "totalProventos" ? "Proventos" : "Descontos"
                    }
                  />
                  <Bar
                    dataKey="totalProventos"
                    fill="hsl(var(--success))"
                    radius={[3, 3, 0, 0]}
                  />
                  <Bar
                    dataKey="totalDescontos"
                    fill="hsl(var(--destructive))"
                    radius={[3, 3, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </article>
        </section>

        {/* Tabela mensal completa (substituto do "HISTÓRICO REMUNERAÇÃO" do portal atual) */}
        <section className="container-page px-4 pb-10">
          <article className="rounded-lg border border-border bg-card shadow-sm">
            <header className="border-b border-border p-4">
              <h3 className="font-semibold text-foreground">
                Histórico mensal de remuneração 2026
              </h3>
              <p className="mt-0.5 text-xs leading-relaxed text-muted-foreground">
                Detalhamento de todas as rubricas mês a mês. Valores em reais.
              </p>
            </header>
            <div className="overflow-x-auto">
              <table className="w-full text-xs">
                <thead className="border-b border-border bg-muted/40">
                  <tr>
                    <th
                      scope="col"
                      className="sticky left-0 bg-muted/40 px-3 py-2 text-left font-semibold text-muted-foreground"
                    >
                      Rubrica
                    </th>
                    {historico.map((m) => (
                      <th
                        key={m.mes}
                        scope="col"
                        className="px-3 py-2 text-right font-semibold text-muted-foreground"
                      >
                        {m.mes}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  <LinhaTabela rotulo="Vencimento" valores={historico.map((m) => m.vencimento)} />
                  <LinhaTabela rotulo="Gratificação técnica" valores={historico.map((m) => m.gratificacao)} />
                  <LinhaTabela rotulo="Adicional por tempo de serviço" valores={historico.map((m) => m.adicionalTempo)} />
                  <LinhaTabela rotulo="Outros proventos" valores={historico.map((m) => m.outrosProventos)} />
                  <LinhaTabela
                    rotulo="Total proventos"
                    valores={historico.map((m) => m.totalProventos)}
                    destaque="success"
                  />
                  <LinhaTabela rotulo="Contribuição previdenciária" valores={historico.map((m) => m.previdencia)} />
                  <LinhaTabela rotulo="IRPF" valores={historico.map((m) => m.irpf)} />
                  <LinhaTabela rotulo="Outros descontos" valores={historico.map((m) => m.outrosDescontos)} />
                  <LinhaTabela
                    rotulo="Total descontos"
                    valores={historico.map((m) => m.totalDescontos)}
                    destaque="destructive"
                  />
                  <LinhaTabela
                    rotulo="Remuneração líquida"
                    valores={historico.map((m) => m.liquido)}
                    destaque="primary"
                  />
                </tbody>
              </table>
            </div>
          </article>

          <p className="mt-4 rounded-md border border-secondary/30 bg-secondary/10 p-3 text-xs text-foreground">
            Extrato gerado a partir de modelo de consolidação para fins de demonstração. Em produção, virá da Folha de Pagamento oficial via Edge Function. Nome ilustrativo, CPF mascarado por LGPD.
          </p>
        </section>
      </main>

      <Footer />
      <BottomNav />
    </div>
  )
}

// --------------------------------------------------------------------
// Componentes auxiliares
// --------------------------------------------------------------------

function CardIdentificacao({
  icone: Icone,
  label,
  valor,
  aviso,
}: {
  icone: React.ComponentType<{ className?: string; "aria-hidden"?: boolean }>
  label: string
  valor: string
  aviso?: string
}) {
  return (
    <div className="rounded-md border border-border bg-card p-3">
      <dt className="flex items-center gap-1.5 text-[10px] font-medium uppercase tracking-wider text-muted-foreground">
        <Icone className="size-3" aria-hidden={true} />
        {label}
      </dt>
      <dd className="mt-1 truncate text-sm font-medium text-foreground" title={valor}>
        {valor}
      </dd>
      {aviso && (
        <p className="mt-0.5 text-[10px] italic text-muted-foreground">{aviso}</p>
      )}
    </div>
  )
}

function CardResumoPainel({
  label,
  valor,
  cor,
  legenda,
  icone: Icone,
  destaque,
}: {
  label: string
  valor: string
  cor: string
  legenda?: string
  icone?: React.ComponentType<{ className?: string; "aria-hidden"?: boolean }>
  destaque?: boolean
}) {
  return (
    <article
      className={cn(
        "rounded-lg border bg-card p-4",
        destaque
          ? "border-primary/40 shadow-[0_2px_4px_rgba(34,90,161,0.10),_0_8px_22px_-10px_rgba(34,90,161,0.20)]"
          : "border-border shadow-sm"
      )}
    >
      <div className="flex items-start justify-between gap-2">
        <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
          {label}
        </p>
        {Icone && (
          <span className={cn("flex size-7 shrink-0 items-center justify-center rounded-md", destaque ? "bg-primary/10 text-primary" : "bg-muted text-muted-foreground")}>
            <Icone className="size-4" aria-hidden={true} />
          </span>
        )}
      </div>
      <p className={cn("mt-2 font-display text-xl font-bold tabular md:text-2xl", cor)}>
        {valor}
      </p>
      {legenda && (
        <p className="mt-1 text-xs text-muted-foreground">{legenda}</p>
      )}
    </article>
  )
}

function LinhaTabela({
  rotulo,
  valores,
  destaque,
}: {
  rotulo: string
  valores: number[]
  destaque?: "success" | "destructive" | "primary"
}) {
  const cor =
    destaque === "success"
      ? "bg-success/5 text-success"
      : destaque === "destructive"
      ? "bg-destructive/5 text-destructive"
      : destaque === "primary"
      ? "bg-primary/5 text-primary"
      : ""

  return (
    <tr className={cn("border-b border-border last:border-0", cor && cor)}>
      <th
        scope="row"
        className={cn(
          "sticky left-0 bg-card px-3 py-2 text-left font-medium",
          destaque && "font-semibold",
          cor
        )}
      >
        {rotulo}
      </th>
      {valores.map((v, i) => (
        <td
          key={i}
          className={cn(
            "px-3 py-2 text-right tabular",
            destaque ? "font-semibold" : "text-foreground"
          )}
        >
          {v === 0 ? "—" : formatBRL(v)}
        </td>
      ))}
    </tr>
  )
}
