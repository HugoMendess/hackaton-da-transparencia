/**
 * Cliente da API oficial do Portal da Transparência do MA.
 *
 * Endpoints disponíveis (https://www.transparencia.ma.gov.br/api-docs):
 *  - GET /api/consulta-unidades         (sem params)
 *  - GET /api/consulta-despesas         (ano, mes, codigo_ug)
 *  - GET /api/consulta-notas            (ano, codigo_ug)
 *
 * Estratégia de resiliência:
 *  - Timeout curto (12s) porque o portal pode ficar lento
 *  - Em caso de falha, dispara erro tipado para o caller decidir o fallback
 *  - O cache fica do lado do servidor (Supabase api_cache, Edge Function)
 */

const PORTAL_BASE_URL = "https://www.transparencia.ma.gov.br/api"
const TIMEOUT_MS = 12_000

export type Unidade = {
  codigo_unidade: string
  nome_amigavel: string
  sigla_proposta: string | null
}

export type DespesaItem = {
  codigo_ug: string
  ano: number
  mes: number
  funcao?: string
  subfuncao?: string
  programa?: string
  acao?: string
  natureza_despesa?: string
  fonte?: string
  empenhado?: number
  liquidado?: number
  pago?: number
  [k: string]: unknown
}

export class PortalApiError extends Error {
  status: number | null
  constructor(message: string, status: number | null = null) {
    super(message)
    this.name = "PortalApiError"
    this.status = status
  }
}

async function fetchJson<T>(url: string): Promise<T> {
  const controller = new AbortController()
  const timeout = setTimeout(() => controller.abort(), TIMEOUT_MS)

  try {
    const response = await fetch(url, {
      signal: controller.signal,
      headers: { Accept: "application/json" },
    })
    if (!response.ok) {
      throw new PortalApiError(
        `Portal retornou status ${response.status}`,
        response.status
      )
    }
    return (await response.json()) as T
  } catch (e) {
    if (e instanceof PortalApiError) throw e
    if (e instanceof DOMException && e.name === "AbortError") {
      throw new PortalApiError("Tempo limite excedido ao consultar o portal", null)
    }
    throw new PortalApiError(
      e instanceof Error ? e.message : "Falha de rede ao consultar o portal",
      null
    )
  } finally {
    clearTimeout(timeout)
  }
}

export const portalApi = {
  async unidades(): Promise<Unidade[]> {
    return fetchJson<Unidade[]>(`${PORTAL_BASE_URL}/consulta-unidades`)
  },

  async despesas(params: { ano: number; mes: number; codigoUg: string }): Promise<DespesaItem[]> {
    const url = new URL(`${PORTAL_BASE_URL}/consulta-despesas`)
    url.searchParams.set("ano", String(params.ano))
    url.searchParams.set("mes", String(params.mes).padStart(2, "0"))
    url.searchParams.set("codigo_ug", params.codigoUg)
    return fetchJson<DespesaItem[]>(url.toString())
  },

  async notas(params: { ano: number; codigoUg: string }): Promise<unknown[]> {
    const url = new URL(`${PORTAL_BASE_URL}/consulta-notas`)
    url.searchParams.set("ano", String(params.ano))
    url.searchParams.set("codigo_ug", params.codigoUg)
    return fetchJson<unknown[]>(url.toString())
  },
}
