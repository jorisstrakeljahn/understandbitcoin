import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { searchContent } from '@/lib/search';
import { TopicSchema, ContentTypeSchema, ContentLevelSchema } from '@/lib/content/schema';
import { getTopicConfig, getLevelConfig } from '@/lib/content/loader';

const SearchParamsSchema = z.object({
  q: z.string().default(''),
  topic: TopicSchema.optional(),
  type: ContentTypeSchema.optional(),
  level: ContentLevelSchema.optional(),
  limit: z.coerce.number().int().positive().max(100).optional(),
  locale: z.string().default('en'),
});

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  
  const parseResult = SearchParamsSchema.safeParse({
    q: searchParams.get('q') ?? '',
    topic: searchParams.get('topic') ?? undefined,
    type: searchParams.get('type') ?? undefined,
    level: searchParams.get('level') ?? undefined,
    limit: searchParams.get('limit') ?? undefined,
    locale: searchParams.get('locale') ?? 'en',
  });

  if (!parseResult.success) {
    return NextResponse.json(
      { error: 'Invalid search parameters', details: parseResult.error.flatten() },
      { status: 400 }
    );
  }

  const { q: query, topic, type, level, limit, locale } = parseResult.data;

  const results = searchContent(query, {
    topic,
    type,
    level,
    limit,
  });

  // Enrich results with localized labels
  const enrichedResults = results.map(result => ({
    ...result,
    topicLabel: getTopicConfig(result.topic, locale).label,
    levelLabel: getLevelConfig(result.level, locale).label,
    levelColor: getLevelConfig(result.level, locale).color,
  }));

  return NextResponse.json({ results: enrichedResults, query });
}
