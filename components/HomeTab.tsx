'use client';

import React from 'react';
import { Phase, Task } from '@/types';

interface HomeTabProps {
  phases: Phase[];
  tasks: Task[];
  setActiveTab: (tab: string) => void;
  setSelectedPhaseFilter: (phaseId: string) => void;
}

export const HomeTab: React.FC<HomeTabProps> = ({
  phases,
  tasks,
  setActiveTab,
  setSelectedPhaseFilter,
}) => {
  const totalTasks = tasks.length;
  const completedTasks = tasks.filter((t) => t.completed).length;
  const overallPercentage = totalTasks === 0 ? 0 : Math.round((completedTasks / totalTasks) * 100);

  const getPhaseCompletedCount = (phaseId: number) => {
    return tasks.filter((t) => Number(t.phase) === Number(phaseId) && t.completed).length;
  };

  const getPhaseTotalCount = (phaseId: number) => {
    return tasks.filter((t) => Number(t.phase) === Number(phaseId)).length;
  };

  const getPhasePercentage = (phaseId: number) => {
    const total = getPhaseTotalCount(phaseId);
    if (total === 0) return 0;
    return Math.round((getPhaseCompletedCount(phaseId) / total) * 100);
  };

  return (
    <main className="max-w-7xl mx-auto px-4 lg:px-8 py-8 space-y-8">
      {/* Welcome Hero Banner */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-8 relative overflow-hidden shadow-2xl">
        <div className="max-w-3xl space-y-4">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-wider text-cyan-400 bg-cyan-950 border border-cyan-800 px-3 py-1 rounded-full">
              🚀 Portfólio Next.js 15 App Router
            </span>
            <span className="text-xs text-slate-400 font-mono">Vercel & Supabase Ready</span>
          </div>

          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight leading-tight">
            Bem-vindo ao Portfólio & Laboratório de Projetos
          </h2>

          <p className="text-sm text-slate-300 leading-relaxed">
            Atualmente, este ambiente serve como{' '}
            <strong className="text-white">Landing Page de Transição e Painel de Homologação</strong> para acompanhar
            a evolução dos projetos, ideias e requisitos técnicos em tempo real. Explore os projetos concluídos e em
            planejamento navegando pelo módulo{' '}
            <button
              onClick={() => setActiveTab('roadmap')}
              className="text-cyan-400 underline hover:text-cyan-300 font-semibold"
            >
              Metadados & Roadmap do Projeto
            </button>
            .
          </p>

          <div className="pt-2 flex flex-wrap gap-3">
            <button
              onClick={() => setActiveTab('roadmap')}
              className="bg-cyan-600 hover:bg-cyan-500 text-slate-950 font-bold text-xs px-5 py-3 rounded-xl transition-all flex items-center gap-2 shadow-lg"
            >
              <span>📍</span> Acessar Roadmap & Projetos Expansíveis
            </button>

            <button
              onClick={() => setActiveTab('portfolio')}
              className="bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold px-5 py-3 rounded-xl border border-slate-700 transition-all flex items-center gap-2"
            >
              <span>💼</span> Explorar Produtos & Tech Lab
            </button>
          </div>
        </div>
      </div>

      {/* 4 Strategic Pillars Progress Grid */}
      <section className="space-y-4">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div>
            <h3 className="text-xl font-bold text-white flex items-center gap-2">
              <span>📊</span> Visão Geral dos 4 Pilares Estratégicos
            </h3>
            <p className="text-xs text-slate-400">Progresso acumulado de projetos e entregáveis por pilar técnico.</p>
          </div>
          <span className="text-xs font-bold text-cyan-400 bg-cyan-950 border border-cyan-800 px-3 py-1 rounded-full">
            Status Geral: {overallPercentage}%
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {phases.map((phase) => (
            <div
              key={phase.id}
              className="bg-slate-900 border border-slate-800 p-5 rounded-2xl space-y-3 hover:border-cyan-500/50 transition-all cursor-pointer group"
              onClick={() => {
                setSelectedPhaseFilter(String(phase.id));
                setActiveTab('roadmap');
              }}
            >
              <div className="flex items-center justify-between">
                <span className="text-2xl">{phase.icon}</span>
                <span className="text-xs font-bold font-mono text-cyan-400 bg-cyan-950 border border-cyan-800 px-2 py-0.5 rounded">
                  {getPhasePercentage(phase.id)}%
                </span>
              </div>

              <div>
                <h4 className="text-sm font-bold text-white group-hover:text-cyan-300 transition-colors">
                  {phase.title}
                </h4>
                <p className="text-xs text-slate-400 mt-1 line-clamp-2">{phase.subtitle}</p>
              </div>

              {/* Mini Progress bar */}
              <div className="w-full h-2 bg-slate-950 rounded-full overflow-hidden border border-slate-800">
                <div
                  className="h-full bg-cyan-500 transition-all duration-300"
                  style={{ width: `${getPhasePercentage(phase.id)}%` }}
                ></div>
              </div>

              <div className="flex items-center justify-between text-[11px] text-slate-500 pt-1">
                <span>
                  {getPhaseCompletedCount(phase.id)}/{getPhaseTotalCount(phase.id)} itens
                </span>
                <span className="text-cyan-400 font-medium">Ver Projetos ➔</span>
              </div>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
};
