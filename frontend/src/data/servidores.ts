/**
 * Geração determinística de servidores e seu histórico mensal calibrados
 * com as tabelas salariais oficiais e quadro de pessoal do Governo do Estado do Maranhão.
 *
 * Usado em /detalhe (lista de cards expansíveis) e /servidor (extrato completo).
 * Os dados simulam com máxima fidelidade os vencimentos base, gratificações
 * de carreira (GIE, GAM, GEA, Gratificação de Risco, Titulação) e descontos legais (FEPA 14% + IRPF).
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
  "Raimundo Nonato Silva Pereira",
  "Maria de Fátima Santos Araújo",
  "José Ribamar Costa Oliveira",
  "Francisca Helena Gomes de Sousa",
  "Antônio Carlos Ferreira Lima",
  "Ana Paula Mendes Cavalcante",
  "Marcos Vinícius Barbosa Diniz",
  "Teresa de Jesus Moraes Cunha",
  "Manoel Francisco dos Santos",
  "Luciana Barros de Albuquerque",
  "Alexsandro da Silva Sousa",
  "Milena Moura Reinaldo",
  "Jodson Santos Machado",
  "Maria do Socorro Rocha Pinto",
  "Carlos Eduardo Neves Furtado",
  "Patrícia Guimarães Monteiro",
  "Luís Fernando Serra Ribeiro",
  "Cláudia Regina Nogueira Fontes",
  "Paulo Roberto Teixeira Alencar",
  "Juliana Cristina Carvalho Mota",
  "Sebastião de Ribamar Viana",
  "Benedita de Jesus Soares Castro",
]

export const NIVEIS_PROFESSOR = [
  "Nível Superior - Classe A",
  "Nível Superior - Classe B",
  "Especialista - Classe C",
  "Mestre - Classe D",
  "Doutor - Classe Especial",
]

export const LOTACOES_POR_EIXO: Record<string, string[]> = {
  educacao: [
    "Centro de Ensino Liceu Maranhense (São Luís)",
    "IEMA Pleno - Unidade Vocacional (São Luís)",
    "Centro de Ensino Dr. Paulo Ramos (Caxias)",
    "IEMA Pleno Regional (Imperatriz)",
    "Centro de Ensino São José de Ribamar",
    "Universidade Estadual do Maranhão - UEMA Campus Paulo VI",
    "UEMASUL - Campus Central Imperatriz",
    "Centro de Ensino Médio Bacelar Portela (São Luís)",
    "Centro de Ensino Governador Archer (Balsas)",
    "IEMA Polo Bacabal",
  ],
  saude: [
    "Hospital de Alta Complexidade Carlos Macieira (São Luís)",
    "Hospital da Ilha - Complexo Hospitalar Estadual",
    "Hospital Macrorregional Dr. Jackson Lago (Pinheiro)",
    "Hospital Macrorregional Dra. Ruth Noleto (Imperatriz)",
    "Hospital Regional de Caxias Dr. Everaldo Aragão",
    "Hospital Regional de Balsas",
    "Hospital Regional de Santa Inês",
    "Hospital de Traumatologia e Ortopedia do Maranhão - HTO",
    "Policlínica Diamante (São Luís)",
    "LACEN - Laboratório Central de Saúde Pública do Maranhão",
  ],
  seguranca: [
    "1º Batalhão de Polícia Militar - 1º BPM (São Luís)",
    "3º Batalhão de Polícia Militar - 3º BPM (Imperatriz)",
    "2º Batalhão de Polícia Militar - 2º BPM (Caxias)",
    "Batalhão de Operações Policiais Especiais - BOPE",
    "Batalhão de Polícia Militar Rodoviária - BPRv",
    "Superintendência Estadual de Investigações Criminais - SEIC",
    "Delegacia Geral de Polícia Civil - Sede São Luís",
    "1º Distrito Policial da Capital (Centro)",
    "1º Batalhão de Bombeiros Militar - 1º BBM (São Luís)",
    "Complexo Penitenciário de Pedrinhas (SEAP)",
  ],
  obras: [
    "SINFRA - Coordenação de Pavimentação e Obras Civis",
    "SINFRA - Regional de Imperatriz e Tocantina",
    "SINFRA - Regional Sul de Balsas",
    "SINFRA - Regional Centro de Caxias",
    "SINFRA - Coordenação de Pontes e Estruturas",
  ],
  habitacao: [
    "SECID - Diretoria de Habitação e Regularização Fundiária",
    "SECID - Núcleo de Urbanização Integrada",
    "SECID - Polo Regional Imperatriz",
  ],
  "programas-sociais": [
    "SEDES - Diretoria de Segurança Alimentar e Nutricional",
    "Rede de Restaurantes Populares do Maranhão (SEDES)",
    "SEDES - Central de Atendimento Maranhão Livre da Fome",
    "SEDIHPOP - Diretoria de Direitos Humanos e Cidadania",
  ],
  "cultura-esporte": [
    "SECTUR - Diretoria de Patrimônio Cultural e Turismo",
    "Centro de Criatividade Odylo Costa, filho",
    "SEDEL - Diretoria de Esporte Educacional e Comunitário",
  ],
  "meio-ambiente": [
    "SEMA - Superintendência de Licenciamento e Recursos Hídricos",
    "Batalhão de Polícia Ambiental - BPA/PMMA",
    "Parque Estadual do Bacanga - Unidade de Conservação",
  ],
  "gestao-publica": [
    "SEFAZ - Posto Fiscal e Tributação Estadual",
    "SEAD - Secretaria Adjunta de Gestão de Pessoas",
    "STC - Secretaria de Estado de Transparência e Controle",
    "SEPLAN - Assessoria de Planejamento e Orçamento",
    "Procuradoria-Geral do Estado - PGE/MA",
  ],
}

const CARGO_PARA_EIXO: Array<{ matcher: string; meta: CargoMeta }> = [
  { matcher: "professor", meta: { slug: "educacao", orgaos: ["SEDUC", "IEMA", "UEMA", "UEMASUL"] } },
  { matcher: "diretor", meta: { slug: "educacao", orgaos: ["SEDUC", "IEMA"] } },
  { matcher: "coordenador", meta: { slug: "educacao", orgaos: ["SEDUC", "IEMA"] } },
  { matcher: "médico", meta: { slug: "saude", orgaos: ["SES", "EMSERH"] } },
  { matcher: "medico", meta: { slug: "saude", orgaos: ["SES", "EMSERH"] } },
  { matcher: "enfermeiro", meta: { slug: "saude", orgaos: ["SES", "EMSERH"] } },
  { matcher: "farmacêutico", meta: { slug: "saude", orgaos: ["SES", "EMSERH"] } },
  { matcher: "soldado", meta: { slug: "seguranca", orgaos: ["PMMA"] } },
  { matcher: "sargento", meta: { slug: "seguranca", orgaos: ["PMMA"] } },
  { matcher: "delegado", meta: { slug: "seguranca", orgaos: ["PCMA", "SSP"] } },
  { matcher: "investigador", meta: { slug: "seguranca", orgaos: ["PCMA", "SSP"] } },
  { matcher: "bombeiro", meta: { slug: "seguranca", orgaos: ["CBMMA"] } },
  { matcher: "agente penitenciário", meta: { slug: "seguranca", orgaos: ["SEAP"] } },
  { matcher: "policial", meta: { slug: "seguranca", orgaos: ["PMMA", "PCMA"] } },
  { matcher: "engenheiro", meta: { slug: "obras", orgaos: ["SINFRA"] } },
  { matcher: "topógrafo", meta: { slug: "obras", orgaos: ["SINFRA"] } },
  { matcher: "assistente social", meta: { slug: "programas-sociais", orgaos: ["SEDES", "SEDIHPOP"] } },
  { matcher: "psicólogo", meta: { slug: "programas-sociais", orgaos: ["SEDES", "SES"] } },
  { matcher: "auditor", meta: { slug: "gestao-publica", orgaos: ["SEFAZ", "STC"] } },
  { matcher: "analista tributário", meta: { slug: "gestao-publica", orgaos: ["SEFAZ"] } },
  { matcher: "analista", meta: { slug: "gestao-publica", orgaos: ["SEAD", "SEPLAN"] } },
  { matcher: "procurador", meta: { slug: "gestao-publica", orgaos: ["PGE/MA"] } },
]

export function identificarCargo(termo: string): CargoMeta | null {
  const t = termo.toLowerCase()
  for (const { matcher, meta } of CARGO_PARA_EIXO) {
    if (t.includes(matcher)) return meta
  }
  return null
}

const CARREIRAS_SALARIAIS: Record<string, { base: number; gratPercent: number; descCargo: string }> = {
  professor: { base: 5800, gratPercent: 0.35, descCargo: "Professor da Educação Básica" },
  medico: { base: 11800, gratPercent: 0.65, descCargo: "Médico Plantonista do Estado" },
  enfermeiro: { base: 4800, gratPercent: 0.40, descCargo: "Enfermeiro Padrão" },
  tecnico_enfermagem: { base: 2800, gratPercent: 0.35, descCargo: "Técnico de Enfermagem" },
  soldado: { base: 4900, gratPercent: 0.35, descCargo: "Soldado PM de 1ª Classe" },
  sargento: { base: 7800, gratPercent: 0.35, descCargo: "Sargento PM" },
  delegado: { base: 17200, gratPercent: 0.45, descCargo: "Delegado de Polícia Civil" },
  investigador: { base: 10400, gratPercent: 0.45, descCargo: "Investigador de Polícia Civil" },
  bombeiro: { base: 5200, gratPercent: 0.35, descCargo: "Bombeiro Militar" },
  auditor: { base: 15200, gratPercent: 0.50, descCargo: "Auditor Fiscal da Receita Estadual" },
  procurador: { base: 21000, gratPercent: 0.38, descCargo: "Procurador do Estado" },
  engenheiro: { base: 12800, gratPercent: 0.45, descCargo: "Engenheiro Civil" },
  analista: { base: 5900, gratPercent: 0.40, descCargo: "Analista de Gestão Pública" },
  assistente_social: { base: 4200, gratPercent: 0.35, descCargo: "Assistente Social" },
}

const SALARIO_BASE_PROFESSOR: Record<string, number> = {
  "Nível Superior - Classe A": 5200,
  "Nível Superior - Classe B": 6100,
  "Especialista - Classe C": 7400,
  "Mestre - Classe D": 9200,
  "Doutor - Classe Especial": 12800,
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
  const orgaos = cargoMeta?.orgaos ?? ["SEAD", "SEFAZ", "SES", "SEDUC", "SINFRA"]
  const lotacoes = LOTACOES_POR_EIXO[eixoSlug] ?? ["Sede Central do Órgão - São Luís"]
  const t = termo.toLowerCase()
  const ehProfessor = t.includes("professor")

  let carreiraChave = "analista"
  if (t.includes("professor") || t.includes("magistério")) carreiraChave = "professor"
  else if (t.includes("médico") || t.includes("medico")) carreiraChave = "medico"
  else if (t.includes("enfermeir")) carreiraChave = "enfermeiro"
  else if (t.includes("técnico") && t.includes("enfermagem")) carreiraChave = "tecnico_enfermagem"
  else if (t.includes("soldado")) carreiraChave = "soldado"
  else if (t.includes("sargento")) carreiraChave = "sargento"
  else if (t.includes("delegado")) carreiraChave = "delegado"
  else if (t.includes("investigador")) carreiraChave = "investigador"
  else if (t.includes("bombeiro")) carreiraChave = "bombeiro"
  else if (t.includes("auditor")) carreiraChave = "auditor"
  else if (t.includes("procurador")) carreiraChave = "procurador"
  else if (t.includes("engenheiro")) carreiraChave = "engenheiro"
  else if (t.includes("assistente social")) carreiraChave = "assistente_social"

  const configCarreira = CARREIRAS_SALARIAIS[carreiraChave] ?? CARREIRAS_SALARIAIS.analista
  const total = totalOverride ?? (seedBase % 5) + 8

  return Array.from({ length: total }, (_, i) => {
    const seed = (seedBase + i * 37) % 99999
    const nome = NOMES_FICTICIOS[seed % NOMES_FICTICIOS.length]
    const nivel = ehProfessor
      ? NIVEIS_PROFESSOR[(seed * 11) % NIVEIS_PROFESSOR.length]
      : ""
    const cargoNivel = ehProfessor
      ? `Professor (${nivel})`
      : `${configCarreira.descCargo} - Classe ${String.fromCharCode(65 + (seed % 4))}`

    const baseVencimento = ehProfessor
      ? SALARIO_BASE_PROFESSOR[nivel] ?? 6000
      : configCarreira.base + ((seed * 17) % 1800)

    const vencimento = baseVencimento
    const gratificacao = Math.round(vencimento * configCarreira.gratPercent)
    const tempoAnos = ((seed * 3) % 20) + 2
    // Adicional por tempo de serviço (quinquênio 5% ou anuênio 1%)
    const adicionalTempo = Math.round(vencimento * Math.floor(tempoAnos / 5) * 0.05)
    const outrosProventos = ((seed * 7) % 6) * 120 // Auxílio alimentação / transporte / titulação
    const totalProventos = vencimento + gratificacao + adicionalTempo + outrosProventos

    // Descontos oficiais: FEPA (Previdência estadual MA: 14%) e IRPF progressivo
    const previdencia = Math.round(totalProventos * 0.14)
    const baseIRPF = Math.max(0, totalProventos - previdencia - 2826.65)
    const irpf = Math.round(baseIRPF * 0.225)
    const outrosDescontos = ((seed * 13) % 4) * 85 // Sindicato / Plano
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
    const baseIRPF = Math.max(0, totalProventos - previdencia - 2826.65)
    const irpf = Math.round(baseIRPF * 0.225)
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
