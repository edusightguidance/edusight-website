import Link from 'next/link'
import { notFound } from 'next/navigation'
import { db } from '@/lib/data'
import { Rich } from '@/components/site/Rich'

export const revalidate = 60
async function get(slug: string) {
  return (await (await db()).find({ collection: 'posts', where: { slug: { equals: slug } }, limit: 1 })).docs[0]
}
export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const p = await get((await params).slug)
  return p ? { title: p.seo?.metaTitle || p.title, description: p.seo?.metaDescription || p.excerpt } : {}
}
export default async function Post({ params }: { params: Promise<{ slug: string }> }) {
  const p = await get((await params).slug)
  if (!p) notFound()
  const img = p.image && typeof p.image === 'object' ? p.image : null
  return (
    <article className="section" style={{ paddingTop: 56 }}>
      <div className="narrow">
        <div className="crumbs"><Link href="/resources">Resources</Link> /</div>
        <h1 style={{ fontSize: 'clamp(2.2rem,5vw,3.6rem)' }}>{p.title}</h1>
        <p className="lead">{p.excerpt}</p>
        <p className="muted" style={{ fontSize: '0.9rem' }}>By Bhavana Sood · {new Date(p.publishedAt || p.createdAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        {img?.url && <img src={img.url} alt={img.alt || ''} style={{ borderRadius: 24, margin: '24px 0' }} />}
        <Rich data={p.body} />
        <div className="panel panel-butter" style={{ marginTop: 48 }}>
          <h3>Want this applied to your child?</h3>
          <p className="muted">Book a call and we’ll look at their subjects, interests and options together.</p>
          <Link href="/contact" className="btn btn-primary">Book a call</Link>
        </div>
      </div>
    </article>
  )
}
