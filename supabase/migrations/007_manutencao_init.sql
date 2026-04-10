-- supabase/migrations/007_manutencao_init.sql
-- VerticalParts Intelligent Maintenance Module (Phase 5)
-- @supabase-expert @architect-spaceX

CREATE SCHEMA IF NOT EXISTS vpcn_manutencao;

-- 1. Asset Master Table (Equipments and Fleet)
CREATE TABLE IF NOT EXISTS vpcn_manutencao.equipamentos (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    nome TEXT NOT NULL,
    tipo TEXT NOT NULL, -- Maquinário, Ferramenta, Viatura, TI
    localizacao TEXT NOT NULL,
    marca TEXT,
    modelo TEXT NOT NULL,
    numero_serie TEXT UNIQUE NOT NULL,
    
    -- Finance & Lifecycle
    data_instalacao DATE NOT NULL,
    valor_aquisicao NUMERIC(15, 2) NOT NULL,
    vida_util_meses INTEGER NOT NULL,
    
    -- Fleet/Vehicle Specifics (Conditional)
    e_viatura BOOLEAN DEFAULT FALSE,
    placa TEXT UNIQUE,
    km_por_litro NUMERIC(5, 2),
    combustivel_tipo TEXT,
    
    status TEXT DEFAULT 'PENDENTE_APROVACAO' 
    CHECK (status IN ('PENDENTE_APROVACAO', 'ATIVO', 'EM_MANUTENCAO', 'BAIXADO')),
    
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- 2. Maintenance Contracts (SLA & Coverage)
CREATE TABLE IF NOT EXISTS vpcn_manutencao.contratos_manutencao (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    equipamento_id UUID NOT NULL REFERENCES vpcn_manutencao.equipamentos(id) ON DELETE CASCADE,
    fornecedor_id UUID NOT NULL, -- References vpcn_config.fornecedores
    
    numero_contrato TEXT NOT NULL,
    vigencia_inicio DATE NOT NULL,
    vigencia_fim DATE NOT NULL,
    
    cobertura TEXT DEFAULT 'PARCIAL' CHECK (cobertura IN ('TOTAL', 'PARCIAL', 'APENAS_PREVENTIVA')),
    valor_anual NUMERIC(15, 2) DEFAULT 0,
    clausulas_reajuste TEXT DEFAULT 'IGP-M',
    
    is_ativo BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- 3. Maintenance Schedules (Programação)
CREATE TABLE IF NOT EXISTS vpcn_manutencao.programacao_manutencao (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    equipamento_id UUID NOT NULL REFERENCES vpcn_manutencao.equipamentos(id) ON DELETE CASCADE,
    
    tipo_manutencao TEXT NOT NULL CHECK (tipo_manutencao IN ('PREVENTIVA', 'CORRETIVA', 'PREDITIVA')),
    frequencia_dias INTEGER DEFAULT 180,
    data_proxima_programada DATE NOT NULL,
    valor_estimado_proposta NUMERIC(15, 2),
    
    created_at TIMESTAMPTZ DEFAULT now()
);

-- 4. Cascading Alert Settings
CREATE TABLE IF NOT EXISTS vpcn_manutencao.alertas_config (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    equipamento_id UUID NOT NULL REFERENCES vpcn_manutencao.equipamentos(id) ON DELETE CASCADE,
    
    dias_antecedencia INTEGER NOT NULL, -- 30, 7, 1
    destinatarios TEXT[] NOT NULL, -- List of roles or emails
    
    created_at TIMESTAMPTZ DEFAULT now()
);

-- RLS & Indexes
ALTER TABLE vpcn_manutencao.equipamentos ENABLE ROW LEVEL SECURITY;
CREATE INDEX idx_equipamentos_placa ON vpcn_manutencao.equipamentos(placa);
CREATE INDEX idx_equipamentos_serie ON vpcn_manutencao.equipamentos(numero_serie);
