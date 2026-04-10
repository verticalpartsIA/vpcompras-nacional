"use client";

import React, { useState, useEffect } from 'react';
import { useForm, useFieldArray, useWatch } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { 
  Plane, MapPin, Users, Calendar, Car, AlertCircle, 
  Plus, Trash2, Globe, Calculator, ShieldCheck, ArrowRight,
  Hotel, Utensils, CreditCard, Landmark, FileText, Smartphone, Syringe
} from 'lucide-react';
import { submitSolicitacaoViagem } from '../actions';
import { useRouter } from 'next/navigation';

/**
 * Zod Schema - Rigor de Auditoria VerticalParts (Viagens.txt + Prestacao_Compras.txt)
 */
const travelSchema = z.object({
  finalidade: z.string().min(1, "Obrigatório"),
  objetivo_detalhado: z.string().min(10, "Mínimo 10 caracteres"),
  resultados_esperados: z.string().min(10, "Detalhe os resultados esperados"),
  is_planned: z.enum(['sim', 'nao']),
  justificativa_urgencia: z.string().optional(),
  centro_custo_id: z.string().min(1, "Obrigatório"),
  is_internacional: z.boolean().default(false),
  
  // Viajantes
  viajantes: z.array(z.object({
    nome: z.string().min(1, "Obrigatório"),
    matricula: z.string().optional(),
    cargo: z.string().min(1, "Obrigatório"),
    cpf: z.string().min(1, "Obrigatório"),
    rg: z.string().optional(),
    telefone: z.string().optional(),
    email: z.string().email("E-mail inválido").optional(),
    is_acompanhante: z.boolean().default(false),
    parentesco: z.string().optional(),
    rateio_custo: z.enum(['Total', 'Parcial', 'Nao']).default('Total')
  })).min(1, "Ao menos 1 viajante"),

  // Roteiro
  trechos: z.array(z.object({
    origem: z.string().min(1, "Obrigatório"),
    destino: z.string().min(1, "Obrigatório"),
    modal: z.enum(['Aereo', 'Onibus', 'Carro_Proprio', 'Carro_Alugado', 'Van']),
    data: z.string().min(1, "Obrigatório"),
    horario_preferencial: z.string().optional()
  })).min(1, "Ao menos 1 trecho"),

  // Logistica Adicional
  hospedagem: z.object({
    necessita: z.boolean().default(false),
    nome_hotel: z.string().optional(),
    endereco: z.string().optional(),
    diarias: z.number().default(1),
    valor_maximo_diaria: z.number().default(0)
  }),
  alimentacao: z.object({
    tipo: z.enum(['Diaria', 'Avulsa', 'Incluida']).default('Diaria'),
    valor_diario_estimado: z.number().default(75)
  }),

  // Veículo (Condicional)
  veiculo: z.object({
    motorista: z.string().optional(),
    placa: z.string().optional(),
    combustivel_tipo: z.string().default('GASOLINA'),
    km_por_litro: z.number().default(10),
    valor_combustivel: z.number().default(5.89),
    distancia_ida_volta_km: z.number().default(0),
    pedagios_estimados: z.number().default(0),
    custo_total: z.number().default(0)
  }).optional(),

  // Internacionalização
  internacional: z.object({
    passaporte: z.string().optional(),
    visto_necessario: z.boolean().default(false),
    moeda_local: z.string().default('USD'),
    cotacao_dia: z.number().default(5.15)
  }).optional(),

  nacional: z.object({
    exige_vacina: z.boolean().default(false),
    qual_vacina: z.string().optional()
  }).optional()
}).refine(data => {
  if (data.is_planned === 'nao' && (!data.justificativa_urgencia || data.justificativa_urgencia.length < 30)) {
    return false;
  }
  return true;
}, {
  message: "Justificativa de urgência deve ter no mínimo 30 caracteres para auditoria",
  path: ["justificativa_urgencia"]
});

export default function NovaViagemMasterV3Page() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [totalBudget, setTotalBudget] = useState(0);
  
  const { register, control, handleSubmit, setValue, watch, formState: { errors } } = useForm({
    resolver: zodResolver(travelSchema),
    defaultValues: {
      finalidade: "Visita Cliente",
      is_planned: "sim",
      viajantes: [{ nome: "", cargo: "", cpf: "", is_acompanhante: false, rateio_custo: 'Total' as const }],
      trechos: [{ origem: "", destino: "", modal: "Aereo" as const, data: "" }],
      is_internacional: false,
      hospedagem: { necessita: false, diarias: 1, valor_maximo_diaria: 450 },
      alimentacao: { tipo: 'Diaria' as const, valor_diario_estimado: 90 },
      veiculo: { km_por_litro: 10, valor_combustivel: 5.89, distancia_ida_volta_km: 0, pedagios_estimados: 0, custo_total: 0 }
    }
  });

  const { fields: travelerFields, append: appendTraveler, remove: removeTraveler } = useFieldArray({
    control, name: "viajantes"
  });

  const { fields: trechoFields, append: appendTrecho, remove: removeTrecho } = useFieldArray({
    control, name: "trechos"
  });

  const watchAll = watch();

  // Cálculo de Orçamento Global em Tempo Real
  useEffect(() => {
    let subtotal = 0;
    
    // 1. Trechos (Estimativa Base)
    const custoPassagem = watchAll.is_internacional ? 4800 : 1350;
    subtotal += (watchAll.trechos.length * custoPassagem);

    // 2. Veículo se houver
    if (watchAll.trechos.some(t => t.modal === 'Carro_Proprio')) {
      const custoCombustivel = (watchAll.veiculo.distancia_ida_volta_km / watchAll.veiculo.km_por_litro) * watchAll.veiculo.valor_combustivel;
      const calcVeiculo = custoCombustivel + watchAll.veiculo.pedagios_estimados;
      setValue("veiculo.custo_total", Number(calcVeiculo.toFixed(2)));
      subtotal += calcVeiculo;
    }

    // 3. Hospedagem
    if (watchAll.hospedagem.necessita) {
      subtotal += (watchAll.hospedagem.diarias * watchAll.hospedagem.valor_maximo_diaria);
    }

    // 4. Alimentação
    if (watchAll.alimentacao.tipo !== 'Incluida') {
      subtotal += (watchAll.viajantes.length * watchAll.alimentacao.valor_diario_estimado);
    }

    setTotalBudget(subtotal);
  }, [watchAll, setValue]);

  const onSubmit = async (data: any) => {
    setLoading(true);
    data.valor_estimado_total = totalBudget;
    const res = await submitSolicitacaoViagem(data);
    if (res.success) {
      alert("🏆 Viagem registrada. Motor de alçadas acionado!");
      router.push('/dashboard');
    } else {
      alert("Houve um erro: " + res.error);
    }
    setLoading(false);
  };

  return (
    <div className="flex flex-col min-h-screen bg-[#f1f3f7] pb-40">
      <header className="bg-white border-b border-slate-200 px-12 py-8 flex justify-between items-center sticky top-0 z-40 shadow-sm border-t-4 border-omie-blue">
        <div className="flex items-center gap-6">
           <Plane className="text-omie-blue" size={36} />
           <div>
              <h1 className="text-2xl font-black text-slate-800 tracking-tighter uppercase italic leading-none">Plano de Voo Corporativo</h1>
              <span className="text-[10px] font-black text-omie-blue uppercase tracking-widest mt-1 block">Rigor Técnico: Viagens & Logística</span>
           </div>
        </div>
        <div className="flex items-center gap-6">
           <div className="text-right">
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Orçamento Total</span>
              <span className="text-2xl font-black text-slate-800 block leading-none mt-1">R$ {totalBudget.toLocaleString('pt-BR')}</span>
           </div>
           <Globe className={watchAll.is_internacional ? "text-omie-blue animate-pulse" : "text-slate-200"} size={32} />
        </div>
      </header>

      <main className="p-12 max-w-6xl mx-auto w-full grid grid-cols-1 lg:grid-cols-3 gap-12">
        <div className="lg:col-span-2 space-y-12">
          {/* Seção 1: Auditoria de Planejamento */}
          <section className="bg-amber-50 p-10 rounded-[3rem] border-2 border-amber-200 space-y-8">
             <div className="flex items-start gap-4">
                <AlertCircle className="text-amber-500 mt-1" size={28} />
                <div className="space-y-4 flex-1">
                   <h2 className="text-base font-black text-amber-900 uppercase italic tracking-tighter leading-none">Política de Antecedência VerticalParts</h2>
                   <p className="text-[10px] font-bold text-amber-700/70 uppercase leading-relaxed max-w-lg">
                      Viagens solicitadas com antecedência insuficiente geram custos elevados. Justificativa mandatórias são obrigatórias para alçada N3.
                   </p>

                   <div className="flex gap-8 mt-4">
                      {['sim', 'nao'].map(val => (
                        <label key={val} className="flex items-center gap-3 cursor-pointer group">
                           <input type="radio" value={val} {...register("is_planned")} className="w-5 h-5 text-omie-blue border-amber-300" />
                           <span className="text-[11px] font-black text-amber-900 uppercase tracking-widest group-hover:text-omie-blue">
                              {val === 'sim' ? 'SIM (Programada)' : 'NÃO (Urgência)'}
                           </span>
                        </label>
                      ))}
                   </div>

                   {watchAll.is_planned === 'nao' && (
                     <div className="animate-in slide-in-from-top-4 duration-300 space-y-2">
                        <textarea {...register("justificativa_urgencia")} placeholder="Por que esta viagem não pôde ser planejada antes? (Mín. 30 caracteres para aprovação)..."
                          className="w-full bg-white border border-amber-300 rounded-3xl p-6 text-[11px] font-bold italic shadow-inner h-32 outline-none focus:border-omie-blue" />
                        {errors.justificativa_urgencia && <span className="text-[9px] font-black text-red-500 uppercase italic tracking-widest">{errors.justificativa_urgencia.message as string}</span>}
                     </div>
                   )}
                </div>
             </div>
          </section>

          {/* Seção 2: Viajantes */}
          <section className="bg-white p-12 rounded-[3.5rem] shadow-xl space-y-10 relative overflow-hidden">
             <div className="flex justify-between items-center relative z-10">
                <h2 className="text-xs font-black text-slate-400 uppercase tracking-[0.3em] flex items-center gap-2 italic"><Users size={16} /> Dados dos Viajantes</h2>
                <button type="button" onClick={() => appendTraveler({ nome: "", cargo: "", cpf: "", is_acompanhante: false, rateio_custo: 'Total' })}
                  className="bg-slate-50 text-omie-blue border border-omie-blue/10 px-6 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-omie-blue hover:text-white transition-all shadow-sm">
                  + Adicionar Passageiro
                </button>
             </div>

             <div className="space-y-6 relative z-10">
                {travelerFields.map((field, index) => (
                  <div key={field.id} className="p-10 bg-slate-50 rounded-[3rem] border border-slate-100 shadow-sm animate-in fade-in zoom-in-95 duration-200">
                     <div className="flex justify-between items-center mb-10">
                        <div className="bg-omie-blue text-white w-10 h-10 rounded-2xl flex items-center justify-center font-black text-xs italic shadow-lg shadow-blue-500/20">#{index+1}</div>
                        {index > 0 && <button type="button" onClick={() => removeTraveler(index)} className="text-red-300 hover:text-red-500 transition-colors"><Trash2 size={20} /></button>}
                     </div>
                     <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <input {...register(`viajantes.${index}.nome`)} placeholder="Nome Completo" className="bg-white rounded-2xl px-6 py-5 text-xs font-bold shadow-sm outline-none focus:ring-2 ring-omie-blue" />
                        <input {...register(`viajantes.${index}.cpf`)} placeholder="CPF (Apenas Números)" className="bg-white rounded-2xl px-6 py-5 text-xs font-bold shadow-sm outline-none focus:ring-2 ring-omie-blue" />
                        <input {...register(`viajantes.${index}.cargo`)} placeholder="Cargo / Função Principal" className="bg-white rounded-2xl px-6 py-5 text-xs font-bold shadow-sm outline-none focus:ring-2 ring-omie-blue" />
                        <input {...register(`viajantes.${index}.matricula`)} placeholder="Matrícula ERP (Opcional)" className="bg-white rounded-2xl px-6 py-5 text-xs font-bold shadow-sm outline-none focus:ring-2 ring-omie-blue" />
                     </div>

                     <div className="mt-10 pt-8 border-t border-slate-200 flex flex-wrap gap-10 items-center justify-between">
                        <label className="flex items-center gap-4 cursor-pointer group">
                           <input type="checkbox" {...register(`viajantes.${index}.is_acompanhante`)} className="w-6 h-6 rounded-xl text-omie-blue" />
                           <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest group-hover:text-omie-blue">Acompanhante</span>
                        </label>
                        <div className="flex items-center gap-4">
                           <span className="text-[9px] font-black text-slate-400 uppercase">Parentesco / Relação:</span>
                           <input {...register(`viajantes.${index}.parentesco`)} placeholder="Cônjuge, Filho, Outro..." className="bg-white px-4 py-2 rounded-xl text-[10px] font-black border border-slate-100" />
                        </div>
                        <div className="flex items-center gap-4">
                           <span className="text-[9px] font-black text-slate-400 uppercase">Rateio de Custo:</span>
                           <select {...register(`viajantes.${index}.rateio_custo`)} className="bg-white px-4 py-2 rounded-xl text-[10px] font-black border border-slate-100 uppercase">
                              <option value="Total">Total pela VP</option>
                              <option value="Parcial">Parcial (50%)</option>
                              <option value="Nao">Próprio (Zero)</option>
                           </select>
                        </div>
                     </div>
                  </div>
                ))}
             </div>
          </section>

          {/* Seção 3: Roteiro e Logística */}
          <section className="bg-white p-12 rounded-[3.5rem] shadow-xl space-y-12 relative overflow-hidden">
             <div className="flex justify-between items-center relative z-10">
                <h2 className="text-xs font-black text-slate-400 uppercase tracking-[0.3em] flex items-center gap-2 italic text-center"><MapPin size={16} /> Itinerário Dinâmico</h2>
                 <button type="button" onClick={() => appendTrecho({ origem: "", destino: "", modal: "Aereo", data: "" })}
                  className="text-omie-blue font-black text-[10px] uppercase tracking-widest flex items-center gap-2 hover:translate-x-1 transition-transform">
                  <Plus size={16} /> Novo Trecho
                </button>
             </div>

             <div className="space-y-6 relative z-10">
                {trechoFields.map((field, index) => (
                  <div key={field.id} className="grid grid-cols-1 md:grid-cols-5 gap-4 p-8 bg-slate-50 rounded-[2.5rem] border border-slate-100 items-end animate-in slide-in-from-right-4 duration-300">
                      <div className="space-y-2">
                        <label className="text-[8px] font-black text-slate-400 uppercase tracking-widest ml-1">Origem</label>
                        <input {...register(`trechos.${index}.origem`)} placeholder="Ex: Curitiba" className="w-full bg-white rounded-xl px-4 py-3 text-[10px] font-bold shadow-sm outline-none" />
                      </div>
                      <div className="space-y-2">
                        <label className="text-[8px] font-black text-slate-400 uppercase tracking-widest ml-1">Destino</label>
                        <input {...register(`trechos.${index}.destino`)} placeholder="Ex: São Paulo" className="w-full bg-white rounded-xl px-4 py-3 text-[10px] font-bold shadow-sm outline-none" />
                      </div>
                      <div className="space-y-2">
                        <label className="text-[8px] font-black text-slate-400 uppercase tracking-widest ml-1">Modal</label>
                        <select {...register(`trechos.${index}.modal`)} className="w-full bg-white rounded-xl px-4 py-3 text-[9px] font-black uppercase shadow-sm">
                           <option value="Aereo">Aéreo</option>
                           <option value="Carro_Proprio">Carro Próprio</option>
                           <option value="Carro_Alugado">Carro Alugado</option>
                           <option value="Onibus">Ônibus</option>
                           <option value="Van">Van Empresa</option>
                        </select>
                      </div>
                      <div className="space-y-2">
                        <label className="text-[8px] font-black text-slate-400 uppercase tracking-widest ml-1">Data</label>
                        <input type="date" {...register(`trechos.${index}.data`)} className="w-full bg-white rounded-xl px-4 py-3 text-[10px] font-black uppercase shadow-sm" />
                      </div>
                      <div className="space-y-2">
                        <label className="text-[8px] font-black text-slate-400 uppercase tracking-widest ml-1">Horário Pref.</label>
                        <input type="time" {...register(`trechos.${index}.horario_preferencial`)} className="w-full bg-white rounded-xl px-4 py-3 text-[10px] font-black uppercase shadow-sm" />
                      </div>
                  </div>
                ))}
             </div>
          </section>

          {/* Seção 4: Veículo (Condicional) */}
          {watchAll.trechos.some(t => t.modal === 'Carro_Proprio') && (
            <section className="bg-slate-900 p-12 rounded-[3.5rem] shadow-2xl space-y-12 animate-in zoom-in-95 duration-500 relative overflow-hidden">
               <div className="absolute top-0 right-0 p-10 text-slate-800 -mr-10 -mt-10 rotate-12"><Car size={180} /></div>
               <div className="flex items-center gap-6 relative">
                  <div className="bg-omie-blue/20 p-5 rounded-3xl border border-omie-blue/20 text-omie-blue"><Calculator size={32} /></div>
                  <h4 className="text-base font-black text-white uppercase italic tracking-tighter leading-none">Cálculo de Reembolso Logístico</h4>
               </div>

               <div className="grid grid-cols-1 md:grid-cols-4 gap-6 relative">
                  <div className="space-y-2">
                     <label className="text-[10px] font-black text-slate-600 uppercase tracking-widest ml-1">Placa do Veículo</label>
                     <input {...register("veiculo.placa")} className="w-full bg-slate-800 border-none rounded-2xl px-5 py-4 font-black text-white text-sm" />
                  </div>
                  <div className="space-y-2">
                     <label className="text-[10px] font-black text-slate-600 uppercase tracking-widest ml-1">Distância (Ida+Volta)</label>
                     <input type="number" {...register("veiculo.distancia_ida_volta_km", { valueAsNumber: true })} className="w-full bg-slate-800 border-none rounded-2xl px-5 py-4 font-black text-white text-sm" />
                  </div>
                  <div className="space-y-2">
                     <label className="text-[10px] font-black text-slate-600 uppercase tracking-widest ml-1">Pedágios Estimados (R$)</label>
                     <input type="number" {...register("veiculo.pedagios_estimados", { valueAsNumber: true })} className="w-full bg-slate-800 border-none rounded-2xl px-5 py-4 font-black text-white text-sm" />
                  </div>
                  <div className="space-y-2">
                     <label className="text-[10px] font-black text-slate-600 uppercase tracking-widest ml-1">Motorista Responsável</label>
                     <input {...register("veiculo.motorista")} className="w-full bg-slate-800 border-none rounded-2xl px-5 py-4 font-black text-white text-sm" />
                  </div>
               </div>

               <div className="bg-white/5 p-10 rounded-[3rem] border border-white/10 flex justify-between items-center relative backdrop-blur-md">
                  <div className="flex flex-col">
                     <span className="text-[10px] font-black text-omie-blue uppercase tracking-[0.3em] block">Total Estimado de Rodagem</span>
                     <span className="text-5xl font-black text-white italic tracking-tighter mt-2 leading-none">R$ {watchAll.veiculo.custo_total.toLocaleString('pt-BR')}</span>
                  </div>
                  <ShieldCheck size={48} className="text-white/10" />
               </div>
            </section>
          )}
        </div>

        {/* Lateral de Auditoria e Fechamento */}
        <aside className="space-y-8 sticky top-36 h-fit z-30">
           {/* Resumo Financeiro */}
           <section className="bg-white p-12 rounded-[3.5rem] shadow-2xl space-y-10 border-t-8 border-omie-blue relative">
              <div className="flex flex-col text-center">
                 <span className="text-[11px] font-black text-slate-400 uppercase tracking-widest mb-2 italic">Estimativa Total do Deslocamento</span>
                 <span className="text-4xl font-black text-slate-800 italic tracking-tighter leading-none block">R$ {totalBudget.toLocaleString('pt-BR')}</span>
              </div>

              <div className="space-y-6 pt-6 border-t border-slate-100">
                 <div className="flex justify-between items-center">
                    <span className="text-[10px] font-black text-slate-500 uppercase tracking-tight italic">Destino Logístico</span>
                    <label className="flex items-center gap-3 bg-slate-50 px-3 py-2 rounded-xl border cursor-pointer hover:border-omie-blue transition-all">
                       <input type="checkbox" {...register("is_internacional")} className="w-4 h-4 rounded text-omie-blue" />
                       <span className="text-[9px] font-black uppercase text-slate-800">{watchAll.is_internacional ? 'INTL' : 'NAC'}</span>
                    </label>
                 </div>

                 <div className="bg-slate-50 p-6 rounded-[2rem] space-y-4">
                    <div className="flex justify-between items-center group">
                       <label className="flex items-center gap-3 cursor-pointer">
                          <input type="checkbox" {...register("hospedagem.necessita")} className="w-4 h-4 rounded text-omie-blue" />
                          <span className="text-[10px] font-black text-slate-600 uppercase tracking-tight">Hospedagem?</span>
                       </label>
                       <Hotel size={18} className={watchAll.hospedagem.necessita ? "text-omie-blue" : "text-slate-300"} />
                    </div>
                    {watchAll.hospedagem.necessita && (
                      <div className="animate-in fade-in slide-in-from-top-2 flex gap-2">
                         <input type="number" {...register("hospedagem.diarias")} className="w-16 bg-white border border-slate-200 rounded-lg p-2 text-[10px] font-black" />
                         <span className="text-[8px] font-black text-slate-400 uppercase leading-none self-center">Diárias</span>
                      </div>
                    )}
                 </div>

                 <div className="bg-slate-50 p-6 rounded-[2rem] space-y-4">
                    <div className="flex justify-between items-center">
                       <span className="text-[10px] font-black text-slate-600 uppercase tracking-tight flex items-center gap-2 italic"><Utensils size={14} /> Alimentação</span>
                       <select {...register("alimentacao.tipo")} className="bg-white border text-[10px] font-black px-2 py-1 rounded-xl uppercase">
                          <option value="Diaria">Diária</option>
                          <option value="Incluida">Incluso</option>
                          <option value="Avulsa">Avulsa</option>
                       </select>
                    </div>
                 </div>
              </div>

              <button onClick={handleSubmit(onSubmit)} disabled={loading || !totalBudget}
                className="w-full bg-omie-blue text-white font-black text-sm py-8 rounded-[3rem] hover:opacity-95 transition-all shadow-2xl shadow-blue-500/20 uppercase tracking-[0.2em] flex items-center justify-center gap-4 border-b-8 border-blue-900 leading-none">
                {loading ? "ENVIANDO..." : "SOLICITAR VIAGEM"} <ArrowRight size={24} />
              </button>
           </section>

           <div className="p-8 bg-slate-900 rounded-[2.5rem] shadow-xl space-y-4">
              <div className="flex items-start gap-4 text-white/40">
                 <ShieldCheck size={24} className="text-omie-blue mt-0.5 shrink-0" />
                 <p className="text-[10px] font-medium leading-relaxed uppercase tracking-tight italic">
                    Ao confirmar, você atesta a veracidade do objetivo e dos resultados esperados. Auditoria constante pelo N3 (Diego).
                 </p>
              </div>
           </div>
        </aside>
      </main>
    </div>
  );
}
