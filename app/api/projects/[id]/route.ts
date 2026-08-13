import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

// DELETE: Excluir projeto do Supabase por ID
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const isNumeric = !isNaN(Number(id));

    const query = supabase.from('projects').delete();
    const { error } = isNumeric
      ? await query.eq('numeric_id', Number(id))
      : await query.eq('id', id);

    if (error) {
      return NextResponse.json(
        { error: 'Erro ao excluir projeto', details: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true, message: 'Projeto excluído com sucesso do Supabase' });
  } catch (err: any) {
    return NextResponse.json(
      { error: 'Erro ao processar exclusão de projeto', details: err.message },
      { status: 500 }
    );
  }
}

// PATCH: Atualizar projeto no Supabase (status concluído, título, descrição, etc.)
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const isNumeric = !isNaN(Number(id));

    const updateData: any = {};
    if (body.completed !== undefined) updateData.completed = body.completed;
    if (body.title !== undefined) updateData.title = body.title;
    if (body.description !== undefined) updateData.description = body.description;
    if (body.requirements !== undefined) updateData.requirements = body.requirements;
    if (body.badges !== undefined) updateData.badges = body.badges;
    if (body.phase !== undefined) updateData.phase_id = Number(body.phase);

    const query = supabase.from('projects').update(updateData);
    const { data, error } = isNumeric
      ? await query.eq('numeric_id', Number(id)).select()
      : await query.eq('id', id).select();

    if (error) {
      return NextResponse.json(
        { error: 'Erro ao atualizar projeto', details: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true, project: data?.[0] });
  } catch (err: any) {
    return NextResponse.json(
      { error: 'Erro ao processar atualização de projeto', details: err.message },
      { status: 500 }
    );
  }
}
