import { NextResponse } from 'next/server'
import { db, getUser } from '@/lib/data'

export async function POST(req: Request) {
  const user = await getUser()
  if (!user) return NextResponse.json({ error: 'login' }, { status: 401 })
  const { id } = await req.json().catch(() => ({}))
  const current = ((user.shortlist || []) as (number | { id: number })[]).map((x) => (typeof x === 'object' ? x.id : x))
  const has = current.includes(Number(id))
  const next = has ? current.filter((x) => x !== Number(id)) : [...current, Number(id)]
  await (await db()).update({ collection: 'users', id: user.id, data: { shortlist: next }, overrideAccess: true })
  return NextResponse.json({ saved: !has })
}
