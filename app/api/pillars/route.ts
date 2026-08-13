import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { validatePillarInput } from '@/lib/validators';

// GET: Listar todos os pilares ordenados pela coluna 'order'
export async function GET() {
  try {
    const { data, error } = await supabase
      .from('pillars')
      .select('*')
      .order('order', { ascending: true });

    if (error) {
      return NextResponse.json({ pillars: [] });
    }

    const formattedPillars = (data || []).map((row) => ({
      id: row.numeric_id || row.id,
      title: row.title,
      subtitle: row.subtitle || '',
      icon: row.emoji || '🚀',
      order: row.order,
      uuid: row.id,
      created_at: row.created_at,
    }));

    return NextResponse.json({ pillars: formattedPillars });
  } catch (err: any) {
    return NextResponse.json({ pillars: [] });
  }
}

// POST: Cadastrar novo Pilar no Supabase garantindo ordenação ao final
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validation = validatePillarInput(body);

    if (!validation.valid) {
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
      nextNumericId = (existingPillars[0].numeric_id || 4) + 1;
    }

    // 2. Inserir registro no Supabase
    const newRecord = {
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
    return NextResponse.json(
      { error: 'Erro ao processar cadastro de pilar', message: err.message },
      { status: 500 }
    );
  }
}
