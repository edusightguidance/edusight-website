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
  const specs = all.docs.filter((d) => d.kind === 'specialization')
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
      <section className="section" style={{ paddingTop: 0 }} id="specializations">
        <div className="wrap">
          <div className="panel panel-lilac">
            <p className="eyebrow">Career specializations</p>
            <h2>Already know the field? Go deep.</h2>
            <p className="lead" style={{ marginBottom: 32 }}>Specialist guidance on entry routes, tests, countries and universities for the most-asked-about career families.</p>
            <div className="grid g4">
              {specs.map((s, i) => (
                <Link key={s.id} href={`/services/${s.slug}`} className="card">
                  <span className={`ico ${TINTS[(i + 2) % 4]}`}><Icon name={s.icon || 'compass'} /></span>
                  <h3 style={{ fontSize: '1.1rem' }}>{s.title}</h3>
                  <p style={{ fontSize: '0.94rem' }}>{s.tagline}</p>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
