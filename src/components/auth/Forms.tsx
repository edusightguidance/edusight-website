'use client'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import { useState } from 'react'

async function post(url: string, body: unknown) {
  const r = await fetch(url, { method: 'POST', credentials: 'include', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) })
  const j = await r.json().catch(() => ({}))
  return { ok: r.ok, j }
}
const form = (e: React.FormEvent<HTMLFormElement>) => Object.fromEntries(new FormData(e.currentTarget)) as Record<string, string>

export function LoginForm() {
  const router = useRouter()
  const next = useSearchParams().get('next') || '/portal'
  const [err, setErr] = useState('')
  const [busy, setBusy] = useState(false)
  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setBusy(true)
    setErr('')
    const { ok, j } = await post('/api/users/login', form(e))
    setBusy(false)
    if (!ok) return setErr(j?.errors?.[0]?.message || 'Email or password is incorrect.')
    const role = j?.user?.role
    router.push(role === 'superadmin' || role === 'editor' ? '/admin' : next.startsWith('/') ? next : '/portal')
    router.refresh()
  }
  return (
    <form className="form" onSubmit={submit}>
      <div className="field"><label htmlFor="email">Email</label><input id="email" name="email" type="email" autoComplete="email" required /></div>
      <div className="field"><label htmlFor="password">Password</label><input id="password" name="password" type="password" autoComplete="current-password" required /></div>
      {err && <div className="alert err">{err}</div>}
      <button className="btn btn-primary" disabled={busy}>{busy ? 'Logging in…' : 'Log in'}</button>
      <p className="muted" style={{ margin: 0, fontSize: '0.92rem' }}>
        <Link href="/forgot-password">Forgot password?</Link> · New here? <Link href={`/register?next=${encodeURIComponent(next)}`}>Create an account</Link>
      </p>
    </form>
  )
}

export function RegisterForm() {
  const router = useRouter()
  const next = useSearchParams().get('next') || '/portal'
  const [role, setRole] = useState('student')
  const [dob, setDob] = useState('')
  const [err, setErr] = useState('')
  const [busy, setBusy] = useState(false)
  const age = dob ? Math.floor((Date.now() - new Date(dob).getTime()) / 31557600000) : null
  const minor = role === 'student' && age !== null && age < 18
  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setBusy(true)
    setErr('')
    const data = form(e)
    const r = await post('/x/register', { ...data, role })
    if (!r.ok) {
      setBusy(false)
      return setErr(r.j.error || 'Something went wrong.')
    }
    await post('/api/users/login', { email: data.email, password: data.password })
    router.push(next.startsWith('/') ? next : '/portal')
    router.refresh()
  }
  return (
    <form className="form" onSubmit={submit}>
      <div className="chips" role="radiogroup" aria-label="I am a">
        {[['student', 'Student'], ['parent', 'Parent'], ['teacher', 'Teacher / School']].map(([v, l]) => (
          <button type="button" key={v} className={`chip${role === v ? ' on' : ''}`} onClick={() => setRole(v)} aria-pressed={role === v}>{l}</button>
        ))}
      </div>
      <div className="field"><label htmlFor="name">Full name</label><input id="name" name="name" required /></div>
      <div className="row2">
        <div className="field"><label htmlFor="email">Email</label><input id="email" name="email" type="email" required /></div>
        <div className="field"><label htmlFor="password">Password</label><input id="password" name="password" type="password" minLength={8} required /><div className="hint">At least 8 characters</div></div>
      </div>
      {role === 'student' && (
        <>
          <div className="row2">
            <div className="field"><label htmlFor="dateOfBirth">Date of birth</label><input id="dateOfBirth" name="dateOfBirth" type="date" required value={dob} onChange={(e) => setDob(e.target.value)} /></div>
            <div className="field"><label htmlFor="grade">Grade / Year</label><input id="grade" name="grade" placeholder="e.g. Grade 11" /></div>
          </div>
          <div className="row2">
            <div className="field"><label htmlFor="school">School</label><input id="school" name="school" /></div>
            <div className="field"><label htmlFor="curriculum">Curriculum</label><input id="curriculum" name="curriculum" placeholder="IB, A-Level, CBSE…" /></div>
          </div>
          {minor && (
            <div className="panel panel-butter" style={{ padding: 20, borderRadius: 18 }}>
              <p style={{ fontWeight: 700, margin: '0 0 10px' }}>You’re under 18, so a parent or guardian needs to approve your account.</p>
              <div className="row2">
                <div className="field"><label htmlFor="parentName">Parent’s name</label><input id="parentName" name="parentName" required /></div>
                <div className="field"><label htmlFor="parentEmail">Parent’s email</label><input id="parentEmail" name="parentEmail" type="email" required /></div>
              </div>
              <div className="hint">We’ll email them a one-click consent link. Reports are shared with them too.</div>
            </div>
          )}
        </>
      )}
      <div className="field"><label htmlFor="phone">Phone / WhatsApp (optional)</label><input id="phone" name="phone" /></div>
      {err && <div className="alert err">{err}</div>}
      <button className="btn btn-primary" disabled={busy}>{busy ? 'Creating account…' : 'Create account'}</button>
      <p className="muted" style={{ margin: 0, fontSize: '0.92rem' }}>Already have an account? <Link href={`/login?next=${encodeURIComponent(next)}`}>Log in</Link>. By signing up you agree to our <Link href="/p/privacy-policy">privacy policy</Link>.</p>
    </form>
  )
}

export function ForgotForm() {
  const [done, setDone] = useState(false)
  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    await post('/api/users/forgot-password', form(e))
    setDone(true)
  }
  if (done) return <div className="alert ok">If that email has an account, a reset link is on its way.</div>
  return (
    <form className="form" onSubmit={submit}>
      <div className="field"><label htmlFor="email">Email</label><input id="email" name="email" type="email" required /></div>
      <button className="btn btn-primary">Send reset link</button>
    </form>
  )
}

export function ResetForm() {
  const token = useSearchParams().get('token') || ''
  const router = useRouter()
  const [err, setErr] = useState('')
  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const { ok } = await post('/api/users/reset-password', { token, password: form(e).password })
    if (!ok) return setErr('This link has expired. Please request a new one.')
    router.push('/portal')
    router.refresh()
  }
  return (
    <form className="form" onSubmit={submit}>
      <div className="field"><label htmlFor="password">New password</label><input id="password" name="password" type="password" minLength={8} required /></div>
      {err && <div className="alert err">{err}</div>}
      <button className="btn btn-primary">Save new password</button>
    </form>
  )
}

export function ConsentForm({ token, child }: { token: string; child: string }) {
  const [state, setState] = useState<'idle' | 'done' | string>('idle')
  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const d = form(e)
    const { ok, j } = await post('/x/consent', { token, parentName: d.parentName, agree: d.agree === 'on' })
    setState(ok ? 'done' : j.error || 'Something went wrong')
  }
  if (state === 'done') return <div className="alert ok"><b>Thank you.</b> {child} can now take their assessments. You’ll receive a copy of each report by email.</div>
  return (
    <form className="form" onSubmit={submit}>
      <div className="field"><label htmlFor="parentName">Your full name</label><input id="parentName" name="parentName" required /></div>
      <label style={{ display: 'flex', gap: 10, alignItems: 'flex-start' }}>
        <input type="checkbox" name="agree" required style={{ marginTop: 6, width: 18, height: 18 }} />
        <span>I am the parent or legal guardian of {child}. I consent to them using EDUSIGHT’s online assessments and to EDUSIGHT processing their answers to prepare a report, as described in the <Link href="/p/privacy-policy">privacy policy</Link>.</span>
      </label>
      {state !== 'idle' && <div className="alert err">{state}</div>}
      <button className="btn btn-primary">Give consent</button>
    </form>
  )
}
