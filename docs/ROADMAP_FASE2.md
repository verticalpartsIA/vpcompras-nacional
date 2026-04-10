# Roadmap Fase 2: Módulo Recebimento Almoxarife
**Status:** IN_PROGRESS (Digital Conference Interface Stage)
**Objetivo:** Garantir a integridade física das compras nacionais e integração de estoque Omie.

## 🏁 Marco 1: Infraestrutura e Auditoria (Schema & Triggers)
- [x] Reforço do Spec 002 (Padrão definitivo Recebimento.txt).
- [x] Migration `004_recebimento_almoxarife.sql`:
  - Tabelas de Cabeçalho e Auditoria de Itens.
  - Trigger automático para transição de status para `RECEBIDO`.
- [x] Liberação de RLS para perfis `almoxarife`.

## 📦 Marco 2: Interface de Conferência (UI Mobile-First)
- [x] Dashboard de Triagem (`/recebimento`): Lista de pedidos em trânsito.
- [x] Mesa de Conferência Digital (`/recebimento/[id]/conferencia`):
  - Formulário com dados fiscais (NF/Série).
  - Auditoria per-item (Qtd Esperada vs Recebida).
  - Checkboxes Qualitativos (Avarias/Divergências).
  - Widget de suporte para upload de fotos.

## 🚀 Marco 3: Server Actions e Business Logic
- [x] `submitRecebimento`: Lógica transacional de gravação de auditoria.
- [ ] Sistema de Alerta Realtime: Notificação visual imediata se `tem_divergencia = true`.

## 🔗 Marco 4: Integração Omie e Fechamento
- [ ] Webhook Omie: Payloads de entrada de mercadoria no ERP.
- [ ] Aba "Recebimentos Concluídos": Histórico técnico para auditoria fiscal e consulta de fotos.

---
**Status Atual:** “Interface de Conferência Almoxarife implementada – Pronto para teste no pátio”
