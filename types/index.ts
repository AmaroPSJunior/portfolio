export type WorkStatus =
  | 'pending'
  | 'in_progress'
  | 'paused'
  | 'blocked'
  | 'completed'
  | 'disabled';

export interface Task {
  id: number;
  source?: 'database' | 'github';
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

  owner?: {
    login: string;
    avatar_url?: string;
    [key: string]: any;
  };

  stargazers_count?: number;
  forks_count?: number;
  open_issues_count?: number;
  default_branch?: string;
}

export type GithubRepoData = GithubProjectData;

export interface Phase {
  id: number;
  title: string;
  subtitle?: string;
  order?: number;
  description?: string;
  status?: WorkStatus;
  statusReason?: string;
  icon?: string;
  uuid?: string;
  created_at?: string;
  tasks?: Task[];
}

export interface NewTaskForm {
  title: string;
  description: string;
  phase: number;
  requirements?: string[];
  status?: WorkStatus;
  statusReason?: string;
  badgesInput?: string;
  requirementsInput?: string;
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
  page_key?: string;

  links?: {
    github?: string;
    docs?: string;
  };
}

export interface Skill {
  id?: string | number;
  name: string;
  category?: string;
  level?: string | number;
  icon?: string;
  experience?: string | number;
}

export interface TaskCardProps {
  task: Task;
  showPhaseBadge?: boolean;
  phaseLabel?: string;
  phaseIcon?: string;
  phaseId?: number;
}

export type RepositoryExplorerView =
  | 'mindmap'
  | 'radial'
  | 'tree'
  | 'timeline'
  | 'constellation';

export interface RepositoryExplorerNode {
  id: string;
  title: string;
  type: string;
  description?: string;
  value?: string | number;
  icon?: string;
  iconUrl?: string;
  iconSource?: string;
  children?: RepositoryExplorerNode[];
}

export interface RepositoryExplorerData {
  repository: GithubRepoData;
  nodes: RepositoryExplorerNode[];
}

export interface RepositoryExplorerModalProps {
  show: boolean;
  onClose: () => void;
  task: Task | null;
}

export type {
  TechnicalArchitecture,
  TechnicalFile,
  TechnicalDependency,
  TechnicalDatabase,
  TechnicalApi,
  TechnicalIntegration,
  TechnicalSecurityFinding,
  TechnicalPattern,
  TechnicalDecision,
  TechnicalEvidence,
  // TechnicalProjectExplorer,
  // TechnicalProjectMetadata,
  // TechnicalModule,
  // TechnicalTest,
  // TechnicalPipeline,
  // TechnicalWorkflow,
  // TechnicalTechnique,
  // TechnicalDemo,
  // TechnicalLineReference,
} from '@/lib/technical-project-explorer/types';

