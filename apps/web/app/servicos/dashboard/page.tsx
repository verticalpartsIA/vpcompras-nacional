"use client";

import React from 'react';
import { 
  BarChart3, Settings, HardHat, AlertCircle, TrendingUp, Users, 
  Clock, MapPin, ArrowRight, ShieldCheck, ChevronRight, Gavel,
  History, Calendar
} from 'lucide-react';

/**
 * Dashboard de Gestão de Serviços e Engenharia - VerticalParts
 * @architect-spaceX @omie-expert @qa-lead
 */
export default function ServicosDashboardPage() {
  return (
    <div className="flex flex-col min-h-screen bg-[#f1f4f9] pb-24">
      <header className="bg-white border-b border-slate-200 px-12 py-10 flex justify-between items-center sticky top-0 z-30 shadow-sm border-t-8 border-omie-blue">
        <div className="flex items-center gap-6">
           <div className="bg-omie-blue/10 p-4 rounded-2xl text-omie-blue"><Settings size={32} /></div>
           <div>
              <h1 className="text-xl font-black text-slate-800 tracking-tighter uppercase italic leading-none">Intelligence Serviços</h1>
              <span className="text-[10px] font-black text-omie-blue uppercase tracking-widest mt-1 block tracking-[0.3em]">Gestão de Contratos e Engenharia</span>
           </div>
        </div>
      </header>

      <main className="p-12 max-w-7xl mx-auto w-full space-y-12">
        {/* KPIs Principais */}
        <section className="grid grid-cols-1 md:grid-cols-4 gap-8">
           {[
             { label: 'Obras no Prazo', val: '92%', sub: 'Meta: 95%', icon: Calendar, color: 'text-omie-blue' },
             { label: 'Glosas Técnicas', val: 'R$ 12.4k', sub: '3 Fornecedores', icon: Gavel, color: 'text-red-500' },
             { label: 'Vistorias Pendentes', val: '08', sub: 'Ação Urgente', icon: AlertCircle, color: 'text-amber-500' },
             { label: 'Contratos Ativos', val: '14', sub: 'Total: R$ 840k', icon: TrendingUp, color: 'text-slate-800' }
           ].map((kpi, i) => (
             <div key={i} className="bg-white p-8 rounded-[3rem] shadow-xl space-y-4 border border-slate-100 group hover:scale-[1.02] transition-transform">
                <div className="flex justify-between items-center">
                   <kpi.icon className={kpi.color} size={24} />
                   <span className="text-[10px] font-black text-slate-300 uppercase italic">Metric #{i+1}</span>
                </div>
                <div>
                   <span className="text-4xl font-black text-slate-800 tracking-tighter italic block">{kpi.val}</span>
                   <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-3 block">{kpi.label}</span>
                   <span className={`text-[9px] font-black uppercase mt-2 block ${kpi.val.includes('92%') ? 'text-green-500' : 'text-slate-400'}`}>{kpi.sub}</span>
                </div>
             </div>
           ))}
        </section>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
           {/* Ranking de Qualidade (Lado Esquerdo) */}
           <div className="lg:col-span-2 space-y-8">
              <div className="flex items-center justify-between px-6">
                 <h2 className="text-xs font-black text-slate-400 uppercase tracking-[0.3em] flex items-center gap-2 italic"><Users size={16} /> Performance de Fornecedor</h2>
                 <span className="text-[10px] font-black text-omie-blue uppercase">Top 3 Auditados</span>
              </div>
              
              <div className="space-y-4">
                 {[
                   { name: 'Engenharia Alfa Ltda', rate: '98%', glosa: 'R$ 0', status: 'Excelente' },
                   { name: 'Montagens do Sul', rate: '85%', glosa: 'R$ 3.500', status: 'Alerta' },
                   { name: 'Conectividade Express', rate: '72%', glosa: 'R$ 8.900', status: 'Risco' }
                 ].map((forn, idx) => (
                   <div key={idx} className="bg-white p-10 rounded-[3.5rem] shadow-lg border border-slate-50 flex items-center justify-between transition-all hover:bg-slate-50 group">
                      <div className="flex items-center gap-8">
                         <div className={`w-14 h-14 rounded-2xl flex items-center justify-center font-black italic shadow-inner ${idx === 0 ? 'bg-green-50 text-green-500' : 'bg-red-50 text-red-500'}`}>
                            {idx + 1}º
                         </div>
                         <div>
                            <h3 className="text-sm font-black text-slate-800 uppercase italic tracking-tighter">{forn.name}</h3>
                            <div className="flex items-center gap-6 mt-2">
                               <span className="text-[10px] font-bold text-slate-400 uppercase italic flex items-center gap-1">
                                  <ShieldCheck size={12} /> Compliance: {forn.rate}
                               </span>
                               <span className="text-[10px] font-bold text-red-400 uppercase italic">Glosas: {forn.glosa}</span>
                            </div>
                         </div>
                      </div>
                      <div className="text-right">
                         <span className={`text-[9px] font-black uppercase px-4 py-1.5 rounded-full italic ${idx === 0 ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'}`}>
                            {forn.status}
                         </span>
                      </div>
                   </div>
                 ))}
              </div>
           </div>

           {/* Histórico de Vistorias (Lado Direito) */}
           <section className="bg-slate-900 p-10 rounded-[4rem] shadow-2xl space-y-10 border-b-[10px] border-omie-blue relative overflow-hidden">
              <div className="relative z-10">
                 <h2 className="text-xs font-black text-white uppercase tracking-[0.2em] italic mb-2">Últimas Vistorias</h2>
                 <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">Registros de campo validados hoje.</p>
              </div>

              <div className="space-y-6 relative z-10">
                 {[1, 2, 3].map(id => (
                   <div key={id} className="flex gap-4 group">
                      <div className="w-1 bg-omie-blue/30 rounded-full group-hover:bg-omie-blue transition-colors" />
                      <div>
                         <span className="text-[9px] font-black text-omie-blue uppercase">Há 2 horas • Site Matriz</span>
                         <h4 className="text-[11px] font-black text-white uppercase tracking-tight mt-1">Concluída Medição Elétrica #20{id}</h4>
                         <div className="flex gap-2 mt-2">
                            <span className="text-[8px] font-black text-slate-400 uppercase bg-white/5 px-2 py-0.5 rounded italic">Fotos OK</span>
                            <span className="text-[8px] font-black text-green-400 uppercase bg-green-900/20 px-2 py-0.5 rounded italic">Conforme</span>
                         </div>
                      </div>
                   </div>
                 ))}
              </div>

              <button className="w-full bg-white/5 border border-white/10 text-white py-6 rounded-[2.5rem] font-black text-[10px] uppercase tracking-widest hover:bg-white hover:text-omie-blue transition-all relative z-10">
                 Relatórios Consolidados
              </button>
              
              {/* Grafismo de Fundo */}
              <div className="absolute top-0 right-0 p-4 opacity-5 rotate-12">
                 <Settings size={200} />
              </div>
           </section>
        </div>
      </main>
    </div>
  );
}
