-- ==============================================================================
-- Migração do Banco de Dados Supabase (PostgreSQL)
-- Tabela: projects
-- Objetivo:
--   Adicionar os metadados do repositório GitHub associado ao projeto.
--
-- Campos baseados na resposta da GitHub REST API:
--   id
--   name
--   full_name
--   private
--   html_url
--   description
--   created_at
--   updated_at
--   pushed_at
--   language
--
-- Autor: Amaro Pedro da Silva Junior
-- Data: 2026-08-24
-- ==============================================================================

ALTER TABLE public.projects

  -- ID numérico oficial do repositório no GitHub.
  -- Exemplo: 123456789
  ADD COLUMN IF NOT EXISTS github_id BIGINT,

  -- Nome curto do repositório.
  -- Exemplo: portfolio
  ADD COLUMN IF NOT EXISTS github_name TEXT,

  -- Nome completo do repositório.
  -- Exemplo: AmaroPSJunior/portfolio
  ADD COLUMN IF NOT EXISTS github_full_name TEXT,

  -- Indica se o repositório é privado.
  ADD COLUMN IF NOT EXISTS github_private BOOLEAN,

  -- URL pública do repositório.
  -- Exemplo: https://github.com/AmaroPSJunior/portfolio
  ADD COLUMN IF NOT EXISTS github_html_url TEXT,

  -- Descrição cadastrada no GitHub.
  ADD COLUMN IF NOT EXISTS github_description TEXT,

  -- Data de criação do repositório no GitHub.
  ADD COLUMN IF NOT EXISTS github_created_at TIMESTAMP WITH TIME ZONE,

  -- Data da última atualização de configuração/metadados do repositório.
  ADD COLUMN IF NOT EXISTS github_updated_at TIMESTAMP WITH TIME ZONE,

  -- Data do último push realizado no repositório.
  ADD COLUMN IF NOT EXISTS github_pushed_at TIMESTAMP WITH TIME ZONE,

  -- Linguagem principal identificada pelo GitHub.
  -- Exemplo: JavaScript, TypeScript, CSS, Kotlin
  ADD COLUMN IF NOT EXISTS github_language TEXT;


-- ==============================================================================
-- Índice para acelerar consultas pelo ID oficial do GitHub.
--
-- O índice é parcial porque os projetos existentes podem ainda não possuir
-- um repositório GitHub associado.
-- ==============================================================================

CREATE UNIQUE INDEX IF NOT EXISTS projects_github_id_unique_idx
  ON public.projects (github_id)
  WHERE github_id IS NOT NULL;


-- ==============================================================================
-- Índice adicional para consultas pelo nome completo do repositório.
-- Exemplo: AmaroPSJunior/portfolio
-- ==============================================================================

CREATE INDEX IF NOT EXISTS projects_github_full_name_idx
  ON public.projects (github_full_name);


-- ==============================================================================
-- Comentários de documentação das colunas
-- ==============================================================================

COMMENT ON COLUMN public.projects.github_id IS
  'ID numérico oficial do repositório no GitHub.';

COMMENT ON COLUMN public.projects.github_name IS
  'Nome curto do repositório no GitHub.';

COMMENT ON COLUMN public.projects.github_full_name IS
  'Nome completo do repositório no formato owner/repository.';

COMMENT ON COLUMN public.projects.github_private IS
  'Indica se o repositório GitHub é privado.';

COMMENT ON COLUMN public.projects.github_html_url IS
  'URL pública do repositório no GitHub.';

COMMENT ON COLUMN public.projects.github_description IS
  'Descrição cadastrada no GitHub para o repositório.';

COMMENT ON COLUMN public.projects.github_created_at IS
  'Data de criação do repositório no GitHub.';

COMMENT ON COLUMN public.projects.github_updated_at IS
  'Data da última atualização de metadados do repositório no GitHub.';

COMMENT ON COLUMN public.projects.github_pushed_at IS
  'Data do último push realizado no repositório no GitHub.';

COMMENT ON COLUMN public.projects.github_language IS
  'Linguagem principal identificada pelo GitHub.';