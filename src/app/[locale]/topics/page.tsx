import Link from 'next/link';
import { setRequestLocale, getTranslations } from 'next-intl/server';
import { TOPICS, Topic } from '@/lib/content/schema';
import { getAllContent } from '@/lib/content/loader';
import { TopicIcon, ChevronRight, FileText } from '@/components/icons';
import styles from './topics.module.css';

interface TopicsPageProps {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({ params }: TopicsPageProps) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'topics' });
  
  return {
    title: t('documentation'),
    description: locale === 'de' 
      ? 'Durchsuche alle Bitcoin-Themen und Artikel.' 
      : 'Browse all Bitcoin topics and articles.',
  };
}

const TOPIC_ORDER: Topic[] = ['basics', 'security', 'mining', 'lightning', 'economics', 'criticism', 'money', 'dev'];

export default async function TopicsPage({ params }: TopicsPageProps) {
  const { locale } = await params;
  setRequestLocale(locale);
  
  const t = await getTranslations({ locale, namespace: 'topics' });
  const allArticles = getAllContent(locale).length > 0 ? getAllContent(locale) : getAllContent('en');
  
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
              <span className={styles.sidebarTitle}>{t('documentation')}</span>
            </div>
            
            <div className={styles.fileTree}>
              {TOPIC_ORDER.map((topicKey) => {
                const topic = TOPICS[topicKey];
                const articles = articlesByTopic[topicKey] || [];
                
                return (
                  <div key={topicKey} className={styles.treeSection}>
                    <Link href={`/${locale}/topics/${topicKey}`} className={styles.treeFolder}>
                      <TopicIcon topic={topicKey} size={14} />
                      <span className={styles.treeFolderName}>{t(`${topicKey}.label`)}</span>
                      {articles.length > 0 && (
                        <span className={styles.treeCount}>{articles.length}</span>
                      )}
                    </Link>
                    
                    {articles.length > 0 && (
                      <ul className={styles.treeFiles}>
                        {articles.slice(0, 5).map((article) => (
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
                        {articles.length > 5 && (
                          <li>
                            <Link 
                              href={`/${locale}/topics/${topicKey}`}
                              className={styles.treeMore}
                            >
                              +{articles.length - 5} {locale === 'de' ? 'mehr' : 'more'}
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
            <h1 className={styles.title}>{t('documentation')}</h1>
            <p className={styles.subtitle}>
              {locale === 'de' 
                ? 'Durchsuche alle Bitcoin-Themen. Jeder Artikel bietet klare Antworten mit Quellen.' 
                : 'Browse all Bitcoin topics. Each article provides clear answers with sources.'}
            </p>
          </header>

          <div className={styles.content}>
            {TOPIC_ORDER.map((topicKey) => {
              const articles = articlesByTopic[topicKey] || [];
              
              return (
                <section key={topicKey} id={topicKey} className={styles.topicSection}>
                  <div className={styles.topicHeader}>
                    <TopicIcon topic={topicKey} size={18} />
                    <h2 className={styles.topicTitle}>{t(`${topicKey}.label`)}</h2>
                    <span className={styles.topicCount}>{articles.length}</span>
                  </div>
                  <p className={styles.topicDescription}>{t(`${topicKey}.description`)}</p>
                  
                  {articles.length > 0 ? (
                    <ul className={styles.articleList}>
                      {articles.map((article) => (
                        <li key={article.slug}>
                          <Link 
                            href={`/${locale}/articles/${article.frontmatter.slug}`}
                            className={styles.articleItem}
                          >
                            <FileText size={14} className={styles.articleIcon} />
                            <span className={styles.articleTitle}>
                              {article.frontmatter.title}
                            </span>
                            <span className={styles.articleMeta}>
                              {article.readTime} {t('minRead')}
                            </span>
                            <ChevronRight size={14} className={styles.articleArrow} />
                          </Link>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className={styles.emptyState}>
                      {locale === 'de' ? 'Noch keine Artikel.' : 'No articles yet.'}
                    </p>
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
