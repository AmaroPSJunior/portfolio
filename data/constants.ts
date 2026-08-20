import { Task, Phase, Skill } from '@/types';

export const STATUS_OPTIONS = [
  { value: 'pending', label: 'Pendente' },
  { value: 'in_progress', label: 'Em andamento' },
  { value: 'paused', label: 'Pausado' },
  { value: 'blocked', label: 'Bloqueado' },
  { value: 'completed', label: 'Concluído' },
  { value: 'disabled', label: 'Desativado' },
] as const;

export const DEFAULT_TASKS: Task[] = [];

export const PHASES: Phase[] = [];

export const RESUME_DATA = {
  name: "AMARO PEDRO DA SILVA JUNIOR",
  title: "Desenvolvedor Full Stack",
  address: "Avenida Ajarani, 409 - Vila Matilde – São Paulo/SP",
  phones: ["(11) 98278-8302"],
  whatsapp: "https://wa.me/5511982788302?text=Ol%C3%A1%2C%20vim%20pelo%20seu%20portf%C3%B3lio",
  email: "arcamos.j@gmail.com",
  linkedin: "https://www.linkedin.com/in/amaro-pedro-jr-53146810b",
  linkedinDisplay: "linkedin.com/in/amaro-pedro-jr-53146810b",
  github: "https://github.com/AmaroPSJunior",
  githubDisplay: "github.com/AmaroPSJunior",

  summary: "Desenvolvedor Full Stack com sólida experiência no desenvolvimento de sistemas robustos, atuando na concepção, arquitetura e manutenção de plataformas complexas de e-commerce (B2B/B2C) e sistemas de automação industrial (ERP). Especialista na criação de APIs escaláveis, integração de gateways de pagamento e otimização de performance técnica de ponta a ponta. Forte vivência com metodologias ágeis (Scrum), foco em código limpo, resolução de problemas e entrega contínua de valor alinhada aos objetivos do negócio.",

  skills: {
    languagesAndFrameworks: [
      "Java", "JavaScript", "TypeScript", "C#", "PHP", "Spring Boot", "Maven", "Node.js", "Vue.js", "React", "React Native"
    ],
    databasesAndTools: [
      "SQL Server", "MySQL", "PostgreSQL", "PL/SQL", "Git", "GitHub", "VS Code", "IntelliJ", "TFS", "Scrum"
    ]
  },

  experiences: [
    {
      role: "Desenvolvedor Full Stack",
      company: "SolutionTrue",
      location: "São Paulo/SP",
      period: "Julho de 2020 – Outubro de 2025",
      highlights: [
        "Desenvolvimento e manutenção contínua de plataformas críticas de e-commerce B2B/B2C do setor de autopeças e sistemas internos de ERP industriais.",
        "Implementação de novos fluxos de negócio como Dropshipping e integração segura de APIs de pagamentos e operadoras de cartão de crédito.",
        "Concepção de soluções e apps de automação e monitoramento de linhas de produção integrados diretamente ao sistema central.",
        "Construção e sustentação da arquitetura técnica com Java, Spring Boot e Maven no back-end e Vue.js e TypeScript no front-end.",
        "Gestão ativa de chamados de suporte técnico, triagem rápida, análise de causa raiz e aplicação de correções definitivas de bugs em produção."
      ],
      technologies: ["Java", "Spring Boot", "Maven", "Vue.js", "TypeScript", "APIs de Pagamento", "Dropshipping", "ERP"]
    },
    {
      role: "Desenvolvedor Full Stack (Autônomo / PJ)",
      company: "Amaro Pedro da Silva Junior Informatica ME",
      location: "São Paulo/SP",
      period: "Dezembro de 2019 – Abril de 2020",
      highlights: [
        "Atuação no desenvolvimento ponta a ponta de soluções personalizadas e sistemas corporativos sob demanda para empresas parceiras.",
        "Integração ágil de interfaces modernas com serviços e regras de negócio usando Node.js, React, React Native e jQuery."
      ],
      technologies: ["Node.js", "React", "React Native", "jQuery", "JavaScript"]
    },
    {
      role: "Desenvolvedor Front-end / Full Stack",
      company: "Centro de Ensino São Lucas LTDA",
      location: "Caçapava/SP",
      period: "Outubro de 2018 – Novembro de 2019",
      highlights: [
        "Construção de componentes em sistemas web e portais acadêmicos utilizando arquitetura MVC com a stack técnica da Microsoft.",
        "Desenvolvimento de regras de negócio em C#, manipulação em SQL Server e interfaces responsivas com HTML, CSS/SASS, JavaScript e Razor.",
        "Participação ativa em rituais do framework Scrum, colaborando na definição de backlogs, planning e refinamento de tarefas técnicos."
      ],
      technologies: ["C#", "SQL Server", "HTML", "CSS/SASS", "JavaScript", "Razor", "MVC", "Scrum"]
    }
  ],

  education: [
    {
      degree: "Superior de Tecnologia em Análise e Desenvolvimento de Sistemas (ADS)",
      institution: "UNIP – Campus Dutra, São José dos Campos/SP",
      period: "Conclusão: 07/2019",
      type: "Graduação Superior",
      icon: "🎓"
    },
    {
      degree: "Curso Técnico em Eletrotécnica & Curso Técnico em Eletrônica",
      institution: "Escola Politécnica – São José dos Campos/SP",
      period: "06/2010 – 12/2012",
      type: "Ensino Técnico",
      icon: "⚡"
    }
  ],

  projects: [
    {
      id: "ecommerce-solutiontrue",
      title: "Plataformas E-Commerce B2B/B2C (Setor de Autopeças)",
      company: "SolutionTrue – São Paulo/SP",
      description: "Desenvolvimento e manutenção contínua de plataformas críticas de e-commerce B2B/B2C do setor de autopeças e sistemas internos de ERP industriais.",
      techs: ["Java", "Spring Boot", "Maven", "Vue.js", "TypeScript"],
      badge: "E-Commerce & ERP"
    },
    {
      id: "dropshipping-payments",
      title: "Integração de Gateway de Pagamentos & Dropshipping",
      company: "SolutionTrue – São Paulo/SP",
      description: "Implementação de novos fluxos de negócio como Dropshipping e integração segura de APIs de pagamentos e operadoras de cartão de crédito.",
      techs: ["Java", "Spring Boot", "APIs de Pagamento", "TypeScript"],
      badge: "Fintech & Pagamentos"
    },
    {
      id: "industrial-automation",
      title: "Automação & Monitoramento de Linhas de Produção",
      company: "SolutionTrue – São Paulo/SP",
      description: "Concepção de soluções e apps de automação e monitoramento de linhas de produção integrados diretamente ao sistema central.",
      techs: ["Java", "Spring Boot", "Vue.js", "TypeScript", "ERP Industrial"],
      badge: "Automação Industrial"
    },
    {
      id: "custom-corporate-apps",
      title: "Sistemas Corporativos Sob Demanda",
      company: "Amaro Pedro da Silva Junior Informatica ME",
      description: "Atuação no desenvolvimento ponta a ponta de soluções personalizadas e sistemas corporativos sob demanda para empresas parceiras.",
      techs: ["Node.js", "React", "React Native", "jQuery", "JavaScript"],
      badge: "Soluções PJ / Autônomo"
    },
    {
      id: "academic-portals-mvc",
      title: "Portais Acadêmicos & Sistemas Web MVC",
      company: "Centro de Ensino São Lucas LTDA – Caçapava/SP",
      description: "Construção de componentes em sistemas web e portais acadêmicos utilizando arquitetura MVC com a stack técnica da Microsoft (C#, SQL Server, HTML/CSS, Razor).",
      techs: ["C#", "SQL Server", "HTML/CSS", "JavaScript", "Razor", "MVC"],
      badge: "Microsoft Stack & MVC"
    }
  ]
};

export const SKILLS_MATRIX: Skill[] = [
  { name: 'Java & Spring Boot', level: 95, icon: '☕', experience: 'Java, Spring Boot, Maven, APIs escaláveis' },
  { name: 'JavaScript & TypeScript', level: 92, icon: '⚡', experience: 'TypeScript, JavaScript, Node.js, Vue.js, React' },
  { name: 'C# & Stack Microsoft', level: 88, icon: '🔷', experience: 'C#, SQL Server, Arquitetura MVC, Razor' },
  { name: 'Node.js, Vue.js & React', level: 90, icon: '⚛️', experience: 'Node.js, Vue.js, React, React Native, jQuery' },
  { name: 'Bancos de Dados SQL', level: 90, icon: '🐘', experience: 'SQL Server, MySQL, PostgreSQL, PL/SQL' },
  { name: 'Ferramentas & Metodologias', level: 90, icon: '🛠️', experience: 'Git, GitHub, VS Code, IntelliJ, TFS, Scrum' }
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
      { id: 8, phase: 4, title: 'Validação 4 Fases', completed: true, badges: ['DevOps'] }
    ];
  });

  it('deve calcular o progresso geral do portfólio (75%)', () => {
    expect(calculateProgress(mockTasks)).toBe(75);
  });

  it('deve calcular progresso das 4 fases individualmente', () => {
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
