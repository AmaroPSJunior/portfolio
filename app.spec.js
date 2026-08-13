import { describe, it, expect, beforeEach } from 'vitest';
import { validatePillarInput, calculateNextOrder } from './lib/validators';

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
});
