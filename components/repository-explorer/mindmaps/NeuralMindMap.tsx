'use client';

import React from 'react';
import { MindMapProps } from '../types';
import { MindMapNode } from '../MindMapNode';

export const NeuralMindMap: React.FC<
  MindMapProps
> = ({
  repository,
  activeNode,
  onNodeClick,
  onNodeMouseEnter,
  onNodeMouseLeave,
}) => {
  const children =
    repository.children || [];

  return (
    <div className="min-w-[1150px] p-10">
      <div className="relative mx-auto min-h-[850px] max-w-[1250px] overflow-hidden rounded-[40px] border border-cyan-500/10 bg-black/30">

        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(34,211,238,0.13),transparent_35%)]" />

        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0,transparent_48%,rgba(34,211,238,0.03)_49%,transparent_50%)]" />

        <div className="absolute left-1/2 top-1/2 z-20 -translate-x-1/2 -translate-y-1/2">
          <div className="rounded-[30px] border border-cyan-400/40 bg-slate-950 p-1 shadow-[0_0_100px_rgba(34,211,238,0.18)]">
            <MindMapNode
              node={repository}
              active={
                activeNode?.id ===
                repository.id
              }
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

            const radius =
              350 +
              (index % 3) * 45;

            const left =
              50 +
              (Math.cos(angle) *
                radius) /
                12;

            const top =
              50 +
              (Math.sin(angle) *
                radius) /
                8;

            return (
              <div
                key={node.id}
                className="absolute -translate-x-1/2 -translate-y-1/2"
                style={{
                  left: `${left}%`,
                  top: `${top}%`,
                }}
              >
                <div className="absolute left-1/2 top-1/2 -z-10 h-px w-[360px] origin-left bg-gradient-to-r from-cyan-400/30 to-transparent" />

                <div className="rounded-3xl border border-cyan-500/10 bg-slate-950/80 p-1 backdrop-blur-xl">
                  <MindMapNode
                    node={node}
                    compact
                    active={
                      activeNode?.id ===
                      node.id
                    }
                    onClick={() =>
                      onNodeClick(
                        node
                      )
                    }
                  />
                </div>
              </div>
            );
          }
        )}
      </div>
    </div>
  );
};