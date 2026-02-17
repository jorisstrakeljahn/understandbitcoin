import Link from 'next/link';
import { setRequestLocale, getTranslations } from 'next-intl/server';
import { useTranslations } from 'next-intl';
import { Button, Badge } from '@/components/ui';
import { type Topic } from '@/lib/content/schema';
import { getAllContent, getTopicConfig, getAllTopicsFromConfig } from '@/lib/content/loader';
import { getFeaturedSources, getSourcesCount } from '@/lib/sources/loader';
import { Source } from '@/lib/sources/types';
import { siteConfig } from '@/lib/config';
import { WebsiteJsonLd, FAQJsonLd } from '@/components/seo';
import { 
  HelpCircle, 
  Coins, 
  ArrowRight,
  TopicIcon,
  Bitcoin,
  TrendingUp
} from '@/components/icons';
import { HeroSection, AnimatedSection, AnimatedCard } from '@/components/home';
import { SourceCarousel } from '@/components/sources';
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
      images: [
        {
          url: `${siteConfig.url}/og-image.png`,
          width: 1200,
          height: 630,
          alt: siteConfig.name,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [`${siteConfig.url}/og-image.png`],
    },
  };
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

  // Get featured sources for carousel
  const featuredSources = getFeaturedSources();

  // Calculate stats
  const stats = {
    articles: allContent.length,
    sources: getSourcesCount(),
    topics: getAllTopicsFromConfig().length,
  };

  return <HomePageContent locale={locale} questions={questions} topicLabels={topicLabels} featuredSources={featuredSources} stats={stats} />;
}

interface Stats {
  articles: number;
  sources: number;
  topics: number;
}

function HomePageContent({ locale, questions, topicLabels, featuredSources, stats }: { locale: string; questions: { text: string; slug: string }[]; topicLabels: Record<string, string>; featuredSources: Source[]; stats: Stats }) {
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

  // FAQ items for structured data
  const homeFaqItems = [
    {
      question: isGerman ? 'Was ist Bitcoin?' : 'What is Bitcoin?',
      answer: isGerman 
        ? 'Bitcoin ist eine digitale Währung, die ohne Banken oder Regierungen funktioniert – mithilfe von Kryptografie und einem globalen Netzwerk aus Computern.'
        : 'Bitcoin is a digital currency that works without banks or governments – using cryptography and a global network of computers.',
    },
    {
      question: isGerman ? 'Wer hat Bitcoin erfunden?' : 'Who created Bitcoin?',
      answer: isGerman
        ? 'Bitcoin wurde von einer Person oder Gruppe unter dem Pseudonym Satoshi Nakamoto entwickelt, die 2011 verschwand und bis heute nie identifiziert wurde.'
        : 'Bitcoin was created by a person or group under the pseudonym Satoshi Nakamoto, who disappeared in 2011 and has never been identified.',
    },
    {
      question: isGerman ? 'Ist Bitcoin sicher?' : 'Is Bitcoin safe?',
      answer: isGerman
        ? 'Das Bitcoin-Netzwerk selbst hat noch nie einen erfolgreichen Hack erlebt. Die Sicherheit hängt davon ab, wie Sie Ihre Bitcoin aufbewahren.'
        : 'The Bitcoin network itself has never been successfully hacked. Safety depends on how you store your Bitcoin.',
    },
  ];

  return (
    <div className={styles.page}>
      {/* JSON-LD Structured Data */}
      <WebsiteJsonLd
        url={`https://thereforbitcoin.com/${locale}`}
        name="Therefor Bitcoin"
        description={isGerman 
          ? 'Eine umfassende, ausgewogene Wissensdatenbank über Bitcoin. Klare Antworten, faire Einwände und Primärquellen.'
          : 'A comprehensive, balanced knowledge base about Bitcoin. Clear answers, fair objections, and primary sources.'}
      />
      <FAQJsonLd questions={homeFaqItems} />

      {/* Hero Section with Animated Questions */}
      <HeroSection questions={questions} locale={locale} stats={stats} />

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

      {/* Sources Carousel */}
      <AnimatedSection className={styles.sectionFullWidth} delay={0.1}>
        <div className={styles.carouselHeader}>
          <h2 className={styles.sectionTitle}>{t('home.sourcesPreview')}</h2>
          <Link href={`/${locale}/sources`} className={styles.sectionLink}>
            {t('home.browseLibrary')} <ArrowRight size={16} />
          </Link>
        </div>
        <SourceCarousel 
          sources={featuredSources} 
          locale={locale}
        />
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
