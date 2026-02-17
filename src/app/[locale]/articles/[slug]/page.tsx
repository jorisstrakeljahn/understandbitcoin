import { notFound } from 'next/navigation';
import Link from 'next/link';
import { setRequestLocale, getTranslations } from 'next-intl/server';
import { TopicBadge, Badge } from '@/components/ui';
import { TLDRBox, SourcesList, KeyTakeaways, MDXContent } from '@/components/mdx';
import { stripFrontmatter } from '@/lib/mdx';
import { getContentBySlug, getAllContent, getRelatedContent, getTopicConfig, getLevelConfig, getAllTopicsFromConfig } from '@/lib/content/loader';
import { extractHeadings } from '@/lib/mdx';
import { ArticleSidebar } from '@/components/article/ArticleSidebar';
import { MobileNav } from '@/components/article/MobileNav';
import { ResizableSidebar } from '@/components/article/ResizableSidebar';
import { CollapsibleTOC } from '@/components/article/CollapsibleTOC';
import { ArticleJsonLd, FAQJsonLd, BreadcrumbJsonLd } from '@/components/seo';
import { HelpCircle, ArrowLeft } from '@/components/icons';
import { siteConfig } from '@/lib/config';
import styles from './article.module.css';

const BASE_URL = siteConfig.url;

interface ArticlePageProps {
  params: Promise<{ locale: string; slug: string }>;
}

export async function generateMetadata({ params }: ArticlePageProps) {
  const { locale, slug } = await params;
  const article = getContentBySlug(slug, locale) || getContentBySlug(slug, 'en');
  
  if (!article) {
    return { title: locale === 'de' ? 'Artikel nicht gefunden' : 'Article Not Found' };
  }

  const articleUrl = `${BASE_URL}/${locale}/articles/${slug}`;

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
  };
}

export function generateStaticParams() {
  const allContent = getAllContent();
  return allContent.map((item) => ({ slug: item.slug }));
}

export default async function ArticlePage({ params }: ArticlePageProps) {
  const { locale, slug } = await params;
  setRequestLocale(locale);
  
  const t = await getTranslations({ locale, namespace: 'article' });
  const tTopics = await getTranslations({ locale, namespace: 'topics' });
  
  const article = getContentBySlug(slug, locale) || getContentBySlug(slug, 'en');
  
  if (!article) {
    notFound();
  }

  const { frontmatter, content } = article;
  const topic = getTopicConfig(frontmatter.topic, locale);
  const level = getLevelConfig(frontmatter.level, locale);
  const relatedArticles = getRelatedContent(slug, locale, 4).length > 0 
    ? getRelatedContent(slug, locale, 4) 
    : getRelatedContent(slug, 'en', 4);
  
  // Get all articles for sidebar
  const allArticles = (getAllContent(locale).length > 0 ? getAllContent(locale) : getAllContent('en')).map((a) => ({
    slug: a.slug,
    title: a.frontmatter.title,
    topic: a.frontmatter.topic,
  }));
  
  // Get topics from config for sidebar
  const topicsForSidebar = getAllTopicsFromConfig(locale).map((t) => ({
    id: t.id,
    label: t.label,
  }));

  // Parse headings from content for TOC
  const headings = extractHeadings(content);

  // Prepare JSON-LD data
  const articleUrl = `${BASE_URL}/${locale}/articles/${slug}`;
  const breadcrumbItems = [
    { name: locale === 'de' ? 'Startseite' : 'Home', url: `${BASE_URL}/${locale}` },
    { name: tTopics('documentation'), url: `${BASE_URL}/${locale}/topics` },
    { name: topic.label, url: `${BASE_URL}/${locale}/topics/${frontmatter.topic}` },
    { name: frontmatter.title, url: articleUrl },
  ];

  // Create FAQ from TL;DR if available
  const faqItems = frontmatter.tldr?.map((item, index) => ({
    question: index === 0 ? frontmatter.title : `${locale === 'de' ? 'Wichtiger Punkt' : 'Key point'} ${index + 1}`,
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
        {/* Left Sidebar - Topic Navigation (Resizable) */}
        <ResizableSidebar 
          defaultWidth={280} 
          minWidth={200} 
          maxWidth={450}
          storageKey="docs-sidebar-width"
        >
          <ArticleSidebar 
            currentTopic={frontmatter.topic} 
            currentSlug={slug} 
            articles={allArticles}
            topics={topicsForSidebar}
            locale={locale}
          />
        </ResizableSidebar>

        {/* Main Content */}
        <article className={styles.article}>
          {/* Breadcrumb */}
          <nav className={styles.breadcrumb}>
            <Link href={`/${locale}/topics`}>{tTopics('documentation')}</Link>
            <span>&gt;</span>
            <Link href={`/${locale}/topics/${frontmatter.topic}`}>{topic.label}</Link>
            <span>&gt;</span>
            <span>{frontmatter.title}</span>
          </nav>

          {/* Article Header */}
          <header className={styles.header}>
            <div className={styles.meta}>
              <TopicBadge topic={frontmatter.topic} label={topic.label} />
              <Badge
                variant={
                  frontmatter.level === 'beginner' ? 'success' :
                  frontmatter.level === 'intermediate' ? 'warning' : 'error'
                }
              >
                {level.label}
              </Badge>
            </div>
            <h1 className={styles.title} data-testid="article-title">{frontmatter.title}</h1>
            <p className={styles.summary}>{frontmatter.summary}</p>
            <div className={styles.trustCues}>
              <span>{t('lastUpdated')}: {formatDate(frontmatter.lastUpdated, locale)}</span>
              {frontmatter.sources && frontmatter.sources.length > 0 && (
                <span>{frontmatter.sources.length} {t('sourcesCited')}</span>
              )}
            </div>
          </header>

          {/* TL;DR Box */}
          {frontmatter.tldr && frontmatter.tldr.length > 0 && (
            <TLDRBox items={frontmatter.tldr} />
          )}

          {/* Main Content */}
          <div className={`${styles.content} ${styles.prose}`} data-testid="article-content">
            <MDXContent source={stripFrontmatter(content)} />
          </div>

          {/* What's True / What's Uncertain */}
          {(frontmatter.whatIsTrue || frontmatter.whatIsUncertain) && (
            <section className={styles.truthSection}>
              <h2 id="truth-and-uncertainty">{t('truthAndUncertainty')}</h2>
              <div className={styles.truthGrid}>
                {frontmatter.whatIsTrue && frontmatter.whatIsTrue.length > 0 && (
                  <KeyTakeaways items={frontmatter.whatIsTrue} />
                )}
                {frontmatter.whatIsUncertain && frontmatter.whatIsUncertain.length > 0 && (
                  <div className={styles.uncertainBox}>
                    <h4 className={styles.uncertainTitle}>
                      <HelpCircle size={18} />
                      {t('stillUncertain')}
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
              <h2 id="related-questions">{t('relatedQuestions')}</h2>
              <div className={styles.relatedGrid}>
                {relatedArticles.map((related) => (
                  <Link
                    key={related.slug}
                    href={`/${locale}/articles/${related.slug}`}
                    className={styles.relatedCard}
                  >
                    <h3>{related.title}</h3>
                    <p>{related.summary}</p>
                    <span className={styles.relatedMeta}>
                      {({
                        beginner: tTopics('beginner'),
                        intermediate: tTopics('intermediate'),
                        advanced: tTopics('advanced')
                      } as Record<string, string>)[related.level] || related.level}
                    </span>
                  </Link>
                ))}
              </div>
            </section>
          )}

          {/* Navigation */}
          <nav className={styles.articleNav}>
            <Link href={`/${locale}/topics/${frontmatter.topic}`} className={styles.navLink} data-testid="article-back-button">
              <ArrowLeft size={16} /> {t('backTo')} {topic.label}
            </Link>
          </nav>
        </article>

        {/* Right Sidebar - TOC (Collapsible) */}
        <CollapsibleTOC headings={headings} slug={slug} />
      </div>
    </div>
  );
}

// Helper function to format date
function formatDate(dateString: string, locale: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString(locale === 'de' ? 'de-DE' : 'en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

