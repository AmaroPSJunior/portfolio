export type LogLevel = 'INFO' | 'WARN' | 'ERROR';

export interface LogEntry {
  id: string;
  timestamp: string;
  level: LogLevel;
  scope: string;
  message: string;
  code?: string;
  details?: any;
  context?: Record<string, any>;
}

// Subconjunto de chaves sensíveis que devem ser mascaradas nos logs
const SENSITIVE_KEYS = [
  'token',
  'password',
  'secret',
  'key',
  'authorization',
  'anon_key',
  'supabase_key',
  'apikey',
  'jwt',
];

export class AppLogger {
  private static maxBufferLogs = 50;
  private static logBuffer: LogEntry[] = [];

  /**
   * Sanitiza objetos de contexto para prevenir exposição de dados sensíveis nos logs
   */
  public static sanitizeContext(context?: Record<string, any>): Record<string, any> | undefined {
    if (!context || typeof context !== 'object') return context;

    try {
      const sanitized: Record<string, any> = {};
      for (const [key, value] of Object.entries(context)) {
        const lowerKey = key.toLowerCase();
        if (SENSITIVE_KEYS.some((sk) => lowerKey.includes(sk))) {
          sanitized[key] = '[REDACTED]';
        } else if (typeof value === 'object' && value !== null) {
          sanitized[key] = Array.isArray(value)
            ? value.map((item) => (typeof item === 'object' ? this.sanitizeContext(item) : item))
            : this.sanitizeContext(value);
        } else {
          sanitized[key] = value;
        }
      }
      return sanitized;
    } catch {
      return { _sanitizationError: 'Falha ao sanitizar contexto de log' };
    }
  }

  private static pushLog(entry: LogEntry): void {
    this.logBuffer.unshift(entry);
    if (this.logBuffer.length > this.maxBufferLogs) {
      this.logBuffer.pop();
    }
  }

  public static info(scope: string, message: string, context?: Record<string, any>): LogEntry {
    const entry: LogEntry = {
      id: `log-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
      timestamp: new Date().toISOString(),
      level: 'INFO',
      scope,
      message,
      context: this.sanitizeContext(context),
    };

    this.pushLog(entry);
    if (process.env.NODE_ENV !== 'test') {
      console.log(`[INFO] [${entry.scope}] ${entry.message}`, entry.context || '');
    }
    return entry;
  }

  public static warn(scope: string, message: string, context?: Record<string, any>): LogEntry {
    const entry: LogEntry = {
      id: `log-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
      timestamp: new Date().toISOString(),
      level: 'WARN',
      scope,
      message,
      context: this.sanitizeContext(context),
    };

    this.pushLog(entry);
    if (process.env.NODE_ENV !== 'test') {
      console.warn(`[WARN] [${entry.scope}] ${entry.message}`, entry.context || '');
    }
    return entry;
  }

  public static error(
    scope: string,
    message: string,
    error?: unknown,
    context?: Record<string, any>
  ): LogEntry {
    let details: any = undefined;
    let code = 'INTERNAL_ERROR';

    if (error && typeof error === 'object') {
      const errObj = error as any;
      code = errObj.code || errObj.name || code;
      details = {
        name: errObj.name || 'Error',
        message: errObj.message || String(error),
        code: errObj.code,
        stack: process.env.NODE_ENV !== 'production' ? errObj.stack : undefined,
      };
    } else if (error) {
      details = String(error);
    }

    const entry: LogEntry = {
      id: `log-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
      timestamp: new Date().toISOString(),
      level: 'ERROR',
      scope,
      message,
      code,
      details,
      context: this.sanitizeContext(context),
    };

    this.pushLog(entry);
    if (process.env.NODE_ENV !== 'test') {
      console.error(
        `[ERROR] [${entry.scope}] ${entry.message} (Code: ${entry.code})`,
        entry.details || '',
        entry.context || ''
      );
    }
    return entry;
  }

  public static getRecentLogs(limit = 50, levelFilter?: LogLevel): LogEntry[] {
    if (!levelFilter) {
      return this.logBuffer.slice(0, limit);
    }
    return this.logBuffer.filter((l) => l.level === levelFilter).slice(0, limit);
  }

  public static clearLogs(): void {
    this.logBuffer = [];
  }
}
