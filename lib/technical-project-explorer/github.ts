import type {
  TechnicalFile,
  TechnicalRepositorySnapshot,
} from './types';

const GITHUB_API =
  'https://api.github.com';

const GITHUB_HEADERS = {
  Accept: 'application/vnd.github+json',
  'User-Agent': 'NextJS-Portfolio-App',
  'X-GitHub-Api-Version': '2026-03-10',
};

const MAX_FILES = 300;

const MAX_CONTENT_FILES = 120;

const MAX_CONTENT_SIZE = 500_000;

interface GitTreeItem {
  path: string;
  mode: string;
  type: 'blob' | 'tree' | 'commit';
  sha: string;
  size?: number;
  url?: string;
}

interface GitTreeResponse {
  sha: string;
  tree: GitTreeItem[];
  truncated: boolean;
}

interface RepositoryResponse {
  default_branch?: string;
  html_url: string;
}

interface ContentResponse {
  type: 'file' | 'dir' | 'symlink' | 'submodule';
  name: string;
  path: string;
  sha: string;
  size?: number;
  content?: string;
  encoding?: string;
  html_url?: string;
  download_url?: string;
}

async function githubFetch<T>(
  url: string
): Promise<T> {
  const response = await fetch(url, {
    headers: GITHUB_HEADERS,
    next: {
      revalidate: 300,
    },
  });

  if (!response.ok) {
    throw new Error(
      `GitHub API ${response.status}: ${response.statusText}`
    );
  }

  return response.json() as Promise<T>;
}

function shouldLoadContent(
  path: string
): boolean {
  const normalized = path.toLowerCase();

  if (
    normalized.startsWith('.git/') ||
    normalized.startsWith('node_modules/') ||
    normalized.startsWith('dist/') ||
    normalized.startsWith('build/') ||
    normalized.startsWith('.next/')
  ) {
    return false;
  }

  if (
    normalized.endsWith('.png') ||
    normalized.endsWith('.jpg') ||
    normalized.endsWith('.jpeg') ||
    normalized.endsWith('.gif') ||
    normalized.endsWith('.webp') ||
    normalized.endsWith('.ico') ||
    normalized.endsWith('.woff') ||
    normalized.endsWith('.woff2') ||
    normalized.endsWith('.zip') ||
    normalized.endsWith('.pdf')
  ) {
    return false;
  }

  return true;
}

function decodeGithubContent(
  content?: string,
  encoding?: string
): string | undefined {
  if (!content) {
    return undefined;
  }

  if (encoding !== 'base64') {
    return content;
  }

  try {
    return Buffer.from(
      content.replace(/\n/g, ''),
      'base64'
    ).toString('utf-8');
  } catch {
    return undefined;
  }
}

async function getRepository(
  owner: string,
  repo: string
): Promise<RepositoryResponse> {
  return githubFetch<RepositoryResponse>(
    `${GITHUB_API}/repos/${encodeURIComponent(
      owner
    )}/${encodeURIComponent(repo)}`
  );
}

async function getTree(
  owner: string,
  repo: string,
  branch: string
): Promise<GitTreeResponse> {
  return githubFetch<GitTreeResponse>(
    `${GITHUB_API}/repos/${encodeURIComponent(
      owner
    )}/${encodeURIComponent(repo)}/git/trees/${encodeURIComponent(
      branch
    )}?recursive=1`
  );
}

async function getFileContent(
  owner: string,
  repo: string,
  path: string,
  branch: string
): Promise<ContentResponse> {
  return githubFetch<ContentResponse>(
    `${GITHUB_API}/repos/${encodeURIComponent(
      owner
    )}/${encodeURIComponent(repo)}/contents/${path
      .split('/')
      .map(encodeURIComponent)
      .join('/')}?ref=${encodeURIComponent(branch)}`
  );
}

export async function getTechnicalRepositorySnapshot(
  owner: string,
  repo: string
): Promise<TechnicalRepositorySnapshot> {
  const repository =
    await getRepository(owner, repo);

  const branch =
    repository.default_branch || 'main';

  const tree =
    await getTree(owner, repo, branch);

  const blobs = tree.tree
    .filter((item) => item.type === 'blob')
    .slice(0, MAX_FILES);

  const files: TechnicalFile[] =
    blobs.map((item) => ({
      path: item.path,
      name:
        item.path.split('/').pop() ||
        item.path,
      type: 'file',
      size: item.size,
      sha: item.sha,
      url: item.url,
    }));

  const contentCandidates = blobs
    .filter((item) =>
      shouldLoadContent(item.path)
    )
    .filter(
      (item) =>
        !item.size ||
        item.size <= MAX_CONTENT_SIZE
    )
    .slice(0, MAX_CONTENT_FILES);

  await Promise.all(
    contentCandidates.map(async (item) => {
      try {
        const content =
          await getFileContent(
            owner,
            repo,
            item.path,
            branch
          );

        const decoded =
          decodeGithubContent(
            content.content,
            content.encoding
          );

        const target = files.find(
          (file) =>
            file.path === item.path
        );

        if (target && decoded !== undefined) {
          target.content = decoded;
          target.lines =
            decoded.split('\n').length;
          target.url =
            content.html_url ||
            target.url;
        }
      } catch {
        // Falha em um arquivo individual
        // não deve invalidar toda a análise.
      }
    })
  );

  return {
    owner,
    repo,
    branch,
    repositoryUrl:
      repository.html_url ||
      `https://github.com/${owner}/${repo}`,
    files,
    truncated:
      tree.truncated ||
      tree.tree.length > MAX_FILES,
    generatedAt:
      new Date().toISOString(),
  };
}
