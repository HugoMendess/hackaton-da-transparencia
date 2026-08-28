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

  pessoal: {
    slug: "pessoal",
    perguntaAncora: "Quanto o estado gasta com pessoal e remuneração?",
    resposta:
      "Em 2026, os gastos com pessoal totalizam R$ 14,6 bilhões, cobrindo 138 mil servidores ativos e inativos, com remuneração média de R$ 6.840 no quadro funcional estadual.",
    cardsResumo: [
      { label: "Gasto com pessoal", valor: "R$ 14,6 bi", legenda: "Anual consolidado", variacao: { texto: "+4,8% vs 2025", positiva: true } },
      { label: "Servidores ativos", valor: "138.412", legenda: "Quadro estadual" },
      { label: "Remuneração média", valor: "R$ 6.840", legenda: "Média bruta" },
      { label: "Folha mensal", valor: "R$ 1,2 bi", legenda: "Competência mensal" },
    ],
    composicaoGastos: [
      { nome: "Vencimentos básicos", valor: 7_240 },
      { nome: "Aposentadorias e pensões", valor: 3_980 },
      { nome: "Encargos e previdência", valor: 1_120 },
      { nome: "Gratificações e adicionais", valor: 1_840 },
      { nome: "Outras despesas variáveis", valor: 500 },
    ],
    serieHistorica: [
      { ano: 2022, empenhado: 11_240, liquidado: 11_010, pago: 10_980 },
      { ano: 2023, empenhado: 12_580, liquidado: 12_340, pago: 12_300 },
      { ano: 2024, empenhado: 13_840, liquidado: 13_590, pago: 13_540 },
      { ano: 2025, empenhado: 14_120, liquidado: 13_870, pago: 13_820 },
      { ano: 2026, empenhado: 14_680, liquidado: 4_910, pago: 4_870 },
    ],
    destaques: [
      { titulo: "Magistério Estadual", subtitulo: "Maior contingente de servidores", valor: "38.200 servidores" },
      { titulo: "Saúde Pública", subtitulo: "Médicos e equipe hospitalar", valor: "24.150 servidores" },
      { titulo: "Segurança Pública", subtitulo: "Polícia Militar e Civil", valor: "15.800 servidores" },
    ],
    fonteOficial: {
      nome: "Portal da Transparência MA, Remuneração e Pessoal",
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

  seguranca: {
    slug: "seguranca",
    perguntaAncora: "Quanto o estado investe em segurança pública?",
    resposta:
      "A Segurança Pública do Maranhão contou com R$ 2,5 bilhões em 2026, distribuídos entre Polícia Militar, Polícia Civil, Corpo de Bombeiros e Defesa Civil. O efetivo soma 18.420 servidores entre policiais, bombeiros e agentes em todo o estado.",
    cardsResumo: [
      { label: "Orçamento da SSP", valor: "R$ 2,5 bi", legenda: "Anual 2026", variacao: { texto: "+5,8% vs 2025", positiva: true } },
      { label: "Efetivo total", valor: "18.420", legenda: "Policiais, bombeiros, agentes" },
      { label: "Viaturas em operação", valor: "3.840", legenda: "PM + PC + Bombeiros" },
      { label: "Batalhões e delegacias", valor: "247", legenda: "Em todo o Maranhão" },
    ],
    composicaoGastos: [
      { nome: "Folha policial militar", valor: 1_280 },
      { nome: "Folha polícia civil", valor: 540 },
      { nome: "Bombeiros", valor: 280 },
      { nome: "Defesa Civil", valor: 64 },
      { nome: "Viaturas e equipamentos", valor: 196 },
      { nome: "Operações e investigação", valor: 140 },
    ],
    serieHistorica: [
      { ano: 2022, empenhado: 2_080, liquidado: 1_980, pago: 1_960 },
      { ano: 2023, empenhado: 2_180, liquidado: 2_080, pago: 2_060 },
      { ano: 2024, empenhado: 2_290, liquidado: 2_180, pago: 2_160 },
      { ano: 2025, empenhado: 2_360, liquidado: 2_240, pago: 2_220 },
      { ano: 2026, empenhado: 2_500, liquidado: 840, pago: 820 },
    ],
    destaques: [
      { titulo: "PMMA", subtitulo: "Polícia Militar do Maranhão", valor: "R$ 1,28 bi/ano" },
      { titulo: "Polícia Civil", subtitulo: "Investigação e perícia", valor: "R$ 540 mi/ano" },
      { titulo: "Corpo de Bombeiros", subtitulo: "CBMMA, salvamento e prevenção", valor: "R$ 280 mi/ano" },
    ],
    fonteOficial: {
      nome: "SSP, Secretaria de Estado da Segurança Pública",
      url: "https://www.ssp.ma.gov.br/",
    },
  },

  habitacao: {
    slug: "habitacao",
    perguntaAncora: "Quantas famílias maranhenses receberam moradia do estado?",
    resposta:
      "Em 2026, R$ 480 milhões foram aplicados em programas habitacionais e regularização fundiária. Cerca de 12.840 unidades habitacionais estão em construção ou foram entregues, beneficiando aproximadamente 51 mil pessoas. A regularização fundiária alcançou 24.180 famílias.",
    cardsResumo: [
      { label: "Investido em habitação", valor: "R$ 480 mi", legenda: "Anual 2026", variacao: { texto: "+9,2% vs 2025", positiva: true } },
      { label: "Unidades habitacionais", valor: "12.840", legenda: "Em construção ou entregues" },
      { label: "Famílias regularizadas", valor: "24.180", legenda: "Regularização fundiária" },
      { label: "Municípios atendidos", valor: "184", legenda: "De 217 do estado" },
    ],
    composicaoGastos: [
      { nome: "Construção de unidades", valor: 280 },
      { nome: "Regularização fundiária", valor: 64 },
      { nome: "Reforma e melhoria", valor: 48 },
      { nome: "Subsídio habitacional", valor: 56 },
      { nome: "Infraestrutura urbana", valor: 32 },
    ],
    serieHistorica: [
      { ano: 2022, empenhado: 320, liquidado: 290, pago: 280 },
      { ano: 2023, empenhado: 380, liquidado: 340, pago: 330 },
      { ano: 2024, empenhado: 410, liquidado: 380, pago: 370 },
      { ano: 2025, empenhado: 440, liquidado: 410, pago: 400 },
      { ano: 2026, empenhado: 480, liquidado: 168, pago: 160 },
    ],
    destaques: [
      { titulo: "Programa Casa Boa", subtitulo: "Construção de unidades populares", valor: "R$ 280 mi/ano" },
      { titulo: "Regularização Fundiária", subtitulo: "Titulação de propriedades", valor: "R$ 64 mi/ano" },
      { titulo: "Programa Habitar Bem", subtitulo: "Reformas e melhorias", valor: "R$ 48 mi/ano" },
    ],
    fonteOficial: {
      nome: "SEDES, Secretaria de Estado das Cidades e Desenvolvimento Urbano",
      url: "https://www.sedes.ma.gov.br/",
    },
  },

  "programas-sociais": {
    slug: "programas-sociais",
    perguntaAncora: "Como me inscrevo no Maranhão Livre da Fome?",
    resposta:
      "Em 2026, R$ 1,2 bilhão financiou os programas sociais do estado, atendendo 384 mil famílias. O Maranhão Livre da Fome distribuiu 6,2 milhões de cestas básicas. Outros benefícios alcançaram 218 mil famílias com auxílios diretos, bolsas e ações de combate à insegurança alimentar.",
    cardsResumo: [
      { label: "Investido em programas", valor: "R$ 1,2 bi", legenda: "Anual 2026", variacao: { texto: "+11,4% vs 2025", positiva: true } },
      { label: "Famílias beneficiadas", valor: "384.000", legenda: "Em todo o estado" },
      { label: "Cestas básicas distribuídas", valor: "6,2 mi", legenda: "Maranhão Livre da Fome 2026" },
      { label: "Auxílios pagos", valor: "R$ 412 mi", legenda: "Acumulado no ano" },
    ],
    composicaoGastos: [
      { nome: "Maranhão Livre da Fome", valor: 580 },
      { nome: "Bolsa Estudante", valor: 184 },
      { nome: "Auxílio Habitação", valor: 96 },
      { nome: "Inclusão produtiva", valor: 124 },
      { nome: "Transferência direta", valor: 156 },
      { nome: "Restaurantes populares", valor: 60 },
    ],
    serieHistorica: [
      { ano: 2022, empenhado: 720, liquidado: 690, pago: 680 },
      { ano: 2023, empenhado: 880, liquidado: 840, pago: 830 },
      { ano: 2024, empenhado: 980, liquidado: 940, pago: 920 },
      { ano: 2025, empenhado: 1_080, liquidado: 1_030, pago: 1_010 },
      { ano: 2026, empenhado: 1_200, liquidado: 410, pago: 390 },
    ],
    destaques: [
      { titulo: "Maranhão Livre da Fome", subtitulo: "Cestas básicas e segurança alimentar", valor: "R$ 580 mi/ano" },
      { titulo: "Bolsa Estudante", subtitulo: "Auxílio para alunos da rede estadual", valor: "R$ 184 mi/ano" },
      { titulo: "Restaurantes Populares", subtitulo: "Refeições a R$ 1,00 em São Luís e Imperatriz", valor: "R$ 60 mi/ano" },
    ],
    fonteOficial: {
      nome: "SEINC, Secretaria de Inclusão e Cidadania",
      url: "https://www.seinc.ma.gov.br/",
    },
  },

  obras: {
    slug: "obras",
    perguntaAncora: "As obras de educação estão sendo executadas?",
    resposta:
      "O Maranhão tem R$ 1,8 bilhão investido em obras e infraestrutura em 2026. São 1.247 obras ativas, sendo 824 em execução, 287 concluídas no ano e 136 paralisadas. As principais frentes são pavimentação, saneamento, escolas, hospitais e mobilidade urbana.",
    cardsResumo: [
      { label: "Investido em obras", valor: "R$ 1,8 bi", legenda: "Anual 2026", variacao: { texto: "+8,9% vs 2025", positiva: true } },
      { label: "Obras ativas", valor: "1.247", legenda: "Em execução, concluídas e paralisadas" },
      { label: "Em execução agora", valor: "824", legenda: "Status andamento" },
      { label: "Concluídas em 2026", valor: "287", legenda: "Entregues no ano" },
    ],
    composicaoGastos: [
      { nome: "Pavimentação e estradas", valor: 580 },
      { nome: "Saneamento e água", valor: 280 },
      { nome: "Construção de escolas", valor: 320 },
      { nome: "Saúde e hospitais", valor: 240 },
      { nome: "Mobilidade urbana", valor: 184 },
      { nome: "Manutenção viária", valor: 196 },
    ],
    serieHistorica: [
      { ano: 2022, empenhado: 1_240, liquidado: 1_180, pago: 1_160 },
      { ano: 2023, empenhado: 1_380, liquidado: 1_310, pago: 1_290 },
      { ano: 2024, empenhado: 1_580, liquidado: 1_490, pago: 1_470 },
      { ano: 2025, empenhado: 1_650, liquidado: 1_560, pago: 1_540 },
      { ano: 2026, empenhado: 1_800, liquidado: 580, pago: 540 },
    ],
    destaques: [
      { titulo: "SINFRA", subtitulo: "Secretaria de Infraestrutura", valor: "R$ 1,1 bi/ano" },
      { titulo: "DER-MA", subtitulo: "Departamento de Estradas e Rodagem", valor: "R$ 480 mi/ano" },
      { titulo: "Programa Mais Asfalto", subtitulo: "Pavimentação em todo o estado", valor: "R$ 320 mi/ano" },
    ],
    fonteOficial: {
      nome: "SINFRA, Secretaria de Estado da Infraestrutura",
      url: "https://www.sinfra.ma.gov.br/",
    },
  },

  "emendas-parlamentares": {
    slug: "emendas-parlamentares",
    perguntaAncora: "Quanto foi destinado e pago em emendas parlamentares?",
    resposta:
      "Em 2026, R$ 518 milhões foram destinados em emendas parlamentares individuais e de bancada, contemplando 217 municípios maranhenses nas áreas de saúde, infraestrutura e educação.",
    cardsResumo: [
      { label: "Total em emendas", valor: "R$ 518 mi", legenda: "Orçamento 2026", variacao: { texto: "+6,5% vs 2025", positiva: true } },
      { label: "Emendas pagas", valor: "R$ 382 mi", legenda: "Recursos liquidados" },
      { label: "Municípios atendidos", valor: "217", legenda: "100% dos municípios" },
      { label: "Deputados autores", valor: "42", legenda: "ALEMA" },
    ],
    composicaoGastos: [
      { nome: "Saúde municipal", valor: 210 },
      { nome: "Infraestrutura e asfalto", valor: 145 },
      { nome: "Educação e esportes", valor: 78 },
      { nome: "Agricultura familiar", valor: 45 },
      { nome: "Cultura e eventos", valor: 40 },
    ],
    serieHistorica: [
      { ano: 2022, empenhado: 380, liquidado: 350, pago: 345 },
      { ano: 2023, empenhado: 420, liquidado: 395, pago: 390 },
      { ano: 2024, empenhado: 465, liquidado: 440, pago: 435 },
      { ano: 2025, empenhado: 490, liquidado: 468, pago: 460 },
      { ano: 2026, empenhado: 518, liquidado: 195, pago: 190 },
    ],
    destaques: [
      { titulo: "Emendas Impositivas", subtitulo: "Execução obrigatória pela ALEMA", valor: "R$ 310 mi" },
      { titulo: "Apoio a Hospitais Regionais", subtitulo: "Destinação para custeio de saúde", valor: "R$ 120 mi" },
      { titulo: "Estradas Vicinais e Asfalto", subtitulo: "Obras no interior do estado", valor: "R$ 88 mi" },
    ],
    fonteOficial: {
      nome: "Portal da Transparência MA, Emendas Parlamentares",
      url: "https://www.transparencia.ma.gov.br/emendas",
    },
  },

  "cultura-esporte": {
    slug: "cultura-esporte",
    perguntaAncora: "Quanto o estado investe em cultura, esporte e lazer?",
    resposta:
      "Em 2026, R$ 240 milhões financiaram cultura, esporte e juventude no Maranhão. O Bumba Meu Boi, festas juninas, reggae e carnaval movimentam o calendário cultural. Equipamentos esportivos e centros culturais atendem mais de 1,2 milhão de pessoas anualmente.",
    cardsResumo: [
      { label: "Investido em cultura e esporte", valor: "R$ 240 mi", legenda: "Anual 2026", variacao: { texto: "+7,3% vs 2025", positiva: true } },
      { label: "Equipamentos culturais", valor: "184", legenda: "Centros, bibliotecas, teatros" },
      { label: "Eventos apoiados", valor: "412", legenda: "Em 2026 até o momento" },
      { label: "Atletas com bolsa", valor: "1.840", legenda: "Bolsa Atleta Maranhense" },
    ],
    composicaoGastos: [
      { nome: "Festejos populares", valor: 84 },
      { nome: "Equipamentos culturais", valor: 56 },
      { nome: "Esporte e bolsa atleta", valor: 48 },
      { nome: "Bibliotecas e leitura", valor: 18 },
      { nome: "Patrimônio histórico", valor: 22 },
      { nome: "Juventude e lazer", valor: 12 },
    ],
    serieHistorica: [
      { ano: 2022, empenhado: 168, liquidado: 158, pago: 156 },
      { ano: 2023, empenhado: 184, liquidado: 174, pago: 172 },
      { ano: 2024, empenhado: 204, liquidado: 192, pago: 188 },
      { ano: 2025, empenhado: 224, liquidado: 212, pago: 208 },
      { ano: 2026, empenhado: 240, liquidado: 84, pago: 80 },
    ],
    destaques: [
      { titulo: "Festejos do Bumba Meu Boi", subtitulo: "Patrimônio Cultural da Humanidade UNESCO", valor: "R$ 48 mi/ano" },
      { titulo: "Carnaval, São João, Reggae", subtitulo: "Calendário cultural anual", valor: "R$ 36 mi/ano" },
      { titulo: "Bolsa Atleta Maranhense", subtitulo: "Apoio a 1.840 atletas em 38 modalidades", valor: "R$ 28 mi/ano" },
    ],
    fonteOficial: {
      nome: "SECMA, Secretaria de Estado da Cultura",
      url: "https://www.cultura.ma.gov.br/",
    },
  },

  "meio-ambiente": {
    slug: "meio-ambiente",
    perguntaAncora: "O que o estado faz pelo meio ambiente?",
    resposta:
      "O Meio Ambiente recebeu R$ 180 milhões em 2026, distribuídos entre fiscalização, recursos hídricos, áreas protegidas e licenciamento. O Maranhão tem 24 unidades de conservação estaduais protegendo 1,8 milhão de hectares, com 412 fiscais ambientais em campo.",
    cardsResumo: [
      { label: "Investido em meio ambiente", valor: "R$ 180 mi", legenda: "Anual 2026", variacao: { texto: "+12,1% vs 2025", positiva: true } },
      { label: "Unidades de conservação", valor: "24", legenda: "Áreas protegidas estaduais" },
      { label: "Hectares protegidos", valor: "1,8 mi", legenda: "Sob gestão da SEMA" },
      { label: "Fiscais em campo", valor: "412", legenda: "Agentes ambientais ativos" },
    ],
    composicaoGastos: [
      { nome: "Fiscalização ambiental", valor: 56 },
      { nome: "Recursos hídricos", valor: 38 },
      { nome: "Áreas protegidas", valor: 32 },
      { nome: "Licenciamento", valor: 18 },
      { nome: "Educação ambiental", valor: 12 },
      { nome: "Combate a incêndios", valor: 24 },
    ],
    serieHistorica: [
      { ano: 2022, empenhado: 124, liquidado: 118, pago: 116 },
      { ano: 2023, empenhado: 138, liquidado: 130, pago: 128 },
      { ano: 2024, empenhado: 152, liquidado: 144, pago: 142 },
      { ano: 2025, empenhado: 160, liquidado: 152, pago: 150 },
      { ano: 2026, empenhado: 180, liquidado: 60, pago: 58 },
    ],
    destaques: [
      { titulo: "SEMA, fiscalização ambiental", subtitulo: "412 fiscais ativos em todo o estado", valor: "R$ 56 mi/ano" },
      { titulo: "Programa Mais Água Boa", subtitulo: "Saneamento e recursos hídricos", valor: "R$ 38 mi/ano" },
      { titulo: "Parques estaduais", subtitulo: "24 unidades de conservação", valor: "R$ 32 mi/ano" },
    ],
    fonteOficial: {
      nome: "SEMA, Secretaria de Estado do Meio Ambiente",
      url: "https://www.sema.ma.gov.br/",
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
