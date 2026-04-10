"use client";

import React from 'react';
import { 
  TrendingUp, BarChart3, AlertTriangle, ShieldCheck, Settings, 
  ArrowRight, HardHat, FileText, BadgeDollarSign, Truck,
  History, PieChart, Activity, Clock
} from 'lucide-react';

/**
 * Dashboard Inteligente de Ativos e Manutenção - VerticalParts
 * @architect-spaceX @omie-expert @qa-lead
 */
export default function ManutencaoDashboardPage() {
  return (
    <div className="flex flex-col min-h-screen bg-[#f1f4f9] pb-32">
      <header className="bg-white border-b border-slate-200 px-12 py-10 flex justify-between items-center sticky top-0 z-30 shadow-sm border-t-8 border-omie-blue">
        <div className="flex items-center gap-6">
           <div className="bg-omie-blue/10 p-4 rounded-3xl text-omie-blue shadow-inner"><Activity size={32} /></div>
           <div>
              <h1 className="text-xl font-black text-slate-800 tracking-tighter uppercase italic leading-none">Maintenance Analytics</h1>
              <span className="text-[10px] font-black text-omie-blue uppercase tracking-widest mt-1 block tracking-[0.3em]">VerticalParts Assets Division</span>
           </div>
        </div>
        <div className="flex bg-slate-100 p-2 rounded-2xl gap-2">
           <button className="bg-omie-blue text-white px-6 py-2 rounded-xl text-[9px] font-black uppercase shadow-lg shadow-blue-500/20">Visão ROI</button>
           <button className="text-slate-400 px-6 py-2 rounded-xl text-[9px] font-black uppercase">Frotas</button>
        </div>
      </header>

      <main className="p-12 max-w-7xl mx-auto w-full space-y-12">
        {/* KPIs de Alto Nível */}
        <section className="grid grid-cols-1 md:grid-cols-4 gap-8">
           {[
             { label: 'Obras Preventivas', val: '84%', sub: 'Meta: 80%', icon: ShieldCheck, color: 'text-green-500' },
             { label: 'Custo Corretivas', val: 'R$ 8.2k', sub: 'Last 30 days', icon: AlertTriangle, color: 'text-red-500' },
             { label: 'Alertas Ativos', val: '12', sub: '4 Escalados CEO', icon: Clock, color: 'text-amber-500' },
             { label: 'Ativos Críticos', val: '03', sub: 'Sugestão Venda', icon: BadgeDollarSign, color: 'text-omie-blue' }
           ].map((kpi, i) => (
             <div key={i} className="bg-white p-8 rounded-[3.5rem] shadow-xl space-y-4 border border-slate-100 transition-transform hover:scale-[1.02]">
                <div className="flex justify-between items-center">
                   <kpi.icon className={kpi.color} size={24} />
                   <span className="text-[8px] font-black text-slate-300 uppercase tracking-widest">KPI System</span>
                </div>
                <div>
                   <span className="text-4xl font-black text-slate-800 tracking-tighter italic block">{kpi.val}</span>
                   <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest mt-3 block">{kpi.label}</span>
                   <span className="text-[9px] font-black text-slate-400 uppercase mt-2 block">{kpi.sub}</span>
                </div>
             </div>
           ))}
        </section>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
           {/* ROI e Alertas de Substituição */}
           <div className="lg:col-span-2 space-y-8">
              <div className="flex items-center justify-between px-6">
                 <h2 className="text-xs font-black text-slate-400 uppercase tracking-[0.3em] italic flex items-center gap-2 font-black"><AlertTriangle size={16} /> Radar de Substituição de Ativos</h2>
                 <span className="text-[10px] font-black text-red-500 uppercase italic">Threshold 30% Atingido</span>
              </div>
              
              <div className="space-y-6">
                 {[
                   { name: 'Empilhadeira Toyota #102', cost: '38%', value: 'R$ 45k', risk: 'ALTO' },
                   { name: 'Caminhão Scania 450', cost: '32%', value: 'R$ 820k', risk: 'MEDIO' },
                   { name: 'Ponte Rolante Galpão B', cost: '12%', value: 'R$ 150k', risk: 'BAIXO' }
                 ].map((asset, idx) => (
                   <div key={idx} className="bg-white p-10 rounded-[4rem] shadow-lg border border-slate-50 flex items-center justify-between group hover:bg-slate-50 transition-all">
                      <div className="flex items-center gap-8">
                         <div className={`w-14 h-14 rounded-2xl flex items-center justify-center ${asset.risk === 'ALTO' ? 'bg-red-50 text-red-500' : 'bg-slate-50 text-slate-400'}`}>
                            {asset.risk === 'ALTO' ? <AlertTriangle size={24} /> : <Settings size={24} />}
                         </div>
                         <div>
                            <h3 className="text-sm font-black text-slate-800 uppercase italic tracking-tighter leading-none">{asset.name}</h3>
                            <div className="flex gap-4 mt-3">
                               <span className="text-[10px] font-black text-slate-400 uppercase italic">Custo Acumulado: {asset.cost}</span>
                               <span className="text-[10px] font-black text-omie-blue uppercase italic">V. Aquisição: {asset.value}</span>
                            </div>
                         </div>
                      </div>
                      <div className="flex flex-col items-end gap-2">
                         <span className={`text-[9px] font-black uppercase px-4 py-1.5 rounded-full ${asset.risk === 'ALTO' ? 'bg-red-500 text-white' : 'bg-slate-100 text-slate-500'}`}>RISCO: {asset.risk}</span>
                         <button className="text-[10px] font-black text-omie-blue hover:underline uppercase italic">Ver Dossiê</button>
                      </div>
                   </div>
                 ))}
              </div>
           </div>

           {/* Histórico e Alertas em Cascata (Lado Direito) */}
           <section className="bg-slate-900 p-12 rounded-[5rem] shadow-2xl space-y-12 border-b-[15px] border-omie-blue relative overflow-hidden">
              <div className="relative z-10">
                 <h2 className="text-xs font-black text-white uppercase tracking-[0.2em] italic mb-2">Cascading Alerts</h2>
                 <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest leading-relaxed">Escalonamento proativo de preventivas.</p>
              </div>

              <div className="space-y-8 relative z-10">
                 <div className="flex gap-4 group">
                    <div className="w-1 bg-red-500 rounded-full group-hover:bg-white transition-colors animate-pulse" />
                    <div>
                       <span className="text-[9px] font-black text-red-500 uppercase italic">01 Dia • Alerta CEO</span>
                       <h4 className="text-[11px] font-black text-white uppercase tracking-tight mt-1">Viatura Placa VP-2234 atrasada</h4>
                       <button className="mt-3 text-[9px] font-black text-omie-blue uppercase italic underline decoration-omie-blue/30 decoration-2">Ligar para Gestor</button>
                    </div>
                 </div>
                 <div className="flex gap-4 group">
                    <div className="w-1 bg-amber-500 rounded-full" />
                    <div>
                       <span className="text-[9px] font-black text-amber-500 uppercase italic">07 Dias • Alerta Gestor</span>
                       <h4 className="text-[11px] font-black text-white uppercase tracking-tight mt-1">Gerador Galpão 3 Programado</h4>
                       <span className="text-[9px] font-medium text-slate-500 uppercase block mt-1">Preventiva Semestral - R$ 4.200</span>
                    </div>
                 </div>
                 <div className="flex gap-4 group">
                    <div className="w-1 bg-omie-blue rounded-full" />
                    <div>
                       <span className="text-[9px] font-black text-omie-blue uppercase italic">30 Dias • Alerta Engenharia</span>
                       <h4 className="text-[11px] font-black text-white uppercase tracking-tight mt-1">Ar Condicionado CPD Central</h4>
                       <span className="text-[9px] font-medium text-slate-500 uppercase block mt-1">Solicitação de filtro enviada p/ Produtos</span>
                    </div>
                 </div>
              </div>

              <div className="bg-white/5 p-8 rounded-[2.5rem] border border-white/10 relative z-10">
                 <div className="flex justify-between items-center text-white">
                    <div className="flex items-center gap-3">
                       <PieChart className="text-omie-blue" size={20} />
                       <span className="text-[10px] font-black uppercase italic tracking-widest">Ativos em Ordem</span>
                    </div>
                    <span className="text-xl font-black italic">96%</span>
                 </div>
                 <div className="w-full bg-slate-800 h-1.5 mt-4 rounded-full overflow-hidden">
                    <div className="bg-omie-blue h-full w-[96%] shadow-[0_0_10px_rgba(0,89,255,0.5)]" />
                 </div>
              </div>

              <button className="w-full bg-white text-slate-900 py-6 rounded-[3rem] font-black text-[10px] uppercase tracking-[0.2em] hover:bg-omie-blue hover:text-white transition-all shadow-xl relative z-10">
                 Exportar Relatório TCO
              </button>

              {/* Grafismo de Fundo */}
              <div className="absolute top-0 right-0 p-8 opacity-5 rotate-12 scale-150">
                 <Settings size={200} />
              </div>
           </section>
        </div>
      </main>
    </div>
  );
}
