import type { Where } from 'payload'
import { db } from './data'
import { livePosts } from '../collections/content'

export const PER_PAGE = 12
export const SITE = () => (process.env.NEXT_PUBLIC_SITE_URL || 'https://www.edusightconsulting.com').replace(/\/$/, '')

export async function findPosts(o: { page?: number; categoryId?: number; tagId?: number; q?: string; limit?: number; exclude?: number } = {}) {
  const and: Where[] = [livePosts()]
  if (o.categoryId) and.push({ categories: { in: [o.categoryId] } })
  if (o.tagId) and.push({ tags: { in: [o.tagId] } })
  if (o.q) and.push({ or: [{ title: { like: o.q } }, { excerpt: { like: o.q } }] })
  if (o.exclude) and.push({ id: { not_equals: o.exclude } })
  return (await db()).find({
    collection: 'posts',
    where: { and },
    sort: '-publishedAt',
    limit: o.limit || PER_PAGE,
    page: o.page || 1,
    depth: 1,
    overrideAccess: true,
  })
}

export const fmtDate = (d?: string | null) =>
  d ? new Date(d).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }) : ''

/** Author shown on posts. The founder's name is hidden for now; posts show the team instead. */
export const authorName = (a?: string | null) => (!a || /bhavana/i.test(a) ? 'The EDUSIGHT team' : a)
