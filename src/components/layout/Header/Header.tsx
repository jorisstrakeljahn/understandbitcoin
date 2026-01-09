'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useTheme } from '@/lib/hooks/useTheme';
import { SearchModal } from '@/components/search/SearchModal';
import { Drawer } from '@/components/ui';
import { Menu, Search, Sun, Moon, Bitcoin } from '@/components/icons';
import styles from './Header.module.css';

const NAV_LINKS = [
  { href: '/topics', label: 'Topics' },
  { href: '/topics/criticism', label: 'Criticism' },
  { href: '/glossary', label: 'Glossary' },
  { href: '/sources', label: 'Sources' },
];

export function Header() {
  const { resolvedTheme, toggleTheme, mounted } = useTheme();
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isNavOpen, setIsNavOpen] = useState(false);

  return (
    <>
      <header className={styles.header}>
        <div className={styles.container}>
          {/* Mobile menu button */}
          <button
            className={styles.menuButton}
            onClick={() => setIsNavOpen(true)}
            aria-label="Open navigation menu"
          >
            <Menu size={20} />
          </button>

          {/* Logo */}
          <Link href="/" className={styles.logo}>
            <span className={styles.logoIcon}>
              <Bitcoin size={20} strokeWidth={2.5} />
            </span>
            <span className={styles.logoText}>Understand Bitcoin</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className={styles.nav}>
            {NAV_LINKS.map((link) => (
              <Link key={link.href} href={link.href} className={styles.navLink}>
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
              aria-label="Open search"
            >
              <Search size={18} />
              <span className={styles.searchLabel}>Search</span>
              <kbd className={styles.searchShortcut}>⌘K</kbd>
            </button>

            {/* Theme Toggle */}
            <button
              className={styles.themeToggle}
              onClick={toggleTheme}
              aria-label={`Switch to ${resolvedTheme === 'dark' ? 'light' : 'dark'} mode`}
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
        </nav>
      </Drawer>

      {/* Search Modal */}
      <SearchModal isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
    </>
  );
}
