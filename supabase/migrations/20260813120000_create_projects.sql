-- ==============================================================================
-- Migração do Banco de Dados Supabase (PostgreSQL)
-- Tabela: projects (Projetos e Requisitos vinculados aos Pilares)
-- Autor: Amaro Pedro da Silva Junior
-- Data: 2026-08-13
-- ==============================================================================

-- 1. Criar a tabela 'projects'
CREATE TABLE IF NOT EXISTS public.projects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  numeric_id SERIAL UNIQUE,
  phase_id INT NOT NULL,
  title TEXT NOT NULL,
  description TEXT DEFAULT '',
  requirements TEXT[] DEFAULT '{}',
  badges TEXT[] DEFAULT '{}',
  completed BOOLEAN DEFAULT false,
  is_custom BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. Habilitar Row Level Security (RLS)
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;

-- 3. Políticas RLS para 'projects'
DROP POLICY IF EXISTS "Permitir leitura pública de projetos" ON public.projects;
CREATE POLICY "Permitir leitura pública de projetos"
  ON public.projects FOR SELECT
  USING (true);

DROP POLICY IF EXISTS "Permitir inserção de projetos" ON public.projects;
CREATE POLICY "Permitir inserção de projetos"
  ON public.projects FOR INSERT
  WITH CHECK (true);

DROP POLICY IF EXISTS "Permitir atualização de projetos" ON public.projects;
CREATE POLICY "Permitir atualização de projetos"
  ON public.projects FOR UPDATE
  USING (true);

DROP POLICY IF EXISTS "Permitir deleção de projetos" ON public.projects;
CREATE POLICY "Permitir deleção de projetos"
  ON public.projects FOR DELETE
  USING (true);

-- 4. Adicionar política de deleção para 'pillars' se ainda não existir
DROP POLICY IF EXISTS "Permitir deleção de pilares" ON public.pillars;
CREATE POLICY "Permitir deleção de pilares"
  ON public.pillars FOR DELETE
  USING (true);

-- 5. Se a tabela 'projects' estiver vazia, popular com os dados iniciais padrão
INSERT INTO public.projects (numeric_id, phase_id, title, description, requirements, badges, completed, is_custom)
SELECT 1, 1, 'Painel de Sincronização com API REST do GitHub & Supabase', 'Integração via API REST do GitHub e Supabase PostgreSQL para consulta ao vivo de metadados do repositório (estrelas, forks, issues e branch principal) e gerador de comandos Git.', ARRAY['Layout responsivo Dark Slate/Cyan em Next.js', 'Conexão de Banco de Dados Supabase (PostgreSQL)', 'Integração em tempo real com a API REST do GitHub', 'Design System personalizado com CSS Grid e Tailwind'], ARRAY['GitHub REST API', 'Supabase', 'PostgreSQL', 'DevTools'], true, false
WHERE NOT EXISTS (SELECT 1 FROM public.projects WHERE numeric_id = 1);

INSERT INTO public.projects (numeric_id, phase_id, title, description, requirements, badges, completed, is_custom)
SELECT 2, 1, 'Checklist Interativo com Estado Reativo em Tempo Real', 'Sanfona expansível para acompanhamento visual de progresso, ordenação por fases, contagem percentual dinâmica e filtros rápidos por status.', ARRAY['Filtragem bidirecional por texto, fase e status', 'Cálculo dinâmico de progresso relativo', 'Armazenamento persistente de estado do usuário'], ARRAY['React State', 'Local Storage', 'Tailwind CSS'], true, false
WHERE NOT EXISTS (SELECT 1 FROM public.projects WHERE numeric_id = 2);

INSERT INTO public.projects (numeric_id, phase_id, title, description, requirements, badges, completed, is_custom)
SELECT 3, 1, 'Documentação e Histórico com Git & GitHub Flow', 'Estruturação de commits semânticos (Conventional Commits), rastreamento de builds no Vercel/GitHub Actions e arquivo README detalhado.', ARRAY['Commits padronizados com feat, fix e docs', 'Branch protection e PRs com checklists de homologação', 'Instruções claras para clonar e rodar localmente'], ARRAY['Git', 'Conventional Commits', 'Vercel'], true, false
WHERE NOT EXISTS (SELECT 1 FROM public.projects WHERE numeric_id = 3);

INSERT INTO public.projects (numeric_id, phase_id, title, description, requirements, badges, completed, is_custom)
SELECT 4, 1, 'Modais de Adição Dinâmica de Projetos e Configurações', 'Modais com validação em tempo real para inclusão de novos requisitos/projetos na lista e parametrização do repositório GitHub sem alterar o código.', ARRAY['Adição de novos projetos com badges customizadas', 'Configuração dinâmica de Owner, Repo e Branch', 'Formulários responsivos com prevenção de submissão inválida'], ARRAY['Next.js Modals', 'Forms', 'User Experience'], true, false
WHERE NOT EXISTS (SELECT 1 FROM public.projects WHERE numeric_id = 4);

INSERT INTO public.projects (numeric_id, phase_id, title, description, requirements, badges, completed, is_custom)
SELECT 5, 1, 'Deploy Contínuo e Publicação na Vercel', 'Pipeline de deploy automático integrado com a branch principal do GitHub, garantindo atualização em tempo real do ambiente de homologação.', ARRAY['Build automatizado sem erros de lint ou TypeScript', 'Deploy instantâneo na Vercel com HTTPS habilitado', 'Configuração das variáveis de ambiente de produção'], ARRAY['Vercel', 'CI/CD', 'Production Ready'], true, false
WHERE NOT EXISTS (SELECT 1 FROM public.projects WHERE numeric_id = 5);

INSERT INTO public.projects (numeric_id, phase_id, title, description, requirements, badges, completed, is_custom)
SELECT 6, 2, 'E-commerce Enterprise Full Stack', 'Plataforma completa de comércio eletrônico com catálogo de produtos, carrinho reativo, cálculo de frete via API externa e checkout transparente.', ARRAY['Next.js App Router com Server Components para SSR/SEO', 'Autenticação de usuários (NextAuth.js / Supabase Auth)', 'Integração com gateway de pagamento (Stripe / Mercado Pago)', 'Banco de dados PostgreSQL para gestão de pedidos e estoque'], ARRAY['Next.js', 'PostgreSQL', 'Stripe API', 'E-commerce'], true, false
WHERE NOT EXISTS (SELECT 1 FROM public.projects WHERE numeric_id = 6);

INSERT INTO public.projects (numeric_id, phase_id, title, description, requirements, badges, completed, is_custom)
SELECT 7, 2, 'ERP Industrial - Módulo de PCP & Manutenção', 'Sistema de Controle da Produção e Gestão de Ordem de Serviço (OS) com gráficos interativos e exportação de relatórios.', ARRAY['Dashboard analítico com Recharts/Chart.js', 'Controle de ordens de serviço e status de máquinas', 'Exportação de relatórios em PDF e Excel', 'Perfis de acesso granulares (RBAC)'], ARRAY['TypeScript', 'Recharts', 'ERP', 'Node.js'], true, false
WHERE NOT EXISTS (SELECT 1 FROM public.projects WHERE numeric_id = 7);

INSERT INTO public.projects (numeric_id, phase_id, title, description, requirements, badges, completed, is_custom)
SELECT 8, 2, 'Sistema de Gestão Corporativa Web (Next.js / Node.js / Supabase)', 'Aplicação corporativa de alta performance para controle operacional, conciliação de dados e gestão de clientes.', ARRAY['Arquitetura MVC robusta com separação de responsabilidades', 'API Node.js/Express desacoplada com Supabase/PostgreSQL', 'Testes de integração de endpoints e validação de schemas Zod'], ARRAY['Next.js', 'Node.js', 'Supabase', 'PostgreSQL'], true, false
WHERE NOT EXISTS (SELECT 1 FROM public.projects WHERE numeric_id = 8);

INSERT INTO public.projects (numeric_id, phase_id, title, description, requirements, badges, completed, is_custom)
SELECT 9, 2, 'Plataforma Multi-Tenant SaaS', 'Infraestrutura SaaS escalável com isolamento de dados por cliente, assinaturas recorrentes e auditoria de logs.', ARRAY['Isolamento de dados Multi-tenant no banco de dados', 'Gerenciamento de planos e faturamento via Webhooks', 'Logs de auditoria e monitoramento de atividades'], ARRAY['SaaS', 'Multi-tenant', 'PostgreSQL', 'Webhooks'], true, false
WHERE NOT EXISTS (SELECT 1 FROM public.projects WHERE numeric_id = 9);

INSERT INTO public.projects (numeric_id, phase_id, title, description, requirements, badges, completed, is_custom)
SELECT 10, 3, 'Integrador de Pagamentos & Webhooks (Stripe / Mercado Pago)', 'PoC de recebimento de pagamentos via PIX e Cartão com confirmação assíncrona via Webhooks e armazenamento em banco.', ARRAY['Endpoint seguro para consumo de Webhooks com assinatura HMAC', 'Geração de QR Code PIX dinâmico com tempo de expiração', 'Tratamento de retentativas e conciliação de pagamentos'], ARRAY['Webhooks', 'PIX API', 'Stripe', 'Node.js'], true, false
WHERE NOT EXISTS (SELECT 1 FROM public.projects WHERE numeric_id = 10);

INSERT INTO public.projects (numeric_id, phase_id, title, description, requirements, badges, completed, is_custom)
SELECT 11, 3, 'Microserviço de Autenticação & Autorização OAuth2/JWT', 'Serviço desacoplado para emissão e validação de tokens JWT, suporte a Refresh Tokens e login social.', ARRAY['Emissão de pares Access Token / Refresh Token com rotação', 'Validação de permissões por Middlewares no Express/Fastify', 'Integração com OAuth Google e GitHub'], ARRAY['JWT', 'OAuth2', 'Security', 'Express'], true, false
WHERE NOT EXISTS (SELECT 1 FROM public.projects WHERE numeric_id = 11);

INSERT INTO public.projects (numeric_id, phase_id, title, description, requirements, badges, completed, is_custom)
SELECT 12, 3, 'Chat Real-Time & Notificações com WebSockets / Socket.io', 'Aplicação de comunicação instantânea com salas privadas, indicador de digitação e mensagens persistidas.', ARRAY['Comunicação bidirecional com Socket.io ou WebSockets nativo', 'Persistência de histórico de mensagens no PostgreSQL', 'Indicadores visuais de presença e mensagens não lidas'], ARRAY['WebSockets', 'Socket.io', 'Real-time', 'Node.js'], true, false
WHERE NOT EXISTS (SELECT 1 FROM public.projects WHERE numeric_id = 12);

INSERT INTO public.projects (numeric_id, phase_id, title, description, requirements, badges, completed, is_custom)
SELECT 13, 3, 'Gerador de Dashboards e Gráficos Dinâmicos com D3.js / Recharts', 'Componente interativo para renderização de dados financeiros e métricas de desempenho com suporte a drag-and-drop.', ARRAY['Renderização de gráficos de linha, barra e pizza responsivos', 'Filtros dinâmicos por intervalo de datas e categorias', 'Exportação visual dos gráficos em imagens PNG/SVG'], ARRAY['D3.js', 'Recharts', 'Data Vis', 'React'], true, false
WHERE NOT EXISTS (SELECT 1 FROM public.projects WHERE numeric_id = 13);

INSERT INTO public.projects (numeric_id, phase_id, title, description, requirements, badges, completed, is_custom)
SELECT 14, 4, 'Suíte de Testes Automatizados com Vitest e React Testing Library', 'Configuração de testes de unidade e integração cobrindo componentes de UI, utilitários e regras de negócio.', ARRAY['Testes unitários de funções de cálculo de progresso e ordenação', 'Mocks de requisições HTTP e componentes interativos', 'Relatório de cobertura de código (Code Coverage) integrado'], ARRAY['Vitest', 'Testing Library', 'QA', 'TypeScript'], true, false
WHERE NOT EXISTS (SELECT 1 FROM public.projects WHERE numeric_id = 14);

INSERT INTO public.projects (numeric_id, phase_id, title, description, requirements, badges, completed, is_custom)
SELECT 15, 4, 'Pipeline de CI/CD Automatizada no GitHub Actions', 'Workflows para execução de linters, verificação de tipos TypeScript, execução da suíte de testes e deploy automático.', ARRAY['Jobs automatizados para tsc --noEmit, eslint e vitest run', 'Deploy condicional executado apenas após aprovação nos testes', 'Notificações de status do build no GitHub e Slack/Discord'], ARRAY['GitHub Actions', 'CI/CD', 'DevOps', 'Automation'], true, false
WHERE NOT EXISTS (SELECT 1 FROM public.projects WHERE numeric_id = 15);

INSERT INTO public.projects (numeric_id, phase_id, title, description, requirements, badges, completed, is_custom)
SELECT 16, 4, 'Análise Estática de Código e Padronização com ESLint & Prettier', 'Configuração rigorosa de regras de código para garantir manutenibilidade, prevenção de erros e consistência no time.', ARRAY['Regras customizadas do ESLint para React e Next.js App Router', 'Pre-commit hooks com Husky e lint-staged para formatar arquivos', 'Zero avisos de linting no processo de compilação'], ARRAY['ESLint', 'Prettier', 'Husky', 'Clean Code'], true, false
WHERE NOT EXISTS (SELECT 1 FROM public.projects WHERE numeric_id = 16);

INSERT INTO public.projects (numeric_id, phase_id, title, description, requirements, badges, completed, is_custom)
SELECT 17, 4, 'Monitoramento de Erros e Performance com Sentry', 'Integração de Sentry para captura proativa de exceções não tratadas e métricas de Web Vitals em ambiente de produção.', ARRAY['Captura automática de erros no cliente e nas API Routes', 'Rastreamento de performance e tempo de carregamento de páginas', 'Alertas em tempo real com stack traces detalhados'], ARRAY['Sentry', 'Monitoring', 'Web Vitals', 'Observability'], false, false
WHERE NOT EXISTS (SELECT 1 FROM public.projects WHERE numeric_id = 17);

-- 6. Sincronizar a sequência do SERIAL 'projects_numeric_id_seq' com o maior numeric_id existente
SELECT setval(
  pg_get_serial_sequence('public.projects', 'numeric_id'),
  COALESCE((SELECT MAX(numeric_id) FROM public.projects), 1)
);

