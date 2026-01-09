'use client';

import Link from 'next/link';
import { TOPICS, Topic } from '@/lib/content/schema';
import { TopicIcon, FileText } from '@/components/icons';
import styles from './ArticleSidebar.module.css';

interface ArticleInfo {
  slug: string;
  title: string;
  topic: Topic;
}

interface ArticleSidebarProps {
  currentTopic: Topic;
  currentSlug: string;
  articles: ArticleInfo[];
}

const TOPIC_ORDER: Topic[] = ['basics', 'security', 'mining', 'lightning', 'economics', 'criticism', 'money', 'dev'];

export function ArticleSidebar({ currentTopic, currentSlug, articles }: ArticleSidebarProps) {
  // Group articles by topic
  const articlesByTopic = TOPIC_ORDER.reduce((acc, topic) => {
    acc[topic] = articles.filter((a) => a.topic === topic);
    return acc;
  }, {} as Record<Topic, ArticleInfo[]>);

  return (
    <nav className={styles.sidebar}>
      <div className={styles.header}>
        <Link href="/topics" className={styles.headerLink}>
          <span className={styles.headerTitle}>Documentation</span>
        </Link>
      </div>
      
      <div className={styles.fileTree}>
        {TOPIC_ORDER.map((topicKey) => {
          const topic = TOPICS[topicKey];
          const topicArticles = articlesByTopic[topicKey] || [];
          const isActiveTopic = topicKey === currentTopic;
          
          return (
            <div key={topicKey} className={`${styles.treeSection} ${isActiveTopic ? styles.treeSectionActive : ''}`}>
              <Link 
                href={`/topics/${topicKey}`} 
                className={`${styles.treeFolder} ${isActiveTopic ? styles.treeFolderActive : ''}`}
              >
                <TopicIcon topic={topicKey} size={14} />
                <span className={styles.treeFolderName}>{topic.label}</span>
                {topicArticles.length > 0 && (
                  <span className={styles.treeCount}>{topicArticles.length}</span>
                )}
              </Link>
              
              {/* Show articles for active topic */}
              {isActiveTopic && topicArticles.length > 0 && (
                <ul className={styles.treeFiles}>
                  {topicArticles.map((article) => {
                    const isCurrentArticle = article.slug === currentSlug;
                    return (
                      <li key={article.slug}>
                        <Link 
                          href={`/articles/${article.slug}`}
                          className={`${styles.treeFile} ${isCurrentArticle ? styles.treeFileActive : ''}`}
                        >
                          <FileText size={12} />
                          <span className={styles.treeFileName}>
                            {article.title}
                          </span>
                        </Link>
                      </li>
                    );
                  })}
                </ul>
              )}
            </div>
          );
        })}
      </div>
    </nav>
  );
}
