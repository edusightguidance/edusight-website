import { db } from '@/lib/data'
import { ConsentForm } from '@/components/auth/Forms'

export const metadata = { title: 'Parent consent', robots: { index: false } }

export default async function Consent({ params }: { params: Promise<{ token: string }> }) {
  const { token } = await params
  const u = (await (await db()).find({ collection: 'users', where: { consentToken: { equals: token } }, limit: 1, overrideAccess: true })).docs[0]
  return (
    <section className="section" style={{ paddingTop: 56 }}>
      <div className="narrow" style={{ maxWidth: 640 }}>
        <div className="auth-card">
          <p className="eyebrow">Parent / guardian consent</p>
          {u ? (
            <>
              <h1 style={{ fontSize: '2.2rem' }}>Approve {u.name}’s account</h1>
              <p className="muted">{u.name} ({u.email}){u.school ? `, ${u.school}` : ''} would like to take EDUSIGHT career assessments: personality, career interests and work values. Answers are confidential and each report is reviewed by counselling psychologist Bhavana Sood before it is shared with your child and you.</p>
              <ConsentForm token={token} child={u.name.split(' ')[0]} />
            </>
          ) : (
            <>
              <h1 style={{ fontSize: '2.2rem' }}>Link already used</h1>
              <p className="muted">This consent link is invalid or consent has already been given. Questions? WhatsApp +971 50 451 8940.</p>
            </>
          )}
        </div>
      </div>
    </section>
  )
}
