import Link from 'next/link'
import { db } from '@/lib/data'
import { BookCover } from '@/components/site/BookCover'
import { Hl } from '@/components/site/Icon'
import { PageHero } from '@/components/site/PageHero'

export const revalidate = 60
export const metadata = { title: 'Books & guides', description: 'Career and education guidebooks by the EDUSIGHT team for students and parents: curricula, healthcare careers, psychology, profile building and university prep.' }

export default async function Books() {
  const books = await (await db()).find({ collection: 'books', sort: 'order', limit: 50 })
  return (
    <>
      <PageHero eyebrow="Books & guides" title={<>Answers you can <Hl>keep</Hl>.</>} lead="In-depth guides written by the EDUSIGHT team from years of questions asked by real families." />
      <section className="section" style={{ paddingTop: 0 }}>
        <div className="wrap grid g4">
          {books.docs.map((b) => (
            <Link key={b.id} href={`/books/${b.slug}`} style={{ textDecoration: 'none', display: 'flex', flexDirection: 'column', gap: 10 }}>
              <BookCover b={b} />
              <h3 style={{ fontSize: '1.1rem', margin: '8px 0 0' }}>{b.title}</h3>
              <span className="muted" style={{ fontSize: '0.92rem' }}>{b.comingSoon ? 'Coming soon' : `AED ${b.price}`} · {b.format === 'print' ? 'Printed' : b.format === 'both' ? 'eBook + print' : 'eBook'}</span>
            </Link>
          ))}
        </div>
      </section>
    </>
  )
}
