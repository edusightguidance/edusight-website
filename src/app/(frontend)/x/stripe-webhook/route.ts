import { NextResponse } from 'next/server'
import { db } from '@/lib/data'
import { fulfil, stripe } from '@/lib/commerce'

export async function POST(req: Request) {
  if (!stripe || !process.env.STRIPE_WEBHOOK_SECRET) return NextResponse.json({ error: 'not configured' }, { status: 503 })
  const body = await req.text()
  let event
  try {
    event = stripe.webhooks.constructEvent(body, req.headers.get('stripe-signature') || '', process.env.STRIPE_WEBHOOK_SECRET)
  } catch {
    return NextResponse.json({ error: 'bad signature' }, { status: 400 })
  }
  if (event.type === 'checkout.session.completed') {
    const s = event.data.object
    if (s.payment_status === 'paid' && s.metadata?.orderId) await fulfil(await db(), s.metadata.orderId)
  }
  return NextResponse.json({ received: true })
}
