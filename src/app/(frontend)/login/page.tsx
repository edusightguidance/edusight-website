import { Suspense } from 'react'
import { LoginForm } from '@/components/auth/Forms'

export const metadata = { title: 'Welcome back' }

export default function P() {
  return (
    <section className="section" style={{ paddingTop: 56 }}>
      <div className="narrow" style={{ maxWidth: 520 }}>
        <div className="auth-card">
          <h1 style={{ fontSize: '2.4rem' }}>Welcome back</h1>
          <p className="muted">Log in to your EDUSIGHT portal to take tests and see your reports.</p>
          <Suspense><LoginForm /></Suspense>
        </div>
      </div>
    </section>
  )
}
