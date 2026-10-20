import type { MetadataRoute } from 'next'
import { SITE } from '@/lib/blog'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [{ userAgent: '*', allow: '/', disallow: ['/admin', '/api', '/portal', '/x/', '/consent'] }],
    sitemap: `${SITE()}/sitemap.xml`,
  }
}
