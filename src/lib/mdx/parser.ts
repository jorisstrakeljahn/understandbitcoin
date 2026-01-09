/**
 * MDX/Markdown parsing utilities.
 * Extracts structured data from markdown content.
 */

export interface Heading {
  id: string;
  text: string;
  level: number;
}

/**
 * Extracts headings from MDX/Markdown content for table of contents.
 * Supports H2 and H3 headings.
 */
export function extractHeadings(content: string): Heading[] {
  const headingRegex = /^(#{2,3})\s+(.+)$/gm;
  const headings: Heading[] = [];
  let match;

  while ((match = headingRegex.exec(content)) !== null) {
    const level = match[1].length;
    const text = match[2];
    // Support German umlauts and other characters
    const id = text
      .toLowerCase()
      .replace(/[^a-z0-9äöüß]+/g, '-')
      .replace(/(^-|-$)/g, '');
    headings.push({ id, text, level });
  }

  return headings;
}

/**
 * Generates a URL-safe slug from text.
 * Handles German umlauts and special characters.
 */
export function generateSlug(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9äöüß]+/g, '-')
    .replace(/(^-|-$)/g, '');
}

/**
 * Removes frontmatter from MDX content.
 */
export function stripFrontmatter(content: string): string {
  return content.replace(/^---[\s\S]*?---/, '').trim();
}
