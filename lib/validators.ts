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

export interface ProjectValidationResult {
  valid: boolean;
  errors: string[];
  sanitized: {
    title: string;
    phaseId: number;
    description: string;
    requirements: string[];
    badges: string[];
  };
}

export function validateProjectInput(data: any): ProjectValidationResult {
  const errors: string[] = [];

  if (!data || typeof data !== 'object') {
    return {
      valid: false,
      errors: ['O corpo da requisição é inválido.'],
      sanitized: { title: '', phaseId: 1, description: '', requirements: [], badges: [] },
    };
  }

  const title = typeof data.title === 'string' ? data.title.trim() : '';
  const phaseId = Number(data.phase || data.phase_id);

  if (!title || isNaN(phaseId) || phaseId <= 0) {
    errors.push('Título e Fase/Pilar são obrigatórios');
  }

  const description = typeof data.description === 'string' ? data.description.trim() : '';

  const requirements = data.requirementsInput
    ? String(data.requirementsInput)
        .split(';')
        .map((s) => s.trim())
        .filter(Boolean)
    : Array.isArray(data.requirements)
    ? data.requirements.map((r: any) => String(r).trim()).filter(Boolean)
    : [];

  const badges = data.badgesInput
    ? String(data.badgesInput)
        .split(',')
        .map((s) => s.trim())
        .filter(Boolean)
    : Array.isArray(data.badges)
    ? data.badges.map((b: any) => String(b).trim()).filter(Boolean)
    : [];

  return {
    valid: errors.length === 0,
    errors,
    sanitized: {
      title,
      phaseId: !isNaN(phaseId) && phaseId > 0 ? phaseId : 1,
      description,
      requirements: requirements.length > 0 ? requirements : ['Requisito padrão'],
      badges: badges.length > 0 ? badges : ['Novo Projeto'],
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

