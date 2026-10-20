import { db } from './data'
import type { AwardItem } from '@/components/site/Awards'

type Img = { url?: string | null; alt?: string | null }
const isImg = (x: unknown): x is Img => !!x && typeof x === 'object'

export async function getAwards(o: { kind?: string; limit?: number } = {}): Promise<AwardItem[]> {
  const r = await (await db()).find({
    collection: 'awards',
    where: o.kind ? { kind: { equals: o.kind } } : {},
    sort: 'order',
    limit: o.limit || 200,
    depth: 1,
  })
  return r.docs.map((a) => ({
    id: a.id,
    title: a.title,
    organisation: a.organisation,
    year: a.year,
    kind: a.kind,
    note: a.note,
    photos: ([a.image, ...(a.gallery || [])] as unknown[]).filter(isImg).map((m) => ({ url: m.url, alt: m.alt })),
  }))
}
