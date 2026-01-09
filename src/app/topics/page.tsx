import Link from 'next/link';
import { TOPICS, Topic } from '@/lib/content/schema';
import { getAllContent } from '@/lib/content/loader';
import { TopicIcon, ChevronRight, FileText } from '@/components/icons';
import styles from './topics.module.css';

export const metadata = {
  title: 'Documentation',
  description: 'Browse all Bitcoin topics and articles.',
};

const TOPIC_ORDER: Topic[] = ['basics', 'security', 'mining', 'lightning', 'economics', 'criticism', 'money', 'dev'];

export default function TopicsPage() {
  const allArticles = getAllContent();
  
  // Group articles by topic
  const articlesByTopic = TOPIC_ORDER.reduce((acc, topic) => {
    acc[topic] = allArticles.filter((a) => a.frontmatter.topic === topic);
    return acc;
  }, {} as Record<Topic, typeof allArticles>);

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
                const topic = TOPICS[topicKey];
                const count = articlesByTopic[topicKey]?.length || 0;
                return (
                  <li key={topicKey}>
                    <a href={`#${topicKey}`} className={styles.topicNavItem}>
                      <TopicIcon topic={topicKey} size={16} />
                      <span>{topic.label}</span>
                      <span className={styles.articleCount}>{count}</span>
                    </a>
                  </li>
                );
              })}
            </ul>
          </nav>
        </aside>

        {/* Main Content */}
        <main className={styles.main}>
          <header className={styles.header}>
            <h1 className={styles.title}>Documentation</h1>
            <p className={styles.subtitle}>
              Browse all Bitcoin topics. Each article provides clear answers with sources.
            </p>
          </header>

          <div className={styles.content}>
            {TOPIC_ORDER.map((topicKey) => {
              const topic = TOPICS[topicKey];
              const articles = articlesByTopic[topicKey] || [];
              
              return (
                <section key={topicKey} id={topicKey} className={styles.topicSection}>
                  <div className={styles.topicHeader}>
                    <TopicIcon topic={topicKey} size={20} />
                    <h2 className={styles.topicTitle}>{topic.label}</h2>
                    <span className={styles.topicCount}>{articles.length} articles</span>
                  </div>
                  <p className={styles.topicDescription}>{topic.description}</p>
                  
                  {articles.length > 0 ? (
                    <ul className={styles.articleList}>
                      {articles.map((article) => (
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
                              <span className={styles.articleMeta}>
                                {article.readTime} min read
                              </span>
                            </div>
                            <ChevronRight size={16} className={styles.articleArrow} />
                          </Link>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className={styles.emptyState}>No articles yet. Coming soon.</p>
                  )}
                  
                  <Link href={`/topics/${topicKey}`} className={styles.viewAllLink}>
                    View all in {topic.label} <ChevronRight size={14} />
                  </Link>
                </section>
              );
            })}
          </div>
        </main>
      </div>
    </div>
  );
}
