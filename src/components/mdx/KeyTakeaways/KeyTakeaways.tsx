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
    <div className={styles.keyTakeaways}>
      <h4 className={styles.title}>
        <CheckCircle size={18} />
        Key Takeaways
      </h4>
      <ul className={styles.list}>
        {items.map((item, index) => (
          <li key={index}>{item}</li>
        ))}
      </ul>
    </div>
  );
}
