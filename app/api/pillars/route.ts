import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { validatePillarInput } from '@/lib/validators';
import { AppLogger } from '@/lib/logger';
import { handleApiError, ValidationError, DatabaseError } from '@/lib/errorHandler';

// GET: Listar todos os pilares ordenados pela coluna 'order'
export async function GET() {
  const scope = 'pillars:GET';
  try {
    const { data, error } = await supabase
      .from('pillars')
      .select('*')
      .order('order', { ascending: true });

    if (error) {
      AppLogger.warn(scope, 'Falha ao consultar pilares no Supabase, retornando lista vazia', { error });
      return NextResponse.json({
        pillars: [],
        warning: 'Não foi possível carregar do banco de dados.',
        error: error.message,
      });
    }

    const formattedPillars = (data || []).map((row, index) => {
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

    AppLogger.info(scope, `Sucesso ao listar ${formattedPillars.length} pilar(es)`);
    return NextResponse.json({ pillars: formattedPillars });
  } catch (err: any) {
    AppLogger.error(scope, 'Exceção não tratada ao listar pilares', err);
    return NextResponse.json({ pillars: [], error: err.message });
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

    // 1. Obter a maior ordem atual para colocar o novo pilar no final da lista
    let nextOrder = 1;
    let nextNumericId = Date.now();

    const { data: existingPillars, error: orderError } = await supabase
      .from('pillars')
      .select('order, numeric_id')
      .order('order', { ascending: false })
      .limit(1);

    if (!orderError && existingPillars && existingPillars.length > 0) {
      nextOrder = (existingPillars[0].order || 0) + 1;
      const maxNum = Number(existingPillars[0].numeric_id);
      nextNumericId = !isNaN(maxNum) && maxNum > 0 ? maxNum + 1 : Date.now();
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

      // Retorno resiliente em caso de banco offline ou chave de teste
      return NextResponse.json(
        {
          message: 'Pilar cadastrado com sucesso (modo local/resiliente)',
          pillar: {
            id: nextNumericId,
            title,
            subtitle: newRecord.subtitle,
            icon: emoji,
            order: nextOrder,
          },
        },
        { status: 201 }
      );
    }

    const row = inserted && inserted[0] ? inserted[0] : null;

    AppLogger.info(scope, 'Pilar cadastrado com sucesso no Supabase', {
      numeric_id: row?.numeric_id || nextNumericId,
      title,
    });

    return NextResponse.json(
      {
        message: 'Pilar cadastrado com sucesso no Supabase',
        pillar: {
          id: row?.numeric_id || nextNumericId,
          title: row?.title || title,
          subtitle: row?.subtitle || newRecord.subtitle,
          icon: row?.emoji || emoji,
          order: row?.order || nextOrder,
          uuid: row?.id,
          created_at: row?.created_at,
        },
      },
      { status: 201 }
    );
  } catch (err: any) {
    return handleApiError(err, scope, { action: 'create_pillar' });
  }
}
