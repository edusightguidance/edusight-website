'use client'
import { useState } from 'react'

export function BuyButton({ product, book, label = 'Buy now', className = 'btn btn-primary', needsAddress = false }: { product?: string; book?: string; label?: string; className?: string; needsAddress?: boolean }) {
  const [busy, setBusy] = useState(false)
  const [err, setErr] = useState('')
  async function buy() {
    let shippingAddress: string | undefined
    if (needsAddress) {
      shippingAddress = window.prompt('Delivery address in the UAE (for the printed copy):') || undefined
      if (!shippingAddress) return
    }
    setBusy(true)
    setErr('')
    const r = await fetch('/x/checkout', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ product, book, shippingAddress }) })
    if (r.status === 401) {
      window.location.href = `/register?next=${encodeURIComponent(window.location.pathname)}`
      return
    }
    const j = await r.json().catch(() => ({}))
    if (j.url) window.location.href = j.url
    else {
      setErr(j.error || 'Something went wrong')
      setBusy(false)
    }
  }
  return (
    <>
      <button className={className} onClick={buy} disabled={busy}>{busy ? 'Opening checkout…' : label}</button>
      {err && <div className="alert err" style={{ marginTop: 10 }}>{err}</div>}
    </>
  )
}

export function LogoutButton() {
  return (
    <button
      className="btn btn-light btn-sm"
      onClick={async () => {
        await fetch('/api/users/logout', { method: 'POST', credentials: 'include' })
        window.location.href = '/'
      }}
    >
      Log out
    </button>
  )
}
