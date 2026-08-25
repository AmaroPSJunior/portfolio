import { AppLogger } from './logger';

export interface EmailInvitePayload {
  to: string;
  subject: string;
  inviteUrl: string;
  htmlContent: string;
  textContent: string;
  sentAt: string;
}

export function generateFirstAccessEmail(
  email: string,
  token: string,
  origin: string
): EmailInvitePayload {
  const baseUrl = origin.replace(/\/$/, '');
  const inviteUrl = `${baseUrl}/primeiro-acesso?token=${token}`;
  const sentAt = new Date().toISOString();

  const subject = '🔐 Seu Acesso Administrativo - Definição de Senha';

  const textContent = `
Olá, Administrador!

Você foi cadastrado como novo administrador no Painel de Controle.
Para definir sua senha de acesso e ativar sua conta, utilize o link exclusivo abaixo:

${inviteUrl}

Atenção: Este link é de uso único e expira em 24 horas.
Se você não solicitou este acesso, favor ignorar este e-mail.
  `.trim();

  const htmlContent = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 24px; background-color: #0f172a; border-radius: 12px; color: #f8fafc; border: 1px solid #1e293b;">
      <h2 style="color: #38bdf8; margin-top: 0;">🔐 Primeiro Acesso Administrativo</h2>
      <p style="color: #cbd5e1; font-size: 14px; line-height: 1.6;">
        Olá, <strong>${email}</strong>!
      </p>
      <p style="color: #cbd5e1; font-size: 14px; line-height: 1.6;">
        Sua conta de Administrador foi criada com sucesso. Para começar a gerenciar o sistema, clique no botão abaixo para definir sua senha de acesso com segurança:
      </p>
      <div style="text-align: center; margin: 30px 0;">
        <a href="${inviteUrl}" style="background-color: #0284c7; color: #ffffff; padding: 14px 28px; text-decoration: none; border-radius: 8px; font-weight: bold; font-size: 14px; display: inline-block;">
          Definir Minha Senha de Acesso
        </a>
      </div>
      <p style="color: #94a3b8; font-size: 12px; line-height: 1.5;">
        Ou copie e cole este link em seu navegador:<br/>
        <a href="${inviteUrl}" style="color: #38bdf8; word-break: break-all;">${inviteUrl}</a>
      </p>
      <hr style="border: 0; border-top: 1px solid #1e293b; margin: 24px 0;" />
      <p style="color: #64748b; font-size: 11px; text-align: center;">
        Este link é de uso único e válido por 24 horas. Se você não solicitou este acesso, desconsidere esta mensagem.
      </p>
    </div>
  `.trim();

  const payload: EmailInvitePayload = {
    to: email,
    subject,
    inviteUrl,
    htmlContent,
    textContent,
    sentAt,
  };

  AppLogger.info('emailService:sendFirstAccessInvite', `E-mail de convite preparado para ${email}`, {
    to: email,
    inviteUrl,
  });

  return payload;
}
