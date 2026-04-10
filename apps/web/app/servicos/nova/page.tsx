"use client";

import React, { useState, useEffect } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { 
  Wrench, Layers, FileText, MapPin, BadgeDollarSign, 
  Plus, Trash2, ShieldCheck, Camera, Calendar, ArrowRight,
  HardHat, Info, CheckCircle2, Search, AlertTriangle
} from 'lucide-react';
import { submitSolicitacaoServico } from '../actions';
import { useRouter } from 'next/navigation';

const serviceSchema = z.object({
  tipo_servico: z.string().min(1, "Especifique o tipo de serviço"),
  recorrente: z.boolean().default(false),
  periodicidade: z.string().optional(),
  prazo_contrato: z.number().optional(),
  valor_recorrente: z.number().optional(),
  
  descricao: z.string().min(20, "O escopo deve ter ao menos 20 caracteres para clareza técnica"),
  
  // Etapas de Medição (MS Project Style)
  etapas: z.array(z.object({
    descricao: z.string().min(1, "Obrigatório"),
    percentual: z.number().min(1).max(100),
    valor_calculado: z.number().optional(),
    prazo_inicio: z.string().min(1, "Data de início obrigatória"),
    prazo_fim: z.string().min(1, "Data de término obrigatória"),
    criterios: z.string().min(10, "Defina os critérios de aceitação técnica")
  })).min(1, "Defina ao menos uma etapa de medição"),

  // Documentação Técnica
  art_numero: z.string().min(1, "Número da ART é obrigatório"),
  engenheiro: z.string().min(1, "Nome do engenheiro responsável é obrigatório"),
  validade: z.string().min(1, "Data de validade da ART obrigatória"),
  art_pdf_url: z.string().optional(),
  
  // Local e Site Survey
  cep: z.string().min(8, "CEP inválido"),
  endereco: z.string().min(5, "Endereço completo obrigatório"),
  acesso: z.string().min(1, "Descreva as condições de acesso"),
  epis: z.array(z.string()).min(1, "Selecione ao menos um EPI obrigatório"),
  fotos_local: z.array(z.string()).min(3, "Mínimo de 3 fotos do local (Estado Zero)"),

  // Financeiro
  valor_total: z.number().min(1, "Defina o valor total estimado"),
  forma_pagamento: z.string().min(1, "Sugira uma forma de pagamento"),
  iss: z.boolean().default(true),
  inss: z.boolean().default(true)
});

/**
 * Wizard de Contratação de Serviços e Engenharia - Versão Definitiva
 * @architect-spaceX @omie-expert @qa-lead
 */
export default function NovoServicoPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  
  const { register, control, handleSubmit, setValue, watch, formState: { errors } } = useForm({
    resolver: zodResolver(serviceSchema),
    defaultValues: {
      tipo_servico: "Manutenção de Estruturas Metálicas",
      recorrente: false,
      iss: true,
      inss: true,
      epis: ["Capacete", "Bota", "Luvas"],
      etapas: [
        { descricao: "Mobilização de Canteiro e Segurança", percentual: 10, prazo_inicio: "", prazo_fim: "", criterios: "Equipe em site com EPIs e local isolado" }
      ],
      fotos_local: ["", "", ""] 
    }
  });

  const { fields: etapaFields, append: appendEtapa, remove: removeEtapa } = useFieldArray({
    control, name: "etapas"
  });

  const watchValorTotal = watch("valor_total");
  const etapas = watch("etapas");
  const percentualTotal = etapas?.reduce((acc, curr) => acc + (curr.percentual || 0), 0);

  // Rateio Automático de Valores por Etapa
  useEffect(() => {
    if (watchValorTotal > 0) {
      etapas?.forEach((e, idx) => {
        const val = (watchValorTotal * (e.percentual || 0)) / 100;
        setValue(`etapas.${idx}.valor_calculado` as any, Number(val.toFixed(2)));
      });
    }
  }, [watchValorTotal, etapas, setValue]);

  const onSubmit = async (data: any) => {
    if (percentualTotal !== 100) {
       alert("O somatório das etapas deve ser exatamente 100%. Atual: " + percentualTotal + "%");
       return;
    }
    setLoading(true);
    const res = await submitSolicitacaoServico(data);
    if (res.success) {
      alert("🏁 Solicitação de Engenharia enviada para Auditoria Técnica!");
      router.push('/dashboard');
    } else {
      alert("Erro ao validar serviço: " + res.error);
    }
    setLoading(false);
  };

  return (
    <div className="flex flex-col min-h-screen bg-[#f1f4f9] pb-40 text-slate-800">
      <header className="bg-white border-b border-slate-200 px-12 py-10 flex justify-between items-center sticky top-0 z-40 shadow-sm border-t-8 border-omie-blue">
        <div className="flex items-center gap-6">
           <div className="bg-omie-blue/10 p-4 rounded-3xl text-omie-blue shadow-inner"><Wrench size={32} /></div>
           <div>
              <h1 className="text-xl font-black text-slate-800 tracking-tighter uppercase italic leading-none">Contratação de Engenharia</h1>
              <span className="text-[10px] font-black text-omie-blue uppercase tracking-widest mt-1 block tracking-[0.3em]">VerticalParts Services Division</span>
           </div>
        </div>
        <div className="flex gap-4">
           {[1, 2, 3, 4, 5].map(step => (
             <div key={step} className={`w-10 h-2 rounded-full transition-all ${currentStep >= step ? 'bg-omie-blue' : 'bg-slate-200'}`} />
           ))}
        </div>
      </header>

      <main className="p-12 max-w-6xl mx-auto w-full space-y-12">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-12">
          
          {/* SEÇÃO 1: NATUREZA DO SERVIÇO */}
          <section className="bg-white p-12 rounded-[4rem] shadow-xl space-y-10 border border-slate-100 relative group overflow-hidden">
             <div className="flex items-center gap-3">
                <FileText className="text-slate-300" size={24} />
                <h2 className="text-xs font-black text-slate-400 uppercase tracking-widest italic">01. Descritivo e Recorrência</h2>
             </div>

             <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-2">
                   <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Tipo de Serviço (Obra/Manutenção/TI)</label>
                   <input {...register("tipo_servico")} className="w-full bg-slate-50 border-none rounded-3xl px-8 py-5 font-bold outline-none focus:ring-2 ring-omie-blue" />
                </div>
                <div className="flex items-center gap-6 bg-slate-50 px-8 py-5 rounded-3xl border border-slate-50">
                   <div className="flex items-center gap-3">
                      <input type="checkbox" {...register("recorrente")} className="w-6 h-6 rounded-lg text-omie-blue" />
                      <span className="text-[10px] font-black text-slate-500 uppercase">Recorrente?</span>
                   </div>
                   {watch("recorrente") && (
                     <div className="flex gap-3 animate-in fade-in zoom-in-95">
                        <select {...register("periodicidade")} className="bg-white rounded-xl text-[10px] font-black px-4 py-2 border shadow-sm">
                           <option>Mensal</option>
                           <option>Trimestral</option>
                        </select>
                        <input type="number" {...register("prazo_contrato")} placeholder="Meses" className="w-20 bg-white rounded-xl text-[10px] font-black px-3 py-2 border shadow-sm" />
                     </div>
                   )}
                </div>
             </div>

             <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Escopo Técnico Detalhado</label>
                <textarea {...register("descricao")} placeholder="Descreva os resultados esperados e limites do serviço..." 
                  className="w-full bg-slate-50 border-none rounded-[2.5rem] p-8 text-xs font-medium italic outline-none focus:ring-2 ring-omie-blue min-h-[160px]" />
             </div>
          </section>

          {/* SEÇÃO 2: CRONOGRAMA DE MEDIÇÕES */}
          <section className="bg-white p-12 rounded-[4rem] shadow-xl space-y-10 border border-slate-100 relative">
             <div className="flex justify-between items-center">
                <div className="flex items-center gap-3">
                   <Layers className="text-slate-300" size={24} />
                   <h2 className="text-xs font-black text-slate-400 uppercase tracking-widest italic">02. Cronograma de Medições (Físico-Financeiro)</h2>
                </div>
                <button type="button" onClick={() => appendEtapa({ descricao: "", percentual: 0, prazo_inicio: "", prazo_fim: "", criterios: "" })}
                  className="bg-omie-blue text-white px-8 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:opacity-90 shadow-xl shadow-blue-500/20 flex items-center gap-2">
                  <Plus size={16} /> Adicionar Etapa
                </button>
             </div>

             <div className="space-y-6">
                {etapaFields.map((field, index) => (
                  <div key={field.id} className="p-10 bg-slate-50 rounded-[3rem] border border-slate-100 space-y-10 transition-all hover:border-omie-blue/20">
                     <div className="flex justify-between items-center px-4">
                        <span className="bg-omie-blue text-white w-10 h-10 rounded-2xl flex items-center justify-center font-black text-xs italic">#{index+1}</span>
                        {index > 0 && <button type="button" onClick={() => removeEtapa(index)} className="text-red-400 hover:text-red-600 transition-colors"><Trash2 size={20} /></button>}
                     </div>

                     <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
                        <div className="md:col-span-4 space-y-2">
                           <label className="text-[9px] font-black text-slate-400 uppercase block ml-2">Descrição da Etapa</label>
                           <input {...register(`etapas.${index}.descricao`)} placeholder="Ex: Montagem Mecânica" className="w-full bg-white rounded-2xl px-6 py-4 text-[10px] font-bold shadow-sm" />
                        </div>
                        <div className="md:col-span-2 space-y-2">
                           <label className="text-[9px] font-black text-slate-400 uppercase block ml-2">Peso (%)</label>
                           <input type="number" {...register(`etapas.${index}.percentual`, { valueAsNumber: true })} className="w-full bg-white rounded-2xl px-6 py-4 text-[10px] font-black shadow-sm" />
                        </div>
                        <div className="md:col-span-2 space-y-2">
                           <label className="text-[9px] font-black text-omie-blue uppercase block ml-2">Valor Estimado</label>
                           <div className="bg-white rounded-2xl px-6 py-4 text-[10px] font-black text-omie-blue shadow-inner border border-slate-50 italic">
                              R$ {etapas[index]?.valor_calculado?.toLocaleString('pt-BR')}
                           </div>
                        </div>
                        <div className="md:col-span-2 space-y-2">
                           <label className="text-[9px] font-black text-slate-400 uppercase block ml-2">Prazo Início</label>
                           <input type="date" {...register(`etapas.${index}.prazo_inicio`)} className="w-full bg-white rounded-2xl px-4 py-4 text-[9px] font-black" />
                        </div>
                        <div className="md:col-span-2 space-y-2">
                           <label className="text-[9px] font-black text-slate-400 uppercase block ml-2">Prazo Fim</label>
                           <input type="date" {...register(`etapas.${index}.prazo_fim`)} className="w-full bg-white rounded-2xl px-4 py-4 text-[9px] font-black" />
                        </div>
                     </div>
                     <div className="space-y-2 px-2">
                        <label className="text-[9px] font-black text-slate-400 uppercase ml-2">Critérios de Aceitação Técnica (Mandatório para Vistoria)</label>
                        <input {...register(`etapas.${index}.criterios`)} placeholder="Ex: Teste de carga e soldagem validada pelo inspetor" className="w-full bg-white rounded-2xl px-8 py-5 text-[10px] font-bold italic shadow-sm" />
                     </div>
                  </div>
                ))}
             </div>

             <div className="flex bg-slate-900 p-8 rounded-[2.5rem] items-center justify-between text-white border-b-8 border-omie-blue">
                <div className="flex items-center gap-4">
                   <GanttChartSquare size={32} className="text-omie-blue" />
                   <div>
                      <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Total Acumulado das Medições</span>
                      <h4 className="text-xl font-black italic tracking-tighter">{percentualTotal}% Planejado</h4>
                   </div>
                </div>
                {percentualTotal !== 100 && (
                  <div className="flex items-center gap-2 text-red-400 text-[10px] font-black uppercase animate-pulse">
                     <AlertTriangle size={16} /> O somatório deve ser 100%
                  </div>
                )}
             </div>
          </section>

          {/* SEÇÃO 3: DOCUMENTAÇÃO TÉCNICA (ART) */}
          <section className="bg-slate-900 p-12 rounded-[4rem] shadow-2xl space-y-12">
             <div className="flex items-center gap-6">
                <div className="bg-omie-blue/20 p-5 rounded-3xl border border-omie-blue/20 text-omie-blue shadow-inner"><ShieldCheck size={32} /></div>
                <div>
                   <h3 className="text-white font-black text-base uppercase italic tracking-tighter leading-none">Documentação Técnica (ART/RRT)</h3>
                   <p className="text-[10px] text-slate-500 font-bold uppercase mt-2 tracking-widest">Validação obrigatória pela Engenharia antes da execução física.</p>
                </div>
             </div>

             <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
                <div className="space-y-2">
                   <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest ml-1">Número da ART</label>
                   <input {...register("art_numero")} placeholder="Ex: 2024.0001-X" className="w-full bg-slate-800 border-none rounded-2xl px-8 py-5 font-black text-white outline-none focus:ring-2 ring-omie-blue" />
                </div>
                <div className="space-y-2">
                   <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest ml-1">Engenheiro Responsável</label>
                   <input {...register("engenheiro")} className="w-full bg-slate-800 border-none rounded-2xl px-8 py-5 font-black text-white outline-none focus:ring-2 ring-omie-blue" />
                </div>
                <div className="space-y-2">
                   <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest ml-1">Data de Validade</label>
                   <input type="date" {...register("validade")} className="w-full bg-slate-800 border-none rounded-2xl px-8 py-5 font-black text-white outline-none focus:ring-2 ring-omie-blue" />
                </div>
             </div>

             <div className="flex bg-white/5 p-10 rounded-[3rem] border border-white/10 items-center justify-between group hover:border-omie-blue/30 transition-all cursor-pointer">
                <div className="flex items-center gap-6 text-slate-400">
                   <FileText size={40} className="group-hover:text-omie-blue transition-colors" />
                   <div>
                      <span className="text-[10px] font-black uppercase text-white tracking-widest">Upload PDF da ART</span>
                      <p className="text-[9px] font-bold uppercase text-slate-600 mt-1">Clique para selecionar o certificado técnico oficial.</p>
                   </div>
                </div>
                <button type="button" className="px-10 py-3 bg-slate-800 rounded-2xl text-[10px] font-black text-omie-blue uppercase hover:bg-slate-700 transition-all shadow-md">Anexar PDF</button>
             </div>
          </section>

          {/* SEÇÃO 4: LOCAL E ESTADO ZERO */}
          <section className="bg-white p-12 rounded-[5rem] shadow-xl space-y-12 border border-slate-100">
             <div className="flex items-center gap-4">
                <MapPin className="text-slate-300" size={24} />
                <h2 className="text-xs font-black text-slate-400 uppercase tracking-widest italic">03. Local de Site e Estado Zero (Survey)</h2>
             </div>

             <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="space-y-2">
                   <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Busca CEP</label>
                   <div className="relative">
                      <input {...register("cep")} placeholder="00000-000" className="w-full bg-slate-50 rounded-3xl px-8 py-5 font-bold outline-none focus:ring-2 ring-omie-blue" />
                      <Search className="absolute right-6 top-5 text-slate-300" size={20} />
                   </div>
                </div>
                <div className="md:col-span-2 space-y-2">
                   <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Endereço Completo de Obra</label>
                   <input {...register("endereco")} className="w-full bg-slate-50 rounded-3xl px-8 py-5 font-bold shadow-inner" />
                </div>
             </div>

             <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-2">
                   <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Condições de Acesso / Restrição</label>
                   <input {...register("acesso")} className="w-full bg-slate-50 rounded-3xl px-8 py-5 font-bold" />
                </div>
                <div className="space-y-4">
                   <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">EPIs/EPCs Exigidos em Site</label>
                   <div className="flex flex-wrap gap-3">
                      {["Capacete", "Protetor Auricular", "Cinto Segurança", "Bota Biqueira", "Máscara"].map(item => (
                        <span key={item} className="px-5 py-2 bg-slate-100 rounded-xl text-[9px] font-black text-slate-500 uppercase border border-slate-200">
                           {item}
                        </span>
                      ))}
                   </div>
                </div>
             </div>

             <div className="space-y-8">
                <div className="flex justify-between items-center border-b border-slate-100 pb-4">
                   <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 flex items-center gap-2 italic"><Camera size={18} /> Fotos do Local - Estado Zero (Auditoria Inicial)</h4>
                   <span className="text-[9px] font-black text-red-500 uppercase tracking-tighter">Mínimo 3 fotos obrigatórias</span>
                </div>
                <div className="grid grid-cols-3 md:grid-cols-6 gap-6">
                   {[1, 2, 3, 4, 5, 6].map(i => (
                     <div key={i} className="aspect-square bg-slate-50 rounded-3xl border-2 border-dashed border-slate-200 flex items-center justify-center text-slate-300 hover:border-omie-blue hover:text-omie-blue transition-all cursor-pointer group relative overflow-hidden">
                        <Plus size={24} className="group-hover:scale-110 transition-transform" />
                        <span className="absolute bottom-4 text-[8px] font-black uppercase text-slate-300 group-hover:text-omie-blue animate-pulse">Upload</span>
                     </div>
                   ))}
                </div>
             </div>
          </section>

          {/* SEÇÃO 5: FINANCEIRO E FECHAMENTO */}
          <section className="bg-white p-16 rounded-[6rem] shadow-2xl border-t-[12px] border-omie-blue space-y-16">
             <div className="flex items-center gap-8">
                <div className="bg-omie-blue p-6 rounded-[2.5rem] shadow-xl shadow-blue-500/20 text-white"><BadgeDollarSign size={48} /></div>
                <div>
                   <h3 className="text-slate-800 font-black text-xl uppercase italic tracking-tighter">Budget e Governança de Pagamento</h3>
                   <p className="text-[11px] text-slate-400 font-bold uppercase mt-2 italic tracking-widest leading-relaxed">
                     O sistema calculará as retenções de impostos mandatórias para serviços prestados (VerticalParts Engineering Policy).
                   </p>
                </div>
             </div>

             <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
                <div className="bg-slate-50 p-12 rounded-[4rem] border border-slate-100 flex flex-col justify-center shadow-inner">
                   <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3 block italic ml-1">Valor Total Estimado</span>
                   <div className="flex items-baseline gap-4">
                      <span className="text-xl font-black text-omie-blue italic">BRL</span>
                      <input type="number" {...register("valor_total", { valueAsNumber: true })} className="bg-transparent text-4xl font-black text-slate-800 w-full outline-none leading-none italic" placeholder="0.00" />
                   </div>
                </div>

                <div className="bg-slate-50 p-12 rounded-[4rem] border border-slate-100 space-y-6">
                   <div className="flex justify-between items-center px-4">
                      <span className="text-[10px] font-black text-slate-600 uppercase italic">Retenção ISS (5%)</span>
                      <input type="checkbox" {...register("iss")} className="w-8 h-8 rounded-xl text-omie-blue" />
                   </div>
                   <div className="flex justify-between items-center px-4 border-t border-slate-200 pt-6">
                      <span className="text-[10px] font-black text-slate-600 uppercase italic">Retenção INSS (11%)</span>
                      <input type="checkbox" {...register("inss")} className="w-8 h-8 rounded-xl text-omie-blue" />
                   </div>
                </div>

                <div className="flex items-center">
                   <div className="flex items-start gap-4 text-green-500 bg-green-50 p-10 rounded-[3rem] border border-green-100/50">
                      <CheckCircle2 size={32} className="mt-1 flex-shrink-0" />
                      <p className="text-[10px] font-black uppercase leading-relaxed tracking-tight italic">
                        AVISO TÉCNICO: O pagamento será desbloqueado pelo financeiro APENAS após aprovação do Engenheiro Responsável no Portal de Vistorias.
                      </p>
                   </div>
                </div>
             </div>

             <button type="submit" disabled={loading}
               className="w-full bg-slate-900 text-white font-black text-base py-12 rounded-[4rem] hover:bg-omie-blue transition-all shadow-2xl shadow-slate-900/20 uppercase tracking-[0.4em] flex items-center justify-center gap-6 border-b-[10px] border-slate-800 disabled:opacity-50 group">
               {loading ? "PROCESSANDO AUDITORIA..." : (
                 <>ENVIAR PARA AUDITORIA TÉCNICA <ArrowRight size={32} className="group-hover:translate-x-2 transition-transform" /></>
               )}
             </button>
          </section>

        </form>
      </main>
    </div>
  );
}
