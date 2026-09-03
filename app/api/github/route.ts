import { NextRequest, NextResponse } from 'next/server';
import { AppLogger } from '@/lib/logger';
import { handleApiError, NetworkError } from '@/lib/errorHandler';
import { getTechnicalRepositorySnapshot } from '@/lib/technical-project-explorer/github';
import { analyzeRepository } from '@/lib/technical-project-explorer/analyzer';
import { enrichTechnologyNames } from '@/lib/technology-metadata';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  const scope = 'github:GET';
  const { searchParams } = new URL(request.url);
  const owner = searchParams.get('owner') || 'AmaroPSJunior';
  const repo = searchParams.get('repo');
  const technical = searchParams.get('technical') === 'true';

  if (technical && repo) {
    try {
      AppLogger.info(
        scope,
        `Analisando tecnicamente o repositório: ${owner}/${repo}`
      );

      const snapshot =
        await getTechnicalRepositorySnapshot(
          owner,
          repo
        );

      const analysis =
        analyzeRepository(
          snapshot
        );

      const technologyNames = [
        ...(analysis.frameworks ?? []).map(
          (framework) => framework.name
        ),
        ...(analysis.database?.technologies ?? []),
        ...(analysis.cicd?.provider
          ? [analysis.cicd.provider]
          : []),
      ];

      const technologyMetadata =
        await enrichTechnologyNames(
          technologyNames
        );

      const enrichedAnalysis = {
        ...analysis,

        frameworks: (analysis.frameworks ?? []).map(
          (framework) => ({
            ...framework,
            iconUrl:
              technologyMetadata[framework.name]
                ?.iconUrl,
            description:
              technologyMetadata[framework.name]
                ?.description,
          })
        ),

        database: analysis.database
          ? {
              ...analysis.database,
              technologies:
                analysis.database.technologies,
              technologyMetadata:
                Object.fromEntries(
                  analysis.database.technologies.map(
                    (technology) => [
                      technology,
                      technologyMetadata[technology],
                    ]
                  )
                ),
            }
          : analysis.database,
      };


      return NextResponse.json({
        repository: {
          owner,
          repo,
        },
        snapshot: {
          branch: snapshot.branch,
          repositoryUrl:
            snapshot.repositoryUrl,
          fileCount:
            snapshot.files.length,
          truncated:
            snapshot.truncated,
        },
        analysis: enrichedAnalysis,
      });
    } catch (error) {
      AppLogger.warn(
        scope,
        'Erro na análise técnica do GitHub',
        {
          owner,
          repo,
          error:
            error instanceof Error
              ? error.message
              : String(error),
        }
      );

      return NextResponse.json(
        {
          error:
            error instanceof Error
              ? error.message
              : 'Não foi possível analisar tecnicamente o repositório.',
        },
        {
          status: 502,
        }
      );
    }
  }

  try {
    if (repo) {
      AppLogger.info(scope, `Buscando repositório GitHub: ${owner}/${repo}`);

      const res = await fetch(
        `https://api.github.com/repos/${encodeURIComponent(owner)}/${encodeURIComponent(repo)}`,
        {
          headers: {
            Accept: 'application/vnd.github.v3+json',
            'User-Agent': 'NextJS-Portfolio-App',
          },
          next: { revalidate: 60 },
        }
      );

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
    }

    AppLogger.info(scope, `Listando repositórios GitHub do usuário: ${owner}`);

    const res = await fetch(
      `https://api.github.com/users/${encodeURIComponent(owner)}/repos?per_page=100&sort=created&direction=desc`,
      {
        headers: {
          Accept: 'application/vnd.github.v3+json',
          'User-Agent': 'NextJS-Portfolio-App',
        },
        next: { revalidate: 60 },
      }
    );

    if (!res.ok) {
      AppLogger.warn(scope, `Erro ao listar repositórios GitHub status=${res.status}`, {
        owner,
        statusText: res.statusText,
      });

      return NextResponse.json(
        { error: `Erro na API do GitHub (${res.status}): ${res.statusText}` },
        { status: res.status }
      );
    }

    const data = await res.json();

    const projects = Array.isArray(data)
      ? data.map((repository) => ({
          id: repository.id,
          name: repository.name,
          full_name: repository.full_name,
          private: repository.private,
          html_url: repository.html_url,
          description: repository.description || '',
          created_at: repository.created_at,
          updated_at: repository.updated_at,
          pushed_at: repository.pushed_at,
          language: repository.language || undefined,
        }))
      : [];

    AppLogger.info(
      scope,
      `${projects.length} repositório(s) GitHub retornado(s) com sucesso`,
      { owner }
    );

    return NextResponse.json({
      owner,
      projects,
    });
  } catch (error: any) {
    return handleApiError(
      new NetworkError(`Erro ao conectar à API do GitHub: ${error.message}`, error),
      scope,
      { owner, repo }
    );
  }
}
