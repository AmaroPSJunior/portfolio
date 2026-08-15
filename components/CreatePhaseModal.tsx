'use client';

import React, { useState } from 'react';
import { Phase } from '@/types';
import { validatePhaseInput } from '@/lib/validators';
import { AppLogger } from '@/lib/logger';

interface CreatePhaseModalProps {
  show: boolean;
  onClose: () => void;
  onPhaseCreated: (newPhase: Phase) => void;
}

export const CreatePhaseModal: React.FC<CreatePhaseModalProps> = ({
  show,
  onClose,
  onPhaseCreated,
}) => {
  const [title, setTitle] = useState('');
  const [subtitle, setSubtitle] = useState('');
  const [emoji, setEmoji] = useState('🚀');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  if (!show) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    const validation = validatePhaseInput({ title, subtitle, emoji });
    if (!validation.valid) {
      setErrorMsg(validation.errors.join(' '));
      return;
    }

    setLoading(true);
    try {
      const response = await fetch('/api/fases', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(validation.sanitized),
      });

      const data = await response.json();

      if ((response.ok || response.status === 201) && data.phase) {
        onPhaseCreated(data.phase);
        setTitle('');
        setSubtitle('');
        setEmoji('🚀');
        onClose();
        AppLogger.info('UI:CreatePhaseModal', `Fase "${data.phase.title}" criada com sucesso`);
      } else {
        throw new Error(data.error || 'Erro ao criar fase no Supabase');
      }
    } catch (err: any) {
      AppLogger.error('UI:CreatePhaseModal', 'Falha ao incluir nova fase', err);
      setErrorMsg(err.message || 'Falha ao conectar com o banco de dados.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-md w-full p-6 space-y-4 shadow-2xl">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <h3 className="text-lg font-bold text-white flex items-center gap-2">
            <span>🏛️</span> Cadastrar Nova Fase no Supabase
          </h3>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white transition-colors"
          >
            ✖️
          </button>
        </div>

        {errorMsg && (
          <div className="p-2.5 bg-red-950/80 border border-red-500/40 rounded-lg text-xs text-red-300">
            {errorMsg}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-3 text-xs">
          <div>
            <label className="block text-slate-300 mb-1 font-semibold">
              Ícone / Emoji da Fase:
            </label>
            <div className="flex gap-2">
              {['🚀', '💼', '🧪', '🛡️', '⚡', '☁️', '🎯', '🔮'].map((e) => (
                <button
                  type="button"
                  key={e}
                  onClick={() => setEmoji(e)}
                  className={`p-2 rounded-lg text-base border transition-all ${
                    emoji === e
                      ? 'bg-emerald-500/20 border-emerald-500 text-white'
                      : 'bg-slate-950 border-slate-800 text-slate-400 hover:bg-slate-800'
                  }`}
                >
                  {e}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-slate-300 mb-1 font-semibold">
              Título da Fase:
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Ex: Fase 5 - Arquitetura de Microserviços"
              className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-xs text-slate-200 focus:outline-none focus:border-emerald-500"
              required
            />
          </div>

          <div>
            <label className="block text-slate-300 mb-1 font-semibold">
              Subtítulo / Descrição Curta:
            </label>
            <input
              type="text"
              value={subtitle}
              onChange={(e) => setSubtitle(e.target.value)}
              placeholder="Ex: Escala, mensageria e resiliência cloud"
              className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-xs text-slate-200 focus:outline-none focus:border-emerald-500"
            />
          </div>

          <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-800">
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="px-4 py-2 bg-slate-800 text-slate-300 rounded-lg text-xs hover:bg-slate-700 disabled:opacity-50"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-lg text-xs transition-colors flex items-center gap-1.5 disabled:opacity-50"
            >
              {loading ? 'Salvando...' : 'Criar Fase no Supabase'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
