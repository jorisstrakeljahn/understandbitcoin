import { setRequestLocale, getTranslations } from 'next-intl/server';
import { Topic } from '@/lib/content/schema';
import { getAllContent, getAllTopicsFromConfig } from '@/lib/content/loader';
import { TopicIcon, ArrowRight } from '@/components/icons';
import { CollapsibleSidebar, TrackedTopicLink } from '@/components/topics';
import styles from './topics.module.css';

interface TopicsPageProps {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({ params }: TopicsPageProps) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'topics' });
  
  return {
    title: t('documentation'),
    description: t('subtitle'),
  };
}

export default async function TopicsPage({ params }: TopicsPageProps) {
  const { locale } = await params;
  setRequestLocale(locale);
  
  const t = await getTranslations({ locale, namespace: 'topics' });
  const allArticles = getAllContent(locale).length > 0 ? getAllContent(locale) : getAllContent('en');
  
  // Get topics from config (sorted by order)
  const topicsFromConfig = getAllTopicsFromConfig(locale);
  
  // Group articles by topic
  const articlesByTopic = topicsFromConfig.reduce((acc, topic) => {
    acc[topic.id as Topic] = allArticles.filter((a) => a.frontmatter.topic === topic.id);
    return acc;
  }, {} as Record<Topic, typeof allArticles>);

  // Prepare topics data for sidebar
  const topicsData = topicsFromConfig.map((topic) => ({
    key: topic.id as Topic,
    label: topic.label,
    articles: (articlesByTopic[topic.id as Topic] || []).map((a) => ({
      slug: a.frontmatter.slug,
      title: a.frontmatter.title,
    })),
  }));

  return (
    <div className={styles.page}>
      <div className={styles.layout}>
        {/* Sidebar - Collapsible File Tree */}
        <aside className={styles.sidebar}>
          <CollapsibleSidebar 
            topics={topicsData} 
            locale={locale} 
            documentationLabel={t('documentation')}
          />
        </aside>

        {/* Main Content - Topic Descriptions */}
        <main className={styles.main}>
          <header className={styles.header}>
            <h1 className={styles.title}>{t('documentation')}</h1>
            <p className={styles.subtitle}>{t('subtitle')}</p>
          </header>

          <div className={styles.content}>
            <div className={styles.topicGrid} data-testid="topics-grid">
              {topicsFromConfig.map((topic) => {
                const articles = articlesByTopic[topic.id as Topic] || [];
                
                return (
                  <TrackedTopicLink 
                    key={topic.id} 
                    href={`/${locale}/topics/${topic.id}`}
                    topic={topic.id}
                    source="home"
                    className={styles.topicCard}
                    data-testid={`topic-card-${topic.id}`}
                  >
                    <div className={styles.topicCardHeader}>
                      <div className={styles.topicCardIcon}>
                        <TopicIcon topic={topic.id as Topic} size={24} />
                      </div>
                      <div className={styles.topicCardMeta}>
                        <h2 className={styles.topicCardTitle}>{topic.label}</h2>
                        <span className={styles.topicCardCount}>
                          {articles.length} {articles.length === 1 
                            ? (locale === 'de' ? 'Artikel' : 'article') 
                            : (locale === 'de' ? 'Artikel' : 'articles')}
                        </span>
                      </div>
                    </div>
                    <p className={styles.topicCardDescription}>
                      {topic.description}
                    </p>
                    <span className={styles.topicCardLink}>
                      {locale === 'de' ? 'Thema erkunden' : 'Explore topic'} <ArrowRight size={14} />
                    </span>
                  </TrackedTopicLink>
                );
              })}
            </div>

            {/* Quick Start Section */}
            <section className={styles.quickStart}>
              <h2 className={styles.quickStartTitle}>
                {locale === 'de' ? 'Wo anfangen?' : 'Where to Start?'}
              </h2>
              <div className={styles.quickStartContent}>
                <div className={styles.quickStartItem}>
                  <span className={styles.quickStartNumber}>1</span>
                  <div>
                    <h3>{locale === 'de' ? 'Neu bei Bitcoin?' : 'New to Bitcoin?'}</h3>
                    <p>
                      {locale === 'de' 
                        ? 'Starte mit den Bitcoin Grundlagen. Dort findest du Antworten auf die häufigsten Fragen.' 
                        : 'Start with Bitcoin Basics. There you\'ll find answers to the most common questions.'}
                    </p>
                  </div>
                </div>
                <div className={styles.quickStartItem}>
                  <span className={styles.quickStartNumber}>2</span>
                  <div>
                    <h3>{locale === 'de' ? 'Skeptisch?' : 'Skeptical?'}</h3>
                    <p>
                      {locale === 'de' 
                        ? 'Schau dir Kritik & Bedenken an. Wir behandeln alle Einwände fair und mit Primärquellen.' 
                        : 'Check out Criticism & Concerns. We address all objections fairly with primary sources.'}
                    </p>
                  </div>
                </div>
                <div className={styles.quickStartItem}>
                  <span className={styles.quickStartNumber}>3</span>
                  <div>
                    <h3>{locale === 'de' ? 'Interessiert an der Theorie?' : 'Interested in Theory?'}</h3>
                    <p>
                      {locale === 'de' 
                        ? 'Stabiles Geld und Geldpolitik erklären den wirtschaftlichen Hintergrund.' 
                        : 'Sound Money and Monetary Economics explain the economic background.'}
                    </p>
                  </div>
                </div>
              </div>
            </section>
          </div>
        </main>
      </div>
    </div>
  );
}
