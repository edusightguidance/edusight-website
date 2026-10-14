import { getSettings, waLink } from '@/lib/data'
import { Hl, Icon } from '@/components/site/Icon'
import { ContactForm } from './ContactForm'

export const metadata = { title: 'Contact', description: 'Book a consultation with Bhavana Sood, EDUSIGHT — career and university guidance in Dubai.' }

export default async function Contact({ searchParams }: { searchParams: Promise<{ topic?: string }> }) {
  const s = await getSettings()
  const { topic } = await searchParams
  return (
    <section className="section" style={{ paddingTop: 56 }}>
      <div className="wrap split" style={{ alignItems: 'start' }}>
        <div>
          <p className="eyebrow">Contact</p>
          <h1 style={{ fontSize: 'clamp(2.4rem,5vw,4rem)' }}>Let’s <Hl>talk</Hl>.</h1>
          <p className="lead">Tell us a little about the student and what’s on your mind. We usually reply within one working day.</p>
          <div className="grid" style={{ gap: 12, marginTop: 28 }}>
            <a className="item" href={waLink(s.whatsapp)} style={{ textDecoration: 'none' }}>
              <span className="ico t-lagoon" style={{ margin: 0 }}><Icon name="users" /></span>
              <span className="grow"><b>WhatsApp</b><br /><span className="muted">{s.phone}</span></span>
            </a>
            <a className="item" href={`mailto:${s.email}`} style={{ textDecoration: 'none' }}>
              <span className="ico t-coral" style={{ margin: 0 }}><Icon name="book" /></span>
              <span className="grow"><b>Email</b><br /><span className="muted">{s.email}</span></span>
            </a>
            <div className="item">
              <span className="ico t-marigold" style={{ margin: 0 }}><Icon name="globe" /></span>
              <span className="grow"><b>Where</b><br /><span className="muted">{s.address} · in person and online worldwide</span></span>
            </div>
          </div>
        </div>
        <div className="auth-card"><ContactForm topic={topic} /></div>
      </div>
    </section>
  )
}
