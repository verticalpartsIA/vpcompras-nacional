"use client";

import React from 'react';
import { 
  BarChart3, Plane, Calendar, AlertCircle, TrendingUp, Users, 
  Clock, MapPin, ArrowRight, ShieldCheck, ChevronRight
} from 'lucide-react';

/**
 * Dashboard Executivo de Viagens - VerticalParts
 * @architect-spaceX @omie-expert @qa-lead
 */
export default function ViagensDashboardPage() {
  return (
    <div className="flex flex-col min-h-screen bg-[#f1f4f9] pb-24">
      <header className="bg-white border-b border-slate-200 px-12 py-10 flex justify-between items-center sticky top-0 z-30 shadow-sm">
        <div className="flex items-center gap-6">
           <Plane className="text-omie-blue" size={32} />
           <div>
              <h1 className="text-xl font-black text-slate-800 tracking-tighter uppercase italic leading-none">Intelligence Viagens</h1>
              <span className="text-[10px] font-black text-omie-blue uppercase tracking-widest mt-1 block">Controle de Deslocamento Corporativo</span>
           </div>
        </div>
        <div className="flex gap-4">
           <button className="bg-omie-blue text-white px-8 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:opacity-90 shadow-lg shadow-blue-500/20">
              Solicitar Viagem
           </button>
        </div>
      </header>

      <main className="p-12 max-w-7xl mx-auto w-full space-y-12">
        {/* KPIs Principais */}
        <section className="grid grid-cols-1 md:grid-cols-4 gap-8">
           {[
             { label: 'Viagens no Mês', val: '24', sub: '+12% vs ago', icon: Calendar, color: 'text-omie-blue' },
             { label: '% Programadas', val: '82%', sub: 'Meta: 90%', icon: ShieldCheck, color: 'text-green-500' },
             { label: 'Urgência (Last-Minute)', val: '18%', sub: '4 Solicitações', icon: AlertCircle, color: 'text-red-500' },
             { label: 'Investimento Total', val: 'R$ 48.2k', sub: 'Budget: R$ 60k', icon: TrendingUp, color: 'text-slate-800' }
           ].map((kpi, i) => (
             <div key={i} className="bg-white p-8 rounded-[3rem] shadow-xl space-y-4 border border-slate-100 group hover:scale-[1.02] transition-transform">
                <div className="flex justify-between items-center">
                   <kpi.icon className={kpi.color} size={24} />
                   <span className="text-[10px] font-black text-slate-300 uppercase italic">KPI #{i+1}</span>
                </div>
                <div>
                   <span className="text-4xl font-black text-slate-800 tracking-tighter italic block leading-none">{kpi.val}</span>
                   <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-3 block leading-none">{kpi.label}</span>
                   <span className={`text-[9px] font-black uppercase tracking-tight mt-2 block ${kpi.sub.includes('+') || kpi.sub.includes('Meta') ? 'text-green-500' : 'text-slate-400'}`}>{kpi.sub}</span>
                </div>
             </div>
           ))}
        </section>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
           {/* Fila de Aprovação (Lado Esquerdo) */}
           <div className="lg:col-span-2 space-y-8">
              <div className="flex items-center justify-between px-6">
                 <h2 className="text-xs font-black text-slate-400 uppercase tracking-[0.3em] flex items-center gap-2 italic"><Clock size={16} /> Fila de Aprovação</h2>
                 <span className="text-[10px] font-black text-omie-blue uppercase tracking-widest">3 Pendentes</span>
              </div>
              
              <div className="space-y-4">
                 {[1, 2, 3].map(id => (
                   <div key={id} className="bg-white p-8 rounded-[2.5rem] shadow-lg border border-slate-50 flex items-center justify-between group hover:border-omie-blue/20 transition-all">
                      <div className="flex items-center gap-6">
                         <div className="w-16 h-16 bg-slate-50 rounded-2xl flex items-center justify-center text-slate-200"><MapPin size={24} /></div>
                         <div>
                            <span className="text-[9px] font-black text-omie-blue uppercase tracking-widest italic block mb-1">Solicitação #2024-00{id}</span>
                            <h3 className="text-sm font-black text-slate-800 uppercase italic tracking-tighter">Curitiba → São Paulo (Visita Cliente)</h3>
                            <div className="flex items-center gap-4 mt-2">
                               <span className="text-[10px] font-bold text-slate-400 uppercase">Solicitante: Joao Silva</span>
                               <span className="text-[10px] font-black text-red-500 bg-red-50 px-2 py-0.5 rounded-lg uppercase italic">Urgente</span>
                            </div>
                         </div>
                      </div>
                      <button className="bg-slate-900 text-white p-4 rounded-2xl hover:bg-omie-blue transition-colors group-hover:translate-x-1 duration-300">
                         <ArrowRight size={20} />
                      </button>
                   </div>
                 ))}
              </div>
           </div>

           {/* Painel de Auditoria (Lado Direito) */}
           <section className="bg-white p-10 rounded-[4rem] shadow-xl border border-slate-50 space-y-10">
              <div>
                 <h2 className="text-xs font-black text-slate-400 uppercase tracking-[0.2em] italic mb-2">Painel de Auditoria</h2>
                 <p className="text-[10px] text-slate-400 font-bold uppercase leading-relaxed">Top Solicitantes com maior índice de Urgência (Last Minute).</p>
              </div>

              <div className="space-y-6">
                 {[
                   { name: 'Ricardo Santos', rate: '45%', count: 5 },
                   { name: 'Fernanda Lima', rate: '28%', count: 3 },
                   { name: 'Mateus Oliveira', rate: '15%', count: 2 }
                 ].map((user, i) => (
                   <div key={i} className="flex flex-col gap-2">
                      <div className="flex justify-between items-center mb-1">
                         <span className="text-[10px] font-black text-slate-700 uppercase italic">{user.name}</span>
                         <span className="text-[10px] font-black text-red-500 italic">{user.rate}</span>
                      </div>
                      <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                         <div className="bg-red-500 h-full" style={{ width: user.rate }}></div>
                      </div>
                   </div>
                 ))}
              </div>

              <div className="bg-slate-50 p-6 rounded-3xl border border-dashed border-slate-200">
                 <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">Custo Médio por Modal</h4>
                 <div className="space-y-3">
                    <div className="flex justify-between text-[10px] font-black uppercase">
                       <span className="text-slate-500 italic">✈️ Aéreo</span>
                       <span className="text-slate-800">R$ 1.840</span>
                    </div>
                    <div className="flex justify-between text-[10px] font-black uppercase">
                       <span className="text-slate-500 italic">🚗 Carro</span>
                       <span className="text-slate-800">R$ 420</span>
                    </div>
                 </div>
              </div>

              <button className="w-full border-2 border-slate-100 text-slate-400 py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:border-omie-blue hover:text-omie-blue transition-all">
                 Ver Todos os Relatórios
              </button>
           </section>
        </div>
      </main>
    </div>
  );
}
