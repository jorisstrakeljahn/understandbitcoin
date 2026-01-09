'use client';

import { useState } from 'react';
import Link from 'next/link';
import { TopicIcon, ChevronRight, FileText } from '@/components/icons';
import { Topic } from '@/lib/content/schema';
import styles from './CollapsibleSidebar.module.css';

interface Article {
  slug: string;
  title: string;
}

interface CollapsibleSidebarProps {
  topics: {
    key: Topic;
    label: string;
    articles: Article[];
  }[];
  locale: string;
  documentationLabel: string;
}

export function CollapsibleSidebar({ topics, locale, documentationLabel }: CollapsibleSidebarProps) {
  const [expandedTopics, setExpandedTopics] = useState<Set<Topic>>(new Set());

  const toggleTopic = (topicKey: Topic) => {
    setExpandedTopics((prev) => {
      const next = new Set(prev);
      if (next.has(topicKey)) {
        next.delete(topicKey);
      } else {
        next.add(topicKey);
      }
      return next;
    });
  };

  return (
    <nav className={styles.sidebarNav}>
      <div className={styles.sidebarHeader}>
        <span className={styles.sidebarTitle}>{documentationLabel}</span>
      </div>
      
      <div className={styles.fileTree}>
        {topics.map(({ key: topicKey, label, articles }) => {
          const isExpanded = expandedTopics.has(topicKey);
          const hasArticles = articles.length > 0;
          
          return (
            <div key={topicKey} className={styles.treeSection}>
              <div className={styles.treeFolderWrapper}>
                {hasArticles && (
                  <button
                    className={`${styles.toggleButton} ${isExpanded ? styles.expanded : ''}`}
                    onClick={() => toggleTopic(topicKey)}
                    aria-label={isExpanded ? 'Collapse' : 'Expand'}
                  >
                    <ChevronRight size={12} />
                  </button>
                )}
                <Link href={`/${locale}/topics/${topicKey}`} className={styles.treeFolder}>
                  <TopicIcon topic={topicKey} size={14} />
                  <span className={styles.treeFolderName}>{label}</span>
                  {hasArticles && (
                    <span className={styles.treeCount}>{articles.length}</span>
                  )}
                </Link>
              </div>
              
              {hasArticles && isExpanded && (
                <ul className={styles.treeFiles}>
                  {articles.map((article) => (
                    <li key={article.slug}>
                      <Link 
                        href={`/${locale}/articles/${article.slug}`}
                        className={styles.treeFile}
                      >
                        <FileText size={12} />
                        <span className={styles.treeFileName}>
                          {article.title}
                        </span>
                      </Link>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          );
        })}
      </div>
    </nav>
  );
}
