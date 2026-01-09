import { ReactNode } from 'react';
import styles from './TLDRBox.module.css';

export interface TLDRBoxProps {
  children?: ReactNode;
  items?: string[];
}

export function TLDRBox({ children, items }: TLDRBoxProps) {
  return (
    <div className={styles.tldrBox}>
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
