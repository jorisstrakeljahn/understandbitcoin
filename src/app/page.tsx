import Link from 'next/link';
import { Button, Badge } from '@/components/ui';
import { TOPICS, type Topic } from '@/lib/content/schema';
import { 
  Search, 
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
import styles from './page.module.css';

const EXAMPLE_CHIPS = [
  { label: 'Energy use?', query: 'energy' },
  { label: 'Inflation hedge', query: 'inflation' },
  { label: 'Lightning', query: 'lightning' },
  { label: '"Ponzi scheme"', query: 'ponzi' },
  { label: 'Self-custody', query: 'custody' },
];

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
  return (
    <div className={styles.page}>
      {/* Hero Section */}
      <section className={styles.hero}>
        <div className={styles.heroBackground}>
          <div className={styles.heroGradient} />
          <div className={styles.heroPattern} />
        </div>
        
        <div className={styles.heroContent}>
          <h1 className={styles.heroTitle}>
            Understand Bitcoin<span className={styles.heroDot}>.</span>
          </h1>
          <p className={styles.heroSubtitle}>
            Clear answers. Fair objections. Primary sources.
          </p>

          {/* Search Input */}
          <div className={styles.searchWrapper}>
            <div className={styles.searchBox}>
              <Search size={20} className={styles.searchIcon} />
              <input
                type="text"
                className={styles.searchInput}
                placeholder="Search any Bitcoin question..."
                aria-label="Search"
              />
              <kbd className={styles.searchKbd}>⌘K</kbd>
            </div>
            <div className={styles.searchChips}>
              {EXAMPLE_CHIPS.map((chip) => (
                <Link
                  key={chip.query}
                  href={`/search?q=${chip.query}`}
                  className={styles.searchChip}
                >
                  {chip.label}
                </Link>
              ))}
            </div>
          </div>

          {/* CTAs */}
          <div className={styles.heroCtas}>
            <Link href="/topics/basics">
              <Button size="lg" variant="primary">
                Start with Basics
              </Button>
            </Link>
            <Link href="/topics">
              <Button size="lg" variant="outline">
                Browse Topics
              </Button>
            </Link>
            <Link href="/topics/criticism">
              <Button size="lg" variant="ghost">
                Read Criticism
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Entry Points */}
      <section className={styles.section}>
        <div className={styles.container}>
          <h2 className={styles.sectionTitle}>Choose Your Topic</h2>
          <p className={styles.sectionSubtitle}>
            Whether you&apos;re curious, skeptical, or technical — we&apos;ve got you covered.
          </p>
          
          <div className={styles.entryPoints}>
            {ENTRY_POINTS.map((entry) => {
              const IconComponent = entry.icon;
              return (
                <Link
                  key={entry.id}
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
              );
            })}
          </div>
        </div>
      </section>

      {/* Popular Articles */}
      <section className={styles.section} data-variant="alt">
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
            {POPULAR_ARTICLES.map((article) => (
              <Link
                key={article.slug}
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
            ))}
          </div>
        </div>
      </section>

      {/* Sources Preview (Stub) */}
      <section className={styles.section}>
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
            <div className={styles.sourceCard}>
              <div className={styles.sourceType}>
                <BookOpen size={14} /> Book
              </div>
              <h3 className={styles.sourceTitle}>The Bitcoin Standard</h3>
              <p className={styles.sourceAuthor}>Saifedean Ammous</p>
            </div>
            <div className={styles.sourceCard}>
              <div className={styles.sourceType}>
                <FileText size={14} /> Paper
              </div>
              <h3 className={styles.sourceTitle}>Bitcoin: A Peer-to-Peer Electronic Cash System</h3>
              <p className={styles.sourceAuthor}>Satoshi Nakamoto</p>
            </div>
            <div className={styles.sourceCard}>
              <div className={styles.sourceType}>
                <Video size={14} /> Video
              </div>
              <h3 className={styles.sourceTitle}>But How Does Bitcoin Actually Work?</h3>
              <p className={styles.sourceAuthor}>3Blue1Brown</p>
            </div>
            <div className={styles.sourceCard}>
              <div className={styles.sourceType}>
                <BookOpen size={14} /> Book
              </div>
              <h3 className={styles.sourceTitle}>Mastering Bitcoin</h3>
              <p className={styles.sourceAuthor}>Andreas Antonopoulos</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className={styles.ctaSection}>
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
      </section>
    </div>
  );
}
