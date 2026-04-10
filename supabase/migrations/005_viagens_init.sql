-- supabase/migrations/005_viagens_init.sql
-- VerticalParts Travel Management System (Phase 3)
-- @supabase-expert @architect-spaceX

CREATE SCHEMA IF NOT EXISTS vpcn_viagens;

-- 1. Main Travel Request
CREATE TABLE IF NOT EXISTS vpcn_viagens.solicitacoes_viagem (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    solicitante_id UUID NOT NULL, -- auth.users
    centro_custo_id UUID REFERENCES vpcn_config.centros_custos(id),
    projeto_id UUID, 
    
    -- Objective
    finalidade TEXT NOT NULL, -- Feira, Obra, Visita Cliente, etc.
    objetivo_detalhado TEXT,
    
    -- Planning Audit
    is_planned BOOLEAN DEFAULT TRUE,
    justificativa_urgencia TEXT, -- Obrigatório se is_planned = false
    
    -- Logistics Toggle
    is_internacional BOOLEAN DEFAULT FALSE,
    moeda_base TEXT DEFAULT 'BRL',
    cotacao_base NUMERIC(15, 4) DEFAULT 1.0,
    
    -- Budget Estimative
    valor_estimado_total NUMERIC(15, 2) DEFAULT 0,
    
    -- Lifecycle
    status TEXT DEFAULT 'RASCUNHO' 
    CHECK (status IN ('RASCUNHO', 'PENDENTE_NX', 'APROVADO', 'EM_RESERVA', 'EXECUTADO', 'PRESTACAO_CONTAS', 'CONCLUIDO')),
    
    data_saida_prevista TIMESTAMPTZ,
    data_retorno_prevista TIMESTAMPTZ,
    
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- 2. Travelers (Colaboradores e Acompanhantes)
CREATE TABLE IF NOT EXISTS vpcn_viagens.viajantes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    solicitacao_id UUID NOT NULL REFERENCES vpcn_viagens.solicitacoes_viagem(id) ON DELETE CASCADE,
    
    tipo_viajante TEXT DEFAULT 'COLABORADOR', -- COLABORADOR, ACOMPANHANTE
    nome TEXT NOT NULL,
    matricula TEXT,
    cargo TEXT,
    cpf TEXT,
    rg TEXT,
    telefone TEXT,
    email TEXT,
    
    -- International Data
    passaporte TEXT,
    visto_valido_ate DATE,
    vacina_covid BOOLEAN DEFAULT FALSE,
    
    created_at TIMESTAMPTZ DEFAULT now()
);

-- 3. Routing (Multi-leg tracking)
CREATE TABLE IF NOT EXISTS vpcn_viagens.roteiros_trechos (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    solicitacao_id UUID NOT NULL REFERENCES vpcn_viagens.solicitacoes_viagem(id) ON DELETE CASCADE,
    
    ordem INTEGER DEFAULT 1,
    origem TEXT NOT NULL,
    destino TEXT NOT NULL,
    modal TEXT DEFAULT 'AEREO', -- AEREO, CARRO, ONIBUS, TAXI
    data_hora_partida TIMESTAMPTZ,
    
    created_at TIMESTAMPTZ DEFAULT now()
);

-- 4. Vehicle Specific Expenses (Automated Calculation)
CREATE TABLE IF NOT EXISTS vpcn_viagens.despesas_veiculo (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    solicitacao_id UUID NOT NULL REFERENCES vpcn_viagens.solicitacoes_viagem(id) ON DELETE CASCADE,
    
    motorista TEXT,
    placa TEXT,
    km_por_litro NUMERIC(10, 2),
    valor_litro_combustivel NUMERIC(10, 2),
    distancia_total_km NUMERIC(15, 2),
    valor_pedagios NUMERIC(10, 2) DEFAULT 0,
    
    custo_total_calculado NUMERIC(15, 2),
    
    created_at TIMESTAMPTZ DEFAULT now()
);

-- 5. Post-Trip Accountability (Prestação de Contas)
CREATE TABLE IF NOT EXISTS vpcn_viagens.prestacao_contas (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    solicitacao_id UUID NOT NULL REFERENCES vpcn_viagens.solicitacoes_viagem(id) ON DELETE CASCADE,
    
    tipo_despesa TEXT, -- ALIMENTACAO, TRANSPORTE, HOSPEDAGEM, DIVERSOS
    valor_moeda_local NUMERIC(15, 2),
    moeda_local TEXT DEFAULT 'BRL',
    valor_convertido_brl NUMERIC(15, 2),
    data_despesa DATE,
    comprovante_url TEXT,
    
    justificativa_excesso TEXT, -- Se valor_convertido > valor_estimado
    
    created_at TIMESTAMPTZ DEFAULT now()
);

-- RLS
ALTER TABLE vpcn_viagens.solicitacoes_viagem ENABLE ROW LEVEL SECURITY;
-- Policies placeholders (same logic as Products)
CREATE POLICY "Enable all for authenticated" ON vpcn_viagens.solicitacoes_viagem FOR ALL TO authenticated USING (true);
