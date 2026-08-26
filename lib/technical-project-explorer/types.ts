export type TechnicalCategory =
  | 'architecture'
  | 'code'
  | 'dependency'
  | 'testing'
  | 'cicd'
  | 'github-actions'
  | 'database'
  | 'api'
  | 'integration'
  | 'security'
  | 'pattern'
  | 'technique'
  | 'implementation'
  | 'file'
  | 'decision';

export type TechnicalEvidenceType =
  | 'file'
  | 'line'
  | 'configuration'
  | 'dependency'
  | 'workflow'
  | 'migration'
  | 'test'
  | 'api-route'
  | 'documentation';

export interface TechnicalEvidence {
  id: string;
  type: TechnicalEvidenceType;
  title: string;
  description?: string;
  path: string;
  lineStart?: number;
  lineEnd?: number;
  code?: string;
  repositoryUrl?: string;
  fileUrl?: string;
  metadata?: Record<string, string | number | boolean | null>;
  branch?: string;
}

export interface TechnicalFile {
  path: string;
  name: string;
  extension?: string;
  language?: string;
  size?: number;
  type: 'file' | 'directory';
  sha?: string;
  url?: string;
  content?: string;
  lines?: number;
  category?: TechnicalCategory;
}

export interface TechnicalDependency {
  name: string;
  version?: string;

  type:
    | 'runtime'
    | 'development'
    | 'peer'
    | 'optional'
    | 'unknown';

  ecosystem:
    | 'npm'
    | 'yarn'
    | 'pnpm'
    | 'bun'
    | 'maven'
    | 'gradle'
    | 'pip'
    | 'composer'
    | 'unknown';

  sourceFile?: string;
}

export interface TechnicalFramework {
  name: string;
  version?: string;

  category:
    | 'frontend'
    | 'backend'
    | 'database'
    | 'testing'
    | 'build'
    | 'devops'
    | 'other';

  evidence: TechnicalEvidence[];
}

export interface TechnicalArchitecture {
  style?: string;

  layers: string[];

  modules: string[];

  entryPoints: string[];

  technologies: TechnicalFramework[];

  evidence: TechnicalEvidence[];
}

export interface TechnicalTestSummary {
  framework?: string;

  totalFiles: number;

  unitTests: number;
  integrationTests: number;
  e2eTests: number;

  directories: string[];

  evidence: TechnicalEvidence[];
}

export interface TechnicalCICD {
  provider?: string;

  workflows: string[];

  stages: string[];

  commands: string[];

  deploymentTargets: string[];

  evidence: TechnicalEvidence[];
}

export interface TechnicalDatabase {
  technologies: string[];

  migrations: string[];

  schemas: string[];

  tables: string[];

  evidence: TechnicalEvidence[];
}

export interface TechnicalApi {
  type:
    | 'rest'
    | 'graphql'
    | 'grpc'
    | 'websocket'
    | 'internal'
    | 'unknown';

  path: string;

  methods: string[];

  description?: string;

  evidence: TechnicalEvidence[];
}

export interface TechnicalIntegration {
  name: string;

  type:
    | 'github'
    | 'supabase'
    | 'database'
    | 'payment'
    | 'authentication'
    | 'storage'
    | 'external-api'
    | 'messaging'
    | 'other';

  description?: string;

  evidence: TechnicalEvidence[];
}

export interface TechnicalSecurityFinding {
  title: string;

  severity:
    | 'info'
    | 'low'
    | 'medium'
    | 'high';

  description: string;

  evidence: TechnicalEvidence[];
}

export interface TechnicalPattern {
  name: string;

  description?: string;

  evidence: TechnicalEvidence[];
}

export interface TechnicalDecision {
  title: string;

  description: string;

  evidence: TechnicalEvidence[];
}

export interface TechnicalRepositorySnapshot {
  owner: string;
  repo: string;

  branch: string;

  repositoryUrl: string;

  files: TechnicalFile[];

  truncated: boolean;

  generatedAt: string;
}

export interface TechnicalProjectAnalysis {
  repository: {
    owner: string;
    name: string;
    fullName: string;

    branch: string;

    url: string;

    description?: string;

    language?: string;
  };

  architecture: TechnicalArchitecture;

  files: TechnicalFile[];

  dependencies: TechnicalDependency[];

  frameworks: TechnicalFramework[];

  tests: TechnicalTestSummary;

  cicd: TechnicalCICD;

  database: TechnicalDatabase;

  apis: TechnicalApi[];

  integrations: TechnicalIntegration[];

  security: TechnicalSecurityFinding[];

  patterns: TechnicalPattern[];

  decisions: TechnicalDecision[];

  evidence: TechnicalEvidence[];

  generatedAt: string;
}
