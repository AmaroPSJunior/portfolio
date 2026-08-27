'use client';

import React from 'react';
import { MindMapProps } from '../types';
import { MindMapNode } from '../MindMapNode';

export const RadialMindMap: React.FC<
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
    <div className="min-w-[1100px] p-12">
      <div className="relative mx-auto min-h-[850px] max-w-[1250px]">

        <div className="absolute left-1/2 top-1/2 z-20 -translate-x-1/2 -translate-y-1/2">
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
          />
        </div>

        {children.map(
          (node, index) => {
            const angle =
              (index /
                Math.max(
                  children.length,
                  1
                )) *
                Math.PI *
                2 -
              Math.PI / 2;

            const radius = 390;

            const x =
              50 +
              (Math.cos(angle) *
                radius) /
                12;

            const y =
              50 +
              (Math.sin(angle) *
                radius) /
                7;

            const expanded =
              expandedNodes.includes(
                node.id
              );

            return (
              <div
                key={node.id}
                className="absolute -translate-x-1/2 -translate-y-1/2"
                style={{
                  left: `${x}%`,
                  top: `${y}%`,
                }}
              >
                <div className="absolute left-1/2 top-1/2 -z-10 h-px w-[390px] origin-left bg-cyan-500/10" />

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
                />

                {expanded &&
                  node.children &&
                  node.children.length >
                    0 && (
                    <div className="absolute left-1/2 top-full z-30 mt-2 w-[260px] -translate-x-1/2 rounded-xl border border-slate-800 bg-slate-950/95 p-2 shadow-2xl">
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
                              {child.icon}
                            </span>

                            <span className="min-w-0 flex-1 truncate">
                              {
                                child.title
                              }
                            </span>
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
