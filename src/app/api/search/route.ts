import { NextRequest, NextResponse } from 'next/server';
import { searchContent } from '@/lib/search';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const query = searchParams.get('q') || '';
  const topic = searchParams.get('topic') || undefined;
  const type = searchParams.get('type') || undefined;
  const level = searchParams.get('level') || undefined;
  const limit = searchParams.get('limit') ? parseInt(searchParams.get('limit')!) : undefined;

  const results = searchContent(query, {
    topic,
    type,
    level,
    limit,
  });

  return NextResponse.json({ results, query });
}
