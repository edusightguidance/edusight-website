import { NextResponse } from 'next/server'
import { db, getUser } from '@/lib/data'

const shortName = (n: string) => {
  const [first, ...rest] = n.trim().split(/\s+/)
  return rest.length ? `${first} ${rest[rest.length - 1][0].toUpperCase()}.` : first
}

export async function POST(req: Request) {
  const b = await req.json().catch(() => ({}))
  if (b.website) return NextResponse.json({ ok: true }) // spam trap
  const quote = String(b.quote || '').trim()
  const name = String(b.name || '').trim().slice(0, 80)
  const email = String(b.email || '').trim().slice(0, 120)
  if (quote.length < 20 || !name || !/^\S+@\S+\.\S+$/.test(email)) return NextResponse.json({ error: 'Please write at least a couple of sentences and add your name and email.' }, { status: 400 })
  if (!b.consent) return NextResponse.json({ error: 'Please tick the permission box.' }, { status: 400 })
  const payload = await db()
  const user = await getUser()
  let verified = false
  if (user) {
    const paid = await payload.count({ collection: 'orders', where: { and: [{ user: { equals: user.id } }, { status: { equals: 'paid' } }] }, overrideAccess: true })
    verified = paid.totalDocs > 0
  }
  const minor = !!b.under18 || (user?.dateOfBirth && Date.now() - new Date(user.dateOfBirth).getTime() < 18 * 31557600000)
  const detailParts = [b.who && b.who !== 'Other' ? b.who : null, String(b.detail || '').trim().slice(0, 80) || null].filter(Boolean)
  const doc = await payload.create({
    collection: 'testimonials',
    overrideAccess: true,
    data: {
      status: 'pending',
      source: 'website',
      rating: Math.min(5, Math.max(1, Number(b.rating) || 5)),
      quote: quote.slice(0, 1500),
      name: minor ? shortName(name) : name,
      detail: detailParts.join(', ') || undefined,
      service: Number(b.service) || undefined,
      email,
      user: user?.id,
      verified,
      consent: true,
      date: new Date().toISOString(),
    },
  })
  const site = process.env.NEXT_PUBLIC_SITE_URL || ''
  await payload
    .sendEmail({
      to: process.env.ADMIN_EMAIL || 'edusightguidance@gmail.com',
      subject: `New review to approve: ${doc.name} (${doc.rating}★)`,
      html: `<p><b>${doc.name}</b> left a ${doc.rating}★ review${verified ? ' (verified client)' : ''}:</p><blockquote>${quote.replace(/</g, '&lt;')}</blockquote><p><a href="${site}/admin/collections/testimonials/${doc.id}">Approve or hide it</a></p>`,
    })
    .catch(() => null)
  return NextResponse.json({ ok: true })
}
