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
import { SKILLS_MATRIX } from '@/data/constants';
import { Task, NewTaskForm, GithubConfig, Phase } from '@/types';

export default function HomePage() {
  const [activeTab, setActiveTab] = useState<string>('roadmap');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedPhaseFilter, setSelectedPhaseFilter] = useState<string>('all');
  const [selectedStatusFilter, setSelectedStatusFilter] = useState<string>('all');
  const [showAddModal, setShowAddModal] = useState<boolean>(false);
  const [showGithubModal, setShowGithubModal] = useState<boolean>(false);
  const [showPilarModal, setShowPilarModal] = useState<boolean>(false);
  const [selectedPillarForModal, setSelectedPillarForModal] = useState<number | undefined>(undefined);

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

  // Fetch all pillars & projects directly from Supabase DB via Next.js API Routes
  const fetchDatabaseData = useCallback(async () => {
    try {
      const [resPillars, resProjects] = await Promise.all([
        fetch('/api/pillars').then((r) => r.json()).catch(() => ({ pillars: [] })),
        fetch('/api/projects').then((r) => r.json()).catch(() => ({ projects: [] })),
      ]);

      if (resPillars && Array.isArray(resPillars.pillars)) {
        setPhases(resPillars.pillars);
      }
      if (resProjects && Array.isArray(resProjects.projects)) {
        setTasks(resProjects.projects);
      }
    } catch (e) {
      console.error('Erro ao buscar dados do Supabase:', e);
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
      } catch (e) {}
    }

    fetchDatabaseData();

    // Periodic auto-sync every 8 seconds to ensure bidirectional sync with DB
    const syncInterval = setInterval(() => {
      fetchDatabaseData();
    }, 8000);

    return () => clearInterval(syncInterval);
  }, [fetchDatabaseData]);

  // Save github config
  const handleSaveGithubConfig = (config: GithubConfig) => {
    setGithubConfig(config);
    localStorage.setItem('amaro_github_config_v1', JSON.stringify(config));
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
      if (exists) return prev;
      return [...prev, newPillar];
    });
    setOpenPhases((prev) => [...prev, newPillar.id]);
    fetchDatabaseData();
  };

  const deletePillar = async (phaseId: number) => {
    // Optimistic UI update
    setPhases((prev) => prev.filter((p) => p.id !== phaseId));
    setTasks((prev) => prev.filter((t) => t.phase !== phaseId));

    try {
      await fetch(`/api/pillars/${phaseId}`, { method: 'DELETE' });
      fetchDatabaseData();
    } catch (err) {
      console.error('Erro ao excluir pilar do Supabase:', err);
      fetchDatabaseData();
    }
  };

  // Task / Project actions (Toggle, Delete, Add)
  const toggleTask = async (taskId: number) => {
    const targetTask = tasks.find((t) => t.id === taskId);
    if (!targetTask) return;

    const newCompleted = !targetTask.completed;

    // Optimistic UI update
    setTasks((prev) =>
      prev.map((t) => (t.id === taskId ? { ...t, completed: newCompleted } : t))
    );

    try {
      await fetch(`/api/projects/${taskId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ completed: newCompleted }),
      });
    } catch (err) {
      console.error('Erro ao atualizar status do projeto no Supabase:', err);
      fetchDatabaseData();
    }
  };

  const deleteTask = async (taskId: number) => {
    // Optimistic UI update
    setTasks((prev) => prev.filter((t) => t.id !== taskId));

    try {
      await fetch(`/api/projects/${taskId}`, { method: 'DELETE' });
    } catch (err) {
      console.error('Erro ao excluir projeto do Supabase:', err);
      fetchDatabaseData();
    }
  };

  const handleAddNewTask = async (newForm: NewTaskForm) => {
    try {
      const response = await fetch('/api/projects', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          phase: newForm.phase,
          title: newForm.title,
          description: newForm.description,
          requirementsInput: newForm.requirementsInput,
          badgesInput: newForm.badgesInput,
        }),
      });

      const data = await response.json();
      if (response.ok && data.project) {
        setTasks((prev) => [data.project, ...prev]);
        setExpandedCards((prev) => [...prev, data.project.id]);
      } else {
        fetchDatabaseData();
      }
    } catch (err) {
      console.error('Erro ao cadastrar projeto no Supabase:', err);
      fetchDatabaseData();
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
      />

      {/* Main Tab Rendering */}
      {activeTab === 'home' && (
        <HomeTab
          phases={phases}
          tasks={tasks}
          setActiveTab={setActiveTab}
          setSelectedPhaseFilter={setSelectedPhaseFilter}
        />
      )}

      {(activeTab === 'roadmap' || activeTab === 'checklist') && (
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
      )}

      {activeTab === 'cicd' && <CicdTab />}

      {activeTab === 'portfolio' && <ProductsTab skillsMatrix={SKILLS_MATRIX} />}

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

      {/* Footer */}
      <footer className="max-w-7xl mx-auto px-4 lg:px-8 mt-12 py-6 border-t border-slate-800/80 flex flex-col md:flex-row items-center justify-between text-xs text-slate-500 gap-4 w-full">
        <div>
          <span>
            👨‍💻 Desenvolvido por <strong className="text-slate-300">Amaro Pedro da Silva Junior</strong>
          </span>
        </div>
        <div className="flex items-center gap-4">
          <span>🚀 Vercel & Next.js 15 App Router</span>
          <span>🐘 Supabase PostgreSQL</span>
          <span>⚡ Tailwind CSS</span>
        </div>
      </footer>
    </div>
  );
}
