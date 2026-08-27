'use client';

import React from 'react';
import { MindMapProps } from '../types';
import { MindMapNode } from '../MindMapNode';

export const PipelineMindMap: React.FC<
  MindMapProps
> = ({
  repository,
  activeNode,
  expandedNodes,
  onNodeClick,
}) => {
  const children =
    repository.children || [];

  return (
    <div className="min-w-[1100px] p-10 pb-40">
      <div className="mx-auto max-w-7xl">

        <div className="mb-12 flex justify-center">
          <MindMapNode
            node={repository}
            active={
              activeNode?.id ===
              repository.id
            }
            onClick={() =>
              onNodeClick(repository)
            }
          />
        </div>

        <div className="relative">
          <div className="absolute left-0 right-0 top-8 hidden h-px bg-gradient-to-r from-transparent via-cyan-500/40 to-transparent xl:block" />

          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
            {children.map(
              (node, index) => {
                const expanded =
                  expandedNodes.includes(
                    node.id
                  );

                return (
                  <div
                    key={node.id}
                    className="relative"
                  >
                    <div className="mb-3 flex justify-center">
                      <span className="z-10 flex h-4 w-4 items-center justify-center rounded-full border border-cyan-400/50 bg-slate-950">
                        <span className="h-1.5 w-1.5 rounded-full bg-cyan-400" />
                      </span>
                    </div>

                    <MindMapNode
                      node={node}
                      active={
                        activeNode?.id ===
                        node.id
                      }
                      expanded={
                        expanded
                      }
                      onClick={() =>
                        onNodeClick(
                          node
                        )
                      }
                    />

                    {expanded &&
                      node.children && (
                        <div className="mt-2 space-y-1 rounded-xl border border-slate-800 bg-slate-950 p-2">
                          {node.children.map(
                            (
                              child
                            ) => (
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
                                {
                                  child.icon
                                }{' '}
                                {
                                  child.title
                                }
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
      </div>
    </div>
  );
};