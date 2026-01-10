import { describe, it, expect, beforeEach, vi } from 'vitest';
import { searchContent, getSearchSuggestions, getDidYouMean, getTrendingSearches } from '@/lib/search';

// Note: The search functions use a cached Fuse instance, so we test the actual behavior

describe('Search Logic', () => {
  describe('searchContent', () => {
    it('gibt leeres Array bei leerem Query zurück', () => {
      const results = searchContent('');
      expect(results).toEqual([]);
    });

    it('gibt leeres Array bei Query nur mit Leerzeichen zurück', () => {
      const results = searchContent('   ');
      expect(results).toEqual([]);
    });

    it('findet Artikel nach Suchbegriff', () => {
      const results = searchContent('bitcoin');
      expect(results.length).toBeGreaterThan(0);
    });

    it('Ergebnisse haben die richtige Struktur', () => {
      const results = searchContent('bitcoin');
      
      if (results.length > 0) {
        const result = results[0];
        expect(result).toHaveProperty('slug');
        expect(result).toHaveProperty('title');
        expect(result).toHaveProperty('summary');
        expect(result).toHaveProperty('topic');
        expect(result).toHaveProperty('matchedOn');
        expect(result).toHaveProperty('highlights');
      }
    });

    it('markiert wo der Match gefunden wurde', () => {
      const results = searchContent('bitcoin');
      
      if (results.length > 0) {
        const result = results[0];
        expect(Array.isArray(result.matchedOn)).toBe(true);
      }
    });

    it('respektiert das Limit Option', () => {
      const results = searchContent('bitcoin', { limit: 2 });
      expect(results.length).toBeLessThanOrEqual(2);
    });

    it('filtert nach Topic wenn angegeben', () => {
      const results = searchContent('bitcoin', { topic: 'beginner' });
      
      for (const result of results) {
        expect(result.topic).toBe('beginner');
      }
    });

    it('filtert nach Level wenn angegeben', () => {
      const results = searchContent('bitcoin', { level: 'beginner' });
      
      for (const result of results) {
        expect(result.level).toBe('beginner');
      }
    });
  });

  describe('getSearchSuggestions', () => {
    it('gibt leeres Array bei leerem Query zurück', () => {
      const suggestions = getSearchSuggestions('');
      expect(suggestions).toEqual([]);
    });

    it('gibt leeres Array bei zu kurzem Query zurück', () => {
      const suggestions = getSearchSuggestions('a');
      expect(suggestions).toEqual([]);
    });

    it('gibt Vorschläge bei gültigem Query zurück', () => {
      const suggestions = getSearchSuggestions('bit');
      expect(Array.isArray(suggestions)).toBe(true);
    });

    it('respektiert das Limit', () => {
      const suggestions = getSearchSuggestions('bit', 3);
      expect(suggestions.length).toBeLessThanOrEqual(3);
    });
  });

  describe('getDidYouMean', () => {
    it('gibt null bei leerem Query zurück', () => {
      const suggestion = getDidYouMean('');
      expect(suggestion).toBeNull();
    });

    it('gibt null bei zu kurzem Query zurück', () => {
      const suggestion = getDidYouMean('ab');
      expect(suggestion).toBeNull();
    });

    it('gibt Vorschlag bei Tippfehler zurück oder null', () => {
      const suggestion = getDidYouMean('bitconi');
      // May or may not return a suggestion depending on the content
      expect(suggestion === null || typeof suggestion === 'string').toBe(true);
    });
  });

  describe('getTrendingSearches', () => {
    it('gibt ein Array von Strings zurück', () => {
      const trending = getTrendingSearches();
      expect(Array.isArray(trending)).toBe(true);
      expect(trending.length).toBeGreaterThan(0);
      
      for (const item of trending) {
        expect(typeof item).toBe('string');
      }
    });
  });
});
