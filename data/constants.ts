import { Task, Phase, Skill } from '@/types';

export const STATUS_OPTIONS = [
  { value: 'pending', label: 'Pendente' },
  { value: 'in_progress', label: 'Em andamento' },
  { value: 'paused', label: 'Pausado' },
  { value: 'blocked', label: 'Bloqueado' },
  { value: 'completed', label: 'Concluído' },
  { value: 'disabled', label: 'Desativado' },
] as const;

export const WORKFLOW_YAML = `name: CI/CD Pipeline

on:
  push:
    branches: [ main, master ]
  pull_request:
    branches: [ main, master ]

jobs:
  build-and-test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: 'npm'
      - name: Install Dependencies
        run: npm ci
      - name: Run Type Check & Lint
        run: npm run lint
      - name: Run Unit Tests
        run: npm test
      - name: Build Project
        run: npm run build
`;

export const TEST_SPEC_CODE = `import { describe, it, expect } from 'vitest';
import { RESUME_DATA, STATUS_OPTIONS } from './constants';

describe('Portfolio Core Constants', () => {
  it('should contain correct user summary and name', () => {
    expect(RESUME_DATA.name).toBe('AMARO PEDRO DA SILVA JUNIOR');
    expect(RESUME_DATA.title).toBe('Desenvolvedor Full Stack');
  });

  it('should include all work status options', () => {
    const statuses = STATUS_OPTIONS.map(s => s.value);
    expect(statuses).toContain('pending');
    expect(statuses).toContain('in_progress');
    expect(statuses).toContain('completed');
  });
});
`;

export const VITEST_CONFIG_CODE = `import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    globals: true,
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './'),
    },
  },
});
`;

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
      techs: ["Java", "Jetty Server", "Maven", "PostgreSQL", "Vue.js"],
      badge: "E-Commerce & ERP"
    },
    {
      id: "dropshipping-payments",
      title: "Integração de Gateway de Pagamentos & Dropshipping",
      company: "SolutionTrue – São Paulo/SP",
      description: "Implementação de novos fluxos de negócio como Dropshipping e integração segura de APIs de pagamentos e operadoras de cartão de crédito.",
      techs: ["Java", "Jetty Server", "Maven", "PostgreSQL", "Vue.js"],
      badge: "Fintech & Pagamentos"
    },
    {
      id: "industrial-automation",
      title: "Automação & Monitoramento de Linhas de Produção",
      company: "SolutionTrue – São Paulo/SP",
      description: "Concepção de soluções e apps de automação e monitoramento de linhas de produção integrados diretamente ao sistema central.",
      techs: ["Java", "Jetty Server", "Maven", "PostgreSQL", "Vue.js"],
      badge: "Automação Industrial"
    },
    {
      id: "custom-corporate-apps",
      title: "Sistemas Corporativos Sob Demanda",
      company: "Amaro Pedro da Silva Junior Informatica ME – Caçapava/SP",
      description: "Atuação no desenvolvimento ponta a ponta de soluções personalizadas e sistemas corporativos sob demanda para empresas parceiras.",
      techs: ["Node.js", "React", "React Native", "JavaScript", "TypeScript"],
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

