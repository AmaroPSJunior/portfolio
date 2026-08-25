'use client';

import React from 'react';
import { Skill } from '@/types';

interface ProductsTabProps {
  skillsMatrix: Skill[];
}

export const ProductsTab: React.FC<ProductsTabProps> = ({ skillsMatrix }) => {
  return (
    <main className="max-w-7xl mx-auto px-4 lg:px-8 py-4 space-y-8">
      {/* SECTION: PRODUTOS & SERVIÇOS */}
      <section className="space-y-4">
        <div className="border-b border-slate-800 pb-3 flex items-center justify-between">
          <div>
            <h3 className="text-xl font-bold text-white flex items-center gap-2">
              <span>🛒</span> Produtos & Serviços Enterprise (Fase 2)
            </h3>
            <p className="text-xs text-slate-400">
              Soluções completas desenvolvidas com alta performance e arquitetura robusta.
            </p>
          </div>
          <span className="text-xs bg-slate-900 text-cyan-400 border border-slate-800 px-3 py-1 rounded-full font-mono">
            Full Stack Solutions
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Card 1 */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-3 hover:border-cyan-500/50 transition-all group">
            <div className="flex items-center justify-between">
              <span className="text-3xl">🏬</span>
              <span className="text-[10px] bg-cyan-950 text-cyan-300 border border-cyan-800 px-2 py-0.5 rounded font-mono">
                B2B / B2C Architecture
              </span>
            </div>
            <h4 className="text-base font-bold text-white group-hover:text-cyan-300 transition-colors">
              Plataforma E-commerce Enterprise
            </h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              Sistema completo com checkout resiliente, catálogo distribuído e integração RESTful com gateways de pagamento.
            </p>
            <div className="pt-2 flex flex-wrap gap-1 border-t border-slate-800/80">
              <span className="text-[10px] bg-slate-950 text-slate-300 border border-slate-800 px-2 py-0.5 rounded">
                ☕ Java 17
              </span>
              <span className="text-[10px] bg-slate-950 text-slate-300 border border-slate-800 px-2 py-0.5 rounded">
                🍃 Spring Boot
              </span>
              <span className="text-[10px] bg-slate-950 text-slate-300 border border-slate-800 px-2 py-0.5 rounded">
                🐘 PostgreSQL
              </span>
            </div>
          </div>

          {/* Card 2 */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-3 hover:border-cyan-500/50 transition-all group">
            <div className="flex items-center justify-between">
              <span className="text-3xl">🏭</span>
              <span className="text-[10px] bg-blue-950 text-blue-300 border border-blue-800 px-2 py-0.5 rounded font-mono">
                Automação Industrial
              </span>
            </div>
            <h4 className="text-base font-bold text-white group-hover:text-cyan-300 transition-colors">
              ERP Industrial & Telemetria
            </h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              Gestão operacional de linha de produção, comunicação MQTT em tempo real e controle de estoque centralizado.
            </p>
            <div className="pt-2 flex flex-wrap gap-1 border-t border-slate-800/80">
              <span className="text-[10px] bg-slate-950 text-slate-300 border border-slate-800 px-2 py-0.5 rounded">
                ⚡ C# .NET 8
              </span>
              <span className="text-[10px] bg-slate-950 text-slate-300 border border-slate-800 px-2 py-0.5 rounded">
                💾 SQL Server
              </span>
              <span className="text-[10px] bg-slate-950 text-slate-300 border border-slate-800 px-2 py-0.5 rounded">
                📡 MQTT / IoT
              </span>
            </div>
          </div>

          {/* Card 3 */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-3 hover:border-cyan-500/50 transition-all group">
            <div className="flex items-center justify-between">
              <span className="text-3xl">💻</span>
              <span className="text-[10px] bg-emerald-950 text-emerald-300 border border-emerald-800 px-2 py-0.5 rounded font-mono">
                Sistemas Next.js SPA/SSR
              </span>
            </div>
            <h4 className="text-base font-bold text-white group-hover:text-cyan-300 transition-colors">
              Gestão Corporativa Web Next.js 15
            </h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              Aplicações administrativas de alta reatividade com autenticação JWT, permissões RBAC e dashboards dinâmicos.
            </p>
            <div className="pt-2 flex flex-wrap gap-1 border-t border-slate-800/80">
              <span className="text-[10px] bg-slate-950 text-slate-300 border border-slate-800 px-2 py-0.5 rounded">
                ⚛️ Next.js 15
              </span>
              <span className="text-[10px] bg-slate-950 text-slate-300 border border-slate-800 px-2 py-0.5 rounded">
                🟢 Node.js
              </span>
              <span className="text-[10px] bg-slate-950 text-slate-300 border border-slate-800 px-2 py-0.5 rounded">
                🐘 Supabase PostgreSQL
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION: TECH LAB / SANDBOX */}
      <section className="space-y-4">
        <div className="border-b border-slate-800 pb-3 flex items-center justify-between">
          <div>
            <h3 className="text-xl font-bold text-white flex items-center gap-2">
              <span>🧪</span> Tech Lab & Experimentos (Fase 3)
            </h3>
            <p className="text-xs text-slate-400">
              Provas de Conceito, testes de novas tecnologias e experimentos ativamente homologados.
            </p>
          </div>
          <span className="text-xs bg-slate-900 text-emerald-400 border border-slate-800 px-3 py-1 rounded-full font-mono">
            Live Sandbox
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-2">
            <div className="text-2xl">🌐</div>
            <h4 className="text-sm font-bold text-white">PoC Web3 & Smart Contracts</h4>
            <p className="text-xs text-slate-400">
              Validação de assinatura de transações e conectividade com carteiras digitais via ethers.js.
            </p>
            <span className="inline-block text-[10px] bg-cyan-950 text-cyan-300 border border-cyan-800 px-2 py-0.5 rounded mt-2">
              Status: Homologado 🚀
            </span>
          </div>

          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-2">
            <div className="text-2xl">💳</div>
            <h4 className="text-sm font-bold text-white">PoC Gateway de Pagamento (Pix)</h4>
            <p className="text-xs text-slate-400">
              Simulador de emissão de QR Code Pix dinâmico e webhook de confirmação de pagamento instantâneo.
            </p>
            <span className="inline-block text-[10px] bg-emerald-950 text-emerald-300 border border-emerald-800 px-2 py-0.5 rounded mt-2">
              Status: Testes Ok 🛡️
            </span>
          </div>

          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-2">
            <div className="text-2xl">🛠️</div>
            <h4 className="text-sm font-bold text-white">Scripts DevOps & Automação</h4>
            <p className="text-xs text-slate-400">
              Ferramentas CLI personalizadas para validação de código, linting e geração de relatórios de CI.
            </p>
            <span className="inline-block text-[10px] bg-blue-950 text-blue-300 border border-blue-800 px-2 py-0.5 rounded mt-2">
              Status: Ativo ⚡
            </span>
          </div>
        </div>
      </section>

      {/* SECTION: MATRIZ DE HABILIDADES */}
      <section className="space-y-4">
        <div className="border-b border-slate-800 pb-3">
          <h3 className="text-xl font-bold text-white flex items-center gap-2">
            <span>🎯</span> Matriz Visual de Habilidades Unitárias (Skills Lab - Fase 4)
          </h3>
          <p className="text-xs text-slate-400">
            Proficiência técnica e aplicações práticas do desenvolvedor Amaro Pedro da Silva Junior.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {skillsMatrix.map((skill) => (
            <div key={skill.name} className="bg-slate-900 border border-slate-800 p-4 rounded-xl space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-bold text-white flex items-center gap-2">
                  <span>{skill.icon}</span> {skill.name}
                </span>
                <span className="text-xs font-mono text-cyan-400 font-bold">{skill.level}%</span>
              </div>

              {/* Level bar */}
              <div className="w-full h-2 bg-slate-950 rounded-full overflow-hidden border border-slate-800">
                <div className="h-full bg-cyan-500 rounded-full" style={{ width: `${skill.level}%` }}></div>
              </div>

              <p className="text-xs text-slate-400 pt-1">{skill.experience}</p>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
};
