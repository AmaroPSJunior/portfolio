import { NextRequest, NextResponse } from 'next/server';
import { buildContactEmailPayload } from '@/lib/contactEmailService';
import { handleApiError } from '@/lib/errorHandler';
import { AppLogger } from '@/lib/logger';

export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  const scope = 'contact:send';

  try {
    const body = await request.json().catch(() => ({}));
    const { name, email, subject, message } = body ?? {};

    if (!name || !email || !message) {
      return NextResponse.json(
        {
          success: false,
          error: 'Nome, e-mail e mensagem são obrigatórios.',
        },
        { status: 400 }
      );
    }

    const recipientEmail = process.env.CONTACT_EMAIL || 'arcamos.j@gmail.com';
    const payload = buildContactEmailPayload({
      name,
      email,
      subject,
      message,
      recipientEmail,
    });

    const smtpHost = process.env.SMTP_HOST;
    const smtpPort = Number(process.env.SMTP_PORT || 587);
    const smtpUser = process.env.SMTP_USER;
    const smtpPassword = process.env.SMTP_PASSWORD;
    const smtpSecure = process.env.SMTP_SECURE === 'true';

    if (!smtpHost || !smtpUser || !smtpPassword) {
      throw new Error('As variáveis de SMTP não foram configuradas. Defina SMTP_HOST, SMTP_USER e SMTP_PASSWORD no .env.local.');
    }

    const nodemailer = await import('nodemailer');
    const transporter = nodemailer.createTransport({
      host: smtpHost,
      port: smtpPort,
      secure: smtpSecure,
      auth: {
        user: smtpUser,
        pass: smtpPassword,
      },
    });

    await transporter.sendMail({
      from: payload.from,
      to: payload.to,
      replyTo: payload.replyTo,
      subject: payload.subject,
      text: payload.text,
      html: payload.html,
    });

    AppLogger.info(scope, 'Mensagem de contato enviada via SMTP', {
      recipientEmail,
      senderEmail: email,
      subject: payload.subject,
    });

    return NextResponse.json({
      success: true,
      message: 'Mensagem enviada com sucesso.',
    });
  } catch (error) {
    return handleApiError(error, scope);
  }
}
