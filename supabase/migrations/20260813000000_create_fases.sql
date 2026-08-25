-- Migration: Criar tabelas Fases, Projetos e SiteConfig no Supabase
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. Tabela de Fases
CREATE TABLE IF NOT EXISTS public.fases (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  numeric_id SERIAL UNIQUE,
  title TEXT NOT NULL,
  subtitle TEXT DEFAULT '',
  emoji TEXT NOT NULL DEFAULT '🚀',
  "order" INT NOT NULL DEFAULT 1,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. Tabela de Projetos
CREATE TABLE IF NOT EXISTS public.projects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  numeric_id SERIAL UNIQUE,
  fase_id INT NOT NULL,
  title TEXT NOT NULL,
  description TEXT DEFAULT '',
  requirements TEXT[] DEFAULT '{}',
  badges TEXT[] DEFAULT '{}',
  completed BOOLEAN DEFAULT false,
  is_custom BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. Tabela de Configurações Dinâmicas do Site (Titulos e Subtitulos)
CREATE TABLE IF NOT EXISTS public.site_config (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  page_key TEXT UNIQUE NOT NULL,
  title TEXT NOT NULL,
  subtitle TEXT NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 4. Ativar Row Level Security (RLS) em todas as tabelas
ALTER TABLE public.fases ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.site_config ENABLE ROW LEVEL SECURITY;

-- 5. Políticas RLS
DROP POLICY IF EXISTS "Permitir leitura de fases" ON public.fases;
CREATE POLICY "Permitir leitura de fases" ON public.fases FOR SELECT USING (true);

DROP POLICY IF EXISTS "Permitir inserção de fases" ON public.fases;
CREATE POLICY "Permitir inserção de fases" ON public.fases FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "Permitir atualização de fases" ON public.fases;
CREATE POLICY "Permitir atualização de fases" ON public.fases FOR UPDATE USING (true);

DROP POLICY IF EXISTS "Permitir deleção de fases" ON public.fases;
CREATE POLICY "Permitir deleção de fases" ON public.fases FOR DELETE USING (true);

DROP POLICY IF EXISTS "Permitir leitura de projetos" ON public.projects;
CREATE POLICY "Permitir leitura de projetos" ON public.projects FOR SELECT USING (true);

DROP POLICY IF EXISTS "Permitir inserção de projetos" ON public.projects;
CREATE POLICY "Permitir inserção de projetos" ON public.projects FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "Permitir atualização de projetos" ON public.projects;
CREATE POLICY "Permitir atualização de projetos" ON public.projects FOR UPDATE USING (true);

DROP POLICY IF EXISTS "Permitir deleção de projetos" ON public.projects;
CREATE POLICY "Permitir deleção de projetos" ON public.projects FOR DELETE USING (true);

DROP POLICY IF EXISTS "Permitir leitura publica de site_config" ON public.site_config;
CREATE POLICY "Permitir leitura publica de site_config" ON public.site_config FOR SELECT USING (true);

DROP POLICY IF EXISTS "Permitir escrita em site_config" ON public.site_config;
CREATE POLICY "Permitir escrita em site_config" ON public.site_config FOR ALL USING (true);

-- Dados Iniciais
INSERT INTO public.site_config (page_key, title, subtitle)
VALUES (
  'roadmap',
  'Projetos, Ideias e Testes em Evolução',
  'Acompanhamento sanfonado de soluções completas, provas de conceito e próximos entregáveis. Clique sobre os Cards de Projeto na grade para expandir requisitos detalhados e links.'
) ON CONFLICT (page_key) DO NOTHING;
