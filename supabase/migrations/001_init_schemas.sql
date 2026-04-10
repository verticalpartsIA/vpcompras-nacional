-- 001_init_schemas.sql
-- Project: vpcompras-nacionais
-- Standard: SpaceX Engineering (Grok)
-- Methodology: SDD + AIOX + TDD + BDD

-- 1. Create Isolated Schemas
CREATE SCHEMA IF NOT EXISTS vpcn_config;
CREATE SCHEMA IF NOT EXISTS vpcn_produtos;
CREATE SCHEMA IF NOT EXISTS vpcn_audit;

-- 2. Audit System (Append-Only)
CREATE TABLE vpcn_audit.events (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    table_name TEXT NOT NULL,
    record_id UUID NOT NULL,
    action TEXT NOT NULL,
    old_data JSONB,
    new_data JSONB,
    user_id UUID,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 3. Configuration Tables (vpcn_config)
CREATE TABLE vpcn_config.centros_custo (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    codigo TEXT UNIQUE NOT NULL,
    nome TEXT NOT NULL,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE vpcn_config.user_centros_custo (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL,
    centro_custo_id UUID REFERENCES vpcn_config.centros_custo(id),
    is_primary BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT now(),
    UNIQUE(user_id, centro_custo_id)
);

CREATE TABLE vpcn_config.approver_rules (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    centro_custo_id UUID REFERENCES vpcn_config.centros_custo(id),
    nivel INTEGER NOT NULL CHECK (nivel IN (1, 2, 3)),
    alcada_min NUMERIC(15, 2) DEFAULT 0,
    alcada_max NUMERIC(15, 2),
    user_ids UUID[] DEFAULT '{}',
    created_at TIMESTAMPTZ DEFAULT now()
);

-- 4. Operational Tables (vpcn_produtos)
CREATE TABLE vpcn_produtos.solicitacoes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    codigo_sequencial SERIAL,
    solicitante_id UUID NOT NULL,
    centro_custo_id UUID NOT NULL REFERENCES vpcn_config.centros_custo(id), -- Mandatory Phase 4
    projeto_id TEXT,
    status TEXT NOT NULL DEFAULT 'PENDENTE',
    valor_total_estimado NUMERIC(15, 2) DEFAULT 0,
    urgencia TEXT DEFAULT 'MEDIA',
    data_necessaria_entrega DATE NOT NULL,
    
    -- Seção de Entrega (Fase 4)
    local_entrega TEXT NOT NULL, -- Matriz, Filial, Obra, Cliente
    endereco_entrega TEXT NOT NULL,
    contato_local TEXT NOT NULL, -- Nome/Telefone do recebedor
    
    -- Tracking (Fase 3)
    codigo_rastreio TEXT,
    data_prevista_entrega DATE,
    
    justificativa_geral TEXT,
    observacoes_financeiras TEXT,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE vpcn_produtos.itens_solicitacao (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    solicitacao_id UUID REFERENCES vpcn_produtos.solicitacoes(id) ON DELETE CASCADE,
    nome_descricao TEXT NOT NULL,
    quantidade NUMERIC(15, 3) NOT NULL,
    unidade TEXT NOT NULL DEFAULT 'UN',
    valor_unitario_estimado NUMERIC(15, 2) DEFAULT 0,
    justificativa TEXT NOT NULL,
    foto_exemplo TEXT, -- Storage URL
    link_referencia TEXT,
    especificacoes_tecnicas TEXT,
    status_item TEXT DEFAULT 'PENDENTE',
    created_at TIMESTAMPTZ DEFAULT now()
);

-- 5. Approval History (Fase 4 - Tracking Levels)
CREATE TABLE vpcn_produtos.aprovacoes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    solicitacao_id UUID REFERENCES vpcn_produtos.solicitacoes(id) ON DELETE CASCADE,
    nivel INTEGER NOT NULL,
    aprovador_id UUID NOT NULL,
    decisao TEXT NOT NULL, -- APROVADO, REPROVADO
    justificativa TEXT NOT NULL, -- Mandatory min 20 chars
    created_at TIMESTAMPTZ DEFAULT now()
);

-- 6. Trigger: Auto-calculate valor_total_estimado (@architect-spaceX)
CREATE OR REPLACE FUNCTION vpcn_produtos.fn_update_solicitacao_total()
RETURNS TRIGGER AS $$
BEGIN
    UPDATE vpcn_produtos.solicitacoes
    SET valor_total_estimado = (
        SELECT COALESCE(SUM(quantidade * valor_unitario_estimado), 0)
        FROM vpcn_produtos.itens_solicitacao
        WHERE solicitacao_id = COALESCE(NEW.solicitacao_id, OLD.solicitacao_id)
    )
    WHERE id = COALESCE(NEW.solicitacao_id, OLD.solicitacao_id);
    RETURN NULL;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER tr_update_solicitacao_total
AFTER INSERT OR UPDATE OR DELETE ON vpcn_produtos.itens_solicitacao
FOR EACH ROW EXECUTE FUNCTION vpcn_produtos.fn_update_solicitacao_total();

-- 7. Audit & RLS
ALTER TABLE vpcn_produtos.solicitacoes ENABLE ROW LEVEL SECURITY;
ALTER TABLE vpcn_produtos.itens_solicitacao ENABLE ROW LEVEL SECURITY;
ALTER TABLE vpcn_produtos.aprovacoes ENABLE ROW LEVEL SECURITY;

-- 8. Storage Instructions
-- CLI: supabase storage buckets create vpcompras-anexos --public false
-- Logic: cc_{id}/{year}/{solicitacao_id}/item_{id}.jpg
