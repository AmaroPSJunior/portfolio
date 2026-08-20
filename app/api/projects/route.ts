import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { AppLogger } from '@/lib/logger';
import { handleApiError } from '@/lib/errorHandler';
import { validateProjectInput } from '@/lib/validators';
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

    if (error) {
      AppLogger.warn(scope, 'Erro ao buscar projetos do Supabase', { error });
      const isMissingTable = error.code === 'PGRST205' || error.message?.includes('projects');
      return NextResponse.json({
        projects: [],
        tableMissing: isMissingTable,
        warning: isMissingTable
          ? "A tabela 'projects' não foi encontrada no banco de dados Supabase."
          : 'Não foi possível carregar do banco de dados.',
        error: error.message,
      });
    }

    if (data && data.length > 0) {
      projectsResult = data.map((row: any, index: number) => {
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
    }

    // Merge in-memory custom projects that aren't in projectsResult
    const existingIds = new Set(projectsResult.map((p) => p.id));
    for (const customTask of inMemoryCustomProjects) {
      if (!existingIds.has(customTask.id)) {
        projectsResult.unshift(customTask);
      }
    }

    AppLogger.info(scope, `Sucesso ao listar ${projectsResult.length} projeto(s) do banco`);
    return NextResponse.json({ projects: projectsResult });
  } catch (err: any) {
    AppLogger.error(scope, 'Exceção ao listar projetos', err);
    return NextResponse.json({ projects: [...inMemoryCustomProjects] });
  }
}

// POST: Cadastrar novo projeto vinculado a uma Fase
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

    // Obter o maior numeric_id existente para evitar conflito
    const memoryMaxId = inMemoryCustomProjects.length > 0 ? Math.max(...inMemoryCustomProjects.map((t) => Number(t.id) || 0)) : 0;

    let nextNumericId = memoryMaxId + 1;
    try {
      const { data: maxRows } = await supabase
        .from('projects')
        .select('numeric_id')
        .order('numeric_id', { ascending: false })
        .limit(1);

      if (maxRows && maxRows.length > 0 && maxRows[0].numeric_id && !isNaN(Number(maxRows[0].numeric_id))) {
        const dbMax = Number(maxRows[0].numeric_id);
        nextNumericId = Math.max(dbMax + 1, memoryMaxId + 1);
      }
    } catch (e) {
      // Usar sequencial local
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

      const isMissingTable = error.code === 'PGRST205' || error.message?.includes('projects');

      return NextResponse.json(
        {
          message: isMissingTable
            ? "A tabela 'projects' não foi encontrada no Supabase. O projeto foi salvo localmente temporariamente."
            : 'Projeto criado com sucesso (modo local/resiliente)',
          project: fallbackProject,
          tableMissing: isMissingTable,
          warning: error.message,
        },
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
