import { MetadataRoute } from 'next';
import { getAllContent, getContentConfig } from '@/lib/content/loader';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://understandbitcoin.com';
  const allContent = getAllContent();
  const config = getContentConfig();

  // Static pages
  const staticPages: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 1,
    },
    {
      url: `${baseUrl}/topics`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/sources`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    {
      url: `${baseUrl}/search`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.5,
    },
  ];

  // Topic pages - from config
  const topicPages: MetadataRoute.Sitemap = Object.keys(config.topics).map((topic) => ({
    url: `${baseUrl}/topics/${topic}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.8,
  }));

  // Article pages
  const articlePages: MetadataRoute.Sitemap = allContent.map((article) => ({
    url: `${baseUrl}/articles/${article.slug}`,
    lastModified: new Date(article.frontmatter.lastUpdated),
    changeFrequency: 'monthly' as const,
    priority: 0.7,
  }));

  return [...staticPages, ...topicPages, ...articlePages];
}
