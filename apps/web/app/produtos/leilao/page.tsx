"use client";

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { createClient } from '../../../../lib/supabase';
import { startAuction, selectWinner } from '../actions';
import { 
  Trophy, Users, ClipboardCheck, ArrowLeft, TrendingUp, DollarSign, Clock, ShieldCheck, CheckCircle2, AlertCircle
} from 'lucide-react';
import Link from 'next/link';

/**
 * Mesa de Leilão Online - Buyer View (Fase 8)
 * Interface comparativa de Score e seleção de fornecedores.
 * @architect-spaceX @qa-lead @omie-expert
 */
export default function LeilaoPage() {
  const { id } = useParams();
  const router = useRouter();
  const supabase = createClient();
  
  const [solicitacao, setSolicitacao] = useState<any>(null);
  const [fornecedores, setFornecedores] = useState<any[]>([]);
  const [cotacoes, setCotacoes] = useState<any[]>([]);
  const [selectedSuppliers, setSelectedSuppliers] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
  const [justification, setJustification] = useState("");

  useEffect(() => {
    async function fetchLeilaoData() {
      setLoading(true);
      // 1. Dados da Solicitação
      const { data: sol } = await supabase.from('solicitacoes').select('*, centros_custo(*)').schema('vpcn_produtos').eq('id', id).single();
      setSolicitacao(sol);

      // 2. Lista de Fornecedores Ativos
      const { data: forn } = await supabase.from('fornecedores').select('*').schema('vpcn_config').eq('is_active', true);
      setFornecedores(forn || []);

      // 3. Cotações já recebidas
      const { data: cots } = await supabase.from('cotacoes').select('*, fornecedores(*)').schema('vpcn_produtos').eq('solicitacao_id', id);
      setCotacoes(cots || []);
      
      setLoading(false);
    }
    fetchLeilaoData();
  }, [id, supabase]);

  // Cálculo de Score (Simplificado para o MVP)
  const calculateScore = (cot: any) => {
    if (cot.preco_total === 0) return 0;
    // Score = Preço (50%) + Prazo (30%) + Histórico Fornecedor (20%)
    // Nota: Em um sistema real, usaríamos normalização. Aqui simulamos o peso.
    const priceScore = (5000 / Number(cot.preco_total)) * 50; 
    const deadlineScore = (10 / (Number(cot.prazo_entrega_dias) || 1)) * 30;
    const historyScore = (Number(cot.fornecedores?.score_historico) / 5) * 20;
    return Math.min(100, priceScore + deadlineScore + historyScore).toFixed(1);
  };

  const handleStartAuction = async () => {
    if (selectedSuppliers.length === 0) return alert("Selecione ao menos um fornecedor!");
    setProcessing(true);
    const res = await startAuction(id as string, selectedSuppliers);
    if (res.success) window.location.reload();
    else alert("Erro: " + res.error);
    setProcessing(false);
  };

  const handleSelectWinner = async (cotId: string) => {
    if (justification.length < 20) return alert("Descreva a justificativa da seleção (Mín. 20 caracteres).");
    setProcessing(true);
    const res = await selectWinner(id as string, cotId, justification);
    if (res.success) router.push('/dashboard');
    else alert("Erro: " + res.error);
    setProcessing(false);
  };

  if (loading) return <div className="p-20 text-center animate-pulse text-slate-400">CARREGANDO MESA DE LEILÃO...</div>;

  return (
    <div className="min-h-screen bg-[#f8fafc] font-sans pb-20">
      {/* Header Omie-Style */}
      <header className="bg-white border-b border-slate-200 px-8 py-5 sticky top-0 z-20 flex justify-between items-center shadow-sm">
        <div className="flex items-center gap-4">
          <Link href="/dashboard" className="p-2 hover:bg-slate-100 rounded-full transition-colors text-slate-400">
            <ArrowLeft size={20} />
          </Link>
          <div>
            <h1 className="text-xl font-black text-slate-800 tracking-tighter uppercase">Mesa de Leilão Online</h1>
            <p className="text-[10px] font-bold text-omie-blue uppercase tracking-widest italic">Solicitação #{solicitacao?.codigo_sequencial?.toString().padStart(4, '0')}</p>
          </div>
        </div>
        <div className="flex gap-4">
           <div className={`px-4 py-2 rounded-lg text-[10px] font-black uppercase flex items-center gap-2 ${solicitacao?.status === 'EM_LEILAO' ? 'bg-amber-100 text-amber-700' : 'bg-blue-100 text-blue-700'}`}>
              <TrendingUp size={14} /> STATUS: {solicitacao?.status?.replace('_', ' ')}
           </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto p-8 space-y-8">
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Coluna 1: Escopo do Pedido */}
          <div className="lg:col-span-1 space-y-6">
             <div className="omie-card p-6 bg-white border-l-4 border-l-omie-blue">
                <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                  <ClipboardCheck size={16} /> Escopo da Solicitação
                </h3>
                <div className="space-y-4">
                   <div>
                      <p className="text-[10px] font-bold text-slate-400 uppercase">Centro de Custo</p>
                      <p className="text-sm font-bold text-slate-800">{solicitacao?.centros_custo?.nome}</p>
                   </div>
                   <div>
                      <p className="text-[10px] font-bold text-slate-400 uppercase">Valor Estimado (Budget)</p>
                      <p className="text-sm font-black text-emerald-600">R$ {Number(solicitacao?.valor_total_estimado).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</p>
                   </div>
                   <div className="p-4 bg-slate-50 rounded-lg border border-slate-100 italic text-[11px] text-slate-500">
                      &quot;{solicitacao?.justificativa_geral}&quot;
                   </div>
                </div>
             </div>

             {/* Seletor de Fornecedores (Se em EM_COTACAO) */}
             {solicitacao?.status === 'EM_COTACAO' && (
               <div className="omie-card p-6 bg-white border-l-4 border-l-amber-500">
                  <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                    <Users size={16} /> Convite de Fornecedores
                  </h3>
                  <div className="space-y-2 max-h-60 overflow-y-auto pr-2">
                     {fornecedores.map(f => (
                       <label key={f.id} className="flex items-center gap-3 p-3 rounded-lg hover:bg-slate-50 cursor-pointer border border-transparent hover:border-slate-100 transition-all">
                          <input type="checkbox" checked={selectedSuppliers.includes(f.id)} onChange={(e) => {
                             if(e.target.checked) setSelectedSuppliers([...selectedSuppliers, f.id]);
                             else setSelectedSuppliers(selectedSuppliers.filter(id => id !== f.id));
                          }} className="w-4 h-4 text-omie-blue rounded focus:ring-omie-blue" />
                          <div>
                             <p className="text-xs font-black text-slate-800 uppercase tracking-tighter">{f.nome_fantasia || f.razao_social}</p>
                             <p className="text-[9px] text-slate-400 font-bold uppercase tracking-widest">Score: {f.score_historico}/5.0</p>
                          </div>
                       </label>
                     ))}
                  </div>
                  <button onClick={handleStartAuction} disabled={processing || selectedSuppliers.length === 0}
                    className="w-full mt-6 bg-amber-500 text-white font-black text-[11px] py-3 rounded-xl hover:bg-amber-600 transition-all shadow-lg shadow-amber-100 uppercase tracking-widest disabled:opacity-50">
                    DISPARAR LEILÃO ONLINE
                  </button>
               </div>
             )}
          </div>

          {/* Coluna 2: Mesa de Comparação (Se em EM_LEILAO ou COTACAO_RECEBIDA) */}
          <div className="lg:col-span-2">
             <div className="omie-card bg-white border-none shadow-xl shadow-slate-200/50 overflow-hidden">
                <div className="p-6 border-b border-slate-50 flex justify-between items-center bg-slate-50/50">
                   <h3 className="text-xs font-black text-slate-800 uppercase tracking-widest flex items-center gap-2">
                     <Trophy size={18} className="text-amber-500" /> Comparativo de Performance (Score)
                   </h3>
                </div>

                {cotacoes.length === 0 ? (
                  <div className="p-20 text-center">
                     <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4 border border-slate-100 italic">
                        <Clock size={30} className="text-slate-200" />
                     </div>
                     <p className="text-slate-400 text-xs italic">Aguardando ofertas dos fornecedores convidados...</p>
                  </div>
                ) : (
                  <table className="w-full text-left omie-table">
                    <thead>
                      <tr className="bg-slate-50">
                        <th className="py-4 pl-6 text-[10px] font-black uppercase text-slate-400">Fornecedor</th>
                        <th className="text-[10px] font-black uppercase text-slate-400">Preço Total</th>
                        <th className="text-[10px] font-black uppercase text-slate-400">Logística</th>
                        <th className="text-[10px] font-black uppercase text-slate-400 px-6">Performance (Score)</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-50">
                      {cotacoes.map(cot => (
                        <tr key={cot.id} className="hover:bg-slate-50/50 transition-colors">
                          <td className="py-6 pl-6">
                             <p className="text-sm font-black text-slate-800 uppercase">{cot.fornecedores?.nome_fantasia}</p>
                             <p className="text-[9px] text-slate-400 font-bold uppercase mt-1 tracking-widest">{cot.fornecedores?.cnpj_cpf}</p>
                          </td>
                          <td>
                             <div className="flex items-center gap-2">
                                <DollarSign size={14} className="text-emerald-500" />
                                <span className="text-sm font-black text-slate-900">R$ {Number(cot.preco_total).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
                             </div>
                             <p className="text-[10px] text-slate-400 font-bold mt-1 uppercase italic">{cot.condicoes_pagamento}</p>
                          </td>
                          <td>
                             <div className="flex flex-col gap-1">
                                <div className="flex items-center gap-1.5 text-[10px] font-bold text-slate-600 uppercase">
                                   <Clock size={12} /> {cot.prazo_entrega_dias} dias úteis
                                </div>
                                <div className="flex items-center gap-1.5 text-[10px] font-bold text-slate-600 uppercase">
                                   <ShieldCheck size={12} /> Frete: R$ {Number(cot.valor_frete).toLocaleString('pt-BR')}
                                </div>
                             </div>
                          </td>
                          <td className="px-6">
                             <div className="flex items-center gap-3">
                                <div className="flex-1 h-2 bg-slate-100 rounded-full overflow-hidden">
                                   <div className={`h-full rounded-full ${Number(calculateScore(cot)) > 80 ? 'bg-emerald-500' : 'bg-omie-blue'}`} style={{ width: `${calculateScore(cot)}%` }}></div>
                                </div>
                                <span className="text-lg font-black text-slate-800">{calculateScore(cot)}%</span>
                             </div>
                             
                             {/* Botão Seleção Vencedor */}
                             {solicitacao?.status !== 'VENCEDOR_SELECIONADO' && (
                               <div className="mt-4 flex flex-col gap-3">
                                  <textarea placeholder="Justificativa técnica da escolha..." value={justification} onChange={(e) => setJustification(e.target.value)}
                                    className="w-full text-[10px] p-2 border border-slate-200 rounded-lg outline-none focus:border-omie-blue italic" />
                                  <button onClick={() => handleSelectWinner(cot.id)} disabled={processing || justification.length < 20}
                                    className="bg-emerald-500 text-white font-black text-[10px] py-2 rounded-lg hover:bg-emerald-600 transition-all uppercase flex items-center justify-center gap-2">
                                    <CheckCircle2 size={14} /> Selecionar Vencedor
                                  </button>
                               </div>
                             )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}

                {solicitacao?.status === 'VENCEDOR_SELECIONADO' && (
                  <div className="p-8 bg-emerald-50 border-t border-emerald-100 flex items-center gap-4 text-emerald-800">
                     <Trophy size={40} className="opacity-40" />
                     <div>
                        <h4 className="font-black text-sm uppercase tracking-widest">Leilão Finalizado</h4>
                        <p className="text-xs font-bold opacity-80 uppercase leading-relaxed mt-1">
                          Vencedor selecionado via Mesa de Leilão. Processo pronto para faturamento/entrega.
                        </p>
                     </div>
                  </div>
                )}
             </div>
          </div>

        </div>

        {/* Auditoria do Leilão */}
        <div className="omie-card p-6 bg-slate-900 text-white flex justify-between items-center border-none shadow-2xl">
           <div className="flex gap-4 items-center">
              <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center"><AlertCircle size={20} className="text-omie-blue" /></div>
              <div>
                 <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em]">Compliance VerticalParts</p>
                 <p className="text-xs font-bold text-white uppercase italic">O leilão é obrigatório para todas as compras aprovadas via portal.</p>
              </div>
           </div>
           <div className="text-right">
              <p className="text-[9px] font-black text-slate-500 uppercase">Buyer Responsável</p>
              <p className="text-sm font-black text-omie-blue uppercase tracking-tighter italic">JULIANA PROCOPIO</p>
           </div>
        </div>

      </div>

      <style jsx global>{`
        .omie-card { @apply bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden; }
        .omie-table th { @apply font-black text-[10px] text-slate-400 uppercase tracking-widest p-4; }
      `}</style>
    </div>
  );
}
