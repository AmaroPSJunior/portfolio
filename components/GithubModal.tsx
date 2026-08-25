'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { GithubConfig, GithubRepoData } from '@/types';

interface GithubModalProps {
  show: boolean;
  onClose: () => void;
  githubConfig: GithubConfig;
  setGithubConfig: React.Dispatch<React.SetStateAction<GithubConfig>>;
  saveGithubConfig: (config: GithubConfig) => void;
}

export const GithubModal: React.FC<GithubModalProps> = ({
  show,
  onClose,
  githubConfig,
  setGithubConfig,
  saveGithubConfig,
}) => {
  const [githubRepoData, setGithubRepoData] = useState<GithubRepoData | null>(null);
  const [githubLoading, setGithubLoading] = useState(false);
  const [githubError, setGithubError] = useState('');
  const [copied, setCopied] = useState(false);

  if (!show) return null;

  const owner = githubConfig.owner || 'SEU-USUARIO';
  const repo = githubConfig.repo || 'SEU-REPOSITORIO';
  const branch = githubConfig.branch || 'main';

  const gitSyncCommands =
    `# Comandos para adicionar remote e realizar o push no GitHub\n` +
    `git remote add origin https://github.com/${owner}/${repo}.git\n` +
    `git branch -M ${branch}\n` +
    `git push -u origin ${branch}`;

  const fetchGithubRepo = async () => {
    if (!githubConfig.owner || !githubConfig.repo) {
      setGithubError('Por favor informe o usuário e nome do repositório.');
      return;
    }

    setGithubLoading(true);
    setGithubError('');

    try {
      const res = await fetch(
        `/api/github?owner=${encodeURIComponent(githubConfig.owner)}&repo=${encodeURIComponent(
          githubConfig.repo
        )}`
      );

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(
          errorData.error ||
            `Repositório '${githubConfig.owner}/${githubConfig.repo}' não encontrado ou inacessível no GitHub.`
        );
      }

      const data = await res.json();
      setGithubRepoData(data);
      saveGithubConfig(githubConfig);
    } catch (err: any) {
      setGithubError(err.message || 'Falha ao conectar com a API do GitHub.');
    } finally {
      setGithubLoading(false);
    }
  };

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-xl w-full p-6 space-y-5 shadow-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2">
            <span className="text-2xl">🐙</span>
            <div>
              <h3 className="text-base font-bold text-white">Sincronização & Repositório GitHub</h3>
              <p className="text-xs text-slate-400">Conecte o painel Next.js ao seu repositório oficial no GitHub</p>
            </div>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-white">
            ✖️
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
          <div>
            <label className="block text-slate-300 mb-1 font-semibold">Usuário / Organização GitHub:</label>
            <input
              type="text"
              value={githubConfig.owner}
              onChange={(e) => setGithubConfig({ ...githubConfig, owner: e.target.value })}
              placeholder="AmaroPSJunior"
              className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-slate-200 focus:outline-none focus:border-cyan-500 font-mono"
            />
          </div>
          <div>
            <label className="block text-slate-300 mb-1 font-semibold">Nome do Repositório:</label>
            <input
              type="text"
              value={githubConfig.repo}
              onChange={(e) => setGithubConfig({ ...githubConfig, repo: e.target.value })}
              placeholder="painel-homologacao"
              className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-slate-200 focus:outline-none focus:border-cyan-500 font-mono"
            />
          </div>
          <div>
            <label className="block text-slate-300 mb-1 font-semibold">Branch Principal:</label>
            <input
              type="text"
              value={githubConfig.branch}
              onChange={(e) => setGithubConfig({ ...githubConfig, branch: e.target.value })}
              placeholder="main"
              className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-slate-200 focus:outline-none focus:border-cyan-500 font-mono"
            />
          </div>
          <div>
            <label className="block text-slate-300 mb-1 font-semibold">Personal Access Token (Opcional):</label>
            <input
              type="password"
              value={githubConfig.token}
              onChange={(e) => setGithubConfig({ ...githubConfig, token: e.target.value })}
              placeholder="ghp_xxxxxxxxxxxxxxxxxxxx"
              className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-slate-200 focus:outline-none focus:border-cyan-500 font-mono"
            />
          </div>
        </div>

        {/* Actions Row */}
        <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-slate-800">
          <button
            onClick={fetchGithubRepo}
            disabled={githubLoading}
            className="bg-cyan-600 hover:bg-cyan-500 text-slate-950 font-bold text-xs px-4 py-2 rounded-lg transition-all flex items-center gap-1.5 shadow"
          >
            <span>{githubLoading ? '⏳ Consultando...' : '⚡ Testar Conexão & Buscar Repositório'}</span>
          </button>

          <button
            onClick={() => saveGithubConfig(githubConfig)}
            className="bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs px-4 py-2 rounded-lg border border-slate-700 font-semibold"
          >
            💾 Salvar Configurações
          </button>
        </div>

        {/* Error Alert */}
        {githubError && (
          <div className="bg-red-950/60 border border-red-800 text-red-300 text-xs p-3 rounded-lg flex items-center justify-between">
            <span>⚠️ {githubError}</span>
            <button onClick={() => setGithubError('')} className="text-slate-400 hover:text-white">
              ✖️
            </button>
          </div>
        )}

        {/* Live Repository Info Card */}
        {githubRepoData && (
          <div className="bg-slate-950/90 border border-slate-800 rounded-xl p-4 space-y-3">
            <div className="flex items-center justify-between border-b border-slate-800/80 pb-2.5">
              <div className="flex items-center gap-2.5">
                {githubRepoData.owner?.avatar_url && (
                  <Image
                    src={githubRepoData.owner.avatar_url}
                    alt="Avatar"
                    width={24}
                    height={24}
                    className="w-6 h-6 rounded-full border border-slate-700"
                  />
                )}
                <a
                  href={githubRepoData.html_url}
                  target="_blank"
                  rel="noreferrer"
                  className="text-sm font-bold text-cyan-300 hover:underline flex items-center gap-1 font-mono"
                >
                  {githubRepoData.full_name}
                  <span className="text-[10px] bg-slate-800 text-slate-300 px-1.5 py-0.5 rounded font-sans border border-slate-700">
                    {githubRepoData.private ? '🔒 Privado' : '🌐 Público'}
                  </span>
                </a>
              </div>
              <span className="text-xs font-mono text-emerald-400 font-semibold bg-emerald-950/60 border border-emerald-800 px-2 py-0.5 rounded">
                🟢 Conectado
              </span>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed">
              {githubRepoData.description || 'Repositório do Painel de Homologação e Portfólio Dev Next.js.'}
            </p>

            <div className="grid grid-cols-4 gap-2 text-center text-xs font-mono pt-1">
              <div className="bg-slate-900 p-2 rounded border border-slate-800">
                <span className="text-slate-400 text-[10px] block">Stars</span>
                <span className="font-bold text-amber-400">⭐ {githubRepoData.stargazers_count}</span>
              </div>
              <div className="bg-slate-900 p-2 rounded border border-slate-800">
                <span className="text-slate-400 text-[10px] block">Forks</span>
                <span className="font-bold text-blue-400">🍴 {githubRepoData.forks_count}</span>
              </div>
              <div className="bg-slate-900 p-2 rounded border border-slate-800">
                <span className="text-slate-400 text-[10px] block">Issues</span>
                <span className="font-bold text-purple-400">🐛 {githubRepoData.open_issues_count}</span>
              </div>
              <div className="bg-slate-900 p-2 rounded border border-slate-800">
                <span className="text-slate-400 text-[10px] block">Default Branch</span>
                <span className="font-bold text-emerald-400">🌿 {githubRepoData.default_branch}</span>
              </div>
            </div>
          </div>
        )}

        {/* Command Line Git Link Commands */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <h4 className="text-xs font-bold text-slate-200 uppercase tracking-wider flex items-center gap-1.5">
              <span>💻</span> Comandos para Sincronização e Push no Terminal
            </h4>
            <button
              onClick={() => handleCopy(gitSyncCommands)}
              className="text-[11px] bg-slate-800 hover:bg-slate-700 text-cyan-300 px-2.5 py-1 rounded border border-slate-700 flex items-center gap-1"
            >
              <span>{copied ? '✅ Copiado!' : '📋 Copiar Comandos'}</span>
            </button>
          </div>
          <pre className="bg-slate-950 p-3.5 rounded-xl border border-slate-800 text-xs font-mono text-cyan-300 overflow-x-auto leading-relaxed">
            <code>{gitSyncCommands}</code>
          </pre>
        </div>
      </div>
    </div>
  );
};
