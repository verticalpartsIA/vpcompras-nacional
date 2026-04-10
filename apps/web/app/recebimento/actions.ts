/**
 * apps/web/app/recebimento/actions.ts
 * Engine de Recebimento Digital - VerticalParts
 * @approval-engineer @supabase-expert
 */
"use server";

import { revalidatePath } from "next/cache";
import { supabaseAdmin } from "../../../lib/supabaseServer";

/**
 * Registra a conferência completa do Almoxarifado.
 */
export async function submitRecebimento(data: {
  solicitacaoId: string;
  almoxarifeId: string;
  nfNumero: string;
  nfSerie: string;
  observacoes?: string;
  itens: any[];
}) {
  try {
    // 1. Criar Cabeçalho do Recebimento (Isso dispara o trigger de status do banco)
    const { data: recebimento, error: hError } = await supabaseAdmin
      .from('recebimentos')
      .insert({
        solicitacao_id: data.solicitacaoId,
        almoxarife_id: data.almoxarifeId,
        nf_numero: data.nfNumero,
        nf_serie: data.nfSerie,
        observacoes: data.observacoes,
        tem_divergencia: data.itens.some(i => i.is_divergente || i.status_qualitativo !== 'PERFEITO')
      })
      .schema('vpcn_produtos')
      .select()
      .single();

    if (hError) throw hError;

    // 2. Criar Itens do Recebimento (Audit Trail)
    const receiptItems = data.itens.map(item => ({
      recebimento_id: recebimento.id,
      item_solicitacao_id: item.id,
      quantidade_recebida: item.quantidade_recebida,
      status_qualitativo: item.status_qualitativo,
      fotos_url: item.fotos_url || [],
      divergencia_descricao: item.divergencia_descricao
    }));

    const { error: iError } = await supabaseAdmin
      .from('recebimento_itens')
      .insert(receiptItems)
      .schema('vpcn_produtos');

    if (iError) throw iError;

    console.log(`✅ Recebimento Concluído: NF ${data.nfNumero} para Solicitação #${data.solicitacaoId}`);
    
    revalidatePath(`/recebimento`);
    revalidatePath(`/dashboard`);
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}
