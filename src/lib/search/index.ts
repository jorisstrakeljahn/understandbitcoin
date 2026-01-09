import { ContentIndex, getContentIndex } from '../content/loader';

export interface SearchResult extends ContentIndex {
  matchedOn: ('title' | 'summary' | 'tags')[];
  highlights: {
    title?: string;
    summary?: string;
  };
}

function escapeRegex(str: string): string {
  return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function highlightMatch(text: string, query: string): string {
  const escaped = escapeRegex(query);
  const regex = new RegExp(`(${escaped})`, 'gi');
  return text.replace(regex, '<mark>$1</mark>');
}

export function searchContent(
  query: string,
  options?: {
    topic?: string;
    type?: string;
    level?: string;
    limit?: number;
  }
): SearchResult[] {
  if (!query.trim()) {
    return [];
  }

  const allContent = getContentIndex('en');
  const normalizedQuery = query.toLowerCase().trim();
  const queryWords = normalizedQuery.split(/\s+/);

  let results: SearchResult[] = [];

  for (const item of allContent) {
    // Apply filters
    if (options?.topic && item.topic !== options.topic) continue;
    if (options?.type && item.type !== options.type) continue;
    if (options?.level && item.level !== options.level) continue;

    const matchedOn: ('title' | 'summary' | 'tags')[] = [];
    let score = 0;

    // Check title
    const titleLower = item.title.toLowerCase();
    if (queryWords.some(word => titleLower.includes(word))) {
      matchedOn.push('title');
      // Higher score for title matches
      if (titleLower.includes(normalizedQuery)) {
        score += 10;
      } else {
        score += queryWords.filter(word => titleLower.includes(word)).length * 3;
      }
    }

    // Check summary
    const summaryLower = item.summary.toLowerCase();
    if (queryWords.some(word => summaryLower.includes(word))) {
      matchedOn.push('summary');
      score += queryWords.filter(word => summaryLower.includes(word)).length * 2;
    }

    // Check tags
    const tagsLower = item.tags.map(t => t.toLowerCase());
    if (queryWords.some(word => tagsLower.some(tag => tag.includes(word)))) {
      matchedOn.push('tags');
      score += queryWords.filter(word => 
        tagsLower.some(tag => tag.includes(word))
      ).length * 2;
    }

    if (matchedOn.length > 0) {
      results.push({
        ...item,
        matchedOn,
        highlights: {
          title: matchedOn.includes('title') 
            ? highlightMatch(item.title, query) 
            : undefined,
          summary: matchedOn.includes('summary') 
            ? highlightMatch(item.summary, query) 
            : undefined,
        },
        // @ts-expect-error - adding score for sorting
        _score: score,
      });
    }
  }

  // Sort by score
  results.sort((a, b) => {
    // @ts-expect-error - score was added above
    return (b._score || 0) - (a._score || 0);
  });

  // Remove internal score
  results = results.map(({ ...rest }) => {
    // @ts-expect-error - removing score
    delete rest._score;
    return rest;
  });

  if (options?.limit) {
    results = results.slice(0, options.limit);
  }

  return results;
}

export function getSearchSuggestions(query: string, limit: number = 5): string[] {
  if (!query.trim() || query.length < 2) {
    return [];
  }

  const allContent = getContentIndex('en');
  const normalizedQuery = query.toLowerCase().trim();
  
  const suggestions = new Set<string>();

  // Add matching titles
  for (const item of allContent) {
    if (item.title.toLowerCase().includes(normalizedQuery)) {
      suggestions.add(item.title);
    }
  }

  // Add matching tags
  for (const item of allContent) {
    for (const tag of item.tags) {
      if (tag.toLowerCase().includes(normalizedQuery)) {
        suggestions.add(tag);
      }
    }
  }

  return Array.from(suggestions).slice(0, limit);
}

// Build search index for client-side usage
export function buildSearchIndex(): ContentIndex[] {
  return getContentIndex('en');
}
