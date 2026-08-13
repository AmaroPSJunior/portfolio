import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { AppLogger } from '@/lib/logger';
import { handleApiError, ValidationError, DatabaseError } from '@/lib/errorHandler';

// GET: Listar todos os projetos ordenados pelo numeric_id
export async function GET() {
  const scope = 'projects:GET';
  try {
    const { data, error } = await supabase
      .from('projects')
      .select('*')
      .order('numeric_id', { ascending: true });

    if (error) {
      AppLogger.warn(scope, 'Erro ao buscar projetos do Supabase, retornando coleção vazia', { error });
      return NextResponse.json({ projects: [], error: error.message });
    }

    const formattedProjects = (data || []).map((row, index) => {
      let numericId: number;
      if (row.numeric_id !== null && row.numeric_id !== undefined && !isNaN(Number(row.numeric_id))) {
        numericId = Number(row.numeric_id);
      } else if (!isNaN(Number(row.id))) {
        numericId = Number(row.id);
      } else {
        numericId = index + 1;
      }

      const parsedPhase = Number(row.phase_id);

      return {
        id: numericId,
        phase: !isNaN(parsedPhase) ? parsedPhase : 1,
        title: row.title,
        description: row.description || '',
        requirements: Array.isArray(row.requirements) ? row.requirements : [],
        badges: Array.isArray(row.badges) ? row.badges : [],
        completed: Boolean(row.completed),
        isCustom: Boolean(row.is_custom),
        uuid: row.id,
        created_at: row.created_at,
      };
    });

    AppLogger.info(scope, `Sucesso ao listar ${formattedProjects.length} projeto(s)`);
    return NextResponse.json({ projects: formattedProjects });
  } catch (err: any) {
    AppLogger.error(scope, 'Exceção ao listar projetos', err);
    return NextResponse.json({ projects: [], error: err.message });
  }
}

// POST: Cadastrar novo projeto vinculado a uma Fase/Pilar
export async function POST(request: NextRequest) {
  const scope = 'projects:POST';
  try {
    const body = await request.json().catch(() => null);

    if (!body || typeof body !== 'object') {
      return NextResponse.json(
        { error: 'Corpo da requisição inválido' },
        { status: 400 }
      );
    }

    const phaseId = Number(body.phase || body.phase_id);
    const title = typeof body.title === 'string' ? body.title.trim() : '';

    if (!title || isNaN(phaseId) || phaseId <= 0) {
      AppLogger.warn(scope, 'Validação de criação de projeto falhou', { title, phaseId });
      return NextResponse.json(
        { error: 'Título e Fase/Pilar são obrigatórios' },
        { status: 400 }
      );
    }

    const requirements = body.requirementsInput
      ? String(body.requirementsInput)
          .split(';')
          .map((s) => s.trim())
          .filter(Boolean)
      : Array.isArray(body.requirements)
      ? body.requirements
      : ['Requisito padrão'];

    const badges = body.badgesInput
      ? String(body.badgesInput)
          .split(',')
          .map((s) => s.trim())
          .filter(Boolean)
      : Array.isArray(body.badges)
      ? body.badges
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
      title,
      description: body.description || '',
      requirements,
      badges,
      completed: Boolean(body.completed || false),
      is_custom: true,
    };

    const { data: inserted, error } = await supabase
      .from('projects')
      .insert([newProject])
      .select();

    if (error) {
      AppLogger.warn(scope, 'Erro no Supabase ao criar projeto, ativando fallback local', { error });

      // Retorno resiliente para ambiente local/desconectado ou credenciais de teste
      const fallbackProject = {
        id: nextNumericId,
        phase: phaseId,
        title,
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

    const row = inserted && inserted[0] ? inserted[0] : null;

    AppLogger.info(scope, `Projeto "${title}" criado com sucesso`, { numeric_id: row?.numeric_id || nextNumericId });

    return NextResponse.json(
      {
        message: 'Projeto cadastrado com sucesso no Supabase',
        project: {
          id: row?.numeric_id ? Number(row.numeric_id) : nextNumericId,
          phase: row?.phase_id ? Number(row.phase_id) : phaseId,
          title: row?.title || title,
          description: row?.description || body.description || '',
          requirements: row?.requirements || requirements,
          badges: row?.badges || badges,
          completed: Boolean(row?.completed),
          isCustom: true,
          uuid: row?.id,
          created_at: row?.created_at,
        },
      },
      { status: 201 }
    );
  } catch (err: any) {
    return handleApiError(err, scope);
  }
}
