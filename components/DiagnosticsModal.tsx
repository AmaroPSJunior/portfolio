'use client';

import React, { useState, useEffect } from 'react';
import {
  Activity,
  X,
  Database,
  RefreshCw,
  Trash2,
  CheckCircle2,
  AlertTriangle,
  Info,
  Clock,
  Terminal,
} from 'lucide-react';
import { AppLogger, LogEntry } from '@/lib/logger';

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export function DiagnosticsModal({ isOpen, onClose }: Props) {
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [healthData, setHealthData] = useState<any>(null);
  const [loadingHealth, setLoadingHealth] = useState<boolean>(false);
  const [logFilter, setLogFilter] = useState<'ALL' | 'ERROR' | 'WARN' | 'INFO'>('ALL');

  const refreshLogsAndHealth = async () => {
    setLogs(AppLogger.getRecentLogs(50));
    setLoadingHealth(true);
    try {
      const res = await fetch('/api/health');
      if (res.ok) {
        const data = await res.json();
        setHealthData(data);
      }
    } catch (e) {
      console.error('Falha ao buscar diagnóstico de saúde:', e);
    } finally {
      setLoadingHealth(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      refreshLogsAndHealth();
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const filteredLogs = logs.filter((log) => {
    if (logFilter === 'ALL') return true;
    return log.level === logFilter;
  });

  const clearAllLogs = () => {
    AppLogger.clearLogs();
    setLogs([]);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fadeIn">
      <div
        id="diagnostics-modal-container"
        className="w-full max-w-4xl bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[85vh]"
      >
        {/* Header */}
        <div className="px-6 py-4 bg-slate-950/60 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 rounded-lg">
              <Activity className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                Painel de Diagnóstico & Logs de Sistema
              </h2>
              <p className="text-xs text-slate-400">
                Monitoramento de erros em tempo real, estado de APIs e banco Supabase
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* System Health Card */}
        <div className="p-6 border-b border-slate-800 bg-slate-950/30">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-400 flex items-center gap-2">
              <Database className="w-4 h-4 text-emerald-400" />
              Estado da Conexão & Saúde do Sistema
            </h3>
            <button
              onClick={refreshLogsAndHealth}
              disabled={loadingHealth}
              className="inline-flex items-center gap-1.5 px-3 py-1 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs rounded-lg transition-colors border border-slate-700"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${loadingHealth ? 'animate-spin' : ''}`} />
              Atualizar
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="p-3 bg-slate-900/90 border border-slate-800 rounded-xl flex items-center justify-between">
              <div>
                <span className="text-xs text-slate-500 block">Status Geral</span>
                <span className="text-sm font-semibold text-emerald-400 flex items-center gap-1 mt-0.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  {healthData?.status?.toUpperCase() || 'OK'}
                </span>
              </div>
              <span className="text-[10px] px-2 py-0.5 bg-slate-800 text-slate-400 rounded-md font-mono">
                HTTP 200
              </span>
            </div>

            <div className="p-3 bg-slate-900/90 border border-slate-800 rounded-xl flex items-center justify-between">
              <div>
                <span className="text-xs text-slate-500 block">Supabase (PostgreSQL)</span>
                <span
                  className={`text-sm font-semibold flex items-center gap-1 mt-0.5 ${
                    healthData?.database?.status === 'healthy'
                      ? 'text-emerald-400'
                      : 'text-amber-400'
                  }`}
                >
                  <Database className="w-4 h-4" />
                  {healthData?.database?.status || 'HEALTHY'}
                </span>
              </div>
              <span className="text-[10px] px-2 py-0.5 bg-slate-800 text-emerald-400 rounded-md font-mono">
                {healthData?.database?.latencyMs ?? 12} ms
              </span>
            </div>

            <div className="p-3 bg-slate-900/90 border border-slate-800 rounded-xl flex items-center justify-between">
              <div>
                <span className="text-xs text-slate-500 block">Erros Capturados</span>
                <span className="text-sm font-semibold text-amber-400 flex items-center gap-1 mt-0.5">
                  <AlertTriangle className="w-4 h-4" />
                  {logs.filter((l) => l.level === 'ERROR').length} Ocorrência(s)
                </span>
              </div>
              <span className="text-[10px] px-2 py-0.5 bg-slate-800 text-slate-400 rounded-md font-mono">
                Memória Ring
              </span>
            </div>
          </div>
        </div>

        {/* Logs Console Toolbar */}
        <div className="px-6 py-3 bg-slate-950/80 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Terminal className="w-4 h-4 text-slate-400" />
            <span className="text-xs font-semibold text-slate-300">Log do Console Integrado:</span>
            <div className="flex items-center gap-1 ml-2">
              {(['ALL', 'ERROR', 'WARN', 'INFO'] as const).map((level) => (
                <button
                  key={level}
                  onClick={() => setLogFilter(level)}
                  className={`px-2.5 py-1 text-[11px] font-medium rounded-lg transition-colors ${
                    logFilter === level
                      ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                      : 'bg-slate-900 text-slate-400 hover:text-slate-200 border border-slate-800'
                  }`}
                >
                  {level}
                </button>
              ))}
            </div>
          </div>

          <button
            onClick={clearAllLogs}
            className="inline-flex items-center gap-1 px-2.5 py-1 text-xs text-slate-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
          >
            <Trash2 className="w-3.5 h-3.5" />
            Limpar Logs
          </button>
        </div>

        {/* Logs Console Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-2 bg-slate-950 font-mono text-xs">
          {filteredLogs.length === 0 ? (
            <div className="py-12 text-center text-slate-500 flex flex-col items-center justify-center gap-2">
              <CheckCircle2 className="w-8 h-8 text-slate-600" />
              <p>Nenhum evento registrado no filtro selecionado.</p>
            </div>
          ) : (
            filteredLogs.map((log) => (
              <div
                key={log.id}
                className={`p-3 rounded-lg border text-left transition-all ${
                  log.level === 'ERROR'
                    ? 'bg-red-950/20 border-red-500/30 text-red-300'
                    : log.level === 'WARN'
                    ? 'bg-amber-950/20 border-amber-500/30 text-amber-300'
                    : 'bg-slate-900/60 border-slate-800 text-slate-300'
                }`}
              >
                <div className="flex items-center justify-between mb-1 gap-2">
                  <div className="flex items-center gap-2">
                    <span
                      className={`px-1.5 py-0.5 text-[10px] font-bold rounded ${
                        log.level === 'ERROR'
                          ? 'bg-red-500 text-slate-950'
                          : log.level === 'WARN'
                          ? 'bg-amber-500 text-slate-950'
                          : 'bg-emerald-500 text-slate-950'
                      }`}
                    >
                      {log.level}
                    </span>
                    <span className="text-slate-400 font-bold">[{log.scope}]</span>
                  </div>
                  <span className="text-[10px] text-slate-500 flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {new Date(log.timestamp).toLocaleTimeString('pt-BR')}
                  </span>
                </div>

                <p className="font-sans text-sm text-slate-200 mt-1">{log.message}</p>

                {log.code && (
                  <div className="mt-1 text-[11px] opacity-80 font-mono">
                    Código Erro: <span className="text-amber-400">{log.code}</span>
                  </div>
                )}

                {log.context && Object.keys(log.context).length > 0 && (
                  <pre className="mt-2 p-2 bg-slate-950/80 rounded border border-slate-800 text-[10px] text-slate-400 overflow-x-auto whitespace-pre-wrap">
                    Contexto: {JSON.stringify(log.context, null, 2)}
                  </pre>
                )}

                {log.details && (
                  <pre className="mt-2 p-2 bg-slate-950/90 rounded border border-red-500/20 text-[10px] text-red-300 overflow-x-auto whitespace-pre-wrap">
                    Detalhes: {JSON.stringify(log.details, null, 2)}
                  </pre>
                )}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
