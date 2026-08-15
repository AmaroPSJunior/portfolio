export interface Task {
  id: number;
  phase: number;
  title: string;
  description: string;
  requirements: string[];
  badges: string[];
  completed: boolean;
  isCustom?: boolean;
  uuid?: string;
  created_at?: string;
}

export interface NewTaskForm {
  phase: number;
  title: string;
  description: string;
  requirementsInput: string;
  badgesInput: string;
}

export interface Phase {
  id: number;
  title: string;
  subtitle: string;
  icon: string;
  order?: number;
  uuid?: string;
  created_at?: string;
}

export interface NewPhaseForm {
  title: string;
  subtitle: string;
  emoji: string;
}

export interface Skill {
  name: string;
  level: number;
  icon: string;
  experience: string;
}

export interface GithubConfig {
  owner: string;
  repo: string;
  branch: string;
  token?: string;
}

export interface GithubRepoData {
  full_name: string;
  html_url: string;
  description?: string;
  private?: boolean;
  stargazers_count: number;
  forks_count: number;
  open_issues_count: number;
  default_branch: string;
  owner?: {
    avatar_url?: string;
  };
}

export interface SiteConfig {
  page_key: string;
  title: string;
  subtitle: string;
  updated_at?: string;
}
