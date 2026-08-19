import type { MetadataRoute } from 'next';
import { products, site } from '@/data/site';

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  const staticRoutes = [
    { path: '', priority: 1 },
    { path: '/produtos', priority: 0.9 },
    { path: '/sobre', priority: 0.7 },
    { path: '/contato', priority: 0.8 },
  ].map((r) => ({
    url: `${site.url}${r.path}`,
    lastModified: now,
    changeFrequency: 'monthly' as const,
    priority: r.priority,
  }));

  const productRoutes = products.map((p) => ({
    url: `${site.url}/produtos/${p.slug}`,
    lastModified: now,
    changeFrequency: 'monthly' as const,
    priority: 0.8,
  }));

  return [...staticRoutes, ...productRoutes];
}
