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