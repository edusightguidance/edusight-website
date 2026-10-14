import { Suspense } from 'react'
import { ResetForm } from '@/components/auth/Forms'

export const metadata = { title: 'Choose a new password' }

export default function P() {
  return (
    <section className="section" style={{ paddingTop: 56 }}>
      <div className="narrow" style={{ maxWidth: 520 }}>
        <div className="auth-card">
          <h1 style={{ fontSize: '2.4rem' }}>Choose a new password</h1>
          <p className="muted">Pick something you’ll remember — at least 8 characters.</p>
          <Suspense><ResetForm /></Suspense>
        </div>
      </div>
    </section>
  )
}
