export type WorkStatus = 
  | 'pending' 
  | 'in_progress' 
  | 'paused' 
  | 'blocked' 
  | 'completed' 
  | 'disabled';

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
  subtitle?: string;
  order?: number;
  description?: string;
  status?: WorkStatus | string;
  statusReason?: string;
  icon?: string;
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
  branch?: string;
}

export interface SiteConfig {
  title?: string;
  subtitle?: string;
  description?: string;
  url?: string;
  ogImage?: string;
  links?: {
    github?: string;
    docs?: string;
  };
}

export interface Skill {
  id?: string | number;
  name: string;
  category?: string;
  level?: string;
  icon?: string;
  experience?: string | number;
}