// @vitest-environment jsdom
import React from 'react';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { GET as getConfig, POST as postConfig } from '../app/api/config/route';
import { supabase } from '../lib/supabase';

vi.mock('../lib/supabase', () => {
  const mockFrom = vi.fn();
  const mockAuth = {
    getSession: vi.fn().mockResolvedValue({ data: { session: null } }),
    signInWithPassword: vi.fn(),
    signOut: vi.fn(),
    resetPasswordForEmail: vi.fn(),
    updateUser: vi.fn(),
  };

  return {
    supabase: {
      from: mockFrom,
      auth: mockAuth,
    },
  };
});

describe('Suíte de Testes - Configurações Dinâmicas e Gestão Admin (site_config)', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('deve retornar configuração padrão quando tabela site_config for consultada', async () => {
    const mockSelect = vi.fn().mockReturnThis();
    const mockEq = vi.fn().mockReturnThis();
    const mockMaybeSingle = vi.fn().mockResolvedValue({
      data: {
        page_key: 'roadmap',
        title: 'Projetos, Ideias & Requisitos de Evolução',
        subtitle: 'Subtítulo do banco de dados',
      },
      error: null,
    });

    (supabase.from as any).mockReturnValue({
      select: mockSelect,
      eq: mockEq,
      maybeSingle: mockMaybeSingle,
    });

    const req = new Request('http://localhost:3000/api/config?page=roadmap');
    const res = await getConfig(req as any);
    const json = await res.json();

    expect(res.status).toBe(200);
    expect(json.config.title).toBe('Projetos, Ideias & Requisitos de Evolução');
    expect(json.config.subtitle).toBe('Subtítulo do banco de dados');
  });

  it('deve atualizar o título e subtítulo da página via POST em site_config', async () => {
    const mockUpsert = vi.fn().mockReturnThis();
    const mockSelect = vi.fn().mockReturnThis();
    const mockSingle = vi.fn().mockResolvedValue({
      data: {
        page_key: 'roadmap',
        title: 'Novo Título do Roadmap Admin',
        subtitle: 'Nova Descrição Alterada no Painel Admin',
      },
      error: null,
    });

    (supabase.from as any).mockReturnValue({
      upsert: mockUpsert,
      select: mockSelect,
      single: mockSingle,
    });

    const req = new Request('http://localhost:3000/api/config', {
      method: 'POST',
      body: JSON.stringify({
        page_key: 'roadmap',
        title: 'Novo Título do Roadmap Admin',
        subtitle: 'Nova Descrição Alterada no Painel Admin',
      }),
    });

    const res = await postConfig(req as any);
    const json = await res.json();

    expect(res.status).toBe(200);
    expect(json.success).toBe(true);
    expect(json.config.title).toBe('Novo Título do Roadmap Admin');
    expect(json.config.subtitle).toBe('Nova Descrição Alterada no Painel Admin');
  });

  it('deve retornar erro 400 se tentar salvar título em branco', async () => {
    const req = new Request('http://localhost:3000/api/config', {
      method: 'POST',
      body: JSON.stringify({
        page_key: 'roadmap',
        title: '',
        subtitle: 'Apenas subtítulo',
      }),
    });

    const res = await postConfig(req as any);
    const json = await res.json();

    expect(res.status).toBe(400);
    expect(json.error.message).toBe('O título principal é obrigatório');
  });
});
