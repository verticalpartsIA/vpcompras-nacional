-- supabase/migrations/007_manutencao_init.sql
-- Step 2: Alertas Cascata e Registro de Execução
-- @supabase-expert @architect-spaceX

-- 3. Programação de Manutenções (Refinado)
CREATE TABLE IF NOT EXISTS vpcn_manutencao.programacao_manutencao (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    equipamento_id UUID NOT NULL REFERENCES vpcn_manutencao.equipamentos(id) ON DELETE CASCADE,
    
    tipo_manutencao TEXT NOT NULL CHECK (tipo_manutencao IN ('PREVENTIVA', 'CORRETIVA', 'PREDITIVA')),
    frequencia_dias INTEGER DEFAULT 180,
    data_proxima_programada DATE NOT NULL,
    valor_estimado NUMERIC(15, 2),
    
    status_programacao TEXT DEFAULT 'AGENDADO' CHECK (status_programacao IN ('AGENDADO', 'ALERTA_EMITIDO', 'EXECUTADO', 'ATRASADO')),
    created_at TIMESTAMPTZ DEFAULT now()
);

-- 5. Configuração de Alertas em Cascata (Refinado p/ Regra 30-7-1)
CREATE TABLE IF NOT EXISTS vpcn_manutencao.alertas_config (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    equipamento_id UUID NOT NULL REFERENCES vpcn_manutencao.equipamentos(id) ON DELETE CASCADE,
    
    alerta_30_dias_ok BOOLEAN DEFAULT FALSE, -- Engenharia
    alerta_7_dias_ok BOOLEAN DEFAULT FALSE,  -- Gestor
    alerta_1_dia_ok BOOLEAN DEFAULT FALSE,   -- CEO/Financeiro
    
    destinatarios_adicionais TEXT[],
    created_at TIMESTAMPTZ DEFAULT now()
);

-- 4. Registro de Manutenção Realizada (Refinado)
CREATE TABLE IF NOT EXISTS vpcn_manutencao.registros_manutencao (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    equipamento_id UUID NOT NULL REFERENCES vpcn_manutencao.equipamentos(id) ON DELETE CASCADE,
    programacao_id UUID REFERENCES vpcn_manutencao.programacao_manutencao(id),
    
    data_realizacao TIMESTAMPTZ NOT NULL DEFAULT now(),
    tipo_intervencao TEXT NOT NULL,
    descricao_detalhada TEXT,
    
    -- Automação de Produtos
    pecas_trocadas JSONB DEFAULT '[]', -- [{item: "Correia", qty: 2, trigger_solicitacao: true}]
    
    valor_total_pago NUMERIC(15, 2),
    nf_numero TEXT,
    laudo_url TEXT,
    fotos_urls TEXT[], -- Mínimo 2
    
    horas_mo NUMERIC(5, 2),
    created_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX idx_programacao_proxima ON vpcn_manutencao.programacao_manutencao(data_proxima_programada);
