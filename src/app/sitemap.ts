import type { MetadataRoute } from 'next'
import { getPayload } from 'payload'
import config from '@payload-config'
import { SITE } from '@/lib/blog'
import { livePosts } from '@/collections/content'

export const revalidate = 3600

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const payload = await getPayload({ config })
  const all = <T extends string>(collection: T, where = {}) =>
    payload.find({ collection: collection as never, where, limit: 5000, depth: 0, pagination: false, overrideAccess: true }).then((r) => r.docs as unknown as { slug: string; updatedAt: string }[])
  const [posts, services, careers, books, cats, pages] = await Promise.all([
    all('posts', livePosts()),
    all('services', { published: { equals: true } }),
    all('careers', { published: { equals: true } }),
    all('books', { published: { equals: true } }),
    all('categories'),
    all('pages', { published: { equals: true } }),
  ])
  const base = SITE()
  const fixed = ['', '/services', '/assessments', '/career-explorer', '/careers', '/books', '/blog', '/reviews', '/about', '/awards', '/contact']
  const map = (prefix: string, docs: { slug: string; updatedAt: string }[]) => docs.map((d) => ({ url: `${base}${prefix}/${d.slug}`, lastModified: d.updatedAt }))
  return [
    ...fixed.map((p) => ({ url: `${base}${p}` })),
    ...map('/blog', posts),
    ...map('/blog/category', cats),
    ...map('/services', services),
    ...map('/careers', careers),
    ...map('/books', books),
    ...map('/p', pages),
  ]
}
