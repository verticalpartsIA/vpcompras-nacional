"use client";

import React, { useState } from 'react';
import { 
  HardHat, CheckCircle2, AlertCircle, Camera, Calendar, 
  ArrowRight, ShieldCheck, Info, FileText, BadgeDollarSign,
  TrendingUp, Clock, MapPin, Plus
} from 'lucide-react';
import { registrarVistoria } from '../../actions';

/**
 * Interface de Vistoria / Diário de Obra - Módulo Serviços
 * @architect-spaceX @qa-lead @approval-engineer
 */
export default function VistoriaServicoPage({ params }: { params: { id: string } }) {
  const [loading, setLoading] = useState(false);
  const [selectedEtapa, setSelectedEtapa] = useState<any>(null);

  // MOCK DATA - Recuperado do banco vpcn_servicos.etapas_medicoes
  const steps = [
    { id: '1', descricao: 'Instalação Elétrica - Fase 1', percentual: 30, valor: 4500, prazo: '2024-05-10', status: 'MEDIDO' },
    { id: '2', descricao: 'Passagem de Cabos e Conectorização', percentual: 50, valor: 7500, prazo: '2024-05-20', status: 'EM_EXECUCAO' },
    { id: '3', descricao: 'Testes de Continuidade e Entrega', percentual: 20, valor: 3000, prazo: '2024-05-30', status: 'PENDENTE' }
  ];

  const handleVistoria = async (e: any) => {
    e.preventDefault();
    setLoading(true);
    // Lógica de submissão integrada ao registrarVistoria
    await new Promise(r => setTimeout(r, 1000));
    alert("Vistoria Técnica registrada com sucesso! Etapa liberada para pagamento.");
    setSelectedEtapa(null);
    setLoading(false);
  };

  return (
    <div className="flex flex-col min-h-screen bg-[#f1f4f9] pb-32">
      <header className="bg-white border-b border-slate-200 px-12 py-10 flex justify-between items-center sticky top-0 z-30 shadow-sm border-t-8 border-omie-blue">
        <div className="flex items-center gap-6">
           <div className="bg-omie-blue/10 p-4 rounded-3xl text-omie-blue shadow-inner"><HardHat size={32} /></div>
           <div>
              <h1 className="text-xl font-black text-slate-800 tracking-tighter uppercase italic leading-none">Diário de Obra & Vistoria</h1>
              <span className="text-[10px] font-black text-omie-blue uppercase tracking-widest mt-1 block tracking-[0.3em]">Protocolo Técnico: {params.id}</span>
           </div>
        </div>
        <div className="flex bg-slate-100 p-2 rounded-2xl gap-2">
           <button className="bg-white text-slate-800 px-6 py-2 rounded-xl text-[10px] font-black uppercase shadow-sm border border-slate-200 transition-all">Visão Cronograma</button>
           <button className="text-slate-400 px-6 py-2 rounded-xl text-[10px] font-black uppercase">Documentos ART</button>
        </div>
      </header>

      <main className="p-12 max-w-6xl mx-auto w-full space-y-12">
        {/* Alertas de Execução */}
        <section className="grid grid-cols-1 md:grid-cols-2 gap-8">
           <div className="bg-amber-50 border border-amber-100 p-8 rounded-[3rem] flex items-center gap-6">
              <div className="bg-amber-100 p-4 rounded-2xl text-amber-600"><Clock size={24} /></div>
              <div>
                 <span className="text-[10px] font-black text-amber-500 uppercase tracking-widest">Alerta de Cronograma</span>
                 <p className="text-[11px] font-bold text-amber-800 mt-1 uppercase italic leading-relaxed">Atraso de 4 dias detectado na Etapa de Passagem de Cabos.</p>
              </div>
           </div>
           <div className="bg-white p-8 rounded-[3rem] shadow-xl border border-slate-100 flex items-center gap-6">
              <div className="bg-omie-blue/10 p-4 rounded-2xl text-omie-blue"><BadgeDollarSign size={24} /></div>
              <div>
                 <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Budget Consumido</span>
                 <p className="text-[11px] font-black text-slate-800 mt-1 uppercase italic leading-relaxed">R$ 4.500 Liquidados / R$ 15.000 Total (30%)</p>
              </div>
           </div>
        </section>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
           {/* Timeline de Etapas (Lado Esquerdo) */}
           <div className="lg:col-span-2 space-y-8">
              <h2 className="text-xs font-black text-slate-400 uppercase tracking-[0.2em] italic ml-4">Medições e Entregas</h2>
              
              <div className="space-y-6">
                 {steps.map((step, idx) => (
                   <div key={idx} className={`bg-white p-10 rounded-[3.5rem] shadow-xl border ${step.status === 'EM_EXECUCAO' ? 'border-omie-blue border-l-[12px]' : 'border-slate-50'} relative group transition-all`}>
                      <div className="flex justify-between items-start">
                         <div className="space-y-4">
                            <span className={`text-[10px] font-black uppercase tracking-[0.2em] italic ${step.status === 'MEDIDO' ? 'text-green-500' : step.status === 'EM_EXECUCAO' ? 'text-omie-blue animate-pulse' : 'text-slate-300'}`}>
                               {step.status === 'MEDIDO' ? '✓ Etapa Auditada' : step.status === 'EM_EXECUCAO' ? '● Em Execução' : '○ Pendente'}
                            </span>
                            <div>
                               <h3 className="text-base font-black text-slate-800 uppercase italic tracking-tighter leading-none">{step.descricao}</h3>
                               <p className="text-[10px] font-bold text-slate-400 mt-2 uppercase">Prazo Target: {new Date(step.prazo).toLocaleDateString('pt-BR')}</p>
                            </div>
                         </div>
                         <div className="text-right">
                            <span className="text-2xl font-black text-slate-800 italic leading-none">{step.percentual}%</span>
                            <span className="text-[10px] font-black text-slate-300 uppercase block mt-1">Peso Global</span>
                         </div>
                      </div>

                      <div className="mt-8 flex justify-between items-center bg-slate-50 p-6 rounded-3xl border border-slate-100">
                         <div className="flex items-center gap-4">
                            <BadgeDollarSign size={20} className="text-slate-400" />
                            <span className="text-xs font-black text-slate-700 italic">R$ {step.valor.toLocaleString('pt-BR')}</span>
                         </div>
                         {step.status !== 'MEDIDO' && (
                           <button onClick={() => setSelectedEtapa(step)} 
                             className="bg-omie-blue text-white px-8 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-slate-900 transition-all shadow-lg shadow-blue-500/20">
                             Lançar Vistoria
                           </button>
                         )}
                      </div>
                   </div>
                 ))}
              </div>
           </div>

           {/* Portal de Medição (Lado Direito - Condicional) */}
           <div className="space-y-8">
              {selectedEtapa ? (
                <section className="bg-slate-900 p-10 rounded-[4rem] shadow-2xl space-y-10 border-b-[12px] border-omie-blue animate-in slide-in-from-right-10">
                   <div className="flex items-center gap-4">
                      <div className="bg-omie-blue/20 p-4 rounded-2xl text-omie-blue border border-omie-blue/20"><Camera size={24} /></div>
                      <div>
                         <h3 className="text-white font-black text-xs uppercase italic tracking-widest">Nova Vistoria</h3>
                         <span className="text-[9px] font-black text-slate-500 uppercase">{selectedEtapa.descricao}</span>
                      </div>
                   </div>

                   <form onSubmit={handleVistoria} className="space-y-8 text-slate-300">
                      <div className="space-y-4">
                         <label className="text-[9px] font-black uppercase tracking-widest ml-2">Percentual Executado (%)</label>
                         <input type="number" defaultValue={100} className="w-full bg-slate-800 border-none rounded-2xl px-6 py-4 font-black text-white focus:ring-2 ring-omie-blue outline-none" />
                      </div>

                      <div className="space-y-4">
                         <label className="text-[9px] font-black uppercase tracking-widest ml-2">Conformidade Técnica</label>
                         <div className="grid grid-cols-2 gap-3">
                            <button type="button" className="bg-omie-blue text-white py-3 rounded-xl text-[9px] font-black uppercase border border-omie-blue shadow-lg shadow-blue-500/10">Conforme</button>
                            <button type="button" className="bg-slate-800 text-slate-500 py-3 rounded-xl text-[9px] font-black uppercase border border-slate-700">Divergente</button>
                         </div>
                      </div>

                      <div className="space-y-4">
                         <label className="text-[9px] font-black uppercase tracking-widest ml-2">Observações de Campo</label>
                         <textarea className="w-full bg-slate-800 border-none rounded-2xl p-6 text-[10px] font-medium italic text-slate-300 min-h-[100px] outline-none focus:ring-2 ring-omie-blue" placeholder="Relate o estado físico da entrega..." />
                      </div>

                      <div className="bg-white/5 p-6 rounded-3xl border border-dashed border-white/10 flex flex-col items-center gap-4 hover:border-omie-blue/50 transition-all cursor-pointer">
                         <Camera className="text-slate-600" size={32} />
                         <span className="text-[9px] font-black uppercase tracking-[0.2em]">Upload Fotos Evidência (Mín. 2)</span>
                      </div>

                      <button type="submit" disabled={loading}
                        className="w-full bg-omie-blue text-white py-6 rounded-[2.5rem] font-black text-[10px] uppercase tracking-[0.2em] shadow-2xl shadow-blue-500/20 hover:bg-white hover:text-omie-blue transition-all">
                        {loading ? "GERANDO NOTA TÉCNICA..." : "Aprovar Medição e Liberar Pagamento"}
                      </button>
                   </form>
                </section>
              ) : (
                <section className="bg-white p-12 rounded-[4rem] shadow-xl border border-slate-100 space-y-8 flex flex-col items-center text-center justify-center min-h-[400px]">
                   <div className="bg-slate-50 p-10 rounded-full text-slate-200"><Info size={48} /></div>
                   <div>
                      <h4 className="text-sm font-black text-slate-800 uppercase italic">Aguardando Seleção</h4>
                      <p className="text-[10px] text-slate-400 font-bold uppercase mt-2 leading-relaxed tracking-widest">Selecione uma etapa à esquerda para lançar o registro de vistoria.</p>
                   </div>
                </section>
              )}
           </div>
        </div>
      </main>
    </div>
  );
}
