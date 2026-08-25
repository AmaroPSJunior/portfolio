'use client';

import React, { useEffect } from 'react';
import { AlertCircle, RefreshCw, Home } from 'lucide-react';
import { AppLogger } from '@/lib/logger';

export default function GlobalRouteError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    AppLogger.error('AppRouter:GlobalRoute', `Erro capturado no segmento de rota: ${error.message}`, error);
  }, [error]);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex items-center justify-center p-6">
      <div className="max-w-md w-full bg-slate-900/90 border border-red-500/30 rounded-2xl p-8 shadow-2xl text-center backdrop-blur-xl">
        <div className="mx-auto w-16 h-16 bg-red-500/10 border border-red-500/30 rounded-2xl flex items-center justify-center text-red-400 mb-6">
          <AlertCircle className="w-8 h-8" />
        </div>

        <h1 className="text-2xl font-bold text-white mb-2">Ops! Algo deu errado</h1>
        <p className="text-slate-400 text-sm mb-6">
          Ocorreu uma falha inesperada durante a renderização da aplicação. Nosso sistema de diagnóstico capturou os detalhes do evento.
        </p>

        {process.env.NODE_ENV !== 'production' && (
          <div className="mb-6 p-3 bg-slate-950 rounded-xl border border-red-500/20 text-left text-xs font-mono text-red-300 overflow-x-auto max-h-32">
            {error.message}
          </div>
        )}

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <button
            onClick={() => reset()}
            className="flex-1 inline-flex items-center justify-center gap-2 px-5 py-3 bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-semibold rounded-xl transition-all shadow-lg shadow-emerald-500/20"
          >
            <RefreshCw className="w-4 h-4" />
            Tentar Novamente
          </button>
          <a
            href="/"
            className="inline-flex items-center justify-center gap-2 px-5 py-3 bg-slate-800 hover:bg-slate-700 text-slate-200 font-medium rounded-xl border border-slate-700 transition-all"
          >
            <Home className="w-4 h-4" />
            Início
          </a>
        </div>
      </div>
    </div>
  );
}
