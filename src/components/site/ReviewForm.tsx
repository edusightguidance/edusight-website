'use client'
import { useState } from 'react'

export function ReviewForm({ services, defaultName = '', defaultEmail = '' }: { services: { id: number; title: string }[]; defaultName?: string; defaultEmail?: string }) {
  const [rating, setRating] = useState(5)
  const [who, setWho] = useState('Parent')
  const [state, setState] = useState<'idle' | 'sending' | 'done' | string>('idle')
  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setState('sending')
    const d = Object.fromEntries(new FormData(e.currentTarget))
    const r = await fetch('/x/review', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ ...d, rating, who }) })
    const j = await r.json().catch(() => ({}))
    setState(r.ok ? 'done' : j.error || 'Something went wrong. Please try again.')
  }
  if (state === 'done')
    return <div className="alert ok"><b>Thank you!</b> Your review has been sent to Bhavana and will appear once approved.</div>
  return (
    <form className="form" onSubmit={submit}>
      <h3>Leave a review</h3>
      <div className="field">
        <label>Your rating</label>
        <div className="star-input" role="radiogroup" aria-label="Rating">
          {[1, 2, 3, 4, 5].map((i) => (
            <button type="button" key={i} role="radio" aria-checked={rating === i} aria-label={`${i} star${i > 1 ? 's' : ''}`} className={i <= rating ? 'on' : ''} onClick={() => setRating(i)}>★</button>
          ))}
        </div>
      </div>
      <div className="field"><label htmlFor="rv-quote">Your review</label><textarea id="rv-quote" name="quote" rows={5} minLength={20} maxLength={1500} required placeholder="What was your experience with EDUSIGHT?" /></div>
      <div className="chips" role="radiogroup" aria-label="I am a">
        {['Parent', 'Student', 'Teacher / School', 'Other'].map((w) => (
          <button type="button" key={w} className={`chip${who === w ? ' on' : ''}`} aria-pressed={who === w} onClick={() => setWho(w)}>{w}</button>
        ))}
      </div>
      <div className="row2">
        <div className="field"><label htmlFor="rv-name">Your name</label><input id="rv-name" name="name" required defaultValue={defaultName} /></div>
        <div className="field"><label htmlFor="rv-email">Email (not shown)</label><input id="rv-email" name="email" type="email" required defaultValue={defaultEmail} /></div>
      </div>
      <div className="row2">
        <div className="field"><label htmlFor="rv-detail">About you (optional)</label><input id="rv-detail" name="detail" placeholder="e.g. Grade 11, IB, Dubai" /></div>
        <div className="field"><label htmlFor="rv-service">Service</label>
          <select id="rv-service" name="service" defaultValue=""><option value="">— Choose (optional) —</option>{services.map((s) => <option key={s.id} value={s.id}>{s.title}</option>)}</select>
        </div>
      </div>
      {who === 'Student' && (
        <label className="check"><input type="checkbox" name="under18" /> I am under 18 — show only my first name and initial</label>
      )}
      <label className="check"><input type="checkbox" name="consent" required /> I agree that EDUSIGHT may publish this review with my name as shown.</label>
      <input type="text" name="website" tabIndex={-1} autoComplete="off" className="sr" aria-hidden="true" />
      {state !== 'idle' && state !== 'sending' && <div className="alert err">{state}</div>}
      <button className="btn btn-primary" disabled={state === 'sending'}>{state === 'sending' ? 'Sending…' : 'Submit review'}</button>
    </form>
  )
}
