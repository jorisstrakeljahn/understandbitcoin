import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { FrontmatterSchema, Frontmatter, Topic, ContentType, ContentLevel } from './schema';
import type { Locale } from '@/i18n/config';

const CONTENT_DIR = path.join(process.cwd(), 'content');

/** Helper to safely access locale-specific content */
function getLocalizedText<T extends { en: string; de: string }>(obj: T, locale: string): string {
  const lang = (locale === 'de' ? 'de' : 'en') as Locale;
  return obj[lang] || obj.en;
}

// ============================================
// Content Config (loaded from content/config.json)
// ============================================

export interface TopicConfig {
  label: { en: string; de: string };
  description: { en: string; de: string };
  icon: string;
  folder: string;
  order: number;
}

export interface ContentTypeConfig {
  label: { en: string; de: string };
  description: { en: string; de: string };
}

export interface LevelConfig {
  label: { en: string; de: string };
  color: string;
}

export interface ContentConfig {
  topics: Record<string, TopicConfig>;
  contentTypes: Record<string, ContentTypeConfig>;
  levels: Record<string, LevelConfig>;
}

let cachedConfig: ContentConfig | null = null;

export function getContentConfig(): ContentConfig {
  if (cachedConfig) {
    return cachedConfig;
  }

  const configPath = path.join(CONTENT_DIR, 'config.json');
  
  if (!fs.existsSync(configPath)) {
    throw new Error('Content config not found at content/config.json');
  }

  const configContent = fs.readFileSync(configPath, 'utf-8');
  cachedConfig = JSON.parse(configContent) as ContentConfig;
  
  return cachedConfig;
}

export function getTopicConfig(topic: string, language: string = 'en'): { label: string; description: string; icon: string; order: number } {
  const config = getContentConfig();
  const topicConfig = config.topics[topic];
  
  if (!topicConfig) {
    return {
      label: topic,
      description: '',
      icon: '📄',
      order: 999,
    };
  }

  return {
    label: getLocalizedText(topicConfig.label, language),
    description: getLocalizedText(topicConfig.description, language),
    icon: topicConfig.icon,
    order: topicConfig.order,
  };
}

export function getContentTypeConfig(type: string, language: string = 'en'): { label: string; description: string } {
  const config = getContentConfig();
  const typeConfig = config.contentTypes[type];
  
  if (!typeConfig) {
    return {
      label: type,
      description: '',
    };
  }

  return {
    label: getLocalizedText(typeConfig.label, language),
    description: getLocalizedText(typeConfig.description, language),
  };
}

export function getLevelConfig(level: string, language: string = 'en'): { label: string; color: string } {
  const config = getContentConfig();
  const levelConfig = config.levels[level];
  
  if (!levelConfig) {
    return {
      label: level,
      color: 'var(--color-text-secondary)',
    };
  }

  return {
    label: getLocalizedText(levelConfig.label, language),
    color: levelConfig.color,
  };
}

export function getAllTopicsFromConfig(language: string = 'en'): Array<{ id: string; label: string; description: string; icon: string; order: number }> {
  const config = getContentConfig();
  
  return Object.entries(config.topics)
    .map(([id, topic]) => ({
      id,
      label: getLocalizedText(topic.label, language),
      description: getLocalizedText(topic.description, language),
      icon: topic.icon,
      order: topic.order,
    }))
    .sort((a, b) => a.order - b.order);
}

export interface ContentItem {
  frontmatter: Frontmatter;
  content: string;
  slug: string;
}

export interface ContentIndex {
  slug: string;
  title: string;
  summary: string;
  topic: Topic;
  type: ContentType;
  level: ContentLevel;
  tags: string[];
  lastUpdated: string;
}

function getMDXFiles(dir: string): string[] {
  if (!fs.existsSync(dir)) {
    return [];
  }
  
  const files: string[] = [];
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      files.push(...getMDXFiles(fullPath));
    } else if (entry.name.endsWith('.mdx') || entry.name.endsWith('.md')) {
      files.push(fullPath);
    }
  }
  
  return files;
}

export function getAllContent(language: string = 'en'): ContentItem[] {
  const langDir = path.join(CONTENT_DIR, language);
  const files = getMDXFiles(langDir);
  
  const content: ContentItem[] = [];
  
  for (const file of files) {
    try {
      const fileContent = fs.readFileSync(file, 'utf-8');
      const { data, content: mdxContent } = matter(fileContent);
      const frontmatter = FrontmatterSchema.parse(data);
      content.push({
        frontmatter,
        content: mdxContent,
        slug: frontmatter.slug,
      });
    } catch {
      // Skip problematic files silently in production
      // To debug: uncomment the line below
      // console.warn(`[Content] Skipping file with parse error: ${file}`);
    }
  }
  
  return content;
}

export function getContentBySlug(slug: string, language: string = 'en'): ContentItem | null {
  const allContent = getAllContent(language);
  return allContent.find(item => item.frontmatter.slug === slug) || null;
}

export function getContentByTopic(topic: Topic, language: string = 'en'): ContentItem[] {
  const allContent = getAllContent(language);
  return allContent.filter(item => item.frontmatter.topic === topic);
}

export function getContentByType(type: ContentType, language: string = 'en'): ContentItem[] {
  const allContent = getAllContent(language);
  return allContent.filter(item => item.frontmatter.type === type);
}

export function getContentByLevel(level: ContentLevel, language: string = 'en'): ContentItem[] {
  const allContent = getAllContent(language);
  return allContent.filter(item => item.frontmatter.level === level);
}

export function getContentIndex(language: string = 'en'): ContentIndex[] {
  const allContent = getAllContent(language);
  
  return allContent.map(item => ({
    slug: item.frontmatter.slug,
    title: item.frontmatter.title,
    summary: item.frontmatter.summary,
    topic: item.frontmatter.topic,
    type: item.frontmatter.type,
    level: item.frontmatter.level,
    tags: item.frontmatter.tags,
    lastUpdated: item.frontmatter.lastUpdated,
  }));
}

export function getPopularContent(language: string = 'en', limit: number = 6): ContentIndex[] {
  // In a real app, this would be based on analytics
  // For now, just return the first N items
  return getContentIndex(language).slice(0, limit);
}

export function getRelatedContent(slug: string, language: string = 'en', limit: number = 4): ContentIndex[] {
  const current = getContentBySlug(slug, language);
  if (!current) return [];
  
  const allContent = getContentIndex(language);
  
  // Score based on shared tags and same topic
  const scored = allContent
    .filter(item => item.slug !== slug)
    .map(item => {
      let score = 0;
      
      // Same topic = 2 points
      if (item.topic === current.frontmatter.topic) score += 2;
      
      // Each shared tag = 1 point
      const sharedTags = item.tags.filter(tag => 
        current.frontmatter.tags.includes(tag)
      );
      score += sharedTags.length;
      
      // Same level = 0.5 points
      if (item.level === current.frontmatter.level) score += 0.5;
      
      return { ...item, score };
    })
    .sort((a, b) => b.score - a.score);
  
  return scored.slice(0, limit);
}

export function getAllTopics(language: string = 'en'): Topic[] {
  const allContent = getAllContent(language);
  const topics = new Set<Topic>();
  
  for (const item of allContent) {
    topics.add(item.frontmatter.topic);
  }
  
  return Array.from(topics);
}

export function getAllTags(language: string = 'en'): string[] {
  const allContent = getAllContent(language);
  const tags = new Set<string>();
  
  for (const item of allContent) {
    for (const tag of item.frontmatter.tags) {
      tags.add(tag);
    }
  }
  
  return Array.from(tags).sort();
}
