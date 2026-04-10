"use client";

import React, { useState } from 'react';
import { 
  ClipboardList, Camera, Wrench, Settings, AlertCircle, 
  Plus, Trash2, ArrowRight, FileText, BadgeDollarSign,
  History, ShieldCheck, Microscope, Info
} from 'lucide-react';

/**
 * Registro de Execução de Manutenção - Módulo Manutenção (Fase 5)
 * @architect-spaceX @qa-lead @approval-engineer
 */
export default function RegistroManutencaoPage() {
  const [loading, setLoading] = useState(false);
  const [pecas, setPecas] = useState<{item: string, qty: number}[]>([]);

  const addPeca = () => setPecas([...pecas, { item: '', qty: 1 }]);
  const removePeca = (idx: number) => setPecas(pecas.filter((_, i) => i !== idx));

  const handleSave = async (e: any) => {
    e.preventDefault();
    setLoading(true);
    await new Promise(r => setTimeout(r, 1500));
    alert("🛠️ Registro de Intervenção Salvo! Verificando estoque de peças trocadas...");
    setLoading(false);
  };

  return (
    <div className="flex flex-col min-h-screen bg-[#f1f4f9] pb-32">
      <header className="bg-white border-b border-slate-200 px-12 py-10 flex justify-between items-center sticky top-0 z-30 shadow-sm border-t-8 border-omie-blue">
        <div className="flex items-center gap-6">
           <div className="bg-omie-blue/10 p-4 rounded-3xl text-omie-blue shadow-inner"><Wrench size={32} /></div>
           <div>
              <h1 className="text-xl font-black text-slate-800 tracking-tighter uppercase italic leading-none">Intervenção Técnica</h1>
              <span className="text-[10px] font-black text-omie-blue uppercase tracking-widest mt-1 block tracking-[0.3em]">Registro de Execução de Campo</span>
           </div>
        </div>
      </header>

      <main className="p-12 max-w-6xl mx-auto w-full space-y-12">
        <form onSubmit={handleSave} className="grid grid-cols-1 lg:grid-cols-3 gap-12">
           
           {/* Lado Esquerdo: Dados da Intervenção */}
           <div className="lg:col-span-2 space-y-12">
              <section className="bg-white p-12 rounded-[4rem] shadow-xl space-y-10 border border-slate-100">
                 <div className="flex items-center gap-4 pb-4 border-b border-slate-50">
                    <ClipboardList className="text-slate-300" size={24} />
                    <h2 className="text-xs font-black text-slate-400 uppercase tracking-widest italic">Dados da Manutenção</h2>
                 </div>

                 <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-2">
                       <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Equipamento/Ativo</label>
                       <select className="w-full bg-slate-50 border-none rounded-2xl px-8 py-5 font-black uppercase text-[10px]">
                          <option>Selecione um ativo cadastrado...</option>
                          <option>Empilhadeira Toyota #102</option>
                          <option>Caminhão Scania - Placa VP001</option>
                       </select>
                    </div>
                    <div className="space-y-2">
                       <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Data da Realização</label>
                       <input type="datetime-local" className="w-full bg-slate-50 border-none rounded-2xl px-8 py-5 font-bold" />
                    </div>
                 </div>

                 <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-2">
                       <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Tipo de Manutenção</label>
                       <div className="grid grid-cols-2 gap-3">
                          <button type="button" className="bg-omie-blue text-white py-4 rounded-xl text-[10px] font-black uppercase italic shadow-lg shadow-blue-500/10">Preventiva</button>
                          <button type="button" className="bg-slate-50 text-slate-400 py-4 rounded-xl text-[10px] font-black uppercase border border-slate-100">Corretiva</button>
                       </div>
                    </div>
                    <div className="space-y-2">
                       <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Horas de Mão de Obra</label>
                       <input type="number" placeholder="0.0h" className="w-full bg-slate-50 border-none rounded-2xl px-8 py-5 font-bold" />
                    </div>
                 </div>

                 <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Descrição Detalhada do Serviço</label>
                    <textarea className="w-full bg-slate-50 border-none rounded-3xl p-8 font-medium italic text-slate-600 min-h-[150px] outline-none focus:ring-2 ring-omie-blue" placeholder="Descreva os reparos realizados, diagnósticos e ajustes técnicos..." />
                 </div>
              </section>

              {/* Seção Dinâmica: Peças Trocadas */}
              <section className="bg-slate-900 p-12 rounded-[4.5rem] shadow-2xl space-y-10 border-b-[12px] border-omie-blue">
                 <div className="flex justify-between items-center">
                    <div className="flex items-center gap-4">
                       <div className="bg-omie-blue/20 p-4 rounded-2xl text-omie-blue border border-omie-blue/20"><Settings size={24} /></div>
                       <div>
                          <h3 className="text-white font-black text-xs uppercase italic tracking-widest leading-none">Peças e Componentes</h3>
                          <span className="text-[9px] font-black text-slate-500 uppercase mt-2 block">Gera requisição automática se fora de estoque</span>
                       </div>
                    </div>
                    <button type="button" onClick={addPeca} className="bg-omie-blue text-white p-4 rounded-2xl hover:bg-white hover:text-omie-blue transition-all">
                       <Plus size={20} />
                    </button>
                 </div>

                 <div className="space-y-4">
                    {pecas.length === 0 ? (
                       <div className="text-center py-10 border-2 border-dashed border-white/5 rounded-3xl">
                          <p className="text-[10px] font-black text-slate-600 uppercase tracking-widest italic">Nenhuma peça trocada registrada</p>
                       </div>
                    ) : (
                       pecas.map((p, i) => (
                          <div key={i} className="grid grid-cols-12 gap-4 items-center bg-white/5 p-4 rounded-2xl group border border-transparent hover:border-white/10 transition-all">
                             <div className="col-span-8">
                                <input placeholder="Nome da Peça / Part Number" className="w-full bg-transparent border-none text-white font-bold text-sm outline-none" />
                             </div>
                             <div className="col-span-3">
                                <input type="number" placeholder="Qtd" className="w-full bg-slate-800 border-none rounded-xl px-4 py-2 font-black text-omie-blue text-center" />
                             </div>
                             <div className="col-span-1 text-right">
                                <button type="button" onClick={() => removePeca(i)} className="text-slate-600 hover:text-red-400 transition-colors"><Trash2 size={18} /></button>
                             </div>
                          </div>
                       ))
                    )}
                 </div>
              </section>
           </div>

           {/* Lado Direito: Evidências e Fechamento */}
           <div className="space-y-10">
              <section className="bg-white p-10 rounded-[4rem] shadow-xl space-y-10 border border-slate-100">
                 <div className="flex items-center gap-4">
                    <Camera className="text-slate-300" size={24} />
                    <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest italic">Laudos e Evidências</h3>
                 </div>

                 <div className="space-y-6">
                    <div className="bg-slate-50 p-8 rounded-3xl border border-dashed border-slate-200 flex flex-col items-center gap-4 hover:border-omie-blue transition-all cursor-pointer">
                       <Camera className="text-slate-300" size={32} />
                       <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest text-center">Fotos Antes/Depois (Mín. 2)</span>
                    </div>

                    <div className="bg-slate-50 p-8 rounded-3xl border border-dashed border-slate-200 flex flex-col items-center gap-4 hover:border-omie-blue transition-all cursor-pointer">
                       <FileText className="text-slate-300" size={32} />
                       <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest text-center">Upload Laudo Técnico (PDF)</span>
                    </div>
                 </div>

                 <div className="space-y-2 pt-6 border-t border-slate-50">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 italic">Número da NF de Serviço</label>
                    <input className="w-full bg-slate-50 border-none rounded-2xl px-8 py-5 font-black text-omie-blue shadow-inner" placeholder="000.000.000" />
                 </div>

                 <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 italic">Valor Total da Intervenção</label>
                    <div className="flex items-center gap-2 bg-omie-blue/5 rounded-2xl px-8 py-5 border border-omie-blue/10">
                       <span className="text-[10px] font-black text-omie-blue uppercase">BRL</span>
                       <input type="number" className="bg-transparent w-full font-black text-slate-800 outline-none" placeholder="0,00" />
                    </div>
                 </div>
              </section>

              <section className="bg-green-50 p-10 rounded-[3.5rem] border border-green-100 flex items-center gap-6">
                 <ShieldCheck className="text-green-500" size={32} />
                 <div>
                    <span className="text-[9px] font-black text-green-600 uppercase tracking-widest">Garantia Integrada</span>
                    <p className="text-[10px] font-bold text-green-800 uppercase leading-tight mt-1">Este registro atualiza automaticamente o ciclo de vida do ativo.</p>
                 </div>
              </section>

              <button type="submit" disabled={loading}
                className="w-full bg-omie-blue text-white font-black text-[12px] py-10 rounded-[3.5rem] hover:opacity-95 transition-all shadow-2xl shadow-blue-500/20 uppercase tracking-[0.3em] flex items-center justify-center gap-4 border-b-8 border-blue-900">
                {loading ? "PROCESSANDO..." : <><History size={20} /> FINALIZAR INTERVENÇÃO</>}
              </button>
           </div>

        </form>
      </main>
    </div>
  );
}
