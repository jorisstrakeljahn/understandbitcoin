import { posthog, isPostHogReady } from './posthog';

// Helper to safely capture events
function capture(eventName: string, properties?: Record<string, unknown>) {
  if (!isPostHogReady()) return;
  posthog.capture(eventName, properties);
}

// Set user properties (e.g., preferred language, theme)
export function setUserProperties(properties: Record<string, unknown>) {
  if (!isPostHogReady()) return;
  posthog.setPersonProperties(properties);
}

// ============================================
// PAGE VIEW EVENTS
// ============================================

/**
 * Track a page view manually (used with Next.js router)
 */
export function trackPageView(url: string) {
  capture('$pageview', {
    $current_url: url,
  });
}

// ============================================
// SEARCH EVENTS
// ============================================

/**
 * Track when a user performs a search
 */
export function trackSearch(query: string, resultsCount: number) {
  capture('search_query', {
    query,
    results_count: resultsCount,
    has_results: resultsCount > 0,
  });
}

/**
 * Track when a user clicks on a search result
 */
export function trackSearchResultClick(query: string, slug: string, position: number) {
  capture('search_result_click', {
    query,
    clicked_slug: slug,
    position,
  });
}

// ============================================
// THEME & LANGUAGE EVENTS
// ============================================

/**
 * Track theme toggle
 */
export function trackThemeToggle(from: 'light' | 'dark', to: 'light' | 'dark') {
  capture('theme_toggle', {
    from,
    to,
  });
}

/**
 * Track language switch
 */
export function trackLanguageSwitch(from: string, to: string) {
  capture('language_switch', {
    from,
    to,
  });
}

// ============================================
// ARTICLE EVENTS
// ============================================

/**
 * Track scroll depth in an article
 * @param slug - Article slug
 * @param depth - Scroll depth percentage (25, 50, 75, 100)
 */
export function trackScrollDepth(slug: string, depth: 25 | 50 | 75 | 100) {
  capture('article_scroll_depth', {
    slug,
    depth,
  });
}

/**
 * Track external link clicks
 */
export function trackExternalLinkClick(url: string, articleSlug?: string) {
  capture('external_link_click', {
    url,
    article_slug: articleSlug,
    hostname: new URL(url).hostname,
  });
}

/**
 * Track related article clicks
 */
export function trackRelatedArticleClick(fromSlug: string, toSlug: string) {
  capture('related_article_click', {
    from_slug: fromSlug,
    to_slug: toSlug,
  });
}

// ============================================
// NAVIGATION EVENTS
// ============================================

/**
 * Track CTA button clicks
 */
export function trackCTAClick(buttonName: string, location: string) {
  capture('cta_click', {
    button_name: buttonName,
    location,
  });
}

/**
 * Track topic selection
 */
export function trackTopicSelect(topic: string, source: 'home' | 'sidebar' | 'header') {
  capture('topic_select', {
    topic,
    source,
  });
}

// ============================================
// HOMEPAGE EVENTS
// ============================================

/**
 * Track entry point card clicks on homepage
 */
export function trackEntryPointClick(entryPoint: string) {
  capture('entry_point_click', {
    entry_point: entryPoint,
  });
}

/**
 * Track popular article clicks on homepage
 */
export function trackPopularArticleClick(slug: string, topic: string, position: number) {
  capture('popular_article_click', {
    slug,
    topic,
    position,
  });
}

/**
 * Track source carousel interaction
 */
export function trackSourceClick(sourceId: string, sourceType: string, title: string) {
  capture('source_click', {
    source_id: sourceId,
    source_type: sourceType,
    title,
  });
}

// ============================================
// ARTICLE VIEW EVENTS
// ============================================

/**
 * Track article view with full context
 */
export function trackArticleView(
  slug: string, 
  topic: string, 
  level: string,
  referrer: 'search' | 'topic' | 'home' | 'related' | 'direct' | 'sidebar'
) {
  capture('article_view', {
    slug,
    topic,
    level,
    referrer,
  });
}

/**
 * Track topic page view
 */
export function trackTopicView(topic: string) {
  capture('topic_view', {
    topic,
  });
}

/**
 * Track sources page view
 */
export function trackSourcesPageView(activeTab: string) {
  capture('sources_page_view', {
    active_tab: activeTab,
  });
}

/**
 * Track source tab change
 */
export function trackSourceTabChange(fromTab: string, toTab: string) {
  capture('source_tab_change', {
    from_tab: fromTab,
    to_tab: toTab,
  });
}

// ============================================
// ENGAGEMENT EVENTS
// ============================================

/**
 * Track time spent on article (call when leaving)
 */
export function trackTimeOnArticle(slug: string, timeSeconds: number) {
  capture('article_time_spent', {
    slug,
    time_seconds: timeSeconds,
    time_bucket: getTimeBucket(timeSeconds),
  });
}

/**
 * Track copy link/heading click
 */
export function trackCopyLink(slug: string, headingId: string) {
  capture('copy_link', {
    slug,
    heading_id: headingId,
  });
}

// Helper to bucket time into categories
function getTimeBucket(seconds: number): string {
  if (seconds < 10) return '<10s';
  if (seconds < 30) return '10-30s';
  if (seconds < 60) return '30-60s';
  if (seconds < 120) return '1-2min';
  if (seconds < 300) return '2-5min';
  return '>5min';
}

// ============================================
// ADDITIONAL UI EVENTS
// ============================================

/**
 * Track footer link clicks
 */
export function trackFooterLinkClick(href: string, section: string) {
  capture('footer_link_click', {
    href,
    section,
    link_name: href.split('/').pop(),
  });
}

/**
 * Track table of contents clicks
 */
export function trackTableOfContentsClick(slug: string, headingId: string) {
  capture('toc_click', {
    slug,
    heading_id: headingId,
  });
}

/**
 * Track mobile menu open
 */
export function trackMobileMenuOpen() {
  capture('mobile_menu_open', {});
}

/**
 * Track 404 page view
 */
export function track404PageView(attemptedUrl: string) {
  capture('404_page_view', {
    attempted_url: attemptedUrl,
  });
}
