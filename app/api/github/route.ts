import { NextRequest, NextResponse } from 'next/server';
import { AppLogger } from '@/lib/logger';
import { handleApiError, NetworkError } from '@/lib/errorHandler';

export async function GET(request: NextRequest) {
  const scope = 'github:GET';
  const { searchParams } = new URL(request.url);
  const owner = searchParams.get('owner') || 'amaropedro';
  const repo = searchParams.get('repo') || 'painel-homologacao';

  try {
    AppLogger.info(scope, `Buscando repositório GitHub: ${owner}/${repo}`);

    const res = await fetch(`https://api.github.com/repos/${owner}/${repo}`, {
      headers: {
        Accept: 'application/vnd.github.v3+json',
        'User-Agent': 'NextJS-Portfolio-App',
      },
      next: { revalidate: 60 },
    });

    if (!res.ok) {
      AppLogger.warn(scope, `Erro na API do GitHub status=${res.status}`, {
        owner,
        repo,
        statusText: res.statusText,
      });
      return NextResponse.json(
        { error: `Erro na API do GitHub (${res.status}): ${res.statusText}` },
        { status: res.status }
      );
    }

    const data = await res.json();
    AppLogger.info(scope, `Repositório ${owner}/${repo} retornado com sucesso`, {
      stars: data.stargazers_count,
      forks: data.forks_count,
    });
    return NextResponse.json(data);
  } catch (error: any) {
    return handleApiError(
      new NetworkError(`Erro ao conectar à API do GitHub: ${error.message}`, error),
      scope,
      { owner, repo }
    );
  }
}
