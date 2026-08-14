'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { Header } from '@/components/Header';
import { HomeTab } from '@/components/HomeTab';
import { RoadmapTab } from '@/components/RoadmapTab';
import { ProductsTab } from '@/components/ProductsTab';
import { CicdTab } from '@/components/CicdTab';
import { AddTaskModal } from '@/components/AddTaskModal';
import { GithubModal } from '@/components/GithubModal';
import { CreatePilarModal } from '@/components/CreatePilarModal';
import { DiagnosticsModal } from '@/components/DiagnosticsModal';
import { ErrorBoundary } from '@/components/ErrorBoundary';
import { SKILLS_MATRIX, DEFAULT_TASKS, PHASES } from '@/data/constants';
import { Task, NewTaskForm, GithubConfig, Phase } from '@/types';
import { AppLogger } from '@/lib/logger';
import { AlertTriangle, RefreshCw, X } from 'lucide-react';

export default function HomePage() {
  const [activeTab, setActiveTab] = useState<string>('roadmap');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedPhaseFilter, setSelectedPhaseFilter] = useState<string>('all');
  const [selectedStatusFilter, setSelectedStatusFilter] = useState<string>('all');
  const [showAddModal, setShowAddModal] = useState<boolean>(false);
  const [showGithubModal, setShowGithubModal] = useState<boolean>(false);
  const [showPilarModal, setShowPilarModal] = useState<boolean>(false);
  const [showDiagnosticsModal, setShowDiagnosticsModal] = useState<boolean>(false);
  const [selectedPillarForModal, setSelectedPillarForModal] = useState<number | undefined>(undefined);

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

  const saveCustomPillarsToLocalStorage = (allPhases: Phase[]) => {
    try {
      localStorage.setItem('amaro_custom_pillars_v2', JSON.stringify(allPhases));
    } catch (e) {
      AppLogger.warn('UI:localStorage', 'Falha ao salvar pilares no LocalStorage');
    }
  };

  // Fetch all pillars & projects directly from Supabase DB via Next.js API Routes
  const fetchDatabaseData = useCallback(async () => {
    try {
      const [resPillars, resProjects] = await Promise.all([
        fetch('/api/pillars').then((r) => r.json()).catch((err) => {
          AppLogger.error('UI:fetchPillars', 'Erro na requisição /api/pillars', err);
          return { pillars: [] };
        }),
        fetch('/api/projects').then((r) => r.json()).catch((err) => {
          AppLogger.error('UI:fetchProjects', 'Erro na requisição /api/projects', err);
          return { projects: [] };
        }),
      ]);

      if (resPillars?.tableMissing || resProjects?.tableMissing) {
        setApiErrorNotice({
          message: 'Aviso Supabase: A tabela "projects" ou "pillars" não foi encontrada no banco. Clique para abrir Diagnóstico e ver o SQL de criação.',
          action: () => setShowDiagnosticsModal(true),
        });
      }

      if (resPillars && Array.isArray(resPillars.pillars)) {
        setPhases(resPillars.pillars);
        saveCustomPillarsToLocalStorage(resPillars.pillars);
      }

      if (resProjects && Array.isArray(resProjects.projects)) {
        setTasks(resProjects.projects);
        saveCustomTasksToLocalStorage(resProjects.projects);
      }
    } catch (e: any) {
      AppLogger.error('UI:fetchDatabaseData', 'Exceção geral na sincronização com Supabase', e);
      setApiErrorNotice({
        message: 'Falha temporária ao sincronizar dados com o Supabase.',
        action: fetchDatabaseData,
      });
    } finally {
      setIsLoaded(true);
    }
  }, []);

  // Sync on mount & setup periodic refresh for bidirectional database updates
  useEffect(() => {
    const savedGithub = localStorage.getItem('amaro_github_config_v1');
    if (savedGithub) {
      try {
        setGithubConfig((prev) => ({ ...prev, ...JSON.parse(savedGithub) }));
      } catch (e) {
        AppLogger.warn('UI:localStorage', 'Falha ao recuperar configurações salvas do GitHub');
      }
    }

    // Load custom tasks from LocalStorage on mount
    try {
      const savedTasksRaw = localStorage.getItem('amaro_custom_tasks_v2');
      if (savedTasksRaw) {
        const customTasks: Task[] = JSON.parse(savedTasksRaw);
        if (customTasks.length > 0) {
          setTasks((prev) => {
            const existingIds = new Set(prev.map((t) => t.id));
            const newTasks = customTasks.filter((t) => !existingIds.has(t.id));
            return [...newTasks, ...prev];
          });
        }
      }
    } catch (e) {
      AppLogger.warn('UI:localStorage', 'Falha ao carregar tarefas salvas do LocalStorage');
    }

    // Load custom pillars from LocalStorage on mount
    try {
      const savedPillarsRaw = localStorage.getItem('amaro_custom_pillars_v2');
      if (savedPillarsRaw) {
        const customPillars: Phase[] = JSON.parse(savedPillarsRaw);
        if (customPillars.length > 0) {
          setPhases((prev) => {
            const existingIds = new Set(prev.map((p) => p.id));
            const newPillars = customPillars.filter((p) => !existingIds.has(p.id));
            return [...prev, ...newPillars];
          });
        }
      }
    } catch (e) {
      AppLogger.warn('UI:localStorage', 'Falha ao carregar pilares salvos do LocalStorage');
    }

    fetchDatabaseData();

    // Periodic auto-sync every 10 seconds to ensure bidirectional sync with DB
    const syncInterval = setInterval(() => {
      fetchDatabaseData();
    }, 10000);

    return () => clearInterval(syncInterval);
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

  // Pillar actions (Create & Delete)
  const handlePillarCreated = (newPillar: Phase) => {
    setPhases((prev) => {
      const exists = prev.some((p) => p.id === newPillar.id);
      const updated = exists ? prev.map((p) => (p.id === newPillar.id ? newPillar : p)) : [...prev, newPillar];
      saveCustomPillarsToLocalStorage(updated);
      return updated;
    });
    setOpenPhases((prev) => [...prev, newPillar.id]);
    fetchDatabaseData();
  };

  const deletePillar = async (phaseId: number) => {
    setApiErrorNotice(null);
    // Optimistic UI update
    setPhases((prev) => {
      const updated = prev.filter((p) => p.id !== phaseId);
      saveCustomPillarsToLocalStorage(updated);
      return updated;
    });
    setTasks((prev) => {
      const updated = prev.filter((t) => t.phase !== phaseId);
      saveCustomTasksToLocalStorage(updated);
      return updated;
    });

    try {
      const res = await fetch(`/api/pillars/${phaseId}`, { method: 'DELETE' });
      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData.error || 'Erro ao excluir pilar');
      }
      fetchDatabaseData();
    } catch (err: any) {
      AppLogger.error('UI:deletePillar', `Falha ao excluir pilar ID=${phaseId}`, err);
      setApiErrorNotice({
        message: `Não foi possível excluir o pilar: ${err.message}`,
        action: () => deletePillar(phaseId),
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
    setSelectedPillarForModal(phaseId);
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
            />
          </ErrorBoundary>
        )}

        {(activeTab === 'roadmap' || activeTab === 'checklist') && (
          <ErrorBoundary
            scope="Tab:Roadmap"
            fallbackTitle="Falha ao carregar o Roadmap de Pilares"
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
              setSearchQuery={setSearchQuery}
              setSelectedPhaseFilter={setSelectedPhaseFilter}
              setSelectedStatusFilter={setSelectedStatusFilter}
              togglePhase={togglePhase}
              toggleCard={toggleCard}
              expandAllCards={expandAllCards}
              collapseAllCards={collapseAllCards}
              toggleTask={toggleTask}
              deleteTask={deleteTask}
              deletePillar={deletePillar}
              resetChecklist={resetChecklist}
              setShowAddModal={setShowAddModal}
              onOpenAddTaskModal={handleOpenAddTaskModal}
              setShowGithubModal={setShowGithubModal}
              setShowPilarModal={setShowPilarModal}
            />
          </ErrorBoundary>
        )}

        {activeTab === 'cicd' && (
          <ErrorBoundary scope="Tab:CICD" fallbackTitle="Falha no painel de CI/CD">
            <CicdTab />
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
      <AddTaskModal
        show={showAddModal}
        onClose={() => setShowAddModal(false)}
        onAdd={handleAddNewTask}
        phases={phases}
        initialPhaseId={selectedPillarForModal}
      />

      <CreatePilarModal
        show={showPilarModal}
        onClose={() => setShowPilarModal(false)}
        onPillarCreated={handlePillarCreated}
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
      <footer className="max-w-7xl mx-auto px-4 lg:px-8 mt-12 py-6 border-t border-slate-800/80 flex flex-col md:flex-row items-center justify-between text-xs text-slate-500 gap-4 w-full">
        <div>
          <span>
            👨‍💻 Desenvolvido por{' '}
            <strong className="text-slate-300">Amaro Pedro da Silva Junior</strong>
          </span>
        </div>
        <div className="flex items-center gap-4">
          <button
            onClick={() => setShowDiagnosticsModal(true)}
            className="hover:text-emerald-400 transition-colors underline decoration-slate-700"
          >
            📊 Diagnóstico de Erros
          </button>
          <span>🚀 Vercel & Next.js 15 App Router</span>
          <span>🐘 Supabase PostgreSQL</span>
          <span>⚡ Tailwind CSS</span>
        </div>
      </footer>
    </div>
  );
}
