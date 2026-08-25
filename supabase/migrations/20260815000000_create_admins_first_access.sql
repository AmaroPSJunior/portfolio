-- ====================================================================
-- MIGRATION: Tabela de Administradores e Fluxo de Primeiro Acesso
-- ====================================================================

CREATE TABLE IF NOT EXISTS public.admins (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email TEXT UNIQUE NOT NULL,
    password_hash TEXT,
    first_access BOOLEAN NOT NULL DEFAULT true,
    first_access_token TEXT UNIQUE,
    first_access_expires_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Índices de alta performance
CREATE INDEX IF NOT EXISTS idx_admins_first_access_token ON public.admins(first_access_token);
CREATE INDEX IF NOT EXISTS idx_admins_email ON public.admins(email);

-- Habilitar Row Level Security (RLS)
ALTER TABLE public.admins ENABLE ROW LEVEL SECURITY;

-- Políticas de RLS para gerenciamento via API / Server Actions
DROP POLICY IF EXISTS "Permitir leitura publica de admins para validacao" ON public.admins;
CREATE POLICY "Permitir leitura publica de admins para validacao" ON public.admins
    FOR SELECT USING (true);

DROP POLICY IF EXISTS "Permitir criacao e atualizacao de admins via API" ON public.admins;
CREATE POLICY "Permitir criacao e atualizacao de admins via API" ON public.admins
    FOR ALL USING (true) WITH CHECK (true);
