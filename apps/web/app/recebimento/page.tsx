"use client";

import React, { useState, useEffect } from 'react';
import { createClient } from '../../../lib/supabase';
import { Truck, Package, Search, ArrowRight, Clock, AlertTriangle } from 'lucide-react';
import Link from 'next/link';

/**
 * Triagem de Almoxarifado - Fase 2
 * Lista de pedidos "em trânsito" para conferência.
 */
export default function RecebimentoListPage() {
  const supabase = createClient();
  const [pedidos, setPedidos] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchInTransit() {
      const { data } = await supabase
        .from('solicitacoes')
        .select('*, centros_custo(*)')
        .schema('vpcn_produtos')
        .in('status', ['VENCEDOR_SELECIONADO', 'EM_COMPRA'])
        .order('created_at', { ascending: false });
      
      setPedidos(data || []);
      setLoading(false);
    }
    fetchInTransit();
  }, [supabase]);

  if (loading) return <div className="p-20 text-center text-slate-400 font-black animate-pulse uppercase italic">Sincronizando Pátio de Recebimento...</div>;

  return (
    <div className="flex flex-col min-h-screen bg-[#f4f7fa] pb-20">
      <header className="bg-white border-b border-slate-200 px-10 py-6 flex justify-between items-center shadow-sm sticky top-0 z-30">
        <div>
           <h1 className="text-xl font-black text-slate-800 tracking-tighter uppercase italic leading-none">Triagem de Recebimento</h1>
           <span className="text-[10px] font-black text-omie-blue uppercase tracking-widest mt-1">Status: Almoxarifado em Pátio</span>
        </div>
        <Truck className="text-slate-200" size={32} />
      </header>

      <main className="p-10 max-w-6xl mx-auto w-full space-y-8">
        <div className="flex justify-between items-center">
           <h2 className="text-xs font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
              <Clock size={14} /> Pedidos em Trânsito ({pedidos.length})
           </h2>
           <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
              <input type="text" placeholder="Buscar Pedido / NF..." className="pl-10 pr-4 py-2 bg-white border border-slate-200 rounded-full text-[11px] font-bold outline-none focus:border-omie-blue w-64 shadow-sm" />
           </div>
        </div>

        <div className="grid grid-cols-1 gap-4">
           {pedidos.length === 0 ? (
             <div className="bg-white border-2 border-dashed border-slate-200 rounded-[2rem] p-20 text-center">
                <Package size={48} className="mx-auto text-slate-200 mb-4" />
                <p className="text-slate-300 font-bold uppercase italic tracking-widest text-sm">Nenhum pedido aguardando recebimento no momento.</p>
             </div>
           ) : (
             pedidos.map(p => (
               <Link key={p.id} href={`/recebimento/${p.id}/conferencia`}>
                 <div className="bg-white p-8 rounded-[2rem] shadow-sm border border-transparent hover:border-omie-blue hover:shadow-xl transition-all flex justify-between items-center group">
                    <div className="flex gap-6 items-center">
                       <div className="bg-slate-50 p-4 rounded-2xl text-omie-blue group-hover:bg-omie-blue group-hover:text-white transition-colors">
                          <Package size={24} />
                       </div>
                       <div>
                          <div className="flex items-center gap-2">
                             <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest italic">SOLICITAÇÃO #{p.codigo_sequencial?.toString().padStart(4, '0')}</span>
                             {p.status === 'EM_COMPRA' && <span className="bg-amber-100 text-amber-600 px-2 py-0.5 rounded-full text-[8px] font-black uppercase">Faturado</span>}
                          </div>
                          <h3 className="text-base font-black text-slate-800 uppercase tracking-tighter mt-1">{p.finalidade}</h3>
                          <p className="text-[10px] font-bold text-slate-400 uppercase mt-1 italic">{p.centros_custo?.nome} — VALOR: R$ {Number(p.valor_total_estimado).toLocaleString('pt-BR')}</p>
                       </div>
                    </div>
                    <div className="flex items-center gap-6">
                       <div className="text-right">
                          <span className="text-[9px] font-black text-slate-300 uppercase block">Origem de Compra</span>
                          <span className="text-xs font-black text-slate-700 uppercase italic">Vencedor Definido</span>
                       </div>
                       <div className="w-10 h-10 bg-slate-50 rounded-full flex items-center justify-center text-slate-300 group-hover:bg-omie-blue group-hover:text-white transition-all">
                          <ArrowRight size={20} />
                       </div>
                    </div>
                 </div>
               </Link>
             ))
           )}
        </div>
      </main>
    </div>
  );
}
