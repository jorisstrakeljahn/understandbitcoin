// Server-only source loader - only import in Server Components
import fs from 'fs';
import path from 'path';
import { BookSource, VideoSource, ArticleSource, Source } from './types';

const SOURCES_DIR = path.join(process.cwd(), 'content/sources');

interface BooksJson {
  sources: Omit<BookSource, 'type'>[];
}

interface VideosJson {
  sources: Omit<VideoSource, 'type'>[];
}

interface ArticlesJson {
  sources: (Omit<ArticleSource, 'type' | 'articleType'> & { type: string })[];
}

export function getAllBooks(): BookSource[] {
  try {
    const filePath = path.join(SOURCES_DIR, 'books.json');
    const content = fs.readFileSync(filePath, 'utf-8');
    const data: BooksJson = JSON.parse(content);
    return data.sources.map((book) => ({ ...book, type: 'book' as const }));
  } catch {
    return [];
  }
}

export function getAllVideos(): VideoSource[] {
  try {
    const filePath = path.join(SOURCES_DIR, 'videos.json');
    const content = fs.readFileSync(filePath, 'utf-8');
    const data: VideosJson = JSON.parse(content);
    return data.sources.map((video) => ({ ...video, type: 'video' as const }));
  } catch {
    return [];
  }
}

export function getAllArticles(): ArticleSource[] {
  try {
    const filePath = path.join(SOURCES_DIR, 'articles.json');
    const content = fs.readFileSync(filePath, 'utf-8');
    const data: ArticlesJson = JSON.parse(content);
    return data.sources.map((article) => ({
      ...article,
      type: 'article' as const,
      articleType: article.type as 'whitepaper' | 'article' | 'blog',
    }));
  } catch {
    return [];
  }
}

export function getAllSources(): Source[] {
  const books = getAllBooks();
  const videos = getAllVideos();
  const articles = getAllArticles();
  return [...books, ...videos, ...articles];
}

export function getFeaturedSources(): Source[] {
  return getAllSources().filter((source) => source.featured);
}

export function getSourcesByTopic(topic: string): Source[] {
  return getAllSources().filter((source) => source.topics.includes(topic));
}

export function getSourcesByType(type: 'book' | 'video' | 'article'): Source[] {
  return getAllSources().filter((source) => source.type === type);
}

export function getSourceById(id: string): Source | undefined {
  return getAllSources().find((source) => source.id === id);
}

export function getSourcesCount(): number {
  return getAllSources().length;
}
