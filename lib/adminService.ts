import { supabase } from './supabase';
import { AppLogger } from './logger';
import { generateFirstAccessToken, hashPassword, validatePasswordComplexity, verifyPassword } from './password';
import { generateFirstAccessEmail, EmailInvitePayload } from './emailService';
import { ValidationError, NotFoundError, AuthError, DatabaseError } from './errorHandler';

export interface AdminRecord {
  id: string;
  email: string;
  password_hash: string | null;
  first_access: boolean;
  first_access_token: string | null;
  first_access_expires_at: string | null;
  created_at: string;
  updated_at: string;
}

// In-memory cache for admin records (guarantees resilience and testability)
const inMemoryAdmins: Map<string, AdminRecord> = new Map();
const consumedTokens: Map<string, { email: string; consumedAt: string }> = new Map();

export class AdminService {
  /**
   * Helper to normalize email
   */
  private static normalizeEmail(email: string): string {
    return (email || '').trim().toLowerCase();
  }

  /**
   * Create a new Admin invite with token and return the email invite payload
   */
  static async createAdminInvite(
    emailInput: string,
    origin: string
  ): Promise<{ admin: AdminRecord; emailPayload: EmailInvitePayload; token: string }> {
    const scope = 'AdminService:createAdminInvite';
    const email = this.normalizeEmail(emailInput);

    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      throw new ValidationError('E-mail do administrador é inválido.');
    }

    // Check if admin already exists
    const existing = await this.getAdminByEmail(email);
    if (existing && !existing.first_access) {
      throw new ValidationError('Já existe um administrador ativo cadastrado com este e-mail.');
    }

    const { token, expiresAt } = generateFirstAccessToken();
    const expiresAtIso = expiresAt.toISOString();
    const nowIso = new Date().toISOString();

    const id = existing?.id || `admin-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;

    const newRecord: AdminRecord = {
      id,
      email,
      password_hash: existing?.password_hash || null,
      first_access: true,
      first_access_token: token,
      first_access_expires_at: expiresAtIso,
      created_at: existing?.created_at || nowIso,
      updated_at: nowIso,
    };

    // Store in-memory
    inMemoryAdmins.set(email, newRecord);

    // Attempt Supabase insert/upsert
    try {
      const { data, error } = await supabase
        .from('admins')
        .upsert(
          {
            id: newRecord.id,
            email: newRecord.email,
            password_hash: newRecord.password_hash,
            first_access: true,
            first_access_token: token,
            first_access_expires_at: expiresAtIso,
            updated_at: nowIso,
          },
          { onConflict: 'email' }
        )
        .select()
        .single();

      if (error) {
        AppLogger.warn(scope, 'Aviso Supabase ao registrar admin, mantendo no cache local', { error });
      } else if (data) {
        newRecord.id = data.id || newRecord.id;
        inMemoryAdmins.set(email, newRecord);
      }
    } catch (err) {
      AppLogger.warn(scope, 'Exceção ao persistir admin no Supabase, mantendo no cache local', { err });
    }

    const emailPayload = generateFirstAccessEmail(email, token, origin);

    AppLogger.info(scope, `Convite de Primeiro Acesso criado com sucesso para ${email}`, {
      adminId: newRecord.id,
      expiresAt: expiresAtIso,
    });

    return {
      admin: newRecord,
      emailPayload,
      token,
    };
  }

  /**
   * Validate if a first access token exists, is active (first_access === true) and not expired
   */
  static async validateFirstAccessToken(token: string): Promise<{ valid: boolean; email?: string; error?: string }> {
    const scope = 'AdminService:validateFirstAccessToken';

    if (!token || typeof token !== 'string') {
      return { valid: false, error: 'Token de primeiro acesso não fornecido.' };
    }

    // 0. Check if token was already consumed
    if (consumedTokens.has(token)) {
      return { valid: false, error: 'Este token já foi utilizado para definir a senha do administrador.' };
    }

    // 1. Search in-memory cache
    let matchedAdmin: AdminRecord | undefined;
    for (const admin of inMemoryAdmins.values()) {
      if (admin.first_access_token === token) {
        matchedAdmin = admin;
        break;
      }
    }

    // 2. Search Supabase if not found in memory
    if (!matchedAdmin) {
      try {
        const { data, error } = await supabase
          .from('admins')
          .select('*')
          .eq('first_access_token', token)
          .maybeSingle();

        if (!error && data) {
          matchedAdmin = {
            id: data.id,
            email: data.email,
            password_hash: data.password_hash,
            first_access: Boolean(data.first_access),
            first_access_token: data.first_access_token,
            first_access_expires_at: data.first_access_expires_at,
            created_at: data.created_at,
            updated_at: data.updated_at,
          };
          inMemoryAdmins.set(matchedAdmin.email, matchedAdmin);
        }
      } catch (e) {
        AppLogger.warn(scope, 'Erro ao consultar token no Supabase', { e });
      }
    }

    if (!matchedAdmin) {
      return { valid: false, error: 'Token de primeiro acesso inválido ou não encontrado.' };
    }

    if (!matchedAdmin.first_access) {
      return { valid: false, error: 'Este token já foi utilizado para definir a senha do administrador.' };
    }

    if (matchedAdmin.first_access_expires_at) {
      const expiresAt = new Date(matchedAdmin.first_access_expires_at).getTime();
      if (Date.now() > expiresAt) {
        return { valid: false, error: 'Este token de primeiro acesso expirou. Solicite um novo convite ao suporte.' };
      }
    }

    return {
      valid: true,
      email: matchedAdmin.email,
    };
  }

  /**
   * Set admin password using first access token
   */
  static async setAdminPasswordWithToken(
    token: string,
    password: string,
    confirmPassword: string
  ): Promise<{ success: boolean; email: string; message: string }> {
    const scope = 'AdminService:setAdminPasswordWithToken';

    if (password !== confirmPassword) {
      throw new ValidationError('A nova senha e a confirmação de senha não coincidem.');
    }

    const complexity = validatePasswordComplexity(password);
    if (!complexity.valid) {
      throw new ValidationError('A senha informada não atende aos requisitos de segurança.', complexity.errors);
    }

    const validation = await this.validateFirstAccessToken(token);
    if (!validation.valid || !validation.email) {
      throw new AuthError(validation.error || 'Token de primeiro acesso inválido ou expirado.', 400);
    }

    const email = validation.email;
    const admin = await this.getAdminByEmail(email);

    if (!admin) {
      throw new NotFoundError('Registro de administrador não encontrado.');
    }

    const hashedPassword = hashPassword(password);
    const nowIso = new Date().toISOString();

    admin.password_hash = hashedPassword;
    admin.first_access = false;
    admin.first_access_token = null;
    admin.first_access_expires_at = null;
    admin.updated_at = nowIso;

    consumedTokens.set(token, { email, consumedAt: nowIso });
    inMemoryAdmins.set(email, admin);

    // Update Supabase DB
    try {
      const { error } = await supabase
        .from('admins')
        .update({
          password_hash: hashedPassword,
          first_access: false,
          first_access_token: null,
          first_access_expires_at: null,
          updated_at: nowIso,
        })
        .eq('email', email);

      if (error) {
        AppLogger.warn(scope, 'Aviso ao atualizar senha no Supabase, alteração mantida em memória', { error });
      }
    } catch (err) {
      AppLogger.warn(scope, 'Exceção ao atualizar senha no Supabase', { err });
    }

    AppLogger.info(scope, `Senha de primeiro acesso definida com sucesso para ${email}`);

    return {
      success: true,
      email,
      message: 'Senha cadastrada com sucesso! Você já pode realizar o login no sistema.',
    };
  }

  /**
   * Retrieve Admin record by email
   */
  static async getAdminByEmail(emailInput: string): Promise<AdminRecord | null> {
    const email = this.normalizeEmail(emailInput);
    if (inMemoryAdmins.has(email)) {
      return inMemoryAdmins.get(email)!;
    }

    try {
      const { data, error } = await supabase
        .from('admins')
        .select('*')
        .eq('email', email)
        .maybeSingle();

      if (!error && data) {
        const record: AdminRecord = {
          id: data.id,
          email: data.email,
          password_hash: data.password_hash,
          first_access: Boolean(data.first_access),
          first_access_token: data.first_access_token,
          first_access_expires_at: data.first_access_expires_at,
          created_at: data.created_at,
          updated_at: data.updated_at,
        };
        inMemoryAdmins.set(email, record);
        return record;
      }
    } catch (err) {
      AppLogger.warn('AdminService:getAdminByEmail', 'Erro ao consultar admin no Supabase', { err });
    }

    return null;
  }

  /**
   * Verify credentials for custom admin login
   */
  static async verifyAdminCredentials(emailInput: string, passwordInput: string): Promise<{ valid: boolean; admin?: AdminRecord; message?: string }> {
    const email = this.normalizeEmail(emailInput);
    const admin = await this.getAdminByEmail(email);

    if (!admin) {
      return { valid: false, message: 'Usuário administrador não encontrado.' };
    }

    if (admin.first_access) {
      return { valid: false, message: 'Este usuário ainda não concluiu o Primeiro Acesso para criação da senha.' };
    }

    if (!admin.password_hash) {
      return { valid: false, message: 'Nenhuma senha cadastrada para este administrador.' };
    }

    const match = verifyPassword(passwordInput, admin.password_hash);
    if (!match) {
      return { valid: false, message: 'Senha incorreta.' };
    }

    return { valid: true, admin };
  }

  /**
   * Reset in-memory cache for testing
   */
  static clearInMemoryStore() {
    inMemoryAdmins.clear();
    consumedTokens.clear();
  }
}
