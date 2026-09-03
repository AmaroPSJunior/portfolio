'use client';

import React from 'react';
import {
  ExternalLink,
  Github,
  Network,
  Pencil,
  Trash2,
  CheckCircle2,
} from 'lucide-react';
import { Task, GithubConfig, WorkStatus } from '@/types';

interface TaskCardProps {
  task: Task;

  // Mantidos para compatibilidade com RoadmapTab
  isExpanded?: boolean;
  onToggleExpand?: () => void;

  onToggleComplete?: () => void;
  onEdit?: () => void;
  onDelete: () => void;

  onStatusChange?: (
    status: WorkStatus,
    statusReason: string
  ) => void;

  onNavigateToPhase?: (phaseId: number) => void;

  onOpenRepositoryExplorer?: (task: Task) => void;

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
  onEdit,
  onDelete,
  onNavigateToPhase,
  onOpenRepositoryExplorer,
  githubConfig,
  phaseLabel,
  phaseIcon,
  totalPhases = 0,
  phaseIndex = 0,
  phaseProgress = 0,
  phases = [],
}) => {
  const hasGithubRepository =
    Boolean(task.githubHtmlUrl) ||
    Boolean(task.githubFullName) ||
    Boolean(task.githubName);

  const githubRepository =
    task.githubFullName ||
    task.githubName ||
    (githubConfig?.owner && githubConfig?.repo
      ? `${githubConfig.owner}/${githubConfig.repo}`
      : '');

  const githubUrl =
    task.githubHtmlUrl ||
    (githubConfig?.owner && githubConfig?.repo
      ? `https://github.com/${githubConfig.owner}/${githubConfig.repo}`
      : '');

  const progress = Math.min(
    100,
    Math.max(0, Math.round(phaseProgress))
  );

  const isFinished =
    task.completed || task.status === 'completed';

  return (
    <article
      id={`project-card-${task.id}`}
      className={`
        group relative overflow-hidden
        rounded-2xl
        border
        bg-slate-950/90
        shadow-xl
        transition-all duration-300
        hover:-translate-y-0.5
        ${
          isFinished
            ? 'border-emerald-500/30 hover:border-emerald-400/50'
            : 'border-slate-800 hover:border-cyan-500/40'
        }
      `}
    >
      {/* Linha de destaque superior */}
      <div
        className={`
          absolute inset-x-0 top-0 h-px
          ${
            isFinished
              ? 'bg-gradient-to-r from-transparent via-emerald-400 to-transparent'
              : 'bg-gradient-to-r from-transparent via-cyan-400 to-transparent'
          }
        `}
      />

      <div className="p-5">
        {/* ============================================================
            HEADER
        ============================================================ */}
        <div className="flex items-start justify-between gap-3">
          <button
            type="button"
            onClick={() => {
              if (onNavigateToPhase && task.phase) {
                onNavigateToPhase(task.phase);
              }
            }}
            className="flex min-w-0 items-center gap-3 text-left"
            title={
              phaseLabel
                ? `Ir para ${phaseLabel}`
                : 'Ir para a fase do projeto'
            }
          >
            <div
              className={`
                flex h-11 w-11 shrink-0 items-center justify-center
                rounded-xl border
                text-lg
                shadow-inner
                transition-all
                ${
                  isFinished
                    ? 'border-emerald-500/30 bg-emerald-500/10'
                    : 'border-cyan-500/20 bg-cyan-500/10'
                }
              `}
            >
              {phaseIcon || '📦'}
            </div>

            <div className="min-w-0">
              <div className="mb-1 flex items-center gap-2">
                <span className="text-[9px] font-bold uppercase tracking-[0.2em] text-slate-500">
                  Projeto
                </span>

                {isFinished && (
                  <span className="flex items-center gap-1 text-[9px] font-bold uppercase tracking-wider text-emerald-400">
                    <CheckCircle2 className="h-3 w-3" />
                    Concluído
                  </span>
                )}
              </div>

              <h3 className="truncate text-sm font-black text-white transition-colors group-hover:text-cyan-300 sm:text-base">
                {task.title}
              </h3>

              {phaseLabel && (
                <p className="mt-0.5 truncate text-[10px] text-slate-500">
                  {phaseLabel}
                </p>
              )}
            </div>
          </button>

          {/* Ações administrativas discretas */}
          <div className="flex shrink-0 items-center gap-1">
            {onEdit && (
              <button
                type="button"
                onClick={(event) => {
                  event.stopPropagation();
                  onEdit();
                }}
                className="rounded-lg p-1.5 text-slate-600 transition-colors hover:bg-cyan-500/10 hover:text-cyan-400"
                title="Editar projeto"
                aria-label={`Editar projeto ${task.title}`}
              >
                <Pencil className="h-3.5 w-3.5" />
              </button>
            )}

            <button
              type="button"
              onClick={(event) => {
                event.stopPropagation();
                onDelete();
              }}
              className="rounded-lg p-1.5 text-slate-600 transition-colors hover:bg-red-500/10 hover:text-red-400"
              title="Excluir projeto"
              aria-label={`Excluir projeto ${task.title}`}
            >
              <Trash2 className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>

        {/* ============================================================
            EXPLORADOR — CTA PRINCIPAL
        ============================================================ */}
        <div className="mt-5">
          {onOpenRepositoryExplorer ? (
            <button
              type="button"
              disabled={!hasGithubRepository}
              onClick={(event) => {
                event.stopPropagation();

                if (!hasGithubRepository) return;

                onOpenRepositoryExplorer(task);
              }}
              className={`
                group/explorer
                relative w-full overflow-hidden
                rounded-2xl
                border
                p-4
                text-left
                transition-all duration-300
                ${
                  hasGithubRepository
                    ? 'border-cyan-400/30 bg-gradient-to-br from-cyan-500/15 via-cyan-950/30 to-slate-950 hover:border-cyan-300/60 hover:from-cyan-400/20 hover:via-cyan-950/50 hover:shadow-lg hover:shadow-cyan-950/40'
                    : 'cursor-not-allowed border-slate-800 bg-slate-900/50 opacity-50'
                }
              `}
              title={
                hasGithubRepository
                  ? 'Abrir Explorador Técnico do projeto'
                  : 'Este projeto não possui repositório GitHub associado'
              }
              aria-label={`Explorar tecnicamente ${task.title}`}
            >
              {/* Glow */}
              {hasGithubRepository && (
                <span className="pointer-events-none absolute -right-10 -top-10 h-28 w-28 rounded-full bg-cyan-400/10 blur-2xl transition-all duration-500 group-hover/explorer:bg-cyan-400/20" />
              )}

              <div className="relative flex items-center gap-4">
                <div
                  className={`
                    flex h-12 w-12 shrink-0 items-center justify-center
                    rounded-xl border
                    ${
                      hasGithubRepository
                        ? 'border-cyan-400/30 bg-cyan-400/10 text-cyan-300'
                        : 'border-slate-700 bg-slate-900 text-slate-600'
                    }
                  `}
                >
                  <Network className="h-6 w-6 transition-transform duration-300 group-hover/explorer:scale-110" />
                </div>

                <div className="min-w-0 flex-1">
                 
                  <p
                    className={`
                      mt-1 text-sm font-black
                      ${
                        hasGithubRepository
                          ? 'text-white group-hover/explorer:text-cyan-200'
                          : 'text-slate-600'
                      }
                    `}
                  >
                    Explorar este projeto
                  </p>

                  <p className="mt-0.5 text-[10px] leading-relaxed text-slate-500">
                    Arquitetura, tecnologias, arquivos, testes, APIs,
                    banco de dados e CI/CD.
                  </p>
                </div>
              </div>
            </button>
          ) : (
            <div className="rounded-2xl border border-slate-800 bg-slate-900/40 p-4">
              <div className="flex items-center gap-3">
                <Network className="h-5 w-5 text-slate-600" />
                <span className="text-xs text-slate-600">
                  Explorador técnico indisponível
                </span>
              </div>
            </div>
          )}
        </div>

        {/* ============================================================
            REPOSITÓRIO
        ============================================================ */}
        <div className="mt-3">
          {hasGithubRepository ? (
            <a
              href={githubUrl}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(event) => event.stopPropagation()}
              className="flex w-full items-center gap-2 rounded-xl border border-slate-800 bg-slate-900/60 px-3 py-2.5 transition-all hover:border-slate-700 hover:bg-slate-900"
              title={`Abrir ${githubRepository} no GitHub`}
            >
              <Github className="h-3.5 w-3.5 shrink-0 text-slate-400" />

              <div className="min-w-0 flex-1">
                <span className="block text-[8px] font-bold uppercase tracking-wider text-slate-600">
                  Repositório
                </span>

                <span className="block truncate font-mono text-[10px] text-slate-400">
                  {githubRepository || task.title}
                </span>
              </div>

              <ExternalLink className="h-3 w-3 shrink-0 text-slate-600" />
            </a>
          ) : (
            <div className="flex items-center gap-2 rounded-xl border border-slate-800/70 bg-slate-900/30 px-3 py-2.5">
              <Github className="h-3.5 w-3.5 text-slate-700" />

              <span className="text-[10px] text-slate-600">
                Sem repositório GitHub associado
              </span>
            </div>
          )}
        </div>

        {/* ============================================================
            PROGRESSO
        ============================================================ */}
        {totalPhases > 0 && (
          <div className="mt-5 border-t border-slate-800/70 pt-4">
            <div className="mb-2 flex items-center justify-between">
              <div>
                <span className="text-[9px] font-black uppercase tracking-[0.18em] text-slate-600">
                  Evolução
                </span>

                <span className="ml-2 text-[9px] text-slate-600">
                  Fase {phaseIndex || 1}/{totalPhases}
                </span>
              </div>

              <span
                className={`
                  font-mono text-xs font-black
                  ${
                    progress === 100
                      ? 'text-emerald-400'
                      : 'text-cyan-400'
                  }
                `}
              >
                {progress}%
              </span>
            </div>

            {/* Barra principal */}
            <div className="h-2 w-full overflow-hidden rounded-full border border-slate-800 bg-slate-950">
              <div
                className={`
                  h-full rounded-full transition-all duration-700
                  ${
                    progress === 100
                      ? 'bg-gradient-to-r from-emerald-500 via-teal-400 to-emerald-300'
                      : 'bg-gradient-to-r from-cyan-500 via-blue-500 to-indigo-500'
                  }
                `}
                style={{
                  width: `${progress}%`,
                }}
              />
            </div>

            {/* ========================================================
                TIMELINE DAS FASES
            ======================================================== */}
            <div className="mt-4 flex items-center">
              {Array.from({ length: totalPhases }).map((_, index) => {
                const currentPhase = index + 1;
                const isCurrent =
                  currentPhase === phaseIndex;

                const isCompletedPhase =
                  currentPhase < phaseIndex ||
                  (currentPhase === phaseIndex && isFinished);

                const phase = phases[index];

                const phaseTitle =
                  phase?.title ||
                  `Fase ${currentPhase}`;

                const phaseIconValue =
                  phase?.icon || '•';

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
                      className={`
                        h-px min-w-2 flex-1
                        ${
                          currentPhase < phaseIndex ||
                          (currentPhase === phaseIndex &&
                            isFinished)
                            ? 'bg-emerald-500/50'
                            : 'bg-slate-800'
                        }
                      `}
                    />
                  )}
                </React.Fragment>
              );

              })}

            </div>




            <div className="mt-2 flex items-center justify-between text-[8px]">
              <span className="text-slate-600">
                {isFinished
                  ? '✓ Projeto concluído'
                  : 'Projeto em evolução'}
              </span>

              {phaseLabel && (
                <span className="max-w-[55%] truncate text-slate-600">
                  {phaseLabel}
                </span>
              )}
            </div>
          </div>
        )}
      </div>
    </article>
  );
};
