import Link from 'next/link';
import { setRequestLocale } from 'next-intl/server';
import { useTranslations } from 'next-intl';
import { Button, Badge } from '@/components/ui';
import { type Topic } from '@/lib/content/schema';
import { getAllContent, getTopicConfig } from '@/lib/content/loader';
import { 
  FileText, 
  HelpCircle, 
  Coins, 
  BookOpen,
  Video,
  ArrowRight,
  TopicIcon,
  Bitcoin,
  TrendingUp
} from '@/components/icons';
import { HeroSection, AnimatedSection, AnimatedCard } from '@/components/home';
import styles from './page.module.css';

interface HomePageProps {
  params: Promise<{ locale: string }>;
}

const POPULAR_ARTICLES = [
  {
    slug: 'what-is-bitcoin',
    title: 'What is Bitcoin?',
    titleDe: 'Was ist Bitcoin?',
    summary: 'A digital currency without banks or governments.',
    summaryDe: 'Eine digitale Währung ohne Banken oder Regierungen.',
    topic: 'basics' as Topic,
  },
  {
    slug: 'bitcoin-energy-consumption',
    title: 'Does Bitcoin waste energy?',
    titleDe: 'Verschwendet Bitcoin Energie?',
    summary: 'Understanding Bitcoin\'s energy use in context.',
    summaryDe: 'Bitcoins Energieverbrauch im Kontext verstehen.',
    topic: 'mining' as Topic,
  },
  {
    slug: 'is-bitcoin-a-ponzi-scheme',
    title: 'Is Bitcoin a Ponzi scheme?',
    titleDe: 'Ist Bitcoin ein Ponzi-Schema?',
    summary: 'Examining the claim with the actual definition.',
    summaryDe: 'Die Behauptung mit der tatsächlichen Definition prüfen.',
    topic: 'criticism' as Topic,
  },
  {
    slug: 'what-is-lightning-network',
    title: 'What is the Lightning Network?',
    titleDe: 'Was ist das Lightning Network?',
    summary: 'Fast, cheap payments built on Bitcoin.',
    summaryDe: 'Schnelle, günstige Zahlungen auf Bitcoin-Basis.',
    topic: 'lightning' as Topic,
  },
];

export default async function HomePage({ params }: HomePageProps) {
  const { locale } = await params;
  setRequestLocale(locale);
  
  // Get all questions from the content for the animated question
  const allContent = getAllContent(locale);
  const questions = allContent.length > 0 
    ? allContent.map((article) => ({
        text: article.frontmatter.title,
        slug: article.slug,
      }))
    : getAllContent('en').map((article) => ({
        text: article.frontmatter.title,
        slug: article.slug,
      }));

  // Pre-load topic labels for popular articles
  const topicLabels: Record<string, string> = {};
  for (const article of POPULAR_ARTICLES) {
    const topicConfig = getTopicConfig(article.topic, locale);
    topicLabels[article.topic] = topicConfig.label;
  }

  return <HomePageContent locale={locale} questions={questions} topicLabels={topicLabels} />;
}

function HomePageContent({ locale, questions, topicLabels }: { locale: string; questions: { text: string; slug: string }[]; topicLabels: Record<string, string> }) {
  const t = useTranslations();
  const isGerman = locale === 'de';

  const ENTRY_POINTS = [
    {
      id: 'basics',
      icon: Bitcoin,
      title: t('entryPoints.basics.title'),
      description: t('entryPoints.basics.description'),
      href: `/${locale}/topics/basics`,
      color: 'var(--color-accent)',
    },
    {
      id: 'economics',
      icon: TrendingUp,
      title: t('entryPoints.economics.title'),
      description: t('entryPoints.economics.description'),
      href: `/${locale}/topics/economics`,
      color: 'var(--color-info)',
    },
    {
      id: 'criticism',
      icon: HelpCircle,
      title: t('entryPoints.criticism.title'),
      description: t('entryPoints.criticism.description'),
      href: `/${locale}/topics/criticism`,
      color: 'var(--color-warning)',
    },
    {
      id: 'money',
      icon: Coins,
      title: t('entryPoints.money.title'),
      description: t('entryPoints.money.description'),
      href: `/${locale}/topics/money`,
      color: 'var(--color-success)',
    },
  ];

  return (
    <div className={styles.page}>
      {/* Hero Section with Animated Questions */}
      <HeroSection questions={questions} locale={locale} />

      {/* Entry Points */}
      <AnimatedSection className={styles.section}>
        <div className={styles.container}>
          <h2 className={styles.sectionTitle}>{t('home.chooseYourTopic')}</h2>
          <p className={styles.sectionSubtitle}>
            {t('home.topicSubtitle')}
          </p>
          
          <div className={styles.entryPoints}>
            {ENTRY_POINTS.map((entry, index) => {
              const IconComponent = entry.icon;
              return (
                <AnimatedCard key={entry.id} delay={index * 0.1}>
                  <Link
                    href={entry.href}
                    className={styles.entryPoint}
                    style={{ '--entry-color': entry.color } as React.CSSProperties}
                  >
                    <span className={styles.entryIcon}>
                      <IconComponent size={28} />
                    </span>
                    <h3 className={styles.entryTitle}>{entry.title}</h3>
                    <p className={styles.entryDescription}>{entry.description}</p>
                    <span className={styles.entryArrow}>
                      <ArrowRight size={18} />
                    </span>
                  </Link>
                </AnimatedCard>
              );
            })}
          </div>
        </div>
      </AnimatedSection>

      {/* Popular Articles */}
      <AnimatedSection className={styles.section} data-variant="alt" delay={0.1}>
        <div className={styles.container}>
          <div className={styles.sectionHeader}>
            <div>
              <h2 className={styles.sectionTitle}>{t('home.popularArticles')}</h2>
            </div>
            <Link href={`/${locale}/topics`} className={styles.sectionLink}>
              {t('home.viewAllTopics')} <ArrowRight size={16} />
            </Link>
          </div>
          
          <div className={styles.popularArticles}>
            {POPULAR_ARTICLES.map((article, index) => (
              <AnimatedCard key={article.slug} delay={index * 0.1}>
                <Link
                  href={`/${locale}/articles/${article.slug}`}
                  className={styles.popularArticle}
                >
                  <div className={styles.popularArticleMeta}>
                    <Badge variant="accent">
                      <TopicIcon topic={article.topic} size={14} />
                      <span style={{ marginLeft: '4px' }}>
                        {topicLabels[article.topic]}
                      </span>
                    </Badge>
                  </div>
                  <h3 className={styles.popularArticleTitle}>
                    {isGerman ? article.titleDe : article.title}
                  </h3>
                  <p className={styles.popularArticleSummary}>
                    {isGerman ? article.summaryDe : article.summary}
                  </p>
                  <span className={styles.popularArticleLink}>
                    {t('home.readAnswer')} <ArrowRight size={14} />
                  </span>
                </Link>
              </AnimatedCard>
            ))}
          </div>
        </div>
      </AnimatedSection>

      {/* Sources Preview (Stub) */}
      <AnimatedSection className={styles.section} delay={0.1}>
        <div className={styles.container}>
          <div className={styles.sectionHeader}>
            <div>
              <h2 className={styles.sectionTitle}>{t('home.sourcesPreview')}</h2>
            </div>
            <Link href={`/${locale}/sources`} className={styles.sectionLink}>
              {t('home.browseLibrary')} <ArrowRight size={16} />
            </Link>
          </div>
          
          <div className={styles.sourcesPreview}>
            <AnimatedCard delay={0}>
              <div className={styles.sourceCard}>
                <div className={styles.sourceType}>
                  <BookOpen size={14} /> {isGerman ? 'Buch' : 'Book'}
                </div>
                <h3 className={styles.sourceTitle}>The Bitcoin Standard</h3>
                <p className={styles.sourceAuthor}>Saifedean Ammous</p>
              </div>
            </AnimatedCard>
            <AnimatedCard delay={0.1}>
              <div className={styles.sourceCard}>
                <div className={styles.sourceType}>
                  <FileText size={14} /> {isGerman ? 'Paper' : 'Paper'}
                </div>
                <h3 className={styles.sourceTitle}>Bitcoin: A Peer-to-Peer Electronic Cash System</h3>
                <p className={styles.sourceAuthor}>Satoshi Nakamoto</p>
              </div>
            </AnimatedCard>
            <AnimatedCard delay={0.2}>
              <div className={styles.sourceCard}>
                <div className={styles.sourceType}>
                  <Video size={14} /> Video
                </div>
                <h3 className={styles.sourceTitle}>But How Does Bitcoin Actually Work?</h3>
                <p className={styles.sourceAuthor}>3Blue1Brown</p>
              </div>
            </AnimatedCard>
            <AnimatedCard delay={0.3}>
              <div className={styles.sourceCard}>
                <div className={styles.sourceType}>
                  <BookOpen size={14} /> {isGerman ? 'Buch' : 'Book'}
                </div>
                <h3 className={styles.sourceTitle}>Mastering Bitcoin</h3>
                <p className={styles.sourceAuthor}>Andreas Antonopoulos</p>
              </div>
            </AnimatedCard>
          </div>
        </div>
      </AnimatedSection>

      {/* CTA Section */}
      <AnimatedSection className={styles.ctaSection} delay={0.1}>
        <div className={styles.container}>
          <h2 className={styles.ctaTitle}>{t('home.readyTitle')}</h2>
          <p className={styles.ctaSubtitle}>
            {t('home.readySubtitle')}
          </p>
          <Link href={`/${locale}/topics`}>
            <Button size="lg" variant="primary">
              {t('home.exploreTopics')}
            </Button>
          </Link>
        </div>
      </AnimatedSection>
    </div>
  );
}
