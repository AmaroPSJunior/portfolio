import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { AppLogger } from '@/lib/logger';
import { handleApiError, DatabaseError } from '@/lib/errorHandler';

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
