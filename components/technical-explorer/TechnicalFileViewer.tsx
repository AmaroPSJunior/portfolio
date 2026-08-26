'use client';

import React, {
  useMemo,
} from 'react';

import {
  FileCode2,
  ExternalLink,
  X,
} from 'lucide-react';

import type {
  TechnicalFile,
} from '@/lib/technical-project-explorer/types';

interface TechnicalFileViewerProps {
  file: TechnicalFile | null;

  lineStart?: number;
  lineEnd?: number;

  onClose?: () => void;
}

export const TechnicalFileViewer: React.FC<
  TechnicalFileViewerProps
> = ({
  file,
  lineStart,
  lineEnd,
  onClose,
}) => {
  const lines = useMemo(() => {
    if (!file) {
      return [];
    }

    return file.content?.split('\n') ?? [];
  }, [file]);

  if (!file) {
    return (
      <div className="flex min-h-[200px] items-center justify-center rounded-lg border border-dashed border-zinc-700 bg-zinc-950/50 p-6 text-sm text-zinc-500">
        Nenhum arquivo selecionado.
      </div>
    );
  }

  const start = Math.max((lineStart ?? 1) - 1, 0);
  const end = Math.min(
    lineEnd ?? lines.length,
    lines.length,
  );

  const visibleLines = lines.slice(start, end);

  return (
    <div className="overflow-hidden rounded-lg border border-zinc-800 bg-zinc-950">
      <div className="flex items-center justify-between border-b border-zinc-800 px-4 py-3">
        <div className="flex min-w-0 items-center gap-2">
          <FileCode2 className="h-4 w-4 shrink-0 text-blue-400" />

          <span className="truncate text-sm font-medium text-zinc-200">
            {file.path}
          </span>
        </div>

        <div className="flex items-center gap-2">
          {file.url && (
            <a
              href={file.url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 rounded-md px-2 py-1 text-xs text-zinc-400 transition hover:bg-zinc-800 hover:text-zinc-200"
            >
              <ExternalLink className="h-3.5 w-3.5" />
              GitHub
            </a>
          )}

          {onClose && (
            <button
              type="button"
              onClick={onClose}
              className="rounded-md p-1.5 text-zinc-400 transition hover:bg-zinc-800 hover:text-zinc-200"
              aria-label="Fechar arquivo"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>
      </div>

      <div className="overflow-x-auto">
        <pre className="p-4 text-xs leading-6 text-zinc-300">
          {visibleLines.map((line, index) => {
            const lineNumber = start + index + 1;
            const isHighlighted =
              lineNumber >= (lineStart ?? 1) &&
              lineNumber <= (lineEnd ?? lineStart ?? lines.length);

            return (
              <div
                key={lineNumber}
                className={
                  isHighlighted
                    ? 'bg-yellow-500/10 text-yellow-100'
                    : undefined
                }
              >
                <span className="mr-4 inline-block w-10 select-none text-right text-zinc-600">
                  {lineNumber}
                </span>

                <code>{line || ' '}</code>
              </div>
            );
          })}
        </pre>
      </div>
    </div>
  );
};
