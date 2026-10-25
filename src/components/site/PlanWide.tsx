import { noName } from '@/lib/data'
import type { ReactNode } from 'react'
import type { Product } from '@/payload-types'
import { Icon } from '@/components/site/Icon'

/** A single plan shown full width (used when only one plan is published). */
export function PlanWide({ p, action, summary }: { p: Product; action: ReactNode; summary?: string | null }) {
  return (
    <div className={`price-card price-wide${p.featured ? ' featured' : ''}`} id={p.slug || undefined}>
      <div className="pw-main">
        <span className="ico t-lagoon"><Icon name="compass" /></span>
        <h3>{p.title}</h3>
        <p className="muted" style={{ margin: 0 }}>{summary ?? p.summary}</p>
        <div className="price" style={{ margin: '14px 0 6px' }}>{p.price} <small>AED</small>{p.compareAt ? <s>{p.compareAt}</s> : null}</div>
        <p className="muted" style={{ margin: '0 0 18px', fontSize: '0.9rem' }}>One-time payment · Secure card checkout via Stripe · Tests unlock instantly</p>
        <div>{action}</div>
      </div>
      <div className="pw-side">
        <p className="eyebrow" style={{ marginBottom: 6 }}>What’s included</p>
        <ul className="ticks">{(p.features || []).map((f) => <li key={f.id}>{noName(f.text)}</li>)}</ul>
        <div className="pw-facts">
          <div><b>At home</b><span>Take it online, at your own pace</span></div>
          <div><b>Reviewed</b><span>By a counselling psychologist</span></div>
          <div><b>PDF report</b><span>With personal recommendations</span></div>
        </div>
      </div>
    </div>
  )
}
