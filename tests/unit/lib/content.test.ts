import { describe, it, expect } from 'vitest';
import {
  getContentConfig,
  getTopicConfig,
  getLevelConfig,
  getAllTopicsFromConfig,
  getAllContent,
  getContentBySlug,
  getContentIndex,
} from '@/lib/content/loader';

describe('Content Loader', () => {
  describe('getContentConfig', () => {
    it('lädt die Konfiguration', () => {
      const config = getContentConfig();
      
      expect(config).toBeDefined();
      expect(config).toHaveProperty('topics');
      expect(config).toHaveProperty('contentTypes');
      expect(config).toHaveProperty('levels');
    });

    it('enthält die erwarteten Topics', () => {
      const config = getContentConfig();
      
      expect(config.topics).toHaveProperty('basics');
      expect(config.topics).toHaveProperty('criticism');
    });

    it('enthält die erwarteten Levels', () => {
      const config = getContentConfig();
      
      expect(config.levels).toHaveProperty('beginner');
      expect(config.levels).toHaveProperty('intermediate');
      expect(config.levels).toHaveProperty('advanced');
    });
  });

  describe('getTopicConfig', () => {
    it('gibt Topic-Konfiguration auf Deutsch zurück', () => {
      const topic = getTopicConfig('beginner', 'de');
      
      expect(topic).toBeDefined();
      expect(topic.label).toBeDefined();
      expect(typeof topic.label).toBe('string');
      expect(topic.label.length).toBeGreaterThan(0);
    });

    it('gibt Topic-Konfiguration auf Englisch zurück', () => {
      const topic = getTopicConfig('beginner', 'en');
      
      expect(topic).toBeDefined();
      expect(topic.label).toBeDefined();
      expect(typeof topic.label).toBe('string');
    });

    it('gibt Fallback für unbekanntes Topic zurück', () => {
      const topic = getTopicConfig('unknown-topic', 'de');
      
      expect(topic.label).toBe('unknown-topic');
    });
  });

  describe('getLevelConfig', () => {
    it('gibt Level-Konfiguration auf Deutsch zurück', () => {
      const level = getLevelConfig('beginner', 'de');
      
      expect(level).toBeDefined();
      expect(level.label).toBeDefined();
      expect(level.color).toBeDefined();
    });

    it('gibt Level-Konfiguration auf Englisch zurück', () => {
      const level = getLevelConfig('beginner', 'en');
      
      expect(level).toBeDefined();
      expect(level.label).toBeDefined();
    });

    it('gibt Fallback für unbekanntes Level zurück', () => {
      const level = getLevelConfig('unknown-level', 'de');
      
      expect(level.label).toBe('unknown-level');
    });
  });

  describe('getAllTopicsFromConfig', () => {
    it('gibt sortierte Topics zurück', () => {
      const topics = getAllTopicsFromConfig('de');
      
      expect(Array.isArray(topics)).toBe(true);
      expect(topics.length).toBeGreaterThan(0);
      
      // Check sorted by order
      for (let i = 1; i < topics.length; i++) {
        expect(topics[i].order).toBeGreaterThanOrEqual(topics[i - 1].order);
      }
    });

    it('jedes Topic hat die richtige Struktur', () => {
      const topics = getAllTopicsFromConfig('de');
      
      for (const topic of topics) {
        expect(topic).toHaveProperty('id');
        expect(topic).toHaveProperty('label');
        expect(topic).toHaveProperty('description');
        expect(topic).toHaveProperty('icon');
        expect(topic).toHaveProperty('order');
      }
    });
  });

  describe('getAllContent', () => {
    it('lädt alle englischen Artikel', () => {
      const content = getAllContent('en');
      
      expect(Array.isArray(content)).toBe(true);
      expect(content.length).toBeGreaterThan(0);
    });

    it('lädt alle deutschen Artikel', () => {
      const content = getAllContent('de');
      
      expect(Array.isArray(content)).toBe(true);
      expect(content.length).toBeGreaterThan(0);
    });

    it('Artikel haben die richtige Struktur', () => {
      const content = getAllContent('en');
      
      if (content.length > 0) {
        const article = content[0];
        expect(article).toHaveProperty('frontmatter');
        expect(article).toHaveProperty('content');
        expect(article).toHaveProperty('slug');
        expect(article.frontmatter).toHaveProperty('title');
        expect(article.frontmatter).toHaveProperty('summary');
        expect(article.frontmatter).toHaveProperty('topic');
      }
    });
  });

  describe('getContentBySlug', () => {
    it('findet einen Artikel nach Slug', () => {
      const article = getContentBySlug('what-is-bitcoin', 'en');
      
      expect(article).toBeDefined();
      expect(article?.slug).toBe('what-is-bitcoin');
    });

    it('gibt null für unbekannten Slug zurück', () => {
      const article = getContentBySlug('this-does-not-exist', 'en');
      
      expect(article).toBeNull();
    });
  });

  describe('getContentIndex', () => {
    it('gibt den Such-Index zurück', () => {
      const index = getContentIndex('en');
      
      expect(Array.isArray(index)).toBe(true);
      expect(index.length).toBeGreaterThan(0);
    });

    it('Index-Einträge haben die richtige Struktur', () => {
      const index = getContentIndex('en');
      
      if (index.length > 0) {
        const entry = index[0];
        expect(entry).toHaveProperty('slug');
        expect(entry).toHaveProperty('title');
        expect(entry).toHaveProperty('summary');
        expect(entry).toHaveProperty('topic');
        expect(entry).toHaveProperty('tags');
      }
    });
  });
});
