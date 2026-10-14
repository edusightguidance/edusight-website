import Link from 'next/link'
import { db } from '@/lib/data'
import { PageHero } from '@/components/site/PageHero'

export const revalidate = 60
export const metadata = { title: 'Resources', description: 'Guides, myth-busters and parenting advice on careers, curricula and university admissions.' }
const CATS: Record<string, string> = { guide: 'Guides', myth: 'Myth busters', parenting: 'Parenting', event: 'Events & webinars', news: 'News' }

export default async function Resources({ searchParams }: { searchParams: Promise<{ c?: string }> }) {
  const { c } = await searchParams
  const posts = await (await db()).find({ collection: 'posts', limit: 60, where: c ? { category: { equals: c } } : {} })
  return (
    <>
      <PageHero eyebrow="Resources" title="Straight answers for parents and students" lead="Practical guides on subjects, careers, curricula and university applications." />
      <section className="section" style={{ paddingTop: 0 }}>
        <div className="wrap">
          <div className="chips" style={{ marginBottom: 28 }}>
            <Link href="/resources" className={`chip${!c ? ' on' : ''}`}>All</Link>
            {Object.entries(CATS).map(([k, v]) => <Link key={k} href={`/resources?c=${k}`} className={`chip${c === k ? ' on' : ''}`}>{v}</Link>)}
          </div>
          <div className="grid g3">
            {posts.docs.map((p) => (
              <Link href={`/resources/${p.slug}`} className="card" key={p.id}>
                <span className="badge soft" style={{ alignSelf: 'flex-start' }}>{CATS[p.category || 'guide']}</span>
                <h3 style={{ marginTop: 10 }}>{p.title}</h3>
                <p>{p.excerpt}</p>
                <span className="more">Read →</span>
              </Link>
            ))}
            {!posts.docs.length && <p className="muted">Nothing here yet — check back soon.</p>}
          </div>
        </div>
      </section>
    </>
  )
}
