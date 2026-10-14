import { NextResponse } from 'next/server'
import { db, getUser } from '@/lib/data'
import { draftRecommendations, score, summaryText, type TestDoc } from '@/lib/scoring'

export async function POST(req: Request) {
  const user = await getUser()
  if (!user) return NextResponse.json({ error: 'login' }, { status: 401 })
  if (user.consentStatus === 'pending') return NextResponse.json({ error: 'Waiting for parent consent' }, { status: 403 })
  const { id, answers = {}, submit } = await req.json().catch(() => ({}))
  const payload = await db()
  const a = await payload.findByID({ collection: 'attempts', id, depth: 1, overrideAccess: true }).catch(() => null)
  const ownerId = a && (typeof a.user === 'object' ? a.user.id : a.user)
  if (!a || ownerId !== user.id) return NextResponse.json({ error: 'Not found' }, { status: 404 })
  if (!['not_started', 'in_progress'].includes(a.status || '')) return NextResponse.json({ error: 'Already submitted' }, { status: 409 })
  const test = a.test as unknown as TestDoc
  const clean: Record<string, number> = {}
  for (const [k, v] of Object.entries(answers)) {
    const n = Number(v)
    if (n >= 1 && n <= 5) clean[k] = n
  }
  const data: Record<string, unknown> = { answers: clean, status: 'in_progress', startedAt: a.startedAt || new Date().toISOString() }
  if (submit) {
    const total = test.questions?.length || 0
    if (Object.keys(clean).length < total) return NextResponse.json({ error: 'Please answer every question before submitting.' }, { status: 400 })
    const scores = score(test, clean)
    Object.assign(data, {
      status: 'submitted',
      submittedAt: new Date().toISOString(),
      scores,
      scoreSummary: summaryText(scores),
      recommendations: draftRecommendations(test.code, scores, user.name),
    })
  }
  await payload.update({ collection: 'attempts', id, data, overrideAccess: true })
  if (submit) {
    const site = process.env.NEXT_PUBLIC_SITE_URL || ''
    await payload
      .sendEmail({
        to: process.env.ADMIN_EMAIL || 'edusightguidance@gmail.com',
        subject: `Test submitted: ${user.name} – ${test.name}`,
        html: `<p>${user.name} has finished <b>${test.name}</b>.</p><p><a href="${site}/admin/collections/attempts/${id}">Review and send the report</a></p>`,
      })
      .catch(() => null)
  }
  return NextResponse.json({ ok: true, status: data.status })
}
