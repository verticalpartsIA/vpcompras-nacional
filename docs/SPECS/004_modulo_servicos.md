# Spec 004: Módulo de Serviços e Engenharia
**Status:** CONCLUDED (Phase 4 - 100% Implemented)
**Tech Lead:** Antigravity (@architect-spaceX, @supabase-expert, @qa-lead, @approval-engineer)

## 1. Escopo e Governança
O Módulo de Serviços gerencia o ciclo completo de contratações técnicas da **VerticalParts**, garantindo que o pagamento financeiro seja escravo da entrega física comprovada.

## 2. Fluxo de Vida dos Dados (End-to-End)

### Fase 1: Wizard de Contratação Coercitivo
- **Cronograma de Medições:** Fragmentação obrigatória em etapas (0-100%).
- **Auditoria de ART:** Travamento coercitivo até validação do registro técnico.
- **Survey Estado Zero:** Registro fotográfico de canteiro antes da execução.

### Fase 2: Diário de Obra e Vistoria Técnicas
- **Medição em Campo:** Monitoramento do percentual executado real.
- **Conformidade vs Glosa:** Aprovação técnica baseada em critérios de aceitação.
- **Evidência Fotográfica:** Mínimo de 2 fotos para liberar cada etapa financeira.

### Fase 3: Liquidação Financeira
- **Gatilho de Pagamento:** Liberação automática do valor da etapa após status "CONFORME" do engenheiro.
- **Segurança:** Bloqueio se houver atrasos críticos ou pendências de documentos.

## 3. Inteligência Gestora (Dashboard)
- **KPIs Ativos:**
  - % On-time (Saúde do Cronograma).
  - Índice de Glosas por Fornecedor (Qualidade).
  - Custo Médio por Natureza de Serviço.

## 4. Infraestrutura
- Schema: `vpcn_servicos`.
- Tabelas: `solicitacoes_servico`, `etapas_medicoes`, `vistorias_execucao`, `documentacao_tecnica`, `contratos_recorrentes`.
