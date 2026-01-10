import { Suspense } from 'react';
import Link from 'next/link';
import { setRequestLocale, getTranslations } from 'next-intl/server';
import { Badge } from '@/components/ui';
import { searchContent } from '@/lib/search';
import { getAllTopicsFromConfig, getTopicConfig, getLevelConfig } from '@/lib/content/loader';
import { TopicIcon, ArrowRight, Search } from '@/components/icons';
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
  
  const results = searchContent(query, {
    topic: topic && topic !== 'all' ? topic : undefined,
    level: level && level !== 'all' ? level : undefined,
  });

  if (results.length === 0) {
    return (
      <div className={styles.noResults}>
        <div className={styles.noResultsIcon}>
          <Search size={48} />
        </div>
        <h2 className={styles.noResultsTitle}>{t('noResults')}</h2>
        <p className={styles.noResultsHint}>{t('tryDifferent')}</p>
        <Link href={`/${locale}/topics`} className={styles.browseLink}>
          {locale === 'de' ? 'Themen durchsuchen' : 'Browse topics'}
          <ArrowRight size={16} />
        </Link>
      </div>
    );
  }

  return (
    <div className={styles.results}>
      <p className={styles.resultsCount}>
        <span className={styles.resultsNumber}>{results.length}</span> {t('resultsFor')} <span className={styles.resultsQuery}>&ldquo;{query}&rdquo;</span>
      </p>
      
      <div className={styles.resultsList}>
        {results.map((result) => {
          const topicConfig = getTopicConfig(result.topic, locale);
          const levelConfig = getLevelConfig(result.level, locale);
          
          return (
            <Link 
              key={result.slug} 
              href={`/${locale}/articles/${result.slug}`}
              className={styles.resultCard}
            >
              <div className={styles.resultIcon}>
                <TopicIcon topic={result.topic} size={24} />
              </div>
              <div className={styles.resultContent}>
                <div className={styles.resultMeta}>
                  <Badge variant="accent">
                    {topicConfig.label}
                  </Badge>
                  <Badge variant="default" style={{ color: levelConfig.color }}>
                    {levelConfig.label}
                  </Badge>
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
              </div>
              <div className={styles.resultArrow}>
                <ArrowRight size={20} />
              </div>
            </Link>
          );
        })}
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
  
  // Get topics from config
  const topicsFromConfig = getAllTopicsFromConfig(locale);

  return (
    <div className={styles.page}>
      <div className={styles.container}>
        <header className={styles.header}>
          <h1 className={styles.title}>{t('title')}</h1>
          
          <form className={styles.searchForm} action={`/${locale}/search`} method="get">
            <div className={styles.searchInputWrapper}>
              <Search size={20} className={styles.searchIcon} />
              <input 
                type="search" 
                name="q" 
                defaultValue={q || ''} 
                placeholder={t('placeholder')}
                className={styles.searchInput}
                autoFocus
              />
            </div>
          </form>
        </header>

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
              {topicsFromConfig.map((topicItem) => (
                <Link
                  key={topicItem.id}
                  href={`/${locale}/search?q=${q || ''}&topic=${topicItem.id}&level=${level || ''}`}
                  className={`${styles.filterTag} ${topic === topicItem.id ? styles.filterTagActive : ''}`}
                >
                  <TopicIcon topic={topicItem.id} size={14} />
                  {topicItem.label}
                </Link>
              ))}
            </div>
          </div>
        </div>

        {q ? (
          <Suspense fallback={
            <div className={styles.loading}>
              <div className={styles.loadingSpinner} />
              {locale === 'de' ? 'Suche...' : 'Searching...'}
            </div>
          }>
            <SearchResults locale={locale} query={q} topic={topic} level={level} />
          </Suspense>
        ) : (
          <div className={styles.emptyState}>
            <div className={styles.emptyIcon}>
              <Search size={48} />
            </div>
            <p className={styles.emptyText}>
              {locale === 'de' ? 'Gib einen Suchbegriff ein, um loszulegen.' : 'Enter a search term to get started.'}
            </p>
            <Link href={`/${locale}/topics`} className={styles.browseLink}>
              {locale === 'de' ? 'Oder Themen durchsuchen' : 'Or browse topics'}
              <ArrowRight size={16} />
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
