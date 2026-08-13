import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const owner = searchParams.get('owner') || 'amaropedro';
  const repo = searchParams.get('repo') || 'painel-homologacao';

  try {
    const res = await fetch(`https://api.github.com/repos/${owner}/${repo}`, {
      headers: {
        Accept: 'application/vnd.github.v3+json',
        'User-Agent': 'NextJS-Portfolio-App',
      },
      next: { revalidate: 60 },
    });

    if (!res.ok) {
      return NextResponse.json(
        { error: `Erro na API do GitHub (${res.status}): ${res.statusText}` },
        { status: res.status }
      );
    }

    const data = await res.json();
    return NextResponse.json(data);
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Erro ao conectar ao GitHub' },
      { status: 500 }
    );
  }
}
