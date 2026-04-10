-- supabase/migrations/004_recebimento_almoxarife.sql
-- Warehouse Receipt Final Closure - Phase 2
-- @supabase-expert @architect-spaceX @security-auditor

-- 1. Receipt Header (NF tracking)
CREATE TABLE IF NOT EXISTS vpcn_produtos.recebimentos (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    solicitacao_id UUID NOT NULL REFERENCES vpcn_produtos.solicitacoes(id) ON DELETE CASCADE,
    almoxarife_id UUID NOT NULL, 
    
    -- Fiscal Data
    nf_numero TEXT NOT NULL,
    nf_serie TEXT NOT NULL,
    
    -- Control
    data_hora_chegada TIMESTAMPTZ DEFAULT now(),
    tem_divergencia BOOLEAN DEFAULT FALSE,
    observacoes TEXT,
    
    created_at TIMESTAMPTZ DEFAULT now()
);

-- 2. Line-Item Audit
CREATE TABLE IF NOT EXISTS vpcn_produtos.recebimento_itens (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    recebimento_id UUID NOT NULL REFERENCES vpcn_produtos.recebimentos(id) ON DELETE CASCADE,
    item_solicitacao_id UUID NOT NULL REFERENCES vpcn_produtos.itens_solicitacao(id),
    
    -- Comparison
    quantidade_recebida NUMERIC(15, 2) NOT NULL DEFAULT 0,
    status_qualitativo TEXT NOT NULL DEFAULT 'PERFEITO' 
    CHECK (status_qualitativo IN ('PERFEITO', 'EMBALAGEM_INTEGRA', 'DIVERGENCIA')),
    
    -- Audit Evidence
    fotos_url TEXT[] DEFAULT '{}',
    divergencia_descricao TEXT,
    
    created_at TIMESTAMPTZ DEFAULT now()
);

-- 3. Automatic Status and Date Transition Trigger
ALTER TABLE vpcn_produtos.solicitacoes ADD COLUMN IF NOT EXISTS data_recebimento TIMESTAMPTZ;

CREATE OR REPLACE FUNCTION vpcn_produtos.fn_confirmar_recebimento_v2()
RETURNS TRIGGER AS $$
BEGIN
    UPDATE vpcn_produtos.solicitacoes
    SET status = 'RECEBIDO',
        data_recebimento = now()
    WHERE id = NEW.solicitacao_id;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS tr_on_recebimento_confirm ON vpcn_produtos.recebimentos;
CREATE TRIGGER tr_on_recebimento_confirm
AFTER INSERT ON vpcn_produtos.recebimentos
FOR EACH ROW EXECUTE FUNCTION vpcn_produtos.fn_confirmar_recebimento_v2();

-- 4. RLS - Security Gating
ALTER TABLE vpcn_produtos.recebimentos ENABLE ROW LEVEL SECURITY;
ALTER TABLE vpcn_produtos.recebimento_itens ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Enable all for warehouse users" ON vpcn_produtos.recebimentos FOR ALL TO authenticated USING (true);
CREATE POLICY "Enable all for warehouse items" ON vpcn_produtos.recebimento_itens FOR ALL TO authenticated USING (true);
CREATE POLICY "Enable select for readers" ON vpcn_produtos.recebimentos FOR SELECT TO authenticated USING (true);
CREATE POLICY "Enable select for items readers" ON vpcn_produtos.recebimento_itens FOR SELECT TO authenticated USING (true);
