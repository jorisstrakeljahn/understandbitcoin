import React from 'react';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { setRequestLocale, getTranslations } from 'next-intl/server';
import { TopicBadge, Badge } from '@/components/ui';
import { TLDRBox, SteelmanBox, SourcesList, KeyTakeaways } from '@/components/mdx';
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
            <h1 className={styles.title}>{frontmatter.title}</h1>
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

          {/* Why People Ask */}
          {frontmatter.whyPeopleAsk && (
            <section className={styles.whySection}>
              <h2 id="why-people-ask">{t('whyPeopleAsk')}</h2>
              <p>{frontmatter.whyPeopleAsk}</p>
            </section>
          )}

          {/* Main Content */}
          <div className={styles.content}>
            <h2 id="the-answer">{t('theAnswer')}</h2>
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
                      {tTopics(related.level)}
                    </span>
                  </Link>
                ))}
              </div>
            </section>
          )}

          {/* Navigation */}
          <nav className={styles.articleNav}>
            <Link href={`/${locale}/topics/${frontmatter.topic}`} className={styles.navLink}>
              <ArrowLeft size={16} /> {t('backTo')} {topic.label}
            </Link>
          </nav>
        </article>

        {/* Right Sidebar - TOC (Collapsible) */}
        <CollapsibleTOC headings={headings} />
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

// Parse inline markdown (bold, italic, code, links)
function parseInlineMarkdown(text: string): React.ReactNode[] {
  const parts: React.ReactNode[] = [];
  let remaining = text;
  let keyIndex = 0;

  while (remaining.length > 0) {
    // Bold: **text** or __text__
    const boldMatch = remaining.match(/^(\*\*|__)(.+?)\1/);
    if (boldMatch) {
      parts.push(<strong key={keyIndex++}>{parseInlineMarkdown(boldMatch[2])}</strong>);
      remaining = remaining.slice(boldMatch[0].length);
      continue;
    }

    // Italic: *text* or _text_
    const italicMatch = remaining.match(/^(\*|_)([^*_]+?)\1/);
    if (italicMatch) {
      parts.push(<em key={keyIndex++}>{parseInlineMarkdown(italicMatch[2])}</em>);
      remaining = remaining.slice(italicMatch[0].length);
      continue;
    }

    // Inline code: `code`
    const codeMatch = remaining.match(/^`([^`]+)`/);
    if (codeMatch) {
      parts.push(<code key={keyIndex++} className={styles.inlineCode}>{codeMatch[1]}</code>);
      remaining = remaining.slice(codeMatch[0].length);
      continue;
    }

    // Links: [text](url)
    const linkMatch = remaining.match(/^\[([^\]]+)\]\(([^)]+)\)/);
    if (linkMatch) {
      parts.push(
        <a key={keyIndex++} href={linkMatch[2]} target="_blank" rel="noopener noreferrer" className={styles.link}>
          {linkMatch[1]}
        </a>
      );
      remaining = remaining.slice(linkMatch[0].length);
      continue;
    }

    // Regular text - consume until next special character or end
    const nextSpecial = remaining.search(/[\*_`\[]/);
    if (nextSpecial === -1) {
      parts.push(remaining);
      break;
    } else if (nextSpecial === 0) {
      // Special char at start but didn't match any pattern, consume it
      parts.push(remaining[0]);
      remaining = remaining.slice(1);
    } else {
      parts.push(remaining.slice(0, nextSpecial));
      remaining = remaining.slice(nextSpecial);
    }
  }

  return parts;
}

// Parse a table from markdown
function parseTable(tableText: string): React.ReactNode {
  const lines = tableText.trim().split('\n').filter(line => line.trim());
  if (lines.length < 2) return null;

  const parseRow = (row: string) => {
    return row
      .split('|')
      .map(cell => cell.trim())
      .filter((cell, i, arr) => i > 0 && i < arr.length - 1 || (arr.length === cell.split('|').length + 1));
  };

  const headerCells = parseRow(lines[0]);
  // Skip the separator line (line[1] with dashes)
  const bodyRows = lines.slice(2).map(parseRow);

  return (
    <div className={styles.tableWrapper}>
      <table className={styles.table}>
        <thead>
          <tr>
            {headerCells.map((cell, i) => (
              <th key={i}>{parseInlineMarkdown(cell)}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {bodyRows.map((row, i) => (
            <tr key={i}>
              {row.map((cell, j) => (
                <td key={j}>{parseInlineMarkdown(cell)}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

// Enhanced content renderer with full Markdown support
function ArticleContent({ content }: { content: string }) {
  const cleanContent = content.replace(/^---[\s\S]*?---/, '').trim();
  
  // Split into blocks, preserving tables and lists
  const blocks: string[] = [];
  let currentBlock = '';
  let inTable = false;
  let inList = false;
  
  const lines = cleanContent.split('\n');
  
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const isTableLine = line.trim().startsWith('|') && line.trim().endsWith('|');
    const isListLine = /^(\d+\.|[-*])\s/.test(line.trim());
    const isHeading = /^#{1,6}\s/.test(line);
    const isBlockquote = line.trim().startsWith('>');
    const isEmpty = line.trim() === '';
    
    if (isTableLine) {
      if (!inTable && currentBlock.trim()) {
        blocks.push(currentBlock.trim());
        currentBlock = '';
      }
      inTable = true;
      currentBlock += line + '\n';
    } else if (inTable && !isTableLine) {
      blocks.push(currentBlock.trim());
      currentBlock = '';
      inTable = false;
      if (!isEmpty) currentBlock = line + '\n';
    } else if (isListLine) {
      if (!inList && currentBlock.trim()) {
        blocks.push(currentBlock.trim());
        currentBlock = '';
      }
      inList = true;
      currentBlock += line + '\n';
    } else if (inList && !isListLine && !isEmpty) {
      blocks.push(currentBlock.trim());
      currentBlock = line + '\n';
      inList = false;
    } else if (inList && isEmpty) {
      blocks.push(currentBlock.trim());
      currentBlock = '';
      inList = false;
    } else if (isHeading || isBlockquote) {
      if (currentBlock.trim()) {
        blocks.push(currentBlock.trim());
      }
      blocks.push(line);
      currentBlock = '';
    } else if (isEmpty && currentBlock.trim()) {
      blocks.push(currentBlock.trim());
      currentBlock = '';
    } else if (!isEmpty) {
      currentBlock += line + '\n';
    }
  }
  
  if (currentBlock.trim()) {
    blocks.push(currentBlock.trim());
  }

  return (
    <div className={styles.prose}>
      {blocks.map((block, i) => {
        // Heading 2
        if (block.startsWith('## ')) {
          const text = block.replace('## ', '');
          const id = text.toLowerCase().replace(/[^a-z0-9äöüß]+/g, '-').replace(/(^-|-$)/g, '');
          return <h2 key={i} id={id}>{parseInlineMarkdown(text)}</h2>;
        }
        
        // Heading 3
        if (block.startsWith('### ')) {
          const text = block.replace('### ', '');
          const id = text.toLowerCase().replace(/[^a-z0-9äöüß]+/g, '-').replace(/(^-|-$)/g, '');
          return <h3 key={i} id={id}>{parseInlineMarkdown(text)}</h3>;
        }
        
        // Heading 4
        if (block.startsWith('#### ')) {
          const text = block.replace('#### ', '');
          return <h4 key={i}>{parseInlineMarkdown(text)}</h4>;
        }
        
        // Table
        if (block.includes('|') && block.includes('\n')) {
          const tableResult = parseTable(block);
          if (tableResult) return <div key={i}>{tableResult}</div>;
        }
        
        // Blockquote
        if (block.startsWith('>')) {
          const quoteText = block.replace(/^>\s?/gm, '');
          return (
            <blockquote key={i} className={styles.blockquote}>
              {parseInlineMarkdown(quoteText)}
            </blockquote>
          );
        }
        
        // Ordered list
        if (/^\d+\.\s/.test(block)) {
          const items = block.split('\n').filter(line => line.trim());
          return (
            <ol key={i}>
              {items.map((item, j) => (
                <li key={j}>{parseInlineMarkdown(item.replace(/^\d+\.\s/, ''))}</li>
              ))}
            </ol>
          );
        }
        
        // Unordered list
        if (/^[-*]\s/.test(block)) {
          const items = block.split('\n').filter(line => line.trim());
          return (
            <ul key={i}>
              {items.map((item, j) => (
                <li key={j}>{parseInlineMarkdown(item.replace(/^[-*]\s/, ''))}</li>
              ))}
            </ul>
          );
        }
        
        // Paragraph
        if (block.trim()) {
          return <p key={i}>{parseInlineMarkdown(block)}</p>;
        }
        
        return null;
      })}
    </div>
  );
}
