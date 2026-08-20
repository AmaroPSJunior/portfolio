import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { AppLogger } from '@/lib/logger';
import { handleApiError, AppError } from '@/lib/errorHandler';

export const dynamic = 'force-dynamic';

const DEFAULT_CONFIGS: Record<string, { title: string; subtitle: string }> = {
  roadmap: {
    title: 'Projetos, Ideias e Testes em Evolução',
    subtitle:
      'Acompanhamento sanfonado de soluções completas, provas de conceito e próximos entregáveis. Clique sobre os Cards de Projeto na grade para expandir requisitos detalhados e links.',
  },
};

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const pageKey = searchParams.get('page') || 'roadmap';

    const { data, error } = await supabase
      .from('site_config')
      .select('*')
      .eq('page_key', pageKey)
      .maybeSingle();

    if (error) {
      if (error.code === 'PGRST205' || error.message?.includes('does not exist')) {
        AppLogger.warn('config:GET', `Tabela site_config não encontrada no Supabase: ${error.message}`);
        const defaultConfig = DEFAULT_CONFIGS[pageKey] || DEFAULT_CONFIGS.roadmap;
        return NextResponse.json({
          tableMissing: true,
          config: {
            page_key: pageKey,
            ...defaultConfig,
          },
        });
      }
      AppLogger.warn('config:GET', `Erro ao buscar configuracoes do banco: ${error.message}`);
    }

    if (data) {
      return NextResponse.json({ config: data });
    }

    const defaultConfig = DEFAULT_CONFIGS[pageKey] || DEFAULT_CONFIGS.roadmap;
    return NextResponse.json({
      config: {
        page_key: pageKey,
        ...defaultConfig,
      },
    });
  } catch (err: any) {
    return handleApiError(err, 'config:GET');
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}));
    const pageKey = body.page_key || 'roadmap';
    const title = body.title?.trim();
    const subtitle = body.subtitle?.trim();

    if (!title) {
      throw new AppError('O título principal é obrigatório', 'VALIDATION_ERROR', 400);
    }
    if (!subtitle) {
      throw new AppError('A descrição/subtítulo é obrigatória', 'VALIDATION_ERROR', 400);
    }

    const { data, error } = await supabase
      .from('site_config')
      .upsert(
        {
          page_key: pageKey,
          title,
          subtitle,
          updated_at: new Date().toISOString(),
        },
        { onConflict: 'page_key' }
      )
      .select()
      .single();

    if (error) {
      AppLogger.error('config:POST', 'Erro ao salvar configuracao no Supabase', error);
      throw new AppError(
        `Erro ao salvar no banco: ${error.message}`,
        'DATABASE_ERROR',
        500
      );
    }

    AppLogger.info('config:POST', `Configuracao da pagina '${pageKey}' atualizada com sucesso`);
    return NextResponse.json({ config: data, success: true });
  } catch (err: any) {
    return handleApiError(err, 'config:POST');
  }
}
