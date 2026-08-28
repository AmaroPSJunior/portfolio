'use client';

import React from 'react';
import { MindMapProps } from '../types';
import { MindMapNode } from '../MindMapNode';

export const TreeMindMap: React.FC<
  MindMapProps
> = ({
  repository,
  activeNode,
  expandedNodes,
  onNodeClick,
  onNodeMouseEnter,
  onNodeMouseLeave,
}) => {
  const children =
    repository.children || [];

  return (
    <div className="mx-auto max-w-7xl p-8 pb-40">

      <div className="flex justify-center">
        <MindMapNode
          node={repository}
          active={
            activeNode?.id ===
            repository.id
          }
          expanded={expandedNodes.includes(
            repository.id
          )}
          onClick={() =>
            onNodeClick(repository)
          }
          onMouseEnter={() =>
            onNodeMouseEnter?.(repository)
          }
          onMouseLeave={() =>
            onNodeMouseLeave?.(repository)
          }
        />
      </div>

      <div className="mx-auto my-8 h-10 w-px bg-cyan-500/30" />

      <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
        {children.map(
          (node) => {
            const expanded =
              expandedNodes.includes(
                node.id
              );

            return (
              <div
                key={node.id}
                className="rounded-2xl border border-slate-800 bg-slate-950/60 p-3"
              >
                <MindMapNode
                  node={node}
                  active={
                    activeNode?.id ===
                    node.id
                  }
                  expanded={expanded}
                  onClick={() =>
                    onNodeClick(node)
                  }
                  onMouseEnter={() =>
                    onNodeMouseEnter?.(node)
                  }
                  onMouseLeave={() =>
                    onNodeMouseLeave?.(node)
                  }
                />

                {expanded &&
                  node.children && (
                    <div className="mt-3 space-y-1 border-l border-cyan-500/20 pl-3">
                      {node.children.map(
                        (child) => (
                          <button
                            key={
                              child.id
                            }
                            type="button"
                            onClick={() =>
                              onNodeClick(
                                child
                              )
                            }
                            className="flex w-full items-center gap-2 rounded-lg px-2 py-2 text-left text-[9px] text-slate-400 hover:bg-slate-900 hover:text-cyan-300"
                          >
                            <span>
                              {
                                child.icon
                              }
                            </span>

                            <span className="min-w-0 flex-1 truncate">
                              {
                                child.title
                              }
                            </span>

                            {child.value !==
                              undefined && (
                              <span className="font-mono text-cyan-500">
                                {String(
                                  child.value
                                )}
                              </span>
                            )}
                          </button>
                        )
                      )}
                    </div>
                  )}
              </div>
            );
          }
        )}
      </div>
    </div>
  );
};