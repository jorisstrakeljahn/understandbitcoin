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
        {/* Sidebar - File Tree Style */}
        <aside className={styles.sidebar}>
          <nav className={styles.sidebarNav}>
            <div className={styles.sidebarHeader}>
              <span className={styles.sidebarTitle}>Documentation</span>
            </div>
            
            <div className={styles.fileTree}>
              {TOPIC_ORDER.map((topicKey) => {
                const topic = TOPICS[topicKey];
                const articles = articlesByTopic[topicKey] || [];
                
                return (
                  <div key={topicKey} className={styles.treeSection}>
                    <Link href={`/topics/${topicKey}`} className={styles.treeFolder}>
                      <TopicIcon topic={topicKey} size={14} />
                      <span className={styles.treeFolderName}>{topic.label}</span>
                      {articles.length > 0 && (
                        <span className={styles.treeCount}>{articles.length}</span>
                      )}
                    </Link>
                    
                    {articles.length > 0 && (
                      <ul className={styles.treeFiles}>
                        {articles.slice(0, 5).map((article) => (
                          <li key={article.slug}>
                            <Link 
                              href={`/articles/${article.frontmatter.slug}`}
                              className={styles.treeFile}
                            >
                              <FileText size={12} />
                              <span className={styles.treeFileName}>
                                {article.frontmatter.title}
                              </span>
                            </Link>
                          </li>
                        ))}
                        {articles.length > 5 && (
                          <li>
                            <Link 
                              href={`/topics/${topicKey}`}
                              className={styles.treeMore}
                            >
                              +{articles.length - 5} more
                            </Link>
                          </li>
                        )}
                      </ul>
                    )}
                  </div>
                );
              })}
            </div>
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
                    <TopicIcon topic={topicKey} size={18} />
                    <h2 className={styles.topicTitle}>{topic.label}</h2>
                    <span className={styles.topicCount}>{articles.length}</span>
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
                            <FileText size={14} className={styles.articleIcon} />
                            <span className={styles.articleTitle}>
                              {article.frontmatter.title}
                            </span>
                            <span className={styles.articleMeta}>
                              {article.readTime} min
                            </span>
                            <ChevronRight size={14} className={styles.articleArrow} />
                          </Link>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className={styles.emptyState}>No articles yet.</p>
                  )}
                </section>
              );
            })}
          </div>
        </main>
      </div>
    </div>
  );
}
