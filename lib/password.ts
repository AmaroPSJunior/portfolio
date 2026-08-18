import crypto from 'crypto';

export interface PasswordComplexityCheck {
  length: boolean;
  uppercase: boolean;
  lowercase: boolean;
  number: boolean;
  special: boolean;
}

export interface PasswordValidationResult {
  valid: boolean;
  errors: string[];
  checks: PasswordComplexityCheck;
}

export function validatePasswordComplexity(password: string): PasswordValidationResult {
  const checks: PasswordComplexityCheck = {
    length: typeof password === 'string' && password.length >= 8,
    uppercase: /[A-Z]/.test(password || ''),
    lowercase: /[a-z]/.test(password || ''),
    number: /[0-9]/.test(password || ''),
    special: /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password || ''),
  };

  const errors: string[] = [];

  if (!checks.length) {
    errors.push('A senha deve conter no mínimo 8 caracteres.');
  }
  if (!checks.uppercase) {
    errors.push('A senha deve conter pelo menos uma letra maiúscula (A-Z).');
  }
  if (!checks.lowercase) {
    errors.push('A senha deve conter pelo menos uma letra minúscula (a-z).');
  }
  if (!checks.number) {
    errors.push('A senha deve conter pelo menos um número (0-9).');
  }
  if (!checks.special) {
    errors.push('A senha deve conter pelo menos um caractere especial (ex: !@#$%^&*).');
  }

  return {
    valid: errors.length === 0,
    errors,
    checks,
  };
}

/**
 * Hash a password securely using PBKDF2 with a random salt
 */
export function hashPassword(password: string): string {
  const salt = crypto.randomBytes(16).toString('hex');
  const iterations = 10000;
  const keylen = 64;
  const digest = 'sha512';
  const derivedKey = crypto.pbkdf2Sync(password, salt, iterations, keylen, digest);
  return `${salt}:${derivedKey.toString('hex')}`;
}

/**
 * Verify a plain text password against a stored hash
 */
export function verifyPassword(password: string, storedHash: string): boolean {
  if (!storedHash || !storedHash.includes(':')) {
    return false;
  }
  const [salt, key] = storedHash.split(':');
  const iterations = 10000;
  const keylen = 64;
  const digest = 'sha512';
  const derivedKey = crypto.pbkdf2Sync(password, salt, iterations, keylen, digest);
  return crypto.timingSafeEqual(Buffer.from(key, 'hex'), derivedKey);
}

/**
 * Generate a cryptographically secure token for first access
 */
export function generateFirstAccessToken(): { token: string; expiresAt: Date } {
  const token = crypto.randomBytes(32).toString('hex');
  // Token expires in 24 hours
  const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000);
  return { token, expiresAt };
}
