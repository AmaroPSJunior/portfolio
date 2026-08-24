'use client';

import React, { useEffect, useState } from 'react';
import { Task, Phase, WorkStatus } from '@/types';
import { STATUS_OPTIONS } from '@/data/constants';

export interface EditTaskForm {
  phase: number;
  title: string;
  description: string;
  requirementsInput: string;
  badgesInput: string;
  status: WorkStatus;
  statusReason: string;
}

interface EditTaskModalProps {
  show: boolean;
  task: Task | null;
  phases?: Phase[];
  onClose: () => void;
  onSave: (taskId: number, form: EditTaskForm) => Promise<void>;
}

const createInitialForm = (task: Task | null): EditTaskForm => ({
  phase: task?.phase ?? 1,
  title: task?.title ?? '',
  description: task?.description ?? '',
  requirementsInput: task?.requirements?.join('; ') ?? '',
  badgesInput: task?.badges?.join(', ') ?? '',
  status: task?.status ?? 'pending',
  statusReason: task?.statusReason ?? '',
});

export const EditTaskModal: React.FC<EditTaskModalProps> = ({
  show,
  task,
  phases,
  onClose,
  onSave,
}) => {
  const [form, setForm] = useState<EditTaskForm>(createInitialForm(task));
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (show && task) {
      setForm(createInitialForm(task));
    }
  }, [show, task]);

  if (!show || !task) {
    return null;
  }

  const updateField = <K extends keyof EditTaskForm>(
    field: K,
    value: EditTaskForm[K]
  ) => {
    setForm((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!form.title.trim()) {
      return;
    }

    setIsSaving(true);

    try {
      await onSave(task.id, {
        ...form,
        title: form.title.trim(),
        description: form.description.trim(),
        requirementsInput: form.requirementsInput.trim(),
        badgesInput: form.badgesInput.trim(),
        statusReason: form.statusReason.trim(),
      });

      onClose();
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget && !isSaving) {
          onClose();
        }
      }}
    >
      <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-2xl w-full p-6 space-y-4 shadow-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div>
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <span>✏️</span>
              Editar Projeto
            </h3>

            <p className="text-[10px] text-slate-500 mt-1">
              ID #{task.id} · {task.title}
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            disabled={isSaving}
            className="text-slate-400 hover:text-white disabled:opacity-50"
            aria-label="Fechar modal"
          >
            ✖️
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          {/* Fase */}
          <div>
            <label className="block text-slate-300 mb-1 font-semibold">
              Fase do Roadmap:
            </label>

            <select
              value={form.phase}
              onChange={(event) =>
                updateField('phase', Number(event.target.value))
              }
              className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-xs text-slate-200 focus:outline-none focus:border-cyan-500"
              disabled={isSaving}
            >
              {phases && phases.length > 0 ? (
                phases.map((phase) => (
                  <option key={phase.id} value={phase.id}>
                    {phase.icon} {phase.title}
                  </option>
                ))
              ) : (
                <option value={form.phase}>
                  Fase {form.phase}
                </option>
              )}
            </select>
          </div>

          {/* Status */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-300 mb-1 font-semibold">
                Status do Projeto:
              </label>

              <select
                value={form.status}
                onChange={(event) =>
                  updateField(
                    'status',
                    event.target.value as WorkStatus
                  )
                }
                className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-xs text-slate-200 focus:outline-none focus:border-cyan-500"
                disabled={isSaving}
              >
                {STATUS_OPTIONS.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-slate-300 mb-1 font-semibold">
                Justificativa:
              </label>

              <input
                type="text"
                value={form.statusReason}
                onChange={(event) =>
                  updateField('statusReason', event.target.value)
                }
                placeholder="Por que está neste status?"
                className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-xs text-slate-200 focus:outline-none focus:border-cyan-500"
                disabled={isSaving}
              />
            </div>
          </div>

          {/* Título */}
          <div>
            <label className="block text-slate-300 mb-1 font-semibold">
              Título do Projeto / Ideia:
            </label>

            <input
              type="text"
              value={form.title}
              onChange={(event) =>
                updateField('title', event.target.value)
              }
              placeholder="Ex: Portal de Inteligência de Mercado B2B"
              className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-xs text-slate-200 focus:outline-none focus:border-cyan-500"
              required
              disabled={isSaving}
            />
          </div>

          {/* Descrição */}
          <div>
            <label className="block text-slate-300 mb-1 font-semibold">
              Descrição Detalhada:
            </label>

            <textarea
              rows={5}
              value={form.description}
              onChange={(event) =>
                updateField('description', event.target.value)
              }
              placeholder="Descreva a proposta do projeto, público-alvo ou conceito da ideia..."
              className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-xs text-slate-200 focus:outline-none focus:border-cyan-500 resize-y"
              disabled={isSaving}
            />
          </div>

          {/* Requisitos */}
          <div>
            <label className="block text-slate-300 mb-1 font-semibold">
              Requisitos / Entregáveis:
            </label>

            <input
              type="text"
              value={form.requirementsInput}
              onChange={(event) =>
                updateField('requirementsInput', event.target.value)
              }
              placeholder="Ex: Autenticação JWT; Dashboard interativo; Exportação de relatórios"
              className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-xs text-slate-200 focus:outline-none focus:border-cyan-500"
              disabled={isSaving}
            />

            <p className="text-[9px] text-slate-500 mt-1">
              Separe os itens usando ponto e vírgula (;)
            </p>
          </div>

          {/* Badges */}
          <div>
            <label className="block text-slate-300 mb-1 font-semibold">
              Tecnologias / Badges:
            </label>

            <input
              type="text"
              value={form.badgesInput}
              onChange={(event) =>
                updateField('badgesInput', event.target.value)
              }
              placeholder="Ex: Next.js 15, Node.js, PostgreSQL, Supabase"
              className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-xs text-slate-200 font-mono focus:outline-none focus:border-cyan-500"
              disabled={isSaving}
            />

            <p className="text-[9px] text-slate-500 mt-1">
              Separe as tecnologias usando vírgulas (,)
            </p>
          </div>

          {/* Ações */}
          <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-800">
            <button
              type="button"
              onClick={onClose}
              disabled={isSaving}
              className="px-4 py-2 bg-slate-800 text-slate-300 rounded-lg text-xs hover:bg-slate-700 disabled:opacity-50"
            >
              Cancelar
            </button>

            <button
              type="submit"
              disabled={isSaving || !form.title.trim()}
              className="px-4 py-2 bg-cyan-600 text-slate-950 font-bold rounded-lg text-xs hover:bg-cyan-500 disabled:opacity-50"
            >
              {isSaving ? 'Salvando...' : 'Salvar Alterações'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};