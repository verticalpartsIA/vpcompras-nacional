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

/**
 * Motor de Alertas em Cascata (30-7-1 dias)
 * Engenharia (30) -> Gestor (7) -> CEO (1)
 */
export async function gerarAlertasProximos(equipamento_id: string) {
  const { data: programacao, error } = await supabaseAdmin
    .from('programacao_manutencao')
    .select('id, data_proxima_programada, tipo_manutencao')
    .eq('equipamento_id', equipamento_id)
    .eq('status_programacao', 'AGENDADO')
    .schema('vpcn_manutencao')
    .single();

  if (error || !programacao) return;

  const hoje = new Date();
  const dataManutencao = new Date(programacao.data_proxima_programada);
  const diffDias = Math.ceil((dataManutencao.getTime() - hoje.getTime()) / (1000 * 60 * 60 * 24));

  let destinatario = '';
  let nivel = '';

  if (diffDias <= 1) {
    destinatario = 'CEO / FINANCEIRO';
    nivel = 'CRÍTICO - ESCALAÇÃO DIRETA';
  } else if (diffDias <= 7) {
    destinatario = 'GESTOR DE DEPARTAMENTO';
    nivel = 'ALERTA TÁTICO';
  } else if (diffDias <= 30) {
    destinatario = 'ENGENHARIA / TÉCNICO';
    nivel = 'PROGRAMADA';
  }

  if (destinatario) {
    console.log(`🔔 [MANUTENÇÃO] Alerta Nível ${nivel}:`);
    console.log(`Ativo: ${equipamento_id} | Prazo: ${diffDias} dias | Destinatário: ${destinatario}`);
    
    // Trigger Realtime ou Notificação Push (Simulado)
    await supabaseAdmin
      .from('alertas_config')
      .update({ 
        [`alerta_${diffDias === 1 ? '1' : diffDias <= 7 ? '7' : '30'}_dia_ok`]: true 
      })
      .eq('equipamento_id', equipamento_id)
      .schema('vpcn_manutencao');
  }
}

/**
 * Integração: Gera pedido de compra em Produtos se peça for trocada
 */
export async function gerarPedidoPecasAutomatico(equipamento_id: string, pecas: any[]) {
  if (!pecas || pecas.length === 0) return;

  const { data: solicitacao, error } = await supabaseAdmin
    .from('solicitacoes')
    .insert({
      tipo_item: 'PRODUTO',
      descricao: `Reposição de estoque: Peças trocadas na manutenção do Ativo ${equipamento_id}`,
      observacoes: JSON.stringify(pecas),
      status: 'EM_COTACAO',
      urgencia: 'ALTA'
    })
    .schema('vpcn_produtos')
    .select()
    .single();

  if (error) console.error("Erro ao gerar pedido de peças automático:", error);
  return solicitacao;
}

/**
 * Recalcula próxima data após fechamento de registro
 */
export async function recalcularProximaData(equipamento_id: string, frequencia_dias: number) {
  const proxima_data = new Date();
  proxima_data.setDate(proxima_data.getDate() + frequencia_dias);

  await supabaseAdmin
    .from('programacao_manutencao')
    .update({ 
      data_proxima_programada: proxima_data.toISOString().split('T')[0],
      status_programacao: 'AGENDADO'
    })
    .eq('equipamento_id', equipamento_id)
    .schema('vpcn_manutencao');
}
