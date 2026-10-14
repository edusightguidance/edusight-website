import { notFound, redirect } from 'next/navigation'
import { db, getUser } from '@/lib/data'
import { SCALE } from '@/seed/tests'
import { TestRunner } from './TestRunner'

export const dynamic = 'force-dynamic'
export const metadata = { title: 'Assessment', robots: { index: false } }

export default async function TestPage({ params }: { params: Promise<{ id: string }> }) {
  const user = await getUser()
  const { id } = await params
  if (!user) redirect(`/login?next=/portal/test/${id}`)
  if (user.consentStatus === 'pending') redirect('/portal')
  const a = await (await db()).findByID({ collection: 'attempts', id, depth: 1, overrideAccess: true }).catch(() => null)
  if (!a || (typeof a.user === 'object' ? a.user.id : a.user) !== user.id) notFound()
  if (!['not_started', 'in_progress'].includes(a.status || '')) redirect('/portal')
  const t = a.test as { name: string; intro?: string | null; questions?: { text: string }[] | null }
  return (
    <section className="section" style={{ paddingTop: 40 }}>
      <div className="narrow">
        <p className="eyebrow">Assessment</p>
        <h1 style={{ fontSize: 'clamp(2rem,4.5vw,3rem)' }}>{t.name}</h1>
        <p className="lead">{t.intro}</p>
        <TestRunner id={a.id} questions={(t.questions || []).map((q) => q.text)} scale={SCALE} initial={(a.answers as Record<string, number>) || {}} />
      </div>
    </section>
  )
}
