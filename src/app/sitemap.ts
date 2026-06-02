import type { MetadataRoute } from 'next';

const BASE = 'https://taxi-kg.example';

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  return [
    { url: `${BASE}/`, lastModified: now, changeFrequency: 'weekly', priority: 1.0 },
    { url: `${BASE}/track`, lastModified: now, changeFrequency: 'monthly', priority: 0.7 },
    { url: `${BASE}/cabinet`, lastModified: now, changeFrequency: 'monthly', priority: 0.6 },
    { url: `${BASE}/driver`, lastModified: now, changeFrequency: 'monthly', priority: 0.5 },
  ];
}
