# Spec 005: Módulo de Manutenção Proativa e Ativos
**Status:** IMPLEMENTED (Step 1 - Assets & Decision Engine)
**Tech Lead:** Antigravity (@architect-spaceX, @supabase-expert, @qa-lead)

## 1. Visão Geral
O Módulo de Manutenção automatiza o ciclo de vida dos ativos da **VerticalParts**.

## 2. Cadastro Técnico de Ativos (UI Implementation)
A interface `/manutencao/equipamentos/novo` foi desenvolvida para lidar com a complexidade técnica:
- **Módulo de Frota:** Seção dinâmica para viaturas (Placa, KM/L, Combustível).
- **Gestão de Contratos (SLA):** Vinculação de fornecedores e coberturas técnicos (Total/Parcial/Preventiva).
- **Planejamento:** Definição de frequências e datas alvo para intervenções proativas.

## 3. Motor de Decisão Inteligente (Algoritmo)
Implementado em `packages/lib/manutencao-engine.ts`:
- **Smart Pass:** Autoriza a execução instantânea se houver contrato vigente, cobertura do serviço e valor dentro do teto mensal operacional.
- **Auditoria de Exceção:** Caso o serviço não esteja coberto ou o valor exceda o contrato, o sistema redireciona para o fluxo padrão de aprovação (Gestor -> Engenharia -> CEO).
- **Fallback:** Bloqueio de qualquer intervenção em ativos não cadastrados ou baixados.

## 4. Alertas em Cascata
- Notificações automáticas em D-30 (Engenharia), D-7 (Gestor) e D-1 (CEO) para manutenções críticas não iniciadas.
