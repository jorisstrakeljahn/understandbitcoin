import { BookSource } from './types';

// Helper to get YouTube thumbnail URL
export function getYouTubeThumbnail(youtubeId: string, quality: 'default' | 'medium' | 'high' | 'maxres' = 'high'): string {
  const qualityMap = {
    default: 'default',
    medium: 'mqdefault',
    high: 'hqdefault',
    maxres: 'maxresdefault',
  };
  return `https://img.youtube.com/vi/${youtubeId}/${qualityMap[quality]}.jpg`;
}

// Helper to get affiliate link based on locale
export function getAffiliateLink(book: BookSource, locale: string): string | undefined {
  if (!book.affiliateUrl) return undefined;
  return locale === 'de' ? book.affiliateUrl.amazon_de : book.affiliateUrl.amazon_com;
}
