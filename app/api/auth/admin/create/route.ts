import { NextRequest, NextResponse } from 'next/server';
import { AdminService } from '@/lib/adminService';
import { handleApiError } from '@/lib/errorHandler';
import { AppLogger } from '@/lib/logger';

export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  const scope = 'auth:admin:create';
  try {
    const body = await request.json().catch(() => ({}));
    const email = body.email;

    // Determine request origin for email links
    const origin = request.headers.get('origin') || request.headers.get('referer') || 'http://localhost:3000';

    AppLogger.info(scope, `Iniciando criação de convite de Primeiro Acesso para e-mail: ${email}`);

    const result = await AdminService.createAdminInvite(email, origin);

    return NextResponse.json(
      {
        success: true,
        message: 'Convite de primeiro acesso para o administrador criado com sucesso!',
        admin: {
          id: result.admin.id,
          email: result.admin.email,
          first_access: result.admin.first_access,
          expires_at: result.admin.first_access_expires_at,
        },
        token: result.token,
        inviteUrl: result.emailPayload.inviteUrl,
        emailNotification: result.emailPayload,
      },
      { status: 201 }
    );
  } catch (err: any) {
    return handleApiError(err, scope);
  }
}
