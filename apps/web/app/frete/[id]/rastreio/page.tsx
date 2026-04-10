"use client";

import React, { useState, useEffect } from 'react';
import { 
  Package, Truck, MapPin, Calendar, Clock, 
  CheckCircle2, AlertCircle, Phone, Info,
  ChevronRight, ArrowLeft, History, Search
} from 'lucide-react';

/**
 * Portal de Rastreio de Carga - VerticalParts Logistics
 * @architect-spaceX @qa-lead
 */
export default function FreteRastreioPage({ params }: { params: { id: string } }) {
  const [status, setStatus] = useState('EM_TRANSITO'); // Mock status

  const steps = [
    { id: 'COLETADO', label: 'Coletado', icon: Package },
    { id: 'EM_TRANSITO', label: 'Em Trânsito', icon: Truck },
    { id: 'SAIU_ENTREGA', label: 'Saiu para Entrega', icon: MapPin },
    { id: 'ENTREGUE', label: 'Entregue', icon: CheckCircle2 }
  ];

  const currentStepIdx = steps.findIndex(s => s.id === status);

  return (
    <div className="flex flex-col min-h-screen bg-[#f1f4f9] pb-32">
       <header className="bg-white border-b border-slate-200 px-12 py-10 flex justify-between items-center sticky top-0 z-30 shadow-sm border-t-8 border-omie-blue">
        <div className="flex items-center gap-6">
           <div className="bg-omie-blue/10 p-4 rounded-3xl text-omie-blue shadow-inner"><Truck size={32} /></div>
           <div>
              <h1 className="text-xl font-black text-slate-800 tracking-tighter uppercase italic leading-none">Rastreio de Carga</h1>
              <span className="text-[10px] font-black text-omie-blue uppercase tracking-widest mt-1 block tracking-[0.3em]">VerticalParts Supply Chain</span>
           </div>
        </div>
        <div className="flex bg-red-50 px-6 py-3 rounded-2xl gap-3 items-center border border-red-100 animate-pulse">
           <AlertCircle className="text-red-500" size={18} />
           <span className="text-[10px] font-black text-red-600 uppercase italic">Atraso Estimado: 02h</span>
        </div>
      </header>

      <main className="p-12 max-w-5xl mx-auto w-full space-y-12">
        {/* Barra de Progresso Visual */}
        <section className="bg-white p-12 rounded-[4rem] shadow-xl border border-slate-100">
           <div className="flex justify-between items-center relative gap-4">
              {/* Linha de fundo */}
              <div className="absolute top-1/2 left-0 w-full h-1 bg-slate-100 -translate-y-1/2 z-0 rounded-full" />
              <div className="absolute top-1/2 left-0 h-1 bg-omie-blue -translate-y-1/2 z-0 rounded-full transition-all duration-1000" 
                 style={{ width: `${(currentStepIdx / (steps.length - 1)) * 100}%` }} 
              />

              {steps.map((step, idx) => {
                const isActive = idx <= currentStepIdx;
                const isCurrent = idx === currentStepIdx;
                return (
                  <div key={step.id} className="relative z-10 flex flex-col items-center gap-4 group">
                     <div className={`w-16 h-16 rounded-[1.5rem] flex items-center justify-center transition-all duration-500 border-4 ${
                       isActive ? 'bg-omie-blue text-white border-white shadow-lg shadow-blue-500/30' : 'bg-white text-slate-300 border-slate-50'
                     } ${isCurrent ? 'scale-125' : ''}`}>
                        <step.icon size={28} />
                     </div>
                     <span className={`text-[9px] font-black uppercase tracking-widest ${isActive ? 'text-slate-800' : 'text-slate-300'}`}>
                        {step.label}
                     </span>
                  </div>
                );
              })}
           </div>
        </section>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
           {/* Detalhes da Entrega */}
           <div className="lg:col-span-2 space-y-12">
              <section className="bg-slate-900 p-12 rounded-[4.5rem] shadow-2xl space-y-10 border-b-[15px] border-omie-blue">
                 <div className="flex items-center gap-4 border-b border-white/5 pb-6">
                    <History className="text-omie-blue" size={24} />
                    <h2 className="text-xs font-black text-white uppercase tracking-widest italic">Histórico de Eventos</h2>
                 </div>

                 <div className="space-y-8">
                    {[
                      { data: '10/04/2026 - 14:30', event: 'Em trânsito entre filiais', local: 'Barueri, SP' },
                      { data: '10/04/2026 - 09:15', event: 'Coleta Realizada', local: 'VerticalParts Site Alfa' },
                      { data: '09/04/2026 - 18:00', event: 'Leilão Finalizado - Transportadora Selecionada', local: 'Sistema ERP' }
                    ].map((ev, i) => (
                      <div key={i} className="flex gap-6 items-start group">
                         <div className="text-right min-w-[120px]">
                            <span className="text-[9px] font-black text-slate-500 block leading-tight">{ev.data}</span>
                         </div>
                         <div className="w-2 h-2 rounded-full bg-omie-blue mt-1.5 shadow-[0_0_8px_rgba(0,89,255,0.8)]" />
                         <div>
                            <h4 className="text-[11px] font-black text-white uppercase tracking-tight">{ev.event}</h4>
                            <span className="text-[9px] font-bold text-slate-500 uppercase italic block mt-1">{ev.local}</span>
                         </div>
                      </div>
                    ))}
                 </div>
              </section>
           </div>

           {/* Info Transportadora */}
           <div className="space-y-10">
              <section className="bg-white p-10 rounded-[4rem] shadow-xl border border-slate-100 space-y-8">
                 <div className="flex items-center gap-4">
                    <Phone className="text-slate-300" size={24} />
                    <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest italic">Info Transportadora</h3>
                 </div>

                 <div className="space-y-6">
                    <div className="bg-slate-50 p-6 rounded-3xl">
                       <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest block mb-2">Empresa Atendente</span>
                       <p className="text-lg font-black text-slate-800 italic uppercase leading-none">Jadlog Express SP</p>
                    </div>
                    <div className="flex items-center justify-between border-t border-slate-50 pt-6">
                       <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Código Rastreio</span>
                       <span className="text-[10px] font-black text-omie-blue uppercase">JDL-9988C-26</span>
                    </div>
                    <div className="flex items-center justify-between">
                       <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">ETA (Previsão)</span>
                       <span className="text-[10px] font-black text-slate-800 uppercase italic">11/04 - 10:00h</span>
                    </div>
                 </div>

                 <button className="w-full bg-omie-blue text-white py-6 rounded-[2.5rem] font-black text-[10px] uppercase tracking-[0.2em] shadow-xl hover:opacity-90">
                    Falar com Motorista
                 </button>
              </section>

              <section className="bg-white p-10 rounded-[3.5rem] border border-slate-100 flex items-center gap-6">
                 <div className="bg-blue-50 p-4 rounded-2xl text-omie-blue"><Info size={24} /></div>
                 <div>
                    <span className="text-[9px] font-black text-omie-blue uppercase tracking-widest">Carga Assegurada</span>
                    <p className="text-[10px] font-bold text-slate-500 uppercase leading-snug mt-1 italic">Apólice ativa para R$ 15.000,00</p>
                 </div>
              </section>
           </div>
        </div>
      </main>
    </div>
  );
}
