'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { Phase, Task } from '@/types';
import { RESUME_DATA, SKILLS_MATRIX } from '@/data/constants';
import { isDisabledStatus, isTaskFinished } from '@/lib/validators';
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
  GraduationCap
} from 'lucide-react';

interface HomeTabProps {
  phases: Phase[];
  tasks: Task[];
  setActiveTab: (tab: string) => void;
  setSelectedPhaseFilter: (phaseId: string) => void;
  onOpenAdmin?: () => void;
  onOpenDiagnostics?: () => void;
}

const WhatsAppIcon = () => (
  <svg viewBox="0 0 24 24" aria-hidden="true" className="w-4 h-4 fill-current">
    <path d="M12.04 2C6.58 2 2.15 6.39 2.15 11.82c0 1.96.57 3.86 1.65 5.48L2 22l4.89-1.57a9.8 9.8 0 0 0 5.15 1.58h.01c5.46 0 9.89-4.39 9.89-9.82A9.86 9.86 0 0 0 12.04 2Zm5.31 13.83c-.23.66-1.34 1.24-1.86 1.31-.48.07-1.08.09-3.47-.74-2.94-.83-4.83-3.2-4.98-3.35-.15-.15-1.22-1.62-1.22-3.09 0-1.47.77-2.2 1.04-2.5.27-.29.59-.36.79-.36h.57c.18 0 .43.01.66.5.27.56.92 1.94.99 2.08.08.14.13.3.03.48-.1.18-.15.29-.3.46-.15.17-.32.39-.45.52-.15.15-.3.31-.13.61.17.3.75 1.24 1.61 2 1.1.98 2.04 1.28 2.34 1.43.3.15.47.13.64-.08.17-.2.73-.85.93-1.14.2-.29.4-.24.67-.14.27.1 1.72.81 2.02.96.3.15.5.22.57.35.07.13.07.75-.16 1.41Z" />
  </svg>
);

export const HomeTab: React.FC<HomeTabProps> = ({
  phases,
  tasks,
  setActiveTab,
  setSelectedPhaseFilter,
  onOpenAdmin,
  onOpenDiagnostics,
}) => {
  // Skill category filter
  const [activeSkillCategory, setActiveSkillCategory] = useState<'all' | 'languages' | 'tools'>('all');

  // Contact form state
  const [contactForm, setContactForm] = useState({ name: '', email: '', subject: '', message: '' });
  const [contactSubmitted, setContactSubmitted] = useState(false);
  const [isSending, setIsSending] = useState(false);

  // Stats calculation
  const activeTasks = tasks.filter((task) => !isDisabledStatus(task.status));
  const totalTasks = activeTasks.length;
  const completedTasks = activeTasks.filter(isTaskFinished).length;
  const overallPercentage = totalTasks === 0 ? 0 : Math.round((completedTasks / totalTasks) * 100);

  const getPhaseCompletedCount = (phaseId: number) => {
    return activeTasks.filter((t) => Number(t.phase) === Number(phaseId) && isTaskFinished(t)).length;
  };

  const getPhaseTotalCount = (phaseId: number) => {
    return activeTasks.filter((t) => Number(t.phase) === Number(phaseId)).length;
  };

  const getPhasePercentage = (phaseId: number) => {
    const total = getPhaseTotalCount(phaseId);
    if (total === 0) return 0;
    return Math.round((getPhaseCompletedCount(phaseId) / total) * 100);
  };

  const handleContactSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!contactForm.name || !contactForm.email || !contactForm.message) return;

    setIsSending(true);

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(contactForm),
      });

      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        throw new Error(data?.error || data?.message || 'Não foi possível enviar a mensagem.');
      }

      setContactSubmitted(true);
      setContactForm({ name: '', email: '', subject: '', message: '' });
      setTimeout(() => setContactSubmitted(false), 6000);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Não foi possível enviar a mensagem.';
      setContactSubmitted(false);
      alert(message);
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className="space-y-16 lg:space-y-24">
      {/* 1. HERO SECTION */}
      <section id="hero" className="relative pt-2 pb-6">
        {/* Ambient Glows */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 sm:w-[600px] h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none -z-10"></div>
        <div className="absolute top-1/3 right-10 w-72 h-72 bg-blue-600/10 rounded-full blur-3xl pointer-events-none -z-10"></div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
          {/* Left Column: Bio & Intro */}
          <div className="lg:col-span-7 space-y-6 text-left">

            {/* Main Headline */}
            <div className="space-y-2">
              <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-white tracking-tight leading-[1.1]">
                <span className="bg-gradient-to-r from-cyan-400 via-teal-300 to-blue-400 bg-clip-text text-transparent">
                  {RESUME_DATA.name}
                </span>
              </h1>
              <p className="text-lg sm:text-xl font-bold text-slate-200 pt-1">
                {RESUME_DATA.title}
              </p>
            </div>

            {/* Description */}
            <p className="text-sm sm:text-base text-slate-300 leading-relaxed max-w-2xl">
              {RESUME_DATA.summary}
            </p>

                        {/* Action Buttons CTA */}
            <div className="pt-3 flex flex-col sm:flex-row items-stretch sm:items-center gap-3.5">
              <a
                href="#projetos"
                className="bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-extrabold text-sm px-6 py-3.5 rounded-xl transition-all flex items-center justify-center gap-2 shadow-lg shadow-cyan-500/20 hover:scale-[1.02] active:scale-95"
              >
                <Zap className="w-4 h-4 fill-current" />
                <span>Ver Projetos</span>
              </a>

              <a
                href="#experiencia"
                className="bg-slate-900 hover:bg-slate-800 text-cyan-300 hover:text-white font-bold text-sm px-5 py-3.5 rounded-xl border border-slate-700/80 transition-all flex items-center justify-center gap-2 shadow hover:border-cyan-500/40"
              >
                <Briefcase className="w-4 h-4 text-cyan-400" />
                <span>Experiência</span>
              </a>

              <a
                href="#contato"
                className="bg-slate-950 hover:bg-slate-900 text-slate-300 hover:text-white font-semibold text-sm px-5 py-3.5 rounded-xl border border-slate-800 transition-all flex items-center justify-center gap-2"
              >
                <Mail className="w-4 h-4 text-cyan-400" />
                <span>Fale Comigo</span>
              </a>
            </div>


                        {/* Quick Contact & Social Chips */}
            <div className="pt-2 flex flex-col sm:flex-row flex-wrap items-start sm:items-center gap-x-4 gap-y-2 text-xs text-slate-400">
              <div className="flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-cyan-400" />
                <span>São Paulo/SP</span>
              </div>
              <span className="hidden sm:inline text-slate-700">•</span>
              <div className="flex items-center gap-1.5">
                <Mail className="w-3.5 h-3.5 text-cyan-400" />
                <span className="font-mono text-slate-300 break-all">{RESUME_DATA.email}</span>
              </div>
              <span className="hidden sm:inline text-slate-700">•</span>
              <div className="flex gap-4">
                <a
                  href={RESUME_DATA.github}
                  target="_blank"
                  rel="noreferrer"
                  className="hover:text-cyan-300 transition-colors flex items-center gap-1"
                >
                  <Github className="w-3.5 h-3.5" />
                  <span>GitHub</span>
                </a>
                <a
                  href={RESUME_DATA.linkedin}
                  target="_blank"
                  rel="noreferrer"
                  className="hover:text-cyan-300 transition-colors flex items-center gap-1"
                >
                  <Linkedin className="w-3.5 h-3.5 text-blue-400" />
                  <span>LinkedIn</span>
                </a>
              </div>
            </div>

          </div>

          {/* Right Column: Avatar Frame */}
          <div className="lg:col-span-5 flex justify-center">
            <div className="relative w-full max-w-sm sm:max-w-md group">
              {/* Animated Outer Frame */}
              <div className="absolute -inset-1.5 bg-gradient-to-r from-cyan-500 via-blue-500 to-emerald-400 rounded-3xl blur-md opacity-40 group-hover:opacity-75 transition duration-700"></div>

              {/* Main Card */}
              <div className="relative bg-slate-900/90 border border-slate-800 rounded-3xl p-5 shadow-2xl backdrop-blur-xl space-y-4">
                {/* Photo */}
                <a
                  href={RESUME_DATA.linkedin}
                  target="_blank"
                  rel="noreferrer"
                  title="Ir para o LinkedIn de Amaro Pedro"
                  aria-label="Abrir o LinkedIn de Amaro Pedro"
                  className="relative block w-full aspect-square rounded-2xl overflow-hidden border border-slate-700/80 bg-slate-950 cursor-pointer"
                >
                  <Image
                    src="/amaro_avatar.jpg"
                    alt="Amaro Pedro da Silva Junior - Desenvolvedor Full Stack"
                    fill
                    sizes="(max-width: 768px) 100vw, 400px"
                    className="object-cover object-center group-hover:scale-105 transition-transform duration-700"
                    priority
                    referrerPolicy="no-referrer"
                  />

                  {/* Gradient Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent"></div>
                </a>

                {/* Main Tech Highlights */}
                <div className="grid grid-cols-2 gap-2 pt-1">
                  <div className="bg-slate-950/80 border border-slate-800 p-2.5 rounded-xl flex items-center gap-2">
                    <span className="text-lg">☕</span>
                    <div>
                      <div className="text-[11px] font-bold text-white">Java & Spring Boot</div>
                      <div className="text-[10px] text-slate-400">APIs, Maven, Microserviços</div>
                    </div>
                  </div>

                  <div className="bg-slate-950/80 border border-slate-800 p-2.5 rounded-xl flex items-center gap-2">
                    <span className="text-lg">⚡</span>
                    <div>
                      <div className="text-[11px] font-bold text-white">TypeScript & Node.js</div>
                      <div className="text-[10px] text-slate-400">Vue.js, React, React Native</div>
                    </div>
                  </div>

                  <div className="bg-slate-950/80 border border-slate-800 p-2.5 rounded-xl flex items-center gap-2">
                    <span className="text-lg">🔷</span>
                    <div>
                      <div className="text-[11px] font-bold text-white">C# & Stack Microsoft</div>
                      <div className="text-[10px] text-slate-400">SQL Server, Razor, MVC</div>
                    </div>
                  </div>

                  <div className="bg-slate-950/80 border border-slate-800 p-2.5 rounded-xl flex items-center gap-2">
                    <span className="text-lg">🐘</span>
                    <div>
                      <div className="text-[11px] font-bold text-white">Bancos de Dados SQL</div>
                      <div className="text-[10px] text-slate-400">PostgreSQL, MySQL, PL/SQL</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

            {/* 2. NUMBERS & HIGHLIGHTS */}
      <section className="bg-slate-900/80 border border-slate-800/80 rounded-2xl p-6 shadow-xl">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 text-center divide-y lg:divide-y-0 lg:divide-x divide-slate-800">
          
          {/* 1. Full Stack */}
          <div className="group relative py-2 lg:py-0 space-y-1 cursor-pointer">
            <div className="text-3xl sm:text-4xl font-extrabold text-cyan-400 font-mono transition-transform duration-200 group-hover:scale-105">
              Full Stack
            </div>
            <div className="text-xs text-slate-300 font-semibold">Perfil Técnico</div>
            <div className="text-[11px] text-slate-500">Desenvolvimento de ponta a ponta</div>

                        {/* Tooltip super enxuto */}
            <div className="absolute left-1/2 -translate-x-1/2 bottom-full mb-3 px-3 py-1.5 bg-slate-800 text-slate-200 text-[10px] font-medium rounded-md shadow-xl border border-slate-700 opacity-0 pointer-events-none group-hover:opacity-100 transition-all duration-200 z-20 whitespace-nowrap">
              Domínio completo de Front-end (React/Next.js) e Back-end (Node/Java/C#)
              <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-slate-800" />
            </div>
          </div>

          {/* 2. SolutionTrue */}
          <div className="group relative py-4 lg:py-0 lg:pl-6 space-y-1 cursor-pointer">
            <div className="text-3xl sm:text-4xl font-extrabold text-emerald-400 font-mono transition-transform duration-200 group-hover:scale-105">
              SolutionTrue
            </div>
            <div className="text-xs text-slate-300 font-semibold">2020 – 2025</div>
            <div className="text-[11px] text-slate-500">E-Commerce & ERP Industrial</div>

            {/* Tooltip super enxuto */}
            <div className="absolute left-1/2 -translate-x-1/2 bottom-full mb-3 px-3 py-1.5 bg-slate-800 text-slate-200 text-[10px] font-medium rounded-md shadow-xl border border-slate-700 opacity-0 pointer-events-none group-hover:opacity-100 transition-all duration-200 z-20 whitespace-nowrap">
              Liderança técnica em projetos de E-commerce e Automação Industrial
              <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-slate-800" />
            </div>
          </div>

          {/* 3. ADS */}
          <div className="group relative py-4 lg:py-0 lg:pl-6 space-y-1 cursor-pointer">
            <div className="text-3xl sm:text-4xl font-extrabold text-blue-400 font-mono transition-transform duration-200 group-hover:scale-105">
              ADS
            </div>
            <div className="text-xs text-slate-300 font-semibold">UNIP – Conclusão 2019</div>
            <div className="text-[11px] text-slate-500">Análise e Des. de Sistemas</div>

            {/* Tooltip super enxuto */}
            <div className="absolute left-1/2 -translate-x-1/2 bottom-full mb-3 px-3 py-1.5 bg-slate-800 text-slate-200 text-[10px] font-medium rounded-md shadow-xl border border-slate-700 opacity-0 pointer-events-none group-hover:opacity-100 transition-all duration-200 z-20 whitespace-nowrap">
              Graduação em Análise e Desenvolvimento de Sistemas (UNIP)
              <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-slate-800" />
            </div>
          </div>

          {/* 4. Scrum */}
          <div className="group relative py-4 lg:py-0 lg:pl-6 space-y-1 cursor-pointer">
            <div className="text-3xl sm:text-4xl font-extrabold text-amber-400 font-mono transition-transform duration-200 group-hover:scale-105">
              Scrum
            </div>
            <div className="text-xs text-slate-300 font-semibold">Metodologias Ágeis</div>
            <div className="text-[11px] text-slate-500">Git, TFS, CI/CD e Código Limpo</div>

            {/* Tooltip super enxuto */}
            <div className="absolute left-1/2 -translate-x-1/2 bottom-full mb-3 px-3 py-1.5 bg-slate-800 text-slate-200 text-[10px] font-medium rounded-md shadow-xl border border-slate-700 opacity-0 pointer-events-none group-hover:opacity-100 transition-all duration-200 z-20 whitespace-nowrap">
              Foco em entregas ágeis, qualidade de código e automação (CI/CD)
              <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-slate-800" />
            </div>
          </div>


        </div>
      </section>

      {/* 4. EXPERIÊNCIA PROFISSIONAL */}
      <section id="experiencia" className="space-y-6">
        <div className="flex items-center gap-2 border-b border-slate-800 pb-3">
          <div className="p-2 bg-cyan-950/80 border border-cyan-800 rounded-xl text-cyan-400">
            <Award className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-white">Experiência Profissional</h2>
            <p className="text-xs text-slate-400">Histórico de atuação profissional extraído do currículo.</p>
          </div>
        </div>

        <div className="space-y-6">
          {RESUME_DATA.experiences.map((exp, index) => (
            <div
              key={index}
              className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4 hover:border-cyan-500/40 transition-all"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800/80 pb-3">
                <div>
                  <h3 className="text-lg font-bold text-white">{exp.role}</h3>
                  <div className="text-sm font-semibold text-cyan-400">{exp.company} • <span className="text-slate-400 font-normal">{exp.location}</span></div>
                </div>
                <span className="text-xs font-mono bg-cyan-950 text-cyan-300 border border-cyan-800 px-3 py-1 rounded-full self-start sm:self-auto">
                  {exp.period}
                </span>
              </div>

              <ul className="space-y-2 text-xs text-slate-300 leading-relaxed">
                {exp.highlights.map((item, hIdx) => (
                  <li key={hIdx} className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>

              <div className="pt-2 flex flex-wrap gap-1.5">
                {exp.technologies.map((tech) => (
                  <span
                    key={tech}
                    className="text-[10px] bg-slate-950 text-slate-300 border border-slate-800 px-2.5 py-1 rounded-lg"
                  >
                    {tech}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 5. PROJETOS & REALIZAÇÕES */}
      <section id="projetos" className="space-y-6">
        <div className="flex items-center gap-2 border-b border-slate-800 pb-3">
          <div className="p-2 bg-cyan-950/80 border border-cyan-800 rounded-xl text-cyan-400">
            <Layers className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-white">Projetos & Atuações Profissionais</h2>
            <p className="text-xs text-slate-400">Soluções e sistemas desenvolvidos ao longo da trajetória.</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {RESUME_DATA.projects.map((proj) => (
            <div
              key={proj.id}
              className="bg-slate-900 border border-slate-800 rounded-2xl p-6 flex flex-col justify-between space-y-4 hover:border-cyan-500/50 hover:shadow-xl transition-all group"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono bg-cyan-950 text-cyan-300 border border-cyan-800 px-2.5 py-1 rounded-full">
                    {proj.badge}
                  </span>
                </div>

                <div>
                  <h3 className="text-base font-bold text-white group-hover:text-cyan-300 transition-colors">
                    {proj.title}
                  </h3>
                  <div className="text-xs font-semibold text-cyan-400/80 mt-0.5">{proj.company}</div>
                  <p className="text-xs text-slate-400 mt-2 leading-relaxed">{proj.description}</p>
                </div>
              </div>

              <div className="space-y-3 pt-3 border-t border-slate-800/80">
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
              </div>
            </div>
          ))}
        </div>

        {/* Banner para o Laboratório Dev */}
        <div className="bg-gradient-to-r from-slate-900 via-cyan-950/40 to-slate-900 border border-cyan-500/30 rounded-2xl p-6 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-lg shadow-cyan-950/20 hover:border-cyan-400 transition-all">
          <div className="space-y-1 text-center sm:text-left">
            <div className="flex items-center gap-2 justify-center sm:justify-start">
              <span className="text-2xl"><Github className="w-6 h-6" /></span>
              <h3 className="text-base font-extrabold text-white">Projetos Pessoais</h3>
            </div>
            <p className="text-xs text-slate-300">
              Acesse a visão técnica com o roadmap do sistema, checklist interativo, especificações e automação CI/CD.
            </p>
          </div>
          <button
            onClick={() => setActiveTab && setActiveTab('roadmap')}
            className="shrink-0 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-black text-xs sm:text-sm px-5 py-3 rounded-xl transition-all shadow-md shadow-cyan-500/20 hover:scale-[1.02] active:scale-95 flex items-center gap-2"
          >
            <span>Acessar Projetos</span>
            <ExternalLink className="w-4 h-4" />
          </button>
        </div>
      </section>

      {/* 6. HABILIDADES TÉCNICAS */}
      <section id="habilidades" className="space-y-6">
        <div className="flex items-center gap-2 border-b border-slate-800 pb-3">
          <div className="p-2 bg-cyan-950/80 border border-cyan-800 rounded-xl text-cyan-400">
            <Cpu className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-white">Habilidades Técnicas</h2>
            <p className="text-xs text-slate-400">Linguagens, frameworks, bancos de dados e ferramentas do currículo.</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Linguagens & Frameworks */}
          <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl space-y-4">
            <h3 className="text-sm font-bold text-cyan-300 uppercase tracking-wider flex items-center gap-2">
              <Code2 className="w-4 h-4" />
              Linguagens & Frameworks
            </h3>
            <div className="flex flex-wrap gap-2">
              {RESUME_DATA.skills.languagesAndFrameworks.map((skill) => (
                <span
                  key={skill}
                  className="bg-slate-950 border border-cyan-500/30 text-slate-200 px-3 py-1.5 rounded-xl text-xs font-semibold shadow-sm"
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>

          {/* Bancos de Dados & Ferramentas */}
          <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl space-y-4">
            <h3 className="text-sm font-bold text-cyan-300 uppercase tracking-wider flex items-center gap-2">
              <Database className="w-4 h-4" />
              Bancos de Dados & Ferramentas
            </h3>
            <div className="flex flex-wrap gap-2">
              {RESUME_DATA.skills.databasesAndTools.map((tool) => (
                <span
                  key={tool}
                  className="bg-slate-950 border border-slate-800 text-slate-200 px-3 py-1.5 rounded-xl text-xs font-semibold shadow-sm"
                >
                  {tool}
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 7. FORMAÇÃO ACADÊMICA */}
      <section id="formacao" className="space-y-6">
        <div className="flex items-center gap-2 border-b border-slate-800 pb-3">
          <div className="p-2 bg-cyan-950/80 border border-cyan-800 rounded-xl text-cyan-400">
            <GraduationCap className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-white">Formação Acadêmica</h2>
            <p className="text-xs text-slate-400">Graduação e cursos técnicos.</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {RESUME_DATA.education.map((edu, idx) => (
            <div
              key={idx}
              className="bg-slate-900 border border-slate-800 p-6 rounded-2xl space-y-3 hover:border-cyan-500/40 transition-all flex items-start gap-4"
            >
              <div className="text-3xl p-3 bg-slate-950 border border-slate-800 rounded-xl shrink-0">
                {edu.icon}
              </div>
              <div className="space-y-1">
                <span className="text-[10px] font-mono bg-cyan-950 text-cyan-300 border border-cyan-800 px-2 py-0.5 rounded">
                  {edu.type}
                </span>
                <h3 className="text-sm font-bold text-white">{edu.degree}</h3>
                <div className="text-xs text-cyan-400">{edu.institution}</div>
                <div className="text-xs text-slate-400">{edu.period}</div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 8. CONTATO */}
      <section id="contato" className="space-y-6">
        <div className="flex items-center gap-2 border-b border-slate-800 pb-3">
          <div className="p-2 bg-cyan-950/80 border border-cyan-800 rounded-xl text-cyan-400">
            <Mail className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-white">Contato Direto</h2>
            <p className="text-xs text-slate-400">Informações de contato extraídas do currículo.</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Info Card */}
          <div className="lg:col-span-5 bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-6 flex flex-col justify-between">
            <div className="space-y-4">
              <h3 className="text-lg font-bold text-white">Canais de Contato</h3>

              <div className="space-y-3 pt-2">
                <a
                  href={`mailto:${RESUME_DATA.email}`}
                  className="flex items-center gap-3 p-3 bg-slate-950 border border-slate-800 hover:border-cyan-500/40 rounded-xl transition-all group"
                >
                  <div className="p-2 bg-cyan-950 text-cyan-400 rounded-lg group-hover:scale-110 transition-transform">
                    <Mail className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-[11px] text-slate-400">E-mail Profissional</div>
                    <div className="text-xs font-bold text-white group-hover:text-cyan-300">{RESUME_DATA.email}</div>
                  </div>
                </a>

                <a
                  href={RESUME_DATA.whatsapp}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-3 p-3 bg-slate-950 border border-slate-800 hover:border-emerald-500/40 rounded-xl transition-all group"
                >
                  <div className="p-2 bg-emerald-950 text-emerald-400 rounded-lg group-hover:scale-110 transition-transform">
                    <WhatsAppIcon />
                  </div>
                  <div>
                    <div className="text-[11px] text-slate-400">WhatsApp</div>
                    <div className="text-xs font-bold text-white group-hover:text-emerald-300">{RESUME_DATA.phones.join(' / ')}</div>
                  </div>
                </a>

                <a
                  href={RESUME_DATA.linkedin}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-3 p-3 bg-slate-950 border border-slate-800 hover:border-cyan-500/40 rounded-xl transition-all group"
                >
                  <div className="p-2 bg-blue-950 text-blue-400 rounded-lg group-hover:scale-110 transition-transform">
                    <Linkedin className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-[11px] text-slate-400">LinkedIn</div>
                    <div className="text-xs font-bold text-white group-hover:text-cyan-300">{RESUME_DATA.linkedinDisplay}</div>
                  </div>
                </a>

                <a
                  href={RESUME_DATA.github}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-3 p-3 bg-slate-950 border border-slate-800 hover:border-cyan-500/40 rounded-xl transition-all group"
                >
                  <div className="p-2 bg-slate-900 text-slate-200 rounded-lg group-hover:scale-110 transition-transform">
                    <Github className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-[11px] text-slate-400">GitHub</div>
                    <div className="text-xs font-bold text-white group-hover:text-cyan-300">{RESUME_DATA.githubDisplay}</div>
                  </div>
                </a>

                <div className="flex items-center gap-3 p-3 bg-slate-950 border border-slate-800 rounded-xl">
                  <div className="p-2 bg-cyan-950 text-cyan-400 rounded-lg">
                    <MapPin className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-[11px] text-slate-400">Endereço</div>
                    <div className="text-xs font-bold text-white">{RESUME_DATA.address}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Form */}
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
                    placeholder="Ex: Oportunidade de Trabalho / Desenvolvimento"
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
                    placeholder="Sua mensagem..."
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
                      <span>Enviar Mensagem</span>
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


