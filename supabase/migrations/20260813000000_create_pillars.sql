-- ==============================================================================
-- Migração do Banco de Dados Supabase (PostgreSQL)
-- Tabela: pillars (Pilares e Fases do Roadmap)
-- Autor: Amaro Pedro da Silva Junior
-- Data: 2026-08-13
-- ==============================================================================

-- 1. Criar extensão para geração de UUID (caso ainda não esteja habilitada)
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. Criar a tabela 'pillars'
CREATE TABLE IF NOT EXISTS public.pillars (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  numeric_id SERIAL UNIQUE,
  title TEXT NOT NULL,
  subtitle TEXT DEFAULT '',
  emoji TEXT NOT NULL DEFAULT '🚀',
  "order" INT NOT NULL DEFAULT 1,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. Habilitar Row Level Security (RLS)
ALTER TABLE public.pillars ENABLE ROW LEVEL SECURITY;

-- 4. Política RLS: Permitir leitura pública para todos os usuários
DROP POLICY IF EXISTS "Permitir leitura pública de pilares" ON public.pillars;
CREATE POLICY "Permitir leitura pública de pilares"
  ON public.pillars FOR SELECT
  USING (true);

-- 5. Política RLS: Permitir inserção de novos pilares
DROP POLICY IF EXISTS "Permitir inserção de pilares" ON public.pillars;
CREATE POLICY "Permitir inserção de pilares"
  ON public.pillars FOR INSERT
  WITH CHECK (true);

-- 6. Política RLS: Permitir atualização de pilares
DROP POLICY IF EXISTS "Permitir atualização de pilares" ON public.pillars;
CREATE POLICY "Permitir atualização de pilares"
  ON public.pillars FOR UPDATE
  USING (true);

-- 7. Inserir Pilares Iniciais Padrão (Fases 1 a 4) caso a tabela esteja vazia
INSERT INTO public.pillars (numeric_id, title, subtitle, emoji, "order")
SELECT 1, 'Fase 1 - Roadmap & Evolução do Portfólio', 'Setup inicial, layout Dark Mode (Slate/Cyan), LocalStorage e deploy na Vercel.', '🚀', 1
WHERE NOT EXISTS (SELECT 1 FROM public.pillars WHERE numeric_id = 1);

INSERT INTO public.pillars (numeric_id, title, subtitle, emoji, "order")
SELECT 2, 'Fase 2 - Projetos, Produtos e Serviços', 'Aplicações completas: E-commerce Enterprise, ERP Industrial e Sistemas MVC Corporativos.', '💼', 2
WHERE NOT EXISTS (SELECT 1 FROM public.pillars WHERE numeric_id = 2);

INSERT INTO public.pillars (numeric_id, title, subtitle, emoji, "order")
SELECT 3, 'Fase 3 - Tech Lab & Experimentos', 'Provas de Conceito (PoCs), Web3, gateways de pagamento e testes de novas tecnologias.', '🧪', 3
WHERE NOT EXISTS (SELECT 1 FROM public.pillars WHERE numeric_id = 3);

INSERT INTO public.pillars (numeric_id, title, subtitle, emoji, "order")
SELECT 4, 'Fase 4 - QA & Testes de Habilidade (Skills Lab)', 'Suítes de testes unitários automatizados, scripts de CI/CD, DevOps e análises de qualidade.', '🛡️', 4
WHERE NOT EXISTS (SELECT 1 FROM public.pillars WHERE numeric_id = 4);
