import { useCallback, useRef, useState } from "react"

export type Fonte = { titulo: string; url: string }

export type RespostaIA = {
  resposta: string
  fontes: Fonte[]
  cached: boolean
  modo: "anthropic" | "cache" | "fallback"
  pergunta_normalizada: string
}

export type MensagemConversa =
  | { tipo: "pergunta"; texto: string; quando: Date }
  | { tipo: "resposta"; data: RespostaIA; quando: Date }
  | { tipo: "erro"; texto: string; quando: Date }

export type ContextoAjuda = {
  eixo?: string
  municipio?: string
  pagina?: string
}

const MAX_MENSAGENS = 50

function sanitizarFontes(fontes: Fonte[]): Fonte[] {
  return fontes.filter((f) => {
    if (!f.url || typeof f.url !== "string") return false
    if (f.url.startsWith("/")) return true
    if (f.url.startsWith("https://")) {
      try {
        const host = new URL(f.url).hostname.toLowerCase()
        return host === "ma.gov.br" || host.endsWith(".ma.gov.br") || host.endsWith(".gov.br")
      } catch {
        return false
      }
    }
    return false
  })
}

function capMensagens(arr: MensagemConversa[]): MensagemConversa[] {
  return arr.length > MAX_MENSAGENS ? arr.slice(-MAX_MENSAGENS) : arr
}

/**
 * Respostas inteligentes locais estruturadas por temas e palavras-chave.
 */
function gerarRespostaLocal(pergunta: string, ctx?: ContextoAjuda): RespostaIA {
  const p = pergunta.toLowerCase().trim()

  // 1. Saúde
  if (p.includes("saúde") || p.includes("saude") || p.includes("hospital") || p.includes("remedio") || p.includes("remédio") || ctx?.eixo === "saude") {
    return {
      resposta: `Em 2026, o Governo do Maranhão investiu R$ 3,9 bilhões em Saúde até o momento. O orçamento mantém 412 unidades de saúde em todo o estado, 18 hospitais macrorregionais sob gestão da EMSERH e programas de atenção especializada.

A maior parte dos recursos destina-se ao custeio de unidades e pessoal médico/hospitalar (R$ 1,68 bi), repasses fundo a fundo aos municípios e medicamentos de alta complexidade. Você pode consultar os gastos detalhados no eixo Saúde e na aba Despesas.`,
      fontes: sanitizarFontes([
        { titulo: "Eixo Saúde e Bem-Estar", url: "/eixo/saude" },
        { titulo: "Secretaria de Estado da Saúde (SES)", url: "https://www.saude.ma.gov.br/" },
      ]),
      cached: true,
      modo: "cache",
      pergunta_normalizada: pergunta,
    }
  }

  // 2. Educação
  if (p.includes("educação") || p.includes("educacao") || p.includes("escola") || p.includes("professor") || p.includes("iema") || ctx?.eixo === "educacao") {
    return {
      resposta: `A Educação Estadual conta com um orçamento anual de R$ 4,8 bilhões gerido pela SEDUC. Há mais de 287 obras escolares ativas, incluindo a ampliação da rede IEMA Pleno e reformas de centros de ensino em tempo integral.

A folha do magistério representa R$ 2,14 bilhões/ano para mais de 38 mil professores ativos. Programas como Transporte Escolar Regional e Merenda Escolar recebem mais de R$ 580 milhões anuais para garantir o suporte aos 217 municípios.`,
      fontes: sanitizarFontes([
        { titulo: "Eixo Educação e Futuro", url: "/eixo/educacao" },
        { titulo: "Secretaria de Estado da Educação (SEDUC)", url: "https://www.educacao.ma.gov.br/" },
      ]),
      cached: true,
      modo: "cache",
      pergunta_normalizada: pergunta,
    }
  }

  // 3. Folha de Servidores / Pessoal / Salários
  if (p.includes("folha") || p.includes("salario") || p.includes("salário") || p.includes("servidor") || p.includes("remunera") || ctx?.eixo === "pessoal") {
    return {
      resposta: `A folha mensal do Poder Executivo do Maranhão gira em torno de R$ 1,2 bilhão, englobando cerca de 138 mil servidores ativos, inativos e pensionistas.

Os maiores quadros funcionais concentram-se na Educação (SEDUC), Saúde (SES) e Segurança Pública (PMMA e Polícia Civil). Você pode consultar salários individuais, vencimentos por cargo e diárias na consulta específica do Eixo Pessoal e Gestão Pública.`,
      fontes: sanitizarFontes([
        { titulo: "Eixo Gestão Pública - Pessoal", url: "/eixo/gestao-publica" },
        { titulo: "Tabela de Remuneração dos Cargos", url: "/cargos" },
      ]),
      cached: true,
      modo: "cache",
      pergunta_normalizada: pergunta,
    }
  }

  // 4. Obras e Infraestrutura
  if (p.includes("obra") || p.includes("asfalto") || p.includes("ponte") || p.includes("rodovia") || p.includes("sinfra") || ctx?.eixo === "obras") {
    return {
      resposta: `O Maranhão conta com centenas de obras públicas ativas coordenadas pela SINFRA e secretarias setoriais, somando mais de R$ 1,8 bilhão em investimentos em pavimentação, duplicação de rodovias (como MA-203 e MA-020) e saneamento.

No Portal você pode filtrar obras por município, valor contratado, percentual de conclusão e construtora responsável através do Mapa Interativo e da Consulta Específica de Obras.`,
      fontes: sanitizarFontes([
        { titulo: "Eixo Obras e Infraestrutura", url: "/eixo/obras" },
        { titulo: "Mapa Interativo do Maranhão", url: "/mapa" },
      ]),
      cached: true,
      modo: "cache",
      pergunta_normalizada: pergunta,
    }
  }

  // 5. Programas Sociais / Maranhão Livre da Fome
  if (p.includes("fome") || p.includes("social") || p.includes("auxilio") || p.includes("auxílio") || p.includes("bolsa") || ctx?.eixo === "programas-sociais") {
    return {
      resposta: `O programa Maranhão Livre da Fome é a principal política de segurança alimentar do Estado, com orçamento de R$ 580 milhões anuais, beneficiando mais de 384 mil famílias em situação de vulnerabilidade e mantendo a rede de Restaurantes Populares.

O acesso e inscrições são coordenados pela Secretaria de Desenvolvimento Social (SEDES) e secretarias municipais de assistência social (CRAS).`,
      fontes: sanitizarFontes([
        { titulo: "Eixo Programas Sociais", url: "/eixo/programas-sociais" },
        { titulo: "Governo do Estado do Maranhão", url: "https://www.ma.gov.br/" },
      ]),
      cached: true,
      modo: "cache",
      pergunta_normalizada: pergunta,
    }
  }

  // 6. Segurança Pública
  if (p.includes("segurança") || p.includes("seguranca") || p.includes("policia") || p.includes("polícia") || p.includes("bombeiro") || ctx?.eixo === "seguranca") {
    return {
      resposta: `A Segurança Pública estadual conta com orçamento superior a R$ 2,5 bilhões, integrando a Polícia Militar (PMMA), Polícia Civil, Corpo de Bombeiros (CBMMA) e modernização do cerco eletrônico inteligente com câmeras OCR em rodovias e avenidas.`,
      fontes: sanitizarFontes([
        { titulo: "Eixo Segurança Pública", url: "/eixo/seguranca" },
        { titulo: "Secretaria de Segurança Pública (SSP)", url: "https://www.ssp.ma.gov.br/" },
      ]),
      cached: true,
      modo: "cache",
      pergunta_normalizada: pergunta,
    }
  }

  // 7. Convênios e Municípios
  if (p.includes("município") || p.includes("municipio") || p.includes("convenio") || p.includes("convênio") || p.includes("cidade") || p.includes("prefeitura")) {
    return {
      resposta: `O Governo do Estado mantém termos de colaboração e transferências voluntárias com municípios maranhenses para obras urbanas, saúde e agricultura familiar.

Você pode consultar repasses específicos por município navegando pelo Mapa do Maranhão ou acessando a aba "Convênios e Repasses" na Consulta Específica.`,
      fontes: sanitizarFontes([
        { titulo: "Mapa dos Municípios", url: "/mapa" },
        { titulo: "Convênios e Repasses", url: "/eixo/gestao-publica" },
      ]),
      cached: true,
      modo: "cache",
      pergunta_normalizada: pergunta,
    }
  }

  // Resposta padrão
  return {
    resposta: `No Portal da Transparência do Maranhão você encontra informações consolidadas sobre receitas, despesas públicas, contratos, quadro de servidores, obras e convênios municipais.

Para consultar dados específicos, navegue pelos 7 eixos temáticos na página inicial ou use a barra de busca rápida no topo da página.`,
    fontes: sanitizarFontes([
      { titulo: "Página Inicial do Portal", url: "/" },
      { titulo: "Eixo Gestão Pública", url: "/eixo/gestao-publica" },
      { titulo: "Portal Oficial do Maranhão", url: "https://www.ma.gov.br/" },
    ]),
    cached: true,
    modo: "cache",
    pergunta_normalizada: pergunta,
  }
}

export function useAjudaInteligente() {
  const [aberto, setAberto] = useState(false)
  const [contexto, setContexto] = useState<ContextoAjuda>({})
  const [mensagens, setMensagens] = useState<MensagemConversa[]>([])
  const [perguntando, setPerguntando] = useState(false)

  const perguntarRef = useRef<
    (pergunta: string, ctx?: ContextoAjuda) => Promise<void>
  >(async () => {})

  const abrir = useCallback(
    (ctx?: ContextoAjuda, perguntaInicial?: string) => {
      if (ctx) setContexto(ctx)
      setAberto(true)
      if (perguntaInicial?.trim()) {
        setTimeout(() => perguntarRef.current(perguntaInicial.trim(), ctx), 100)
      }
    },
    []
  )

  const fechar = useCallback(() => {
    setAberto(false)
  }, [])

  const limpar = useCallback(() => {
    setMensagens([])
  }, [])

  const perguntar = useCallback(
    async (pergunta: string, ctx?: ContextoAjuda) => {
      const limpo = pergunta.trim()
      if (!limpo || perguntando) return

      const ctxFinal = { ...contexto, ...(ctx ?? {}) }

      setMensagens((m) =>
        capMensagens([
          ...m,
          { tipo: "pergunta", texto: limpo, quando: new Date() },
        ])
      )
      setPerguntando(true)

      // Simulação rápida para UX fluida e natural
      setTimeout(() => {
        const respostaObj = gerarRespostaLocal(limpo, ctxFinal)
        setMensagens((m) =>
          capMensagens([
            ...m,
            {
              tipo: "resposta",
              data: respostaObj,
              quando: new Date(),
            },
          ])
        )
        setPerguntando(false)
      }, 350)
    },
    [contexto, perguntando]
  )

  perguntarRef.current = perguntar

  return {
    aberto,
    contexto,
    mensagens,
    perguntando,
    abrir,
    fechar,
    limpar,
    perguntar,
  }
}
