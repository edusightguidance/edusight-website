import Link from 'next/link'
import { db } from '@/lib/data'
import { Hl, Icon, TINTS } from '@/components/site/Icon'
import { PageHero } from '@/components/site/PageHero'

export const revalidate = 60
export const metadata = { title: 'Services', description: 'Subject selection, career guidance, university admissions, curriculum advice, parent mentoring and well-being support in Dubai.' }

export default async function Services() {
  const payload = await db()
  const all = await payload.find({ collection: 'services', limit: 50, sort: 'order' })
  const services = all.docs.filter((d) => d.kind === 'service')
  return (
    <>
      <PageHero eyebrow="Services" title={<>Guidance for every <Hl>turning point</Hl></>} lead="For students from Grade 8 to graduate level, for parents, and for schools. Every engagement starts with understanding the student — then we plan." />
      <section className="section" style={{ paddingTop: 0 }}>
        <div className="wrap grid g3">
          {services.map((s, i) => (
            <Link key={s.id} href={`/services/${s.slug}`} className="card">
              <span className={`ico ${TINTS[i % 4]}`}><Icon name={s.icon || 'compass'} /></span>
              <h3>{s.title}</h3>
              <p>{s.summary}</p>
              <span className="more">Explore →</span>
            </Link>
          ))}
        </div>
      </section>
    </>
  )
}
