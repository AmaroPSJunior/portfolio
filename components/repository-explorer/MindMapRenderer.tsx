'use client';

import React from 'react';

import {
  MindMapProps,
  MindMapStyle,
} from './types';

import { RadialMindMap } from './mindmaps/RadialMindMap';
import { TreeMindMap } from './mindmaps/TreeMindMap';
import { ConstellationMindMap } from './mindmaps/ConstellationMindMap';
import { PipelineMindMap } from './mindmaps/PipelineMindMap';
import { NeuralMindMap } from './mindmaps/NeuralMindMap';
import { BubbleMindMap } from './mindmaps/BubbleMindMap';

interface MindMapRendererProps
  extends MindMapProps {
  style: MindMapStyle;
}

export const MindMapRenderer: React.FC<
  MindMapRendererProps
> = ({
  style,
  repository,
  activeNode,
  expandedNodes,
  onNodeClick,
  onNodeMouseEnter,
  onNodeMouseLeave,
}) => {
  const props: MindMapProps = {
    repository,
    activeNode,
    expandedNodes,
    onNodeClick,
    onNodeMouseEnter,
    onNodeMouseLeave,
  };

  switch (style) {
    case 'tree':
      return <TreeMindMap {...props} />;

    case 'constellation':
      return (
        <ConstellationMindMap
          {...props}
        />
      );

    case 'pipeline':
      return (
        <PipelineMindMap
          {...props}
        />
      );

    case 'neural':
      return <NeuralMindMap {...props} />;

    case 'radial':
    default:
      return <RadialMindMap {...props} />;

    case 'bubble':
      return (
        <BubbleMindMap
          repository={repository}
          activeNode={activeNode}
          onNodeClick={onNodeClick}
        />
      );
  }
};