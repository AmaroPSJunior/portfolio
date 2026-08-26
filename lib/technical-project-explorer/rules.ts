export interface DetectionRule {
  id: string;

  category:
    | 'architecture'
    | 'dependency'
    | 'testing'
    | 'cicd'
    | 'database'
    | 'api'
    | 'integration'
    | 'security'
    | 'pattern'
    | 'implementation';

  description: string;

  matchesFile: (
    path: string
  ) => boolean;

  analyze?: (
    path: string,
    content: string
  ) => boolean;
}

const hasAnyExtension = (
  path: string,
  extensions: string[]
): boolean => {
  return extensions.some((extension) =>
    path.endsWith(extension)
  );
};

export const detectionRules: DetectionRule[] = [
  {
    id: 'nextjs',
    category: 'architecture',
    description: 'Next.js application',
    matchesFile: (path) =>
      path === 'next.config.js' ||
      path === 'next.config.mjs' ||
      path === 'next.config.ts',
  },

  {
    id: 'typescript',
    category: 'implementation',
    description: 'TypeScript source code',
    matchesFile: (path) =>
      hasAnyExtension(path, ['.ts', '.tsx']),
  },

  {
    id: 'javascript',
    category: 'implementation',
    description: 'JavaScript source code',
    matchesFile: (path) =>
      hasAnyExtension(path, ['.js', '.jsx', '.mjs', '.cjs']),
  },

  {
    id: 'spring-boot',
    category: 'architecture',
    description: 'Spring Boot application',
    matchesFile: (path) =>
      path.endsWith('pom.xml') ||
      path.endsWith('build.gradle') ||
      path.endsWith('build.gradle.kts'),
  },

  {
    id: 'docker',
    category: 'cicd',
    description: 'Docker configuration',
    matchesFile: (path) =>
      path === 'Dockerfile' ||
      path.startsWith('docker-compose'),
  },

  {
    id: 'github-actions',
    category: 'cicd',
    description: 'GitHub Actions workflow',
    matchesFile: (path) =>
      path.startsWith('.github/workflows/') &&
      path.endsWith('.yml'),
  },

  {
    id: 'github-actions-yaml',
    category: 'cicd',
    description: 'GitHub Actions workflow',
    matchesFile: (path) =>
      path.startsWith('.github/workflows/') &&
      path.endsWith('.yaml'),
  },

  {
    id: 'vitest',
    category: 'testing',
    description: 'Vitest tests',
    matchesFile: (path) =>
      path.includes('vitest.config') ||
      path.includes('.spec.') ||
      path.includes('.test.'),
  },

  {
    id: 'jest',
    category: 'testing',
    description: 'Jest tests',
    matchesFile: (path) =>
      path.includes('jest.config') ||
      path.includes('.spec.') ||
      path.includes('.test.'),
  },

  {
    id: 'supabase',
    category: 'database',
    description: 'Supabase integration',
    matchesFile: (path) =>
      path.startsWith('supabase/') ||
      path.includes('supabase'),
  },

  {
    id: 'postgresql',
    category: 'database',
    description: 'PostgreSQL configuration',
    matchesFile: (path) =>
      path.endsWith('.sql') ||
      path.includes('postgres'),
  },

  {
    id: 'api-routes',
    category: 'api',
    description: 'API route implementation',
    matchesFile: (path) =>
      path.includes('/api/') ||
      path.startsWith('api/'),
  },

  {
    id: 'graphql',
    category: 'api',
    description: 'GraphQL API',
    matchesFile: (path) =>
      path.includes('graphql'),
  },

  {
    id: 'websocket',
    category: 'integration',
    description: 'WebSocket integration',
    matchesFile: (path) =>
      path.includes('websocket') ||
      path.includes('socket'),
  },

  {
    id: 'security-env',
    category: 'security',
    description: 'Environment-based configuration',
    matchesFile: (path) =>
      path.startsWith('.env') ||
      path.includes('.env.'),
  },

  {
    id: 'middleware',
    category: 'security',
    description: 'Middleware implementation',
    matchesFile: (path) =>
      path === 'middleware.ts' ||
      path === 'middleware.js',
  },

  {
    id: 'repository-pattern',
    category: 'pattern',
    description: 'Repository pattern',
    matchesFile: (path) =>
      /repository/i.test(path),
  },

  {
    id: 'service-pattern',
    category: 'pattern',
    description: 'Service layer pattern',
    matchesFile: (path) =>
      /service/i.test(path),
  },

  {
    id: 'controller-pattern',
    category: 'pattern',
    description: 'Controller pattern',
    matchesFile: (path) =>
      /controller/i.test(path),
  },

  {
    id: 'schema-validation',
    category: 'security',
    description: 'Schema validation',
    matchesFile: (path) =>
      /schema|validator|validation/i.test(path),
  },
];

export function getRulesForFile(
  path: string
): DetectionRule[] {
  return detectionRules.filter((rule) =>
    rule.matchesFile(path)
  );
}
