"use client";

import React, { useState, useEffect } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { 
  CreditCard, Plus, Trash2, ArrowLeft, ShieldCheck, 
  MapPin, Calendar, Wallet, Landmark, Camera, AlertTriangle 
} from 'lucide-react';
import { submitPrestacaoContas } from '../../actions';
import { useRouter, useParams } from 'next/navigation';

export default function PrestacaoContasPage() {
  const router = useRouter();
  const params = useParams();
  const [loading, setLoading] = useState(false);
  const [totalBrl, setTotalBrl] = useState(0);

  const { register, control, handleSubmit, watch, formState: { errors } } = useForm({
    defaultValues: {
      despesas: [{ categoria: "Alimentacao", descricao: "", valor: 0, moeda: "BRL", comprovante_url: "" }]
    }
  });

  const { fields, append, remove } = useFieldArray({
    control, name: "despesas"
  });

  const watchDespesas = watch("despesas");

  // Cálculo de Conversão Automática (Mock BCB)
  useEffect(() => {
    const total = watchDespesas.reduce((acc, curr) => {
      const taxa = curr.moeda === 'BRL' ? 1 : 5.15; // Mock taxa USD
      return acc + (curr.valor * taxa);
    }, 0);
    setTotalBrl(total);
  }, [watchDespesas]);

  const onSubmit = async (data: any) => {
    setLoading(true);
    const res = await submitPrestacaoContas(params.id as string, data.despesas);
    if (res.success) {
      alert("✅ Prestação de Contas enviada para auditoria financeira!");
      router.push('/dashboard');
    }
    setLoading(false);
  };

  return (
    <div className="flex flex-col min-h-screen bg-[#f8fafc] pb-32">
       <header className="bg-white border-b border-slate-200 px-12 py-8 flex justify-between items-center sticky top-0 z-30">
        <div className="flex items-center gap-6">
           <div className="bg-omie-blue/10 p-4 rounded-2xl text-omie-blue shadow-inner"><Wallet size={32} /></div>
           <div>
              <h1 className="text-xl font-black text-slate-800 tracking-tighter uppercase italic leading-none">Prestação de Contas Técnica</h1>
              <span className="text-[10px] font-black text-omie-blue uppercase tracking-widest mt-1 block">Audit de Viagem #{params.id?.toString().slice(0,8)}</span>
           </div>
        </div>
        <div className="text-right">
           <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Total Consolidado</span>
           <span className="text-2xl font-black text-slate-800 block mt-1">R$ {totalBrl.toLocaleString('pt-BR')}</span>
        </div>
      </header>

      <main className="p-12 max-w-5xl mx-auto w-full space-y-12">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-12">
          <section className="bg-white p-12 rounded-[3.5rem] shadow-xl space-y-10 border-none">
             <div className="flex justify-between items-center mb-10">
                <h2 className="text-xs font-black text-slate-400 uppercase tracking-[0.3em] italic">Registro de Comprovantes</h2>
                <button type="button" onClick={() => append({ categoria: "Alimentacao", descricao: "", valor: 0, moeda: "BRL", comprovante_url: "" })}
                  className="bg-omie-blue text-white px-6 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:opacity-90 shadow-lg shadow-blue-500/20">
                  + Nova Despesa
                </button>
             </div>

             <div className="space-y-6">
                {fields.map((field, index) => (
                  <div key={field.id} className="grid grid-cols-1 md:grid-cols-12 gap-4 p-8 bg-slate-50 rounded-[2.5rem] border border-slate-100 items-end animate-in slide-in-from-right-4 duration-300">
                      <div className="md:col-span-2 space-y-2">
                        <label className="text-[8px] font-black text-slate-400 uppercase ml-1">Categoria</label>
                        <select {...register(`despesas.${index}.categoria`)} className="w-full bg-white rounded-xl px-4 py-3 text-[9px] font-black uppercase shadow-sm">
                           <option>Alimentacao</option>
                           <option>Transporte</option>
                           <option>Hospedagem</option>
                           <option>Diversos</option>
                        </select>
                      </div>
                      <div className="md:col-span-4 space-y-2">
                         <label className="text-[8px] font-black text-slate-400 uppercase ml-1">Descrição do Comprovante</label>
                         <input {...register(`despesas.${index}.descricao`)} placeholder="Ex: Almoço Cliente X" className="w-full bg-white rounded-xl px-4 py-3 text-[10px] font-bold shadow-sm" />
                      </div>
                      <div className="md:col-span-2 space-y-2">
                         <label className="text-[8px] font-black text-slate-400 uppercase ml-1">Moeda</label>
                         <select {...register(`despesas.${index}.moeda`)} className="w-full bg-white rounded-xl px-4 py-3 text-[9px] font-black shadow-sm">
                            <option value="BRL">BRL (R$)</option>
                            <option value="USD">USD ($)</option>
                            <option value="EUR">EUR (€)</option>
                         </select>
                      </div>
                      <div className="md:col-span-2 space-y-2">
                         <label className="text-[8px] font-black text-slate-400 uppercase ml-1">Valor Original</label>
                         <input type="number" step="0.01" {...register(`despesas.${index}.valor`, { valueAsNumber: true })} className="w-full bg-white rounded-xl px-4 py-3 text-[10px] font-bold shadow-sm" />
                      </div>
                      <div className="md:col-span-1 flex justify-center pb-2">
                         <button type="button" className="text-slate-300 hover:text-omie-blue transition-colors"><Camera size={24} /></button>
                      </div>
                      <div className="md:col-span-1 flex justify-center pb-2">
                         {index > 0 && <button type="button" onClick={() => remove(index)} className="text-red-300 hover:text-red-500"><Trash2 size={24} /></button>}
                      </div>
                  </div>
                ))}
             </div>
          </section>

          <section className="bg-slate-900 p-12 rounded-[4rem] shadow-2xl space-y-10 border-t-8 border-omie-blue">
             <div className="flex items-center gap-6">
                <ShieldCheck size={40} className="text-omie-blue" />
                <div>
                   <h3 className="text-xl font-black text-white italic tracking-tighter uppercase leading-none">Saldo e Conformidade</h3>
                   <p className="text-[10px] text-slate-400 font-bold uppercase mt-2 italic">Validação técnica de gastos vs orçamento aprovado.</p>
                </div>
             </div>

             <div className="bg-white/5 p-10 rounded-[3rem] border border-white/10 flex justify-between items-center">
                <div className="space-y-2">
                   <div className="flex items-center gap-2 text-red-400">
                      <AlertTriangle size={16} />
                      <span className="text-[10px] font-black uppercase tracking-widest">Aviso de Auditoria</span>
                   </div>
                   <p className="text-[11px] text-slate-300 font-medium italic max-w-sm">Gastos acima de 10% do aprovado exigem justificativa técnica para o financeiro.</p>
                </div>
                <div className="text-right">
                   <span className="text-[10px] font-black text-omie-blue uppercase block mb-1">A Restituir / Receber</span>
                   <span className="text-5xl font-black text-white italic tracking-tighter">R$ {totalBrl.toLocaleString('pt-BR')}</span>
                </div>
             </div>

             <button type="submit" disabled={loading}
               className="w-full bg-omie-blue text-white font-black text-sm py-8 rounded-[3rem] hover:opacity-90 transition-all shadow-2xl shadow-blue-500/20 uppercase tracking-[0.3em] flex items-center justify-center gap-4 border-b-8 border-blue-900 leading-none">
               {loading ? "PROCESSANDO AUDITORIA..." : "FINALIZAR PRESTAÇÃO DE CONTAS"}
             </button>
          </section>
        </form>
      </main>
    </div>
  );
}
