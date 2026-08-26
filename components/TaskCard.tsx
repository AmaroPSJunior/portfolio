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
  onNavigateToPhase?: (phaseId: number) => void;

  githubConfig?: GithubConfig;

  showPhaseBadge?: boolean;
  phaseLabel?: string;
  phaseIcon?: string;
  phaseId?: number;

  totalPhases?: number;
  phaseIndex?: number;
  phaseProgress?: number;

  phases?: Array<{
    id: number;
    title: string;
    icon?: string;
  }>;
}

export const TaskCard: React.FC<TaskCardProps> = ({
  task,
  isExpanded,
  onToggleExpand,
  onToggleComplete,
  onEdit,
  onDelete,
  onStatusChange,
  onNavigateToPhase,
  githubConfig,
  showPhaseBadge = false,
  phaseLabel,
  phaseIcon,
  phaseId,
  totalPhases = 0,
  phaseIndex = 0,
  phaseProgress = 0,
  phases = [],
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

  const progress = Math.min(
    100,
    Math.max(
      0,
      Math.round(
        (phaseIndex / Math.max(totalPhases, 1)) * 100
      )
    )
  );

  return (
    <div
      id={`project-card-${task.id}`}
      className={`bg-slate-900 border ${
        isFinished
          ? 'border-emerald-500/40 bg-emerald-950/10'
          : 'border-slate-800'
      } rounded-2xl p-5 space-y-4 shadow-xl hover:border-slate-700 transition-all flex flex-col h-full group`}
    >
      {/* Cabeçalho / conteúdo principal */}
      <div className="space-y-3 flex-grow">

       

        {/* Cabeçalho do projeto */}
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-start gap-2.5 flex-1 min-w-0">
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

        {/* Status - Informativo */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[10px]">
          <div className="flex items-center gap-2 bg-slate-950 border border-cyan-500/20 rounded px-2 py-1">
            <span className="text-cyan-300 font-semibold shrink-0">
              Status:
            </span>

            <span className="text-slate-200 truncate">
              {STATUS_OPTIONS.find(
                (option) => option.value === status
              )?.label || 'Pendente'}
            </span>
          </div>

          <div className="flex items-center gap-2 bg-slate-950 border border-slate-800 rounded px-2 py-1 min-w-0">
            <span className="text-slate-500 font-semibold shrink-0">
              Motivo:
            </span>

            <span className="text-slate-300 truncate">
              {statusReason || 'Sem justificativa'}
            </span>
          </div>
        </div>

        {/* GitHub */}
        <div className="flex items-center gap-1.5 pt-1 w-full min-w-0">
          {hasGithubRepository ? (
            <>
              <a
              href={githubUrl}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(event) => event.stopPropagation()}
              className="flex items-center gap-1 px-2 py-1 w-[70%] min-w-0 shrink-0 bg-slate-950 border border-slate-800 rounded-lg text-[10px] text-slate-300 font-mono hover:border-cyan-500/40 hover:text-cyan-300 transition-colors"
              title={`Abrir ${githubRepository} no GitHub`}
              aria-label={`Abrir repositório ${githubRepository} no GitHub`}
            >
              <Github className="w-3 h-3 text-slate-400 shrink-0" />
              <span className="truncate">{task.title}</span>
              <ExternalLink className="w-3 h-3 text-slate-500 shrink-0 ml-auto" />
            </a>

            {task.githubLanguage && (
              <span className="ml-auto flex items-center gap-1 px-2 py-1 bg-cyan-950/40 border border-cyan-500/20 rounded-lg text-[10px] text-cyan-300 shrink-0">
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

      {/* Progresso das fases */}
      {totalPhases > 0 && (
        <div className="space-y-2 pt-2">

          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
              Progresso
            </span>

            <span
              className={`font-mono text-xs font-black ${
                progress === 100
                  ? 'text-emerald-400'
                  : 'text-cyan-400'
              }`}
            >
              {progress}%
            </span>
          </div>

          {/* Barra */}
          <div className="w-full bg-slate-950 h-2 rounded-full overflow-hidden border border-slate-800/70">
            <div
              className={`h-full transition-all duration-700 ${
                progress === 100
                  ? 'bg-gradient-to-r from-emerald-500 to-teal-400'
                  : 'bg-gradient-to-r from-cyan-500 via-blue-500 to-indigo-500'
              }`}
              style={{
                width: `${progress}%`,
              }}
            />
          </div>

          {/* Timeline das fases */}
          <div className="flex items-center justify-between pt-1">
            {Array.from({ length: totalPhases }).map((_, index) => {
              const currentPhase = index + 1;
              const isCurrent = currentPhase === phaseIndex;
              const isCompletedPhase =
                currentPhase < phaseIndex ||
                (currentPhase === phaseIndex && isFinished);

              const phase = phases[index];

              const phaseTitle =
                phase?.title || `Fase ${currentPhase}`;

              const phaseIconValue =
                phase?.icon || '📌';

              return (
                <React.Fragment key={currentPhase}>
                  <div className="flex items-center min-w-0">
                    <button
                      type="button"
                      onClick={(event) => {
                        event.stopPropagation();
                        if (phase?.id && onNavigateToPhase) {
                          onNavigateToPhase(phase.id);
                        }
                      }}
                      disabled={!phase?.id || !onNavigateToPhase}
                      className={`group/phase relative w-8 h-8 rounded-full flex items-center justify-center border transition-all ${
                        phase?.id && onNavigateToPhase
                          ? 'cursor-pointer hover:scale-110'
                          : 'cursor-default'
                      } ${
                        isCompletedPhase
                          ? 'bg-emerald-500/20 border-emerald-500/50 text-emerald-400'
                          : isCurrent
                            ? 'bg-cyan-500/20 border-cyan-500/50 text-cyan-400 ring-2 ring-cyan-500/10'
                            : 'bg-slate-950 border-slate-700 text-white grayscale opacity-45 hover:opacity-70'
                      }`}
                      aria-label={`Ir para ${phaseTitle}`}
                    >
                      <span className="text-sm leading-none">
                        {phaseIconValue}
                      </span>

                      <span className="pointer-events-none absolute bottom-full left-1/2 z-50 mb-2 -translate-x-1/2 whitespace-nowrap rounded-lg border border-slate-700 bg-slate-900 px-2.5 py-1.5 text-[10px] font-semibold text-white opacity-0 shadow-xl transition-opacity duration-200 group-hover/phase:opacity-100">
                        {phaseTitle}
                        <span className="absolute left-1/2 top-full -translate-x-1/2 border-4 border-transparent border-t-slate-700" />
                      </span>
                    </button>
                  </div>

                  {currentPhase < totalPhases && (
                    <div
                      className={`h-px flex-1 mx-1 transition-all ${
                        currentPhase < phaseIndex ||
                        (currentPhase === phaseIndex && isFinished)
                          ? 'bg-emerald-500/60'
                          : 'bg-slate-800'
                      }`}
                    />
                  )}
                </React.Fragment>
              );
            })}
          </div>

          <div className="flex items-center justify-between text-[9px]">
            <span className="text-slate-500">
              Fase atual: {phaseIndex || 1}/{totalPhases}
            </span>

            <span
              className={
                progress === 100
                  ? 'text-emerald-400 font-semibold'
                  : 'text-slate-500'
              }
            >
              {progress === 100
                ? '✓ Todas as etapas concluídas'
                : 'Em evolução'}
            </span>
          </div>
        </div>
      )}

      {/* Detalhes expandidos */}
      {isExpanded && (
        <div className="pt-3 space-y-3 animate-fadeIn text-xs">

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
        </div>
      )}
    </div>
  );
};
