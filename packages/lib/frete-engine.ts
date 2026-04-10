/**
 * packages/lib/frete-engine.ts
 * Motor de Leilão e Logística - VerticalParts
 * @architect-spaceX @approval-engineer
 */
import { supabaseAdmin } from "./supabaseServer";

/**
 * Inicia o Leilão de Frete para uma solicitação
 */
export async function dispararLeilaoFrete(solicitacaoId: string, transportadoras: string[]) {
  try {
    // 1. Criar registros de participantes
    const participants = transportadoras.map(id => ({
      solicitacao_id: solicitacaoId,
      transportadora_id: id,
      status_cotacao: 'ENVIADO'
    }));

    const { error: pError } = await supabaseAdmin
      .from('leilao_frete_participantes')
      .insert(participants)
      .schema('vpcn_frete');

    if (pError) throw pError;

    // 2. Mudar status da solicitação
    const { error: sError } = await supabaseAdmin
      .from('solicitacoes_frete')
      .update({ status: 'EM_LEILAO' })
      .eq('id', solicitacaoId)
      .schema('vpcn_frete');

    if (sError) throw sError;

    console.log(`🚚 Leilão disparado para solicitação ${solicitacaoId} com ${transportadoras.length} transportadoras.`);
    return { success: true };
  } catch (error: any) {
    console.error("Erro ao disparar leilão:", error);
    return { success: false, error: error.message };
  }
}

/**
 * Seleciona o vencedor do frete e gera a autorização de coleta
 */
export async function selecionarVencedorFrete(solicitacaoId: string, cotacaoId: string, justificativa: string) {
  try {
    // 1. Marcar vencedor
    const { error: cError } = await supabaseAdmin
      .from('cotacoes_frete')
      .update({ vencedor: true, justificativa_escolha: justificativa })
      .eq('id', cotacaoId)
      .schema('vpcn_frete');

    if (cError) throw cError;

    // 2. Atualizar status da solicitação para aguardar coleta
    const { error: sError } = await supabaseAdmin
      .from('solicitacoes_frete')
      .update({ status: 'AGUARDANDO_COLETA' })
      .eq('id', solicitacaoId)
      .schema('vpcn_frete');

    if (sError) throw sError;

    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

/**
 * Algoritmo de Score Logístico: Preço (50%) + Prazo (30%) + Histórico (20%)
 */
export function calcularScoreFrete(price: number, minPrice: number, days: number, minDays: number, carrierRating: number) {
  const priceScore = (minPrice / price) * 50;
  const timeScore = (minDays / days) * 30;
  const historyScore = (carrierRating / 5) * 20;
  
  return Number((priceScore + timeScore + historyScore).toFixed(2));
}

/**
 * Atualiza status de rastreio e adiciona evento ao histórico
 */
export async function atualizarRastreio(solicitacaoId: string, novoStatus: string, localizacao: string) {
  const { data: current } = await supabaseAdmin
    .from('rastreio_frete')
    .select('historico_eventos')
    .eq('solicitacao_id', solicitacaoId)
    .schema('vpcn_frete')
    .single();

  const novoEvento = {
    data: new Date().toISOString(),
    evento: novoStatus,
    local: localizacao
  };

  const historicoAtualizado = [...(current?.historico_eventos || []), novoEvento];

  await supabaseAdmin
    .from('rastreio_frete')
    .update({ 
      status_atual: novoStatus, 
      historico_eventos: historicoAtualizado,
      ultima_atualizacao: new Date().toISOString()
    })
    .eq('solicitacao_id', solicitacaoId)
    .schema('vpcn_frete');

  // Se entregue, disparar notificação de recebimento
  if (novoStatus === 'ENTREGUE') {
     console.log(`📦 [LOGÍSTICA] Carga da solicitação ${solicitacaoId} ENTREGUE. Aguardando conferência.`);
  }
}
