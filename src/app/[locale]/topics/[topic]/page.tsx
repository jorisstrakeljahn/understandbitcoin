import { notFound } from 'next/navigation';
import Link from 'next/link';
import { setRequestLocale, getTranslations } from 'next-intl/server';
import { Topic } from '@/lib/content/schema';
import { getContentByTopic, getAllContent, getTopicConfig, getAllTopicsFromConfig, getContentConfig } from '@/lib/content/loader';
import { TopicIcon, ChevronRight, FileText } from '@/components/icons';
import styles from './topic.module.css';

interface TopicPageProps {
  params: Promise<{ locale: string; topic: string }>;
}

export async function generateMetadata({ params }: TopicPageProps) {
  const { locale, topic } = await params;
  const t = await getTranslations({ locale, namespace: 'topics' });
  const topicData = getTopicConfig(topic, locale);
  
  if (!topicData.label || topicData.label === topic) {
    return { title: locale === 'de' ? 'Thema nicht gefunden' : 'Topic Not Found' };
  }

  return {
    title: `${topicData.label} | ${t('documentation')}`,
    description: topicData.description,
  };
}

export function generateStaticParams() {
  const config = getContentConfig();
  return Object.keys(config.topics).map((topic) => ({ topic }));
}

export default async function TopicPage({ params }: TopicPageProps) {
  const { locale, topic } = await params;
  setRequestLocale(locale);
  
  const t = await getTranslations({ locale, namespace: 'topics' });
  const topicData = getTopicConfig(topic, locale);
  const topicsFromConfig = getAllTopicsFromConfig(locale);
  
  // Check if topic exists in config
  const topicExists = topicsFromConfig.some((t) => t.id === topic);
  if (!topicExists) {
    notFound();
  }

  const articles = getContentByTopic(topic as Topic, locale).length > 0 
    ? getContentByTopic(topic as Topic, locale) 
    : getContentByTopic(topic as Topic, 'en');
  const allArticles = getAllContent(locale).length > 0 ? getAllContent(locale) : getAllContent('en');

  // Group all articles by topic for sidebar
  const articlesByTopic = topicsFromConfig.reduce((acc, t) => {
    acc[t.id as Topic] = allArticles.filter((a) => a.frontmatter.topic === t.id);
    return acc;
  }, {} as Record<Topic, typeof allArticles>);

  // Group current topic articles by level
  const groupedArticles = {
    beginner: articles.filter((a) => a.frontmatter.level === 'beginner'),
    intermediate: articles.filter((a) => a.frontmatter.level === 'intermediate'),
    advanced: articles.filter((a) => a.frontmatter.level === 'advanced'),
  };

  return (
    <div className={styles.page}>
      <div className={styles.layout}>
        {/* Sidebar - File Tree Style */}
        <aside className={styles.sidebar}>
          <nav className={styles.sidebarNav}>
            <div className={styles.sidebarHeader}>
              <Link href={`/${locale}/topics`} className={styles.sidebarBack}>
                <span className={styles.sidebarTitle}>{t('documentation')}</span>
              </Link>
            </div>
            
            <div className={styles.fileTree}>
              {topicsFromConfig.map((topicItem) => {
                const topicArticles = articlesByTopic[topicItem.id as Topic] || [];
                const isActive = topicItem.id === topic;
                
                return (
                  <div key={topicItem.id} className={`${styles.treeSection} ${isActive ? styles.treeSectionActive : ''}`}>
                    <Link 
                      href={`/${locale}/topics/${topicItem.id}`} 
                      className={`${styles.treeFolder} ${isActive ? styles.treeFolderActive : ''}`}
                    >
                      <TopicIcon topic={topicItem.id as Topic} size={14} />
                      <span className={styles.treeFolderName}>{topicItem.label}</span>
                      {topicArticles.length > 0 && (
                        <span className={styles.treeCount}>{topicArticles.length}</span>
                      )}
                    </Link>
                    
                    {/* Show articles for active topic */}
                    {isActive && topicArticles.length > 0 && (
                      <ul className={styles.treeFiles}>
                        {topicArticles.map((article) => (
                          <li key={article.slug}>
                            <Link 
                              href={`/${locale}/articles/${article.frontmatter.slug}`}
                              className={styles.treeFile}
                            >
                              <FileText size={12} />
                              <span className={styles.treeFileName}>
                                {article.frontmatter.title}
                              </span>
                            </Link>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                );
              })}
            </div>
          </nav>
        </aside>

        {/* Main Content */}
        <main className={styles.main} data-testid="topic-detail-page">
          {/* Breadcrumb */}
          <nav className={styles.breadcrumb} data-testid="topic-breadcrumb">
            <Link href={`/${locale}/topics`}>{t('documentation')}</Link>
            <ChevronRight size={12} />
            <span>{topicData.label}</span>
          </nav>

          {/* Header */}
          <header className={styles.header}>
            <div className={styles.headerIcon}>
              <TopicIcon topic={topic as Topic} size={20} />
            </div>
            <div className={styles.headerContent}>
              <h1 className={styles.title} data-testid="topic-title">{topicData.label}</h1>
              <p className={styles.description} data-testid="topic-description">{topicData.description}</p>
            </div>
          </header>

          {/* Content */}
          {articles.length === 0 ? (
            <div className={styles.empty} data-testid="topic-empty">
              <p>{locale === 'de' ? 'Noch keine Artikel in diesem Thema.' : 'No articles in this topic yet.'}</p>
            </div>
          ) : (
            <div className={styles.content} data-testid="topic-articles">
              {/* Beginner */}
              {groupedArticles.beginner.length > 0 && (
                <section className={styles.levelSection}>
                  <div className={styles.levelHeader}>
                    <span className={styles.levelBadge} data-level="beginner">{t('beginner')}</span>
                    <span className={styles.levelCount}>{groupedArticles.beginner.length}</span>
                  </div>
                  <ul className={styles.articleList}>
                    {groupedArticles.beginner.map((article) => (
                      <li key={article.slug}>
                        <Link 
                          href={`/${locale}/articles/${article.frontmatter.slug}`}
                          className={styles.articleItem}
                        >
                          <FileText size={14} className={styles.articleIcon} />
                          <div className={styles.articleContent}>
                            <span className={styles.articleTitle}>
                              {article.frontmatter.title}
                            </span>
                            <span className={styles.articleSummary}>
                              {article.frontmatter.summary}
                            </span>
                          </div>
                        </Link>
                      </li>
                    ))}
                  </ul>
                </section>
              )}

              {/* Intermediate */}
              {groupedArticles.intermediate.length > 0 && (
                <section className={styles.levelSection}>
                  <div className={styles.levelHeader}>
                    <span className={styles.levelBadge} data-level="intermediate">{t('intermediate')}</span>
                    <span className={styles.levelCount}>{groupedArticles.intermediate.length}</span>
                  </div>
                  <ul className={styles.articleList}>
                    {groupedArticles.intermediate.map((article) => (
                      <li key={article.slug}>
                        <Link 
                          href={`/${locale}/articles/${article.frontmatter.slug}`}
                          className={styles.articleItem}
                        >
                          <FileText size={14} className={styles.articleIcon} />
                          <div className={styles.articleContent}>
                            <span className={styles.articleTitle}>
                              {article.frontmatter.title}
                            </span>
                            <span className={styles.articleSummary}>
                              {article.frontmatter.summary}
                            </span>
                          </div>
                        </Link>
                      </li>
                    ))}
                  </ul>
                </section>
              )}

              {/* Advanced */}
              {groupedArticles.advanced.length > 0 && (
                <section className={styles.levelSection}>
                  <div className={styles.levelHeader}>
                    <span className={styles.levelBadge} data-level="advanced">{t('advanced')}</span>
                    <span className={styles.levelCount}>{groupedArticles.advanced.length}</span>
                  </div>
                  <ul className={styles.articleList}>
                    {groupedArticles.advanced.map((article) => (
                      <li key={article.slug}>
                        <Link 
                          href={`/${locale}/articles/${article.frontmatter.slug}`}
                          className={styles.articleItem}
                        >
                          <FileText size={14} className={styles.articleIcon} />
                          <div className={styles.articleContent}>
                            <span className={styles.articleTitle}>
                              {article.frontmatter.title}
                            </span>
                            <span className={styles.articleSummary}>
                              {article.frontmatter.summary}
                            </span>
                          </div>
                        </Link>
                      </li>
                    ))}
                  </ul>
                </section>
              )}
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
