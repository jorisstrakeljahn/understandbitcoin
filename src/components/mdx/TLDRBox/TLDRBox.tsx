import { ReactNode } from 'react';
import styles from './TLDRBox.module.css';

export interface TLDRBoxProps {
  children?: ReactNode;
  items?: string[];
}

export function TLDRBox({ children, items }: TLDRBoxProps) {
  return (
    <div className={styles.tldrBox} data-testid="tldr-box">
      <div className={styles.content} data-testid="tldr-box-content">
        {items ? (
          <ul className={styles.list} data-testid="tldr-box-list">
            {items.map((item, index) => (
              <li key={index} data-testid={`tldr-box-item-${index}`}>{item}</li>
            ))}
          </ul>
        ) : (
          children
        )}
      </div>
    </div>
  );
}
