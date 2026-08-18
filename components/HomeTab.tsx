'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { Phase, Task } from '@/types';
import {
  Code2,
  Terminal,
  Layers,
  Cpu,
  Globe,
  Database,
  ShieldCheck,
  CheckCircle2,
  ArrowRight,
  ExternalLink,
  Github,
  Linkedin,
  Mail,
  Phone,
  MapPin,
  Sparkles,
  Send,
  Download,
  Award,
  Briefcase,
  Server,
  Zap,
  Boxes,
  FileCode2,
  Check,
  ChevronRight,
  Flame,
  LayoutGrid
} from 'lucide-react';

interface HomeTabProps {
  phases: Phase[];
  tasks: Task[];
  setActiveTab: (tab: string) => void;
  setSelectedPhaseFilter: (phaseId: string) => void;
  onOpenAdmin?: () => void;
  onOpenDiagnostics?: () => void;
}

export const HomeTab: React.FC<HomeTabProps> = ({
  phases,
  tasks,
  setActiveTab,
  setSelectedPhaseFilter,
  onOpenAdmin,
  onOpenDiagnostics,
}) => {
  // Skill category filter
  const [activeSkillCategory, setActiveSkillCategory] = useState<'all' | 'backend' | 'frontend' | 'data' | 'devops'>('all');
  
  // Project category filter
  const [activeProjectFilter, setActiveProjectFilter] = useState<'all' | 'enterprise' | 'iot' | 'web' | 'poc'>('all');

  // Contact form state
  const [contactForm, setContactForm] = useState({ name: '', email: '', subject: '', message: '' });
  const [contactSubmitted, setContactSubmitted] = useState(false);
  const [isSending, setIsSending] = useState(false);

  // Stats calculation
  const totalTasks = tasks.length;
  const completedTasks = tasks.filter((t) => t.completed).length;
  const overallPercentage = totalTasks === 0 ? 0 : Math.round((completedTasks / totalTasks) * 100);

  const getPhaseCompletedCount = (phaseId: number) => {
    return tasks.filter((t) => Number(t.phase) === Number(phaseId) && t.completed).length;
  };

  const getPhaseTotalCount = (phaseId: number) => {
    return tasks.filter((t) => Number(t.phase) === Number(phaseId)).length;
  };

  const getPhasePercentage = (phaseId: number) => {
    const total = getPhaseTotalCount(phaseId);
    if (total === 0) return 0;
    return Math.round((getPhaseCompletedCount(phaseId) / total) * 100);
  };

  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!contactForm.name || !contactForm.email || !contactForm.message) return;

    setIsSending(true);
    setTimeout(() => {
      setIsSending(false);
      setContactSubmitted(true);
      setContactForm({ name: '', email: '', subject: '', message: '' });
      setTimeout(() => setContactSubmitted(false), 6000);
    }, 800);
  };

  const skills = [
    { name: 'Java & Spring Boot', category: 'backend', level: 95, icon: '☕', exp: '+8 anos', desc: 'Microsserviços, Spring Data JPA, Spring Security, RESTful APIs, Hibernate' },
    { name: 'React 19 & Next.js 15', category: 'frontend', level: 94, icon: '⚛️', exp: '+6 anos', desc: 'App Router, Server Components, Hooks, SSR/SSG, Tailwind CSS' },
    { name: 'Node.js & TypeScript', category: 'backend', level: 92, icon: '🟢', exp: '+7 anos', desc: 'NestJS, Express, APIs assíncronas, TypeORM, arquitetura distribuída' },
    { name: 'C# & .NET 8', category: 'backend', level: 86, icon: '⚡', exp: '+5 anos', desc: 'Sistemas Industriais, Entity Framework, LINQ, APIs corporativas' },
    { name: 'PostgreSQL & Supabase', category: 'data', level: 92, icon: '🐘', exp: '+7 anos', desc: 'Modelagem relacional, PL/pgSQL, Row Level Security, Triggers e Índices' },
    { name: 'DevOps & CI/CD Pipelines', category: 'devops', level: 90, icon: '🛠️', exp: '+6 anos', desc: 'GitHub Actions, Docker, Linux, Shell Script, Vercel, Automação QA' },
    { name: 'Testes & QA (Vitest / TDD)', category: 'devops', level: 92, icon: '🧪', exp: '+5 anos', desc: 'Testes Unitários, Integração, Mocks, Vitest, Jest, Cobertura 100%' },
    { name: 'MQTT & Telemetria Industrial', category: 'data', level: 85, icon: '📡', exp: '+4 anos', desc: 'Comunicação em tempo real para IoT, Linhas de produção e sensores' },
    { name: 'Web3 & Smart Contracts', category: 'backend', level: 80, icon: '🌐', exp: '+3 anos', desc: 'Ethers.js, integração com carteiras digitais, PoCs blockchain' },
  ];

  const filteredSkills = activeSkillCategory === 'all' 
    ? skills 
    : skills.filter(s => s.category === activeSkillCategory);

  const featuredProjects = [
    {
      id: 'ecommerce',
      title: 'Plataforma E-commerce Enterprise',
      category: 'enterprise',
      icon: '🏬',
      badge: 'B2B / B2C Architecture',
      description: 'Arquitetura de microsserviços distribuídos com checkout resiliente, catálogo distribuído e integração com gateways de pagamento em alta escala.',
      techs: ['Java 17', 'Spring Boot', 'PostgreSQL', 'Docker', 'REST API'],
      impact: 'Processamento de alta concorrência com tempo de resposta < 120ms',
      phaseId: 2,
    },
    {
      id: 'erp-iot',
      title: 'ERP Industrial & Telemetria em Tempo Real',
      category: 'iot',
      icon: '🏭',
      badge: 'Automação & IoT',
      description: 'Gestão operacional de chão de fábrica com monitoramento de sensores IoT via protocolo MQTT, alertas de tolerância e sincronização com SQL Server.',
      techs: ['C# .NET 8', 'MQTT / IoT', 'SQL Server', 'WebSockets', 'Entity Framework'],
      impact: 'Redução de 35% no tempo de resposta a paradas de linha industrial',
      phaseId: 2,
    },
    {
      id: 'nextjs-portal',
      title: 'Painel Corporativo & Roadmap Next.js 15',
      category: 'web',
      icon: '💻',
      badge: 'Next.js 15 & Supabase',
      description: 'Aplicação web completa com Next.js 15 App Router, autenticação RBAC com fluxo de primeiro acesso seguro para Admin e persistência bidirecional com Supabase.',
      techs: ['Next.js 15', 'React 19', 'TypeScript', 'Supabase', 'Tailwind CSS'],
      impact: 'Interface reativa com 24 testes automatizados e 100% de sucesso QA',
      phaseId: 1,
    },
    {
      id: 'poc-pix',
      title: 'PoC Gateway de Pagamentos Instantâneos (Pix)',
      category: 'poc',
      icon: '💳',
      badge: 'Fintech & Webhooks',
      description: 'Motor transacional para geração instantânea de QR Code Pix dinâmico com conciliação automática via webhooks criptografados.',
      techs: ['Node.js', 'Express', 'Webhooks', 'Criptografia', 'PostgreSQL'],
      impact: 'Confirmação transacional em menos de 1.5s com alta resiliência',
      phaseId: 3,
    },
    {
      id: 'poc-web3',
      title: 'PoC Web3 & Conectividade Blockchain',
      category: 'poc',
      icon: '🌐',
      badge: 'Smart Contracts & Web3',
      description: 'Laboratório de integração para assinatura criptográfica de transações e conexão direta com carteiras digitais via Ethers.js.',
      techs: ['Ethers.js', 'Solidity', 'MetaMask API', 'Next.js'],
      impact: 'Homologação completa de transações seguras na rede',
      phaseId: 3,
    },
    {
      id: 'cicd-suite',
      title: 'Pipeline CI/CD & Suíte de Testes Automatizada',
      category: 'enterprise',
      icon: '🛠️',
      badge: 'DevOps & QA',
      description: 'Fluxo completo de integração e entrega contínua com GitHub Actions, validação estática de tipos TypeScript e 52 testes unitários no Vitest.',
      techs: ['GitHub Actions', 'Vitest', 'Bun / Node.js', 'Vercel Deploy'],
      impact: 'Zero falhas de regressão em deploys de produção automatizados',
      phaseId: 4,
    }
  ];

  const filteredProjects = activeProjectFilter === 'all'
    ? featuredProjects
    : featuredProjects.filter(p => p.category === activeProjectFilter);

  return (
    <div className="space-y-16 lg:space-y-24">
      {/* 1. HERO SECTION (Cyber-Tech Portfolio Aesthetic) */}
      <section id="hero" className="relative pt-2 pb-6">
        {/* Ambient Glows */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 sm:w-[600px] h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none -z-10"></div>
        <div className="absolute top-1/3 right-10 w-72 h-72 bg-blue-600/10 rounded-full blur-3xl pointer-events-none -z-10"></div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
          {/* Left Column: Bio & Intro */}
          <div className="lg:col-span-7 space-y-6 text-left">
            {/* Status Pill */}
            <div className="inline-flex items-center gap-2.5 px-3.5 py-1.5 rounded-full bg-slate-900/90 border border-cyan-500/30 text-xs font-semibold text-cyan-300 shadow-sm backdrop-blur-sm">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse"></span>
              <span>Disponível para Novos Projetos & Contratos Enterprise</span>
            </div>

            {/* Main Headline */}
            <div className="space-y-2">
              <span className="text-sm font-bold uppercase tracking-widest text-cyan-400 font-mono">
                Portfólio & Engenharia de Software
              </span>
              <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-white tracking-tight leading-[1.1]">
                Olá, sou <br />
                <span className="bg-gradient-to-r from-cyan-400 via-teal-300 to-blue-400 bg-clip-text text-transparent">
                  Amaro Pedro da Silva Junior
                </span>
              </h1>
              <p className="text-lg sm:text-xl font-bold text-slate-200 pt-1">
                Engenheiro Full Stack & Especialista em DevOps / Cloud
              </p>
            </div>

            {/* Description */}
            <p className="text-sm sm:text-base text-slate-300 leading-relaxed max-w-2xl">
              Desenvolvo aplicações de missão crítica, arquiteturas de microsserviços de alto desempenho e
              sistemas web modernos. Ampla experiência prática com <strong className="text-white">Java (Spring Boot)</strong>,{' '}
              <strong className="text-white">Next.js 15 / React 19</strong>, <strong className="text-white">Node.js & TypeScript</strong>,{' '}
              <strong className="text-white">C# .NET 8</strong>, bancos <strong className="text-white">PostgreSQL / Supabase</strong> e automação contínua de <strong className="text-white">CI/CD & QA</strong>.
            </p>

            {/* Action Buttons CTA */}
            <div className="pt-3 flex flex-wrap items-center gap-3.5">
              <a
                href="#projetos"
                className="bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-extrabold text-sm px-6 py-3.5 rounded-xl transition-all flex items-center gap-2 shadow-lg shadow-cyan-500/20 hover:scale-[1.02] active:scale-95"
              >
                <Zap className="w-4 h-4 fill-current" />
                <span>Explorar Projetos & Demos</span>
              </a>

              <a
                href="#experiencia"
                className="bg-slate-900 hover:bg-slate-800 text-cyan-300 hover:text-white font-bold text-sm px-5 py-3.5 rounded-xl border border-slate-700/80 transition-all flex items-center gap-2 shadow hover:border-cyan-500/40"
              >
                <Briefcase className="w-4 h-4 text-cyan-400" />
                <span>Trajetória Profissional</span>
              </a>

              <a
                href="#contato"
                className="bg-slate-950 hover:bg-slate-900 text-slate-300 hover:text-white font-semibold text-sm px-5 py-3.5 rounded-xl border border-slate-800 transition-all flex items-center gap-2"
              >
                <Mail className="w-4 h-4 text-cyan-400" />
                <span>Fale Comigo</span>
              </a>
            </div>

            {/* Quick Contact & Social Chips */}
            <div className="pt-2 flex flex-wrap items-center gap-4 text-xs text-slate-400">
              <div className="flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-cyan-400" />
                <span>Brasil (Remoto / Híbrido)</span>
              </div>
              <span className="text-slate-700">•</span>
              <div className="flex items-center gap-1.5">
                <Mail className="w-3.5 h-3.5 text-cyan-400" />
                <span className="font-mono text-slate-300">arcamos.j@gmail.com</span>
              </div>
              <span className="text-slate-700">•</span>
              <a
                href="https://github.com/amaropedro"
                target="_blank"
                rel="noreferrer"
                className="hover:text-cyan-300 transition-colors flex items-center gap-1"
              >
                <Github className="w-3.5 h-3.5" />
                <span>GitHub</span>
              </a>
            </div>
          </div>

          {/* Right Column: Custom Visual Artwork Portrait Card */}
          <div className="lg:col-span-5 flex justify-center">
            <div className="relative w-full max-w-sm sm:max-w-md group">
              {/* Animated Outer Frame */}
              <div className="absolute -inset-1.5 bg-gradient-to-r from-cyan-500 via-blue-500 to-emerald-400 rounded-3xl blur-md opacity-40 group-hover:opacity-75 transition duration-700"></div>

              {/* Main Card */}
              <div className="relative bg-slate-900/90 border border-slate-800 rounded-3xl p-5 shadow-2xl backdrop-blur-xl space-y-4">
                {/* Photo / Visual Illustration Frame */}
                <div className="relative w-full aspect-square rounded-2xl overflow-hidden border border-slate-700/80 bg-slate-950 flex items-center justify-center">
                  <Image
                    src="/amaro_avatar.jpg"
                    alt="Amaro Pedro da Silva Junior - Full Stack Engineer"
                    fill
                    sizes="(max-width: 768px) 100vw, 400px"
                    className="object-cover object-center group-hover:scale-105 transition-transform duration-700"
                    priority
                    referrerPolicy="no-referrer"
                  />

                  {/* Gradient Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent"></div>

                  {/* Floating Experience Badge */}
                  <div className="absolute bottom-3 left-3 bg-slate-950/90 border border-cyan-500/40 px-3 py-1.5 rounded-xl text-xs font-bold text-cyan-300 backdrop-blur-md flex items-center gap-1.5 shadow-lg">
                    <Award className="w-4 h-4 text-cyan-400" />
                    <span>+8 Anos de Experiência</span>
                  </div>

                  {/* Live Status Badge */}
                  <div className="absolute top-3 right-3 bg-emerald-950/90 border border-emerald-500/40 px-2.5 py-1 rounded-full text-[11px] font-bold text-emerald-300 backdrop-blur-md flex items-center gap-1.5 shadow-lg">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
                    <span>Online / Ativo</span>
                  </div>
                </div>

                {/* Floating Tech Chips Matrix */}
                <div className="grid grid-cols-2 gap-2 pt-1">
                  <div className="bg-slate-950/80 border border-slate-800 p-2.5 rounded-xl flex items-center gap-2">
                    <span className="text-lg">☕</span>
                    <div>
                      <div className="text-[11px] font-bold text-white">Java & Spring</div>
                      <div className="text-[10px] text-slate-400">Microserviços & REST</div>
                    </div>
                  </div>

                  <div className="bg-slate-950/80 border border-slate-800 p-2.5 rounded-xl flex items-center gap-2">
                    <span className="text-lg">⚛️</span>
                    <div>
                      <div className="text-[11px] font-bold text-white">Next.js 15 & React</div>
                      <div className="text-[10px] text-slate-400">SSR, App Router</div>
                    </div>
                  </div>

                  <div className="bg-slate-950/80 border border-slate-800 p-2.5 rounded-xl flex items-center gap-2">
                    <span className="text-lg">🐘</span>
                    <div>
                      <div className="text-[11px] font-bold text-white">PostgreSQL / Supabase</div>
                      <div className="text-[10px] text-slate-400">Modelagem & Auth</div>
                    </div>
                  </div>

                  <div className="bg-slate-950/80 border border-slate-800 p-2.5 rounded-xl flex items-center gap-2">
                    <span className="text-lg">🛠️</span>
                    <div>
                      <div className="text-[11px] font-bold text-white">CI/CD & DevOps</div>
                      <div className="text-[10px] text-slate-400">GitHub Actions, Vitest</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. NUMBERS & IMPACT METRICS STRIP */}
      <section className="bg-slate-900/80 border border-slate-800/80 rounded-2xl p-6 shadow-xl">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center divide-y md:divide-y-0 md:divide-x divide-slate-800">
          <div className="pt-2 md:pt-0 space-y-1">
            <div className="text-3xl sm:text-4xl font-extrabold text-cyan-400 font-mono">+8 Anos</div>
            <div className="text-xs text-slate-300 font-semibold">Engenharia de Software</div>
            <div className="text-[11px] text-slate-500">Desenvolvimento de ponta a ponta</div>
          </div>

          <div className="pt-4 md:pt-0 md:pl-6 space-y-1">
            <div className="text-3xl sm:text-4xl font-extrabold text-emerald-400 font-mono">+25</div>
            <div className="text-xs text-slate-300 font-semibold">Soluções & PoCs Entregues</div>
            <div className="text-[11px] text-slate-500">E-commerce, ERP e Web Apps</div>
          </div>

          <div className="pt-4 md:pt-0 md:pl-6 space-y-1">
            <div className="text-3xl sm:text-4xl font-extrabold text-blue-400 font-mono">100%</div>
            <div className="text-xs text-slate-300 font-semibold">Suíte QA & Cobertura</div>
            <div className="text-[11px] text-slate-500">52 testes unitários no Vitest</div>
          </div>

          <div className="pt-4 md:pt-0 md:pl-6 space-y-1">
            <div className="text-3xl sm:text-4xl font-extrabold text-amber-400 font-mono">4 Pilares</div>
            <div className="text-xs text-slate-300 font-semibold">Homologados no Sistema</div>
            <div className="text-[11px] text-slate-500">Status acumulado: {overallPercentage}%</div>
          </div>
        </div>
      </section>

      {/* 3. SOBRE MIM & FILOSOFIA DE ENGENHARIA */}
      <section id="sobre" className="space-y-6">
        <div className="flex items-center gap-2 border-b border-slate-800 pb-3">
          <div className="p-2 bg-cyan-950/80 border border-cyan-800 rounded-xl text-cyan-400">
            <Briefcase className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-white">Sobre Mim & Filosofia de Engenharia</h2>
            <p className="text-xs text-slate-400">Trajetória, princípios arquiteturais e foco em valor de negócio.</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-7 space-y-4 text-slate-300 text-sm leading-relaxed">
            <p>
              Sou engenheiro de software com mais de 8 anos de experiência construindo sistemas distribuídos,
              arquiteturas orientadas a eventos e aplicações corporativas de alto impacto. Minha abordagem combina
              <strong className="text-white"> rigor arquitetural</strong> (Clean Code, SOLID, Design Patterns) com a agilidade necessária para entregas contínuas de valor.
            </p>
            <p>
              Tenho forte vivência tanto no desenvolvimento de <strong className="text-cyan-300">Back-end robusto</strong> com Java (Spring Boot), Node.js (NestJS/Express) e C# .NET, quanto na criação de <strong className="text-cyan-300">Front-ends modernos e reativos</strong> utilizando Next.js 15, React 19 e TypeScript.
            </p>
            <p>
              Além do código, atuo ativamente na estruturação de <strong className="text-white">cultura DevOps</strong>, desenhando pipelines automatizados de CI/CD (GitHub Actions), suítes de testes unitários e de integração (Vitest/Jest), observabilidade e gerenciamento de bancos de dados relacionais (PostgreSQL/Supabase).
            </p>

            <div className="pt-2 flex flex-wrap gap-3">
              <a
                href="#contato"
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-slate-950 font-bold text-xs transition-colors shadow"
              >
                <Mail className="w-4 h-4" />
                <span>Solicitar Proposta / Contato</span>
              </a>
              <a
                href="#projetos"
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-200 font-semibold text-xs border border-slate-700 transition-colors"
              >
                <Boxes className="w-4 h-4 text-cyan-400" />
                <span>Ver Projetos & Demos</span>
              </a>
            </div>
          </div>

          <div className="lg:col-span-5 grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="bg-slate-900 border border-slate-800 p-4 rounded-2xl space-y-2 hover:border-cyan-500/40 transition-all">
              <div className="text-2xl">☕</div>
              <h4 className="text-sm font-bold text-white">Microsserviços & APIs</h4>
              <p className="text-xs text-slate-400">
                Arquiteturas modulares, comunicação assíncrona e endpoints RESTful documentados.
              </p>
            </div>

            <div className="bg-slate-900 border border-slate-800 p-4 rounded-2xl space-y-2 hover:border-cyan-500/40 transition-all">
              <div className="text-2xl">⚡</div>
              <h4 className="text-sm font-bold text-white">Full Stack Reativo</h4>
              <p className="text-xs text-slate-400">
                Next.js 15 App Router, React Server Components e Tailwind para interfaces velozes.
              </p>
            </div>

            <div className="bg-slate-900 border border-slate-800 p-4 rounded-2xl space-y-2 hover:border-cyan-500/40 transition-all">
              <div className="text-2xl">🏭</div>
              <h4 className="text-sm font-bold text-white">Sistemas Industriais</h4>
              <p className="text-xs text-slate-400">
                ERPs, telemetria MQTT em tempo real, C# .NET e integração de chão de fábrica.
              </p>
            </div>

            <div className="bg-slate-900 border border-slate-800 p-4 rounded-2xl space-y-2 hover:border-cyan-500/40 transition-all">
              <div className="text-2xl">🛡️</div>
              <h4 className="text-sm font-bold text-white">DevOps & QA</h4>
              <p className="text-xs text-slate-400">
                Pipelines CI/CD, testes automatizados, TDD e foco em zero defeitos em produção.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 4. TECH STACK & HABILIDADES INTERATIVAS */}
      <section id="habilidades" className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-cyan-950/80 border border-cyan-800 rounded-xl text-cyan-400">
              <Cpu className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-white">Tech Stack & Matriz de Habilidades</h2>
              <p className="text-xs text-slate-400">Tecnologias dominadas com aplicação prática em ambiente de produção.</p>
            </div>
          </div>

          {/* Category Filter Pills */}
          <div className="flex flex-wrap gap-1 bg-slate-950 p-1 rounded-xl border border-slate-800 text-xs font-semibold">
            {[
              { id: 'all', label: 'Todas' },
              { id: 'backend', label: 'Backend' },
              { id: 'frontend', label: 'Frontend' },
              { id: 'data', label: 'Dados & Cloud' },
              { id: 'devops', label: 'DevOps & QA' },
            ].map((cat) => (
              <button
                key={cat.id}
                onClick={() => setActiveSkillCategory(cat.id as any)}
                className={`px-3 py-1.5 rounded-lg transition-all ${
                  activeSkillCategory === cat.id
                    ? 'bg-cyan-600 text-slate-950 font-bold shadow'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>

        {/* Skills Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredSkills.map((skill) => (
            <div
              key={skill.name}
              className="bg-slate-900 border border-slate-800 p-5 rounded-2xl space-y-3 hover:border-cyan-500/50 transition-all group"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <span className="text-2xl">{skill.icon}</span>
                  <div>
                    <h4 className="text-sm font-bold text-white group-hover:text-cyan-300 transition-colors">
                      {skill.name}
                    </h4>
                    <span className="text-[10px] text-cyan-400 font-mono">{skill.exp}</span>
                  </div>
                </div>
                <span className="text-xs font-mono font-bold text-cyan-400 bg-cyan-950 border border-cyan-800 px-2 py-0.5 rounded">
                  {skill.level}%
                </span>
              </div>

              {/* Progress bar */}
              <div className="w-full h-2 bg-slate-950 rounded-full overflow-hidden border border-slate-800">
                <div
                  className="h-full bg-gradient-to-r from-cyan-500 to-blue-500 transition-all duration-500 rounded-full"
                  style={{ width: `${skill.level}%` }}
                ></div>
              </div>

              <p className="text-xs text-slate-400 leading-relaxed">{skill.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* 5. PROJETOS EM DESTAQUE & CASES DE SUCESSO */}
      <section id="projetos" className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-cyan-950/80 border border-cyan-800 rounded-xl text-cyan-400">
              <Layers className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-white">Projetos em Destaque & Soluções</h2>
              <p className="text-xs text-slate-400">Aplicações enterprise, sistemas industriais e provas de conceito.</p>
            </div>
          </div>

          {/* Project Filter Pills */}
          <div className="flex flex-wrap gap-1 bg-slate-950 p-1 rounded-xl border border-slate-800 text-xs font-semibold">
            {[
              { id: 'all', label: 'Todos' },
              { id: 'enterprise', label: 'Enterprise' },
              { id: 'iot', label: 'Industrial & IoT' },
              { id: 'web', label: 'Web Apps' },
              { id: 'poc', label: 'PoCs & Lab' },
            ].map((filter) => (
              <button
                key={filter.id}
                onClick={() => setActiveProjectFilter(filter.id as any)}
                className={`px-3 py-1.5 rounded-lg transition-all ${
                  activeProjectFilter === filter.id
                    ? 'bg-cyan-600 text-slate-950 font-bold shadow'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                {filter.label}
              </button>
            ))}
          </div>
        </div>

        {/* Projects Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProjects.map((proj) => (
            <div
              key={proj.id}
              className="bg-slate-900 border border-slate-800 rounded-2xl p-6 flex flex-col justify-between space-y-4 hover:border-cyan-500/50 hover:shadow-xl transition-all group"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-3xl">{proj.icon}</span>
                  <span className="text-[10px] font-mono bg-cyan-950 text-cyan-300 border border-cyan-800 px-2 py-0.5 rounded">
                    {proj.badge}
                  </span>
                </div>

                <div>
                  <h3 className="text-base font-bold text-white group-hover:text-cyan-300 transition-colors">
                    {proj.title}
                  </h3>
                  <p className="text-xs text-slate-400 mt-2 leading-relaxed">{proj.description}</p>
                </div>

                {/* Impact Pill */}
                <div className="p-2.5 bg-slate-950/80 border border-slate-800 rounded-xl text-[11px] text-emerald-300 flex items-start gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                  <span>{proj.impact}</span>
                </div>
              </div>

              <div className="space-y-3 pt-3 border-t border-slate-800/80">
                {/* Techs */}
                <div className="flex flex-wrap gap-1">
                  {proj.techs.map((tech) => (
                    <span
                      key={tech}
                      className="text-[10px] bg-slate-950 text-slate-300 border border-slate-800 px-2 py-0.5 rounded"
                    >
                      {tech}
                    </span>
                  ))}
                </div>

                {/* Actions */}
                <div className="pt-1 flex items-center justify-between gap-2">
                  <a
                    href="https://github.com/amaropedro"
                    target="_blank"
                    rel="noreferrer"
                    className="w-full bg-cyan-600/15 hover:bg-cyan-600/30 text-cyan-300 hover:text-white font-bold text-xs py-2 px-3 rounded-xl border border-cyan-500/20 hover:border-cyan-500/40 transition-all flex items-center justify-center gap-1.5"
                  >
                    <span>Ver Repositório no GitHub</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 6. VISÃO GERAL DOS 4 PILARES ESTRATÉGICOS (DO BANCO DE DADOS) */}
      <section className="space-y-4">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div>
            <h3 className="text-xl font-bold text-white flex items-center gap-2">
              <span>📊</span> 4 Pilares Estratégicos & Homologação
            </h3>
            <p className="text-xs text-slate-400">
              Acompanhamento de entregáveis, tarefas e conformidade técnica registrada no banco de dados.
            </p>
          </div>
        </div>

        {phases.length === 0 ? (
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 text-center space-y-3">
            <p className="text-xs text-slate-400">
              Sincronizando dados dos pilares técnicos...
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {phases.map((phase) => (
              <div
                key={phase.id}
                className="bg-slate-900 border border-slate-800 p-5 rounded-2xl space-y-3 hover:border-cyan-500/50 transition-all group"
              >
                <div className="flex items-center justify-between">
                  <span className="text-2xl">{phase.icon}</span>
                  <span className="text-xs font-bold font-mono text-cyan-400 bg-cyan-950 border border-cyan-800 px-2 py-0.5 rounded">
                    {getPhasePercentage(phase.id)}%
                  </span>
                </div>

                <div>
                  <h4 className="text-sm font-bold text-white group-hover:text-cyan-300 transition-colors">
                    {phase.title}
                  </h4>
                  <p className="text-xs text-slate-400 mt-1 line-clamp-2">{phase.subtitle}</p>
                </div>

                {/* Mini Progress bar */}
                <div className="w-full h-2 bg-slate-950 rounded-full overflow-hidden border border-slate-800">
                  <div
                    className="h-full bg-cyan-500 transition-all duration-300"
                    style={{ width: `${getPhasePercentage(phase.id)}%` }}
                  ></div>
                </div>

                <div className="flex items-center justify-between text-[11px] text-slate-500 pt-1">
                  <span>
                    {getPhaseCompletedCount(phase.id)}/{getPhaseTotalCount(phase.id)} itens
                  </span>
                  <span className="text-cyan-400 font-medium">
                    Homologado ✓
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* 7. LINHA DO TEMPO / EXPERIÊNCIA & FORMAÇÃO */}
      <section id="experiencia" className="space-y-6">
        <div className="flex items-center gap-2 border-b border-slate-800 pb-3">
          <div className="p-2 bg-cyan-950/80 border border-cyan-800 rounded-xl text-cyan-400">
            <Award className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-white">Trajetória Profissional & Experiência</h2>
            <p className="text-xs text-slate-400">Evolução de carreira e marcos em engenharia de software.</p>
          </div>
        </div>

        <div className="relative border-l-2 border-slate-800 ml-4 pl-6 space-y-8">
          {/* Timeline Item 1 */}
          <div className="relative group">
            <div className="absolute -left-[31px] top-1.5 w-4 h-4 rounded-full bg-cyan-500 border-4 border-slate-950 group-hover:scale-125 transition-transform"></div>
            <div className="space-y-1">
              <span className="text-[11px] font-mono text-cyan-400 bg-cyan-950/80 border border-cyan-800 px-2 py-0.5 rounded">
                2022 - Presente
              </span>
              <h3 className="text-base font-bold text-white">Senior Full Stack & Arquiteto DevOps</h3>
              <p className="text-xs text-slate-400 font-semibold">Soluções Corporativas & Cloud</p>
              <p className="text-xs text-slate-300 leading-relaxed pt-1">
                Liderança técnica no desenvolvimento de plataformas em Java (Spring Boot) e Next.js 15, arquitetura de microsserviços, modelagem de banco de dados PostgreSQL/Supabase e implementação de esteiras de CI/CD automatizadas com GitHub Actions.
              </p>
            </div>
          </div>

          {/* Timeline Item 2 */}
          <div className="relative group">
            <div className="absolute -left-[31px] top-1.5 w-4 h-4 rounded-full bg-blue-500 border-4 border-slate-950 group-hover:scale-125 transition-transform"></div>
            <div className="space-y-1">
              <span className="text-[11px] font-mono text-blue-400 bg-blue-950/80 border border-blue-800 px-2 py-0.5 rounded">
                2019 - 2022
              </span>
              <h3 className="text-base font-bold text-white">Engenheiro de Software Full Stack</h3>
              <p className="text-xs text-slate-400 font-semibold">Sistemas Industriais & Web Applications</p>
              <p className="text-xs text-slate-300 leading-relaxed pt-1">
                Desenvolvimento de sistemas ERP com C# .NET 8 e telemetria de sensores industriais via MQTT. Criação de SPAs e APIs RESTful em Node.js e TypeScript com alta taxa de transferência.
              </p>
            </div>
          </div>

          {/* Timeline Item 3 */}
          <div className="relative group">
            <div className="absolute -left-[31px] top-1.5 w-4 h-4 rounded-full bg-emerald-500 border-4 border-slate-950 group-hover:scale-125 transition-transform"></div>
            <div className="space-y-1">
              <span className="text-[11px] font-mono text-emerald-400 bg-emerald-950/80 border border-emerald-800 px-2 py-0.5 rounded">
                2016 - 2019
              </span>
              <h3 className="text-base font-bold text-white">Desenvolvedor Backend & Banco de Dados</h3>
              <p className="text-xs text-slate-400 font-semibold">Soluções Corporativas & SQL</p>
              <p className="text-xs text-slate-300 leading-relaxed pt-1">
                Construção e manutenção de APIs corporativas, rotinas de ETL e procedures complexas em PostgreSQL e SQL Server. Implementação de testes unitários e refatoração de sistemas legados.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 8. FORMULÁRIO DE CONTATO & CANAIS DIRETOS */}
      <section id="contato" className="space-y-6">
        <div className="flex items-center gap-2 border-b border-slate-800 pb-3">
          <div className="p-2 bg-cyan-950/80 border border-cyan-800 rounded-xl text-cyan-400">
            <Mail className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-white">Vamos Conversar? Entre em Contato</h2>
            <p className="text-xs text-slate-400">
              Tem um projeto, ideia ou desafio técnico? Envie uma mensagem direta.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Direct Info Card */}
          <div className="lg:col-span-5 bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-6 flex flex-col justify-between">
            <div className="space-y-4">
              <h3 className="text-lg font-bold text-white">Canais de Contato Direto</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Estou aberto para oportunidades de desenvolvimento, consultorias arquiteturais, auditoria de código e posições de liderança técnica.
              </p>

              <div className="space-y-3 pt-2">
                <a
                  href="mailto:arcamos.j@gmail.com"
                  className="flex items-center gap-3 p-3 bg-slate-950 border border-slate-800 hover:border-cyan-500/40 rounded-xl transition-all group"
                >
                  <div className="p-2 bg-cyan-950 text-cyan-400 rounded-lg group-hover:scale-110 transition-transform">
                    <Mail className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-[11px] text-slate-400">E-mail Profissional</div>
                    <div className="text-xs font-bold text-white group-hover:text-cyan-300">arcamos.j@gmail.com</div>
                  </div>
                </a>

                <a
                  href="https://github.com/amaropedro"
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-3 p-3 bg-slate-950 border border-slate-800 hover:border-cyan-500/40 rounded-xl transition-all group"
                >
                  <div className="p-2 bg-slate-900 text-slate-200 rounded-lg group-hover:scale-110 transition-transform">
                    <Github className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-[11px] text-slate-400">Repositórios & Código</div>
                    <div className="text-xs font-bold text-white group-hover:text-cyan-300">github.com/amaropedro</div>
                  </div>
                </a>

                <div className="flex items-center gap-3 p-3 bg-slate-950 border border-slate-800 rounded-xl">
                  <div className="p-2 bg-blue-950 text-blue-400 rounded-lg">
                    <MapPin className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-[11px] text-slate-400">Localização</div>
                    <div className="text-xs font-bold text-white">Brasil (Atuação Remota Global)</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Availability & Engagements */}
            <div className="pt-4 border-t border-slate-800 space-y-2">
              <div className="text-[11px] font-semibold text-slate-400">Modalidades de Atuação:</div>
              <div className="flex flex-wrap gap-2 text-[11px] font-medium">
                <span className="bg-slate-950 px-2.5 py-1 rounded-lg border border-slate-800 text-cyan-300">
                  ⚡ 100% Remoto ou Híbrido
                </span>
                <span className="bg-slate-950 px-2.5 py-1 rounded-lg border border-slate-800 text-emerald-300">
                  💼 Contratos PJ / CLT / Freelance
                </span>
                <span className="bg-slate-950 px-2.5 py-1 rounded-lg border border-slate-800 text-blue-300">
                  🛡️ Consultoria & Arquitetura
                </span>
              </div>
            </div>
          </div>

          {/* Interactive Form Card */}
          <div className="lg:col-span-7 bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl">
            {contactSubmitted ? (
              <div className="py-12 text-center space-y-4 animate-fadeIn">
                <div className="w-14 h-14 bg-emerald-950 border border-emerald-500/50 text-emerald-400 rounded-full flex items-center justify-center mx-auto text-2xl shadow-lg">
                  ✓
                </div>
                <h3 className="text-xl font-bold text-white">Mensagem Enviada com Sucesso!</h3>
                <p className="text-xs text-slate-300 max-w-md mx-auto leading-relaxed">
                  Obrigado pelo contato, <strong className="text-white">{contactForm.name || 'parceiro'}</strong>. Responderei seu e-mail no menor tempo possível.
                </p>
                <button
                  onClick={() => setContactSubmitted(false)}
                  className="bg-cyan-600 hover:bg-cyan-500 text-slate-950 font-bold text-xs px-5 py-2.5 rounded-xl transition-all"
                >
                  Enviar Outra Mensagem
                </button>
              </div>
            ) : (
              <form onSubmit={handleContactSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-slate-300">Seu Nome *</label>
                    <input
                      type="text"
                      required
                      placeholder="Ex: Carlos Silva"
                      value={contactForm.name}
                      onChange={(e) => setContactForm({ ...contactForm, name: e.target.value })}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 transition-colors"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-slate-300">Seu E-mail *</label>
                    <input
                      type="email"
                      required
                      placeholder="Ex: carlos@empresa.com"
                      value={contactForm.email}
                      onChange={(e) => setContactForm({ ...contactForm, email: e.target.value })}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 transition-colors"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-300">Assunto</label>
                  <input
                    type="text"
                    placeholder="Ex: Proposta de Projeto / Consultoria Técnica"
                    value={contactForm.subject}
                    onChange={(e) => setContactForm({ ...contactForm, subject: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 transition-colors"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-300">Mensagem *</label>
                  <textarea
                    required
                    rows={4}
                    placeholder="Conte um pouco sobre sua ideia, projeto ou desafio técnico..."
                    value={contactForm.message}
                    onChange={(e) => setContactForm({ ...contactForm, message: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 transition-colors resize-none"
                  ></textarea>
                </div>

                <button
                  type="submit"
                  disabled={isSending}
                  className="w-full bg-cyan-500 hover:bg-cyan-400 disabled:opacity-50 text-slate-950 font-extrabold text-xs py-3.5 rounded-xl transition-all flex items-center justify-center gap-2 shadow-lg shadow-cyan-500/20"
                >
                  {isSending ? (
                    <span>Enviando mensagem...</span>
                  ) : (
                    <>
                      <Send className="w-4 h-4" />
                      <span>Enviar Mensagem Agora</span>
                    </>
                  )}
                </button>
              </form>
            )}
          </div>
        </div>
      </section>
    </div>
  );
};

