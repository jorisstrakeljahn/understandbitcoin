/**
 * Email configuration for contact forms
 * 
 * The recipient email is configurable via environment variable.
 * The sender email must be from a verified domain in Resend,
 * or use the default onboarding@resend.dev for testing.
 */

export const emailConfig = {
  // Recipient for all contact form submissions
  to: process.env.CONTACT_EMAIL || 'joris.strakeljahn@web.de',
  
  // Sender email - use resend.dev for testing, or your verified domain
  // For production, verify your domain and use something like: noreply@thereforbitcoin.com
  from: 'Therefor Bitcoin <onboarding@resend.dev>',
  
  // Reply-to will be set to the user's email if provided
  replyToDefault: 'noreply@thereforbitcoin.com',
} as const;

export type FormType = 'article-suggestion' | 'bug-report' | 'improvement';

export const formTypeLabels: Record<FormType, { de: string; en: string }> = {
  'article-suggestion': {
    de: 'Artikelvorschlag',
    en: 'Article Suggestion',
  },
  'bug-report': {
    de: 'Fehlermeldung',
    en: 'Bug Report',
  },
  'improvement': {
    de: 'Verbesserungsvorschlag',
    en: 'Improvement Suggestion',
  },
};
