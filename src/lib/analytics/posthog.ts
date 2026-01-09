import posthog from 'posthog-js';

// PostHog configuration
const POSTHOG_KEY = process.env.NEXT_PUBLIC_POSTHOG_KEY;
const POSTHOG_HOST = process.env.NEXT_PUBLIC_POSTHOG_HOST || 'https://eu.i.posthog.com';

// Initialize PostHog (client-side only)
export function initPostHog() {
  if (typeof window === 'undefined') return;
  if (!POSTHOG_KEY) {
    console.warn('PostHog key not found. Analytics disabled.');
    return;
  }

  posthog.init(POSTHOG_KEY, {
    api_host: POSTHOG_HOST,
    // Disable automatic pageview capture - we'll do it manually via Next.js router
    capture_pageview: false,
    // Capture page leave events
    capture_pageleave: true,
    // Respect Do Not Track
    respect_dnt: true,
    // Disable session recording by default (enable in PostHog dashboard if needed)
    disable_session_recording: true,
    // Persistence
    persistence: 'localStorage+cookie',
    // Bootstrap with person properties
    bootstrap: {
      distinctID: undefined, // Let PostHog generate one
    },
  });
}

// Export the PostHog instance for direct access if needed
export { posthog };

// Check if PostHog is initialized and ready
export function isPostHogReady(): boolean {
  return typeof window !== 'undefined' && !!POSTHOG_KEY && posthog.__loaded;
}
