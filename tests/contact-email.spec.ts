import { describe, it, expect } from 'vitest';
import { buildContactEmailPayload } from '../lib/contactEmailService';

describe('Contact email payload', () => {
  it('should include the sender details and the message body in a valid mail payload', () => {
    const payload = buildContactEmailPayload({
      name: 'Carlos Silva',
      email: 'carlos@empresa.com',
      subject: 'Oportunidade de Trabalho',
      message: 'Olá, gostaria de conversar sobre um projeto.',
      recipientEmail: 'arcamos.j@gmail.com',
    });

    expect(payload.to).toBe('arcamos.j@gmail.com');
    expect(payload.subject).toContain('Oportunidade de Trabalho');
    expect(payload.text).toContain('Carlos Silva');
    expect(payload.text).toContain('carlos@empresa.com');
    expect(payload.text).toContain('gostaria de conversar sobre um projeto.');
    expect(payload.html).toContain('Carlos Silva');
    expect(payload.html).toContain('carlos@empresa.com');
  });
});
