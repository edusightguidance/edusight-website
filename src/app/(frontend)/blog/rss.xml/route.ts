import { SITE, findPosts } from '@/lib/blog'

export const revalidate = 600
const esc = (s = '') => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')

export async function GET() {
  const posts = (await findPosts({ limit: 50 })).docs
  const items = posts
    .map((p) => `<item><title>${esc(p.title || '')}</title><link>${SITE()}/blog/${p.slug}</link><guid>${SITE()}/blog/${p.slug}</guid><pubDate>${new Date(p.publishedAt).toUTCString()}</pubDate><description>${esc(p.excerpt || '')}</description></item>`)
    .join('')
  const xml = `<?xml version="1.0" encoding="UTF-8"?><rss version="2.0"><channel><title>EDUSIGHT blog</title><link>${SITE()}/blog</link><description>Careers, universities and parenting advice from EDUSIGHT, Dubai.</description><language>en</language>${items}</channel></rss>`
  return new Response(xml, { headers: { 'Content-Type': 'application/rss+xml; charset=utf-8' } })
}
