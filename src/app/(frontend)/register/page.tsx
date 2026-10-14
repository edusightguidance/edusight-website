import { Suspense } from 'react'
import { RegisterForm } from '@/components/auth/Forms'

export const metadata = { title: 'Create your account' }

export default function P() {
  return (
    <section className="section" style={{ paddingTop: 56 }}>
      <div className="narrow" style={{ maxWidth: 680 }}>
        <div className="auth-card">
          <h1 style={{ fontSize: '2.4rem' }}>Create your account</h1>
          <p className="muted">Students, parents and teachers can all sign up. It takes a minute.</p>
          <Suspense><RegisterForm /></Suspense>
        </div>
      </div>
    </section>
  )
}
