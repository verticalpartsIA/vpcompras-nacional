# Spec 005: Módulo de Manutenção Proativa e Ativos
**Status:** CONCLUDED (Phase 5 - 100% Implemented)
**Tech Lead:** Antigravity (@architect-spaceX, @supabase-expert, @qa-lead, @approval-engineer)

## 1. Visão Geral
O Módulo de Manutenção gerencia o ciclo proativo de intervenções técnicas e o ROI de ativos da **VerticalParts**.

## 2. Fluxo de Vida do Ativo

### 2.1 Cadastro e Inteligência Contratual
- Cadastro técnico com suporte a Frotas (KM/L) e Maquinário.
- **Smart Approval:** Autorização instantânea para manutenções cobertas por contrato vigente e dentro do teto orçamentário operacional.

### 2.2 Monitoramento Proativo (Alertas 30-7-1)
Motor de escalonamento baseado em proximidade da data técnica:
- **D-30 (Engenharia):** Logística e preparação.
- **D-07 (Gestor):** Tático e agendamento.
- **D-01 (CEO):** Alerta crítico de risco de parada de ativo.

### 2.3 Execução e Integração (Closed-loop)
- **Registro de Campo:** Registro de horas, laudos técnicos (PDF) e fotos obrigatórias.
- **Reposição Automática:** Se o técnico troca uma peça, o sistema gera automaticamente uma solicitação de compra no **Módulo 001 (Produtos)** para repor estoque.
- **Recálculo de Ciclo:** Agendamento automático da próxima intervenção pós-fechamento.

## 3. Gestão Executiva (Dashboard)
- **Análise de ROI:** Radar de substituição para ativos com custo de manutenção acima de 30% do valor de aquisição.
- **KPIs de Saúde:** Proporção entre manutenções preventivas (meta > 80%) e corretivas.

## 4. Infraestrutura
- Schema: `vpcn_manutencao`.
- Tabelas: `equipamentos`, `contratos_manutencao`, `programacao_manutencao`, `alertas_config`, `registros_manutencao`.
