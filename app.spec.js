import { describe, it, expect, beforeEach } from 'vitest';

// Funções utilitárias de validação do Painel de Homologação
export function calculateProgress(tasks) {
  if (!tasks || tasks.length === 0) return 0;
  const completed = tasks.filter(t => t.completed).length;
  return Math.round((completed / tasks.length) * 100);
}

export function filterTasks(tasks, phaseFilter, statusFilter, searchQuery) {
  return tasks.filter(task => {
    const matchesPhase = phaseFilter === 'all' || task.phase === Number(phaseFilter);
    const matchesStatus = statusFilter === 'all' || 
      (statusFilter === 'completed' && task.completed) || 
      (statusFilter === 'pending' && !task.completed);
    const matchesSearch = !searchQuery || 
      (task.title && task.title.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (task.description && task.description.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (task.badges && task.badges.some(b => b.toLowerCase().includes(searchQuery.toLowerCase())));
    
    return matchesPhase && matchesStatus && matchesSearch;
  });
}

export function toggleTaskStatus(tasks, taskId) {
  return tasks.map(task => {
    if (task.id === taskId) {
      return { ...task, completed: !task.completed };
    }
    return task;
  });
}

describe('Painel de Homologação - Testes Unitários (Amaro Pedro da Silva Junior)', () => {
  let mockTasks;

  beforeEach(() => {
    mockTasks = [
      { id: 1, phase: 1, title: 'Criar repositório público no GitHub', completed: true, badges: ['Git', 'GitHub'] },
      { id: 2, phase: 1, title: 'Implementar SPA Vue.js 3', completed: true, badges: ['Vue.js 3', 'Tailwind'] },
      { id: 3, phase: 2, title: 'Configurar Vitest para testes unitários', completed: false, badges: ['Vitest', 'Node.js'] },
      { id: 4, phase: 3, title: 'Criar workflow no GitHub Actions', completed: false, badges: ['CI/CD', 'YAML'] }
    ];
  });

  it('deve calcular corretamente a porcentagem de progresso (50%)', () => {
    const progress = calculateProgress(mockTasks);
    expect(progress).toBe(50);
  });

  it('deve retornar 0% para lista de tarefas vazia', () => {
    expect(calculateProgress([])).toBe(0);
  });

  it('deve alternar status da tarefa para concluída e recalcular o progresso para 75%', () => {
    const updated = toggleTaskStatus(mockTasks, 3);
    const task3 = updated.find(t => t.id === 3);
    expect(task3.completed).toBe(true);
    expect(calculateProgress(updated)).toBe(75);
  });

  it('deve filtrar tarefas corretamente por fase', () => {
    const phase1Tasks = filterTasks(mockTasks, '1', 'all', '');
    expect(phase1Tasks.length).toBe(2);
    expect(phase1Tasks.every(t => t.phase === 1)).toBe(true);
  });

  it('deve filtrar tarefas por busca textual nas badges', () => {
    const result = filterTasks(mockTasks, 'all', 'all', 'Vitest');
    expect(result.length).toBe(1);
    expect(result[0].title).toContain('Vitest');
  });
});
