/**
 * MDX/Markdown parsing utilities.
 * Extracts structured data from markdown content.
 */

import GithubSlugger from 'github-slugger';

export interface Heading {
  id: string;
  text: string;
  level: number;
}

/**
 * Extracts headings from MDX/Markdown content for table of contents.
 * Uses github-slugger for ID generation (same as rehype-slug).
 */
export function extractHeadings(content: string): Heading[] {
  const headingRegex = /^(#{2,3})\s+(.+)$/gm;
  const headings: Heading[] = [];
  const slugger = new GithubSlugger();
  let match;

  while ((match = headingRegex.exec(content)) !== null) {
    const level = match[1].length;
    const text = match[2];
    const id = slugger.slug(text);
    headings.push({ id, text, level });
  }

  return headings;
}

/**
 * Generates a URL-safe slug from text.
 */
export function generateSlug(text: string): string {
  const slugger = new GithubSlugger();
  return slugger.slug(text);
}

/**
 * Removes frontmatter from MDX content.
 */
export function stripFrontmatter(content: string): string {
  return content.replace(/^---[\s\S]*?---/, '').trim();
}
