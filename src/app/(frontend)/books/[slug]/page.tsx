import Link from 'next/link'
import { notFound } from 'next/navigation'
import { db } from '@/lib/data'
import { BookCover } from '@/components/site/BookCover'
import { BuyButton } from '@/components/site/Buy'

export const revalidate = 60
async function get(slug: string) {
  return (await (await db()).find({ collection: 'books', where: { slug: { equals: slug } }, limit: 1 })).docs[0]
}
export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const b = await get((await params).slug)
  return b ? { title: b.title, description: b.description } : {}
}
export default async function Book({ params }: { params: Promise<{ slug: string }> }) {
  const b = await get((await params).slug)
  if (!b) notFound()
  return (
    <section className="section" style={{ paddingTop: 48 }}>
      <div className="wrap split book-split" style={{ alignItems: 'start' }}>
        <div style={{ maxWidth: 360 }}><BookCover b={b} /></div>
        <div>
          <div className="crumbs"><Link href="/books">Books</Link> /</div>
          <h1 style={{ fontSize: 'clamp(2.2rem,5vw,3.4rem)' }}>{b.title}</h1>
          {b.subtitle && <p className="lead" style={{ fontWeight: 600, color: 'var(--ink)' }}>{b.subtitle}</p>}
          <p className="lead">{b.description}</p>
          {b.audience && <p><span className="badge soft">For: {b.audience}</span></p>}
          <div className="price" style={{ margin: '20px 0' }}>{b.price} <small>AED</small></div>
          <div className="btns">
            {b.comingSoon ? (
              <Link className="btn btn-dark" href={`/contact?topic=Other`}>Notify me when it’s out</Link>
            ) : (
              <>
                {b.format !== 'print' && <BuyButton book={b.slug} label="Buy the eBook" />}
                {b.format !== 'ebook' && <BuyButton book={b.slug} label="Order printed copy" className="btn btn-ghost" needsAddress />}
              </>
            )}
            {b.externalLink && <a className="btn btn-ghost" href={b.externalLink} target="_blank" rel="noreferrer">Also on Amazon ↗</a>}
          </div>
          <p className="muted" style={{ fontSize: '0.88rem', marginTop: 16 }}>eBooks are PDFs you download from your portal straight after payment.</p>
        </div>
      </div>
    </section>
  )
}
