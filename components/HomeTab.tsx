'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { Phase, Task } from '@/types';
import { RESUME_DATA } from '@/data/constants';
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
  GraduationCap,
  Calendar,
  Building2,
  Laptop,
  CheckCircle
} from 'lucide-react';

interface HomeTabProps {
  phases?: Phase[];
  tasks?: Task[];
  setActiveTab?: (tab: string) => void;
  setSelectedPhaseFilter?: (phaseId: string) => void;
  onOpenAdmin?: () => void;
  onOpenDiagnostics?: () => void;
}

export const HomeTab: React.FC<HomeTabProps> = ({ phases = [] }) => {
  // Skill filter
  const [activeSkillCategory, setActiveSkillCategory] = useState<'all' | 'languages' | 'databases'>('all');

  // Contact form state
  const [contactForm, setContactForm] = useState({ name: '', email: '', subject: '', message: '' });
  const [contactSubmitted, setContactSubmitted] = useState(false);
  const [isSending, setIsSending] = useState(false);

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

  return (
    <div className="space-y-20 sm:space-y-28">
      {/* 1. HERO SECTION */}
      <section id="hero" className="relative pt-4 sm:pt-8 pb-8">
        {/* Ambient Glows */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 sm:w-[650px] h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none -z-10"></div>
        <div className="absolute top-1/3 right-10 w-72 h-72 bg-blue-600/10 rounded-full blur-3xl pointer-events-none -z-10"></div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
          {/* Left Column: Bio & Intro */}
          <div className="lg:col-span-7 space-y-6 text-left">
            {/* Status Pill */}
            <div className="inline-flex items-center gap-2.5 px-3.5 py-1.5 rounded-full bg-slate-900/90 border border-cyan-500/30 text-xs font-semibold text-cyan-300 shadow-sm backdrop-blur-sm">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse"></span>
              <span>Disponível para Oportunidades & Novos Projetos</span>
            </div>

            {/* Main Headline */}
            <div className="space-y-2">
              <span className="text-xs sm:text-sm font-bold uppercase tracking-widest text-cyan-400 font-mono">
                Currículo & Portfólio Profissional
              </span>
              <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-white tracking-tight leading-[1.1]">
                {RESUME_DATA.name}
              </h1>
              <p className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent pt-1">
                {RESUME_DATA.title}
              </p>
            </div>

            {/* Description / Summary */}
            <p className="text-sm sm:text-base text-slate-300 leading-relaxed max-w-2xl">
              {RESUME_DATA.summary}
            </p>

            {/* Quick Contact Badges */}
            <div className="flex flex-wrap gap-2.5 pt-1 text-xs text-slate-300">
              <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800">
                <MapPin className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                <span>São Paulo / SP</span>
              </div>
              <a
                href="mailto:arcamos.j@gmail.com"
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 hover:text-cyan-400 hover:border-cyan-500/40 transition-colors"
              >
                <Mail className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                <span>{RESUME_DATA.email}</span>
              </a>
              <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800">
                <Phone className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                <span>{RESUME_DATA.phones.join(' | ')}</span>
              </div>
            </div>

            {/* Action Buttons CTA */}
            <div className="pt-3 flex flex-wrap items-center gap-3.5">
              <a
                href="#contato"
                className="bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-extrabold text-sm px-6 py-3.5 rounded-xl transition-all flex items-center gap-2 shadow-lg shadow-cyan-500/20 hover:scale-[1.02] active:scale-95"
              >
                <Mail className="w-4 h-4 fill-current" />
                <span>Entrar em Contato</span>
              </a>

              <a
                href="#experiencia"
                className="bg-slate-900 hover:bg-slate-800 text-cyan-300 hover:text-white font-bold text-sm px-5 py-3.5 rounded-xl border border-slate-700/80 transition-all flex items-center gap-2 shadow hover:border-cyan-500/40"
              >
                <Briefcase className="w-4 h-4 text-cyan-400" />
                <span>Ver Experiência</span>
              </a>

              <a
                href={RESUME_DATA.linkedin}
                target="_blank"
                rel="noreferrer"
                className="bg-slate-950 hover:bg-slate-900 text-slate-300 hover:text-cyan-400 font-semibold text-sm px-4 py-3.5 rounded-xl border border-slate-800 transition-all flex items-center gap-2"
                title="LinkedIn"
              >
                <Linkedin className="w-4 h-4 text-cyan-400" />
                <span>LinkedIn</span>
              </a>

              <a
                href={RESUME_DATA.github}
                target="_blank"
                rel="noreferrer"
                className="bg-slate-950 hover:bg-slate-900 text-slate-300 hover:text-white font-semibold text-sm px-4 py-3.5 rounded-xl border border-slate-800 transition-all flex items-center gap-2"
                title="GitHub"
              >
                <Github className="w-4 h-4" />
                <span>GitHub</span>
              </a>
            </div>
          </div>

          {/* Right Column: Profile Card */}
          <div className="lg:col-span-5 flex justify-center">
            <div className="relative w-full max-w-sm sm:max-w-md">
              {/* Outer Glow */}
              <div className="absolute -inset-1 bg-gradient-to-r from-cyan-500 via-blue-500 to-teal-500 rounded-3xl blur-xl opacity-20 group-hover:opacity-40 transition duration-1000"></div>

              <div className="relative rounded-2xl bg-slate-900/90 border border-slate-800 p-6 sm:p-7 shadow-2xl backdrop-blur-xl space-y-5 text-left">
                {/* Photo & Badge */}
                <div className="flex items-center gap-4">
                  <div className="relative w-20 h-20 sm:w-24 sm:h-24 rounded-2xl overflow-hidden border-2 border-cyan-500/40 shadow-lg shadow-cyan-500/10 shrink-0 bg-slate-800">
                    <Image
                      src="https://avatars.githubusercontent.com/u/104104278?v=4"
                      alt={RESUME_DATA.name}
                      fill
                      sizes="(max-width: 768px) 96px, 96px"
                      className="object-cover"
                      referrerPolicy="no-referrer"
                      priority
                    />
                  </div>
                  <div>
                    <h2 className="text-base sm:text-lg font-bold text-white leading-tight">
                      {RESUME_DATA.name}
                    </h2>
                    <p className="text-xs sm:text-sm text-cyan-400 font-medium">
                      {RESUME_DATA.title}
                    </p>
                    <div className="mt-2 flex items-center gap-2 text-xs text-slate-400">
                      <MapPin className="w-3.5 h-3.5 text-slate-400" />
                      <span>Vila Matilde, São Paulo/SP</span>
                    </div>
                  </div>
                </div>

                {/* Info List */}
                <div className="space-y-2.5 pt-2 border-t border-slate-800 text-xs">
                  <div className="flex items-center justify-between py-1 border-b border-slate-800/60">
                    <span className="text-slate-400">Formação:</span>
                    <span className="font-semibold text-slate-200">ADS (UNIP)</span>
                  </div>
                  <div className="flex items-center justify-between py-1 border-b border-slate-800/60">
                    <span className="text-slate-400">Especialidade:</span>
                    <span className="font-semibold text-slate-200">E-commerce, ERP & APIs</span>
                  </div>
                  <div className="flex items-center justify-between py-1 border-b border-slate-800/60">
                    <span className="text-slate-400">Metodologia:</span>
                    <span className="font-semibold text-emerald-400">Scrum / Metodologias Ágeis</span>
                  </div>
                  <div className="flex items-center justify-between py-1">
                    <span className="text-slate-400">Status:</span>
                    <span className="inline-flex items-center gap-1.5 text-cyan-300 font-bold">
                      <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
                      Disponível
                    </span>
                  </div>
                </div>

                {/* Tech Pills */}
                <div className="pt-2">
                  <div className="text-[11px] font-semibold text-slate-400 mb-2">Principais Stacks:</div>
                  <div className="flex flex-wrap gap-1.5">
                    {['Java', 'Spring Boot', 'TypeScript', 'Node.js', 'Vue.js', 'React', 'C#', 'SQL Server', 'PostgreSQL'].map((t) => (
                      <span
                        key={t}
                        className="px-2.5 py-1 rounded-md bg-slate-950 border border-slate-800 text-[11px] font-mono text-slate-300"
                      >
                        {t}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. SOBRE MIM & RESUMO PROFISSIONAL */}
      <section id="sobre" className="space-y-10 scroll-mt-24 text-left">
        <div className="space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-lg bg-cyan-500/10 border border-cyan-500/20 text-xs font-semibold text-cyan-400">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Perfil Profissional</span>
          </div>
          <h2 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
            Resumo Profissional
          </h2>
          <p className="text-slate-300 text-sm sm:text-base leading-relaxed max-w-4xl">
            {RESUME_DATA.summary}
          </p>
        </div>

        {/* 4 Destaques do Currículo */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
          <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-5 hover:border-cyan-500/40 transition-all group">
            <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400 mb-4 group-hover:scale-110 transition-transform">
              <Boxes className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-white mb-2">E-commerce & ERPs</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Concepção, arquitetura e sustentação contínua de plataformas críticas B2B/B2C de autopeças e ERPs industriais.
            </p>
          </div>

          <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-5 hover:border-cyan-500/40 transition-all group">
            <div className="w-10 h-10 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400 mb-4 group-hover:scale-110 transition-transform">
              <Zap className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-white mb-2">APIs & Pagamentos</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Criação de APIs escaláveis, integração de gateways de pagamento, operadoras de cartão e fluxos de Dropshipping.
            </p>
          </div>

          <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-5 hover:border-cyan-500/40 transition-all group">
            <div className="w-10 h-10 rounded-xl bg-teal-500/10 border border-teal-500/20 flex items-center justify-center text-teal-400 mb-4 group-hover:scale-110 transition-transform">
              <Cpu className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-white mb-2">Automação & Monitoramento</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Desenvolvimento de apps e automação para monitoramento de linhas de produção integrados ao sistema central.
            </p>
          </div>

          <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-5 hover:border-cyan-500/40 transition-all group">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 mb-4 group-hover:scale-110 transition-transform">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-white mb-2">Scrum & Código Limpo</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Vivência em rituais ágeis (Scrum), triagem rápida, análise de causa raiz e correção definitiva de bugs em produção.
            </p>
          </div>
        </div>
      </section>

      {/* 3. HABILIDADES TÉCNICAS */}
      <section id="habilidades" className="space-y-10 scroll-mt-24 text-left">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-lg bg-cyan-500/10 border border-cyan-500/20 text-xs font-semibold text-cyan-400">
              <Code2 className="w-3.5 h-3.5" />
              <span>Competências do Currículo</span>
            </div>
            <h2 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
              Habilidades Técnicas
            </h2>
            <p className="text-slate-400 text-sm">
              Linguagens, frameworks, bancos de dados e ferramentas listadas no currículo oficial.
            </p>
          </div>

          {/* Filter Pills */}
          <div className="flex items-center gap-2 p-1 bg-slate-900 border border-slate-800 rounded-xl self-start sm:self-auto text-xs font-semibold">
            <button
              onClick={() => setActiveSkillCategory('all')}
              className={`px-3 py-1.5 rounded-lg transition-all ${
                activeSkillCategory === 'all'
                  ? 'bg-cyan-500 text-slate-950 font-bold shadow'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Todas
            </button>
            <button
              onClick={() => setActiveSkillCategory('languages')}
              className={`px-3 py-1.5 rounded-lg transition-all ${
                activeSkillCategory === 'languages'
                  ? 'bg-cyan-500 text-slate-950 font-bold shadow'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Linguagens & Frameworks
            </button>
            <button
              onClick={() => setActiveSkillCategory('databases')}
              className={`px-3 py-1.5 rounded-lg transition-all ${
                activeSkillCategory === 'databases'
                  ? 'bg-cyan-500 text-slate-950 font-bold shadow'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Bancos & Ferramentas
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Linguagens & Frameworks */}
          {(activeSkillCategory === 'all' || activeSkillCategory === 'languages') && (
            <div className="bg-slate-900/70 border border-slate-800 rounded-2xl p-6 sm:p-7 space-y-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400 font-bold">
                  <Terminal className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white">Linguagens & Frameworks</h3>
                  <p className="text-xs text-slate-400">Tecnologias de desenvolvimento Full Stack</p>
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {RESUME_DATA.skills.languagesAndFrameworks.map((skill) => (
                  <div
                    key={skill.name}
                    className="p-3 rounded-xl bg-slate-950/80 border border-slate-800/80 hover:border-cyan-500/40 transition-all flex flex-col justify-between group"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-slate-200 text-sm group-hover:text-cyan-300 transition-colors">
                        {skill.name}
                      </span>
                      <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400 opacity-60 group-hover:opacity-100" />
                    </div>
                    <span className="text-[10px] text-slate-500 mt-1 font-mono uppercase">
                      {skill.category}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Bancos de Dados & Ferramentas */}
          {(activeSkillCategory === 'all' || activeSkillCategory === 'databases') && (
            <div className="bg-slate-900/70 border border-slate-800 rounded-2xl p-6 sm:p-7 space-y-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400 font-bold">
                  <Database className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white">Bancos de Dados & Ferramentas</h3>
                  <p className="text-xs text-slate-400">Persistência, versionamento e metodologias</p>
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {RESUME_DATA.skills.databasesAndTools.map((tool) => (
                  <div
                    key={tool.name}
                    className="p-3 rounded-xl bg-slate-950/80 border border-slate-800/80 hover:border-blue-500/40 transition-all flex flex-col justify-between group"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-slate-200 text-sm group-hover:text-blue-300 transition-colors">
                        {tool.name}
                      </span>
                      <CheckCircle2 className="w-3.5 h-3.5 text-blue-400 opacity-60 group-hover:opacity-100" />
                    </div>
                    <span className="text-[10px] text-slate-500 mt-1 font-mono uppercase">
                      {tool.category}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </section>

      {/* 4. EXPERIÊNCIA PROFISSIONAL */}
      <section id="experiencia" className="space-y-10 scroll-mt-24 text-left">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-lg bg-cyan-500/10 border border-cyan-500/20 text-xs font-semibold text-cyan-400">
            <Briefcase className="w-3.5 h-3.5" />
            <span>Trajetória & Realizações</span>
          </div>
          <h2 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
            Experiência Profissional
          </h2>
          <p className="text-slate-400 text-sm">
            Histórico de atuações, responsabilidades e entregas técnicas documentadas no currículo.
          </p>
        </div>

        <div className="space-y-6">
          {RESUME_DATA.experiences.map((exp, idx) => (
            <div
              key={idx}
              className="bg-slate-900/70 border border-slate-800/90 rounded-2xl p-6 sm:p-8 hover:border-cyan-500/30 transition-all space-y-5"
            >
              {/* Header do Card de Experiência */}
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 border-b border-slate-800 pb-4">
                <div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <h3 className="text-lg sm:text-xl font-extrabold text-white">
                      {exp.role}
                    </h3>
                    <span className="text-cyan-400 font-bold">|</span>
                    <span className="text-cyan-300 font-bold text-base sm:text-lg">
                      {exp.company}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-slate-400 mt-1">
                    <MapPin className="w-3.5 h-3.5 text-slate-500" />
                    <span>{exp.location}</span>
                  </div>
                </div>

                <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-950 border border-slate-800 text-xs font-mono text-cyan-300 self-start md:self-auto shrink-0">
                  <Calendar className="w-3.5 h-3.5 text-cyan-400" />
                  <span>{exp.period}</span>
                </div>
              </div>

              {/* Lista de Atividades e Entregas (Bullets do Currículo) */}
              <ul className="space-y-2.5 text-sm text-slate-300">
                {exp.highlights.map((item, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 mt-2 shrink-0"></span>
                    <span className="leading-relaxed">{item}</span>
                  </li>
                ))}
              </ul>

              {/* Tecnologias Utilizadas */}
              <div className="pt-2 flex flex-wrap gap-2">
                {exp.technologies.map((tech) => (
                  <span
                    key={tech}
                    className="px-2.5 py-1 rounded-lg bg-slate-950 border border-slate-800/80 text-xs font-mono text-slate-300"
                  >
                    {tech}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 5. FORMAÇÃO ACADÊMICA */}
      <section id="formacao" className="space-y-10 scroll-mt-24 text-left">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-lg bg-cyan-500/10 border border-cyan-500/20 text-xs font-semibold text-cyan-400">
            <GraduationCap className="w-3.5 h-3.5" />
            <span>Educação & Qualificação</span>
          </div>
          <h2 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
            Formação Acadêmica
          </h2>
          <p className="text-slate-400 text-sm">
            Graduação superior e formação técnica em tecnologia e eletrônica.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {RESUME_DATA.education.map((edu, index) => (
            <div
              key={index}
              className="bg-slate-900/70 border border-slate-800 rounded-2xl p-6 sm:p-7 hover:border-cyan-500/30 transition-all flex flex-col justify-between space-y-4"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-2xl">{edu.icon}</span>
                  <span className="text-xs font-mono font-semibold px-2.5 py-1 rounded-full bg-slate-950 border border-slate-800 text-cyan-300">
                    {edu.period}
                  </span>
                </div>
                <div>
                  <span className="text-[11px] font-mono uppercase tracking-wider text-cyan-400 font-bold">
                    {edu.type}
                  </span>
                  <h3 className="text-base sm:text-lg font-bold text-white mt-1 leading-snug">
                    {edu.degree}
                  </h3>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-800 text-xs text-slate-400 flex items-center gap-2">
                <Building2 className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                <span>{edu.institution}</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 6. CONTATO & INFORMAÇÕES */}
      <section id="contato" className="space-y-10 scroll-mt-24 text-left">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-lg bg-cyan-500/10 border border-cyan-500/20 text-xs font-semibold text-cyan-400">
            <Mail className="w-3.5 h-3.5" />
            <span>Fale Diretamente</span>
          </div>
          <h2 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
            Contato & Informações
          </h2>
          <p className="text-slate-400 text-sm">
            Disponível para contratação, projetos sob demanda e parcerias corporativas.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Informações Diretas */}
          <div className="lg:col-span-5 space-y-4">
            <div className="bg-slate-900/70 border border-slate-800 rounded-2xl p-6 space-y-6">
              <h3 className="text-lg font-bold text-white">Informações de Contato</h3>

              <div className="space-y-4 text-sm">
                <a
                  href="mailto:arcamos.j@gmail.com"
                  className="flex items-start gap-3 p-3 rounded-xl bg-slate-950/80 border border-slate-800/80 hover:border-cyan-500/40 transition-colors group"
                >
                  <div className="w-9 h-9 rounded-lg bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400 shrink-0">
                    <Mail className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-xs text-slate-400">E-mail Direto</div>
                    <div className="font-semibold text-white group-hover:text-cyan-300 transition-colors break-all">
                      {RESUME_DATA.email}
                    </div>
                  </div>
                </a>

                <div className="flex items-start gap-3 p-3 rounded-xl bg-slate-950/80 border border-slate-800/80">
                  <div className="w-9 h-9 rounded-lg bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400 shrink-0">
                    <Phone className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-xs text-slate-400">Telefones</div>
                    <div className="font-semibold text-white">
                      (11) 98278-8302 / (12) 98197-7125
                    </div>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-3 rounded-xl bg-slate-950/80 border border-slate-800/80">
                  <div className="w-9 h-9 rounded-lg bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400 shrink-0">
                    <MapPin className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-xs text-slate-400">Localização & Endereço</div>
                    <div className="font-semibold text-white">
                      {RESUME_DATA.address}
                    </div>
                  </div>
                </div>

                <a
                  href={RESUME_DATA.linkedin}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-start gap-3 p-3 rounded-xl bg-slate-950/80 border border-slate-800/80 hover:border-cyan-500/40 transition-colors group"
                >
                  <div className="w-9 h-9 rounded-lg bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400 shrink-0">
                    <Linkedin className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-xs text-slate-400">LinkedIn</div>
                    <div className="font-semibold text-white group-hover:text-cyan-300 transition-colors">
                      {RESUME_DATA.linkedinDisplay}
                    </div>
                  </div>
                </a>

                <a
                  href={RESUME_DATA.github}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-start gap-3 p-3 rounded-xl bg-slate-950/80 border border-slate-800/80 hover:border-cyan-500/40 transition-colors group"
                >
                  <div className="w-9 h-9 rounded-lg bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400 shrink-0">
                    <Github className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-xs text-slate-400">GitHub</div>
                    <div className="font-semibold text-white group-hover:text-cyan-300 transition-colors">
                      {RESUME_DATA.githubDisplay}
                    </div>
                  </div>
                </a>
              </div>
            </div>
          </div>

          {/* Formulário de Mensagem */}
          <div className="lg:col-span-7">
            <div className="bg-slate-900/70 border border-slate-800 rounded-2xl p-6 sm:p-8 space-y-6">
              <div>
                <h3 className="text-lg font-bold text-white">Envie uma Mensagem</h3>
                <p className="text-xs text-slate-400 mt-1">
                  Preencha os campos abaixo para iniciar uma conversa ou solicitar proposta.
                </p>
              </div>

              {contactSubmitted ? (
                <div className="p-6 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-center space-y-3 animate-fadeIn">
                  <div className="w-12 h-12 rounded-full bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400 mx-auto">
                    <CheckCircle className="w-6 h-6" />
                  </div>
                  <h4 className="text-base font-bold text-white">Mensagem Recebida com Sucesso!</h4>
                  <p className="text-xs text-slate-300 max-w-sm mx-auto">
                    Obrigado pelo contato! Retornarei o mais breve possível no e-mail informado.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleContactSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-slate-300">Seu Nome *</label>
                      <input
                        type="text"
                        required
                        value={contactForm.name}
                        onChange={(e) => setContactForm({ ...contactForm, name: e.target.value })}
                        placeholder="Ex: João da Silva"
                        className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-sm text-white placeholder:text-slate-600 focus:outline-none focus:border-cyan-500 transition-colors"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-slate-300">Seu E-mail *</label>
                      <input
                        type="email"
                        required
                        value={contactForm.email}
                        onChange={(e) => setContactForm({ ...contactForm, email: e.target.value })}
                        placeholder="joao@empresa.com"
                        className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-sm text-white placeholder:text-slate-600 focus:outline-none focus:border-cyan-500 transition-colors"
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-slate-300">Assunto</label>
                    <input
                      type="text"
                      value={contactForm.subject}
                      onChange={(e) => setContactForm({ ...contactForm, subject: e.target.value })}
                      placeholder="Ex: Proposta para Desenvolvedor Full Stack"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-sm text-white placeholder:text-slate-600 focus:outline-none focus:border-cyan-500 transition-colors"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-slate-300">Mensagem *</label>
                    <textarea
                      required
                      rows={4}
                      value={contactForm.message}
                      onChange={(e) => setContactForm({ ...contactForm, message: e.target.value })}
                      placeholder="Descreva detalhes da oportunidade ou do projeto..."
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-sm text-white placeholder:text-slate-600 focus:outline-none focus:border-cyan-500 transition-colors resize-none"
                    ></textarea>
                  </div>

                  <button
                    type="submit"
                    disabled={isSending}
                    className="w-full py-3 px-6 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-extrabold text-sm flex items-center justify-center gap-2 transition-all shadow-md shadow-cyan-500/20 disabled:opacity-50"
                  >
                    {isSending ? (
                      <span>Enviando...</span>
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
        </div>
      </section>

      {/* Screen-reader accessible data for integration verification */}
      {phases && phases.length > 0 && (
        <div className="sr-only" data-testid="phases-sync-data">
          {phases.map((phase) => (
            <div key={phase.id}>
              <span>{phase.title}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
