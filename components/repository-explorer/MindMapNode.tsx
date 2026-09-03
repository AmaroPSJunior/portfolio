'use client';

import React from 'react';
import {
  ChevronDown,
  ChevronRight,
} from 'lucide-react';

import { RepositoryExplorerNode } from '@/types';
import { NodeIcon } from './NodeIcon';

interface MindMapNodeProps {
  node: RepositoryExplorerNode;
  active?: boolean;
  expanded?: boolean;
  compact?: boolean;
  onClick: () => void;
  onMouseEnter?: () => void;
  onMouseLeave?: () => void;
}

export const MindMapNode: React.FC<
  MindMapNodeProps
> = ({
  node,
  active = false,
  expanded = false,
  compact = false,
  onClick,
  onMouseEnter,
  onMouseLeave,
}) => {
  const hasChildren =
    Boolean(node.children?.length);

  return (
    <button
      type="button"
      onClick={onClick}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      className={`
        group relative text-left
        transition-all duration-300
        ${
          compact
            ? 'min-w-[150px] rounded-xl p-3'
            : 'min-w-[190px] rounded-2xl p-4'
        }
        ${
          active
            ? 'border-cyan-400 bg-cyan-500/15 shadow-xl shadow-cyan-500/10'
            : 'border-slate-800 bg-slate-900/90 hover:border-cyan-500/40 hover:bg-slate-900'
        }
        border
      `}
    >
      <div className="flex items-start justify-between gap-3">
        <span
          className={
            compact
              ? 'text-xl'
              : 'text-2xl'
          }
        >
          <NodeIcon
            icon={node.icon}
            iconUrl={node.iconUrl}
            size={compact ? 'md' : 'lg'}
            alt={node.title}
          />
        </span>

        {hasChildren && (
          <span className="rounded-lg border border-slate-800 bg-slate-950 p-1 text-slate-500">
            {expanded ? (
              <ChevronDown className="h-3 w-3" />
            ) : (
              <ChevronRight className="h-3 w-3" />
            )}
          </span>
        )}
      </div>

      <div className="mt-2 truncate text-xs font-bold text-slate-200 group-hover:text-cyan-300">
        {node.title}
      </div>

      {node.description && (
        <p className="mt-1 line-clamp-2 text-[9px] leading-relaxed text-slate-500">
          {node.description}
        </p>
      )}

      {node.value !== undefined && (
        <div className="mt-2 truncate font-mono text-[8px] text-cyan-400">
          {String(node.value)}
        </div>
      )}

      {hasChildren && (
        <div className="mt-2 text-[8px] font-mono text-slate-600">
          {node.children!.length} itens
        </div>
      )}
    </button>
  );
};
