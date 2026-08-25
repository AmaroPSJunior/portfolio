-- Migration: Create site_config table for dynamic page titles and subtitles
CREATE TABLE IF NOT EXISTS public.site_config (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  page_key TEXT UNIQUE NOT NULL,
  title TEXT NOT NULL,
  subtitle TEXT NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.site_config ENABLE ROW LEVEL SECURITY;

-- RLS Policies
DROP POLICY IF EXISTS "Permitir leitura publica de site_config" ON public.site_config;
CREATE POLICY "Permitir leitura publica de site_config" ON public.site_config FOR SELECT USING (true);

DROP POLICY IF EXISTS "Permitir escrita em site_config" ON public.site_config;
CREATE POLICY "Permitir escrita em site_config" ON public.site_config FOR ALL USING (true);

-- Insert default roadmap configuration if not existing
INSERT INTO public.site_config (page_key, title, subtitle)
VALUES (
  'roadmap',
  'Projetos, Ideias e Testes em Evolução',
  'Acompanhamento sanfonado de soluções completas, provas de conceito e próximos entregáveis. Clique sobre os Cards de Projeto na grade para expandir requisitos detalhados e links.'
)
ON CONFLICT (page_key) DO NOTHING;
