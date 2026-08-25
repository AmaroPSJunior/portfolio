import React from 'react';
import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col items-center justify-center p-4">
      <h1 className="text-4xl font-bold text-cyan-400 mb-2">404</h1>
      <p className="text-slate-400 mb-6">Página não encontrada no Painel de Homologação.</p>
      <Link
        href="/"
        className="bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-semibold px-4 py-2 rounded-lg transition-colors"
      >
        Voltar ao Início
      </Link>
    </div>
  );
}
