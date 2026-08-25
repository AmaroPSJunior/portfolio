import { NextRequest, NextResponse } from 'next/server';
import { AdminService } from '@/lib/adminService';
import { handleApiError } from '@/lib/errorHandler';
import { AppLogger } from '@/lib/logger';

export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  const scope = 'auth:first-access:set-password';
  try {
    const body = await request.json().catch(() => ({}));
    const { token, password, confirmPassword } = body;

    AppLogger.info(scope, `Processando requisição de definição de senha com token de primeiro acesso`);

    if (!token) {
      return NextResponse.json(
        {
          success: false,
          error: 'Token de primeiro acesso é obrigatório.',
        },
        { status: 400 }
      );
    }

    const result = await AdminService.setAdminPasswordWithToken(token, password, confirmPassword);

    return NextResponse.json({
      success: true,
      email: result.email,
      message: result.message,
    });
  } catch (err: any) {
    return handleApiError(err, scope);
  }
}
