-- Adiciona o identificador do repositório GitHub ao projeto.
-- Permite relacionar um projeto do Roadmap ao seu repositório GitHub.

ALTER TABLE public.projects
ADD COLUMN IF NOT EXISTS github_id BIGINT;

-- Um repositório GitHub só pode estar vinculado a um projeto.
CREATE UNIQUE INDEX IF NOT EXISTS projects_github_id_unique
ON public.projects (github_id)
WHERE github_id IS NOT NULL;

-- Otimiza consultas por github_id.
CREATE INDEX IF NOT EXISTS projects_github_id_idx
ON public.projects (github_id)
WHERE github_id IS NOT NULL;
