import {
  createEvidence,
  createEvidenceId,
  extractLineRange,
} from './evidence';

import {
  getRulesForFile,
} from './rules';

import {
  normalizeFiles,
} from './normalizer';

import type {
  TechnicalArchitecture,
  TechnicalApi,
  TechnicalCICD,
  TechnicalDatabase,
  TechnicalDependency,
  TechnicalEvidence,
  TechnicalFramework,
  TechnicalIntegration,
  TechnicalPattern,
  TechnicalProjectAnalysis,
  TechnicalRepositorySnapshot,
  TechnicalSecurityFinding,
  TechnicalTestSummary,
} from './types';

interface PackageJson {
  dependencies?: Record<string, string>;
  devDependencies?: Record<string, string>;
  peerDependencies?: Record<string, string>;
  optionalDependencies?: Record<string, string>;
}

function parseJson(
  content?: string
): unknown | undefined {
  if (!content) {
    return undefined;
  }

  try {
    return JSON.parse(content);
  } catch {
    return undefined;
  }
}

function findFile(
  snapshot: TechnicalRepositorySnapshot,
  path: string
) {
  return snapshot.files.find(
    (file) => file.path === path
  );
}

function filesMatching(
  snapshot: TechnicalRepositorySnapshot,
  predicate: (path: string) => boolean
) {
  return snapshot.files.filter((file) =>
    predicate(file.path)
  );
}

function evidenceForFile(
  snapshot: TechnicalRepositorySnapshot,
  filePath: string,
  type: Parameters<typeof createEvidence>[0]['type'],
  title: string,
  description?: string
): TechnicalEvidence {
  const file = findFile(
    snapshot,
    filePath
  );

  return createEvidence({
    id: createEvidenceId(
      type,
      filePath
    ),
    type,
    title,
    description,
    path: filePath,
    repositoryUrl:
      snapshot.repositoryUrl,
    branch: snapshot.branch,
  });
}

function detectFrameworks(
  snapshot: TechnicalRepositorySnapshot
): TechnicalFramework[] {
  const frameworks: TechnicalFramework[] =
    [];

  const packageFile =
    findFile(snapshot, 'package.json');

  const packageJson =
    parseJson(
      packageFile?.content
    ) as PackageJson | undefined;

  const dependencies = {
    ...(packageJson?.dependencies || {}),
    ...(packageJson?.devDependencies || {}),
  };

  const frameworkDefinitions = [
    {
      packageName: 'next',
      name: 'Next.js',
      category:
        'frontend' as const,
    },
    {
      packageName: 'react',
      name: 'React',
      category:
        'frontend' as const,
    },
    {
      packageName: 'react-dom',
      name: 'React DOM',
      category:
        'frontend' as const,
    },
    {
      packageName: 'tailwindcss',
      name: 'Tailwind CSS',
      category:
        'frontend' as const,
    },
    {
      packageName: 'vitest',
      name: 'Vitest',
      category:
        'testing' as const,
    },
    {
      packageName: 'jest',
      name: 'Jest',
      category:
        'testing' as const,
    },
    {
      packageName: '@supabase/supabase-js',
      name: 'Supabase',
      category:
        'database' as const,
    },
    {
      packageName: 'typescript',
      name: 'TypeScript',
      category:
        'build' as const,
    },
  ];

  for (const definition of frameworkDefinitions) {
    const version =
      dependencies[definition.packageName];

    if (!version) {
      continue;
    }

    frameworks.push({
      name: definition.name,
      version,
      category: definition.category,
      evidence: packageFile
        ? [
            evidenceForFile(
              snapshot,
              packageFile.path,
              'dependency',
              definition.name,
              `Dependência ${definition.packageName} detectada no package.json.`
            ),
          ]
        : [],
    });
  }

  return frameworks;
}

function detectDependencies(
  snapshot: TechnicalRepositorySnapshot
): TechnicalDependency[] {
  const packageFile =
    findFile(snapshot, 'package.json');

  if (!packageFile?.content) {
    return [];
  }

  const packageJson =
    parseJson(
      packageFile.content
    ) as PackageJson | undefined;

  if (!packageJson) {
    return [];
  }

  const result: TechnicalDependency[] = [];

  const addDependencies = (
    dependencies: Record<string, string> | undefined,
    type: TechnicalDependency['type']
  ) => {
    if (!dependencies) {
      return;
    }

    for (const [
      name,
      version,
    ] of Object.entries(dependencies)) {
      result.push({
        name,
        version,
        type,
        ecosystem: 'npm',
        sourceFile:
          packageFile.path,
      });
    }
  };

  addDependencies(
    packageJson.dependencies,
    'runtime'
  );

  addDependencies(
    packageJson.devDependencies,
    'development'
  );

  addDependencies(
    packageJson.peerDependencies,
    'peer'
  );

  addDependencies(
    packageJson.optionalDependencies,
    'optional'
  );

  return result.sort((a, b) =>
    a.name.localeCompare(b.name)
  );
}

function detectTests(
  snapshot: TechnicalRepositorySnapshot
): TechnicalTestSummary {
  const testFiles =
    filesMatching(
      snapshot,
      (path) =>
        /(^|\/)(test|tests|__tests__)(\/|$)/i.test(
          path
        ) ||
        /\.(spec|test)\.[^.]+$/i.test(path)
    );

  const vitest =
    snapshot.files.some((file) =>
      file.path.includes('vitest.config')
    );

  const jest =
    snapshot.files.some((file) =>
      file.path.includes('jest.config')
    );

  const framework =
    vitest
      ? 'Vitest'
      : jest
        ? 'Jest'
        : undefined;

  const unitTests =
    testFiles.filter((file) =>
      /unit|\.unit\./i.test(file.path)
    ).length;

  const integrationTests =
    testFiles.filter((file) =>
      /integration|integr/i.test(
        file.path
      )
    ).length;

  const e2eTests =
    testFiles.filter((file) =>
      /e2e|playwright|cypress/i.test(
        file.path
      )
    ).length;

  const evidence =
    testFiles.slice(0, 30).map((file) =>
      evidenceForFile(
        snapshot,
        file.path,
        'test',
        file.name,
        'Arquivo identificado como parte da suíte de testes.'
      )
    );

  return {
    framework,
    totalFiles: testFiles.length,
    unitTests,
    integrationTests,
    e2eTests,
    directories: [
      ...new Set(
        testFiles.map((file) =>
          file.path.includes('/')
            ? file.path.substring(
                0,
                file.path.lastIndexOf('/')
              )
            : '.'
        )
      ),
    ],
    evidence,
  };
}

function detectCICD(
  snapshot: TechnicalRepositorySnapshot
): TechnicalCICD {
  const workflowFiles =
    filesMatching(
      snapshot,
      (path) =>
        path.startsWith(
          '.github/workflows/'
        ) &&
        /\.(yml|yaml)$/i.test(path)
    );

  const evidence: TechnicalEvidence[] =
    [];

  const commands = new Set<string>();
  const stages = new Set<string>();
  const deploymentTargets = new Set<string>();

  for (const file of workflowFiles) {
    evidence.push(
      evidenceForFile(
        snapshot,
        file.path,
        'workflow',
        file.name,
        'GitHub Actions workflow detectado.'
      )
    );

    if (!file.content) {
      continue;
    }

    const lines =
      file.content.split('\n');

    for (const line of lines) {
      const trimmed = line.trim();

      if (
        trimmed.startsWith('run:')
      ) {
        commands.add(
          trimmed
            .replace(/^run:\s*/, '')
            .replace(/^['"]|['"]$/g, '')
        );
      }

      if (
        /build|test|lint|check/i.test(
          trimmed
        )
      ) {
        stages.add(
          trimmed
            .replace(/[:#-]/g, ' ')
            .trim()
        );
      }

      if (
        /vercel|aws|azure|gcp|docker|kubernetes/i.test(
          trimmed
        )
      ) {
        deploymentTargets.add(
          trimmed
        );
      }
    }
  }

  return {
    provider:
      workflowFiles.length > 0
        ? 'GitHub Actions'
        : undefined,

    workflows:
      workflowFiles.map(
        (file) => file.path
      ),

    stages: [...stages].slice(0, 50),

    commands: [...commands].slice(0, 100),

    deploymentTargets: [
      ...deploymentTargets,
    ].slice(0, 30),

    evidence,
  };
}

function detectDatabase(
  snapshot: TechnicalRepositorySnapshot
): TechnicalDatabase {
  const databaseFiles =
    filesMatching(
      snapshot,
      (path) => {
        const normalized =
          path.toLowerCase();

        return (
          normalized.includes('migration') ||
          normalized.endsWith('.sql') ||
          normalized.includes('schema') ||
          normalized.startsWith(
            'supabase/'
          )
        );
      }
    );

  const technologies = new Set<string>();

  if (
    databaseFiles.some((file) =>
      file.path.startsWith('supabase/')
    )
  ) {
    technologies.add('Supabase');
    technologies.add('PostgreSQL');
  }

  if (
    databaseFiles.some((file) =>
      /postgres/i.test(
        file.content || ''
      )
    )
  ) {
    technologies.add('PostgreSQL');
  }

  const migrations =
    databaseFiles
      .filter((file) =>
        /migration/i.test(
          file.path
        )
      )
      .map((file) => file.path);

  const schemas =
    databaseFiles
      .filter((file) =>
        /schema/i.test(
          file.path
        )
      )
      .map((file) => file.path);

  const evidence =
    databaseFiles
      .slice(0, 50)
      .map((file) =>
        evidenceForFile(
          snapshot,
          file.path,
          'migration',
          file.name,
          'Arquivo relacionado à camada de persistência.'
        )
      );

  return {
    technologies: [
      ...technologies,
    ],
    migrations,
    schemas,
    tables: [],
    evidence,
  };
}

function detectApis(
  snapshot: TechnicalRepositorySnapshot
): TechnicalApi[] {
  const apis: TechnicalApi[] = [];

  const routeFiles =
    filesMatching(
      snapshot,
      (path) =>
        path.includes('/api/') ||
        path.startsWith('api/')
    );

  for (const file of routeFiles) {
    const methods = new Set<string>();

    if (file.content) {
      for (const method of [
        'GET',
        'POST',
        'PUT',
        'PATCH',
        'DELETE',
      ]) {
        const regex = new RegExp(
          `export\\s+(?:async\\s+)?function\\s+${method}`,
          'i'
        );

        if (regex.test(file.content)) {
          methods.add(method);
        }
      }
    }

    apis.push({
      type: 'rest',
      path: file.path,
      methods:
        methods.size > 0
          ? [...methods]
          : ['GET'],
      description:
        'Endpoint de API identificado pela estrutura do projeto.',
      evidence: [
        evidenceForFile(
          snapshot,
          file.path,
          'api-route',
          file.name,
          'Arquivo identificado como API route.'
        ),
      ],
    });
  }

  return apis;
}

function detectIntegrations(
  snapshot: TechnicalRepositorySnapshot,
  frameworks: TechnicalFramework[]
): TechnicalIntegration[] {
  const integrations: TechnicalIntegration[] =
    [];

  const addIntegration = (
    name: string,
    type: TechnicalIntegration['type'],
    description: string,
    paths: string[]
  ) => {
    const evidence =
      paths
        .filter((path) =>
          snapshot.files.some(
            (file) =>
              file.path === path
          )
        )
        .map((path) =>
          evidenceForFile(
            snapshot,
            path,
            'configuration',
            name,
            description
          )
        );

    integrations.push({
      name,
      type,
      description,
      evidence,
    });
  };

  const hasSupabase =
    frameworks.some(
      (framework) =>
        framework.name === 'Supabase'
    ) ||
    snapshot.files.some((file) =>
      file.path.startsWith('supabase/')
    );

  if (hasSupabase) {
    addIntegration(
      'Supabase',
      'supabase',
      'Integração com Supabase/PostgreSQL detectada.',
      ['package.json']
    );
  }

  const hasGithub =
    snapshot.files.some((file) =>
      file.path.startsWith(
        '.github/'
      )
    );

  if (hasGithub) {
    addIntegration(
      'GitHub',
      'github',
      'Integração e automação relacionadas ao GitHub detectadas.',
      ['package.json']
    );
  }

  return integrations;
}

function detectSecurity(
  snapshot: TechnicalRepositorySnapshot
): TechnicalSecurityFinding[] {
  const findings: TechnicalSecurityFinding[] =
    [];

  const middleware =
    snapshot.files.find(
      (file) =>
        file.path ===
          'middleware.ts' ||
        file.path ===
          'middleware.js'
    );

  if (middleware) {
    findings.push({
      title: 'Middleware detectado',
      severity: 'info',
      description:
        'O projeto possui uma camada de middleware que pode participar de autenticação, autorização ou processamento de requisições.',
      evidence: [
        evidenceForFile(
          snapshot,
          middleware.path,
          'file',
          middleware.name,
          'Middleware detectado.'
        ),
      ],
    });
  }

  const authFiles =
    snapshot.files.filter((file) =>
      /auth|authentication|authorization/i.test(
        file.path
      )
    );

  if (authFiles.length > 0) {
    findings.push({
      title:
        'Camada de autenticação/autorização detectada',
      severity: 'info',
      description:
        'Foram encontrados arquivos relacionados a autenticação ou autorização.',
      evidence:
        authFiles.slice(0, 20).map(
          (file) =>
            evidenceForFile(
              snapshot,
              file.path,
              'file',
              file.name
            )
        ),
    });
  }

  const envFiles =
    snapshot.files.filter((file) =>
      /^\.env/.test(
        file.path
      )
    );

  if (envFiles.length > 0) {
    findings.push({
      title:
        'Arquivos de ambiente detectados',
      severity: 'low',
      description:
        'Arquivos de ambiente foram identificados. Secrets não devem ser expostos no repositório.',
      evidence:
        envFiles.map((file) =>
          evidenceForFile(
            snapshot,
            file.path,
            'configuration',
            file.name
          )
        ),
    });
  }

  return findings;
}

function detectPatterns(
  snapshot: TechnicalRepositorySnapshot
): TechnicalPattern[] {
  const patterns: TechnicalPattern[] =
    [];

  const definitions = [
    {
      pattern: /repository/i,
      name: 'Repository Pattern',
      description:
        'Arquivos relacionados à abstração de acesso a dados.',
    },
    {
      pattern: /service/i,
      name: 'Service Layer',
      description:
        'Camada de serviços identificada pela organização dos arquivos.',
    },
    {
      pattern: /controller/i,
      name: 'Controller Pattern',
      description:
        'Camada de controllers identificada.',
    },
  ];

  for (const definition of definitions) {
    const matchingFiles =
      snapshot.files.filter((file) =>
        definition.pattern.test(
          file.path
        )
      );

    if (matchingFiles.length === 0) {
      continue;
    }

    patterns.push({
      name: definition.name,
      description:
        definition.description,
      evidence:
        matchingFiles
          .slice(0, 20)
          .map((file) =>
            evidenceForFile(
              snapshot,
              file.path,
              'file',
              file.name
            )
          ),
    });
  }

  return patterns;
}

function detectArchitecture(
  snapshot: TechnicalRepositorySnapshot,
  frameworks: TechnicalFramework[]
): TechnicalArchitecture {
  const layers = new Set<string>();
  const modules = new Set<string>();
  const entryPoints = new Set<string>();

  for (const file of snapshot.files) {
    const parts =
      file.path.split('/');

    if (parts.length > 1) {
      modules.add(parts[0]);
    }

    if (
      /(^|\/)(app|pages|src|server|api)\//i.test(
        file.path
      )
    ) {
      layers.add(
        parts.length > 1
          ? parts[0]
          : 'root'
      );
    }

    if (
      /route\.(ts|tsx|js|jsx)$/i.test(
        file.path
      ) ||
      /page\.(ts|tsx|js|jsx)$/i.test(
        file.path
      ) ||
      /main\.(java|kt|ts|js)$/i.test(
        file.path
      )
    ) {
      entryPoints.add(
        file.path
      );
    }
  }

  let style: string | undefined;

  if (
    snapshot.files.some(
      (file) =>
        file.path.startsWith(
          'app/'
        ) &&
        /page\.(tsx|ts|jsx|js)$/.test(
          file.path
        )
    )
  ) {
    style =
      'Next.js App Router / modular application';
  } else if (
    snapshot.files.some((file) =>
      /controller/i.test(
        file.path
      )
    )
  ) {
    style =
      'Layered architecture';
  }

  const evidence =
    snapshot.files
      .filter((file) =>
        /^(app|src|pages|server|api)\//i.test(
          file.path
        )
      )
      .slice(0, 30)
      .map((file) =>
        evidenceForFile(
          snapshot,
          file.path,
          'file',
          file.name,
          'Arquivo utilizado para inferência da arquitetura.'
        )
      );

  return {
    style,
    layers: [...layers],
    modules: [...modules],
    entryPoints: [
      ...entryPoints,
    ],
    technologies: frameworks,
    evidence,
  };
}

export function analyzeRepository(
  snapshot: TechnicalRepositorySnapshot
): TechnicalProjectAnalysis {
  const files =
    normalizeFiles(snapshot.files);

  const normalizedSnapshot = {
    ...snapshot,
    files,
  };

  const frameworks =
    detectFrameworks(
      normalizedSnapshot
    );

  const dependencies =
    detectDependencies(
      normalizedSnapshot
    );

  const tests =
    detectTests(
      normalizedSnapshot
    );

  const cicd =
    detectCICD(
      normalizedSnapshot
    );

  const database =
    detectDatabase(
      normalizedSnapshot
    );

  const apis =
    detectApis(
      normalizedSnapshot
    );

  const integrations =
    detectIntegrations(
      normalizedSnapshot,
      frameworks
    );

  const security =
    detectSecurity(
      normalizedSnapshot
    );

  const patterns =
    detectPatterns(
      normalizedSnapshot
    );

  const architecture =
    detectArchitecture(
      normalizedSnapshot,
      frameworks
    );

  const evidence: TechnicalEvidence[] =
    [
      ...architecture.evidence,
      ...tests.evidence,
      ...cicd.evidence,
      ...database.evidence,
      ...integrations.flatMap(
        (item) => item.evidence
      ),
      ...security.flatMap(
        (item) => item.evidence
      ),
      ...patterns.flatMap(
        (item) => item.evidence
      ),
      ...apis.flatMap(
        (item) => item.evidence
      ),
    ];

  const uniqueEvidence = [
    ...new Map(
      evidence.map((item) => [
        item.id,
        item,
      ])
    ).values(),
  ];

  return {
    repository: {
      owner: snapshot.owner,
      name: snapshot.repo,
      fullName:
        `${snapshot.owner}/${snapshot.repo}`,
      branch: snapshot.branch,
      url: snapshot.repositoryUrl,
    },
    architecture,
    files,
    dependencies,
    frameworks,
    tests,
    cicd,
    database,
    apis,
    integrations,
    security,
    patterns,
    decisions: [],
    evidence: uniqueEvidence,
    generatedAt: new Date().toISOString(),
  };
}
