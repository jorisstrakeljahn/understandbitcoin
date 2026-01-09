import { z } from 'zod';

export const ContentTypeSchema = z.enum([
  'qa',
  'explainer',
  'criticism',
  'glossary',
  'source',
]);

export const ContentLevelSchema = z.enum([
  'beginner',
  'intermediate',
  'advanced',
]);

export const TopicSchema = z.enum([
  'basics',
  'security',
  'mining',
  'lightning',
  'economics',
  'criticism',
  'money',
  'dev',
]);

export const SourceTypeSchema = z.enum([
  'primary',
  'secondary',
  'video',
  'book',
  'article',
  'podcast',
]);

export const SourceSchema = z.object({
  title: z.string(),
  url: z.string().url().optional(),
  author: z.string().optional(),
  type: SourceTypeSchema,
  description: z.string().optional(),
});

export const FrontmatterSchema = z.object({
  slug: z.string(),
  title: z.string(),
  summary: z.string().max(300),
  tags: z.array(z.string()),
  topic: TopicSchema,
  level: ContentLevelSchema,
  type: ContentTypeSchema,
  language: z.string().default('en'),
  lastUpdated: z.string(),
  sources: z.array(SourceSchema).optional().default([]),
  readTime: z.number().optional(),
  tldr: z.array(z.string()).max(5).optional(),
  relatedQuestions: z.array(z.string()).optional().default([]),
  whyPeopleAsk: z.string().optional(),
  steelmanObjection: z.string().optional(),
  whatIsTrue: z.array(z.string()).optional(),
  whatIsUncertain: z.array(z.string()).optional(),
});

export type Frontmatter = z.infer<typeof FrontmatterSchema>;
export type ContentType = z.infer<typeof ContentTypeSchema>;
export type ContentLevel = z.infer<typeof ContentLevelSchema>;
export type Topic = z.infer<typeof TopicSchema>;
export type Source = z.infer<typeof SourceSchema>;
export type SourceType = z.infer<typeof SourceTypeSchema>;

// Topic metadata for display
export const TOPICS: Record<Topic, { label: string; description: string; icon: string }> = {
  basics: {
    label: 'Bitcoin Basics',
    description: 'Fundamental concepts and how Bitcoin works',
    icon: '₿',
  },
  security: {
    label: 'Security & Self-Custody',
    description: 'Protecting your Bitcoin and managing keys',
    icon: '🔐',
  },
  mining: {
    label: 'Mining & Energy',
    description: 'How mining secures the network',
    icon: '⛏️',
  },
  lightning: {
    label: 'Lightning & Payments',
    description: 'Fast, cheap Bitcoin transactions',
    icon: '⚡',
  },
  economics: {
    label: 'Monetary Economics',
    description: 'Bitcoin as money and economic theory',
    icon: '📊',
  },
  criticism: {
    label: 'Criticism & Concerns',
    description: 'Common objections addressed fairly',
    icon: '🤔',
  },
  money: {
    label: 'Sound Money',
    description: 'Austrian economics and monetary history',
    icon: '🪙',
  },
  dev: {
    label: 'Development',
    description: 'Building on Bitcoin',
    icon: '💻',
  },
};

export const CONTENT_TYPES: Record<ContentType, { label: string; description: string }> = {
  qa: {
    label: 'Q&A',
    description: 'Direct answers to common questions',
  },
  explainer: {
    label: 'Explainer',
    description: 'In-depth explanations of concepts',
  },
  criticism: {
    label: 'Criticism',
    description: 'Fair treatment of objections',
  },
  glossary: {
    label: 'Glossary',
    description: 'Definitions and terms',
  },
  source: {
    label: 'Source',
    description: 'Books, articles, and resources',
  },
};

export const LEVELS: Record<ContentLevel, { label: string; color: string }> = {
  beginner: {
    label: 'Beginner',
    color: 'var(--color-success)',
  },
  intermediate: {
    label: 'Intermediate',
    color: 'var(--color-warning)',
  },
  advanced: {
    label: 'Advanced',
    color: 'var(--color-error)',
  },
};
