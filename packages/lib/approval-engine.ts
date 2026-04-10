/**
 * packages/lib/approval-engine.ts
 * Motor de Aprovação Final - MVP Products 100% Closed
 * @approval-engineer @architect-spaceX @supabase-expert
 */

export type SolicitationStatus = 
  | 'RASCUNHO' 
  | 'PENDENTE_N1' 
  | 'PENDENTE_N2' 
  | 'PENDENTE_N3' 
  | 'APROVADO' 
  | 'EM_COTACAO' 
  | 'EM_COMPRA' 
  | 'RECEBIDO' 
  | 'REPROVADO';

export interface ApproverRule {
  nivel: number;
  alcada_min: number;
  alcada_max: number | null;
  user_ids: string[]; // UUIDs dos aprovadores (Giovanna, Bianca, Juliana, Diego)
}

/**
 * Determina o próximo status da solicitação com base no valor e nível atual aprovado.
 * @param totalValue - Valor total da compra.
 * @param approvedLevel - O nível que acabou de aprovar (0 para novo envio).
 * @param rules - Regras carregadas da tabela vpcn_config.approver_rules.
 */
export function determineNextStep(
  totalValue: number, 
  approvedLevel: number, 
  rules: ApproverRule[]
): SolicitationStatus {
  // Ordenação rigorosa por nível
  const sortedRules = [...rules].sort((a, b) => a.nivel - b.nivel);
  
  // Próximo nível a ser avaliado
  const nextTargetLevel = approvedLevel + 1;

  // Verifica se o valor exige este próximo nível
  const rule = sortedRules.find(r => r.nivel === nextTargetLevel);

  if (!rule) {
    // Se não há regra para o próximo nível, significa que a aprovação anterior foi o teto máximo.
    return 'EM_COTACAO';
  }

  // Lógica de Alçada VerticalParts (1000 / 3500)
  // Se o valor total for maior que o pilar de entrada do nível, ele deve ser escalonado.
  const needsEscalation = (
    (nextTargetLevel === 1) || // N1 é sempre obrigatório para compras > 0
    (nextTargetLevel === 2 && totalValue > 1000) ||
    (nextTargetLevel === 3 && totalValue > 3500)
  );

  if (needsEscalation) {
    if (nextTargetLevel === 1) return 'PENDENTE_N1';
    if (nextTargetLevel === 2) return 'PENDENTE_N2';
    if (nextTargetLevel === 3) return 'PENDENTE_N3';
  }

  // Se o valor não atinge o requisito do próximo nível, a jornada de aprovação acaba aqui.
  return 'EM_COTACAO';
}

/**
 * Validação de Auditoria Mínima VerticalParts.
 * @param justification - Justificativa da decisão ou da compra.
 * @throws Error se for menor que 20 chars.
 */
export function validateAuditJustification(justification: string): void {
  const content = justification?.trim() || "";
  if (content.length < 20) {
    throw new Error(' Auditoria Rejeitada: Justificativa muito curta. Detalhe melhor o motivo (mín. 20 caracteres).');
  }
}

/**
 * Verifica se o usuário logado tem "caneta" (poder de aprovação) para o nível solicitado.
 */
export function canAuthorize(userId: string, targetLevel: number, rules: ApproverRule[]): boolean {
  const rule = rules.find(r => r.nivel === targetLevel);
  // Se for N3, Diego é o aprovador fixo (garantido via user_ids no banco)
  return rule ? rule.user_ids.includes(userId) : false;
}
