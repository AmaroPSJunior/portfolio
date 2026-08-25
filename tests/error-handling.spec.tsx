import { describe, it, expect, beforeEach, vi } from 'vitest';
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { AppLogger } from '../lib/logger';
import {
  AppError,
  ValidationError,
  NotFoundError,
  AuthError,
  NetworkError,
  DatabaseError,
  handleApiError,
} from '../lib/errorHandler';
import { ErrorBoundary } from '../components/ErrorBoundary';

describe('Suíte de Testes - Sistema Centralizado de Tratamento de Erros e Logs', () => {
  beforeEach(() => {
    AppLogger.clearLogs();
  });

  describe('1. Utilitário de Logs Centralizado (AppLogger)', () => {
    it('deve registrar logs de nível INFO, WARN e ERROR no buffer em memória', () => {
      AppLogger.info('test:scope', 'Mensagem informativa');
      AppLogger.warn('test:scope', 'Alerta de advertência');
      AppLogger.error('test:scope', 'Erro crítico', new Error('Falha de teste'));

      const logs = AppLogger.getRecentLogs();
      expect(logs).toHaveLength(3);
      expect(logs[0].level).toBe('ERROR');
      expect(logs[1].level).toBe('WARN');
      expect(logs[2].level).toBe('INFO');
    });

    it('deve mascarar propriedades sensíveis (tokens, chaves, senhas) no contexto', () => {
      const contextWithSecrets = {
        user: 'Pedro',
        token: 'secret-jwt-token-12345',
        apiKey: 'sb_publishable_key_xyz',
        password: 'minhasenhasupersecreta',
        nested: {
          authorization: 'Bearer token-abc',
          normalField: 'ok',
        },
      };

      const sanitized = AppLogger.sanitizeContext(contextWithSecrets);

      expect(sanitized?.user).toBe('Pedro');
      expect(sanitized?.token).toBe('[REDACTED]');
      expect(sanitized?.apiKey).toBe('[REDACTED]');
      expect(sanitized?.password).toBe('[REDACTED]');
      expect(sanitized?.nested?.authorization).toBe('[REDACTED]');
      expect(sanitized?.nested?.normalField).toBe('ok');
    });

    it('deve permitir filtrar logs por nível e limpar o buffer', () => {
      AppLogger.info('scope1', 'Info 1');
      AppLogger.error('scope2', 'Erro 1');
      AppLogger.error('scope3', 'Erro 2');

      const errorLogs = AppLogger.getRecentLogs(50, 'ERROR');
      expect(errorLogs).toHaveLength(2);

      AppLogger.clearLogs();
      expect(AppLogger.getRecentLogs()).toHaveLength(0);
    });
  });

  describe('2. Taxonomia de Exceções & Categorização de Erros de Banco (DatabaseError)', () => {
    it('deve categorizar erro PostgreSQL de chave duplicada (23505) com código DATABASE_DUPLICATE_KEY e status 409', () => {
      const dbErr = new DatabaseError('duplicate key value violates unique constraint', '23505');

      expect(dbErr.code).toBe('DATABASE_DUPLICATE_KEY');
      expect(dbErr.statusCode).toBe(409);
      expect(dbErr.message).toBe('Já existe um registro cadastrado com estas informações únicas.');
    });

    it('deve categorizar erro PostgreSQL de violação de chave estrangeira (23503) com código DATABASE_FOREIGN_KEY_VIOLATION e status 400', () => {
      const dbErr = new DatabaseError('insert or update violates foreign key constraint', '23503');

      expect(dbErr.code).toBe('DATABASE_FOREIGN_KEY_VIOLATION');
      expect(dbErr.statusCode).toBe(400);
      expect(dbErr.message).toBe('Operação negada por restrição de relacionamento no banco de dados.');
    });

    it('deve categorizar erro PostgreSQL de campo obrigatório/not null (23502) com status 400', () => {
      const dbErr = new DatabaseError('null value in column violates not-null constraint', '23502');

      expect(dbErr.code).toBe('DATABASE_NOT_NULL_VIOLATION');
      expect(dbErr.statusCode).toBe(400);
    });

    it('deve criar instâncias corretas de ValidationError (400), NotFoundError (404), AuthError (401) e NetworkError (503)', () => {
      const valErr = new ValidationError('Payload inválido');
      expect(valErr.statusCode).toBe(400);
      expect(valErr.code).toBe('VALIDATION_ERROR');

      const notFound = new NotFoundError('Projeto não encontrado');
      expect(notFound.statusCode).toBe(404);
      expect(notFound.code).toBe('NOT_FOUND_ERROR');

      const authErr = new AuthError('Token expirado');
      expect(authErr.statusCode).toBe(401);
      expect(authErr.code).toBe('UNAUTHORIZED');

      const netErr = new NetworkError('Timeout na API externa');
      expect(netErr.statusCode).toBe(503);
      expect(netErr.code).toBe('NETWORK_ERROR');
    });
  });

  describe('3. Formatação Padronizada de Resposta de API (handleApiError)', () => {
    it('deve formatar erro AppError em resposta JSON com estrutura padronizada e registrar no AppLogger', async () => {
      const customErr = new ValidationError('Título da fase é obrigatório', ['Min 3 caracteres']);
      const response = handleApiError(customErr, 'fases:POST');

      expect(response.status).toBe(400);
      const json = await response.json();

      expect(json.success).toBe(false);
      expect(json.error.code).toBe('VALIDATION_ERROR');
      expect(json.error.message).toBe('Título da fase é obrigatório');
      expect(json.error.scope).toBe('fases:POST');
      expect(json.error.timestamp).toBeDefined();

      const logs = AppLogger.getRecentLogs(1, 'ERROR');
      expect(logs).toHaveLength(1);
      expect(logs[0].scope).toBe('fases:POST');
    });
  });

  describe('4. Componente React ErrorBoundary & Recuperação de Estado', () => {
    // Componente auxiliar que lança um erro sob demanda
    const BuggyComponent = ({ shouldThrow }: { shouldThrow: boolean }) => {
      if (shouldThrow) {
        throw new Error('Falha simulada de renderização no componente');
      }
      return <div>Componente renderizado normalmente</div>;
    };

    it('deve capturar falhas de renderização e exibir o card de fallback amigável', () => {
      // Suprimir logs de erro no console do React durante o teste do ErrorBoundary
      const spy = vi.spyOn(console, 'error').mockImplementation(() => {});

      render(
        <ErrorBoundary fallbackTitle="Erro na Seção de Teste">
          <BuggyComponent shouldThrow={true} />
        </ErrorBoundary>
      );

      expect(screen.getByText('Erro na Seção de Teste')).toBeDefined();
      expect(screen.getByText(/Falha simulada de renderização/)).toBeDefined();
      expect(screen.getByText('Tentar Novamente')).toBeDefined();

      spy.mockRestore();
    });

    it('deve permitir a recuperação de estado ao clicar no botão "Tentar Novamente"', () => {
      const spy = vi.spyOn(console, 'error').mockImplementation(() => {});

      let shouldThrow = true;
      const { rerender } = render(
        <ErrorBoundary fallbackTitle="Erro de Componente">
          <BuggyComponent shouldThrow={shouldThrow} />
        </ErrorBoundary>
      );

      expect(screen.getByText('Erro de Componente')).toBeDefined();

      // Mudar prop para não lançar mais erro e simular clique em "Tentar Novamente"
      shouldThrow = false;
      rerender(
        <ErrorBoundary fallbackTitle="Erro de Componente">
          <BuggyComponent shouldThrow={shouldThrow} />
        </ErrorBoundary>
      );

      fireEvent.click(screen.getByText('Tentar Novamente'));

      expect(screen.getByText('Componente renderizado normalmente')).toBeDefined();

      spy.mockRestore();
    });
  });
});
