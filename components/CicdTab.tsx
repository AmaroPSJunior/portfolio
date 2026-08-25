'use client';

import React, { useState } from 'react';
import { WORKFLOW_YAML, TEST_SPEC_CODE, VITEST_CONFIG_CODE } from '@/data/constants';

export const CicdTab: React.FC = () => {
  const [codeTab, setCodeTab] = useState<'workflow' | 'test' | 'config'>('workflow');
  const [copied, setCopied] = useState(false);

  let currentCodeTitle = '.github/workflows/ci-cd.yml (GitHub Actions Pipeline)';
  let currentCodeContent = WORKFLOW_YAML;

  if (codeTab === 'test') {
    currentCodeTitle = 'app.spec.js (Vitest & Bun Unit Tests)';
    currentCodeContent = TEST_SPEC_CODE;
  } else if (codeTab === 'config') {
    currentCodeTitle = 'vitest.config.js (Vitest Runner Config)';
    currentCodeContent = VITEST_CONFIG_CODE;
  }

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <main className="max-w-7xl mx-auto px-4 lg:px-8 py-4 space-y-6">
      <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h3 className="text-xl font-bold text-white flex items-center gap-2">
              <span>⚙️</span> Automação de CI/CD & Suíte de Testes Unitários
            </h3>
            <p className="text-xs text-slate-400 mt-1">
              Arquivos de configuração e scripts para execução contínua no GitHub Actions, Vercel e Vitest.
            </p>
          </div>

          {/* Sub-tabs for code selection */}
          <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-xl border border-slate-800 text-xs font-medium">
            <button
              onClick={() => setCodeTab('workflow')}
              className={`px-3 py-1.5 rounded-lg transition-all ${
                codeTab === 'workflow' ? 'bg-cyan-600 text-white font-bold' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              📄 .github/workflows/ci-cd.yml
            </button>
            <button
              onClick={() => setCodeTab('test')}
              className={`px-3 py-1.5 rounded-lg transition-all ${
                codeTab === 'test' ? 'bg-cyan-600 text-white font-bold' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              🧪 app.spec.js (Vitest)
            </button>
            <button
              onClick={() => setCodeTab('config')}
              className={`px-3 py-1.5 rounded-lg transition-all ${
                codeTab === 'config' ? 'bg-cyan-600 text-white font-bold' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              ⚙️ vitest.config.js
            </button>
          </div>
        </div>

        {/* Code Display Box with Copy Button */}
        <div className="bg-slate-950 border border-slate-800 rounded-xl overflow-hidden">
          <div className="bg-slate-900/90 px-4 py-2.5 border-b border-slate-800 flex items-center justify-between text-xs font-mono text-slate-400">
            <span className="flex items-center gap-2">
              <span>💻</span> {currentCodeTitle}
            </span>
            <button
              onClick={() => handleCopy(currentCodeContent)}
              className="bg-slate-800 hover:bg-slate-700 text-cyan-300 px-3 py-1 rounded border border-slate-700 transition-all flex items-center gap-1 font-sans text-xs"
            >
              <span>{copied ? '✅ Copiado!' : '📋 Copiar Código'}</span>
            </button>
          </div>

          <pre className="p-4 text-xs font-mono text-cyan-200 overflow-x-auto max-h-[500px] leading-relaxed">
            <code>{currentCodeContent}</code>
          </pre>
        </div>

        {/* Terminal Commands Guide */}
        <div className="bg-slate-950 border border-slate-800 p-4 rounded-xl space-y-3">
          <h4 className="text-xs font-bold text-slate-200 uppercase tracking-wider flex items-center gap-2">
            <span>🖥️</span> Comandos de Execução no Terminal
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs font-mono">
            <div className="bg-slate-900 p-3 rounded border border-slate-800">
              <p className="text-slate-400 text-[11px] font-sans mb-1">
                # Executar suíte de testes unitários localmente
              </p>
              <code className="text-emerald-400">npm test # ou bun test</code>
            </div>
            <div className="bg-slate-900 p-3 rounded border border-slate-800">
              <p className="text-slate-400 text-[11px] font-sans mb-1">
                # Enviar alterações para disparar CI/CD e Vercel Deploy
              </p>
              <code className="text-cyan-400">
                git add . && git commit -m "feat: nextjs vercel deploy" && git push origin main
              </code>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};
