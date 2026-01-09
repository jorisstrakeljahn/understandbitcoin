import { Topic } from '@/lib/content/schema';
import { TopicIcon } from '@/components/icons';
import { Badge, type BadgeProps } from '../Badge';
import styles from './TopicBadge.module.css';

export interface TopicBadgeProps extends Omit<BadgeProps, 'children'> {
  topic: Topic;
  label: string;
  iconSize?: number;
}

/**
 * A specialized badge that displays a topic with its icon.
 * Commonly used throughout the app to identify content topics.
 */
export function TopicBadge({ 
  topic, 
  label, 
  iconSize = 14, 
  variant = 'accent',
  ...props 
}: TopicBadgeProps) {
  return (
    <Badge variant={variant} {...props}>
      <TopicIcon topic={topic} size={iconSize} />
      <span className={styles.label}>{label}</span>
    </Badge>
  );
}
