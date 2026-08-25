import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { AppLogger } from '@/lib/logger';
import { handleApiError, AppError, DatabaseError } from '@/lib/errorHandler';
import { isValidWorkStatus } from '@/lib/validators';

export const dynamic = 'force-dynamic';

// DELETE: Excluir fase do Supabase por ID (UUID ou numeric_id)
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const scope = 'fases:[id]:DELETE';
  try {
    const { id } = await params;
    const isNumeric = !isNaN(Number(id));

    AppLogger.info(scope, `Excluindo fase ID=${id}`, { isNumeric });

    let phaseNumericId = isNumeric ? Number(id) : undefined;
    if (phaseNumericId === undefined) {
      const { data: phase, error: phaseError } = await supabase
        .from('fases')
        .select('numeric_id')
        .eq('id', id)
        .maybeSingle();

      if (phaseError) {
        throw new DatabaseError(
          phaseError.message || 'Erro ao localizar fase',
          phaseError.code,
          500,
          phaseError,
          { id }
        );
      }

      phaseNumericId = phase?.numeric_id;
    }

    if (phaseNumericId === undefined || Number.isNaN(Number(phaseNumericId))) {
      throw new AppError('Fase não encontrada.', 'NOT_FOUND_ERROR', 404, true, undefined, { id });
    }

    const { data: associatedProjects, error: projectsError } = await supabase
      .from('projects')
      .select('id')
      .eq('phase_id', Number(phaseNumericId));

    if (projectsError) {
      throw new DatabaseError(
        projectsError.message || 'Erro ao verificar projetos associados',
        projectsError.code,
        500,
        projectsError,
        { id, phaseNumericId }
      );
    }

    if (associatedProjects && associatedProjects.length > 0) {
      throw new AppError(
        'Não é possível excluir esta fase porque existem projetos associados a ela.',
        'PHASE_HAS_PROJECTS',
        409,
        true,
        { projectCount: associatedProjects.length },
        { id, phaseNumericId }
      );
    }

    const query = supabase.from('fases').delete();
    const { error } = isNumeric
      ? await query.eq('numeric_id', Number(id))
      : await query.eq('id', id);

    if (error) {
      return handleApiError(
        new DatabaseError(error.message || 'Erro ao excluir fase', error.code, 500, error, { id }),
        scope
      );
    }

    AppLogger.info(scope, `Fase ID=${id} excluída com sucesso`);
    return NextResponse.json({ success: true, message: 'Fase excluída com sucesso do Supabase' });
  } catch (err: any) {
    return handleApiError(err, scope);
  }
}

// PATCH: Atualizar fase no Supabase (título, subtítulo, emoji, etc.)
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const scope = 'fases:[id]:PATCH';
  try {
    const { id } = await params;
    const body = await request.json().catch(() => ({}));
    const isNumeric = !isNaN(Number(id));

    const updateData: any = {};
    if (body.title !== undefined) updateData.title = body.title;
    if (body.subtitle !== undefined) updateData.subtitle = body.subtitle;
    if (body.emoji !== undefined) updateData.emoji = body.emoji;
    if (body.status !== undefined) {
      if (!isValidWorkStatus(body.status)) {
        throw new AppError('Status de fase inválido.', 'VALIDATION_ERROR', 400);
      }
      updateData.status = body.status;
    }
    if (body.statusReason !== undefined) updateData.status_reason = String(body.statusReason).trim();
    if (body.order !== undefined) updateData.order = Number(body.order);

    AppLogger.info(scope, `Atualizando fase ID=${id}`, { updateData });

    const query = supabase.from('fases').update(updateData);
    const { data, error } = isNumeric
      ? await query.eq('numeric_id', Number(id)).select()
      : await query.eq('id', id).select();

    if (error) {
      return handleApiError(
        new DatabaseError('Erro ao atualizar fase', error.code, 500, error, { id, updateData }),
        scope
      );
    }

    AppLogger.info(scope, `Fase ID=${id} atualizada com sucesso`);
    return NextResponse.json({ success: true, phase: data?.[0] });
  } catch (err: any) {
    return handleApiError(err, scope);
  }
}
