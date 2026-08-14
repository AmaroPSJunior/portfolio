import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { validatePillarInput } from '@/lib/validators';
import { AppLogger } from '@/lib/logger';
import { handleApiError } from '@/lib/errorHandler';
import { PHASES } from '@/data/constants';
import { Phase } from '@/types';

export const dynamic = 'force-dynamic';

// In-memory fallback cache for pillars created when Supabase is offline or table is missing
const inMemoryCustomPillars: Phase[] = [];

// GET: Listar todos os pilares ordenados pela coluna 'order'
export async function GET() {
  const scope = 'pillars:GET';
  try {
    const { data, error } = await supabase
      .from('pillars')
      .select('*')
      .order('order', { ascending: true });

    let pillarsResult: Phase[] = [];

    if (error) {
      AppLogger.warn(scope, 'Falha ao consultar pilares no Supabase', { error });
      const isMissingTable = error.code === 'PGRST205' || error.message?.includes('pillars');
      return NextResponse.json({
        pillars: [],
        tableMissing: isMissingTable,
        warning: isMissingTable
          ? "A tabela 'pillars' não foi encontrada no banco de dados Supabase."
          : 'Não foi possível carregar do banco de dados.',
        error: error.message,
      });
    }

    if (data && data.length > 0) {
      pillarsResult = data.map((row, index) => {
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

    // Merge in-memory custom pillars that aren't in pillarsResult
    const existingIds = new Set(pillarsResult.map((p) => p.id));
    for (const customPillar of inMemoryCustomPillars) {
      if (!existingIds.has(customPillar.id)) {
        pillarsResult.push(customPillar);
      }
    }

    AppLogger.info(scope, `Sucesso ao listar ${pillarsResult.length} pilar(es) do banco`);
    return NextResponse.json({ pillars: pillarsResult });
  } catch (err: any) {
    AppLogger.error(scope, 'Exceção não tratada ao listar pilares', err);
    return NextResponse.json({ pillars: [...inMemoryCustomPillars] });
  }
}

// POST: Cadastrar novo Pilar no Supabase garantindo ordenação ao final
export async function POST(request: NextRequest) {
  const scope = 'pillars:POST';
  try {
    const body = await request.json().catch(() => null);
    const validation = validatePillarInput(body);

    if (!validation.valid) {
      AppLogger.warn(scope, 'Tentativa de cadastro de pilar com dados inválidos', {
        errors: validation.errors,
      });
      return NextResponse.json(
        { error: 'Dados inválidos', details: validation.errors },
        { status: 400 }
      );
    }

    const { title, subtitle, emoji } = validation.sanitized;

    // 1. Obter a maior ordem e id atual para colocar o novo pilar no final da lista
    const memoryMaxOrder = inMemoryCustomPillars.length > 0 ? Math.max(...inMemoryCustomPillars.map((p) => Number(p.order || p.id) || 0)) : 0;
    const memoryMaxId = inMemoryCustomPillars.length > 0 ? Math.max(...inMemoryCustomPillars.map((p) => Number(p.id) || 0)) : 0;

    let nextOrder = memoryMaxOrder + 1;
    let nextNumericId = memoryMaxId + 1;

    try {
      const { data: existingPillars, error: orderError } = await supabase
        .from('pillars')
        .select('order, numeric_id')
        .order('order', { ascending: false })
        .limit(1);

      if (!orderError && existingPillars && existingPillars.length > 0) {
        const dbMaxOrder = Number(existingPillars[0].order) || 0;
        nextOrder = Math.max(dbMaxOrder + 1, memoryMaxOrder + 1);
        const dbMaxId = Number(existingPillars[0].numeric_id);
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
      subtitle: subtitle || `Pilar cadastrado em ${new Date().toLocaleDateString('pt-BR')}`,
      emoji,
      order: nextOrder,
    };

    const { data: inserted, error: insertError } = await supabase
      .from('pillars')
      .insert([newRecord])
      .select();

    if (insertError) {
      AppLogger.warn(
        scope,
        'Erro ao inserir no Supabase, ativando modo resiliente/local',
        { insertError, title }
      );

      const fallbackPillar: Phase = {
        id: nextNumericId,
        title,
        subtitle: newRecord.subtitle,
        icon: emoji,
        order: nextOrder,
      };

      inMemoryCustomPillars.push(fallbackPillar);

      const isMissingTable = insertError.code === 'PGRST205' || insertError.message?.includes('pillars');

      return NextResponse.json(
        {
          message: isMissingTable
            ? "A tabela 'pillars' não foi encontrada no Supabase. O pilar foi salvo localmente temporariamente."
            : 'Pilar cadastrado com sucesso (modo local/resiliente)',
          pillar: fallbackPillar,
          tableMissing: isMissingTable,
          warning: insertError.message,
        },
        { status: 201 }
      );
    }

    const row = inserted && inserted[0] ? inserted[0] : null;

    const createdPillar: Phase = {
      id: row?.numeric_id ? Number(row.numeric_id) : nextNumericId,
      title: row?.title || title,
      subtitle: row?.subtitle || newRecord.subtitle,
      icon: row?.emoji || emoji,
      order: row?.order || nextOrder,
      uuid: row?.id,
      created_at: row?.created_at,
    };

    inMemoryCustomPillars.push(createdPillar);

    AppLogger.info(scope, 'Pilar cadastrado com sucesso no Supabase', {
      numeric_id: createdPillar.id,
      title,
    });

    return NextResponse.json(
      {
        message: 'Pilar cadastrado com sucesso no Supabase',
        pillar: createdPillar,
      },
      { status: 201 }
    );
  } catch (err: any) {
    return handleApiError(err, scope, { action: 'create_pillar' });
  }
}
