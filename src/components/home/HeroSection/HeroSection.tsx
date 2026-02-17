'use client';

import { useRef, memo, useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import dynamic from 'next/dynamic';
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion';
import { useTranslations } from 'next-intl';
import { Search, TrendingUp, Sparkles, ArrowRight } from '@/components/icons';
import { TopicIcon } from '@/components/icons';
import { Button } from '@/components/ui';
import styles from './HeroSection.module.css';

// Lazy load AnimatedQuestion since it's not immediately visible
const AnimatedQuestion = dynamic(
  () => import('../AnimatedQuestion').then(mod => ({ default: mod.AnimatedQuestion })),
  { 
    ssr: true,
    loading: () => <div className={styles.questionPlaceholder} />
  }
);

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

interface SearchResult {
  slug: string;
  title: string;
  summary: string;
  topic: string;
  type: string;
  level: string;
  tags: string[];
  topicLabel: string;
  levelLabel: string;
  levelColor: string;
  highlights?: {
    title?: string;
    summary?: string;
  };
}

// Trending searches for empty state
const TRENDING_SEARCHES = [
  { query: 'What is Bitcoin?', queryDe: 'Was ist Bitcoin?', slug: 'what-is-bitcoin' },
  { query: 'Bitcoin energy', queryDe: 'Bitcoin Energie', slug: 'bitcoin-energy-consumption' },
  { query: 'Ponzi scheme', queryDe: 'Ponzi-Schema', slug: 'is-bitcoin-a-ponzi-scheme' },
  { query: 'Lightning Network', queryDe: 'Lightning Network', slug: 'what-is-lightning-network' },
];

// Format stat number: round down to nearest 10 and add "+"
function formatStat(value: number, showPlus = false, roundTo = 10): string {
  if (showPlus) {
    const rounded = Math.floor(value / roundTo) * roundTo;
    return `${rounded}+`;
  }
  return String(value);
}

// Memoized floating particles to prevent re-renders
const FloatingParticles = memo(function FloatingParticles() {
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

  return (
    <>
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
    </>
  );
});

// Memoized gradient orbs
const GradientOrbs = memo(function GradientOrbs() {
  return (
    <>
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
    </>
  );
});

export function HeroSection({ questions, locale = 'en', stats }: HeroSectionProps) {
  const t = useTranslations('home');
  const router = useRouter();
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  
  const [isMounted, setIsMounted] = useState(false);
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  
  const isGerman = locale === 'de';
  
  // Wait for client-side hydration before starting animations
  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Search handler
  const handleSearch = useCallback(async (searchQuery: string) => {
    if (!searchQuery.trim()) {
      setResults([]);
      return;
    }

    setIsLoading(true);
    
    try {
      const response = await fetch(`/api/search?q=${encodeURIComponent(searchQuery)}&locale=${locale}`);
      if (response.ok) {
        const data = await response.json();
        const searchResults = data.results || [];
        setResults(searchResults);
      }
    } catch {
      setResults([]);
    } finally {
      setIsLoading(false);
    }
  }, [locale]);

  // Debounced search
  useEffect(() => {
    const timer = setTimeout(() => {
      handleSearch(query);
    }, 150);

    return () => clearTimeout(timer);
  }, [query, handleSearch]);

  // Reset selection when results change
  useEffect(() => {
    setSelectedIndex(-1);
  }, [results]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        dropdownRef.current && 
        !dropdownRef.current.contains(e.target as Node) &&
        inputRef.current &&
        !inputRef.current.contains(e.target as Node)
      ) {
        setIsFocused(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Calculate max index for keyboard navigation
  const getMaxIndex = () => {
    if (query.trim()) {
      return results.length - 1;
    }
    return TRENDING_SEARCHES.length - 1;
  };

  // Keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent) => {
    const maxIndex = getMaxIndex();
    
    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setSelectedIndex((prev) => Math.min(prev + 1, maxIndex));
        break;
      case 'ArrowUp':
        e.preventDefault();
        setSelectedIndex((prev) => Math.max(prev - 1, -1));
        break;
      case 'Enter':
        e.preventDefault();
        if (query.trim() && selectedIndex >= 0 && results[selectedIndex]) {
          const result = results[selectedIndex];
          router.push(`/${locale}/articles/${result.slug}`);
          setIsFocused(false);
        } else if (!query.trim() && selectedIndex >= 0 && TRENDING_SEARCHES[selectedIndex]) {
          router.push(`/${locale}/articles/${TRENDING_SEARCHES[selectedIndex].slug}`);
          setIsFocused(false);
        } else if (query.trim()) {
          // No selection - go to search results page
          router.push(`/${locale}/search?q=${encodeURIComponent(query)}`);
          setIsFocused(false);
        }
        break;
      case 'Escape':
        setIsFocused(false);
        inputRef.current?.blur();
        break;
    }
  };

  const showDropdown = isFocused; // Always show dropdown when focused
  
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
        <GradientOrbs />

        {/* Floating Particles */}
        <FloatingParticles />

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
          data-testid="hero-title"
          initial={isMounted ? { opacity: 0, y: 30 } : false}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: isMounted ? 0.1 : 0 }}
        >
          {t('heroTitle')}<span className={styles.heroDot}>.</span>
        </motion.h1>

        {/* Animated Question */}
        <motion.div
          className={styles.questionWrapper}
          initial={isMounted ? { opacity: 0, y: 20 } : false}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: isMounted ? 0.3 : 0 }}
        >
          <AnimatedQuestion questions={questions} interval={3500} locale={locale} />
        </motion.div>

        {/* Search Input with Dropdown */}
        <motion.div
          className={styles.searchWrapper}
          initial={isMounted ? { opacity: 0, y: 20 } : false}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: isMounted ? 0.5 : 0 }}
        >
          <div className={`${styles.searchBox} ${isFocused ? styles.searchBoxFocused : ''}`}>
            <Search size={20} className={styles.searchIcon} />
            <input
              ref={inputRef}
              type="text"
              id="hero-search"
              name="hero-search"
              className={styles.searchInput}
              placeholder={t('searchPlaceholder')}
              aria-label="Search"
              data-testid="hero-search-input"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onFocus={() => setIsFocused(true)}
              onKeyDown={handleKeyDown}
              autoComplete="off"
              autoCorrect="off"
              autoCapitalize="off"
              spellCheck="false"
            />
            {isLoading && <div className={styles.spinner} />}
          </div>

          {/* Search Dropdown */}
          <AnimatePresence>
            {showDropdown && (
              <motion.div
                ref={dropdownRef}
                className={styles.searchDropdown}
                data-testid="hero-search-dropdown"
                initial={{ opacity: 0, y: -10, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -10, scale: 0.98 }}
                transition={{ duration: 0.15, ease: [0.16, 1, 0.3, 1] }}
              >
                <div className={styles.dropdownContent}>
                  {query.trim() ? (
                    // Search Results
                    results.length > 0 ? (
                      <>
                        <div className={styles.dropdownHeader}>
                          <Sparkles size={14} />
                          <span>{isGerman ? 'Ergebnisse' : 'Results'}</span>
                        </div>
                        <div className={styles.dropdownResults}>
                          {results.slice(0, 5).map((result, index) => (
                            <motion.div
                              key={result.slug}
                              initial={{ opacity: 0, x: -10 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ delay: index * 0.03 }}
                            >
                              <Link
                                href={`/${locale}/articles/${result.slug}`}
                                className={`${styles.dropdownResult} ${index === selectedIndex ? styles.dropdownResultSelected : ''}`}
                                data-testid={`hero-search-result-${index}`}
                                onClick={() => setIsFocused(false)}
                                onMouseEnter={() => setSelectedIndex(index)}
                              >
                                <div className={styles.dropdownResultIcon}>
                                  <TopicIcon topic={result.topic} size={18} />
                                </div>
                                <div className={styles.dropdownResultContent}>
                                  <h4 className={styles.dropdownResultTitle}>
                                    {result.title}
                                  </h4>
                                  <p className={styles.dropdownResultSummary}>
                                    {result.summary}
                                  </p>
                                </div>
                              </Link>
                            </motion.div>
                          ))}
                        </div>
                      </>
                    ) : !isLoading ? (
                      <div className={styles.dropdownEmpty}>
                        <p>{isGerman ? `Keine Ergebnisse für "${query}"` : `No results for "${query}"`}</p>
                        <p className={styles.dropdownEmptyHint}>
                          {isGerman ? 'Versuche andere Suchbegriffe' : 'Try different keywords'}
                        </p>
                      </div>
                    ) : null
                  ) : (
                    // Trending Searches (empty state)
                    <>
                      <div className={styles.dropdownHeader}>
                        <TrendingUp size={14} />
                        <span>{isGerman ? 'Beliebte Suchen' : 'Trending'}</span>
                      </div>
                      <div className={styles.dropdownTrending}>
                        {TRENDING_SEARCHES.map((item, index) => (
                          <motion.div
                            key={item.slug}
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: index * 0.05 }}
                          >
                            <Link
                              href={`/${locale}/articles/${item.slug}`}
                              className={`${styles.dropdownTrendingItem} ${selectedIndex === index ? styles.dropdownResultSelected : ''}`}
                              onClick={() => setIsFocused(false)}
                              onMouseEnter={() => setSelectedIndex(index)}
                            >
                              <Search size={14} className={styles.dropdownTrendingIcon} />
                              <span>{isGerman ? item.queryDe : item.query}</span>
                              <ArrowRight size={14} className={styles.dropdownTrendingArrow} />
                            </Link>
                          </motion.div>
                        ))}
                      </div>
                    </>
                  )}
                </div>
                
                {/* Fixed Footer - Always visible */}
                {query.trim() && (
                  <Link 
                    href={`/${locale}/search?q=${encodeURIComponent(query)}`}
                    className={styles.dropdownViewAll}
                    onClick={() => setIsFocused(false)}
                  >
                    {isGerman ? 'Alle Ergebnisse anzeigen' : 'View all results'}
                    <ArrowRight size={14} />
                  </Link>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {/* Subtitle */}
        <motion.p
          className={styles.heroSubtitle}
          initial={isMounted ? { opacity: 0, y: 20 } : false}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: isMounted ? 0.6 : 0 }}
        >
          {t('heroSubtitle')}
        </motion.p>

        {/* CTAs */}
        <motion.div
          className={styles.heroCtas}
          initial={isMounted ? { opacity: 0, y: 20 } : false}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: isMounted ? 0.7 : 0 }}
        >
          <Link href={`/${locale}/topics`} data-testid="hero-cta-topics">
            <Button size="lg" variant="primary">
              {t('browseTopics')}
            </Button>
          </Link>
          <Link href={`/${locale}/topics/criticism`} data-testid="hero-cta-criticism">
            <Button size="lg" variant="outline">
              {t('readCriticism')}
            </Button>
          </Link>
        </motion.div>

        {/* Stats/Trust Indicators */}
        <motion.div
          className={styles.trustIndicators}
          initial={isMounted ? { opacity: 0 } : false}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: isMounted ? 0.9 : 0 }}
        >
          <div className={styles.trustItem}>
            <span className={styles.trustNumber}>
              {formatStat(stats?.articles ?? 50, true, 10)}
            </span>
            <span className={styles.trustLabel}>{t('articlesLabel')}</span>
          </div>
          <div className={styles.trustDivider} />
          <div className={styles.trustItem}>
            <span className={styles.trustNumber}>
              {formatStat(stats?.sources ?? 100, true, 10)}
            </span>
            <span className={styles.trustLabel}>{t('sourcesLabel')}</span>
          </div>
          <div className={styles.trustDivider} />
          <div className={styles.trustItem}>
            <span className={styles.trustNumber}>
              {formatStat(stats?.topics ?? 7)}
            </span>
            <span className={styles.trustLabel}>{t('topicsLabel')}</span>
          </div>
        </motion.div>
      </motion.div>

      {/* Scroll Indicator - only visible when at top */}
      <motion.div
        className={styles.scrollIndicator}
        initial={isMounted ? { opacity: 0 } : false}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, delay: isMounted ? 1.1 : 0 }}
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
