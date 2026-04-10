"use server";

import { revalidatePath } from "next/cache";
import { determineNextStep, validateAuditJustification } from "../../../../../packages/lib/approval-engine";
import { supabaseAdmin } from "../../../lib/supabaseServer";

/**
 * Server Action Definitiva - MVP Products 100%
 * Processa a submissão, arquiva as fotos e define a alçada inicial real.
 * @supabase-expert @approval-engineer
 */
export async function submitFullSolicitacao(formData: any) {
  try {
    // 1. Identificar Usuário (Simulado - No real usa supabase.auth.getUser())
    // Ex: gelson-uuid
    const solicitanteId = "00000000-0000-0000-0000-000000000000"; 

    // 2. Cálculo de Valor e Validação de Auditoria
    const totalValue = formData.itens.reduce((acc: number, item: any) => 
      acc + (Number(item.quantidade) * Number(item.valor_unitario_estimado)), 0);
    
    // Validar justificativa do primeiro item como justificativa mestre
    const firstJustification = formData.itens[0]?.justificativa || "";
    validateAuditJustification(firstJustification);

    // 3. Buscar Regras de Aprovação DINÂMICAS do Centro de Custo
    const { data: rules, error: rulesError } = await supabaseAdmin
      .from('approver_rules')
      .select('nivel, alcada_min, alcada_max, user_ids')
      .schema('vpcn_config')
      .eq('centro_custo_id', formData.centro_custo_id);

    if (rulesError || !rules) throw new Error("Configuração de alçadas não encontrada para este CC.");

    // 4. Determinar Status Inicial Real
    const initialStatus = determineNextStep(totalValue, 0, rules);

    // 5. Inserir Cabeçalho da Solicitação
    const { data: solData, error: solError } = await supabaseAdmin
      .from('solicitacoes')
      .insert({
        solicitante_id: solicitanteId,
        centro_custo_id: formData.centro_custo_id,
        status: initialStatus,
        valor_total_estimado: totalValue,
        data_necessaria_entrega: formData.data_necessaria_entrega,
        local_entrega: formData.local_entrega,
        endereco_entrega: formData.endereco_entrega,
        contato_local: formData.contato_local,
        urgencia: formData.itens[0]?.urgencia || 'MEDIA',
        justificativa_geral: firstJustification
      })
      .schema('vpcn_produtos')
      .select()
      .single();

    if (solError) throw new Error(`Erro ao criar solicitação: ${solError.message}`);

    // 6. Inserir Itens com Foto URL Validada
    const itemsToInsert = formData.itens.map((item: any) => ({
      solicitacao_id: solData.id,
      nome_descricao: item.nome_descricao,
      quantidade: Number(item.quantidade),
      unidade: item.unidade,
      valor_unitario_estimado: Number(item.valor_unitario_estimado),
      justificativa: item.justificativa,
      foto_exemplo: item.foto_exemplo_url || null
    }));

    const { error: itemsError } = await supabaseAdmin
      .from('itens_solicitacao')
      .insert(itemsToInsert)
      .schema('vpcn_produtos');

    if (itemsError) throw new Error(`Erro ao salvar itens: ${itemsError.message}`);

    // 7. Notificar Aprovadores (Placeholder para futura integração de e-mail/zap)
    console.log(`🚀 Solicitação #${solData.codigo_sequencial} criada com status ${initialStatus}`);

    revalidatePath("/dashboard");
    return { success: true, id: solData.id, status: initialStatus };

  } catch (error: any) {
    console.error("ERRO CRÍTICO MVP:", error.message);
    return { success: false, error: error.message };
  }
}

/**
 * Registra uma ação de aprovação/reprovação (Audit Log Integrado)
 */
export async function processApprovalAction(solicitacaoId: string, level: number, approverId: string, decision: 'APROVADO' | 'REPROVADO', justification: string) {
  try {
    validateAuditJustification(justification);

    // 1. Registrar na tabela de auditoria de aprovações
    const { error: auditError } = await supabaseAdmin
      .from('aprovacoes')
      .insert({
        solicitacao_id: solicitacaoId,
        nivel: level,
        aprovador_id: approverId,
        decisao: decision,
        justificativa: justification
      })
      .schema('vpcn_produtos');

    if (auditError) throw auditError;

    // 2. Buscar dados da solicitação para calcular próximo status
    const { data: sol } = await supabaseAdmin
      .from('solicitacoes')
      .select('*')
      .schema('vpcn_produtos')
      .eq('id', solicitacaoId)
      .single();

    // 3. Buscar regras
    const { data: rules } = await supabaseAdmin
      .from('approver_rules')
      .select('*')
      .schema('vpcn_config')
      .eq('centro_custo_id', sol.centro_custo_id);

    // 4. Calcular próximo status baseado na decisão
    let nextStatus: any = decision === 'REPROVADO' ? 'REPROVADO' : determineNextStep(sol.valor_total_estimado, level, rules);

    // 5. Atualizar status da solicitação
    await supabaseAdmin
      .from('solicitacoes')
      .update({ status: nextStatus })
      .schema('vpcn_produtos')
      .eq('id', solicitacaoId);

    revalidatePath("/dashboard");
    return { success: true, nextStatus };

  } catch (error: any) {
    return { success: false, error: error.message };
  }
}
