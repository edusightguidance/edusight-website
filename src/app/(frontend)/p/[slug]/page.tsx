import { notFound } from 'next/navigation'
import { db } from '@/lib/data'
import { Rich } from '@/components/site/Rich'

export const revalidate = 60
export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const p = (await (await db()).find({ collection: 'pages', where: { slug: { equals: slug } }, limit: 1 })).docs[0]
  if (!p) notFound()
  return (
    <section className="section" style={{ paddingTop: 56 }}>
      <div className="narrow">
        <h1 style={{ fontSize: 'clamp(2.2rem,5vw,3.4rem)' }}>{p.title}</h1>
        <Rich data={p.body} />
      </div>
    </section>
  )
}
