/**
 * Estrutura inicial dos 7 eixos temáticos do TransparaMA.
 * Em produção, vem do Supabase. Por enquanto, fonte estática com
 * Gestão Pública em destaque (uso real do portal: 72% das visualizações
 * estão em Remuneração + Ficha Financeira, conforme DADOS_REAIS.md).
 */

export type Eixo = {
  slug: string
  nome: string
  descricaoCidada: string
  icone: string
  destaque: boolean
}

export const EIXOS: Eixo[] = [
  {
    slug: "gestao-publica",
    nome: "Gestão Pública",
    descricaoCidada: "Servidores, salários, fornecedores, contratos, licitações e diárias",
    icone: "Users",
    destaque: true,
  },
  {
    slug: "saude",
    nome: "Saúde e Bem-Estar",
    descricaoCidada: "Hospitais, medicamentos, programas de saúde e escalas",
    icone: "Heart",
    destaque: false,
  },
  {
    slug: "educacao",
    nome: "Educação e Futuro",
    descricaoCidada: "Vagas, gastos por escola, merenda, transporte e bolsas",
    icone: "GraduationCap",
    destaque: false,
  },
  {
    slug: "seguranca",
    nome: "Segurança Pública",
    descricaoCidada: "Polícia, bombeiros, defesa civil e viaturas",
    icone: "Shield",
    destaque: false,
  },
  {
    slug: "habitacao",
    nome: "Habitação e Cidade",
    descricaoCidada: "Programas habitacionais e regularização",
    icone: "Home",
    destaque: false,
  },
  {
    slug: "programas-sociais",
    nome: "Programas Sociais",
    descricaoCidada: "Maranhão Livre da Fome, auxílios e benefícios",
    icone: "HandHeart",
    destaque: false,
  },
  {
    slug: "obras",
    nome: "Obras e Infraestrutura",
    descricaoCidada: "Mapa de obras, status, fotos, valores e prazos",
    icone: "Hammer",
    destaque: false,
  },
  {
    slug: "cultura-esporte",
    nome: "Cultura, Esporte e Lazer",
    descricaoCidada: "Equipamentos culturais, eventos, esporte, juventude",
    icone: "Drama",
    destaque: false,
  },
  {
    slug: "meio-ambiente",
    nome: "Meio Ambiente",
    descricaoCidada: "SEMA, recursos hídricos, fiscalização, áreas protegidas",
    icone: "Leaf",
    destaque: false,
  },
]
