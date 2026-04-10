"use client";

import React, { useState } from 'react';
import { 
  ClipboardCheck, Camera, ShieldCheck, AlertTriangle, 
  ArrowRight, FileText, BadgeCheck, CheckCircle2,
  PackageCheck, Info, History, ShieldAlert
} from 'lucide-react';

/**
 * Conferência de Recebimento de Carga - Módulo Frete (Fase 6 Final)
 * @architect-spaceX @qa-lead @approval-engineer
 */
export default function FreteConferenciaPage({ params }: { params: { id: string } }) {
  const [loading, setLoading] = useState(false);
  const [integridade, setIntegridade] = useState<boolean | null>(null);

  const handleConfirm = async (e: any) => {
    e.preventDefault();
    setLoading(true);
    await new Promise(r => setTimeout(r, 1500));
    alert("✅ Carga Recebida e Conferida! O pagamento do frete foi liberado e o módulo de origem notificado.");
    setLoading(false);
  };

  return (
    <div className="flex flex-col min-h-screen bg-[#f1f4f9] pb-32">
       <header className="bg-white border-b border-slate-200 px-12 py-10 flex justify-between items-center sticky top-0 z-30 shadow-sm border-t-8 border-omie-blue">
        <div className="flex items-center gap-6">
           <div className="bg-omie-blue/10 p-4 rounded-3xl text-omie-blue shadow-inner"><PackageCheck size={32} /></div>
           <div>
              <h1 className="text-xl font-black text-slate-800 tracking-tighter uppercase italic leading-none">Conferência de Carga</h1>
              <span className="text-[10px] font-black text-omie-blue uppercase tracking-widest mt-1 block tracking-[0.3em]">VerticalParts Site Receipt</span>
           </div>
        </div>
      </header>

      <main className="p-12 max-w-4xl mx-auto w-full space-y-12">
        <form onSubmit={handleConfirm} className="space-y-12">
           
           {/* Seção 1: Checklist de Integridade */}
           <section className="bg-white p-12 rounded-[4.5rem] shadow-xl space-y-10 border border-slate-100">
              <div className="flex items-center gap-4 border-b border-slate-50 pb-6">
                 <ClipboardCheck className="text-slate-300" size={24} />
                 <h2 className="text-xs font-black text-slate-400 uppercase tracking-widest italic">Checklist de Auditoria</h2>
              </div>

              <div className="space-y-8">
                 <div className="flex flex-col md:flex-row justify-between items-center gap-8 bg-slate-50 p-8 rounded-[3rem] border border-slate-100 transition-all">
                    <div>
                       <h3 className="text-sm font-black text-slate-800 uppercase italic leading-tight uppercase font-black tracking-tight">Integridade da Embalagem</h3>
                       <p className="text-[10px] text-slate-500 font-bold uppercase mt-1">A carga apresenta sinais de violação ou umidade?</p>
                    </div>
                    <div className="flex gap-4">
                       <button type="button" onClick={() => setIntegridade(true)}
                          className={`px-10 py-5 rounded-2xl text-[10px] font-black uppercase transition-all ${integridade === true ? 'bg-green-500 text-white shadow-lg' : 'bg-white text-slate-400'}`}>
                          INTACTA
                       </button>
                       <button type="button" onClick={() => setIntegridade(false)}
                          className={`px-10 py-5 rounded-2xl text-[10px] font-black uppercase transition-all ${integridade === false ? 'bg-red-500 text-white shadow-lg' : 'bg-white text-slate-400'}`}>
                          DIVERGENTE
                       </button>
                    </div>
                 </div>

                 <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-2">
                       <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 italic">Número da NF Conferida</label>
                       <input className="w-full bg-slate-50 border-none rounded-2xl px-8 py-5 font-black text-omie-blue shadow-inner" placeholder="P000.123-X" />
                    </div>
                    <div className="space-y-2">
                       <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 italic">Nome do Almoxarife</label>
                       <input className="w-full bg-slate-50 border-none rounded-2xl px-8 py-5 font-black text-slate-800" placeholder="Digite seu nome..." />
                    </div>
                 </div>
              </div>
           </section>

           {/* Seção 2: Evidências Fotográficas */}
           <section className="bg-slate-900 p-12 rounded-[4.5rem] shadow-2xl space-y-10 border-b-[15px] border-omie-blue">
              <div className="flex justify-between items-center border-b border-white/5 pb-6">
                 <div className="flex items-center gap-4">
                    <Camera className="text-omie-blue" size={24} />
                    <h2 className="text-xs font-black text-white uppercase tracking-widest italic font-black uppercase tracking-tight">Evidências do Recebimento</h2>
                 </div>
                 <span className="text-[9px] font-black text-slate-500 uppercase italic">Mínimo 2 Fotos Reais</span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                 <div className="bg-white/5 p-12 rounded-[3.5rem] border border-dashed border-white/10 flex flex-col items-center gap-6 hover:bg-white/10 transition-all cursor-pointer group">
                    <div className="bg-omie-blue/20 p-6 rounded-3xl text-omie-blue group-hover:scale-110 transition-transform"><Camera size={32} /></div>
                    <div className="text-center">
                       <span className="text-[10px] font-black text-white uppercase block mb-1">Foto da Carga</span>
                       <span className="text-[9px] font-bold text-slate-500 uppercase tracking-widest">Estado visual da embalagem</span>
                    </div>
                 </div>
                 <div className="bg-white/5 p-12 rounded-[3.5rem] border border-dashed border-white/10 flex flex-col items-center gap-6 hover:bg-white/10 transition-all cursor-pointer group">
                    <div className="bg-omie-blue/20 p-6 rounded-3xl text-omie-blue group-hover:scale-110 transition-transform"><FileText size={32} /></div>
                    <div className="text-center">
                       <span className="text-[10px] font-black text-white uppercase block mb-1">Foto do Canhoto</span>
                       <span className="text-[9px] font-bold text-slate-500 uppercase tracking-widest">Documento assinado carimbado</span>
                    </div>
                 </div>
              </div>

              <div className="space-y-4 pt-4">
                 <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1 italic">Observações de Recebimento</label>
                 <textarea className="w-full bg-slate-800 border-none rounded-3xl p-10 font-medium italic text-slate-400 min-h-[150px] outline-none" 
                    placeholder="Descreva qualquer divergência, caixa amassada ou falta de lacre..." />
              </div>
           </section>

           {/* Botão de Fechamento */}
           <div className="flex flex-col items-center gap-8">
              <div className="flex items-center gap-4 text-slate-400 bg-white/50 px-10 py-4 rounded-full border border-slate-100">
                 <ShieldCheck size={20} className="text-green-500" />
                 <span className="text-[10px] font-black uppercase italic tracking-widest">Auditoria Digital VerticalParts Ativa</span>
              </div>
              
              <button type="submit" disabled={loading || integridade === null}
                 className="w-full max-w-md bg-omie-blue text-white font-black text-[12px] py-12 rounded-[4rem] hover:opacity-95 transition-all shadow-2xl shadow-blue-500/20 uppercase tracking-[0.3em] flex items-center justify-center gap-4 border-b-8 border-blue-900 -mt-4 disabled:opacity-30 disabled:grayscale">
                 {loading ? "PROCESSANDO..." : <><BadgeCheck size={24} /> CONFIRMAR RECEBIMENTO</>}
              </button>
           </div>

        </form>
      </main>
    </div>
  );
}
