'use client';

import React, { useEffect, useMemo, useState } from 'react';
import { ArrowLeft, Home } from 'lucide-react';
import { RepositoryExplorerNode } from '@/types';
import { playRepositoryReturnSound } from '@/lib/repository-explorer/sounds';
import { NodeIcon } from '../NodeIcon';

interface BubbleMindMapProps {
  repository: RepositoryExplorerNode;
  activeNode: RepositoryExplorerNode | null;
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

export const BubbleMindMap: React.FC<
  BubbleMindMapProps
> = ({
  repository,
  activeNode,
  onNodeClick,
  onNodeMouseEnter,
  onNodeMouseLeave,
}) => {
  const [currentNode, setCurrentNode] =
    useState<RepositoryExplorerNode>(
      repository
    );

  const [history, setHistory] = useState<
    RepositoryExplorerNode[]
  >([]);

  const [hoveredNode, setHoveredNode] = useState<string | null>(null);
  const [keyboardNode, setKeyboardNode] = useState<string | null>(null);
  const [isAnimating, setIsAnimating] = useState(false);
  const children = useMemo(() => currentNode.children ?? [], [currentNode]);

  useEffect(() => {
    setCurrentNode(repository);
    setHistory([]);
    setHoveredNode(null);
  }, [repository]);

  const navigateTo = (
    node: RepositoryExplorerNode
  ) => {
    if (isAnimating) {
      return;
    }

    if (activeNode?.id === node.id) {
      onNodeClick(node);
      return;
    }

    setIsAnimating(true);

    setHistory((previous) => [
      ...previous,
      currentNode,
    ]);

    setCurrentNode(node);
    setHoveredNode(null);

    onNodeClick(node);

    window.setTimeout(() => {
      setIsAnimating(false);
    }, 350);
  };

  const goBack = () => {
    if (
      isAnimating ||
      history.length === 0
    ) {
      return;
    }

    setIsAnimating(true);

    const previousNode =
      history[history.length - 1];

    setHistory((previous) =>
      previous.slice(0, -1)
    );

    setCurrentNode(previousNode);
    setHoveredNode(null);

    window.setTimeout(() => {
      setIsAnimating(false);
    }, 350);
  };

  useEffect(() => {
    const handleKeyDown = (
      event: KeyboardEvent
    ) => {
      // BACKSPACE SEMPRE VOLTA UM NÍVEL
      if (event.key === 'Backspace') {
        event.preventDefault();
        goBack();
        return;
      }

      // ESCAPE LIMPA A SELEÇÃO
      if (event.key === 'Escape') {
        setKeyboardNode(null);
        setHoveredNode(null);
        return;
      }

      // ENTER ENTRA NA BOLA SELECIONADA
      if (
        event.key === 'Enter' &&
        keyboardNode
      ) {
        const selectedNode =
          children.find(
            (child) =>
              child.id === keyboardNode
          );

        if (selectedNode) {
          navigateTo(selectedNode);
        }

        return;
      }

      // SEM BOLAS, NÃO EXISTE NAVEGAÇÃO POR SETAS
      if (children.length === 0) {
        return;
      }

      // SETAS CONTROLAM A SELEÇÃO
      if (
        event.key === 'ArrowUp' ||
        event.key === 'ArrowDown' ||
        event.key === 'ArrowLeft' ||
        event.key === 'ArrowRight'
      ) {
        event.preventDefault();

        setKeyboardNode((currentId) => {
          const currentIndex =
            children.findIndex(
              (child) =>
                child.id === currentId
            );

          let nextIndex = 0;

          if (currentIndex >= 0) {
            const forward =
              event.key === 'ArrowRight' ||
              event.key === 'ArrowDown';

            nextIndex = forward
              ? (currentIndex + 1) %
                children.length
              : (currentIndex - 1 +
                  children.length) %
                children.length;
          }

          const nextNode =
            children[nextIndex];

          setHoveredNode(nextNode.id);

          return nextNode.id;
        });
      }
    };

    window.addEventListener(
      'keydown',
      handleKeyDown
    );

    return () => {
      window.removeEventListener(
        'keydown',
        handleKeyDown
      );
    };
  }, [
    children,
    keyboardNode,
    goBack,
    navigateTo,
  ]);



  const goHome = () => {
    if (isAnimating) {
      return;
    }

    setIsAnimating(true);

    setCurrentNode(repository);
    setHistory([]);
    setHoveredNode(null);

    onNodeClick(repository);

    window.setTimeout(() => {
      setIsAnimating(false);
    }, 350);
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
        ? 180
        : total <= 8
          ? 220
          : 255;

    return {
      x:
        Math.cos(angle) *
        radius,

      y:
        Math.sin(angle) *
        radius,
    };
  };

  return (
    <div className="relative flex min-h-[680px] min-w-[900px] items-center justify-center overflow-hidden">

      {/* FUNDO */}

      <div className="pointer-events-none absolute inset-0">

        <div className="absolute left-1/2 top-1/2 h-[620px] w-[620px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-cyan-500/[0.025] blur-3xl" />

        <div className="absolute left-1/2 top-1/2 h-[420px] w-[420px] -translate-x-1/2 -translate-y-1/2 rounded-full border border-cyan-500/[0.05]" />

        <div className="absolute left-1/2 top-1/2 h-[540px] w-[540px] -translate-x-1/2 -translate-y-1/2 rounded-full border border-cyan-500/[0.025]" />

      </div>

      {/* NAVEGAÇÃO */}

      <div className="absolute left-6 top-6 z-50 flex items-center gap-2">

        <button
          type="button"
          onClick={goBack}
          disabled={
            history.length === 0 ||
            isAnimating
          }
          className="flex items-center gap-2 rounded-xl border border-slate-800 bg-slate-950/90 px-3 py-2 text-[9px] font-bold text-slate-400 backdrop-blur-xl transition hover:border-cyan-500/40 hover:text-cyan-300 disabled:cursor-not-allowed disabled:opacity-30"
        >
          <ArrowLeft className="h-3.5 w-3.5" />

          {history.length > 0
            ? `Voltar para ${
                history[
                  history.length - 1
                ].title
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

      </div>

      {/* BREADCRUMB */}

      <div className="absolute right-6 top-6 z-50 max-w-[45%] overflow-hidden">

        <div className="flex items-center gap-1 overflow-x-auto whitespace-nowrap">

          <button
            type="button"
            onClick={goHome}
            className="truncate text-[8px] font-bold uppercase tracking-wider text-slate-600 transition hover:text-cyan-400"
          >
            {repository.title}
          </button>

          {history.map(
            (node, index) => (
              <React.Fragment
                key={`${node.id}-${index}`}
              >
                <span className="text-slate-700">
                  /
                </span>

                <span className="max-w-[100px] truncate text-[8px] text-slate-600">
                  {node.title}
                </span>
              </React.Fragment>
            )
          )}

        </div>

      </div>

      {/* ÁREA DO MAPA */}

      <div
        className={`relative h-[620px] w-[760px] transition-all duration-300 ${
          isAnimating
            ? 'scale-[0.97] opacity-70'
            : 'scale-100 opacity-100'
        }`}
      >

        {/* CONEXÕES */}
        <svg
          className="pointer-events-none absolute inset-0 z-0 h-full w-full"
          viewBox="0 0 760 620"
          preserveAspectRatio="none"
        >
          <defs>
            <linearGradient
              id="bubble-gradient"
              x1="0%"
              y1="0%"
              x2="100%"
              y2="100%"
            >
              <stop
                offset="0%"
                stopColor="#22d3ee"
                stopOpacity="0.65"
              />

              <stop
                offset="100%"
                stopColor="#0891b2"
                stopOpacity="0.12"
              />
            </linearGradient>
          </defs>

          {children.map((child, index) => {
            const position = getBubblePosition(
              index,
              children.length
            );

            return (
              <line
                key={`connection-${currentNode.id}-${child.id}`}
                x1="380"
                y1="310"
                x2={380 + position.x}
                y2={310 + position.y}
                stroke="url(#bubble-gradient)"
                strokeWidth={
                  hoveredNode === child.id
                    ? 2.5
                    : 1.5
                }
                strokeLinecap="round"
                className="transition-all duration-300"
              />
            );
          })}
        </svg>

        {/* BOLHAS */}
        {children.map(
          (child, index) => {
            const position =
              getBubblePosition(
                index,
                children.length
              );

            const hovered =
              hoveredNode ===
              child.id;

            const hasChildren =
              Boolean(
                child.children?.length
              );

            return (
              <button
                key={child.id}
                type="button"
                onClick={() => {
                  if (activeNode?.id === child.id) {
                    onNodeClick(child);
                    return;
                  }

                  navigateTo(child);
                }}
                onMouseEnter={() => {
                  setHoveredNode(child.id);
                  onNodeMouseEnter?.(child);
                }}
                onMouseLeave={() => {
                  setHoveredNode(null);
                  onNodeMouseLeave?.(child);
                }}
                className={`group absolute left-1/2 top-1/2 z-10 flex h-[88px] w-[88px] -translate-x-1/2 -translate-y-1/2 flex-col items-center justify-center rounded-full border text-center transition-all duration-500 ${
                  hovered
                  ? 'scale-[1.34] border-cyan-300 bg-slate-900 opacity-100 shadow-[0_0_45px_rgba(34,211,238,0.25)]'
                  : 'border-slate-700 bg-slate-900/60 opacity-60 hover:border-cyan-500/50 hover:opacity-100'
                }`}
                style={{
                  marginLeft:
                    position.x,
                  marginTop:
                    position.y,
                }}
              >

                <span className="flex h-8 w-8 items-center justify-center text-2xl transition-transform duration-300 group-hover:scale-110">
                  <NodeIcon
                    icon={child.icon}
                    iconUrl={child.iconUrl}
                    size="md"
                    alt={child.title}
                  />
                </span>

                <span className="mt-1 max-w-[82px] truncate text-[9px] font-bold text-slate-300 group-hover:text-cyan-300">
                  {child.title}
                </span>

                {child.value !==
                  undefined && (
                  <span className="mt-1 max-w-[82px] truncate font-mono text-[7px] text-cyan-400">
                    {String(
                      child.value
                    )}
                  </span>
                )}

                {hasChildren && (
                  <span className="mt-1 text-[6px] uppercase tracking-wider text-slate-600">
                    {child.children!
                      .length}{' '}
                    itens
                  </span>
                )}

              </button>
            );
          }
        )}

        {/* CENTRO */}

        <div
          className="absolute left-1/2 top-1/2 z-20 -translate-x-1/2 -translate-y-1/2 cursor-pointer select-none"
          onMouseEnter={() => {
            setHoveredNode(currentNode.id);
            onNodeMouseEnter?.(currentNode);
          }}
          onMouseLeave={() => {
            setHoveredNode(null);
            onNodeMouseLeave?.(currentNode);
          }}
          onDoubleClick={() => {
            playRepositoryReturnSound();
            goBack();
          }}
          title={
            history.length > 0
              ? 'Duplo clique para voltar'
              : 'Você está no início'
          }
        >

          <div
            className={`relative flex h-[180px] w-[180px] items-center justify-center rounded-full border transition-all duration-500 ${
              hoveredNode ===
              currentNode.id
                ? 'scale-105 border-cyan-300 bg-slate-950 shadow-[0_0_80px_rgba(34,211,238,0.25)]'
                : 'border-cyan-400/40 bg-slate-950 shadow-[0_0_55px_rgba(34,211,238,0.12)]'
            }`}
          >

            <div className="absolute inset-[-9px] rounded-full border border-cyan-500/10" />

            <div className="absolute inset-[-18px] rounded-full border border-cyan-500/[0.04]" />

            <div className="relative max-w-[130px] text-center">

              <div className="flex h-12 items-center justify-center text-4xl">
                <NodeIcon
                  icon={currentNode.icon}
                  iconUrl={currentNode.iconUrl}
                  size="lg"
                  alt={currentNode.title}
                />
              </div>

              <div className="mt-2 line-clamp-2 text-sm font-black text-white">
                {currentNode.title}
              </div>

              <div className="mt-2 text-[7px] font-bold uppercase tracking-[0.18em] text-slate-600">
                {children.length > 0
                  ? `${children.length} opções`
                  : 'Fim da ramificação'}
              </div>

            </div>

          </div>

        </div>

        {/* SEM FILHOS */}

        {children.length ===
          0 && (
          <div className="absolute left-1/2 top-[calc(50%+125px)] -translate-x-1/2 text-center">

            <div className="text-[8px] uppercase tracking-[0.2em] text-slate-700">
              Não existem mais informações
            </div>

          </div>
        )}

      </div>

      {/* INSTRUÇÃO */}

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
