// PostHog Analytics
export { initPostHog, posthog, isPostHogReady } from './posthog';

// Event tracking functions
export {
  // Page views
  trackPageView,
  // Search
  trackSearch,
  trackSearchResultClick,
  // Theme & Language
  trackThemeToggle,
  trackLanguageSwitch,
  // Articles
  trackScrollDepth,
  trackExternalLinkClick,
  trackRelatedArticleClick,
  // Navigation
  trackCTAClick,
  trackTopicSelect,
} from './events';
