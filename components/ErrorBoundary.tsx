'use client';

import React, { Component, ErrorInfo, ReactNode } from 'react';
import { AlertTriangle, RefreshCw, ChevronDown, ChevronUp } from 'lucide-react';
import { AppLogger } from '@/lib/logger';

interface Props {
  children: ReactNode;
  fallbackTitle?: string;
  scope?: string;
  onReset?: () => void;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
  showDetails: boolean;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
    errorInfo: null,
    showDetails: false,
  };

  public static getDerivedStateFromError(error: Error): State {
    return {
      hasError: true,
      error,
      errorInfo: null,
      showDetails: false,
    };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    const scope = this.props.scope || 'UI:ErrorBoundary';
    AppLogger.error(scope, `Falha de renderização no componente React: ${error.message}`, error, {
      componentStack: errorInfo.componentStack,
    });
    this.setState({ errorInfo });
  }

  private handleReset = (): void => {
    if (this.props.onReset) {
      this.props.onReset();
    }
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
      showDetails: false,
    });
  };

  private toggleDetails = (): void => {
    this.setState((prev) => ({ showDetails: !prev.showDetails }));
  };

  public render() {
    if (this.state.hasError) {
      return (
        <div
          id="error-boundary-container"
          className="my-4 p-6 bg-slate-900/90 border border-red-500/30 rounded-xl shadow-lg backdrop-blur-md text-slate-200"
        >
          <div className="flex items-start gap-4">
            <div className="p-3 bg-red-500/10 rounded-lg text-red-400 border border-red-500/20">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-red-400">
                {this.props.fallbackTitle || 'Ocorreu uma falha ao carregar este componente'}
              </h3>
              <p className="mt-1 text-sm text-slate-300">
                {this.state.error?.message ||
                  'Sua experiência foi preservada. Você pode tentar recarregar esta seção.'}
              </p>

              <div className="mt-4 flex flex-wrap items-center gap-3">
                <button
                  id="btn-retry-error-boundary"
                  onClick={this.handleReset}
                  className="inline-flex items-center gap-2 px-4 py-2 bg-red-500/20 hover:bg-red-500/30 text-red-300 hover:text-red-200 border border-red-500/40 rounded-lg font-medium text-sm transition-colors"
                >
                  <RefreshCw className="w-4 h-4" />
                  Tentar Novamente
                </button>

                {this.state.error && (
                  <button
                    onClick={this.toggleDetails}
                    className="inline-flex items-center gap-1 px-3 py-2 text-xs text-slate-400 hover:text-slate-200 transition-colors"
                  >
                    {this.state.showDetails ? (
                      <>
                        Ocultar Detalhes Técnicos <ChevronUp className="w-3.5 h-3.5" />
                      </>
                    ) : (
                      <>
                        Ver Detalhes Técnicos <ChevronDown className="w-3.5 h-3.5" />
                      </>
                    )}
                  </button>
                )}
              </div>

              {this.state.showDetails && (
                <div className="mt-4 p-3 bg-slate-950/80 border border-slate-800 rounded-lg text-xs font-mono text-red-300 overflow-x-auto max-h-48">
                  <p className="font-bold text-red-400">{this.state.error?.toString()}</p>
                  {this.state.errorInfo?.componentStack && (
                    <pre className="mt-2 text-slate-400 whitespace-pre-wrap font-mono">
                      {this.state.errorInfo.componentStack}
                    </pre>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
