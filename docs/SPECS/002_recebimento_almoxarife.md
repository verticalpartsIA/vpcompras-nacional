# Spec 002: Módulo Recebimento Almoxarife
**Status:** DEFINITIVE (Phase 2 - 100% Aligned with Master Spec)
**Tech Lead:** Antigravity (@architect-spaceX, @supabase-expert, @qa-lead, @security-auditor)

## 1. Objetivo e Fluxo Operacional
O Recebimento é a guardião da entrada física de ativos na **VerticalParts**. Este módulo garante que o patrimônio seja verificado antes da liquidação financeira e entrada no estoque Omie.

### Estágios do Fluxo:
1. **Pedidos em Trânsito:** Visibilidade exclusiva para solicitações em status `VENCEDOR_SELECIONADO` ou `EM_COMPRA`.
2. **Convocação Almoxarife:** Acesso restrito ao perfil `almoxarife` para execução da conferência.
3. **Mesa de Conferência Digital:**
   - **Registro Fiscal:** Entrada obrigatória de NF (Número + Série).
   - **Check de Quantidade:** Comparativo `Esperado` vs `Recebido`. Opções: `[ ] Quantidade Conforme` / `[ ] Divergência`.
   - **Check de Qualidade:** Diagnóstico físico. Opções: `[ ] Produto em Perfeito Estado` / `[ ] Embalagem Íntegra` / `[ ] Divergência` (Campo de descrição obrigatório se marcado).
   - **Evidências Visuais:** Upload múltiplo de fotos para o bucket `vpcompras-anexos` (Organizado por `/solicitacao_id/`).
4. **Encerramento:** Botão "Confirmar Recebimento" trava o registro, move status para `RECEBIDO` e notifica Solicitante/Comprador via realtime.

## 2. Regras de Negócio e Segurança (Compliance)
- **RLS (Row Level Security):** 
  - Somente usuários com `role = 'almoxarife'` podem gravar na tabela de recebimentos.
  - `Solicitante` e `Comprador` possuem acesso de leitura imediato para conferência remota.
- **Tratamento de Divergência:** Divergências geram uma flag (Alerta Vermelho) no Dashboard do Comprador, mas por regra de negócio, **não bloqueiam** o pagamento, apenas registram o passivo de auditoria.
- **Acionamento Externo:** A confirmação do recebimento é o gatilho único para o Webhook da Omie (Entrada de Nota/Estoque).

## 3. Composição de Interface (Dashboard)
- **Aba: Pedidos em Trânsito** (Foco do Almoxarife).
- **Aba: Recebimentos Concluídos** (Histórico técnico com acesso às fotos para todos os envolvidos).
- **Widget de Divergência:** Resumo de itens recebidos com irregularidades para ação do Compras.

## 4. Auditoria de Dados
Cada item recebido é vinculado diretamente ao `item_solicitacao_id` original, permitindo o rastreio: `Solicitação -> Leilão -> Recebimento -> NF`.
