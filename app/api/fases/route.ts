import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { validatePhaseInput } from '@/lib/validators';
import { AppLogger } from '@/lib/logger';
import { handleApiError } from '@/lib/errorHandler';
import { Phase } from '@/types';

export const dynamic = 'force-dynamic';

// In-memory fallback cache for phases created when Supabase is offline or table is missing
const inMemoryCustomPhases: Phase[] = [];

// GET: Listar todas as fases ordenadas pela coluna 'order'
export async function GET() {
  const scope = 'fases:GET';
  try {
    const { data, error } = await supabase
      .from('fases')
      .select('*')
      .order('order', { ascending: true });

    let phasesResult: Phase[] = [];

    if (error) {
      AppLogger.warn(scope, 'Falha ao consultar fases no Supabase', { error });
      const isMissingTable = error.code === 'PGRST205' || error.message?.includes('fases');
      return NextResponse.json({
        phases: [],
        tableMissing: isMissingTable,
        warning: isMissingTable
          ? "A tabela 'fases' não foi encontrada no banco de dados Supabase."
          : 'Não foi possível carregar do banco de dados.',
        error: error.message,
      });
    }

    if (data && data.length > 0) {
      phasesResult = data.map((row: any, index: number) => {
        let numericId: number;
        if (row.numeric_id !== null && row.numeric_id !== undefined && !isNaN(Number(row.numeric_id))) {
          numericId = Number(row.numeric_id);
        } else if (!isNaN(Number(row.id))) {
          numericId = Number(row.id);
        } else {
          numericId = index + 1;
        }

        return {
          id: numericId,
          title: row.title,
          subtitle: row.subtitle || '',
          icon: row.emoji || '🚀',
          order: row.order ?? (index + 1),
          uuid: row.id,
          created_at: row.created_at,
        };
      });
    }

    // Merge in-memory custom phases that aren't in phasesResult
    const existingIds = new Set(phasesResult.map((p) => p.id));
    for (const customPhase of inMemoryCustomPhases) {
      if (!existingIds.has(customPhase.id)) {
        phasesResult.push(customPhase);
      }
    }

    AppLogger.info(scope, `Sucesso ao listar ${phasesResult.length} fase(s) do banco`);
    return NextResponse.json({ phases: phasesResult });
  } catch (err: any) {
    AppLogger.error(scope, 'Exceção não tratada ao listar fases', err);
    return NextResponse.json({ phases: [...inMemoryCustomPhases] });
  }
}

// POST: Cadastrar nova Fase no Supabase garantindo ordenação ao final
export async function POST(request: NextRequest) {
  const scope = 'fases:POST';
  try {
    const body = await request.json().catch(() => null);
    const validation = validatePhaseInput(body);

    if (!validation.valid) {
      AppLogger.warn(scope, 'Tentativa de cadastro de fase com dados inválidos', {
        errors: validation.errors,
      });
      return NextResponse.json(
        { error: 'Dados inválidos', details: validation.errors },
        { status: 400 }
      );
    }

    const { title, subtitle, emoji } = validation.sanitized;

    // 1. Obter a maior ordem e id atual para colocar a nova fase no final da lista
    const memoryMaxOrder = inMemoryCustomPhases.length > 0 ? Math.max(...inMemoryCustomPhases.map((p) => Number(p.order || p.id) || 0)) : 0;
    const memoryMaxId = inMemoryCustomPhases.length > 0 ? Math.max(...inMemoryCustomPhases.map((p) => Number(p.id) || 0)) : 0;

    let nextOrder = memoryMaxOrder + 1;
    let nextNumericId = memoryMaxId + 1;

    try {
      const { data: existingPhases, error: orderError } = await supabase
        .from('fases')
        .select('order, numeric_id')
        .order('order', { ascending: false })
        .limit(1);

      if (!orderError && existingPhases && existingPhases.length > 0) {
        const dbMaxOrder = Number(existingPhases[0].order) || 0;
        nextOrder = Math.max(dbMaxOrder + 1, memoryMaxOrder + 1);
        const dbMaxId = Number(existingPhases[0].numeric_id);
        if (!isNaN(dbMaxId) && dbMaxId > 0) {
          nextNumericId = Math.max(dbMaxId + 1, memoryMaxId + 1);
        }
      }
    } catch (e) {
      // Usar sequencial local
    }

    // 2. Inserir registro no Supabase incluindo numeric_id
    const newRecord = {
      numeric_id: nextNumericId,
      title,
      subtitle: subtitle || `Fase cadastrada em ${new Date().toLocaleDateString('pt-BR')}`,
      emoji,
      order: nextOrder,
    };

    const { data: inserted, error: insertError } = await supabase
      .from('fases')
      .insert([newRecord])
      .select();

    if (insertError) {
      AppLogger.warn(
        scope,
        'Erro ao inserir no Supabase, ativando modo resiliente/local',
        { insertError, title }
      );

      const fallbackPhase: Phase = {
        id: nextNumericId,
        title,
        subtitle: newRecord.subtitle,
        icon: emoji,
        order: nextOrder,
      };

      inMemoryCustomPhases.push(fallbackPhase);

      const isMissingTable = insertError.code === 'PGRST205' || insertError.message?.includes('fases');

      return NextResponse.json(
        {
          message: isMissingTable
            ? "A tabela 'fases' não foi encontrada no Supabase. A fase foi salva localmente temporariamente."
            : 'Fase cadastrada com sucesso (modo local/resiliente)',
          phase: fallbackPhase,
          tableMissing: isMissingTable,
          warning: insertError.message,
        },
        { status: 201 }
      );
    }

    const row = inserted && inserted[0] ? inserted[0] : null;

    const createdPhase: Phase = {
      id: row?.numeric_id ? Number(row.numeric_id) : nextNumericId,
      title: row?.title || title,
      subtitle: row?.subtitle || newRecord.subtitle,
      icon: row?.emoji || emoji,
      order: row?.order || nextOrder,
      uuid: row?.id,
      created_at: row?.created_at,
    };

    inMemoryCustomPhases.push(createdPhase);

    AppLogger.info(scope, 'Fase cadastrada com sucesso no Supabase', {
      numeric_id: createdPhase.id,
      title,
    });

    return NextResponse.json(
      {
        message: 'Fase cadastrada com sucesso no Supabase',
        phase: createdPhase,
      },
      { status: 201 }
    );
  } catch (err: any) {
    return handleApiError(err, scope, { action: 'create_phase' });
  }
}
