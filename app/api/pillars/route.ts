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
      AppLogger.warn(scope, 'Falha ao consultar pilares no Supabase, retornando lista vazia', { error });
      return NextResponse.json({
        pillars: [],
        warning: 'Não foi possível carregar do banco de dados.',
        error: error.message,
      });
    }

    if (!data) {
      pillarsResult = [...PHASES];
    } else {
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

      if (pillarsResult.length === 0) {
        pillarsResult = [...PHASES];
      }
    }

    // Merge in-memory custom pillars that aren't in pillarsResult
    const existingIds = new Set(pillarsResult.map((p) => p.id));
    for (const customPillar of inMemoryCustomPillars) {
      if (!existingIds.has(customPillar.id)) {
        pillarsResult.push(customPillar);
      }
    }

    AppLogger.info(scope, `Sucesso ao listar ${pillarsResult.length} pilar(es)`);
    return NextResponse.json({ pillars: pillarsResult });
  } catch (err: any) {
    AppLogger.error(scope, 'Exceção não tratada ao listar pilares', err);
    const existingIds = new Set(PHASES.map((p) => p.id));
    const merged = [...PHASES];
    for (const c of inMemoryCustomPillars) {
      if (!existingIds.has(c.id)) merged.push(c);
    }
    return NextResponse.json({ pillars: merged });
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
    const defaultMaxOrder = Math.max(...PHASES.map((p) => Number(p.order || p.id) || 0), 0);
    const memoryMaxOrder = inMemoryCustomPillars.length > 0 ? Math.max(...inMemoryCustomPillars.map((p) => Number(p.order || p.id) || 0)) : 0;
    const baseOrder = Math.max(defaultMaxOrder, memoryMaxOrder);

    const defaultMaxId = Math.max(...PHASES.map((p) => Number(p.id) || 0), 0);
    const memoryMaxId = inMemoryCustomPillars.length > 0 ? Math.max(...inMemoryCustomPillars.map((p) => Number(p.id) || 0)) : 0;
    const baseId = Math.max(defaultMaxId, memoryMaxId);

    let nextOrder = baseOrder + 1;
    let nextNumericId = baseId + 1;

    try {
      const { data: existingPillars, error: orderError } = await supabase
        .from('pillars')
        .select('order, numeric_id')
        .order('order', { ascending: false })
        .limit(1);

      if (!orderError && existingPillars && existingPillars.length > 0) {
        nextOrder = Math.max((existingPillars[0].order || 0) + 1, baseOrder + 1);
        const maxNum = Number(existingPillars[0].numeric_id);
        nextNumericId = !isNaN(maxNum) && maxNum > 0 ? Math.max(maxNum + 1, baseId + 1) : baseId + 1;
      }
    } catch (e) {
      nextOrder = baseOrder + 1;
      nextNumericId = baseId + 1;
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

      return NextResponse.json(
        {
          message: 'Pilar cadastrado com sucesso (modo local/resiliente)',
          pillar: fallbackPillar,
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
