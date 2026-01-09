/**
 * Central site configuration
 * All site-wide constants should be defined here
 */

export const siteConfig = {
  /** Production URL of the site */
  url: 'https://thereforbitcoin.com',
  
  /** Site name for metadata */
  name: 'Therefor Bitcoin',
  
  /** Default locale */
  defaultLocale: 'en',
  
  /** Supported locales */
  locales: ['en', 'de'] as const,
  
  /** Social links */
  social: {
    twitter: '@thereforbtc',
  },
  
  /** Contact email */
  email: 'hello@thereforbitcoin.com',
} as const;

export type SiteConfig = typeof siteConfig;
