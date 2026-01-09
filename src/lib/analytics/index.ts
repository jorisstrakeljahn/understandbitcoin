// PostHog Analytics
export { initPostHog, posthog, isPostHogReady } from './posthog';

// Event tracking functions
export {
  // User properties
  setUserProperties,
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
  trackArticleView,
  trackTimeOnArticle,
  trackCopyLink,
  // Topics
  trackTopicView,
  trackTopicSelect,
  // Homepage
  trackEntryPointClick,
  trackPopularArticleClick,
  // Sources
  trackSourceClick,
  trackSourcesPageView,
  trackSourceTabChange,
  // Navigation
  trackCTAClick,
} from './events';
