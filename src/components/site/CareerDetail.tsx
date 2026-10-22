import Link from 'next/link'
import { getUser } from '@/lib/data'
import type { Career } from '@/payload-types'
import { CODE_NAMES, OUTLOOK, STREAMS, careerHref } from '@/lib/careers'
import { ShortlistButton } from '@/components/site/ShortlistButton'

export async function CareerDetail({ c }: { c: Career }) {
  const sp = c.specialization && typeof c.specialization === 'object' ? c.specialization : null
  const user = await getUser()
  const saved = ((user as { shortlist?: (number | { id: number })[] } | null)?.shortlist || []).map((x) => (typeof x === 'object' ? x.id : x))
  const rows: [string, string | null | undefined][] = [
    ['Stream', STREAMS[c.stream]],
    ['Interest types', (c.riasec || []).map((k) => CODE_NAMES[k]).join(', ')],
    ['What you actually do', c.dayToDay],
    ['Helpful school subjects', c.subjects],
    ['Study routes', c.routes],
    ['Entrance exams', c.entryTests],
    ['Key skills', c.skills],
    ['Outlook', OUTLOOK[c.outlook || 'growing']],
  ]
  return (
    <section className="section" style={{ paddingTop: 56 }}>
      <div className="narrow">
        <div className="crumbs"><Link href="/careers">Careers &amp; Specialization Pathways</Link> /{sp ? <> <Link href={`/careers/${sp.slug}`}>{sp.title}</Link> /</> : null}</div>
        <div className="codes" style={{ marginBottom: 14 }}>{(c.riasec || []).map((k) => <span key={k} className={`code code-${k}`}>{k}</span>)}</div>
        <h1 style={{ fontSize: 'clamp(2.2rem,5vw,3.6rem)' }}>{c.title}</h1>
        <p className="lead">{c.summary}</p>
        <div className="btns" style={{ margin: '18px 0 36px' }}>
          {user ? <ShortlistButton id={c.id} saved={saved.includes(c.id)} /> : <Link href={`/login?next=${careerHref(c)}`} className="btn btn-ghost">Log in to save</Link>}
          <Link href="/contact?topic=Career%20guidance" className="btn btn-primary">Discuss this career</Link>
        </div>
        <dl className="kv auth-card">
          {rows.filter(([, v]) => v).map(([k, v]) => [<dt key={k}>{k}</dt>, <dd key={k + 'v'}>{v}</dd>])}
        </dl>
      </div>
    </section>
  )
}
