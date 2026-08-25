-- Adiciona status e justificativa a fases e projetos sem remover completed.
ALTER TABLE public.fases
  ADD COLUMN IF NOT EXISTS status TEXT NOT NULL DEFAULT 'pending',
  ADD COLUMN IF NOT EXISTS status_reason TEXT NOT NULL DEFAULT '';

ALTER TABLE public.projects
  ADD COLUMN IF NOT EXISTS status TEXT NOT NULL DEFAULT 'pending',
  ADD COLUMN IF NOT EXISTS status_reason TEXT NOT NULL DEFAULT '';

ALTER TABLE public.fases
  DROP CONSTRAINT IF EXISTS fases_status_check;

ALTER TABLE public.fases
  ADD CONSTRAINT fases_status_check
  CHECK (status IN ('pending', 'in_progress', 'paused', 'blocked', 'completed', 'disabled'));

ALTER TABLE public.projects
  DROP CONSTRAINT IF EXISTS projects_status_check;

ALTER TABLE public.projects
  ADD CONSTRAINT projects_status_check
  CHECK (status IN ('pending', 'in_progress', 'paused', 'blocked', 'completed', 'disabled'));
