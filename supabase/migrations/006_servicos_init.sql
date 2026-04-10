-- supabase/migrations/006_servicos_init.sql
-- VerticalParts Services & Engineering Module (Phase 4)
-- @supabase-expert @architect-spaceX

CREATE SCHEMA IF NOT EXISTS vpcn_servicos;

-- 1. Main Service Request Header
CREATE TABLE IF NOT EXISTS vpcn_servicos.solicitacoes_servico (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    solicitante_id UUID NOT NULL,
    comprador_id UUID,
    prestador_id UUID, -- References vpcn_config.fornecedores
    
    tipo_servico TEXT NOT NULL,
    natureza TEXT DEFAULT 'AVULSO' CHECK (natureza IN ('AVULSO', 'RECORRENTE')),
    periodicidade TEXT,
    prazo_contrato_meses INTEGER,
    valor_recorrente_previsto NUMERIC(15, 2) DEFAULT 0,
    
    descricao_completa TEXT,
    
    -- Schedule
    data_inicio_prevista DATE,
    data_fim_prevista DATE,
    
    -- Location & Safety
    endereco_completo TEXT,
    acesso_detalhes TEXT,
    epis_exigidos TEXT[],
    
    -- Budget & Taxes
    valor_total_estimado NUMERIC(15, 2) DEFAULT 0,
    aliquota_iss NUMERIC(5, 2) DEFAULT 5,
    aliquota_inss NUMERIC(5, 2) DEFAULT 11,
    
    -- Approval & Lifecycle
    status TEXT DEFAULT 'RASCUNHO' 
    CHECK (status IN ('RASCUNHO', 'PENDENTE_TECNICO', 'PENDENTE_FINANCEIRO', 'PENDENTE_RH', 'VALIDANDO_ART', 'EM_EXECUCAO', 'MEDICAO_PARCIAL', 'CONCLUIDO', 'CANCELADO')),
    
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- 2. Fragmented Milestones (Medições)
CREATE TABLE IF NOT EXISTS vpcn_servicos.etapas_medicoes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    solicitacao_id UUID NOT NULL REFERENCES vpcn_servicos.solicitacoes_servico(id) ON DELETE CASCADE,
    
    ordem INTEGER DEFAULT 1,
    descricao_etapa TEXT NOT NULL,
    peso_percentual NUMERIC(5, 2), -- 0 to 100
    valor_associado NUMERIC(15, 2),
    data_prevista_inicio DATE,
    data_prevista_fim DATE,
    critérios_aceitacao TEXT,
    
    percentual_concluido NUMERIC(5, 2) DEFAULT 0,
    is_liquidado BOOLEAN DEFAULT FALSE,
    
    created_at TIMESTAMPTZ DEFAULT now()
);

-- 3. Technical Docs (ART / RRT)
CREATE TABLE IF NOT EXISTS vpcn_servicos.documentacao_tecnica (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    solicitacao_id UUID NOT NULL REFERENCES vpcn_servicos.solicitacoes_servico(id) ON DELETE CASCADE,
    
    numero_registro TEXT NOT NULL,
    engenheiro_responsavel TEXT,
    data_validade DATE,
    documento_url TEXT, -- PDF file
    
    created_at TIMESTAMPTZ DEFAULT now()
);

-- 4. Photos 'State Zero'
CREATE TABLE IF NOT EXISTS vpcn_servicos.fotos_local (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    solicitacao_id UUID NOT NULL REFERENCES vpcn_servicos.solicitacoes_servico(id) ON DELETE CASCADE,
    url_foto TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- 5. Field Inspections (Vistorias)
CREATE TABLE IF NOT EXISTS vpcn_servicos.vistorias_execucao (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    etapa_id UUID NOT NULL REFERENCES vpcn_servicos.etapas_medicoes(id) ON DELETE CASCADE,
    
    data_vistoria TIMESTAMPTZ DEFAULT now(),
    percentual_executado_real NUMERIC(5, 2),
    conformidade TEXT CHECK (conformidade IN ('CONFORME', 'DIVERGENTE', 'GLOSADO')),
    fotos_url TEXT[], -- Multiple URLs
    observacoes_tecnicas TEXT,
    
    vistoriador_id UUID NOT NULL,
    
    created_at TIMESTAMPTZ DEFAULT now()
);

-- 6. Recurring Contracts & Automation
CREATE TABLE IF NOT EXISTS vpcn_servicos.contratos_recorrentes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    solicitacao_id UUID NOT NULL REFERENCES vpcn_servicos.solicitacoes_servico(id) ON DELETE CASCADE,
    
    vigencia_inicio DATE,
    vigencia_fim DATE,
    valor_recorrente NUMERIC(15, 2),
    dia_vencimento INTEGER DEFAULT 10,
    
    created_at TIMESTAMPTZ DEFAULT now()
);
