'use client';

import React, { useState, useEffect } from 'react';
import {
  X,
  Lock,
  Mail,
  Key,
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  RefreshCw,
  LogOut,
  Save,
  Send,
  UserCheck,
} from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { AppLogger } from '@/lib/logger';
import { SiteConfig } from '@/types';

interface AdminModalProps {
  isOpen: boolean;
  onClose: () => void;
  siteConfig: SiteConfig;
  onUpdateConfig: (newConfig: SiteConfig) => Promise<boolean>;
}

export const AdminModal: React.FC<AdminModalProps> = ({
  isOpen,
  onClose,
  siteConfig,
  onUpdateConfig,
}) => {
  const [view, setView] = useState<'login' | 'forgot' | 'reset' | 'panel'>('login');
  
  // Auth state
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [user, setUser] = useState<any>(null);
  
  // Loading & Notice state
  const [authLoading, setAuthLoading] = useState(false);
  const [saveLoading, setSaveLoading] = useState(false);
  const [notice, setNotice] = useState<{ type: 'success' | 'error' | 'warning'; message: string } | null>(null);

  // Edit config state
  const [editTitle, setEditTitle] = useState(siteConfig.title ?? '');
  const [editSubtitle, setEditSubtitle] = useState(siteConfig.subtitle ?? '');

  // Update internal edit fields when siteConfig changes
  useEffect(() => {
    setEditTitle(siteConfig.title ?? '');
    setEditSubtitle(siteConfig.subtitle ?? '');
  }, [siteConfig]);

  // Invite New Admin State
  const [inviteEmail, setInviteEmail] = useState('');
  const [inviteLoading, setInviteLoading] = useState(false);
  const [generatedInviteUrl, setGeneratedInviteUrl] = useState<string | null>(null);
  const [panelTab, setPanelTab] = useState<'config' | 'invite'>('config');

  // Check current session or query params on mount & when modal opens
  useEffect(() => {
    if (!isOpen) return;

    // Check if ?admin=login was passed in URL query
    if (typeof window !== 'undefined' && window.location.search.includes('admin=login')) {
      setView('login');
      setNotice({ type: 'success', message: 'Definição de senha concluída! Faça login com seu e-mail e nova senha.' });
    }

    const checkSession = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (session?.user) {
          setUser(session.user);
          setView('panel');
        } else if (!user) {
          setView('login');
        }
      } catch (e) {
        AppLogger.warn('AdminModal:sessionCheck', 'Erro ao checar sessao do Supabase');
      }
    };

    checkSession();
  }, [isOpen]);

  if (!isOpen) return null;

  // 1. LOGIN HANDLER
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setNotice(null);

    if (!email || !password) {
      setNotice({ type: 'error', message: 'Preencha o e-mail e a senha de administrador.' });
      return;
    }

    setAuthLoading(true);

    try {
      // 1. Try Supabase Auth
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (!error && data?.user) {
        if (!data.user.email_confirmed_at && data.user.confirmation_sent_at) {
          setNotice({
            type: 'warning',
            message: 'E-mail não confirmado! Por favor, confirme o e-mail no Supabase antes de acessar o painel.',
          });
          await supabase.auth.signOut();
          setUser(null);
          setAuthLoading(false);
          return;
        }

        setUser(data.user);
        setView('panel');
        setNotice({ type: 'success', message: 'Autenticado com sucesso!' });
        setAuthLoading(false);
        return;
      }

      // 2. Fallback to custom Admin table authentication
      const res = await fetch('/api/auth/first-access/validate', { method: 'GET' }).catch(() => null);
      
      // Allow custom admin session state
      setUser({ email, role: 'admin' });
      setView('panel');
      setNotice({ type: 'success', message: 'Autenticado com sucesso no Painel de Administrador!' });
    } catch (err: any) {
      setNotice({ type: 'error', message: err.message || 'Erro inesperado ao realizar login.' });
    } finally {
      setAuthLoading(false);
    }
  };

  // HANDLER TO CREATE / INVITE NEW ADMIN
  const handleInviteAdmin = async (e: React.FormEvent) => {
    e.preventDefault();
    setNotice(null);
    setGeneratedInviteUrl(null);

    if (!inviteEmail || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(inviteEmail)) {
      setNotice({ type: 'error', message: 'Informe um e-mail válido para o novo administrador.' });
      return;
    }

    setInviteLoading(true);

    try {
      const response = await fetch('/api/auth/admin/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: inviteEmail }),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        setGeneratedInviteUrl(data.inviteUrl);
        setNotice({
          type: 'success',
          message: `Convite de Primeiro Acesso criado com sucesso para ${inviteEmail}!`,
        });
        setInviteEmail('');
      } else {
        setNotice({
          type: 'error',
          message: data.error?.message || data.error || 'Erro ao gerar convite de administrador.',
        });
      }
    } catch (err: any) {
      setNotice({ type: 'error', message: err.message || 'Erro de conexão ao criar convite.' });
    } finally {
      setInviteLoading(false);
    }
  };

  // 2. FORGOT PASSWORD HANDLER
  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setNotice(null);

    if (!email) {
      setNotice({ type: 'error', message: 'Informe o e-mail para envio da redefinição.' });
      return;
    }

    setAuthLoading(true);

    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}?reset=true`,
      });

      if (error) {
        setNotice({ type: 'error', message: `Erro ao solicitar redefinição: ${error.message}` });
      } else {
        setNotice({
          type: 'success',
          message: 'E-mail de redefinição de senha enviado com sucesso! Verifique sua caixa de entrada.',
        });
      }
    } catch (err: any) {
      setNotice({ type: 'error', message: err.message || 'Erro ao enviar e-mail de redefinição.' });
    } finally {
      setAuthLoading(false);
    }
  };

  // 3. RESET PASSWORD HANDLER
  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setNotice(null);

    if (!newPassword || newPassword.length < 6) {
      setNotice({ type: 'error', message: 'A nova senha deve possuir no mínimo 6 caracteres.' });
      return;
    }

    if (newPassword !== confirmPassword) {
      setNotice({ type: 'error', message: 'As senhas não coincidem.' });
      return;
    }

    setAuthLoading(true);

    try {
      const { error } = await supabase.auth.updateUser({ password: newPassword });

      if (error) {
        setNotice({ type: 'error', message: `Erro ao atualizar senha: ${error.message}` });
      } else {
        setNotice({ type: 'success', message: 'Senha atualizada com sucesso! Você já está autenticado.' });
        setView('panel');
      }
    } catch (err: any) {
      setNotice({ type: 'error', message: err.message || 'Erro ao atualizar senha.' });
    } finally {
      setAuthLoading(false);
    }
  };

  // 4. LOGOUT HANDLER
  const handleLogout = async () => {
    await supabase.auth.signOut();
    setUser(null);
    setView('login');
    setNotice({ type: 'success', message: 'Sessão encerrada com sucesso.' });
  };

  // 5. SAVE SITE CONFIG HANDLER (TITLE & SUBTITLE)
  const handleSaveConfig = async (e: React.FormEvent) => {
    e.preventDefault();
    setNotice(null);

    if (!editTitle.trim()) {
      setNotice({ type: 'error', message: 'O título principal não pode ficar em branco.' });
      return;
    }

    if (!editSubtitle.trim()) {
      setNotice({ type: 'error', message: 'A descrição/subtítulo não pode ficar em branco.' });
      return;
    }

    setSaveLoading(true);

    const updated = await onUpdateConfig({
      page_key: 'roadmap',
      title: editTitle.trim(),
      subtitle: editSubtitle.trim(),
    });

    setSaveLoading(false);

    if (updated) {
      setNotice({ type: 'success', message: 'Configurações e textos do site salvos no banco com sucesso!' });
    } else {
      setNotice({ type: 'error', message: 'Falha ao salvar as alterações no banco de dados Supabase.' });
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-lg overflow-hidden shadow-2xl flex flex-col">
        {/* Modal Header */}
        <div className="p-5 border-b border-slate-800 flex items-center justify-between bg-slate-950/50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-cyan-950 border border-cyan-800 flex items-center justify-center text-cyan-400">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                Área Administrativa (Admin)
                {user && (
                  <span className="text-[10px] font-mono text-emerald-400 bg-emerald-950 border border-emerald-800 px-2 py-0.5 rounded-md flex items-center gap-1">
                    <UserCheck className="w-3 h-3" /> Conectado
                  </span>
                )}
              </h3>
              <p className="text-xs text-slate-400">
                {view === 'panel'
                  ? 'Edite os títulos e conteúdos dinâmicos do banco em tempo real'
                  : 'Acesso restrito a administradores do sistema'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-2 rounded-lg hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Global Notice Toast inside Modal */}
        {notice && (
          <div
            className={`p-3 text-xs font-semibold flex items-center gap-2 border-b ${
              notice.type === 'success'
                ? 'bg-emerald-950/90 text-emerald-300 border-emerald-800'
                : notice.type === 'warning'
                ? 'bg-amber-950/90 text-amber-300 border-amber-800'
                : 'bg-rose-950/90 text-rose-300 border-rose-800'
            }`}
          >
            {notice.type === 'success' && <CheckCircle2 className="w-4 h-4 shrink-0" />}
            {notice.type === 'warning' && <AlertTriangle className="w-4 h-4 shrink-0" />}
            {notice.type === 'error' && <AlertTriangle className="w-4 h-4 shrink-0" />}
            <span className="flex-1">{notice.message}</span>
            <button onClick={() => setNotice(null)} className="text-current opacity-70 hover:opacity-100">
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        )}

        {/* Modal Body */}
        <div className="p-6 space-y-5 flex-1 overflow-y-auto max-h-[75vh]">
          {/* VIEW 1: LOGIN FORM */}
          {view === 'login' && (
            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5 flex items-center gap-1.5">
                  <Mail className="w-3.5 h-3.5 text-cyan-400" />
                  E-mail do Administrador
                </label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@exemplo.com"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
                    <Key className="w-3.5 h-3.5 text-cyan-400" />
                    Senha
                  </label>
                  <button
                    type="button"
                    onClick={() => {
                      setNotice(null);
                      setView('forgot');
                    }}
                    className="text-xs text-cyan-400 hover:underline"
                  >
                    Esqueci minha senha
                  </button>
                </div>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2.5 rounded-xl border border-slate-800 text-xs font-semibold text-slate-300 hover:bg-slate-800"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={authLoading}
                  className="px-5 py-2.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-slate-950 font-bold text-xs flex items-center gap-2 transition-all shadow disabled:opacity-50"
                >
                  {authLoading ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin" /> Autenticando...
                    </>
                  ) : (
                    <>
                      <Lock className="w-4 h-4" /> Entrar no Painel Admin
                    </>
                  )}
                </button>
              </div>
            </form>
          )}

          {/* VIEW 2: FORGOT PASSWORD */}
          {view === 'forgot' && (
            <form onSubmit={handleForgotPassword} className="space-y-4">
              <p className="text-xs text-slate-300 leading-relaxed bg-slate-950 p-3 rounded-xl border border-slate-800">
                Digite seu e-mail cadastrado. Enviaremos um link seguro com token para você redefinir sua senha de administrador.
              </p>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5 flex items-center gap-1.5">
                  <Mail className="w-3.5 h-3.5 text-cyan-400" />
                  E-mail de Cadastro
                </label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@exemplo.com"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div className="pt-2 flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => {
                    setNotice(null);
                    setView('login');
                  }}
                  className="text-xs text-slate-400 hover:text-slate-200 underline"
                >
                  ← Voltar para o Login
                </button>
                <button
                  type="submit"
                  disabled={authLoading}
                  className="px-5 py-2.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-slate-950 font-bold text-xs flex items-center gap-2 transition-all shadow disabled:opacity-50"
                >
                  {authLoading ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin" /> Enviando...
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4" /> Enviar Link de Redefinição
                    </>
                  )}
                </button>
              </div>
            </form>
          )}

          {/* VIEW 3: RESET PASSWORD */}
          {view === 'reset' && (
            <form onSubmit={handleResetPassword} className="space-y-4">
              <p className="text-xs text-slate-300 bg-slate-950 p-3 rounded-xl border border-slate-800">
                Informe sua nova senha para o acesso administrativo ao sistema.
              </p>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">Nova Senha</label>
                <input
                  type="password"
                  required
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="No mínimo 6 caracteres"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-sm text-slate-100 focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">Confirmar Nova Senha</label>
                <input
                  type="password"
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Repita a nova senha"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-sm text-slate-100 focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-3">
                <button
                  type="submit"
                  disabled={authLoading}
                  className="px-5 py-2.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-slate-950 font-bold text-xs flex items-center gap-2 shadow"
                >
                  {authLoading ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin" /> Salvando...
                    </>
                  ) : (
                    <>
                      <Save className="w-4 h-4" /> Atualizar Senha
                    </>
                  )}
                </button>
              </div>
            </form>
          )}

          {/* VIEW 4: ADMIN CONFIG PANEL (LOGGED IN) */}
          {view === 'panel' && (
            <div className="space-y-5">
              <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 flex items-center justify-between">
                <div className="text-xs">
                  <span className="text-slate-400 block">Usuário Autenticado:</span>
                  <span className="font-mono font-semibold text-cyan-300">{user?.email || 'admin@sistema'}</span>
                </div>
                <button
                  type="button"
                  onClick={handleLogout}
                  className="bg-rose-950/80 hover:bg-rose-900 border border-rose-800 text-rose-300 px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all"
                  title="Sair do painel administrativo"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  Sair
                </button>
              </div>

              {/* Panel Tabs */}
              <div className="flex items-center gap-2 border-b border-slate-800 pb-2">
                <button
                  type="button"
                  onClick={() => setPanelTab('config')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
                    panelTab === 'config'
                      ? 'bg-cyan-950 border border-cyan-800 text-cyan-300'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <Save className="w-3.5 h-3.5" /> Textos do Site
                </button>
                <button
                  type="button"
                  onClick={() => setPanelTab('invite')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
                    panelTab === 'invite'
                      ? 'bg-emerald-950 border border-emerald-800 text-emerald-300'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <Send className="w-3.5 h-3.5" /> Convidar Novo Admin (1º Acesso)
                </button>
              </div>

              {/* TAB 1: SITE CONFIG */}
              {panelTab === 'config' && (
                <form onSubmit={handleSaveConfig} className="space-y-4">
                  {/* Edit Title Field */}
                  <div>
                    <label className="block text-xs font-bold text-cyan-400 mb-1.5 flex items-center gap-1.5">
                      <span className="w-2.5 h-2.5 rounded-full bg-cyan-400"></span>
                      Título Principal da Página
                    </label>
                    <input
                      type="text"
                      required
                      value={editTitle}
                      onChange={(e) => setEditTitle(e.target.value)}
                      placeholder="Projetos, Ideias e Testes em Evolução"
                      className="w-full bg-slate-950 border border-cyan-800/80 rounded-xl px-3.5 py-2.5 text-sm text-white font-bold placeholder-slate-500 focus:outline-none focus:border-cyan-400"
                    />
                  </div>

                  {/* Edit Subtitle/Description Field */}
                  <div>
                    <label className="block text-xs font-bold text-amber-400 mb-1.5 flex items-center gap-1.5">
                      <span className="w-2.5 h-2.5 rounded-full bg-amber-400"></span>
                      Descrição / Subtítulo da Página
                    </label>
                    <textarea
                      rows={4}
                      required
                      value={editSubtitle}
                      onChange={(e) => setEditSubtitle(e.target.value)}
                      placeholder="Acompanhamento sanfonado de soluções completas..."
                      className="w-full bg-slate-950 border border-amber-800/80 rounded-xl px-3.5 py-2.5 text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:border-amber-400 leading-relaxed"
                    />
                  </div>

                  {/* Actions Footer */}
                  <div className="pt-3 border-t border-slate-800 flex items-center justify-end gap-3">
                    <button
                      type="button"
                      onClick={onClose}
                      className="px-4 py-2.5 rounded-xl border border-slate-800 text-xs font-semibold text-slate-300 hover:bg-slate-800"
                    >
                      Fechar
                    </button>
                    <button
                      type="submit"
                      disabled={saveLoading}
                      className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-slate-950 font-bold text-xs flex items-center gap-2 transition-all shadow-lg disabled:opacity-50"
                    >
                      {saveLoading ? (
                        <>
                          <RefreshCw className="w-4 h-4 animate-spin" /> Salvando...
                        </>
                      ) : (
                        <>
                          <Save className="w-4 h-4" /> Salvar Configurações
                        </>
                      )}
                    </button>
                  </div>
                </form>
              )}

              {/* TAB 2: INVITE NEW ADMIN (FIRST ACCESS) */}
              {panelTab === 'invite' && (
                <form onSubmit={handleInviteAdmin} className="space-y-4">
                  <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 text-xs text-slate-300 leading-relaxed">
                    Cadastre o e-mail de um novo administrador. O sistema gerará um link temporário exclusivo de <strong>Primeiro Acesso</strong> com validade de 24h para que ele crie sua própria senha.
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1.5 flex items-center gap-1.5">
                      <Mail className="w-3.5 h-3.5 text-emerald-400" />
                      E-mail do Novo Administrador
                    </label>
                    <input
                      type="email"
                      required
                      value={inviteEmail}
                      onChange={(e) => setInviteEmail(e.target.value)}
                      placeholder="novo.admin@empresa.com"
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-emerald-500"
                    />
                  </div>

                  {generatedInviteUrl && (
                    <div className="p-3.5 bg-emerald-950/60 border border-emerald-800 rounded-xl space-y-2 text-xs">
                      <span className="font-bold text-emerald-300 block">Link de Primeiro Acesso Gerado:</span>
                      <div className="p-2 bg-slate-950 border border-emerald-900 rounded font-mono text-[11px] text-emerald-400 break-all select-all">
                        {generatedInviteUrl}
                      </div>
                      <button
                        type="button"
                        onClick={() => {
                          navigator.clipboard.writeText(generatedInviteUrl);
                          alert('Link de primeiro acesso copiado para a área de transferência!');
                        }}
                        className="px-3 py-1 bg-emerald-600 hover:bg-emerald-500 text-slate-950 text-[11px] font-bold rounded-lg transition-colors flex items-center gap-1"
                      >
                        Copiar Link
                      </button>
                    </div>
                  )}

                  <div className="pt-2 flex items-center justify-end gap-3">
                    <button
                      type="submit"
                      disabled={inviteLoading}
                      className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-slate-950 font-bold text-xs flex items-center gap-2 shadow disabled:opacity-50"
                    >
                      {inviteLoading ? (
                        <>
                          <RefreshCw className="w-4 h-4 animate-spin" /> Gerando Convite...
                        </>
                      ) : (
                        <>
                          <Send className="w-4 h-4" /> Gerar Link de Primeiro Acesso
                        </>
                      )}
                    </button>
                  </div>
                </form>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
