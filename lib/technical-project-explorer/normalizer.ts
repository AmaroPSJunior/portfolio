import type {
  TechnicalFile,
} from './types';

const LANGUAGE_BY_EXTENSION: Record<
  string,
  string
> = {
  '.ts': 'TypeScript',
  '.tsx': 'TypeScript React',
  '.js': 'JavaScript',
  '.jsx': 'JavaScript React',
  '.mjs': 'JavaScript',
  '.cjs': 'JavaScript',
  '.java': 'Java',
  '.kt': 'Kotlin',
  '.py': 'Python',
  '.go': 'Go',
  '.rs': 'Rust',
  '.rb': 'Ruby',
  '.php': 'PHP',
  '.cs': 'C#',
  '.cpp': 'C++',
  '.c': 'C',
  '.sql': 'SQL',
  '.css': 'CSS',
  '.scss': 'SCSS',
  '.html': 'HTML',
  '.json': 'JSON',
  '.yaml': 'YAML',
  '.yml': 'YAML',
  '.md': 'Markdown',
  '.xml': 'XML',
  '.sh': 'Shell',
};

const CATEGORY_BY_PATH = (
  path: string
): TechnicalFile['category'] => {
  const normalized = path.toLowerCase();

  if (
    normalized.startsWith('.github/workflows/')
  ) {
    return 'github-actions';
  }

  if (
    normalized.includes('test') ||
    normalized.includes('spec')
  ) {
    return 'testing';
  }

  if (
    normalized.includes('migration') ||
    normalized.endsWith('.sql') ||
    normalized.includes('schema')
  ) {
    return 'database';
  }

  if (
    normalized.includes('/api/') ||
    normalized.startsWith('api/')
  ) {
    return 'api';
  }

  if (
    normalized.includes('security') ||
    normalized.includes('auth')
  ) {
    return 'security';
  }

  if (
    normalized.includes('service') ||
    normalized.includes('repository') ||
    normalized.includes('controller')
  ) {
    return 'implementation';
  }

  return 'code';
};

export function getFileExtension(
  path: string
): string | undefined {
  const name = path.split('/').pop() || path;

  if (!name.includes('.')) {
    return undefined;
  }

  const extension =
    name.substring(name.lastIndexOf('.'));

  return extension.toLowerCase();
}

export function getFileName(
  path: string
): string {
  return path.split('/').pop() || path;
}

export function detectLanguage(
  path: string
): string | undefined {
  const extension = getFileExtension(path);

  if (!extension) {
    return undefined;
  }

  return LANGUAGE_BY_EXTENSION[extension];
}

export function countLines(
  content?: string
): number | undefined {
  if (content === undefined) {
    return undefined;
  }

  if (!content) {
    return 0;
  }

  return content.split('\n').length;
}

export function normalizeFile(
  file: TechnicalFile
): TechnicalFile {
  return {
    ...file,
    name: file.name || getFileName(file.path),
    extension:
      file.extension || getFileExtension(file.path),
    language:
      file.language || detectLanguage(file.path),
    lines:
      file.lines !== undefined
        ? file.lines
        : countLines(file.content),
    category:
      file.category || CATEGORY_BY_PATH(file.path),
  };
}

export function normalizeFiles(
  files: TechnicalFile[]
): TechnicalFile[] {
  return files
    .map(normalizeFile)
    .sort((a, b) =>
      a.path.localeCompare(b.path)
    );
}
