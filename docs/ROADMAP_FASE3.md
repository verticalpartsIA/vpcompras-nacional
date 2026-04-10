# Roadmap Fase 3: Módulo Viagens Corporativas
**Status:** CONCLUDED ✅
**Objetivo:** Garantir a previsibilidade de custos de deslocamento e rigor na prestação de contas.

## 🏁 Marco 1: Estrutura e Dados (Schema & Security)
- [x] Atualização do Spec 003 (100% fiel ao Master Spec).
- [x] Migration `005_viagens_init.sql`:
  - Schema `vpcn_viagens` e tabelas de Viajantes, Roteiros e Despesas de Veículo.
- [x] Implementação de RLS e validações de integridade no banco.

## ⛽ Marco 2: Formulário Dinâmico de Solicitação (UI Phase)
- [x] Desenvolvimento do Wizard de Viagem:
  - Step 1: Viajantes Múltiplos e Auditoria de Antecedência (v30+ chars).
  - Step 2: Roteiro Multi-trecho (Modal, Origem, Destino, Horário).
  - Step 3: Calculadora de KM e Combustível em tempo real.
- [x] Toggle Internacional: Validação de Passaporte e Visto.

## 💰 Marco 3: Orçamento e Aprovação
- [x] Integração com o `approval-engine.ts` (Alçadas N1, N2, N3).
- [x] Resumo Financeiro Live: Total acumulado (Passagem + Hospedagem + Alimentação + Transporte).

## 📊 Marco 4: Pós-Viagem e Prestação de Contas (Compliance)
- [x] Portal de Comprovantes: Upload de recibos, categorias e conciliação.
- [x] Conversão Automática: Lógica para gastos internacionais.
- [x] Dashboard de Viagens: KPIs de planejamento (Last-minute vs Programadas) e Índice de Urgência.

---
**Status Final:** “Módulo Viagens 100% implementado e testável – Solicitação + Aprovação + Prestação de Contas”
