'use client';

import React from 'react';
import { Task, Phase, GithubConfig, SiteConfig } from '@/types';
import { TaskCard } from './TaskCard';
import {
  ChevronDown,
  ChevronRight,
  Filter,
  Plus,
  RefreshCw,
  FolderGit2,
  ListFilter,
  Layers,
  Sparkles,
  Info,
  Maximize2,
  Minimize2,
  Trash2,
} from 'lucide-react';

interface RoadmapTabProps {
  phases: Phase[];
  tasks: Task[];
  openPhases: number[];
  expandedCards: number[];
  searchQuery: string;
  selectedPhaseFilter: string;
  selectedStatusFilter: string;
  githubConfig: GithubConfig;
  siteConfig?: SiteConfig;
  setSearchQuery: (query: string) => void;
  setSelectedPhaseFilter: (phase: string) => void;
  setSelectedStatusFilter: (status: string) => void;
  togglePhase: (phaseId: number) => void;
  toggleCard: (taskId: number) => void;
  expandAllCards: () => void;
  collapseAllCards: () => void;
  toggleTask: (taskId: number) => void;
  deleteTask: (taskId: number) => void;
  deletePhase?: (phaseId: number) => void;
  resetChecklist: () => void;
  setShowAddModal: (show: boolean) => void;
  onOpenAddTaskModal?: (phaseId?: number) => void;
  setShowGithubModal: (show: boolean) => void;
  setShowPhaseModal?: (show: boolean) => void;
  onOpenDiagnostics?: () => void;
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
  siteConfig,
  setSearchQuery,
  setSelectedPhaseFilter,
  setSelectedStatusFilter,
  togglePhase,
  toggleCard,
  expandAllCards,
  collapseAllCards,
  toggleTask,
  deleteTask,
  deletePhase,
  resetChecklist,
  setShowAddModal,
  onOpenAddTaskModal,
  setShowGithubModal,
  setShowPhaseModal,
  onOpenDiagnostics,
}) => {
  // Safe filtering logic
  const filteredTasks = tasks.filter((task) => {
    const matchesSearch =
      searchQuery.trim() === '' ||
      task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      task.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      task.badges.some((b) => b.toLowerCase().includes(searchQuery.toLowerCase())) ||
      task.requirements.some((r) => r.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesPhase =
      selectedPhaseFilter === 'all' || task.phase === Number(selectedPhaseFilter);

    const matchesStatus =
      selectedStatusFilter === 'all' ||
      (selectedStatusFilter === 'completed' && task.completed) ||
      (selectedStatusFilter === 'pending' && !task.completed);

    return matchesSearch && matchesPhase && matchesStatus;
  });

  const totalTasks = tasks.length;
  const completedTasks = tasks.filter((t) => t.completed).length;
  const overallProgress = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;
  const completedPhasesCount = phases.filter((phase) => {
    const phaseTasks = tasks.filter((t) => t.phase === phase.id);
    return phaseTasks.length > 0 && phaseTasks.every((t) => t.completed);
  }).length;

  return (
    <div id="roadmap-tab-container" className="space-y-6 animate-fadeIn">
      {/* 1. Header Hero Banner - Configurações Dinâmicas vindas do Banco Supabase */}
      <div className="p-6 bg-gradient-to-r from-slate-900 via-slate-900/90 to-slate-950 border border-slate-800 rounded-2xl shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-emerald-400" />
            <h1 className="text-xl font-black text-white tracking-tight">
              {siteConfig?.title || 'Projetos, Ideias & Requisitos de Evolução'}
            </h1>
          </div>
          <p className="text-xs text-slate-400 max-w-3xl leading-relaxed">
            {siteConfig?.subtitle ||
              'Acompanhamento sanfonado de soluções completas, provas de conceito e próximos entregáveis.'}
          </p>
        </div>

        {/* Global Progress pill */}
        <div className="flex items-center gap-3 shrink-0 bg-slate-950/80 p-3 rounded-xl border border-slate-800">
          <div className="text-right">
            <span className="text-[10px] text-slate-500 uppercase tracking-wider block font-medium">
              Progresso do Portfólio
            </span>
            <span className="text-lg font-black text-emerald-400">{overallProgress}%</span>
            <span className="text-[10px] text-slate-400 block">
              Fases Concluídas: {completedPhasesCount}/{phases.length || 4}
            </span>
          </div>
          <div className="w-12 h-12 rounded-full border-4 border-slate-800 border-t-emerald-500 flex items-center justify-center font-bold text-xs text-white bg-slate-900 shadow-inner">
            {completedTasks}/{totalTasks}
          </div>
        </div>
      </div>

      {/* 2. Control Toolbar */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 shadow-lg space-y-3">
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
          {/* Search Bar */}
          <div className="relative flex-1">
            <input
              type="text"
              placeholder="Pesquisar por título, requisitos, badges..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl py-2 pl-3 pr-8 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-emerald-500 transition-colors"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-2.5 top-2.5 text-slate-500 hover:text-slate-300 text-xs"
              >
                ✕
              </button>
            )}
          </div>

          {/* Filters */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 md:pb-0">
            {/* Phase Selector Filter */}
            <div className="flex items-center gap-1.5 bg-slate-950 px-2.5 py-1.5 rounded-xl border border-slate-800 text-xs text-slate-300 shrink-0">
              <Filter className="w-3.5 h-3.5 text-emerald-400" />
              <select
                value={selectedPhaseFilter}
                onChange={(e) => setSelectedPhaseFilter(e.target.value)}
                className="bg-transparent text-xs text-slate-200 focus:outline-none cursor-pointer"
              >
                <option value="all" className="bg-slate-900 text-slate-200">
                  Todas as Fases
                </option>
                {phases.map((p) => (
                  <option key={p.id} value={p.id} className="bg-slate-900 text-slate-200">
                    {p.icon} {p.title}
                  </option>
                ))}
              </select>
            </div>

            {/* Status Filter */}
            <div className="flex items-center gap-1.5 bg-slate-950 px-2.5 py-1.5 rounded-xl border border-slate-800 text-xs text-slate-300 shrink-0">
              <ListFilter className="w-3.5 h-3.5 text-emerald-400" />
              <select
                value={selectedStatusFilter}
                onChange={(e) => setSelectedStatusFilter(e.target.value)}
                className="bg-transparent text-xs text-slate-200 focus:outline-none cursor-pointer"
              >
                <option value="all" className="bg-slate-900 text-slate-200">
                  Todos os Status
                </option>
                <option value="completed" className="bg-slate-900 text-slate-200">
                  Somente Concluídos
                </option>
                <option value="pending" className="bg-slate-900 text-slate-200">
                  Somente Pendentes
                </option>
              </select>
            </div>
          </div>
        </div>

        {/* Actions Bar */}
        <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-slate-800/80 text-xs">
          <div className="flex items-center gap-2">
            <button
              onClick={expandAllCards}
              className="px-2.5 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg transition-colors flex items-center gap-1 text-[11px] border border-slate-700"
            >
              <Maximize2 className="w-3 h-3 text-slate-400" />
              Expandir Tudo
            </button>
            <button
              onClick={collapseAllCards}
              className="px-2.5 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg transition-colors flex items-center gap-1 text-[11px] border border-slate-700"
            >
              <Minimize2 className="w-3 h-3 text-slate-400" />
              Recolher
            </button>
            <button
              onClick={resetChecklist}
              className="px-2.5 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg transition-colors flex items-center gap-1 text-[11px] border border-slate-700"
              title="Sincronizar dados com o banco de dados"
            >
              <RefreshCw className="w-3 h-3 text-emerald-400" />
              Sincronizar Banco
            </button>
          </div>

          <div className="flex items-center gap-2">
            {setShowPhaseModal && (
              <button
                onClick={() => setShowPhaseModal(true)}
                className="px-3 py-1.5 bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-300 border border-emerald-500/30 rounded-xl transition-all font-semibold flex items-center gap-1.5 shadow-sm text-xs"
                title="Cadastrar nova fase no Supabase"
              >
                <Layers className="w-3.5 h-3.5 text-emerald-400" />
                Nova Fase
              </button>
            )}

            <button
              onClick={() => (onOpenAddTaskModal ? onOpenAddTaskModal() : setShowAddModal(true))}
              className="px-3 py-1.5 bg-cyan-600 hover:bg-cyan-500 text-slate-950 rounded-xl transition-all font-bold flex items-center gap-1.5 shadow-sm text-xs"
            >
              <Plus className="w-3.5 h-3.5 stroke-[3]" />
              Novo Projeto
            </button>

            <button
              onClick={() => setShowGithubModal(true)}
              className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl transition-colors flex items-center gap-1.5 border border-slate-700 text-xs"
            >
              <FolderGit2 className="w-3.5 h-3.5 text-cyan-400" />
              Configurar Git
            </button>
          </div>
        </div>
      </div>

      {/* 3. Phases Accordion List */}
      {phases.length === 0 ? (
        <div className="p-12 text-center bg-slate-900 border border-slate-800 rounded-2xl space-y-3">
          <Info className="w-8 h-8 text-slate-500 mx-auto" />
          <h3 className="text-base font-bold text-white">Nenhuma Fase ou Projeto Encontrado no Banco de Dados</h3>
          <p className="text-xs text-slate-400 max-w-md mx-auto">
            O banco de dados Supabase ainda não retornou fases ou projetos. Você pode cadastrar uma nova fase ou projeto diretamente utilizando os botões da barra superior.
          </p>
          <div className="pt-2 flex justify-center gap-3">
            {setShowPhaseModal && (
              <button
                onClick={() => setShowPhaseModal(true)}
                className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold transition-all"
              >
                Criar Fase no Supabase
              </button>
            )}
            <button
              onClick={() => (onOpenAddTaskModal ? onOpenAddTaskModal() : setShowAddModal(true))}
              className="px-4 py-2 bg-cyan-600 hover:bg-cyan-500 text-slate-950 rounded-xl text-xs font-bold transition-all"
            >
              Criar Primeiro Projeto
            </button>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          {phases.map((phase) => {
            const phaseTasks = filteredTasks.filter((t) => t.phase === phase.id);
            const isOpen = openPhases.includes(phase.id);
            const totalPhaseTasks = tasks.filter((t) => t.phase === phase.id).length;
            const completedPhaseTasks = tasks.filter((t) => t.phase === phase.id && t.completed).length;
            const phaseProgress =
              totalPhaseTasks > 0 ? Math.round((completedPhaseTasks / totalPhaseTasks) * 100) : 0;

            return (
              <div
                key={phase.id}
                id={`phase-card-${phase.id}`}
                className="bg-slate-900/90 border border-slate-800 rounded-2xl overflow-hidden shadow-lg transition-all"
              >
                {/* Phase Accordion Header */}
                <div
                  onClick={() => togglePhase(phase.id)}
                  className="px-6 py-4 bg-slate-900 hover:bg-slate-800/80 cursor-pointer flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-b border-slate-800/60 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <button className="text-slate-400 hover:text-white p-1 rounded-lg bg-slate-950 border border-slate-800">
                      {isOpen ? (
                        <ChevronDown className="w-4 h-4 text-emerald-400" />
                      ) : (
                        <ChevronRight className="w-4 h-4 text-slate-400" />
                      )}
                    </button>
                    <span className="text-xl p-2 bg-slate-950 border border-slate-800 rounded-xl shadow-inner">
                      {phase.icon}
                    </span>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider">
                          Fase {phase.id}
                        </span>
                        <h2 className="text-base font-bold text-white">{phase.title}</h2>
                      </div>
                      <p className="text-xs text-slate-400">{phase.subtitle}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 w-full md:w-auto justify-between md:justify-end border-t md:border-t-0 border-slate-800 pt-2 md:pt-0">
                    <div className="flex items-center gap-2">
                      <div className="w-24 bg-slate-950 h-2 rounded-full overflow-hidden border border-slate-800">
                        <div
                          className="bg-gradient-to-r from-emerald-500 to-teal-400 h-full transition-all duration-500"
                          style={{ width: `${phaseProgress}%` }}
                        />
                      </div>
                      <span className="text-xs font-bold text-slate-300 font-mono w-10 text-right">
                        {phaseProgress}%
                      </span>
                    </div>

                    <span className="text-xs px-2.5 py-1 bg-slate-950 text-slate-400 border border-slate-800 rounded-lg font-mono">
                      {completedPhaseTasks}/{totalPhaseTasks}
                    </span>

                    {/* Delete phase action */}
                    {deletePhase && phase.id > 4 && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          if (
                            confirm(
                              `Deseja excluir a fase "${phase.title}" e seus projetos do Supabase?`
                            )
                          ) {
                            deletePhase(phase.id);
                          }
                        }}
                        className="p-1.5 text-slate-500 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
                        title="Excluir fase do Supabase"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </div>

                {/* Phase Content Area */}
                {isOpen && (
                  <div className="p-6 space-y-4 bg-slate-950/40">
                    {/* Add Project Button inside expanded Phase */}
                    <div className="flex items-center justify-between pb-2 border-b border-slate-800/60">
                      <span className="text-xs font-semibold text-slate-400 flex items-center gap-1.5">
                        <Layers className="w-3.5 h-3.5 text-emerald-400" />
                        Projetos e Entregáveis da Fase {phase.id} ({phaseTasks.length})
                      </span>

                      <button
                        onClick={() =>
                          onOpenAddTaskModal
                            ? onOpenAddTaskModal(phase.id)
                            : setShowAddModal(true)
                        }
                        className="px-3 py-1 bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-300 border border-emerald-500/30 rounded-lg transition-all text-xs font-semibold flex items-center gap-1.5 shadow-sm"
                        title={`Adicionar novo projeto diretamente à Fase ${phase.id}`}
                      >
                        <Plus className="w-3.5 h-3.5 text-emerald-400 stroke-[3]" />
                        Novo Projeto
                      </button>
                    </div>

                    {phaseTasks.length === 0 ? (
                      <div className="p-8 text-center border border-dashed border-slate-800 rounded-xl bg-slate-900/40">
                        <p className="text-xs text-slate-500 mb-2">
                          Nenhum projeto ou ideia encontrada nesta fase para os filtros aplicados.
                        </p>
                        <button
                          onClick={() =>
                            onOpenAddTaskModal
                              ? onOpenAddTaskModal(phase.id)
                              : setShowAddModal(true)
                          }
                          className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-semibold transition-all inline-flex items-center gap-1"
                        >
                          <Plus className="w-3 h-3 stroke-[3]" />
                          Adicionar Projeto nesta Fase
                        </button>
                      </div>
                    ) : (
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {phaseTasks.map((task) => (
                          <TaskCard
                            key={task.id}
                            task={task}
                            isExpanded={expandedCards.includes(task.id)}
                            onToggleExpand={() => toggleCard(task.id)}
                            onToggleComplete={() => toggleTask(task.id)}
                            onDelete={() => deleteTask(task.id)}
                            githubConfig={githubConfig}
                          />
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
