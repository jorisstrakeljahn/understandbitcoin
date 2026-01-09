'use client';

import React from 'react';
import Image from 'next/image';
import { ExternalLink, Play, BookOpen, FileText, Clock, User } from 'lucide-react';
import { Source, BookSource, VideoSource, ArticleSource } from '@/lib/sources/types';
import { getYouTubeThumbnail, getAffiliateLink } from '@/lib/sources/utils';
import { Badge } from '@/components/ui';
import styles from './SourceCard.module.css';

type SourceCardVariant = 'default' | 'compact' | 'carousel';

interface SourceCardProps {
  source: Source;
  locale?: string;
  variant?: SourceCardVariant;
}

export function SourceCard({ source, locale = 'en', variant = 'default' }: SourceCardProps) {
  const description = source.description[locale as keyof typeof source.description] || source.description.en;

  if (source.type === 'book') {
    return <BookCard source={source} locale={locale} description={description} variant={variant} />;
  }

  if (source.type === 'video') {
    return <VideoCard source={source} locale={locale} description={description} variant={variant} />;
  }

  return <ArticleCard source={source} locale={locale} description={description} variant={variant} />;
}

interface CardProps<T extends Source> {
  source: T;
  locale: string;
  description: string;
  variant: SourceCardVariant;
}

function BookCard({ source: book, locale, description, variant }: CardProps<BookSource>) {
  const affiliateLink = getAffiliateLink(book, locale);
  const isCarousel = variant === 'carousel';
  
  return (
    <a
      href={affiliateLink || '#'}
      target="_blank"
      rel="noopener noreferrer"
      className={`${styles.card} ${styles.bookCard} ${isCarousel ? styles.carousel : ''}`}
    >
      <div className={styles.coverContainer}>
        <div className={styles.bookCover}>
          {book.cover ? (
            <Image
              src={book.cover}
              alt={book.title}
              fill
              sizes="(max-width: 768px) 120px, 160px"
              className={styles.coverImage}
            />
          ) : (
            <div className={styles.placeholderCover}>
              <BookOpen size={32} />
              <span className={styles.placeholderTitle}>{book.title}</span>
            </div>
          )}
        </div>
        <Badge variant="accent" className={styles.typeBadge}>
          <BookOpen size={12} />
          {locale === 'de' ? 'Buch' : 'Book'}
        </Badge>
      </div>
      
      <div className={styles.content}>
        <h3 className={styles.title}>{book.title}</h3>
        <div className={styles.meta}>
          <span className={styles.author}>
            <User size={12} />
            {book.author}
          </span>
          <span className={styles.year}>{book.year}</span>
        </div>
        {!isCarousel && <p className={styles.description}>{description}</p>}
        {affiliateLink && (
          <span className={styles.linkHint}>
            Amazon <ExternalLink size={12} />
          </span>
        )}
      </div>
    </a>
  );
}

function VideoCard({ source: video, description, variant }: CardProps<VideoSource>) {
  const thumbnail = getYouTubeThumbnail(video.youtubeId, 'high');
  const youtubeUrl = `https://www.youtube.com/watch?v=${video.youtubeId}`;
  const isCarousel = variant === 'carousel';

  return (
    <a
      href={youtubeUrl}
      target="_blank"
      rel="noopener noreferrer"
      className={`${styles.card} ${styles.videoCard} ${isCarousel ? styles.carousel : ''}`}
    >
      <div className={styles.thumbnailContainer}>
        <Image
          src={thumbnail}
          alt={video.title}
          fill
          sizes="(max-width: 768px) 280px, 320px"
          className={styles.thumbnail}
        />
        <div className={styles.playOverlay}>
          <Play size={40} fill="currentColor" />
        </div>
        <div className={styles.duration}>
          <Clock size={12} />
          {video.duration}
        </div>
        <Badge variant="error" className={styles.typeBadge}>
          <Play size={12} />
          Video
        </Badge>
      </div>
      
      <div className={styles.content}>
        <h3 className={styles.title}>{video.title}</h3>
        <div className={styles.meta}>
          <span className={styles.channel}>{video.channel}</span>
          <span className={styles.year}>{video.year}</span>
        </div>
        {!isCarousel && <p className={styles.description}>{description}</p>}
      </div>
    </a>
  );
}

function ArticleCard({ source: article, locale, description, variant }: CardProps<ArticleSource>) {
  const isCarousel = variant === 'carousel';
  
  return (
    <a
      href={article.url}
      target="_blank"
      rel="noopener noreferrer"
      className={`${styles.card} ${styles.articleCard} ${isCarousel ? styles.carousel : ''}`}
    >
      <div className={styles.articleHeader}>
        <div className={styles.articleIcon}>
          <FileText size={28} />
        </div>
        <Badge variant="warning" className={styles.typeBadge}>
          <FileText size={12} />
          {article.articleType === 'whitepaper' ? 'Whitepaper' : (locale === 'de' ? 'Artikel' : 'Article')}
        </Badge>
      </div>
      
      <div className={styles.content}>
        <h3 className={styles.title}>{article.title}</h3>
        <div className={styles.meta}>
          <span className={styles.author}>
            <User size={12} />
            {article.author}
          </span>
          <span className={styles.year}>{article.year}</span>
        </div>
        {!isCarousel && <p className={styles.description}>{description}</p>}
        <span className={styles.linkHint}>
          {locale === 'de' ? 'Lesen' : 'Read'} <ExternalLink size={12} />
        </span>
      </div>
    </a>
  );
}
