CREATE TABLE IF NOT EXISTS public.project_github_repositories (
  project_id UUID PRIMARY KEY REFERENCES public.projects(id) ON DELETE CASCADE,
  github_id BIGINT NOT NULL UNIQUE,
  github_full_name TEXT NOT NULL UNIQUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS project_github_repositories_github_id_idx
  ON public.project_github_repositories(github_id);

CREATE INDEX IF NOT EXISTS project_github_repositories_full_name_idx
  ON public.project_github_repositories(github_full_name);