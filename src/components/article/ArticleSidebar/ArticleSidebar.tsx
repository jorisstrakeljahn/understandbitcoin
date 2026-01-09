'use client';

import Link from 'next/link';
import { useTranslations } from 'next-intl';
import { Topic } from '@/lib/content/schema';
import { TopicIcon, FileText } from '@/components/icons';
import styles from './ArticleSidebar.module.css';

interface ArticleInfo {
  slug: string;
  title: string;
  topic: Topic;
}

interface TopicInfo {
  id: string;
  label: string;
}

interface ArticleSidebarProps {
  currentTopic: Topic;
  currentSlug: string;
  articles: ArticleInfo[];
  topics: TopicInfo[];
  locale?: string;
}

export function ArticleSidebar({ currentTopic, currentSlug, articles, topics, locale = 'en' }: ArticleSidebarProps) {
  const t = useTranslations('topics');
  
  // Group articles by topic
  const articlesByTopic = topics.reduce((acc, topic) => {
    acc[topic.id as Topic] = articles.filter((a) => a.topic === topic.id);
    return acc;
  }, {} as Record<Topic, ArticleInfo[]>);

  return (
    <nav className={styles.sidebar}>
      <div className={styles.header}>
        <Link href={`/${locale}/topics`} className={styles.headerLink}>
          <span className={styles.headerTitle}>{t('documentation')}</span>
        </Link>
      </div>
      
      <div className={styles.fileTree}>
        {topics.map((topicItem) => {
          const topicArticles = articlesByTopic[topicItem.id as Topic] || [];
          const isActiveTopic = topicItem.id === currentTopic;
          
          return (
            <div key={topicItem.id} className={`${styles.treeSection} ${isActiveTopic ? styles.treeSectionActive : ''}`}>
              <Link 
                href={`/${locale}/topics/${topicItem.id}`} 
                className={`${styles.treeFolder} ${isActiveTopic ? styles.treeFolderActive : ''}`}
              >
                <TopicIcon topic={topicItem.id as Topic} size={14} />
                <span className={styles.treeFolderName}>{topicItem.label}</span>
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
                          href={`/${locale}/articles/${article.slug}`}
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
