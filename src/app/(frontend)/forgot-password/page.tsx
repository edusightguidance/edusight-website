import { Suspense } from 'react'
import { ForgotForm } from '@/components/auth/Forms'

export const metadata = { title: 'Reset your password' }

export default function P() {
  return (
    <section className="section" style={{ paddingTop: 56 }}>
      <div className="narrow" style={{ maxWidth: 520 }}>
        <div className="auth-card">
          <h1 style={{ fontSize: '2.4rem' }}>Reset your password</h1>
          <p className="muted">Enter your email and we’ll send you a reset link.</p>
          <Suspense><ForgotForm /></Suspense>
        </div>
      </div>
    </section>
  )
}
