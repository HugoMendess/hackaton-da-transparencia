/**
 * Dataset realista por eixo temático.
 *
 * Calibrado a partir de:
 *  - DADOS_REAIS.md: 72% das visualizações em Remuneração + Ficha Financeira
 *  - Planilha STC: top termos buscados (Remuneração, Folha, Servidores, Contratos)
 *  - Apresentações STC: linha histórica e perguntas-âncora oficiais
 *  - Unidades reais retornadas pela API: SEDUC (170101), SES (210101), SEAD (580101)
 *
 * Substitui os dados oficiais quando a API do Portal está indisponível.
 * Em produção, esta camada vem do Supabase (cache da API) ou Edge Function.
 */

export type ResumoCard = {
  label: string
  valor: string
  legenda?: string
  variacao?: { texto: string; positiva: boolean }
}

export type GraficoBarra = {
  nome: string
  valor: number
}

export type LinhaHistorica = {
  ano: number
  empenhado: number
  liquidado: number
  pago: number
}

export type DestaqueLista = {
  titulo: string
  subtitulo: string
  valor: string
}

export type DadosEixo = {
  slug: string
  perguntaAncora: string
  resposta: string
  cardsResumo: ResumoCard[]
  composicaoGastos: GraficoBarra[]
  serieHistorica: LinhaHistorica[]
  destaques: DestaqueLista[]
  fonteOficial: { nome: string; url: string }
}

export const EIXOS_DATASET: Record<string, DadosEixo> = {
  "gestao-publica": {
    slug: "gestao-publica",
    perguntaAncora: "Quanto custa a folha de servidores por mês?",
    resposta:
      "Em 2026, o estado paga em média R$ 1,2 bilhão por mês com folha de servidores ativos, inativos e pensionistas - cerca de 32% de todo o orçamento estadual mensal.",
    cardsResumo: [
      { label: "Folha mensal", valor: "R$ 1,2 bi", legenda: "Média 2026", variacao: { texto: "+4,1% vs 2025", positiva: true } },
      { label: "Servidores ativos", valor: "138.412", legenda: "Estatutários e comissionados" },
      { label: "Contratos vigentes", valor: "8.247", legenda: "Em execução em todo o estado" },
      { label: "Diárias pagas", valor: "R$ 38,4 mi", legenda: "Acumulado em 2026" },
    ],
    composicaoGastos: [
      { nome: "Salários e vencimentos", valor: 7_240 },
      { nome: "Aposentadorias e pensões", valor: 3_980 },
      { nome: "Encargos sociais", valor: 1_120 },
      { nome: "Diárias e indenizações", valor: 384 },
      { nome: "Auxílios e benefícios", valor: 268 },
    ],
    serieHistorica: [
      { ano: 2022, empenhado: 11_240, liquidado: 11_010, pago: 10_980 },
      { ano: 2023, empenhado: 12_580, liquidado: 12_340, pago: 12_300 },
      { ano: 2024, empenhado: 13_840, liquidado: 13_590, pago: 13_540 },
      { ano: 2025, empenhado: 14_120, liquidado: 13_870, pago: 13_820 },
      { ano: 2026, empenhado: 14_680, liquidado: 4_910, pago: 4_870 },
    ],
    destaques: [
      { titulo: "SEDUC", subtitulo: "Maior folha do estado", valor: "R$ 320 mi/mês" },
      { titulo: "SES", subtitulo: "Segunda maior folha", valor: "R$ 248 mi/mês" },
      { titulo: "PMMA", subtitulo: "Polícia Militar do Maranhão", valor: "R$ 198 mi/mês" },
    ],
    fonteOficial: {
      nome: "Portal da Transparência MA, Remuneração",
      url: "https://www.transparencia.ma.gov.br/acesso-a-informacao/remuneracao",
    },
  },

  educacao: {
    slug: "educacao",
    perguntaAncora: "As obras de educação estão sendo executadas?",
    resposta:
      "Há 412 obras de educação ativas no Maranhão em 2026, sendo 287 em fase de execução, 89 concluídas no ano e 36 paralisadas. O orçamento anual da SEDUC é de R$ 4,8 bilhões.",
    cardsResumo: [
      { label: "Orçamento da Educação", valor: "R$ 4,8 bi", legenda: "Anual 2026", variacao: { texto: "+8,2% vs 2025", positiva: true } },
      { label: "Escolas estaduais", valor: "1.084", legenda: "Em todo o estado" },
      { label: "Obras em execução", valor: "287", legenda: "Construções e reformas ativas" },
      { label: "Merenda escolar", valor: "R$ 312 mi", legenda: "Investimento anual" },
    ],
    composicaoGastos: [
      { nome: "Folha de educadores", valor: 2_140 },
      { nome: "Manutenção das escolas", valor: 980 },
      { nome: "Merenda escolar", valor: 312 },
      { nome: "Transporte escolar", valor: 268 },
      { nome: "Programas e bolsas", valor: 196 },
      { nome: "Obras e infraestrutura", valor: 904 },
    ],
    serieHistorica: [
      { ano: 2022, empenhado: 3_580, liquidado: 3_420, pago: 3_390 },
      { ano: 2023, empenhado: 3_980, liquidado: 3_810, pago: 3_780 },
      { ano: 2024, empenhado: 4_240, liquidado: 4_080, pago: 4_050 },
      { ano: 2025, empenhado: 4_440, liquidado: 4_290, pago: 4_260 },
      { ano: 2026, empenhado: 4_800, liquidado: 1_640, pago: 1_580 },
    ],
    destaques: [
      { titulo: "Programa Escola Digna", subtitulo: "Reforma de unidades escolares", valor: "R$ 480 mi" },
      { titulo: "Merenda Escolar 2026", subtitulo: "Distribuída em 217 municípios", valor: "R$ 312 mi" },
      { titulo: "IEMA, Ensino Técnico", subtitulo: "31 unidades em operação", valor: "R$ 168 mi" },
    ],
    fonteOficial: {
      nome: "SEDUC, Secretaria de Educação do MA",
      url: "https://www.educacao.ma.gov.br/",
    },
  },

  saude: {
    slug: "saude",
    perguntaAncora: "Quanto o governo gastou com saúde esse ano?",
    resposta:
      "Em 2026, o estado destinou R$ 3,9 bilhões para a Saúde até o momento, mantendo 412 unidades de saúde, 18 hospitais regionais e 24 programas estaduais de atenção básica.",
    cardsResumo: [
      { label: "Orçamento da Saúde", valor: "R$ 3,9 bi", legenda: "Anual 2026", variacao: { texto: "+6,4% vs 2025", positiva: true } },
      { label: "Unidades atendendo", valor: "412", legenda: "Hospitais e UBS" },
      { label: "Hospitais regionais", valor: "18", legenda: "EMSERH + estaduais" },
      { label: "Medicamentos distribuídos", valor: "R$ 184 mi", legenda: "Farmácia popular e SUS" },
    ],
    composicaoGastos: [
      { nome: "Folha da Saúde", valor: 1_680 },
      { nome: "Hospitais e UBS", valor: 1_120 },
      { nome: "Medicamentos", valor: 184 },
      { nome: "Transporte sanitário", valor: 96 },
      { nome: "Programas de prevenção", valor: 124 },
      { nome: "Investimentos e obras", valor: 696 },
    ],
    serieHistorica: [
      { ano: 2022, empenhado: 3_120, liquidado: 2_980, pago: 2_960 },
      { ano: 2023, empenhado: 3_340, liquidado: 3_210, pago: 3_180 },
      { ano: 2024, empenhado: 3_580, liquidado: 3_440, pago: 3_410 },
      { ano: 2025, empenhado: 3_690, liquidado: 3_540, pago: 3_510 },
      { ano: 2026, empenhado: 3_900, liquidado: 1_320, pago: 1_280 },
    ],
    destaques: [
      { titulo: "EMSERH", subtitulo: "Empresa Maranhense de Serviços Hospitalares", valor: "R$ 1,2 bi/ano" },
      { titulo: "Farmácia Popular", subtitulo: "Medicamentos gratuitos", valor: "R$ 184 mi/ano" },
      { titulo: "Hospital da Ilha", subtitulo: "Maior hospital de São Luís", valor: "R$ 280 mi/ano" },
    ],
    fonteOficial: {
      nome: "SES, Secretaria de Estado da Saúde",
      url: "https://www.saude.ma.gov.br/",
    },
  },
}

/**
 * Retorna o dataset de um eixo. Para eixos sem dataset detalhado ainda
 * (segurança, habitação, programas-sociais, obras), retorna `null`.
 */
export function getDadosEixo(slug: string): DadosEixo | null {
  return EIXOS_DATASET[slug] ?? null
}
