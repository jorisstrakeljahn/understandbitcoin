import { ReactNode } from 'react';
import { Clock, List } from '@/components/icons';
import styles from './TLDRBox.module.css';

export interface TLDRBoxProps {
  children?: ReactNode;
  items?: string[];
}

export function TLDRBox({ children, items }: TLDRBoxProps) {
  return (
    <div className={styles.tldrBox}>
      <div className={styles.header}>
        <span className={styles.badge}>
          <List size={14} />
          TL;DR
        </span>
        <span className={styles.readTime}>
          <Clock size={12} />
          20-40 seconds
        </span>
      </div>
      <div className={styles.content}>
        {items ? (
          <ul className={styles.list}>
            {items.map((item, index) => (
              <li key={index}>{item}</li>
            ))}
          </ul>
        ) : (
          children
        )}
      </div>
    </div>
  );
}
