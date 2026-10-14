'use client'
import { useState } from 'react'

export function ShortlistButton({ id, saved: initial }: { id: number; saved: boolean }) {
  const [saved, setSaved] = useState(initial)
  const [busy, setBusy] = useState(false)
  async function toggle() {
    setBusy(true)
    const r = await fetch('/x/shortlist', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id }) })
    if (r.ok) setSaved((await r.json()).saved)
    setBusy(false)
  }
  return <button className={`btn ${saved ? 'btn-dark' : 'btn-ghost'}`} onClick={toggle} disabled={busy}>{saved ? '★ Saved to shortlist' : '☆ Save to shortlist'}</button>
}
