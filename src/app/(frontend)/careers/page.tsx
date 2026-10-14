import Link from 'next/link'
import type { Where } from 'payload'
import { db } from '@/lib/data'
import { CODE_NAMES, STREAMS, fit } from '@/lib/careers'
import { CareerCard } from '@/components/site/CareerCard'
import { PageHero } from '@/components/site/PageHero'

export const metadata = { title: 'Career Library', description: 'Explore careers by stream and interest type: subjects needed, study routes, entrance exams and outlook.' }

type SP = { stream?: string; codes?: string; q?: string }

export default async function Careers({ searchParams }: { searchParams: Promise<SP> }) {
  const { stream, codes = '', q } = await searchParams
  const code = codes.toUpperCase().replace(/[^RIASEC]/g, '').slice(0, 3)
  const where: Where[] = []
  if (stream) where.push({ stream: { equals: stream } })
  if (q) where.push({ title: { like: q } })
  const res = await (await db()).find({ collection: 'careers', limit: 300, where: where.length ? { and: where } : {}, sort: 'title' })
  let docs = res.docs.map((c) => ({ c, m: code ? fit(code, c.riasec || []) : undefined }))
  if (code) docs = docs.filter((d) => (d.m || 0) > 0).sort((a, b) => (b.m || 0) - (a.m || 0))
  const href = (p: SP) => {
    const u = new URLSearchParams()
    const m = { stream, codes: code, q, ...p }
    Object.entries(m).forEach(([k, v]) => v && u.set(k, v))
    return `/careers${u.size ? `?${u}` : ''}`
  }
  return (
    <>
      <PageHero eyebrow="Career library" title="What could you become?" lead="Every career with the subjects that help, the routes in, the entrance tests and how fast the field is growing." />
      <section className="section" style={{ paddingTop: 0 }}>
        <div className="wrap">
          {code && (
            <div className="alert info" style={{ marginBottom: 20 }}>
              Showing careers matched to interest code <b>{code}</b> ({code.split('').map((k) => CODE_NAMES[k]).join(' · ')}). <Link href={href({ codes: undefined })}>Clear</Link>
            </div>
          )}
          <form action="/careers" className="row2" style={{ marginBottom: 16, gridTemplateColumns: '1fr auto' }}>
            {stream && <input type="hidden" name="stream" value={stream} />}
            {code && <input type="hidden" name="codes" value={code} />}
            <div className="field"><input name="q" defaultValue={q} placeholder="Search careers, e.g. engineer, law, design" aria-label="Search careers" /></div>
            <button className="btn btn-dark">Search</button>
          </form>
          <div className="chips" style={{ marginBottom: 28 }}>
            <Link className={`chip${!stream ? ' on' : ''}`} href={href({ stream: undefined })}>All streams</Link>
            {Object.entries(STREAMS).map(([k, v]) => <Link key={k} className={`chip${stream === k ? ' on' : ''}`} href={href({ stream: k })}>{v}</Link>)}
          </div>
          <div className="grid g3">
            {docs.map(({ c, m }) => <CareerCard key={c.id} c={c} match={m} />)}
          </div>
          {!docs.length && <p className="muted">No careers match yet. Try another search.</p>}
          <div className="panel panel-butter split" style={{ marginTop: 56 }}>
            <div><h2 style={{ fontSize: '2rem' }}>Not sure what your interest code is?</h2><p className="muted">Take the free 60-second snapshot, or the full reviewed assessment.</p></div>
            <div className="btns" style={{ justifyContent: 'flex-end' }}><Link href="/career-explorer" className="btn btn-dark">Free snapshot</Link><Link href="/assessments" className="btn btn-primary">Full assessment</Link></div>
          </div>
        </div>
      </section>
    </>
  )
}
