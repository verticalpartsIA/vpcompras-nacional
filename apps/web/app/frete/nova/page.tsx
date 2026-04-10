"use client";

import React, { useState } from 'react';
import { 
  Truck, Package, MapPin, Calendar, Info, 
  ArrowRight, ShieldCheck, BadgeDollarSign, 
  Layers, Ruler, Weight, AlertCircle, 
  ChevronRight, Search
} from 'lucide-react';

/**
 * Solicitação de Frete Integrada - VerticalParts Logistics
 * @architect-spaceX @omie-expert @qa-lead
 */
export default function NovaSolicitacaoFretePage() {
  const [loading, setLoading] = useState(false);
  const [moduloOrigem, setModuloOrigem] = useState('PRODUTOS');

  const handleSave = async (e: any) => {
    e.preventDefault();
    setLoading(true);
    await new Promise(r => setTimeout(r, 1200));
    alert("🚛 Solicitação de Frete gerada com sucesso! O leilão de transportadoras foi iniciado.");
    setLoading(false);
  };

  return (
    <div className="flex flex-col min-h-screen bg-[#f1f4f9] pb-32">
      <header className="bg-white border-b border-slate-200 px-12 py-10 flex justify-between items-center sticky top-0 z-30 shadow-sm border-t-8 border-omie-blue">
        <div className="flex items-center gap-6">
           <div className="bg-omie-blue/10 p-4 rounded-3xl text-omie-blue shadow-inner"><Truck size={32} /></div>
           <div>
              <h1 className="text-xl font-black text-slate-800 tracking-tighter uppercase italic leading-none">Expedição & Frete</h1>
              <span className="text-[10px] font-black text-omie-blue uppercase tracking-widest mt-1 block tracking-[0.3em]">VerticalParts Logistics Bridge</span>
           </div>
        </div>
      </header>

      <main className="p-12 max-w-6xl mx-auto w-full space-y-12">
        <form onSubmit={handleSave} className="grid grid-cols-1 lg:grid-cols-3 gap-12">
           
           {/* Lado Esquerdo: Dados do Transporte */}
           <div className="lg:col-span-2 space-y-12">
              <section className="bg-white p-12 rounded-[4rem] shadow-xl space-y-10 border border-slate-100">
                 <div className="flex items-center justify-between pb-6 border-b border-slate-50">
                    <div className="flex items-center gap-4">
                       <Layers className="text-slate-300" size={24} />
                       <h2 className="text-xs font-black text-slate-400 uppercase tracking-widest italic">01. Origem e Vínculo</h2>
                    </div>
                 </div>

                 <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-2">
                       <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Vincular ao Módulo de Origem</label>
                       <div className="grid grid-cols-3 gap-2">
                          {['PRODUTOS', 'SERVICOS', 'MANUTENCAO'].map(m => (
                            <button key={m} type="button" onClick={() => setModuloOrigem(m)} 
                               className={`py-3 rounded-xl text-[9px] font-black uppercase transition-all border ${moduloOrigem === m ? 'bg-omie-blue text-white border-omie-blue shadow-lg' : 'bg-slate-50 text-slate-400 border-slate-100'}`}>
                               {m}
                            </button>
                          ))}
                       </div>
                    </div>
                    <div className="space-y-2">
                       <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Número do Pedido/Soli.</label>
                       <div className="flex items-center bg-slate-50 rounded-2xl px-6 py-4 border border-slate-100 group">
                          <Search size={18} className="text-slate-300" />
                          <input placeholder="Busque pelo ID..." className="bg-transparent w-full outline-none font-bold text-slate-800 px-4" />
                       </div>
                    </div>
                 </div>

                 <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-2">
                       <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Ponto de Coleta (Origem)</label>
                       <div className="flex items-center bg-slate-50 rounded-2xl px-6 py-4 border border-slate-100 font-bold text-slate-700">
                          <MapPin size={18} className="text-omie-blue mr-3" />
                          <input placeholder="Endereço ou Site VerticalParts..." className="bg-transparent w-full outline-none" />
                       </div>
                    </div>
                    <div className="space-y-2">
                       <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Ponto de Entrega (Destino)</label>
                       <div className="flex items-center bg-slate-50 rounded-2xl px-6 py-4 border border-slate-100 font-bold text-slate-700">
                          <MapPin size={18} className="text-red-500 mr-3" />
                          <input placeholder="Endereço final da carga..." className="bg-transparent w-full outline-none" />
                       </div>
                    </div>
                 </div>
              </section>

              <section className="bg-white p-12 rounded-[4.5rem] shadow-xl space-y-10 border border-slate-100 relative group">
                 <div className="flex items-center gap-4 pb-6 border-b border-slate-50">
                    <Package className="text-slate-300" size={24} />
                    <h2 className="text-xs font-black text-slate-400 uppercase tracking-widest italic">02. Especificações da Carga</h2>
                 </div>

                 <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    <div className="space-y-2">
                       <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Tipo de Carga</label>
                       <select className="w-full bg-slate-50 border-none rounded-2xl px-8 py-5 font-black uppercase text-[10px]">
                          <option>PRODUTO FINAL</option>
                          <option>FERRAMENTAL OBRA</option>
                          <option>DOCUMENTO/LEGAL</option>
                          <option>MATÉRIA PRIMA</option>
                       </select>
                    </div>
                    <div className="space-y-2">
                       <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Modal Preferencial</label>
                       <select className="w-full bg-slate-50 border-none rounded-2xl px-8 py-5 font-black uppercase text-[10px]">
                          <option>RODOVIÁRIO (Padrão)</option>
                          <option>AÉREO (Urgente)</option>
                          <option>EXPRESSO (Motoboy)</option>
                          <option>ENTREGA PRÓPRIA</option>
                       </select>
                    </div>
                    <div className="space-y-2">
                       <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Data Necessária Entrega</label>
                       <input type="date" className="w-full bg-omie-blue/5 border-none rounded-2xl px-8 py-5 font-black text-omie-blue shadow-inner" />
                    </div>
                 </div>

                 <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                    <div className="bg-slate-50 p-6 rounded-3xl space-y-2">
                       <Ruler size={16} className="text-slate-400" />
                       <span className="text-[9px] font-black text-slate-500 uppercase">Dimensões (cm)</span>
                       <input placeholder="100x50x20" className="bg-transparent w-full text-xs font-bold outline-none" />
                    </div>
                    <div className="bg-slate-50 p-6 rounded-3xl space-y-2">
                       <Weight size={16} className="text-slate-400" />
                       <span className="text-[9px] font-black text-slate-500 uppercase">Peso (KG)</span>
                       <input type="number" placeholder="0.00" className="bg-transparent w-full text-xs font-bold outline-none" />
                    </div>
                    <div className="md:col-span-2 bg-slate-50 p-6 rounded-3xl space-y-2 border-l-4 border-omie-blue">
                       <BadgeDollarSign size={16} className="text-omie-blue" />
                       <span className="text-[9px] font-black text-slate-500 uppercase">Valor Declarado p/ Seguro</span>
                       <div className="flex items-center gap-2">
                          <span className="text-[10px] font-black text-omie-blue">BRL</span>
                          <input type="number" placeholder="0,00" className="bg-transparent w-full text-lg font-black tracking-tighter outline-none" />
                       </div>
                    </div>
                 </div>
              </section>
           </div>

           {/* Lado Direito: Resumo e Disparo */}
           <div className="space-y-10">
              <section className="bg-slate-900 p-12 rounded-[4rem] shadow-2xl space-y-10 border-b-[15px] border-omie-blue">
                 <div className="flex items-center gap-4">
                    <AlertCircle className="text-omie-blue" size={24} />
                    <h3 className="text-white font-black text-xs uppercase italic tracking-widest">Observações de Manuseio</h3>
                 </div>
                 <textarea className="w-full bg-slate-800 border-none rounded-3xl p-8 font-medium italic text-slate-400 min-h-[150px] text-[10px] outline-none" 
                    placeholder="Ex: Carga frágil, não empilhar, exige veículo refrigerado..." />
                 
                 <div className="space-y-6 pt-6 border-t border-white/5">
                    <div className="flex justify-between items-center text-white">
                       <span className="text-[10px] font-black uppercase text-slate-500">Transportadoras no Leilão</span>
                       <span className="text-xl font-black italic">08 Ativas</span>
                    </div>
                    <div className="flex justify-between items-center text-white">
                       <span className="text-[10px] font-black uppercase text-slate-500">Tipo de Contratação</span>
                       <span className="text-[10px] font-black uppercase bg-omie-blue px-4 py-1.5 rounded-full italic">CFR (Leilão)</span>
                    </div>
                 </div>

                 <button type="submit" disabled={loading}
                    className="w-full bg-omie-blue text-white font-black text-[11px] py-10 rounded-[3.5rem] hover:opacity-95 transition-all shadow-2xl shadow-blue-500/20 uppercase tracking-[0.3em] flex items-center justify-center gap-4 border-b-8 border-blue-900">
                    {loading ? "DISPARANDO LEILÃO..." : <><ShieldCheck size={20} /> INICIAR EXPEDIÇÃO</>}
                 </button>
              </section>

              <section className="bg-white p-10 rounded-[4rem] shadow-xl border border-slate-100 flex items-center gap-6">
                 <div className="bg-green-50 p-4 rounded-2xl text-green-500"><Info size={24} /></div>
                 <div>
                    <span className="text-[9px] font-black text-green-500 uppercase tracking-widest">Logística Integrada</span>
                    <p className="text-[10px] font-bold text-slate-500 uppercase leading-snug mt-1 italic">Este frete será vinculado ao faturamento do Módulo de Origem.</p>
                 </div>
              </section>
           </div>

        </form>
      </main>
    </div>
  );
}
