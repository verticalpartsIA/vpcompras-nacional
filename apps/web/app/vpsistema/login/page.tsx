"use client";

import React, { useState } from 'react';
import { createClient } from '../../../lib/supabase';

/**
 * Real Login Page for VP Sistema Ecosystem.
 * Integrated with Supabase Auth for Phase 5.
 * @security-auditor @supabase-expert
 */
export default function LoginPage() {
  const [email, setEmail] = useState('gelson.simoes@verticalparts.com.br');
  const [password, setPassword] = useState('Papa%@');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const supabase = createClient();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const { error: signInError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (signInError) {
      setError(signInError.message);
      setLoading(false);
    } else {
      // In Next.js SSR, we might need to set the cookie manually or use middleware to handle the redirect
      // For this MVP, let's also set our internal session cookie
      document.cookie = "vpcn_session=authenticated; path=/";
      window.location.href = "/dashboard";
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-900 font-sans p-6 overflow-hidden">
      {/* Background Decor */}
      <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
        <div className="absolute -top-24 -left-24 w-96 h-96 bg-blue-500 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 right-0 w-80 h-80 bg-green-500 rounded-full blur-3xl"></div>
      </div>

      <div className="bg-white/95 backdrop-blur-md w-full max-w-md p-10 rounded-[2.5rem] shadow-2xl relative z-10 border border-white/20">
        <header className="text-center mb-10">
          <div className="text-slate-900 font-black text-4xl tracking-tighter mb-1">VerticalParts</div>
          <div className="text-blue-600 text-[10px] font-black uppercase tracking-[0.3em] mb-4">Enterprise Portal</div>
          <div className="h-1 w-12 bg-blue-600 mx-auto rounded-full"></div>
        </header>

        <form onSubmit={handleLogin} className="space-y-6">
          <div className="space-y-2">
            <label className="text-[10px] font-bold text-slate-400 uppercase ml-1">E-mail corporativo</label>
            <input 
              type="email" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-4 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-2 ring-blue-500 outline-none transition-all text-slate-700 font-medium"
              placeholder="seu@email.com.br"
              required
            />
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-bold text-slate-400 uppercase ml-1">Senha de acesso</label>
            <input 
              type="password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-4 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-2 ring-blue-500 outline-none transition-all text-slate-700 font-medium"
              placeholder="••••••••"
              required
            />
          </div>

          {error && (
            <div className="p-3 bg-red-50 border border-red-100 text-red-600 text-xs rounded-xl font-bold text-center animate-shake">
              ⚠️ {error}
            </div>
          )}

          <button 
            type="submit"
            disabled={loading}
            className="w-full py-5 bg-slate-900 text-white font-black rounded-2xl hover:bg-blue-600 transition-all shadow-xl shadow-slate-200 active:scale-[0.98] disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {loading ? (
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
            ) : "🚀 ENTRAR NO PORTAL"}
          </button>
        </form>

        <footer className="mt-10 pt-6 border-t border-slate-50 text-center">
          <p className="text-[9px] text-slate-300 font-bold uppercase tracking-widest italic">
            Procurement System v1.0 — SpaceX Grok Standard
          </p>
        </footer>
      </div>
    </div>
  );
}
