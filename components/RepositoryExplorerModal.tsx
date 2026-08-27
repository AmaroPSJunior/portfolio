'use client';

import React, { useEffect, useMemo, useState } from 'react';
import { MindMapRenderer } from './repository-explorer/MindMapRenderer';
import { MindMapStyle, MindMapStyleOption } from './repository-explorer/types';
import { RepositoryExplorerModalProps, RepositoryExplorerNode } from '@/types';

import {
  X,
  Github,
  Network,
  ChevronRight,
  ChevronDown,
  FolderTree,
  Code2,
  TestTube2,
  Database,
  Server,
  ShieldCheck,
  Workflow,
  Layers3,
  Settings2,
  GitBranch,
  Puzzle,
  FileCode2,
  BookOpen,
  AlertTriangle,
  Orbit,
  BrainCircuit,
} from 'lucide-react';

interface TechnicalAnalysis {
  repository?: {
    owner?: string;
    name?: string;
    fullName?: string;
    branch?: string;
    url?: string;
    description?: string;
    language?: string;
  };

  architecture?: {
    style?: string;
    layers?: string[];
    modules?: string[];
    entryPoints?: string[];
  };

  files?: Array<{
    path: string;
    name: string;
    language?: string;
    category?: string;
    lines?: number;
  }>;

  dependencies?: Array<{
    name: string;
    version?: string;
    type?: string;
    ecosystem?: string;
  }>;

  frameworks?: Array<{
    name: string;
    version?: string;
    category?: string;
  }>;

  tests?: {
    framework?: string;
    totalFiles?: number;
    unitTests?: number;
    integrationTests?: number;
    e2eTests?: number;
    directories?: string[];
  };

  cicd?: {
    provider?: string;
    workflows?: string[];
    stages?: string[];
    commands?: string[];
    deploymentTargets?: string[];
  };

  database?: {
    technologies?: string[];
    migrations?: string[];
    schemas?: string[];
    tables?: string[];
  };

  apis?: Array<{
    type?: string;
    path: string;
    methods?: string[];
    description?: string;
  }>;

  integrations?: Array<{
    name: string;
    type?: string;
    description?: string;
  }>;

  security?: Array<{
    title: string;
    severity?: string;
    description?: string;
  }>;

  patterns?: Array<{
    name: string;
    description?: string;
  }>;

  decisions?: Array<{
    title: string;
    description?: string;
  }>;

  evidence?: Array<{
    id: string;
    type: string;
    title: string;
    description?: string;
    path: string;
    lineStart?: number;
    lineEnd?: number;
    fileUrl?: string;
  }>;
}

interface TechnicalResponse {
  repository?: {
    owner?: string;
    repo?: string;
  };

  snapshot?: {
    branch?: string;
    repositoryUrl?: string;
    fileCount?: number;
    truncated?: boolean;
  };

  analysis?: TechnicalAnalysis;

  architecture?: unknown;
}

function count<T>(value?: T[]): number {
  return Array.isArray(value) ? value.length : 0;
}

const MAP_STYLES: MindMapStyleOption[] = [
   {
    id: 'bubble',
    name: 'Bubble Explorer',
    description: 'Explore o projeto entrando em cada camada',
    icon: '◉',
  },
  {
    id: 'radial',
    name: 'Radial',
    description: 'Categorias irradiando do projeto',
    icon: <Orbit className="h-4 w-4" />,
  },
  {
    id: 'tree',
    name: 'Árvore',
    description: 'Hierarquia técnica tradicional',
    icon: <GitBranch className="h-4 w-4" />,
  },
  {
    id: 'constellation',
    name: 'Constelação',
    description: 'Nós distribuídos como um grafo',
    icon: <Network className="h-4 w-4" />,
  },
  {
    id: 'pipeline',
    name: 'Pipeline',
    description: 'Fluxo técnico por camadas',
    icon: <Workflow className="h-4 w-4" />,
  },
  {
    id: 'neural',
    name: 'Neural',
    description: 'Visual futurista conectado',
    icon: <BrainCircuit className="h-4 w-4" />,
  },
];

function createValueNode(
  id: string,
  title: string,
  value: string | number,
  icon = '•'
): RepositoryExplorerNode {
  return {
    id,
    title,
    type: 'value',
    value,
    icon,
  };
}

function createCategoryNode(
  id: string,
  title: string,
  icon: string,
  description: string,
  children: RepositoryExplorerNode[]
): RepositoryExplorerNode {
  return {
    id,
    title,
    type: 'category',
    icon,
    description,
    children,
  };
}

function buildTechnicalNodes(
  analysis: TechnicalAnalysis,
  snapshot?: TechnicalResponse['snapshot']
): RepositoryExplorerNode[] {
  const architecture = analysis.architecture;

  const architectureChildren: RepositoryExplorerNode[] = [
    architecture?.style
      ? createValueNode(
          'architecture-style',
          'Estilo arquitetural',
          architecture.style,
          '🏗️'
        )
      : null,

    createValueNode(
      'architecture-layers',
      'Camadas',
      count(architecture?.layers),
      '🧱'
    ),

    createValueNode(
      'architecture-modules',
      'Módulos',
      count(architecture?.modules),
      '📦'
    ),

    createValueNode(
      'architecture-entry-points',
      'Entry points',
      count(architecture?.entryPoints),
      '🚪'
    ),
  ].filter(Boolean) as RepositoryExplorerNode[];

  const technologyChildren = [
    ...((analysis.frameworks ?? []).slice(0, 12).map((framework) => ({
      id: `framework-${framework.name}`,
      title: framework.name,
      type: 'technology',
      icon: '⚛️',
      value: framework.version || 'detectado',
    }))),

    createValueNode(
      'dependencies-count',
      'Dependências',
      count(analysis.dependencies),
      '📚'
    ),
  ];

  const codeChildren = [
    createValueNode(
      'files-count',
      'Arquivos analisados',
      count(analysis.files),
      '📁'
    ),

    createValueNode(
      'content-files',
      'Arquivos com conteúdo',
      (analysis.files ?? []).filter((file) => file.lines !== undefined).length,
      '📄'
    ),

    createValueNode(
      'code-lines',
      'Linhas detectadas',
      (analysis.files ?? []).reduce(
        (total, file) => total + (file.lines ?? 0),
        0
      ),
      '📝'
    ),
  ];

  const testingChildren: RepositoryExplorerNode[] = [
    createValueNode(
      'test-framework',
      'Framework',
      analysis.tests?.framework || 'Não identificado',
      '🧪'
    ),

    createValueNode(
      'test-files',
      'Arquivos de teste',
      analysis.tests?.totalFiles ?? 0,
      '📄'
    ),

    createValueNode(
      'unit-tests',
      'Testes unitários',
      analysis.tests?.unitTests ?? 0,
      '🔬'
    ),

    createValueNode(
      'integration-tests',
      'Testes de integração',
      analysis.tests?.integrationTests ?? 0,
      '🔗'
    ),

    createValueNode(
      'e2e-tests',
      'Testes E2E',
      analysis.tests?.e2eTests ?? 0,
      '🌐'
    ),
  ];

  const apiChildren: RepositoryExplorerNode[] = [
    createValueNode(
      'api-count',
      'Rotas detectadas',
      count(analysis.apis),
      '🔌'
    ),

    ...((analysis.apis ?? []).slice(0, 15).map((api, index) => ({
      id: `api-${index}-${api.path}`,
      title: api.path,
      type: 'api',
      icon: '↔️',
      value: api.methods?.join(', ') || 'GET',
      description: api.description,
    }))),
  ];

  const databaseChildren: RepositoryExplorerNode[] = [
    ...((analysis.database?.technologies ?? []).map((technology) => ({
      id: `database-${technology}`,
      title: technology,
      type: 'database',
      icon: '🗄️',
    }))),

    createValueNode(
      'migration-count',
      'Migrations',
      count(analysis.database?.migrations),
      '🔄'
    ),

    createValueNode(
      'schema-count',
      'Schemas',
      count(analysis.database?.schemas),
      '📐'
    ),
  ];

  const cicdChildren: RepositoryExplorerNode[] = [
    createValueNode(
      'cicd-provider',
      'Provider',
      analysis.cicd?.provider || 'Não identificado',
      '🚀'
    ),

    createValueNode(
      'workflow-count',
      'Workflows',
      count(analysis.cicd?.workflows),
      '⚙️'
    ),

    createValueNode(
      'pipeline-stages',
      'Estágios detectados',
      count(analysis.cicd?.stages),
      '🔁'
    ),

    createValueNode(
      'pipeline-commands',
      'Comandos',
      count(analysis.cicd?.commands),
      '💻'
    ),
  ];

  const fileCategories = new Map<string, number>();

  for (const file of analysis.files ?? []) {
    const category = file.category || 'code';
    fileCategories.set(
      category,
      (fileCategories.get(category) || 0) + 1
    );
  }

  const filesChildren = Array.from(fileCategories.entries())
    .sort((a, b) => b[1] - a[1])
    .slice(0, 15)
    .map(([category, total]) => ({
      id: `file-category-${category}`,
      title: category,
      type: 'file-category',
      icon: '📁',
      value: total,
    }));

  return [
    {
      id: 'repository',
      title:
        analysis.repository?.fullName ||
        `${analysis.repository?.owner || 'GitHub'}/${analysis.repository?.name || 'repository'}`,
      type: 'repository',
      icon: '📦',
      description:
        analysis.repository?.description ||
        'Análise técnica dinâmica extraída do repositório GitHub.',
      children: [
        createCategoryNode(
          'architecture',
          'Arquitetura',
          '🏗️',
          'Estrutura e organização identificadas automaticamente.',
          architectureChildren
        ),

        createCategoryNode(
          'technologies',
          'Tecnologias',
          '⚛️',
          'Frameworks e dependências detectados no projeto.',
          technologyChildren
        ),

        createCategoryNode(
          'code',
          'Código',
          '💻',
          'Informações extraídas dos arquivos analisados.',
          codeChildren
        ),

        createCategoryNode(
          'files',
          'Arquivos',
          '📁',
          'Distribuição dos arquivos por categoria técnica.',
          filesChildren
        ),

        createCategoryNode(
          'testing',
          'Testes',
          '🧪',
          'Estrutura de testes identificada no repositório.',
          testingChildren
        ),

        createCategoryNode(
          'apis',
          'APIs',
          '🔌',
          'Rotas e endpoints encontrados no código.',
          apiChildren
        ),

        createCategoryNode(
          'database',
          'Banco de dados',
          '🗄️',
          'Tecnologias, migrations e schemas identificados.',
          databaseChildren
        ),

        createCategoryNode(
          'cicd',
          'CI/CD',
          '🚀',
          'Pipelines e automações encontradas no GitHub.',
          cicdChildren
        ),
        createCategoryNode(
          'evidence',
          'Evidências',
          '🔎',
          'Arquivos usados como evidência das descobertas.',
          (analysis.evidence ?? []).slice(0, 20).map((evidence, index) => ({
            id: `evidence-${index}`,
            title: evidence.title,
            type: 'evidence',
            icon: '📄',
            value: evidence.path,
            description: evidence.description,
          }))
        ),

        createCategoryNode(
          'repository-info',
          'Repositório',
          '🐙',
          'Metadados básicos obtidos diretamente do GitHub.',
          [
            createValueNode(
              'branch',
              'Branch',
              analysis.repository?.branch ||
                snapshot?.branch ||
                'main',
              '🌿'
            ),

            createValueNode(
              'file-count',
              'Arquivos',
              snapshot?.fileCount ?? count(analysis.files),
              '📁'
            ),

            createValueNode(
              'truncated',
              'Análise limitada',
              snapshot?.truncated ? 'Sim' : 'Não',
              snapshot?.truncated ? '⚠️' : '✅'
            ),
          ]
        ),
      ],
    },
  ];
}

export const RepositoryExplorerModal: React.FC<
  RepositoryExplorerModalProps
> = ({ show, onClose, task }) => {
  const [nodes, setNodes] = useState<RepositoryExplorerNode[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [activeNode, setActiveNode] = useState<RepositoryExplorerNode | null>(null);
  const [expandedNodes, setExpandedNodes] = useState<string[]>(['repository']);
  const [mapStyle, setMapStyle] = useState<MindMapStyle>('radial');


  useEffect(() => {
    if (!show || !task) return;

    const repository =
      task.githubFullName ||
      task.githubName;

    if (!repository) {
      setError('Este projeto não possui um repositório GitHub associado.');
      return;
    }

    const [owner, repo] = repository.split('/');

    if (!owner || !repo) {
      setError('Repositório GitHub inválido.');
      return;
    }

    setLoading(true);
    setError('');
    setNodes([]);
    setActiveNode(null);
    setExpandedNodes(['repository']);

    fetch(
      `/api/github?owner=${encodeURIComponent(
        owner
      )}&repo=${encodeURIComponent(repo)}&technical=true`
    )
      .then(async (response) => {
        const data = await response.json();

        if (!response.ok) {
          throw new Error(
            data?.error ||
              'Não foi possível analisar tecnicamente o repositório.'
          );
        }

        return data as TechnicalResponse;
      })
      .then((data) => {
        if (!data.analysis) {
          throw new Error(
            'A API não retornou uma análise técnica válida.'
          );
        }

        setNodes(
          buildTechnicalNodes(
            data.analysis,
            data.snapshot
          )
        );
      })
      .catch((err) => {
        setError(
          err instanceof Error
            ? err.message
            : 'Erro ao analisar o repositório.'
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

    document.addEventListener(
      'keydown',
      handleKeyDown
    );

    return () => {
      document.removeEventListener(
        'keydown',
        handleKeyDown
      );
    };
  }, [show, onClose]);

  const repository = useMemo(
    () => nodes[0],
    [nodes]
  );

  const toggleNode = (
    node: RepositoryExplorerNode
  ) => {
    setActiveNode(node);

    if (!node.children?.length) {
      return;
    }

    setExpandedNodes((current) =>
      current.includes(node.id)
        ? current.filter(
            (id) => id !== node.id
          )
        : [...current, node.id]
    );
  };

  if (!show || !task) {
    return null;
  }

  return (
    <div
      className="fixed inset-0 z-[95] flex items-center justify-center bg-black/75 p-2 backdrop-blur-md sm:p-4"
      onMouseDown={(event) => {
        if (
          event.target ===
          event.currentTarget
        ) {
          onClose();
        }
      }}
    >
      <div
        className="relative flex h-[94vh] w-full max-w-[1500px] flex-col overflow-hidden rounded-3xl border border-cyan-500/20 bg-slate-950 shadow-2xl shadow-cyan-950/40"
        role="dialog"
        aria-modal="true"
        aria-label={`Explorador técnico ${task.title}`}
      >
        <header className="shrink-0 border-b border-slate-800 bg-slate-900/95 px-4 py-4 sm:px-6">
          <div className="flex items-start justify-between gap-4">
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-cyan-500/30 bg-cyan-500/10">
                  <Network className="h-5 w-5 text-cyan-400" />
                </div>

                <div className="min-w-0">
                  <span className="text-[9px] font-bold uppercase tracking-[0.2em] text-cyan-400">
                    Technical Repository Explorer
                  </span>

                  <h2 className="truncate text-sm font-black text-white sm:text-base">
                    {task.title}
                  </h2>

                  <p className="truncate font-mono text-[9px] text-slate-500">
                    {task.githubFullName ||
                      task.githubName ||
                      'GitHub'}
                  </p>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-1 overflow-x-auto">
              {MAP_STYLES.map((style) => (
                <button
                  key={style.id}
                  type="button"
                  onClick={() =>
                    setMapStyle(style.id)
                  }
                  title={style.description}
                  className={`
                    flex shrink-0 items-center gap-2
                    rounded-xl border px-3 py-2
                    text-[9px] font-bold
                    transition-all
                    ${
                      mapStyle === style.id
                        ? 'border-cyan-400/50 bg-cyan-500/15 text-cyan-300'
                        : 'border-slate-800 bg-slate-950 text-slate-500 hover:border-slate-700 hover:text-slate-300'
                    }
                  `}
                >
                  {style.icon}
                  <span>{style.name}</span>
                </button>
              ))}
            </div>

            <button
              type="button"
              onClick={onClose}
              className="rounded-xl p-2 text-slate-400 transition hover:bg-slate-800 hover:text-white"
              aria-label="Fechar explorador"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </header>

        <main className="min-h-0 flex-1 overflow-auto bg-[radial-gradient(circle_at_center,rgba(8,145,178,0.08),transparent_55%)]">
          {loading && (
            <div className="flex h-full min-h-[500px] items-center justify-center">
              <div className="text-center">
                <div className="mx-auto mb-4 h-10 w-10 animate-spin rounded-full border-2 border-slate-700 border-t-cyan-400" />

                <p className="text-sm font-semibold text-slate-300">
                  Analisando repositório...
                </p>

                <p className="mt-1 text-[10px] text-slate-600">
                  Extraindo arquivos, tecnologias,
                  testes, APIs, banco e CI/CD.
                </p>
              </div>
            </div>
          )}

          {error && !loading && (
            <div className="flex h-full min-h-[500px] items-center justify-center p-6">
              <div className="max-w-md rounded-2xl border border-red-500/20 bg-red-950/20 p-6 text-center">
                <AlertTriangle className="mx-auto h-8 w-8 text-red-400" />

                <h3 className="mt-3 text-sm font-bold text-red-300">
                  Falha na análise
                </h3>

                <p className="mt-2 text-xs leading-relaxed text-red-200/70">
                  {error}
                </p>
              </div>
            </div>
          )}

          {!loading &&
            !error &&
            repository && (
              <MindMapRenderer
              style={mapStyle}
              repository={repository}
              expandedNodes={expandedNodes}
              activeNode={activeNode}
              onNodeClick={toggleNode}
            />
          )}
        </main>

        {activeNode && (
          <div className="absolute bottom-4 left-4 right-4 z-30 rounded-2xl border border-cyan-500/20 bg-slate-900/95 p-4 shadow-2xl backdrop-blur-xl">
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
                  <p className="mt-2 break-all font-mono text-[10px] text-white">
                    {String(activeNode.value)}
                  </p>
                )}

                {activeNode.children?.length ? (
                  <p className="mt-2 text-[9px] text-slate-600">
                    {activeNode.children.length}{' '}
                    informações disponíveis
                  </p>
                ) : null}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

interface MindMapViewProps {
  repository: RepositoryExplorerNode;
  expandedNodes: string[];
  activeNode: RepositoryExplorerNode | null;
  onNodeClick: (
    node: RepositoryExplorerNode
  ) => void;
}

const MindMapView: React.FC<
  MindMapViewProps
> = ({
  repository,
  expandedNodes,
  activeNode,
  onNodeClick,
}) => {
  const children =
    repository.children || [];

  return (
    <div className="flex min-h-full items-start justify-center px-4 py-10 pb-32 sm:px-8 sm:py-14">
      <div className="w-full max-w-7xl">
        <div className="flex flex-col items-center">
          {/* NÓ CENTRAL */}

          <button
            type="button"
            onClick={() =>
              onNodeClick(repository)
            }
            className={`group relative z-20 w-full max-w-[360px] rounded-3xl border p-6 text-center transition-all duration-300 ${
              activeNode?.id ===
              repository.id
                ? 'border-cyan-400 bg-cyan-500/15 shadow-2xl shadow-cyan-500/20'
                : 'border-cyan-500/30 bg-slate-900 hover:border-cyan-400/60 hover:bg-slate-900/90'
            }`}
          >
            <div className="text-4xl">
              {repository.icon}
            </div>

            <div className="mt-3 truncate text-base font-black text-white sm:text-lg">
              {repository.title}
            </div>

            <div className="mt-1 text-[9px] font-bold uppercase tracking-[0.2em] text-cyan-400">
              Análise técnica
            </div>

            {repository.description && (
              <p className="mx-auto mt-3 max-w-[320px] text-[10px] leading-relaxed text-slate-400">
                {repository.description}
              </p>
            )}

            <div className="mt-4 text-[9px] text-slate-600">
              Clique para visualizar detalhes
            </div>
          </button>

          {/* CONEXÃO CENTRAL */}

          {children.length > 0 && (
            <div className="h-12 w-px bg-gradient-to-b from-cyan-400/70 via-cyan-500/40 to-cyan-500/10" />
          )}

          {/* CATEGORIAS */}

          <div className="relative grid w-full grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {children.map((node) => {
              const expanded =
                expandedNodes.includes(
                  node.id
                );

              return (
                <div
                  key={node.id}
                  className="flex flex-col"
                >
                  <button
                    type="button"
                    onClick={() =>
                      onNodeClick(node)
                    }
                    className={`group relative min-h-[120px] rounded-2xl border p-4 text-left transition-all duration-300 ${
                      activeNode?.id ===
                      node.id
                        ? 'border-cyan-400 bg-cyan-500/15 shadow-xl shadow-cyan-500/10'
                        : 'border-slate-800 bg-slate-900/90 hover:border-cyan-500/40 hover:bg-slate-900'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <span className="text-2xl">
                        {node.icon}
                      </span>

                      {node.children?.length ? (
                        <span className="rounded-lg border border-slate-800 bg-slate-950 p-1 text-slate-500">
                          {expanded ? (
                            <ChevronDown className="h-3.5 w-3.5" />
                          ) : (
                            <ChevronRight className="h-3.5 w-3.5" />
                          )}
                        </span>
                      ) : null}
                    </div>

                    <div className="mt-3 text-xs font-bold text-slate-200 group-hover:text-cyan-300">
                      {node.title}
                    </div>

                    {node.description && (
                      <p className="mt-1 line-clamp-2 text-[9px] leading-relaxed text-slate-500">
                        {node.description}
                      </p>
                    )}

                    {node.children?.length ? (
                      <div className="mt-3 text-[9px] font-mono text-cyan-500/70">
                        {node.children.length}{' '}
                        itens detectados
                      </div>
                    ) : null}
                  </button>

                  {/* FILHOS */}

                  {expanded &&
                    node.children &&
                    node.children.length >
                      0 && (
                      <div className="mt-2 space-y-1 rounded-xl border border-slate-800/80 bg-slate-950/70 p-2">
                        {node.children.map(
                          (child) => (
                            <button
                              key={child.id}
                              type="button"
                              onClick={() =>
                                onNodeClick(
                                  child
                                )
                              }
                              className={`flex w-full items-center gap-2 rounded-lg border border-transparent px-2.5 py-2 text-left transition ${
                                activeNode?.id ===
                                child.id
                                  ? 'border-cyan-500/20 bg-cyan-500/10'
                                  : 'hover:bg-slate-900'
                              }`}
                            >
                              <span className="text-sm">
                                {child.icon ||
                                  '•'}
                              </span>

                              <span className="min-w-0 flex-1 truncate text-[10px] font-medium text-slate-300">
                                {child.title}
                              </span>

                              {child.value !==
                                undefined && (
                                <span className="max-w-[140px] truncate font-mono text-[8px] text-cyan-400">
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
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
