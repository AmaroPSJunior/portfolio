export type WorkStatus =
  | 'pending'
  | 'in_progress'
  | 'completed'
  | 'blocked'
  | 'paused';

export interface Task {
  id: number;
  phase: number;
  title: string;
  description: string;
  requirements: string[];
  badges: string[];
  completed: boolean;
  status: WorkStatus;
  statusReason: string;
  isCustom?: boolean;
  uuid?: string;
  created_at?: string;

  /**
   * Dados do repositório GitHub associado ao projeto.
   *
   * Esses campos são opcionais porque nem todo projeto
   * necessariamente possui um repositório associado.
   */
  githubId?: number;
  githubName?: string;
  githubFullName?: string;
  githubPrivate?: boolean;
  githubHtmlUrl?: string;
  githubDescription?: string;
  githubCreatedAt?: string;
  githubUpdatedAt?: string;
  githubPushedAt?: string;
  githubLanguage?: string;
}

export interface Phase {
  id: number;
  title: string;
  subtitle: string;
  icon: string;
  status?: WorkStatus;
  statusReason?: string;
}

export interface GithubConfig {
  owner: string;
  repo: string;
  token?: string;
}

export interface SiteConfig {
  title?: string;
  subtitle?: string;
  description?: string;
  author?: string;
  email?: string;
  githubUrl?: string;
  linkedinUrl?: string;
  websiteUrl?: string;
}

export interface ApiError {
  message: string;
  code?: string;
  status?: number;
  details?: unknown;
}

export interface ApiErrorNotice {
  message: string;
  action?: () => void | Promise<void>;
}