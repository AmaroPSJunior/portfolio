import { NextRequest, NextResponse } from 'next/server';
import { AdminService } from '@/lib/adminService';
import { handleApiError } from '@/lib/errorHandler';
import { AppLogger } from '@/lib/logger';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  const scope = 'auth:first-access:validate';
  try {
    const { searchParams } = new URL(request.url);
    const token = searchParams.get('token') || '';

    AppLogger.info(scope, `Validando token de primeiro acesso`, { hasToken: Boolean(token) });

    const result = await AdminService.validateFirstAccessToken(token);

    if (!result.valid) {
      return NextResponse.json(
        {
          success: false,
          valid: false,
          error: result.error || 'Token de primeiro acesso inválido ou expirado.',
        },
        { status: 400 }
      );
    }

    return NextResponse.json({
      success: true,
      valid: true,
      email: result.email,
    });
  } catch (err: any) {
    return handleApiError(err, scope);
  }
}
