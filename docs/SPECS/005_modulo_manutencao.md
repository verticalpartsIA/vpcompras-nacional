# Spec 005: Módulo de Manutenção Proativa e Ativos
**Status:** INITIAL (Phase 5 - Intelligent Maintenance Engine)
**Tech Lead:** Antigravity (@architect-spaceX, @supabase-expert, @qa-lead)

## 1. Visão Geral
O Módulo de Manutenção é o núcleo proativo da **VerticalParts**, focado em maximizar a disponibilidade de ativos e minimizar custos através de manutenção preventiva e preditiva. O diferencial é o **Fluxo Inteligente**, que automatiza aprovações baseadas em conformidade contratual.

## 2. Gestão de Ativos (Equipamentos e Viaturas)

### 2.1 Cadastro Técnico
- **Equipamentos:** Nome, Marca, Modelo, Nº Série, Data Instalação, Valor Aquisição, Vida Útil Estimada.
- **Viaturas (Especial):** Placa, Modelo, KM/L, Tipo de Combustível, KM Atual.
- **Aprovação:** Todo novo ativo cadastrado exige validação técnica da Engenharia antes de entrar no ciclo de manutenção.

### 2.2 Gestão de Contratos de Manutenção
- **Supplier Link:** Vinculação ao fornecedor e número do contrato.
- **Cobertura:** [Total / Parcial / Preventiva Apenas].
- **SLA e Valores:** Valor anual, índice de reajuste e regras de cobertura (peças inclusas?).

## 3. Motor de Manutenção e Fluxo Inteligente

### 3.1 Tipos de Intervenção
- **Preventiva:** Programada por tempo ou uso (Ex: Troca de óleo a cada 10k KM).
- **Preditiva:** Baseada em análise de dados e tendências.
- **Corretiva:** Reparo de falha ocorrida (Gera impacto negativo no ROI do ativo).

### 3.2 O "Fluxo Inteligente" (Smart Approval)
O sistema avalia a solicitação em tempo real:
- **Critérios de Auto-Aprovação:**
  - Existe contrato ativo para o equipamento?
  - A intervenção está dentro da cobertura?
  - O valor está dentro do teto contratual previsto?
- **Resultado:**
  - **SIM:** Status `EXECUÇÃO_AUTORIZADA` (Ignora aprovações manuais, gera apenas log).
  - **NÃO:** Reinicia fluxo padrão de 3 aprovações (Gestor -> Engenharia -> CEO).

## 4. Registro de Execução e Integração
- **Laudo Técnico:** Upload obrigatório de fotos (Antes/Depois) e laudo em PDF.
- **Integração de Peças:** Se uma peça for trocada e não estiver em contrato, o sistema gera automaticamente uma solicitação de compra no **Módulo 001 (Produtos)**.
- **Histórico Imutável:** Registros de manutenção persistem mesmo após a baixa do equipamento.

## 5. Sistema de Alertas em Cascata
Alertas configuráveis para garantir que nenhuma manutenção preventiva seja ignorada:
- **30 Dias antes:** Notificação para Engenharia.
- **07 Dias antes:** Escalada para Gestor de Departamento.
- **01 Dia antes:** Escalada crítica para CEO/Diretoria.

## 6. Dashboard de ROI e Ativos
- **TCO (Total Cost of Ownership):** Custo acumulado vs Valor de aquisição.
- **Proporção Preventiva/Corretiva:** Meta > 80% Preventiva.
- **Alerta de Substituição:** Recomendação de venda/descarte quando o custo de manutenção supera a vida útil restante.
