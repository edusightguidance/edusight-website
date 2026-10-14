import Link from 'next/link'
import { OUTLOOK, STREAMS } from '@/lib/careers'

type C = { id: number; slug?: string | null; title: string; stream: string; riasec?: string[] | null; summary: string; outlook?: string | null }

export function CareerCard({ c, match }: { c: C; match?: number }) {
  return (
    <Link href={`/careers/${c.slug}`} className="career">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 8 }}>
        <div className="codes">{(c.riasec || []).map((k) => <span key={k} className={`code code-${k}`}>{k}</span>)}</div>
        {match !== undefined ? <span className="badge mint">{match}% match</span> : <span style={{ fontSize: '0.8rem' }}>{OUTLOOK[c.outlook || 'growing']}</span>}
      </div>
      <h3 style={{ fontSize: '1.15rem', margin: '6px 0 0' }}>{c.title}</h3>
      <span className="muted" style={{ fontSize: '0.8rem', fontWeight: 600 }}>{STREAMS[c.stream]}</span>
      <p className="muted" style={{ margin: 0, fontSize: '0.95rem' }}>{c.summary}</p>
    </Link>
  )
}
