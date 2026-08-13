import { describe, it, expect, beforeEach } from 'vitest';

// Funções utilitárias de validação e estado do Portfólio & Roadmap de Evolução
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

export function filterTasks(tasks, phaseFilter, statusFilter, searchQuery) {
  return tasks.filter(task => {
    const matchesPhase = phaseFilter === 'all' || task.phase === Number(phaseFilter);
    const matchesStatus = statusFilter === 'all' || 
      (statusFilter === 'completed' && task.completed) || 
      (statusFilter === 'pending' && !task.completed);
    
    const query = searchQuery ? searchQuery.trim().toLowerCase() : '';
    const matchesSearch = !query || 
      (task.title && task.title.toLowerCase().includes(query)) ||
      (task.description && task.description.toLowerCase().includes(query)) ||
      (task.badges && task.badges.some(b => b.toLowerCase().includes(query)));
    
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

export function addNewTaskToList(tasks, newTaskData) {
  const badges = newTaskData.badgesInput
    ? newTaskData.badgesInput.split(',').map(b => b.trim()).filter(Boolean)
    : ['Custom'];

  const createdTask = {
    id: Date.now(),
    phase: Number(newTaskData.phase),
    title: newTaskData.title.trim(),
    description: newTaskData.description.trim(),
    badges: badges,
    completed: false,
    isCustom: true
  };

  return [...tasks, createdTask];
}

describe('Portfólio & Roadmap de Evolução - Suíte QA (Amaro Pedro da Silva Junior)', () => {
  let mockTasks;

  beforeEach(() => {
    mockTasks = [
      // Fase 1 - Roadmap
      { id: 1, phase: 1, title: 'Setup inicial e repositório no GitHub Pages', completed: true, badges: ['Git', 'Pages'] },
      { id: 2, phase: 1, title: 'Encapsulamento modular em RoadmapEvolucaoView', completed: true, badges: ['Vue.js 3', 'Refactor'] },
      
      // Fase 2 - Produtos
      { id: 3, phase: 2, title: 'Homologação E-commerce Enterprise B2B/B2C', completed: true, badges: ['Java', 'Spring'] },
      { id: 4, phase: 2, title: 'Homologação ERP Industrial Telemetria', completed: false, badges: ['C#', '.NET'] },

      // Fase 3 - Tech Lab
      { id: 5, phase: 3, title: 'PoC Web3 Smart Contracts', completed: true, badges: ['Web3', 'Ethers'] },
      { id: 6, phase: 3, title: 'PoC Pix Payment Gateway', completed: false, badges: ['Pix', 'Node.js'] },

      // Fase 4 - QA & Skills
      { id: 7, phase: 4, title: 'Configuração do Vitest e CI no GitHub Actions', completed: true, badges: ['Vitest', 'QA'] },
      { id: 8, phase: 4, title: 'Validação de testes automatizados dos 4 pilares', completed: true, badges: ['DevOps', 'Testing'] }
    ];
  });

  describe('1. Cálculos de Progresso por Pilar/Fase', () => {
    it('deve calcular o progresso geral do portfólio corretamente (75%)', () => {
      const totalProgress = calculateProgress(mockTasks);
      expect(totalProgress).toBe(75); // 6 de 8 = 75%
    });

    it('deve calcular 100% de progresso para a Fase 1 (Roadmap & Evolução)', () => {
      const phase1Progress = calculatePhaseProgress(mockTasks, 1);
      expect(phase1Progress).toBe(100);
    });

    it('deve calcular 50% de progresso para a Fase 2 (Produtos & Serviços)', () => {
      const phase2Progress = calculatePhaseProgress(mockTasks, 2);
      expect(phase2Progress).toBe(50);
    });

    it('deve calcular 50% de progresso para a Fase 3 (Tech Lab & Experimentos)', () => {
      const phase3Progress = calculatePhaseProgress(mockTasks, 3);
      expect(phase3Progress).toBe(50);
    });

    it('deve calcular 100% de progresso para a Fase 4 (QA & Skills Lab)', () => {
      const phase4Progress = calculatePhaseProgress(mockTasks, 4);
      expect(phase4Progress).toBe(100);
    });

    it('deve retornar 0% para fase sem tarefas ou lista vazia', () => {
      expect(calculatePhaseProgress([], 1)).toBe(0);
      expect(calculatePhaseProgress(mockTasks, 99)).toBe(0);
    });
  });

  describe('2. Filtragem de Tarefas pelos 4 Pilares e Status', () => {
    it('deve filtrar tarefas do Pilar 2 (Projetos, Produtos e Serviços)', () => {
      const produtosTasks = filterTasks(mockTasks, '2', 'all', '');
      expect(produtosTasks.length).toBe(2);
      expect(produtosTasks.every(t => t.phase === 2)).toBe(true);
    });

    it('deve filtrar apenas tarefas pendentes do Pilar 3 (Tech Lab)', () => {
      const pendingLab = filterTasks(mockTasks, '3', 'pending', '');
      expect(pendingLab.length).toBe(1);
      expect(pendingLab[0].title).toContain('Pix Payment Gateway');
    });

    it('deve filtrar tarefas por busca textual de tecnologias nas badges (ex: Vitest)', () => {
      const qaResults = filterTasks(mockTasks, 'all', 'all', 'Vitest');
      expect(qaResults.length).toBe(1);
      expect(qaResults[0].badges).toContain('Vitest');
    });

    it('deve filtrar tarefas da Fase 4 (QA & Skills Lab) concluídas', () => {
      const completedQA = filterTasks(mockTasks, '4', 'completed', '');
      expect(completedQA.length).toBe(2);
      expect(completedQA.every(t => t.phase === 4 && t.completed)).toBe(true);
    });
  });

  describe('3. Persistência e Alteração de Estado', () => {
    it('deve alternar status da tarefa e recalcular progresso do pilar reativamente', () => {
      const updated = toggleTaskStatus(mockTasks, 4); // Marca ERP Industrial como concluído
      const phase2Progress = calculatePhaseProgress(updated, 2);
      expect(phase2Progress).toBe(100);
    });

    it('deve adicionar uma nova tarefa customizada ao pilar correto com badges', () => {
      const newTask = {
        phase: '3',
        title: 'Experimento com GraphQL e Apollo Client',
        description: 'Testar queries reativas e cache no client',
        badgesInput: 'GraphQL, Apollo, React'
      };

      const updatedList = addNewTaskToList(mockTasks, newTask);
      expect(updatedList.length).toBe(9);

      const added = updatedList.find(t => t.title.includes('GraphQL'));
      expect(added).toBeDefined();
      expect(added.phase).toBe(3);
      expect(added.badges).toEqual(['GraphQL', 'Apollo', 'React']);
      expect(added.completed).toBe(false);
    });
  });
});
