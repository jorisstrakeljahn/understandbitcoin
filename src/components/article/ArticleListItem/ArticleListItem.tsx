import Link from 'next/link';
import { FileText } from '@/components/icons';
import styles from './ArticleListItem.module.css';

export interface ArticleListItemProps {
  slug: string;
  title: string;
  summary?: string;
  locale: string;
  /** Compact mode hides the summary */
  variant?: 'default' | 'compact';
  className?: string;
}

/**
 * A reusable article list item used in topic pages and sidebars.
 * Provides consistent styling and behavior for article links.
 */
export function ArticleListItem({ 
  slug, 
  title, 
  summary, 
  locale,
  variant = 'default',
  className = '',
}: ArticleListItemProps) {
  const isCompact = variant === 'compact';
  
  return (
    <Link 
      href={`/${locale}/articles/${slug}`}
      className={`${styles.item} ${isCompact ? styles.compact : ''} ${className}`}
      data-testid={`article-list-item-${slug}`}
    >
      <FileText size={isCompact ? 12 : 14} className={styles.icon} />
      <div className={styles.content} data-testid={`article-list-item-content-${slug}`}>
        <span className={styles.title} data-testid={`article-list-item-title-${slug}`}>{title}</span>
        {!isCompact && summary && (
          <span className={styles.summary} data-testid={`article-list-item-summary-${slug}`}>{summary}</span>
        )}
      </div>
    </Link>
  );
}
