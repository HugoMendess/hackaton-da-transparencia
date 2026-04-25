/**
 * Tipos do banco Supabase.
 * Schema completo será gerado via `supabase gen types typescript` quando
 * as tabelas estiverem aplicadas. Por enquanto, estrutura mínima manual
 * que reflete o schema definido em ARQUITETURA.md (seção 3.5).
 */

export type Database = {
  public: {
    Tables: {
      eixos: {
        Row: {
          id: number
          slug: string
          nome: string
          descricao_cidada: string | null
          icone: string | null
          ordem: number
          destaque: boolean
        }
        Insert: {
          slug: string
          nome: string
          descricao_cidada?: string | null
          icone?: string | null
          ordem?: number
          destaque?: boolean
        }
        Update: Partial<Database["public"]["Tables"]["eixos"]["Insert"]>
      }
      glossario: {
        Row: {
          id: number
          termo: string
          termo_normalizado: string
          explicacao_cidada: string
          exemplo: string | null
        }
        Insert: {
          termo: string
          termo_normalizado: string
          explicacao_cidada: string
          exemplo?: string | null
        }
        Update: Partial<Database["public"]["Tables"]["glossario"]["Insert"]>
      }
      termos_buscados: {
        Row: {
          id: number
          termo: string
          termo_normalizado: string
          total_buscas: number
          ultima_busca: string
          bloqueado: boolean
          motivo_bloqueio: string | null
        }
        Insert: {
          termo: string
          termo_normalizado: string
          total_buscas?: number
          bloqueado?: boolean
          motivo_bloqueio?: string | null
        }
        Update: Partial<Database["public"]["Tables"]["termos_buscados"]["Insert"]>
      }
      conteudos_cidadaos: {
        Row: {
          id: number
          eixo_id: number | null
          topico: string
          texto: string
          fonte_oficial_url: string | null
        }
        Insert: {
          eixo_id?: number | null
          topico: string
          texto: string
          fonte_oficial_url?: string | null
        }
        Update: Partial<Database["public"]["Tables"]["conteudos_cidadaos"]["Insert"]>
      }
    }
    Views: Record<string, never>
    Functions: Record<string, never>
    Enums: Record<string, never>
  }
}
