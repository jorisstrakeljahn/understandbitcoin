'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useLocale, useTranslations } from 'next-intl';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, ArrowRight, Sparkles, TrendingUp } from '@/components/icons';
import { TopicIcon } from '@/components/icons';
import { Badge } from '@/components/ui';
import styles from './SearchInput.module.css';

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

interface SearchInputProps {
  variant?: 'hero' | 'compact';
  placeholder?: string;
  autoFocus?: boolean;
  onResultClick?: () => void;
  className?: string;
}

// Trending searches for empty state
const TRENDING_SEARCHES = [
  { query: 'What is Bitcoin?', queryDe: 'Was ist Bitcoin?', slug: 'what-is-bitcoin' },
  { query: 'Bitcoin energy', queryDe: 'Bitcoin Energie', slug: 'bitcoin-energy-consumption' },
  { query: 'Is Bitcoin a Ponzi?', queryDe: 'Ist Bitcoin ein Ponzi?', slug: 'is-bitcoin-a-ponzi-scheme' },
  { query: 'Lightning Network', queryDe: 'Lightning Network', slug: 'what-is-lightning-network' },
];

export function SearchInput({ 
  variant = 'hero', 
  placeholder,
  autoFocus = false,
  onResultClick,
  className = ''
}: SearchInputProps) {
  const t = useTranslations('home');
  const locale = useLocale();
  const router = useRouter();
  const isGerman = locale === 'de';
  
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const [showDropdown, setShowDropdown] = useState(false);
  
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);


  // Click outside handler
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setShowDropdown(false);
        setIsFocused(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Search handler
  const handleSearch = useCallback(async (searchQuery: string) => {
    if (!searchQuery.trim()) {
      setResults([]);
      return;
    }

    setIsLoading(true);
    
    try {
      const response = await fetch(`/api/search?q=${encodeURIComponent(searchQuery)}&limit=5&locale=${locale}`);
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

  // Keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent) => {
    const maxIndex = query.trim() ? results.length - 1 : TRENDING_SEARCHES.length - 1;
    
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
          onResultClick?.();
        } else if (!query.trim() && selectedIndex >= 0 && TRENDING_SEARCHES[selectedIndex]) {
          const trending = TRENDING_SEARCHES[selectedIndex];
          router.push(`/${locale}/articles/${trending.slug}`);
          onResultClick?.();
        } else if (query.trim()) {
          router.push(`/${locale}/search?q=${encodeURIComponent(query)}`);
          onResultClick?.();
        }
        break;
      case 'Escape':
        setShowDropdown(false);
        inputRef.current?.blur();
        break;
    }
  };

  const handleFocus = () => {
    setIsFocused(true);
    setShowDropdown(true);
    setSelectedIndex(-1);
  };

  const handleResultClick = () => {
    onResultClick?.();
  };

  // Reset selection when results change
  useEffect(() => {
    setSelectedIndex(-1);
  }, [results]);

  const showResults = showDropdown && (query.trim() ? results.length > 0 : true);
  const isHero = variant === 'hero';

  return (
    <div 
      ref={containerRef}
      className={`${styles.container} ${styles[variant]} ${className}`}
      data-testid={`search-input-${variant}`}
    >
      {/* Search Input */}
      <motion.div 
        className={styles.inputWrapper}
        data-testid="search-input-wrapper"
        animate={{
          scale: isFocused ? 1.02 : 1,
          boxShadow: isFocused 
            ? '0 0 0 4px rgba(247, 147, 26, 0.15), 0 20px 40px -10px rgba(0,0,0,0.15)' 
            : '0 4px 20px -5px rgba(0,0,0,0.1)',
        }}
        transition={{ duration: 0.2, ease: 'easeOut' }}
      >
        <motion.div 
          className={styles.searchIconWrapper}
          animate={{ 
            scale: isFocused ? 1.1 : 1,
            color: isFocused ? 'var(--color-accent)' : 'var(--color-text-muted)'
          }}
          transition={{ duration: 0.2 }}
        >
          <Search size={isHero ? 22 : 18} />
        </motion.div>
        
        <input
          ref={inputRef}
          type="text"
          id="search-input"
          name="search-input"
          className={styles.input}
          placeholder={placeholder || t('searchPlaceholder')}
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setSelectedIndex(-1);
          }}
          onFocus={handleFocus}
          onKeyDown={handleKeyDown}
          autoComplete="off"
          autoCorrect="off"
          autoCapitalize="off"
          spellCheck="false"
          autoFocus={autoFocus}
          data-testid="search-input-field"
        />

        {/* Loading indicator */}
        <AnimatePresence>
          {isLoading && (
            <motion.div 
              className={styles.loadingSpinner}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
            />
          )}
        </AnimatePresence>

        {/* Clear button */}
        <AnimatePresence>
          {query && (
            <motion.button
              className={styles.clearButton}
              onClick={() => {
                setQuery('');
                inputRef.current?.focus();
              }}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              data-testid="search-input-clear-button"
            >
              ×
            </motion.button>
          )}
        </AnimatePresence>
      </motion.div>

      {/* Dropdown Results */}
      <AnimatePresence>
        {showResults && (
          <motion.div 
            className={styles.dropdown}
            initial={{ opacity: 0, y: -10, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.98 }}
            transition={{ duration: 0.2, ease: 'easeOut' }}
            data-testid="search-input-dropdown"
          >
            {query.trim() ? (
              // Search Results
              <>
                <div className={styles.sectionHeader} data-testid="search-results-header">
                  <Sparkles size={14} />
                  <span>{isGerman ? 'Ergebnisse' : 'Results'}</span>
                </div>
                <div className={styles.resultsList} data-testid="search-results-list">
                  {results.map((result, index) => (
                    <motion.div
                      key={result.slug}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.03 }}
                    >
                      <Link
                        href={`/${locale}/articles/${result.slug}`}
                        className={`${styles.resultItem} ${selectedIndex === index ? styles.selected : ''}`}
                        onClick={handleResultClick}
                        onMouseEnter={() => setSelectedIndex(index)}
                        data-testid={`search-result-${index}`}
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
                
                {/* View all results link */}
                <motion.div 
                  className={styles.dropdownFooter}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.15 }}
                >
                  <Link 
                    href={`/${locale}/search?q=${encodeURIComponent(query)}`}
                    className={styles.viewAllLink}
                    onClick={() => onResultClick?.()}
                    data-testid="search-view-all-results"
                  >
                    {isGerman ? 'Alle Ergebnisse anzeigen' : 'View all results'}
                    <ArrowRight size={14} />
                  </Link>
                </motion.div>
              </>
            ) : (
              // Trending Searches (empty state)
              <>
                <div className={styles.sectionHeader} data-testid="search-trending-header">
                  <TrendingUp size={14} />
                  <span>{isGerman ? 'Beliebte Suchen' : 'Trending'}</span>
                </div>
                <div className={styles.trendingList} data-testid="search-trending-list">
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
                        onClick={() => onResultClick?.()}
                        onMouseEnter={() => setSelectedIndex(index)}
                        data-testid={`search-trending-item-${index}`}
                      >
                        <Search size={14} className={styles.trendingIcon} />
                        <span>{isGerman ? item.queryDe : item.query}</span>
                        <ArrowRight size={14} className={styles.trendingArrow} />
                      </Link>
                    </motion.div>
                  ))}
                </div>
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
