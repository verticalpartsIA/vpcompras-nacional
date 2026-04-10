// packages/database/types.ts
// Supabase Database Types (Mocked from Schema 001)

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  vpcn_config: {
    Tables: {
      centros_custo: {
        Row: {
          id: string
          codigo: string
          nome: string
          is_active: boolean
          created_at: string
        }
        Insert: {
          id?: string
          codigo: string
          nome: string
          is_active?: boolean
          created_at?: string
        }
        Update: {
          id?: string
          codigo?: string
          nome?: string
          is_active?: boolean
          created_at?: string
        }
      }
      approver_rules: {
        Row: {
          id: string
          centro_custo_id: string
          nivel: number
          alcada_min: number
          alcada_max: number | null
          user_ids: string[]
          created_at: string
        }
      }
    }
  }
  vpcn_produtos: {
    Tables: {
      solicitacoes: {
        Row: {
          id: string
          codigo_sequencial: number
          solicitante_id: string
          centro_custo_id: string
          projeto_id: string | null
          status: string
          valor_total_estimado: number
          urgencia: string
          data_necessaria_entrega: string | null
          observacoes_financeiras: string | null
          created_at: string
          updated_at: string
        }
      }
      itens_solicitacao: {
        Row: {
          id: string
          solicitacao_id: string
          nome_descricao: string
          quantidade: number
          unidade: string
          justificativa: string | null
          foto_exemplo: string | null
          link_referencia: string | null
          especificacoes_tecnicas: string | null
          status_item: string
          created_at: string
        }
      }
    }
  }
}
