'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useLocale, useTranslations } from 'next-intl';
import { useTheme } from '@/lib/hooks/useTheme';
import { trackThemeToggle, trackLanguageSwitch, trackMobileMenuOpen } from '@/lib/analytics';
import { SearchModal } from '@/components/search/SearchModal';
import { Drawer } from '@/components/ui';
import { Menu, Search, Sun, Moon, Bitcoin, Globe } from '@/components/icons';
import { locales, localeNames, type Locale } from '@/i18n/config';
import styles from './Header.module.css';

export function Header() {
  const t = useTranslations('header');
  const locale = useLocale();
  const pathname = usePathname();
  const { resolvedTheme, toggleTheme, mounted } = useTheme();
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isNavOpen, setIsNavOpen] = useState(false);
  const [isLangOpen, setIsLangOpen] = useState(false);

  const NAV_LINKS = [
    { href: `/${locale}/topics`, label: t('topics'), testId: 'header-nav-topics' },
    { href: `/${locale}/topics/criticism`, label: t('criticism'), testId: 'header-nav-criticism' },
    { href: `/${locale}/sources`, label: t('sources'), testId: 'header-nav-sources' },
  ];

  // Get the path without locale for language switching
  const getPathWithLocale = (newLocale: Locale) => {
    const segments = pathname.split('/');
    segments[1] = newLocale; // Replace the locale segment
    return segments.join('/');
  };

  return (
    <>
      <header className={styles.header} data-testid="header">
        <div className={styles.container}>
          {/* Mobile menu button */}
          <button
            className={styles.menuButton}
            onClick={() => {
              trackMobileMenuOpen();
              setIsNavOpen(true);
            }}
            aria-label={t('openNavigation')}
            data-testid="mobile-menu-button"
          >
            <Menu size={20} />
          </button>

          {/* Logo */}
          <Link href={`/${locale}`} className={styles.logo} data-testid="header-logo">
            <span className={styles.logoIcon}>
              <Bitcoin size={20} strokeWidth={2.5} />
            </span>
            <span className={styles.logoText}>Therefor Bitcoin</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className={styles.nav} data-testid="header-nav">
            {NAV_LINKS.map((link) => (
              <Link key={link.href} href={link.href} className={styles.navLink} data-testid={link.testId}>
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Actions */}
          <div className={styles.actions}>
            {/* Search Button */}
            <button
              className={styles.searchButton}
              onClick={() => setIsSearchOpen(true)}
              aria-label={t('openSearch')}
              data-testid="header-search-button"
            >
              <Search size={18} />
              <span className={styles.searchLabel}>{locale === 'de' ? 'Suchen' : 'Search'}</span>
            </button>

            {/* Language Switcher */}
            <div className={styles.languageWrapper} data-testid="language-switcher">
              <button
                className={styles.languageToggle}
                onClick={() => setIsLangOpen(!isLangOpen)}
                aria-label={t('changeLanguage')}
                data-testid="language-toggle"
              >
                <Globe size={18} />
              </button>
              
              {isLangOpen && (
                <div className={styles.languageDropdown} data-testid="language-dropdown">
                  {locales.map((loc) => (
                    <Link
                      key={loc}
                      href={getPathWithLocale(loc)}
                      className={`${styles.languageOption} ${loc === locale ? styles.languageActive : ''}`}
                      data-testid={`language-option-${loc}`}
                      onClick={() => {
                        if (loc !== locale) {
                          trackLanguageSwitch(locale, loc);
                        }
                        setIsLangOpen(false);
                      }}
                    >
                      <span>{localeNames[loc]}</span>
                    </Link>
                  ))}
                </div>
              )}
            </div>

            {/* Theme Toggle */}
            <button
              className={styles.themeToggle}
              onClick={() => {
                const from = resolvedTheme as 'light' | 'dark';
                const to = from === 'dark' ? 'light' : 'dark';
                trackThemeToggle(from, to);
                toggleTheme();
              }}
              aria-label={resolvedTheme === 'dark' ? t('switchToLight') : t('switchToDark')}
              data-testid="theme-toggle"
              data-theme={resolvedTheme}
            >
              {mounted && (
                resolvedTheme === 'dark' ? (
                  <Sun size={18} />
                ) : (
                  <Moon size={18} />
                )
              )}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Navigation Drawer */}
      <Drawer isOpen={isNavOpen} onClose={() => setIsNavOpen(false)} title="Navigation">
        <nav className={styles.mobileNav}>
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={styles.mobileNavLink}
              onClick={() => setIsNavOpen(false)}
            >
              {link.label}
            </Link>
          ))}
          
          {/* Language Switcher in Mobile */}
          <div className={styles.mobileLanguage}>
            <span className={styles.mobileLanguageLabel}>{t('changeLanguage')}</span>
            <div className={styles.mobileLanguageOptions}>
              {locales.map((loc) => (
                <Link
                  key={loc}
                  href={getPathWithLocale(loc)}
                  className={`${styles.mobileLanguageOption} ${loc === locale ? styles.languageActive : ''}`}
                  onClick={() => {
                    if (loc !== locale) {
                      trackLanguageSwitch(locale, loc);
                    }
                    setIsNavOpen(false);
                  }}
                >
                  <span>{localeNames[loc]}</span>
                </Link>
              ))}
            </div>
          </div>
        </nav>
      </Drawer>

      {/* Search Modal */}
      <SearchModal isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
    </>
  );
}
