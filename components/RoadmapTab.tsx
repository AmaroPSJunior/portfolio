'use client';

import React from 'react';
import { Phase, Task, GithubConfig } from '@/types';

interface RoadmapTabProps {
  phases: Phase[];
  tasks: Task[];
  openPhases: number[];
  expandedCards: number[];
  searchQuery: string;
  selectedPhaseFilter: string;
  selectedStatusFilter: string;
  githubConfig: GithubConfig;
  setSearchQuery: (q: string) => void;
  setSelectedPhaseFilter: (f: string) => void;
  setSelectedStatusFilter: (s: string) => void;
  togglePhase: (phaseId: number) => void;
  toggleCard: (taskId: number) => void;
  expandAllCards: () => void;
  collapseAllCards: () => void;
  toggleTask: (taskId: number) => void;
  deleteTask: (taskId: number) => void;
  deletePillar?: (phaseId: number) => void;
  resetChecklist: () => void;
  setShowAddModal: (show: boolean) => void;
  onOpenAddTaskModal?: (phaseId?: number) => void;
  setShowGithubModal: (show: boolean) => void;
  setShowPilarModal: (show: boolean) => void;
}

export const RoadmapTab: React.FC<RoadmapTabProps> = ({
  phases,
  tasks,
  openPhases,
  expandedCards,
  searchQuery,
  selectedPhaseFilter,
  selectedStatusFilter,
  githubConfig,
  setSearchQuery,
  setSelectedPhaseFilter,
  setSelectedStatusFilter,
  togglePhase,
  toggleCard,
  expandAllCards,
  collapseAllCards,
  toggleTask,
  deleteTask,
  deletePillar,
  resetChecklist,
  setShowAddModal,
  onOpenAddTaskModal,
  setShowGithubModal,
  setShowPilarModal,
}) => {
  const totalTasksCount = tasks.length;
  const completedTasksCount = tasks.filter((t) => t.completed).length;
  const overallPercentage =
    totalTasksCount === 0 ? 0 : Math.round((completedTasksCount / totalTasksCount) * 100);

  const getPhaseTotalCount = (phaseId: number) => {
    return tasks.filter((t) => t.phase === phaseId).length;
  };

  const getPhaseCompletedCount = (phaseId: number) => {
    return tasks.filter((t) => t.phase === phaseId && t.completed).length;
  };

  const getPhasePercentage = (phaseId: number) => {
    const total = getPhaseTotalCount(phaseId);
    if (total === 0) return 0;
    return Math.round((getPhaseCompletedCount(phaseId) / total) * 100);
  };

  const completedPhasesCount = phases.filter((p) => getPhasePercentage(p.id) === 100).length;

  const filteredPhases =
    selectedPhaseFilter === 'all'
      ? phases
      : phases.filter((p) => p.id === Number(selectedPhaseFilter));

  const getTasksByPhase = (phaseId: number) => {
    return tasks.filter((task) => {
      if (task.phase !== phaseId) return false;

      // Status filter
      if (selectedStatusFilter === 'completed' && !task.completed) return false;
      if (selectedStatusFilter === 'pending' && task.completed) return false;

      // Search query filter
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase().trim();
        const matchesTitle = task.title.toLowerCase().includes(query);
        const matchesDesc = task.description.toLowerCase().includes(query);
        const matchesBadges = task.badges.some((b) => b.toLowerCase().includes(query));
        const matchesReqs = task.requirements.some((r) => r.toLowerCase().includes(query));
        if (!matchesTitle && !matchesDesc && !matchesBadges && !matchesReqs) return false;
      }

      return true;
    });
  };

  return (
    <div id="roadmap-evolucao-view">
      {/* HERO & GENERAL PROGRESS HEADER */}
      <section className="max-w-7xl mx-auto px-4 lg:px-8 pt-6 pb-4">
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl relative overflow-hidden">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
            {/* Title and Description */}
            <div className="space-y-2 max-w-2xl">
              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold uppercase tracking-wider text-cyan-400 bg-cyan-950 border border-cyan-800 px-2.5 py-1 rounded-md">
                  📍 Metadados & Roadmap Next.js
                </span>
                <span className="text-xs text-slate-400 font-mono">Cards Sanfonados em Grade</span>
              </div>
              <h2 className="text-2xl lg:text-3xl font-extrabold text-white tracking-tight">
                Projetos, Ideias & Requisitos de Evolução
              </h2>
              <p className="text-sm text-slate-300 leading-relaxed">
                Acompanhamento sanfonado de soluções completas, provas de conceito e próximos entregáveis.
                Clique sobre os Cards de Projeto na grade para expandir requisitos detalhados e links.
              </p>
            </div>

            {/* Overall Progress Widget */}
            <div className="bg-slate-950 border border-slate-800 p-5 rounded-xl min-w-[300px] flex flex-col gap-3">
              <div className="flex justify-between items-end">
                <div>
                  <span className="text-xs text-slate-400 uppercase font-semibold">Progresso dos Entregáveis</span>
                  <div className="text-3xl font-black text-cyan-400 flex items-center gap-1">
                    {overallPercentage}%
                    <span className="text-xs font-normal text-slate-400">
                      ({completedTasksCount}/{totalTasksCount} itens)
                    </span>
                  </div>
                </div>
                <div className="text-right">
                  <span
                    className={`text-xs px-2.5 py-1 rounded-full font-bold ${
                      overallPercentage === 100
                        ? 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                        : 'bg-cyan-950 text-cyan-300 border border-cyan-800'
                    }`}
                  >
                    {overallPercentage === 100 ? '🎉 Homologado' : '🚀 Em Evolução'}
                  </span>
                </div>
              </div>

              {/* Progress Bar */}
              <div className="w-full h-3 bg-slate-800 rounded-full overflow-hidden border border-slate-700">
                <div
                  className="h-full bg-cyan-500 transition-all duration-500 ease-out"
                  style={{ width: `${overallPercentage}%` }}
                ></div>
              </div>

              <div className="flex justify-between text-xs text-slate-400 pt-1">
                <span>🎯 Total: {totalTasksCount} Projetos</span>
                <span>Pilares Concluídos: {completedPhasesCount}/4</span>
              </div>
            </div>
          </div>

          {/* Quick Stats Row Across 4 Pillars */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 mt-6 pt-6 border-t border-slate-800/80">
            {phases.map((phase) => (
              <div
                key={phase.id}
                className="bg-slate-950/80 p-3 rounded-xl border border-slate-800 flex items-center justify-between cursor-pointer hover:border-slate-700 transition-all"
                onClick={() => setSelectedPhaseFilter(String(phase.id))}
              >
                <div className="flex items-center gap-2.5">
                  <span className="text-xl">{phase.icon}</span>
                  <div>
                    <p className="text-[11px] text-slate-400 font-semibold uppercase">Pilar {phase.id}</p>
                    <p className="text-xs font-bold text-white line-clamp-1">
                      {phase.title.split('-')[1] || phase.title}
                    </p>
                  </div>
                </div>
                <span className="text-xs font-mono font-bold text-cyan-400 bg-cyan-950 px-2 py-0.5 rounded border border-cyan-800">
                  {getPhasePercentage(phase.id)}%
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* MAIN CHECKLIST & CONTROLS */}
      <main className="max-w-7xl mx-auto px-4 lg:px-8 py-4 space-y-6">
        {/* Controls & Filters Bar */}
        <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
          {/* Search Input */}
          <div className="relative flex-1">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">🔍</span>
            <input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              type="text"
              placeholder="Buscar por projeto, ideia, tecnologia ou requisito..."
              className="w-full bg-slate-950 border border-slate-800 rounded-lg pl-9 pr-4 py-2 text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:border-cyan-500"
            />
          </div>

          {/* Filter Dropdowns & Buttons */}
          <div className="flex flex-wrap items-center gap-2">
            {/* Phase / Pillar Filter */}
            <select
              value={selectedPhaseFilter}
              onChange={(e) => setSelectedPhaseFilter(e.target.value)}
              className="bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-cyan-500"
            >
              <option value="all">Todas as Fases / Pilares</option>
              {phases.map((p) => (
                <option key={p.id} value={String(p.id)}>
                  {p.icon} {p.title}
                </option>
              ))}
            </select>

            {/* Status Filter */}
            <select
              value={selectedStatusFilter}
              onChange={(e) => setSelectedStatusFilter(e.target.value)}
              className="bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-cyan-500"
            >
              <option value="all">Todos os Status</option>
              <option value="pending">💡 Ideias / Em Planejamento</option>
              <option value="completed">🟢 Concluídos / Homologados</option>
            </select>

            {/* Global Accordion Toggle Controls */}
            <div className="flex items-center gap-1 border-l border-slate-800 pl-2">
              <button
                onClick={expandAllCards}
                className="bg-slate-950 hover:bg-slate-800 text-cyan-300 text-xs px-2.5 py-2 rounded-lg border border-slate-800 transition-all"
                title="Expandir todos os cards de projetos"
              >
                📂 Expandir
              </button>
              <button
                onClick={collapseAllCards}
                className="bg-slate-950 hover:bg-slate-800 text-slate-400 hover:text-slate-200 text-xs px-2.5 py-2 rounded-lg border border-slate-800 transition-all"
                title="Recolher todos os cards"
              >
                📁 Recolher
              </button>
            </div>

            {/* Action Buttons */}
            <button
              onClick={() => setShowPilarModal(true)}
              className="bg-emerald-600 hover:bg-emerald-500 text-slate-950 font-bold text-xs px-3 py-2 rounded-lg transition-all flex items-center gap-1 shadow"
              title="Cadastrar novo pilar no Supabase"
            >
              <span>🏛️</span> Novo Pilar
            </button>

            <button
              onClick={resetChecklist}
              className="bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs px-3 py-2 rounded-lg transition-all flex items-center gap-1 border border-slate-700"
              title="Restaurar lista padrão"
            >
              <span>🔄</span> Resetar
            </button>
          </div>
        </div>

        {/* 4 EXPANDABLE PHASES / PILLARS SECTIONS IN MINIMALIST GRID */}
        <div className="space-y-6">
          {filteredPhases.map((phase) => {
            const phaseTasks = getTasksByPhase(phase.id);
            const isPhaseOpen = openPhases.includes(phase.id);

            return (
              <div
                key={phase.id}
                className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-md transition-all duration-300"
              >
                {/* Phase Accordion Header Compacto */}
                <div
                  onClick={() => togglePhase(phase.id)}
                  className="bg-slate-950/90 p-3.5 px-5 border-b border-slate-800 flex items-center justify-between gap-3 cursor-pointer select-none hover:bg-slate-950 transition-colors group"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-xl">{phase.icon}</span>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-[11px] font-bold uppercase tracking-wider text-cyan-400 bg-cyan-950/80 border border-cyan-800/80 px-2 py-0.5 rounded">
                          Pilar {phase.id}
                        </span>
                        <h3 className="text-sm md:text-base font-bold text-white group-hover:text-cyan-300 transition-colors">
                          {phase.title}
                        </h3>
                      </div>
                    </div>
                  </div>

                  {/* Metric & Phase Toggle */}
                  <div className="flex items-center gap-3">
                    <span className="text-xs font-mono font-semibold text-slate-300 bg-slate-900 border border-slate-800 px-2.5 py-1 rounded-lg">
                      {getPhaseCompletedCount(phase.id)}/{getPhaseTotalCount(phase.id)} ({getPhasePercentage(phase.id)}%)
                    </span>
                    {deletePillar && (
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          if (window.confirm(`Deseja excluir o pilar "${phase.title}" e seus projetos do Supabase?`)) {
                            deletePillar(phase.id);
                          }
                        }}
                        className="text-[11px] bg-red-950/60 hover:bg-red-900 text-red-300 border border-red-800 px-2 py-1 rounded transition-all"
                        title="Excluir pilar do Supabase"
                      >
                        🗑️ Excluir
                      </button>
                    )}
                    <span className="text-slate-400 group-hover:text-white transition-transform text-xs">
                      {isPhaseOpen ? '▲' : '▼'}
                    </span>
                  </div>
                </div>

                {/* Phase Body: Grid de Cards Sanfonados Minimalistas */}
                {isPhaseOpen && (
                  <div className="p-4 sm:p-5 space-y-4">
                    {/* Header do Pilar Expandido com o Botão Novo Projeto */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-800/80">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-semibold text-slate-300">
                          Projetos e Entregáveis do Pilar {phase.id}
                        </span>
                        <span className="text-xs text-slate-500 font-mono">
                          ({getPhaseCompletedCount(phase.id)}/{getPhaseTotalCount(phase.id)} concluídos)
                        </span>
                      </div>
                      <button
                        onClick={() =>
                          onOpenAddTaskModal ? onOpenAddTaskModal(phase.id) : setShowAddModal(true)
                        }
                        className="bg-cyan-600 hover:bg-cyan-500 text-slate-950 font-bold text-xs px-3 py-1.5 rounded-lg transition-all flex items-center gap-1 shadow self-start sm:self-auto"
                        title={`Adicionar novo projeto diretamente ao Pilar ${phase.id}`}
                      >
                        <span>➕</span> Novo Projeto
                      </button>
                    </div>

                    {phaseTasks.length === 0 ? (
                      <div className="text-center py-6 text-xs text-slate-500 italic bg-slate-950/40 rounded-xl border border-slate-800">
                        Nenhum projeto ou ideia encontrada neste pilar para os filtros aplicados.
                      </div>
                    ) : (
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {phaseTasks.map((task) => {
                          const isExpanded = expandedCards.includes(task.id);

                          return (
                            <div
                              key={task.id}
                              className={`bg-slate-950/90 border rounded-xl transition-all flex flex-col justify-between ${
                                task.completed
                                  ? 'border-emerald-900/60 hover:border-emerald-500/50'
                                  : 'border-slate-800 hover:border-cyan-500/50'
                              }`}
                            >
                              {/* CLOSED CARD HEADER (EXTREMELY MINIMALIST) */}
                              <div
                                onClick={() => toggleCard(task.id)}
                                className="p-4 cursor-pointer select-none space-y-3"
                              >
                                <div className="flex items-start justify-between gap-2">
                                  {/* Title */}
                                  <h4 className="text-sm font-bold text-white leading-snug hover:text-cyan-300 transition-colors">
                                    {task.title}
                                  </h4>

                                  {/* Small visual status indicator */}
                                  <span
                                    className={`shrink-0 w-2.5 h-2.5 rounded-full mt-1 ${
                                      task.completed ? 'bg-emerald-400 shadow-sm shadow-emerald-400/50' : 'bg-amber-400'
                                    }`}
                                    title={task.completed ? 'Concluído' : 'Em Planejamento'}
                                  />
                                </div>

                                {/* Tech Badges */}
                                <div className="flex flex-wrap items-center gap-1 pt-1">
                                  {task.badges.map((badge, idx) => (
                                    <span
                                      key={idx}
                                      className="text-[10px] font-mono bg-slate-900 text-slate-300 border border-slate-800 px-2 py-0.5 rounded"
                                    >
                                      {badge}
                                    </span>
                                  ))}
                                </div>

                                <div className="flex items-center justify-between text-[11px] text-slate-500 pt-1 border-t border-slate-900">
                                  <span className="font-mono">
                                    {task.completed ? '🟢 Concluído' : '💡 Ideia Pendente'}
                                  </span>
                                  <span className="text-cyan-400 font-medium">
                                    {isExpanded ? 'Recolher ▲' : 'Ver Detalhes ▼'}
                                  </span>
                                </div>
                              </div>

                              {/* EXPANDED DETAILS BODY */}
                              {isExpanded && (
                                <div className="p-4 pt-0 border-t border-slate-900 space-y-3 text-xs bg-slate-900/40 rounded-b-xl">
                                  {/* Description */}
                                  <p className="text-slate-300 leading-relaxed pt-3">
                                    {task.description}
                                  </p>

                                  {/* Requirements Checklist */}
                                  {task.requirements && task.requirements.length > 0 && (
                                    <div className="space-y-1.5 pt-1">
                                      <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                                        Requisitos & Entregáveis:
                                      </p>
                                      <ul className="space-y-1 pl-1">
                                        {task.requirements.map((req, rIdx) => (
                                          <li
                                            key={rIdx}
                                            className="text-slate-300 flex items-start gap-1.5 text-[11px]"
                                          >
                                            <span className="text-cyan-400 shrink-0">•</span>
                                            <span>{req}</span>
                                          </li>
                                        ))}
                                      </ul>
                                    </div>
                                  )}

                                  {/* Links & Actions Footer */}
                                  <div className="pt-3 border-t border-slate-800 flex flex-wrap items-center justify-between gap-2">
                                    <div className="flex items-center gap-1.5">
                                      {task.completed ? (
                                        <a
                                          href={`https://github.com/${githubConfig.owner || 'amaropedro'}/${
                                            githubConfig.repo || 'painel-homologacao'
                                          }`}
                                          target="_blank"
                                          rel="noreferrer"
                                          className="bg-emerald-950/80 hover:bg-emerald-900 text-emerald-300 px-2.5 py-1 rounded text-[11px] border border-emerald-800 flex items-center gap-1 font-mono"
                                        >
                                          <span>🚀</span> Ver no GitHub
                                        </a>
                                      ) : (
                                        <button
                                          onClick={() => setShowGithubModal(true)}
                                          className="bg-slate-800 hover:bg-slate-700 text-amber-300 px-2.5 py-1 rounded text-[11px] border border-amber-800/60 flex items-center gap-1 font-mono"
                                        >
                                          <span>💡</span> Conceito
                                        </button>
                                      )}
                                    </div>

                                    <div className="flex items-center gap-1.5">
                                      <button
                                        onClick={() => toggleTask(task.id)}
                                        className={`text-[11px] px-2.5 py-1 rounded border font-semibold transition-all flex items-center gap-1 ${
                                          task.completed
                                            ? 'bg-amber-950/40 text-amber-300 border-amber-800/80 hover:bg-amber-900/60'
                                            : 'bg-emerald-950/40 text-emerald-300 border-emerald-800/80 hover:bg-emerald-900/60'
                                        }`}
                                      >
                                        {task.completed ? '⏪ Voltar a Pendente' : '✅ Marcar Concluído'}
                                      </button>

                                      <button
                                        onClick={() => deleteTask(task.id)}
                                        className="text-[11px] bg-red-950/40 hover:bg-red-900/60 text-red-300 border border-red-800 px-2 py-1 rounded transition-all"
                                        title="Excluir projeto do Supabase"
                                      >
                                        🗑️ Excluir
                                      </button>
                                    </div>
                                  </div>
                                </div>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </main>
    </div>
  );
};
