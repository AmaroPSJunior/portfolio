import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const isNumeric = !isNaN(Number(id));

    const query = supabase.from('pillars').delete();
    const { error } = isNumeric
      ? await query.eq('numeric_id', Number(id))
      : await query.eq('id', id);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true, message: 'Pilar excluído com sucesso' });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const isNumeric = !isNaN(Number(id));

    const updateData: any = {};
    if (body.title !== undefined) updateData.title = body.title;
    if (body.subtitle !== undefined) updateData.subtitle = body.subtitle;
    if (body.emoji !== undefined) updateData.emoji = body.emoji;
    if (body.icon !== undefined) updateData.emoji = body.icon;
    if (body.order !== undefined) updateData.order = body.order;

    const query = supabase.from('pillars').update(updateData);
    const { data, error } = isNumeric
      ? await query.eq('numeric_id', Number(id)).select()
      : await query.eq('id', id).select();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true, data });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
