import Link from 'next/link'
import { db } from '@/lib/data'
import { Hl, Icon, TINTS } from '@/components/site/Icon'

export const revalidate = 60
export const metadata = { title: 'About Bhavana Sood', description: 'Counselling psychologist and career advisor with 12+ years of experience in curriculum pathways, career guidance and mental health counselling.' }

export default async function About() {
  const a = await (await db()).findGlobal({ slug: 'about', depth: 1 })
  const photo = a.photo && typeof a.photo === 'object' ? a.photo : null
  return (
    <>
      <section className="page-hero">
        <div className="wrap split">
          <div>
            <p className="eyebrow">About EDUSIGHT</p>
            <h1>{a.headline?.replace('Bhavana.', '')} <Hl>Bhavana.</Hl></h1>
            <p style={{ fontWeight: 700 }}>{a.role}</p>
            <p className="lead">{a.intro}</p>
            <div className="btns"><Link className="btn btn-primary" href="/contact">Work with me</Link></div>
          </div>
          <div style={{ position: 'relative', maxWidth: 440, justifySelf: 'center', width: '100%' }}>
            {photo?.url ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={photo.url} alt={photo.alt || 'Bhavana Sood'} style={{ borderRadius: 32, aspectRatio: '4/5', objectFit: 'cover', width: '100%' }} />
            ) : (
              <div style={{ aspectRatio: '4/5', borderRadius: 32, background: 'var(--ink)', display: 'grid', placeItems: 'center', color: '#fff', fontFamily: 'var(--display)', fontSize: '7rem', fontWeight: 800 }}>
                BS
              </div>
            )}
            <div className="sticker" style={{ left: -20, bottom: 30, transform: 'rotate(-3deg)' }}>🎓 12+ years<small>guiding families</small></div>
            <div className="sticker" style={{ right: -14, top: 30, transform: 'rotate(4deg)' }}>🧠 Psychologist<small>&amp; career advisor</small></div>
          </div>
        </div>
      </section>
      <section className="section" style={{ paddingTop: 0 }}>
        <div className="narrow prose">
          <h2>My story</h2>
          <p>{a.story}</p>
          <h2>How I work</h2>
          <p>{a.approach}</p>
        </div>
      </section>
      <section className="section" style={{ paddingTop: 0 }}>
        <div className="wrap">
          <h2 className="center">Areas of expertise</h2>
          <div className="grid g3" style={{ marginTop: 32 }}>
            {(a.expertise || []).map((e, i) => (
              <div className="card" key={e.id}>
                <span className={`ico ${TINTS[i % 4]}`}><Icon name={['school', 'compass', 'heart'][i % 3]} /></span>
                <h3>{e.title}</h3>
                <p>{e.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
      {(a.awards || []).length > 0 && (
        <section className="section" style={{ paddingTop: 0 }}>
          <div className="wrap">
            <div className="panel panel-ink">
              <p className="eyebrow" style={{ color: 'var(--marigold)' }}>Recognition</p>
              <h2>Awards & speaking</h2>
              <div className="grid g2" style={{ marginTop: 24, gap: 14 }}>
                {a.awards!.map((w) => (
                  <div key={w.id} style={{ display: 'flex', gap: 14, alignItems: 'baseline', borderBottom: '1px solid rgba(255,255,255,.14)', paddingBottom: 12 }}>
                    <b style={{ color: 'var(--marigold)', minWidth: 44 }}>{w.year || '★'}</b>
                    <span style={{ color: '#fff' }}>{w.title}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
      )}
    </>
  )
}
