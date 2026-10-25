'use client'
import { useState } from 'react'

const TOPICS = ['Career guidance', 'Psychometric assessment', 'Subject selection', 'University admissions', 'Curriculum / school selection', 'Parent mentoring', 'Well-being support', 'School workshop or talk', 'Other']

export function ContactForm({ topic }: { topic?: string }) {
  const [state, setState] = useState<'idle' | 'sending' | 'done' | 'error'>('idle')
  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setState('sending')
    const data = Object.fromEntries(new FormData(e.currentTarget))
    const r = await fetch('/api/inquiries', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data) })
    setState(r.ok ? 'done' : 'error')
  }
  if (state === 'done') return <div className="alert ok"><b>Thank you!</b> Your message is with the EDUSIGHT team. We’ll be in touch within one working day.</div>
  return (
    <form className="form" onSubmit={submit}>
      <h3>Send a message</h3>
      <div className="field"><label htmlFor="name">Your name</label><input id="name" name="name" required /></div>
      <div className="row2">
        <div className="field"><label htmlFor="email">Email</label><input id="email" name="email" type="email" required /></div>
        <div className="field"><label htmlFor="phone">Phone / WhatsApp</label><input id="phone" name="phone" /></div>
      </div>
      <div className="row2">
        <div className="field"><label htmlFor="topic">I need help with</label>
          <select id="topic" name="topic" defaultValue={topic || TOPICS[0]}>{TOPICS.map((t) => <option key={t}>{t}</option>)}</select>
        </div>
        <div className="field"><label htmlFor="grade">Student’s grade / year</label><input id="grade" name="grade" placeholder="e.g. Grade 10, IB" /></div>
      </div>
      <div className="field"><label htmlFor="message">Message</label><textarea id="message" name="message" rows={5} /></div>
      {state === 'error' && <div className="alert err">Sorry, that didn’t send. Please try again or WhatsApp us.</div>}
      <button className="btn btn-primary" disabled={state === 'sending'}>{state === 'sending' ? 'Sending…' : 'Send message'}</button>
    </form>
  )
}
