'use client';

import Link from 'next/link';
import { useLocale, useTranslations } from 'next-intl';
import styles from './Footer.module.css';

export function Footer() {
  const t = useTranslations('footer');
  const locale = useLocale();

  const FOOTER_LINKS = [
    { href: `/${locale}`, label: t('allTopics'), id: 'topics' },
    { href: `/${locale}/about`, label: t('aboutUs'), id: 'about' },
  ];

  return (
    <footer className={styles.footer} data-testid="footer">
      <div className={styles.container}>
        <div className={styles.content}>
          {/* Brand */}
          <div className={styles.brand} data-testid="footer-brand">
            <Link href={`/${locale}`} className={styles.logo} data-testid="footer-logo">
              <span className={styles.logoIcon}>₿</span>
              <span className={styles.logoText}>Therefor Bitcoin</span>
            </Link>
            <p className={styles.tagline} data-testid="footer-tagline">{t('tagline')}</p>
          </div>

          {/* Navigation Links */}
          <nav className={styles.nav} data-testid="footer-nav">
            {FOOTER_LINKS.map((link, index) => (
              <span key={link.id} className={styles.navItem}>
                <Link
                  href={link.href}
                  className={styles.link}
                  data-testid={`footer-link-${link.id}`}
                >
                  {link.label}
                </Link>
                {index < FOOTER_LINKS.length - 1 && (
                  <span className={styles.separator}>·</span>
                )}
              </span>
            ))}
          </nav>
        </div>

        {/* Bottom */}
        <div className={styles.bottom} data-testid="footer-bottom">
          <p className={styles.copyright} data-testid="footer-copyright">
            © {new Date().getFullYear()} Therefor Bitcoin. {t('copyright')}
          </p>
          <p className={styles.disclaimer} data-testid="footer-disclaimer">
            {t('disclaimer')}
          </p>
        </div>
      </div>
    </footer>
  );
}
