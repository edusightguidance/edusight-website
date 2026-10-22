import { notFound, permanentRedirect } from 'next/navigation'
import { db } from '@/lib/data'
import { careerHref } from '@/lib/careers'
import { CareerDetail } from '@/components/site/CareerDetail'

export const revalidate = 60

async function get(slug: string) {
  return (await (await db()).find({ collection: 'careers', where: { slug: { equals: slug } }, limit: 1 })).docs[0]
}

export async function generateMetadata({ params }: { params: Promise<{ career: string }> }) {
  const c = await get((await params).career)
  return c ? { title: `${c.title} — career guide`, description: c.summary } : {}
}

export default async function NestedCareer({ params }: { params: Promise<{ slug: string; career: string }> }) {
  const { slug, career } = await params
  const c = await get(career)
  if (!c) notFound()
  // Career moved to another specialization (or none) → send to its current address
  const href = careerHref(c)
  if (href !== `/careers/${slug}/${career}`) permanentRedirect(href)
  return <CareerDetail c={c} />
}
