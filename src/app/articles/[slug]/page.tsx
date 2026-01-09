import { notFound } from 'next/navigation';
import Link from 'next/link';
import { Badge } from '@/components/ui';
import { TLDRBox, SteelmanBox, SourcesList, KeyTakeaways } from '@/components/mdx';
import { TOPICS, LEVELS } from '@/lib/content/schema';
import { getContentBySlug, getAllContent, getRelatedContent } from '@/lib/content/loader';
import { ArticleSidebar } from '@/components/article/ArticleSidebar';
import { TableOfContents } from '@/components/article/TableOfContents';
import { MobileNav } from '@/components/article/MobileNav';
import { ArticleJsonLd, FAQJsonLd, BreadcrumbJsonLd } from '@/components/seo';
import { TopicIcon, HelpCircle, ArrowLeft } from '@/components/icons';
import styles from './article.module.css';

const BASE_URL = 'https://thereforbitcoin.com';

interface ArticlePageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: ArticlePageProps) {
  const { slug } = await params;
  const article = getContentBySlug(slug);
  
  if (!article) {
    return { title: 'Article Not Found' };
  }

  const articleUrl = `${BASE_URL}/articles/${slug}`;

  return {
    title: article.frontmatter.title,
    description: article.frontmatter.summary,
    alternates: {
      canonical: articleUrl,
    },
    openGraph: {
      title: article.frontmatter.title,
      description: article.frontmatter.summary,
      type: 'article',
      publishedTime: article.frontmatter.lastUpdated,
      modifiedTime: article.frontmatter.lastUpdated,
      url: articleUrl,
      siteName: 'Therefor Bitcoin',
      images: [
        {
          url: `${BASE_URL}/og?title=${encodeURIComponent(article.frontmatter.title)}&subtitle=${encodeURIComponent(article.frontmatter.summary.slice(0, 100))}&topic=${article.frontmatter.topic}`,
          width: 1200,
          height: 630,
          alt: article.frontmatter.title,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: article.frontmatter.title,
      description: article.frontmatter.summary,
    },
  };
}

export function generateStaticParams() {
  const allContent = getAllContent();
  return allContent.map((item) => ({ slug: item.slug }));
}

export default async function ArticlePage({ params }: ArticlePageProps) {
  const { slug } = await params;
  const article = getContentBySlug(slug);
  
  if (!article) {
    notFound();
  }

  const { frontmatter, content } = article;
  const topic = TOPICS[frontmatter.topic];
  const level = LEVELS[frontmatter.level];
  const relatedArticles = getRelatedContent(slug, 'en', 4);
  
  // Get all articles for sidebar
  const allArticles = getAllContent().map((a) => ({
    slug: a.slug,
    title: a.frontmatter.title,
    topic: a.frontmatter.topic,
  }));

  // Parse headings from content for TOC
  const headings = extractHeadings(content);

  // Prepare JSON-LD data
  const articleUrl = `${BASE_URL}/articles/${slug}`;
  const breadcrumbItems = [
    { name: 'Home', url: BASE_URL },
    { name: 'Topics', url: `${BASE_URL}/topics` },
    { name: topic.label, url: `${BASE_URL}/topics/${frontmatter.topic}` },
    { name: frontmatter.title, url: articleUrl },
  ];

  // Create FAQ from TL;DR if available
  const faqItems = frontmatter.tldr?.map((item, index) => ({
    question: index === 0 ? frontmatter.title : `Key point ${index + 1} about ${frontmatter.title.toLowerCase()}`,
    answer: item,
  })) || [];

  return (
    <div className={styles.page}>
      {/* JSON-LD Structured Data */}
      <ArticleJsonLd
        url={articleUrl}
        title={frontmatter.title}
        description={frontmatter.summary}
        datePublished={frontmatter.lastUpdated}
        dateModified={frontmatter.lastUpdated}
      />
      <BreadcrumbJsonLd items={breadcrumbItems} />
      {faqItems.length > 0 && <FAQJsonLd questions={faqItems} />}

      {/* Mobile Navigation */}
      <MobileNav headings={headings} />
      
      <div className={styles.container}>
        {/* Left Sidebar - Topic Navigation */}
        <aside className={styles.leftSidebar}>
          <ArticleSidebar 
            currentTopic={frontmatter.topic} 
            currentSlug={slug} 
            articles={allArticles}
          />
        </aside>

        {/* Main Content */}
        <article className={styles.article}>
          {/* Breadcrumb */}
          <nav className={styles.breadcrumb}>
            <Link href="/topics">Documentation</Link>
            <span>&gt;</span>
            <Link href={`/topics/${frontmatter.topic}`}>{topic.label}</Link>
            <span>&gt;</span>
            <span>{frontmatter.title}</span>
          </nav>

          {/* Article Header */}
          <header className={styles.header}>
            <div className={styles.meta}>
              <Badge variant="accent">
                <TopicIcon topic={frontmatter.topic} size={14} />
                <span style={{ marginLeft: '4px' }}>{topic.label}</span>
              </Badge>
              <Badge
                variant={
                  frontmatter.level === 'beginner' ? 'success' :
                  frontmatter.level === 'intermediate' ? 'warning' : 'error'
                }
              >
                {level.label}
              </Badge>
              <span className={styles.readTime}>{article.readTime} min read</span>
            </div>
            <h1 className={styles.title}>{frontmatter.title}</h1>
            <p className={styles.summary}>{frontmatter.summary}</p>
            <div className={styles.trustCues}>
              <span>Last updated: {formatDate(frontmatter.lastUpdated)}</span>
              {frontmatter.sources && frontmatter.sources.length > 0 && (
                <span>{frontmatter.sources.length} sources cited</span>
              )}
            </div>
          </header>

          {/* TL;DR Box */}
          {frontmatter.tldr && frontmatter.tldr.length > 0 && (
            <TLDRBox items={frontmatter.tldr} />
          )}

          {/* Why People Ask */}
          {frontmatter.whyPeopleAsk && (
            <section className={styles.whySection}>
              <h2 id="why-people-ask">Why People Ask This</h2>
              <p>{frontmatter.whyPeopleAsk}</p>
            </section>
          )}

          {/* Main Content */}
          <div className={styles.content}>
            <h2 id="the-answer">The Answer</h2>
            <ArticleContent content={content} />
          </div>

          {/* Steelman Objection */}
          {frontmatter.steelmanObjection && (
            <SteelmanBox>
              <p>{frontmatter.steelmanObjection}</p>
            </SteelmanBox>
          )}

          {/* What's True / What's Uncertain */}
          {(frontmatter.whatIsTrue || frontmatter.whatIsUncertain) && (
            <section className={styles.truthSection}>
              <h2 id="truth-and-uncertainty">What&apos;s True &amp; What&apos;s Uncertain</h2>
              <div className={styles.truthGrid}>
                {frontmatter.whatIsTrue && frontmatter.whatIsTrue.length > 0 && (
                  <KeyTakeaways items={frontmatter.whatIsTrue} />
                )}
                {frontmatter.whatIsUncertain && frontmatter.whatIsUncertain.length > 0 && (
                  <div className={styles.uncertainBox}>
                    <h4 className={styles.uncertainTitle}>
                      <HelpCircle size={18} />
                      Still Uncertain
                    </h4>
                    <ul>
                      {frontmatter.whatIsUncertain.map((item, i) => (
                        <li key={i}>{item}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </section>
          )}

          {/* Sources */}
          {frontmatter.sources && frontmatter.sources.length > 0 && (
            <SourcesList sources={frontmatter.sources} />
          )}

          {/* Related Questions */}
          {relatedArticles.length > 0 && (
            <section className={styles.relatedSection}>
              <h2 id="related-questions">Related Questions</h2>
              <div className={styles.relatedGrid}>
                {relatedArticles.map((related) => (
                  <Link
                    key={related.slug}
                    href={`/articles/${related.slug}`}
                    className={styles.relatedCard}
                  >
                    <h3>{related.title}</h3>
                    <p>{related.summary}</p>
                    <span className={styles.relatedMeta}>
                      {related.readTime} min · {LEVELS[related.level].label}
                    </span>
                  </Link>
                ))}
              </div>
            </section>
          )}

          {/* Navigation */}
          <nav className={styles.articleNav}>
            <Link href={`/topics/${frontmatter.topic}`} className={styles.navLink}>
              <ArrowLeft size={16} /> Back to {topic.label}
            </Link>
          </nav>
        </article>

        {/* Right Sidebar - TOC */}
        <aside className={styles.rightSidebar}>
          <TableOfContents headings={headings} />
        </aside>
      </div>
    </div>
  );
}

// Helper function to extract headings from MDX content
function extractHeadings(content: string): { id: string; text: string; level: number }[] {
  const headingRegex = /^(#{2,3})\s+(.+)$/gm;
  const headings: { id: string; text: string; level: number }[] = [];
  let match;

  while ((match = headingRegex.exec(content)) !== null) {
    const level = match[1].length;
    const text = match[2];
    const id = text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    headings.push({ id, text, level });
  }

  return headings;
}

// Helper function to format date
function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

// Simple content renderer (placeholder - would use MDX compiler in production)
function ArticleContent({ content }: { content: string }) {
  // Remove frontmatter and render as simple paragraphs
  const cleanContent = content.replace(/^---[\s\S]*?---/, '').trim();
  
  return (
    <div className={styles.prose}>
      {cleanContent.split('\n\n').map((paragraph, i) => {
        if (paragraph.startsWith('## ')) {
          const text = paragraph.replace('## ', '');
          const id = text.toLowerCase().replace(/[^a-z0-9]+/g, '-');
          return <h2 key={i} id={id}>{text}</h2>;
        }
        if (paragraph.startsWith('### ')) {
          const text = paragraph.replace('### ', '');
          const id = text.toLowerCase().replace(/[^a-z0-9]+/g, '-');
          return <h3 key={i} id={id}>{text}</h3>;
        }
        if (paragraph.startsWith('- ')) {
          return (
            <ul key={i}>
              {paragraph.split('\n').map((item, j) => (
                <li key={j}>{item.replace('- ', '')}</li>
              ))}
            </ul>
          );
        }
        if (paragraph.trim()) {
          return <p key={i}>{paragraph}</p>;
        }
        return null;
      })}
    </div>
  );
}
