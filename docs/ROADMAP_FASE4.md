# Roadmap Fase 4: Módulo de Serviços e Engenharia
**Status:** CONCLUDED ✅
**Objetivo:** Garantir a entrega técnica rigorosa e o controle de medições para contratos de engenharia e manutenção.

## 🏁 Marco 1: Estrutura e Dados (Schema & Security)
- [x] Atualização do Spec 004 (Fiel ao Master Spec).
- [x] Consolidação da Migration `006_servicos_init.sql`.
- [x] Implementação de RLS e validações de integridade no banco.

## 🛠️ Marco 2: Wizard de Contratação de Engenharia
- [x] Desenvolvimento do Formulário Dinâmico (`servicos/nova`):
  - Cadastro de Etapas de Escopo (MS Project Style).
  - Gestão Coercitiva de ART/RRT.
  - Levantamento de Local: Fotos Estado Zero (Mín. 3).

## 📐 Marco 3: Acompanhamento de Execução (Medição)
- [x] Interface de "Diário de Obra" para Engenheiros e Montadores.
- [x] Fluxo de Vistoria por Etapa (Foto Mandatória + De Acordo Técnico).
- [x] Dashbord de Engenharia: Gestão de KPIs e Performance de Fornecedor.

## 💸 Marco 4: Integração de Pagamentos e Contratos
- [x] Gatilho de Liberação de Pagamento Parcial pós-conferência.
- [x] Registro de Glosas e não conformidades.

---
**Status Final:** “Módulo Serviços 100% implementado e testável – Wizard + Vistoria + Pagamento”
