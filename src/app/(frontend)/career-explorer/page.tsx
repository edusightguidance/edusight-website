import { Hl } from '@/components/site/Icon'
import { PageHero } from '@/components/site/PageHero'
import { QuickMatch } from '@/components/site/QuickMatch'

export const metadata = { title: 'Career Explorer', description: 'Match your interests to careers, subjects, university routes and entrance exams. Start with a free 60-second snapshot.' }

export default async function Explorer() {
  const feats = [
    ['Matched to you', 'Careers ranked by fit with your RIASEC interest code — from the full test or the snapshot.'],
    ['Everything in one place', 'Helpful subjects, degrees and routes, entrance exams and outlook for every career.'],
    ['Your shortlist', 'Save careers to compare, share with parents and bring to your counselling session.'],
    ['Always growing', 'New careers and emerging fields are added by EDUSIGHT throughout the year.'],
  ]
  return (
    <>
      <PageHero eyebrow="Career Explorer" title={<>From interests to <Hl>real careers</Hl>.</>} lead="Discover which careers fit how you like to work — then see exactly what it takes to get there." />
      <section className="section" style={{ paddingTop: 0 }}>
        <div className="wrap split" style={{ alignItems: 'start' }}>
          <div className="auth-card"><QuickMatch /></div>
          <div className="grid" style={{ gap: 14 }}>
            {feats.map(([t, d]) => (
              <div className="item" key={t} style={{ alignItems: 'flex-start' }}><div className="grow"><b>{t}</b><p className="muted" style={{ margin: 0 }}>{d}</p></div></div>
            ))}
          </div>
        </div>
      </section>
    </>
  )
}
