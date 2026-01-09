import { notFound } from 'next/navigation';
import Link from 'next/link';
import { TOPICS, Topic } from '@/lib/content/schema';
import { getContentByTopic, getAllContent } from '@/lib/content/loader';
import { TopicIcon, ChevronRight, FileText, ArrowLeft } from '@/components/icons';
import styles from './topic.module.css';

interface TopicPageProps {
  params: Promise<{ topic: string }>;
}

const TOPIC_ORDER: Topic[] = ['basics', 'security', 'mining', 'lightning', 'economics', 'criticism', 'money', 'dev'];

export async function generateMetadata({ params }: TopicPageProps) {
  const { topic } = await params;
  const topicData = TOPICS[topic as Topic];
  
  if (!topicData) {
    return { title: 'Topic Not Found' };
  }

  return {
    title: `${topicData.label} | Documentation`,
    description: topicData.description,
  };
}

export function generateStaticParams() {
  return Object.keys(TOPICS).map((topic) => ({ topic }));
}

export default async function TopicPage({ params }: TopicPageProps) {
  const { topic } = await params;
  const topicData = TOPICS[topic as Topic];
  
  if (!topicData) {
    notFound();
  }

  const articles = getContentByTopic(topic as Topic);
  const allArticles = getAllContent();

  // Group articles by level
  const groupedArticles = {
    beginner: articles.filter((a) => a.frontmatter.level === 'beginner'),
    intermediate: articles.filter((a) => a.frontmatter.level === 'intermediate'),
    advanced: articles.filter((a) => a.frontmatter.level === 'advanced'),
  };

  // Get article counts per topic for sidebar
  const articlesByTopic = TOPIC_ORDER.reduce((acc, t) => {
    acc[t] = allArticles.filter((a) => a.frontmatter.topic === t).length;
    return acc;
  }, {} as Record<Topic, number>);

  return (
    <div className={styles.page}>
      <div className={styles.layout}>
        {/* Sidebar */}
        <aside className={styles.sidebar}>
          <nav className={styles.sidebarNav}>
            <div className={styles.sidebarHeader}>
              <h2 className={styles.sidebarTitle}>Topics</h2>
            </div>
            <ul className={styles.topicList}>
              {TOPIC_ORDER.map((topicKey) => {
                const t = TOPICS[topicKey];
                const isActive = topicKey === topic;
                return (
                  <li key={topicKey}>
                    <Link 
                      href={`/topics/${topicKey}`} 
                      className={`${styles.topicNavItem} ${isActive ? styles.active : ''}`}
                    >
                      <TopicIcon topic={topicKey} size={16} />
                      <span>{t.label}</span>
                      <span className={styles.articleCount}>{articlesByTopic[topicKey]}</span>
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>
        </aside>

        {/* Main Content */}
        <main className={styles.main}>
          {/* Breadcrumb */}
          <nav className={styles.breadcrumb}>
            <Link href="/topics">Topics</Link>
            <ChevronRight size={14} />
            <span>{topicData.label}</span>
          </nav>

          {/* Header */}
          <header className={styles.header}>
            <div className={styles.headerIcon}>
              <TopicIcon topic={topic as Topic} size={28} />
            </div>
            <div className={styles.headerContent}>
              <h1 className={styles.title}>{topicData.label}</h1>
              <p className={styles.description}>{topicData.description}</p>
              <div className={styles.stats}>
                <span>{articles.length} articles</span>
              </div>
            </div>
          </header>

          {/* Content */}
          {articles.length === 0 ? (
            <div className={styles.empty}>
              <p>No articles in this topic yet.</p>
              <Link href="/topics" className={styles.backLink}>
                <ArrowLeft size={16} /> Back to all topics
              </Link>
            </div>
          ) : (
            <div className={styles.content}>
              {/* Beginner */}
              {groupedArticles.beginner.length > 0 && (
                <section className={styles.levelSection}>
                  <div className={styles.levelHeader}>
                    <span className={styles.levelBadge} data-level="beginner">Beginner</span>
                    <span className={styles.levelCount}>{groupedArticles.beginner.length} articles</span>
                  </div>
                  <ul className={styles.articleList}>
                    {groupedArticles.beginner.map((article) => (
                      <li key={article.slug}>
                        <Link 
                          href={`/articles/${article.frontmatter.slug}`}
                          className={styles.articleItem}
                        >
                          <FileText size={16} className={styles.articleIcon} />
                          <div className={styles.articleContent}>
                            <span className={styles.articleTitle}>
                              {article.frontmatter.title}
                            </span>
                            <span className={styles.articleSummary}>
                              {article.frontmatter.summary}
                            </span>
                          </div>
                          <span className={styles.articleMeta}>
                            {article.readTime} min
                          </span>
                          <ChevronRight size={16} className={styles.articleArrow} />
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
                    <span className={styles.levelBadge} data-level="intermediate">Intermediate</span>
                    <span className={styles.levelCount}>{groupedArticles.intermediate.length} articles</span>
                  </div>
                  <ul className={styles.articleList}>
                    {groupedArticles.intermediate.map((article) => (
                      <li key={article.slug}>
                        <Link 
                          href={`/articles/${article.frontmatter.slug}`}
                          className={styles.articleItem}
                        >
                          <FileText size={16} className={styles.articleIcon} />
                          <div className={styles.articleContent}>
                            <span className={styles.articleTitle}>
                              {article.frontmatter.title}
                            </span>
                            <span className={styles.articleSummary}>
                              {article.frontmatter.summary}
                            </span>
                          </div>
                          <span className={styles.articleMeta}>
                            {article.readTime} min
                          </span>
                          <ChevronRight size={16} className={styles.articleArrow} />
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
                    <span className={styles.levelBadge} data-level="advanced">Advanced</span>
                    <span className={styles.levelCount}>{groupedArticles.advanced.length} articles</span>
                  </div>
                  <ul className={styles.articleList}>
                    {groupedArticles.advanced.map((article) => (
                      <li key={article.slug}>
                        <Link 
                          href={`/articles/${article.frontmatter.slug}`}
                          className={styles.articleItem}
                        >
                          <FileText size={16} className={styles.articleIcon} />
                          <div className={styles.articleContent}>
                            <span className={styles.articleTitle}>
                              {article.frontmatter.title}
                            </span>
                            <span className={styles.articleSummary}>
                              {article.frontmatter.summary}
                            </span>
                          </div>
                          <span className={styles.articleMeta}>
                            {article.readTime} min
                          </span>
                          <ChevronRight size={16} className={styles.articleArrow} />
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
