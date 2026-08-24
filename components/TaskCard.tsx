'use client';

import React, { useEffect, useState } from 'react';
import { Task, GithubConfig, WorkStatus } from '@/types';
import { STATUS_OPTIONS } from '@/data/constants';
import {
  CheckCircle2,
  Circle,
  ChevronDown,
  ChevronUp,
  Trash2,
  ExternalLink,
  Code2,
  CheckSquare,
  Pencil,
  GitBranch,
  CalendarDays,
  Github,
} from 'lucide-react';

interface TaskCardProps {
  task: Task;
  isExpanded: boolean;
  onToggleExpand: () => void;
  onToggleComplete: () => void;
  onEdit?: () => void;
  onDelete: () => void;

  onStatusChange?: (
    status: WorkStatus,
    statusReason: string
  ) => void;

  githubConfig?: GithubConfig;

  showPhaseBadge?: boolean;
  phaseLabel?: string;
  phaseIcon?: string;
  phaseId?: number;

  totalPhases?: number;
  phaseIndex?: number;
}

export const TaskCard: React.FC<TaskCardProps> = ({
  task,
  isExpanded,
  onToggleExpand,
  onToggleComplete,
  onEdit,
  onDelete,
  onStatusChange,
  githubConfig,
  showPhaseBadge = false,
  phaseLabel,
  phaseIcon,
  phaseId,
  totalPhases = 0,
  phaseIndex = 0,
}) => {
  const status =
    task.status ||
    (task.completed ? 'completed' : 'pending');

  const [statusReason, setStatusReason] = useState(
    task.statusReason || ''
  );

  useEffect(() => {
    setStatusReason(task.statusReason || '');
  }, [task.statusReason]);

  const hasGithubRepository =
    Boolean(task.githubHtmlUrl) ||
    Boolean(task.githubFullName) ||
    Boolean(task.githubName);

  const githubRepository =
    task.githubFullName ||
    task.githubName ||
    (githubConfig
      ? `${githubConfig.owner}/${githubConfig.repo}`
      : '');

  const githubUrl =
    task.githubHtmlUrl ||
    (githubConfig
      ? `https://github.com/${githubConfig.owner}/${githubConfig.repo}`
      : '');

  const formatGithubDate = (value?: string) => {
    if (!value) return null;

    const date = new Date(value);

    if (Number.isNaN(date.getTime())) {
      return null;
    }

    return new Intl.DateTimeFormat('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    }).format(date);
  };

  const pushedDate = formatGithubDate(
    task.githubPushedAt
  );

  const isFinished =
    task.completed || task.status === 'completed';

  const progress =
    totalPhases > 0 && phaseIndex > 0
      ? Math.min(
          100,
          Math.max(
            0,
            Math.round(
              ((isFinished
                ? phaseIndex
                : phaseIndex - 1) /
                totalPhases) *
                100
            )
          )
        )
      : 0;

  return (
    <div
      id={`project-card-${task.id}`}
      className={`bg-slate-900 border ${
        task.completed
          ? 'border-emerald-500/40 bg-emerald-950/10'
          : 'border-slate-800'
      } rounded-2xl p-5 space-y-4 shadow-xl hover:border-slate-700 transition-all flex flex-col h-full group`}
    >
      {/* Cabeçalho / conteúdo principal */}
      <div className="space-y-3 flex-grow">

        {/* Fase - exibida somente quando necessário */}
        {showPhaseBadge && (
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-1.5 min-w-0">
              <span className="text-base shrink-0">
                {phaseIcon || '📌'}
              </span>

              <span className="text-[10px] font-bold uppercase tracking-wider text-cyan-300 truncate">
                {phaseLabel ||
                  (typeof phaseId === 'number'
                    ? `Fase ${phaseId}`
                    : 'Fase')}
              </span>
            </div>

            {typeof phaseId === 'number' && (
              <span className="text-[9px] px-1.5 py-0.5 rounded-md bg-cyan-950/50 border border-cyan-500/20 text-cyan-400 font-mono shrink-0">
                #{phaseId}
              </span>
            )}
          </div>
        )}

        {/* Cabeçalho do projeto */}
        <div className="flex items-start justify-between gap-3">

          <div className="flex items-start gap-2.5 flex-1 min-w-0">

            {/* Checkbox */}
            <button
              type="button"
              onClick={(event) => {
                event.stopPropagation();
                onToggleComplete();
              }}
              className="mt-0.5 text-slate-400 hover:text-emerald-400 transition-colors shrink-0"
              title={
                task.completed
                  ? 'Marcar como pendente'
                  : 'Marcar como concluído'
              }
              aria-label={
                task.completed
                  ? `Marcar ${task.title} como pendente`
                  : `Marcar ${task.title} como concluído`
              }
            >
              {task.completed ? (
                <CheckCircle2 className="w-5 h-5 text-emerald-400 fill-emerald-500/20" />
              ) : (
                <Circle className="w-5 h-5 text-slate-600 hover:text-slate-400" />
              )}
            </button>

            <div className="min-w-0 flex-1">
              <h3
                onClick={onToggleExpand}
                className={`text-base font-extrabold leading-tight cursor-pointer transition-colors ${
                  task.completed
                    ? 'text-slate-400 line-through'
                    : 'text-slate-100 group-hover:text-cyan-400'
                }`}
              >
                {task.title}
              </h3>
            </div>
          </div>

          {/* Ações */}
          <div className="flex items-center gap-1 shrink-0">

            <button
              type="button"
              onClick={(event) => {
                event.stopPropagation();
                onToggleExpand();
              }}
              className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
              title={
                isExpanded
                  ? 'Recolher projeto'
                  : 'Expandir projeto'
              }
              aria-label={
                isExpanded
                  ? 'Recolher projeto'
                  : 'Expandir projeto'
              }
            >
              {isExpanded ? (
                <ChevronUp className="w-4 h-4 text-cyan-400" />
              ) : (
                <ChevronDown className="w-4 h-4" />
              )}
            </button>

            {onEdit && (
              <button
                type="button"
                onClick={(event) => {
                  event.stopPropagation();
                  onEdit();
                }}
                className="p-1.5 text-slate-500 hover:text-cyan-400 rounded-lg hover:bg-cyan-500/10 transition-colors"
                title="Editar projeto"
                aria-label={`Editar projeto ${task.title}`}
              >
                <Pencil className="w-3.5 h-3.5" />
              </button>
            )}

            <button
              type="button"
              onClick={(event) => {
                event.stopPropagation();
                onDelete();
              }}
              className="p-1.5 text-slate-500 hover:text-red-400 rounded-lg hover:bg-red-500/10 transition-colors"
              title="Excluir projeto"
              aria-label={`Excluir projeto ${task.title}`}
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Descrição */}
        <p className="text-[11px] text-slate-400 line-clamp-3 leading-relaxed">
          {task.description}
        </p>

        {/* Badges */}
        {task.badges && task.badges.length > 0 && (
          <div className="flex flex-wrap gap-1.5 pt-1">
            {task.badges.map((badge, idx) => (
              <span
                key={idx}
                className="px-2 py-0.5 bg-slate-950 text-cyan-400 border border-cyan-500/20 rounded text-[9px] font-mono font-medium"
              >
                {badge}
              </span>
            ))}
          </div>
        )}

        {/* Status */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[10px]">

          <label className="flex items-center gap-2 text-cyan-300 font-semibold">
            Status:

            <select
              value={status}
              onChange={(event) =>
                onStatusChange?.(
                  event.target.value as WorkStatus,
                  statusReason
                )
              }
              className="min-w-0 flex-1 bg-slate-950 border border-cyan-500/30 rounded px-2 py-1 text-[10px] text-slate-200 font-normal focus:outline-none focus:border-cyan-400"
              aria-label={`Status do projeto ${task.title}`}
            >
              {STATUS_OPTIONS.map((option) => (
                <option
                  key={option.value}
                  value={option.value}
                >
                  {option.label}
                </option>
              ))}
            </select>
          </label>

          <input
            type="text"
            value={statusReason}
            onChange={(event) =>
              setStatusReason(event.target.value)
            }
            onBlur={() =>
              onStatusChange?.(status, statusReason)
            }
            placeholder="Justificativa do status"
            className="min-w-0 bg-slate-950 border border-slate-800 rounded px-2 py-1 text-[10px] text-slate-300 placeholder-slate-600 focus:outline-none focus:border-cyan-500"
            aria-label={`Justificativa do status do projeto ${task.title}`}
          />
        </div>

        {/* GitHub */}
        <div className="flex flex-wrap items-center gap-1.5 pt-1">

          {hasGithubRepository ? (
            <>
              <span className="flex items-center gap-1 px-2 py-1 bg-slate-950 border border-slate-800 rounded-lg text-[10px] text-slate-300 font-mono max-w-full">
                <Github className="w-3 h-3 text-slate-400 shrink-0" />

                <span className="truncate">
                  {githubRepository}
                </span>
              </span>

              {task.githubLanguage && (
                <span className="flex items-center gap-1 px-2 py-1 bg-cyan-950/40 border border-cyan-500/20 rounded-lg text-[10px] text-cyan-300">
                  <Code2 className="w-3 h-3" />
                  {task.githubLanguage}
                </span>
              )}
            </>
          ) : (
            <span className="px-2 py-1 bg-slate-950 border border-slate-800 rounded-lg text-[10px] text-slate-600">
              Sem repositório GitHub associado
            </span>
          )}
        </div>
      </div>

      {/* Barra de progresso */}
      {totalPhases > 0 && (
        <div className="space-y-1.5 pt-1">

          <div className="flex justify-between items-end text-[10px] font-bold uppercase tracking-wider">
            <span className="text-slate-500">
              Progresso das fases
            </span>

            <span className="text-cyan-400 font-mono text-xs">
              {progress}%
            </span>
          </div>

          <div className="w-full bg-slate-950 h-1.5 rounded-full overflow-hidden border border-slate-800/50">
            <div
              className="bg-gradient-to-r from-cyan-500 via-blue-500 to-indigo-500 h-full transition-all duration-1000"
              style={{
                width: `${progress}%`,
              }}
            />
          </div>
        </div>
      )}

      {/* Link GitHub */}
      {githubUrl && (
        <div className="flex justify-end pt-1">
          <a
            href={githubUrl}
            target="_blank"
            rel="noopener noreferrer"
            onClick={(event) =>
              event.stopPropagation()
            }
            className="text-[11px] text-cyan-400 hover:text-cyan-300 flex items-center gap-1.5 font-bold transition-all hover:translate-x-1"
          >
            [ Ver no GitHub{' '}
            <ExternalLink className="w-3 h-3" /> ]
          </a>
        </div>
      )}

      {/* Detalhes expandidos */}
      {isExpanded && (
        <div className="pt-3 border-t border-slate-800 space-y-3 animate-fadeIn text-xs">

          {/* GitHub Repository Details */}
          {hasGithubRepository && (
            <div className="space-y-2">

              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1">
                <Github className="w-3 h-3 text-slate-400" />
                Repositório GitHub
              </span>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">

                {task.githubFullName && (
                  <div className="bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-2">
                    <span className="text-[9px] text-slate-600 block uppercase">
                      Repositório
                    </span>

                    <span className="text-[10px] text-slate-300 font-mono break-all">
                      {task.githubFullName}
                    </span>
                  </div>
                )}

                {task.githubLanguage && (
                  <div className="bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-2">
                    <span className="text-[9px] text-slate-600 block uppercase">
                      Linguagem
                    </span>

                    <span className="text-[10px] text-cyan-300">
                      {task.githubLanguage}
                    </span>
                  </div>
                )}

                {pushedDate && (
                  <div className="bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-2">
                    <span className="text-[9px] text-slate-600 block uppercase">
                      Último Push
                    </span>

                    <span className="flex items-center gap-1 text-[10px] text-slate-300">
                      <GitBranch className="w-3 h-3 text-emerald-400" />
                      {pushedDate}
                    </span>
                  </div>
                )}

                {task.githubUpdatedAt && (
                  <div className="bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-2">
                    <span className="text-[9px] text-slate-600 block uppercase">
                      Atualizado
                    </span>

                    <span className="flex items-center gap-1 text-[10px] text-slate-300">
                      <CalendarDays className="w-3 h-3 text-cyan-400" />

                      {formatGithubDate(
                        task.githubUpdatedAt
                      )}
                    </span>
                  </div>
                )}
              </div>

              {task.githubDescription && (
                <p className="text-[10px] text-slate-500 leading-relaxed">
                  {task.githubDescription}
                </p>
              )}
            </div>
          )}

          {/* Requisitos */}
          {task.requirements &&
            task.requirements.length > 0 && (
              <div className="space-y-1.5">

                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1">
                  <CheckSquare className="w-3 h-3 text-emerald-400" />
                  Requisitos & Entregáveis:
                </span>

                <ul className="space-y-1 pl-1">
                  {task.requirements.map(
                    (req, idx) => (
                      <li
                        key={idx}
                        className="text-slate-300 flex items-start gap-1.5 text-[11px]"
                      >
                        <span className="text-emerald-400 shrink-0">
                          ✓
                        </span>

                        <span className="leading-tight">
                          {req}
                        </span>
                      </li>
                    )
                  )}
                </ul>
              </div>
            )}

          {/* Link GitHub expandido */}
          {githubUrl && (
            <div className="pt-2 flex items-center justify-between text-[10px] border-t border-slate-800/80">

              <span className="text-slate-500 flex items-center gap-1 font-mono">
                <Code2 className="w-3 h-3 text-slate-400" />
                {githubRepository}
              </span>

              <a
                href={githubUrl}
                target="_blank"
                rel="noreferrer"
                className="text-cyan-400 hover:text-cyan-300 flex items-center gap-1 font-semibold hover:underline"
              >
                Ver no GitHub
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
