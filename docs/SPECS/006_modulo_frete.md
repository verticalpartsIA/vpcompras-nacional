# Spec 006: Módulo de Frete e Expedição
**Status:** CONCLUDED (Phase 6 - Finalized)
**Tech Lead:** Antigravity (@architect-spaceX, @supabase-expert, @qa-lead, @approval-engineer)

## 1. Visão Geral
O Módulo de Frete gerencia o leilão dinâmico, o rastreio multi-API e a conformidade técnica de recebimento da **VerticalParts**.

## 2. Leilão Inteligente (Bidding)
Implementado em `packages/lib/frete-engine.ts`, o motor de seleção utiliza um algoritmo multivariável:
- **Score Final:** (Preço * 0.5) + (Prazo * 0.3) + (Histórico OTIF * 0.2).
- Garante a melhor escolha financeira sem comprometer a previsibilidade da entrega.

## 3. Rastreabilidade e Monitoramento (`frete/[id]/rastreio`)
- **Barra de Progresso:** Status visual (Coletado -> Trânsito -> Entrega -> Recebido).
- **Log de Eventos (JSONB):** Histórico completo de ocorrências da transportadora.
- **SLA Alert:** Notificações automáticas em caso de atraso estimado em relação ao prazo do leilão.

## 4. Conferência Digital (`frete/[id]/conferencia`)
- **Audit Point:** Ponto zero de recepção física no almoxarifado.
- **Evidência Coercitiva:** Exigência de 2 fotos e validação de checklist de integridade.
- **Liquidação:** O fechamento da conferência muda o status para `RECEBIDO` e habilita o fluxo de pagamento do frete no Financeiro.

## 5. Infraestrutura
- Schema: `vpcn_frete`.
- Tabelas: `solicitacoes_frete`, `leilao_frete_participantes`, `cotacoes_frete`, `rastreio_frete`, `conferencias_frete`.
