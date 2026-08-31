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
  Handshake,
  Plane,
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
      descricao: "Execução orçamentária: empenho, liquidação e pagamentos por período e secretaria",
      icon: Receipt,
      iconBg: "bg-blue-50 text-blue-600 dark:bg-blue-950/60 dark:text-blue-400",
    },
    {
      id: "contratos",
      label: "Contratos",
      descricao: "Contratos administrativos, termos aditivos e prestação continuada por fornecedor e órgão",
      icon: FileText,
      iconBg: "bg-amber-50 text-amber-600 dark:bg-amber-950/60 dark:text-amber-400",
    },
    {
      id: "convenios",
      label: "Convênios e Repasses",
      descricao: "Transferências voluntárias, termos de colaboração e repasses aos municípios maranhenses",
      icon: Handshake,
      iconBg: "bg-teal-50 text-teal-600 dark:bg-teal-950/60 dark:text-teal-400",
    },
    {
      id: "licitacoes",
      label: "Licitações",
      descricao: "Editais, pregões eletrônicos, concorrências e homologações",
      icon: Gavel,
      iconBg: "bg-purple-50 text-purple-600 dark:bg-purple-950/60 dark:text-purple-400",
    },
    {
      id: "diarias",
      label: "Diárias e Viagens",
      descricao: "Concessão de diárias, viagens a serviço governamentais e justificativas por secretaria",
      icon: Plane,
      iconBg: "bg-sky-50 text-sky-600 dark:bg-sky-950/60 dark:text-sky-400",
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
      descricao: "Construções, pavimentações, reformas e infraestrutura pública nas cidades do Maranhão",
      icon: Hammer,
      iconBg: "bg-amber-50 text-amber-600 dark:bg-amber-950/60 dark:text-amber-400",
    },
  ],
  pessoal: [
    {
      id: "pessoal",
      label: "Quadro de Pessoal",
      descricao: "Servidores efetivos, comissionados e remunerações por secretaria e cargo",
      icon: Users,
      iconBg: "bg-blue-50 text-blue-600 dark:bg-blue-950/60 dark:text-blue-400",
    },
    {
      id: "remuneracao",
      label: "Tabela de Remuneração",
      descricao: "Tabela de cargos públicos, vencimento base, gratificações e salários médios",
      icon: BadgePercent,
      iconBg: "bg-indigo-50 text-indigo-600 dark:bg-indigo-950/60 dark:text-indigo-400",
    },
    {
      id: "diarias",
      label: "Diárias de Servidores",
      descricao: "Diárias pagas a servidores a serviço do Estado por mês e órgão de lotação",
      icon: Plane,
      iconBg: "bg-sky-50 text-sky-600 dark:bg-sky-950/60 dark:text-sky-400",
    },
  ],
  "emendas-parlamentares": [
    {
      id: "emendas-estaduais",
      label: "Emendas Estaduais",
      descricao: "Emendas parlamentares individuais e de bancada da Assembleia Legislativa (ALEMA)",
      icon: Landmark,
      iconBg: "bg-amber-50 text-amber-600 dark:bg-amber-950/60 dark:text-amber-400",
    },
    {
      id: "emendas-federais",
      label: "Emendas Federais",
      descricao: "Repasses e convênios da bancada federal do Maranhão aos municípios",
      icon: Building2,
      iconBg: "bg-emerald-50 text-emerald-600 dark:bg-emerald-950/60 dark:text-emerald-400",
    },
  ],
  saude: [
    {
      id: "despesas",
      label: "Despesas da Saúde",
      descricao: "Gastos com hospitais, medicamentos e programas de saúde pública no último mês e ano",
      icon: Receipt,
      iconBg: "bg-blue-50 text-blue-600 dark:bg-blue-950/60 dark:text-blue-400",
    },
    {
      id: "contratos",
      label: "Contratos de Saúde",
      descricao: "Contratos de gestão hospitalar, leitos de UTI e fornecimento farmacêutico",
      icon: FileText,
      iconBg: "bg-amber-50 text-amber-600 dark:bg-amber-950/60 dark:text-amber-400",
    },
    {
      id: "convenios",
      label: "Convênios Municipais",
      descricao: "Repasses de saúde fundo a fundo e convênios hospitalares com municípios",
      icon: Handshake,
      iconBg: "bg-teal-50 text-teal-600 dark:bg-teal-950/60 dark:text-teal-400",
    },
  ],
  educacao: [
    {
      id: "despesas",
      label: "Despesas da Educação",
      descricao: "Execução orçamentária da SEDUC, FUNDEB, merenda e transporte escolar",
      icon: Receipt,
      iconBg: "bg-blue-50 text-blue-600 dark:bg-blue-950/60 dark:text-blue-400",
    },
    {
      id: "contratos",
      label: "Contratos da Educação",
      descricao: "Contratos didáticos, transporte escolar regional e merenda",
      icon: FileText,
      iconBg: "bg-amber-50 text-amber-600 dark:bg-amber-950/60 dark:text-amber-400",
    },
    {
      id: "obras",
      label: "Obras Escolares",
      descricao: "Construções de IEMAs, reformas e climatização de escolas estaduais",
      icon: Hammer,
      iconBg: "bg-amber-50 text-amber-600 dark:bg-amber-950/60 dark:text-amber-400",
    },
  ],
}

// =====================================================================
// DATASETS MOCKADOS EXPANDIDOS
// =====================================================================

export const DADOS_RECEITA = [
  { id: "rec-1", codigo: "1.1.1.8.01.1.1", rubrica: "ICMS - Operações Próprias", categoria: "Tributária", unidade: "SEFAZ", ano: 2026, previsao: 13200000000, arrecadado: 2150000000, situacao: "Arrecadada" },
  { id: "rec-2", codigo: "1.1.1.8.02.3.1", rubrica: "IPVA - Veículos Automotores", categoria: "Tributária", unidade: "SEFAZ", ano: 2026, previsao: 1200000000, arrecadado: 480000000, situacao: "Arrecadada" },
  { id: "rec-3", codigo: "1.7.1.8.01.2.1", rubrica: "Cota-Parte do FPE (Fundo de Participação)", categoria: "Transferências", unidade: "SEFAZ", ano: 2026, previsao: 10900000000, arrecadado: 1820000000, situacao: "Arrecadada" },
  { id: "rec-4", codigo: "1.7.1.8.03.1.1", rubrica: "Transferências do SUS - Fundo a Fundo", categoria: "Transferências", unidade: "SES", ano: 2026, previsao: 3100000000, arrecadado: 510000000, situacao: "Arrecadada" },
  { id: "rec-5", codigo: "1.7.5.8.01.1.1", rubrica: "FUNDEB - Manutenção da Educação", categoria: "Transferências", unidade: "SEDUC", ano: 2026, previsao: 4400000000, arrecadado: 740000000, situacao: "Arrecadada" },
  { id: "rec-6", codigo: "1.3.2.1.00.1.1", rubrica: "Remuneração de Depósitos Bancários", categoria: "Patrimonial", unidade: "SEFAZ", ano: 2026, previsao: 190000000, arrecadado: 32000000, situacao: "Arrecadada" },
  { id: "rec-7", codigo: "1.1.1.8.01.1.1", rubrica: "ICMS - Operações Próprias", categoria: "Tributária", unidade: "SEFAZ", ano: 2025, previsao: 12500000000, arrecadado: 11840000000, situacao: "Arrecadada" },
  { id: "rec-8", codigo: "1.1.1.8.02.3.1", rubrica: "IPVA - Veículos Automotores", categoria: "Tributária", unidade: "SEFAZ", ano: 2025, previsao: 1100000000, arrecadado: 1045000000, situacao: "Arrecadada" },
  { id: "rec-9", codigo: "1.7.1.8.01.2.1", rubrica: "Cota-Parte do FPE (Fundo de Participação)", categoria: "Transferências", unidade: "SEFAZ", ano: 2025, previsao: 10200000000, arrecadado: 9980000000, situacao: "Arrecadada" },
  { id: "rec-10", codigo: "1.7.1.8.03.1.1", rubrica: "Transferências do SUS - Fundo a Fundo", categoria: "Transferências", unidade: "SES", ano: 2025, previsao: 2800000000, arrecadado: 2650000000, situacao: "Arrecadada" },
  { id: "rec-11", codigo: "1.7.5.8.01.1.1", rubrica: "FUNDEB - Manutenção da Educação", categoria: "Transferências", unidade: "SEDUC", ano: 2025, previsao: 4100000000, arrecadado: 3890000000, situacao: "Arrecadada" },
  { id: "rec-12", codigo: "1.3.2.1.00.1.1", rubrica: "Remuneração de Depósitos Bancários", categoria: "Patrimonial", unidade: "SEFAZ", ano: 2025, previsao: 180000000, arrecadado: 195000000, situacao: "Arrecadada" },
]

export const DADOS_DESPESAS = [
  // ─── 2026 - Mês Atual / Recente (Fevereiro 2026) ───────────────────
  { id: "desp-2026-1", documento: "2026NE000412", data: "14/02/2026", mes: "Fevereiro", unidade: "Secretaria de Saúde - SES", credor: "EMSERH - GESTÃO HOSPITALAR MACRORREGIONAL", funcao: "Saúde", empenhado: 45200000, liquidado: 45200000, pago: 45200000, situacao: "Pago", ano: 2026 },
  { id: "desp-2026-2", documento: "2026NE000489", data: "18/02/2026", mes: "Fevereiro", unidade: "Secretaria de Saúde - SES", credor: "DISTRIBUIDORA FARMA BRASIL LTDA", funcao: "Saúde", empenhado: 12400000, liquidado: 12400000, pago: 12400000, situacao: "Pago", ano: 2026 },
  { id: "desp-2026-3", documento: "2026NE000512", data: "24/02/2026", mes: "Fevereiro", unidade: "Secretaria de Saúde - SES", credor: "OXIGÊNIO DO MARANHÃO GASES INDUSTRIAIS", funcao: "Saúde", empenhado: 3100000, liquidado: 3100000, pago: 3100000, situacao: "Pago", ano: 2026 },
  { id: "desp-2026-4", documento: "2026NE000210", data: "15/02/2026", mes: "Fevereiro", unidade: "Secretaria de Educação - SEDUC", credor: "EDITORA EDUCACIONAL MARANHÃO", funcao: "Educação", empenhado: 28400000, liquidado: 28400000, pago: 28400000, situacao: "Pago", ano: 2026 },
  { id: "desp-2026-5", documento: "2026NE000295", data: "20/02/2026", mes: "Fevereiro", unidade: "Secretaria de Educação - SEDUC", credor: "ALIMENTAÇÃO ESCOLAR INTEGRAL LTDA", funcao: "Educação", empenhado: 19800000, liquidado: 19800000, pago: 19800000, situacao: "Pago", ano: 2026 },
  { id: "desp-2026-6", documento: "2026NE000305", data: "12/02/2026", mes: "Fevereiro", unidade: "Secretaria de Infraestrutura - SINFRA", credor: "CONSTRUTORA VALE DO ITAPECURU", funcao: "Transporte", empenhado: 34500000, liquidado: 28900000, pago: 28900000, situacao: "Liquidado", ano: 2026 },
  { id: "desp-2026-7", documento: "2026NE000150", data: "16/02/2026", mes: "Fevereiro", unidade: "Secretaria de Segurança - SSP", credor: "VIATURAS BRASIL COMÉRCIO LTDA", funcao: "Segurança Pública", empenhado: 14200000, liquidado: 14200000, pago: 14200000, situacao: "Pago", ano: 2026 },
  { id: "desp-2026-8", documento: "2026NE000115", data: "08/02/2026", mes: "Fevereiro", unidade: "Secretaria de Administração - SEAD", credor: "TECNOLOGIA E DADOS CORPORATIVOS", funcao: "Administração", empenhado: 5800000, liquidado: 5800000, pago: 0, situacao: "Empenhado", ano: 2026 },
  { id: "desp-2026-9", documento: "2026NE000098", data: "05/02/2026", mes: "Fevereiro", unidade: "Secretaria da Fazenda - SEFAZ", credor: "SERVIÇOS DE PROCESSAMENTO DE DADOS S/A", funcao: "Administração Financeira", empenhado: 3900000, liquidado: 3900000, pago: 3900000, situacao: "Pago", ano: 2026 },

  // ─── 2026 - Janeiro ──────────────────────────────────────────────
  { id: "desp-2026-10", documento: "2026NE000101", data: "10/01/2026", mes: "Janeiro", unidade: "Secretaria de Saúde - SES", credor: "CIRÚRGICA NORTE DISTRIBUIDORA", funcao: "Saúde", empenhado: 18500000, liquidado: 18500000, pago: 18500000, situacao: "Pago", ano: 2026 },
  { id: "desp-2026-11", documento: "2026NE000188", data: "22/01/2026", mes: "Janeiro", unidade: "Secretaria de Saúde - SES", credor: "SERVIÇOS DE UTI MÓVEL E REMOÇÃO LTDA", funcao: "Saúde", empenhado: 6400000, liquidado: 6400000, pago: 6400000, situacao: "Pago", ano: 2026 },
  { id: "desp-2026-12", documento: "2026NE000055", data: "15/01/2026", mes: "Janeiro", unidade: "Secretaria de Educação - SEDUC", credor: "TRANSPORTE ESCOLAR REGIONAL LTDA", funcao: "Educação", empenhado: 12100000, liquidado: 12100000, pago: 12100000, situacao: "Pago", ano: 2026 },
  { id: "desp-2026-13", documento: "2026NE000084", data: "18/01/2026", mes: "Janeiro", unidade: "Secretaria de Infraestrutura - SINFRA", credor: "CONSÓRCIO MARANHÃO PAVIMENTAÇÃO", funcao: "Transporte", empenhado: 22000000, liquidado: 22000000, pago: 22000000, situacao: "Pago", ano: 2026 },
  { id: "desp-2026-14", documento: "2026NE000062", data: "20/01/2026", mes: "Janeiro", unidade: "Secretaria das Cidades - SECID", credor: "URBANIZAÇÃO E SANEAMENTO MA", funcao: "Urbanismo", empenhado: 8900000, liquidado: 8900000, pago: 8900000, situacao: "Pago", ano: 2026 },

  // ─── 2025 - Exercício Anterior ────────────────────────────────────
  { id: "desp-2025-1", documento: "2025NE004912", data: "12/01/2025", mes: "Janeiro", unidade: "Secretaria de Saúde - SES", credor: "CIRÚRGICA NORTE DISTRIBUIDORA", funcao: "Saúde", empenhado: 1450000, liquidado: 1450000, pago: 1450000, situacao: "Pago", ano: 2025 },
  { id: "desp-2025-2", documento: "2025NE018920", data: "20/02/2025", mes: "Fevereiro", unidade: "Secretaria de Saúde - SES", credor: "LABORATÓRIO CENTRAL DO MARANHÃO - LACEN", funcao: "Saúde", empenhado: 8900000, liquidado: 8900000, pago: 8900000, situacao: "Pago", ano: 2025 },
  { id: "desp-2025-3", documento: "2025NE034102", data: "15/03/2025", mes: "Março", unidade: "Secretaria de Saúde - SES", credor: "DISTRIBUIDORA FARMA BRASIL LTDA", funcao: "Saúde", empenhado: 15400000, liquidado: 15400000, pago: 15400000, situacao: "Pago", ano: 2025 },
  { id: "desp-2025-4", documento: "2025NE008123", data: "15/01/2025", mes: "Janeiro", unidade: "Secretaria de Educação - SEDUC", credor: "EDITORA EDUCACIONAL MARANHÃO", funcao: "Educação", empenhado: 4890000, liquidado: 4890000, pago: 4890000, situacao: "Pago", ano: 2025 },
  { id: "desp-2025-5", documento: "2025NE021405", data: "10/02/2025", mes: "Fevereiro", unidade: "Secretaria de Educação - SEDUC", credor: "KITS DIDÁTICOS E LIVROS MA", funcao: "Educação", empenhado: 7800000, liquidado: 7800000, pago: 7800000, situacao: "Pago", ano: 2025 },
  { id: "desp-2025-6", documento: "2025NE010419", data: "20/01/2025", mes: "Janeiro", unidade: "Secretaria de Infraestrutura - SINFRA", credor: "CONSTRUTORA VALE DO ITAPECURU", funcao: "Transporte", empenhado: 18400000, liquidado: 14200000, pago: 14200000, situacao: "Liquidado", ano: 2025 },
  { id: "desp-2025-7", documento: "2025NE012891", data: "22/01/2025", mes: "Janeiro", unidade: "Secretaria de Segurança - SSP", credor: "VIATURAS BRASIL COMÉRCIO LTDA", funcao: "Segurança Pública", empenhado: 6200000, liquidado: 6200000, pago: 6200000, situacao: "Pago", ano: 2025 },
  { id: "desp-2025-8", documento: "2025NE015402", data: "25/01/2025", mes: "Janeiro", unidade: "Secretaria de Administração - SEAD", credor: "TECNOLOGIA E DADOS CORPORATIVOS", funcao: "Administração", empenhado: 2450000, liquidado: 2450000, pago: 0, situacao: "Empenhado", ano: 2025 },
]

export const DADOS_CONTRATOS = [
  { id: "ct-1", numeroContrato: "045/2025-SINFRA", processo: "PA-2024/09182", empresa: "CONSTRUTORA VALE DO ITAPECURU LTDA", cnpj: "08.921.432/0001-56", objeto: "Restauração e pavimentação asfáltica da rodovia MA-020", unidade: "SINFRA", vigencia: "15/01/2025 a 15/01/2026", valorTotal: 24800000, valorExecutado: 18500000, status: "Vigente", ano: 2025 },
  { id: "ct-2", numeroContrato: "012/2025-SEAD", processo: "PA-2024/11402", empresa: "MICROSOFT DO BRASIL DISTRIBUIÇÃO", cnpj: "60.316.817/0001-03", objeto: "Licenciamento em nuvem corporativa e comunicação do Estado", unidade: "SEAD", vigencia: "10/01/2025 a 10/01/2027", valorTotal: 6400000, valorExecutado: 6400000, status: "Vigente", ano: 2025 },
  { id: "ct-3", numeroContrato: "088/2025-SES", processo: "PA-2024/22190", empresa: "EMPRESA MARANHENSE DE GESTÃO HOSPITALAR", cnpj: "18.234.901/0001-88", objeto: "Gestão operacional de leitos de UTI hospitalares e UPAs", unidade: "SES", vigencia: "01/02/2025 a 01/02/2026", valorTotal: 42000000, valorExecutado: 38000000, status: "Vigente", ano: 2025 },
  { id: "ct-4", numeroContrato: "034/2025-SEDUC", processo: "PA-2024/15678", empresa: "TRANSPORTE ESCOLAR REGIONAL LTDA", cnpj: "03.112.540/0001-22", objeto: "Transporte escolar de estudantes da rede pública rural", unidade: "SEDUC", vigencia: "20/01/2025 a 20/12/2025", valorTotal: 9800000, valorExecutado: 7200000, status: "Vigente", ano: 2025 },
  { id: "ct-5", numeroContrato: "019/2024-SSP", processo: "PA-2023/18920", empresa: "SEGURANÇA E MONITORAMENTO VIRTUAL", cnpj: "11.890.342/0001-77", objeto: "Manutenção do cerco eletrônico inteligente com OCR", unidade: "SSP", vigencia: "10/06/2024 a 10/06/2025", valorTotal: 5200000, valorExecutado: 5200000, status: "Concluído", ano: 2024 },
  { id: "ct-6", numeroContrato: "104/2025-SES", processo: "PA-2024/31890", empresa: "DISTRIBUIDORA FARMA BRASIL LTDA", cnpj: "05.412.876/0001-90", objeto: "Fornecimento continuado de medicamentos oncológicos e hemoderivados", unidade: "SES", vigencia: "01/03/2025 a 01/03/2026", valorTotal: 31500000, valorExecutado: 24800000, status: "Vigente", ano: 2025 },
  { id: "ct-7", numeroContrato: "015/2025-SES", processo: "PA-2024/08210", empresa: "LITUCERA LIMPEZA E ENGENHARIA LTDA", cnpj: "02.781.904/0001-44", objeto: "Higienização hospitalar, esterilização e descarte de resíduos infectantes", unidade: "SES", vigencia: "15/01/2025 a 15/01/2026", valorTotal: 14200000, valorExecutado: 11500000, status: "Vigente", ano: 2025 },
  { id: "ct-8", numeroContrato: "077/2025-SINFRA", processo: "PA-2024/29841", empresa: "CONSÓRCIO MARANHÃO INFRAESTRUTURA", cnpj: "34.120.985/0001-33", objeto: "Duplicação e pontes na rodovia estadual MA-203", unidade: "SINFRA", vigencia: "01/02/2025 a 30/12/2026", valorTotal: 54000000, valorExecutado: 22000000, status: "Vigente", ano: 2025 },
  { id: "ct-9", numeroContrato: "052/2025-SEDUC", processo: "PA-2024/18900", empresa: "ALIMENTAÇÃO ESCOLAR INTEGRAL LTDA", cnpj: "14.908.213/0001-12", objeto: "Fornecimento de gêneros alimentícios e merenda para escolas de tempo integral", unidade: "SEDUC", vigencia: "01/02/2025 a 31/12/2025", valorTotal: 28400000, valorExecutado: 19800000, status: "Vigente", ano: 2025 },
  { id: "ct-10", numeroContrato: "008/2026-SES", processo: "PA-2025/44120", empresa: "EMPRESA MARANHENSE DE GESTÃO HOSPITALAR", cnpj: "18.234.901/0001-88", objeto: "Contrato de Gestão Especial para Policlínicas e Hospitais de Referência", unidade: "SES", vigencia: "01/01/2026 a 31/12/2026", valorTotal: 84000000, valorExecutado: 14000000, status: "Vigente", ano: 2026 },
  { id: "ct-11", numeroContrato: "014/2026-SSP", processo: "PA-2025/38110", empresa: "VIATURAS BRASIL COMÉRCIO LTDA", cnpj: "12.345.678/0001-99", objeto: "Locação e manutenção de viaturas caracterizadas para Polícia Militar e Civil", unidade: "SSP", vigencia: "15/01/2026 a 15/01/2028", valorTotal: 29800000, valorExecutado: 4800000, status: "Vigente", ano: 2026 },
  { id: "ct-12", numeroContrato: "022/2026-SEAD", processo: "PA-2025/51200", empresa: "REDE FIBRA CONECTIVIDADE MARANHÃO", cnpj: "09.432.109/0001-65", objeto: "Interligação em fibra ótica e internet de alta velocidade para órgãos estaduais", unidade: "SEAD", vigencia: "01/02/2026 a 01/02/2029", valorTotal: 18500000, valorExecutado: 2100000, status: "Vigente", ano: 2026 },
]

export const DADOS_CONVENIOS = [
  { id: "cnv-1", numeroConvenio: "014/2025-SES", processo: "PA-CNV-2024/082", municipio: "Caxias", orgaoConcedente: "SES", objeto: "Reforma e modernização da Unidade Mista de Saúde e aquisição de tomógrafo", valorTotal: 4500000, valorLiberado: 4500000, contrapartida: 225000, vigencia: "10/01/2025 a 10/01/2026", status: "Concluído", ano: 2025 },
  { id: "cnv-2", numeroConvenio: "038/2025-SINFRA", processo: "PA-CNV-2024/119", municipio: "Imperatriz", orgaoConcedente: "SINFRA", objeto: "Drenagem profunda e pavimentação asfáltica no bairro Bacuri e Vila Lobão", valorTotal: 12800000, valorLiberado: 9600000, contrapartida: 640000, vigencia: "15/02/2025 a 15/02/2026", status: "Em Execução", ano: 2025 },
  { id: "cnv-3", numeroConvenio: "055/2025-SAF", processo: "PA-CNV-2024/205", municipio: "Balsas", orgaoConcedente: "SAF", objeto: "Construção de Centro de Comercialização da Agricultura Familiar e Feira do Produtor", valorTotal: 2200000, valorLiberado: 2200000, contrapartida: 110000, vigencia: "01/03/2025 a 01/03/2026", status: "Concluído", ano: 2025 },
  { id: "cnv-4", numeroConvenio: "072/2025-SEDUC", processo: "PA-CNV-2024/314", municipio: "Timon", orgaoConcedente: "SEDUC", objeto: "Implantação de Centro Poliesportivo Comunitário anexo à rede pública municipal", valorTotal: 3400000, valorLiberado: 2550000, contrapartida: 170000, vigencia: "10/04/2025 a 10/04/2026", status: "Em Execução", ano: 2025 },
  { id: "cnv-5", numeroConvenio: "089/2025-SINFRA", processo: "PA-CNV-2024/401", municipio: "Pinheiro", orgaoConcedente: "SINFRA", objeto: "Construção de ponte mista de concreto e aço ligando povoados rurais ao centro", valorTotal: 5600000, valorLiberado: 5600000, contrapartida: 280000, vigencia: "01/05/2025 a 01/05/2026", status: "Concluído", ano: 2025 },
  { id: "cnv-6", numeroConvenio: "102/2025-SECID", processo: "PA-CNV-2024/512", municipio: "Codó", orgaoConcedente: "SECID", objeto: "Urbanização de praça com quiosques, iluminação em LED e parque infantil", valorTotal: 1850000, valorLiberado: 1850000, contrapartida: 92500, vigencia: "20/05/2025 a 20/05/2026", status: "Concluído", ano: 2025 },
  { id: "cnv-7", numeroConvenio: "115/2025-SES", processo: "PA-CNV-2024/608", municipio: "Açailândia", orgaoConcedente: "SES", objeto: "Custeio de plantões pediátricos e aquisição de 2 ambulâncias tipo D", valorTotal: 2900000, valorLiberado: 2900000, contrapartida: 145000, vigencia: "15/06/2025 a 15/06/2026", status: "Concluído", ano: 2025 },
  { id: "cnv-8", numeroConvenio: "128/2025-SINFRA", processo: "PA-CNV-2024/719", municipio: "Bacabal", orgaoConcedente: "SINFRA", objeto: "Recuperação de 38 km de estradas vicinais para escoamento de produção", valorTotal: 4200000, valorLiberado: 3150000, contrapartida: 210000, vigencia: "01/07/2025 a 01/07/2026", status: "Em Execução", ano: 2025 },
  { id: "cnv-9", numeroConvenio: "140/2025-SECID", processo: "PA-CNV-2024/820", municipio: "Santa Inês", orgaoConcedente: "SECID", objeto: "Reforma geral e ampliação do Mercado Público Municipal do Peixe", valorTotal: 3100000, valorLiberado: 3100000, contrapartida: 155000, vigencia: "10/08/2025 a 10/08/2026", status: "Concluído", ano: 2025 },
  { id: "cnv-10", numeroConvenio: "005/2026-SES", processo: "PA-CNV-2025/042", municipio: "Caxias", orgaoConcedente: "SES", objeto: "Repasse de incentivo financeiro para leitos de retaguarda ortopédica", valorTotal: 3800000, valorLiberado: 1200000, contrapartida: 190000, vigencia: "15/01/2026 a 15/01/2027", status: "Em Execução", ano: 2026 },
  { id: "cnv-11", numeroConvenio: "012/2026-SINFRA", processo: "PA-CNV-2025/110", municipio: "São Luís", orgaoConcedente: "SINFRA", objeto: "Apoio à contenção de encostas e drenagem na zona metropolitana", valorTotal: 18500000, valorLiberado: 6000000, contrapartida: 925000, vigencia: "01/02/2026 a 01/02/2027", status: "Em Execução", ano: 2026 },
  { id: "cnv-12", numeroConvenio: "019/2026-SECTUR", processo: "PA-CNV-2025/208", municipio: "Barreirinhas", orgaoConcedente: "SECTUR", objeto: "Estruturação de centro de atendimento ao turista e sinalização ecológica", valorTotal: 1600000, valorLiberado: 800000, contrapartida: 80000, vigencia: "10/02/2026 a 10/02/2027", status: "Em Execução", ano: 2026 },
]

export const DADOS_DIARIAS = [
  { id: "dir-1", pcd: "PCD-2026/00142", servidor: "ENG. MARCELO NOGUEIRA FONTES", cargo: "Engenheiro Civil", orgao: "SINFRA", mes: "Fevereiro", dataPartida: "04/02/2026", dataRetorno: "07/02/2026", destino: "Imperatriz / Balsas", motivo: "Vistoria técnica de obras rodoviárias e medição de pavimentação", qtdDiarias: 3.5, valorTotal: 2100, situacao: "Paga", ano: 2026 },
  { id: "dir-2", pcd: "PCD-2026/00188", servidor: "DRA. MARIANA VIEIRA GUIMARÃES", cargo: "Médica Cardiologista", orgao: "SES", mes: "Fevereiro", dataPartida: "10/02/2026", dataRetorno: "13/02/2026", destino: "Caxias / Timon", motivo: "Supervisão da implantação da linha de cuidado cardiovascular macrorregional", qtdDiarias: 3.5, valorTotal: 2450, situacao: "Paga", ano: 2026 },
  { id: "dir-3", pcd: "PCD-2026/00210", servidor: "ANA BEATRIZ ALMEIDA ROCHA", cargo: "Auditor Fiscal da Receita Estadual", orgao: "SEFAZ", mes: "Fevereiro", dataPartida: "12/02/2026", dataRetorno: "16/02/2026", destino: "Estreito / Carolina", motivo: "Fiscalização em postos fiscais de divisa e auditoria de cargas interestaduais", qtdDiarias: 4.5, valorTotal: 3150, situacao: "Paga", ano: 2026 },
  { id: "dir-4", pcd: "PCD-2026/00255", servidor: "CLÁUDIA MARIA ALBUQUERQUE", cargo: "Coordenador Pedagógico", orgao: "SEDUC", mes: "Fevereiro", dataPartida: "18/02/2026", dataRetorno: "21/02/2026", destino: "Pinheiro / Santa Inês", motivo: "Capacitação de gestores escolares e acompanhamento do início do ano letivo", qtdDiarias: 3.5, valorTotal: 1890, situacao: "Paga", ano: 2026 },
  { id: "dir-5", pcd: "PCD-2026/00301", servidor: "MARCOS VINICIUS PEREIRA COSTA", cargo: "Investigador de Polícia Civil", orgao: "SSP", mes: "Fevereiro", dataPartida: "22/02/2026", dataRetorno: "26/02/2026", destino: "Bacabal / Codó", motivo: "Diligências operacionais e escolta de custodiados de alta periculosidade", qtdDiarias: 4.5, valorTotal: 2700, situacao: "Paga", ano: 2026 },
  { id: "dir-6", pcd: "PCD-2026/00045", servidor: "DR. JOSÉ CARLOS MENDES RIBEIRO", cargo: "Médico Clínico Geral", orgao: "SES", mes: "Janeiro", dataPartida: "14/01/2026", dataRetorno: "17/01/2026", destino: "Presidente Dutra", motivo: "Reforço de equipe em mutirão emergencial de cirurgias eletivas", qtdDiarias: 3.5, valorTotal: 2450, situacao: "Paga", ano: 2026 },
  { id: "dir-7", pcd: "PCD-2026/00078", servidor: "JOÃO BATISTA FERREIRA", cargo: "Professor do Magistério", orgao: "SEDUC", mes: "Janeiro", dataPartida: "20/01/2026", dataRetorno: "23/01/2026", destino: "Balsas", motivo: "Organização dos laboratórios didáticos do IEMA Pleno Regional", qtdDiarias: 3.5, valorTotal: 1890, situacao: "Paga", ano: 2026 },
  { id: "dir-8", pcd: "PCD-2025/01420", servidor: "CORONEL PAULO ROBERTO SILVA", cargo: "Oficial da Polícia Militar", orgao: "SSP", mes: "Janeiro", dataPartida: "15/01/2025", dataRetorno: "18/01/2025", destino: "Imperatriz", motivo: "Coordenação da Operação Férias Seguras e alinhamento com comandos regionais", qtdDiarias: 3.5, valorTotal: 2800, situacao: "Paga", ano: 2025 },
  { id: "dir-9", pcd: "PCD-2025/01980", servidor: "RICARDO BARBOSA SANTOS", cargo: "Analista de Gestão Pública", orgao: "SEAD", mes: "Fevereiro", dataPartida: "10/02/2025", dataRetorno: "13/02/2025", destino: "Caxias", motivo: "Treinamento presencial de servidores no Sistema Integrado de Gestão", qtdDiarias: 3.5, valorTotal: 1750, situacao: "Paga", ano: 2025 },
  { id: "dir-10", pcd: "PCD-2025/02410", servidor: "DRA. PATRICIA ALVES MONTEIRO", cargo: "Delegado de Polícia Civil", orgao: "SSP", mes: "Fevereiro", dataPartida: "18/02/2025", dataRetorno: "22/02/2025", destino: "Açailândia", motivo: "Cumprimento de mandados de busca e apreensão interestaduais", qtdDiarias: 4.5, valorTotal: 3600, situacao: "Paga", ano: 2025 },
]

export const DADOS_LICITACOES = [
  { id: "lic-1", edital: "PE nº 088/2025-SEDUC", dataAbertura: "08/01/2025", modalidade: "Pregão Eletrônico", orgao: "SEDUC", objeto: "Kits escolares didáticos para o ensino médio", valorEstimado: 8900000, valorHomologado: 7800000, vencedor: "EDITORA E GRÁFICA MARANHÃO LTDA", situacao: "Homologada", ano: 2025 },
  { id: "lic-2", edital: "PE nº 104/2025-SES", dataAbertura: "14/01/2025", modalidade: "Pregão Eletrônico", orgao: "SES", objeto: "Registro de preços para medicamentos injetáveis", valorEstimado: 17200000, valorHomologado: 15400000, vencedor: "DISTRIBUIDORA FARMA BRASIL LTDA", situacao: "Homologada", ano: 2025 },
  { id: "lic-3", edital: "CP nº 003/2025-SINFRA", dataAbertura: "19/01/2025", modalidade: "Concorrência", orgao: "SINFRA", objeto: "Construção de ponte de concreto armado sobre o Rio Balsas", valorEstimado: 32000000, valorHomologado: 29500000, vencedor: "CONSÓRCIO MARANHÃO INFRAESTRUTURA", situacao: "Homologada", ano: 2025 },
  { id: "lic-4", edital: "DL nº 021/2025-CBMMA", dataAbertura: "26/01/2025", modalidade: "Dispensa", orgao: "Corpo de Bombeiros", objeto: "Aquisição emergencial de motobombas e mangueiras", valorEstimado: 890000, valorHomologado: 890000, vencedor: "HIDRANTES E EQUIPAMENTOS LTDA", situacao: "Homologada", ano: 2025 },
  { id: "lic-5", edital: "PE nº 012/2025-SSP", dataAbertura: "15/02/2025", modalidade: "Pregão Eletrônico", orgao: "SSP", objeto: "Fornecimento de coletes de proteção balística III-A", valorEstimado: 4100000, valorHomologado: 0, vencedor: "Em julgamento de propostas", situacao: "Em Andamento", ano: 2025 },
  { id: "lic-6", edital: "PE nº 004/2026-SES", dataAbertura: "15/01/2026", modalidade: "Pregão Eletrônico", orgao: "SES", objeto: "Aquisição de reagentes laboratoriais para exames de triagem neonatal", valorEstimado: 6200000, valorHomologado: 5400000, vencedor: "LABOR DIAGNÓSTICA NORDESTE", situacao: "Homologada", ano: 2026 },
  { id: "lic-7", edital: "CP nº 001/2026-SINFRA", dataAbertura: "02/02/2026", modalidade: "Concorrência", orgao: "SINFRA", objeto: "Pavimentação e restauração da rodovia MA-034 entre Caxias e Coelho Neto", valorEstimado: 42000000, valorHomologado: 0, vencedor: "Aguardando abertura de propostas", situacao: "Em Andamento", ano: 2026 },
]

export const DADOS_ADIANTAMENTOS = [
  { id: "adt-1", processo: "SF-2025/0012", data: "05/01/2025", responsavel: "CORONEL PAULO ROBERTO SILVA", orgao: "Casa Militar / Gabinete", finalidade: "Despesas de pronto atendimento e segurança governamental", concedido: 45000, prestado: 45000, saldo: 0, situacao: "Aprovada", ano: 2025 },
  { id: "adt-2", processo: "SF-2025/0048", data: "12/01/2025", responsavel: "DELEGADO MARCOS VINICIUS DIAS", orgao: "Polícia Civil - Inteligência", finalidade: "Operação policial sigilosa e diligências emergenciais", concedido: 38000, prestado: 38000, saldo: 0, situacao: "Aprovada", ano: 2025 },
  { id: "adt-3", processo: "SF-2025/0091", data: "18/01/2025", responsavel: "DRA. PATRICIA ALVES MONTEIRO", orgao: "Secretaria de Saúde - SES", finalidade: "Suprimento para ação de socorro em enchente regional", concedido: 60000, prestado: 52000, saldo: 8000, situacao: "Em Análise", ano: 2025 },
  { id: "adt-4", processo: "SF-2025/0122", data: "24/01/2025", responsavel: "ENG. LUCAS FONTES COSTA", orgao: "SINFRA", finalidade: "Reparos urgentes de sinalização em rodovia estadual", concedido: 25000, prestado: 25000, saldo: 0, situacao: "Aprovada", ano: 2025 },
  { id: "adt-5", processo: "SF-2025/0155", data: "02/02/2025", responsavel: "ROBERTO CAMPOS NOGUEIRA", orgao: "SEAD", finalidade: "Manutenção predial emergencial e pequenos reparos", concedido: 15000, prestado: 0, saldo: 15000, situacao: "Pendente", ano: 2025 },
]

export const DADOS_ORDEM_CRONOLOGICA = [
  { id: "ord-1", posicao: 1, liquidacao: "2025NL001042", protocolo: "02/01/2025", credor: "DROGARIA E DISTRIBUIDORA SAÚDE MA", unidade: "Secretaria de Saúde - SES", fonte: "Recursos do SUS", valor: 380000, previsao: "Hoje", status: "Liberado para Pagamento", ano: 2025 },
  { id: "ord-2", posicao: 2, liquidacao: "2025NL001088", protocolo: "03/01/2025", credor: "CONSTRUTORA ASFALTO DO NORTE", unidade: "Secretaria de Infraestrutura - SINFRA", fonte: "Tesouro Estadual (Ordinário)", valor: 1450000, previsao: "Próximas 24h", status: "Liberado para Pagamento", ano: 2025 },
  { id: "ord-3", posicao: 3, liquidacao: "2025NL001150", protocolo: "05/01/2025", credor: "ALIMENTAÇÃO ESCOLAR INTEGRAL LTDA", unidade: "Secretaria de Educação - SEDUC", fonte: "FUNDEB", valor: 890000, previsao: "Em até 48h", status: "Aguardando Repasse", ano: 2025 },
  { id: "ord-4", posicao: 4, liquidacao: "2025NL001210", protocolo: "07/01/2025", credor: "TECNOLOGIA E CONECTIVIDADE MA", unidade: "Secretaria de Administração - SEAD", fonte: "Tesouro Estadual", valor: 210000, previsao: "Até 5 dias úteis", status: "Em Fila Regular", ano: 2025 },
  { id: "ord-5", posicao: 5, liquidacao: "2025NL001290", protocolo: "09/01/2025", credor: "POSTO COMBUSTÍVEL VIATURAS", unidade: "Polícia Militar - PMMA", fonte: "Tesouro Estadual", valor: 450000, previsao: "Até 7 dias úteis", status: "Em Fila Regular", ano: 2025 },
]

export const DADOS_OBRAS = [
  { id: "obr-1", contrato: "012/2024-SINFRA", descricao: "Duplicação e pavimentação asfáltica da rodovia MA-203", municipio: "São Luís", orgao: "SINFRA", construtora: "CONSTRUTORA VALE DO ITAPECURU", valorTotal: 48500000, concluido: 78, previsaoEntrega: "12/2025", status: "Em Andamento", ano: 2025 },
  { id: "obr-2", contrato: "034/2024-SES", descricao: "Construção do Hospital Macrorregional de Imperatriz", municipio: "Imperatriz", orgao: "SES", construtora: "ENGEL ENGENHARIA HOSPITALAR", valorTotal: 62000000, concluido: 92, previsaoEntrega: "06/2025", status: "Fase Final", ano: 2025 },
  { id: "obr-3", contrato: "088/2024-SEDUC", descricao: "Construção de IEMA Pleno vocacional com 12 salas e laboratórios", municipio: "Balsas", orgao: "SEDUC", construtora: "EDIFICAÇÕES MARANHÃO LTDA", valorTotal: 18900000, concluido: 65, previsaoEntrega: "10/2025", status: "Em Andamento", ano: 2025 },
  { id: "obr-4", contrato: "102/2024-SINFRA", descricao: "Ponte sobre o Rio Itapecuru ligando povoados rurais", municipio: "Caxias", orgao: "SINFRA", construtora: "PONTES E ESTRUTURAS DO BRASIL", valorTotal: 14200000, concluido: 100, previsaoEntrega: "01/2025", status: "Concluída", ano: 2025 },
  { id: "obr-5", contrato: "115/2024-SEDUC", descricao: "Reforma geral e climatização de Centro de Ensino Médio", municipio: "Timon", orgao: "SEDUC", construtora: "NORTE REFORMAS PÚBLICAS", valorTotal: 4500000, concluido: 45, previsaoEntrega: "08/2025", status: "Em Andamento", ano: 2025 },
  { id: "obr-6", contrato: "122/2024-SES", descricao: "Construção da Policlínica Regional de Saúde com centro de imagens", municipio: "Codó", orgao: "SES", construtora: "CONSTRUTORA MARANHÃO SAÚDE", valorTotal: 16500000, concluido: 85, previsaoEntrega: "07/2025", status: "Em Andamento", ano: 2025 },
  { id: "obr-7", contrato: "140/2024-SINFRA", descricao: "Canalização e macrodrenagem de bacia pluvial contra inundações", municipio: "Açailândia", orgao: "SINFRA", construtora: "INFRAESTRUTURA TOCANTINA", valorTotal: 22400000, concluido: 60, previsaoEntrega: "11/2025", status: "Em Andamento", ano: 2025 },
  { id: "obr-8", contrato: "155/2024-SINFRA", descricao: "Restauração e pavimentação asfáltica da rodovia MA-020", municipio: "Bacabal", orgao: "SINFRA", construtora: "CONSTRUTORA VALE DO ITAPECURU", valorTotal: 24800000, concluido: 70, previsaoEntrega: "09/2025", status: "Em Andamento", ano: 2025 },
  { id: "obr-9", contrato: "168/2024-SEDUC", descricao: "Construção de IEMA Pleno com ensino técnico profissionalizante", municipio: "Pinheiro", orgao: "SEDUC", construtora: "BAIXADA ENGENHARIA LTDA", valorTotal: 17800000, concluido: 88, previsaoEntrega: "05/2025", status: "Fase Final", ano: 2025 },
  { id: "obr-10", contrato: "175/2024-SES", descricao: "Reforma e modernização da Maternidade e Centro Cirúrgico Regional", municipio: "Santa Inês", orgao: "SES", construtora: "VALE DO PINDARÉ CONSTRUÇÕES", valorTotal: 9800000, concluido: 100, previsaoEntrega: "02/2025", status: "Concluída", ano: 2025 },
  { id: "obr-11", contrato: "189/2024-SINFRA", descricao: "Pavimentação asfáltica e iluminação da via de acesso aos Lençóis", municipio: "Barreirinhas", orgao: "SINFRA", construtora: "ROTAS DO SOL CONSTRUTORA", valorTotal: 15600000, concluido: 80, previsaoEntrega: "08/2025", status: "Em Andamento", ano: 2025 },
  { id: "obr-12", contrato: "198/2024-SINFRA", descricao: "Asfalto novo e sinalização viária em 25 km de bairros urbanos", municipio: "Chapadinha", orgao: "SINFRA", construtora: "PAVIMENTADORA LESTE MA", valorTotal: 8400000, concluido: 100, previsaoEntrega: "01/2025", status: "Concluída", ano: 2025 },
  { id: "obr-13", contrato: "002/2026-SES", descricao: "Expansão da Ala de Oncologia e Hemodinâmica do Hospital da Ilha", municipio: "São Luís", orgao: "SES", construtora: "ENGEL ENGENHARIA HOSPITALAR", valorTotal: 34000000, concluido: 25, previsaoEntrega: "12/2026", status: "Em Andamento", ano: 2026 },
  { id: "obr-14", contrato: "008/2026-SINFRA", descricao: "Implantação do Anel Viário da Produção Agrícola no Sul do Estado", municipio: "Balsas", orgao: "SINFRA", construtora: "CONSÓRCIO MARANHÃO INFRAESTRUTURA", valorTotal: 41200000, concluido: 18, previsaoEntrega: "11/2026", status: "Em Andamento", ano: 2026 },
  { id: "obr-15", contrato: "015/2026-SINFRA", descricao: "Requalificação da Av. Bernardo Sayão com drenagem e ciclovia", municipio: "Imperatriz", orgao: "SINFRA", construtora: "ENGECAL CONSTRUTORA LTDA", valorTotal: 19800000, concluido: 30, previsaoEntrega: "10/2026", status: "Em Andamento", ano: 2026 },
  { id: "obr-16", contrato: "021/2026-SEDUC", descricao: "Construção do Centro de Ensino Fundamental e Médio de Tempo Integral", municipio: "Caxias", orgao: "SEDUC", construtora: "NORTE REFORMAS PÚBLICAS", valorTotal: 12500000, concluido: 35, previsaoEntrega: "09/2026", status: "Em Andamento", ano: 2026 },
]

export const DADOS_PESSOAL = [
  // ─── Educação (Professores) ───────────────────────────────────────
  { id: "pes-1", matricula: "0048192-1", nome: "MARIA DAS GRAÇAS SILVA SANTOS", cpf: "***.452.883-**", cargo: "Professor da Educação Básica II", orgao: "Secretaria de Educação - SEDUC", vinculo: "Efetivo", admissao: "12/03/2012", mes: "Fevereiro", remuneracaoBruta: 8450, remuneracaoLiquida: 6890, situacao: "Ativo", ano: 2026 },
  { id: "pes-2", matricula: "0051204-8", nome: "JOÃO BATISTA FERREIRA", cpf: "***.321.654-**", cargo: "Professor da Educação Básica II", orgao: "Secretaria de Educação - SEDUC", vinculo: "Efetivo", admissao: "18/02/2014", mes: "Fevereiro", remuneracaoBruta: 7890, remuneracaoLiquida: 6380, situacao: "Ativo", ano: 2026 },
  { id: "pes-3", matricula: "0062190-3", nome: "CLÁUDIA MARIA ALBUQUERQUE", cpf: "***.789.012-**", cargo: "Professor Adjunto - Magistério Superior", orgao: "Universidade Estadual - UEMA", vinculo: "Efetivo", admissao: "08/04/2010", mes: "Fevereiro", remuneracaoBruta: 14200, remuneracaoLiquida: 11150, situacao: "Ativo", ano: 2026 },
  { id: "pes-4", matricula: "0071452-9", nome: "ANA LÚCIA RIBEIRO GOMES", cpf: "***.234.567-**", cargo: "Professor da Educação Básica I", orgao: "Secretaria de Educação - SEDUC", vinculo: "Contrato Temporário", admissao: "01/02/2024", mes: "Fevereiro", remuneracaoBruta: 5400, remuneracaoLiquida: 4620, situacao: "Ativo", ano: 2026 },

  // ─── Saúde (Médicos, Enfermeiros) ─────────────────────────────────
  { id: "pes-5", matricula: "0031849-3", nome: "DR. JOSÉ CARLOS MENDES RIBEIRO", cpf: "***.123.987-**", cargo: "Médico Clínico Geral Plantonista", orgao: "Secretaria de Saúde - SES", vinculo: "Efetivo", admissao: "05/08/2015", mes: "Fevereiro", remuneracaoBruta: 18200, remuneracaoLiquida: 14350, situacao: "Ativo", ano: 2026 },
  { id: "pes-6", matricula: "0040182-7", nome: "DRA. MARIANA VIEIRA GUIMARÃES", cpf: "***.890.123-**", cargo: "Médico Especialista Plantonista", orgao: "Secretaria de Saúde - SES", vinculo: "Efetivo", admissao: "10/01/2017", mes: "Fevereiro", remuneracaoBruta: 22400, remuneracaoLiquida: 17300, situacao: "Ativo", ano: 2026 },
  { id: "pes-7", matricula: "0064501-2", nome: "FERNANDA COSTA SANTOS", cpf: "***.567.890-**", cargo: "Enfermeiro de Urgência e Emergência", orgao: "Secretaria de Saúde - SES", vinculo: "Efetivo", admissao: "14/09/2019", mes: "Fevereiro", remuneracaoBruta: 7320, remuneracaoLiquida: 6050, situacao: "Ativo", ano: 2026 },
  { id: "pes-8", matricula: "0082341-6", nome: "LUCAS TAVARES FONSECA", cpf: "***.678.901-**", cargo: "Técnico em Enfermagem Hospitalar", orgao: "Secretaria de Saúde - SES", vinculo: "Efetivo", admissao: "22/03/2021", mes: "Fevereiro", remuneracaoBruta: 3850, remuneracaoLiquida: 3280, situacao: "Ativo", ano: 2026 },

  // ─── Segurança Pública (Policiais Civis e Militares) ───────────────
  { id: "pes-9", matricula: "0074219-5", nome: "MARCOS VINICIUS PEREIRA COSTA", cpf: "***.789.456-**", cargo: "Investigador de Polícia Civil", orgao: "Secretaria de Segurança - SSP", vinculo: "Efetivo", admissao: "14/06/2018", mes: "Fevereiro", remuneracaoBruta: 15600, remuneracaoLiquida: 12100, situacao: "Ativo", ano: 2026 },
  { id: "pes-10", matricula: "0061892-4", nome: "SGT. CARLOS EDUARDO SOUSA", cpf: "***.345.678-**", cargo: "Sargento PM", orgao: "Polícia Militar - PMMA", vinculo: "Efetivo", admissao: "02/05/2011", mes: "Fevereiro", remuneracaoBruta: 10450, remuneracaoLiquida: 8420, situacao: "Ativo", ano: 2026 },
  { id: "pes-11", matricula: "0091042-1", nome: "SD. THIAGO MENDES BRITO", cpf: "***.901.234-**", cargo: "Soldado PM de 1ª Classe", orgao: "Polícia Militar - PMMA", vinculo: "Efetivo", admissao: "15/08/2022", mes: "Fevereiro", remuneracaoBruta: 6750, remuneracaoLiquida: 5520, situacao: "Ativo", ano: 2026 },
  { id: "pes-12", matricula: "0028914-7", nome: "DRA. PATRICIA ALVES MONTEIRO", cpf: "***.456.789-**", cargo: "Delegado de Polícia Civil", orgao: "Secretaria de Segurança - SSP", vinculo: "Efetivo", admissao: "12/07/2009", mes: "Fevereiro", remuneracaoBruta: 24800, remuneracaoLiquida: 18950, situacao: "Ativo", ano: 2026 },
  { id: "pes-13", matricula: "0054812-3", nome: "CAP. ROBERTO LIMA BARROS", cpf: "***.234.890-**", cargo: "Capitão do Corpo de Bombeiros", orgao: "Corpo de Bombeiros - CBMMA", vinculo: "Efetivo", admissao: "10/01/2013", mes: "Fevereiro", remuneracaoBruta: 13800, remuneracaoLiquida: 10750, situacao: "Ativo", ano: 2026 },

  // ─── Fazenda, Administração e Obras ───────────────────────────────
  { id: "pes-14", matricula: "0019482-8", nome: "ANA BEATRIZ ALMEIDA ROCHA", cpf: "***.654.321-**", cargo: "Auditor Fiscal da Receita Estadual", orgao: "Secretaria da Fazenda - SEFAZ", vinculo: "Efetivo", admissao: "10/02/2010", mes: "Fevereiro", remuneracaoBruta: 22500, remuneracaoLiquida: 17800, situacao: "Ativo", ano: 2026 },
  { id: "pes-15", matricula: "0038910-2", nome: "PAULO ROBERTO DINIZ", cpf: "***.789.123-**", cargo: "Técnico da Receita Estadual", orgao: "Secretaria da Fazenda - SEFAZ", vinculo: "Efetivo", admissao: "14/03/2016", mes: "Fevereiro", remuneracaoBruta: 11200, remuneracaoLiquida: 9150, situacao: "Ativo", ano: 2026 },
  { id: "pes-16", matricula: "0088312-9", nome: "LUCIA VERÔNICA CARVALHO MOTA", cpf: "***.876.543-**", cargo: "Assessor Especial de Gabinete", orgao: "Secretaria de Administração - SEAD", vinculo: "Comissionado", admissao: "03/01/2023", mes: "Fevereiro", remuneracaoBruta: 9800, remuneracaoLiquida: 7850, situacao: "Ativo", ano: 2026 },
  { id: "pes-17", matricula: "0067104-5", nome: "RICARDO BARBOSA SANTOS", cargo: "Analista de Gestão Pública", orgao: "Secretaria de Administração - SEAD", vinculo: "Efetivo", admissao: "05/06/2019", mes: "Fevereiro", remuneracaoBruta: 8900, remuneracaoLiquida: 7320, situacao: "Ativo", ano: 2026 },
  { id: "pes-18", matricula: "0041209-1", nome: "ENG. MARCELO NOGUEIRA FONTES", cpf: "***.987.654-**", cargo: "Engenheiro Civil", orgao: "Secretaria de Infraestrutura - SINFRA", vinculo: "Efetivo", admissao: "18/08/2015", mes: "Fevereiro", remuneracaoBruta: 18900, remuneracaoLiquida: 14750, situacao: "Ativo", ano: 2026 },

  // ─── 2025 Registros Históricos ────────────────────────────────────
  { id: "pes-19", matricula: "0048192-1", nome: "MARIA DAS GRAÇAS SILVA SANTOS", cpf: "***.452.883-**", cargo: "Professor da Educação Básica II", orgao: "Secretaria de Educação - SEDUC", vinculo: "Efetivo", admissao: "12/03/2012", mes: "Janeiro", remuneracaoBruta: 8120, remuneracaoLiquida: 6620, situacao: "Ativo", ano: 2025 },
  { id: "pes-20", matricula: "0031849-3", nome: "DR. JOSÉ CARLOS MENDES RIBEIRO", cpf: "***.123.987-**", cargo: "Médico Clínico Geral Plantonista", orgao: "Secretaria de Saúde - SES", vinculo: "Efetivo", admissao: "05/08/2015", mes: "Janeiro", remuneracaoBruta: 17500, remuneracaoLiquida: 13800, situacao: "Ativo", ano: 2025 },
]

export const DADOS_REMUNERACAO = [
  { id: "rem-1", codigoCargo: "CARG-0102", denominacao: "Auditor Fiscal da Receita Estadual", grupo: "Tributação e Fiscalização", poder: "Executivo", qtdServidores: 412, vencimentoBase: 15200, gratificacoes: 7300, salarioMedioBruto: 22500, cargaHoraria: "40h semanais", ano: 2026 },
  { id: "rem-2", codigoCargo: "CARG-0205", denominacao: "Professor da Educação Básica II", grupo: "Magistério Estadual", poder: "Executivo", qtdServidores: 38420, vencimentoBase: 5800, gratificacoes: 2650, salarioMedioBruto: 8450, cargaHoraria: "40h semanais", ano: 2026 },
  { id: "rem-3", codigoCargo: "CARG-0210", denominacao: "Professor da Educação Básica I", grupo: "Magistério Estadual", poder: "Executivo", qtdServidores: 12400, vencimentoBase: 4200, gratificacoes: 1200, salarioMedioBruto: 5400, cargaHoraria: "30h semanais", ano: 2026 },
  { id: "rem-4", codigoCargo: "CARG-0310", denominacao: "Médico Especialista Plantonista", grupo: "Saúde Pública", poder: "Executivo", qtdServidores: 2840, vencimentoBase: 12400, gratificacoes: 10000, salarioMedioBruto: 22400, cargaHoraria: "24h semanais", ano: 2026 },
  { id: "rem-5", codigoCargo: "CARG-0315", denominacao: "Médico Clínico Geral", grupo: "Saúde Pública", poder: "Executivo", qtdServidores: 4000, vencimentoBase: 10800, gratificacoes: 7400, salarioMedioBruto: 18200, cargaHoraria: "24h semanais", ano: 2026 },
  { id: "rem-6", codigoCargo: "CARG-0320", denominacao: "Enfermeiro Padrão", grupo: "Saúde Pública", poder: "Executivo", qtdServidores: 8420, vencimentoBase: 4800, gratificacoes: 2520, salarioMedioBruto: 7320, cargaHoraria: "30h semanais", ano: 2026 },
  { id: "rem-7", codigoCargo: "CARG-0325", denominacao: "Técnico em Enfermagem", grupo: "Saúde Pública", poder: "Executivo", qtdServidores: 12380, vencimentoBase: 2600, gratificacoes: 1250, salarioMedioBruto: 3850, cargaHoraria: "30h semanais", ano: 2026 },
  { id: "rem-8", codigoCargo: "CARG-0410", denominacao: "Soldado PM de 1ª Classe", grupo: "Segurança e Defesa", poder: "Executivo", qtdServidores: 12420, vencimentoBase: 4900, gratificacoes: 1850, salarioMedioBruto: 6750, cargaHoraria: "Regime de Escala", ano: 2026 },
  { id: "rem-9", codigoCargo: "CARG-0415", denominacao: "Sargento PM", grupo: "Segurança e Defesa", poder: "Executivo", qtdServidores: 3120, vencimentoBase: 7800, gratificacoes: 2650, salarioMedioBruto: 10450, cargaHoraria: "Regime de Escala", ano: 2026 },
  { id: "rem-10", codigoCargo: "CARG-0420", denominacao: "Investigador de Polícia Civil", grupo: "Segurança e Defesa", poder: "Executivo", qtdServidores: 2150, vencimentoBase: 10400, gratificacoes: 5200, salarioMedioBruto: 15600, cargaHoraria: "40h semanais", ano: 2026 },
  { id: "rem-11", codigoCargo: "CARG-0425", denominacao: "Delegado de Polícia Civil", grupo: "Segurança e Defesa", poder: "Executivo", qtdServidores: 720, vencimentoBase: 17200, gratificacoes: 7600, salarioMedioBruto: 24800, cargaHoraria: "40h semanais", ano: 2026 },
  { id: "rem-12", codigoCargo: "CARG-0510", denominacao: "Engenheiro Civil", grupo: "Obras e Infraestrutura", poder: "Executivo", qtdServidores: 380, vencimentoBase: 12800, gratificacoes: 6100, salarioMedioBruto: 18900, cargaHoraria: "40h semanais", ano: 2026 },
  { id: "rem-13", codigoCargo: "CARG-0522", denominacao: "Procurador do Estado", grupo: "Advocacia Pública", poder: "Executivo", qtdServidores: 145, vencimentoBase: 21000, gratificacoes: 7400, salarioMedioBruto: 28400, cargaHoraria: "40h semanais", ano: 2026 },
  { id: "rem-14", codigoCargo: "CARG-0610", denominacao: "Analista de Gestão Pública", grupo: "Gestão e Administração", poder: "Executivo", qtdServidores: 1850, vencimentoBase: 5900, gratificacoes: 3000, salarioMedioBruto: 8900, cargaHoraria: "40h semanais", ano: 2026 },
]

export const DADOS_EMENDAS_PARLAMENTARES = [
  { id: "ep-1", numero: "EP-2025/0014", deputado: "Dep. Arnaldo Melo", municipio: "Passagem Franca", orgaoExecutor: "SES", objeto: "Aquisição de ambulância de suporte avançado e insumos hospitalares", area: "Saúde", indicado: 1500000, pago: 1500000, executado: 100, status: "Pago Integralmente", ano: 2025 },
  { id: "ep-2", numero: "EP-2025/0038", deputado: "Dep. Roberto Costa", municipio: "Bacabal", orgaoExecutor: "SINFRA", objeto: "Pavimentação asfáltica e drenagem de vias do bairro Pantanal", area: "Infraestrutura", indicado: 2800000, pago: 2100000, executado: 75, status: "Em Execução", ano: 2025 },
  { id: "ep-3", numero: "EP-2025/0072", deputado: "Depª. Iracema Vale", municipio: "Urbano Santos", orgaoExecutor: "SEDEL", objeto: "Construção de praça poliesportiva com iluminação de LED e pista de caminhada", area: "Esporte e Lazer", indicado: 950000, pago: 950000, executado: 100, status: "Pago Integralmente", ano: 2025 },
  { id: "ep-4", numero: "EP-2025/0105", deputado: "Dep. Glalbert Cutrim", municipio: "Pinheiro", orgaoExecutor: "SAF", objeto: "Kits de irrigação e maquinário agrícola para cooperativas rurais", area: "Agricultura", indicado: 1200000, pago: 600000, executado: 50, status: "Em Execução", ano: 2025 },
  { id: "ep-5", numero: "EP-2025/0140", deputado: "Depª. Daniella", municipio: "Presidente Dutra", orgaoExecutor: "SES", objeto: "Custeio de exames laboratoriais e mamografias na rede municipal", area: "Saúde", indicado: 1800000, pago: 1800000, executado: 100, status: "Pago Integralmente", ano: 2025 },
  { id: "ep-6", numero: "EP-2025/0188", deputado: "Dep. Othelino Neto", municipio: "Caxias", orgaoExecutor: "SES", objeto: "Equipamentos de hemodiálise para o Centro de Nefrologia Regional", area: "Saúde", indicado: 2400000, pago: 2400000, executado: 100, status: "Pago Integralmente", ano: 2025 },
  { id: "ep-7", numero: "EP-2025/0212", deputado: "Dep. Rildo Amaral", municipio: "Imperatriz", orgaoExecutor: "SINFRA", objeto: "Recapeamento asfáltica e drenagem de avenidas de ligação de bairros", area: "Infraestrutura", indicado: 3500000, pago: 2800000, executado: 80, status: "Em Execução", ano: 2025 },
  { id: "ep-8", numero: "EP-2025/0265", deputado: "Dep. Alan da Marissol", municipio: "Balsas", orgaoExecutor: "SEDUC", objeto: "Climatização de 6 escolas estaduais da zona urbana e rural", area: "Educação", indicado: 1600000, pago: 1600000, executado: 100, status: "Pago Integralmente", ano: 2025 },
  { id: "ep-9", numero: "EP-2025/0310", deputado: "Dep. Florêncio Neto", municipio: "Codó", orgaoExecutor: "SAF", objeto: "Patrulhas mecanizadas e tratores para comunidades quilombolas", area: "Agricultura", indicado: 1450000, pago: 1450000, executado: 100, status: "Pago Integralmente", ano: 2025 },
  { id: "ep-10", numero: "EP-2025/0355", deputado: "Depª. Abigail Cunha", municipio: "Timon", orgaoExecutor: "SECID", objeto: "Pavimentação em bloquetes de ruas e calçadas com acessibilidade", area: "Infraestrutura", indicado: 2100000, pago: 1680000, executado: 80, status: "Em Execução", ano: 2025 },
  { id: "ep-11", numero: "EP-2026/0018", deputado: "Dep. Arnaldo Melo", municipio: "São Luís", orgaoExecutor: "SES", objeto: "Apoio a cirurgias pediátricas cardíacas e leitos intensivos", area: "Saúde", indicado: 2500000, pago: 1250000, executado: 50, status: "Em Execução", ano: 2026 },
  { id: "ep-12", numero: "EP-2026/0045", deputado: "Depª. Iracema Vale", municipio: "Santa Inês", orgaoExecutor: "SES", objeto: "Aquisição de mamógrafo digital de alta resolução e insumos", area: "Saúde", indicado: 1900000, pago: 1900000, executado: 100, status: "Pago Integralmente", ano: 2026 },
]

export const DADOS_EMENDAS_FEDERAIS = [
  { id: "ef-1", numero: "EF-2025/9012", parlamentar: "Bancada Federal do Maranhão", orgaoRepassador: "Ministério da Saúde", orgaoExecutor: "SES", municipio: "São Luís", objeto: "Incremento temporário ao Teto de Média e Alta Complexidade (MAC)", valorEmpenhado: 45000000, valorRepassado: 45000000, saldo: 0, situacao: "Repassado", ano: 2025 },
  { id: "ef-2", numero: "EF-2025/8410", parlamentar: "Senador da República", orgaoRepassador: "CODEVASF / MIDR", orgaoExecutor: "SINFRA", municipio: "Imperatriz", objeto: "Estruturação de estradas vicinais e escoamento da produção de soja e leite", valorEmpenhado: 18500000, valorRepassado: 14200000, saldo: 4300000, situacao: "Repasse Parcial", ano: 2025 },
  { id: "ef-3", numero: "EF-2025/7822", parlamentar: "Deputado Federal", orgaoRepassador: "Fundo Nacional de Saúde - FNS", orgaoExecutor: "SES", municipio: "Caxias", objeto: "Equipamentos para maternidade e centro cirúrgico neonatal", valorEmpenhado: 8900000, valorRepassado: 8900000, saldo: 0, situacao: "Repassado", ano: 2025 },
  { id: "ef-4", numero: "EF-2025/6915", parlamentar: "Bancada Federal do Maranhão", orgaoRepassador: "MEC / FNDE", orgaoExecutor: "SEDUC", municipio: "Codó", objeto: "Ônibus escolares rurais traçados (Caminho da Escola)", valorEmpenhado: 6400000, valorRepassado: 6400000, saldo: 0, situacao: "Repassado", ano: 2025 },
  { id: "ef-5", numero: "EF-2025/5510", parlamentar: "Deputado Federal", orgaoRepassador: "Ministério das Cidades", orgaoExecutor: "SECID", municipio: "Açailândia", objeto: "Canalização e obras de contenção de encostas e drenagem", valorEmpenhado: 12000000, valorRepassado: 6000000, saldo: 6000000, situacao: "Repasse Parcial", ano: 2025 },
  { id: "ef-6", numero: "EF-2025/4412", parlamentar: "Deputado Federal", orgaoRepassador: "Fundo Nacional de Saúde - FNS", orgaoExecutor: "SES", municipio: "Balsas", objeto: "Estruturação de Unidade de Tratamento Intensivo e tomografia", valorEmpenhado: 7500000, valorRepassado: 7500000, saldo: 0, situacao: "Repassado", ano: 2025 },
  { id: "ef-7", numero: "EF-2025/3890", parlamentar: "Senador da República", orgaoRepassador: "Ministério dos Transportes", orgaoExecutor: "SINFRA", municipio: "Pinheiro", objeto: "Construção de atracadouro fluvial e melhoria de acessos rodoviários", valorEmpenhado: 9400000, valorRepassado: 9400000, saldo: 0, situacao: "Repassado", ano: 2025 },
  { id: "ef-8", numero: "EF-2026/1020", parlamentar: "Bancada Federal do Maranhão", orgaoRepassador: "Ministério da Saúde", orgaoExecutor: "SES", municipio: "Timon", objeto: "Aquisição de ambulâncias e custeio de procedimentos ambulatoriais", valorEmpenhado: 8200000, valorRepassado: 4100000, saldo: 4100000, situacao: "Repasse Parcial", ano: 2026 },
]

// =====================================================================
// COMPONENTE PRINCIPAL
// =====================================================================

export function ConsultaEspecifica({ eixoSlug = "gestao-publica" }: { eixoSlug?: string }) {
  // Lista de abas permitidas para este eixo
  const abasDisponiveis = ABAS_POR_EIXO[eixoSlug] ?? []

  // Aba ativa (inicia vazia ou selecionada quando há 1 única aba)
  const [abaAtiva, setAbaAtiva] = useState<string | null>(() => {
    return abasDisponiveis.length === 1 ? abasDisponiveis[0].id : null
  })

  // Filtros genéricos
  const [filtroCategoria, setFiltroCategoria] = useState("Todos")
  const [filtroOrgao, setFiltroOrgao] = useState(() => {
    if (eixoSlug === "saude") return "SES"
    if (eixoSlug === "educacao") return "SEDUC"
    return "Todos"
  })
  const [filtroSituacao, setFiltroSituacao] = useState("Todos")
  const [filtroAno, setFiltroAno] = useState(2026)
  const [filtroMes, setFiltroMes] = useState("Todos")
  const [filtroMunicipio, setFiltroMunicipio] = useState("Todos")

  // Barra de ferramentas
  const [termoBusca, setTermoBusca] = useState("")
  const [itensPorPagina, setItensPorPagina] = useState(10)
  const [paginaAtual, setPaginaAtual] = useState(1)

  if (abasDisponiveis.length === 0) {
    return null
  }

  function handleClicarAba(id: string) {
    if (abaAtiva === id && abasDisponiveis.length > 1) {
      setAbaAtiva(null) // Clicar na mesma aba fecha se houver mais de uma
    } else {
      setAbaAtiva(id)
      setTermoBusca("")
      setFiltroCategoria("Todos")
      setFiltroOrgao(eixoSlug === "saude" ? "SES" : eixoSlug === "educacao" ? "SEDUC" : "Todos")
      setFiltroSituacao("Todos")
      setFiltroAno(2026)
      setFiltroMes("Todos")
      setFiltroMunicipio("Todos")
      setPaginaAtual(1)
    }
  }

  function handleLimparFiltros() {
    setTermoBusca("")
    setFiltroCategoria("Todos")
    setFiltroOrgao(eixoSlug === "saude" ? "SES" : eixoSlug === "educacao" ? "SEDUC" : "Todos")
    setFiltroSituacao("Todos")
    setFiltroAno(2026)
    setFiltroMes("Todos")
    setFiltroMunicipio("Todos")
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
        if (filtroAno !== 0 && item.ano !== filtroAno) return false
        if (b) return item.rubrica.toLowerCase().includes(b) || item.codigo.includes(b) || item.unidade.toLowerCase().includes(b)
        return true
      })
    }

    // 2. Despesas
    if (abaAtiva === "despesas") {
      return DADOS_DESPESAS.filter((item) => {
        if (filtroSituacao !== "Todos" && item.situacao !== filtroSituacao) return false
        if (filtroOrgao !== "Todos" && !item.unidade.includes(filtroOrgao)) return false
        if (filtroAno !== 0 && item.ano !== filtroAno) return false
        if (filtroMes !== "Todos" && item.mes !== filtroMes) return false
        if (b) return item.credor.toLowerCase().includes(b) || item.documento.toLowerCase().includes(b) || item.funcao.toLowerCase().includes(b) || item.unidade.toLowerCase().includes(b)
        return true
      })
    }

    // 3. Contratos
    if (abaAtiva === "contratos") {
      return DADOS_CONTRATOS.filter((item) => {
        if (filtroSituacao !== "Todos" && item.status !== filtroSituacao) return false
        if (filtroOrgao !== "Todos" && !item.unidade.includes(filtroOrgao)) return false
        if (filtroAno !== 0 && item.ano !== filtroAno) return false
        if (b) return item.empresa.toLowerCase().includes(b) || item.numeroContrato.toLowerCase().includes(b) || item.objeto.toLowerCase().includes(b) || item.cnpj.includes(b)
        return true
      })
    }

    // 4. Convênios e Repasses
    if (abaAtiva === "convenios") {
      return DADOS_CONVENIOS.filter((item) => {
        if (filtroSituacao !== "Todos" && item.status !== filtroSituacao) return false
        if (filtroOrgao !== "Todos" && item.orgaoConcedente !== filtroOrgao) return false
        if (filtroMunicipio !== "Todos" && item.municipio !== filtroMunicipio) return false
        if (filtroAno !== 0 && item.ano !== filtroAno) return false
        if (b) return item.municipio.toLowerCase().includes(b) || item.objeto.toLowerCase().includes(b) || item.numeroConvenio.toLowerCase().includes(b) || item.processo.toLowerCase().includes(b)
        return true
      })
    }

    // 5. Diárias e Viagens
    if (abaAtiva === "diarias") {
      return DADOS_DIARIAS.filter((item) => {
        if (filtroSituacao !== "Todos" && item.situacao !== filtroSituacao) return false
        if (filtroOrgao !== "Todos" && item.orgao !== filtroOrgao) return false
        if (filtroMes !== "Todos" && item.mes !== filtroMes) return false
        if (filtroMunicipio !== "Todos" && !item.destino.toLowerCase().includes(filtroMunicipio.toLowerCase())) return false
        if (filtroAno !== 0 && item.ano !== filtroAno) return false
        if (b) return item.servidor.toLowerCase().includes(b) || item.cargo.toLowerCase().includes(b) || item.destino.toLowerCase().includes(b) || item.motivo.toLowerCase().includes(b) || item.pcd.toLowerCase().includes(b)
        return true
      })
    }

    // 6. Licitações
    if (abaAtiva === "licitacoes") {
      return DADOS_LICITACOES.filter((item) => {
        if (filtroSituacao !== "Todos" && item.situacao !== filtroSituacao) return false
        if (filtroCategoria !== "Todos" && item.modalidade !== filtroCategoria) return false
        if (filtroOrgao !== "Todos" && !item.orgao.includes(filtroOrgao)) return false
        if (filtroAno !== 0 && item.ano !== filtroAno) return false
        if (b) return item.edital.toLowerCase().includes(b) || item.objeto.toLowerCase().includes(b) || item.vencedor.toLowerCase().includes(b)
        return true
      })
    }

    // 7. Adiantamentos
    if (abaAtiva === "adiantamentos") {
      return DADOS_ADIANTAMENTOS.filter((item) => {
        if (filtroSituacao !== "Todos" && item.situacao !== filtroSituacao) return false
        if (filtroOrgao !== "Todos" && !item.orgao.includes(filtroOrgao)) return false
        if (filtroAno !== 0 && item.ano !== filtroAno) return false
        if (b) return item.responsavel.toLowerCase().includes(b) || item.processo.toLowerCase().includes(b) || item.finalidade.toLowerCase().includes(b)
        return true
      })
    }

    // 8. Ordem Cronológica
    if (abaAtiva === "ordem-cronologica") {
      return DADOS_ORDEM_CRONOLOGICA.filter((item) => {
        if (filtroOrgao !== "Todos" && !item.unidade.includes(filtroOrgao)) return false
        if (filtroAno !== 0 && item.ano !== filtroAno) return false
        if (b) return item.credor.toLowerCase().includes(b) || item.liquidacao.toLowerCase().includes(b) || item.status.toLowerCase().includes(b)
        return true
      })
    }

    // 9. Obras
    if (abaAtiva === "obras") {
      return DADOS_OBRAS.filter((item) => {
        if (filtroSituacao !== "Todos" && item.status !== filtroSituacao) return false
        if (filtroOrgao !== "Todos" && item.orgao !== filtroOrgao) return false
        if (filtroMunicipio !== "Todos" && !item.municipio.includes(filtroMunicipio)) return false
        if (filtroAno !== 0 && item.ano !== filtroAno) return false
        if (b) return item.descricao.toLowerCase().includes(b) || item.municipio.toLowerCase().includes(b) || item.construtora.toLowerCase().includes(b)
        return true
      })
    }

    // 10. Pessoal
    if (abaAtiva === "pessoal") {
      return DADOS_PESSOAL.filter((item) => {
        if (filtroCategoria !== "Todos" && item.vinculo !== filtroCategoria) return false
        if (filtroOrgao !== "Todos" && !item.orgao.includes(filtroOrgao)) return false
        if (filtroMes !== "Todos" && item.mes !== filtroMes) return false
        if (filtroAno !== 0 && item.ano !== filtroAno) return false
        if (b) return item.nome.toLowerCase().includes(b) || item.cargo.toLowerCase().includes(b) || item.matricula.includes(b)
        return true
      })
    }

    // 11. Remuneração
    if (abaAtiva === "remuneracao") {
      return DADOS_REMUNERACAO.filter((item) => {
        if (filtroCategoria !== "Todos" && item.grupo !== filtroCategoria) return false
        if (filtroAno !== 0 && item.ano !== filtroAno) return false
        if (b) return item.denominacao.toLowerCase().includes(b) || item.codigoCargo.toLowerCase().includes(b)
        return true
      })
    }

    // 12. Emendas Estaduais
    if (abaAtiva === "emendas-estaduais" || abaAtiva === "emendas-parlamentares") {
      return DADOS_EMENDAS_PARLAMENTARES.filter((item) => {
        if (filtroCategoria !== "Todos" && item.area !== filtroCategoria) return false
        if (filtroMunicipio !== "Todos" && item.municipio !== filtroMunicipio) return false
        if (filtroOrgao !== "Todos" && item.orgaoExecutor !== filtroOrgao) return false
        if (filtroAno !== 0 && item.ano !== filtroAno) return false
        if (b) return item.deputado.toLowerCase().includes(b) || item.municipio.toLowerCase().includes(b) || item.objeto.toLowerCase().includes(b)
        return true
      })
    }

    // 13. Emendas Federais
    if (abaAtiva === "emendas-federais") {
      return DADOS_EMENDAS_FEDERAIS.filter((item) => {
        if (filtroSituacao !== "Todos" && item.situacao !== filtroSituacao) return false
        if (filtroMunicipio !== "Todos" && item.municipio !== filtroMunicipio) return false
        if (filtroOrgao !== "Todos" && item.orgaoExecutor !== filtroOrgao) return false
        if (filtroAno !== 0 && item.ano !== filtroAno) return false
        if (b) return item.parlamentar.toLowerCase().includes(b) || item.municipio.toLowerCase().includes(b) || item.objeto.toLowerCase().includes(b)
        return true
      })
    }

    return []
  }, [abaAtiva, termoBusca, filtroCategoria, filtroOrgao, filtroSituacao, filtroAno, filtroMes, filtroMunicipio])

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

  // ─── Cálculos dinâmicos de KPIs baseados nos filtros ativos ───────
  const metricasDespesas = useMemo(() => {
    if (abaAtiva !== "despesas") return null
    const empenhado = dadosFiltrados.reduce((s: number, d: any) => s + (d.empenhado || 0), 0)
    const liquidado = dadosFiltrados.reduce((s: number, d: any) => s + (d.liquidado || 0), 0)
    const pago = dadosFiltrados.reduce((s: number, d: any) => s + (d.pago || 0), 0)
    return { empenhado, liquidado, pago }
  }, [abaAtiva, dadosFiltrados])

  const metricasContratos = useMemo(() => {
    if (abaAtiva !== "contratos") return null
    const totalContratado = dadosFiltrados.reduce((s: number, d: any) => s + (d.valorTotal || 0), 0)
    const executado = dadosFiltrados.reduce((s: number, d: any) => s + (d.valorExecutado || 0), 0)
    return { total: dadosFiltrados.length, totalContratado, executado }
  }, [abaAtiva, dadosFiltrados])

  const metricasConvenios = useMemo(() => {
    if (abaAtiva !== "convenios") return null
    const totalConveniado = dadosFiltrados.reduce((s: number, d: any) => s + (d.valorTotal || 0), 0)
    const totalLiberado = dadosFiltrados.reduce((s: number, d: any) => s + (d.valorLiberado || 0), 0)
    const municipiosAtendidos = new Set(dadosFiltrados.map((d: any) => d.municipio)).size
    return { totalConvenios: dadosFiltrados.length, totalConveniado, totalLiberado, municipiosAtendidos }
  }, [abaAtiva, dadosFiltrados])

  const metricasDiarias = useMemo(() => {
    if (abaAtiva !== "diarias") return null
    const totalDiarias = dadosFiltrados.reduce((s: number, d: any) => s + (d.qtdDiarias || 0), 0)
    const totalValor = dadosFiltrados.reduce((s: number, d: any) => s + (d.valorTotal || 0), 0)
    const servidoresAtendidos = new Set(dadosFiltrados.map((d: any) => d.servidor)).size
    return { totalDiarias, totalValor, servidoresAtendidos }
  }, [abaAtiva, dadosFiltrados])

  const metricasObras = useMemo(() => {
    if (abaAtiva !== "obras") return null
    const totalInvestido = dadosFiltrados.reduce((s: number, d: any) => s + (d.valorTotal || 0), 0)
    const mediaConclusao = dadosFiltrados.length
      ? Math.round(dadosFiltrados.reduce((s: number, d: any) => s + (d.concluido || 0), 0) / dadosFiltrados.length)
      : 0
    return { total: dadosFiltrados.length, totalInvestido, mediaConclusao }
  }, [abaAtiva, dadosFiltrados])

  const metricasPessoal = useMemo(() => {
    if (abaAtiva !== "pessoal") return null
    const totalBruto = dadosFiltrados.reduce((s: number, d: any) => s + (d.remuneracaoBruta || 0), 0)
    const totalLiquido = dadosFiltrados.reduce((s: number, d: any) => s + (d.remuneracaoLiquida || 0), 0)
    const mediaSalarial = dadosFiltrados.length ? totalBruto / dadosFiltrados.length : 0
    return { total: dadosFiltrados.length, totalBruto, totalLiquido, mediaSalarial }
  }, [abaAtiva, dadosFiltrados])

  const metricasEmendasEstaduais = useMemo(() => {
    if (abaAtiva !== "emendas-estaduais" && abaAtiva !== "emendas-parlamentares") return null
    const totalIndicado = dadosFiltrados.reduce((s: number, d: any) => s + (d.indicado || 0), 0)
    const totalPago = dadosFiltrados.reduce((s: number, d: any) => s + (d.pago || 0), 0)
    const municipios = new Set(dadosFiltrados.map((d: any) => d.municipio)).size
    return { totalIndicado, totalPago, municipios }
  }, [abaAtiva, dadosFiltrados])

  const metricasEmendasFederais = useMemo(() => {
    if (abaAtiva !== "emendas-federais") return null
    const totalEmpenhado = dadosFiltrados.reduce((s: number, d: any) => s + (d.valorEmpenhado || 0), 0)
    const totalRepassado = dadosFiltrados.reduce((s: number, d: any) => s + (d.valorRepassado || 0), 0)
    const municipios = new Set(dadosFiltrados.map((d: any) => d.municipio)).size
    return { totalEmpenhado, totalRepassado, municipios }
  }, [abaAtiva, dadosFiltrados])

  // Controles de visibilidade dos filtros específicos
  const temFiltroMes = abaAtiva === "despesas" || abaAtiva === "pessoal" || abaAtiva === "diarias"
  const temFiltroMunicipio = abaAtiva === "obras" || abaAtiva === "convenios" || abaAtiva === "diarias" || abaAtiva === "emendas-estaduais" || abaAtiva === "emendas-parlamentares" || abaAtiva === "emendas-federais"

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
          abasDisponiveis.length === 3 && "grid-cols-1 sm:grid-cols-3 max-w-3xl",
          abasDisponiveis.length > 3 && "grid-cols-2 sm:grid-cols-4 lg:grid-cols-8"
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
                "group relative flex flex-col items-center justify-center rounded-2xl border p-3 sm:p-4 text-center transition-all duration-200",
                "bg-card shadow-xs hover:shadow-md cursor-pointer",
                ativo
                  ? "border-primary ring-2 ring-primary/25 bg-primary/[0.03] shadow-sm -translate-y-0.5"
                  : "border-border/80 hover:border-primary/40 hover:-translate-y-0.5"
              )}
            >
              <span
                className={cn(
                  "flex size-11 items-center justify-center rounded-xl transition-transform duration-200 group-hover:scale-105",
                  a.iconBg
                )}
              >
                <Icon className="size-5.5" aria-hidden="true" />
              </span>

              <span
                className={cn(
                  "mt-2.5 text-xs sm:text-sm tracking-tight leading-snug transition-colors line-clamp-2",
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
            Clique em uma das abas acima para abrir os filtros por secretaria, período, município e detalhamento dos registros.
          </p>
        </div>
      ) : (
        <div className="space-y-6 animate-in fade-in-50 duration-300">
          {/* ========================================================= */}
          {/* CARD DE FILTROS DA ABA SELECIONADA */}
          {/* ========================================================= */}
          <div className="rounded-2xl border border-border bg-card p-5 md:p-6 shadow-xs space-y-4">
            <div className="flex items-center justify-between border-b border-border/80 pb-3">
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

            {/* GRADE DE FILTROS REATIVOS */}
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
              {/* Filtro 1: Categoria / Modalidade / Área */}
              <div>
                <label className="block text-xs font-semibold text-muted-foreground mb-1">
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
                  className="h-9 w-full rounded-md border border-input bg-background px-2.5 text-xs text-foreground focus:border-primary focus:outline-none"
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
                      <option value="Contrato Temporário">Contrato Temporário</option>
                    </>
                  )}
                  {abaAtiva === "remuneracao" && (
                    <>
                      <option value="Magistério Estadual">Magistério Estadual (Professores)</option>
                      <option value="Segurança e Defesa">Segurança e Defesa (Policiais)</option>
                      <option value="Saúde Pública">Saúde Pública (Médicos, Enfermeiros)</option>
                      <option value="Tributação e Fiscalização">Tributação e Fiscalização (Auditores)</option>
                      <option value="Obras e Infraestrutura">Obras e Infraestrutura (Engenheiros)</option>
                      <option value="Advocacia Pública">Advocacia Pública (Procuradores)</option>
                      <option value="Gestão e Administração">Gestão e Administração</option>
                    </>
                  )}
                  {(abaAtiva === "emendas-estaduais" || abaAtiva === "emendas-parlamentares") && (
                    <>
                      <option value="Saúde">Saúde</option>
                      <option value="Infraestrutura">Infraestrutura</option>
                      <option value="Educação">Educação</option>
                      <option value="Esporte e Lazer">Esporte e Lazer</option>
                      <option value="Agricultura">Agricultura</option>
                    </>
                  )}
                </select>
              </div>

              {/* Filtro 2: Órgão / Secretaria */}
              <div>
                <label className="block text-xs font-semibold text-muted-foreground mb-1">
                  Órgão / Secretaria
                </label>
                <select
                  value={filtroOrgao}
                  onChange={(e) => {
                    setFiltroOrgao(e.target.value)
                    setPaginaAtual(1)
                  }}
                  className="h-9 w-full rounded-md border border-input bg-background px-2.5 text-xs text-foreground focus:border-primary focus:outline-none"
                >
                  <option value="Todos">Todos os Órgãos</option>
                  <option value="SES">SES (Saúde Estadual)</option>
                  <option value="SEDUC">SEDUC (Educação)</option>
                  <option value="SINFRA">SINFRA (Infraestrutura)</option>
                  <option value="SSP">SSP (Segurança Pública / Polícias)</option>
                  <option value="SEFAZ">SEFAZ (Fazenda)</option>
                  <option value="SEAD">SEAD (Administração)</option>
                  <option value="SECID">SECID (Cidades e Saneamento)</option>
                  <option value="SAF">SAF (Agricultura Familiar)</option>
                  <option value="SECTUR">SECTUR (Turismo e Cultura)</option>
                </select>
              </div>

              {/* Filtro 3: Mês ou Município contextual */}
              {temFiltroMes && (
                <div>
                  <label className="block text-xs font-semibold text-muted-foreground mb-1">
                    Mês / Período
                  </label>
                  <select
                    value={filtroMes}
                    onChange={(e) => {
                      setFiltroMes(e.target.value)
                      setPaginaAtual(1)
                    }}
                    className="h-9 w-full rounded-md border border-input bg-background px-2.5 text-xs text-foreground focus:border-primary focus:outline-none"
                  >
                    <option value="Todos">Todos os Meses</option>
                    <option value="Fevereiro">Fevereiro (Último mês)</option>
                    <option value="Janeiro">Janeiro</option>
                    <option value="Março">Março</option>
                  </select>
                </div>
              )}

              {temFiltroMunicipio && (
                <div>
                  <label className="block text-xs font-semibold text-muted-foreground mb-1">
                    Município Maranhense
                  </label>
                  <select
                    value={filtroMunicipio}
                    onChange={(e) => {
                      setFiltroMunicipio(e.target.value)
                      setPaginaAtual(1)
                    }}
                    className="h-9 w-full rounded-md border border-input bg-background px-2.5 text-xs text-foreground focus:border-primary focus:outline-none"
                  >
                    <option value="Todos">Todos os Municípios</option>
                    <option value="São Luís">São Luís</option>
                    <option value="Imperatriz">Imperatriz</option>
                    <option value="Caxias">Caxias</option>
                    <option value="Timon">Timon</option>
                    <option value="Balsas">Balsas</option>
                    <option value="Codó">Codó</option>
                    <option value="Açailândia">Açailândia</option>
                    <option value="Bacabal">Bacabal</option>
                    <option value="Pinheiro">Pinheiro</option>
                    <option value="Santa Inês">Santa Inês</option>
                    <option value="Barreirinhas">Barreirinhas</option>
                    <option value="Chapadinha">Chapadinha</option>
                    <option value="Presidente Dutra">Presidente Dutra</option>
                    <option value="Passagem Franca">Passagem Franca</option>
                    <option value="Urbano Santos">Urbano Santos</option>
                  </select>
                </div>
              )}

              {/* Filtro 4: Ano de Exercício */}
              <div>
                <label className="block text-xs font-semibold text-muted-foreground mb-1">
                  Ano de Exercício
                </label>
                <select
                  value={filtroAno}
                  onChange={(e) => {
                    setFiltroAno(Number(e.target.value))
                    setPaginaAtual(1)
                  }}
                  className="h-9 w-full rounded-md border border-input bg-background px-2.5 text-xs text-foreground focus:border-primary focus:outline-none"
                >
                  <option value={2026}>2026 (Exercício Atual)</option>
                  <option value={2025}>2025</option>
                  <option value={2024}>2024</option>
                  <option value={0}>Todos os Anos</option>
                </select>
              </div>
            </div>
          </div>

          {/* ========================================================= */}
          {/* CARDS DE KPI ESPECÍFICOS E DINÂMICOS DA ABA ATIVA */}
          {/* ========================================================= */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {abaAtiva === "receita" && (
              <>
                <div className="rounded-xl border border-border/80 bg-card p-4.5 text-center shadow-xs">
                  <p className="text-[11px] font-bold uppercase tracking-widest text-muted-foreground">RECEITA ARRECADADA</p>
                  <p className="font-display text-2xl lg:text-3xl font-extrabold my-1 tabular text-foreground">
                    {formatBRL(dadosFiltrados.reduce((s, i: any) => s + (i.arrecadado || 0), 0) || 5732000000)}
                  </p>
                  <span className="text-xs text-muted-foreground">Soma dos itens filtrados</span>
                </div>
                <div className="rounded-xl border border-primary/25 bg-gradient-to-br from-accent/30 via-card to-card p-4.5 text-center shadow-xs">
                  <p className="text-[11px] font-bold uppercase tracking-widest text-primary">PREVISÃO ORÇAMENTÁRIA</p>
                  <p className="font-display text-2xl lg:text-3xl font-extrabold my-1 tabular text-primary">
                    {formatBRL(dadosFiltrados.reduce((s, i: any) => s + (i.previsao || 0), 0) || 31200000000)}
                  </p>
                  <span className="text-xs text-primary font-medium">Meta orçamentária dos itens</span>
                </div>
                <div className="rounded-xl border border-success/25 bg-gradient-to-br from-success/5 via-card to-card p-4.5 text-center shadow-xs">
                  <p className="text-[11px] font-bold uppercase tracking-widest text-success">TOTAL DE RUBRICAS</p>
                  <p className="font-display text-2xl lg:text-3xl font-extrabold my-1 tabular text-success">{totalItens}</p>
                  <span className="text-xs text-success font-medium">Fontes de arrecadação ativas</span>
                </div>
              </>
            )}

            {abaAtiva === "despesas" && metricasDespesas && (
              <>
                <div className="rounded-xl border border-border/80 bg-card p-4.5 text-center shadow-xs">
                  <p className="text-[11px] font-bold uppercase tracking-widest text-muted-foreground">TOTAL EMPENHADO</p>
                  <p className="font-display text-2xl lg:text-3xl font-extrabold my-1 tabular text-foreground">{formatBRL(metricasDespesas.empenhado)}</p>
                  <span className="text-xs text-muted-foreground">Reserva orçamentária autorizada</span>
                </div>
                <div className="rounded-xl border border-primary/25 bg-gradient-to-br from-accent/30 via-card to-card p-4.5 text-center shadow-xs">
                  <p className="text-[11px] font-bold uppercase tracking-widest text-primary">TOTAL LIQUIDADO</p>
                  <p className="font-display text-2xl lg:text-3xl font-extrabold my-1 tabular text-primary">{formatBRL(metricasDespesas.liquidado)}</p>
                  <span className="text-xs text-primary font-medium">Serviços e bens conferidos</span>
                </div>
                <div className="rounded-xl border border-success/25 bg-gradient-to-br from-success/5 via-card to-card p-4.5 text-center shadow-xs">
                  <p className="text-[11px] font-bold uppercase tracking-widest text-success">TOTAL EFETIVAMENTE PAGO</p>
                  <p className="font-display text-2xl lg:text-3xl font-extrabold my-1 tabular text-success">{formatBRL(metricasDespesas.pago)}</p>
                  <span className="text-xs text-success font-medium">Ordens bancárias no período selecionado</span>
                </div>
              </>
            )}

            {abaAtiva === "contratos" && metricasContratos && (
              <>
                <div className="rounded-xl border border-border/80 bg-card p-4.5 text-center shadow-xs">
                  <p className="text-[11px] font-bold uppercase tracking-widest text-muted-foreground">CONTRATOS FILTRADOS</p>
                  <p className="font-display text-2xl lg:text-3xl font-extrabold my-1 tabular text-foreground">{formatNumber(metricasContratos.total)}</p>
                  <span className="text-xs text-muted-foreground">Termos vigentes no filtro</span>
                </div>
                <div className="rounded-xl border border-primary/25 bg-gradient-to-br from-accent/30 via-card to-card p-4.5 text-center shadow-xs">
                  <p className="text-[11px] font-bold uppercase tracking-widest text-primary">VALOR TOTAL CONTRATADO</p>
                  <p className="font-display text-2xl lg:text-3xl font-extrabold my-1 tabular text-primary">{formatBRL(metricasContratos.totalContratado)}</p>
                  <span className="text-xs text-primary font-medium">Compromissos acordados</span>
                </div>
                <div className="rounded-xl border border-success/25 bg-gradient-to-br from-success/5 via-card to-card p-4.5 text-center shadow-xs">
                  <p className="text-[11px] font-bold uppercase tracking-widest text-success">VALOR EXECUTADO</p>
                  <p className="font-display text-2xl lg:text-3xl font-extrabold my-1 tabular text-success">{formatBRL(metricasContratos.executado)}</p>
                  <span className="text-xs text-success font-medium">Medições e faturas pagas</span>
                </div>
              </>
            )}

            {abaAtiva === "convenios" && metricasConvenios && (
              <>
                <div className="rounded-xl border border-border/80 bg-card p-4.5 text-center shadow-xs">
                  <p className="text-[11px] font-bold uppercase tracking-widest text-muted-foreground">CONVÊNIOS / REPASSES</p>
                  <p className="font-display text-2xl lg:text-3xl font-extrabold my-1 tabular text-foreground">{formatNumber(metricasConvenios.totalConvenios)}</p>
                  <span className="text-xs text-muted-foreground">Termos firmados com municípios</span>
                </div>
                <div className="rounded-xl border border-primary/25 bg-gradient-to-br from-accent/30 via-card to-card p-4.5 text-center shadow-xs">
                  <p className="text-[11px] font-bold uppercase tracking-widest text-primary">VALOR TOTAL CONVENIADO</p>
                  <p className="font-display text-2xl lg:text-3xl font-extrabold my-1 tabular text-primary">{formatBRL(metricasConvenios.totalConveniado)}</p>
                  <span className="text-xs text-primary font-medium">{metricasConvenios.municipiosAtendidos} município(s) atendido(s)</span>
                </div>
                <div className="rounded-xl border border-success/25 bg-gradient-to-br from-success/5 via-card to-card p-4.5 text-center shadow-xs">
                  <p className="text-[11px] font-bold uppercase tracking-widest text-success">REPASSE EFETIVADO</p>
                  <p className="font-display text-2xl lg:text-3xl font-extrabold my-1 tabular text-success">{formatBRL(metricasConvenios.totalLiberado)}</p>
                  <span className="text-xs text-success font-medium">Recursos já transferidos</span>
                </div>
              </>
            )}

            {abaAtiva === "diarias" && metricasDiarias && (
              <>
                <div className="rounded-xl border border-border/80 bg-card p-4.5 text-center shadow-xs">
                  <p className="text-[11px] font-bold uppercase tracking-widest text-muted-foreground">QUANTIDADE DE DIÁRIAS</p>
                  <p className="font-display text-2xl lg:text-3xl font-extrabold my-1 tabular text-foreground">{metricasDiarias.totalDiarias} diárias</p>
                  <span className="text-xs text-muted-foreground">Concedidas a {metricasDiarias.servidoresAtendidos} servidores</span>
                </div>
                <div className="rounded-xl border border-primary/25 bg-gradient-to-br from-accent/30 via-card to-card p-4.5 text-center shadow-xs">
                  <p className="text-[11px] font-bold uppercase tracking-widest text-primary">TOTAL PAGO EM DIÁRIAS</p>
                  <p className="font-display text-2xl lg:text-3xl font-extrabold my-1 tabular text-primary">{formatBRL(metricasDiarias.totalValor)}</p>
                  <span className="text-xs text-primary font-medium">Indenizações por viagens a serviço</span>
                </div>
                <div className="rounded-xl border border-success/25 bg-gradient-to-br from-success/5 via-card to-card p-4.5 text-center shadow-xs">
                  <p className="text-[11px] font-bold uppercase tracking-widest text-success">VALOR MÉDIO / DIÁRIA</p>
                  <p className="font-display text-2xl lg:text-3xl font-extrabold my-1 tabular text-success">
                    {formatBRL(metricasDiarias.totalDiarias ? metricasDiarias.totalValor / metricasDiarias.totalDiarias : 0)}
                  </p>
                  <span className="text-xs text-success font-medium">Conforme decreto estadual de diárias</span>
                </div>
              </>
            )}

            {abaAtiva === "licitacoes" && (
              <>
                <div className="rounded-xl border border-border/80 bg-card p-4.5 text-center shadow-xs">
                  <p className="text-[11px] font-bold uppercase tracking-widest text-muted-foreground">LICITAÇÕES NO ANO</p>
                  <p className="font-display text-2xl lg:text-3xl font-extrabold my-1 tabular text-foreground">{formatNumber(totalItens)}</p>
                  <span className="text-xs text-muted-foreground">Processos instaurados</span>
                </div>
                <div className="rounded-xl border border-primary/25 bg-gradient-to-br from-accent/30 via-card to-card p-4.5 text-center shadow-xs">
                  <p className="text-[11px] font-bold uppercase tracking-widest text-primary">VALOR HOMOLOGADO</p>
                  <p className="font-display text-2xl lg:text-3xl font-extrabold my-1 tabular text-primary">
                    {formatBRL(dadosFiltrados.reduce((s, i: any) => s + (i.valorHomologado || 0), 0))}
                  </p>
                  <span className="text-xs text-primary font-medium">Propostas vencedoras</span>
                </div>
                <div className="rounded-xl border border-success/25 bg-gradient-to-br from-success/5 via-card to-card p-4.5 text-center shadow-xs">
                  <p className="text-[11px] font-bold uppercase tracking-widest text-success">ECONOMIA GERADA</p>
                  <p className="font-display text-2xl lg:text-3xl font-extrabold my-1 tabular text-success">
                    {formatBRL(Math.max(0, dadosFiltrados.reduce((s, i: any) => s + ((i.valorEstimado || 0) - (i.valorHomologado || 0)), 0)))}
                  </p>
                  <span className="text-xs text-success font-medium">Desconto obtido nas disputas</span>
                </div>
              </>
            )}

            {abaAtiva === "adiantamentos" && (
              <>
                <div className="rounded-xl border border-border/80 bg-card p-4.5 text-center shadow-xs">
                  <p className="text-[11px] font-bold uppercase tracking-widest text-muted-foreground">TOTAL CONCEDIDO</p>
                  <p className="font-display text-2xl lg:text-3xl font-extrabold my-1 tabular text-foreground">
                    {formatBRL(dadosFiltrados.reduce((s, i: any) => s + (i.concedido || 0), 0))}
                  </p>
                  <span className="text-xs text-muted-foreground">Suprimentos de fundos</span>
                </div>
                <div className="rounded-xl border border-primary/25 bg-gradient-to-br from-accent/30 via-card to-card p-4.5 text-center shadow-xs">
                  <p className="text-[11px] font-bold uppercase tracking-widest text-primary">PRESTAÇÕES APROVADAS</p>
                  <p className="font-display text-2xl lg:text-3xl font-extrabold my-1 tabular text-primary">
                    {formatBRL(dadosFiltrados.reduce((s, i: any) => s + (i.prestado || 0), 0))}
                  </p>
                  <span className="text-xs text-primary font-medium">Contas já auditadas e aprovadas</span>
                </div>
                <div className="rounded-xl border border-success/25 bg-gradient-to-br from-success/5 via-card to-card p-4.5 text-center shadow-xs">
                  <p className="text-[11px] font-bold uppercase tracking-widest text-success">SALDO A COMPROVAR</p>
                  <p className="font-display text-2xl lg:text-3xl font-extrabold my-1 tabular text-success">
                    {formatBRL(dadosFiltrados.reduce((s, i: any) => s + (i.saldo || 0), 0))}
                  </p>
                  <span className="text-xs text-success font-medium">Dentro do prazo legal</span>
                </div>
              </>
            )}

            {abaAtiva === "ordem-cronologica" && (
              <>
                <div className="rounded-xl border border-border/80 bg-card p-4.5 text-center shadow-xs">
                  <p className="text-[11px] font-bold uppercase tracking-widest text-muted-foreground">PROCESSOS NA FILA</p>
                  <p className="font-display text-2xl lg:text-3xl font-extrabold my-1 tabular text-foreground">{formatNumber(totalItens)}</p>
                  <span className="text-xs text-muted-foreground">Liquidações aguardando pagamento</span>
                </div>
                <div className="rounded-xl border border-primary/25 bg-gradient-to-br from-accent/30 via-card to-card p-4.5 text-center shadow-xs">
                  <p className="text-[11px] font-bold uppercase tracking-widest text-primary">VALOR DA FILA</p>
                  <p className="font-display text-2xl lg:text-3xl font-extrabold my-1 tabular text-primary">
                    {formatBRL(dadosFiltrados.reduce((s, i: any) => s + (i.valor || 0), 0))}
                  </p>
                  <span className="text-xs text-primary font-medium">Total em ordem de pagamento</span>
                </div>
                <div className="rounded-xl border border-success/25 bg-gradient-to-br from-success/5 via-card to-card p-4.5 text-center shadow-xs">
                  <p className="text-[11px] font-bold uppercase tracking-widest text-success">TEMPO MÉDIO</p>
                  <p className="font-display text-2xl lg:text-3xl font-extrabold my-1 tabular text-success">18 dias</p>
                  <span className="text-xs text-success font-medium">Prazo médio de desembolso</span>
                </div>
              </>
            )}

            {abaAtiva === "obras" && metricasObras && (
              <>
                <div className="rounded-xl border border-border/80 bg-card p-4.5 text-center shadow-xs">
                  <p className="text-[11px] font-bold uppercase tracking-widest text-muted-foreground">OBRAS LOCALIZADAS</p>
                  <p className="font-display text-2xl lg:text-3xl font-extrabold my-1 tabular text-foreground">{metricasObras.total} obras</p>
                  <span className="text-xs text-muted-foreground">Nos municípios selecionados</span>
                </div>
                <div className="rounded-xl border border-primary/25 bg-gradient-to-br from-accent/30 via-card to-card p-4.5 text-center shadow-xs">
                  <p className="text-[11px] font-bold uppercase tracking-widest text-primary">TOTAL INVESTIDO</p>
                  <p className="font-display text-2xl lg:text-3xl font-extrabold my-1 tabular text-primary">{formatBRL(metricasObras.totalInvestido)}</p>
                  <span className="text-xs text-primary font-medium">Volume de investimentos em infraestrutura</span>
                </div>
                <div className="rounded-xl border border-success/25 bg-gradient-to-br from-success/5 via-card to-card p-4.5 text-center shadow-xs">
                  <p className="text-[11px] font-bold uppercase tracking-widest text-success">MÉDIA DE EXECUÇÃO</p>
                  <p className="font-display text-2xl lg:text-3xl font-extrabold my-1 tabular text-success">{metricasObras.mediaConclusao}%</p>
                  <span className="text-xs text-success font-medium">Avanço físico ponderado das obras</span>
                </div>
              </>
            )}

            {abaAtiva === "pessoal" && metricasPessoal && (
              <>
                <div className="rounded-xl border border-border/80 bg-card p-4.5 text-center shadow-xs">
                  <p className="text-[11px] font-bold uppercase tracking-widest text-muted-foreground">SERVIDORES LISTADOS</p>
                  <p className="font-display text-2xl lg:text-3xl font-extrabold my-1 tabular text-foreground">{metricasPessoal.total}</p>
                  <span className="text-xs text-muted-foreground">No órgão e mês selecionados</span>
                </div>
                <div className="rounded-xl border border-primary/25 bg-gradient-to-br from-accent/30 via-card to-card p-4.5 text-center shadow-xs">
                  <p className="text-[11px] font-bold uppercase tracking-widest text-primary">MÉDIA SALARIAL BRUTA</p>
                  <p className="font-display text-2xl lg:text-3xl font-extrabold my-1 tabular text-primary">{formatBRL(metricasPessoal.mediaSalarial)}</p>
                  <span className="text-xs text-primary font-medium">Média dos servidores filtrados</span>
                </div>
                <div className="rounded-xl border border-success/25 bg-gradient-to-br from-success/5 via-card to-card p-4.5 text-center shadow-xs">
                  <p className="text-[11px] font-bold uppercase tracking-widest text-success">FOLHA LÍQUIDA AMOSTRAL</p>
                  <p className="font-display text-2xl lg:text-3xl font-extrabold my-1 tabular text-success">{formatBRL(metricasPessoal.totalLiquido)}</p>
                  <span className="text-xs text-success font-medium">Total líquido depositado no mês</span>
                </div>
              </>
            )}

            {abaAtiva === "remuneracao" && (
              <>
                <div className="rounded-xl border border-border/80 bg-card p-4.5 text-center shadow-xs">
                  <p className="text-[11px] font-bold uppercase tracking-widest text-muted-foreground">CARGOS ANALISADOS</p>
                  <p className="font-display text-2xl lg:text-3xl font-extrabold my-1 tabular text-foreground">{totalItens} categorias</p>
                  <span className="text-xs text-muted-foreground">No quadro funcional estadual</span>
                </div>
                <div className="rounded-xl border border-primary/25 bg-gradient-to-br from-accent/30 via-card to-card p-4.5 text-center shadow-xs">
                  <p className="text-[11px] font-bold uppercase tracking-widest text-primary">TETO CONSTITUCIONAL</p>
                  <p className="font-display text-2xl lg:text-3xl font-extrabold my-1 tabular text-primary">{formatBRL(44008.52)}</p>
                  <span className="text-xs text-primary font-medium">Subteto Poder Executivo MA</span>
                </div>
                <div className="rounded-xl border border-success/25 bg-gradient-to-br from-success/5 via-card to-card p-4.5 text-center shadow-xs">
                  <p className="text-[11px] font-bold uppercase tracking-widest text-success">SALÁRIO MÉDIO GERAL</p>
                  <p className="font-display text-2xl lg:text-3xl font-extrabold my-1 tabular text-success">{formatBRL(13240)}</p>
                  <span className="text-xs text-success font-medium">Média dos cargos exibidos</span>
                </div>
              </>
            )}

            {(abaAtiva === "emendas-estaduais" || abaAtiva === "emendas-parlamentares") && metricasEmendasEstaduais && (
              <>
                <div className="rounded-xl border border-border/80 bg-card p-4.5 text-center shadow-xs">
                  <p className="text-[11px] font-bold uppercase tracking-widest text-muted-foreground">TOTAL INDICADO (ALEMA)</p>
                  <p className="font-display text-2xl lg:text-3xl font-extrabold my-1 tabular text-foreground">{formatBRL(metricasEmendasEstaduais.totalIndicado)}</p>
                  <span className="text-xs text-muted-foreground">Emendas de deputados estaduais</span>
                </div>
                <div className="rounded-xl border border-primary/25 bg-gradient-to-br from-accent/30 via-card to-card p-4.5 text-center shadow-xs">
                  <p className="text-[11px] font-bold uppercase tracking-widest text-primary">VALOR PAGO / EXECUTADO</p>
                  <p className="font-display text-2xl lg:text-3xl font-extrabold my-1 tabular text-primary">{formatBRL(metricasEmendasEstaduais.totalPago)}</p>
                  <span className="text-xs text-primary font-medium">Recursos já liquidados aos municípios</span>
                </div>
                <div className="rounded-xl border border-success/25 bg-gradient-to-br from-success/5 via-card to-card p-4.5 text-center shadow-xs">
                  <p className="text-[11px] font-bold uppercase tracking-widest text-success">MUNICÍPIOS CONTEMPLADOS</p>
                  <p className="font-display text-2xl lg:text-3xl font-extrabold my-1 tabular text-success">{metricasEmendasEstaduais.municipios}</p>
                  <span className="text-xs text-success font-medium">Cidades beneficiadas na seleção</span>
                </div>
              </>
            )}

            {abaAtiva === "emendas-federais" && metricasEmendasFederais && (
              <>
                <div className="rounded-xl border border-border/80 bg-card p-4.5 text-center shadow-xs">
                  <p className="text-[11px] font-bold uppercase tracking-widest text-muted-foreground">RECURSOS FEDERAIS INDICADOS</p>
                  <p className="font-display text-2xl lg:text-3xl font-extrabold my-1 tabular text-foreground">{formatBRL(metricasEmendasFederais.totalEmpenhado)}</p>
                  <span className="text-xs text-muted-foreground">Bancada Federal MA no Congresso</span>
                </div>
                <div className="rounded-xl border border-primary/25 bg-gradient-to-br from-accent/30 via-card to-card p-4.5 text-center shadow-xs">
                  <p className="text-[11px] font-bold uppercase tracking-widest text-primary">REPASSES EFETIVADOS</p>
                  <p className="font-display text-2xl lg:text-3xl font-extrabold my-1 tabular text-primary">{formatBRL(metricasEmendasFederais.totalRepassado)}</p>
                  <span className="text-xs text-primary font-medium">Transferências da União ao Estado/Municípios</span>
                </div>
                <div className="rounded-xl border border-success/25 bg-gradient-to-br from-success/5 via-card to-card p-4.5 text-center shadow-xs">
                  <p className="text-[11px] font-bold uppercase tracking-widest text-success">MUNICÍPIOS BENEFICIADOS</p>
                  <p className="font-display text-2xl lg:text-3xl font-extrabold my-1 tabular text-success">{metricasEmendasFederais.municipios}</p>
                  <span className="text-xs text-success font-medium">Cidades contempladas</span>
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
                Total: <strong>{totalItens}</strong> registros encontrados
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
                    <th className="px-3.5 py-3 text-center whitespace-nowrap">Ano</th>
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
                      <td className="px-3.5 py-3.5 text-center font-mono text-muted-foreground">{item.ano}</td>
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
                    <th className="px-3.5 py-3 whitespace-nowrap">Mês / Ano</th>
                    <th className="px-3.5 py-3 min-w-[200px]">Secretaria / Unidade Gestora</th>
                    <th className="px-3.5 py-3 min-w-[210px]">Credor / Fornecedor</th>
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
                      <td className="px-3.5 py-3.5 whitespace-nowrap font-medium text-foreground">
                        <span className="inline-flex items-center gap-1 rounded bg-muted/60 px-2 py-0.5 text-[11px]">
                          {item.mes}/{item.ano}
                        </span>
                      </td>
                      <td className="px-3.5 py-3.5 font-semibold text-foreground">{item.unidade}</td>
                      <td className="px-3.5 py-3.5 text-foreground">{item.credor}</td>
                      <td className="px-3.5 py-3.5 text-muted-foreground whitespace-nowrap">{item.funcao}</td>
                      <td className="px-3.5 py-3.5 text-right tabular text-muted-foreground whitespace-nowrap">{formatBRL(item.empenhado)}</td>
                      <td className="px-3.5 py-3.5 text-right font-semibold text-primary tabular whitespace-nowrap">{formatBRL(item.liquidado)}</td>
                      <td className="px-3.5 py-3.5 text-right font-bold text-success tabular whitespace-nowrap">{formatBRL(item.pago)}</td>
                      <td className="px-3.5 py-3.5 text-center whitespace-nowrap">
                        <span className={cn("inline-flex rounded-full px-2.5 py-0.5 text-[11px] font-semibold ring-1", item.situacao === "Pago" ? "bg-success/10 text-success ring-success/30" : "bg-primary/10 text-primary ring-primary/30")}>
                          {item.situacao}
                        </span>
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
                    <th className="px-3.5 py-3 min-w-[210px]">Fornecedor / Contratada</th>
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
                        <p className="text-[10px] text-muted-foreground font-mono">{item.cnpj}</p>
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

            {/* 4. TABELA CONVÊNIOS E REPASSES (NOVA) */}
            {abaAtiva === "convenios" && (
              <table className="w-full text-left text-xs">
                <thead className="border-b border-border bg-muted/60 font-semibold text-muted-foreground">
                  <tr>
                    <th className="px-3.5 py-3 whitespace-nowrap">Nº Convênio</th>
                    <th className="px-3.5 py-3 whitespace-nowrap">Município Beneficiado</th>
                    <th className="px-3.5 py-3 whitespace-nowrap">Órgão Concedente</th>
                    <th className="px-3.5 py-3 min-w-[260px]">Objeto do Convênio / Transferência</th>
                    <th className="px-3.5 py-3 text-right whitespace-nowrap">Valor Total</th>
                    <th className="px-3.5 py-3 text-right whitespace-nowrap text-success font-semibold">Valor Liberado</th>
                    <th className="px-3.5 py-3 text-right whitespace-nowrap">Contrapartida</th>
                    <th className="px-3.5 py-3 whitespace-nowrap">Vigência</th>
                    <th className="px-3.5 py-3 text-center whitespace-nowrap">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {dadosPaginados.map((item: any) => (
                    <tr key={item.id} className="hover:bg-accent/30 transition-colors">
                      <td className="px-3.5 py-3.5 font-mono font-bold text-foreground whitespace-nowrap">{item.numeroConvenio}</td>
                      <td className="px-3.5 py-3.5 whitespace-nowrap">
                        <span className="inline-flex items-center gap-1 font-bold text-foreground">
                          {item.municipio}
                        </span>
                      </td>
                      <td className="px-3.5 py-3.5 font-medium text-foreground">{item.orgaoConcedente}</td>
                      <td className="px-3.5 py-3.5 text-muted-foreground line-clamp-2">{item.objeto}</td>
                      <td className="px-3.5 py-3.5 text-right font-medium tabular text-foreground whitespace-nowrap">{formatBRL(item.valorTotal)}</td>
                      <td className="px-3.5 py-3.5 text-right font-bold text-success tabular whitespace-nowrap">{formatBRL(item.valorLiberado)}</td>
                      <td className="px-3.5 py-3.5 text-right text-muted-foreground tabular whitespace-nowrap">{formatBRL(item.contrapartida)}</td>
                      <td className="px-3.5 py-3.5 tabular text-muted-foreground whitespace-nowrap">{item.vigencia}</td>
                      <td className="px-3.5 py-3.5 text-center whitespace-nowrap">
                        <span className={cn("inline-flex rounded-full px-2.5 py-0.5 text-[11px] font-semibold ring-1", item.status === "Concluído" ? "bg-success/10 text-success ring-success/30" : "bg-primary/10 text-primary ring-primary/30")}>
                          {item.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}

            {/* 5. TABELA DIÁRIAS E VIAGENS (NOVA) */}
            {abaAtiva === "diarias" && (
              <table className="w-full text-left text-xs">
                <thead className="border-b border-border bg-muted/60 font-semibold text-muted-foreground">
                  <tr>
                    <th className="px-3.5 py-3 whitespace-nowrap">Nº PCD / Portaria</th>
                    <th className="px-3.5 py-3 min-w-[200px]">Servidor Beneficiário</th>
                    <th className="px-3.5 py-3 min-w-[160px]">Cargo</th>
                    <th className="px-3.5 py-3 whitespace-nowrap">Secretaria / Órgão</th>
                    <th className="px-3.5 py-3 whitespace-nowrap">Mês / Ano</th>
                    <th className="px-3.5 py-3 whitespace-nowrap">Destino da Viagem</th>
                    <th className="px-3.5 py-3 min-w-[240px]">Justificativa / Motivo</th>
                    <th className="px-3.5 py-3 text-center whitespace-nowrap">Qtd. Diárias</th>
                    <th className="px-3.5 py-3 text-right whitespace-nowrap text-success font-semibold">Valor Total</th>
                    <th className="px-3.5 py-3 text-center whitespace-nowrap">Situação</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {dadosPaginados.map((item: any) => (
                    <tr key={item.id} className="hover:bg-accent/30 transition-colors">
                      <td className="px-3.5 py-3.5 font-mono text-muted-foreground whitespace-nowrap">{item.pcd}</td>
                      <td className="px-3.5 py-3.5 font-bold text-foreground">{item.servidor}</td>
                      <td className="px-3.5 py-3.5 text-foreground">{item.cargo}</td>
                      <td className="px-3.5 py-3.5 font-medium text-foreground">{item.orgao}</td>
                      <td className="px-3.5 py-3.5 whitespace-nowrap text-muted-foreground">{item.mes}/{item.ano}</td>
                      <td className="px-3.5 py-3.5 whitespace-nowrap font-medium text-foreground">{item.destino}</td>
                      <td className="px-3.5 py-3.5 text-muted-foreground line-clamp-2">{item.motivo}</td>
                      <td className="px-3.5 py-3.5 text-center font-bold text-foreground tabular">{item.qtdDiarias}</td>
                      <td className="px-3.5 py-3.5 text-right font-bold text-success tabular whitespace-nowrap">{formatBRL(item.valorTotal)}</td>
                      <td className="px-3.5 py-3.5 text-center whitespace-nowrap">
                        <span className="inline-flex rounded-full bg-success/10 text-success ring-1 ring-success/30 px-2.5 py-0.5 text-[11px] font-semibold">{item.situacao}</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}

            {/* 6. TABELA LICITAÇÕES */}
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

            {/* 7. TABELA ADIANTAMENTOS */}
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

            {/* 8. TABELA ORDEM CRONOLÓGICA */}
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

            {/* 9. TABELA OBRAS */}
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
                      <td className="px-3.5 py-3.5 font-bold text-foreground whitespace-nowrap">{item.municipio}</td>
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

            {/* 10. TABELA PESSOAL */}
            {abaAtiva === "pessoal" && (
              <table className="w-full text-left text-xs">
                <thead className="border-b border-border bg-muted/60 font-semibold text-muted-foreground">
                  <tr>
                    <th className="px-3.5 py-3 whitespace-nowrap">Matrícula</th>
                    <th className="px-3.5 py-3 min-w-[200px]">Servidor</th>
                    <th className="px-3.5 py-3 min-w-[180px]">Cargo / Função</th>
                    <th className="px-3.5 py-3 min-w-[180px]">Órgão de Lotação</th>
                    <th className="px-3.5 py-3 whitespace-nowrap">Mês / Ano</th>
                    <th className="px-3.5 py-3 whitespace-nowrap">Vínculo</th>
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
                        <p className="text-[10px] text-muted-foreground font-mono">{item.cpf}</p>
                      </td>
                      <td className="px-3.5 py-3.5 font-medium text-foreground">{item.cargo}</td>
                      <td className="px-3.5 py-3.5 text-muted-foreground">{item.orgao}</td>
                      <td className="px-3.5 py-3.5 whitespace-nowrap text-muted-foreground">{item.mes}/{item.ano}</td>
                      <td className="px-3.5 py-3.5">
                        <span className="inline-flex rounded-full bg-primary/10 px-2.5 py-0.5 text-[11px] font-medium text-primary">{item.vinculo}</span>
                      </td>
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

            {/* 11. TABELA REMUNERAÇÃO */}
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

            {/* 12. TABELA EMENDAS ESTADUAIS */}
            {(abaAtiva === "emendas-estaduais" || abaAtiva === "emendas-parlamentares") && (
              <table className="w-full text-left text-xs">
                <thead className="border-b border-border bg-muted/60 font-semibold text-muted-foreground">
                  <tr>
                    <th className="px-3.5 py-3 whitespace-nowrap">Nº Emenda</th>
                    <th className="px-3.5 py-3 min-w-[180px]">Deputado(a) Autor</th>
                    <th className="px-3.5 py-3 whitespace-nowrap">Município Destinatário</th>
                    <th className="px-3.5 py-3 whitespace-nowrap">Órgão Executor</th>
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
                      <td className="px-3.5 py-3.5 font-bold text-foreground whitespace-nowrap">{item.municipio}</td>
                      <td className="px-3.5 py-3.5 font-medium text-foreground whitespace-nowrap">{item.orgaoExecutor}</td>
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

            {/* 13. TABELA EMENDAS FEDERAIS */}
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
                      <td className="px-3.5 py-3.5 font-bold text-foreground whitespace-nowrap">{item.municipio}</td>
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
