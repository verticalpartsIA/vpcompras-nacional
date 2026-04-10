"use client";

import React, { useState } from 'react';
import { useForm, useWatch } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { 
  Settings, Truck, ShieldCheck, Calendar, Info, 
  MapPin, BadgeDollarSign, Plus, ArrowRight,
  ClipboardList, AlertTriangle, CheckCircle2,
  Toolbox
} from 'lucide-react';
import { useRouter } from 'next/navigation';

const gearSchema = z.object({
  nome: z.string().min(1, "Obrigatório"),
  tipo: z.string().min(1, "Selecione o tipo"),
  localizacao: z.string().min(1, "Localização obrigatória"),
  marca: z.string().optional(),
  modelo: z.string().min(1, "Modelo obrigatório"),
  numero_serie: z.string().min(1, "Número de série obrigatório"),
  data_instalacao: z.string().min(1, "Data de instalação obrigatória"),
  valor_aquisicao: z.number().min(1, "Obrigatório"),
  vida_util: z.number().min(1, "Vida útil em meses"),

  // Frota / Viaturas
  e_viatura: z.boolean().default(false),
  placa: z.string().optional(),
  km_por_litro: z.number().optional(),
  combustivel_tipo: z.string().optional(),

  // Contrato
  tem_contrato: z.boolean().default(false),
  fornecedor_id: z.string().optional(),
  numero_contrato: z.string().optional(),
  vigencia_fim: z.string().optional(),
  cobertura: z.string().optional(),
  valor_anual: z.number().optional(),

  // Manutenção
  tipo_manutencao: z.string().default("PREVENTIVA"),
  frequencia_dias: z.number().default(180),
  data_proxima: z.string().min(1, "Próxima data obrigatória"),
  valor_estimado: z.number().optional()
});

/**
 * Cadastro de Ativos e Equipamentos - Módulo Manutenção (Fase 5)
 * @architect-spaceX @omie-expert @qa-lead
 */
export default function NovoEquipamentoPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  
  const { register, control, handleSubmit, watch, formState: { errors } } = useForm({
    resolver: zodResolver(gearSchema),
    defaultValues: {
      tipo: "Maquinário",
      e_viatura: false,
      tem_contrato: false,
      tipo_manutencao: "PREVENTIVA",
      frequencia_dias: 180
    }
  });

  const watchEViatura = watch("e_viatura");
  const watchTemContrato = watch("tem_contrato");

  const onSubmit = async (data: any) => {
    setLoading(true);
    // Simulação de salvamento e trigger do motor de decisão
    await new Promise(r => setTimeout(r, 1200));
    alert("🚀 Ativo cadastrado com sucesso! Aguardando aprovação técnica da Engenharia.");
    router.push('/dashboard');
    setLoading(false);
  };

  return (
    <div className="flex flex-col min-h-screen bg-[#f1f4f9] pb-32">
      <header className="bg-white border-b border-slate-200 px-12 py-10 flex justify-between items-center sticky top-0 z-30 shadow-sm border-t-8 border-omie-blue">
        <div className="flex items-center gap-6">
           <div className="bg-omie-blue/10 p-4 rounded-3xl text-omie-blue shadow-inner"><Toolbox size={32} /></div>
           <div>
              <h1 className="text-xl font-black text-slate-800 tracking-tighter uppercase italic leading-none">Cadastro Técnico de Ativos</h1>
              <span className="text-[10px] font-black text-omie-blue uppercase tracking-widest mt-1 block tracking-[0.3em]">Manutenção Intelligence Division</span>
           </div>
        </div>
      </header>

      <main className="p-12 max-w-6xl mx-auto w-full space-y-12 text-slate-800">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-12">
          
          {/* Seção 1: Identificação do Ativo */}
          <section className="bg-white p-12 rounded-[4rem] shadow-xl space-y-10 border border-slate-100">
             <div className="flex items-center justify-between pb-4 border-b border-slate-50">
                <div className="flex items-center gap-3">
                   <Info className="text-slate-300" size={24} />
                   <h2 className="text-xs font-black text-slate-400 uppercase tracking-widest italic">01. Identificação e Localização</h2>
                </div>
                <div className="flex items-center gap-4 bg-slate-50 px-6 py-3 rounded-2xl border border-slate-100">
                   <input type="checkbox" {...register("e_viatura")} className="w-5 h-5 rounded-lg text-omie-blue" />
                   <span className="text-[10px] font-black text-slate-500 uppercase italic">Este ativo é uma Viatura?</span>
                </div>
             </div>

             <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="md:col-span-2 space-y-2">
                   <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Nome do Equipamento/Ativo</label>
                   <input {...register("nome")} placeholder="Ex: Empilhadeira Elétrica Toyota..." className="w-full bg-slate-50 border-none rounded-2xl px-8 py-5 font-bold outline-none focus:ring-2 ring-omie-blue" />
                </div>
                <div className="space-y-2">
                   <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Tipo de Ativo</label>
                   <select {...register("tipo")} className="w-full bg-slate-50 border-none rounded-2xl px-8 py-5 font-black uppercase text-[10px]">
                      <option>Maquinário</option>
                      <option>Ferramenta</option>
                      <option>Viatura</option>
                      <option>Infraestrutura</option>
                   </select>
                </div>
             </div>

             <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="space-y-2">
                   <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Localização (Departamento/Site)</label>
                   <input {...register("localizacao")} className="w-full bg-slate-50 border-none rounded-2xl px-8 py-5 font-bold shadow-inner" />
                </div>
                <div className="space-y-2">
                   <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Marca / Fabricante</label>
                   <input {...register("marca")} className="w-full bg-slate-50 border-none rounded-2xl px-8 py-5 font-bold shadow-inner" />
                </div>
                <div className="space-y-2">
                   <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Modelo / Nº Série</label>
                   <input {...register("numero_serie")} className="w-full bg-slate-50 border-none rounded-2xl px-8 py-5 font-bold shadow-inner" />
                </div>
             </div>

             {/* Condicional Viatura */}
             {watchEViatura && (
               <div className="p-10 bg-slate-900 rounded-[3rem] shadow-2xl space-y-8 animate-in slide-in-from-top-4 duration-300">
                  <div className="flex items-center gap-4 text-omie-blue">
                     <Truck size={24} />
                     <h3 className="text-white font-black text-[10px] uppercase tracking-widest italic">Módulo de Frota Ativo</h3>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                     <div className="space-y-2">
                        <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest ml-1">Placa do Veículo</label>
                        <input {...register("placa")} className="w-full bg-slate-800 border-none rounded-2xl px-6 py-4 font-black text-white" />
                     </div>
                     <div className="space-y-2">
                        <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest ml-1">Performance (KM/L)</label>
                        <input type="number" step="0.1" {...register("km_por_litro")} className="w-full bg-slate-800 border-none rounded-2xl px-6 py-4 font-black text-white" />
                     </div>
                     <div className="space-y-2">
                        <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest ml-1">Combustível</label>
                        <select {...register("combustivel_tipo")} className="w-full bg-slate-800 border-none rounded-2xl px-6 py-4 font-black uppercase text-[9px] text-white">
                           <option>Diesel S10</option>
                           <option>Gasolina Comum</option>
                           <option>Etanol</option>
                           <option>Elétrico</option>
                        </select>
                     </div>
                  </div>
               </div>
             )}
          </section>

          {/* Seção 2: Contrato e SLA */}
          <section className="bg-white p-12 rounded-[4.5rem] shadow-xl space-y-10 border border-slate-100 relative group">
             <div className="flex items-center justify-between pb-4 border-b border-slate-50">
                <div className="flex items-center gap-3">
                   <ShieldCheck className="text-slate-300" size={24} />
                   <h2 className="text-xs font-black text-slate-400 uppercase tracking-widest italic">02. Cobertura de Contrato (SLA)</h2>
                </div>
                <div className="flex items-center gap-4 bg-slate-50 px-6 py-3 rounded-2xl">
                   <input type="checkbox" {...register("tem_contrato")} className="w-5 h-5 rounded-lg text-omie-blue" />
                   <span className="text-[10px] font-black text-slate-500 uppercase italic">Ativo possui contrato de manutenção?</span>
                </div>
             </div>

             {watchTemContrato && (
               <div className="grid grid-cols-1 md:grid-cols-3 gap-10 animate-in fade-in zoom-in-95">
                  <div className="space-y-2">
                     <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Nº do Contrato / Fornecedor</label>
                     <input {...register("numero_contrato")} className="w-full bg-slate-50 border-none rounded-2xl px-8 py-5 font-bold shadow-inner" />
                  </div>
                  <div className="space-y-2">
                     <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Vigência Final</label>
                     <input type="date" {...register("vigencia_fim")} className="w-full bg-slate-50 border-none rounded-2xl px-8 py-5 font-bold shadow-inner" />
                  </div>
                  <div className="space-y-2">
                     <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Valor Anual do SLA</label>
                     <div className="flex items-center gap-3 bg-slate-50 rounded-2xl px-8 py-5 border border-slate-50">
                        <span className="text-[10px] font-black text-omie-blue px-2">BRL</span>
                        <input type="number" {...register("valor_anual")} className="bg-transparent font-black w-full outline-none" />
                     </div>
                  </div>
               </div>
             )}

             <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                <div className="space-y-2">
                   <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Tipo de Cobertura</label>
                   <div className="grid grid-cols-3 gap-4">
                      {["TOTAL", "PARCIAL", "PREVENTIVA"].map(tipo => (
                        <button key={tipo} type="button" className="bg-slate-50 text-slate-600 py-3 rounded-xl text-[9px] font-black border border-slate-100 uppercase hover:bg-omie-blue hover:text-white transition-all">
                           {tipo}
                        </button>
                      ))}
                   </div>
                </div>
                <div className="bg-slate-50 p-6 rounded-[2.5rem] border border-slate-100 flex items-center gap-4">
                   <BadgeDollarSign className="text-omie-blue" size={24} />
                   <div>
                      <span className="text-[9px] font-black text-slate-400 uppercase italic">ROI Inteligente</span>
                      <p className="text-[10px] font-bold text-slate-700 uppercase leading-none mt-1">O sistema calculará automaticamente o custo de depreciação mensal.</p>
                   </div>
                </div>
             </div>
          </section>

          {/* Seção 3: Plano de Manutenção */}
          <section className="bg-white p-12 rounded-[5rem] shadow-xl space-y-12 border border-slate-100">
             <div className="flex items-center gap-4">
                <Calendar className="text-slate-300" size={24} />
                <h2 className="text-xs font-black text-slate-400 uppercase tracking-widest italic">03. Plano de Manutenção Proativo</h2>
             </div>

             <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
                <div className="space-y-2">
                   <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Tipo de Intervenção Alvo</label>
                   <select {...register("tipo_manutencao")} className="w-full bg-slate-50 border-none rounded-2xl px-8 py-5 font-black uppercase text-[10px]">
                      <option value="PREVENTIVA">Preventiva (Recorrente)</option>
                      <option value="PREDITIVA">Preditiva (Baseada em Uso)</option>
                   </select>
                </div>
                <div className="space-y-2">
                   <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Frequência (Dias)</label>
                   <input type="number" {...register("frequencia_dias")} className="w-full bg-slate-50 border-none rounded-2xl px-8 py-5 font-black shadow-inner" />
                </div>
                <div className="space-y-2 text-omie-blue">
                   <label className="text-[10px] font-black text-omie-blue uppercase tracking-widest ml-1 opacity-60">Próxima Manutenção Programada</label>
                   <input type="date" {...register("data_proxima")} className="w-full bg-omie-blue/5 border-none rounded-2xl px-8 py-5 font-black uppercase shadow-inner border border-omie-blue/10" />
                </div>
             </div>

             <div className="bg-green-50 border border-green-100 p-10 rounded-[4rem] space-y-4 flex items-center justify-between">
                <div className="flex items-center gap-6">
                   <CheckCircle2 className="text-green-500" size={32} />
                   <div>
                      <h4 className="text-green-800 font-black text-xs uppercase italic tracking-tighter">Certificado de Proatividade</h4>
                      <p className="text-[10px] text-green-600 font-bold uppercase mt-1 tracking-widest">O cadastro de planos preventivos reduz custos em até 35% no longo prazo.</p>
                   </div>
                </div>
             </div>

             <button type="submit" disabled={loading}
               className="w-full bg-omie-blue text-white font-black text-sm py-12 rounded-[4rem] hover:opacity-95 transition-all shadow-2xl shadow-blue-500/20 uppercase tracking-[0.4em] flex items-center justify-center gap-4 border-b-8 border-blue-900">
               {loading ? "CONFIGURANDO ATIVO..." : (
                 <>CADASTRAR ATIVO E ATIVAR MONITORAMENTO <ArrowRight size={24} /></>
               )}
             </button>
          </section>

        </form>
      </main>
    </div>
  );
}
