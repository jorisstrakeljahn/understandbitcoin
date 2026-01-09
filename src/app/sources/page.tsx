import { Badge } from '@/components/ui';
import { FileText, BookOpen, Video, Headphones, ExternalLink } from '@/components/icons';
import styles from './sources.module.css';

export const metadata = {
  title: 'Source Library',
  description: 'Curated books, papers, videos, and resources about Bitcoin.',
};

const SOURCES = {
  papers: [
    {
      title: 'Bitcoin: A Peer-to-Peer Electronic Cash System',
      author: 'Satoshi Nakamoto',
      year: 2008,
      url: 'https://bitcoin.org/bitcoin.pdf',
      description: 'The original Bitcoin whitepaper.',
    },
  ],
  books: [
    {
      title: 'The Bitcoin Standard',
      author: 'Saifedean Ammous',
      year: 2018,
      description: 'Explores Bitcoin from an Austrian economics perspective.',
    },
    {
      title: 'Mastering Bitcoin',
      author: 'Andreas M. Antonopoulos',
      year: 2017,
      description: 'Technical deep-dive into how Bitcoin works.',
    },
    {
      title: 'The Internet of Money',
      author: 'Andreas M. Antonopoulos',
      year: 2016,
      description: 'Collection of talks exploring the significance of Bitcoin.',
    },
    {
      title: 'Inventing Bitcoin',
      author: 'Yan Pritzker',
      year: 2019,
      description: 'Simple explanation of Bitcoin technology.',
    },
  ],
  videos: [
    {
      title: 'But How Does Bitcoin Actually Work?',
      author: '3Blue1Brown',
      year: 2017,
      url: 'https://www.youtube.com/watch?v=bBC-nXj3Ng4',
      description: 'Visual explanation of Bitcoin cryptography.',
    },
    {
      title: 'Bitcoin for Beginners',
      author: 'Andreas Antonopoulos',
      year: 2016,
      description: 'Introduction to Bitcoin concepts.',
    },
  ],
  podcasts: [
    {
      title: 'What Bitcoin Did',
      author: 'Peter McCormack',
      description: 'Weekly podcast interviewing Bitcoin experts.',
    },
    {
      title: 'The Bitcoin Standard Podcast',
      author: 'Saifedean Ammous',
      description: 'Discussions on Bitcoin and Austrian economics.',
    },
  ],
};

export default function SourcesPage() {
  return (
    <div className={styles.page}>
      <div className={styles.container}>
        {/* Header */}
        <header className={styles.header}>
          <h1 className={styles.title}>Source Library</h1>
          <p className={styles.subtitle}>
            Curated books, papers, videos, and resources about Bitcoin. 
            All content on this site is backed by primary sources.
          </p>
        </header>

        {/* Papers */}
        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>
            <span className={styles.sectionIcon}>
              <FileText size={22} />
            </span>
            Papers
          </h2>
          <div className={styles.sourcesList}>
            {SOURCES.papers.map((source) => (
              <SourceCard key={source.title} source={source} />
            ))}
          </div>
        </section>

        {/* Books */}
        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>
            <span className={styles.sectionIcon}>
              <BookOpen size={22} />
            </span>
            Books
          </h2>
          <div className={styles.sourcesGrid}>
            {SOURCES.books.map((source) => (
              <SourceCard key={source.title} source={source} />
            ))}
          </div>
        </section>

        {/* Videos */}
        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>
            <span className={styles.sectionIcon}>
              <Video size={22} />
            </span>
            Videos
          </h2>
          <div className={styles.sourcesGrid}>
            {SOURCES.videos.map((source) => (
              <SourceCard key={source.title} source={source} />
            ))}
          </div>
        </section>

        {/* Podcasts */}
        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>
            <span className={styles.sectionIcon}>
              <Headphones size={22} />
            </span>
            Podcasts
          </h2>
          <div className={styles.sourcesGrid}>
            {SOURCES.podcasts.map((source) => (
              <SourceCard key={source.title} source={source} />
            ))}
          </div>
        </section>

        {/* CTA */}
        <div className={styles.cta}>
          <h3>Suggest a Source</h3>
          <p>Know a great resource that should be included? Let us know!</p>
          <Badge variant="accent">Coming Soon</Badge>
        </div>
      </div>
    </div>
  );
}

interface SourceCardProps {
  source: {
    title: string;
    author: string;
    year?: number;
    url?: string;
    description: string;
  };
}

function SourceCard({ source }: SourceCardProps) {
  const content = (
    <>
      <h3 className={styles.sourceTitle}>{source.title}</h3>
      <p className={styles.sourceAuthor}>
        {source.author}
        {source.year && <span> • {source.year}</span>}
      </p>
      <p className={styles.sourceDescription}>{source.description}</p>
      {source.url && (
        <span className={styles.sourceLink}>
          View source <ExternalLink size={14} />
        </span>
      )}
    </>
  );

  if (source.url) {
    return (
      <a
        href={source.url}
        target="_blank"
        rel="noopener noreferrer"
        className={styles.sourceCard}
      >
        {content}
      </a>
    );
  }

  return <div className={styles.sourceCard}>{content}</div>;
}
