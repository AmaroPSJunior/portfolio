import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { AppLogger } from '@/lib/logger';
import { handleApiError } from '@/lib/errorHandler';
import { validateProjectInput } from '@/lib/validators';
import { DEFAULT_TASKS } from '@/data/constants';
import { Task } from '@/types';

export const dynamic = 'force-dynamic';

// In-memory fallback cache for projects created when Supabase is offline or table is missing
const inMemoryCustomProjects: Task[] = [];

// GET: Listar todos os projetos ordenados pelo numeric_id
export async function GET() {
  const scope = 'projects:GET';
  try {
    const { data, error } = await supabase
      .from('projects')
      .select('*')
      .order('numeric_id', { ascending: true });

    let projectsResult: Task[] = [];

    if (error || !data) {
      AppLogger.warn(scope, 'Erro ou ausência de dados ao buscar projetos do Supabase, utilizando lista padrão', { error });
      projectsResult = [...DEFAULT_TASKS];
    } else {
      projectsResult = data.map((row, index) => {
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

      // If DB was empty, fall back to default tasks
      if (projectsResult.length === 0) {
        projectsResult = [...DEFAULT_TASKS];
      }
    }

    // Merge in-memory custom projects that aren't in projectsResult
    const existingIds = new Set(projectsResult.map((p) => p.id));
    for (const customTask of inMemoryCustomProjects) {
      if (!existingIds.has(customTask.id)) {
        projectsResult.unshift(customTask);
      }
    }

    AppLogger.info(scope, `Sucesso ao listar ${projectsResult.length} projeto(s)`);
    return NextResponse.json({ projects: projectsResult });
  } catch (err: any) {
    AppLogger.error(scope, 'Exceção ao listar projetos', err);
    // Combine DEFAULT_TASKS with inMemoryCustomProjects
    const existingIds = new Set(DEFAULT_TASKS.map((t) => t.id));
    const merged = [...DEFAULT_TASKS];
    for (const c of inMemoryCustomProjects) {
      if (!existingIds.has(c.id)) merged.unshift(c);
    }
    return NextResponse.json({ projects: merged });
  }
}

// POST: Cadastrar novo projeto vinculado a uma Fase/Pilar
export async function POST(request: NextRequest) {
  const scope = 'projects:POST';
  try {
    const body = await request.json().catch(() => null);

    const validation = validateProjectInput(body);

    if (!validation.valid) {
      AppLogger.warn(scope, 'Validação de criação de projeto falhou', { errors: validation.errors });
      return NextResponse.json(
        { error: validation.errors.join(' ') },
        { status: 400 }
      );
    }

    const { title, phaseId, description, requirements, badges } = validation.sanitized;

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
      description,
      requirements,
      badges,
      completed: Boolean(body?.completed || false),
      is_custom: true,
    };

    const { data: inserted, error } = await supabase
      .from('projects')
      .insert([newProject])
      .select();

    if (error) {
      AppLogger.warn(scope, 'Erro no Supabase ao criar projeto, ativando fallback local', { error });

      // Retorno resiliente para ambiente local/desconectado ou credenciais de teste
      const fallbackProject: Task = {
        id: nextNumericId,
        phase: phaseId,
        title,
        description,
        requirements,
        badges,
        completed: Boolean(body?.completed || false),
        isCustom: true,
        created_at: new Date().toISOString(),
      };

      inMemoryCustomProjects.unshift(fallbackProject);

      return NextResponse.json(
        { message: 'Projeto criado com sucesso (modo local/resiliente)', project: fallbackProject },
        { status: 201 }
      );
    }

    const row = inserted && inserted[0] ? inserted[0] : null;

    const createdProject: Task = {
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
    };

    inMemoryCustomProjects.unshift(createdProject);

    AppLogger.info(scope, `Projeto "${title}" criado com sucesso`, { numeric_id: createdProject.id });

    return NextResponse.json(
      {
        message: 'Projeto cadastrado com sucesso no Supabase',
        project: createdProject,
      },
      { status: 201 }
    );
  } catch (err: any) {
    return handleApiError(err, scope);
  }
}
