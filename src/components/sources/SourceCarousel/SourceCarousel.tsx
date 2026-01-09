'use client';

import React, { useState, useEffect } from 'react';
import { Source } from '@/lib/sources/types';
import { SourceCard } from '../SourceCard';
import styles from './SourceCarousel.module.css';

// Fisher-Yates shuffle
function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

interface SourceCarouselProps {
  sources: Source[];
  locale?: string;
  title?: string;
  subtitle?: string;
}

export function SourceCarousel({ sources, locale = 'en', title, subtitle }: SourceCarouselProps) {
  // Use state to shuffle sources client-side only (avoid hydration mismatch)
  const [shuffledSources, setShuffledSources] = useState<Source[]>(sources);
  
  useEffect(() => {
    // Shuffle on client-side mount
    setShuffledSources(shuffleArray(sources));
  }, [sources]);

  // Duplicate for seamless scroll
  const duplicatedSources = [...shuffledSources, ...shuffledSources, ...shuffledSources];

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
