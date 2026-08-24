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

// 1. Definição do WorkStatus com os valores exatos usados pelo seu validador e componentes:
export type WorkStatus = 
  | 'pending' 
  | 'in_progress' 
  | 'paused' 
  | 'blocked' 
  | 'completed' 
  | 'disabled';

// 2. Atualização da Phase (adicionado statusReason):
export interface Phase {
  id: number;
  title: string;
  subtitle?: string;
  order?: number;
  description?: string;
  statusReason?: string; // Adicionado para resolver os erros no RoadmapTab.tsx
  tasks?: Task[];
}

// 3. Adição do tipo Skill (faltando em data/constants.ts):
export interface Skill {
  id?: string | number;
  name: string;
  category?: string;
  level?: string;
  icon?: string;
}