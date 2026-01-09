'use client';

import { useRef } from 'react';
import Link from 'next/link';
import { motion, useScroll, useTransform } from 'framer-motion';
import { useTranslations } from 'next-intl';
import { Search } from '@/components/icons';
import { Button } from '@/components/ui';
import { AnimatedQuestion } from '../AnimatedQuestion';
import styles from './HeroSection.module.css';

interface Question {
  text: string;
  slug: string;
}

interface Stats {
  articles: number;
  sources: number;
  topics: number;
}

interface HeroSectionProps {
  questions: Question[];
  locale?: string;
  stats?: Stats;
}

// Format stat number: round down to nearest 10 and add "+"
function formatStat(value: number, showPlus = false, roundTo = 10): string {
  if (showPlus) {
    const rounded = Math.floor(value / roundTo) * roundTo;
    return `${rounded}+`;
  }
  return String(value);
}

// Floating particles configuration
const FLOATING_ELEMENTS = [
  { size: 6, x: '10%', y: '20%', delay: 0, duration: 8 },
  { size: 4, x: '85%', y: '15%', delay: 1, duration: 10 },
  { size: 8, x: '75%', y: '70%', delay: 2, duration: 7 },
  { size: 5, x: '20%', y: '75%', delay: 0.5, duration: 9 },
  { size: 3, x: '90%', y: '45%', delay: 1.5, duration: 11 },
  { size: 7, x: '5%', y: '50%', delay: 2.5, duration: 8 },
  { size: 4, x: '60%', y: '85%', delay: 0.8, duration: 10 },
  { size: 5, x: '40%', y: '10%', delay: 1.2, duration: 9 },
];

export function HeroSection({ questions, locale = 'en', stats }: HeroSectionProps) {
  const t = useTranslations('home');
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end start'],
  });

  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);
  const scale = useTransform(scrollYProgress, [0, 0.5], [1, 0.95]);
  const y = useTransform(scrollYProgress, [0, 0.5], [0, 50]);
  
  // Scroll indicator fades out quickly when scrolling starts
  const scrollIndicatorOpacity = useTransform(scrollYProgress, [0, 0.1], [1, 0]);

  return (
    <section className={styles.hero} ref={containerRef}>
      {/* Animated Background */}
      <div className={styles.heroBackground}>
        {/* Gradient Orbs */}
        <motion.div
          className={styles.gradientOrb1}
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.5, 0.3],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
        <motion.div
          className={styles.gradientOrb2}
          animate={{
            scale: [1.2, 1, 1.2],
            opacity: [0.2, 0.4, 0.2],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />

        {/* Floating Particles */}
        {FLOATING_ELEMENTS.map((particle, index) => (
          <motion.div
            key={index}
            className={styles.floatingParticle}
            style={{
              width: particle.size,
              height: particle.size,
              left: particle.x,
              top: particle.y,
            }}
            animate={{
              y: [-20, 20, -20],
              x: [-10, 10, -10],
              opacity: [0.3, 0.6, 0.3],
            }}
            transition={{
              duration: particle.duration,
              repeat: Infinity,
              ease: 'easeInOut',
              delay: particle.delay,
            }}
          />
        ))}

        {/* Grid Pattern */}
        <div className={styles.heroPattern} />
      </div>

      {/* Main Content */}
      <motion.div
        className={styles.heroContent}
        style={{ opacity, scale, y }}
      >
        {/* Main Title */}
        <motion.h1
          className={styles.heroTitle}
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
        >
          {t('heroTitle')}<span className={styles.heroDot}>.</span>
        </motion.h1>

        {/* Animated Question */}
        <motion.div
          className={styles.questionWrapper}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          <AnimatedQuestion questions={questions} interval={3500} locale={locale} />
        </motion.div>

        {/* Search Input */}
        <motion.div
          className={styles.searchWrapper}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
        >
          <div className={styles.searchBox}>
            <Search size={20} className={styles.searchIcon} />
            <input
              type="text"
              className={styles.searchInput}
              placeholder={t('searchPlaceholder')}
              aria-label="Search"
            />
            <kbd className={styles.searchKbd}>⌘K</kbd>
          </div>
        </motion.div>

        {/* Subtitle */}
        <motion.p
          className={styles.heroSubtitle}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
        >
          {t('heroSubtitle')}
        </motion.p>

        {/* CTAs */}
        <motion.div
          className={styles.heroCtas}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.7 }}
        >
          <Link href={`/${locale}/topics`}>
            <Button size="lg" variant="primary">
              {t('browseTopics')}
            </Button>
          </Link>
          <Link href={`/${locale}/topics/criticism`}>
            <Button size="lg" variant="outline">
              {t('readCriticism')}
            </Button>
          </Link>
        </motion.div>

        {/* Stats/Trust Indicators */}
        <motion.div
          className={styles.trustIndicators}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.9 }}
        >
          <div className={styles.trustItem}>
            <span className={styles.trustNumber}>
              {formatStat(stats?.articles ?? 50, true, 10)}
            </span>
            <span className={styles.trustLabel}>{locale === 'de' ? 'Artikel' : 'Articles'}</span>
          </div>
          <div className={styles.trustDivider} />
          <div className={styles.trustItem}>
            <span className={styles.trustNumber}>
              {formatStat(stats?.sources ?? 100, true, 10)}
            </span>
            <span className={styles.trustLabel}>{locale === 'de' ? 'Quellen' : 'Sources'}</span>
          </div>
          <div className={styles.trustDivider} />
          <div className={styles.trustItem}>
            <span className={styles.trustNumber}>
              {formatStat(stats?.topics ?? 7)}
            </span>
            <span className={styles.trustLabel}>{locale === 'de' ? 'Themen' : 'Topics'}</span>
          </div>
        </motion.div>
      </motion.div>

      {/* Scroll Indicator - only visible when at top */}
      <motion.div
        className={styles.scrollIndicator}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, delay: 1.1 }}
        style={{ opacity: scrollIndicatorOpacity }}
      >
        <motion.div
          className={styles.scrollMouse}
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
        >
          <div className={styles.scrollWheel} />
        </motion.div>
        <span className={styles.scrollText}>{t('scrollToExplore')}</span>
      </motion.div>
    </section>
  );
}
