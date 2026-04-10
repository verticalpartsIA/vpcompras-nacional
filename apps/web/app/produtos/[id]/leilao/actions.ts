/**
 * apps/web/app/produtos/[id]/leilao/actions.ts
 * Motor de Leilão Online Obrigatório - Fase Final (Mesa de Performance)
 * @approval-engineer @supabase-expert @qa-lead
 */
"use server";

import { revalidatePath } from "next/cache";
import { supabaseAdmin } from "../../../../lib/supabaseServer";

/**
 * 1. DISPARAR LEILÃO / ENVIAR PO
 * Registra os convites oficiais e move o status para disputa.
 */
export async function dispararLeilao(solicitacaoId: string, supplierIds: string[]) {
  try {
    // Audit Log: Início da Disputa Eletrônica
    const { error: statusError } = await supabaseAdmin
      .from('solicitacoes')
      .update({ status: 'EM_LEILAO' })
      .schema('vpcn_produtos')
      .eq('id', solicitacaoId);

    if (statusError) throw statusError;

    // Criar participantes vinculados na mesa
    const participants = supplierIds.map(sid => ({
      solicitacao_id: solicitacaoId,
      fornecedor_id: sid,
      status_cotacao: 'PENDENTE'
    }));

    await supabaseAdmin
      .from('leilao_participantes')
      .insert(participants)
      .schema('vpcn_produtos');

    console.log(`🚀 PO disparada para ${supplierIds.length} fornecedores. Simulando envio de link seguro...`);
    
    revalidatePath(`/produtos/${solicitacaoId}/leilao`);
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

/**
 * 2. REGISTRAR COTAÇÃO TÉCNICA (Workflow do Fornecedor)
 * Recebe todos os campos comerciais e gera o Score de Performance (50/30/20).
 */
export async function registrarCotacaoForn(solicitacaoId: string, data: any) {
  try {
    // 2.1 Fetch de Referência (Budget e Score do Fornecedor)
    const { data: sol } = await supabaseAdmin.from('solicitacoes').select('valor_total_estimado').schema('vpcn_produtos').eq('id', solicitacaoId).single();
    const { data: forn } = await supabaseAdmin.from('fornecedores').select('score_historico').schema('vpcn_config').eq('id', data.fornecedor_id).single();

    // 2.2 Cálculo de Score Real (Benchmark VerticalParts)
    const budget = Number(sol?.valor_total_estimado || 1);
    const precoProp = Number(data.preco_total);
    const prazoProp = Number(data.prazo_entrega_dias);
    
    const pScore = (budget / precoProp) * 50; 
    const dScore = (5 / (prazoProp || 1)) * 30; // Benchmark: 5 dias
    const hScore = (Number(forn?.score_historico || 5) / 5) * 20;
    
    const finalScore = Math.min(100, pScore + dScore + hScore);

    // 2.3 Registro Auditável
    const { error: cotError } = await supabaseAdmin
      .from('cotacoes')
      .insert({
        solicitacao_id: solicitacaoId,
        fornecedor_id: data.fornecedor_id,
        is_marketplace: data.is_marketplace || false,
        marketplace_url: data.marketplace_url,
        codigo_rastreio_previsto: data.codigo_rastreio_previsto,
        preco_unitario: data.preco_unitario,
        preco_total: data.preco_total,
        prazo_entrega_dias: data.prazo_entrega_dias,
        valor_frete: data.valor_frete,
        incoterm: data.incoterm,
        condicoes_pagamento: data.condicoes_pagamento,
        validade_proposta: data.validade_proposta,
        proposta_pdf_url: data.proposta_pdf_url,
        score_final: finalScore
      })
      .schema('vpcn_produtos');

    if (cotError) throw cotError;

    // 2.4 Atualizar status de participação e mestre
    await supabaseAdmin.from('leilao_participantes').update({ status_cotacao: 'RESPONDIDO' }).schema('vpcn_produtos').match({ solicitacao_id: solicitacaoId, fornecedor_id: data.fornecedor_id });
    await supabaseAdmin.from('solicitacoes').update({ status: 'COTACOES_RECEBIDAS' }).schema('vpcn_produtos').eq('id', solicitacaoId);

    revalidatePath(`/produtos/${solicitacaoId}/leilao`);
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

/**
 * 3. SELECIONAR VENCEDOR (Bater o Martelo)
 * Trava o processo, exige justificativa de 40 chars e encerra o leilão.
 */
export async function selecionarVencedor(solicitacaoId: string, cotacaoId: string, justification: string) {
  try {
    if (justification.trim().length < 40) {
      throw new Error("Auditoria Bloqueada: A justificativa de seleção deve ser técnica e detalhada (mín. 40 caracteres).");
    }

    // 3.1 Registrar Vencedor e Justificativa
    await supabaseAdmin
      .from('cotacoes')
      .update({ is_winner: true, justificativa_vencedor: justification })
      .schema('vpcn_produtos')
      .eq('id', cotacaoId);

    // 3.2 Update Status Mestre
    const { error: solError } = await supabaseAdmin
      .from('solicitacoes')
      .update({ status: 'VENCEDOR_SELECIONADO' })
      .schema('vpcn_produtos')
      .eq('id', solicitacaoId);

    if (solError) throw solError;

    revalidatePath("/dashboard");
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}
