export interface ContactEmailPayload {
  to: string;
  from: string;
  replyTo: string;
  subject: string;
  text: string;
  html: string;
}

export interface ContactEmailInput {
  name: string;
  email: string;
  subject: string;
  message: string;
  recipientEmail: string;
}

export function buildContactEmailPayload({
  name,
  email,
  subject,
  message,
  recipientEmail,
}: ContactEmailInput): ContactEmailPayload {
  const safeName = (name || 'Visitante').trim();
  const safeEmail = (email || '').trim();
  const safeSubject = (subject || 'Contato via portfólio').trim();
  const safeMessage = (message || '').trim();

  const finalSubject = safeSubject ? `Portfolio: ${safeSubject}` : 'Portfolio: Novo contato';

  const text = [
    'Nova mensagem recebida pelo portfólio.',
    '',
    `Nome: ${safeName}`,
    `E-mail: ${safeEmail}`,
    `Assunto: ${safeSubject}`,
    '',
    'Mensagem:',
    safeMessage,
    '',
    '---',
    'Enviado automaticamente pelo formulário de contato do portfólio.',
  ].join('\n');

  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 640px; margin: 0 auto; background: #0f172a; color: #e2e8f0; padding: 24px; border-radius: 12px; border: 1px solid #1e293b;">
      <h2 style="margin-top: 0; color: #67e8f9;">Nova mensagem do portfólio</h2>
      <p><strong>Nome:</strong> ${safeName}</p>
      <p><strong>E-mail:</strong> ${safeEmail}</p>
      <p><strong>Assunto:</strong> ${safeSubject}</p>
      <div style="margin-top: 16px; padding: 16px; background: #111827; border-radius: 8px; border: 1px solid #334155; line-height: 1.6;">
        ${safeMessage.replace(/\n/g, '<br />')}
      </div>
      <p style="margin-top: 16px; color: #94a3b8; font-size: 12px;">
        Enviado automaticamente pelo formulário de contato do portfólio.
      </p>
    </div>
  `;

  return {
    to: recipientEmail,
    from: `Portfolio Contact <${recipientEmail}>`,
    replyTo: safeEmail,
    subject: finalSubject,
    text,
    html,
  };
}
