-- supabase/migrations/003_leilao_online.sql
-- Reconstruction of the Online Auction Infrastructure (Phase 10 - Final Master)
-- @supabase-expert @approval-engineer @qa-lead

-- 1. Suppliers and Participants (Audit Mapping)
CREATE TABLE IF NOT EXISTS vpcn_config.fornecedores (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    cnpj_cpf TEXT UNIQUE NOT NULL,
    razao_social TEXT NOT NULL,
    nome_fantasia TEXT,
    email_comercial TEXT NOT NULL,
    score_historico NUMERIC(3, 2) DEFAULT 5.00, -- 0.00 to 5.00
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS vpcn_produtos.leilao_participantes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    solicitacao_id UUID NOT NULL REFERENCES vpcn_produtos.solicitacoes(id) ON DELETE CASCADE,
    fornecedor_id UUID REFERENCES vpcn_config.fornecedores(id),
    status_cotacao TEXT NOT NULL DEFAULT 'PENDENTE' CHECK (status_cotacao IN ('PENDENTE', 'RESPONDIDO', 'RECUSADO')),
    data_convite TIMESTAMPTZ DEFAULT now()
);

-- 2. Master Quotation Table (All Mandatory Commercial Fields)
CREATE TABLE IF NOT EXISTS vpcn_produtos.cotacoes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    solicitacao_id UUID NOT NULL REFERENCES vpcn_produtos.solicitacoes(id) ON DELETE CASCADE,
    fornecedor_id UUID REFERENCES vpcn_config.fornecedores(id),
    
    -- Marketplace / Retail Toggle Support
    is_marketplace BOOLEAN DEFAULT FALSE,
    marketplace_url TEXT,
    codigo_rastreio_previsto TEXT,
    
    -- Financials & Delivery (THE MASTER FIELDS)
    preco_unitario NUMERIC(15, 2) NOT NULL DEFAULT 0,
    preco_total NUMERIC(15, 2) NOT NULL DEFAULT 0,
    valor_frete NUMERIC(15, 2) DEFAULT 0,
    prazo_entrega_dias INTEGER NOT NULL DEFAULT 0,
    incoterm TEXT DEFAULT 'CIF' CHECK (incoterm IN ('CIF', 'FOB')),
    condicoes_pagamento TEXT NOT NULL DEFAULT 'BOLETO 30D',
    validade_proposta DATE NOT NULL,
    
    -- Decision & Audit Assets
    observacoes_comerciais TEXT,
    proposta_pdf_url TEXT,
    score_final NUMERIC(5, 2) DEFAULT 0,
    is_winner BOOLEAN DEFAULT FALSE,
    justificativa_vencedor TEXT,
    
    created_at TIMESTAMPTZ DEFAULT now()
);

-- 3. Solidification of Request Status
ALTER TABLE vpcn_produtos.solicitacoes DROP CONSTRAINT IF EXISTS solicitacoes_status_check;
ALTER TABLE vpcn_produtos.solicitacoes ADD CONSTRAINT solicitacoes_status_check 
CHECK (status IN (
    'RASCUNHO', 'PENDENTE_N1', 'PENDENTE_N2', 'PENDENTE_N3', 
    'EM_COTACAO', 'EM_LEILAO', 'COTACOES_RECEBIDAS', 'VENCEDOR_SELECIONADO', 
    'EM_COMPRA', 'RECEBIDO', 'REPROVADO'
));

-- 4. Initial Supplier Seed (Correct Industry Standards)
INSERT INTO vpcn_config.fornecedores (cnpj_cpf, razao_social, nome_fantasia, email_comercial, score_historico)
VALUES 
('10.200.300/0001-99', 'Indústria de Vedações Nacionais', 'VedBrasil', 'comercial@vedbrasil.com.br', 4.5),
('20.300.400/0001-88', 'Distribuidora Global Peças Industriais', 'GlobalParts', 'vendas@globalparts.com.br', 4.8),
('30.400.500/0001-77', 'Metalúrgica Precision Steel LTDA', 'PrecisionSteel', 'contato@precisionsteel.ind.br', 3.9)
ON CONFLICT (cnpj_cpf) DO NOTHING;
