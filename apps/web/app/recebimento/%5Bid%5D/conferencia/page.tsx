"use client";

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { createClient } from '../../../../lib/supabase';
import { submitRecebimento } from '../actions';
import { 
  Package, CheckCircle2, AlertTriangle, ArrowLeft, Camera, 
  Plus, Minus, FileText, ShoppingBag, ShieldCheck, Box, Info
} from 'lucide-react';
import Link from 'next/link';

/**
 * Conferência Digital Almoxarifado - Fase 2 (V2 Final)
 * @architect-spaceX @qa-lead @security-auditor
 */
export default function ConferenciaPage() {
  const { id } = useParams();
  const router = useRouter();
  const supabase = createClient();
  
  const [solicitacao, setSolicitacao] = useState<any>(null);
  const [itens, setItens] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);

  // Form states
  const [nfNumero, setNfNumero] = useState("");
  const [nfSerie, setNfSerie] = useState("");
  const [observacoes, setObservacoes] = useState("");
  const [conferenciaItens, setConferenciaItens] = useState<any[]>([]);

  useEffect(() => {
    async function initConferencia() {
      setLoading(true);
      const { data: sol } = await supabase.from('solicitacoes').select('*, centros_custo(*)').schema('vpcn_produtos').eq('id', id).single();
      const { data: items } = await supabase.from('itens_solicitacao').select('*').schema('vpcn_produtos').eq('solicitacao_id', id);
      
      setSolicitacao(sol);
      setItens(items || []);
      setConferenciaItens(items?.map(i => ({
        id: i.id,
        nome: i.descricao,
        quantidade_esperada: Number(i.quantidade),
        quantidade_recebida: Number(i.quantidade),
        status_qualitativo: 'PERFEITO',
        divergencia_descricao: "",
        fotos_url: []
      })) || []);
      setLoading(false);
    }
    initConferencia();
  }, [id, supabase]);

  const updateItem = (itemId: string, field: string, value: any) => {
    setConferenciaItens(prev => prev.map(item => 
      item.id === itemId ? { ...item, [field]: value } : item
    ));
  };

  // Validação Coercitiva
  const isFormValid = nfNumero && nfSerie && conferenciaItens.every(i => {
    if (i.status_qualitativo === 'DIVERGENCIA') {
      return i.divergencia_descricao && i.fotos_url.length > 0;
    }
    return true;
  });

  const handleConfirmar = async () => {
    if (!isFormValid) return alert("❌ Preencha todos os campos obrigatórios e anexe fotos se houver divergência.");

    setProcessing(true);
    const res = await submitRecebimento({
      solicitacaoId: id as string,
      almoxarifeId: "00000000-0000-0000-0000-000000000000",
      nfNumero,
      nfSerie,
      observacoes,
      itens: conferenciaItens
    });

    if (res.success) {
      alert("✅ Recebimento Concluído com Sucesso!");
      router.push('/recebimento');
    } else {
      alert("Erro ao salvar: " + res.error);
    }
    setProcessing(false);
  };

  if (loading) return <div className="p-20 text-center font-black animate-pulse text-slate-400">SINCRONIZANDO DADOS DO LEILÃO...</div>;

  return (
    <div className="flex flex-col min-h-screen bg-[#f1f3f6] pb-24">
      <header className="bg-white border-b border-slate-200 px-10 py-6 flex justify-between items-center sticky top-0 z-30 shadow-sm">
        <div className="flex items-center gap-6">
           <Link href="/recebimento" className="text-slate-400 hover:text-omie-blue transition-colors"><ArrowLeft size={24} /></Link>
           <div>
              <h1 className="text-xl font-black text-slate-800 tracking-tighter uppercase italic leading-none">Conferência Auditável</h1>
              <span className="text-[10px] font-black text-omie-blue uppercase tracking-widest mt-1">Status: Triagem de Carga</span>
           </div>
        </div>
        <div className="px-5 py-2 rounded-2xl text-[10px] font-black uppercase flex items-center gap-2 border shadow-sm bg-white text-omie-blue border-slate-200">
           <Box size={14} /> ID #{solicitacao?.id.substring(0,8)}
        </div>
      </header>

      <main className="p-8 max-w-5xl mx-auto w-full space-y-8">
        {/* Registro NF */}
        <div className="bg-white p-10 rounded-[2.5rem] shadow-xl space-y-8">
           <h2 className="text-xs font-black text-slate-400 uppercase tracking-widest flex items-center gap-2 italic">
              <FileText size={16} /> Identificação Fiscal da Entrega
           </h2>
           <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-1.5">
                 <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Nota Fiscal (Número)</label>
                 <input type="text" value={nfNumero} onChange={(e) => setNfNumero(e.target.value)} placeholder="000.000.000" 
                   className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-6 py-5 font-black text-slate-800 outline-none focus:border-omie-blue transition-all" />
              </div>
              <div className="space-y-1.5">
                 <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Série</label>
                 <input type="text" value={nfSerie} onChange={(e) => setNfSerie(e.target.value)} placeholder="1" 
                   className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-6 py-5 font-black text-slate-800 outline-none focus:border-omie-blue transition-all" />
              </div>
           </div>
        </div>

        {/* Itens */}
        <div className="space-y-6">
           {conferenciaItens.map((item, index) => (
             <div key={item.id} className={`bg-white p-10 rounded-[3rem] shadow-lg border-2 transition-all ${item.status_qualitativo === 'DIVERGENCIA' ? 'border-amber-400' : 'border-transparent'}`}>
                <div className="flex flex-col lg:flex-row justify-between gap-10">
                   <div className="flex-1 space-y-6">
                      <div className="flex items-center gap-4">
                         <span className="bg-slate-900 text-white w-10 h-10 rounded-2xl flex items-center justify-center font-black text-xs italic">#{index+1}</span>
                         <h3 className="text-lg font-black text-slate-800 uppercase tracking-tighter">{item.nome}</h3>
                      </div>

                      <div className="grid grid-cols-2 gap-6">
                         <div className="bg-slate-50 p-6 rounded-3xl border border-slate-100">
                            <span className="text-[9px] font-black text-slate-400 uppercase block mb-1">Esperado (Leilão)</span>
                            <span className="text-xl font-black text-slate-400 italic">{item.quantidade_esperada}</span>
                         </div>
                         <div className={`p-6 rounded-3xl border flex items-center justify-between ${item.quantidade_recebida !== item.quantidade_esperada ? 'bg-amber-50 border-amber-200' : 'bg-omie-blue/5 border-omie-blue/10'}`}>
                            <div>
                               <span className="text-[9px] font-black text-omie-blue uppercase block mb-1">Bipado (Real)</span>
                               <input type="number" value={item.quantidade_recebida} onChange={(e) => updateItem(item.id, 'quantidade_recebida', Number(e.target.value))}
                                 className="bg-transparent text-xl font-black text-slate-800 w-20 outline-none" />
                            </div>
                            <div className="flex flex-col gap-1">
                               <button onClick={() => updateItem(item.id, 'quantidade_recebida', item.quantidade_recebida + 1)} className="p-1.5 bg-white rounded-lg shadow-sm">+</button>
                               <button onClick={() => updateItem(item.id, 'quantidade_recebida', Math.max(0, item.quantidade_recebida - 1))} className="p-1.5 bg-white rounded-lg shadow-sm">-</button>
                            </div>
                         </div>
                      </div>
                   </div>

                   <div className="flex-1 space-y-6">
                      <div>
                         <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest block mb-4">Integridade Qualitativa</span>
                         <div className="grid grid-cols-3 gap-2">
                            {['PERFEITO', 'EMBALAGEM_INTEGRA', 'DIVERGENCIA'].map(status => (
                              <button key={status} onClick={() => updateItem(item.id, 'status_qualitativo', status)}
                                className={`py-4 rounded-2xl text-[8px] font-black uppercase border transition-all ${item.status_qualitativo === status ? 'bg-omie-blue text-white shadow-xl scale-105 border-omie-blue' : 'bg-white text-slate-400 border-slate-100 hover:bg-slate-50'}`}>
                                {status.replace('_', ' ')}
                              </button>
                            ))}
                         </div>
                      </div>

                      {item.status_qualitativo === 'DIVERGENCIA' && (
                        <div className="space-y-4 animate-in fade-in zoom-in-95 duration-300">
                           <textarea placeholder="Relatório de Divergência Técnico..." value={item.divergencia_descricao} onChange={(e) => updateItem(item.id, 'divergencia_descricao', e.target.value)}
                             className="w-full bg-amber-50 border border-amber-200 rounded-3xl p-6 text-[11px] font-bold italic outline-none focus:border-amber-400 h-24" />
                           <button onClick={() => updateItem(item.id, 'fotos_url', ['mock_photo_url'])} className="w-full flex items-center justify-center gap-2 bg-amber-500 text-white font-black text-[10px] py-4 rounded-2xl uppercase shadow-lg shadow-amber-200">
                              <Camera size={16} /> Anexar Foto de Evidência (Obrigatório)
                           </button>
                        </div>
                      )}
                   </div>
                </div>
             </div>
           ))}
        </div>

        {/* Audit Footer */}
        <section className="bg-slate-900 p-12 rounded-[3.5rem] shadow-2xl space-y-10 text-white">
           <div className="flex items-center gap-6">
              <div className="bg-omie-blue/20 p-5 rounded-3xl border border-omie-blue/20 text-omie-blue"><ShieldCheck size={32} /></div>
              <div>
                 <h4 className="text-base font-black uppercase italic tracking-tighter">Assinatura de Recebimento</h4>
                 <p className="text-[10px] text-slate-400 font-bold uppercase mt-1 leading-relaxed">Você atesta a entrada física desta carga. O sistema notificará automaticamente a equipe de compras.</p>
              </div>
           </div>

           <button onClick={handleConfirmar} disabled={processing || !isFormValid}
             className="w-full bg-omie-blue text-white font-black text-sm py-8 rounded-[2.5rem] hover:opacity-95 transition-all shadow-2xl shadow-blue-500/20 uppercase tracking-[0.25em] flex items-center justify-center gap-4 border-b-8 border-blue-900 disabled:opacity-30 disabled:grayscale">
             <CheckCircle2 size={28} /> CONCLUIR E REGISTRAR NA OMIE
           </button>
        </section>
      </main>
    </div>
  );
}
