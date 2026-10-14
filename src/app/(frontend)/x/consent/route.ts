import { NextResponse } from 'next/server'
import { db } from '@/lib/data'

export async function POST(req: Request) {
  const { token, parentName, agree } = await req.json().catch(() => ({}))
  if (!token || !agree || !parentName) return NextResponse.json({ error: 'Please type your name and tick the box.' }, { status: 400 })
  const payload = await db()
  const u = (await payload.find({ collection: 'users', where: { consentToken: { equals: token } }, limit: 1, overrideAccess: true })).docs[0]
  if (!u) return NextResponse.json({ error: 'This link is invalid or has already been used.' }, { status: 404 })
  await payload.update({
    collection: 'users',
    id: u.id,
    data: { consentStatus: 'granted', consentAt: new Date().toISOString(), parentName, consentToken: null },
    overrideAccess: true,
  })
  await payload
    .sendEmail({ to: u.email, subject: 'Your EDUSIGHT account is ready', html: `<p>Hi ${u.name.split(' ')[0]}, your parent has approved your account. You can now take your assessments: <a href="${process.env.NEXT_PUBLIC_SITE_URL || ''}/portal">open your portal</a>.</p>` })
    .catch(() => null)
  return NextResponse.json({ ok: true })
}
