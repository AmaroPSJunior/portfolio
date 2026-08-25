'use client';

import React, { useMemo, useState } from 'react';
import { Task, Phase, GithubConfig, SiteConfig, WorkStatus } from '@/types';
import { TaskCard } from './TaskCard';
import { DeletePhaseModal } from './DeletePhaseModal';
import { DeleteProjectModal } from './DeleteProjectModal';
import { STATUS_OPTIONS } from '@/data/constants';
import { isDisabledStatus, isTaskFinished } from '@/lib/validators';
import {
  ChevronDown,
  ChevronRight,
  Filter,
  Plus,
  RefreshCw,
  ListFilter,
  Layers,
  Sparkles,
  Info,
  Maximize2,
  Minimize2,
  Pencil,
  Trash2,
  LayoutList,
  LayoutGrid,
  Github,
  Code2,
  CalendarDays,
} from 'lucide-react';

type ViewMode = 'phases' | 'projects';

type GithubFilter = 'all' | 'linked' | 'unlinked';

type ProjectDateSort = 'newest' | 'oldest';

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
  onStatusChange?: (taskId: number, status: WorkStatus, statusReason: string) => void;
  deleteTask: (taskId: number) => void;
  deletePhase?: (phaseId: number) => void;
  onEditPhase?: (phase: Phase) => void;
  onEditTask?: (task: Task) => void;
  resetChecklist: () => void;
  setShowAddModal: (show: boolean) => void;
  onOpenAddTaskModal?: (phaseId?: number) => void;
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
  onStatusChange,
  deleteTask,
  deletePhase,
  onEditPhase,
  onEditTask,
  resetChecklist,
  setShowAddModal,
  onOpenAddTaskModal,
  setShowPhaseModal,
  onOpenDiagnostics,
}) => {
  const [phaseToDelete, setPhaseToDelete] = useState<Phase | null>(null);
  const [projectToDelete, setProjectToDelete] = useState<Task | null>(null);
  const [projectDateSort, setProjectDateSort] = useState<ProjectDateSort>('newest');
  const [viewMode, setViewMode] = useState<ViewMode>('projects');
  const [phaseStatusFilter, setPhaseStatusFilter] = useState<string>('all');
  const [githubFilter, setGithubFilter] = useState<GithubFilter>('all');
  const [languageFilter, setLanguageFilter] = useState<string>('all');

  const handleDeletePhase = () => {
    if (!phaseToDelete || !deletePhase) return;
    deletePhase(phaseToDelete.id);
    setPhaseToDelete(null);
  };

  const handleDeleteProject = () => {
    if (!projectToDelete) return;
    deleteTask(projectToDelete.id);
    setProjectToDelete(null);
  };

  const languages = useMemo(() => {
    const values = tasks
      .map((task) => task.githubLanguage)
      .filter(
        (language): language is string =>
          Boolean(language)
      );

    return Array.from(new Set(values)).sort(
      (a, b) => a.localeCompare(b, 'pt-BR')
    );
  }, [tasks]);

  const filteredTasks = useMemo(() => {
    const normalizedSearch =
      searchQuery.trim().toLowerCase();

    return tasks.filter((task) => {
      const phase = phases.find(
        (item) => item.id === task.phase
      );

      const matchesSearch =
        normalizedSearch === '' ||
        task.title
          .toLowerCase()
          .includes(normalizedSearch) ||
        task.description
          .toLowerCase()
          .includes(normalizedSearch) ||
        (task.badges ?? []).some((badge) =>
          badge
            .toLowerCase()
            .includes(normalizedSearch)
        ) ||
        (task.requirements ?? []).some((requirement) =>
          requirement
            .toLowerCase()
            .includes(normalizedSearch)
        ) ||
        task.githubName
          ?.toLowerCase()
          .includes(normalizedSearch) ||
        task.githubFullName
          ?.toLowerCase()
          .includes(normalizedSearch) ||
        task.githubDescription
          ?.toLowerCase()
          .includes(normalizedSearch) ||
        task.githubLanguage
          ?.toLowerCase()
          .includes(normalizedSearch) ||
        phase?.title
          ?.toLowerCase()
          .includes(normalizedSearch);

      const matchesPhase =
        selectedPhaseFilter === 'all' ||
        task.phase ===
          Number(selectedPhaseFilter);

      const matchesStatus =
        selectedStatusFilter === 'all' ||
        (selectedStatusFilter === 'completed' &&
          task.completed) ||
        (selectedStatusFilter === 'pending' &&
          !task.completed);

      const matchesGithub =
        githubFilter === 'all' ||
        (githubFilter === 'linked' &&
          Boolean(
            task.githubHtmlUrl ||
              task.githubFullName ||
              task.githubName
          )) ||
        (githubFilter === 'unlinked' &&
          !(
            task.githubHtmlUrl ||
            task.githubFullName ||
            task.githubName
          ));

      const matchesLanguage =
        languageFilter === 'all' ||
        task.githubLanguage === languageFilter;

      const matchesPhaseStatus =
        phaseStatusFilter === 'all' ||
        phase?.status === phaseStatusFilter;

      return (
        matchesSearch &&
        matchesPhase &&
        matchesStatus &&
        matchesGithub &&
        matchesLanguage &&
        matchesPhaseStatus
      );
    });
  }, [
    tasks,
    phases,
    searchQuery,
    selectedPhaseFilter,
    selectedStatusFilter,
    githubFilter,
    languageFilter,
    phaseStatusFilter,
  ]);

  const sortedProjectTasks = useMemo(() => {
    return [...filteredTasks].sort((a, b) => {
      const dateA = a.githubCreatedAt ? new Date(a.githubCreatedAt).getTime() : null;
      const dateB = b.githubCreatedAt ? new Date(b.githubCreatedAt).getTime() : null;

      if (dateA === null && dateB === null) { return a.title.localeCompare(b.title, 'pt-BR'); }
      if (dateA === null) return 1;
      if (dateB === null) return -1;
      if (dateA !== dateB) { return projectDateSort === 'newest' ? dateB - dateA : dateA - dateB; }

      return a.title.localeCompare(b.title, 'pt-BR');
    });
  }, [filteredTasks, projectDateSort]);

  const activeTasks = tasks.filter((task) => !isDisabledStatus(task.status));
  const totalTasks = activeTasks.length;
  const completedTasks = activeTasks.filter(isTaskFinished).length;
  const overallProgress = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  const completedPhasesCount = phases.filter((phase) => {
      const phaseTasks = activeTasks.filter(
        (task) => task.phase === phase.id
      );

      return (
        phaseTasks.length > 0 &&
        phaseTasks.every(isTaskFinished)
      );
  }).length;

  const getPhase = (phaseId: number) => {
    return phases.find(
      (phase) => phase.id === phaseId
    );
  };

  const getPhaseStats = (phaseId: number) => {
    const phaseTasks = tasks.filter(
      (task) => task.phase === phaseId
    );

    const linkedGithub = phaseTasks.filter(
      (task) =>
        Boolean(
          task.githubHtmlUrl ||
            task.githubFullName ||
            task.githubName
        )
    ).length;

    const phaseLanguages = new Set(
      phaseTasks
        .map((task) => task.githubLanguage)
        .filter(Boolean)
    );

    return {
      total: phaseTasks.length,
      completed: phaseTasks.filter(
        isTaskFinished
      ).length,
      linkedGithub,
      languages: phaseLanguages.size,
    };
  };

  const clearFilters = () => {
    setSearchQuery('');
    setSelectedPhaseFilter('all');
    setSelectedStatusFilter('all');
    setPhaseStatusFilter('all');
    setGithubFilter('all');
    setLanguageFilter('all');
    setProjectDateSort('newest');
  };

  const hasActiveFilters =
    Boolean(searchQuery) ||
    selectedPhaseFilter !== 'all' ||
    selectedStatusFilter !== 'all' ||
    phaseStatusFilter !== 'all' ||
    githubFilter !== 'all' ||
    languageFilter !== 'all' ||
    projectDateSort !== 'newest'
  ;

  return (
    <div id="roadmap-tab-container" className="space-y-6 animate-fadeIn">
      {/* 1. Header Hero Banner */}
      <div className="p-6 bg-gradient-to-r from-slate-900 via-slate-900/90 to-slate-950 border border-slate-800 rounded-2xl shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-emerald-400" />
            <h1 className="text-xl font-black text-white tracking-tight">
              {siteConfig?.title || 'Projetos, Ideias e Testes em Evolução'}
            </h1>
          </div>
          <p className="text-xs text-slate-400 max-w-3xl leading-relaxed">
            {siteConfig?.subtitle ||
              'Acompanhamento sanfonado de soluções completas, provas de conceito e próximos entregáveis.'}
          </p>
        </div>

        <div className="flex items-center gap-3 shrink-0 bg-slate-950/80 p-3 rounded-xl border border-slate-800">
          <div className="text-right">
            <span className="text-[10px] text-slate-500 uppercase tracking-wider block font-medium">
              Progresso do Portfólio
            </span>
            <span className="text-lg font-black text-emerald-400">{overallProgress}%</span>
            <span className="text-[10px] text-slate-400 block">
              Fases Concluídas:{' '}{completedPhasesCount}/{phases.length || 4}
            </span>
          </div>
          <div className="w-12 h-12 rounded-full border-4 border-slate-800 border-t-emerald-500 flex items-center justify-center font-bold text-xs text-white bg-slate-900 shadow-inner">
            {completedTasks}/{totalTasks}
          </div>
        </div>
      </div>

      {/* 2. Control Toolbar */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 shadow-lg space-y-3">
        <div className="flex flex-col gap-3">
          <div className="relative w-full">
            <input
              type="text"
              placeholder="Pesquisar projetos, tecnologias, GitHub..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl py-2 pl-3 pr-8 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-emerald-500 transition-colors"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-2.5 top-2.5 text-slate-500 hover:text-slate-300 text-xs"
                title="Limpar busca"
                aria-label="Limpar busca"
              >
                ✕
              </button>
            )}
          </div>

          <div className="flex flex-wrap items-center justify-start gap-2 w-full">
            {/* Phase Filter */}
            <div className="flex items-center gap-1.5 bg-slate-950 px-2.5 py-1.5 rounded-xl border border-slate-800 text-xs text-slate-300 shrink-0">
              <Filter className="w-3.5 h-3.5 text-emerald-400" />
              <select
                value={selectedPhaseFilter}
                onChange={(e) => setSelectedPhaseFilter(e.target.value)}
                className="bg-transparent text-xs text-slate-200 focus:outline-none cursor-pointer"
                aria-label="Filtrar por fase"
              >
                <option value="all" className="bg-slate-900 text-slate-200">Todas as Fases</option>

                {phases.map((phase) => (
                  <option
                    key={phase.id}
                    value={phase.id}
                    className="bg-slate-900 text-slate-200"
                  >
                    {phase.icon} {phase.title}
                  </option>
                ))}
              </select>
            </div>

            {/* Project Status Filter */}
            <div className="flex items-center gap-1.5 bg-slate-950 px-2.5 py-1.5 rounded-xl border border-slate-800 text-xs text-slate-300 shrink-0">
              <ListFilter className="w-3.5 h-3.5 text-emerald-400" />
              <select
                value={selectedStatusFilter}
                onChange={(e) => setSelectedStatusFilter(e.target.value)}
                className="bg-transparent text-xs text-slate-200 focus:outline-none cursor-pointer"
                aria-label="Filtrar por status do projeto"
              >
                <option
                  value="all"
                  className="bg-slate-900 text-slate-200"
                >
                  Projetos: Todos
                </option>

                <option
                  value="completed"
                  className="bg-slate-900 text-slate-200"
                >
                  Projetos: Concluídos
                </option>

                <option
                  value="pending"
                  className="bg-slate-900 text-slate-200"
                >
                  Projetos: Pendentes
                </option>
              </select>
            </div>

            {/* Phase Status Filter */}
            <div className="flex items-center gap-1.5 bg-slate-950 px-2.5 py-1.5 rounded-xl border border-slate-800 text-xs text-slate-300 shrink-0">
              <Layers className="w-3.5 h-3.5 text-emerald-400" />

              <select
                value={phaseStatusFilter}
                onChange={(e) =>
                  setPhaseStatusFilter(
                    e.target.value
                  )
                }
                className="bg-transparent text-xs text-slate-200 focus:outline-none cursor-pointer"
                aria-label="Filtrar por status da fase"
              >
                <option
                  value="all"
                  className="bg-slate-900 text-slate-200"
                >
                  Fases: Todos
                </option>

                {STATUS_OPTIONS.map(
                  (option) => (
                    <option
                      key={option.value}
                      value={option.value}
                      className="bg-slate-900 text-slate-200"
                    >
                      Fases: {option.label}
                    </option>
                  )
                )}
              </select>
            </div>

            {/* GitHub Filter */}
            <div className="flex items-center gap-1.5 bg-slate-950 px-2.5 py-1.5 rounded-xl border border-slate-800 text-xs text-slate-300 shrink-0">
              <Github className="w-3.5 h-3.5 text-cyan-400" />

              <select
                value={githubFilter}
                onChange={(e) =>
                  setGithubFilter(
                    e.target.value as GithubFilter
                  )
                }
                className="bg-transparent text-xs text-slate-200 focus:outline-none cursor-pointer"
                aria-label="Filtrar por GitHub"
              >
                <option
                  value="all"
                  className="bg-slate-900 text-slate-200"
                >
                  GitHub: Todos
                </option>

                <option
                  value="linked"
                  className="bg-slate-900 text-slate-200"
                >
                  GitHub: Associados
                </option>

                <option
                  value="unlinked"
                  className="bg-slate-900 text-slate-200"
                >
                  GitHub: Sem repositório
                </option>
              </select>
            </div>

            {/* Language Filter */}
            {languages.length > 0 && (
              <div className="flex items-center gap-1.5 bg-slate-950 px-2.5 py-1.5 rounded-xl border border-slate-800 text-xs text-slate-300 shrink-0">
                <Code2 className="w-3.5 h-3.5 text-cyan-400" />

                <select
                  value={languageFilter}
                  onChange={(e) =>
                    setLanguageFilter(
                      e.target.value
                    )
                  }
                  className="bg-transparent text-xs text-slate-200 focus:outline-none cursor-pointer"
                  aria-label="Filtrar por linguagem"
                >
                  <option
                    value="all"
                    className="bg-slate-900 text-slate-200"
                  >
                    Linguagem: Todas
                  </option>

                  {languages.map(
                    (language) => (
                      <option
                        key={language}
                        value={language}
                        className="bg-slate-900 text-slate-200"
                      >
                        {language}
                      </option>
                    )
                  )}
                </select>
              </div>
            )}

            <div className="flex items-center gap-1.5 bg-slate-950 px-2.5 py-1.5 rounded-xl border border-slate-800 text-xs text-slate-300 shrink-0">
              <CalendarDays className="w-3.5 h-3.5 text-cyan-400" />

              <select
                value={projectDateSort}
                onChange={(e) =>
                  setProjectDateSort(
                    e.target.value as ProjectDateSort
                  )
                }
                className="bg-transparent text-xs text-slate-200 focus:outline-none cursor-pointer"
                aria-label="Ordenar por data de criação do repositório"
              >
                <option
                  value="newest"
                  className="bg-slate-900 text-slate-200"
                >
                  Repositórios: Mais novos
                </option>

                <option
                  value="oldest"
                  className="bg-slate-900 text-slate-200"
                >
                  Repositórios: Mais antigos
                </option>
              </select>
            </div>

            {/* View Selector */}
            <div
              className="flex items-center bg-slate-950 border border-slate-800 rounded-xl p-1 shrink-0"
              role="group"
              aria-label="Modo de visualização"
            >
              <button
                type="button"
                onClick={() => setViewMode('phases')}
                className={`px-2.5 py-1.5 rounded-lg text-[11px] font-semibold transition-all flex items-center gap-1.5 ${
                  viewMode === 'phases'
                    ? 'bg-emerald-600 text-white shadow-sm'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
                }`}
                title="Visualizar projetos organizados por fases"
                aria-label="Visualizar por fases"
                aria-pressed={viewMode === 'phases'}
              >
                <LayoutList className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">
                  Por Fases
                </span>
              </button>

              <button
                type="button"
                onClick={() => setViewMode('projects')}
                className={`px-2.5 py-1.5 rounded-lg text-[11px] font-semibold transition-all flex items-center gap-1.5 ${
                  viewMode === 'projects'
                    ? 'bg-cyan-600 text-white shadow-sm'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
                }`}
                title="Visualizar todos os projetos em uma única grade"
                aria-label="Visualizar projetos"
                aria-pressed={viewMode === 'projects'}
              >
                <LayoutGrid className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">
                  Projetos
                </span>
              </button>
            </div>
          </div>
        </div>

        {/* Active View Indicator */}
        <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-slate-800/80">
          <div className="flex items-center gap-2 text-[11px]">
            <span className="text-slate-500">Visualização atual:</span>

            <span
              className={`px-2.5 py-1 rounded-lg border font-semibold ${
                viewMode === 'phases'
                  ? 'bg-emerald-950/50 border-emerald-500/30 text-emerald-300'
                  : 'bg-cyan-950/50 border-cyan-500/30 text-cyan-300'
              }`}
            >
              {viewMode === 'phases' ? 'Por Fases' : 'Todos os Projetos'}
            </span>

            <span className="text-slate-600">•</span>

            <span className="text-slate-400">
              {filteredTasks.length}{' '}
              {filteredTasks.length === 1 ? 'projeto encontrado' : 'projetos encontrados'}
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {hasActiveFilters && (
              <button
                type="button"
                onClick={clearFilters}
                className="px-2.5 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg transition-colors text-[11px] border border-slate-700"
              >
                Limpar Filtros
              </button>
            )}

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

            {viewMode === 'projects' && (
              <button
                onClick={() => onOpenAddTaskModal ? onOpenAddTaskModal() : setShowAddModal(true)}
                className="px-3 py-1.5 bg-cyan-600/20 hover:bg-cyan-600/30 text-cyan-300 border border-cyan-500/30 rounded-xl transition-all font-semibold flex items-center gap-1.5 shadow-sm text-xs"
                title="Cadastrar novo projeto"
              >
                <Plus className="w-3.5 h-3.5 text-cyan-400" />
                Novo Projeto
              </button>
            )}

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

          </div>
        </div>
      </div>

      {/* 3. Empty Database State */}
      {phases.length === 0 ? (
        <div className="p-12 text-center bg-slate-900 border border-slate-800 rounded-2xl space-y-3">
          <Info className="w-8 h-8 text-slate-500 mx-auto" />

          <h3 className="text-base font-bold text-white">
            Nenhuma Fase ou Projeto Encontrado no Banco de Dados
          </h3>

          <p className="text-xs text-slate-400 max-w-md mx-auto">
            O banco de dados Supabase ainda não retornou fases ou
            projetos. Você pode cadastrar uma nova fase ou projeto
            diretamente utilizando os botões da barra superior.
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
          </div>
        </div>
      ) : (
        <>
          {/* ====================================================== */}
          {/* VIEW 1 — POR FASES                                    */}
          {/* ====================================================== */}
          {viewMode === 'phases' && (
            <div className="space-y-4">
              {phases
                .filter((phase) => {
                  if (
                    phaseStatusFilter === 'all'
                  ) {
                    return true;
                  }

                  return (
                    phase.status ===
                    phaseStatusFilter
                  );
                })
                .map((phase) => {
                  const phaseTasks =
                    filteredTasks.filter(
                      (task) =>
                        task.phase === phase.id
                    );

                  const phaseStatus =
                    phase.status || 'pending';

                  const phaseStatusLabel =
                    STATUS_OPTIONS.find(
                      (option) =>
                        option.value ===
                        phaseStatus
                    )?.label ||
                    'Pendente';

                  const isOpen =
                    openPhases.includes(
                      phase.id
                    );

                  const phaseActiveTasks =
                    activeTasks.filter(
                      (task) =>
                        task.phase === phase.id
                    );

                  const totalPhaseTasks =
                    phaseActiveTasks.length;

                  const completedPhaseTasks =
                    phaseActiveTasks.filter(
                      isTaskFinished
                    ).length;

                  const phaseProgress =
                    totalPhaseTasks > 0
                      ? Math.round(
                          (completedPhaseTasks /
                            totalPhaseTasks) *
                            100
                        )
                      : 0;

                  const phaseStats =
                    getPhaseStats(
                      phase.id
                    );

                  return (
                    <div
                      key={phase.id}
                      id={`phase-card-${phase.id}`}
                      className="bg-slate-900/90 border border-slate-800 rounded-2xl overflow-hidden shadow-lg transition-all"
                    >
                      {/* Phase Accordion Header */}
                    <div onClick={() => togglePhase(phase.id)}
                        className="px-6 py-4 bg-slate-900 hover:bg-slate-800/80 cursor-pointer flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-b border-slate-800/60 transition-colors"
                      >
                        <div className="flex items-center gap-3">
                          <button
                            type="button"
                            className="text-slate-400 hover:text-white p-1 rounded-lg bg-slate-950 border border-slate-800"
                          aria-label={isOpen ? `Recolher fase ${phase.title}` : `Expandir fase ${phase.title}`}
                          >
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
                            <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider">Fase {phase.id}</span>
                            <h2 className="text-base font-bold text-white">{phase.title}</h2>
                            </div>

                          <p className="text-xs text-slate-400">{phase.subtitle}</p>

                            <div className="flex flex-wrap items-center gap-2 mt-1 text-[10px]">
                              <span className="px-2 py-0.5 rounded border border-emerald-500/30 bg-emerald-950/60 text-emerald-300 font-semibold">
                              Status: {phaseStatusLabel}
                              </span>

                              <span className="text-slate-500">
                                {phaseStats.total}{' '}
                                projetos
                              </span>

                              <span className="text-slate-600">
                                •
                              </span>

                              <span className="text-cyan-400 flex items-center gap-1">
                                <Github className="w-3 h-3" />
                                {phaseStats.linkedGithub}
                              </span>

                              {phaseStats.languages >
                                0 && (
                                <>
                                  <span className="text-slate-600">
                                    •
                                  </span>

                                  <span className="text-slate-500">
                                    {
                                      phaseStats.languages
                                    }{' '}
                                    linguagens
                                  </span>
                                </>
                              )}

                              {phase.statusReason && (
                                <>
                                  <span className="text-slate-600">
                                    •
                                  </span>

                                  <span className="text-slate-500">
                                    {
                                      phase.statusReason
                                    }
                                  </span>
                                </>
                              )}
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center gap-4 w-full md:w-auto justify-between md:justify-end border-t md:border-t-0 border-slate-800 pt-2 md:pt-0">
                          <div className="flex items-center gap-2">
                            <div className="w-24 bg-slate-950 h-2 rounded-full overflow-hidden border border-slate-800">
                              <div
                                className="bg-gradient-to-r from-emerald-500 to-teal-400 h-full transition-all duration-500"
                              style={{width: `${phaseProgress}%`,}}
                              />
                            </div>

                          <span className="text-xs font-bold text-slate-300 font-mono w-10 text-right">{phaseProgress}%</span>
                          </div>

                          <span className="text-xs px-2.5 py-1 bg-slate-950 text-slate-400 border border-slate-800 rounded-lg font-mono">
                            {completedPhaseTasks}/
                            {totalPhaseTasks}
                          </span>

                          {onEditPhase && (
                            <button
                              type="button"
                            onClick={(e) => {e.stopPropagation();onEditPhase(phase);}}
                              className="p-1.5 text-slate-500 hover:text-cyan-400 hover:bg-cyan-500/10 rounded-lg transition-colors"
                              title="Editar fase"
                              aria-label={`Editar fase ${phase.title}`}
                            >
                              <Pencil className="w-4 h-4" />
                            </button>
                          )}

                          {deletePhase &&
                          !tasks.some((task) =>task.phase === phase.id) && (
                              <button
                                type="button"
                                onClick={(e) => {
                                  e.stopPropagation();
                                setPhaseToDelete(phase);
                                }}
                                className="p-1.5 text-slate-500 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
                                title="Excluir fase sem projetos associados"
                                aria-label={`Excluir fase ${phase.title}`}
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            )}
                        </div>
                      </div>

                      {/* Phase Content Area */}
                      {isOpen && (
                        <div className="p-6 space-y-4 bg-slate-950/40">
                          <div className="flex items-center justify-between pb-2 border-b border-slate-800/60">
                            <span className="text-xs font-semibold text-slate-400 flex items-center gap-1.5">
                              <Layers className="w-3.5 h-3.5 text-emerald-400" />
                              Projetos e Entregáveis da Fase{' '}
                              {phase.id} ({phaseTasks.length})
                            </span>

                            <button
                              type="button"
                            onClick={() => onOpenAddTaskModal ? onOpenAddTaskModal(phase.id) : setShowAddModal(true)}
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
                                type="button"
                              onClick={() => onOpenAddTaskModal ? onOpenAddTaskModal(phase.id) : setShowAddModal(true)}
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
                                    onEdit={() => onEditTask?.(task)}
                                    onDelete={() => setProjectToDelete(task)}
                                    onStatusChange={(status, statusReason) =>
                                      onStatusChange?.(task.id, status, statusReason)
                                    }
                                    githubConfig={githubConfig}
                                    totalPhases={phases.length}
                                    phaseIndex={
                                      phases.findIndex(
                                        (phaseItem) => phaseItem.id === task.phase
                                      ) + 1
                                    }
                                  />
                                )
                              )}
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  );
                })}
            </div>
          )}

          {/* ====================================================== */}
          {/* VIEW 2 — PROJETOS                                      */}
          {/* ====================================================== */}
          {viewMode === 'projects' && (
            <div className="space-y-4">
              <div className="p-4 bg-gradient-to-r from-cyan-950/40 via-slate-900 to-slate-950 border border-cyan-500/20 rounded-2xl">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <LayoutGrid className="w-4 h-4 text-cyan-400" />

                      <h2 className="text-sm font-bold text-white">Todos os Projetos</h2>
                    </div>

                    <p className="text-[11px] text-slate-400 mt-1">
                      Visualização consolidada dos projetos, independentemente da fase, com dados do repositório GitHub quando disponíveis.
                    </p>
                  </div>

                  <div className="flex items-center gap-2 text-[10px] text-slate-500">
                    <span className="px-2 py-1 rounded-lg bg-slate-950 border border-slate-800">
                      {sortedProjectTasks.length}{' '}
                      {sortedProjectTasks.length === 1 ? 'projeto' : 'projetos'}
                    </span>

                    <span className="px-2 py-1 rounded-lg bg-cyan-950/50 border border-cyan-500/20 text-cyan-300">
                      {sortedProjectTasks.filter(
                        (task) =>
                          Boolean(
                            task.githubHtmlUrl ||
                              task.githubFullName ||
                              task.githubName
                          )
                      ).length}{' '}
                      GitHub
                    </span>
                  </div>
                </div>
              </div>

                            {sortedProjectTasks.length === 0 ? (
                <div className="p-12 text-center bg-slate-900 border border-slate-800 rounded-2xl">
                  <Info className="w-8 h-8 text-slate-500 mx-auto mb-3" />

                  <h3 className="text-sm font-bold text-white">Nenhum projeto encontrado</h3>

                  <p className="text-xs text-slate-500 max-w-md mx-auto mt-2">
                    Não existem projetos correspondentes aos filtros ou à busca atual.
                  </p>

                  {hasActiveFilters && (
                    <button
                      type="button"
                      onClick={clearFilters}
                      className="mt-4 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 rounded-lg text-xs transition-colors"
                    >
                      Limpar Filtros
                    </button>
                  )}
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {sortedProjectTasks.map((task) => {
                    const phase = getPhase(task.phase);
                    const phaseIndex = phases.findIndex(p => p.id === task.phase) + 1;

                    return (
                      <TaskCard
                        key={task.id}
                        task={task}
                        isExpanded={expandedCards.includes(task.id)}
                        onToggleExpand={() => toggleCard(task.id)}
                        onToggleComplete={() => toggleTask(task.id)}
                        onEdit={() => onEditTask?.(task)}
                        onDelete={() => setProjectToDelete(task)}
                        onStatusChange={(status, statusReason) =>
                          onStatusChange?.(task.id, status, statusReason)
                        }
                        githubConfig={githubConfig}
                        totalPhases={phases.length}
                        phaseIndex={
                          phases.findIndex(
                            (phaseItem) => phaseItem.id === task.phase
                          ) + 1
                        }
                      />
                    );
                  })}
                </div>
              )}

            </div>
          )}
        </>
      )}

      <DeletePhaseModal
        phase={phaseToDelete}
        onClose={() => setPhaseToDelete(null)}
        onConfirm={handleDeletePhase}
      />

      <DeleteProjectModal
        project={projectToDelete}
        onClose={() => setProjectToDelete(null)}
        onConfirm={handleDeleteProject}
      />
    </div>
  );
};