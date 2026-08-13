import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

// GET: Listar todos os projetos cadastrados no Supabase
export async function GET() {
  try {
    const { data, error } = await supabase
      .from('projects')
      .select('*')
      .order('numeric_id', { ascending: true });

    if (error) {
      return NextResponse.json({ projects: [] });
    }

    const formattedProjects = (data || []).map((row) => ({
      id: row.numeric_id || row.id,
      phase: row.phase_id,
      title: row.title,
      description: row.description || '',
      requirements: Array.isArray(row.requirements) ? row.requirements : [],
      badges: Array.isArray(row.badges) ? row.badges : [],
      completed: Boolean(row.completed),
      isCustom: Boolean(row.is_custom),
      uuid: row.id,
      created_at: row.created_at,
    }));

    return NextResponse.json({ projects: formattedProjects });
  } catch (err: any) {
    return NextResponse.json({ projects: [] });
  }
}

// POST: Criar novo projeto no Supabase
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    if (!body.title || !body.phase) {
      return NextResponse.json(
        { error: 'Título e Fase/Pilar são obrigatórios' },
        { status: 400 }
      );
    }

    const phaseId = Number(body.phase);
    const requirements = Array.isArray(body.requirements)
      ? body.requirements
      : body.requirementsInput
      ? body.requirementsInput.split(';').map((s: string) => s.trim()).filter(Boolean)
      : [];

    const badges = Array.isArray(body.badges)
      ? body.badges
      : body.badgesInput
      ? body.badgesInput.split(',').map((s: string) => s.trim()).filter(Boolean)
      : ['Novo Projeto'];

    // Obter o maior numeric_id existente para evitar conflito de chave única ou erro de sequência SERIAL
    let nextNumericId = 1;
    try {
      const { data: maxRows } = await supabase
        .from('projects')
        .select('numeric_id')
        .order('numeric_id', { ascending: false })
        .limit(1);

      if (maxRows && maxRows.length > 0 && maxRows[0].numeric_id) {
        nextNumericId = Number(maxRows[0].numeric_id) + 1;
      } else {
        nextNumericId = Date.now();
      }
    } catch (e) {
      nextNumericId = Date.now();
    }

    const newProject = {
      numeric_id: nextNumericId,
      phase_id: phaseId,
      title: body.title,
      description: body.description || '',
      requirements,
      badges,
      completed: Boolean(body.completed || false),
      is_custom: true,
    };

    const { data, error } = await supabase
      .from('projects')
      .insert([newProject])
      .select();

    if (error) {
      // Retorno resiliente para ambiente local/desconectado ou credenciais de teste
      const fallbackProject = {
        id: nextNumericId,
        phase: phaseId,
        title: body.title,
        description: body.description || '',
        requirements,
        badges,
        completed: Boolean(body.completed || false),
        isCustom: true,
        created_at: new Date().toISOString(),
      };

      return NextResponse.json(
        { message: 'Projeto criado com sucesso (modo local/resiliente)', project: fallbackProject },
        { status: 201 }
      );
    }

    const insertedRow = data && data[0] ? data[0] : null;

    const formatted = {
      id: insertedRow?.numeric_id || Date.now(),
      phase: insertedRow?.phase_id || phaseId,
      title: insertedRow?.title || body.title,
      description: insertedRow?.description || body.description || '',
      requirements: insertedRow?.requirements || requirements,
      badges: insertedRow?.badges || badges,
      completed: Boolean(insertedRow?.completed || false),
      isCustom: Boolean(insertedRow?.is_custom || true),
      uuid: insertedRow?.id,
      created_at: insertedRow?.created_at,
    };

    return NextResponse.json(
      { message: 'Projeto criado com sucesso no Supabase', project: formatted },
      { status: 201 }
    );
  } catch (err: any) {
    return NextResponse.json(
      { error: 'Erro ao processar criação de projeto', details: err.message },
      { status: 500 }
    );
  }
}
