'use client'
import { useEffect, useRef, useState } from 'react'

type Props = { id: number; questions: string[]; scale: { value: number; label: string }[]; initial: Record<string, number> }

export function TestRunner({ id, questions, scale, initial }: Props) {
  const [answers, setAnswers] = useState<Record<string, number>>(initial)
  const [state, setState] = useState<'idle' | 'saving' | 'saved' | 'submitting' | 'done' | 'error'>('idle')
  const [err, setErr] = useState('')
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null)
  const done = Object.keys(answers).length
  const pct = Math.round((done / questions.length) * 100)

  const save = async (a: Record<string, number>, submit = false) => {
    const r = await fetch('/x/attempt', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id, answers: a, submit }) })
    const j = await r.json().catch(() => ({}))
    if (!r.ok) throw new Error(j.error || 'Could not save')
  }
  useEffect(() => () => { if (timer.current) clearTimeout(timer.current) }, [])

  function pick(i: number, v: number) {
    const next = { ...answers, [String(i)]: v }
    setAnswers(next)
    setState('saving')
    if (timer.current) clearTimeout(timer.current)
    timer.current = setTimeout(() => save(next).then(() => setState('saved')).catch(() => setState('error')), 700)
  }
  async function submit() {
    setState('submitting')
    setErr('')
    try {
      await save(answers, true)
      setState('done')
    } catch (e) {
      setErr((e as Error).message)
      setState('error')
    }
  }
  if (state === 'done')
    return (
      <div className="auth-card center">
        <div style={{ fontSize: '3rem' }}>🎉</div>
        <h2>All done — thank you!</h2>
        <p className="muted">Your answers are with the EDUSIGHT team. They’ll review your results and add personal recommendations. Your PDF report will be emailed to you{''} and appear in your portal.</p>
        <a href="/portal" className="btn btn-primary">Back to my portal</a>
      </div>
    )
  return (
    <>
      <div className="progress">
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem', fontWeight: 600, marginBottom: 6 }}>
          <span>{done} of {questions.length} answered</span>
          <span className="muted">{state === 'saving' ? 'Saving…' : state === 'saved' ? 'Saved ✓' : state === 'error' ? 'Not saved — check connection' : ''}</span>
        </div>
        <div className="bar"><i style={{ width: `${pct}%` }} /></div>
      </div>
      {questions.map((q, i) => (
        <div className="q" key={i} id={`q${i}`}>
          <h3><span className="muted" style={{ marginRight: 8 }}>{i + 1}.</span>{q}</h3>
          <div className="scale" role="radiogroup" aria-label={q}>
            {scale.map((s) => (
              <button key={s.value} type="button" role="radio" aria-checked={answers[String(i)] === s.value} className={answers[String(i)] === s.value ? 'on' : ''} onClick={() => pick(i, s.value)}>
                <b>{s.value}</b><span>{s.label}</span>
              </button>
            ))}
          </div>
        </div>
      ))}
      {err && <div className="alert err" style={{ marginBottom: 12 }}>{err}</div>}
      <button className="btn btn-primary" style={{ width: '100%' }} onClick={submit} disabled={done < questions.length || state === 'submitting'}>
        {done < questions.length ? `Answer all questions to submit (${questions.length - done} left)` : state === 'submitting' ? 'Submitting…' : 'Submit my answers'}
      </button>
    </>
  )
}
