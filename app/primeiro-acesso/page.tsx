'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import {
  Lock,
  Eye,
  EyeOff,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  RefreshCw,
  ShieldCheck,
  ArrowRight,
  Sparkles,
  KeyRound,
  Check,
} from 'lucide-react';
import { validatePasswordComplexity, PasswordComplexityCheck } from '@/lib/password';

function PrimeiroAcessoForm() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const token = searchParams.get('token') || '';

  // Validation & loading states
  const [isValidatingToken, setIsValidatingToken] = useState(true);
  const [tokenValid, setTokenValid] = useState(false);
  const [tokenError, setTokenError] = useState('');
  const [adminEmail, setAdminEmail] = useState('');

  // Form states
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Submit states
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);

  // Real-time password compliance check
  const complexity = validatePasswordComplexity(password);
  const passwordsMatch = password.length > 0 && password === confirmPassword;
  const isFormValid = complexity.valid && passwordsMatch;

  // Validate token on mount
  useEffect(() => {
    if (!token) {
      setIsValidatingToken(false);
      setTokenValid(false);
      setTokenError('Link de primeiro acesso inválido: Nenhum token de segurança foi fornecido.');
      return;
    }

    const validateToken = async () => {
      setIsValidatingToken(true);
      try {
        const response = await fetch(`/api/auth/first-access/validate?token=${encodeURIComponent(token)}`);
        const data = await response.json();

        if (response.ok && data.valid) {
          setTokenValid(true);
          setAdminEmail(data.email || '');
        } else {
          setTokenValid(false);
          setTokenError(data.error || 'Este token de primeiro acesso é inválido ou já expiro.');
        }
      } catch (err) {
        setTokenValid(false);
        setTokenError('Erro ao conectar com o servidor para validar o token.');
      } finally {
        setIsValidatingToken(false);
      }
    };

    validateToken();
  }, [token]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitError('');

    if (!isFormValid) {
      setSubmitError('Por favor, atenda a todos os requisitos de segurança da senha antes de continuar.');
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch('/api/auth/first-access/set-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          token,
          password,
          confirmPassword,
        }),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        setIsSuccess(true);
      } else {
        setSubmitError(data.error?.message || data.error || 'Erro ao definir senha.');
      }
    } catch (err: any) {
      setSubmitError('Erro inesperado na comunicação com o servidor.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isValidatingToken) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4">
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8 max-w-md w-full text-center space-y-4 shadow-2xl">
          <RefreshCw className="w-10 h-10 text-cyan-400 animate-spin mx-auto" />
          <h2 className="text-lg font-bold text-white">Validando Token de Primeiro Acesso</h2>
          <p className="text-xs text-slate-400">
            Aguarde um instante enquanto verificamos a autenticidade do seu link seguro...
          </p>
        </div>
      </div>
    );
  }

  if (!tokenValid && !isSuccess) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4">
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8 max-w-md w-full text-center space-y-5 shadow-2xl">
          <div className="w-16 h-16 bg-rose-950/80 border border-rose-800/80 rounded-2xl flex items-center justify-center mx-auto text-rose-400">
            <AlertTriangle className="w-8 h-8" />
          </div>
          <div className="space-y-2">
            <h2 className="text-xl font-extrabold text-white">Acesso Não Autorizado ou Expirado</h2>
            <p className="text-xs text-slate-400 leading-relaxed">{tokenError}</p>
          </div>
          <div className="pt-3 border-t border-slate-800/80 flex flex-col gap-2">
            <button
              onClick={() => router.push('/')}
              className="w-full py-2.5 px-4 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold rounded-xl border border-slate-700 transition-colors"
            >
              Voltar para a Página Inicial
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (isSuccess) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4">
        <div className="bg-slate-900 border border-emerald-500/40 rounded-2xl p-8 max-w-md w-full text-center space-y-6 shadow-2xl animate-in zoom-in-95 duration-200">
          <div className="w-16 h-16 bg-emerald-950 border border-emerald-500/50 rounded-2xl flex items-center justify-center mx-auto text-emerald-400 shadow-inner">
            <CheckCircle2 className="w-9 h-9" />
          </div>
          <div className="space-y-2">
            <h2 className="text-2xl font-black text-white">Senha Criada com Sucesso!</h2>
            <p className="text-xs text-slate-300 leading-relaxed">
              O seu primeiro acesso foi concluído. Sua conta de Administrador (<strong>{adminEmail}</strong>) foi ativada com sucesso.
            </p>
          </div>

          <div className="p-3 bg-emerald-950/40 border border-emerald-800/60 rounded-xl text-left text-xs text-emerald-300 space-y-1">
            <div className="font-semibold flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              Conta de Administrador Ativa
            </div>
            <p className="text-[11px] text-emerald-400/80">
              Você já pode utilizar seu e-mail e nova senha para acessar a área administrativa.
            </p>
          </div>

          <button
            onClick={() => router.push('/?admin=login')}
            className="w-full py-3 px-5 bg-emerald-600 hover:bg-emerald-500 text-slate-950 font-bold text-xs rounded-xl transition-all shadow-lg shadow-emerald-950/50 flex items-center justify-center gap-2"
          >
            Acessar Painel de Login <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 max-w-lg w-full space-y-6 shadow-2xl">
        {/* Header */}
        <div className="flex items-center gap-3 pb-4 border-b border-slate-800">
          <div className="w-12 h-12 rounded-2xl bg-cyan-950 border border-cyan-800 flex items-center justify-center text-cyan-400 shadow-inner">
            <KeyRound className="w-6 h-6" />
          </div>
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-cyan-400 bg-cyan-950/80 border border-cyan-800 px-2 py-0.5 rounded">
              Primeiro Acesso Admin
            </span>
            <h1 className="text-xl font-extrabold text-white">Criação da Sua Senha</h1>
          </div>
        </div>

        {/* Email banner */}
        <div className="p-3.5 bg-slate-950 border border-slate-800 rounded-xl flex items-center justify-between text-xs">
          <div>
            <span className="text-slate-500 block text-[10px] uppercase font-semibold">Conta de Administrador:</span>
            <span className="font-mono font-bold text-slate-200">{adminEmail}</span>
          </div>
          <ShieldCheck className="w-5 h-5 text-emerald-400" />
        </div>

        {submitError && (
          <div className="p-3 bg-rose-950/90 border border-rose-800 text-rose-300 text-xs rounded-xl flex items-start gap-2">
            <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
            <span>{submitError}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* New Password field */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              Nova Senha de Acesso
            </label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Digite sua nova senha"
                className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-3.5 pr-10 py-2.5 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-cyan-500 transition-colors"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 p-1"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Confirm Password field */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              Confirmar Nova Senha
            </label>
            <div className="relative">
              <input
                type={showConfirmPassword ? 'text' : 'password'}
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Repita a nova senha"
                className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-3.5 pr-10 py-2.5 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-cyan-500 transition-colors"
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 p-1"
              >
                {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Password Complexity Criteria Checklist */}
          <div className="p-4 bg-slate-950/80 border border-slate-800 rounded-2xl space-y-2 text-xs">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
              Requisitos Obrigatórios de Segurança:
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px]">
              <RuleItem label="Mínimo de 8 caracteres" valid={complexity.checks.length} />
              <RuleItem label="Letra maiúscula (A-Z)" valid={complexity.checks.uppercase} />
              <RuleItem label="Letra minúscula (a-z)" valid={complexity.checks.lowercase} />
              <RuleItem label="Número (0-9)" valid={complexity.checks.number} />
              <RuleItem label="Caractere especial (!@#$)" valid={complexity.checks.special} />
              <RuleItem label="Senhas coincidem" valid={passwordsMatch} />
            </div>
          </div>

          {/* Submit button */}
          <button
            type="submit"
            disabled={!isFormValid || isSubmitting}
            className="w-full py-3 px-5 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-slate-950 font-extrabold text-xs transition-all shadow-lg shadow-cyan-950/50 flex items-center justify-center gap-2 disabled:opacity-40 disabled:cursor-not-allowed"
          >
            {isSubmitting ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" /> Salvando Nova Senha...
              </>
            ) : (
              <>
                <Lock className="w-4 h-4" /> Definir Senha e Concluir Primeiro Acesso
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}

function RuleItem({ label, valid }: { label: string; valid: boolean }) {
  return (
    <div className={`flex items-center gap-1.5 transition-colors ${valid ? 'text-emerald-400 font-medium' : 'text-slate-500'}`}>
      {valid ? (
        <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
      ) : (
        <div className="w-1.5 h-1.5 rounded-full bg-slate-700 shrink-0 ml-1 mr-1" />
      )}
      <span>{label}</span>
    </div>
  );
}

export default function PrimeiroAcessoPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4">
          <div className="text-slate-400 text-xs flex items-center gap-2">
            <RefreshCw className="w-4 h-4 animate-spin text-cyan-400" />
            Carregando página de primeiro acesso...
          </div>
        </div>
      }
    >
      <PrimeiroAcessoForm />
    </Suspense>
  );
}
