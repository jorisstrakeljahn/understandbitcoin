'use client';

import { useState } from 'react';
import { Drawer } from '@/components/ui';
import { List } from '@/components/icons';
import styles from './MobileNav.module.css';

interface Heading {
  id: string;
  text: string;
  level: number;
}

interface MobileNavProps {
  headings: Heading[];
}

export function MobileNav({ headings }: MobileNavProps) {
  const [isOpen, setIsOpen] = useState(false);

  if (headings.length === 0) {
    return null;
  }

  return (
    <>
      {/* Mobile TOC Toggle */}
      <button
        className={styles.toggleButton}
        onClick={() => setIsOpen(true)}
        aria-label="Open table of contents"
      >
        <List size={18} />
        On this page
      </button>

      {/* Mobile TOC Drawer */}
      <Drawer
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        title="On This Page"
        position="right"
      >
        <nav className={styles.nav}>
          <ul className={styles.list}>
            {headings.map((heading) => (
              <li
                key={heading.id}
                className={`${styles.item} ${heading.level === 3 ? styles.nested : ''}`}
              >
                <a
                  href={`#${heading.id}`}
                  className={styles.link}
                  onClick={() => setIsOpen(false)}
                >
                  {heading.text}
                </a>
              </li>
            ))}
          </ul>
        </nav>
      </Drawer>
    </>
  );
}
