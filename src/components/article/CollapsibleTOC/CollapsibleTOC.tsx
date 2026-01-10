'use client';

import { useState, useEffect, useSyncExternalStore, useCallback } from 'react';
import { useTranslations } from 'next-intl';
import { ChevronRight, ChevronLeft } from 'lucide-react';
import styles from './CollapsibleTOC.module.css';

interface Heading {
  id: string;
  text: string;
  level: number;
}

interface CollapsibleTOCProps {
  headings: Heading[];
  storageKey?: string;
}

// Custom hook for localStorage with SSR support
function useLocalStorageState(key: string, defaultValue: boolean): [boolean, (value: boolean) => void] {
  const getSnapshot = useCallback(() => {
    if (typeof window === 'undefined') return defaultValue;
    const saved = localStorage.getItem(key);
    return saved === 'true';
  }, [key, defaultValue]);

  const getServerSnapshot = useCallback(() => defaultValue, [defaultValue]);

  const subscribe = useCallback((callback: () => void) => {
    window.addEventListener('storage', callback);
    return () => window.removeEventListener('storage', callback);
  }, []);

  const value = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  const setValue = useCallback((newValue: boolean) => {
    localStorage.setItem(key, String(newValue));
    window.dispatchEvent(new Event('storage'));
  }, [key]);

  return [value, setValue];
}

export function CollapsibleTOC({ headings, storageKey = 'toc-collapsed' }: CollapsibleTOCProps) {
  const t = useTranslations('article');
  const [activeId, setActiveId] = useState<string>('');
  const [isCollapsed, setIsCollapsed] = useLocalStorageState(storageKey, false);

  // Intersection observer for active heading
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id);
          }
        });
      },
      {
        rootMargin: '-80px 0px -80% 0px',
      }
    );

    headings.forEach(({ id }) => {
      const element = document.getElementById(id);
      if (element) {
        observer.observe(element);
      }
    });

    return () => observer.disconnect();
  }, [headings]);

  if (headings.length === 0) {
    return null;
  }

  return (
    <aside className={`${styles.sidebar} ${isCollapsed ? styles.collapsed : ''}`} data-testid="article-toc">
      {/* Toggle Button */}
      <button
        className={styles.toggleButton}
        onClick={() => setIsCollapsed(!isCollapsed)}
        aria-label={isCollapsed ? 'Expand table of contents' : 'Collapse table of contents'}
        title={isCollapsed ? 'Expand' : 'Collapse'}
      >
        {isCollapsed ? <ChevronLeft size={16} /> : <ChevronRight size={16} />}
      </button>

      {/* TOC Content */}
      <nav className={styles.toc}>
        <h4 className={styles.title}>{t('onThisPage')}</h4>
        <ul className={styles.list}>
          {headings.map((heading) => (
            <li
              key={heading.id}
              className={`${styles.item} ${heading.level === 3 ? styles.nested : ''}`}
            >
              <a
                href={`#${heading.id}`}
                className={`${styles.link} ${activeId === heading.id ? styles.active : ''}`}
                onClick={(e) => {
                  e.preventDefault();
                  document.getElementById(heading.id)?.scrollIntoView({
                    behavior: 'smooth',
                  });
                  setActiveId(heading.id);
                }}
              >
                {heading.text}
              </a>
            </li>
          ))}
        </ul>
      </nav>
    </aside>
  );
}
