import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json({
    status: 'ok',
    framework: 'Next.js 15 (App Router)',
    runtime: 'Node.js / Bun',
    timestamp: new Date().toISOString(),
  });
}
