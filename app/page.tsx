'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { Header } from '@/components/Header';
import { HomeTab } from '@/components/HomeTab';
import { RoadmapTab } from '@/components/RoadmapTab';
import { ProductsTab } from '@/components/ProductsTab';
import { AddTaskModal } from '@/components/AddTaskModal';
import { EditTaskModal, EditTaskForm } from '@/components/EditTaskModal';
import { GithubModal } from '@/components/GithubModal';
import { CreatePhaseModal } from '@/components/CreatePhaseModal';
import { DiagnosticsModal } from '@/components/DiagnosticsModal';
import { AdminModal } from '@/components/AdminModal';
import { ErrorBoundary } from '@/components/ErrorBoundary';
import { SKILLS_MATRIX } from '@/data/constants';
import { Task, NewTaskForm, GithubConfig, Phase, SiteConfig, WorkStatus } from '@/types';
import { AppLogger } from '@/lib/logger';
import { AlertTriangle, ArrowUp, RefreshCw, X } from 'lucide-react';

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
  const [showScrollTop, setShowScrollTop] = useState<boolean>(false);
  const [selectedPhaseForModal, setSelectedPhaseForModal] = useState<number | undefined>(undefined);
  const [phaseToEdit, setPhaseToEdit] = useState<Phase | null>(null);
  const [showEditTaskModal, setShowEditTaskModal] = useState<boolean>(false);
  const [taskToEdit, setTaskToEdit] = useState<Task | null>(null);

  useEffect(() => {
    const handleScroll = () => setShowScrollTop(window.scrollY > 300);

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

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
    owner: 'AmaroPSJunior',
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
      const [resPhases, resProjects, resGithub, resConfig] = await Promise.all([
        fetch('/api/fases').then((r) => r.json()).catch((err) => {
          AppLogger.error('UI:fetchPhases', 'Erro na requisição /api/fases', err);
          return { phases: [] };
        }),
        fetch('/api/projects').then((r) => r.json()).catch((err) => {
          AppLogger.error('UI:fetchProjects', 'Erro na requisição /api/projects', err);
          return { projects: [] };
        }),
        fetch(`/api/github?owner=${encodeURIComponent(githubConfig.owner ?? 'AmaroPSJunior')}`),
        fetch('/api/config?page=roadmap').then((r) => r.json()).catch((err) => {
          AppLogger.error('UI:fetchConfig', 'Erro na requisição /api/config', err);
          return { config: null };
        }),
      ]);

      if (resPhases && Array.isArray(resPhases.phases)) {
        setPhases(resPhases.phases);
        saveCustomPhasesToLocalStorage(resPhases.phases);
      }

            if (
        resGithub &&
        Array.isArray(resGithub.projects) &&
        resProjects &&
        Array.isArray(resProjects.projects)
      ) {
        const databaseProjects = resProjects.projects as Task[];

        const githubProjects = resGithub.projects.map((repository: any) => {
          const databaseProject = databaseProjects.find(
            (project) =>
              project.title.trim().toLowerCase() ===
              repository.name.trim().toLowerCase()
          );

          return {
            ...(databaseProject || {}),
            id: databaseProject?.id ?? repository.id,
            phase: databaseProject?.phase ?? 1,
            title: databaseProject?.title || repository.name,
            description:
              databaseProject?.description ||
              repository.description ||
              '',
            requirements: databaseProject?.requirements ?? [],
            badges: databaseProject?.badges ?? [],
            completed: databaseProject?.completed ?? false,
            status:
              databaseProject?.status ||
              (databaseProject?.completed
                ? 'completed'
                : 'pending'),
            statusReason:
              databaseProject?.statusReason || '',
            isCustom: databaseProject?.isCustom ?? false,
            uuid: databaseProject?.uuid,
            created_at:
              databaseProject?.created_at ||
              repository.created_at,
            githubId: repository.id,
            githubName: repository.name,
            githubFullName: repository.full_name,
            githubPrivate: repository.private,
            githubHtmlUrl: repository.html_url,
            githubDescription: repository.description,
            githubCreatedAt: repository.created_at,
            githubUpdatedAt: repository.updated_at,
            githubPushedAt: repository.pushed_at,
            githubLanguage: repository.language,
          };
        });

        setTasks(githubProjects);
        saveCustomTasksToLocalStorage(githubProjects);
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

  const handleOpenEditTask = (task: Task) => {
    setTaskToEdit(task);
    setShowEditTaskModal(true);
  };

  const handleEditTask = async (
    taskId: number,
    form: EditTaskForm
  ): Promise<void> => {
    setApiErrorNotice(null);

    const requirements = form.requirementsInput
      .split(';')
      .map((item) => item.trim())
      .filter(Boolean);

    const badges = form.badgesInput
      .split(',')
      .map((item) => item.trim())
      .filter(Boolean);

    const currentTask = tasks.find((task) => task.id === taskId);

    if (!currentTask) {
      throw new Error('Projeto não encontrado.');
    }

    const optimisticTask: Task = {
      ...currentTask,
      phase: Number(form.phase),
      title: form.title.trim(),
      description: form.description.trim(),
      requirements,
      badges,
      status: form.status,
      statusReason: form.statusReason.trim(),
    };

    // Atualização otimista da interface
    setTasks((prev) => {
      const updated = prev.map((task) =>
        task.id === taskId ? optimisticTask : task
      );

      saveCustomTasksToLocalStorage(updated);
      return updated;
    });

    try {
      const response = await fetch(`/api/projects/${taskId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          phase: Number(form.phase),
          title: form.title.trim(),
          description: form.description.trim(),
          requirements,
          badges,
          status: form.status,
          statusReason: form.statusReason.trim(),
        }),
      });

      const data = await response.json().catch(() => ({}));

      if (!response.ok || !data.project) {
        throw new Error(
          data.error?.message ||
            data.error ||
            'Não foi possível atualizar o projeto.'
        );
      }

      const updatedProject = data.project;

      setTasks((prev) => {
        const updated = prev.map((task) =>
          task.id === taskId
            ? {
                ...task,
                ...optimisticTask,
                ...updatedProject,
                id: task.id,
                phase: Number(
                  updatedProject.phase_id ??
                    updatedProject.phase ??
                    form.phase
                ),
                statusReason:
                  updatedProject.status_reason ??
                  form.statusReason.trim(),
              }
            : task
        );

        saveCustomTasksToLocalStorage(updated);
        return updated;
      });

      // Garante sincronização com o banco
      await fetchDatabaseData();

      // Garante que o projeto permaneça visível
      setSearchQuery('');
      setSelectedStatusFilter('all');
      setSelectedPhaseFilter('all');

      const phaseId = Number(
        updatedProject.phase_id ??
          updatedProject.phase ??
          form.phase
      );

      setOpenPhases((prev) =>
        prev.includes(phaseId) ? prev : [...prev, phaseId]
      );

      setShowEditTaskModal(false);
      setTaskToEdit(null);

      AppLogger.info(
        'UI:handleEditTask',
        `Projeto "${optimisticTask.title}" atualizado com sucesso`,
        { id: taskId }
      );
    } catch (err: any) {
      AppLogger.error(
        'UI:handleEditTask',
        `Falha ao editar projeto ID=${taskId}`,
        err
      );

      setApiErrorNotice({
        message: `Não foi possível atualizar o projeto: ${
          err.message || 'Erro desconhecido'
        }`,
        action: () => handleEditTask(taskId, form),
      });

      // Reverte o optimistic update para o estado real do banco
      await fetchDatabaseData();

      throw err;
    }
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
              onEditTask={handleOpenEditTask}
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

      <EditTaskModal
        show={showEditTaskModal}
        task={taskToEdit}
        phases={phases}
        onClose={() => {
          setShowEditTaskModal(false);
          setTaskToEdit(null);
        }}
        onSave={handleEditTask}
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
              Desenvolvedor Full Stack.
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
          </div>
        </div>
      </footer>

      {showScrollTop && (
        <button
          type="button"
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          className="fixed bottom-6 right-6 z-40 w-12 h-12 rounded-full bg-cyan-500 text-slate-950 shadow-lg shadow-cyan-500/25 hover:bg-cyan-400 hover:-translate-y-1 transition-all flex items-center justify-center"
          aria-label="Voltar ao topo"
          title="Voltar ao topo"
        >
          <ArrowUp className="w-5 h-5" />
        </button>
      )}

    </div>
  );
}
