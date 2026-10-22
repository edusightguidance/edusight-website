import Link from 'next/link'
import { notFound, permanentRedirect } from 'next/navigation'
import { db, getSettings } from '@/lib/data'
import { Icon } from '@/components/site/Icon'
import { PageHero } from '@/components/site/PageHero'
import { Rich } from '@/components/site/Rich'
import { findReviews } from '@/lib/reviews'
import { ReviewCard } from '@/components/site/ReviewCard'

export const revalidate = 60

async function get(slug: string) {
  const r = await (await db()).find({ collection: 'services', where: { slug: { equals: slug } }, limit: 1 })
  return r.docs[0]
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const s = await get((await params).slug)
  return s ? { title: s.seo?.metaTitle || s.title, description: s.seo?.metaDescription || s.summary } : {}
}

export default async function Service({ params }: { params: Promise<{ slug: string }> }) {
  const s = await get((await params).slug)
  if (!s) notFound()
  // Specializations now live under Careers & Specialization Pathways
  if (s.kind === 'specialization') permanentRedirect(`/careers/${s.slug}`)
  const [settings, reviews] = await Promise.all([getSettings(), findReviews({ serviceId: s.id, limit: 3 })])
  return (
    <>
      <PageHero crumbs={[['/services', 'Services']]} eyebrow={s.tagline || 'Service'} title={s.title} lead={s.summary}>
        <div className="btns" style={{ marginTop: 26 }}>
          <a href={settings.bookingLink || '/contact'} className="btn btn-primary">Book a consultation</a>
          <Link href="/assessments" className="btn btn-ghost">Start with an assessment</Link>
        </div>
      </PageHero>
      <section className="section" style={{ paddingTop: 0 }}>
        <div className="wrap split" style={{ alignItems: 'start' }}>
          <div>
            <Rich data={s.body} />
            {(s.points || []).length > 0 && (
              <>
                <h2 style={{ fontSize: '1.8rem', marginTop: s.body ? 32 : 0 }}>What’s included</h2>
                <div className="grid" style={{ gap: 12 }}>
                  {s.points!.map((p) => (
                    <div key={p.id} className="item" style={{ alignItems: 'flex-start' }}>
                      <span className="ico t-lagoon" style={{ width: 40, height: 40, margin: 0, borderRadius: 12 }}><Icon name="check" size={20} /></span>
                      <div className="grow"><b>{p.title}</b>{p.text ? <p className="muted" style={{ margin: 0 }}>{p.text}</p> : null}</div>
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>
          <aside className="panel panel-ink" style={{ position: 'sticky', top: 100 }}>
            <h3 style={{ color: '#fff', fontSize: '1.6rem' }}>Talk it through with Bhavana</h3>
            <p>A first call is the quickest way to see where your child stands and what to do next.</p>
            {s.audience?.length ? <p style={{ fontSize: '0.9rem' }}>For: {s.audience.join(' · ')}</p> : null}
            <div className="btns">
              <a href={settings.bookingLink || '/contact'} className="btn btn-primary">Book a call</a>
              <Link href="/contact" className="btn btn-light">Send a message</Link>
            </div>
          </aside>
        </div>
      </section>
      {reviews.docs.length > 0 && (
        <section className="section" style={{ paddingTop: 0 }}>
          <div className="wrap">
            <h2 style={{ fontSize: '1.9rem' }}>What families say</h2>
            <div className="review-grid">{reviews.docs.map((r) => <ReviewCard key={r.id} r={r} />)}</div>
            <Link href={`/reviews?service=${s.id}`} className="more" style={{ display: 'inline-block', marginTop: 16, fontWeight: 700, color: 'var(--coral-d)' }}>More reviews →</Link>
          </div>
        </section>
      )}
    </>
  )
}
