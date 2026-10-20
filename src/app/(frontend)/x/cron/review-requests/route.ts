import { NextResponse } from 'next/server'
import { db } from '@/lib/data'

/** Daily (Vercel Cron): 7 days after a report is sent, ask the family for a review. Each user is asked once. */
export async function GET(req: Request) {
  if (process.env.CRON_SECRET && req.headers.get('authorization') !== `Bearer ${process.env.CRON_SECRET}`)
    return NextResponse.json({ error: 'unauthorised' }, { status: 401 })
  const payload = await db()
  const now = Date.now()
  const day = 86400000
  const due = await payload.find({
    collection: 'attempts',
    where: { and: [{ status: { equals: 'sent' } }, { sentAt: { less_than: new Date(now - 7 * day).toISOString() } }, { sentAt: { greater_than: new Date(now - 30 * day).toISOString() } }] },
    depth: 1,
    limit: 200,
    overrideAccess: true,
  })
  const site = process.env.NEXT_PUBLIC_SITE_URL || ''
  const done = new Set<number>()
  for (const a of due.docs) {
    const u = a.user && typeof a.user === 'object' ? a.user : null
    if (!u || u.reviewRequestedAt || done.has(u.id)) continue
    done.add(u.id)
    await payload
      .sendEmail({
        to: [u.email, u.parentEmail].filter(Boolean) as string[],
        subject: 'How did we do? A quick review would mean a lot',
        html: `<p>Dear ${u.name.split(' ')[0]},</p><p>A week ago we sent your EDUSIGHT report. If it helped you, would you take one minute to share your experience? It helps other families find the right guidance.</p><p><a href="${site}/reviews#write" style="background:#FF6B4A;color:#fff;padding:12px 20px;border-radius:999px;text-decoration:none">Leave a review</a></p><p>Thank you!<br/>Bhavana Sood, EDUSIGHT</p>`,
      })
      .catch(() => null)
    await payload.update({ collection: 'users', id: u.id, data: { reviewRequestedAt: new Date().toISOString() }, overrideAccess: true })
  }
  return NextResponse.json({ asked: done.size })
}
