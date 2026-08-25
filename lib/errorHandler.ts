import { NextResponse } from 'next/server';
import { AppLogger } from './logger';

export interface StandardErrorResponse {
  success: false;
  error: {
    code: string;
    message: string;
    scope: string;
    timestamp: string;
    details?: any;
    context?: Record<string, any>;
  };
}

export class AppError extends Error {
  public readonly code: string;
  public readonly statusCode: number;
  public readonly isOperational: boolean;
  public readonly details?: any;
  public readonly context?: Record<string, any>;

  constructor(
    message: string,
    code = 'INTERNAL_ERROR',
    statusCode = 500,
    isOperational = true,
    details?: any,
    context?: Record<string, any>
  ) {
    super(message);
    this.name = this.constructor.name;
    this.code = code;
    this.statusCode = statusCode;
    this.isOperational = isOperational;
    this.details = details;
    this.context = context;
    Object.setPrototypeOf(this, new.target.prototype);
  }
}

export class ValidationError extends AppError {
  constructor(message: string, details?: any, context?: Record<string, any>) {
    super(message, 'VALIDATION_ERROR', 400, true, details, context);
  }
}

export class NotFoundError extends AppError {
  constructor(message = 'Recurso não encontrado.', details?: any, context?: Record<string, any>) {
    super(message, 'NOT_FOUND_ERROR', 404, true, details, context);
  }
}

export class AuthError extends AppError {
  constructor(message = 'Não autorizado.', statusCode = 401, details?: any, context?: Record<string, any>) {
    super(message, statusCode === 403 ? 'FORBIDDEN' : 'UNAUTHORIZED', statusCode, true, details, context);
  }
}

export class NetworkError extends AppError {
  constructor(message = 'Falha na comunicação de rede com serviço externo.', details?: any, context?: Record<string, any>) {
    super(message, 'NETWORK_ERROR', 503, true, details, context);
  }
}

export class DatabaseError extends AppError {
  public readonly dbCode?: string;

  constructor(
    message: string,
    dbCode?: string,
    statusCode = 500,
    details?: any,
    context?: Record<string, any>
  ) {
    let errorCode = 'DATABASE_ERROR';
    let friendlyMessage = message;

    // Categorização específica de erros PostgreSQL e Supabase (PostgREST)
    if (dbCode === '23505') {
      errorCode = 'DATABASE_DUPLICATE_KEY';
      friendlyMessage = 'Já existe um registro cadastrado com estas informações únicas.';
      statusCode = 409; // Conflict
    } else if (dbCode === '23503') {
      errorCode = 'DATABASE_FOREIGN_KEY_VIOLATION';
      friendlyMessage = 'Operação negada por restrição de relacionamento no banco de dados.';
      statusCode = 400; // Bad Request / Constraint
    } else if (dbCode === '23502') {
      errorCode = 'DATABASE_NOT_NULL_VIOLATION';
      friendlyMessage = 'Um ou mais campos obrigatórios não foram preenchidos.';
      statusCode = 400;
    } else if (dbCode === '42P01') {
      errorCode = 'DATABASE_TABLE_NOT_FOUND';
      friendlyMessage = 'Tabela não encontrada no esquema do banco de dados.';
      statusCode = 500;
    } else if (dbCode?.startsWith('PGRST')) {
      errorCode = `DATABASE_${dbCode}`;
      friendlyMessage = `Erro do PostgREST/Supabase: ${message}`;
    }

    super(friendlyMessage, errorCode, statusCode, true, details, context);
    this.dbCode = dbCode;
  }
}

/**
 * Converte qualquer exceção lançada em uma resposta JSON padronizada e registra o log
 */
export function handleApiError(
  error: unknown,
  scope: string,
  defaultContext?: Record<string, any>
): NextResponse<StandardErrorResponse> {
  let appError: AppError;

  if (error instanceof AppError) {
    appError = error;
  } else if (error && typeof error === 'object' && 'code' in (error as any)) {
    // Erros do cliente Supabase / PostgREST
    const sbError = error as any;
    appError = new DatabaseError(
      sbError.message || 'Erro de operação no banco de dados Supabase.',
      sbError.code,
      500,
      sbError,
      defaultContext
    );
  } else if (error instanceof Error) {
    appError = new AppError(
      error.message || 'Ocorreu um erro interno inesperado no servidor.',
      'INTERNAL_SERVER_ERROR',
      500,
      false,
      { name: error.name, stack: error.stack },
      defaultContext
    );
  } else {
    appError = new AppError(
      'Erro desconhecido durante o processamento da requisição.',
      'UNKNOWN_ERROR',
      500,
      false,
      error,
      defaultContext
    );
  }

  // Registrar no utilitário centralizado de logs
  AppLogger.error(scope, appError.message, appError, {
    ...defaultContext,
    ...appError.context,
    code: appError.code,
    statusCode: appError.statusCode,
  });

  const isDevOrTest = process.env.NODE_ENV !== 'production';

  const errorPayload: StandardErrorResponse = {
    success: false,
    error: {
      code: appError.code,
      message: appError.message,
      scope,
      timestamp: new Date().toISOString(),
      ...(isDevOrTest ? { details: appError.details } : {}),
      ...(appError.context ? { context: AppLogger.sanitizeContext(appError.context) } : {}),
    },
  };

  return NextResponse.json(errorPayload, { status: appError.statusCode });
}
