'use client';

import React, { useState, useEffect } from 'react';
import { Header } from '@/components/Header';
import { HomeTab } from '@/components/HomeTab';
import { RoadmapTab } from '@/components/RoadmapTab';
import { ProductsTab } from '@/components/ProductsTab';
import { CicdTab } from '@/components/CicdTab';
import { AddTaskModal } from '@/components/AddTaskModal';
import { GithubModal } from '@/components/GithubModal';
import { DEFAULT_TASKS, PHASES, SKILLS_MATRIX } from '@/data/constants';
import { Task, NewTaskForm, GithubConfig } from '@/types';

export default function HomePage() {
  const [activeTab, setActiveTab] = useState<string>('roadmap');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedPhaseFilter, setSelectedPhaseFilter] = useState<string>('all');
  const [selectedStatusFilter, setSelectedStatusFilter] = useState<string>('all');
  const [showAddModal, setShowAddModal] = useState<boolean>(false);
  const [showGithubModal, setShowGithubModal] = useState<boolean>(false);

  // Accordion state
  const [openPhases, setOpenPhases] = useState<number[]>([1, 2, 3, 4]);
  const [expandedCards, setExpandedCards] = useState<number[]>([1, 6, 10]);

  // Tasks state
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isLoaded, setIsLoaded] = useState<boolean>(false);

  // GitHub Config state
  const [githubConfig, setGithubConfig] = useState<GithubConfig>({
    owner: 'amaropedro',
    repo: 'painel-homologacao',
    branch: 'main',
    token: '',
  });

  // Load state on mount
  useEffect(() => {
    try {
      const savedTasks = localStorage.getItem('amaro_dev_checklist_v2');
      if (savedTasks) {
        setTasks(JSON.parse(savedTasks));
      } else {
        setTasks(DEFAULT_TASKS);
      }

      const savedGithub = localStorage.getItem('amaro_github_config_v1');
      if (savedGithub) {
        setGithubConfig((prev) => ({ ...prev, ...JSON.parse(savedGithub) }));
      }
    } catch (e) {
      setTasks(DEFAULT_TASKS);
    } finally {
      setIsLoaded(true);
    }
  }, []);

  // Save tasks to localStorage when changed
  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem('amaro_dev_checklist_v2', JSON.stringify(tasks));
    }
  }, [tasks, isLoaded]);

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
    setOpenPhases(PHASES.map((p) => p.id));
  };

  const collapseAllCards = () => {
    setExpandedCards([]);
  };

  // Task actions
  const toggleTask = (taskId: number) => {
    setTasks((prev) =>
      prev.map((t) => (t.id === taskId ? { ...t, completed: !t.completed } : t))
    );
  };

  const deleteTask = (taskId: number) => {
    setTasks((prev) => prev.filter((t) => t.id !== taskId));
  };

  const handleAddNewTask = (newForm: NewTaskForm) => {
    const requirements = newForm.requirementsInput
      ? newForm.requirementsInput
          .split(';')
          .map((s) => s.trim())
          .filter(Boolean)
      : [];

    const badges = newForm.badgesInput
      ? newForm.badgesInput
          .split(',')
          .map((s) => s.trim())
          .filter(Boolean)
      : ['Novo Projeto'];

    const newTaskItem: Task = {
      id: Date.now(),
      phase: newForm.phase,
      title: newForm.title,
      description: newForm.description,
      requirements,
      badges,
      completed: false,
      isCustom: true,
    };

    setTasks((prev) => [newTaskItem, ...prev]);
    setExpandedCards((prev) => [...prev, newTaskItem.id]);
  };

  const resetChecklist = () => {
    if (window.confirm('Deseja restaurar a lista padrão de projetos e requisitos?')) {
      setTasks(DEFAULT_TASKS);
      setExpandedCards([1, 6, 10]);
      setOpenPhases([1, 2, 3, 4]);
      localStorage.removeItem('amaro_dev_checklist_v2');
    }
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
          phases={PHASES}
          tasks={tasks}
          setActiveTab={setActiveTab}
          setSelectedPhaseFilter={setSelectedPhaseFilter}
        />
      )}

      {(activeTab === 'roadmap' || activeTab === 'checklist') && (
        <RoadmapTab
          phases={PHASES}
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
          resetChecklist={resetChecklist}
          setShowAddModal={setShowAddModal}
          setShowGithubModal={setShowGithubModal}
        />
      )}

      {activeTab === 'cicd' && <CicdTab />}

      {activeTab === 'portfolio' && <ProductsTab skillsMatrix={SKILLS_MATRIX} />}

      {/* Modals */}
      <AddTaskModal
        show={showAddModal}
        onClose={() => setShowAddModal(false)}
        onAdd={handleAddNewTask}
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
