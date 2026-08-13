// @vitest-environment jsdom
import React, { useState } from 'react';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { validatePillarInput, calculateNextOrder } from './lib/validators';
import { RoadmapTab } from './components/RoadmapTab';
import { AddTaskModal } from './components/AddTaskModal';
import { PHASES, DEFAULT_TASKS } from './data/constants';

export function calculateProgress(tasks) {
  if (!tasks || tasks.length === 0) return 0;
  const completed = tasks.filter(t => t.completed).length;
  return Math.round((completed / tasks.length) * 100);
}

export function calculatePhaseProgress(tasks, phaseId) {
  if (!tasks || tasks.length === 0) return 0;
  const phaseTasks = tasks.filter(t => t.phase === Number(phaseId));
  if (phaseTasks.length === 0) return 0;
  const completed = phaseTasks.filter(t => t.completed).length;
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
      { id: 8, phase: 4, title: 'Validação 4 Pilares', completed: true, badges: ['DevOps'] }
    ];
  });

  it('deve calcular o progresso geral do portfólio (75%)', () => {
    expect(calculateProgress(mockTasks)).toBe(75);
  });

  it('deve calcular progresso dos 4 pilares individualmente', () => {
    expect(calculatePhaseProgress(mockTasks, 1)).toBe(100);
    expect(calculatePhaseProgress(mockTasks, 2)).toBe(50);
    expect(calculatePhaseProgress(mockTasks, 3)).toBe(50);
    expect(calculatePhaseProgress(mockTasks, 4)).toBe(100);
  });

  describe('Validação e Ordenação do Cadastro de Pilares (Supabase Integration)', () => {
    it('deve rejeitar cadastro com título em branco', () => {
      const result = validatePillarInput({ title: '   ', emoji: '🚀' });
      expect(result.valid).toBe(false);
      expect(result.errors).toContain('O título do Pilar é obrigatório.');
    });

    it('deve rejeitar título com menos de 3 caracteres', () => {
      const result = validatePillarInput({ title: 'Ab', emoji: '🚀' });
      expect(result.valid).toBe(false);
      expect(result.errors).toContain('O título deve conter pelo menos 3 caracteres.');
    });

    it('deve rejeitar cadastro sem emoji', () => {
      const result = validatePillarInput({ title: 'Fase 5 - DevOps', emoji: '' });
      expect(result.valid).toBe(false);
      expect(result.errors).toContain('O emoji/ícone do Pilar é obrigatório.');
    });

    it('deve aceitar dados válidos e sanitizar entradas', () => {
      const result = validatePillarInput({
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

  describe('Comportamento de Pilares Contraídos e Botão Novo Projeto', () => {
    const dummyGithubConfig = {
      owner: 'amaropedro',
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
          phases={PHASES}
          tasks={DEFAULT_TASKS}
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
          expandAllCards={() => setOpenPhases(PHASES.map((p) => p.id))}
          collapseAllCards={() => setOpenPhases([])}
          toggleTask={() => {}}
          deleteTask={() => {}}
          resetChecklist={() => {}}
          setShowAddModal={() => {}}
          onOpenAddTaskModal={onOpenAddTaskModal}
          setShowGithubModal={() => {}}
          setShowPilarModal={() => {}}
        />
      );
    }

    it('a) Os pilares iniciam contraídos por padrão', () => {
      render(<RoadmapTabTestWrapper />);

      // Títulos dos pilares visíveis
      expect(screen.getAllByText('Pilar 1').length).toBeGreaterThan(0);
      expect(screen.getAllByText('Pilar 2').length).toBeGreaterThan(0);

      // Nenhum botão "Novo Projeto" deve estar presente no DOM
      const novoProjetoButtons = screen.queryAllByText('Novo Projeto');
      expect(novoProjetoButtons.length).toBe(0);
    });

    it('b) O botão "Novo Projeto" NÃO está presente no DOM quando os pilares estão contraídos', () => {
      render(<RoadmapTabTestWrapper />);

      const novoProjetoBtn = screen.queryByText('Novo Projeto');
      expect(novoProjetoBtn).toBeNull();
    });

    it('c) O clique no pilar expande o conteúdo e exibe o botão "Novo Projeto"', () => {
      render(<RoadmapTabTestWrapper />);

      // Clica para expandir o Pilar 1 (último 'Pilar 1' é o accordion header)
      const pilar1Elements = screen.getAllByText('Pilar 1');
      const pilar1Header = pilar1Elements[pilar1Elements.length - 1];
      fireEvent.click(pilar1Header);

      // O botão "Novo Projeto" agora deve ser renderizado no DOM dentro do pilar expandido
      const novoProjetoBtn = screen.getByText('Novo Projeto');
      expect(novoProjetoBtn).toBeTruthy();
    });

    it('d) Clicar em "Novo Projeto" passa o pilar_id correspondente', () => {
      const handleOpenAddModal = vi.fn();
      render(<RoadmapTabTestWrapper onOpenAddTaskModal={handleOpenAddModal} />);

      // Expande o Pilar 2 (último 'Pilar 2' é o accordion header)
      const pilar2Elements = screen.getAllByText('Pilar 2');
      const pilar2Header = pilar2Elements[pilar2Elements.length - 1];
      fireEvent.click(pilar2Header);

      // Clica no botão "Novo Projeto" do Pilar 2
      const novoProjetoBtn = screen.getByText('Novo Projeto');
      fireEvent.click(novoProjetoBtn);

      expect(handleOpenAddModal).toHaveBeenCalledWith(2);
    });

    it('e) O modal de criação de projeto preseleciona automaticamente o pilar vinculado', () => {
      render(
        <AddTaskModal
          show={true}
          onClose={vi.fn()}
          onAdd={vi.fn()}
          phases={PHASES}
          initialPhaseId={3}
        />
      );

      const selectElement = screen.getByRole('combobox');
      expect(selectElement.value).toBe('3');
    });
  });
});

