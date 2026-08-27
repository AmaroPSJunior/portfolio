'use client';

import React from 'react';
import { MindMapProps } from '../types';
import { MindMapNode } from '../MindMapNode';

export const ConstellationMindMap: React.FC<
  MindMapProps
> = ({
  repository,
  activeNode,
  onNodeClick,
}) => {
  const children =
    repository.children || [];

  return (
    <div className="min-w-[1150px] p-10">
      <div className="relative mx-auto min-h-[850px] max-w-[1250px]">

        <div className="absolute left-1/2 top-1/2 z-20 -translate-x-1/2 -translate-y-1/2">
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

        {children.map(
          (node, index) => {
            const angle =
              (index /
                Math.max(
                  children.length,
                  1
                )) *
              Math.PI *
              2;

            const radius =
              300 +
              (index % 3) * 100;

            const left =
              50 +
              (Math.cos(angle) *
                radius) /
                11;

            const top =
              50 +
              (Math.sin(angle) *
                radius) /
                7;

            return (
              <div
                key={node.id}
                className="absolute -translate-x-1/2 -translate-y-1/2"
                style={{
                  left: `${left}%`,
                  top: `${top}%`,
                }}
              >
                <div className="mb-2 flex justify-center">
                  <span className="h-2 w-2 rounded-full bg-cyan-400 shadow-[0_0_15px_rgba(34,211,238,0.8)]" />
                </div>

                <MindMapNode
                  node={node}
                  compact
                  active={
                    activeNode?.id ===
                    node.id
                  }
                  onClick={() =>
                    onNodeClick(node)
                  }
                />
              </div>
            );
          }
        )}
      </div>
    </div>
  );
};