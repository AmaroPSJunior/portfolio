'use client';

import React, {
  useEffect,
  useMemo,
  useState,
} from 'react';

import {
  ArrowLeft,
  Home,
  RotateCcw,
} from 'lucide-react';

import { RepositoryExplorerNode } from '@/types';

interface BubbleMindMapProps {
  repository: RepositoryExplorerNode;
  activeNode: RepositoryExplorerNode | null;
  onNodeClick: (
    node: RepositoryExplorerNode
  ) => void;
}

interface NavigationItem {
  node: RepositoryExplorerNode;
  parent: RepositoryExplorerNode | null;
}

export const BubbleMindMap: React.FC<
  BubbleMindMapProps
> = ({
  repository,
  activeNode,
  onNodeClick,
}) => {
  const [currentNode, setCurrentNode] =
    useState<RepositoryExplorerNode>(
      repository
    );

  const [history, setHistory] = useState<
    NavigationItem[]
  >([]);

  const [hoveredNode, setHoveredNode] =
    useState<string | null>(null);

  const [isAnimating, setIsAnimating] =
    useState(false);

  const children = useMemo(
    () =>
      currentNode.children?.filter(
        Boolean
      ) ?? [],
    [currentNode]
  );

  useEffect(() => {
    setCurrentNode(repository);
    setHistory([]);
    setHoveredNode(null);
  }, [repository]);

  const navigateTo = (
    node: RepositoryExplorerNode
  ) => {
    if (isAnimating) return;

    setIsAnimating(true);

    const nextHistory = [
      ...history,
      {
        node: currentNode,
        parent:
          history.length > 0
            ? history[
                history.length - 1
              ].node
            : null,
      },
    ];

    setHistory(nextHistory);
    setCurrentNode(node);
    setHoveredNode(null);

    onNodeClick(node);

    window.setTimeout(() => {
      setIsAnimating(false);
    }, 350);
  };

  const goBack = () => {
    if (isAnimating) return;

    if (history.length === 0) {
      return;
    }

    setIsAnimating(true);

    const previous =
      history[history.length - 1];

    setHistory(
      history.slice(0, -1)
    );

    setCurrentNode(previous.node);
    setHoveredNode(null);

    onNodeClick(previous.node);

    window.setTimeout(() => {
      setIsAnimating(false);
    }, 350);
  };

  const goHome = () => {
    if (isAnimating) return;

    setIsAnimating(true);

    setHistory([]);
    setCurrentNode(repository);
    setHoveredNode(null);

    onNodeClick(repository);

    window.setTimeout(() => {
      setIsAnimating(false);
    }, 350);
  };

  const reset = () => {
    goHome();
  };

  const getBubblePosition = (
    index: number,
    total: number
  ) => {
    const angle =
      (index / Math.max(total, 1)) *
        Math.PI *
        2 -
      Math.PI / 2;

    const radius =
      total <= 4
        ? 210
        : total <= 8
          ? 250
          : 285;

    const x =
      Math.cos(angle) * radius;

    const y =
      Math.sin(angle) * radius;

    return {
      transform: `translate(calc(-50% + ${x}px), calc(-50% + ${y}px))`,
    };
  };

  return (
    <div className="relative flex min-h-full min-w-[900px] items-center justify-center overflow-hidden px-8 py-12">

      {/* FUNDO */}

      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-1/2 top-1/2 h-[650px] w-[650px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-cyan-500/[0.025] blur-3xl" />

        <div className="absolute left-1/2 top-1/2 h-[420px] w-[420px] -translate-x-1/2 -translate-y-1/2 rounded-full border border-cyan-500/[0.06]" />

        <div className="absolute left-1/2 top-1/2 h-[560px] w-[560px] -translate-x-1/2 -translate-y-1/2 rounded-full border border-cyan-500/[0.035]" />
      </div>

      {/* NAVEGAÇÃO */}

      <div className="absolute left-6 top-6 z-40 flex items-center gap-2">

        <button
          type="button"
          onClick={goBack}
          disabled={
            history.length === 0 ||
            isAnimating
          }
          className="group flex items-center gap-2 rounded-xl border border-slate-800 bg-slate-950/90 px-3 py-2 text-[9px] font-bold text-slate-400 backdrop-blur-xl transition hover:border-cyan-500/40 hover:text-cyan-300 disabled:cursor-not-allowed disabled:opacity-30"
        >
          <ArrowLeft className="h-3.5 w-3.5 transition-transform group-hover:-translate-x-0.5" />

          {history.length > 0
            ? `Voltar para ${
                history[
                  history.length - 1
                ].node.title
              }`
            : 'Voltar'}
        </button>

        {history.length > 0 && (
          <button
            type="button"
            onClick={goHome}
            disabled={isAnimating}
            className="flex items-center gap-2 rounded-xl border border-slate-800 bg-slate-950/90 px-3 py-2 text-[9px] font-bold text-slate-400 backdrop-blur-xl transition hover:border-cyan-500/40 hover:text-cyan-300"
          >
            <Home className="h-3.5 w-3.5" />
            Repositório
          </button>
        )}

        {history.length > 0 && (
          <button
            type="button"
            onClick={reset}
            disabled={isAnimating}
            title="Voltar ao início"
            className="rounded-xl border border-slate-800 bg-slate-950/90 p-2 text-slate-500 backdrop-blur-xl transition hover:border-cyan-500/40 hover:text-cyan-300"
          >
            <RotateCcw className="h-3.5 w-3.5" />
          </button>
        )}
      </div>

      {/* CAMINHO */}

      <div className="absolute right-6 top-6 z-40 max-w-[45%] overflow-x-auto">
        <div className="flex items-center justify-end gap-1 whitespace-nowrap">
          <button
            type="button"
            onClick={goHome}
            className="text-[8px] font-bold uppercase tracking-wider text-slate-600 transition hover:text-cyan-400"
          >
            {repository.title}
          </button>

          {history.map(
            (item, index) => (
              <React.Fragment
                key={`${item.node.id}-${index}`}
              >
                <span className="text-slate-700">
                  /
                </span>

                <span className="max-w-[100px] truncate text-[8px] text-slate-600">
                  {item.node.title}
                </span>
              </React.Fragment>
            )
          )}
        </div>
      </div>

      {/* ÁREA DO MAPA */}

      <div
        className={`
          relative h-[680px] w-[760px]
          transition-all duration-300
          ${
            isAnimating
              ? 'scale-[0.98] opacity-80'
              : 'scale-100 opacity-100'
          }
        `}
      >

        {/* CONEXÕES */}

        <svg
          className="pointer-events-none absolute inset-0 z-0 h-full w-full overflow-visible"
          viewBox="0 0 760 680"
          preserveAspectRatio="xMidYMid meet"
        >
          <defs>
            <linearGradient
              id="bubbleLine"
              x1="0%"
              y1="0%"
              x2="100%"
              y2="100%"
            >
              <stop
                offset="0%"
                stopColor="#22d3ee"
                stopOpacity="0.4"
              />

              <stop
                offset="100%"
                stopColor="#0891b2"
                stopOpacity="0.03"
              />
            </linearGradient>
          </defs>

          {children.map(
            (child, index) => {
              const position =
                getBubblePosition(
                  index,
                  children.length
                );

              const match =
                position.transform.match(
                  /([-0-9.]+)px.*?([-0-9.]+)px/
                );

              const x =
                380 +
                Number(match?.[1] || 0);

              const y =
                340 +
                Number(match?.[2] || 0);

              return (
                <line
                  key={`line-${child.id}`}
                  x1="380"
                  y1="340"
                  x2={x}
                  y2={y}
                  stroke="url(#bubbleLine)"
                  strokeWidth={
                    hoveredNode ===
                    child.id
                      ? '2'
                      : '1'
                  }
                  className="transition-all duration-300"
                />
              );
            }
          )}
        </svg>

        {/* BOLHA CENTRAL */}

        <div className="absolute left-1/2 top-1/2 z-20 -translate-x-1/2 -translate-y-1/2">

          <div
            className={`
              relative flex
              h-[180px] w-[180px]
              items-center justify-center
              rounded-full
              border
              transition-all duration-500
              ${
                hoveredNode ===
                currentNode.id
                  ? 'scale-105 border-cyan-300 bg-cyan-500/15 shadow-[0_0_80px_rgba(34,211,238,0.25)]'
                  : 'border-cyan-400/40 bg-slate-950 shadow-[0_0_55px_rgba(34,211,238,0.12)]'
              }
            `}
            onMouseEnter={() =>
              setHoveredNode(
                currentNode.id
              )
            }
            onMouseLeave={() =>
              setHoveredNode(null)
            }
          >

            <div className="absolute inset-[-8px] rounded-full border border-cyan-500/10" />

            <div className="absolute inset-[-18px] rounded-full border border-cyan-500/[0.04]" />

            <div className="relative z-10 max-w-[130px] text-center">

              <div className="text-4xl">
                {currentNode.icon ||
                  '◉'}
              </div>

              <div className="mt-2 line-clamp-2 text-sm font-black text-white">
                {currentNode.title}
              </div>

              {currentNode.value !==
                undefined && (
                <div className="mt-1 truncate font-mono text-[8px] text-cyan-400">
                  {String(
                    currentNode.value
                  )}
                </div>
              )}

              <div className="mt-2 text-[7px] font-bold uppercase tracking-[0.18em] text-slate-600">
                {children.length > 0
                  ? `${children.length} opções`
                  : 'Informação'}
              </div>
            </div>
          </div>
        </div>

        {/* BOLHAS FILHAS */}

        {children.map(
          (child, index) => {
            const isHovered =
              hoveredNode ===
              child.id;

            const hasChildren =
              Boolean(
                child.children
                  ?.length
              );

            return (
              <div
                key={child.id}
                className="absolute left-1/2 top-1/2 z-10"
                style={{
                  ...getBubblePosition(
                    index,
                    children.length
                  ),
                  transition:
                    'transform 500ms cubic-bezier(0.22, 1, 0.36, 1), opacity 300ms ease',
                }}
              >

                <button
                  type="button"
                  onMouseEnter={() =>
                    setHoveredNode(
                      child.id
                    )
                  }
                  onMouseLeave={() =>
                    setHoveredNode(null)
                  }
                  onClick={() =>
                    navigateTo(
                      child
                    )
                  }
                  className={`
                    group relative
                    flex h-[118px]
                    w-[118px]
                    flex-col
                    items-center
                    justify-center
                    rounded-full
                    border
                    text-center
                    transition-all
                    duration-300
                    ${
                      isHovered
                        ? 'scale-125 border-cyan-300 bg-cyan-500/15 shadow-[0_0_45px_rgba(34,211,238,0.22)]'
                        : 'border-slate-700/80 bg-slate-900/95 hover:border-cyan-500/50'
                    }
                  `}
                >

                  <div
                    className={`
                      pointer-events-none
                      absolute inset-0
                      rounded-full
                      transition-all
                      duration-500
                      ${
                        isHovered
                          ? 'scale-110 bg-cyan-400/5'
                          : 'scale-100 bg-transparent'
                      }
                    `}
                  />

                  <span className="relative text-2xl transition-transform duration-300 group-hover:scale-110">
                    {child.icon ||
                      '○'}
                  </span>

                  <span className="relative mt-1 max-w-[82px] truncate text-[9px] font-bold text-slate-300 group-hover:text-cyan-300">
                    {child.title}
                  </span>

                  {child.value !==
                    undefined && (
                    <span className="relative mt-1 max-w-[82px] truncate font-mono text-[7px] text-cyan-500">
                      {String(
                        child.value
                      )}
                    </span>
                  )}

                  {hasChildren && (
                    <span className="relative mt-1 text-[6px] uppercase tracking-wider text-slate-600">
                      {child.children!
                        .length}{' '}
                      itens
                    </span>
                  )}

                  {/* PONTO DE CONEXÃO */}

                  <span
                    className={`
                      absolute
                      ${
                        index %
                          2 ===
                        0
                          ? 'left-1/2 top-0 -translate-x-1/2 -translate-y-1/2'
                          : 'bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2'
                      }
                      h-1.5 w-1.5
                      rounded-full
                      bg-cyan-400
                      transition-all
                      duration-300
                      ${
                        isHovered
                          ? 'scale-150 shadow-[0_0_10px_rgba(34,211,238,0.9)]'
                          : 'scale-100'
                      }
                    `}
                  />
                </button>

                {/* INDICAÇÃO DE NAVEGAÇÃO */}

                {isHovered && (
                  <div className="pointer-events-none absolute left-1/2 top-full z-30 mt-3 -translate-x-1/2 whitespace-nowrap rounded-lg border border-cyan-500/20 bg-slate-950/95 px-2 py-1.5 text-[7px] font-medium text-cyan-300 shadow-xl backdrop-blur-xl">
                    {hasChildren
                      ? 'Clique para explorar'
                      : 'Clique para visualizar'}
                  </div>
                )}
              </div>
            );
          }
        )}

        {/* ESTADO SEM FILHOS */}

        {children.length ===
          0 && (
          <div className="absolute left-1/2 top-[calc(50%+140px)] -translate-x-1/2 text-center">
            <div className="text-[9px] uppercase tracking-[0.2em] text-slate-600">
              Fim da ramificação
            </div>

            <div className="mt-1 text-[8px] text-slate-700">
              Esta informação não possui
              mais níveis detectados.
            </div>
          </div>
        )}
      </div>

      {/* DICA */}

      {children.length > 0 && (
        <div className="absolute bottom-5 left-1/2 -translate-x-1/2 text-center">
          <p className="text-[8px] uppercase tracking-[0.2em] text-slate-700">
            Passe o mouse para explorar •
            clique para entrar
          </p>
        </div>
      )}
    </div>
  );
};