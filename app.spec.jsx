// @vitest-environment jsdom
import React, { useState } from 'react';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { validatePhaseInput, calculateNextOrder } from './lib/validators';
import { RoadmapTab } from './components/RoadmapTab';
import { AddTaskModal } from './components/AddTaskModal';

const TEST_PHASES = [
  { id: 1, icon: '🚀', title: 'Fase 1 - Roadmap & Evolução do Portfólio', subtitle: 'Fase 1' },
  { id: 2, icon: '💼', title: 'Fase 2 - Projetos, Produtos e Serviços', subtitle: 'Fase 2' },
  { id: 3, icon: '🧪', title: 'Fase 3 - Tech Lab & Experimentos', subtitle: 'Fase 3' },
  { id: 4, icon: '🛡️', title: 'Fase 4 - QA & Testes de Habilidade', subtitle: 'Fase 4' },
];

const TEST_TASKS = [
  { id: 1, phase: 1, title: 'Setup Vercel', completed: true, badges: ['Next.js'], description: 'Setup', requirements: [] },
  { id: 2, phase: 1, title: 'App Router Next.js 15', completed: true, badges: ['React'], description: 'App router', requirements: [] },
  { id: 3, phase: 2, title: 'Homologação E-commerce', completed: true, badges: ['Java'], description: 'E-commerce', requirements: [] },
  { id: 4, phase: 2, title: 'Homologação ERP', completed: false, badges: ['C#'], description: 'ERP', requirements: [] },
];

export function calculateProgress(tasks) {
  if (!tasks || tasks.length === 0) return 0;
  const activeTasks = tasks.filter(t => t.status !== 'disabled');
  const completed = activeTasks.filter(t => t.completed || t.status === 'completed').length;
  return Math.round((completed / activeTasks.length) * 100);
}

export function calculatePhaseProgress(tasks, phaseId) {
  if (!tasks || tasks.length === 0) return 0;
  const phaseTasks = tasks.filter(t => t.phase === Number(phaseId) && t.status !== 'disabled');
  if (phaseTasks.length === 0) return 0;
  const completed = phaseTasks.filter(t => t.completed || t.status === 'completed').length;
  return Math.round((completed / phaseTasks.length) * 100);
}

describe('Portfólio & Roadmap Next.js - Suíte QA (Amaro Pedro da Silva Junior)', () => {
  let mockTasks;

  beforeEach(() => {
    mockTasks = [
      { id: 1, phase: 1, title: 'Setup Vercel', completed: true, badges: ['Next.js'] },
      { id: 2, phase: 1, title: 'App Router Next.js 15', completed: true, badges: ['React'] },
      { id: 3, phase: 2, title: 'Homologação E-commerce', completed: true, badges: ['Java'] },
      { id: 4, phase: 2, title: 'Homologação ERP', completed: false, badges: ['C#'] },
      { id: 5, phase: 3, title: 'PoC Web3', completed: true, badges: ['Web3'] },
      { id: 6, phase: 3, title: 'PoC Pix', completed: false, badges: ['Pix'] },
      { id: 7, phase: 4, title: 'Suíte Vitest', completed: true, badges: ['QA'] },
      { id: 8, phase: 4, title: 'Validação 4 Fases', completed: true, badges: ['DevOps'] }
    ];
  });

  it('deve calcular o progresso geral do portfólio (75%)', () => {
    expect(calculateProgress(mockTasks)).toBe(75);
  });

  it('deve calcular progresso das 4 fases individualmente', () => {
    expect(calculatePhaseProgress(mockTasks, 1)).toBe(100);
    expect(calculatePhaseProgress(mockTasks, 2)).toBe(50);
    expect(calculatePhaseProgress(mockTasks, 3)).toBe(50);
    expect(calculatePhaseProgress(mockTasks, 4)).toBe(100);
  });

  it('deve ignorar itens desativados e contar status concluído nos indicadores', () => {
    const tasks = [
      { id: 1, phase: 1, completed: false, status: 'completed' },
      { id: 2, phase: 1, completed: false, status: 'pending' },
      { id: 3, phase: 1, completed: true, status: 'disabled' },
    ];

    expect(calculateProgress(tasks)).toBe(50);
    expect(calculatePhaseProgress(tasks, 1)).toBe(50);
  });

  describe('Validação e Ordenação do Cadastro de Fases (Supabase Integration)', () => {
    it('deve rejeitar cadastro com título em branco', () => {
      const result = validatePhaseInput({ title: '   ', emoji: '🚀' });
      expect(result.valid).toBe(false);
      expect(result.errors).toContain('O título da Fase é obrigatório.');
    });

    it('deve rejeitar título com menos de 3 caracteres', () => {
      const result = validatePhaseInput({ title: 'Ab', emoji: '🚀' });
      expect(result.valid).toBe(false);
      expect(result.errors).toContain('O título deve conter pelo menos 3 caracteres.');
    });

    it('deve rejeitar cadastro sem emoji', () => {
      const result = validatePhaseInput({ title: 'Fase 5 - DevOps', emoji: '' });
      expect(result.valid).toBe(false);
      expect(result.errors).toContain('O emoji/ícone da Fase é obrigatório.');
    });

    it('deve aceitar dados válidos e sanitizar entradas', () => {
      const result = validatePhaseInput({
        title: '  Fase 5 - Microservices  ',
        subtitle: ' Arquitetura Cloud Native ',
        emoji: ' ☁️ ',
      });
      expect(result.valid).toBe(true);
      expect(result.sanitized.title).toBe('Fase 5 - Microservices');
      expect(result.sanitized.subtitle).toBe('Arquitetura Cloud Native');
      expect(result.sanitized.emoji).toBe('☁️');
    });

    it('deve calcular a próxima ordem (posicionando no final da lista)', () => {
      expect(calculateNextOrder([])).toBe(1);
      expect(calculateNextOrder([1, 2, 3, 4])).toBe(5);
      expect(calculateNextOrder([2, 5, 1, 3])).toBe(6);
    });
  });

  describe('Comportamento de Fases Contraídas e Botão Novo Projeto', () => {
    const dummyGithubConfig = {
      owner: 'AmaroPSJunior',
      repo: 'painel-homologacao',
      branch: 'main',
      token: '',
    };

    function RoadmapTabTestWrapper({ onOpenAddTaskModal = vi.fn() }) {
      const [openPhases, setOpenPhases] = useState([]);
      const [expandedCards, setExpandedCards] = useState([]);

      const togglePhase = (phaseId) => {
        setOpenPhases((prev) =>
          prev.includes(phaseId) ? prev.filter((id) => id !== phaseId) : [...prev, phaseId]
        );
      };

      const toggleCard = (taskId) => {
        setExpandedCards((prev) =>
          prev.includes(taskId) ? prev.filter((id) => id !== taskId) : [...prev, taskId]
        );
      };

      return (
        <RoadmapTab
          phases={TEST_PHASES}
          tasks={TEST_TASKS}
          openPhases={openPhases}
          expandedCards={expandedCards}
          searchQuery=""
          selectedPhaseFilter="all"
          selectedStatusFilter="all"
          githubConfig={dummyGithubConfig}
          setSearchQuery={() => {}}
          setSelectedPhaseFilter={() => {}}
          setSelectedStatusFilter={() => {}}
          togglePhase={togglePhase}
          toggleCard={toggleCard}
          expandAllCards={() => setOpenPhases(TEST_PHASES.map((p) => p.id))}
          collapseAllCards={() => setOpenPhases([])}
          toggleTask={() => {}}
          deleteTask={() => {}}
          resetChecklist={() => {}}
          setShowAddModal={() => {}}
          onOpenAddTaskModal={onOpenAddTaskModal}
          setShowGithubModal={() => {}}
          setShowPhaseModal={() => {}}
        />
      );
    }

    it('a) As fases iniciam contraídas por padrão', () => {
      render(<RoadmapTabTestWrapper />);

      // Títulos das fases visíveis
      expect(screen.getAllByText('Fase 1').length).toBeGreaterThan(0);
      expect(screen.getAllByText('Fase 2').length).toBeGreaterThan(0);

      // Nenhum botão de projeto aparece enquanto as fases estão fechadas.
      expect(screen.queryByText('Novo Projeto')).toBeNull();
    });

    it('b) Botão "Novo Projeto" específico da Fase NÃO está presente quando a fase está contraída', () => {
      render(<RoadmapTabTestWrapper />);

      // O botão contextual só aparece depois que a fase é expandida.
      expect(screen.queryByText('Novo Projeto')).toBeNull();
    });

    it('c) O clique na fase expande o conteúdo e exibe o botão "Novo Projeto" adicional dentro da fase', () => {
      render(<RoadmapTabTestWrapper />);

      // Clica para expandir a Fase 1
      const fase1Elements = screen.getAllByText('Fase 1');
      const fase1Header = fase1Elements[fase1Elements.length - 1];
      fireEvent.click(fase1Header);

      // Agora existe apenas o botão contextual da Fase 1.
      const novoProjetoBtns = screen.getAllByText('Novo Projeto');
      expect(novoProjetoBtns.length).toBe(1);
    });

    it('d) Clicar em "Novo Projeto" da fase passa o fase_id correspondente', () => {
      const handleOpenAddModal = vi.fn();
      render(<RoadmapTabTestWrapper onOpenAddTaskModal={handleOpenAddModal} />);

      // Expande a Fase 2
      const fase2Elements = screen.getAllByText('Fase 2');
      const fase2Header = fase2Elements[fase2Elements.length - 1];
      fireEvent.click(fase2Header);

      // Clica no botão contextual da Fase 2.
      const novoProjetoBtns = screen.getAllByText('Novo Projeto');
      fireEvent.click(novoProjetoBtns[0]);

      expect(handleOpenAddModal).toHaveBeenCalledWith(2);
    });

    it('e) O modal de criação de projeto preseleciona automaticamente a fase vinculada', () => {
      render(
        <AddTaskModal
          show={true}
          onClose={vi.fn()}
          onAdd={vi.fn()}
          phases={TEST_PHASES}
          initialPhaseId={3}
        />
      );

      const selectElement = screen.getAllByRole('combobox')[0];
      expect(selectElement.value).toBe('3');
    });
  });
});
