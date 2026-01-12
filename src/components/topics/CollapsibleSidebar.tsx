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
    <nav className={styles.sidebarNav} data-testid="collapsible-sidebar">
      <div className={styles.sidebarHeader} data-testid="collapsible-sidebar-header">
        <span className={styles.sidebarTitle}>{documentationLabel}</span>
      </div>
      
      <div className={styles.fileTree} data-testid="collapsible-sidebar-tree">
        {topics.map(({ key: topicKey, label, articles }) => {
          const isExpanded = expandedTopics.has(topicKey);
          const hasArticles = articles.length > 0;
          
          return (
            <div key={topicKey} className={styles.treeSection} data-testid={`collapsible-sidebar-topic-${topicKey}`}>
              <div className={styles.treeFolderWrapper}>
                {hasArticles && (
                  <button
                    className={`${styles.toggleButton} ${isExpanded ? styles.expanded : ''}`}
                    onClick={() => toggleTopic(topicKey)}
                    aria-label={isExpanded ? 'Collapse' : 'Expand'}
                    data-testid={`collapsible-sidebar-toggle-${topicKey}`}
                  >
                    <ChevronRight size={12} />
                  </button>
                )}
                <Link href={`/${locale}/topics/${topicKey}`} className={styles.treeFolder} data-testid={`collapsible-sidebar-topic-link-${topicKey}`}>
                  <TopicIcon topic={topicKey} size={14} />
                  <span className={styles.treeFolderName}>{label}</span>
                  {hasArticles && (
                    <span className={styles.treeCount} data-testid={`collapsible-sidebar-topic-count-${topicKey}`}>{articles.length}</span>
                  )}
                </Link>
              </div>
              
              {hasArticles && isExpanded && (
                <ul className={styles.treeFiles} data-testid={`collapsible-sidebar-articles-${topicKey}`}>
                  {articles.map((article) => (
                    <li key={article.slug}>
                      <Link 
                        href={`/${locale}/articles/${article.slug}`}
                        className={styles.treeFile}
                        data-testid={`collapsible-sidebar-article-${article.slug}`}
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
