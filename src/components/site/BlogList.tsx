import Link from 'next/link'
import { db } from '@/lib/data'
import { findPosts } from '@/lib/blog'
import { PostCard } from './PostCard'

type Props = { title: React.ReactNode; lead?: string | null; base: string; page: number; q?: string; categoryId?: number; tagId?: number; activeCat?: string; showFeatured?: boolean }

export async function BlogList({ title, lead, base, page, q, categoryId, tagId, activeCat, showFeatured }: Props) {
  const payload = await db()
  const [res, cats] = await Promise.all([
    findPosts({ page, q, categoryId, tagId }),
    payload.find({ collection: 'categories', limit: 50, sort: 'order', depth: 0 }),
  ])
  let docs = res.docs
  const lead1 = showFeatured && page === 1 && !q ? docs.find((d) => d.featured) || docs[0] : null
  if (lead1) docs = docs.filter((d) => d.id !== lead1.id)
  const qs = (n: number) => `${base}?${new URLSearchParams({ ...(q ? { q } : {}), page: String(n) })}`
  return (
    <>
      <section className="page-hero" style={{ paddingBottom: 28 }}>
        <div className="wrap">
          <p className="eyebrow">EDUSIGHT blog</p>
          <h1>{title}</h1>
          {lead && <p className="lead">{lead}</p>}
          <form action={base} className="blog-search" role="search">
            <input name="q" defaultValue={q} placeholder="Search articles…" aria-label="Search articles" />
            <button className="btn btn-dark btn-sm">Search</button>
          </form>
          <div className="chips" style={{ marginTop: 18 }}>
            <Link href="/blog" className={`chip${!activeCat && base === '/blog' ? ' on' : ''}`}>All</Link>
            {cats.docs.map((c) => (
              <Link key={c.id} href={`/blog/category/${c.slug}`} className={`chip${activeCat === c.slug ? ' on' : ''}`}>{c.title}</Link>
            ))}
          </div>
        </div>
      </section>
      <section className="section" style={{ paddingTop: 0 }}>
        <div className="wrap">
          {q && <p className="muted">{res.totalDocs} result{res.totalDocs === 1 ? '' : 's'} for “{q}”. <Link href={base}>Clear</Link></p>}
          {lead1 && <div style={{ marginBottom: 26 }}><PostCard p={lead1} big /></div>}
          <div className="grid g3">{docs.map((p) => <PostCard key={p.id} p={p} />)}</div>
          {!res.totalDocs && <p className="muted">No articles here yet.</p>}
          {res.totalPages > 1 && (
            <nav className="pager" aria-label="Pages">
              {res.hasPrevPage ? <Link className="btn btn-ghost btn-sm" href={qs(page - 1)}>← Newer</Link> : <span />}
              <span className="muted">Page {page} of {res.totalPages}</span>
              {res.hasNextPage ? <Link className="btn btn-ghost btn-sm" href={qs(page + 1)}>Older →</Link> : <span />}
            </nav>
          )}
        </div>
      </section>
    </>
  )
}
