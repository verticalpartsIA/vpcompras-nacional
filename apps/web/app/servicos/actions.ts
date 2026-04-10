/**
 * apps/web/app/servicos/actions.ts
 * Motor de Vistoria e Liquidação de Serviços - VerticalParts
 * @approval-engineer @supabase-expert
 */
"use server";

import { revalidatePath } from "next/cache";
import { supabaseAdmin } from "../../../lib/supabaseServer";

export async function registrarVistoria(etapaId: string, data: any) {
  try {
    // 1. Salvar Registro de Vistoria Técnica
    const { data: vistoria, error: vError } = await supabaseAdmin
      .from('vistorias_execucao')
      .insert({
        etapa_id: etapaId,
        percentual_executado_real: data.percentual,
        conformidade: data.conformidade,
        fotos_url: data.fotos,
        observacoes_tecnicas: data.observacoes,
        vistoriador_id: data.userId // Simulado
      })
      .schema('vpcn_servicos')
      .select()
      .single();

    if (vError) throw vError;

    // 2. Atualizar Progresso na Etapa de Medição
    const updatePayload: any = {
      percentual_concluido: data.percentual
    };

    // Se conforme e executado, marca para liberação financeira
    if (data.conformidade === 'CONFORME' && data.percentual === 100) {
      updatePayload.is_liquidado = true;
    }

    const { error: eError } = await supabaseAdmin
      .from('etapas_medicoes')
      .update(updatePayload)
      .eq('id', etapaId)
      .schema('vpcn_servicos');

    if (eError) throw eError;

    console.log(`📸 Vistoria registrada para Etapa #${etapaId}. Conformidade: ${data.conformidade}`);
    
    revalidatePath(`/servicos/${data.solicitacaoId}/vistoria`);
    return { success: true };
  } catch (error: any) {
    console.error("Erro ao registrar vistoria:", error);
    return { success: false, error: error.message };
  }
}

export async function liberarPagamentoEtapa(etapaId: string) {
    const { error } = await supabaseAdmin
      .from('etapas_medicoes')
      .update({ is_liquidado: true })
      .eq('id', etapaId)
      .schema('vpcn_servicos');
    
    if (error) return { success: false, error: error.message };
    revalidatePath('/servicos/dashboard');
    return { success: true };
}
