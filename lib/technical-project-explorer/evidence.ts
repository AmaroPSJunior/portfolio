import type {
  TechnicalEvidence,
  TechnicalEvidenceType,
} from './types';

interface CreateEvidenceOptions {
  id: string;
  type: TechnicalEvidenceType;
  title: string;
  description?: string;
  path: string;
  lineStart?: number;
  lineEnd?: number;
  code?: string;
  repositoryUrl?: string;
  metadata?: Record<string, string | number | boolean | null>;
  branch?: string;
}

export function createEvidence(
  options: CreateEvidenceOptions
): TechnicalEvidence {
  const fileUrl =
    options.repositoryUrl && options.path
      ? `${options.repositoryUrl}/blob/${options.branch || 'main'}/${options.path}${
          options.lineStart
            ? `#L${options.lineStart}${
                options.lineEnd &&
                options.lineEnd !== options.lineStart
                  ? `-L${options.lineEnd}`
                  : ''
              }`
            : ''
        }`
      : undefined;

  return {
    id: options.id,
    type: options.type,
    title: options.title,
    description: options.description,
    path: options.path,
    lineStart: options.lineStart,
    lineEnd: options.lineEnd,
    code: options.code,
    repositoryUrl: options.repositoryUrl,
    fileUrl,
    metadata: options.metadata,
    branch: options.branch || 'main',
  };
}

export function createEvidenceId(
  category: string,
  path: string,
  suffix?: string
): string {
  const normalizedPath = path
    .replace(/[^a-zA-Z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
    .toLowerCase();

  return [
    category,
    normalizedPath,
    suffix,
  ]
    .filter(Boolean)
    .join(':');
}

export function extractLineRange(
  content: string,
  matcher: RegExp | string
): {
  lineStart?: number;
  lineEnd?: number;
  code?: string;
} {
  const lines = content.split('\n');

  const index =
    typeof matcher === 'string'
      ? lines.findIndex((line) =>
          line.includes(matcher)
        )
      : lines.findIndex((line) =>
          matcher.test(line)
        );

  if (index < 0) {
    return {};
  }

  const lineStart = index + 1;

  return {
    lineStart,
    lineEnd: lineStart,
    code: lines[index].trim(),
  };
}
