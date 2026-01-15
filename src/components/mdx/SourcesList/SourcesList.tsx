'use client';

import { useTranslations } from 'next-intl';
import { Source, SourceType } from '@/lib/content/schema';
import { BookOpen, FileText, Video, Headphones, ExternalLink, Library } from '@/components/icons';
import type { IconProps } from '@/components/icons';
import styles from './SourcesList.module.css';

export interface SourcesListProps {
  sources: Source[];
  showTypes?: boolean;
}

const TYPE_ICONS: Record<SourceType, React.FC<IconProps>> = {
  primary: BookOpen,
  secondary: FileText,
  video: Video,
  book: BookOpen,
  article: FileText,
  podcast: Headphones,
};

// Mapping from SourceType to translation key
const TYPE_TRANSLATION_KEYS: Record<SourceType, string> = {
  primary: 'primarySources',
  secondary: 'secondarySources',
  video: 'videoSources',
  book: 'books',
  article: 'articles',
  podcast: 'podcasts',
};

export function SourcesList({ sources, showTypes = true }: SourcesListProps) {
  const t = useTranslations('article');
  
  if (!sources || sources.length === 0) {
    return null;
  }

  const groupedSources = sources.reduce((acc, source) => {
    if (!acc[source.type]) {
      acc[source.type] = [];
    }
    acc[source.type].push(source);
    return acc;
  }, {} as Record<SourceType, Source[]>);

  return (
    <div className={styles.sourcesList} data-testid="sources-list">
      <h3 className={styles.heading} data-testid="sources-list-heading">
        <Library size={20} />
        {t('sources')}
      </h3>
      
      {showTypes ? (
        Object.entries(groupedSources).map(([type, typeSources]) => {
          const IconComponent = TYPE_ICONS[type as SourceType];
          const translationKey = TYPE_TRANSLATION_KEYS[type as SourceType];
          return (
            <div key={type} className={styles.group} data-testid={`sources-group-${type}`}>
              <h4 className={styles.groupTitle} data-testid={`sources-group-title-${type}`}>
                <span className={styles.groupIcon}>
                  <IconComponent size={16} />
                </span>
                {t(translationKey)}
              </h4>
              <ul className={styles.list} data-testid={`sources-group-list-${type}`}>
                {typeSources.map((source, index) => (
                  <SourceItem key={index} source={source} index={index} type={type} byLabel={t('by')} />
                ))}
              </ul>
            </div>
          );
        })
      ) : (
        <ul className={styles.list} data-testid="sources-list-items">
          {sources.map((source, index) => (
            <SourceItem key={index} source={source} index={index} byLabel={t('by')} />
          ))}
        </ul>
      )}
    </div>
  );
}

function SourceItem({ source, index, type, byLabel }: { source: Source; index: number; type?: string; byLabel: string }) {
  const testId = type ? `source-item-${type}-${index}` : `source-item-${index}`;
  return (
    <li className={styles.item} data-testid={testId}>
      {source.url ? (
        <a href={source.url} target="_blank" rel="noopener noreferrer" className={styles.link} data-testid={`${testId}-link`}>
          <span className={styles.title} data-testid={`${testId}-title`}>{source.title}</span>
          {source.author && <span className={styles.author} data-testid={`${testId}-author`}>{byLabel} {source.author}</span>}
          <ExternalLink size={14} className={styles.external} />
        </a>
      ) : (
        <span className={styles.noLink} data-testid={`${testId}-no-link`}>
          <span className={styles.title} data-testid={`${testId}-title`}>{source.title}</span>
          {source.author && <span className={styles.author} data-testid={`${testId}-author`}>{byLabel} {source.author}</span>}
        </span>
      )}
      {source.description && (
        <p className={styles.description} data-testid={`${testId}-description`}>{source.description}</p>
      )}
    </li>
  );
}
