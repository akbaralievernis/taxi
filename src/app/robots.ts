import type { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/admin', '/api', '/driver/dashboard', '/cabinet'],
      },
    ],
    sitemap: 'https://taxi-kg.example/sitemap.xml',
  };
}
