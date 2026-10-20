import { SOURCE_LABEL, SocialIcon } from './Social'

export type ReviewDoc = {
  id: number; quote: string; name: string; detail?: string | null; rating?: number | null; source?: string | null
  sourceUrl?: string | null; date?: string | null; verified?: boolean | null; service?: unknown
}

export function Stars({ n, size = 16 }: { n: number; size?: number }) {
  return (
    <span className="stars" aria-label={`${n} out of 5 stars`} style={{ fontSize: size }}>
      {[1, 2, 3, 4, 5].map((i) => <span key={i} className={i <= Math.round(n) ? 'on' : ''}>★</span>)}
    </span>
  )
}

export function ReviewCard({ r }: { r: ReviewDoc }) {
  const src = r.source || 'website'
  const svc = r.service && typeof r.service === 'object' ? (r.service as { title?: string }).title : null
  const initials = r.name.split(/\s+/).map((w) => w[0]).slice(0, 2).join('').toUpperCase()
  return (
    <figure className="review">
      <div className="review-top">
        {r.rating ? <Stars n={r.rating} /> : <span />}
        <span className={`src src-${src}`} title={`Review on ${SOURCE_LABEL[src]}`}>
          <SocialIcon name={src} size={16} /> {SOURCE_LABEL[src]}
        </span>
      </div>
      <blockquote>{r.quote}</blockquote>
      <figcaption>
        <span className="avatar">{initials}</span>
        <span>
          <b>{r.name}</b>
          {r.verified && <span className="verified" title="Bought an EDUSIGHT service">✓ Verified client</span>}
          <small>{[r.detail, svc].filter(Boolean).join(' · ')}</small>
        </span>
      </figcaption>
      {r.sourceUrl && <a className="review-link" href={r.sourceUrl} target="_blank" rel="noreferrer">See original ↗</a>}
    </figure>
  )
}
