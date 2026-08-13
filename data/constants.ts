import { Task, Phase, Skill } from '@/types';

export const DEFAULT_TASKS: Task[] = [
  // Fase 1 - Roadmap & Evolução do Portfólio
  {
    id: 1,
    phase: 1,
    title: "Arquitetura e Landing Page do Portfólio Navegável",
    description: "Estruturação em Next.js App Router reativa e responsiva com suporte a navegação entre módulos, tema escuro Slate/Cyan e otimização para deploy na Vercel.",
    requirements: [
      "Interface responsiva com Dark Mode Slate (#0f172a) & Cyan (#06b6d4)",
      "Navegação desacoplada encapsulada em componentes Next.js",
      "Hospedagem de alta performance e suporte nativo Server/Client na Vercel"
    ],
    badges: ["Next.js 15", "React 19", "Tailwind CSS", "Vercel"],
    completed: true,
    isCustom: false
  },
  {
    id: 2,
    phase: 1,
    title: "Módulo de Metadados & Roadmap do Projeto",
    description: "Painel reativo para acompanhamento transparente do ciclo de vida, status de homologação de projetos, requisitos e progresso por pilar técnico.",
    requirements: [
      "Visualização em sanfona/accordion expansível para Fases e Cards",
      "Métricas automatizadas de porcentagem de conclusão por pilar",
      "Filtros combinados por busca textual, pilar e status"
    ],
    badges: ["Next.js App Router", "React Hooks", "UI/UX", "Accordion"],
    completed: true,
    isCustom: false
  },
  {
    id: 3,
    phase: 1,
    title: "Persistência de Dados e Estado Local Reativo",
    description: "Sincronização imediata de tarefas, requisitos customizados e preferências diretamente no LocalStorage do navegador sem dependência de backend.",
    requirements: [
      "Gerenciamento de estado reativo com useState e useEffect no React",
      "Fallback automático e recuperação de lista inicial padrão",
      "Persistência local segura sem perda de dados na navegação"
    ],
    badges: ["Web API", "LocalStorage", "State Management"],
    completed: true,
    isCustom: false
  },
  {
    id: 4,
    phase: 1,
    title: "Painel de Sincronização com API REST do GitHub & Supabase",
    description: "Integração via API REST do GitHub e Supabase PostgreSQL para consulta ao vivo de metadados do repositório (estrelas, forks, issues e branch principal) e gerador de comandos Git.",
    requirements: [
      "Conexão com API do GitHub (https://api.github.com/repos)",
      "Conexão de Banco de Dados Supabase (PostgreSQL)",
      "Visualização em tempo real de estatísticas do repositório",
      "Gerador dinâmico de comandos git remote e push"
    ],
    badges: ["GitHub REST API", "Supabase", "PostgreSQL", "DevTools"],
    completed: true,
    isCustom: false
  },
  {
    id: 5,
    phase: 1,
    title: "Futura Home do Portfólio (Showcase & Trajetória)",
    description: "Ideia de expansão da Home principal com apresentação executiva, destaque de projetos principais, trajetória profissional e formulário de contato.",
    requirements: [
      "Banner Hero dinâmico com chamadas de ação para projetos",
      "Cards interativos com métricas de impacto de software",
      "Seção de trajetórias e depoimentos técnicos"
    ],
    badges: ["Portfólio", "Showcase", "UI/UX", "Futuro"],
    completed: false,
    isCustom: false
  },

  // Fase 2 - Projetos, Produtos e Serviços
  {
    id: 6,
    phase: 2,
    title: "Plataforma E-commerce Enterprise B2B/B2C (Java 17 / Spring Boot)",
    description: "Solução completa de e-commerce preparada para alto tráfego com catálogo distribuído, carrinho resiliente, controle de estoque e autenticação OAuth2/JWT.",
    requirements: [
      "Arquitetura RESTful com Spring Boot 3 e Java 17",
      "Mapeamento ORM avançado com Hibernate e PostgreSQL",
      "Integração com gateways de pagamento e emissão de notas"
    ],
    badges: ["Java 17", "Spring Boot", "PostgreSQL", "B2B/B2C"],
    completed: true,
    isCustom: false
  },
  {
    id: 7,
    phase: 2,
    title: "ERP Industrial & Telemetria IoT em Tempo Real (C# .NET 8 / SQL Server)",
    description: "Sistema de gestão industrial para monitoramento de linhas de produção, comunicação via protocolo MQTT IoT e relatórios operacionais consolidados.",
    requirements: [
      "Backend em C# .NET 8 com Entity Framework Core e SQL Server",
      "Processamento de dados telemétricos via brokers MQTT",
      "Dashboards de disponibilidade de máquinas e OEE industrial"
    ],
    badges: ["C#", ".NET 8", "SQL Server", "IoT", "ERP"],
    completed: true,
    isCustom: false
  },
  {
    id: 8,
    phase: 2,
    title: "Sistema de Gestão Corporativa Web (Next.js / Node.js / Supabase)",
    description: "Aplicação Web SPA/SSR reativa para controle administrativo, gestão de acessos baseada em papéis (RBAC) e relatórios dinâmicos.",
    requirements: [
      "App Router desenvolvido em Next.js 15 + React 19",
      "API Node.js/Express desacoplada com Supabase/PostgreSQL",
      "Relatórios exportáveis em PDF/Excel e controle de permissões"
    ],
    badges: ["Next.js", "Node.js", "Supabase", "PostgreSQL"],
    completed: true,
    isCustom: false
  },
  {
    id: 9,
    phase: 2,
    title: "Portal de Microserviços & Observabilidade Distribuída (Spring Cloud / Docker)",
    description: "Projeto de infraestrutura de microsserviços com Service Discovery (Eureka), API Gateway centralizado e monitoramento com Prometheus e Grafana.",
    requirements: [
      "API Gateway resiliente para roteamento e rate limiting",
      "Containerização de serviços com Docker e Docker Compose",
      "Rastreamento distribuído com OpenTelemetry"
    ],
    badges: ["Spring Cloud", "Docker", "Microservices", "Grafana"],
    completed: false,
    isCustom: false
  },

  // Fase 3 - Tech Lab & Experimentos
  {
    id: 10,
    phase: 3,
    title: "PoC Web3 & Smart Contracts (Ethers.js / Metamask)",
    description: "Prova de Conceito para integração de carteiras digitais Web3, verificação de saldo on-chain e execução de transações em contratos inteligentes.",
    requirements: [
      "Conexão com provedores de carteira MetaMask via Ethers.js",
      "Assinatura criptográfica de mensagens e transações",
      "Integração com testnets de contratos EVM"
    ],
    badges: ["Web3", "Ethers.js", "Smart Contracts", "Blockchain"],
    completed: true,
    isCustom: false
  },
  {
    id: 11,
    phase: 3,
    title: "PoC Gateway de Pagamento (Pix Dinâmico & Webhooks)",
    description: "Simulador de cobrança instantânea com geração de Payload copia-e-cola e QR Code Pix, com liquidação automatizada via Webhook.",
    requirements: [
      "Geração de QR Code Pix no padrão EMV BR Code",
      "Processamento assíncrono de notificações Webhook",
      "Validação de assinaturas e segurança de callbacks"
    ],
    badges: ["Fintech", "Pix API", "Node.js", "Webhooks"],
    completed: true,
    isCustom: false
  },
  {
    id: 12,
    phase: 3,
    title: "Experimento com Micro-frontends & Module Federation",
    description: "Investigação prática de arquitetura de micro-frontends desacoplados para carregamento assíncrono de componentes independentes.",
    requirements: [
      "Configuração do Module Federation e rotas dinâmicas",
      "Compartilhamento de estado e dependências entre aplicações",
      "Isolamento de estilos e escopos de execução"
    ],
    badges: ["Microfrontends", "Next.js", "Module Federation"],
    completed: false,
    isCustom: false
  },
  {
    id: 13,
    phase: 3,
    title: "Agente de IA Generativa para Code Review & Análise de Segurança",
    description: "Ferramenta experimental integrada a LLMs (Gemini) para inspeção automática de pull requests, detecção de vulnerabilidades e sugestão de refatoração.",
    requirements: [
      "Integração via SDK Gemini / OpenAI para análise sintática",
      "Geração de relatórios de conformidade com OWASP Top 10",
      "Automação de comentários via GitHub Webhooks"
    ],
    badges: ["Gemini AI", "Code Review", "Security", "DevSecOps"],
    completed: false,
    isCustom: false
  },

  // Fase 4 - QA & Testes de Habilidade (Skills Lab)
  {
    id: 14,
    phase: 4,
    title: "Engenharia de Automação & Suíte de Validação Regressiva",
    description: "Desenvolvimento de suíte de testes unitários e de integração cobrindo regras de negócio, cálculos de progresso e filtros do portfólio.",
    requirements: [
      "Suíte automatizada com Vitest e runtime ultra-rápido Bun test",
      "Cobertura de código para funções de cálculo de progresso e filtragem",
      "Relatórios de execução de testes integrados ao terminal"
    ],
    badges: ["Vitest", "Bun test", "QA", "Automation"],
    completed: true,
    isCustom: false
  },
  {
    id: 15,
    phase: 4,
    title: "Pipeline de CI/CD & Deploy Automatizado (Vercel & GitHub Actions)",
    description: "Automação do fluxo de entrega contínua com gatilhos a cada push na branch principal, execução de testes e deploy automático na Vercel.",
    requirements: [
      "Workflow parametrizado em .github/workflows/ci-cd.yml",
      "Instalação rápida de dependências com cache e validação estática",
      "Publicação e Preview automático na Vercel"
    ],
    badges: ["Vercel", "GitHub Actions", "CI/CD", "DevOps"],
    completed: true,
    isCustom: false
  },
  {
    id: 16,
    phase: 4,
    title: "Ferramentas de Linting, Análise Estática & Auditoria de Código",
    description: "Configuração de ferramentas de análise estática de tipo com TypeScript Compiler (tsc) para garantia de qualidade e prevenção de erros.",
    requirements: [
      "Checagem rigorosa de tipos sem emissão de código (tsc --noEmit)",
      "Garantia de ausência de erros sintáticos e importações quebradas",
      "Integração do linter no pré-commit do Git"
    ],
    badges: ["DevOps", "TypeScript", "Code Audit", "Linter"],
    completed: true,
    isCustom: false
  },
  {
    id: 17,
    phase: 4,
    title: "Laboratório de Validação de Desempenho e Cobertura",
    description: "Validação contínua do comportamento reativo da aplicação sob diferentes cargas de tarefas e filtros de navegação.",
    requirements: [
      "Garantia de reatividade sem lag na renderização de listas",
      "Validação da reatividade das métricas dos 4 pilares em tempo real",
      "Acompanhamento da taxa de sucesso da suíte QA em 100%"
    ],
    badges: ["Quality Assurance", "Skills Lab", "Performance"],
    completed: true,
    isCustom: false
  }
];

export const PHASES: Phase[] = [
  { id: 1, icon: '🚀', title: 'Fase 1 - Roadmap & Evolução do Portfólio', subtitle: 'Setup inicial, layout Dark Mode (Slate/Cyan), LocalStorage e deploy na Vercel.' },
  { id: 2, icon: '💼', title: 'Fase 2 - Projetos, Produtos e Serviços', subtitle: 'Aplicações completas: E-commerce Enterprise, ERP Industrial e Sistemas MVC Corporativos.' },
  { id: 3, icon: '🧪', title: 'Fase 3 - Tech Lab & Experimentos', subtitle: 'Provas de Conceito (PoCs), Web3, gateways de pagamento e testes de novas tecnologias.' },
  { id: 4, icon: '🛡️', title: 'Fase 4 - QA & Testes de Habilidade (Skills Lab)', subtitle: 'Suítes de testes unitários automatizados, scripts de CI/CD, DevOps e análises de qualidade.' }
];

export const SKILLS_MATRIX: Skill[] = [
  { name: 'Java & Spring Boot', level: 95, icon: '☕', experience: 'Microserviços, Spring Data JPA, Security, REST APIs' },
  { name: 'Node.js & TypeScript', level: 90, icon: '🟢', experience: 'Express, NestJS, Next.js, APIs assíncronas' },
  { name: 'React 19 & Next.js 15', level: 92, icon: '⚛️', experience: 'App Router, Server Components, Hooks, Tailwind, SPA/SSR' },
  { name: 'C# & .NET 8', level: 85, icon: '⚡', experience: 'Sistemas Industriais, Entity Framework, LINQ' },
  { name: 'SQL & Supabase', level: 90, icon: '🐘', experience: 'PostgreSQL, Supabase Auth/Database, SQL Server, MySQL' },
  { name: 'DevOps & CI/CD', level: 88, icon: '🛠️', experience: 'GitHub Actions, Vercel, Docker, Linux, Automação' }
];

export const WORKFLOW_YAML = `name: CI/CD Pipeline - Vercel & QA Validation

on:
  push:
    branches: [ main, master ]
  pull_request:
    branches: [ main, master ]

jobs:
  test-and-build:
    name: 🧪 Testes Unitários & Validação
    runs-on: ubuntu-latest
    steps:
      - name: 📥 Checkout do Repositório
        uses: actions/checkout@v4

      - name: 🥟 Configurar Node.js / Bun
        uses: oven-sh/setup-bun@v2
        with:
          bun-version: latest

      - name: 📦 Instalar Dependências
        run: bun install --frozen-lockfile || bun install

      - name: 🔍 Checagem de Tipos TypeScript
        run: bun run lint

      - name: 🧪 Executar Testes Unitários
        run: bun test || npm test

      - name: 🏗️ Testar Build do Next.js
        run: bun run build`;

export const TEST_SPEC_CODE = `import { describe, it, expect, beforeEach } from 'vitest';

export function calculateProgress(tasks) {
  if (!tasks || tasks.length === 0) return 0;
  const completed = tasks.filter(t => t.completed).length;
  return Math.round((completed / tasks.length) * 100);
}

export function calculatePhaseProgress(tasks, phaseId) {
  if (!tasks || tasks.length === 0) return 0;
  const phaseTasks = tasks.filter(t => t.phase === Number(phaseId));
  if (phaseTasks.length === 0) return 0;
  const completed = phaseTasks.filter(t => t.completed).length;
  return Math.round((completed / phaseTasks.length) * 100);
}

describe('Portfólio & Roadmap Next.js - Suíte QA (Amaro Pedro da Silva Junior)', () => {
  let mockTasks;

  beforeEach(() => {
    mockTasks = [
      { id: 1, phase: 1, title: 'Setup Vercel', completed: true, badges: ['Next.js'] },
      { id: 2, phase: 1, title: 'App Router Next.js 15', completed: true, badges: ['React'] },
      { id: 3, phase: 2, title: 'Homologação E-commerce', completed: true, badges: ['Java'] },
      { id: 4, phase: 2, title: 'Homologação ERP', completed: false, badges: ['C#'] },
      { id: 5, phase: 3, title: 'PoC Web3', completed: true, badges: ['Web3'] },
      { id: 6, phase: 3, title: 'PoC Pix', completed: false, badges: ['Pix'] },
      { id: 7, phase: 4, title: 'Suíte Vitest', completed: true, badges: ['QA'] },
      { id: 8, phase: 4, title: 'Validação 4 Pilares', completed: true, badges: ['DevOps'] }
    ];
  });

  it('deve calcular o progresso geral do portfólio (75%)', () => {
    expect(calculateProgress(mockTasks)).toBe(75);
  });

  it('deve calcular progresso dos 4 pilares individualmente', () => {
    expect(calculatePhaseProgress(mockTasks, 1)).toBe(100);
    expect(calculatePhaseProgress(mockTasks, 2)).toBe(50);
    expect(calculatePhaseProgress(mockTasks, 3)).toBe(50);
    expect(calculatePhaseProgress(mockTasks, 4)).toBe(100);
  });
});`;

export const VITEST_CONFIG_CODE = `import { defineConfig } from 'vite';

export default defineConfig({
  test: {
    globals: true,
    environment: 'node',
    include: ['app.spec.js', 'tests/**/*.spec.js'],
  },
});`;
