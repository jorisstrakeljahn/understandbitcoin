import { ReactNode } from 'react';
import { Scale, Lightbulb } from '@/components/icons';
import styles from './SteelmanBox.module.css';

export interface SteelmanBoxProps {
  title?: string;
  children: ReactNode;
}

export function SteelmanBox({ title = "Fair Objection", children }: SteelmanBoxProps) {
  return (
    <div className={styles.steelmanBox}>
      <div className={styles.header}>
        <Scale size={20} className={styles.icon} />
        <span className={styles.title}>{title}</span>
      </div>
      <div className={styles.content}>
        {children}
      </div>
      <div className={styles.footer}>
        <span className={styles.note}>
          <Lightbulb size={14} />
          We present the strongest version of this objection
        </span>
      </div>
    </div>
  );
}
