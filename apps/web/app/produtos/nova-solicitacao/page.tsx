"use client";

import React, { useState, useEffect } from 'react';
import { useForm, useFieldArray, useWatch } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { submitFullSolicitacao } from './actions';
import { createClient } from '../../../lib/supabase'; // Browser Client
import { 
  Plus, Trash2, Package, MapPin, Calendar, User, Save, ChevronLeft, Camera, Loader2 
} from 'lucide-react';
import Link from 'next/link';

// Padrão de Validação VerticalParts (Mín. 20 chars na justificativa)
const itemSchema = z.object({
  nome_descricao: z.string().min(3, "Nome do produto é obrigatório"),
  quantidade: z.number().min(0.01, "Mínimo 0.01"),
  unidade: z.string().default("UN"),
  valor_unitario_estimado: z.number().min(0.01, "Valor unitário obrigatório"),
  justificativa: z.string().min(20, "Justificativa deve ter no mínimo 20 caracteres para auditoria"),
  urgencia: z.enum(["BAIXA", "MEDIA", "ALTA", "URGENTE"]).default("MEDIA"),
  foto_exemplo_url: z.string().optional(),
});

const solicitacaoSchema = z.object({
  centro_custo_id: z.string().min(1, "Selecione um Centro de Custo"),
  local_entrega: z.enum(["MATRIZ", "FILIAL", "OBRA", "CLIENTE"]),
  endereco_entrega: z.string().min(10, "Endereço completo obrigatório"),
  contato_local: z.string().min(3, "Contato obrigatório"),
  data_necessaria_entrega: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Data inválida"),
  itens: z.array(itemSchema).min(1, "Adicione pelo menos um item"),
});

type FormValues = z.infer<typeof solicitacaoSchema>;

export default function NovaSolicitacaoPage() {
  const supabase = createClient();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [totalCalculado, setTotalCalculado] = useState(0);
  const [centrosCusto, setCentrosCusto] = useState<any[]>([]);
  const [uploadingIndex, setUploadingIndex] = useState<number | null>(null);

  const { register, control, handleSubmit, setValue, formState: { errors } } = useForm<FormValues>({
    resolver: zodResolver(solicitacaoSchema),
    defaultValues: {
      itens: [{ nome_descricao: '', quantidade: 1, unidade: 'UN', valor_unitario_estimado: 0, justificativa: '', urgencia: 'MEDIA' }],
      local_entrega: 'MATRIZ',
      data_necessaria_entrega: new Date().toISOString().split('T')[0]
    },
  });

  const { fields, append, remove } = useFieldArray({ control, name: "itens" });
  const watchedItems = useWatch({ control, name: "itens" });

  // 1. Carregar Centros de Custo Dinamicamente
  useEffect(() => {
    async function fetchCCs() {
      const { data } = await supabase.from('vw_centros_custo_ativos').select('*');
      if (data) setCentrosCusto(data);
    }
    fetchCCs();
  }, [supabase]);

  // 2. Cálculo Real-Time do Total
  useEffect(() => {
    const total = watchedItems.reduce((acc, item) => {
      return acc + (Number(item?.quantidade) || 0) * (Number(item?.valor_unitario_estimado) || 0);
    }, 0);
    setTotalCalculado(total);
  }, [watchedItems]);

  // 3. Upload de Foto Real (Supabase Storage)
  const handleFileUpload = async (index: number, file: File) => {
    try {
      setUploadingIndex(index);
      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random().toString(36).substring(2)}_${Date.now()}.${fileExt}`;
      const filePath = `solicitacoes/tmp/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('vpcompras-anexos')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      // Obter URL Pública para visualização imediata
      const { data: { publicUrl } } = supabase.storage
        .from('vpcompras-anexos')
        .getPublicUrl(filePath);

      setValue(`itens.${index}.foto_exemplo_url`, publicUrl);
    } catch (error: any) {
      alert("Erro no upload: " + error.message);
    } finally {
      setUploadingIndex(null);
    }
  };

  const onSubmit = async (data: FormValues) => {
    setIsSubmitting(true);
    const result = await submitFullSolicitacao(data);
    if (result.success) {
      alert(`✅ Sucesso! Status inicial: ${result.status}`);
      window.location.href = '/dashboard';
    } else {
      alert("❌ Falha na submissão: " + result.error);
    }
    setIsSubmitting(false);
  };

  return (
    <div className="min-h-screen bg-[#f5f7f9] font-sans pb-20">
      <header className="bg-white border-b border-slate-200 px-8 py-4 sticky top-0 z-20 flex justify-between items-center shadow-sm">
        <div className="flex items-center gap-4">
          <Link href="/dashboard" className="p-2 hover:bg-slate-100 rounded-full transition-colors text-slate-500">
            <ChevronLeft size={24} />
          </Link>
          <div>
            <h1 className="text-lg font-bold text-slate-800 uppercase tracking-tighter">VerticalParts Procurement</h1>
            <nav className="text-[10px] breadcrumbs flex gap-2 font-black text-omie-blue uppercase tracking-widest italic">
              <span>Fase 5 MVP</span>
            </nav>
          </div>
        </div>

        <button type="submit" form="solicitacao-form" disabled={isSubmitting}
          className="omie-btn-primary !bg-omie-teal hover:!bg-[#009685] shadow-lg shadow-teal-100 disabled:opacity-50">
          <Save size={18} />
          {isSubmitting ? "PROCESSANDO..." : "CONFIRMAR SOLICITAÇÃO"}
        </button>
      </header>

      <div className="max-w-6xl mx-auto p-8">
        <form id="solicitacao-form" onSubmit={handleSubmit(onSubmit)} className="space-y-8">
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="md:col-span-2 space-y-6">
              <div className="omie-card">
                <div className="p-4 border-b border-slate-100 bg-slate-50 flex items-center gap-2">
                  <MapPin size={16} className="text-omie-blue" />
                  <span className="text-[11px] font-bold text-slate-600 uppercase">Logística e CC</span>
                </div>
                <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormGroup label="Centro de Custo">
                    <select {...register("centro_custo_id")} className="omie-input">
                      <option value="">Selecione...</option>
                      {centrosCusto.map(cc => (
                        <option key={cc.id} value={cc.id}>{cc.codigo} - {cc.nome}</option>
                      ))}
                    </select>
                    {errors.centro_custo_id && <ErrorMsg msg={errors.centro_custo_id.message} />}
                  </FormGroup>

                  <FormGroup label="Local de Entrega">
                    <select {...register("local_entrega")} className="omie-input">
                      <option value="MATRIZ">MATRIZ</option>
                      <option value="FILIAL">FILIAL</option>
                      <option value="OBRA">OBRA</option>
                      <option value="CLIENTE">CLIENTE</option>
                    </select>
                  </FormGroup>

                  <div className="md:col-span-2">
                    <FormGroup label="Endereço Completo">
                      <input {...register("endereco_entrega")} className="omie-input" />
                      {errors.endereco_entrega && <ErrorMsg msg={errors.endereco_entrega.message} />}
                    </FormGroup>
                  </div>
                </div>
              </div>
            </div>

            <div className="omie-card bg-slate-900 text-white p-8 flex flex-col justify-center border-none shadow-2xl relative overflow-hidden">
               <div className="absolute top-0 right-0 p-4 opacity-10"><Package size={80} /></div>
               <span className="text-xs font-bold text-slate-500 uppercase tracking-widest">Total da Solicitação</span>
               <div className="text-4xl font-black mt-2 text-omie-teal">
                 R$ {totalCalculado.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
               </div>
               <div className="mt-6 flex gap-2">
                 <Calendar size={14} className="text-slate-500" />
                 <input type="date" {...register("data_necessaria_entrega")} className="bg-transparent border-none text-xs font-bold focus:ring-0 p-0 text-slate-300" />
               </div>
            </div>
          </div>

          <div className="omie-card">
            <div className="p-4 border-b border-slate-100 bg-slate-50 flex justify-between items-center">
              <span className="text-[11px] font-bold text-slate-600 uppercase flex items-center gap-2">
                <Package size={16} /> Itens (Auditoria Integrada)
              </span>
              <button type="button" onClick={() => append({ nome_descricao: '', quantidade: 1, unidade: 'UN', valor_unitario_estimado: 0, justificativa: '', urgencia: 'MEDIA' })}
                className="text-[10px] font-black text-white bg-omie-blue px-4 py-1.5 rounded-lg hover:bg-slate-800 transition-all flex items-center gap-1">
                <Plus size={14} strokeWidth={3} /> NOVO ITEM
              </button>
            </div>
            
            <table className="w-full text-left omie-table">
              <thead>
                <tr className="bg-white border-b">
                  <th className="w-12 text-center">#</th>
                  <th>Produto e Justificativa</th>
                  <th className="w-32">Qtd/Un</th>
                  <th className="w-40 text-right">Vlr. Unitário</th>
                  <th className="w-44 text-center">Anexo Real</th>
                  <th className="w-12"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {fields.map((field, index) => (
                  <tr key={field.id} className="hover:bg-slate-50/50 group">
                    <td className="text-slate-300 font-bold text-center">{index + 1}</td>
                    <td className="py-6">
                      <input {...register(`itens.${index}.nome_descricao`)} placeholder="Nome do item..." className="w-full bg-transparent border-none text-sm font-bold text-slate-800 focus:ring-0 p-0" />
                      <textarea {...register(`itens.${index}.justificativa`)} placeholder="Justificativa (Mín. 20 chars)..." className="w-full bg-transparent border-none text-[10px] text-slate-400 focus:ring-0 p-0 mt-2 italic" />
                      {errors.itens?.[index]?.justificativa && <ErrorMsg msg={errors.itens[index].justificativa?.message} />}
                    </td>
                    <td>
                      <div className="flex gap-1">
                        <input type="number" step="0.01" {...register(`itens.${index}.quantidade`, { valueAsNumber: true })} className="w-16 bg-white border border-slate-200 rounded text-xs p-1.5 font-bold text-center" />
                        <span className="text-[10px] font-bold text-slate-400 mt-2">UN</span>
                      </div>
                    </td>
                    <td className="text-right">
                      <input type="number" step="0.01" {...register(`itens.${index}.valor_unitario_estimado`, { valueAsNumber: true })} className="w-28 bg-emerald-50 border border-emerald-100 rounded text-xs p-1.5 font-bold text-right text-emerald-700" />
                    </td>
                    <td className="text-center">
                       <label className="cursor-pointer group flex flex-col items-center justify-center">
                          {watchedItems[index]?.foto_exemplo_url ? (
                            <img src={watchedItems[index]?.foto_exemplo_url} alt="Envio" className="w-12 h-12 object-cover rounded-lg border border-slate-200 shadow-sm" />
                          ) : uploadingIndex === index ? (
                            <Loader2 className="animate-spin text-omie-blue" size={20} />
                          ) : (
                            <div className="p-2 border border-slate-200 rounded-lg hover:bg-white transition-colors group">
                              <Camera size={18} className="text-slate-400 group-hover:text-omie-blue" />
                            </div>
                          )}
                          <input type="file" className="hidden" accept="image/*" onChange={(e) => e.target.files?.[0] && handleFileUpload(index, e.target.files[0])} />
                       </label>
                    </td>
                    <td>
                      <button type="button" onClick={() => remove(index)} className="text-slate-200 hover:text-red-500 p-2"><Trash2 size={16} /></button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </form>
      </div>

      <style jsx global>{`
        .omie-input { @apply w-full mt-1.5 p-2.5 border border-slate-200 rounded bg-white text-sm text-slate-700 focus:border-omie-blue outline-none transition-all font-medium shadow-sm; }
        .omie-card { @apply bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden; }
      `}</style>
    </div>
  );
}

function FormGroup({ label, children }: any) {
  return (
    <div className="flex flex-col">
      <label className="text-[10px] font-black uppercase text-slate-400 tracking-wider ml-1">{label}</label>
      {children}
    </div>
  );
}

function ErrorMsg({ msg }: { msg?: string }) {
  return <p className="text-red-500 text-[9px] font-bold mt-1 ml-1 uppercase animate-pulse">{msg}</p>;
}
