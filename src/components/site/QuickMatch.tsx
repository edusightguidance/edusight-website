'use client'
import Link from 'next/link'
import { useState } from 'react'

const ITEMS: [string, string][] = [
  ['Building or fixing things with my hands', 'R'],
  ['Working outdoors or with animals', 'R'],
  ['Doing experiments and figuring out how things work', 'I'],
  ['Solving maths or logic puzzles', 'I'],
  ['Drawing, designing, writing or making music', 'A'],
  ['Coming up with original ideas', 'A'],
  ['Helping friends solve their problems', 'S'],
  ['Teaching or explaining things to others', 'S'],
  ['Leading a team or a project', 'E'],
  ['Persuading people or selling an idea', 'E'],
  ['Organising files, notes or schedules', 'C'],
  ['Working carefully with numbers and details', 'C'],
]
const LABEL: Record<string, [string, string]> = {
  R: ['Realistic', 'The Maker — hands-on, practical, gets things done.'],
  I: ['Investigative', 'The Thinker — curious, analytical, loves the “why”.'],
  A: ['Artistic', 'The Creator — imaginative, expressive, original.'],
  S: ['Social', 'The Helper — caring, patient, great with people.'],
  E: ['Enterprising', 'The Persuader — bold, ambitious, a natural leader.'],
  C: ['Conventional', 'The Organiser — precise, reliable, loves a system.'],
}

export function QuickMatch({ compact = false }: { compact?: boolean }) {
  const [picked, setPicked] = useState<number[]>([])
  const [done, setDone] = useState(false)
  const toggle = (i: number) => setPicked((p) => (p.includes(i) ? p.filter((x) => x !== i) : [...p, i]))
  const tally: Record<string, number> = { R: 0, I: 0, A: 0, S: 0, E: 0, C: 0 }
  picked.forEach((i) => tally[ITEMS[i][1]]++)
  const top = Object.entries(tally).sort((a, b) => b[1] - a[1]).filter(([, v]) => v > 0).slice(0, 3).map(([k]) => k)

  if (done && top.length) {
    return (
      <div>
        <p className="eyebrow">Your interest code</p>
        <div style={{ display: 'flex', gap: 10, marginBottom: 18 }}>
          {top.map((k) => (
            <span key={k} className={`code code-${k}`} style={{ width: 54, height: 54, fontSize: 24, borderRadius: 16 }}>{k}</span>
          ))}
        </div>
        {top.map((k) => (
          <p key={k} style={{ margin: '0 0 8px' }}>
            <b>{LABEL[k][0]}:</b> <span className="muted">{LABEL[k][1]}</span>
          </p>
        ))}
        <div className="btns" style={{ marginTop: 20 }}>
          <Link className="btn btn-primary" href={`/careers?codes=${top.join('')}`}>See matching careers</Link>
          <Link className="btn btn-ghost" href="/assessments">Get the full assessment</Link>
        </div>
        <p className="muted" style={{ fontSize: '0.86rem', marginTop: 14 }}>
          A 60-second snapshot. The full 42-question RIASEC test, plus personality and work values, gives a reviewed report.
        </p>
        <button className="chip" onClick={() => { setDone(false); setPicked([]) }}>Start again</button>
      </div>
    )
  }
  return (
    <div>
      {!compact && <p className="eyebrow">60-second career snapshot</p>}
      <h3 style={{ fontSize: '1.5rem' }}>Tap everything you genuinely enjoy</h3>
      <div className="chips" style={{ margin: '16px 0 22px' }}>
        {ITEMS.map(([t], i) => (
          <button key={t} className={`chip${picked.includes(i) ? ' on' : ''}`} onClick={() => toggle(i)} aria-pressed={picked.includes(i)}>
            {t}
          </button>
        ))}
      </div>
      <button className="btn btn-dark" disabled={picked.length < 3} onClick={() => setDone(true)}>
        {picked.length < 3 ? `Pick at least 3 (${picked.length})` : 'Show my interest code →'}
      </button>
    </div>
  )
}
