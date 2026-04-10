-- seed.sql
-- Project: vpcompras-nacionais
-- Initial seed for testing and development

-- 1. Create Centros de Custo (Generic)
INSERT INTO vpcn_config.centros_custo (id, codigo, nome)
VALUES 
    (gen_random_uuid(), '001', 'ADMINISTRAÇÃO'),
    (gen_random_uuid(), '002', 'VENDAS'),
    (gen_random_uuid(), '003', 'LOGÍSTICA'),
    (gen_random_uuid(), '004', 'ESTOQUE')
ON CONFLICT (codigo) DO NOTHING;

-- 2. Mock Users (Placeholder IDs for Approvers)
-- Gelson, replace these with actual auth.users.id from your dashboard.
DO $$
DECLARE
    cc_admin_id UUID := (SELECT id FROM vpcn_config.centros_custo WHERE codigo = '001');
    cc_vendas_id UUID := (SELECT id FROM vpcn_config.centros_custo WHERE codigo = '002');
    uuid_giovanna UUID := gen_random_uuid(); -- Replace with actual IDs
    uuid_bianca UUID := gen_random_uuid();
    uuid_juliana UUID := gen_random_uuid();
    uuid_diego UUID := gen_random_uuid();
BEGIN
    -- 2.1 Rule: Nivel 1 - Technical Review (Bianca/Juliana)
    INSERT INTO vpcn_config.approver_rules (centro_custo_id, nivel, alcada_min, alcada_max, user_ids)
    VALUES (cc_admin_id, 1, 0, 1000, ARRAY[uuid_bianca, uuid_juliana]);

    -- 2.2 Rule: Nivel 2 - Manager Validation (Diego)
    INSERT INTO vpcn_config.approver_rules (centro_custo_id, nivel, alcada_min, alcada_max, user_ids)
    VALUES (cc_admin_id, 2, 1000.01, 5000, ARRAY[uuid_diego]);

    -- 2.3 Rule: Nivel 3 - Admin Authorization (Giovanna)
    INSERT INTO vpcn_config.approver_rules (centro_custo_id, nivel, alcada_min, alcada_max, user_ids)
    VALUES (cc_admin_id, 3, 5000.01, NULL, ARRAY[uuid_giovanna]);

    RAISE NOTICE 'Seed completed with placeholder UUIDs. Please map them to actual auth.users.';
END $$;
