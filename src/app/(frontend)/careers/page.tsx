import Link from 'next/link'
import { db } from '@/lib/data'
import { CODE_NAMES, fit } from '@/lib/careers'
import { Hl, Icon, TINTS } from '@/components/site/Icon'
import { CareerCard } from '@/components/site/CareerCard'
import { PageHero } from '@/components/site/PageHero'

export const revalidate = 60
export const metadata = { title: 'Careers & Specialization Pathways', description: 'Explore career specializations — medicine, engineering, computer science, business, law, psychology, design and more — and the careers within each.' }

export default async function Careers({ searchParams }: { searchParams: Promise<{ codes?: string }> }) {
  const { codes = '' } = await searchParams
  const code = codes.toUpperCase().replace(/[^RIASEC]/g, '').slice(0, 3)
  const payload = await db()
  const [specs, careers] = await Promise.all([
    payload.find({ collection: 'services', where: { kind: { equals: 'specialization' } }, limit: 50, sort: 'order' }),
    payload.find({ collection: 'careers', limit: 300, sort: 'title' }),
  ])
  const inSpec = (id: number) => careers.docs.filter((c) => (typeof c.specialization === 'object' ? c.specialization?.id : c.specialization) === id)
  // Career Explorer quick-match results (/careers?codes=ISA)
  const matched = code
    ? careers.docs.map((c) => ({ c, m: fit(code, c.riasec || []) })).filter((d) => d.m > 0).sort((a, b) => b.m - a.m)
    : []
  return (
    <>
      <PageHero eyebrow="Careers & Specialization Pathways" title={<>Find your field, then <Hl>go deep</Hl></>} lead="Specialist guidance on entry routes, tests, countries and universities for the most-asked-about career families — and the careers inside each one." />
      {code && (
        <section className="section" style={{ paddingTop: 0 }}>
          <div className="wrap">
            <div className="alert info" style={{ marginBottom: 20 }}>
              Careers matched to interest code <b>{code}</b> ({code.split('').map((k) => CODE_NAMES[k]).join(' · ')}). <Link href="/careers">Clear</Link>
            </div>
            <div className="grid g3">{matched.map(({ c, m }) => <CareerCard key={c.id} c={c} match={m} />)}</div>
            {!matched.length && <p className="muted">No matches yet. Browse the pathways below.</p>}
          </div>
        </section>
      )}
      <section className="section" style={{ paddingTop: 0 }}>
        <div className="wrap grid g3 paths">
          {specs.docs.map((s, i) => {
            const list = inSpec(s.id)
            return (
              <Link key={s.id} href={`/careers/${s.slug}`} className="card path-card">
                <span className={`ico ${TINTS[(i + 2) % 4]}`}><Icon name={s.icon || 'compass'} /></span>
                <h3>{s.title}</h3>
                {s.tagline && <p className="path-tag">{s.tagline}</p>}
                <p>{s.summary}</p>
                {list.length > 0 && (
                  <div className="path-chips">
                    {list.slice(0, 4).map((c) => <span key={c.id}>{c.title}</span>)}
                    {list.length > 4 && <span>+{list.length - 4} more</span>}
                  </div>
                )}
                <span className="more">{list.length ? `${list.length} career${list.length > 1 ? 's' : ''} · ` : ''}Explore →</span>
              </Link>
            )
          })}
        </div>
      </section>
    </>
  )
}
