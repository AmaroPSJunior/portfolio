-- ==============================================================================
-- Migração do Banco de Dados Supabase (PostgreSQL)
-- Tabela: projects
-- Objetivo:
-- Remover os metadados do GitHub que foram adicionados diretamente
-- à tabela de projetos.
--
-- Os dados do repositório GitHub passam a ser obtidos diretamente
-- através da integração com a API do GitHub.
-- ==============================================================================

DROP INDEX IF EXISTS public.projects_github_id_unique_idx;

DROP INDEX IF EXISTS public.projects_github_full_name_idx;

ALTER TABLE public.projects
  DROP COLUMN IF EXISTS github_id,
  DROP COLUMN IF EXISTS github_name,
  DROP COLUMN IF EXISTS github_full_name,
  DROP COLUMN IF EXISTS github_private,
  DROP COLUMN IF EXISTS github_html_url,
  DROP COLUMN IF EXISTS github_description,
  DROP COLUMN IF EXISTS github_created_at,
  DROP COLUMN IF EXISTS github_updated_at,
  DROP COLUMN IF EXISTS github_pushed_at,
  DROP COLUMN IF EXISTS github_language;