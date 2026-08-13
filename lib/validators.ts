export interface PillarInput {
  title?: string;
  subtitle?: string;
  emoji?: string;
}

export interface ValidationResult {
  valid: boolean;
  errors: string[];
  sanitized: {
    title: string;
    subtitle: string;
    emoji: string;
  };
}

export function validatePillarInput(data: any): ValidationResult {
  const errors: string[] = [];

  if (!data || typeof data !== 'object') {
    return {
      valid: false,
      errors: ['O corpo da requisição é inválido.'],
      sanitized: { title: '', subtitle: '', emoji: '' },
    };
  }

  const title = typeof data.title === 'string' ? data.title.trim() : '';
  const emoji = typeof data.emoji === 'string' ? data.emoji.trim() : '';
  const subtitle = typeof data.subtitle === 'string' ? data.subtitle.trim() : '';

  if (!title) {
    errors.push('O título do Pilar é obrigatório.');
  } else if (title.length < 3) {
    errors.push('O título deve conter pelo menos 3 caracteres.');
  }

  if (!emoji) {
    errors.push('O emoji/ícone do Pilar é obrigatório.');
  } else if (emoji.length > 10) {
    errors.push('O campo de emoji/ícone deve conter um valor válido.');
  }

  return {
    valid: errors.length === 0,
    errors,
    sanitized: {
      title,
      subtitle,
      emoji,
    },
  };
}

export function calculateNextOrder(existingPillarsOrder: number[]): number {
  if (!existingPillarsOrder || existingPillarsOrder.length === 0) {
    return 1;
  }
  const maxOrder = Math.max(...existingPillarsOrder);
  return maxOrder + 1;
}
