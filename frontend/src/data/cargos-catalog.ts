/**
 * Catálogo de cargos do Estado, organizado por eixo da vida do cidadão.
 *
 * Usado na página /cargos para o cidadão explorar todos os cargos antes
 * de pesquisar. Cada cargo aponta para /detalhe?tipo=cargo&q=<cargo>&eixo=<slug>
 * onde o dashboard agregado e a lista de servidores aparecem.
 *
 * Os números são consolidados em escala plausível para o Estado do MA
 * (calibrados a partir do volume real do Portal: 320K usuários, 4M views/ano,
 * folha estadual de R$ 1,2 bi/mês). Em produção, vêm da API do Portal MA.
 */

export type CargoCatalog = {
  nome: string
  q: string
  eixoSlug: string
  eixoNome: string
  descricaoCidada: string
  totalFolhaMensalMi: number
  numServidores: number
  salarioMedio: number
  destaque?: boolean
}

export const CARGOS_CATALOG: CargoCatalog[] = [
  // ─── Educação ────────────────────────────────────────────────────
  {
    nome: "Professor",
    q: "Professor",
    eixoSlug: "educacao",
    eixoNome: "Educação e Futuro",
    descricaoCidada: "Educadores da rede estadual de ensino",
    totalFolhaMensalMi: 280,
    numServidores: 38420,
    salarioMedio: 7290,
    destaque: true,
  },
  {
    nome: "Diretor Escolar",
    q: "Diretor Escolar",
    eixoSlug: "educacao",
    eixoNome: "Educação e Futuro",
    descricaoCidada: "Direção de unidades de ensino",
    totalFolhaMensalMi: 18,
    numServidores: 1240,
    salarioMedio: 9650,
  },
  {
    nome: "Coordenador Pedagógico",
    q: "Coordenador Pedagógico",
    eixoSlug: "educacao",
    eixoNome: "Educação e Futuro",
    descricaoCidada: "Coordenação curricular nas escolas",
    totalFolhaMensalMi: 22,
    numServidores: 2180,
    salarioMedio: 8420,
  },
  {
    nome: "Bibliotecário",
    q: "Bibliotecário",
    eixoSlug: "educacao",
    eixoNome: "Educação e Futuro",
    descricaoCidada: "Gestão de bibliotecas escolares",
    totalFolhaMensalMi: 5,
    numServidores: 720,
    salarioMedio: 5980,
  },

  // ─── Saúde ───────────────────────────────────────────────────────
  {
    nome: "Médico",
    q: "Médico",
    eixoSlug: "saude",
    eixoNome: "Saúde e Bem-Estar",
    descricaoCidada: "Atendimento médico em hospitais e UPAs",
    totalFolhaMensalMi: 142,
    numServidores: 6840,
    salarioMedio: 18900,
    destaque: true,
  },
  {
    nome: "Enfermeiro",
    q: "Enfermeiro",
    eixoSlug: "saude",
    eixoNome: "Saúde e Bem-Estar",
    descricaoCidada: "Cuidados de enfermagem na rede pública",
    totalFolhaMensalMi: 68,
    numServidores: 8420,
    salarioMedio: 7320,
  },
  {
    nome: "Técnico de Enfermagem",
    q: "Técnico de Enfermagem",
    eixoSlug: "saude",
    eixoNome: "Saúde e Bem-Estar",
    descricaoCidada: "Apoio técnico em hospitais e postos",
    totalFolhaMensalMi: 52,
    numServidores: 12380,
    salarioMedio: 3850,
  },
  {
    nome: "Farmacêutico",
    q: "Farmacêutico",
    eixoSlug: "saude",
    eixoNome: "Saúde e Bem-Estar",
    descricaoCidada: "Farmácia hospitalar e dispensação",
    totalFolhaMensalMi: 14,
    numServidores: 1680,
    salarioMedio: 7820,
  },

  // ─── Segurança Pública ───────────────────────────────────────────
  {
    nome: "Soldado PM",
    q: "Soldado",
    eixoSlug: "seguranca",
    eixoNome: "Segurança Pública",
    descricaoCidada: "Policiamento ostensivo da PMMA",
    totalFolhaMensalMi: 95,
    numServidores: 12420,
    salarioMedio: 6580,
    destaque: true,
  },
  {
    nome: "Sargento PM",
    q: "Sargento",
    eixoSlug: "seguranca",
    eixoNome: "Segurança Pública",
    descricaoCidada: "Comando intermediário PMMA",
    totalFolhaMensalMi: 38,
    numServidores: 3120,
    salarioMedio: 10450,
  },
  {
    nome: "Delegado",
    q: "Delegado",
    eixoSlug: "seguranca",
    eixoNome: "Segurança Pública",
    descricaoCidada: "Investigação criminal da Polícia Civil",
    totalFolhaMensalMi: 18,
    numServidores: 720,
    salarioMedio: 24800,
  },
  {
    nome: "Bombeiro Militar",
    q: "Bombeiro",
    eixoSlug: "seguranca",
    eixoNome: "Segurança Pública",
    descricaoCidada: "Resgate e combate a incêndios",
    totalFolhaMensalMi: 28,
    numServidores: 3840,
    salarioMedio: 6920,
  },
  {
    nome: "Agente Penitenciário",
    q: "Agente Penitenciário",
    eixoSlug: "seguranca",
    eixoNome: "Segurança Pública",
    descricaoCidada: "Custódia no sistema prisional",
    totalFolhaMensalMi: 32,
    numServidores: 4920,
    salarioMedio: 5780,
  },

  // ─── Obras e Infraestrutura ──────────────────────────────────────
  {
    nome: "Engenheiro Civil",
    q: "Engenheiro Civil",
    eixoSlug: "obras",
    eixoNome: "Obras e Infraestrutura",
    descricaoCidada: "Projetos e fiscalização de obras públicas",
    totalFolhaMensalMi: 8,
    numServidores: 380,
    salarioMedio: 18900,
  },
  {
    nome: "Arquiteto",
    q: "Arquiteto",
    eixoSlug: "obras",
    eixoNome: "Obras e Infraestrutura",
    descricaoCidada: "Projetos arquitetônicos do Estado",
    totalFolhaMensalMi: 4,
    numServidores: 220,
    salarioMedio: 16200,
  },
  {
    nome: "Topógrafo",
    q: "Topógrafo",
    eixoSlug: "obras",
    eixoNome: "Obras e Infraestrutura",
    descricaoCidada: "Levantamento topográfico de obras",
    totalFolhaMensalMi: 2,
    numServidores: 280,
    salarioMedio: 5980,
  },
  {
    nome: "Técnico em Edificações",
    q: "Técnico em Edificações",
    eixoSlug: "obras",
    eixoNome: "Obras e Infraestrutura",
    descricaoCidada: "Apoio técnico em obras",
    totalFolhaMensalMi: 3,
    numServidores: 480,
    salarioMedio: 4920,
  },

  // ─── Programas Sociais ───────────────────────────────────────────
  {
    nome: "Assistente Social",
    q: "Assistente Social",
    eixoSlug: "programas-sociais",
    eixoNome: "Programas Sociais",
    descricaoCidada: "Atendimento em CRAS, CREAS e abrigos",
    totalFolhaMensalMi: 18,
    numServidores: 2840,
    salarioMedio: 5980,
  },
  {
    nome: "Psicólogo",
    q: "Psicólogo",
    eixoSlug: "programas-sociais",
    eixoNome: "Programas Sociais",
    descricaoCidada: "Atendimento psicossocial na rede pública",
    totalFolhaMensalMi: 9,
    numServidores: 1240,
    salarioMedio: 6920,
  },
  {
    nome: "Educador Social",
    q: "Educador Social",
    eixoSlug: "programas-sociais",
    eixoNome: "Programas Sociais",
    descricaoCidada: "Atendimento socioeducativo",
    totalFolhaMensalMi: 5,
    numServidores: 1180,
    salarioMedio: 3920,
  },

  // ─── Habitação ───────────────────────────────────────────────────
  {
    nome: "Engenheiro Habitacional",
    q: "Engenheiro Habitacional",
    eixoSlug: "habitacao",
    eixoNome: "Habitação",
    descricaoCidada: "Projetos de habitação social",
    totalFolhaMensalMi: 2,
    numServidores: 120,
    salarioMedio: 17200,
  },

  // ─── Cultura e Esporte ───────────────────────────────────────────
  {
    nome: "Produtor Cultural",
    q: "Produtor Cultural",
    eixoSlug: "cultura-esporte",
    eixoNome: "Cultura e Esporte",
    descricaoCidada: "Produção de eventos culturais do Estado",
    totalFolhaMensalMi: 2,
    numServidores: 240,
    salarioMedio: 5840,
  },
  {
    nome: "Técnico Esportivo",
    q: "Técnico Esportivo",
    eixoSlug: "cultura-esporte",
    eixoNome: "Cultura e Esporte",
    descricaoCidada: "Treinamento esportivo em escolinhas",
    totalFolhaMensalMi: 1,
    numServidores: 180,
    salarioMedio: 4920,
  },

  // ─── Meio Ambiente ───────────────────────────────────────────────
  {
    nome: "Analista Ambiental",
    q: "Analista Ambiental",
    eixoSlug: "meio-ambiente",
    eixoNome: "Meio Ambiente",
    descricaoCidada: "Análise técnica de licenciamento",
    totalFolhaMensalMi: 4,
    numServidores: 320,
    salarioMedio: 11200,
  },
  {
    nome: "Fiscal Ambiental",
    q: "Fiscal Ambiental",
    eixoSlug: "meio-ambiente",
    eixoNome: "Meio Ambiente",
    descricaoCidada: "Fiscalização ambiental no campo",
    totalFolhaMensalMi: 3,
    numServidores: 280,
    salarioMedio: 8920,
  },

  // ─── Gestão Pública ──────────────────────────────────────────────
  {
    nome: "Auditor de Estado",
    q: "Auditor",
    eixoSlug: "gestao-publica",
    eixoNome: "Gestão Pública",
    descricaoCidada: "Auditoria interna do Executivo",
    totalFolhaMensalMi: 12,
    numServidores: 380,
    salarioMedio: 28900,
  },
  {
    nome: "Analista Tributário",
    q: "Analista Tributário",
    eixoSlug: "gestao-publica",
    eixoNome: "Gestão Pública",
    descricaoCidada: "Análise e cobrança de tributos estaduais",
    totalFolhaMensalMi: 14,
    numServidores: 920,
    salarioMedio: 14200,
  },
  {
    nome: "Assessor",
    q: "Assessor",
    eixoSlug: "gestao-publica",
    eixoNome: "Gestão Pública",
    descricaoCidada: "Assessoria técnica das secretarias",
    totalFolhaMensalMi: 22,
    numServidores: 2480,
    salarioMedio: 8420,
  },
  {
    nome: "Procurador",
    q: "Procurador",
    eixoSlug: "gestao-publica",
    eixoNome: "Gestão Pública",
    descricaoCidada: "Defesa jurídica do Estado",
    totalFolhaMensalMi: 18,
    numServidores: 480,
    salarioMedio: 32400,
  },
]

// Lista única de eixos para o filtro da página /cargos.
export const EIXOS_DOS_CARGOS = Array.from(
  new Map(
    CARGOS_CATALOG.map((c) => [c.eixoSlug, { slug: c.eixoSlug, nome: c.eixoNome }])
  ).values()
)
