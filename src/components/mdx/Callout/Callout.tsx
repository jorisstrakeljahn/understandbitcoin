import { ReactNode, FC } from 'react';
import { Info, AlertTriangle, CheckCircle, AlertCircle, Lightbulb } from '@/components/icons';
import type { IconProps } from '@/components/icons';
import styles from './Callout.module.css';

type CalloutType = 'info' | 'warning' | 'success' | 'error' | 'tip';

export interface CalloutProps {
  type?: CalloutType;
  title?: string;
  children: ReactNode;
}

const ICONS: Record<CalloutType, FC<IconProps>> = {
  info: Info,
  warning: AlertTriangle,
  success: CheckCircle,
  error: AlertCircle,
  tip: Lightbulb,
};

export function Callout({ type = 'info', title, children }: CalloutProps) {
  const IconComponent = ICONS[type];
  
  return (
    <aside className={`${styles.callout} ${styles[type]}`} role="note">
      <div className={styles.icon}>
        <IconComponent size={20} />
      </div>
      <div className={styles.content}>
        {title && <p className={styles.title}>{title}</p>}
        <div className={styles.body}>{children}</div>
      </div>
    </aside>
  );
}
