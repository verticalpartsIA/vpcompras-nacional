# Roadmap Fase 5: Módulo de Manutenção Inteligente
**Status:** IN PROGRESS (Asset Management Stage)
**Objetivo:** Maximizar a vida útil dos ativos e automatizar o fluxo de intervenções técnicas.

## 🏁 Marco 1: Modelagem e Inteligência (Data & Rules)
- [x] Atualização do Spec 005 (Fiel ao Master Spec).
- [x] Consolidação da Migration `007_manutencao_init.sql`.
- [x] Implementação do Motor de "Fluxo Inteligente" (`manutencao-engine.ts`).

## 🚜 Marco 2: Gestão de Ativos e Viaturas
- [x] Interface de Cadastro de Equipamentos e Viaturas (`equipamentos/novo`).
- [ ] Implementação do Fluxo de Aprovação da Engenharia para novos ativos.
- [ ] Dashboard de ROI: Custo Acumulado vs Vida Útil.

## 📅 Marco 3: Planejamento e Alertas Proativos
- [ ] Calendário de Manutenções Preventivas/Preditivas.
- [ ] Motor de Alertas em Cascata (30d Engenharia -> 7d Gestor -> 1d CEO).

## 🔧 Marco 4: Execução e Integração de Produtos
- [ ] Cadastro de Registro de Manutenção (Laudos e Fotos).
- [ ] Gatilho de Pedido de Peças: Integração automática com o Módulo Produtos.

---
**Status Atual:** “Cadastro de Equipamentos + Motor de Decisão Inteligente implementados – Pronto para teste”
