-- supabase/migrations/008_frete_init.sql
-- Finalização Fase 6: Rastreio e Conferência
-- @supabase-expert @architect-spaceX

-- 5. Rastreio Detalhado (Refinado)
CREATE TABLE IF NOT EXISTS vpcn_frete.rastreio_frete (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    solicitacao_id UUID NOT NULL REFERENCES vpcn_frete.solicitacoes_frete(id) ON DELETE CASCADE,
    
    codigo_rastreio TEXT,
    status_atual TEXT DEFAULT 'COLETADO',
    data_prevista_entrega DATE,
    
    historico_eventos JSONB DEFAULT '[]', -- [{data: "...", evento: "Em trânsito", local: "Filial SP"}]
    
    ultima_atualizacao TIMESTAMPTZ DEFAULT now(),
    created_at TIMESTAMPTZ DEFAULT now()
);

-- 6. Conferência Digital de Recebimento (Consolidado)
CREATE TABLE IF NOT EXISTS vpcn_frete.conferencias_frete (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    solicitacao_id UUID NOT NULL REFERENCES vpcn_frete.solicitacoes_frete(id) ON DELETE CASCADE,
    almoxarife_id UUID NOT NULL,
    
    nf_numero TEXT NOT NULL,
    data_recebimento TIMESTAMPTZ DEFAULT now(),
    
    -- Auditoria
    integridade_embalagem_ok BOOLEAN DEFAULT TRUE,
    conferencia_quantitativa_ok BOOLEAN DEFAULT TRUE,
    tem_divergencia BOOLEAN DEFAULT FALSE,
    
    fotos_recebimento TEXT[], -- Mínimo 2 fotos (Carga + Canhoto)
    observacoes_tecnicas TEXT,
    
    created_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX idx_rastreio_solicitacao ON vpcn_frete.rastreio_frete(solicitacao_id);
