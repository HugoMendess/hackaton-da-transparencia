import { useMemo, useState } from "react"
import {
  TrendingUp,
  Receipt,
  FileText,
  Gavel,
  HandCoins,
  Clock,
  Hammer,
  Users,
  BadgePercent,
  Landmark,
  Building2,
  Search,
  RotateCcw,
  type LucideIcon,
} from "lucide-react"
import { cn, formatBRL, formatNumber } from "@/lib/utils"

export type AbaConfig = {
  id: string
  label: string
  descricao: string
  icon: LucideIcon
  iconBg: string
}

// Configuração de abas/botões por Eixo
export const ABAS_POR_EIXO: Record<string, AbaConfig[]> = {
  "gestao-publica": [
    {
      id: "receita",
      label: "Receita",
      descricao: "Arrecadação tributária, transferências correntes e receitas estaduais",
      icon: TrendingUp,
      iconBg: "bg-emerald-50 text-emerald-600 dark:bg-emerald-950/60 dark:text-emerald-400",
    },
    {
      id: "despesas",
      label: "Despesas",
      descricao: "Execução orçamentária: empenho, liquidação e pagamentos",
      icon: Receipt,
      iconBg: "bg-blue-50 text-blue-600 dark:bg-blue-950/60 dark:text-blue-400",
    },
    {
      id: "contratos",
      label: "Contratos",
      descricao: "Contratos administrativos, termos aditivos e prestação continuada",
      icon: FileText,
      iconBg: "bg-amber-50 text-amber-600 dark:bg-amber-950/60 dark:text-amber-400",
    },
    {
      id: "licitacoes",
      label: "Licitações",
      descricao: "Editais, pregões eletrônicos, concorrências e homologações",
      icon: Gavel,
      iconBg: "bg-purple-50 text-purple-600 dark:bg-purple-950/60 dark:text-purple-400",
    },
    {
      id: "adiantamentos",
      label: "Adiantamentos",
      descricao: "Suprimento de fundos, pequenas despesas e prestações de contas",
      icon: HandCoins,
      iconBg: "bg-cyan-50 text-cyan-600 dark:bg-cyan-950/60 dark:text-cyan-400",
    },
    {
      id: "ordem-cronologica",
      label: "Ordem Cronológica",
      descricao: "Fila de pagamentos conforme a Lei 14.133 e exigências do TCE-MA",
      icon: Clock,
      iconBg: "bg-indigo-50 text-indigo-600 dark:bg-indigo-950/60 dark:text-indigo-400",
    },
  ],
  obras: [
    {
      id: "obras",
      label: "Obras",
      descricao: "Construções, pavimentações, reformas e infraestrutura pública",
      icon: Hammer,
      iconBg: "bg-amber-50 text-amber-600 dark:bg-amber-950/60 dark:text-amber-400",
    },
  ],
  pessoal: [
    {
      id: "pessoal",
      label: "Pessoal",
      descricao: "Quadro funcional, servidores efetivos, comissionados e temporários",
      icon: Users,
      iconBg: "bg-blue-50 text-blue-600 dark:bg-blue-950/60 dark:text-blue-400",
    },
    {
      id: "remuneracao",
      label: "Remuneração",
      descricao: "Tabela de cargos, vencimento base, gratificações e salários médios",
      icon: BadgePercent,
      iconBg: "bg-indigo-50 text-indigo-600 dark:bg-indigo-950/60 dark:text-indigo-400",
    },
  ],
  "emendas-parlamentares": [
    {
      id: "emendas-estaduais",
      label: "Emendas Estaduais",
      descricao: "Emendas individuais e de bancada da Assembleia Legislativa (ALEMA)",
      icon: Landmark,
      iconBg: "bg-amber-50 text-amber-600 dark:bg-amber-950/60 dark:text-amber-400",
    },
    {
      id: "emendas-federais",
      label: "Emendas Federais",
      descricao: "Repasses e convênios da bancada federal do Maranhão no Congresso",
      icon: Building2,
      iconBg: "bg-emerald-50 text-emerald-600 dark:bg-emerald-950/60 dark:text-emerald-400",
    },
  ],
}

// =====================================================================
// DATASETS MOCKADOS
// =====================================================================

const DADOS_RECEITA = [
  { id: "rec-1", codigo: "1.1.1.8.01.1.1", rubrica: "ICMS - Operações Próprias", categoria: "Tributária", unidade: "SEFAZ", ano: 2025, previsao: 12500000000, arrecadado: 11840000000, situacao: "Arrecadada" },
  { id: "rec-2", codigo: "1.1.1.8.02.3.1", rubrica: "IPVA - Veículos Automotores", categoria: "Tributária", unidade: "SEFAZ", ano: 2025, previsao: 1100000000, arrecadado: 1045000000, situacao: "Arrecadada" },
  { id: "rec-3", codigo: "1.7.1.8.01.2.1", rubrica: "Cota-Parte do FPE (Fundo de Participação)", categoria: "Transferências", unidade: "SEFAZ", ano: 2025, previsao: 10200000000, arrecadado: 9980000000, situacao: "Arrecadada" },
  { id: "rec-4", codigo: "1.7.1.8.03.1.1", rubrica: "Transferências do SUS - Fundo a Fundo", categoria: "Transferências", unidade: "SES", ano: 2025, previsao: 2800000000, arrecadado: 2650000000, situacao: "Arrecadada" },
  { id: "rec-5", codigo: "1.7.5.8.01.1.1", rubrica: "FUNDEB - Manutenção da Educação", categoria: "Transferências", unidade: "SEDUC", ano: 2025, previsao: 4100000000, arrecadado: 3890000000, situacao: "Arrecadada" },
  { id: "rec-6", codigo: "1.3.2.1.00.1.1", rubrica: "Remuneração de Depósitos Bancários", categoria: "Patrimonial", unidade: "SEFAZ", ano: 2025, previsao: 180000000, arrecadado: 195000000, situacao: "Arrecadada" },
]

const DADOS_DESPESAS = [
  { id: "desp-1", documento: "2025NE004912", data: "12/01/2025", unidade: "Secretaria de Saúde - SES", credor: "CIRÚRGICA NORTE DISTRIBUIDORA", funcao: "Saúde", empenhado: 1450000, liquidado: 1450000, pago: 1450000, situacao: "Pago", ano: 2025 },
  { id: "desp-2", documento: "2025NE008123", data: "15/01/2025", unidade: "Secretaria de Educação - SEDUC", credor: "EDITORA EDUCACIONAL MARANHÃO", funcao: "Educação", empenhado: 4890000, liquidado: 4890000, pago: 4890000, situacao: "Pago", ano: 2025 },
  { id: "desp-3", documento: "2025NE010419", data: "20/01/2025", unidade: "Secretaria de Infraestrutura - SINFRA", credor: "CONSTRUTORA VALE DO ITAPECURU", funcao: "Transporte", empenhado: 18400000, liquidado: 14200000, pago: 14200000, situacao: "Liquidado", ano: 2025 },
  { id: "desp-4", documento: "2025NE012891", data: "22/01/2025", unidade: "Secretaria de Segurança - SSP", credor: "VIATURAS BRASIL COMÉRCIO LTDA", funcao: "Segurança Pública", empenhado: 6200000, liquidado: 6200000, pago: 6200000, situacao: "Pago", ano: 2025 },
  { id: "desp-5", documento: "2025NE015402", data: "25/01/2025", unidade: "Secretaria de Administração - SEAD", credor: "TECNOLOGIA E DADOS CORPORATIVOS", funcao: "Administração", empenhado: 2450000, liquidado: 2450000, pago: 0, situacao: "Empenhado", ano: 2025 },
]

const DADOS_CONTRATOS = [
  { id: "ct-1", numeroContrato: "045/2025-SINFRA", processo: "PA-2024/09182", empresa: "CONSTRUTORA VALE DO ITAPECURU LTDA", cnpj: "08.921.432/0001-56", objeto: "Restauração e pavimentação asfáltica da rodovia MA-020", unidade: "SINFRA", vigencia: "15/01/2025 a 15/01/2026", valorTotal: 24800000, valorExecutado: 18500000, status: "Vigente", ano: 2025 },
  { id: "ct-2", numeroContrato: "012/2025-SEAD", processo: "PA-2024/11402", empresa: "MICROSOFT DO BRASIL DISTRIBUIÇÃO", cnpj: "60.316.817/0001-03", objeto: "Licenciamento em nuvem corporativa e comunicação do Estado", unidade: "SEAD", vigencia: "10/01/2025 a 10/01/2027", valorTotal: 6400000, valorExecutado: 6400000, status: "Vigente", ano: 2025 },
  { id: "ct-3", numeroContrato: "088/2025-SES", processo: "PA-2024/22190", empresa: "EMPRESA MARANHENSE DE GESTÃO HOSPITALAR", cnpj: "18.234.901/0001-88", objeto: "Gestão operacional de leitos de UTI hospitalares", unidade: "SES", vigencia: "01/02/2025 a 01/02/2026", valorTotal: 42000000, valorExecutado: 38000000, status: "Vigente", ano: 2025 },
  { id: "ct-4", numeroContrato: "034/2025-SEDUC", processo: "PA-2024/15678", empresa: "TRANSPORTE ESCOLAR REGIONAL LTDA", cnpj: "03.112.540/0001-22", objeto: "Transporte escolar de estudantes da rede pública rural", unidade: "SEDUC", vigencia: "20/01/2025 a 20/12/2025", valorTotal: 9800000, valorExecutado: 7200000, status: "Vigente", ano: 2025 },
  { id: "ct-5", numeroContrato: "019/2024-SSP", processo: "PA-2023/18920", empresa: "SEGURANÇA E MONITORAMENTO VIRTUAL", cnpj: "11.890.342/0001-77", objeto: "Manutenção do cerco eletrônico inteligente com OCR", unidade: "SSP", vigencia: "10/06/2024 a 10/06/2025", valorTotal: 5200000, valorExecutado: 5200000, status: "Concluído", ano: 2024 },
]

const DADOS_LICITACOES = [
  { id: "lic-1", edital: "PE nº 088/2025-SEDUC", dataAbertura: "08/01/2025", modalidade: "Pregão Eletrônico", orgao: "SEDUC", objeto: "Kits escolares didáticos para o ensino médio", valorEstimado: 8900000, valorHomologado: 7800000, vencedor: "EDITORA E GRÁFICA MARANHÃO LTDA", situacao: "Homologada", ano: 2025 },
  { id: "lic-2", edital: "PE nº 104/2025-SES", dataAbertura: "14/01/2025", modalidade: "Pregão Eletrônico", orgao: "SES", objeto: "Registro de preços para medicamentos injetáveis", valorEstimado: 17200000, valorHomologado: 15400000, vencedor: "DISTRIBUIDORA FARMA BRASIL LTDA", situacao: "Homologada", ano: 2025 },
  { id: "lic-3", edital: "CP nº 003/2025-SINFRA", dataAbertura: "19/01/2025", modalidade: "Concorrência", orgao: "SINFRA", objeto: "Construção de ponte de concreto armado sobre o Rio Balsas", valorEstimado: 32000000, valorHomologado: 29500000, vencedor: "CONSÓRCIO MARANHÃO INFRAESTRUTURA", situacao: "Homologada", ano: 2025 },
  { id: "lic-4", edital: "DL nº 021/2025-CBMMA", dataAbertura: "26/01/2025", modalidade: "Dispensa", orgao: "Corpo de Bombeiros", objeto: "Aquisição emergencial de motobombas e mangueiras", valorEstimado: 890000, valorHomologado: 890000, vencedor: "HIDRANTES E EQUIPAMENTOS LTDA", situacao: "Homologada", ano: 2025 },
  { id: "lic-5", edital: "PE nº 012/2025-SSP", dataAbertura: "15/02/2025", modalidade: "Pregão Eletrônico", orgao: "SSP", objeto: "Fornecimento de coletes de proteção balística III-A", valorEstimado: 4100000, valorHomologado: 0, vencedor: "Em julgamento de propostas", situacao: "Em Andamento", ano: 2025 },
]

const DADOS_ADIANTAMENTOS = [
  { id: "adt-1", processo: "SF-2025/0012", data: "05/01/2025", responsavel: "CORONEL PAULO ROBERTO SILVA", orgao: "Casa Militar / Gabinete", finalidade: "Despesas de pronto atendimento e segurança governamental", concedido: 45000, prestado: 45000, saldo: 0, situacao: "Aprovada", ano: 2025 },
  { id: "adt-2", processo: "SF-2025/0048", data: "12/01/2025", responsavel: "DELEGADO MARCOS VINICIUS DIAS", orgao: "Polícia Civil - Inteligência", finalidade: "Operação policial sigilosa e diligências emergenciais", concedido: 38000, prestado: 38000, saldo: 0, situacao: "Aprovada", ano: 2025 },
  { id: "adt-3", processo: "SF-2025/0091", data: "18/01/2025", responsavel: "DRA. PATRICIA ALVES MONTEIRO", orgao: "Secretaria de Saúde - SES", finalidade: "Suprimento para ação de socorro em enchente regional", concedido: 60000, prestado: 52000, saldo: 8000, situacao: "Em Análise", ano: 2025 },
  { id: "adt-4", processo: "SF-2025/0122", data: "24/01/2025", responsavel: "ENG. LUCAS FONTES COSTA", orgao: "SINFRA", finalidade: "Reparos urgentes de sinalização em rodovia estadual", concedido: 25000, prestado: 25000, saldo: 0, situacao: "Aprovada", ano: 2025 },
  { id: "adt-5", processo: "SF-2025/0155", data: "02/02/2025", responsavel: "ROBERTO CAMPOS NOGUEIRA", orgao: "SEAD", finalidade: "Manutenção predial emergencial e pequenos reparos", concedido: 15000, prestado: 0, saldo: 15000, situacao: "Pendente", ano: 2025 },
]

const DADOS_ORDEM_CRONOLOGICA = [
  { id: "ord-1", posicao: 1, liquidacao: "2025NL001042", protocolo: "02/01/2025", credor: "DROGARIA E DISTRIBUIDORA SAÚDE MA", unidade: "Secretaria de Saúde - SES", fonte: "Recursos do SUS", valor: 380000, previsao: "Hoje", status: "Liberado para Pagamento", ano: 2025 },
  { id: "ord-2", posicao: 2, liquidacao: "2025NL001088", protocolo: "03/01/2025", credor: "CONSTRUTORA ASFALTO DO NORTE", unidade: "Secretaria de Infraestrutura - SINFRA", fonte: "Tesouro Estadual (Ordinário)", valor: 1450000, previsao: "Próximas 24h", status: "Liberado para Pagamento", ano: 2025 },
  { id: "ord-3", posicao: 3, liquidacao: "2025NL001150", protocolo: "05/01/2025", credor: "ALIMENTAÇÃO ESCOLAR INTEGRAL LTDA", unidade: "Secretaria de Educação - SEDUC", fonte: "FUNDEB", valor: 890000, previsao: "Em até 48h", status: "Aguardando Repasse", ano: 2025 },
  { id: "ord-4", posicao: 4, liquidacao: "2025NL001210", protocolo: "07/01/2025", credor: "TECNOLOGIA E CONECTIVIDADE MA", unidade: "Secretaria de Administração - SEAD", fonte: "Tesouro Estadual", valor: 210000, previsao: "Até 5 dias úteis", status: "Em Fila Regular", ano: 2025 },
  { id: "ord-5", posicao: 5, liquidacao: "2025NL001290", protocolo: "09/01/2025", credor: "POSTO COMBUSTÍVEL VIATURAS", unidade: "Polícia Militar - PMMA", fonte: "Tesouro Estadual", valor: 450000, previsao: "Até 7 dias úteis", status: "Em Fila Regular", ano: 2025 },
]

const DADOS_OBRAS = [
  { id: "obr-1", contrato: "012/2024-SINFRA", descricao: "Duplicação e pavimentação asfáltica da rodovia MA-203", municipio: "São Luís / Raposa", orgao: "SINFRA", construtora: "CONSTRUTORA VALE DO ITAPECURU", valorTotal: 48500000, concluido: 78, previsaoEntrega: "12/2025", status: "Em Andamento", ano: 2025 },
  { id: "obr-2", contrato: "034/2024-SES", descricao: "Construção do Hospital Macrorregional de Imperatriz", municipio: "Imperatriz", orgao: "SES", construtora: "ENGEL ENGENHARIA HOSPITALAR", valorTotal: 62000000, concluido: 92, previsaoEntrega: "06/2025", status: "Fase Final", ano: 2025 },
  { id: "obr-3", contrato: "088/2024-SEDUC", descricao: "Construção de IEMA Pleno vocacional com 12 salas e laboratórios", municipio: "Balsas", orgao: "SEDUC", construtora: "EDIFICAÇÕES MARANHÃO LTDA", valorTotal: 18900000, concluido: 65, previsaoEntrega: "10/2025", status: "Em Andamento", ano: 2025 },
  { id: "obr-4", contrato: "102/2024-SINFRA", descricao: "Ponte sobre o Rio Itapecuru ligando povoados rurais", municipio: "Caxias", orgao: "SINFRA", construtora: "PONTES E ESTRUTURAS DO BRASIL", valorTotal: 14200000, concluido: 100, previsaoEntrega: "01/2025", status: "Concluída", ano: 2025 },
  { id: "obr-5", contrato: "115/2024-SEDUC", descricao: "Reforma geral e climatização de Centro de Ensino Médio", municipio: "Timon", orgao: "SEDUC", construtora: "NORTE REFORMAS PÚBLICAS", valorTotal: 4500000, concluido: 45, previsaoEntrega: "08/2025", status: "Em Andamento", ano: 2025 },
]

const DADOS_PESSOAL = [
  { id: "pes-1", matricula: "0048192-1", nome: "MARIA DAS GRAÇAS SILVA SANTOS", cpf: "***.452.883-**", cargo: "Professor da Educação Básica II", orgao: "Secretaria de Educação - SEDUC", vinculo: "Efetivo", admissao: "12/03/2012", remuneracaoBruta: 8450, remuneracaoLiquida: 6890, situacao: "Ativo", ano: 2025 },
  { id: "pes-2", matricula: "0031849-3", nome: "DR. JOSÉ CARLOS MENDES RIBEIRO", cpf: "***.123.987-**", cargo: "Médico Clínico Geral Plantonista", orgao: "Secretaria de Saúde - SES", vinculo: "Efetivo", admissao: "05/08/2015", remuneracaoBruta: 18200, remuneracaoLiquida: 14350, situacao: "Ativo", ano: 2025 },
  { id: "pes-3", matricula: "0019482-8", nome: "ANA BEATRIZ ALMEIDA ROCHA", cpf: "***.654.321-**", cargo: "Auditor Fiscal da Receita Estadual", orgao: "Secretaria da Fazenda - SEFAZ", vinculo: "Efetivo", admissao: "10/02/2010", remuneracaoBruta: 22500, remuneracaoLiquida: 17800, situacao: "Ativo", ano: 2025 },
  { id: "pes-4", matricula: "0074219-5", nome: "MARCOS VINICIUS PEREIRA COSTA", cpf: "***.789.456-**", cargo: "Investigador de Polícia Civil", orgao: "Polícia Civil do Maranhão", vinculo: "Efetivo", admissao: "14/06/2018", remuneracaoBruta: 15600, remuneracaoLiquida: 12100, situacao: "Ativo", ano: 2025 },
  { id: "pes-5", matricula: "0088312-9", nome: "LUCIA VERÔNICA CARVALHO MOTA", cpf: "***.876.543-**", cargo: "Assessor Especial de Gabinete", orgao: "Secretaria de Administração - SEAD", vinculo: "Comissionado", admissao: "03/01/2023", remuneracaoBruta: 9800, remuneracaoLiquida: 7850, situacao: "Ativo", ano: 2025 },
]

const DADOS_REMUNERACAO = [
  { id: "rem-1", codigoCargo: "CARG-0102", denominacao: "Auditor Fiscal da Receita Estadual", grupo: "Tributação e Fiscalização", poder: "Executivo", qtdServidores: 412, vencimentoBase: 15200, gratificacoes: 7300, salarioMedioBruto: 22500, cargaHoraria: "40h semanais", ano: 2025 },
  { id: "rem-2", codigoCargo: "CARG-0205", denominacao: "Professor da Educação Básica II", grupo: "Magistério Estadual", poder: "Executivo", qtdServidores: 28450, vencimentoBase: 5800, gratificacoes: 2650, salarioMedioBruto: 8450, cargaHoraria: "40h semanais", ano: 2025 },
  { id: "rem-3", codigoCargo: "CARG-0310", denominacao: "Médico Especialista Plantonista", grupo: "Saúde Pública", poder: "Executivo", qtdServidores: 2190, vencimentoBase: 11400, gratificacoes: 6800, salarioMedioBruto: 18200, cargaHoraria: "24h semanais", ano: 2025 },
  { id: "rem-4", codigoCargo: "CARG-0418", denominacao: "Soldado PM de 1ª Classe", grupo: "Segurança e Defesa", poder: "Executivo", qtdServidores: 8950, vencimentoBase: 4900, gratificacoes: 1850, salarioMedioBruto: 6750, cargaHoraria: "Regime de Escala", ano: 2025 },
  { id: "rem-5", codigoCargo: "CARG-0522", denominacao: "Procurador do Estado", grupo: "Advocacia Pública", poder: "Executivo", qtdServidores: 145, vencimentoBase: 21000, gratificacoes: 7400, salarioMedioBruto: 28400, cargaHoraria: "40h semanais", ano: 2025 },
]

const DADOS_EMENDAS_PARLAMENTARES = [
  { id: "ep-1", numero: "EP-2025/0014", deputado: "Dep. Arnaldo Melo", municipio: "Passagem Franca", objeto: "Aquisição de ambulância de suporte avançado e insumos para hospital", area: "Saúde", indicado: 1500000, pago: 1500000, executado: 100, status: "Pago Integralmente", ano: 2025 },
  { id: "ep-2", numero: "EP-2025/0038", deputado: "Dep. Roberto Costa", municipio: "Bacabal", objeto: "Pavimentação asfáltica e drenagem de vias do bairro Pantanal", area: "Infraestrutura", indicado: 2800000, pago: 2100000, executado: 75, status: "Em Execução", ano: 2025 },
  { id: "ep-3", numero: "EP-2025/0072", deputado: "Depª. Iracema Vale", municipio: "Urbano Santos", objeto: "Construção de praça poliesportiva com iluminação de LED e pista de caminhada", area: "Esporte e Lazer", indicado: 950000, pago: 950000, executado: 100, status: "Pago Integralmente", ano: 2025 },
  { id: "ep-4", numero: "EP-2025/0105", deputado: "Dep. Glalbert Cutrim", municipio: "Pinheiro", objeto: "Kits de irrigação e maquinário agrícola para cooperativas rurais", area: "Agricultura", indicado: 1200000, pago: 600000, executado: 50, status: "Em Execução", ano: 2025 },
  { id: "ep-5", numero: "EP-2025/0140", deputado: "Depª. Daniella", municipio: "Presidente Dutra", objeto: "Custeio de exames laboratoriais e mamografias na rede municipal", area: "Saúde", indicado: 1800000, pago: 1800000, executado: 100, status: "Pago Integralmente", ano: 2025 },
]

const DADOS_EMENDAS_FEDERAIS = [
  { id: "ef-1", numero: "EF-2025/9012", parlamentar: "Bancada Federal do Maranhão", orgaoRepassador: "Ministério da Saúde", municipio: "São Luís", objeto: "Incremento temporário ao Teto de Média e Alta Complexidade (MAC)", valorEmpenhado: 45000000, valorRepassado: 45000000, saldo: 0, situacao: "Repassado", ano: 2025 },
  { id: "ef-2", numero: "EF-2025/8410", parlamentar: "Senador da República", orgaoRepassador: "CODEVASF / MIDR", municipio: "Imperatriz", objeto: "Estruturação de estradas vicinais e escoamento da produção de soja e leite", valorEmpenhado: 18500000, valorRepassado: 14200000, saldo: 4300000, situacao: "Repasse Parcial", ano: 2025 },
  { id: "ef-3", numero: "EF-2025/7822", parlamentar: "Deputado Federal", orgaoRepassador: "Fundo Nacional de Saúde - FNS", municipio: "Caxias", objeto: "Equipamentos para maternidade e centro cirúrgico neonatal", valorEmpenhado: 8900000, valorRepassado: 8900000, saldo: 0, situacao: "Repassado", ano: 2025 },
  { id: "ef-4", numero: "EF-2025/6915", parlamentar: "Bancada Federal do Maranhão", orgaoRepassador: "MEC / FNDE", municipio: "Codó", objeto: "Ônibus escolares rurais traçados (Caminho da Escola)", valorEmpenhado: 6400000, valorRepassado: 6400000, saldo: 0, situacao: "Repassado", ano: 2025 },
  { id: "ef-5", numero: "EF-2025/5510", parlamentar: "Deputado Federal", orgaoRepassador: "Ministério das Cidades", municipio: "Açailândia", objeto: "Canalização e obras de contenção de encostas e drenagem", valorEmpenhado: 12000000, valorRepassado: 6000000, saldo: 6000000, situacao: "Repasse Parcial", ano: 2025 },
]

// =====================================================================
// COMPONENTE PRINCIPAL
// =====================================================================

export function ConsultaEspecifica({ eixoSlug = "gestao-publica" }: { eixoSlug?: string }) {
  // Lista de abas permitidas para este eixo
  const abasDisponiveis = ABAS_POR_EIXO[eixoSlug] ?? []

  // Aba ativa (inicia vazia: botões só mostram filtros quando clicados)
  const [abaAtiva, setAbaAtiva] = useState<string | null>(null)

  // Filtros genéricos por aba
  const [filtroCategoria, setFiltroCategoria] = useState("Todos")
  const [filtroOrgao, setFiltroOrgao] = useState("Todos")
  const [filtroSituacao, setFiltroSituacao] = useState("Todos")
  const [filtroAno, setFiltroAno] = useState(2025)

  // Barra de ferramentas
  const [termoBusca, setTermoBusca] = useState("")
  const [itensPorPagina, setItensPorPagina] = useState(10)
  const [paginaAtual, setPaginaAtual] = useState(1)

  // Se o eixo não possui abas mapeadas, não renderiza cards
  if (abasDisponiveis.length === 0) {
    return null
  }

  function handleClicarAba(id: string) {
    if (abaAtiva === id) {
      setAbaAtiva(null) // Clicar na mesma aba fecha
    } else {
      setAbaAtiva(id)
      setTermoBusca("")
      setFiltroCategoria("Todos")
      setFiltroOrgao("Todos")
      setFiltroSituacao("Todos")
      setFiltroAno(2025)
      setPaginaAtual(1)
    }
  }

  function handleLimparFiltros() {
    setTermoBusca("")
    setFiltroCategoria("Todos")
    setFiltroOrgao("Todos")
    setFiltroSituacao("Todos")
    setFiltroAno(2025)
    setPaginaAtual(1)
  }

  // Filtragem dos dados conforme a aba ativa
  const dadosFiltrados = useMemo(() => {
    if (!abaAtiva) return []
    const b = termoBusca.toLowerCase().trim()

    // 1. Receita
    if (abaAtiva === "receita") {
      return DADOS_RECEITA.filter((item) => {
        if (filtroCategoria !== "Todos" && item.categoria !== filtroCategoria) return false
        if (filtroOrgao !== "Todos" && item.unidade !== filtroOrgao) return false
        if (item.ano !== filtroAno) return false
        if (b) return item.rubrica.toLowerCase().includes(b) || item.codigo.includes(b) || item.unidade.toLowerCase().includes(b)
        return true
      })
    }

    // 2. Despesas
    if (abaAtiva === "despesas") {
      return DADOS_DESPESAS.filter((item) => {
        if (filtroSituacao !== "Todos" && item.situacao !== filtroSituacao) return false
        if (filtroOrgao !== "Todos" && !item.unidade.includes(filtroOrgao)) return false
        if (item.ano !== filtroAno) return false
        if (b) return item.credor.toLowerCase().includes(b) || item.documento.toLowerCase().includes(b) || item.funcao.toLowerCase().includes(b)
        return true
      })
    }

    // 3. Contratos
    if (abaAtiva === "contratos") {
      return DADOS_CONTRATOS.filter((item) => {
        if (filtroSituacao !== "Todos" && item.status !== filtroSituacao) return false
        if (filtroOrgao !== "Todos" && !item.unidade.includes(filtroOrgao)) return false
        if (item.ano !== filtroAno) return false
        if (b) return item.empresa.toLowerCase().includes(b) || item.numeroContrato.toLowerCase().includes(b) || item.objeto.toLowerCase().includes(b)
        return true
      })
    }

    // 4. Licitações
    if (abaAtiva === "licitacoes") {
      return DADOS_LICITACOES.filter((item) => {
        if (filtroSituacao !== "Todos" && item.situacao !== filtroSituacao) return false
        if (filtroCategoria !== "Todos" && item.modalidade !== filtroCategoria) return false
        if (item.ano !== filtroAno) return false
        if (b) return item.edital.toLowerCase().includes(b) || item.objeto.toLowerCase().includes(b) || item.vencedor.toLowerCase().includes(b)
        return true
      })
    }

    // 5. Adiantamentos
    if (abaAtiva === "adiantamentos") {
      return DADOS_ADIANTAMENTOS.filter((item) => {
        if (filtroSituacao !== "Todos" && item.situacao !== filtroSituacao) return false
        if (filtroOrgao !== "Todos" && !item.orgao.includes(filtroOrgao)) return false
        if (item.ano !== filtroAno) return false
        if (b) return item.responsavel.toLowerCase().includes(b) || item.processo.toLowerCase().includes(b) || item.finalidade.toLowerCase().includes(b)
        return true
      })
    }

    // 6. Ordem Cronológica
    if (abaAtiva === "ordem-cronologica") {
      return DADOS_ORDEM_CRONOLOGICA.filter((item) => {
        if (filtroOrgao !== "Todos" && !item.unidade.includes(filtroOrgao)) return false
        if (item.ano !== filtroAno) return false
        if (b) return item.credor.toLowerCase().includes(b) || item.liquidacao.toLowerCase().includes(b) || item.status.toLowerCase().includes(b)
        return true
      })
    }

    // 7. Obras
    if (abaAtiva === "obras") {
      return DADOS_OBRAS.filter((item) => {
        if (filtroSituacao !== "Todos" && item.status !== filtroSituacao) return false
        if (filtroOrgao !== "Todos" && item.orgao !== filtroOrgao) return false
        if (item.ano !== filtroAno) return false
        if (b) return item.descricao.toLowerCase().includes(b) || item.municipio.toLowerCase().includes(b) || item.construtora.toLowerCase().includes(b)
        return true
      })
    }

    // 8. Pessoal
    if (abaAtiva === "pessoal") {
      return DADOS_PESSOAL.filter((item) => {
        if (filtroCategoria !== "Todos" && item.vinculo !== filtroCategoria) return false
        if (filtroOrgao !== "Todos" && !item.orgao.includes(filtroOrgao)) return false
        if (item.ano !== filtroAno) return false
        if (b) return item.nome.toLowerCase().includes(b) || item.cargo.toLowerCase().includes(b) || item.matricula.includes(b)
        return true
      })
    }

    // 9. Remuneração
    if (abaAtiva === "remuneracao") {
      return DADOS_REMUNERACAO.filter((item) => {
        if (filtroCategoria !== "Todos" && item.grupo !== filtroCategoria) return false
        if (item.ano !== filtroAno) return false
        if (b) return item.denominacao.toLowerCase().includes(b) || item.codigoCargo.toLowerCase().includes(b)
        return true
      })
    }

    // 10. Emendas Estaduais
    if (abaAtiva === "emendas-estaduais" || abaAtiva === "emendas-parlamentares") {
      return DADOS_EMENDAS_PARLAMENTARES.filter((item) => {
        if (filtroCategoria !== "Todos" && item.area !== filtroCategoria) return false
        if (item.ano !== filtroAno) return false
        if (b) return item.deputado.toLowerCase().includes(b) || item.municipio.toLowerCase().includes(b) || item.objeto.toLowerCase().includes(b)
        return true
      })
    }

    // 11. Emendas Federais
    if (abaAtiva === "emendas-federais") {
      return DADOS_EMENDAS_FEDERAIS.filter((item) => {
        if (filtroSituacao !== "Todos" && item.situacao !== filtroSituacao) return false
        if (item.ano !== filtroAno) return false
        if (b) return item.parlamentar.toLowerCase().includes(b) || item.municipio.toLowerCase().includes(b) || item.objeto.toLowerCase().includes(b)
        return true
      })
    }

    return []
  }, [abaAtiva, termoBusca, filtroCategoria, filtroOrgao, filtroSituacao, filtroAno])

  // Paginação
  const totalItens = dadosFiltrados.length
  const totalPaginas = Math.max(1, Math.ceil(totalItens / itensPorPagina))
  const dadosPaginados = useMemo(() => {
    const inicio = (paginaAtual - 1) * itensPorPagina
    return dadosFiltrados.slice(inicio, inicio + itensPorPagina)
  }, [dadosFiltrados, paginaAtual, itensPorPagina])

  function exportarDados() {
    if (!abaAtiva) return
    const blob = new Blob(["\uFEFF" + JSON.stringify(dadosFiltrados, null, 2)], {
      type: "application/json;charset=utf-8;",
    })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `consulta-${abaAtiva}.json`
    a.click()
    URL.revokeObjectURL(url)
  }

  const abaObj = abasDisponiveis.find((a) => a.id === abaAtiva)

  return (
    <div className="space-y-6">
      {/* ABAS / BOTÕES INTERATIVOS DO EIXO ATUAL */}
      <div
        role="tablist"
        aria-label="Selecionar aba de consulta"
        className={cn(
          "grid gap-3",
          abasDisponiveis.length === 1 && "grid-cols-1 max-w-xs",
          abasDisponiveis.length === 2 && "grid-cols-1 sm:grid-cols-2 max-w-xl",
          abasDisponiveis.length > 2 && "grid-cols-2 sm:grid-cols-3 lg:grid-cols-6"
        )}
      >
        {abasDisponiveis.map((a) => {
          const Icon = a.icon
          const ativo = abaAtiva === a.id
          return (
            <button
              key={a.id}
              type="button"
              role="tab"
              aria-selected={ativo}
              onClick={() => handleClicarAba(a.id)}
              className={cn(
                "group relative flex flex-col items-center justify-center rounded-2xl border p-4 text-center transition-all duration-200",
                "bg-card shadow-xs hover:shadow-md cursor-pointer",
                ativo
                  ? "border-primary ring-2 ring-primary/25 bg-primary/[0.03] shadow-sm -translate-y-0.5"
                  : "border-border/80 hover:border-primary/40 hover:-translate-y-0.5"
              )}
            >
              <span
                className={cn(
                  "flex size-12 items-center justify-center rounded-2xl transition-transform duration-200 group-hover:scale-105",
                  a.iconBg
                )}
              >
                <Icon className="size-6" aria-hidden="true" />
              </span>

              <span
                className={cn(
                  "mt-3 text-sm tracking-tight transition-colors",
                  ativo
                    ? "font-bold text-primary"
                    : "font-medium text-foreground group-hover:text-primary"
                )}
              >
                {a.label}
              </span>
            </button>
          )
        })}
      </div>

      {/* ESTADO VAZIO: Quando nenhuma aba está clicada */}
      {!abaAtiva ? (
        <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-border/80 p-8 md:p-10 text-center bg-card/40">
          <span className="flex size-12 items-center justify-center rounded-full bg-primary/10 text-primary mb-3">
            <Search className="size-6" aria-hidden="true" />
          </span>
          <h4 className="font-semibold text-foreground text-base">
            Selecione uma opção acima para consultar
          </h4>
          <p className="mt-1 text-sm text-muted-foreground max-w-md">
            Clique em uma das abas acima para abrir os filtros específicos, métricas e a tabela detalhada de registros.
          </p>
        </div>
      ) : (
        <div className="space-y-6 animate-in fade-in-50 duration-300">
          {/* ========================================================= */}
          {/* CARD DE FILTROS DA ABA SELECIONADA */}
          {/* ========================================================= */}
          <div className="rounded-2xl border border-border bg-card p-6 md:p-8 shadow-xs space-y-5">
            <div className="flex items-center justify-between border-b border-border/80 pb-4">
              <div>
                <h4 className="font-bold text-foreground text-base">
                  Filtros de {abaObj?.label}
                </h4>
                <p className="text-xs text-muted-foreground mt-0.5">
                  {abaObj?.descricao}
                </p>
              </div>
              <button
                type="button"
                onClick={handleLimparFiltros}
                className="inline-flex items-center gap-1.5 rounded-md border border-border px-3 py-1.5 text-xs font-medium text-muted-foreground hover:bg-muted hover:text-foreground transition-colors cursor-pointer"
              >
                <RotateCcw className="size-3.5" />
                Limpar filtros
              </button>
            </div>

            {/* FILTROS CONTEXTUAIS */}
            <div className="grid gap-4 sm:grid-cols-3">
              {/* Filtro 1: Categoria / Rubrica / Modalidade */}
              <div>
                <label className="block text-xs font-semibold text-muted-foreground mb-1.5">
                  {abaAtiva === "receita" ? "Categoria de Receita" :
                   abaAtiva === "licitacoes" ? "Modalidade de Licitação" :
                   abaAtiva === "pessoal" ? "Vínculo Funcional" :
                   abaAtiva === "remuneracao" ? "Grupo Ocupacional" :
                   (abaAtiva === "emendas-estaduais" || abaAtiva === "emendas-parlamentares") ? "Área Temática" :
                   "Categoria / Tipo"}
                </label>
                <select
                  value={filtroCategoria}
                  onChange={(e) => {
                    setFiltroCategoria(e.target.value)
                    setPaginaAtual(1)
                  }}
                  className="h-10 w-full rounded-md border border-input bg-background px-3 text-xs text-foreground focus:border-primary focus:outline-none"
                >
                  <option value="Todos">Todas as Categorias</option>
                  {abaAtiva === "receita" && (
                    <>
                      <option value="Tributária">Tributária (ICMS, IPVA)</option>
                      <option value="Transferências">Transferências (FPE, SUS, FUNDEB)</option>
                      <option value="Patrimonial">Patrimonial e Serviços</option>
                    </>
                  )}
                  {abaAtiva === "licitacoes" && (
                    <>
                      <option value="Pregão Eletrônico">Pregão Eletrônico</option>
                      <option value="Concorrência">Concorrência Pública</option>
                      <option value="Dispensa">Dispensa de Licitação</option>
                    </>
                  )}
                  {abaAtiva === "pessoal" && (
                    <>
                      <option value="Efetivo">Efetivo (Concursado)</option>
                      <option value="Comissionado">Comissionado</option>
                    </>
                  )}
                  {abaAtiva === "remuneracao" && (
                    <>
                      <option value="Tributação e Fiscalização">Tributação e Fiscalização</option>
                      <option value="Magistério Estadual">Magistério Estadual</option>
                      <option value="Saúde Pública">Saúde Pública</option>
                      <option value="Segurança e Defesa">Segurança e Defesa</option>
                      <option value="Advocacia Pública">Advocacia Pública</option>
                    </>
                  )}
                  {(abaAtiva === "emendas-estaduais" || abaAtiva === "emendas-parlamentares") && (
                    <>
                      <option value="Saúde">Saúde</option>
                      <option value="Infraestrutura">Infraestrutura</option>
                      <option value="Esporte e Lazer">Esporte e Lazer</option>
                      <option value="Agricultura">Agricultura</option>
                    </>
                  )}
                </select>
              </div>

              {/* Filtro 2: Órgão / Unidade Gestora */}
              <div>
                <label className="block text-xs font-semibold text-muted-foreground mb-1.5">
                  Órgão / Secretaria
                </label>
                <select
                  value={filtroOrgao}
                  onChange={(e) => {
                    setFiltroOrgao(e.target.value)
                    setPaginaAtual(1)
                  }}
                  className="h-10 w-full rounded-md border border-input bg-background px-3 text-xs text-foreground focus:border-primary focus:outline-none"
                >
                  <option value="Todos">Todos os Órgãos</option>
                  <option value="SEFAZ">SEFAZ (Fazenda)</option>
                  <option value="SES">SES (Saúde)</option>
                  <option value="SEDUC">SEDUC (Educação)</option>
                  <option value="SINFRA">SINFRA (Infraestrutura)</option>
                  <option value="SSP">SSP (Segurança)</option>
                  <option value="SEAD">SEAD (Administração)</option>
                </select>
              </div>

              {/* Filtro 3: Ano de Exercício */}
              <div>
                <label className="block text-xs font-semibold text-muted-foreground mb-1.5">
                  Ano de Exercício
                </label>
                <select
                  value={filtroAno}
                  onChange={(e) => {
                    setFiltroAno(Number(e.target.value))
                    setPaginaAtual(1)
                  }}
                  className="h-10 w-full rounded-md border border-input bg-background px-3 text-xs text-foreground focus:border-primary focus:outline-none"
                >
                  <option value={2026}>2026</option>
                  <option value={2025}>2025</option>
                  <option value={2024}>2024</option>
                </select>
              </div>
            </div>
          </div>

          {/* ========================================================= */}
          {/* 3 CARDS DE KPI ESPECÍFICOS DA ABA ATIVA */}
          {/* ========================================================= */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {abaAtiva === "receita" && (
              <>
                <div className="rounded-xl border border-border/80 bg-card p-5 text-center shadow-xs">
                  <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground">RECEITA ARRECADADA</p>
                  <p className="font-display text-2xl lg:text-3xl font-extrabold my-1.5 tabular text-foreground">{formatBRL(28450000000)}</p>
                  <span className="text-xs text-muted-foreground">Arrecadação total do Estado</span>
                </div>
                <div className="rounded-xl border border-primary/25 bg-gradient-to-br from-accent/30 via-card to-card p-5 text-center shadow-xs">
                  <p className="text-xs font-bold uppercase tracking-widest text-primary">PREVISÃO INICIAL</p>
                  <p className="font-display text-2xl lg:text-3xl font-extrabold my-1.5 tabular text-primary">{formatBRL(31200000000)}</p>
                  <span className="text-xs text-primary font-medium">Meta orçamentária anual</span>
                </div>
                <div className="rounded-xl border border-success/25 bg-gradient-to-br from-success/5 via-card to-card p-5 text-center shadow-xs">
                  <p className="text-xs font-bold uppercase tracking-widest text-success">% REALIZADO</p>
                  <p className="font-display text-2xl lg:text-3xl font-extrabold my-1.5 tabular text-success">91,2%</p>
                  <span className="text-xs text-success font-medium">Desempenho da arrecadação</span>
                </div>
              </>
            )}

            {abaAtiva === "despesas" && (
              <>
                <div className="rounded-xl border border-border/80 bg-card p-5 text-center shadow-xs">
                  <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground">TOTAL EMPENHADO</p>
                  <p className="font-display text-2xl lg:text-3xl font-extrabold my-1.5 tabular text-foreground">{formatBRL(26890000000)}</p>
                  <span className="text-xs text-muted-foreground">Fase de empenho da despesa</span>
                </div>
                <div className="rounded-xl border border-primary/25 bg-gradient-to-br from-accent/30 via-card to-card p-5 text-center shadow-xs">
                  <p className="text-xs font-bold uppercase tracking-widest text-primary">TOTAL LIQUIDADO</p>
                  <p className="font-display text-2xl lg:text-3xl font-extrabold my-1.5 tabular text-primary">{formatBRL(24120000000)}</p>
                  <span className="text-xs text-primary font-medium">Serviços e bens conferidos</span>
                </div>
                <div className="rounded-xl border border-success/25 bg-gradient-to-br from-success/5 via-card to-card p-5 text-center shadow-xs">
                  <p className="text-xs font-bold uppercase tracking-widest text-success">TOTAL PAGO</p>
                  <p className="font-display text-2xl lg:text-3xl font-extrabold my-1.5 tabular text-success">{formatBRL(23450000000)}</p>
                  <span className="text-xs text-success font-medium">Ordens bancárias emitidas</span>
                </div>
              </>
            )}

            {abaAtiva === "contratos" && (
              <>
                <div className="rounded-xl border border-border/80 bg-card p-5 text-center shadow-xs">
                  <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground">CONTRATOS ATIVOS</p>
                  <p className="font-display text-2xl lg:text-3xl font-extrabold my-1.5 tabular text-foreground">{formatNumber(1428)}</p>
                  <span className="text-xs text-muted-foreground">Termos vigentes no Estado</span>
                </div>
                <div className="rounded-xl border border-primary/25 bg-gradient-to-br from-accent/30 via-card to-card p-5 text-center shadow-xs">
                  <p className="text-xs font-bold uppercase tracking-widest text-primary">VALOR TOTAL CONTRATADO</p>
                  <p className="font-display text-2xl lg:text-3xl font-extrabold my-1.5 tabular text-primary">{formatBRL(3840000000)}</p>
                  <span className="text-xs text-primary font-medium">Compromissos acordados</span>
                </div>
                <div className="rounded-xl border border-success/25 bg-gradient-to-br from-success/5 via-card to-card p-5 text-center shadow-xs">
                  <p className="text-xs font-bold uppercase tracking-widest text-success">VALOR EXECUTADO</p>
                  <p className="font-display text-2xl lg:text-3xl font-extrabold my-1.5 tabular text-success">{formatBRL(2610000000)}</p>
                  <span className="text-xs text-success font-medium">Medições e pagamentos</span>
                </div>
              </>
            )}

            {abaAtiva === "licitacoes" && (
              <>
                <div className="rounded-xl border border-border/80 bg-card p-5 text-center shadow-xs">
                  <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground">LICITAÇÕES NO ANO</p>
                  <p className="font-display text-2xl lg:text-3xl font-extrabold my-1.5 tabular text-foreground">{formatNumber(892)}</p>
                  <span className="text-xs text-muted-foreground">Processos instaurados</span>
                </div>
                <div className="rounded-xl border border-primary/25 bg-gradient-to-br from-accent/30 via-card to-card p-5 text-center shadow-xs">
                  <p className="text-xs font-bold uppercase tracking-widest text-primary">VALOR HOMOLOGADO</p>
                  <p className="font-display text-2xl lg:text-3xl font-extrabold my-1.5 tabular text-primary">{formatBRL(1840000000)}</p>
                  <span className="text-xs text-primary font-medium">Propostas vencedoras</span>
                </div>
                <div className="rounded-xl border border-success/25 bg-gradient-to-br from-success/5 via-card to-card p-5 text-center shadow-xs">
                  <p className="text-xs font-bold uppercase tracking-widest text-success">ECONOMIA ESTIMADA</p>
                  <p className="font-display text-2xl lg:text-3xl font-extrabold my-1.5 tabular text-success">{formatBRL(215000000)}</p>
                  <span className="text-xs text-success font-medium">Desconto sobre a estimativa</span>
                </div>
              </>
            )}

            {abaAtiva === "adiantamentos" && (
              <>
                <div className="rounded-xl border border-border/80 bg-card p-5 text-center shadow-xs">
                  <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground">TOTAL CONCEDIDO</p>
                  <p className="font-display text-2xl lg:text-3xl font-extrabold my-1.5 tabular text-foreground">{formatBRL(14850000)}</p>
                  <span className="text-xs text-muted-foreground">Suprimentos de fundos</span>
                </div>
                <div className="rounded-xl border border-primary/25 bg-gradient-to-br from-accent/30 via-card to-card p-5 text-center shadow-xs">
                  <p className="text-xs font-bold uppercase tracking-widest text-primary">PRESTAÇÕES APROVADAS</p>
                  <p className="font-display text-2xl lg:text-3xl font-extrabold my-1.5 tabular text-primary">{formatBRL(13200000)}</p>
                  <span className="text-xs text-primary font-medium">88,9% das contas validadas</span>
                </div>
                <div className="rounded-xl border border-success/25 bg-gradient-to-br from-success/5 via-card to-card p-5 text-center shadow-xs">
                  <p className="text-xs font-bold uppercase tracking-widest text-success">SALDO A COMPROVAR</p>
                  <p className="font-display text-2xl lg:text-3xl font-extrabold my-1.5 tabular text-success">{formatBRL(1650000)}</p>
                  <span className="text-xs text-success font-medium">Dentro do prazo legal</span>
                </div>
              </>
            )}

            {abaAtiva === "ordem-cronologica" && (
              <>
                <div className="rounded-xl border border-border/80 bg-card p-5 text-center shadow-xs">
                  <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground">PROCESSOS NA FILA</p>
                  <p className="font-display text-2xl lg:text-3xl font-extrabold my-1.5 tabular text-foreground">{formatNumber(1842)}</p>
                  <span className="text-xs text-muted-foreground">Liquidações aguardando pagamento</span>
                </div>
                <div className="rounded-xl border border-primary/25 bg-gradient-to-br from-accent/30 via-card to-card p-5 text-center shadow-xs">
                  <p className="text-xs font-bold uppercase tracking-widest text-primary">VALOR DA FILA</p>
                  <p className="font-display text-2xl lg:text-3xl font-extrabold my-1.5 tabular text-primary">{formatBRL(412000000)}</p>
                  <span className="text-xs text-primary font-medium">Total em ordem de pagamento</span>
                </div>
                <div className="rounded-xl border border-success/25 bg-gradient-to-br from-success/5 via-card to-card p-5 text-center shadow-xs">
                  <p className="text-xs font-bold uppercase tracking-widest text-success">TEMPO MÉDIO</p>
                  <p className="font-display text-2xl lg:text-3xl font-extrabold my-1.5 tabular text-success">18 dias</p>
                  <span className="text-xs text-success font-medium">Prazo médio de desembolso</span>
                </div>
              </>
            )}

            {abaAtiva === "obras" && (
              <>
                <div className="rounded-xl border border-border/80 bg-card p-5 text-center shadow-xs">
                  <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground">OBRAS EM ANDAMENTO</p>
                  <p className="font-display text-2xl lg:text-3xl font-extrabold my-1.5 tabular text-foreground">{formatNumber(287)}</p>
                  <span className="text-xs text-muted-foreground">Em execução no Maranhão</span>
                </div>
                <div className="rounded-xl border border-primary/25 bg-gradient-to-br from-accent/30 via-card to-card p-5 text-center shadow-xs">
                  <p className="text-xs font-bold uppercase tracking-widest text-primary">VALOR CONTRATADO</p>
                  <p className="font-display text-2xl lg:text-3xl font-extrabold my-1.5 tabular text-primary">{formatBRL(2450000000)}</p>
                  <span className="text-xs text-primary font-medium">Investimentos em infraestrutura</span>
                </div>
                <div className="rounded-xl border border-success/25 bg-gradient-to-br from-success/5 via-card to-card p-5 text-center shadow-xs">
                  <p className="text-xs font-bold uppercase tracking-widest text-success">EXECUÇÃO MÉDIA</p>
                  <p className="font-display text-2xl lg:text-3xl font-extrabold my-1.5 tabular text-success">64,5%</p>
                  <span className="text-xs text-success font-medium">Avanço físico acumulado</span>
                </div>
              </>
            )}

            {abaAtiva === "pessoal" && (
              <>
                <div className="rounded-xl border border-border/80 bg-card p-5 text-center shadow-xs">
                  <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground">TOTAL SERVIDORES</p>
                  <p className="font-display text-2xl lg:text-3xl font-extrabold my-1.5 tabular text-foreground">{formatNumber(118420)}</p>
                  <span className="text-xs text-muted-foreground">Quadro funcional estadual</span>
                </div>
                <div className="rounded-xl border border-primary/25 bg-gradient-to-br from-accent/30 via-card to-card p-5 text-center shadow-xs">
                  <p className="text-xs font-bold uppercase tracking-widest text-primary">EFETIVOS CONCURSADOS</p>
                  <p className="font-display text-2xl lg:text-3xl font-extrabold my-1.5 tabular text-primary">{formatNumber(82150)}</p>
                  <span className="text-xs text-primary font-medium">69,3% do quadro</span>
                </div>
                <div className="rounded-xl border border-success/25 bg-gradient-to-br from-success/5 via-card to-card p-5 text-center shadow-xs">
                  <p className="text-xs font-bold uppercase tracking-widest text-success">FOLHA MENSAL LÍQUIDA</p>
                  <p className="font-display text-2xl lg:text-3xl font-extrabold my-1.5 tabular text-success">{formatBRL(412890000)}</p>
                  <span className="text-xs text-success font-medium">Competência mensal</span>
                </div>
              </>
            )}

            {abaAtiva === "remuneracao" && (
              <>
                <div className="rounded-xl border border-border/80 bg-card p-5 text-center shadow-xs">
                  <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground">MÉDIA SALARIAL BRUTA</p>
                  <p className="font-display text-2xl lg:text-3xl font-extrabold my-1.5 tabular text-foreground">{formatBRL(6840)}</p>
                  <span className="text-xs text-muted-foreground">Média geral dos cargos</span>
                </div>
                <div className="rounded-xl border border-primary/25 bg-gradient-to-br from-accent/30 via-card to-card p-5 text-center shadow-xs">
                  <p className="text-xs font-bold uppercase tracking-widest text-primary">TETO CONSTITUCIONAL</p>
                  <p className="font-display text-2xl lg:text-3xl font-extrabold my-1.5 tabular text-primary">{formatBRL(44008.52)}</p>
                  <span className="text-xs text-primary font-medium">Subteto Poder Executivo</span>
                </div>
                <div className="rounded-xl border border-success/25 bg-gradient-to-br from-success/5 via-card to-card p-5 text-center shadow-xs">
                  <p className="text-xs font-bold uppercase tracking-widest text-success">GASTO TOTAL ANUAL</p>
                  <p className="font-display text-2xl lg:text-3xl font-extrabold my-1.5 tabular text-success">{formatBRL(4950000000)}</p>
                  <span className="text-xs text-success font-medium">Folha anual consolidada</span>
                </div>
              </>
            )}

            {(abaAtiva === "emendas-estaduais" || abaAtiva === "emendas-parlamentares") && (
              <>
                <div className="rounded-xl border border-border/80 bg-card p-5 text-center shadow-xs">
                  <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground">TOTAL EMENDAS ESTADUAIS</p>
                  <p className="font-display text-2xl lg:text-3xl font-extrabold my-1.5 tabular text-foreground">{formatBRL(310000000)}</p>
                  <span className="text-xs text-muted-foreground">Orçamento estadual impositivo da ALEMA</span>
                </div>
                <div className="rounded-xl border border-primary/25 bg-gradient-to-br from-accent/30 via-card to-card p-5 text-center shadow-xs">
                  <p className="text-xs font-bold uppercase tracking-widest text-primary">VALOR PAGO</p>
                  <p className="font-display text-2xl lg:text-3xl font-extrabold my-1.5 tabular text-primary">{formatBRL(245000000)}</p>
                  <span className="text-xs text-primary font-medium">79,0% já executado</span>
                </div>
                <div className="rounded-xl border border-success/25 bg-gradient-to-br from-success/5 via-card to-card p-5 text-center shadow-xs">
                  <p className="text-xs font-bold uppercase tracking-widest text-success">MUNICÍPIOS BENEFICIADOS</p>
                  <p className="font-display text-2xl lg:text-3xl font-extrabold my-1.5 tabular text-success">217</p>
                  <span className="text-xs text-success font-medium">100% dos municípios atendidos</span>
                </div>
              </>
            )}

            {abaAtiva === "emendas-federais" && (
              <>
                <div className="rounded-xl border border-border/80 bg-card p-5 text-center shadow-xs">
                  <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground">RECURSOS FEDERAIS INDICADOS</p>
                  <p className="font-display text-2xl lg:text-3xl font-extrabold my-1.5 tabular text-foreground">{formatBRL(518000000)}</p>
                  <span className="text-xs text-muted-foreground">Bancada Federal MA</span>
                </div>
                <div className="rounded-xl border border-primary/25 bg-gradient-to-br from-accent/30 via-card to-card p-5 text-center shadow-xs">
                  <p className="text-xs font-bold uppercase tracking-widest text-primary">REPASSES EFETIVADOS</p>
                  <p className="font-display text-2xl lg:text-3xl font-extrabold my-1.5 tabular text-primary">{formatBRL(382000000)}</p>
                  <span className="text-xs text-primary font-medium">Transferências da União</span>
                </div>
                <div className="rounded-xl border border-success/25 bg-gradient-to-br from-success/5 via-card to-card p-5 text-center shadow-xs">
                  <p className="text-xs font-bold uppercase tracking-widest text-success">CONVÊNIOS ATIVOS</p>
                  <p className="font-display text-2xl lg:text-3xl font-extrabold my-1.5 tabular text-success">312</p>
                  <span className="text-xs text-success font-medium">Termos em acompanhamento</span>
                </div>
              </>
            )}
          </div>

          {/* ========================================================= */}
          {/* BARRA DE FERRAMENTAS DA TABELA */}
          {/* ========================================================= */}
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3 pt-2">
            <div className="flex flex-wrap items-center gap-3 text-xs">
              <div className="flex items-center gap-1.5">
                <span className="text-muted-foreground font-medium">Exibir</span>
                <select
                  value={itensPorPagina}
                  onChange={(e) => {
                    setItensPorPagina(Number(e.target.value))
                    setPaginaAtual(1)
                  }}
                  className="h-8 rounded border border-input bg-background px-2 text-xs text-foreground focus:border-primary focus:outline-none"
                >
                  <option value={5}>5 por página</option>
                  <option value={10}>10 por página</option>
                  <option value={20}>20 por página</option>
                </select>
              </div>

              <span className="text-xs text-muted-foreground">
                Total: <strong>{totalItens}</strong> registros
              </span>
            </div>

            <div className="flex items-center gap-2">
              <div className="relative flex-1 sm:w-72">
                <Search className="pointer-events-none absolute left-2.5 top-1/2 size-3.5 -translate-y-1/2 text-muted-foreground" />
                <input
                  type="search"
                  value={termoBusca}
                  onChange={(e) => {
                    setTermoBusca(e.target.value)
                    setPaginaAtual(1)
                  }}
                  placeholder={`Buscar em ${abaObj?.label.toLowerCase()}...`}
                  className="h-8 w-full rounded border border-input bg-background pl-8 pr-3 text-xs text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                />
              </div>

              <button
                type="button"
                onClick={exportarDados}
                className="h-8 rounded border border-border bg-card hover:bg-muted px-3 text-xs font-semibold text-foreground transition-colors cursor-pointer"
              >
                Exportar
              </button>
              <button
                type="button"
                onClick={() => window.print()}
                className="h-8 rounded border border-primary/30 bg-primary/10 hover:bg-primary/20 px-3 text-xs font-semibold text-primary transition-colors cursor-pointer"
              >
                PDF
              </button>
            </div>
          </div>

          {/* ========================================================= */}
          {/* TABELA DE REGISTROS ESPECÍFICA */}
          {/* ========================================================= */}
          <div className="overflow-x-auto rounded-xl border border-border bg-card shadow-xs">
            {/* 1. TABELA RECEITA */}
            {abaAtiva === "receita" && (
              <table className="w-full text-left text-xs">
                <thead className="border-b border-border bg-muted/60 font-semibold text-muted-foreground">
                  <tr>
                    <th className="px-3.5 py-3 whitespace-nowrap">Código</th>
                    <th className="px-3.5 py-3 min-w-[220px]">Origem / Rubrica</th>
                    <th className="px-3.5 py-3 whitespace-nowrap">Categoria</th>
                    <th className="px-3.5 py-3 whitespace-nowrap">Unidade Arrecadadora</th>
                    <th className="px-3.5 py-3 text-right whitespace-nowrap">Previsão Inicial</th>
                    <th className="px-3.5 py-3 text-right whitespace-nowrap text-success font-semibold">Valor Arrecadado</th>
                    <th className="px-3.5 py-3 text-center whitespace-nowrap">Situação</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {dadosPaginados.map((item: any) => (
                    <tr key={item.id} className="hover:bg-accent/30 transition-colors">
                      <td className="px-3.5 py-3.5 font-mono text-muted-foreground whitespace-nowrap">{item.codigo}</td>
                      <td className="px-3.5 py-3.5 font-semibold text-foreground">{item.rubrica}</td>
                      <td className="px-3.5 py-3.5 whitespace-nowrap">
                        <span className="inline-flex rounded-full bg-muted px-2.5 py-0.5 text-[11px] font-medium text-foreground">{item.categoria}</span>
                      </td>
                      <td className="px-3.5 py-3.5 font-medium text-foreground">{item.unidade}</td>
                      <td className="px-3.5 py-3.5 text-right tabular text-muted-foreground whitespace-nowrap">{formatBRL(item.previsao)}</td>
                      <td className="px-3.5 py-3.5 text-right font-bold text-success tabular whitespace-nowrap">{formatBRL(item.arrecadado)}</td>
                      <td className="px-3.5 py-3.5 text-center whitespace-nowrap">
                        <span className="inline-flex rounded-full bg-success/10 text-success ring-1 ring-success/30 px-2.5 py-0.5 text-[11px] font-semibold">{item.situacao}</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}

            {/* 2. TABELA DESPESAS */}
            {abaAtiva === "despesas" && (
              <table className="w-full text-left text-xs">
                <thead className="border-b border-border bg-muted/60 font-semibold text-muted-foreground">
                  <tr>
                    <th className="px-3.5 py-3 whitespace-nowrap">Nº Documento</th>
                    <th className="px-3.5 py-3 whitespace-nowrap">Data</th>
                    <th className="px-3.5 py-3 min-w-[190px]">Unidade Gestora</th>
                    <th className="px-3.5 py-3 min-w-[210px]">Credor / Favorecido</th>
                    <th className="px-3.5 py-3 whitespace-nowrap">Função</th>
                    <th className="px-3.5 py-3 text-right whitespace-nowrap">Empenhado</th>
                    <th className="px-3.5 py-3 text-right whitespace-nowrap text-primary">Liquidado</th>
                    <th className="px-3.5 py-3 text-right whitespace-nowrap text-success font-semibold">Pago</th>
                    <th className="px-3.5 py-3 text-center whitespace-nowrap">Fase Atual</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {dadosPaginados.map((item: any) => (
                    <tr key={item.id} className="hover:bg-accent/30 transition-colors">
                      <td className="px-3.5 py-3.5 font-mono text-foreground font-medium whitespace-nowrap">{item.documento}</td>
                      <td className="px-3.5 py-3.5 tabular text-muted-foreground whitespace-nowrap">{item.data}</td>
                      <td className="px-3.5 py-3.5 font-medium text-foreground">{item.unidade}</td>
                      <td className="px-3.5 py-3.5 font-semibold text-foreground">{item.credor}</td>
                      <td className="px-3.5 py-3.5 text-muted-foreground whitespace-nowrap">{item.funcao}</td>
                      <td className="px-3.5 py-3.5 text-right tabular text-muted-foreground whitespace-nowrap">{formatBRL(item.empenhado)}</td>
                      <td className="px-3.5 py-3.5 text-right font-semibold text-primary tabular whitespace-nowrap">{formatBRL(item.liquidado)}</td>
                      <td className="px-3.5 py-3.5 text-right font-bold text-success tabular whitespace-nowrap">{formatBRL(item.pago)}</td>
                      <td className="px-3.5 py-3.5 text-center whitespace-nowrap">
                        <span className="inline-flex rounded-full bg-primary/10 text-primary ring-1 ring-primary/30 px-2.5 py-0.5 text-[11px] font-semibold">{item.situacao}</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}

            {/* 3. TABELA CONTRATOS */}
            {abaAtiva === "contratos" && (
              <table className="w-full text-left text-xs">
                <thead className="border-b border-border bg-muted/60 font-semibold text-muted-foreground">
                  <tr>
                    <th className="px-3.5 py-3 whitespace-nowrap">Nº Contrato</th>
                    <th className="px-3.5 py-3 whitespace-nowrap">Processo</th>
                    <th className="px-3.5 py-3 min-w-[210px]">Contratada</th>
                    <th className="px-3.5 py-3 min-w-[260px]">Objeto</th>
                    <th className="px-3.5 py-3 min-w-[150px]">Órgão</th>
                    <th className="px-3.5 py-3 whitespace-nowrap">Vigência</th>
                    <th className="px-3.5 py-3 text-right whitespace-nowrap">Valor Total</th>
                    <th className="px-3.5 py-3 text-right whitespace-nowrap text-success font-semibold">Executado</th>
                    <th className="px-3.5 py-3 text-center whitespace-nowrap">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {dadosPaginados.map((item: any) => (
                    <tr key={item.id} className="hover:bg-accent/30 transition-colors">
                      <td className="px-3.5 py-3.5 font-mono font-bold text-foreground whitespace-nowrap">{item.numeroContrato}</td>
                      <td className="px-3.5 py-3.5 text-muted-foreground whitespace-nowrap">{item.processo}</td>
                      <td className="px-3.5 py-3.5">
                        <p className="font-semibold text-foreground">{item.empresa}</p>
                        <p className="text-[10px] text-muted-foreground">{item.cnpj}</p>
                      </td>
                      <td className="px-3.5 py-3.5 text-muted-foreground line-clamp-2">{item.objeto}</td>
                      <td className="px-3.5 py-3.5 font-medium text-foreground">{item.unidade}</td>
                      <td className="px-3.5 py-3.5 tabular text-muted-foreground whitespace-nowrap">{item.vigencia}</td>
                      <td className="px-3.5 py-3.5 text-right font-bold tabular whitespace-nowrap text-foreground">{formatBRL(item.valorTotal)}</td>
                      <td className="px-3.5 py-3.5 text-right font-bold tabular whitespace-nowrap text-success">{formatBRL(item.valorExecutado)}</td>
                      <td className="px-3.5 py-3.5 text-center whitespace-nowrap">
                        <span className="inline-flex rounded-full bg-primary/10 text-primary ring-1 ring-primary/20 px-2.5 py-0.5 text-[11px] font-semibold">{item.status}</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}

            {/* 4. TABELA LICITAÇÕES */}
            {abaAtiva === "licitacoes" && (
              <table className="w-full text-left text-xs">
                <thead className="border-b border-border bg-muted/60 font-semibold text-muted-foreground">
                  <tr>
                    <th className="px-3.5 py-3 whitespace-nowrap">Nº Edital</th>
                    <th className="px-3.5 py-3 whitespace-nowrap">Data Abertura</th>
                    <th className="px-3.5 py-3 whitespace-nowrap">Modalidade</th>
                    <th className="px-3.5 py-3 min-w-[150px]">Órgão</th>
                    <th className="px-3.5 py-3 min-w-[260px]">Objeto</th>
                    <th className="px-3.5 py-3 text-right whitespace-nowrap">Valor Estimado</th>
                    <th className="px-3.5 py-3 text-right whitespace-nowrap text-primary font-semibold">Valor Homologado</th>
                    <th className="px-3.5 py-3 min-w-[190px]">Vencedor</th>
                    <th className="px-3.5 py-3 text-center whitespace-nowrap">Situação</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {dadosPaginados.map((item: any) => (
                    <tr key={item.id} className="hover:bg-accent/30 transition-colors">
                      <td className="px-3.5 py-3.5 font-mono font-bold text-foreground whitespace-nowrap">{item.edital}</td>
                      <td className="px-3.5 py-3.5 tabular text-muted-foreground whitespace-nowrap">{item.dataAbertura}</td>
                      <td className="px-3.5 py-3.5 whitespace-nowrap">
                        <span className="inline-flex rounded-full bg-primary/10 px-2.5 py-0.5 text-[11px] font-medium text-primary">{item.modalidade}</span>
                      </td>
                      <td className="px-3.5 py-3.5 font-medium text-foreground">{item.orgao}</td>
                      <td className="px-3.5 py-3.5 text-muted-foreground line-clamp-2">{item.objeto}</td>
                      <td className="px-3.5 py-3.5 text-right tabular text-muted-foreground whitespace-nowrap">{formatBRL(item.valorEstimado)}</td>
                      <td className="px-3.5 py-3.5 text-right font-bold text-primary tabular whitespace-nowrap">{item.valorHomologado > 0 ? formatBRL(item.valorHomologado) : "—"}</td>
                      <td className="px-3.5 py-3.5 font-medium text-foreground">{item.vencedor}</td>
                      <td className="px-3.5 py-3.5 text-center whitespace-nowrap">
                        <span className={cn("inline-flex rounded-full px-2.5 py-0.5 text-[11px] font-semibold ring-1", item.situacao === "Homologada" ? "bg-success/10 text-success ring-success/30" : "bg-amber-500/10 text-amber-600 ring-amber-500/30")}>{item.situacao}</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}

            {/* 5. TABELA ADIANTAMENTOS */}
            {abaAtiva === "adiantamentos" && (
              <table className="w-full text-left text-xs">
                <thead className="border-b border-border bg-muted/60 font-semibold text-muted-foreground">
                  <tr>
                    <th className="px-3.5 py-3 whitespace-nowrap">Nº Processo / Portaria</th>
                    <th className="px-3.5 py-3 whitespace-nowrap">Data</th>
                    <th className="px-3.5 py-3 min-w-[200px]">Responsável / Suprido</th>
                    <th className="px-3.5 py-3 min-w-[160px]">Órgão</th>
                    <th className="px-3.5 py-3 min-w-[240px]">Finalidade</th>
                    <th className="px-3.5 py-3 text-right whitespace-nowrap">Concedido</th>
                    <th className="px-3.5 py-3 text-right whitespace-nowrap text-success font-semibold">Prestado</th>
                    <th className="px-3.5 py-3 text-right whitespace-nowrap">Saldo</th>
                    <th className="px-3.5 py-3 text-center whitespace-nowrap">Situação</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {dadosPaginados.map((item: any) => (
                    <tr key={item.id} className="hover:bg-accent/30 transition-colors">
                      <td className="px-3.5 py-3.5 font-mono text-muted-foreground whitespace-nowrap">{item.processo}</td>
                      <td className="px-3.5 py-3.5 tabular text-muted-foreground whitespace-nowrap">{item.data}</td>
                      <td className="px-3.5 py-3.5 font-bold text-foreground">{item.responsavel}</td>
                      <td className="px-3.5 py-3.5 text-muted-foreground">{item.orgao}</td>
                      <td className="px-3.5 py-3.5 text-muted-foreground line-clamp-2">{item.finalidade}</td>
                      <td className="px-3.5 py-3.5 text-right font-medium tabular whitespace-nowrap">{formatBRL(item.concedido)}</td>
                      <td className="px-3.5 py-3.5 text-right font-bold text-success tabular whitespace-nowrap">{formatBRL(item.prestado)}</td>
                      <td className="px-3.5 py-3.5 text-right tabular text-muted-foreground whitespace-nowrap">{formatBRL(item.saldo)}</td>
                      <td className="px-3.5 py-3.5 text-center whitespace-nowrap">
                        <span className={cn("inline-flex rounded-full px-2.5 py-0.5 text-[11px] font-semibold ring-1", item.situacao === "Aprovada" ? "bg-success/10 text-success ring-success/30" : "bg-amber-500/10 text-amber-600 ring-amber-500/30")}>{item.situacao}</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}

            {/* 6. TABELA ORDEM CRONOLÓGICA */}
            {abaAtiva === "ordem-cronologica" && (
              <table className="w-full text-left text-xs">
                <thead className="border-b border-border bg-muted/60 font-semibold text-muted-foreground">
                  <tr>
                    <th className="px-3.5 py-3 text-center whitespace-nowrap">Posição na Fila</th>
                    <th className="px-3.5 py-3 whitespace-nowrap">Nº Liquidação</th>
                    <th className="px-3.5 py-3 whitespace-nowrap">Protocolo</th>
                    <th className="px-3.5 py-3 min-w-[210px]">Credor / Fornecedor</th>
                    <th className="px-3.5 py-3 min-w-[180px]">Unidade Gestora</th>
                    <th className="px-3.5 py-3 whitespace-nowrap">Fonte de Recurso</th>
                    <th className="px-3.5 py-3 text-right whitespace-nowrap text-primary font-semibold">Valor a Pagar</th>
                    <th className="px-3.5 py-3 whitespace-nowrap">Previsão</th>
                    <th className="px-3.5 py-3 text-center whitespace-nowrap">Status da Fila</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {dadosPaginados.map((item: any) => (
                    <tr key={item.id} className="hover:bg-accent/30 transition-colors">
                      <td className="px-3.5 py-3.5 text-center whitespace-nowrap font-bold text-foreground">
                        <span className="inline-flex size-6 items-center justify-center rounded-full bg-primary/10 text-primary font-mono text-xs">{item.posicao}º</span>
                      </td>
                      <td className="px-3.5 py-3.5 font-mono text-muted-foreground whitespace-nowrap">{item.liquidacao}</td>
                      <td className="px-3.5 py-3.5 tabular text-muted-foreground whitespace-nowrap">{item.protocolo}</td>
                      <td className="px-3.5 py-3.5 font-semibold text-foreground">{item.credor}</td>
                      <td className="px-3.5 py-3.5 font-medium text-foreground">{item.unidade}</td>
                      <td className="px-3.5 py-3.5 text-muted-foreground whitespace-nowrap">{item.fonte}</td>
                      <td className="px-3.5 py-3.5 text-right font-bold text-primary tabular whitespace-nowrap">{formatBRL(item.valor)}</td>
                      <td className="px-3.5 py-3.5 whitespace-nowrap text-muted-foreground">{item.previsao}</td>
                      <td className="px-3.5 py-3.5 text-center whitespace-nowrap">
                        <span className="inline-flex rounded-full bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300 ring-1 ring-emerald-600/20 px-2.5 py-0.5 text-[11px] font-semibold">{item.status}</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}

            {/* 7. TABELA OBRAS */}
            {abaAtiva === "obras" && (
              <table className="w-full text-left text-xs">
                <thead className="border-b border-border bg-muted/60 font-semibold text-muted-foreground">
                  <tr>
                    <th className="px-3.5 py-3 whitespace-nowrap">Nº Contrato / Obra</th>
                    <th className="px-3.5 py-3 min-w-[240px]">Descrição da Obra</th>
                    <th className="px-3.5 py-3 whitespace-nowrap">Município</th>
                    <th className="px-3.5 py-3 whitespace-nowrap">Órgão</th>
                    <th className="px-3.5 py-3 min-w-[200px]">Construtora</th>
                    <th className="px-3.5 py-3 text-right whitespace-nowrap">Valor Total</th>
                    <th className="px-3.5 py-3 text-center whitespace-nowrap">% Concluído</th>
                    <th className="px-3.5 py-3 whitespace-nowrap">Previsão Entrega</th>
                    <th className="px-3.5 py-3 text-center whitespace-nowrap">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {dadosPaginados.map((item: any) => (
                    <tr key={item.id} className="hover:bg-accent/30 transition-colors">
                      <td className="px-3.5 py-3.5 font-mono font-bold text-foreground whitespace-nowrap">{item.contrato}</td>
                      <td className="px-3.5 py-3.5 font-semibold text-foreground line-clamp-2">{item.descricao}</td>
                      <td className="px-3.5 py-3.5 font-medium text-foreground whitespace-nowrap">{item.municipio}</td>
                      <td className="px-3.5 py-3.5 text-muted-foreground whitespace-nowrap">{item.orgao}</td>
                      <td className="px-3.5 py-3.5 text-muted-foreground">{item.construtora}</td>
                      <td className="px-3.5 py-3.5 text-right font-bold text-foreground tabular whitespace-nowrap">{formatBRL(item.valorTotal)}</td>
                      <td className="px-3.5 py-3.5 text-center whitespace-nowrap">
                        <span className="inline-flex rounded-full bg-primary/10 text-primary px-2 py-0.5 text-xs font-bold">{item.concluido}%</span>
                      </td>
                      <td className="px-3.5 py-3.5 tabular text-muted-foreground whitespace-nowrap">{item.previsaoEntrega}</td>
                      <td className="px-3.5 py-3.5 text-center whitespace-nowrap">
                        <span className={cn("inline-flex rounded-full px-2.5 py-0.5 text-[11px] font-semibold ring-1", item.status === "Concluída" ? "bg-success/10 text-success ring-success/30" : "bg-amber-500/10 text-amber-600 ring-amber-500/30")}>{item.status}</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}

            {/* 8. TABELA PESSOAL */}
            {abaAtiva === "pessoal" && (
              <table className="w-full text-left text-xs">
                <thead className="border-b border-border bg-muted/60 font-semibold text-muted-foreground">
                  <tr>
                    <th className="px-3.5 py-3 whitespace-nowrap">Matrícula</th>
                    <th className="px-3.5 py-3 min-w-[200px]">Servidor</th>
                    <th className="px-3.5 py-3 min-w-[180px]">Cargo / Função</th>
                    <th className="px-3.5 py-3 min-w-[180px]">Órgão de Lotação</th>
                    <th className="px-3.5 py-3 whitespace-nowrap">Vínculo</th>
                    <th className="px-3.5 py-3 whitespace-nowrap">Admissão</th>
                    <th className="px-3.5 py-3 text-right whitespace-nowrap">Remuneração Bruta</th>
                    <th className="px-3.5 py-3 text-right whitespace-nowrap text-success font-semibold">Líquido</th>
                    <th className="px-3.5 py-3 text-center whitespace-nowrap">Situação</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {dadosPaginados.map((item: any) => (
                    <tr key={item.id} className="hover:bg-accent/30 transition-colors">
                      <td className="px-3.5 py-3.5 font-mono text-muted-foreground whitespace-nowrap">{item.matricula}</td>
                      <td className="px-3.5 py-3.5">
                        <p className="font-semibold text-foreground">{item.nome}</p>
                        <p className="text-[10px] text-muted-foreground">{item.cpf}</p>
                      </td>
                      <td className="px-3.5 py-3.5 font-medium text-foreground">{item.cargo}</td>
                      <td className="px-3.5 py-3.5 text-muted-foreground">{item.orgao}</td>
                      <td className="px-3.5 py-3.5">
                        <span className="inline-flex rounded-full bg-primary/10 px-2.5 py-0.5 text-[11px] font-medium text-primary">{item.vinculo}</span>
                      </td>
                      <td className="px-3.5 py-3.5 tabular text-muted-foreground whitespace-nowrap">{item.admissao}</td>
                      <td className="px-3.5 py-3.5 text-right font-medium tabular whitespace-nowrap">{formatBRL(item.remuneracaoBruta)}</td>
                      <td className="px-3.5 py-3.5 text-right font-bold text-success tabular whitespace-nowrap">{formatBRL(item.remuneracaoLiquida)}</td>
                      <td className="px-3.5 py-3.5 text-center whitespace-nowrap">
                        <span className="inline-flex rounded-full bg-success/10 text-success ring-1 ring-success/30 px-2.5 py-0.5 text-[11px] font-semibold">{item.situacao}</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}

            {/* 9. TABELA REMUNERAÇÃO */}
            {abaAtiva === "remuneracao" && (
              <table className="w-full text-left text-xs">
                <thead className="border-b border-border bg-muted/60 font-semibold text-muted-foreground">
                  <tr>
                    <th className="px-3.5 py-3 whitespace-nowrap">Código</th>
                    <th className="px-3.5 py-3 min-w-[220px]">Denominação do Cargo</th>
                    <th className="px-3.5 py-3 min-w-[180px]">Grupo Ocupacional</th>
                    <th className="px-3.5 py-3 whitespace-nowrap">Poder</th>
                    <th className="px-3.5 py-3 text-center whitespace-nowrap">Qtd. Servidores</th>
                    <th className="px-3.5 py-3 text-right whitespace-nowrap">Vencimento Base</th>
                    <th className="px-3.5 py-3 text-right whitespace-nowrap">Gratificações</th>
                    <th className="px-3.5 py-3 text-right whitespace-nowrap text-primary font-semibold">Salário Médio</th>
                    <th className="px-3.5 py-3 text-center whitespace-nowrap">Carga Horária</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {dadosPaginados.map((item: any) => (
                    <tr key={item.id} className="hover:bg-accent/30 transition-colors">
                      <td className="px-3.5 py-3.5 font-mono text-muted-foreground whitespace-nowrap">{item.codigoCargo}</td>
                      <td className="px-3.5 py-3.5 font-bold text-foreground">{item.denominacao}</td>
                      <td className="px-3.5 py-3.5 text-muted-foreground">{item.grupo}</td>
                      <td className="px-3.5 py-3.5 whitespace-nowrap">
                        <span className="inline-flex rounded-full bg-muted px-2.5 py-0.5 text-[11px] font-medium text-foreground">{item.poder}</span>
                      </td>
                      <td className="px-3.5 py-3.5 text-center tabular font-medium text-foreground">{formatNumber(item.qtdServidores)}</td>
                      <td className="px-3.5 py-3.5 text-right tabular text-muted-foreground">{formatBRL(item.vencimentoBase)}</td>
                      <td className="px-3.5 py-3.5 text-right tabular text-muted-foreground">{formatBRL(item.gratificacoes)}</td>
                      <td className="px-3.5 py-3.5 text-right font-bold text-primary tabular whitespace-nowrap">{formatBRL(item.salarioMedioBruto)}</td>
                      <td className="px-3.5 py-3.5 text-center text-muted-foreground whitespace-nowrap">{item.cargaHoraria}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}

            {/* 10. TABELA EMENDAS ESTADUAIS */}
            {(abaAtiva === "emendas-estaduais" || abaAtiva === "emendas-parlamentares") && (
              <table className="w-full text-left text-xs">
                <thead className="border-b border-border bg-muted/60 font-semibold text-muted-foreground">
                  <tr>
                    <th className="px-3.5 py-3 whitespace-nowrap">Nº Emenda Estadual</th>
                    <th className="px-3.5 py-3 min-w-[180px]">Deputado(a) Estadual</th>
                    <th className="px-3.5 py-3 whitespace-nowrap">Município</th>
                    <th className="px-3.5 py-3 min-w-[250px]">Objeto / Destinação</th>
                    <th className="px-3.5 py-3 whitespace-nowrap">Área</th>
                    <th className="px-3.5 py-3 text-right whitespace-nowrap">Valor Indicado</th>
                    <th className="px-3.5 py-3 text-right whitespace-nowrap text-success font-semibold">Valor Pago</th>
                    <th className="px-3.5 py-3 text-center whitespace-nowrap">% Executado</th>
                    <th className="px-3.5 py-3 text-center whitespace-nowrap">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {dadosPaginados.map((item: any) => (
                    <tr key={item.id} className="hover:bg-accent/30 transition-colors">
                      <td className="px-3.5 py-3.5 font-mono font-bold text-foreground whitespace-nowrap">{item.numero}</td>
                      <td className="px-3.5 py-3.5 font-bold text-foreground">{item.deputado}</td>
                      <td className="px-3.5 py-3.5 font-medium text-foreground whitespace-nowrap">{item.municipio}</td>
                      <td className="px-3.5 py-3.5 text-muted-foreground line-clamp-2">{item.objeto}</td>
                      <td className="px-3.5 py-3.5 whitespace-nowrap">
                        <span className="inline-flex rounded-full bg-primary/10 text-primary px-2.5 py-0.5 text-[11px] font-medium">{item.area}</span>
                      </td>
                      <td className="px-3.5 py-3.5 text-right font-medium tabular text-foreground whitespace-nowrap">{formatBRL(item.indicado)}</td>
                      <td className="px-3.5 py-3.5 text-right font-bold text-success tabular whitespace-nowrap">{formatBRL(item.pago)}</td>
                      <td className="px-3.5 py-3.5 text-center whitespace-nowrap">
                        <span className="font-bold text-foreground">{item.executado}%</span>
                      </td>
                      <td className="px-3.5 py-3.5 text-center whitespace-nowrap">
                        <span className={cn("inline-flex rounded-full px-2.5 py-0.5 text-[11px] font-semibold ring-1", item.status.includes("Integralmente") ? "bg-success/10 text-success ring-success/30" : "bg-primary/10 text-primary ring-primary/30")}>{item.status}</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}

            {/* 11. TABELA EMENDAS FEDERAIS */}
            {abaAtiva === "emendas-federais" && (
              <table className="w-full text-left text-xs">
                <thead className="border-b border-border bg-muted/60 font-semibold text-muted-foreground">
                  <tr>
                    <th className="px-3.5 py-3 whitespace-nowrap">Nº Emenda Federal</th>
                    <th className="px-3.5 py-3 min-w-[200px]">Parlamentar / Bancada</th>
                    <th className="px-3.5 py-3 min-w-[180px]">Órgão Repassador</th>
                    <th className="px-3.5 py-3 whitespace-nowrap">Município</th>
                    <th className="px-3.5 py-3 min-w-[240px]">Objeto</th>
                    <th className="px-3.5 py-3 text-right whitespace-nowrap">Empenhado</th>
                    <th className="px-3.5 py-3 text-right whitespace-nowrap text-success font-semibold">Repassado</th>
                    <th className="px-3.5 py-3 text-right whitespace-nowrap">Saldo a Liberar</th>
                    <th className="px-3.5 py-3 text-center whitespace-nowrap">Situação</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {dadosPaginados.map((item: any) => (
                    <tr key={item.id} className="hover:bg-accent/30 transition-colors">
                      <td className="px-3.5 py-3.5 font-mono font-bold text-foreground whitespace-nowrap">{item.numero}</td>
                      <td className="px-3.5 py-3.5 font-bold text-foreground">{item.parlamentar}</td>
                      <td className="px-3.5 py-3.5 text-muted-foreground">{item.orgaoRepassador}</td>
                      <td className="px-3.5 py-3.5 font-medium text-foreground whitespace-nowrap">{item.municipio}</td>
                      <td className="px-3.5 py-3.5 text-muted-foreground line-clamp-2">{item.objeto}</td>
                      <td className="px-3.5 py-3.5 text-right tabular text-muted-foreground whitespace-nowrap">{formatBRL(item.valorEmpenhado)}</td>
                      <td className="px-3.5 py-3.5 text-right font-bold text-success tabular whitespace-nowrap">{formatBRL(item.valorRepassado)}</td>
                      <td className="px-3.5 py-3.5 text-right tabular text-muted-foreground whitespace-nowrap">{formatBRL(item.saldo)}</td>
                      <td className="px-3.5 py-3.5 text-center whitespace-nowrap">
                        <span className={cn("inline-flex rounded-full px-2.5 py-0.5 text-[11px] font-semibold ring-1", item.situacao === "Repassado" ? "bg-success/10 text-success ring-success/30" : "bg-amber-500/10 text-amber-600 ring-amber-500/30")}>{item.situacao}</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}

            {dadosPaginados.length === 0 && (
              <div className="px-4 py-8 text-center text-muted-foreground text-sm">
                Nenhum registro encontrado para os filtros selecionados.
              </div>
            )}
          </div>

          {/* ========================================================= */}
          {/* PAGINAÇÃO */}
          {/* ========================================================= */}
          {totalItens > 0 && (
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-muted-foreground pt-1">
              <p>
                Exibindo <strong>{(paginaAtual - 1) * itensPorPagina + 1}</strong> a{" "}
                <strong>{Math.min(paginaAtual * itensPorPagina, totalItens)}</strong> de{" "}
                <strong>{totalItens}</strong> registros
              </p>
              <div className="flex items-center gap-1">
                <button
                  type="button"
                  disabled={paginaAtual === 1}
                  onClick={() => setPaginaAtual((p) => Math.max(1, p - 1))}
                  className="rounded border border-border px-2.5 py-1 disabled:opacity-40 hover:bg-muted text-foreground cursor-pointer disabled:cursor-not-allowed transition-colors"
                >
                  Anterior
                </button>
                {Array.from({ length: totalPaginas }, (_, i) => i + 1).map((p) => (
                  <button
                    key={p}
                    type="button"
                    onClick={() => setPaginaAtual(p)}
                    className={cn(
                      "size-7 rounded text-xs font-semibold transition-colors cursor-pointer",
                      paginaAtual === p
                        ? "bg-primary text-primary-foreground"
                        : "border border-border hover:bg-muted text-foreground"
                    )}
                  >
                    {p}
                  </button>
                ))}
                <button
                  type="button"
                  disabled={paginaAtual === totalPaginas}
                  onClick={() => setPaginaAtual((p) => Math.min(totalPaginas, p + 1))}
                  className="rounded border border-border px-2.5 py-1 disabled:opacity-40 hover:bg-muted text-foreground cursor-pointer disabled:cursor-not-allowed transition-colors"
                >
                  Próximo
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
