import Link from 'next/link'
import { redirect } from 'next/navigation'
import { db, getUser } from '@/lib/data'
import { entitlements } from '@/lib/commerce'
import { CODE_NAMES, fit } from '@/lib/careers'
import { ranked, type Scores } from '@/lib/scoring'
import { CareerCard } from '@/components/site/CareerCard'
import { QuickMatch } from '@/components/site/QuickMatch'

export const dynamic = 'force-dynamic'
export const metadata = { title: 'My Career Explorer', robots: { index: false } }

export default async function MyExplorer({ searchParams }: { searchParams: Promise<{ codes?: string }> }) {
  const user = await getUser()
  if (!user) redirect('/login?next=/portal/explorer')
  const payload = await db()
  const { explorer } = await entitlements(payload, user.id)
  if (!explorer) redirect('/career-explorer')
  const { codes } = await searchParams
  let code = (codes || '').toUpperCase().replace(/[^RIASEC]/g, '').slice(0, 3)
  let source = 'snapshot'
  if (!code) {
    const riasec = (await payload.find({ collection: 'tests', where: { code: { equals: 'RIASEC' } }, limit: 1, overrideAccess: true })).docs[0]
    const att = riasec
      ? (await payload.find({ collection: 'attempts', where: { and: [{ user: { equals: user.id } }, { test: { equals: riasec.id } }, { status: { in: ['submitted', 'approved', 'sent'] } }] }, limit: 1, overrideAccess: true, sort: '-submittedAt' })).docs[0]
      : null
    if (att?.scores) {
      code = ranked(att.scores as Scores).slice(0, 3).map(([k]) => k).join('')
      source = 'your RIASEC test'
    }
  }
  const careers = (await payload.find({ collection: 'careers', limit: 300 })).docs
  const shortIds = ((user.shortlist || []) as (number | { id: number })[]).map((x) => (typeof x === 'object' ? x.id : x))
  const shortlist = careers.filter((c) => shortIds.includes(c.id))
  const matched = code ? careers.map((c) => ({ c, m: fit(code, c.riasec || []) })).filter((x) => x.m > 0).sort((a, b) => b.m - a.m) : []
  return (
    <section className="section" style={{ paddingTop: 40 }}>
      <div className="wrap">
        <div className="crumbs"><Link href="/portal">My portal</Link> /</div>
        <h1 style={{ fontSize: 'clamp(2.2rem,5vw,3.4rem)' }}>My Career Explorer</h1>
        {code ? (
          <p className="lead">Matched to <b>{code}</b> ({code.split('').map((k) => CODE_NAMES[k]).join(' · ')}) from {source}. <Link href="/portal/explorer?codes=">Retake snapshot</Link></p>
        ) : (
          <div className="auth-card" style={{ margin: '20px 0 40px' }}><QuickMatch compact /></div>
        )}
        {shortlist.length > 0 && (
          <>
            <h2 style={{ fontSize: '1.7rem', marginTop: 28 }}>★ My shortlist</h2>
            <div className="grid g3">{shortlist.map((c) => <CareerCard key={c.id} c={c} match={code ? fit(code, c.riasec || []) : undefined} />)}</div>
          </>
        )}
        {matched.length > 0 && (
          <>
            <h2 style={{ fontSize: '1.7rem', marginTop: 40 }}>Best matches</h2>
            <div className="grid g3">{matched.map(({ c, m }) => <CareerCard key={c.id} c={c} match={m} />)}</div>
          </>
        )}
      </div>
    </section>
  )
}
