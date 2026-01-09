'use client';

import { ReactNode, useState } from 'react';
import styles from './InlineTerm.module.css';

export interface InlineTermProps {
  term: string;
  children: ReactNode;
  definition?: string;
}

// Stub glossary data - in real app would come from glossary content
const GLOSSARY: Record<string, string> = {
  'satoshi': 'The smallest unit of Bitcoin, equal to 0.00000001 BTC. Named after Bitcoin\'s creator, Satoshi Nakamoto.',
  'utxo': 'Unspent Transaction Output - a chunk of bitcoin that can be spent as an input in a new transaction.',
  'hash': 'A fixed-size output from a cryptographic hash function, used extensively in Bitcoin for security.',
  'block': 'A batch of transactions confirmed together and added to the blockchain.',
  'mempool': 'The memory pool of unconfirmed transactions waiting to be included in a block.',
  'node': 'A computer running Bitcoin software that validates and relays transactions.',
  'mining': 'The process of using computational power to find valid blocks and secure the network.',
  'private key': 'A secret number that allows bitcoins to be spent. Must be kept secure.',
  'public key': 'Derived from a private key, used to generate Bitcoin addresses.',
  'address': 'A string of characters representing a destination for Bitcoin payments.',
  'halving': 'The event every 210,000 blocks when the block reward is cut in half.',
  'difficulty': 'A measure of how hard it is to find a valid block hash.',
};

export function InlineTerm({ term, children, definition }: InlineTermProps) {
  const [isOpen, setIsOpen] = useState(false);
  const glossaryDefinition = definition || GLOSSARY[term.toLowerCase()];

  return (
    <span className={styles.wrapper}>
      <button
        className={styles.term}
        onClick={() => setIsOpen(!isOpen)}
        aria-expanded={isOpen}
        aria-describedby={glossaryDefinition ? `term-${term}` : undefined}
      >
        {children}
        <span className={styles.indicator}>?</span>
      </button>
      {isOpen && glossaryDefinition && (
        <span
          id={`term-${term}`}
          className={styles.popover}
          role="tooltip"
        >
          <span className={styles.popoverTerm}>{term}</span>
          <span className={styles.popoverDefinition}>{glossaryDefinition}</span>
        </span>
      )}
    </span>
  );
}
