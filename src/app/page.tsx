import Link from 'next/link';
import { Button, Badge } from '@/components/ui';
import { TOPICS, type Topic } from '@/lib/content/schema';
import { getAllContent } from '@/lib/content/loader';
import { 
  FileText, 
  Code, 
  HelpCircle, 
  Coins, 
  BookOpen,
  Video,
  ArrowRight,
  TopicIcon,
  Bitcoin
} from '@/components/icons';
import { HeroSection, AnimatedSection, AnimatedCard } from '@/components/home';
import styles from './page.module.css';

const ENTRY_POINTS = [
  {
    id: 'basics',
    icon: Bitcoin,
    title: 'Bitcoin Basics',
    description: 'New to Bitcoin? Start here with the fundamentals.',
    href: '/topics/basics',
    color: 'var(--color-accent)',
  },
  {
    id: 'developer',
    icon: Code,
    title: 'Developer',
    description: 'Build on Bitcoin. Technical deep-dives and guides.',
    href: '/topics/dev',
    color: 'var(--color-info)',
  },
  {
    id: 'criticism',
    icon: HelpCircle,
    title: 'Criticism',
    description: 'Fair treatment of objections and concerns.',
    href: '/topics/criticism',
    color: 'var(--color-warning)',
  },
  {
    id: 'money',
    icon: Coins,
    title: 'Sound Money',
    description: 'Austrian economics and monetary theory.',
    href: '/topics/money',
    color: 'var(--color-success)',
  },
];

const POPULAR_ARTICLES = [
  {
    slug: 'what-is-bitcoin',
    title: 'What is Bitcoin?',
    summary: 'A digital currency without banks or governments.',
    topic: 'basics' as Topic,
    readTime: 5,
  },
  {
    slug: 'bitcoin-energy-consumption',
    title: 'Does Bitcoin waste energy?',
    summary: 'Understanding Bitcoin\'s energy use in context.',
    topic: 'mining' as Topic,
    readTime: 8,
  },
  {
    slug: 'is-bitcoin-a-ponzi-scheme',
    title: 'Is Bitcoin a Ponzi scheme?',
    summary: 'Examining the claim with the actual definition.',
    topic: 'criticism' as Topic,
    readTime: 6,
  },
  {
    slug: 'what-is-lightning-network',
    title: 'What is the Lightning Network?',
    summary: 'Fast, cheap payments built on Bitcoin.',
    topic: 'lightning' as Topic,
    readTime: 7,
  },
];

export default function HomePage() {
  // Get all questions from the content for the animated question
  const allContent = getAllContent();
  const questions = allContent.map((article) => ({
    text: article.frontmatter.title,
    slug: article.slug,
  }));

  return (
    <div className={styles.page}>
      {/* Hero Section with Animated Questions */}
      <HeroSection questions={questions} />

      {/* Entry Points */}
      <AnimatedSection className={styles.section}>
        <div className={styles.container}>
          <h2 className={styles.sectionTitle}>Choose Your Topic</h2>
          <p className={styles.sectionSubtitle}>
            Whether you&apos;re curious, skeptical, or technical — we&apos;ve got you covered.
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
              <h2 className={styles.sectionTitle}>Popular Questions</h2>
              <p className={styles.sectionSubtitle}>
                The most-read articles this month.
              </p>
            </div>
            <Link href="/topics" className={styles.sectionLink}>
              View all topics <ArrowRight size={16} />
            </Link>
          </div>
          
          <div className={styles.popularArticles}>
            {POPULAR_ARTICLES.map((article, index) => (
              <AnimatedCard key={article.slug} delay={index * 0.1}>
                <Link
                  href={`/articles/${article.slug}`}
                  className={styles.popularArticle}
                >
                  <div className={styles.popularArticleMeta}>
                    <Badge variant="accent">
                      <TopicIcon topic={article.topic} size={14} />
                      <span style={{ marginLeft: '4px' }}>
                        {TOPICS[article.topic]?.label}
                      </span>
                    </Badge>
                    <span className={styles.readTime}>{article.readTime} min read</span>
                  </div>
                  <h3 className={styles.popularArticleTitle}>{article.title}</h3>
                  <p className={styles.popularArticleSummary}>{article.summary}</p>
                  <span className={styles.popularArticleLink}>
                    Read answer <ArrowRight size={14} />
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
              <h2 className={styles.sectionTitle}>Source Library</h2>
              <p className={styles.sectionSubtitle}>
                Curated books, papers, and resources.
              </p>
            </div>
            <Link href="/sources" className={styles.sectionLink}>
              Browse library <ArrowRight size={16} />
            </Link>
          </div>
          
          <div className={styles.sourcesPreview}>
            <AnimatedCard delay={0}>
              <div className={styles.sourceCard}>
                <div className={styles.sourceType}>
                  <BookOpen size={14} /> Book
                </div>
                <h3 className={styles.sourceTitle}>The Bitcoin Standard</h3>
                <p className={styles.sourceAuthor}>Saifedean Ammous</p>
              </div>
            </AnimatedCard>
            <AnimatedCard delay={0.1}>
              <div className={styles.sourceCard}>
                <div className={styles.sourceType}>
                  <FileText size={14} /> Paper
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
                  <BookOpen size={14} /> Book
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
          <h2 className={styles.ctaTitle}>Ready to understand Bitcoin?</h2>
          <p className={styles.ctaSubtitle}>
            Explore well-researched, balanced content on sound money.
          </p>
          <Link href="/topics">
            <Button size="lg" variant="primary">
              Explore Topics
            </Button>
          </Link>
        </div>
      </AnimatedSection>
    </div>
  );
}
