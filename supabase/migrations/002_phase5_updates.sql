-- supabase/migrations/002_phase5_updates.sql
-- Finalizing status flow and threshold rules for Products MVP
-- @supabase-expert @architect-spaceX

-- 1. Update status constraint in solicitacoes
ALTER TABLE vpcn_produtos.solicitacoes 
DROP CONSTRAINT IF EXISTS solicitacoes_status_check;

ALTER TABLE vpcn_produtos.solicitacoes 
ADD CONSTRAINT solicitacoes_status_check 
CHECK (status IN ('RASCUNHO', 'PENDENTE_N1', 'PENDENTE_N2', 'PENDENTE_N3', 'APROVADO', 'EM_COTACAO', 'EM_COMPRA', 'RECEBIDO', 'REPROVADO'));

-- 2. Clean and Reset Approver Rules with Real Thresholds
DELETE FROM vpcn_config.approver_rules;

-- Exemplo para um Centro de Custo padrão (Matriz)
-- Nota: Gelson deve ajustar os user_ids conforme os UUIDs reais do Supabase Auth
INSERT INTO vpcn_config.approver_rules (nivel, alcada_min, alcada_max, user_ids)
VALUES 
(1, 0, 1000.00, '{}'),        -- N1: Até 1.000 (Bianca/Gelson placeholders)
(2, 1000.01, 3500.00, '{}'),  -- N2: Até 3.500 (Diego/Giovanna placeholders)
(3, 3500.01, NULL, '{}');      -- N3: Acima de 3.500 (Diego Fixo)

-- 3. Storage Bucket for Phase 5 (Instructions for Manual Execution if needed)
-- INSERT INTO storage.buckets (id, name, public) VALUES ('vpcompras-anexos', 'vpcompras-anexos', false) ON CONFLICT DO NOTHING;

-- 4. Dynamic CC Fetch Helper
CREATE OR REPLACE VIEW vpcn_config.vw_centros_custo_ativos AS
SELECT id, codigo, nome 
FROM vpcn_config.centros_custo 
WHERE is_active = TRUE
ORDER BY nome ASC;
