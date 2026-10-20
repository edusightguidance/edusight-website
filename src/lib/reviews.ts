import type { Where } from 'payload'
import { db } from './data'

export async function findReviews(o: { source?: string; serviceId?: number; featured?: boolean; page?: number; limit?: number } = {}) {
  const and: Where[] = [{ status: { equals: 'approved' } }]
  if (o.source) and.push({ source: { equals: o.source } })
  if (o.serviceId) and.push({ service: { equals: o.serviceId } })
  if (o.featured) and.push({ featured: { equals: true } })
  return (await db()).find({ collection: 'testimonials', where: { and }, sort: '-date', limit: o.limit || 24, page: o.page || 1, depth: 1, overrideAccess: false })
}

/** Average of approved reviews that have a star rating. */
export async function ratingSummary() {
  const r = await (await db()).find({
    collection: 'testimonials',
    where: { and: [{ status: { equals: 'approved' } }, { rating: { exists: true } }] },
    limit: 2000,
    depth: 0,
    pagination: false,
    select: { rating: true },
  })
  const vals = r.docs.map((d) => Number(d.rating)).filter((n) => n >= 1)
  const total = await (await db()).count({ collection: 'testimonials', where: { status: { equals: 'approved' } } })
  return { avg: vals.length ? Math.round((vals.reduce((a, b) => a + b, 0) / vals.length) * 10) / 10 : null, rated: vals.length, total: total.totalDocs }
}
