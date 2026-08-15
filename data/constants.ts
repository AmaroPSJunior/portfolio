import { Task, Phase, Skill } from '@/types';

export const DEFAULT_TASKS: Task[] = [];

export const PHASES: Phase[] = [];

export const SKILLS_MATRIX: Skill[] = [
  { name: 'Java & Spring Boot', level: 95, icon: '☕', experience: 'Microserviços, Spring Data JPA, Security, REST APIs' },
  { name: 'Node.js & TypeScript', level: 90, icon: '🟢', experience: 'Express, NestJS, Next.js, APIs assíncronas' },
  { name: 'React 19 & Next.js 15', level: 92, icon: '⚛️', experience: 'App Router, Server Components, Hooks, Tailwind, SPA/SSR' },
  { name: 'C# & .NET 8', level: 85, icon: '⚡', experience: 'Sistemas Industriais, Entity Framework, LINQ' },
  { name: 'SQL & Supabase', level: 90, icon: '🐘', experience: 'PostgreSQL, Supabase Auth/Database, SQL Server, MySQL' },
  { name: 'DevOps & CI/CD', level: 88, icon: '🛠️', experience: 'GitHub Actions, Vercel, Docker, Linux, Automação' }
];

export const WORKFLOW_YAML = `name: CI/CD Pipeline - Vercel & QA Validation

on:
  push:
    branches: [ main, master ]
  pull_request:
    branches: [ main, master ]

jobs:
  test-and-build:
    name: 🧪 Testes Unitários & Validação
    runs-on: ubuntu-latest
    steps:
      - name: 📥 Checkout do Repositório
        uses: actions/checkout@v4

      - name: 🥟 Configurar Node.js / Bun
        uses: oven-sh/setup-bun@v2
        with:
          bun-version: latest

      - name: 📦 Instalar Dependências
        run: bun install --frozen-lockfile || bun install

      - name: 🔍 Checagem de Tipos TypeScript
        run: bun run lint

      - name: 🧪 Executar Testes Unitários
        run: bun test || npm test

      - name: 🏗️ Testar Build do Next.js
        run: bun run build`;

export const TEST_SPEC_CODE = `import { describe, it, expect, beforeEach } from 'vitest';

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
});`;

export const VITEST_CONFIG_CODE = `import { defineConfig } from 'vite';

export default defineConfig({
  test: {
    globals: true,
    environment: 'node',
    include: ['app.spec.js', 'tests/**/*.spec.js'],
  },
});`;
