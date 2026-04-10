/**
 * apps/web/app/viagens/actions.ts
 * Motor de Solicitação e Auditoria de Viagens - VerticalParts
 * @approval-engineer @supabase-expert @qa-lead
 */
"use server";

import { revalidatePath } from "next/cache";
import { supabaseAdmin } from "../../../lib/supabaseServer";

/**
 * Cria uma nova solicitação de viagem (Fluxo Atômico)
 */
export async function submitSolicitacaoViagem(formData: any) {
  try {
    const { data: solicitacao, error: sError } = await supabaseAdmin
      .from('solicitacoes_viagem')
      .insert({
        finalidade: formData.finalidade,
        objetivo_detalhado: formData.objetivo_detalhado,
        resultados_esperados: formData.resultados_esperados,
        is_planned: formData.is_planned === 'sim',
        justificativa_urgencia: formData.justificativa_urgencia,
        is_internacional: formData.is_internacional,
        valor_estimado_total: formData.valor_estimado_total,
        centro_custo_id: formData.centro_custo_id,
        status: 'PENDENTE_N1'
      })
      .schema('vpcn_viagens')
      .select()
      .single();

    if (sError) throw sError;

    const travelers = formData.viajantes.map((v: any) => ({
      solicitacao_id: solicitacao.id,
      nome: v.nome,
      cpf: v.cpf,
      cargo: v.cargo,
      matricula: v.matricula,
      tipo_viajante: v.is_acompanhante ? 'ACOMPANHANTE' : 'COLABORADOR',
      parentesco: v.parentesco,
      rateio_custo: v.rateio_custo
    }));
    await supabaseAdmin.from('viajantes').insert(travelers).schema('vpcn_viagens');

    const segments = formData.trechos.map((t: any, index: number) => ({
      solicitacao_id: solicitacao.id,
      ordem: index + 1,
      origem: t.origem,
      destino: t.destino,
      modal: t.modal,
      data_hora_partida: t.data
    }));
    await supabaseAdmin.from('roteiros_trechos').insert(segments).schema('vpcn_viagens');

    if (formData.veiculo && formData.trechos.some((tr: any) => tr.modal === 'Carro_Proprio')) {
      await supabaseAdmin.from('despesas_veiculo').insert({
        solicitacao_id: solicitacao.id,
        motorista: formData.veiculo.motorista,
        placa: formData.veiculo.placa,
        km_por_litro: formData.veiculo.km_por_litro,
        valor_litro_combustivel: formData.veiculo.valor_combustivel,
        distancia_total_km: formData.veiculo.distancia_ida_volta_km,
        valor_pedagios: formData.veiculo.pedagios_estimados,
        custo_total_calculado: formData.veiculo.custo_total
      }).schema('vpcn_viagens');
    }

    revalidatePath('/viagens');
    return { success: true, id: solicitacao.id };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

/**
 * Aprova uma solicitação de viagem avançando o nível
 */
export async function aprovarViagem(viagemId: string, nivelAtual: number) {
  try {
    const proximoNivel = nivelAtual + 1;
    let status = `PENDENTE_N${proximoNivel}`;
    
    // Alçada N3 é o teto (Diego)
    if (nivelAtual === 3) status = 'APROVADO';

    await supabaseAdmin
      .from('solicitacoes_viagem')
      .update({ status: status })
      .eq('id', viagemId)
      .schema('vpcn_viagens');

    revalidatePath('/viagens');
    return { success: true };
  } catch (error: any) {
     return { success: false, error: error.message };
  }
}

/**
 * Salva a prestação de contas auditada
 */
export async function submitPrestacaoContas(viagemId: string, despesas: any[]) {
  try {
    const expenses = despesas.map((d: any) => ({
      solicitacao_id: viagemId,
      tipo_despesa: d.categoria,
      valor_moeda_local: d.valor,
      moeda_local: d.moeda,
      valor_convertido_brl: d.moeda === 'BRL' ? d.valor : d.valor * 5.15, // Mock BCB API
      comprovante_url: d.comprovante_url,
      justificativa_excesso: d.justificativa
    }));

    await supabaseAdmin
      .from('prestacao_contas')
      .insert(expenses)
      .schema('vpcn_viagens');

    await supabaseAdmin
      .from('solicitacoes_viagem')
      .update({ status: 'CONCLUIDO' })
      .eq('id', viagemId)
      .schema('vpcn_viagens');

    revalidatePath('/viagens');
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}
