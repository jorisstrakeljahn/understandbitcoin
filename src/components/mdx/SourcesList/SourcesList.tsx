import { Source, SourceType } from '@/lib/content/schema';
import { BookOpen, FileText, Video, Headphones, ExternalLink, Library } from '@/components/icons';
import type { IconProps } from '@/components/icons';
import styles from './SourcesList.module.css';

export interface SourcesListProps {
  sources: Source[];
  showTypes?: boolean;
}

const TYPE_LABELS: Record<SourceType, string> = {
  primary: 'Primary Sources',
  secondary: 'Secondary Sources',
  video: 'Videos',
  book: 'Books',
  article: 'Articles',
  podcast: 'Podcasts',
};

const TYPE_ICONS: Record<SourceType, React.FC<IconProps>> = {
  primary: BookOpen,
  secondary: FileText,
  video: Video,
  book: BookOpen,
  article: FileText,
  podcast: Headphones,
};

export function SourcesList({ sources, showTypes = true }: SourcesListProps) {
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
    <div className={styles.sourcesList}>
      <h3 className={styles.heading}>
        <Library size={20} />
        Sources & Further Reading
      </h3>
      
      {showTypes ? (
        Object.entries(groupedSources).map(([type, typeSources]) => {
          const IconComponent = TYPE_ICONS[type as SourceType];
          return (
            <div key={type} className={styles.group}>
              <h4 className={styles.groupTitle}>
                <span className={styles.groupIcon}>
                  <IconComponent size={16} />
                </span>
                {TYPE_LABELS[type as SourceType]}
              </h4>
              <ul className={styles.list}>
                {typeSources.map((source, index) => (
                  <SourceItem key={index} source={source} />
                ))}
              </ul>
            </div>
          );
        })
      ) : (
        <ul className={styles.list}>
          {sources.map((source, index) => (
            <SourceItem key={index} source={source} />
          ))}
        </ul>
      )}
    </div>
  );
}

function SourceItem({ source }: { source: Source }) {
  return (
    <li className={styles.item}>
      {source.url ? (
        <a href={source.url} target="_blank" rel="noopener noreferrer" className={styles.link}>
          <span className={styles.title}>{source.title}</span>
          {source.author && <span className={styles.author}>by {source.author}</span>}
          <ExternalLink size={14} className={styles.external} />
        </a>
      ) : (
        <span className={styles.noLink}>
          <span className={styles.title}>{source.title}</span>
          {source.author && <span className={styles.author}>by {source.author}</span>}
        </span>
      )}
      {source.description && (
        <p className={styles.description}>{source.description}</p>
      )}
    </li>
  );
}
