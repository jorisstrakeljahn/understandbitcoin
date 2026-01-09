import Fuse, { IFuseOptions, FuseResultMatch } from 'fuse.js';
import { ContentIndex, getContentIndex } from '../content/loader';

export interface SearchResult extends ContentIndex {
  matchedOn: ('title' | 'summary' | 'tags')[];
  highlights: {
    title?: string;
    summary?: string;
  };
  score?: number;
}

// Fuse.js configuration for fuzzy search
const fuseOptions: IFuseOptions<ContentIndex> = {
  keys: [
    { name: 'title', weight: 3 },      // Title matches are most important
    { name: 'summary', weight: 2 },    // Summary is second
    { name: 'tags', weight: 1.5 },     // Tags are useful
  ],
  threshold: 0.4,          // 0 = perfect match, 1 = match anything (0.4 = reasonable fuzzy)
  distance: 100,           // How far to search for a fuzzy match
  includeScore: true,      // Include match score
  includeMatches: true,    // Include what matched
  minMatchCharLength: 2,   // Minimum characters to match
  ignoreLocation: true,    // Don't consider where the match occurs
  useExtendedSearch: true, // Enable extended search operators
};

let fuseInstance: Fuse<ContentIndex> | null = null;
let cachedIndex: ContentIndex[] | null = null;

function getFuseInstance(): Fuse<ContentIndex> {
  const currentIndex = getContentIndex('en');
  
  // Rebuild if index changed or not initialized
  if (!fuseInstance || cachedIndex !== currentIndex) {
    cachedIndex = currentIndex;
    fuseInstance = new Fuse(currentIndex, fuseOptions);
  }
  
  return fuseInstance;
}

function highlightMatches(text: string, matches: readonly FuseResultMatch[] | undefined, key: string): string | undefined {
  if (!matches) return undefined;
  
  const keyMatches = matches.filter(m => m.key === key);
  if (keyMatches.length === 0) return undefined;

  let result = text;
  const indices = keyMatches[0].indices || [];
  
  // Sort indices in reverse order to avoid offset issues when inserting tags
  const sortedIndices = [...indices].sort((a, b) => b[0] - a[0]);
  
  for (const [start, end] of sortedIndices) {
    result = result.slice(0, start) + '<mark>' + result.slice(start, end + 1) + '</mark>' + result.slice(end + 1);
  }
  
  return result;
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

  const fuse = getFuseInstance();
  const searchResults = fuse.search(query);

  let results: SearchResult[] = searchResults.map(result => {
    const item = result.item;
    const matchedOn: ('title' | 'summary' | 'tags')[] = [];
    
    // Determine what matched
    if (result.matches) {
      for (const match of result.matches) {
        if (match.key === 'title') matchedOn.push('title');
        if (match.key === 'summary') matchedOn.push('summary');
        if (match.key === 'tags') matchedOn.push('tags');
      }
    }
    
    return {
      ...item,
      matchedOn: [...new Set(matchedOn)], // Remove duplicates
      highlights: {
        title: highlightMatches(item.title, result.matches, 'title'),
        summary: highlightMatches(item.summary, result.matches, 'summary'),
      },
      score: result.score,
    };
  });

  // Apply filters after fuzzy search
  if (options?.topic) {
    results = results.filter(r => r.topic === options.topic);
  }
  if (options?.type) {
    results = results.filter(r => r.type === options.type);
  }
  if (options?.level) {
    results = results.filter(r => r.level === options.level);
  }

  // Apply limit
  if (options?.limit) {
    results = results.slice(0, options.limit);
  }

  return results;
}

export function getSearchSuggestions(query: string, limit: number = 5): string[] {
  if (!query.trim() || query.length < 2) {
    return [];
  }

  const fuse = getFuseInstance();
  const results = fuse.search(query, { limit: limit * 2 });
  
  const suggestions = new Set<string>();

  // Add matching titles
  for (const result of results) {
    if (suggestions.size >= limit) break;
    suggestions.add(result.item.title);
  }

  // Add matching tags
  for (const result of results) {
    if (suggestions.size >= limit) break;
    for (const tag of result.item.tags) {
      if (tag.toLowerCase().includes(query.toLowerCase())) {
        suggestions.add(tag);
      }
    }
  }

  return Array.from(suggestions).slice(0, limit);
}

// Get "Did you mean?" suggestions for possible typos
export function getDidYouMean(query: string): string | null {
  if (!query.trim() || query.length < 3) {
    return null;
  }

  const fuse = getFuseInstance();
  const results = fuse.search(query, { limit: 1 });
  
  // If there's a result with a decent score but it's not an exact match
  if (results.length > 0 && results[0].score && results[0].score > 0.1 && results[0].score < 0.6) {
    const matchedTitle = results[0].item.title;
    // Only suggest if the title is meaningfully different
    if (matchedTitle.toLowerCase() !== query.toLowerCase()) {
      return matchedTitle;
    }
  }
  
  return null;
}

// Build search index for client-side usage
export function buildSearchIndex(): ContentIndex[] {
  return getContentIndex('en');
}

// Get trending/popular searches (stub - would use analytics in production)
export function getTrendingSearches(): string[] {
  return [
    'What is Bitcoin?',
    'Bitcoin energy',
    'Ponzi scheme',
    'Lightning Network',
    'Bitcoin vs gold',
  ];
}
