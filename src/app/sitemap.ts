import { MetadataRoute } from 'next';
import { getAllContent, getContentConfig } from '@/lib/content/loader';
import { siteConfig } from '@/lib/config';
import { locales } from '@/i18n/config';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = siteConfig.url;
  const config = getContentConfig();

  const entries: MetadataRoute.Sitemap = [];

  // Homepage for each locale
  for (const locale of locales) {
    entries.push({
      url: `${baseUrl}/${locale}`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 1,
    });
  }

  // Static pages for each locale
  const staticPages = ['topics', 'sources', 'search'];
  for (const locale of locales) {
    for (const page of staticPages) {
      entries.push({
        url: `${baseUrl}/${locale}/${page}`,
        lastModified: new Date(),
        changeFrequency: page === 'sources' ? 'monthly' : 'weekly',
        priority: page === 'topics' ? 0.9 : page === 'sources' ? 0.7 : 0.5,
      });
    }
  }

  // Topic pages for each locale
  for (const locale of locales) {
    for (const topic of Object.keys(config.topics)) {
      entries.push({
        url: `${baseUrl}/${locale}/topics/${topic}`,
        lastModified: new Date(),
        changeFrequency: 'weekly',
        priority: 0.8,
      });
    }
  }

  // Article pages for each locale
  for (const locale of locales) {
    const localeContent = getAllContent(locale);
    for (const article of localeContent) {
      entries.push({
        url: `${baseUrl}/${locale}/articles/${article.slug}`,
        lastModified: new Date(article.frontmatter.lastUpdated),
        changeFrequency: 'monthly',
        priority: 0.7,
      });
    }
  }

  return entries;
}
