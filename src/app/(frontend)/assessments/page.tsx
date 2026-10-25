import Link from 'next/link'
import { noName, db } from '@/lib/data'
import { BuyButton } from '@/components/site/Buy'
import { Hl, Icon, TINTS } from '@/components/site/Icon'
import { PageHero } from '@/components/site/PageHero'
import { PlanWide } from '@/components/site/PlanWide'

export const revalidate = 60
export const metadata = { title: 'Psychometric career assessments', description: 'Online OCEAN personality, RIASEC career interest and Work Values tests with a psychologist-reviewed PDF report. For students in Dubai, the UAE and worldwide.' }

export default async function Assessments({ searchParams }: { searchParams: Promise<{ cancelled?: string }> }) {
  const { cancelled } = await searchParams
  const payload = await db()
  const [products, tests] = await Promise.all([
    payload.find({ collection: 'products', where: { published: { equals: true } }, sort: 'order', depth: 0 }),
    payload.find({ collection: 'tests', overrideAccess: true, depth: 0 }),
  ])
  const steps = [
    ['Create your account', 'Students under 18 add a parent’s email — they approve with one click.'],
    ['Pay securely online', 'Card payments via Stripe in AED. Your tests unlock instantly.'],
    ['Take the tests at home', 'Around 8–12 minutes each. Progress saves as you go.'],
    ['Get a reviewed report', 'The EDUSIGHT team reviews your results, adds personal recommendations and emails the PDF.'],
  ]
  return (
    <>
      <PageHero eyebrow="Psychometric assessments" title={<>Know yourself <Hl>first</Hl>.</>} lead="Three research-based questionnaires used by career counsellors worldwide — personality, interests and values — with every report reviewed by a counselling psychologist, not just a computer." />
      {cancelled && <div className="wrap"><div className="alert info">Payment was cancelled — nothing was charged. You can try again any time.</div></div>}
      <section className="section tight">
        <div className="wrap grid g3">
          {tests.docs.map((t, i) => (
            <div className="card" key={t.id}>
              <span className={`ico ${TINTS[i % 4]}`}><Icon name={['brain', 'compass', 'heart'][i % 3]} /></span>
              <h3>{t.name}</h3>
              <p>{t.intro}</p>
              <p style={{ fontSize: '0.88rem', marginTop: 8 }}><b>{t.questions?.length} questions · ~{t.minutes} min</b> · measures {(t.dimensions || []).map((d) => d.label).join(', ')}</p>
            </div>
          ))}
        </div>
      </section>
      <section className="section" style={{ paddingTop: 24 }} id="plans">
        <div className="wrap">
          <h2 className="center">Take the Test</h2>
          {products.docs.length === 1 ? (
            <div style={{ marginTop: 32 }}>
              <PlanWide p={products.docs[0]} action={<BuyButton product={products.docs[0].slug} label={`Get ${products.docs[0].title.split('·')[0].trim()}`} className="btn btn-primary" />} />
            </div>
          ) : (
            <div className={`grid ${products.docs.length === 2 ? 'g2' : 'g3'}`} style={{ marginTop: 32 }}>
              {products.docs.map((p) => (
                <div className={`price-card${p.featured ? ' featured' : ''}`} key={p.id} id={p.slug}>
                  {p.featured && <span className="badge">Most popular</span>}
                  <h3>{p.title}</h3>
                  <p className="muted" style={{ margin: 0 }}>{p.summary}</p>
                  <div className="price">{p.price} <small>AED</small>{p.compareAt ? <s>{p.compareAt}</s> : null}</div>
                  <ul className="ticks">{(p.features || []).map((f) => <li key={f.id}>{noName(f.text)}</li>)}</ul>
                  <div style={{ marginTop: 'auto' }}><BuyButton product={p.slug} label={`Get ${p.title.split('·')[0].trim()}`} className={`btn ${p.featured ? 'btn-primary' : 'btn-dark'}`} /></div>
                </div>
              ))}
            </div>
          )}
          <p className="center muted" style={{ marginTop: 20, fontSize: '0.92rem' }}>Schools: ask about group access for whole year groups. <Link href="/contact?topic=School%20workshop%20or%20talk">Contact us</Link></p>
        </div>
      </section>
      <section className="section" style={{ paddingTop: 0 }}>
        <div className="wrap">
          <div className="panel panel-ink">
            <h2>How it works</h2>
            <div className="steps" style={{ gridTemplateColumns: 'repeat(auto-fit,minmax(220px,1fr))', marginTop: 28 }}>
              {steps.map(([t, d]) => <div className="step" key={t}><h3>{t}</h3><p>{d}</p></div>)}
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
