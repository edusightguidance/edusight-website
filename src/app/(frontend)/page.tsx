import Link from 'next/link'
import { PlanWide } from '@/components/site/PlanWide'
import { db, getSettings } from '@/lib/data'
import { Hl, Icon, TINTS } from '@/components/site/Icon'
import { QuickMatch } from '@/components/site/QuickMatch'
import { findPosts } from '@/lib/blog'
import { findReviews, ratingSummary } from '@/lib/reviews'
import { PostCard } from '@/components/site/PostCard'
import { ReviewCard, Stars } from '@/components/site/ReviewCard'
import { Carousel } from '@/components/site/Carousel'

export const revalidate = 60

const CURRICULA = ['IB', 'A-Levels', 'IGCSE', 'CBSE', 'American', 'British', 'BTEC', 'UCAS', 'Common App', 'Europe', 'Canada']

function HeroArt() {
  return (
    <div className="hero-art">
      <svg viewBox="0 0 460 480" width="100%" height="100%" aria-hidden="true">
        <circle cx="240" cy="250" r="210" fill="#EEEAFF" />
        <circle cx="240" cy="250" r="150" fill="#16163F" />
        <path d="M120 360 C 170 300, 150 250, 220 230 S 300 160, 330 120" stroke="#FFB627" strokeWidth="6" fill="none" strokeDasharray="2 14" strokeLinecap="round" />
        <circle cx="120" cy="360" r="14" fill="#FF6B4A" />
        <circle cx="222" cy="230" r="10" fill="#0FA3A3" />
        <path d="M330 120 V 64" stroke="#fff" strokeWidth="5" strokeLinecap="round" />
        <path d="M332 64 L 378 78 L 332 94 Z" fill="#FF6B4A" />
        <circle cx="330" cy="122" r="9" fill="#FFB627" />
        <g fill="#FFB627" opacity="0.9">
          <path d="M70 120 l6 14 14 6-14 6-6 14-6-14-14-6 14-6z" />
          <path d="M400 330 l4 10 10 4-10 4-4 10-4-10-10-4 10-4z" />
        </g>
      </svg>
      <div className="sticker" style={{ left: '-4%', top: '18%', transform: 'rotate(-4deg)' }}>
        <span className="code code-I">I</span><span className="code code-A" style={{ marginLeft: -6 }}>A</span><span className="code code-S" style={{ marginLeft: -6 }}>S</span>
        <span>Interest code<small>from your RIASEC test</small></span>
      </div>
      <div className="sticker" style={{ right: '-2%', top: '50%', transform: 'rotate(3deg)' }}>
        <span className="ico t-lagoon" style={{ width: 38, height: 38, margin: 0, borderRadius: 12 }}><Icon name="cap" size={20} /></span>
        <span>Offer received 🎉<small>Medicine · Europe</small></span>
      </div>
      <div className="sticker" style={{ left: '8%', bottom: '4%', transform: 'rotate(-2deg)' }}>
        <span className="ico t-coral" style={{ width: 38, height: 38, margin: 0, borderRadius: 12 }}><Icon name="heart" size={20} /></span>
        <span>1:1 with Bhavana<small>Counselling psychologist</small></span>
      </div>
    </div>
  )
}

export default async function Home() {
  const payload = await db()
  const [home, s, services, specs, products, featured, posts, sum] = await Promise.all([
    payload.findGlobal({ slug: 'homepage' }),
    getSettings(),
    payload.find({ collection: 'services', where: { kind: { equals: 'service' } }, limit: 6, sort: 'order' }),
    payload.find({ collection: 'services', where: { kind: { equals: 'specialization' } }, limit: 8, sort: 'order' }),
    payload.find({ collection: 'products', where: { published: { equals: true } }, limit: 3, sort: 'order' }),
    findReviews({ featured: true, limit: 12 }),
    findPosts({ limit: 3 }),
    ratingSummary(),
  ])
  const quotes = featured.docs.length ? featured : await findReviews({ limit: 12 })
  const booking = s.bookingLink || '/contact'
  const stats = home.stats?.length ? home.stats : []
  return (
    <>
      <section className="hero">
        <div className="wrap hero-grid">
          <div>
            <p className="eyebrow">{home.eyebrow}</p>
            <h1>
              {home.heading} <Hl>{home.highlight}</Hl>
            </h1>
            <p className="lead">{home.subheading}</p>
            <div className="btns">
              <Link href="/assessments" className="btn btn-primary">Take the career assessment <Icon name="arrow" size={18} /></Link>
              <a href={booking} className="btn btn-ghost">Book a free call</a>
            </div>
            <div className="trust">
              <span className="dots">
                {['#FF6B4A', '#0FA3A3', '#FFB627', '#7C6CF0'].map((c, i) => (
                  <span key={c} style={{ background: c }}>{'PSTE'[i]}</span>
                ))}
              </span>
              <span><b>Parents, students, teachers & educators</b><br />trust EDUSIGHT across the UAE</span>
            </div>
          </div>
          <HeroArt />
        </div>
      </section>

      <div className="marquee" aria-hidden="true">
        <div className="marquee-track">
          {[0, 1].map((n) => (
            <span key={n}>{CURRICULA.map((c) => <span key={c + n}>{c}</span>)}</span>
          ))}
        </div>
      </div>

      {stats.length > 0 && (
        <section className="section tight">
          <div className="wrap stats">
            {stats.map((st) => (
              <div className="stat" key={st.id}><b>{st.value}</b><span>{st.label}</span></div>
            ))}
          </div>
        </section>
      )}

      <section className="section" style={{ paddingTop: stats.length ? 40 : undefined }}>
        <div className="wrap">
          <div className="center" style={{ marginBottom: 48 }}>
            <p className="eyebrow">How we help</p>
            <h2>Every big decision, <Hl color="#0FA3A3">one plan</Hl></h2>
            <p className="lead">From choosing subjects in Grade 9 to pressing “submit” on a university application — and the conversations at home in between.</p>
          </div>
          <div className="grid g3">
            {services.docs.map((sv, i) => (
              <Link href={`/services/${sv.slug}`} className="card" key={sv.id}>
                <span className={`ico ${TINTS[i % 4]}`}><Icon name={sv.icon || 'compass'} /></span>
                <h3>{sv.title}</h3>
                <p>{sv.summary}</p>
                <span className="more">Learn more →</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="section" style={{ paddingTop: 0 }}>
        <div className="wrap">
          <div className="panel panel-ink">
            <p className="eyebrow" style={{ color: '#FFB627' }}>{home.methodTitle}</p>
            <h2 style={{ maxWidth: 720 }}>Clarity. Confidence. Direction.</h2>
            <p style={{ maxWidth: 620, marginBottom: 36 }}>A psychologist-led process that looks at the whole child — strengths, interests, values and wellbeing — before talking about universities.</p>
            <div className="steps">
              {(home.method || []).map((m) => (
                <div className="step" key={m.id}><h3>{m.title}</h3><p>{m.text}</p></div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {products.docs.length > 0 && (
        <section className="section" style={{ paddingTop: 0 }}>
          <div className="wrap">
            <div className="split" style={{ marginBottom: 40 }}>
              <div>
                <p className="eyebrow">Online assessments</p>
                <h2>Know yourself first. <Hl>Then</Hl> choose.</h2>
              </div>
              <p className="lead">Take scientifically grounded tests online, at your own pace. Every report is personally reviewed by Bhavana before it reaches you — no robot verdicts.</p>
            </div>
            {products.docs.length === 1 ? (
              <PlanWide p={products.docs[0]} summary={products.docs[0].tagline || products.docs[0].summary} action={<Link href={`/assessments#${products.docs[0].slug}`} className="btn btn-primary">Take the Test</Link>} />
            ) : (
            <div className={`grid ${products.docs.length === 2 ? 'g2' : 'g3'}`}>
              {products.docs.map((p) => (
                <div className={`price-card${p.featured ? ' featured' : ''}`} key={p.id}>
                  {p.featured && <span className="badge">Most popular</span>}
                  <h3>{p.title}</h3>
                  <p className="muted" style={{ margin: 0 }}>{p.tagline}</p>
                  <div className="price">{p.price} <small>AED</small>{p.compareAt ? <s>{p.compareAt}</s> : null}</div>
                  <ul className="ticks">{(p.features || []).slice(0, 4).map((f) => <li key={f.id}>{f.text}</li>)}</ul>
                  <Link href={`/assessments#${p.slug}`} className={`btn ${p.featured ? 'btn-primary' : 'btn-ghost'}`} style={{ marginTop: 'auto' }}>Choose</Link>
                </div>
              ))}
            </div>
            )}
          </div>
        </section>
      )}

      <section className="section" style={{ paddingTop: 0 }}>
        <div className="wrap">
          <div className="panel panel-butter split">
            <div>
              <p className="eyebrow">Try it now · free</p>
              <h2>What kind of work lights you up?</h2>
              <p className="muted">A quick taste of the RIASEC interest model used by career counsellors worldwide. No sign-up needed.</p>
            </div>
            <div className="auth-card" style={{ boxShadow: 'none' }}><QuickMatch compact /></div>
          </div>
        </div>
      </section>

      {specs.docs.length > 0 && (
        <section className="section" style={{ paddingTop: 0 }}>
          <div className="wrap">
            <div className="center" style={{ marginBottom: 40 }}>
              <p className="eyebrow">Career specializations</p>
              <h2>Deep guidance for the paths students ask about most</h2>
            </div>
            <div className="grid g4">
              {specs.docs.map((sp, i) => (
                <Link href={`/careers/${sp.slug}`} className="card" key={sp.id}>
                  <span className={`ico ${TINTS[(i + 1) % 4]}`}><Icon name={sp.icon || 'compass'} /></span>
                  <h3 style={{ fontSize: '1.15rem' }}>{sp.title}</h3>
                  <p style={{ fontSize: '0.95rem' }}>{sp.tagline}</p>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {quotes.docs.length > 0 && (
        <section className="section" style={{ paddingTop: 0 }}>
          <div className="wrap">
            <div className="split" style={{ marginBottom: 28, alignItems: 'end' }}>
              <div>
                <p className="eyebrow">Families say</p>
                <h2 style={{ margin: 0 }}>Less panic. More <Hl color="#FF6B4A">plan</Hl>.</h2>
              </div>
              <div style={{ textAlign: 'right' }}>
                {sum.avg && <div className="rating-inline"><b>{sum.avg.toFixed(1)}</b> <Stars n={sum.avg} size={20} /> <span className="muted">from {sum.rated} reviews</span></div>}
                <Link href="/reviews" className="more" style={{ fontWeight: 700, color: 'var(--coral-d)' }}>All reviews →</Link>
              </div>
            </div>
            <Carousel label="Client reviews">{quotes.docs.map((r) => <ReviewCard key={r.id} r={r} />)}</Carousel>
          </div>
        </section>
      )}

      {posts.docs.length > 0 && (
        <section className="section" style={{ paddingTop: 0 }}>
          <div className="wrap">
            <div className="split" style={{ marginBottom: 32 }}>
              <h2 style={{ margin: 0 }}>Straight answers, no jargon</h2>
              <p className="muted" style={{ margin: 0 }}>New articles every week for parents and students. <Link href="/blog">Visit the blog →</Link></p>
            </div>
            <div className="grid g3">{posts.docs.map((p) => <PostCard key={p.id} p={p} />)}</div>
          </div>
        </section>
      )}

      <section className="section" style={{ paddingTop: 0 }}>
        <div className="wrap">
          <div className="panel panel-lilac split">
            <div>
              <h2>{home.ctaTitle}</h2>
              <p className="lead">{home.ctaText}</p>
            </div>
            <div className="btns" style={{ justifyContent: 'flex-end' }}>
              <a href={booking} className="btn btn-primary">Book a free call</a>
              <Link href="/contact" className="btn btn-ghost">Send a message</Link>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
