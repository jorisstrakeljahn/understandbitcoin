import { setRequestLocale, getTranslations } from 'next-intl/server';
import Link from 'next/link';
import { FileText, BookOpen, Video, Filter, ArrowRight } from '@/components/icons';
import { getAllBooks, getAllVideos, getAllArticles } from '@/lib/sources/loader';
import { Source } from '@/lib/sources/types';
import { SourceCard } from '@/components/sources';
import { Badge } from '@/components/ui';
import styles from './sources.module.css';

interface SourcesPageProps {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ type?: string; topic?: string; level?: string }>;
}

export async function generateMetadata({ params }: SourcesPageProps) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'sources' });
  
  return {
    title: t('title'),
    description: t('subtitle'),
  };
}

export default async function SourcesPage({ params, searchParams }: SourcesPageProps) {
  const { locale } = await params;
  const { type, topic, level } = await searchParams;
  setRequestLocale(locale);
  
  const t = await getTranslations({ locale, namespace: 'sources' });

  // Get all sources
  const books = getAllBooks();
  const videos = getAllVideos();
  const articles = getAllArticles();

  // Combine and filter
  let allSources: Source[] = [...books, ...videos, ...articles];

  // Filter by type
  if (type && type !== 'all') {
    allSources = allSources.filter((s) => s.type === type);
  }

  // Filter by topic
  if (topic && topic !== 'all') {
    allSources = allSources.filter((s) => s.topics.includes(topic));
  }

  // Filter by level
  if (level && level !== 'all') {
    allSources = allSources.filter((s) => s.level === level);
  }

  // Sort: featured first, then by year (newest first)
  allSources.sort((a, b) => {
    if (a.featured && !b.featured) return -1;
    if (!a.featured && b.featured) return 1;
    return b.year - a.year;
  });

  const CATEGORIES = [
    { 
      id: 'all',
      icon: Filter, 
      label: t('all'), 
      count: books.length + videos.length + articles.length 
    },
    { 
      id: 'book',
      icon: BookOpen, 
      label: t('books'), 
      count: books.length 
    },
    { 
      id: 'video',
      icon: Video, 
      label: t('videos'), 
      count: videos.length 
    },
    { 
      id: 'article',
      icon: FileText, 
      label: t('articles'), 
      count: articles.length 
    },
  ];

  const LEVELS = [
    { id: 'all', label: t('allLevels') },
    { id: 'beginner', label: locale === 'de' ? 'Beginner' : 'Beginner' },
    { id: 'intermediate', label: locale === 'de' ? 'Fortgeschritten' : 'Intermediate' },
    { id: 'advanced', label: locale === 'de' ? 'Experte' : 'Advanced' },
  ];

  const currentType = type || 'all';
  const currentLevel = level || 'all';

  return (
    <div className={styles.page} data-testid="sources-page">
      <div className={styles.container}>
        <header className={styles.header}>
          <h1 className={styles.title} data-testid="sources-title">{t('title')}</h1>
          <p className={styles.subtitle}>{t('subtitle')}</p>
        </header>

        {/* Category Tabs */}
        <div className={styles.filters} data-testid="sources-filters">
          <div className={styles.categoryTabs}>
            {CATEGORIES.map((category) => {
              const IconComponent = category.icon;
              const isActive = currentType === category.id;
              return (
                <Link
                  key={category.id}
                  href={`/${locale}/sources?type=${category.id}&level=${currentLevel}`}
                  className={`${styles.categoryTab} ${isActive ? styles.categoryTabActive : ''}`}
                  data-testid={`sources-filter-${category.id}`}
                >
                  <IconComponent size={18} />
                  <span>{category.label}</span>
                  <Badge variant={isActive ? 'accent' : 'default'} className={styles.countBadge}>
                    {category.count}
                  </Badge>
                </Link>
              );
            })}
          </div>

          {/* Level Filter */}
          <div className={styles.levelFilter}>
            {LEVELS.map((lvl) => {
              const isActive = currentLevel === lvl.id;
              return (
                <Link
                  key={lvl.id}
                  href={`/${locale}/sources?type=${currentType}&level=${lvl.id}`}
                  className={`${styles.levelChip} ${isActive ? styles.levelChipActive : ''}`}
                >
                  {lvl.label}
                </Link>
              );
            })}
          </div>
        </div>

        {/* Sources Grid */}
        {allSources.length > 0 ? (
          <div className={styles.sourcesGrid} data-testid="sources-grid">
            {allSources.map((source) => (
              <SourceCard key={source.id} source={source} locale={locale} />
            ))}
          </div>
        ) : (
          <div className={styles.emptyState}>
            <p>{t('noResults')}</p>
            <Link href={`/${locale}/sources`} className={styles.resetLink}>
              {t('resetFilters')} <ArrowRight size={14} />
            </Link>
          </div>
        )}

        {/* Affiliate Disclaimer */}
        <footer className={styles.disclaimer}>
          <p>{t('affiliateDisclaimer')}</p>
        </footer>
      </div>
    </div>
  );
}
