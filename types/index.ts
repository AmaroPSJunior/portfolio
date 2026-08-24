export type WorkStatus = 'PENDING' | 'IN_PROGRESS' | 'COMPLETED' | 'BLOCKED';
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

export interface GithubProjectData {
  id: number;
  name: string;
  full_name: string;
  private: boolean;
  html_url: string;
  description?: string;
  created_at?: string;
  updated_at?: string;
  pushed_at?: string;
  language?: string;
}

export interface Phase {
  id: number;
  title: string;
  description?: string;
  tasks?: Task[];
}

export interface NewTaskForm {
  title: string;
  description: string;
  phase: number;
  requirements?: string[];
}

export interface GithubConfig {
  token?: string;
  repo?: string;
  owner?: string;
}

export interface Phase {
  id: number;
  title: string;
  subtitle?: string; // Adicionado para resolver TS2353
  order?: number;     // Adicionado para resolver TS2339
  description?: string;
  tasks?: Task[];
}

export interface SiteConfig {
  title?: string;
  description?: string;
  url?: string;
  ogImage?: string;
  links?: {
    github?: string;
    docs?: string;
  };
}