import { Suspense } from 'react';
import Link from 'next/link';
import { Badge } from '@/components/ui';
import { searchContent } from '@/lib/search';
import { TOPICS, LEVELS, Topic, ContentLevel } from '@/lib/content/schema';
import { TopicIcon, ArrowRight } from '@/components/icons';
import styles from './search.module.css';

interface SearchPageProps {
  searchParams: Promise<{ q?: string; topic?: string; level?: string }>;
}

export async function generateMetadata({ searchParams }: SearchPageProps) {
  const params = await searchParams;
  const query = params.q || '';
  
  return {
    title: query ? `Search: ${query}` : 'Search',
    description: 'Search the Therefor Bitcoin knowledge base.',
  };
}

export default async function SearchPage({ searchParams }: SearchPageProps) {
  const params = await searchParams;
  const query = params.q || '';
  const topicFilter = params.topic;
  const levelFilter = params.level;

  const results = query
    ? searchContent(query, {
        topic: topicFilter,
        level: levelFilter,
      })
    : [];

  return (
    <div className={styles.page}>
      <div className={styles.container}>
        {/* Header */}
        <header className={styles.header}>
          <h1 className={styles.title}>Search Results</h1>
          {query && (
            <p className={styles.queryInfo}>
              {results.length} result{results.length !== 1 ? 's' : ''} for &quot;{query}&quot;
            </p>
          )}
        </header>

        {/* Filters */}
        <div className={styles.filters}>
          <div className={styles.filterGroup}>
            <span className={styles.filterLabel}>Topic:</span>
            <div className={styles.filterOptions}>
              <Link
                href={`/search?q=${query}`}
                className={`${styles.filterOption} ${!topicFilter ? styles.active : ''}`}
              >
                All
              </Link>
              {(Object.keys(TOPICS) as Topic[]).slice(0, 5).map((key) => (
                <Link
                  key={key}
                  href={`/search?q=${query}&topic=${key}${levelFilter ? `&level=${levelFilter}` : ''}`}
                  className={`${styles.filterOption} ${topicFilter === key ? styles.active : ''}`}
                >
                  <TopicIcon topic={key} size={14} />
                  {TOPICS[key].label}
                </Link>
              ))}
            </div>
          </div>
        </div>

        {/* Results */}
        <Suspense fallback={<div className={styles.loading}>Searching...</div>}>
          {!query ? (
            <div className={styles.empty}>
              <p>Enter a search term to find articles.</p>
            </div>
          ) : results.length === 0 ? (
            <div className={styles.empty}>
              <h2>No results found</h2>
              <p>Try different keywords or browse topics instead.</p>
              <Link href="/topics" className={styles.browseLink}>
                Browse all topics <ArrowRight size={16} />
              </Link>
            </div>
          ) : (
            <div className={styles.results}>
              {results.map((result) => (
                <Link
                  key={result.slug}
                  href={`/articles/${result.slug}`}
                  className={styles.resultCard}
                >
                  <div className={styles.resultMeta}>
                    <Badge variant="accent">
                      <TopicIcon topic={result.topic as Topic} size={14} />
                      <span style={{ marginLeft: '4px' }}>
                        {TOPICS[result.topic as Topic]?.label}
                      </span>
                    </Badge>
                    <Badge
                      variant={
                        result.level === 'beginner' ? 'success' :
                        result.level === 'intermediate' ? 'warning' : 'error'
                      }
                    >
                      {LEVELS[result.level as ContentLevel]?.label}
                    </Badge>
                    <span className={styles.readTime}>{result.readTime} min</span>
                  </div>
                  <h2 
                    className={styles.resultTitle}
                    dangerouslySetInnerHTML={{
                      __html: result.highlights?.title || result.title
                    }}
                  />
                  <p 
                    className={styles.resultSummary}
                    dangerouslySetInnerHTML={{
                      __html: result.highlights?.summary || result.summary
                    }}
                  />
                  <div className={styles.resultTags}>
                    {result.tags.slice(0, 4).map((tag) => (
                      <span key={tag} className={styles.tag}>{tag}</span>
                    ))}
                  </div>
                </Link>
              ))}
            </div>
          )}
        </Suspense>
      </div>
    </div>
  );
}
