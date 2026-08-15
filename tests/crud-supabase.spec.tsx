// @vitest-environment jsdom
import React from 'react';
import { describe, it, expect, beforeEach, afterEach, vi, Mock } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';

// Import Next.js API route handlers to test real integration logic
import { GET as getPhases, POST as postPhases } from '../app/api/fases/route';
import { DELETE as deletePhaseApi, PATCH as patchPhaseApi } from '../app/api/fases/[id]/route';
import { GET as getProjects, POST as postProjects } from '../app/api/projects/route';
import { DELETE as deleteProjectApi, PATCH as patchProjectApi } from '../app/api/projects/[id]/route';

// Import UI Components to test CRUD binding
import HomePage from '../app/page';
import { supabase } from '../lib/supabase';

// Mock Supabase client
vi.mock('../lib/supabase', () => {
  const mockFrom = vi.fn();
  return {
    supabase: {
      from: mockFrom,
    },
  };
});

describe('Suíte de Testes de Integração & CRUD Supabase / PostgreSQL (QA Specialist)', () => {
  // Mock dataset matching PostgreSQL Schema
  const initialDbPhases = [
    {
      id: 'a1111111-1111-1111-1111-111111111111',
      numeric_id: 1,
      title: 'Fase 1 - Roadmap & Evolução do Portfólio',
      subtitle: 'Setup inicial e layout',
      emoji: '🚀',
      order: 1,
      created_at: '2026-08-13T00:00:00Z',
    },
    {
      id: 'b2222222-2222-2222-2222-222222222222',
      numeric_id: 2,
      title: 'Fase 2 - Projetos, Produtos e Serviços',
      subtitle: 'Aplicações completas',
      emoji: '💼',
      order: 2,
      created_at: '2026-08-13T00:00:00Z',
    },
  ];

  const initialDbProjects = [
    {
      id: 'p1111111-1111-1111-1111-111111111111',
      numeric_id: 1,
      fase_id: 1,
      phase_id: 1,
      title: 'Painel de Sincronização com API REST do GitHub & Supabase',
      description: 'Integração via API REST',
      requirements: ['Layout responsivo', 'Conexão Supabase'],
      badges: ['GitHub REST API', 'Supabase'],
      completed: true,
      is_custom: false,
      created_at: '2026-08-13T00:00:00Z',
    },
    {
      id: 'p4444444-4444-4444-4444-444444444444',
      numeric_id: 4,
      fase_id: 1,
      phase_id: 1,
      title: 'Modais de Adição Dinâmica de Projetos e Configurações',
      description: 'Modais com validação em tempo real',
      requirements: ['Adição de novos projetos', 'Formulários responsivos'],
      badges: ['Next.js Modals', 'Forms'],
      completed: false,
      is_custom: true,
      created_at: '2026-08-13T00:00:00Z',
    },
  ];

  let currentDbPhases: Array<any>;
  let currentDbProjects: Array<any>;

  beforeEach(() => {
    vi.restoreAllMocks();
    currentDbPhases = [...initialDbPhases];
    currentDbProjects = [...initialDbProjects];

    const mockFrom = supabase.from as unknown as Mock;

    // Helper to simulate Supabase chaining behavior
    mockFrom.mockImplementation((tableName: string) => {
      if (tableName === 'fases' || tableName === 'pillars') {
        return {
          select: vi.fn().mockImplementation(() => ({
            order: vi.fn().mockImplementation((col: string, { ascending } = { ascending: true }) => {
              const sorted = [...currentDbPhases].sort((a, b) =>
                ascending ? a.order - b.order : b.order - a.order
              );
              return {
                limit: vi.fn().mockImplementation((limitNum: number) => ({
                  data: sorted.slice(0, limitNum),
                  error: null,
                })),
                data: sorted,
                error: null,
              };
            }),
            data: currentDbPhases,
            error: null,
          })),
          insert: vi.fn().mockImplementation((records: Array<any>) => {
            const newRecords = records.map((r: any, idx: number) => ({
              id: `gen-phase-uuid-${Date.now()}-${idx}`,
              numeric_id: currentDbPhases.length + 1,
              created_at: new Date().toISOString(),
              ...r,
            }));
            currentDbPhases.push(...newRecords);
            return {
              select: vi.fn().mockReturnValue({
                data: newRecords,
                error: null,
              }),
            };
          }),
          delete: vi.fn().mockImplementation(() => ({
            eq: vi.fn().mockImplementation((col: string, val: any) => {
              currentDbPhases = currentDbPhases.filter((p: any) => p[col] !== val);
              return { error: null };
            }),
          })),
          update: vi.fn().mockImplementation((updateData: any) => ({
            eq: vi.fn().mockImplementation((col: string, val: any) => {
              currentDbPhases = currentDbPhases.map((p: any) =>
                p[col] === val ? { ...p, ...updateData } : p
              );
              const updated = currentDbPhases.filter((p: any) => p[col] === val);
              return {
                select: vi.fn().mockReturnValue({ data: updated, error: null }),
                data: updated,
                error: null,
              };
            }),
          })),
        };
      }

      if (tableName === 'projects') {
        return {
          select: vi.fn().mockImplementation(() => ({
            order: vi.fn().mockImplementation((col: string, { ascending } = { ascending: true }) => {
              const sorted = [...currentDbProjects].sort((a, b) =>
                ascending ? a.numeric_id - b.numeric_id : b.numeric_id - a.numeric_id
              );
              return {
                data: sorted,
                error: null,
              };
            }),
            data: currentDbProjects,
            error: null,
          })),
          insert: vi.fn().mockImplementation((records: Array<any>) => {
            const newRecords = records.map((r: any, idx: number) => ({
              id: `gen-project-uuid-${Date.now()}-${idx}`,
              numeric_id: currentDbProjects.length + 10,
              created_at: new Date().toISOString(),
              ...r,
            }));
            currentDbProjects.push(...newRecords);
            return {
              select: vi.fn().mockReturnValue({
                data: newRecords,
                error: null,
              }),
            };
          }),
          delete: vi.fn().mockImplementation(() => ({
            eq: vi.fn().mockImplementation((col: string, val: any) => {
              currentDbProjects = currentDbProjects.filter((pr: any) => pr[col] !== val);
              return { error: null };
            }),
          })),
          update: vi.fn().mockImplementation((updateData: any) => ({
            eq: vi.fn().mockImplementation((col: string, val: any) => {
              currentDbProjects = currentDbProjects.map((pr: any) =>
                pr[col] === val ? { ...pr, ...updateData } : pr
              );
              const updated = currentDbProjects.filter((pr: any) => pr[col] === val);
              return {
                select: vi.fn().mockReturnValue({ data: updated, error: null }),
                data: updated,
                error: null,
              };
            }),
          })),
        };
      }

      return {};
    });
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('1. Validação de Leitura (READ / GET)', () => {
    it('deve buscar e formatar lista de fases a partir da tabela Supabase', async () => {
      const response = await getPhases();
      const body = await response.json();

      expect(supabase.from).toHaveBeenCalledWith('fases');
      expect(body.phases).toBeDefined();
      expect(body.phases.length).toBe(2);
      expect(body.phases[0]).toEqual({
        id: 1,
        title: 'Fase 1 - Roadmap & Evolução do Portfólio',
        subtitle: 'Setup inicial e layout',
        icon: '🚀',
        order: 1,
        uuid: 'a1111111-1111-1111-1111-111111111111',
        created_at: '2026-08-13T00:00:00Z',
      });
    });

    it('deve buscar e formatar lista de projetos a partir da tabela Supabase', async () => {
      const response = await getProjects();
      const body = await response.json();

      expect(supabase.from).toHaveBeenCalledWith('projects');
      expect(body.projects).toBeDefined();
      expect(body.projects.length).toBe(2);
      expect(body.projects[0]).toEqual({
        id: 1,
        phase: 1,
        title: 'Painel de Sincronização com API REST do GitHub & Supabase',
        description: 'Integração via API REST',
        requirements: ['Layout responsivo', 'Conexão Supabase'],
        badges: ['GitHub REST API', 'Supabase'],
        completed: true,
        isCustom: false,
        uuid: 'p1111111-1111-1111-1111-111111111111',
        created_at: '2026-08-13T00:00:00Z',
      });
    });
  });

  describe('2. Validação de Inclusão (INSERT / POST)', () => {
    it('deve incluir nova fase no Supabase respeitando ordem e colunas do contrato', async () => {
      const mockReq = {
        json: async () => ({
          title: 'Fase 5 - Arquitetura Cloud Native',
          subtitle: 'Microserviços & Kubernetes',
          emoji: '☁️',
        }),
      } as any;

      const response = await postPhases(mockReq);
      const body = await response.json();

      expect(response.status).toBe(201);
      expect(body.phase.title).toBe('Fase 5 - Arquitetura Cloud Native');
      expect(body.phase.icon).toBe('☁️');
      expect(body.phase.order).toBe(3); // Calculated order = max(2) + 1
    });

    it('deve rejeitar inclusão de fase sem título válido (validação de integridade)', async () => {
      const mockReq = {
        json: async () => ({
          title: '   ',
          emoji: '☁️',
        }),
      } as any;

      const response = await postPhases(mockReq);
      const body = await response.json();

      expect(response.status).toBe(400);
      expect(body.error).toBe('Dados inválidos');
    });

    it('deve incluir novo projeto vinculado à fase correta no Supabase', async () => {
      const mockReq = {
        json: async () => ({
          phase: 1,
          title: 'Novo Projeto de Testes E2E com Playwright',
          description: 'Automação de testes em CI/CD',
          requirementsInput: 'Suíte de testes; Relatórios HTML',
          badgesInput: 'Playwright, QA, CI/CD',
        }),
      } as any;

      const response = await postProjects(mockReq);
      const body = await response.json();

      expect(response.status).toBe(201);
      expect(body.project).toBeDefined();
      expect(body.project.phase).toBe(1);
      expect(body.project.title).toBe('Novo Projeto de Testes E2E com Playwright');
      expect(body.project.requirements).toEqual([
        'Suíte de testes',
        'Relatórios HTML',
      ]);
      expect(body.project.badges).toEqual(['Playwright', 'QA', 'CI/CD']);
      expect(body.project.isCustom).toBe(true);
    });

    it('deve rejeitar criação de projeto sem título ou sem fase informada (status 400)', async () => {
      const mockReq = {
        json: async () => ({
          title: '',
          phase: null,
        }),
      } as any;

      const response = await postProjects(mockReq);
      const body = await response.json();

      expect(response.status).toBe(400);
      expect(body.error).toBe('Título e Fase são obrigatórios');
    });

    it('deve utilizar fallback resiliente em caso de erro na inserção do Supabase ao criar projeto', async () => {
      const mockFrom = supabase.from as unknown as Mock;
      mockFrom.mockReturnValueOnce({
        select: vi.fn().mockReturnValue({
          order: vi.fn().mockReturnValue({
            limit: vi.fn().mockReturnValue({
              data: [{ numeric_id: 10 }],
              error: null,
            }),
          }),
        }),
        insert: vi.fn().mockReturnValue({
          select: vi.fn().mockReturnValue({
            data: null,
            error: { message: 'Supabase DB Connection Timeout' },
          }),
        }),
      });

      const mockReq = {
        json: async () => ({
          phase: 2,
          title: 'Projeto em Modo Resiliente',
          description: 'Descrição de teste offline',
          requirementsInput: 'Requisito 1',
          badgesInput: 'TypeScript',
        }),
      } as any;

      const response = await postProjects(mockReq);
      const body = await response.json();

      expect(response.status).toBe(201);
      expect(body.project).toBeDefined();
      expect(body.project.title).toBe('Projeto em Modo Resiliente');
      expect(body.project.phase).toBe(2);
    });
  });

  describe('3. Validação de Atualização (UPDATE / PATCH)', () => {
    it('deve atualizar o status de conclusão (completed) de um projeto por numeric_id', async () => {
      const mockReq = {
        json: async () => ({
          completed: true,
        }),
      } as any;

      const params = Promise.resolve({ id: '4' });
      const response = await patchProjectApi(mockReq, { params });
      const body = await response.json();

      expect(response.status).toBe(200);
      expect(body.success).toBe(true);

      const targetInDb = currentDbProjects.find((p: any) => p.numeric_id === 4);
      expect(targetInDb?.completed).toBe(true);
    });

    it('deve atualizar os dados de uma fase por numeric_id no Supabase', async () => {
      const mockReq = {
        json: async () => ({
          title: 'Fase 1 - Roadmap Atualizado',
          subtitle: 'Subtítulo alterado via PATCH',
        }),
      } as any;

      const params = Promise.resolve({ id: '1' });
      const response = await patchPhaseApi(mockReq, { params });
      const body = await response.json();

      expect(response.status).toBe(200);
      expect(body.success).toBe(true);

      const targetPhase = currentDbPhases.find((p: any) => p.numeric_id === 1);
      expect(targetPhase?.title).toBe('Fase 1 - Roadmap Atualizado');
      expect(targetPhase?.subtitle).toBe('Subtítulo alterado via PATCH');
    });
  });

  describe('4. Validação de Exclusão (DELETE)', () => {
    it('deve excluir um projeto específico (ex: numeric_id = 4) do Supabase', async () => {
      const mockReq = {} as any;
      const params = Promise.resolve({ id: '4' });

      const response = await deleteProjectApi(mockReq, { params });
      const body = await response.json();

      expect(response.status).toBe(200);
      expect(body.success).toBe(true);

      const existsInDb = currentDbProjects.some((p: any) => p.numeric_id === 4);
      expect(existsInDb).toBe(false);
    });

    it('deve excluir uma fase (numeric_id = 2) do Supabase', async () => {
      const mockReq = {} as any;
      const params = Promise.resolve({ id: '2' });

      const response = await deletePhaseApi(mockReq, { params });
      const body = await response.json();

      expect(response.status).toBe(200);
      expect(body.success).toBe(true);

      const existsInDb = currentDbPhases.some((p: any) => p.numeric_id === 2);
      expect(existsInDb).toBe(false);
    });
  });

  describe('5. Tratamento de Erros e Resiliência do Banco', () => {
    it('deve retornar lista vazia de fases sem quebrar em falha do Supabase', async () => {
      const mockFrom = supabase.from as unknown as Mock;
      mockFrom.mockReturnValueOnce({
        select: vi.fn().mockReturnValue({
          order: vi.fn().mockReturnValue({
            data: null,
            error: { message: 'DB Connection Refused' },
          }),
        }),
      });

      const response = await getPhases();
      const body = await response.json();

      expect(body.phases).toEqual([]);
    });

    it('deve retornar status 500 ao tentar excluir fase com erro no Supabase', async () => {
      const mockFrom = supabase.from as unknown as Mock;
      mockFrom.mockReturnValueOnce({
        delete: vi.fn().mockReturnValue({
          eq: vi.fn().mockResolvedValue({
            error: { message: 'Foreign Key Constraint Violation' },
          }),
        }),
      });

      const mockReq = {} as any;
      const params = Promise.resolve({ id: '1' });

      const response = await deletePhaseApi(mockReq, { params });
      const body = await response.json();

      expect(response.status).toBe(500);
      const errorMessage = typeof body.error === 'string' ? body.error : body.error?.message || body.error?.details?.message;
      expect(errorMessage).toBe('Foreign Key Constraint Violation');
    });
  });

  describe('6. Integração da Interface (UI Component Lifecycle & State Binding)', () => {
    it('deve carregar os dados das API Routes e renderizar fases/projetos na tela', async () => {
      // Mock global fetch para simular Next.js API Routes chamadas em app/page.tsx
      global.fetch = vi.fn().mockImplementation((url: string) => {
        if (url.includes('/api/fases') || url.includes('/api/pillars')) {
          return Promise.resolve({
            ok: true,
            json: async () => ({
              phases: [
                {
                  id: 1,
                  title: 'Fase 1 - Frontend & Backend',
                  subtitle: 'Testes de integração UI',
                  icon: '🚀',
                  order: 1,
                },
              ],
            }),
          });
        }
        if (url.includes('/api/projects')) {
          return Promise.resolve({
            ok: true,
            json: async () => ({
              projects: [
                {
                  id: 4,
                  phase: 1,
                  title: 'Projeto 4 - QA Integration',
                  description: 'Desc QA Integration',
                  requirements: ['Req 1'],
                  badges: ['QA'],
                  completed: false,
                  isCustom: true,
                },
              ],
            }),
          });
        }
        return Promise.resolve({ ok: true, json: async () => ({}) });
      });

      render(<HomePage />);

      await waitFor(() => {
        expect(screen.getByText('Fase 1 - Frontend & Backend')).toBeTruthy();
      });
    });
  });
});
