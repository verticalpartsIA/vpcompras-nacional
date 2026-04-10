# Spec 003: Módulo Viagens Corporativas
**Status:** CONCLUDED (Phase 3 - 100% Implemented)
**Engineering Team:** Antigravity (@architect-spaceX, @supabase-expert, @qa-lead, @approval-engineer)

## 1. Escopo e Governança
O Módulo de Viagens está 100% operacional e auditável, focado na redução de custos via planejamento antecipado e auditoria técnica de reembolsos.

## 2. Fluxo de Vida Completo (End-to-End)

### Fase 1: Solicitação Coercitiva
- **Formulário Wizard:** Triagem de antecedência (travas de 30 caracteres para urgência), gerenciamento de viajantes múltiplos (Colaborador vs Acompanhante) e calculadora viva de veículo próprio.
- **Orçamento Live:** Estimativa em tempo real de Passagens + Hotel + Diárias + KM.

### Fase 2: Motor de Aprovação (Approval Engine)
- **Integração N1/N2/N3:** 
  - N1 (< R$ 1.000)
  - N2 (< R$ 3.500)
  - N3 (> R$ 3.500 ou Internacional) - Diego.
- **Notificação:** Transição automática de status para `APROVADO` após a última alçada.

### Fase 3: Execução e Reservas
- Status `EM_RESERVA`: Compras efetua a emissão de passagens e reserva de hotéis baseada no formulário aprovado.

### Fase 4: Prestação de Contas (Post-Trip)
- **Portal de Despesas:** Upload obrigatório de comprovantes por categoria.
- **Câmbio Inteligente:** Conversão automática de moedas via placeholder BCB.
- **Cálculo de Saldo:** Confronto automático entre Adiantamento (se houver) e Gasto Real.
- **Status Final:** `CONCLUIDO`.

## 3. Inteligência de Dados (Dashboard)
- **KPIs Ativos:**
  - % Programadas vs Last-Minute (Meta > 90%).
  - Índice de Urgência por Solicitante/Departamento.
  - Custo Médio por Destino e Modal (Aéreo vs Rodoviário).

## 4. Segurança e Auditoria
- **RLS (Row Level Security):** Viajantes só veem suas solicitações; Gestores veem o departamento; Diego (N3) vê o global.
- **Trilha de Justificativas:** Todas as quebras de política (Excesso de gastos ou Urgência) são gravadas com timestamp no banco.
