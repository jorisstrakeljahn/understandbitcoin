import { Suspense } from 'react';
import Link from 'next/link';
import { setRequestLocale, getTranslations } from 'next-intl/server';
import { Badge } from '@/components/ui';
import { searchContent } from '@/lib/search';
import { TOPICS, LEVELS } from '@/lib/content/schema';
import { TopicIcon, ArrowRight } from '@/components/icons';
import styles from './search.module.css';

interface SearchPageProps {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ q?: string; topic?: string; level?: string }>;
}

export async function generateMetadata({ params, searchParams }: SearchPageProps) {
  const { locale } = await params;
  const { q } = await searchParams;
  const t = await getTranslations({ locale, namespace: 'search' });
  
  return {
    title: q ? `${t('resultsFor')} "${q}"` : t('title'),
    description: locale === 'de' 
      ? 'Durchsuche die Therefor Bitcoin Wissensdatenbank.' 
      : 'Search the Therefor Bitcoin knowledge base.',
  };
}

async function SearchResults({ locale, query, topic, level }: { 
  locale: string;
  query: string; 
  topic?: string; 
  level?: string;
}) {
  const t = await getTranslations({ locale, namespace: 'search' });
  const tTopics = await getTranslations({ locale, namespace: 'topics' });
  
  const results = searchContent(query, {
    topic: topic && topic !== 'all' ? topic : undefined,
    level: level && level !== 'all' ? level : undefined,
  });

  if (results.length === 0) {
    return (
      <div className={styles.noResults}>
        <p>{t('noResults')}</p>
        <p className={styles.noResultsHint}>{t('tryDifferent')}</p>
      </div>
    );
  }

  return (
    <div className={styles.results}>
      <p className={styles.resultsCount}>
        {results.length} {t('resultsFor')} &ldquo;{query}&rdquo;
      </p>
      
      <div className={styles.resultsList}>
        {results.map((result) => (
          <Link 
            key={result.slug} 
            href={`/${locale}/articles/${result.slug}`}
            className={styles.resultCard}
          >
            <div className={styles.resultMeta}>
              <Badge variant="accent">
                <TopicIcon topic={result.topic} size={12} />
                <span style={{ marginLeft: '4px' }}>{tTopics(`${result.topic}.label`)}</span>
              </Badge>
              <Badge variant="default">{tTopics(result.level)}</Badge>
            </div>
            <h3 className={styles.resultTitle}>
              {result.highlights?.title ? (
                <span dangerouslySetInnerHTML={{ __html: result.highlights.title }} />
              ) : (
                result.title
              )}
            </h3>
            <p className={styles.resultSummary}>
              {result.highlights?.summary ? (
                <span dangerouslySetInnerHTML={{ __html: result.highlights.summary }} />
              ) : (
                result.summary
              )}
            </p>
            <span className={styles.resultLink}>
              {locale === 'de' ? 'Antwort lesen' : 'Read answer'} <ArrowRight size={14} />
            </span>
          </Link>
        ))}
      </div>
    </div>
  );
}

export default async function SearchPage({ params, searchParams }: SearchPageProps) {
  const { locale } = await params;
  const { q, topic, level } = await searchParams;
  setRequestLocale(locale);
  
  const t = await getTranslations({ locale, namespace: 'search' });
  const tTopics = await getTranslations({ locale, namespace: 'topics' });

  return (
    <div className={styles.page}>
      <div className={styles.container}>
        <header className={styles.header}>
          <h1 className={styles.title}>{t('title')}</h1>
          
          <form className={styles.searchForm} action={`/${locale}/search`} method="get">
            <input 
              type="search" 
              name="q" 
              defaultValue={q || ''} 
              placeholder={t('placeholder')}
              className={styles.searchInput}
              autoFocus
            />
          </form>

          {/* Filters */}
          <div className={styles.filters}>
            <div className={styles.filterGroup}>
              <span className={styles.filterLabel}>{tTopics('allTopics')}:</span>
              <div className={styles.filterTags}>
                <Link 
                  href={`/${locale}/search?q=${q || ''}&level=${level || ''}`}
                  className={`${styles.filterTag} ${!topic || topic === 'all' ? styles.filterTagActive : ''}`}
                >
                  {t('all')}
                </Link>
                {Object.keys(TOPICS).map((topicKey) => (
                  <Link
                    key={topicKey}
                    href={`/${locale}/search?q=${q || ''}&topic=${topicKey}&level=${level || ''}`}
                    className={`${styles.filterTag} ${topic === topicKey ? styles.filterTagActive : ''}`}
                  >
                    {tTopics(`${topicKey}.label`)}
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </header>

        {q ? (
          <Suspense fallback={<div className={styles.loading}>{locale === 'de' ? 'Laden...' : 'Loading...'}</div>}>
            <SearchResults locale={locale} query={q} topic={topic} level={level} />
          </Suspense>
        ) : (
          <div className={styles.emptyState}>
            <p>{locale === 'de' ? 'Gib einen Suchbegriff ein, um loszulegen.' : 'Enter a search term to get started.'}</p>
          </div>
        )}
      </div>
    </div>
  );
}
