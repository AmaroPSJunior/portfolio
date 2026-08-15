'use client';

import React from 'react';
import { Task, GithubConfig } from '@/types';
import {
  CheckCircle2,
  Circle,
  ChevronDown,
  ChevronUp,
  Trash2,
  ExternalLink,
  Code2,
  CheckSquare,
} from 'lucide-react';

interface TaskCardProps {
  task: Task;
  isExpanded: boolean;
  onToggleExpand: () => void;
  onToggleComplete: () => void;
  onDelete: () => void;
  githubConfig?: GithubConfig;
}

export const TaskCard: React.FC<TaskCardProps> = ({
  task,
  isExpanded,
  onToggleExpand,
  onToggleComplete,
  onDelete,
  githubConfig,
}) => {
  return (
    <div
      id={`project-card-${task.id}`}
      className={`bg-slate-900 border ${
        task.completed ? 'border-emerald-500/40 bg-emerald-950/10' : 'border-slate-800'
      } rounded-xl p-4 space-y-3 shadow-md hover:border-slate-700 transition-all flex flex-col justify-between`}
    >
      <div className="space-y-2">
        {/* Header with Title and Toggle Complete Checkbox */}
        <div className="flex items-start justify-between gap-2">
          <div className="flex items-start gap-2.5 flex-1">
            <button
              onClick={onToggleComplete}
              className="mt-0.5 text-slate-400 hover:text-emerald-400 transition-colors shrink-0"
              title={task.completed ? 'Marcar como pendente' : 'Marcar como concluído'}
            >
              {task.completed ? (
                <CheckCircle2 className="w-5 h-5 text-emerald-400 fill-emerald-500/20" />
              ) : (
                <Circle className="w-5 h-5 text-slate-600 hover:text-slate-400" />
              )}
            </button>
            <h3
              onClick={onToggleExpand}
              className={`text-xs font-bold leading-snug cursor-pointer hover:text-cyan-300 transition-colors ${
                task.completed ? 'text-slate-400 line-through' : 'text-slate-100'
              }`}
            >
              {task.title}
            </h3>
          </div>

          <div className="flex items-center gap-1 shrink-0">
            <button
              onClick={onToggleExpand}
              className="p-1 text-slate-400 hover:text-white rounded hover:bg-slate-800 transition-colors"
            >
              {isExpanded ? (
                <ChevronUp className="w-4 h-4 text-cyan-400" />
              ) : (
                <ChevronDown className="w-4 h-4" />
              )}
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                if (confirm(`Deseja excluir o projeto "${task.title}"?`)) {
                  onDelete();
                }
              }}
              className="p-1 text-slate-500 hover:text-red-400 rounded hover:bg-red-500/10 transition-colors"
              title="Excluir projeto"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Short description preview */}
        <p className="text-[11px] text-slate-400 line-clamp-2 leading-relaxed">
          {task.description}
        </p>

        {/* Badges */}
        {task.badges && task.badges.length > 0 && (
          <div className="flex flex-wrap gap-1 pt-1">
            {task.badges.map((badge, idx) => (
              <span
                key={idx}
                className="px-2 py-0.5 bg-slate-950 text-cyan-400 border border-cyan-500/20 rounded text-[10px] font-mono font-medium"
              >
                {badge}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Expanded Details Content */}
      {isExpanded && (
        <div className="pt-3 border-t border-slate-800 space-y-3 animate-fadeIn text-xs">
          {/* Requirements list */}
          {task.requirements && task.requirements.length > 0 && (
            <div className="space-y-1.5">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1">
                <CheckSquare className="w-3 h-3 text-emerald-400" />
                Requisitos & Entregáveis:
              </span>
              <ul className="space-y-1 pl-1">
                {task.requirements.map((req, idx) => (
                  <li key={idx} className="text-slate-300 flex items-start gap-1.5 text-[11px]">
                    <span className="text-emerald-400 shrink-0">✓</span>
                    <span className="leading-tight">{req}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Repository Link Footer */}
          {githubConfig && (
            <div className="pt-2 flex items-center justify-between text-[10px] border-t border-slate-800/80">
              <span className="text-slate-500 flex items-center gap-1 font-mono">
                <Code2 className="w-3 h-3 text-slate-400" />
                {githubConfig.owner}/{githubConfig.repo}
              </span>

              <a
                href={`https://github.com/${githubConfig.owner}/${githubConfig.repo}`}
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
