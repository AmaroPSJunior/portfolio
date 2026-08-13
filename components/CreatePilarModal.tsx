'use client';

import React, { useState } from 'react';
import { Phase } from '@/types';

interface CreatePilarModalProps {
  show: boolean;
  onClose: () => void;
  onPillarCreated: (newPillar: Phase) => void;
}

const PRESET_EMOJIS = [
  '🚀', '💼', '🧪', '🛡️', '🎯', '⚡', '📊', '🛠️',
  '🌐', '📦', '🏆', '🧠', '⚙️', '💡', '🔒', '📱'
];

export const CreatePilarModal: React.FC<CreatePilarModalProps> = ({
  show,
  onClose,
  onPillarCreated,
}) => {
  const [title, setTitle] = useState('');
  const [subtitle, setSubtitle] = useState('');
  const [emoji, setEmoji] = useState('🚀');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  if (!show) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    if (!title.trim()) {
      setErrorMessage('Por favor, informe o título do Pilar.');
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch('/api/pillars', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: title.trim(),
          subtitle: subtitle.trim(),
          emoji: emoji.trim() || '🚀',
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.details?.join(', ') || data.error || 'Falha ao cadastrar pilar no Supabase'
        );
      }

      if (data.pillar) {
        onPillarCreated(data.pillar);
        // Reset form
        setTitle('');
        setSubtitle('');
        setEmoji('🚀');
        onClose();
      }
    } catch (err: any) {
      setErrorMessage(err.message || 'Ocorreu um erro ao conectar à API.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-md w-full p-6 space-y-5 shadow-2xl">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2">
            <span className="text-2xl">➕</span>
            <div>
              <h3 className="text-base font-bold text-white">Cadastrar Novo Pilar / Fase</h3>
              <p className="text-xs text-slate-400">Inserção no Supabase com ordenação automática no final da lista</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white transition-colors"
          >
            ✖️
          </button>
        </div>

        {errorMessage && (
          <div className="bg-red-950/60 border border-red-800 text-red-300 text-xs p-3 rounded-lg flex items-center justify-between">
            <span>⚠️ {errorMessage}</span>
            <button onClick={() => setErrorMessage('')} className="text-slate-400 hover:text-white">
              ✖️
            </button>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          {/* Título */}
          <div>
            <label className="block text-slate-300 mb-1 font-semibold">
              Título do Pilar / Fase <span className="text-cyan-400">*</span>:
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Ex: Fase 5 - Arquitetura de Microserviços & Cloud"
              className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-slate-200 focus:outline-none focus:border-cyan-500"
              required
            />
          </div>

          {/* Subtítulo / Descrição */}
          <div>
            <label className="block text-slate-300 mb-1 font-semibold">
              Subtítulo / Descrição Técnica:
            </label>
            <input
              type="text"
              value={subtitle}
              onChange={(e) => setSubtitle(e.target.value)}
              placeholder="Ex: Deploy com Docker, Kubernetes, AWS EKS e CI/CD avançado."
              className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-slate-200 focus:outline-none focus:border-cyan-500"
            />
          </div>

          {/* Emoji / Ícone */}
          <div>
            <label className="block text-slate-300 mb-1 font-semibold">
              Emoji do Pilar:
            </label>
            <div className="flex items-center gap-2 mb-2">
              <input
                type="text"
                value={emoji}
                onChange={(e) => setEmoji(e.target.value)}
                className="w-16 text-center bg-slate-950 border border-slate-800 rounded-lg p-2 text-lg focus:outline-none focus:border-cyan-500"
              />
              <span className="text-slate-400 text-[11px]">
                Escolha um emoji no grid abaixo ou digite um personalizado:
              </span>
            </div>

            <div className="grid grid-cols-8 gap-1.5 p-2 bg-slate-950 rounded-xl border border-slate-800">
              {PRESET_EMOJIS.map((item) => (
                <button
                  key={item}
                  type="button"
                  onClick={() => setEmoji(item)}
                  className={`p-2 rounded text-base transition-all ${
                    emoji === item
                      ? 'bg-cyan-600 text-white font-bold scale-110 shadow'
                      : 'bg-slate-900 hover:bg-slate-800 text-slate-300'
                  }`}
                >
                  {item}
                </button>
              ))}
            </div>
          </div>

          {/* Ações */}
          <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-800">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-slate-800 text-slate-300 rounded-lg hover:bg-slate-700 transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-4 py-2 bg-cyan-600 hover:bg-cyan-500 text-slate-950 font-bold rounded-lg transition-all flex items-center gap-1.5 shadow"
            >
              <span>{isSubmitting ? '⏳ Salvando no Supabase...' : '💾 Cadastrar Pilar'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
