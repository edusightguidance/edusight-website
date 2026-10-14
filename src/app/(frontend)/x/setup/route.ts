import { NextResponse } from 'next/server'
import { db } from '@/lib/data'
import { seedAll } from '@/seed/seed'

/** One-time setup: loads starter content and the super admin account. Does nothing once an admin exists. */
export async function GET() {
  const payload = await db()
  const admins = await payload.count({ collection: 'users', where: { role: { equals: 'superadmin' } }, overrideAccess: true })
  if (admins.totalDocs > 0) return NextResponse.json({ ok: false, message: 'Already set up.' })
  if (!process.env.SEED_ADMIN_PASSWORD) return NextResponse.json({ ok: false, message: 'Set SEED_ADMIN_PASSWORD first.' }, { status: 400 })
  await seedAll(payload)
  return NextResponse.json({ ok: true, message: 'Done. Log in at /admin with edusightguidance@gmail.com and your SEED_ADMIN_PASSWORD.' })
}
