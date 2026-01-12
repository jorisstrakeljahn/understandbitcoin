import { CheckCircle } from '@/components/icons';
import styles from './KeyTakeaways.module.css';

export interface KeyTakeawaysProps {
  items: string[];
}

export function KeyTakeaways({ items }: KeyTakeawaysProps) {
  if (!items || items.length === 0) {
    return null;
  }

  return (
    <div className={styles.keyTakeaways} data-testid="key-takeaways">
      <h4 className={styles.title} data-testid="key-takeaways-title">
        <CheckCircle size={18} />
        Key Takeaways
      </h4>
      <ul className={styles.list} data-testid="key-takeaways-list">
        {items.map((item, index) => (
          <li key={index} data-testid={`key-takeaway-${index}`}>{item}</li>
        ))}
      </ul>
    </div>
  );
}
