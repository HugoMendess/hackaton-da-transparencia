/**
 * Geração determinística de servidores fictícios e seu histórico mensal.
 *
 * Usado em /detalhe (lista de cards expansíveis) e /servidor (extrato completo).
 * Os nomes são fictícios e o CPF é sempre mascarado por LGPD; em produção
 * estes dados virão do SIAFEM via Edge Function autenticada.
 *
 * As funções são determinísticas (mesma chamada → mesmo resultado), o que
 * permite que /servidor reconstrua o mesmo servidor a partir de query params
 * sem precisar persistir estado entre páginas.
 */

export type Servidor = {
  nome: string
  cargoNivel: string
  orgao: string
  lotacao: string
  admissao: string
  vencimento: number
  gratificacao: number
  adicionalTempo: number
  outrosProventos: number
  previdencia: number
  irpf: number
  outrosDescontos: number
  totalProventos: number
  totalDescontos: number
  liquido: number
}

export type CargoMeta = { slug: string; orgaos: string[] }

export const NOMES_FICTICIOS = [
  "João Silva",
  "Maria Antônio",
  "Maria Gular",
  "José Pereira",
  "Ana Sousa",
  "Carlos Oliveira",
  "Fernanda Lima",
  "Marcos Souza",
  "Luiza Castro",
  "Paulo Mendes",
  "Beatriz Ferreira",
  "Roberto Almeida",
  "Patrícia Rocha",
  "Antônio Carlos",
  "Cláudia Nunes",
]

export const NIVEIS_PROFESSOR = [
  "Nível Médio",
  "Nível Superior",
  "Especialista",
  "Mestre",
  "Doutor",
]

export const LOTACOES_POR_EIXO: Record<string, string[]> = {
  educacao: [
    "Escola Estadual Liceu Maranhense",
    "UEMA, Campus São Luís",
    "Escola Estadual Bacelar Portela",
    "IEMA Centro de Tecnologias",
    "Escola Técnica Manuel Beckman",
    "Escola Estadual Agnes Erna Schroth",
  ],
  saude: [
    "Hospital Carlos Macieira",
    "HUUFMA",
    "Hospital da Mulher",
    "UPA Cohatrac",
    "Hospital Aldenora Bello",
    "Hospital Tarquínio Lopes Filho",
  ],
  seguranca: [
    "1º BPM, São Luís",
    "12º BPM, Imperatriz",
    "Companhia de Choque",
    "Delegacia Plantão Centro",
    "CBMMA, Sede São Luís",
    "Penitenciária de Pedrinhas",
  ],
  obras: ["SINFRA, Sede São Luís", "DER, Regional Sul", "DER, Regional Oeste"],
  habitacao: ["SECID, Sede", "COHAB, São Luís"],
  "programas-sociais": ["SEDIHPOP, Sede", "CRAS Cohatrac", "CREAS Centro"],
  "cultura-esporte": ["SECTUR, Sede", "Centro Cultural Vale"],
  "meio-ambiente": ["SEMA, Sede", "IEMA, Núcleo Pinheiro"],
  "gestao-publica": ["SEAD, Sede", "SEFAZ, Sede", "Casa Civil"],
}

const CARGO_PARA_EIXO: Array<{ matcher: string; meta: CargoMeta }> = [
  { matcher: "professor", meta: { slug: "educacao", orgaos: ["SEDUC", "IEMA", "UEMA", "FUNDEB"] } },
  { matcher: "diretor", meta: { slug: "educacao", orgaos: ["SEDUC", "IEMA"] } },
  { matcher: "coordenador", meta: { slug: "educacao", orgaos: ["SEDUC", "IEMA"] } },
  { matcher: "médico", meta: { slug: "saude", orgaos: ["SES", "EMSERH", "HUUFMA"] } },
  { matcher: "medico", meta: { slug: "saude", orgaos: ["SES", "EMSERH", "HUUFMA"] } },
  { matcher: "enfermeiro", meta: { slug: "saude", orgaos: ["SES", "EMSERH"] } },
  { matcher: "soldado", meta: { slug: "seguranca", orgaos: ["PMMA"] } },
  { matcher: "sargento", meta: { slug: "seguranca", orgaos: ["PMMA"] } },
  { matcher: "delegado", meta: { slug: "seguranca", orgaos: ["PCMA"] } },
  { matcher: "bombeiro", meta: { slug: "seguranca", orgaos: ["CBMMA"] } },
  { matcher: "agente penitenciário", meta: { slug: "seguranca", orgaos: ["SEAP"] } },
  { matcher: "engenheiro", meta: { slug: "obras", orgaos: ["SINFRA", "DER"] } },
  { matcher: "topógrafo", meta: { slug: "obras", orgaos: ["SINFRA"] } },
  { matcher: "assistente social", meta: { slug: "programas-sociais", orgaos: ["SEDIHPOP", "SEAS"] } },
  { matcher: "auditor", meta: { slug: "gestao-publica", orgaos: ["SEAD", "SEFAZ"] } },
  { matcher: "analista", meta: { slug: "gestao-publica", orgaos: ["SEAD", "SEFAZ"] } },
]

export function identificarCargo(termo: string): CargoMeta | null {
  const t = termo.toLowerCase()
  for (const { matcher, meta } of CARGO_PARA_EIXO) {
    if (t.includes(matcher)) return meta
  }
  return null
}

const SALARIO_BASE_PROFESSOR: Record<string, number> = {
  "Nível Médio": 3500,
  "Nível Superior": 5000,
  Especialista: 7000,
  Mestre: 9500,
  Doutor: 12000,
}

function capitalize(s: string): string {
  return s.replace(/\b\w/g, (c) => c.toUpperCase())
}

export function hashTermo(s: string): number {
  let h = 5381
  for (let i = 0; i < s.length; i++) {
    h = ((h << 5) + h + s.charCodeAt(i)) | 0
  }
  return Math.abs(h) % 99999
}

export function gerarServidores(
  termo: string,
  eixoSlug: string,
  seedBase: number,
  cargoMeta: CargoMeta | null,
  totalOverride?: number
): Servidor[] {
  const orgaos = cargoMeta?.orgaos ?? ["SEAD"]
  const lotacoes = LOTACOES_POR_EIXO[eixoSlug] ?? ["Sede do órgão"]
  const ehProfessor = termo.toLowerCase().includes("professor")
  const total = totalOverride ?? (seedBase % 5) + 8

  return Array.from({ length: total }, (_, i) => {
    const seed = (seedBase + i * 31) % 99999
    const nome = NOMES_FICTICIOS[seed % NOMES_FICTICIOS.length]
    const nivel = ehProfessor
      ? NIVEIS_PROFESSOR[(seed * 11) % NIVEIS_PROFESSOR.length]
      : ""
    const cargoNivel = ehProfessor ? `Professor (${nivel})` : capitalize(termo)

    const baseVencimento = ehProfessor
      ? SALARIO_BASE_PROFESSOR[nivel] ?? 5000
      : 4500 + ((seed * 7) % 8000)
    const vencimento = baseVencimento + ((seed * 13) % 800)
    const gratificacao = Math.round(vencimento * 0.10)
    const tempoAnos = ((seed * 3) % 22) + 2
    const adicionalTempo = Math.round(vencimento * tempoAnos * 0.01)
    const outrosProventos = (seed * 5) % 800
    const totalProventos = vencimento + gratificacao + adicionalTempo + outrosProventos
    const previdencia = Math.round(totalProventos * 0.14)
    const irpf = Math.round(Math.max(0, totalProventos - previdencia - 2400) * 0.15)
    const outrosDescontos = (seed * 17) % 400
    const totalDescontos = previdencia + irpf + outrosDescontos
    const liquido = totalProventos - totalDescontos

    const ano = 2026 - tempoAnos
    const mes = ((seed * 2) % 12) + 1
    const dia = ((seed * 4) % 28) + 1

    return {
      nome,
      cargoNivel,
      orgao: orgaos[(seed * 19) % orgaos.length],
      lotacao: lotacoes[(seed * 23) % lotacoes.length],
      admissao: `${String(dia).padStart(2, "0")}/${String(mes).padStart(2, "0")}/${ano}`,
      vencimento,
      gratificacao,
      adicionalTempo,
      outrosProventos,
      previdencia,
      irpf,
      outrosDescontos,
      totalProventos,
      totalDescontos,
      liquido,
    }
  })
}

// Histórico mensal de 2026 (Jan-Dez) com variações realistas:
// junho recebe terço de férias, dezembro recebe 13º (proventos ~85% maior).
export type MesHistorico = {
  mes: string
  mesIdx: number
  vencimento: number
  gratificacao: number
  adicionalTempo: number
  outrosProventos: number
  totalProventos: number
  previdencia: number
  irpf: number
  outrosDescontos: number
  totalDescontos: number
  liquido: number
}

const MESES = ["Jan", "Fev", "Mar", "Abr", "Mai", "Jun", "Jul", "Ago", "Set", "Out", "Nov", "Dez"]

export function gerarHistoricoMensal(servidor: Servidor): MesHistorico[] {
  return MESES.map((mes, i) => {
    // Multiplicadores: Junho 1,33 (terço de férias), Dezembro 1,85 (13º + ajuste anual).
    const multiplicador = i === 11 ? 1.85 : i === 5 ? 1.33 : 1.0
    const ehBonus = i === 5 || i === 11

    const vencimento = servidor.vencimento
    const gratificacao = servidor.gratificacao
    const adicionalTempo = servidor.adicionalTempo
    const outrosProventos = ehBonus
      ? Math.round(servidor.outrosProventos + servidor.vencimento * (multiplicador - 1))
      : servidor.outrosProventos

    const totalProventos = vencimento + gratificacao + adicionalTempo + outrosProventos
    const previdencia = Math.round(totalProventos * 0.14)
    const irpf = Math.round(Math.max(0, totalProventos - previdencia - 2400) * 0.15)
    const outrosDescontos = servidor.outrosDescontos
    const totalDescontos = previdencia + irpf + outrosDescontos
    const liquido = totalProventos - totalDescontos

    return {
      mes,
      mesIdx: i,
      vencimento,
      gratificacao,
      adicionalTempo,
      outrosProventos,
      totalProventos,
      previdencia,
      irpf,
      outrosDescontos,
      totalDescontos,
      liquido,
    }
  })
}
