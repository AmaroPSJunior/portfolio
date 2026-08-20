'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { Header } from '@/components/Header';
import { HomeTab } from '@/components/HomeTab';
import { RoadmapTab } from '@/components/RoadmapTab';
import { ProductsTab } from '@/components/ProductsTab';
import { AddTaskModal } from '@/components/AddTaskModal';
import { GithubModal } from '@/components/GithubModal';
import { CreatePhaseModal } from '@/components/CreatePhaseModal';
import { DiagnosticsModal } from '@/components/DiagnosticsModal';
import { AdminModal } from '@/components/AdminModal';
import { ErrorBoundary } from '@/components/ErrorBoundary';
import { SKILLS_MATRIX } from '@/data/constants';
import { Task, NewTaskForm, GithubConfig, Phase, SiteConfig, WorkStatus } from '@/types';
import { AppLogger } from '@/lib/logger';
import { AlertTriangle, RefreshCw, X } from 'lucide-react';

export default function HomePage() {
  const [activeTab, setActiveTab] = useState<string>('home');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedPhaseFilter, setSelectedPhaseFilter] = useState<string>('all');
  const [selectedStatusFilter, setSelectedStatusFilter] = useState<string>('all');
  const [showAddModal, setShowAddModal] = useState<boolean>(false);
  const [showGithubModal, setShowGithubModal] = useState<boolean>(false);
  const [showPhaseModal, setShowPhaseModal] = useState<boolean>(false);
  const [showDiagnosticsModal, setShowDiagnosticsModal] = useState<boolean>(false);
  const [showAdminModal, setShowAdminModal] = useState<boolean>(false);
  const [selectedPhaseForModal, setSelectedPhaseForModal] = useState<number | undefined>(undefined);
  const [phaseToEdit, setPhaseToEdit] = useState<Phase | null>(null);

  // Dynamic Site Config for Roadmap Page Title & Subtitle from Database
  const [siteConfig, setSiteConfig] = useState<SiteConfig>({
    page_key: 'roadmap',
    title: 'Projetos, Ideias e Testes em Evolução',
    subtitle:
      'Acompanhamento sanfonado de soluções completas, provas de conceito e próximos entregáveis. Clique sobre os Cards de Projeto na grade para expandir requisitos detalhados e links.',
  });

  // Global UI Error Banner Notice for API Actions
  const [apiErrorNotice, setApiErrorNotice] = useState<{
    message: string;
    action?: () => void;
  } | null>(null);

  // Dynamic Phases and Tasks State from Supabase Database
  const [phases, setPhases] = useState<Phase[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isLoaded, setIsLoaded] = useState<boolean>(false);

  // Accordion state
  const [openPhases, setOpenPhases] = useState<number[]>([]);
  const [expandedCards, setExpandedCards] = useState<number[]>([1, 6, 10]);

  // GitHub Config state
  const [githubConfig, setGithubConfig] = useState<GithubConfig>({
    owner: 'amaropedro',
    repo: 'painel-homologacao',
    branch: 'main',
    token: '',
  });

  // Helper functions for LocalStorage persistence
  const saveCustomTasksToLocalStorage = (allTasks: Task[]) => {
    try {
      const customTasks = allTasks.filter((t) => t.isCustom);
      localStorage.setItem('amaro_custom_tasks_v2', JSON.stringify(customTasks));
    } catch (e) {
      AppLogger.warn('UI:localStorage', 'Falha ao salvar tarefas no LocalStorage');
    }
  };

  const saveCustomPhasesToLocalStorage = (allPhases: Phase[]) => {
    try {
      localStorage.setItem('amaro_custom_phases_v2', JSON.stringify(allPhases));
    } catch (e) {
      AppLogger.warn('UI:localStorage', 'Falha ao salvar fases no LocalStorage');
    }
  };

  // Fetch all phases, projects & site_config directly from Supabase DB via API
  const fetchDatabaseData = useCallback(async () => {
    try {
      const [resPhases, resProjects, resConfig] = await Promise.all([
        fetch('/api/fases').then((r) => r.json()).catch((err) => {
          AppLogger.error('UI:fetchPhases', 'Erro na requisição /api/fases', err);
          return { phases: [] };
        }),
        fetch('/api/projects').then((r) => r.json()).catch((err) => {
          AppLogger.error('UI:fetchProjects', 'Erro na requisição /api/projects', err);
          return { projects: [] };
        }),
        fetch('/api/config?page=roadmap').then((r) => r.json()).catch((err) => {
          AppLogger.error('UI:fetchConfig', 'Erro na requisição /api/config', err);
          return { config: null };
        }),
      ]);

      if (resPhases && Array.isArray(resPhases.phases)) {
        setPhases(resPhases.phases);
        saveCustomPhasesToLocalStorage(resPhases.phases);
      }

      if (resProjects && Array.isArray(resProjects.projects)) {
        setTasks(resProjects.projects);
        saveCustomTasksToLocalStorage(resProjects.projects);
      }

      if (resConfig?.config) {
        setSiteConfig(resConfig.config);
      }
    } catch (e: any) {
      AppLogger.error('UI:fetchDatabaseData', 'Exceção geral na sincronização com Supabase', e);
    } finally {
      setIsLoaded(true);
    }
  }, []);

  // Update site config via API
  const handleUpdateSiteConfig = async (newConfig: SiteConfig): Promise<boolean> => {
    try {
      const res = await fetch('/api/config', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newConfig),
      });
      const data = await res.json();
      if (res.ok && data.config) {
        setSiteConfig(data.config);
        return true;
      }
      return false;
    } catch (err) {
      AppLogger.error('UI:handleUpdateSiteConfig', 'Erro ao atualizar configurações do site', err);
      return false;
    }
  };

  // Load database data once on mount. Refreshes happen through explicit actions.
  useEffect(() => {
    const savedGithub = localStorage.getItem('amaro_github_config_v1');
    if (savedGithub) {
      try {
        setGithubConfig((prev) => ({ ...prev, ...JSON.parse(savedGithub) }));
      } catch (e) {
        AppLogger.warn('UI:localStorage', 'Falha ao recuperar configurações salvas do GitHub');
      }
    }

    fetchDatabaseData();
  }, [fetchDatabaseData]);

  // Save github config
  const handleSaveGithubConfig = (config: GithubConfig) => {
    setGithubConfig(config);
    try {
      localStorage.setItem('amaro_github_config_v1', JSON.stringify(config));
      AppLogger.info('UI:GithubConfig', 'Configurações de integração com GitHub salvas');
    } catch (e) {
      AppLogger.error('UI:GithubConfig', 'Falha ao salvar no localStorage', e);
    }
  };

  // Toggle phase accordion
  const togglePhase = (phaseId: number) => {
    setOpenPhases((prev) =>
      prev.includes(phaseId) ? prev.filter((id) => id !== phaseId) : [...prev, phaseId]
    );
  };

  // Toggle card accordion
  const toggleCard = (taskId: number) => {
    setExpandedCards((prev) =>
      prev.includes(taskId) ? prev.filter((id) => id !== taskId) : [...prev, taskId]
    );
  };

  const expandAllCards = () => {
    setExpandedCards(tasks.map((t) => t.id));
    setOpenPhases(phases.map((p) => p.id));
  };

  const collapseAllCards = () => {
    setExpandedCards([]);
  };

  // Phase actions (Create & Delete)
  const handlePhaseCreated = (newPhase: Phase) => {
    setPhases((prev) => {
      const exists = prev.some((p) => p.id === newPhase.id);
      const updated = exists ? prev.map((p) => (p.id === newPhase.id ? newPhase : p)) : [...prev, newPhase];
      saveCustomPhasesToLocalStorage(updated);
      return updated;
    });
    setOpenPhases((prev) => [...prev, newPhase.id]);
    fetchDatabaseData();
  };

  const handleEditPhase = (phase: Phase) => {
    setPhaseToEdit(phase);
    setShowPhaseModal(true);
  };

  const deletePhase = async (phaseId: number) => {
    setApiErrorNotice(null);

    try {
      const res = await fetch(`/api/fases/${phaseId}`, { method: 'DELETE' });
      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        const message =
          typeof errData.error === 'string'
            ? errData.error
            : errData.error?.message || errData.message || 'Erro ao excluir fase';
        throw new Error(message);
      }

      setPhases((prev) => {
        const updated = prev.filter((p) => p.id !== phaseId);
        saveCustomPhasesToLocalStorage(updated);
        return updated;
      });
      setTasks((prev) => {
        const updated = prev.filter((t) => t.phase !== phaseId);
        saveCustomTasksToLocalStorage(updated);
        return updated;
      });
      fetchDatabaseData();
    } catch (err: any) {
      AppLogger.error('UI:deletePhase', `Falha ao excluir fase ID=${phaseId}`, err);
      setApiErrorNotice({
        message: `Não foi possível excluir a fase: ${err.message}`,
        action: () => deletePhase(phaseId),
      });
      fetchDatabaseData();
    }
  };

  // Task / Project actions (Toggle, Delete, Add)
  const toggleTask = async (taskId: number) => {
    const targetTask = tasks.find((t) => t.id === taskId);
    if (!targetTask) return;

    const newCompleted = !targetTask.completed;

    // Optimistic UI update
    setTasks((prev) => {
      const updated = prev.map((t) => (t.id === taskId ? { ...t, completed: newCompleted } : t));
      saveCustomTasksToLocalStorage(updated);
      return updated;
    });

    try {
      const res = await fetch(`/api/projects/${taskId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ completed: newCompleted }),
      });
      if (!res.ok) {
        throw new Error('Erro ao atualizar status');
      }
    } catch (err: any) {
      AppLogger.error('UI:toggleTask', `Falha ao alternar status do projeto ID=${taskId}`, err);
      setApiErrorNotice({
        message: 'Não foi possível salvar o status da tarefa no banco de dados.',
        action: () => toggleTask(taskId),
      });
      fetchDatabaseData();
    }
  };

  const updateTaskStatus = async (taskId: number, status: WorkStatus, statusReason: string) => {
    setTasks((prev) => {
      const updated = prev.map((task) =>
        task.id === taskId ? { ...task, status, statusReason } : task
      );
      saveCustomTasksToLocalStorage(updated);
      return updated;
    });

    try {
      const res = await fetch(`/api/projects/${taskId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status, statusReason }),
      });
      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.error?.message || errorData.error || 'Erro ao atualizar status');
      }
    } catch (err: any) {
      AppLogger.error('UI:updateTaskStatus', `Falha ao atualizar status do projeto ID=${taskId}`, err);
      setApiErrorNotice({
        message: `Não foi possível atualizar o status: ${err.message}`,
        action: () => updateTaskStatus(taskId, status, statusReason),
      });
      fetchDatabaseData();
    }
  };

  const deleteTask = async (taskId: number) => {
    setApiErrorNotice(null);
    // Optimistic UI update
    setTasks((prev) => {
      const updated = prev.filter((t) => t.id !== taskId);
      saveCustomTasksToLocalStorage(updated);
      return updated;
    });

    try {
      const res = await fetch(`/api/projects/${taskId}`, { method: 'DELETE' });
      if (!res.ok) {
        throw new Error('Erro ao excluir projeto');
      }
    } catch (err: any) {
      AppLogger.error('UI:deleteTask', `Falha ao excluir projeto ID=${taskId}`, err);
      setApiErrorNotice({
        message: 'Erro ao excluir projeto. Tente novamente.',
        action: () => deleteTask(taskId),
      });
      fetchDatabaseData();
    }
  };

  const handleAddNewTask = async (newForm: NewTaskForm) => {
    setApiErrorNotice(null);
    try {
      const response = await fetch('/api/projects', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          phase: Number(newForm.phase),
          title: newForm.title,
          description: newForm.description,
          requirementsInput: newForm.requirementsInput,
          badgesInput: newForm.badgesInput,
          status: newForm.status,
          statusReason: newForm.statusReason,
        }),
      });

      const data = await response.json();
      if ((response.ok || response.status === 201) && data.project) {
        const createdProject: Task = data.project;

        setTasks((prev) => {
          const exists = prev.some((t) => t.id === createdProject.id);
          const updated = exists
            ? prev.map((t) => (t.id === createdProject.id ? createdProject : t))
            : [createdProject, ...prev];

          saveCustomTasksToLocalStorage(updated);
          return updated;
        });

        const phaseNum = Number(createdProject.phase);
        setExpandedCards((prev) => (prev.includes(createdProject.id) ? prev : [...prev, createdProject.id]));
        setOpenPhases((prev) => (prev.includes(phaseNum) ? prev : [...prev, phaseNum]));

        // Clear active filters to ensure the newly created project is immediately visible
        setSearchQuery('');
        setSelectedStatusFilter('all');
        setSelectedPhaseFilter('all');

        // Switch to roadmap tab if not already active so user sees the new card
        if (activeTab !== 'roadmap' && activeTab !== 'checklist') {
          setActiveTab('roadmap');
        }

        setShowAddModal(false);
        AppLogger.info('UI:handleAddNewTask', `Projeto "${createdProject.title}" criado com sucesso`, { id: createdProject.id });
      } else {
        throw new Error(data.error || 'Erro ao cadastrar projeto');
      }
    } catch (err: any) {
      AppLogger.error('UI:handleAddNewTask', 'Falha ao incluir novo projeto', err);
      setApiErrorNotice({
        message: `Falha ao criar o projeto: ${err.message}`,
        action: () => handleAddNewTask(newForm),
      });
    }
  };

  const handleOpenAddTaskModal = (phaseId?: number) => {
    setSelectedPhaseForModal(phaseId);
    setShowAddModal(true);
  };

  const resetChecklist = () => {
    fetchDatabaseData();
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-between">
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        setShowGithubModal={setShowGithubModal}
        onOpenDiagnostics={() => setShowDiagnosticsModal(true)}
        onOpenAdmin={() => setShowAdminModal(true)}
      />

      {/* Global API Notice Banner */}
      {apiErrorNotice && (
        <div
          id="api-error-notice-banner"
          className="max-w-7xl mx-auto w-full px-4 lg:px-8 mt-4"
        >
          <div className="bg-red-950/80 border border-red-500/40 rounded-xl p-3 text-xs text-red-200 flex items-center justify-between gap-3 shadow-lg">
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-red-400 shrink-0" />
              <span>{apiErrorNotice.message}</span>
            </div>
            <div className="flex items-center gap-2">
              {apiErrorNotice.action && (
                <button
                  onClick={() => {
                    const act = apiErrorNotice.action;
                    setApiErrorNotice(null);
                    if (act) act();
                  }}
                  className="px-2.5 py-1 bg-red-500/20 hover:bg-red-500/30 text-red-300 rounded-lg border border-red-500/30 font-medium flex items-center gap-1 transition-colors"
                >
                  <RefreshCw className="w-3 h-3" />
                  Tentar Novamente
                </button>
              )}
              <button
                onClick={() => setApiErrorNotice(null)}
                className="text-slate-400 hover:text-white p-1"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Main Tab Rendering wrapped in ErrorBoundaries */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 lg:px-8 py-6">
        {activeTab === 'home' && (
          <ErrorBoundary
            scope="Tab:Home"
            fallbackTitle="Falha ao carregar a visualização Home"
          >
            <HomeTab
              phases={phases}
              tasks={tasks}
              setActiveTab={setActiveTab}
              setSelectedPhaseFilter={setSelectedPhaseFilter}
              onOpenAdmin={() => setShowAdminModal(true)}
              onOpenDiagnostics={() => setShowDiagnosticsModal(true)}
            />
          </ErrorBoundary>
        )}

        {(activeTab === 'roadmap' || activeTab === 'checklist') && (
          <ErrorBoundary
            scope="Tab:Roadmap"
            fallbackTitle="Falha ao carregar o Roadmap de Fases"
          >
            <RoadmapTab
              phases={phases}
              tasks={tasks}
              openPhases={openPhases}
              expandedCards={expandedCards}
              searchQuery={searchQuery}
              selectedPhaseFilter={selectedPhaseFilter}
              selectedStatusFilter={selectedStatusFilter}
              githubConfig={githubConfig}
              siteConfig={siteConfig}
              setSearchQuery={setSearchQuery}
              setSelectedPhaseFilter={setSelectedPhaseFilter}
              setSelectedStatusFilter={setSelectedStatusFilter}
              togglePhase={togglePhase}
              toggleCard={toggleCard}
              expandAllCards={expandAllCards}
              collapseAllCards={collapseAllCards}
              toggleTask={toggleTask}
              onStatusChange={updateTaskStatus}
              deleteTask={deleteTask}
              deletePhase={deletePhase}
              onEditPhase={handleEditPhase}
              resetChecklist={resetChecklist}
              setShowAddModal={setShowAddModal}
              onOpenAddTaskModal={handleOpenAddTaskModal}
              setShowPhaseModal={setShowPhaseModal}
              onOpenDiagnostics={() => setShowDiagnosticsModal(true)}
            />
          </ErrorBoundary>
        )}

        {activeTab === 'portfolio' && (
          <ErrorBoundary
            scope="Tab:Products"
            fallbackTitle="Falha no painel de Produtos e Tech Lab"
          >
            <ProductsTab skillsMatrix={SKILLS_MATRIX} />
          </ErrorBoundary>
        )}
      </main>

      {/* Modals */}
      <AdminModal
        isOpen={showAdminModal}
        onClose={() => setShowAdminModal(false)}
        siteConfig={siteConfig}
        onUpdateConfig={handleUpdateSiteConfig}
      />

      <AddTaskModal
        show={showAddModal}
        onClose={() => setShowAddModal(false)}
        onAdd={handleAddNewTask}
        phases={phases}
        initialPhaseId={selectedPhaseForModal}
      />

      <CreatePhaseModal
        show={showPhaseModal}
        phase={phaseToEdit}
        onClose={() => {
          setShowPhaseModal(false);
          setPhaseToEdit(null);
        }}
        onPhaseSaved={handlePhaseCreated}
      />

      <GithubModal
        show={showGithubModal}
        onClose={() => setShowGithubModal(false)}
        githubConfig={githubConfig}
        setGithubConfig={setGithubConfig}
        saveGithubConfig={handleSaveGithubConfig}
      />

      <DiagnosticsModal
        isOpen={showDiagnosticsModal}
        onClose={() => setShowDiagnosticsModal(false)}
      />

            {/* Footer */}
      <footer className="border-t border-slate-800/80 bg-slate-950 mt-16 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between text-[10px] sm:text-xs text-slate-400 gap-6 w-full">
          <div className="flex flex-col items-center md:items-start gap-2 text-center md:text-left">
            <span>
              © {new Date().getFullYear()} <strong className="text-slate-200">Amaro Pedro da Silva Junior</strong>
            </span>
            <span className="text-slate-500">
              Engenheiro de Software Full Stack & DevOps.
            </span>
          </div>
          <div className="flex flex-wrap justify-center items-center gap-x-6 gap-y-3">
            <a
              href="https://github.com/AmaroPSJunior"
              target="_blank"
              rel="noreferrer"
              className="hover:text-cyan-400 transition-colors"
            >
              GitHub
            </a>
            <a
              href="mailto:arcamos.j@gmail.com"
              className="hover:text-cyan-400 transition-colors"
            >
              arcamos.j@gmail.com
            </a>
            <a
              href="#hero"
              className="hover:text-cyan-400 transition-colors flex items-center gap-1"
            >
              Voltar ao topo ↑
            </a>
          </div>
        </div>
      </footer>

    </div>
  );
}
