'use client';

import Link from 'next/link';
import { useLocale, useTranslations } from 'next-intl';
import styles from './Footer.module.css';

export function Footer() {
  const t = useTranslations('footer');
  const locale = useLocale();

  const FOOTER_LINKS = {
    learn: [
      { href: `/${locale}/topics`, label: t('allTopics') },
      { href: `/${locale}/glossary`, label: t('glossary') },
      { href: `/${locale}/sources`, label: t('sources') },
    ],
    topics: [
      { href: `/${locale}/topics/basics`, label: t('bitcoinBasics') },
      { href: `/${locale}/topics/security`, label: t('security') },
      { href: `/${locale}/topics/lightning`, label: t('lightning') },
      { href: `/${locale}/topics/economics`, label: t('economics') },
    ],
    about: [
      { href: `/${locale}/topics/criticism`, label: t('criticism') },
      { href: `/${locale}/about`, label: t('aboutUs') },
      { href: `/${locale}/contribute`, label: t('contribute') },
    ],
  };

  return (
    <footer className={styles.footer}>
      <div className={styles.container}>
        <div className={styles.grid}>
          {/* Brand */}
          <div className={styles.brand}>
            <Link href={`/${locale}`} className={styles.logo}>
              <span className={styles.logoIcon}>₿</span>
              <span className={styles.logoText}>Therefor Bitcoin</span>
            </Link>
            <p className={styles.tagline}>{t('tagline')}</p>
            <p className={styles.mission}>{t('mission')}</p>
          </div>

          {/* Links */}
          <div className={styles.links}>
            <div className={styles.linkGroup}>
              <h4 className={styles.linkGroupTitle}>{t('learn')}</h4>
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
              <h4 className={styles.linkGroupTitle}>{t('topics')}</h4>
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
              <h4 className={styles.linkGroupTitle}>{t('about')}</h4>
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
            © {new Date().getFullYear()} Therefor Bitcoin. {t('copyright')}
          </p>
          <p className={styles.disclaimer}>
            {locale === 'de' ? 'Nur Bildungsinhalte. Keine Finanzberatung.' : 'Educational content only. Not financial advice.'}
          </p>
        </div>
      </div>
    </footer>
  );
}
