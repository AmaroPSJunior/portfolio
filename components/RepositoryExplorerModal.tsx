'use client';

import React, { useEffect, useMemo, useState } from 'react';
import {
  X,
  GitBranch,
  Github,
  Star,
  GitFork,
  CircleDot,
  Code2,
  FolderTree,
  Network,
  Clock3,
  Layers3,
  ChevronRight,
  ChevronDown,
  ExternalLink,
} from 'lucide-react';

import {
  RepositoryExplorerModalProps,
  RepositoryExplorerView,
  RepositoryExplorerNode,
  GithubRepoData,
} from '@/types';

const VIEW_OPTIONS: {
  id: RepositoryExplorerView;
  label: string;
  icon: React.ReactNode;
}[] = [
  { id: 'mindmap', label: 'Mapa Mental', icon: <Network /> },
  { id: 'radial', label: 'Radial', icon: <CircleDot /> },
  { id: 'tree', label: 'Árvore', icon: <FolderTree /> },
  { id: 'timeline', label: 'Timeline', icon: <Clock3 /> },
  { id: 'constellation', label: 'Constelação', icon: <Layers3 /> },
];

export const RepositoryExplorerModal: React.FC<
  RepositoryExplorerModalProps
> = ({ show, onClose, task }) => {
  const [view, setView] =
    useState<RepositoryExplorerView>('mindmap');

  const [repo, setRepo] = useState<GithubRepoData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const [activeNode, setActiveNode] =
    useState<RepositoryExplorerNode | null>(null);

  const [expandedNodes, setExpandedNodes] =
    useState<string[]>(['repository']);

  useEffect(() => {
    if (!show || !task) return;

    const repository =
      task.githubFullName ||
      task.githubName;

    if (!repository) return;

    const [owner, repoName] = repository.split('/');

    if (!owner || !repoName) return;

    setLoading(true);
    setError('');

    fetch(
      `/api/github?owner=${encodeURIComponent(
        owner
      )}&repo=${encodeURIComponent(repoName)}`
    )
      .then(async (response) => {
        if (!response.ok) {
          throw new Error('Não foi possível consultar o GitHub.');
        }

        return response.json();
      })
      .then((data) => {
        setRepo(data);
      })
      .catch((err) => {
        setError(
          err instanceof Error
            ? err.message
            : 'Erro ao consultar o repositório.'
        );
      })
      .finally(() => {
        setLoading(false);
      });
  }, [show, task]);

  useEffect(() => {
    if (!show) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [show, onClose]);

  const nodes = useMemo<RepositoryExplorerNode[]>(() => {
    if (!repo) return [];

    return [
      {
        id: 'repository',
        title: repo.full_name,
        type: 'repository',
        icon: '📦',
        description:
          repo.description || 'Repositório sem descrição.',
        children: [
          {
            id: 'architecture',
            title: 'Arquitetura',
            type: 'architecture',
            icon: '🏗️',
            children: [
              {
                id: 'language',
                title: 'Linguagem principal',
                type: 'language',
                value: repo.language || 'Não identificada',
                icon: '💻',
              },
              {
                id: 'branch',
                title: 'Branch principal',
                type: 'branch',
                value: repo.default_branch || 'main',
                icon: '🌿',
              },
            ],
          },
          {
            id: 'activity',
            title: 'Atividade',
            type: 'activity',
            icon: '⚡',
            children: [
              {
                id: 'stars',
                title: 'Stars',
                type: 'stars',
                value: repo.stargazers_count || 0,
                icon: '⭐',
              },
              {
                id: 'forks',
                title: 'Forks',
                type: 'forks',
                value: repo.forks_count || 0,
                icon: '🍴',
              },
              {
                id: 'issues',
                title: 'Issues',
                type: 'issues',
                value: repo.open_issues_count || 0,
                icon: '🐛',
              },
            ],
          },
          {
            id: 'dates',
            title: 'Ciclo de vida',
            type: 'dates',
            icon: '📅',
            children: [
              {
                id: 'created',
                title: 'Criado em',
                type: 'created',
                value: repo.created_at || '-',
                icon: '🚀',
              },
              {
                id: 'updated',
                title: 'Atualizado em',
                type: 'updated',
                value: repo.updated_at || '-',
                icon: '🔄',
              },
              {
                id: 'pushed',
                title: 'Último push',
                type: 'pushed',
                value: repo.pushed_at || '-',
                icon: '📤',
              },
            ],
          },
        ],
      },
    ];
  }, [repo]);

  const toggleNode = (node: RepositoryExplorerNode) => {
    setActiveNode(node);

    if (!node.children?.length) return;

    setExpandedNodes((current) =>
      current.includes(node.id)
        ? current.filter((id) => id !== node.id)
        : [...current, node.id]
    );
  };

  if (!show || !task) return null;

  return (
    <div
      className="fixed inset-0 z-[95] flex items-center justify-center bg-black/70 backdrop-blur-md"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) {
          onClose();
        }
      }}
    >
      <div
        className="relative flex h-[90vh] w-[90vw] max-h-[90vh] max-w-[90vw] min-h-0 min-w-0 flex-col overflow-hidden rounded-3xl border border-cyan-500/20 bg-slate-950 shadow-2xl shadow-cyan-950/40"
        role="dialog"
        aria-modal="true"
        aria-label={`Explorador do repositório ${task.title}`}
      >
        {/* HEADER */}
        <header className="flex items-center justify-between gap-4 border-b border-slate-800 bg-slate-900/90 px-5 py-4">
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <Github className="h-5 w-5 text-cyan-400" />
              <h2 className="truncate text-sm font-bold text-white">
                {task.title}
              </h2>
            </div>

            <p className="mt-1 truncate text-[10px] font-mono text-slate-500">
              {task.githubFullName || task.githubName}
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="rounded-xl p-2 text-slate-400 hover:bg-slate-800 hover:text-white"
            aria-label="Fechar explorador"
          >
            <X className="h-5 w-5" />
          </button>
        </header>

        {/* CONTROLES */}
        <div className="flex gap-1 overflow-x-auto border-b border-slate-800 bg-slate-950 px-4 py-2">
          {VIEW_OPTIONS.map((option) => (
            <button
              key={option.id}
              type="button"
              onClick={() => setView(option.id)}
              className={`flex shrink-0 items-center gap-1.5 rounded-lg px-3 py-2 text-[10px] font-semibold transition-all ${
                view === option.id
                  ? 'bg-cyan-500/15 text-cyan-300 border border-cyan-500/30'
                  : 'text-slate-500 hover:bg-slate-900 hover:text-slate-200 border border-transparent'
              }`}
            >
              {React.cloneElement(
                option.icon as React.ReactElement<{ className?: string }>,
                { className: 'h-3.5 w-3.5' }
              )}
              {option.label}
            </button>
          ))}
        </div>

        {/* ÁREA VISUAL */}
        <div className="relative min-h-0 flex-1 overflow-auto bg-[radial-gradient(circle_at_center,rgba(8,145,178,0.08),transparent_55%)] p-6">
          {loading && (
            <div className="flex h-full items-center justify-center">
              <div className="text-center">
                <div className="mx-auto mb-3 h-8 w-8 animate-spin rounded-full border-2 border-slate-700 border-t-cyan-400" />
                <p className="text-xs text-slate-400">
                  Explorando repositório...
                </p>
              </div>
            </div>
          )}

          {error && !loading && (
            <div className="flex h-full items-center justify-center">
              <div className="rounded-xl border border-red-500/20 bg-red-950/20 p-5 text-center">
                <p className="text-sm font-semibold text-red-300">
                  {error}
                </p>
              </div>
            </div>
          )}

          {!loading && !error && repo && (
            <RepositoryVisualization
              view={view}
              nodes={nodes}
              expandedNodes={expandedNodes}
              activeNode={activeNode}
              onNodeClick={toggleNode}
            />
          )}
        </div>

        {/* DETALHE DO NÓ */}
        {activeNode && (
          <div className="absolute bottom-4 left-4 right-4 rounded-2xl border border-cyan-500/20 bg-slate-900/95 p-4 shadow-xl backdrop-blur-xl">
            <div className="flex items-start gap-3">
              <span className="text-xl">
                {activeNode.icon || '◉'}
              </span>

              <div className="min-w-0">
                <h3 className="text-xs font-bold text-cyan-300">
                  {activeNode.title}
                </h3>

                {activeNode.description && (
                  <p className="mt-1 text-[10px] leading-relaxed text-slate-400">
                    {activeNode.description}
                  </p>
                )}

                {activeNode.value !== undefined && (
                  <p className="mt-1 break-all font-mono text-[10px] text-white">
                    {activeNode.value}
                  </p>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

interface RepositoryVisualizationProps {
  view: RepositoryExplorerView;
  nodes: RepositoryExplorerNode[];
  expandedNodes: string[];
  activeNode: RepositoryExplorerNode | null;
  onNodeClick: (node: RepositoryExplorerNode) => void;
}

interface RepositoryViewProps {
  nodes: RepositoryExplorerNode[];
  expandedNodes?: string[];
  activeNode?: RepositoryExplorerNode | null;
  onNodeClick: (node: RepositoryExplorerNode) => void;
}

const RepositoryVisualization: React.FC<
  RepositoryVisualizationProps
> = ({
  view,
  nodes,
  expandedNodes,
  activeNode,
  onNodeClick,
}) => {
  if (view === 'tree') {
    return (
      <TreeView
        nodes={nodes}
        expandedNodes={expandedNodes}
        onNodeClick={onNodeClick}
      />
    );
  }

  if (view === 'radial') {
    return (
      <RadialView
        nodes={nodes}
        onNodeClick={onNodeClick}
      />
    );
  }

  if (view === 'timeline') {
    return (
      <TimelineView
        nodes={nodes}
        onNodeClick={onNodeClick}
      />
    );
  }

  if (view === 'constellation') {
    return (
      <ConstellationView
        nodes={nodes}
        onNodeClick={onNodeClick}
      />
    );
  }

  return (
    <MindMapView
      nodes={nodes}
      expandedNodes={expandedNodes}
      activeNode={activeNode}
      onNodeClick={onNodeClick}
    />
  );
};

const MindMapView: React.FC<RepositoryViewProps> = ({
  nodes,
  expandedNodes = [],
  activeNode,
  onNodeClick,
}) => {
  const repository = nodes[0];

  if (!repository) return null;

  const children = repository.children || [];

  return (
    <div className="flex min-h-full items-center justify-center py-10">
      <div className="flex w-full max-w-5xl flex-col items-center">

        {/* NÓ CENTRAL */}
        <button
          type="button"
          onClick={() => onNodeClick(repository)}
          className={`
            group relative z-10 w-[240px] rounded-2xl border p-5
            transition-all duration-300
            ${
              activeNode?.id === repository.id
                ? 'border-cyan-400 bg-cyan-500/15 shadow-xl shadow-cyan-500/20'
                : 'border-cyan-500/30 bg-slate-900 hover:border-cyan-400/60 hover:bg-slate-900/90'
            }
          `}
        >
          <div className="text-3xl">
            {repository.icon}
          </div>

          <div className="mt-2 truncate text-sm font-bold text-white">
            {repository.title}
          </div>

          <div className="mt-1 text-[10px] uppercase tracking-wider text-cyan-400">
            Repositório
          </div>

          {repository.description && (
            <p className="mt-2 line-clamp-2 text-[10px] leading-relaxed text-slate-400">
              {repository.description}
            </p>
          )}
        </button>

        {/* CONEXÃO CENTRAL */}
        {children.length > 0 && (
          <div className="h-12 w-px bg-gradient-to-b from-cyan-400/60 to-cyan-500/10" />
        )}

        {/* RAMIFICAÇÕES */}
        <div className="flex w-full flex-wrap justify-center gap-5">
          {children.map((node) => {
            const expanded = expandedNodes.includes(node.id);

            return (
              <div
                key={node.id}
                className="flex min-w-[170px] flex-col items-center"
              >
                <button
                  type="button"
                  onClick={() => onNodeClick(node)}
                  className={`
                    w-[180px] rounded-xl border p-4
                    transition-all duration-300
                    ${
                      activeNode?.id === node.id
                        ? 'border-cyan-400 bg-cyan-500/15 shadow-lg shadow-cyan-500/10'
                        : 'border-slate-700 bg-slate-900/90 hover:border-cyan-500/50 hover:bg-slate-900'
                    }
                  `}
                >
                  <div className="text-2xl">
                    {node.icon}
                  </div>

                  <div className="mt-2 text-xs font-semibold text-slate-200">
                    {node.title}
                  </div>

                  {node.children?.length ? (
                    <div className="mt-2 flex items-center justify-center gap-1 text-[9px] text-slate-500">
                      {expanded ? (
                        <>
                          <ChevronDown className="h-3 w-3 text-cyan-400" />
                          Recolher
                        </>
                      ) : (
                        <>
                          <ChevronRight className="h-3 w-3" />
                          Explorar
                        </>
                      )}
                    </div>
                  ) : null}
                </button>

                {/* SUBNÓS */}
                {expanded && node.children && (
                  <div className="mt-3 flex w-full flex-col gap-2">
                    {node.children.map((child) => (
                      <button
                        key={child.id}
                        type="button"
                        onClick={() => onNodeClick(child)}
                        className={`
                          flex items-center gap-3 rounded-lg border p-3
                          text-left transition-all
                          ${
                            activeNode?.id === child.id
                              ? 'border-cyan-400/60 bg-cyan-500/10'
                              : 'border-slate-800 bg-slate-950/80 hover:border-cyan-500/30'
                          }
                        `}
                      >
                        <span className="text-base">
                          {child.icon}
                        </span>

                        <div className="min-w-0 flex-1">
                          <div className="text-[10px] font-semibold text-slate-300">
                            {child.title}
                          </div>

                          {child.value !== undefined && (
                            <div className="mt-1 truncate font-mono text-[9px] text-cyan-400">
                              {String(child.value)}
                            </div>
                          )}
                        </div>

                        {child.children?.length ? (
                          <ChevronRight className="h-3 w-3 text-slate-600" />
                        ) : null}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

const TreeView: React.FC<RepositoryViewProps> = ({
  nodes,
  expandedNodes = [],
  onNodeClick,
}) => {
  const renderNode = (
    node: RepositoryExplorerNode,
    level = 0
  ): React.ReactNode => {
    const expanded = expandedNodes.includes(node.id);
    const hasChildren = Boolean(node.children?.length);

    return (
      <div key={node.id}>
        <button
          type="button"
          onClick={() => onNodeClick(node)}
          className="group flex w-full items-center gap-2 rounded-lg px-3 py-2.5 text-left transition hover:bg-slate-900"
          style={{
            paddingLeft: `${level * 24 + 12}px`,
          }}
        >
          {hasChildren ? (
            expanded ? (
              <ChevronDown className="h-3.5 w-3.5 shrink-0 text-cyan-400" />
            ) : (
              <ChevronRight className="h-3.5 w-3.5 shrink-0 text-slate-500" />
            )
          ) : (
            <span className="w-3.5 shrink-0" />
          )}

          <span className="text-base">
            {node.icon}
          </span>

          <span className="text-xs font-medium text-slate-300 group-hover:text-white">
            {node.title}
          </span>

          {node.value !== undefined && (
            <span className="ml-auto max-w-[180px] truncate font-mono text-[9px] text-cyan-400">
              {String(node.value)}
            </span>
          )}
        </button>

        {expanded &&
          node.children?.map((child) =>
            renderNode(child, level + 1)
          )}
      </div>
    );
  };

  return (
    <div className="mx-auto max-w-3xl rounded-2xl border border-slate-800 bg-slate-950/70 p-4">
      <div className="mb-4 flex items-center gap-2 border-b border-slate-800 pb-3">
        <FolderTree className="h-4 w-4 text-cyan-400" />

        <span className="text-xs font-bold text-slate-200">
          Estrutura do repositório
        </span>
      </div>

      {nodes.map((node) => renderNode(node))}
    </div>
  );
};

const RadialView: React.FC<RepositoryViewProps> = ({
  nodes,
  onNodeClick,
}) => {
  const repository = nodes[0];

  if (!repository) return null;

  const children = repository.children || [];

  return (
    <div className="flex min-h-[500px] items-center justify-center">
      <div className="relative h-[440px] w-[440px]">

        {/* NÓ CENTRAL */}
        <button
          type="button"
          onClick={() => onNodeClick(repository)}
          className="absolute left-1/2 top-1/2 z-20 flex h-32 w-32 -translate-x-1/2 -translate-y-1/2 flex-col items-center justify-center rounded-full border border-cyan-400/40 bg-slate-900 shadow-xl shadow-cyan-500/10 transition hover:border-cyan-300"
        >
          <span className="text-3xl">
            {repository.icon}
          </span>

          <span className="mt-2 max-w-[90px] truncate text-[10px] font-bold text-white">
            {repository.title}
          </span>

          <span className="mt-1 text-[8px] uppercase tracking-widest text-cyan-400">
            Repository
          </span>
        </button>

        {/* NÓS EXTERNOS */}
        {children.map((node, index) => {
          const angle =
            (index / Math.max(children.length, 1)) *
              Math.PI *
              2 -
            Math.PI / 2;

          const radius = 165;

          const x = Math.cos(angle) * radius;
          const y = Math.sin(angle) * radius;

          return (
            <button
              key={node.id}
              type="button"
              onClick={() => onNodeClick(node)}
              className="absolute left-1/2 top-1/2 flex w-32 -translate-x-1/2 -translate-y-1/2 flex-col items-center rounded-xl border border-slate-700 bg-slate-900/95 p-4 shadow-lg transition hover:border-cyan-400/50"
              style={{
                transform: `translate(
                  calc(-50% + ${x}px),
                  calc(-50% + ${y}px)
                )`,
              }}
            >
              <span className="text-2xl">
                {node.icon}
              </span>

              <span className="mt-2 text-[10px] font-semibold text-slate-300">
                {node.title}
              </span>

              {node.children?.length ? (
                <span className="mt-1 text-[8px] text-slate-600">
                  {node.children.length} informações
                </span>
              ) : null}
            </button>
          );
        })}
      </div>
    </div>
  );
};

const TimelineView: React.FC<RepositoryViewProps> = ({
  nodes,
  onNodeClick,
}) => {
  const repository = nodes[0];

  if (!repository) return null;

  const datesNode = repository.children?.find(
    (node) => node.id === 'dates'
  );

  const dates = datesNode?.children || [];

  return (
    <div className="mx-auto max-w-2xl py-8">

      {/* REPOSITÓRIO */}
      <button
        type="button"
        onClick={() => onNodeClick(repository)}
        className="mb-8 rounded-xl border border-cyan-500/30 bg-cyan-500/10 px-5 py-4 text-left"
      >
        <div className="flex items-center gap-3">
          <span className="text-2xl">
            {repository.icon}
          </span>

          <div>
            <div className="text-sm font-bold text-white">
              {repository.title}
            </div>

            <div className="text-[9px] uppercase tracking-widest text-cyan-400">
              Ciclo de vida
            </div>
          </div>
        </div>
      </button>

      {/* TIMELINE */}
      <div className="relative ml-5 border-l border-cyan-500/20 pl-8">
        {dates.map((node, index) => (
          <button
            key={node.id}
            type="button"
            onClick={() => onNodeClick(node)}
            className="relative mb-6 block w-full rounded-xl border border-slate-800 bg-slate-900/70 p-4 text-left transition hover:border-cyan-500/40"
          >
            <span className="absolute -left-[43px] top-5 flex h-5 w-5 items-center justify-center rounded-full border border-cyan-500/30 bg-slate-950">
              <span
                className={`h-2 w-2 rounded-full ${
                  index === dates.length - 1
                    ? 'bg-cyan-300'
                    : 'bg-cyan-500'
                }`}
              />
            </span>

            <div className="flex items-center gap-2">
              <span>{node.icon}</span>

              <span className="text-xs font-semibold text-slate-200">
                {node.title}
              </span>
            </div>

            <div className="mt-2 font-mono text-[10px] text-cyan-400">
              {String(node.value)}
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};

const ConstellationView: React.FC<RepositoryViewProps> = ({
  nodes,
  onNodeClick,
}) => {
  const repository = nodes[0];

  if (!repository) return null;

  const allNodes: RepositoryExplorerNode[] = [];

  const collectNodes = (
    node: RepositoryExplorerNode
  ) => {
    allNodes.push(node);

    node.children?.forEach(collectNodes);
  };

  collectNodes(repository);

  return (
    <div className="mx-auto grid min-h-full max-w-4xl grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {allNodes.map((node, index) => (
        <button
          key={node.id}
          type="button"
          onClick={() => onNodeClick(node)}
          className={`
            group relative min-h-[120px] overflow-hidden rounded-2xl
            border p-4 text-left transition-all duration-300
            ${
              index === 0
                ? 'border-cyan-500/40 bg-cyan-500/10'
                : 'border-slate-800 bg-slate-900/70 hover:border-cyan-500/40 hover:bg-slate-900'
            }
          `}
        >
          {/* BRILHO */}
          <div className="pointer-events-none absolute -right-10 -top-10 h-24 w-24 rounded-full bg-cyan-500/10 blur-2xl transition group-hover:bg-cyan-400/20" />

          <div className="relative flex items-center gap-3">
            <span className="text-2xl">
              {node.icon}
            </span>

            <span className="text-xs font-bold text-slate-200 group-hover:text-white">
              {node.title}
            </span>
          </div>

          {node.description && (
            <p className="relative mt-3 line-clamp-3 text-[10px] leading-relaxed text-slate-500">
              {node.description}
            </p>
          )}

          {node.value !== undefined && (
            <p className="relative mt-3 truncate font-mono text-[10px] text-cyan-400">
              {String(node.value)}
            </p>
          )}

          {node.children?.length ? (
            <div className="absolute bottom-3 right-3 text-[9px] text-slate-600">
              {node.children.length} nós
            </div>
          ) : null}
        </button>
      ))}
    </div>
  );
};
