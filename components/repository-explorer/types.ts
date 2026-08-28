import { ReactNode } from 'react';
import { RepositoryExplorerNode } from '@/types';

export type MindMapStyle =
  | 'bubble'
  | 'radial'
  | 'tree'
  | 'constellation'
  | 'pipeline'
  | 'neural';

export interface MindMapProps {
  repository: RepositoryExplorerNode;
  activeNode: RepositoryExplorerNode | null;
  expandedNodes: string[];
  onNodeClick: (
    node: RepositoryExplorerNode
  ) => void;
  onNodeMouseEnter?: (
    node: RepositoryExplorerNode
  ) => void;
  onNodeMouseLeave?: (
    node: RepositoryExplorerNode
  ) => void;
}

export interface MindMapStyleOption {
  id: MindMapStyle;
  name: string;
  description: string;
  icon: ReactNode;
}

export interface MindMapNavigationState {
  currentNode: RepositoryExplorerNode;
  history: RepositoryExplorerNode[];
}
