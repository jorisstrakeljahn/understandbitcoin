'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useLocale, useTranslations } from 'next-intl';
import { motion, AnimatePresence } from 'framer-motion';
import { Badge } from '@/components/ui';
import { trackSearch, trackSearchResultClick } from '@/lib/analytics';
import { Search, Bitcoin, HelpCircle, Zap, Sparkles, TrendingUp, ArrowRight } from '@/components/icons';
import { TopicIcon } from '@/components/icons';
import styles from './SearchModal.module.css';

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

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

// Quick links for empty state
const QUICK_LINKS = [
  { icon: Bitcoin, label: 'Bitcoin Basics', labelDe: 'Bitcoin Grundlagen', href: '/topics/basics' },
  { icon: HelpCircle, label: 'Criticism', labelDe: 'Kritik', href: '/topics/criticism' },
  { icon: Zap, label: 'Lightning', labelDe: 'Lightning', href: '/topics/lightning' },
];

// Trending searches
const TRENDING_SEARCHES = [
  { query: 'What is Bitcoin?', queryDe: 'Was ist Bitcoin?', slug: 'what-is-bitcoin' },
  { query: 'Bitcoin energy', queryDe: 'Bitcoin Energie', slug: 'bitcoin-energy-consumption' },
  { query: 'Ponzi scheme', queryDe: 'Ponzi-Schema', slug: 'is-bitcoin-a-ponzi-scheme' },
  { query: 'Lightning Network', queryDe: 'Lightning Network', slug: 'what-is-lightning-network' },
];

export function SearchModal({ isOpen, onClose }: SearchModalProps) {
  const t = useTranslations();
  const locale = useLocale();
  const router = useRouter();
  const isGerman = locale === 'de';
  
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const resultsRef = useRef<HTMLDivElement>(null);
  const lastTrackedQuery = useRef<string>('');

  // Keyboard shortcut to open (⌘K)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        // Parent handles this
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen]);

  // Focus input and lock body scroll when opened
  useEffect(() => {
    if (isOpen) {
      // Small delay to allow animation to start
      setTimeout(() => inputRef.current?.focus(), 50);
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
      setQuery('');
      setResults([]);
      setSelectedIndex(0);
    }

    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

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
        
        // Track search query
        if (searchQuery.trim() !== lastTrackedQuery.current) {
          lastTrackedQuery.current = searchQuery.trim();
          trackSearch(searchQuery.trim(), searchResults.length);
        }
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
        setSelectedIndex((prev) => Math.max(prev - 1, 0));
        break;
      case 'Enter':
        e.preventDefault();
        if (query.trim() && results[selectedIndex]) {
          const result = results[selectedIndex];
          trackSearchResultClick(query, result.slug, selectedIndex);
          router.push(`/${locale}/articles/${result.slug}`);
          onClose();
        } else if (!query.trim() && TRENDING_SEARCHES[selectedIndex]) {
          router.push(`/${locale}/articles/${TRENDING_SEARCHES[selectedIndex].slug}`);
          onClose();
        } else if (query.trim()) {
          router.push(`/${locale}/search?q=${encodeURIComponent(query)}`);
          onClose();
        }
        break;
      case 'Escape':
        onClose();
        break;
    }
  };

  // Scroll selected item into view
  useEffect(() => {
    const selectedElement = resultsRef.current?.children[selectedIndex] as HTMLElement;
    selectedElement?.scrollIntoView({ block: 'nearest' });
  }, [selectedIndex]);

  // Reset selection when results change
  useEffect(() => {
    setSelectedIndex(0);
  }, [results]);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div 
          className={styles.overlay}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.15 }}
          onClick={onClose}
        >
          <motion.div 
            className={styles.modal}
            initial={{ opacity: 0, y: -20, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.98 }}
            transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Search Input */}
            <div className={styles.inputWrapper}>
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.1 }}
              >
                <Search size={20} className={styles.searchIcon} />
              </motion.div>
              <input
                ref={inputRef}
                type="text"
                className={styles.input}
                placeholder={isGerman ? 'Artikel, Themen, Begriffe suchen...' : 'Search articles, topics, terms...'}
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={handleKeyDown}
                autoComplete="off"
                autoCorrect="off"
                autoCapitalize="off"
                spellCheck="false"
              />
              
              {/* Loading Spinner */}
              <AnimatePresence mode="wait">
                {isLoading ? (
                  <motion.div 
                    className={styles.spinner}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                  />
                ) : (
                  <motion.button 
                    className={styles.closeButton} 
                    onClick={onClose}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <kbd>ESC</kbd>
                  </motion.button>
                )}
              </AnimatePresence>
            </div>

            {/* Results Container */}
            <div className={styles.resultsContainer}>
              <AnimatePresence mode="wait">
                {query.trim() ? (
                  // Search Results
                  results.length > 0 ? (
                    <motion.div
                      key="results"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.15 }}
                    >
                      <div className={styles.sectionHeader}>
                        <Sparkles size={14} />
                        <span>{isGerman ? 'Ergebnisse' : 'Results'}</span>
                      </div>
                      <div className={styles.results} ref={resultsRef}>
                        {results.map((result, index) => (
                          <motion.div
                            key={result.slug}
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: index * 0.03 }}
                          >
                            <Link
                              href={`/${locale}/articles/${result.slug}`}
                              className={`${styles.result} ${index === selectedIndex ? styles.selected : ''}`}
                              onClick={() => {
                                trackSearchResultClick(query, result.slug, index);
                                onClose();
                              }}
                              onMouseEnter={() => setSelectedIndex(index)}
                            >
                              <div className={styles.resultIcon}>
                                <TopicIcon topic={result.topic} size={18} />
                              </div>
                              <div className={styles.resultContent}>
                                <h4 
                                  className={styles.resultTitle}
                                  dangerouslySetInnerHTML={{ 
                                    __html: result.highlights?.title || result.title 
                                  }}
                                />
                                <p 
                                  className={styles.resultSummary}
                                  dangerouslySetInnerHTML={{ 
                                    __html: result.highlights?.summary || result.summary 
                                  }}
                                />
                              </div>
                              <div className={styles.resultMeta}>
                                <Badge variant="accent">{result.topicLabel}</Badge>
                                <Badge variant="default" style={{ color: result.levelColor }}>
                                  {result.levelLabel}
                                </Badge>
                              </div>
                            </Link>
                          </motion.div>
                        ))}
                      </div>
                      
                      {/* View all link */}
                      <motion.div 
                        className={styles.viewAllWrapper}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.2 }}
                      >
                        <Link 
                          href={`/${locale}/search?q=${encodeURIComponent(query)}`}
                          className={styles.viewAllLink}
                          onClick={onClose}
                        >
                          {isGerman ? 'Alle Ergebnisse anzeigen' : 'View all results'}
                          <ArrowRight size={14} />
                        </Link>
                      </motion.div>
                    </motion.div>
                  ) : !isLoading ? (
                    // No results
                    <motion.div 
                      key="empty"
                      className={styles.empty}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0 }}
                    >
                      <p>{isGerman ? `Keine Ergebnisse für "${query}"` : `No results for "${query}"`}</p>
                      <p className={styles.emptyHint}>
                        {isGerman ? 'Versuche andere Suchbegriffe' : 'Try different keywords or browse topics'}
                      </p>
                    </motion.div>
                  ) : null
                ) : (
                  // Trending & Quick Links (empty state)
                  <motion.div
                    key="trending"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                  >
                    {/* Trending Searches */}
                    <div className={styles.sectionHeader}>
                      <TrendingUp size={14} />
                      <span>{isGerman ? 'Beliebte Suchen' : 'Trending'}</span>
                    </div>
                    <div className={styles.trendingList} ref={resultsRef}>
                      {TRENDING_SEARCHES.map((item, index) => (
                        <motion.div
                          key={item.slug}
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.05 }}
                        >
                          <Link
                            href={`/${locale}/articles/${item.slug}`}
                            className={`${styles.trendingItem} ${selectedIndex === index ? styles.selected : ''}`}
                            onClick={onClose}
                            onMouseEnter={() => setSelectedIndex(index)}
                          >
                            <Search size={14} className={styles.trendingIcon} />
                            <span>{isGerman ? item.queryDe : item.query}</span>
                            <ArrowRight size={14} className={styles.trendingArrow} />
                          </Link>
                        </motion.div>
                      ))}
                    </div>

                    {/* Quick Links */}
                    <div className={styles.sectionHeader} style={{ marginTop: 'var(--space-4)' }}>
                      <Sparkles size={14} />
                      <span>{isGerman ? 'Schnellzugriff' : 'Quick Links'}</span>
                    </div>
                    <div className={styles.quickLinksGrid}>
                      {QUICK_LINKS.map((link, index) => {
                        const IconComponent = link.icon;
                        return (
                          <motion.div
                            key={link.href}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.1 + index * 0.05 }}
                          >
                            <Link 
                              href={`/${locale}${link.href}`} 
                              className={styles.quickLink} 
                              onClick={onClose}
                            >
                              <span className={styles.quickLinkIcon}>
                                <IconComponent size={16} />
                              </span>
                              {isGerman ? link.labelDe : link.label}
                            </Link>
                          </motion.div>
                        );
                      })}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Footer */}
            <motion.div 
              className={styles.footer}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              <div className={styles.footerHints}>
                <span><kbd>↑</kbd><kbd>↓</kbd> {isGerman ? 'Navigieren' : 'Navigate'}</span>
                <span><kbd>↵</kbd> {isGerman ? 'Auswählen' : 'Select'}</span>
                <span><kbd>ESC</kbd> {isGerman ? 'Schließen' : 'Close'}</span>
              </div>
            </motion.div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
