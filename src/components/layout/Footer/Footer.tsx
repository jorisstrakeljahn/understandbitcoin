import Link from 'next/link';
import styles from './Footer.module.css';

const FOOTER_LINKS = {
  learn: [
    { href: '/topics', label: 'All Topics' },
    { href: '/glossary', label: 'Glossary' },
    { href: '/sources', label: 'Sources' },
  ],
  topics: [
    { href: '/topics/basics', label: 'Bitcoin Basics' },
    { href: '/topics/security', label: 'Security' },
    { href: '/topics/lightning', label: 'Lightning' },
    { href: '/topics/economics', label: 'Economics' },
  ],
  about: [
    { href: '/criticism', label: 'Criticism' },
    { href: '/about', label: 'About Us' },
    { href: '/contribute', label: 'Contribute' },
  ],
};

export function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={styles.container}>
        <div className={styles.grid}>
          {/* Brand */}
          <div className={styles.brand}>
            <Link href="/" className={styles.logo}>
              <span className={styles.logoIcon}>₿</span>
              <span className={styles.logoText}>Therefor Bitcoin</span>
            </Link>
            <p className={styles.tagline}>
              Clear answers. Fair objections. Primary sources.
            </p>
            <p className={styles.mission}>
              A free, open-source knowledge base helping people understand Bitcoin — 
              therefore Bitcoin.
            </p>
          </div>

          {/* Links */}
          <div className={styles.links}>
            <div className={styles.linkGroup}>
              <h4 className={styles.linkGroupTitle}>Learn</h4>
              <ul className={styles.linkList}>
                {FOOTER_LINKS.learn.map((link) => (
                  <li key={link.href}>
                    <Link href={link.href} className={styles.link}>
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div className={styles.linkGroup}>
              <h4 className={styles.linkGroupTitle}>Topics</h4>
              <ul className={styles.linkList}>
                {FOOTER_LINKS.topics.map((link) => (
                  <li key={link.href}>
                    <Link href={link.href} className={styles.link}>
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div className={styles.linkGroup}>
              <h4 className={styles.linkGroupTitle}>About</h4>
              <ul className={styles.linkList}>
                {FOOTER_LINKS.about.map((link) => (
                  <li key={link.href}>
                    <Link href={link.href} className={styles.link}>
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Bottom */}
        <div className={styles.bottom}>
          <p className={styles.copyright}>
            © {new Date().getFullYear()} Therefor Bitcoin. Open source under MIT license.
          </p>
          <p className={styles.disclaimer}>
            Educational content only. Not financial advice.
          </p>
        </div>
      </div>
    </footer>
  );
}
