import { WorkStatus } from '@/types';

export const WORK_STATUS_VALUES: WorkStatus[] = [
  'pending',
  'in_progress',
  'paused',
  'blocked',
  'completed',
  'disabled',
];

export function isValidWorkStatus(value: unknown): value is WorkStatus {
  return typeof value === 'string' && WORK_STATUS_VALUES.includes(value as WorkStatus);
}

export function isDisabledStatus(status?: WorkStatus): boolean {
  return status === 'disabled';
}

export function isTaskFinished(task: { completed: boolean; status?: WorkStatus }): boolean {
  return task.completed || task.status === 'completed';
}

export interface PhaseInput {
  title?: string;
  subtitle?: string;
  emoji?: string;
  status?: WorkStatus;
  statusReason?: string;
}

export interface ValidationResult {
  valid: boolean;
  errors: string[];
  sanitized: {
    title: string;
    subtitle: string;
    emoji: string;
    status: WorkStatus;
    statusReason: string;
  };
}

export function validatePhaseInput(data: any): ValidationResult {
  const errors: string[] = [];

  if (!data || typeof data !== 'object') {
    return {
      valid: false,
      errors: ['O corpo da requisição é inválido.'],
      sanitized: { title: '', subtitle: '', emoji: '', status: 'pending', statusReason: '' },
    };
  }

  const title = typeof data.title === 'string' ? data.title.trim() : '';
  const emoji = typeof data.emoji === 'string' ? data.emoji.trim() : '';
  const subtitle = typeof data.subtitle === 'string' ? data.subtitle.trim() : '';
  const status = isValidWorkStatus(data.status) ? data.status : 'pending';
  const statusReason = typeof data.statusReason === 'string' ? data.statusReason.trim() : '';

  if (!title) {
    errors.push('O título da Fase é obrigatório.');
  } else if (title.length < 3) {
    errors.push('O título deve conter pelo menos 3 caracteres.');
  }

  if (!emoji) {
    errors.push('O emoji/ícone da Fase é obrigatório.');
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
      status,
      statusReason,
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
    status: WorkStatus;
    statusReason: string;
  };
}

export function validateProjectInput(data: any): ProjectValidationResult {
  const errors: string[] = [];

  if (!data || typeof data !== 'object') {
    return {
      valid: false,
      errors: ['O corpo da requisição é inválido.'],
      sanitized: {
        title: '',
        phaseId: 1,
        description: '',
        requirements: [],
        badges: [],
        status: 'pending',
        statusReason: '',
      },
    };
  }

  const title = typeof data.title === 'string' ? data.title.trim() : '';
  const phaseId = Number(data.phase || data.phase_id || data.fase_id);
  const status = isValidWorkStatus(data.status) ? data.status : 'pending';
  const statusReason = typeof data.statusReason === 'string' ? data.statusReason.trim() : '';

  if (!title || isNaN(phaseId) || phaseId <= 0) {
    errors.push('Título e Fase são obrigatórios');
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
      requirements,
      badges,
      status,
      statusReason,
    },
  };
}

export function calculateNextOrder(existingPhasesOrder: number[]): number {
  if (!existingPhasesOrder || existingPhasesOrder.length === 0) {
    return 1;
  }
  const maxOrder = Math.max(...existingPhasesOrder);
  return maxOrder + 1;
}
