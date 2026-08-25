import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { AppLogger } from '@/lib/logger';

export const dynamic = 'force-dynamic';

export async function GET() {
  const scope = 'health:GET';
  let dbStatus = 'disconnected';
  let dbLatencyMs = 0;

  const startTime = Date.now();
  try {
    const { count, error } = await supabase.from('fases').select('*', { count: 'exact', head: true });
    dbLatencyMs = Date.now() - startTime;

    if (error) {
      dbStatus = `degraded (${error.message})`;
      AppLogger.warn(scope, 'Checagem de saúde do banco Supabase retornou degradação', { error });
    } else {
      dbStatus = 'healthy';
    }
  } catch (err: any) {
    dbLatencyMs = Date.now() - startTime;
    dbStatus = `error (${err.message})`;
    AppLogger.error(scope, 'Falha ao conectar no Supabase na checagem de saúde', err);
  }

  const recentLogs = AppLogger.getRecentLogs(15);

  return NextResponse.json({
    status: dbStatus === 'healthy' ? 'ok' : 'degraded',
    timestamp: new Date().toISOString(),
    framework: 'Next.js 15 (App Router)',
    environment: process.env.NODE_ENV,
    database: {
      provider: 'Supabase (PostgreSQL)',
      status: dbStatus,
      latencyMs: dbLatencyMs,
    },
    diagnostics: {
      recentErrorCount: recentLogs.filter((l) => l.level === 'ERROR').length,
      recentLogs,
    },
  });
}
