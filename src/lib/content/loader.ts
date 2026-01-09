import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import readingTime from 'reading-time';
import { FrontmatterSchema, Frontmatter, Topic, ContentType, ContentLevel } from './schema';

const CONTENT_DIR = path.join(process.cwd(), 'content');

export interface ContentItem {
  frontmatter: Frontmatter;
  content: string;
  slug: string;
  readTime: number;
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
  readTime: number;
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
    const fileContent = fs.readFileSync(file, 'utf-8');
    const { data, content: mdxContent } = matter(fileContent);
    
    const readTimeResult = readingTime(mdxContent);
    const enrichedData = {
      ...data,
      readTime: Math.ceil(readTimeResult.minutes),
    };
    
    try {
      const frontmatter = FrontmatterSchema.parse(enrichedData);
      content.push({
        frontmatter,
        content: mdxContent,
        slug: frontmatter.slug,
        readTime: Math.ceil(readTimeResult.minutes),
      });
    } catch (error) {
      console.error(`Error parsing frontmatter for ${file}:`, error);
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
    readTime: item.readTime,
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
