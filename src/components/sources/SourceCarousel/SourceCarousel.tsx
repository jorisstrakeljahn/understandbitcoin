'use client';

import React from 'react';
import { Source } from '@/lib/sources/types';
import { SourceCard } from '../SourceCard';
import styles from './SourceCarousel.module.css';

interface SourceCarouselProps {
  sources: Source[];
  locale?: string;
  title?: string;
  subtitle?: string;
}

export function SourceCarousel({ sources, locale = 'en', title, subtitle }: SourceCarouselProps) {
  // Duplicate sources for seamless infinite scroll
  const duplicatedSources = [...sources, ...sources, ...sources];

  return (
    <div className={styles.wrapper}>
      {(title || subtitle) && (
        <div className={styles.header}>
          {title && <h2 className={styles.title}>{title}</h2>}
          {subtitle && <p className={styles.subtitle}>{subtitle}</p>}
        </div>
      )}
      
      <div className={styles.carouselContainer}>
        <div className={styles.carousel}>
          <div className={styles.track}>
            {duplicatedSources.map((source, index) => (
              <SourceCard 
                key={`${source.id}-${index}`} 
                source={source} 
                locale={locale}
                variant="carousel"
              />
            ))}
          </div>
        </div>
        
        {/* Gradient overlays for fade effect */}
        <div className={styles.gradientLeft} />
        <div className={styles.gradientRight} />
      </div>
    </div>
  );
}
