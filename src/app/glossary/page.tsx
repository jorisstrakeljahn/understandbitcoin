import Link from 'next/link';
import { Search, ArrowRight } from '@/components/icons';
import styles from './glossary.module.css';

export const metadata = {
  title: 'Glossary',
  description: 'Bitcoin and cryptocurrency terms explained clearly.',
};

const GLOSSARY_TERMS = [
  {
    term: 'Address',
    definition: 'A string of characters representing a destination for Bitcoin payments.',
    letter: 'A',
  },
  {
    term: 'Block',
    definition: 'A batch of transactions confirmed together and added to the blockchain.',
    letter: 'B',
  },
  {
    term: 'Blockchain',
    definition: 'A distributed ledger containing all confirmed Bitcoin transactions.',
    letter: 'B',
  },
  {
    term: 'Cold Storage',
    definition: 'Keeping private keys offline, disconnected from the internet.',
    letter: 'C',
  },
  {
    term: 'Difficulty',
    definition: 'A measure of how hard it is to find a valid block hash.',
    letter: 'D',
  },
  {
    term: 'Halving',
    definition: 'The event every 210,000 blocks when the block reward is cut in half.',
    letter: 'H',
  },
  {
    term: 'Hash',
    definition: 'A fixed-size output from a cryptographic hash function.',
    letter: 'H',
  },
  {
    term: 'Lightning Network',
    definition: 'A layer-2 payment protocol built on Bitcoin for fast, cheap transactions.',
    letter: 'L',
  },
  {
    term: 'Mempool',
    definition: 'The memory pool of unconfirmed transactions waiting to be mined.',
    letter: 'M',
  },
  {
    term: 'Mining',
    definition: 'Using computational power to find valid blocks and secure the network.',
    letter: 'M',
  },
  {
    term: 'Node',
    definition: 'A computer running Bitcoin software that validates and relays transactions.',
    letter: 'N',
  },
  {
    term: 'Private Key',
    definition: 'A secret number that allows bitcoins to be spent. Must be kept secure.',
    letter: 'P',
  },
  {
    term: 'Public Key',
    definition: 'Derived from a private key, used to generate Bitcoin addresses.',
    letter: 'P',
  },
  {
    term: 'Satoshi',
    definition: 'The smallest unit of Bitcoin, equal to 0.00000001 BTC.',
    letter: 'S',
  },
  {
    term: 'Seed Phrase',
    definition: 'A list of words that can restore all private keys in a wallet.',
    letter: 'S',
  },
  {
    term: 'UTXO',
    definition: 'Unspent Transaction Output - a chunk of bitcoin that can be spent.',
    letter: 'U',
  },
];

// Group terms by letter
const groupedTerms = GLOSSARY_TERMS.reduce((acc, term) => {
  if (!acc[term.letter]) {
    acc[term.letter] = [];
  }
  acc[term.letter].push(term);
  return acc;
}, {} as Record<string, typeof GLOSSARY_TERMS>);

const letters = Object.keys(groupedTerms).sort();

export default function GlossaryPage() {
  return (
    <div className={styles.page}>
      <div className={styles.container}>
        {/* Header */}
        <header className={styles.header}>
          <h1 className={styles.title}>Glossary</h1>
          <p className={styles.subtitle}>
            Bitcoin and cryptocurrency terms explained clearly. 
            Click any term to learn more.
          </p>
        </header>

        {/* Letter Navigation */}
        <nav className={styles.letterNav}>
          {letters.map((letter) => (
            <a key={letter} href={`#${letter}`} className={styles.letterLink}>
              {letter}
            </a>
          ))}
        </nav>

        {/* Terms */}
        <div className={styles.termsList}>
          {letters.map((letter) => (
            <section key={letter} id={letter} className={styles.letterSection}>
              <h2 className={styles.letterHeading}>{letter}</h2>
              <div className={styles.termsGrid}>
                {groupedTerms[letter].map((item) => (
                  <div key={item.term} className={styles.termCard}>
                    <h3 className={styles.termTitle}>{item.term}</h3>
                    <p className={styles.termDefinition}>{item.definition}</p>
                    <Link 
                      href={`/glossary/${item.term.toLowerCase().replace(/\s+/g, '-')}`}
                      className={styles.termLink}
                    >
                      Learn more <ArrowRight size={14} />
                    </Link>
                  </div>
                ))}
              </div>
            </section>
          ))}
        </div>

        {/* CTA */}
        <div className={styles.cta}>
          <p>Can&apos;t find what you&apos;re looking for?</p>
          <Link href="/search" className={styles.ctaLink}>
            <Search size={16} />
            Search the knowledge base
          </Link>
        </div>
      </div>
    </div>
  );
}
