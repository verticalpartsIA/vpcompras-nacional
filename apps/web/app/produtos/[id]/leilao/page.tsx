"use client";

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { createClient } from '../../../../lib/supabase';
import { dispararLeilao, registrarCotacaoForn, selecionarVencedor } from './actions';
import { 
  Trophy, Users, ClipboardCheck, ArrowLeft, TrendingUp, DollarSign, Clock, 
  ShieldCheck, CheckCircle2, AlertCircle, ShoppingBag, Truck, FileText, Globe, Box
} from 'lucide-react';
import Link from 'next/link';

/**
 * Mesa de Leilão Online Obrigatório - Fase 10 (Master Spec)
 * Comparativo em tempo real e Score Proporcional (50/30/20)
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
  const [isMarketplace, setIsMarketplace] = useState(false);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
  const [justification, setJustification] = useState("");

  useEffect(() => {
    async function loadMesa() {
      setLoading(true);
      const { data: sol } = await supabase.from('solicitacoes').select('*, centros_custo(*)').schema('vpcn_produtos').eq('id', id).single();
      setSolicitacao(sol);

      const { data: forn } = await supabase.from('fornecedores').select('*').schema('vpcn_config').eq('is_active', true);
      setFornecedores(forn || []);

      const { data: cots } = await supabase.from('cotacoes').select('*, fornecedores(*)').schema('vpcn_produtos').eq('solicitacao_id', id);
      setCotacoes(cots || []);
      setLoading(false);
    }
    loadMesa();
  }, [id, supabase]);

  const handleDispararPO = async () => {
    if (selectedSuppliers.length === 0) return alert("Erro: Selecione ao menos um fornecedor para disparar a PO.");
    setProcessing(true);
    const res = await dispararLeilao(id as string, selectedSuppliers);
    if (res.success) window.location.reload();
    else alert("Erro: " + res.error);
    setProcessing(false);
  };

  const handleSimularResposta = async (fornecedorId: string) => {
    setProcessing(true);
    const mockData = {
      fornecedor_id: fornecedorId,
      preco_unitario: 1150,
      preco_total: 1150,
      prazo_entrega_dias: 3,
      valor_frete: 45,
      incoterm: 'CIF',
      condicoes_pagamento: 'BOLETO 30D',
      validade_proposta: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      is_marketplace: isMarketplace,
      marketplace_url: isMarketplace ? "https://loja.com/produto" : null,
      codigo_rastreio_previsto: isMarketplace ? "BR999888777" : null,
      proposta_pdf_url: "https://storage.googleapis.com/vp/proposta_convidada.pdf"
    };
    const res = await registrarCotacaoForn(id as string, mockData);
    if (res.success) window.location.reload();
    setProcessing(false);
  };

  const handleBaterMartelo = async (cotId: string) => {
    if (justification.trim().length < 40) return alert("❌ Auditoria Negada: A justificativa requer no mínimo 40 caracteres.");
    setProcessing(true);
    const res = await selecionarVencedor(id as string, cotId, justification);
    if (res.success) router.push('/dashboard');
    else alert(res.error);
    setProcessing(false);
  };

  if (loading) return <div className="p-20 text-center font-black animate-pulse text-slate-400">INICIALIZANDO MESA DE COTAÇÃO...</div>;

  // Bloqueio de Acesso (Regra de Negócio)
  const allowed = ['EM_COTACAO', 'EM_LEILAO', 'COTACOES_RECEBIDAS', 'VENCEDOR_SELECIONADO'];
  if (!allowed.includes(solicitacao?.status)) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-8">
         <div className="bg-white p-10 rounded-[2.5rem] shadow-xl border border-red-50 text-center max-w-lg">
            <AlertCircle size={48} className="text-red-400 mx-auto mb-4" />
            <h2 className="text-lg font-black text-slate-800 uppercase italic">Acesso Restrito</h2>
            <p className="text-slate-500 text-sm mt-3 font-bold uppercase leading-relaxed">
               Esta solicitação não está pronta para leilão ou já foi encerrada. 
               Status esperado: <span className="text-omie-blue">EM_COTACAO</span>
            </p>
            <Link href="/dashboard" className="inline-block mt-8 bg-slate-900 text-white px-8 py-3 rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-black transition-all shadow-lg">RETORNAR AO DASHBOARD</Link>
         </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-[#f1f4f9] pb-24">
      {/* Header Corporativo Omie */}
      <header className="bg-white border-b border-slate-200 px-10 py-6 flex justify-between items-center sticky top-0 z-30 shadow-sm">
        <div className="flex items-center gap-6">
           <Link href="/dashboard" className="p-2 bg-slate-50 hover:bg-slate-100 rounded-xl text-slate-400 transition-all"><ArrowLeft size={20} /></Link>
           <div>
              <h1 className="text-xl font-black text-slate-800 tracking-tighter uppercase italic leading-none">Mesa de Compra Nacional</h1>
              <span className="text-[10px] font-black text-omie-blue uppercase tracking-widest mt-1 italic">Governança VerticalParts</span>
           </div>
        </div>
        
        <div className="flex items-center gap-10">
           <div className="text-right border-r pr-10 border-slate-100">
              <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest block mb-1">Referência (Budget)</span>
              <span className="text-lg font-black text-slate-900 leading-none tracking-tighter">R$ {Number(solicitacao?.valor_total_estimado).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
           </div>
           
           <div className={`px-5 py-2 rounded-2xl text-[10px] font-black uppercase flex items-center gap-2 border shadow-sm ${solicitacao?.status === 'VENCEDOR_SELECIONADO' ? 'bg-emerald-500 text-white border-emerald-600' : 'bg-white text-omie-blue border-slate-200'}`}>
              <CheckCircle2 size={14} /> STATUS: {solicitacao?.status?.replace('_', ' ')}
           </div>
        </div>
      </header>

      <div className="flex-1 p-10 max-w-[1800px] mx-auto w-full grid grid-cols-1 2xl:grid-cols-4 gap-10">
        
        {/* Lado Esquerdo: Mercado & Convocação */}
        <div className="2xl:col-span-1 space-y-8">
           <div className="omie-card p-10 bg-white border-none shadow-xl shadow-slate-200/40">
              <div className="flex justify-between items-center mb-8">
                 <h3 className="text-xs font-black text-slate-800 uppercase tracking-widest">Configurar Disputa</h3>
                 <div className="flex flex-col items-end gap-1">
                    <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest">Marketplace</span>
                    <button onClick={() => setIsMarketplace(!isMarketplace)} className={`w-10 h-5 rounded-full transition-all flex items-center p-1 ${isMarketplace ? 'bg-omie-blue justify-end' : 'bg-slate-200 justify-start'}`}>
                       <div className="w-3 h-3 bg-white rounded-full shadow-sm" />
                    </button>
                 </div>
              </div>

              {solicitacao?.status === 'EM_COTACAO' ? (
                <div className="space-y-8">
                   <div className="p-4 bg-omie-blue/5 rounded-2xl border border-omie-blue/10 flex items-center gap-4">
                      <AlertCircle className="text-omie-blue" size={24} />
                      <p className="text-[10px] font-bold text-omie-blue uppercase leading-tight">Mesa aberta para escalação. Selecione fornecedores cadastrados para disparar a PO.</p>
                   </div>
                   <div className="space-y-2 max-h-[500px] overflow-y-auto pr-3 custom-scrollbar">
                      {fornecedores.map(f => (
                        <label key={f.id} className={`flex items-center gap-4 p-5 rounded-[1.5rem] border transition-all cursor-pointer ${selectedSuppliers.includes(f.id) ? 'bg-white border-omie-blue shadow-xl scale-[1.02]' : 'bg-slate-50/50 border-transparent hover:border-slate-200'}`}>
                           <input type="checkbox" checked={selectedSuppliers.includes(f.id)} onChange={(e) => {
                             if(e.target.checked) setSelectedSuppliers([...selectedSuppliers, f.id]);
                             else setSelectedSuppliers(selectedSuppliers.filter(sid => sid !== f.id));
                           }} className="hidden" />
                           <div className="flex-1">
                              <p className="text-[11px] font-black text-slate-800 uppercase tracking-tighter italic leading-none">{f.nome_fantasia}</p>
                              <div className="flex justify-between items-center mt-3">
                                 <span className="text-[9px] font-black text-omie-blue uppercase tracking-widest">HISTORY: {f.score_historico}/5.0</span>
                              </div>
                           </div>
                        </label>
                      ))}
                   </div>
                   <button onClick={handleDispararPO} disabled={processing || selectedSuppliers.length === 0}
                     className="w-full bg-slate-900 text-white font-black text-[11px] py-5 rounded-[1.5rem] hover:bg-black transition-all shadow-2xl shadow-slate-200 uppercase tracking-widest flex items-center justify-center gap-3 border-b-4 border-black">
                     <FileText size={20} /> DISPARAR LEILÃO / ENVIAR PO
                   </button>
                </div>
              ) : (
                <div className="p-10 bg-slate-50 rounded-[2rem] text-center space-y-8">
                   <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto shadow-md text-omie-blue border border-slate-100"><Users size={32} className="animate-pulse" /></div>
                   <h4 className="text-[11px] font-black text-slate-800 uppercase tracking-[0.2em]">Disputa em Aberto</h4>
                   <p className="text-[10px] text-slate-400 font-bold uppercase leading-relaxed tracking-widest italic">
                     PO's enviadas formalmente via link seguro. Mesa travada aguardando cotações via formulário.
                   </p>
                   <div className="pt-6 border-t border-slate-200">
                      <button onClick={() => handleSimularResposta(selectedSuppliers[0])} disabled={processing}
                        className="text-[9px] font-black text-white bg-slate-900 px-8 py-3 rounded-full hover:opacity-85 transition-all uppercase shadow-lg shadow-slate-200">
                        [SIMULAR RESPOSTA FORN]
                      </button>
                   </div>
                </div>
              )}
           </div>
        </div>

        {/* Lado Direito: Mesa de Performance (Side-by-Side Comparative) */}
        <div className="2xl:col-span-3 space-y-10">
           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
              {cotacoes.length === 0 ? (
                <div className="col-span-full py-48 text-center bg-white rounded-[3rem] border-2 border-dashed border-slate-200">
                   <ShoppingBag size={64} className="mx-auto text-slate-100 mb-6" />
                   <p className="text-slate-300 text-sm font-black uppercase italic tracking-[0.4em]">Mesa de Performance Vazia</p>
                </div>
              ) : (
                cotacoes.map((cot, index) => (
                  <div key={cot.id} className={`omie-card flex flex-col transition-all duration-700 ${cot.is_winner ? 'border-4 border-emerald-500 scale-[1.03] shadow-2xl z-10' : 'bg-white border-none shadow-2xl shadow-slate-200/30'}`}>
                     <div className={`p-8 flex justify-between items-center ${cot.is_winner ? 'bg-emerald-500 text-white' : 'bg-slate-50 border-b border-slate-100'}`}>
                        <div className="flex items-center gap-4">
                           {cot.is_marketplace ? <Globe size={24} className={cot.is_winner ? 'text-white' : 'text-omie-blue'} /> : <Box size={24} className={cot.is_winner ? 'text-white' : 'text-slate-400'} />}
                           <div>
                              <span className={`text-[9px] font-black uppercase tracking-widest ${cot.is_winner ? 'text-emerald-100' : 'text-slate-400'}`}>{cot.is_marketplace ? 'MARKETPLACE' : 'INDUST./FORNC.'}</span>
                              <h4 className="text-sm font-black uppercase italic tracking-tighter mt-1">{cot.fornecedores?.nome_fantasia}</h4>
                           </div>
                        </div>
                        <div className="text-right">
                           <span className={`text-[9px] font-black uppercase tracking-widest ${cot.is_winner ? 'text-emerald-100' : 'text-omie-blue'}`}>PERFORMANCE</span>
                           <div className="text-2xl font-black tracking-tighter italic">{Number(cot.score_total || cot.score_final).toFixed(1)}%</div>
                        </div>
                     </div>
                     
                     <div className="p-10 flex-1 space-y-8">
                        <div className="flex justify-between items-end border-b border-dashed border-slate-100 pb-6">
                           <div className="flex flex-col">
                              <span className="text-[10px] font-bold text-slate-400 uppercase flex items-center gap-1"><DollarSign size={12} /> Preço da Proposta</span>
                              <span className="text-3xl font-black text-slate-900 tracking-tighter">R$ {Number(cot.preco_total).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
                           </div>
                           <div className="flex flex-col items-end">
                              <span className={`text-[10px] font-black px-3 py-1 rounded-full uppercase ${Number(cot.preco_total) <= Number(solicitacao?.valor_total_estimado) ? 'bg-emerald-50 text-emerald-600' : 'bg-red-50 text-red-600'}`}>
                                 {Math.abs(((Number(cot.preco_total) / Number(solicitacao?.valor_total_estimado)) - 1) * 100).toFixed(1)}% {Number(cot.preco_total) <= Number(solicitacao?.valor_total_estimado) ? 'ABAIXO' : 'ACIMA'}
                              </span>
                           </div>
                        </div>

                        <div className="grid grid-cols-2 gap-6">
                           <div className="bg-slate-50/50 rounded-3xl p-5 border border-slate-100">
                              <span className="text-[9px] font-black text-slate-400 uppercase block mb-2 flex items-center gap-2"><Clock size={12}/> Lead Time</span>
                              <span className="text-sm font-black text-slate-800 uppercase italic tracking-tighter">{cot.prazo_entrega_dias} Dias Úteis</span>
                           </div>
                           <div className="bg-slate-50/50 rounded-3xl p-5 border border-slate-100">
                              <span className="text-[9px] font-black text-slate-400 uppercase block mb-2 flex items-center gap-2"><Truck size={12}/> Logística</span>
                              <span className="text-sm font-black text-slate-800 uppercase italic tracking-tighter">R$ {Number(cot.valor_frete).toLocaleString('pt-BR')} ({cot.incoterm})</span>
                           </div>
                        </div>

                        <div className="pt-2">
                           <span className="text-[9px] font-black text-slate-300 uppercase tracking-[0.3em] block mb-3">Condições Comerciais</span>
                           <p className="text-[11px] font-bold text-slate-500 uppercase italic leading-relaxed tracking-wider">
                              Pagamento: {cot.condicoes_pagamento} | Validade: {new Date(cot.validade_proposta).toLocaleDateString()}
                           </p>
                        </div>
                     </div>

                     <div className="p-10 bg-slate-50 border-t border-slate-100 flex flex-col gap-5">
                        {solicitacao?.status !== 'VENCEDOR_SELECIONADO' ? (
                          <>
                            <div className="relative">
                               <textarea placeholder="Justificativa Técnica de Seleção (Auditável - Mín. 40 chars)..." value={justification} onChange={(e) => setJustification(e.target.value)}
                                 className="w-full text-[11px] p-5 border border-slate-200 rounded-[2rem] outline-none focus:border-omie-blue italic bg-white shadow-inner h-28" />
                               <span className={`absolute bottom-5 right-6 text-[8px] font-black uppercase ${justification.length < 40 ? 'text-red-400' : 'text-emerald-400'}`}>
                                  {justification.length}/40
                               </span>
                            </div>
                            <button onClick={() => handleBaterMartelo(cot.id)} disabled={processing || justification.trim().length < 40}
                              className="w-full bg-emerald-500 text-white font-black text-[11px] py-5 rounded-[1.5rem] hover:bg-emerald-600 transition-all shadow-xl shadow-emerald-200 uppercase tracking-[0.2em] flex items-center justify-center gap-3 border-b-4 border-emerald-700 disabled:opacity-50">
                              <Trophy size={20} /> BATER O MARTELO / SELECIONAR VENCEDOR
                            </button>
                          </>
                        ) : cot.is_winner && (
                          <div className="bg-emerald-500 text-white p-5 rounded-[1.5rem] flex items-center justify-center gap-3 font-black uppercase text-[12px] shadow-2xl tracking-[0.2em]">
                             <CheckCircle2 size={24} /> VENCEDOR DEFINIDO POR AUDITORIA
                          </div>
                        )}
                     </div>
                  </div>
                ))
              )}
           </div>

           {/* Painel Centralizado de Governança */}
           <div className="omie-card p-12 bg-white border-dashed border-2 border-slate-200 flex justify-between items-center opacity-90 mx-auto max-w-5xl">
              <div className="flex gap-8 items-center">
                 <div className="bg-slate-900 p-5 rounded-full text-omie-blue shadow-xl border-4 border-white"><FileText size={32} /></div>
                 <div>
                    <h5 className="text-[12px] font-black text-slate-800 uppercase tracking-[0.2em] italic mb-2">Auditores Ativos: Diego & Gelson</h5>
                    <p className="text-[10px] font-bold text-slate-400 uppercase mt-1 leading-relaxed max-w-xl tracking-widest">
                       Mesa Eletrônica monitorada em tempo real para fins de governança corporativa.
                       Todas as propostas recebidas são permanentes para auditoria fiscal e conformidade ISO.
                    </p>
                 </div>
              </div>
           </div>
        </div>
      </div>

      <style jsx global>{`
        .omie-card { @apply bg-white border border-slate-200 rounded-[3rem] shadow-sm overflow-hidden transition-all duration-300; }
        .custom-scrollbar::-webkit-scrollbar { width: 5px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #cbd5e1; border-radius: 10px; }
      `}</style>
    </div>
  );
}
