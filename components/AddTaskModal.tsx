'use client';

import React, { useState, useEffect } from 'react';
import { NewTaskForm, Phase } from '@/types';

interface AddTaskModalProps {
  show: boolean;
  onClose: () => void;
  onAdd: (newTask: NewTaskForm) => void;
  phases?: Phase[];
  initialPhaseId?: number;
}

export const AddTaskModal: React.FC<AddTaskModalProps> = ({ show, onClose, onAdd, phases, initialPhaseId }) => {
  const [form, setForm] = useState<NewTaskForm>({
    phase: 1,
    title: '',
    description: '',
    requirementsInput: '',
    badgesInput: '',
  });

  useEffect(() => {
    if (show) {
      setForm((prev) => ({
        ...prev,
        phase: initialPhaseId !== undefined ? initialPhaseId : (phases && phases[0]?.id) || 1,
      }));
    }
  }, [show, initialPhaseId, phases]);

  if (!show) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title.trim()) return;
    onAdd(form);
    setForm({
      phase: 1,
      title: '',
      description: '',
      requirementsInput: '',
      badgesInput: '',
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-lg w-full p-6 space-y-4 shadow-2xl">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <h3 className="text-lg font-bold text-white flex items-center gap-2">
            <span>➕</span> Adicionar Novo Projeto ou Ideia ao Pilar
          </h3>
          <button onClick={onClose} className="text-slate-400 hover:text-white">
            ✖️
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3 text-xs">
          <div>
            <label className="block text-slate-300 mb-1 font-semibold">Pilar / Fase do Roadmap:</label>
            <select
              value={form.phase}
              onChange={(e) => setForm({ ...form, phase: Number(e.target.value) })}
              className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-xs text-slate-200 focus:outline-none focus:border-cyan-500"
            >
              {phases && phases.length > 0 ? (
                phases.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.icon} {p.title}
                  </option>
                ))
              ) : (
                <>
                  <option value={1}>Fase 1: Roadmap & Evolução do Portfólio</option>
                  <option value={2}>Fase 2: Projetos, Produtos e Serviços</option>
                  <option value={3}>Fase 3: Tech Lab & Experimentos</option>
                  <option value={4}>Fase 4: QA & Testes de Habilidade (Skills Lab)</option>
                </>
              )}
            </select>
          </div>

          <div>
            <label className="block text-slate-300 mb-1 font-semibold">Título do Projeto / Ideia:</label>
            <input
              type="text"
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              placeholder="Ex: Portal de Inteligência de Mercado B2B"
              className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-xs text-slate-200 focus:outline-none focus:border-cyan-500"
              required
            />
          </div>

          <div>
            <label className="block text-slate-300 mb-1 font-semibold">Descrição Detalhada:</label>
            <textarea
              rows={3}
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              placeholder="Descreva a proposta do projeto, público-alvo ou conceito da ideia..."
              className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-xs text-slate-200 focus:outline-none focus:border-cyan-500"
            />
          </div>

          <div>
            <label className="block text-slate-300 mb-1 font-semibold">
              Requisitos / Entregáveis (separados por ponto e vírgula):
            </label>
            <input
              type="text"
              value={form.requirementsInput}
              onChange={(e) => setForm({ ...form, requirementsInput: e.target.value })}
              placeholder="Ex: Autenticação JWT; Dashboard interativo; Exportação de relatórios"
              className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-xs text-slate-200 focus:outline-none focus:border-cyan-500"
            />
          </div>

          <div>
            <label className="block text-slate-300 mb-1 font-semibold">
              Tecnologias / Badges (separadas por vírgula):
            </label>
            <input
              type="text"
              value={form.badgesInput}
              onChange={(e) => setForm({ ...form, badgesInput: e.target.value })}
              placeholder="Ex: Next.js 15, Node.js, PostgreSQL, Supabase"
              className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-xs text-slate-200 font-mono focus:outline-none focus:border-cyan-500"
            />
          </div>

          <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-800">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-slate-800 text-slate-300 rounded-lg text-xs hover:bg-slate-700"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-cyan-600 text-slate-950 font-bold rounded-lg text-xs hover:bg-cyan-500"
            >
              Adicionar Projeto
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
