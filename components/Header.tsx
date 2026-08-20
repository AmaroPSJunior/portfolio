'use client';

import React, { useState } from 'react';
import { Menu, X, Mail, Github, ArrowUpRight } from 'lucide-react';

interface HeaderProps {
  activeTab?: string;
  setActiveTab?: (tab: string) => void;
  setShowGithubModal?: (show: boolean) => void;
  onOpenDiagnostics?: () => void;
  onOpenAdmin?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab = 'home',
  setActiveTab,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { label: 'Sobre', href: '#sobre' },
    { label: 'Experiência', href: '#experiencia' },
    { label: 'Habilidades', href: '#habilidades' },
    { label: 'Projetos', href: '#projetos' },
    { label: 'Contato', href: '#contato' },
  ];

  return (
    <header className="bg-slate-950/85 backdrop-blur-md border-b border-slate-800/80 sticky top-0 z-50 transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 sm:h-20 flex items-center justify-between">
        {/* Brand & Identity */}
        <a
          href="#hero"
          onClick={(e) => {
            if (activeTab !== 'home' && setActiveTab) {
              e.preventDefault();
              setActiveTab('home');
            }
          }}
          className="flex items-center gap-3 group"
        >
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-500/20 to-blue-600/20 border border-cyan-500/30 flex items-center justify-center font-mono font-black text-cyan-400 text-base shadow-sm group-hover:border-cyan-400 transition-colors">
            AP
          </div>
          <div>
            <div className="text-sm sm:text-base font-extrabold text-white tracking-tight group-hover:text-cyan-300 transition-colors">
              Amaro Pedro da Silva Junior
            </div>
            <div className="text-[11px] text-slate-400 font-medium">
              Desenvolvedor Full Stack
            </div>
          </div>
        </a>

        {/* Desktop Navigation */}
        {activeTab === 'home' ? (
          <nav className="hidden md:flex items-center gap-7 text-sm font-medium text-slate-300">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="hover:text-cyan-400 transition-colors"
              >
                {link.label}
              </a>
            ))}
          </nav>
        ) : (
          <div className="hidden md:flex items-center gap-3 text-sm font-medium">
            <button
              onClick={() => setActiveTab && setActiveTab('home')}
              className="text-cyan-400 hover:text-cyan-300 font-semibold transition-colors flex items-center gap-1.5"
            >
              ← Voltar para Apresentação
            </button>
            <span className="text-slate-700">|</span>
            <button
              onClick={() => setActiveTab && setActiveTab('roadmap')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                activeTab === 'roadmap' ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30' : 'text-slate-400 hover:text-white'
              }`}
            >
              Roadmap & Fases
            </button>
          </div>
        )}

        {/* Desktop Actions */}
        <div className="hidden md:flex items-center gap-2.5">
          {activeTab === 'home' && setActiveTab && (
            <button
              onClick={() => setActiveTab('roadmap')}
              className="px-3.5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-cyan-300 hover:text-cyan-200 font-bold text-xs transition-all flex items-center gap-1.5 shadow-sm"
              title="Acessar o antigo painel de laboratório e homologação de projetos"
            >
              <ArrowUpRight className="w-3.5 h-3.5 text-cyan-400" />
              <span>Projetos</span>
            </button>
          )}

          <a
            href="https://www.linkedin.com/in/amaro-pedro-jr-53146810b"
            target="_blank"
            rel="noreferrer"
            className="p-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 hover:text-cyan-400 transition-all shadow-sm"
            title="LinkedIn de Amaro Pedro"
          >
            <svg
              aria-hidden="true"
              className="lucide lucide-linkedin w-4 h-4"
              fill="none"
              height="24"
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              viewBox="0 0 24 24"
              width="24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
              <rect height="12" width="4" x="2" y="9" />
              <circle cx="4" cy="4" r="2" />
            </svg>
          </a>

          <a
            href="https://github.com/AmaroPSJunior"
            target="_blank"
            rel="noreferrer"
            className="p-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 hover:text-white transition-all shadow-sm"
            title="GitHub de Amaro Pedro"
          >
            <Github className="w-4 h-4" />
          </a>

          <a
            href="#contato"
            className="bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs sm:text-sm px-4 py-2.5 rounded-xl transition-all flex items-center gap-1.5 shadow-md shadow-cyan-500/20 hover:scale-[1.02] active:scale-95"
          >
            <Mail className="w-3.5 h-3.5" />
            <span>Fale Comigo</span>
          </a>
        </div>

        {/* Mobile Hamburger Toggle */}
        <div className="md:hidden flex items-center">
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 hover:text-white"
            aria-label="Abrir menu de navegação"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Navigation */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b border-slate-800 bg-slate-950/95 backdrop-blur-xl px-4 pt-3 pb-5 space-y-3 animate-fadeIn">
          <nav className="flex flex-col space-y-2">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className="px-3 py-2 rounded-lg text-sm font-medium text-slate-300 hover:bg-slate-900 hover:text-cyan-400 transition-colors"
              >
                {link.label}
              </a>
            ))}
          </nav>
          <div className="pt-2 border-t border-slate-800/80 flex items-center gap-3">
            <a
              href="https://github.com/amaropedro"
              target="_blank"
              rel="noreferrer"
              className="flex-1 py-2.5 px-3 rounded-xl bg-slate-900 text-slate-300 hover:text-white text-xs font-semibold flex items-center justify-center gap-2 border border-slate-800"
            >
              <Github className="w-4 h-4" />
              <span>GitHub</span>
              <ArrowUpRight className="w-3.5 h-3.5 opacity-60" />
            </a>
            <a
              href="#contato"
              onClick={() => setMobileMenuOpen(false)}
              className="flex-1 py-2.5 px-3 rounded-xl bg-cyan-500 text-slate-950 font-bold text-xs flex items-center justify-center gap-1.5 shadow"
            >
              <Mail className="w-3.5 h-3.5" />
              <span>Fale Comigo</span>
            </a>
          </div>
        </div>
      )}
    </header>
  );
};

