'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import Link from 'next/link';
import { Badge } from '@/components/ui';
import { TOPICS, LEVELS } from '@/lib/content/schema';
import { Search, Bitcoin, HelpCircle, Zap, BookOpen } from '@/components/icons';
import styles from './SearchModal.module.css';

interface SearchResult {
  slug: string;
  title: string;
  summary: string;
  topic: string;
  type: string;
  level: string;
  tags: string[];
  highlights?: {
    title?: string;
    summary?: string;
  };
}

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function SearchModal({ isOpen, onClose }: SearchModalProps) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const resultsRef = useRef<HTMLDivElement>(null);

  // Keyboard shortcut to open
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        if (!isOpen) {
          // Parent component handles opening
        }
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen]);

  // Focus input when opened
  useEffect(() => {
    if (isOpen) {
      inputRef.current?.focus();
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
      const response = await fetch(`/api/search?q=${encodeURIComponent(searchQuery)}`);
      if (response.ok) {
        const data = await response.json();
        setResults(data.results || []);
      }
    } catch {
      // Fallback: use static data for now
      setResults([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Debounced search
  useEffect(() => {
    const timer = setTimeout(() => {
      handleSearch(query);
    }, 200);

    return () => clearTimeout(timer);
  }, [query, handleSearch]);

  // Keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent) => {
    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setSelectedIndex((prev) => Math.min(prev + 1, results.length - 1));
        break;
      case 'ArrowUp':
        e.preventDefault();
        setSelectedIndex((prev) => Math.max(prev - 1, 0));
        break;
      case 'Enter':
        if (results[selectedIndex]) {
          window.location.href = `/articles/${results[selectedIndex].slug}`;
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

  if (!isOpen) return null;

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        {/* Search Input */}
        <div className={styles.inputWrapper}>
          <Search size={18} className={styles.searchIcon} />
          <input
            ref={inputRef}
            type="text"
            className={styles.input}
            placeholder="Search articles, topics, terms..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            autoComplete="off"
            autoCorrect="off"
            autoCapitalize="off"
            spellCheck="false"
          />
          <button className={styles.closeButton} onClick={onClose}>
            <kbd>ESC</kbd>
          </button>
        </div>

        {/* Results */}
        <div className={styles.resultsContainer}>
          {isLoading ? (
            <div className={styles.loading}>
              <div className={styles.spinner} />
              Searching...
            </div>
          ) : query && results.length === 0 ? (
            <div className={styles.empty}>
              <p>No results for &quot;{query}&quot;</p>
              <p className={styles.emptyHint}>Try different keywords or browse topics</p>
            </div>
          ) : results.length > 0 ? (
            <div className={styles.results} ref={resultsRef}>
              {results.map((result, index) => (
                <Link
                  key={result.slug}
                  href={`/articles/${result.slug}`}
                  className={`${styles.result} ${index === selectedIndex ? styles.selected : ''}`}
                  onClick={onClose}
                  onMouseEnter={() => setSelectedIndex(index)}
                >
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
                    <Badge variant="accent">
                      {TOPICS[result.topic as keyof typeof TOPICS]?.label || result.topic}
                    </Badge>
                    <Badge variant="default">
                      {LEVELS[result.level as keyof typeof LEVELS]?.label || result.level}
                    </Badge>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className={styles.quickLinks}>
              <p className={styles.quickLinksTitle}>Quick Links</p>
              <div className={styles.quickLinksGrid}>
                <Link href="/topics/basics" className={styles.quickLink} onClick={onClose}>
                  <span className={styles.quickLinkIcon}>
                    <Bitcoin size={16} />
                  </span>
                  Bitcoin Basics
                </Link>
                <Link href="/topics/criticism" className={styles.quickLink} onClick={onClose}>
                  <span className={styles.quickLinkIcon}>
                    <HelpCircle size={16} />
                  </span>
                  Criticism
                </Link>
                <Link href="/topics/lightning" className={styles.quickLink} onClick={onClose}>
                  <span className={styles.quickLinkIcon}>
                    <Zap size={16} />
                  </span>
                  Lightning
                </Link>
                <Link href="/glossary" className={styles.quickLink} onClick={onClose}>
                  <span className={styles.quickLinkIcon}>
                    <BookOpen size={16} />
                  </span>
                  Glossary
                </Link>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className={styles.footer}>
          <div className={styles.footerHints}>
            <span><kbd>↑</kbd><kbd>↓</kbd> Navigate</span>
            <span><kbd>↵</kbd> Select</span>
            <span><kbd>ESC</kbd> Close</span>
          </div>
        </div>
      </div>
    </div>
  );
}
