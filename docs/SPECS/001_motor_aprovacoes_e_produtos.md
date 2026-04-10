# Spec 001: Motor de Aprovações & Módulo Produtos (Ciclo MVP Final)
**Status:** ACTIVE (Phase 10 - Mandatory Online Auction Finalized)
**Tech Lead:** Antigravity (@architect-spaceX, @approval-engineer, @supabase-expert, @qa-lead)

## 1. Módulo de Produtos (Fluxo de Governança 100%)
O processo de compra nacional da **VerticalParts** foi formalizado em um fluxo linear, obrigatório e auditável:
1. **Solicitação:** Registro técnico com justificativa e foto do item.
2. **Alçada (Engine):** Verificação automática e sequencial dos níveis N1, N2 e N3.
   - N1: Obrigatório para qualquer valor.
   - N2: Acima de R$ 1.000,00.
   - N3: Acima de R$ 3.500,01 (Martelo Final do Diego).
3. **Mesa de Leilão (PO):** Após aprovação final, a solicitação cai em `EM_COTACAO`. O comprador convida o mercado (Multi-select) e dispara o Pedido de Orçamento formal.
4. **Mesa de Performance (Scores):** Comparativo em tempo real via algoritmo de Score (50% Preço | 30% Prazo | 20% Histórico).
5. **Martelo de Auditoria:** Seleção de vencedor com justificativa mandatória (mín. 40 caracteres) -> `VENCEDOR_SELECIONADO`.

## 2. O Leilão Online (Versão Final conforme Documento Mestre)
### 2.1 Fluxo Sequencial de Estados
| Status | Ação Gatilho | Responsável |
| :--- | :--- | :--- |
| `EM_COTACAO` | Aprovação final de alçada concluída. | Sistema |
| `EM_LEILAO` | Clicar em "Disparar Leilão / Enviar PO". | Comprador |
| `COTACOES_RECEBIDAS` | Recebimento de ao menos uma proposta técnica. | Fornecedor |
| `VENCEDOR_SELECIONADO` | Seleção do vencedor com justificativa 40+ chars. | Comprador |

### 2.2 Algoritmo de Performance (Weighted Performance Score)
- **Preço (50%):** Performance financeira calculada em relação ao Budget Estimado.
- **Lead Time (30%):** Performance logística baseada em benchmark de 5 dias úteis.
- **History (20%):** Reputação histórica consolidada do fornecedor.

### 2.3 Marketplace vs Indústria
O sistema permite o "pulo de mesa" para compras em varejo online via Toggle Marketplace, exigindo:
- URL direta do produto.
- Código de rastreio previsto para auditoria.

## 3. Estrutura de Tabelas (Fase 10)
| Schema | Tabela | Função |
| :--- | :--- | :--- |
| `vpcn_config` | `fornecedores` | Cadastro mestre com score histórico e e-mails. |
| `vpcn_produtos` | `leilao_participantes` | Rastreabilidade de quem foi convidado para a mesa (Audit Trail). |
| `vpcn_produtos` | `cotacoes` | Persistência dos 11 campos comerciais + Score + Vencedor. |

## 4. Diferenciais de Segurança
- **Bloqueio de Justificativa:** O botão de encerramento só habilita quando o texto atinge 40 caracteres técnicos.
- **Sincronização Realtime:** A mesa de performance atualiza as ofertas assim que o fornecedor envia os dados.
