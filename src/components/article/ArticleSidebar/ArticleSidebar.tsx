'use client';

import Link from 'next/link';
import { TOPICS, Topic } from '@/lib/content/schema';
import { TopicIcon, BookOpen, Library } from '@/components/icons';
import styles from './ArticleSidebar.module.css';

interface ArticleSidebarProps {
  currentTopic: Topic;
  currentSlug: string;
}

export function ArticleSidebar({ currentTopic }: ArticleSidebarProps) {
  const topics = Object.entries(TOPICS) as [Topic, typeof TOPICS[Topic]][];

  return (
    <nav className={styles.sidebar}>
      <div className={styles.header}>
        <h3 className={styles.title}>Topics</h3>
      </div>
      <ul className={styles.topicList}>
        {topics.map(([key, topic]) => (
          <li key={key}>
            <Link
              href={`/topics/${key}`}
              className={`${styles.topicLink} ${key === currentTopic ? styles.active : ''}`}
            >
              <span className={styles.topicIcon}>
                <TopicIcon topic={key} size={16} />
              </span>
              <span className={styles.topicLabel}>{topic.label}</span>
            </Link>
          </li>
        ))}
      </ul>
      
      <div className={styles.divider} />
      
      <div className={styles.quickLinks}>
        <h4 className={styles.quickLinksTitle}>Quick Links</h4>
        <ul className={styles.quickLinksList}>
          <li>
            <Link href="/glossary" className={styles.quickLink}>
              <BookOpen size={14} />
              <span>Glossary</span>
            </Link>
          </li>
          <li>
            <Link href="/sources" className={styles.quickLink}>
              <Library size={14} />
              <span>Source Library</span>
            </Link>
          </li>
        </ul>
      </div>
    </nav>
  );
}
