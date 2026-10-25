import Link from 'next/link'
import { getAwards } from '@/lib/awards'
import { AwardsGrid } from '@/components/site/Awards'
import { Hl } from '@/components/site/Icon'

export const revalidate = 60
export const metadata = { title: 'Awards & recognition', description: 'Awards, recognition and speaking engagements of EDUSIGHT, Dubai.' }

const KINDS: [string, string][] = [['award', 'Awards'], ['speaking', 'Speaking'], ['recognition', 'Recognition']]

export default async function Awards({ searchParams }: { searchParams: Promise<{ kind?: string }> }) {
  const { kind } = await searchParams
  const items = await getAwards({ kind: KINDS.some(([k]) => k === kind) ? kind : undefined })
  return (
    <>
      <section className="page-hero">
        <div className="wrap">
          <div className="crumbs"><Link href="/about">About</Link> /</div>
          <p className="eyebrow">Awards & recognition</p>
          <h1>Recognised for <Hl>making a difference</Hl></h1>
          <p className="lead">Awards, recognition and speaking invitations for EDUSIGHT’s work in education, career guidance and student well-being.</p>
          <div className="chips" style={{ marginTop: 22 }}>
            <Link href="/awards" className={`chip${!kind ? ' on' : ''}`}>All</Link>
            {KINDS.map(([k, l]) => <Link key={k} href={`/awards?kind=${k}`} className={`chip${kind === k ? ' on' : ''}`}>{l}</Link>)}
          </div>
        </div>
      </section>
      <section className="section" style={{ paddingTop: 0 }}>
        <div className="wrap">
          {items.length ? <AwardsGrid items={items} /> : <p className="muted">Nothing here yet.</p>}
        </div>
      </section>
    </>
  )
}
