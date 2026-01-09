export type SourceType = 'book' | 'video' | 'article';

export interface BookSource {
  id: string;
  type: 'book';
  title: string;
  author: string;
  year: number;
  isbn?: string;
  cover: string;
  affiliateUrl?: {
    amazon_de?: string;
    amazon_com?: string;
  };
  description: {
    en: string;
    de: string;
  };
  topics: string[];
  level: 'beginner' | 'intermediate' | 'advanced';
  featured: boolean;
}

export interface VideoSource {
  id: string;
  type: 'video';
  title: string;
  channel: string;
  youtubeId: string;
  duration: string;
  year: number;
  description: {
    en: string;
    de: string;
  };
  topics: string[];
  level: 'beginner' | 'intermediate' | 'advanced';
  featured: boolean;
}

export interface ArticleSource {
  id: string;
  type: 'article';
  title: string;
  author: string;
  year: number;
  url: string;
  articleType: 'whitepaper' | 'article' | 'blog';
  description: {
    en: string;
    de: string;
  };
  topics: string[];
  level: 'beginner' | 'intermediate' | 'advanced';
  featured: boolean;
}

export type Source = BookSource | VideoSource | ArticleSource;
