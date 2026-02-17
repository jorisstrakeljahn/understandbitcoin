import Link from 'next/link';
import { setRequestLocale, getTranslations } from 'next-intl/server';
import { type Topic } from '@/lib/content/schema';
import { getAllContent, getAllTopicsFromConfig } from '@/lib/content/loader';
import { siteConfig } from '@/lib/config';
import { WebsiteJsonLd, FAQJsonLd } from '@/components/seo';
import { TopicIcon, ArrowRight } from '@/components/icons';
import styles from './page.module.css';

interface HomePageProps {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({ params }: HomePageProps) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'metadata' });
  
  const title = t('title');
  const description = t('description');

  return {
    title,
    description,
    alternates: {
      canonical: `${siteConfig.url}/${locale}`,
      languages: {
        'en': `${siteConfig.url}/en`,
        'de': `${siteConfig.url}/de`,
      },
    },
    openGraph: {
      title,
      description,
      url: `${siteConfig.url}/${locale}`,
      siteName: siteConfig.name,
      type: 'website',
    },
  };
}

export default async function HomePage({ params }: HomePageProps) {
  const { locale } = await params;
  setRequestLocale(locale);

  const t = await getTranslations({ locale, namespace: 'home' });
  const isGerman = locale === 'de';

  const allArticles = getAllContent(locale).length > 0 ? getAllContent(locale) : getAllContent('en');
  const topicsFromConfig = getAllTopicsFromConfig(locale);

  const articlesByTopic = topicsFromConfig.reduce((acc, topic) => {
    acc[topic.id as Topic] = allArticles.filter((a) => a.frontmatter.topic === topic.id);
    return acc;
  }, {} as Record<Topic, typeof allArticles>);

  const faqItems = [
    {
      question: isGerman ? 'Was ist Bitcoin?' : 'What is Bitcoin?',
      answer: isGerman
        ? 'Bitcoin ist eine digitale Währung, die ohne Banken oder Regierungen funktioniert – mithilfe von Kryptografie und einem globalen Netzwerk aus Computern.'
        : 'Bitcoin is a digital currency that works without banks or governments – using cryptography and a global network of computers.',
    },
    {
      question: isGerman ? 'Wer hat Bitcoin erfunden?' : 'Who created Bitcoin?',
      answer: isGerman
        ? 'Bitcoin wurde von einer Person oder Gruppe unter dem Pseudonym Satoshi Nakamoto entwickelt.'
        : 'Bitcoin was created by a person or group under the pseudonym Satoshi Nakamoto.',
    },
  ];

  return (
    <div className={styles.page}>
      <WebsiteJsonLd
        url={`${siteConfig.url}/${locale}`}
        name="Therefor Bitcoin"
        description={isGerman
          ? 'Eine persönliche Wissenssammlung über Bitcoin. Klare Antworten, faire Kritik und Primärquellen.'
          : 'A personal knowledge base about Bitcoin. Clear answers, fair criticism, and primary sources.'}
      />
      <FAQJsonLd questions={faqItems} />

      <div className={styles.container}>
        {/* Intro */}
        <header className={styles.header}>
          <h1 className={styles.title}>{t('title')}</h1>
          <p className={styles.intro}>{t('intro')}</p>
        </header>

        {/* Topics Grid */}
        <div className={styles.topicGrid} data-testid="topics-grid">
          {topicsFromConfig.map((topic) => {
            const articles = articlesByTopic[topic.id as Topic] || [];

            return (
              <Link
                key={topic.id}
                href={`/${locale}/topics/${topic.id}`}
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
                      {articles.length} {locale === 'de' ? 'Artikel' : (articles.length === 1 ? 'article' : 'articles')}
                    </span>
                  </div>
                </div>
                <p className={styles.topicCardDescription}>{topic.description}</p>
                <span className={styles.topicCardLink}>
                  {locale === 'de' ? 'Thema erkunden' : 'Explore topic'} <ArrowRight size={14} />
                </span>
              </Link>
            );
          })}
        </div>

        {/* Quick Start */}
        <section className={styles.quickStart}>
          <h2 className={styles.quickStartTitle}>
            {isGerman ? 'Wo anfangen?' : 'Where to Start?'}
          </h2>
          <div className={styles.quickStartContent}>
            <div className={styles.quickStartItem}>
              <span className={styles.quickStartNumber}>1</span>
              <div>
                <h3>{isGerman ? 'Neu bei Bitcoin?' : 'New to Bitcoin?'}</h3>
                <p>
                  {isGerman
                    ? 'Starte mit den Bitcoin Grundlagen. Dort findest du Antworten auf die häufigsten Fragen.'
                    : 'Start with Bitcoin Basics. There you\'ll find answers to the most common questions.'}
                </p>
              </div>
            </div>
            <div className={styles.quickStartItem}>
              <span className={styles.quickStartNumber}>2</span>
              <div>
                <h3>{isGerman ? 'Skeptisch?' : 'Skeptical?'}</h3>
                <p>
                  {isGerman
                    ? 'Schau dir Kritik & Bedenken an. Alle Einwände werden fair und mit Primärquellen behandelt.'
                    : 'Check out Criticism & Concerns. All objections are addressed fairly with primary sources.'}
                </p>
              </div>
            </div>
            <div className={styles.quickStartItem}>
              <span className={styles.quickStartNumber}>3</span>
              <div>
                <h3>{isGerman ? 'Tiefer einsteigen?' : 'Going deeper?'}</h3>
                <p>
                  {isGerman
                    ? 'Stabiles Geld und Geldpolitik erklären den wirtschaftlichen Hintergrund.'
                    : 'Sound Money and Monetary Economics explain the economic background.'}
                </p>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
