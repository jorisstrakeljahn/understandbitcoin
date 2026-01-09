import { posthog, isPostHogReady } from './posthog';

// Helper to safely capture events
function capture(eventName: string, properties?: Record<string, unknown>) {
  if (!isPostHogReady()) return;
  posthog.capture(eventName, properties);
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
