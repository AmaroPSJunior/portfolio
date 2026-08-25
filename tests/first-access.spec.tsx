import { describe, it, expect, beforeEach } from 'vitest';
import {
  validatePasswordComplexity,
  hashPassword,
  verifyPassword,
  generateFirstAccessToken,
} from '../lib/password';
import { generateFirstAccessEmail } from '../lib/emailService';
import { AdminService } from '../lib/adminService';
import { ValidationError, AuthError } from '../lib/errorHandler';

describe('Suíte de Testes - Fluxo de Primeiro Acesso e Criação de Senha de Admin', () => {
  beforeEach(() => {
    AdminService.clearInMemoryStore();
  });

  describe('1. Validação de Complexidade de Senha & Hash de Segurança', () => {
    it('deve rejeitar senhas fracas ou que não atendam aos requisitos mínimos de segurança', () => {
      // Senha menor que 8 caracteres
      const shortRes = validatePasswordComplexity('Ab1!');
      expect(shortRes.valid).toBe(false);
      expect(shortRes.checks.length).toBe(false);

      // Sem letra maiúscula
      const noUpper = validatePasswordComplexity('senha123!');
      expect(noUpper.valid).toBe(false);
      expect(noUpper.checks.uppercase).toBe(false);

      // Sem letra minúscula
      const noLower = validatePasswordComplexity('SENHA123!');
      expect(noLower.valid).toBe(false);
      expect(noLower.checks.lowercase).toBe(false);

      // Sem número
      const noNumber = validatePasswordComplexity('SenhaEspecial!');
      expect(noNumber.valid).toBe(false);
      expect(noNumber.checks.number).toBe(false);

      // Sem caractere especial
      const noSpecial = validatePasswordComplexity('SenhaComNumero123');
      expect(noSpecial.valid).toBe(false);
      expect(noSpecial.checks.special).toBe(false);
    });

    it('deve aprovar senhas fortes que atendam a todos os 5 critérios de segurança', () => {
      const result = validatePasswordComplexity('Admin@2026Secure!');
      expect(result.valid).toBe(true);
      expect(result.errors).toHaveLength(0);
      expect(result.checks.length).toBe(true);
      expect(result.checks.uppercase).toBe(true);
      expect(result.checks.lowercase).toBe(true);
      expect(result.checks.number).toBe(true);
      expect(result.checks.special).toBe(true);
    });

    it('deve gerar hash seguro com sal e verificar a correspondência da senha', () => {
      const plainPassword = 'SenhaSuperSegura#2026';
      const hash = hashPassword(plainPassword);

      expect(hash).toContain(':');
      expect(verifyPassword(plainPassword, hash)).toBe(true);
      expect(verifyPassword('SenhaIncorreta#2026', hash)).toBe(false);
    });
  });

  describe('2. Modelo de Dados de Admin & Geração de Token de Primeiro Acesso', () => {
    it('deve gerar token criptograficamente seguro e com expiração em 24h', () => {
      const { token, expiresAt } = generateFirstAccessToken();

      expect(token).toBeDefined();
      expect(token.length).toBeGreaterThanOrEqual(32);

      const hoursDiff = (expiresAt.getTime() - Date.now()) / (1000 * 60 * 60);
      expect(hoursDiff).toBeGreaterThan(23);
      expect(hoursDiff).toBeLessThanOrEqual(24);
    });

    it('deve criar um convite de novo admin com first_access = true e gerar e-mail com link exclusivo', async () => {
      const email = 'novo.admin@empresa.com';
      const origin = 'http://localhost:3000';

      const result = await AdminService.createAdminInvite(email, origin);

      expect(result.admin.email).toBe(email);
      expect(result.admin.first_access).toBe(true);
      expect(result.token).toBeDefined();
      expect(result.emailPayload.to).toBe(email);
      expect(result.emailPayload.inviteUrl).toContain(`/primeiro-acesso?token=${result.token}`);
    });

    it('deve recusar criar convite se e-mail for inválido', async () => {
      await expect(
        AdminService.createAdminInvite('email-invalido', 'http://localhost:3000')
      ).rejects.toThrow(ValidationError);
    });
  });

  describe('3. Serviço e Endpoint de Validação de Token de Primeiro Acesso', () => {
    it('deve validar com sucesso um token ativo de primeiro acesso', async () => {
      const invite = await AdminService.createAdminInvite('admin1@teste.com', 'http://localhost:3000');

      const validation = await AdminService.validateFirstAccessToken(invite.token);

      expect(validation.valid).toBe(true);
      expect(validation.email).toBe('admin1@teste.com');
    });

    it('deve recusar token inexistente ou com formato incorreto', async () => {
      const validation = await AdminService.validateFirstAccessToken('token-inexistente-12345');

      expect(validation.valid).toBe(false);
      expect(validation.error).toContain('inválido ou não encontrado');
    });

    it('deve recusar token expirado', async () => {
      const invite = await AdminService.createAdminInvite('admin.expirado@teste.com', 'http://localhost:3000');

      // Forçar data de expiração no passado
      const admin = await AdminService.getAdminByEmail('admin.expirado@teste.com');
      if (admin) {
        admin.first_access_expires_at = new Date(Date.now() - 10000).toISOString();
      }

      const validation = await AdminService.validateFirstAccessToken(invite.token);

      expect(validation.valid).toBe(false);
      expect(validation.error).toContain('expirou');
    });
  });

  describe('4. Definição de Senha & Bloqueio de Reuso de Token (Uso Único)', () => {
    it('deve permitir definir a senha com sucesso, alterar first_access = false e invalidar o token', async () => {
      const invite = await AdminService.createAdminInvite('admin.sucesso@teste.com', 'http://localhost:3000');
      const token = invite.token;

      const setPasswordResult = await AdminService.setAdminPasswordWithToken(
        token,
        'NovaSenhaAdmin#2026',
        'NovaSenhaAdmin#2026'
      );

      expect(setPasswordResult.success).toBe(true);
      expect(setPasswordResult.email).toBe('admin.sucesso@teste.com');

      // Verificar que first_access mudou para false
      const updatedAdmin = await AdminService.getAdminByEmail('admin.sucesso@teste.com');
      expect(updatedAdmin?.first_access).toBe(false);
      expect(updatedAdmin?.first_access_token).toBeNull();
      expect(updatedAdmin?.password_hash).not.toBeNull();

      // Verificar que o token NÃO pode ser reusado (uso único)
      const secondValidation = await AdminService.validateFirstAccessToken(token);
      expect(secondValidation.valid).toBe(false);
      expect(secondValidation.error).toContain('já foi utilizado');
    });

    it('deve rejeitar quando a senha e a confirmação de senha não coincidem', async () => {
      const invite = await AdminService.createAdminInvite('admin.divergente@teste.com', 'http://localhost:3000');

      await expect(
        AdminService.setAdminPasswordWithToken(
          invite.token,
          'SenhaUm#2026',
          'SenhaDiferente#2026'
        )
      ).rejects.toThrow('A nova senha e a confirmação de senha não coincidem.');
    });

    it('deve rejeitar definição de senha se a senha for fraca', async () => {
      const invite = await AdminService.createAdminInvite('admin.fraco@teste.com', 'http://localhost:3000');

      await expect(
        AdminService.setAdminPasswordWithToken(
          invite.token,
          '123456',
          '123456'
        )
      ).rejects.toThrow(ValidationError);
    });

    it('deve permitir autenticação com as novas credenciais criadas no fluxo de primeiro acesso', async () => {
      const email = 'admin.login@teste.com';
      const password = 'MinhaNovaSenhaSegura@2026';

      const invite = await AdminService.createAdminInvite(email, 'http://localhost:3000');
      await AdminService.setAdminPasswordWithToken(invite.token, password, password);

      const authCheck = await AdminService.verifyAdminCredentials(email, password);

      expect(authCheck.valid).toBe(true);
      expect(authCheck.admin?.email).toBe(email);
    });
  });
});
