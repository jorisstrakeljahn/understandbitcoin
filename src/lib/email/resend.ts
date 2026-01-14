import { Resend } from 'resend';

/**
 * Resend client instance
 * 
 * Initialized with API key from environment variable.
 * The API key should be set in .env.local
 */
export const resend = new Resend(process.env.RESEND_API_KEY);
