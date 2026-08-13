import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { AppLogger } from '@/lib/logger';
import { handleApiError, DatabaseError } from '@/lib/errorHandler';

export const dynamic = 'force-dynamic';

// DELETE: Excluir projeto do Supabase por ID
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const scope = 'projects:[id]:DELETE';
  try {
    const { id } = await params;
    const isNumeric = !isNaN(Number(id));

    AppLogger.info(scope, `Excluindo projeto ID=${id}`, { isNumeric });

    const query = supabase.from('projects').delete();
    const { error } = isNumeric
      ? await query.eq('numeric_id', Number(id))
      : await query.eq('id', id);

    if (error) {
      return handleApiError(
        new DatabaseError('Erro ao excluir projeto', error.code, 500, error, { id }),
        scope
      );
    }

    AppLogger.info(scope, `Projeto ID=${id} excluído com sucesso`);
    return NextResponse.json({ success: true, message: 'Projeto excluído com sucesso do Supabase' });
  } catch (err: any) {
    return handleApiError(err, scope);
  }
}

// PATCH: Atualizar projeto no Supabase (status concluído, título, descrição, etc.)
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const scope = 'projects:[id]:PATCH';
  try {
    const { id } = await params;
    const body = await request.json().catch(() => ({}));
    const isNumeric = !isNaN(Number(id));

    const updateData: any = {};
    if (body.completed !== undefined) updateData.completed = body.completed;
    if (body.title !== undefined) updateData.title = body.title;
    if (body.description !== undefined) updateData.description = body.description;
    if (body.requirements !== undefined) updateData.requirements = body.requirements;
    if (body.badges !== undefined) updateData.badges = body.badges;
    if (body.phase !== undefined) updateData.phase_id = Number(body.phase);

    AppLogger.info(scope, `Atualizando projeto ID=${id}`, { updateData });

    const query = supabase.from('projects').update(updateData);
    const { data, error } = isNumeric
      ? await query.eq('numeric_id', Number(id)).select()
      : await query.eq('id', id).select();

    if (error) {
      return handleApiError(
        new DatabaseError('Erro ao atualizar projeto', error.code, 500, error, { id, updateData }),
        scope
      );
    }

    AppLogger.info(scope, `Projeto ID=${id} atualizado com sucesso`);
    return NextResponse.json({ success: true, project: data?.[0] });
  } catch (err: any) {
    return handleApiError(err, scope);
  }
}
