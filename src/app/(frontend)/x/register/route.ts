import { NextResponse } from 'next/server'
import { db } from '@/lib/data'
import { ageFrom } from '@/collections/Users'

export async function POST(req: Request) {
  const b = await req.json().catch(() => ({}))
  const { name, email, password, role = 'student', dateOfBirth, school, grade, curriculum, phone, parentName, parentEmail } = b
  if (!name || !email || !password || String(password).length < 8)
    return NextResponse.json({ error: 'Please fill in your name, email and a password of at least 8 characters.' }, { status: 400 })
  if (role === 'student') {
    if (!dateOfBirth) return NextResponse.json({ error: 'Please add your date of birth.' }, { status: 400 })
    const age = ageFrom(dateOfBirth)
    if (age !== null && age < 18 && !parentEmail)
      return NextResponse.json({ error: 'As you are under 18, we need a parent or guardian’s email for consent.' }, { status: 400 })
    if (parentEmail && String(parentEmail).toLowerCase() === String(email).toLowerCase())
      return NextResponse.json({ error: 'The parent email must be different from your own.' }, { status: 400 })
  }
  const payload = await db()
  try {
    await payload.create({
      collection: 'users',
      data: { name, email, password, role: ['student', 'parent', 'teacher'].includes(role) ? role : 'student', dateOfBirth, school, grade, curriculum, phone, parentName, parentEmail },
    })
  } catch (e) {
    const msg = String((e as Error).message || '')
    return NextResponse.json({ error: /unique|already/i.test(msg) ? 'An account with this email already exists. Try logging in.' : 'Could not create the account.' }, { status: 400 })
  }
  return NextResponse.json({ ok: true })
}
