import Link from 'next/link'
import { db, getSettings, getUser } from '@/lib/data'
import { findReviews, ratingSummary } from '@/lib/reviews'
import { ReviewCard, Stars } from '@/components/site/ReviewCard'
import { ReviewForm } from '@/components/site/ReviewForm'
import { SOURCE_LABEL, SocialIcon } from '@/components/site/Social'
import { Hl } from '@/components/site/Icon'
import { SelectNav } from '@/components/site/SelectNav'

export const metadata = { title: 'Reviews', description: 'What parents, students and schools say about EDUSIGHT career and university guidance in Dubai.' }

export default async function Reviews({ searchParams }: { searchParams: Promise<{ source?: string; service?: string; page?: string }> }) {
  const { source, service, page } = await searchParams
  const payload = await db()
  const n = Math.max(1, Number(page) || 1)
  const [res, sum, services, s, user] = await Promise.all([
    findReviews({ source, serviceId: Number(service) || undefined, page: n }),
    ratingSummary(),
    payload.find({ collection: 'services', limit: 50, sort: 'order', depth: 0, select: { title: true } }),
    getSettings(),
    getUser(),
  ])
  const href = (o: Record<string, string | undefined>) => {
    const u = new URLSearchParams()
    Object.entries({ source, service, ...o }).forEach(([k, v]) => v && u.set(k, v))
    return `/reviews${u.size ? `?${u}` : ''}`
  }
  return (
    <>
      <section className="page-hero">
        <div className="wrap split">
          <div>
            <p className="eyebrow">Reviews</p>
            <h1>Families in their <Hl>own words</Hl></h1>
            <p className="lead">Reviews from parents, students and schools — on our website, Google, LinkedIn, Facebook and Instagram.</p>
          </div>
          <div className="rating-box">
            {sum.avg ? (<><b>{sum.avg.toFixed(1)}</b><Stars n={sum.avg} size={26} /><span className="muted">from {sum.rated} rated review{sum.rated === 1 ? '' : 's'}</span></>) : <span className="muted">Be the first to leave a review.</span>}
            <div className="btns" style={{ justifyContent: 'center', marginTop: 14 }}>
              <a href="#write" className="btn btn-primary btn-sm">Leave a review</a>
              {s.googleReviewLink && <a href={s.googleReviewLink} target="_blank" rel="noreferrer" className="btn btn-ghost btn-sm"><SocialIcon name="google" size={16} /> Review us on Google</a>}
            </div>
          </div>
        </div>
      </section>
      <section className="section" style={{ paddingTop: 0 }}>
        <div className="wrap">
          <div className="chips" style={{ marginBottom: 12 }}>
            <Link className={`chip${!source ? ' on' : ''}`} href={href({ source: undefined, page: undefined })}>All sources</Link>
            {Object.keys(SOURCE_LABEL).filter((k) => k !== 'other').map((k) => (
              <Link key={k} className={`chip${source === k ? ' on' : ''}`} href={href({ source: k, page: undefined })}><SocialIcon name={k} size={14} /> {k === 'website' ? 'Website' : SOURCE_LABEL[k]}</Link>
            ))}
          </div>
          <div style={{ marginBottom: 28 }}>
            <SelectNav
              label="Filter by service"
              value={service || ''}
              options={[{ value: '', label: 'All services', href: href({ service: undefined, page: undefined }) }, ...services.docs.map((sv) => ({ value: String(sv.id), label: sv.title, href: href({ service: String(sv.id), page: undefined }) }))]}
            />
          </div>
          <div className="review-grid">{res.docs.map((r) => <ReviewCard key={r.id} r={r} />)}</div>
          {!res.totalDocs && <p className="muted">No reviews here yet.</p>}
          {res.totalPages > 1 && (
            <nav className="pager">
              {res.hasPrevPage ? <Link className="btn btn-ghost btn-sm" href={href({ page: String(n - 1) })}>← Previous</Link> : <span />}
              <span className="muted">Page {n} of {res.totalPages}</span>
              {res.hasNextPage ? <Link className="btn btn-ghost btn-sm" href={href({ page: String(n + 1) })}>Next →</Link> : <span />}
            </nav>
          )}
          <div id="write" className="split" style={{ marginTop: 64, alignItems: 'start' }}>
            <div>
              <h2>Worked with EDUSIGHT?</h2>
              <p className="lead">Your experience helps other families make confident choices. Every review is read by the EDUSIGHT team before it appears.</p>
              {user && <p className="muted">You’re logged in — clients get a <b>✓ Verified client</b> badge.</p>}
            </div>
            <div className="auth-card"><ReviewForm services={services.docs.map((x) => ({ id: x.id, title: x.title }))} defaultName={user?.name || ''} defaultEmail={user?.email || ''} /></div>
          </div>
        </div>
      </section>
    </>
  )
}
