/**
 * packages/lib/manutencao-engine.ts
 * Smart Decision Engine - VerticalParts Maintenance
 * @architect-spaceX @approval-engineer
 */
import { supabaseAdmin } from "./supabaseServer";

export type FluxoManutencao = 'AUTO_APROVADO' | 'FLUXO_PADRAO' | 'BLOQUEADO';

/**
 * Determina se uma solicitação de manutenção precisa de aprovação humana 
 * ou se pode seguir fluxo direto baseado no contrato de SLA.
 */
export async function determinarFluxoSolicitacao(
  equipamento_id: string, 
  tipo_intervencao: string, 
  valor_estimado: number
): Promise<{ fluxo: FluxoManutencao; motivo: string }> {
  
  // 1. Verificar se equipamento existe e está ativo
  const { data: equipamento, error: eError } = await supabaseAdmin
    .from('equipamentos')
    .select('status')
    .eq('id', equipamento_id)
    .schema('vpcn_manutencao')
    .single();

  if (eError || !equipamento) {
    return { fluxo: 'BLOQUEADO', motivo: 'Equipamento não cadastrado ou inexistente.' };
  }

  // 2. Buscar Contrato Ativo
  const { data: contrato, error: cError } = await supabaseAdmin
    .from('contratos_manutencao')
    .select('*')
    .eq('equipamento_id', equipamento_id)
    .eq('is_ativo', true)
    .gte('vigencia_fim', new Date().toISOString())
    .schema('vpcn_manutencao')
    .single();

  // Se não tem contrato, segue fluxo padrão de aprovações
  if (cError || !contrato) {
    return { fluxo: 'FLUXO_PADRAO', motivo: 'Ativo sem contrato de manutenção vigente. Exige tripla aprovação.' };
  }

  // 3. Validar Cobertura e Valor
  const isCoberto = 
    contrato.cobertura === 'TOTAL' || 
    (contrato.cobertura === 'APENAS_PREVENTIVA' && tipo_intervencao === 'PREVENTIVA');

  const valorNoTeto = valor_estimado <= (contrato.valor_anual / 12); // Teto mensal simulado

  if (isCoberto && valorNoTeto) {
    return { 
      fluxo: 'AUTO_APROVADO', 
      motivo: 'Manutenção dentro da cobertura contratual e teto de valor. Execução autorizada.' 
    };
  }

  return { 
    fluxo: 'FLUXO_PADRAO', 
    motivo: 'Intervenção fora da cobertura ou acima do valor contratado. Exige reavaliação.' 
  };
}
