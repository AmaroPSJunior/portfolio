import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { AppLogger } from '@/lib/logger';
import { handleApiError, DatabaseError } from '@/lib/errorHandler';

export const dynamic = 'force-dynamic';

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const scope = 'pillars:[id]:DELETE';
  try {
    const { id } = await params;
    const isNumeric = !isNaN(Number(id));

    AppLogger.info(scope, `Iniciando exclusão de pilar ID=${id}`, { isNumeric });

    const query = supabase.from('pillars').delete();
    const { error } = isNumeric
      ? await query.eq('numeric_id', Number(id))
      : await query.eq('id', id);

    if (error) {
      return handleApiError(
        new DatabaseError(error.message, error.code, 500, error, { id }),
        scope
      );
    }

    AppLogger.info(scope, `Pilar ID=${id} excluído com sucesso`);
    return NextResponse.json({ success: true, message: 'Pilar excluído com sucesso' });
  } catch (err: any) {
    return handleApiError(err, scope);
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const scope = 'pillars:[id]:PATCH';
  try {
    const { id } = await params;
    const body = await request.json().catch(() => ({}));
    const isNumeric = !isNaN(Number(id));

    const updateData: any = {};
    if (body.title !== undefined) updateData.title = body.title;
    if (body.subtitle !== undefined) updateData.subtitle = body.subtitle;
    if (body.emoji !== undefined) updateData.emoji = body.emoji;
    if (body.icon !== undefined) updateData.emoji = body.icon;
    if (body.order !== undefined) updateData.order = body.order;

    AppLogger.info(scope, `Atualizando pilar ID=${id}`, { updateData });

    const query = supabase.from('pillars').update(updateData);
    const { data, error } = isNumeric
      ? await query.eq('numeric_id', Number(id)).select()
      : await query.eq('id', id).select();

    if (error) {
      return handleApiError(
        new DatabaseError(error.message, error.code, 500, error, { id, updateData }),
        scope
      );
    }

    AppLogger.info(scope, `Pilar ID=${id} atualizado com sucesso`);
    return NextResponse.json({ success: true, data });
  } catch (err: any) {
    return handleApiError(err, scope);
  }
}
