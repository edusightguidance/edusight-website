import { notFound } from 'next/navigation'
import { db } from '@/lib/data'
import { BlogList } from '@/components/site/BlogList'

async function get(slug: string) {
  const r = await (await db()).find({ collection: 'categories', where: { slug: { equals: slug } }, limit: 1, depth: 0 })
  return r.docs[0]
}
export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const c = await get(decodeURIComponent((await params).slug).toLowerCase().replace(/\s+/g, "-"))
  return c ? { title: `${c.title} — EDUSIGHT blog` } : {}
}
export default async function P({ params, searchParams }: { params: Promise<{ slug: string }>; searchParams: Promise<{ page?: string; q?: string }> }) {
  const { slug } = await params
  const { page, q } = await searchParams
  const c = await get(decodeURIComponent(slug).toLowerCase().replace(/\s+/g, "-"))
  if (!c) notFound()
  return <BlogList title={c.title} lead={(c as { description?: string | null }).description} base={`/blog/category/${slug}`} page={Math.max(1, Number(page) || 1)} q={q} categoryId={c.id} activeCat={slug} />
}
