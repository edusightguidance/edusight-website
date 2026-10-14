import { NextResponse } from 'next/server'
import { db, getUser } from '@/lib/data'
import { bypassPayments, fulfil, stripe } from '@/lib/commerce'

export async function POST(req: Request) {
  const user = await getUser()
  if (!user) return NextResponse.json({ error: 'login' }, { status: 401 })
  const { product: pslug, book: bslug, shippingAddress } = await req.json().catch(() => ({}))
  const payload = await db()
  const site = process.env.NEXT_PUBLIC_SITE_URL || new URL(req.url).origin

  let item: { id: number; title: string; price: number } | undefined
  let kind: 'product' | 'book' = 'product'
  if (pslug) item = (await payload.find({ collection: 'products', where: { and: [{ slug: { equals: pslug } }, { published: { equals: true } }] }, limit: 1 })).docs[0]
  else if (bslug) {
    kind = 'book'
    item = (await payload.find({ collection: 'books', where: { and: [{ slug: { equals: bslug } }, { published: { equals: true } }] }, limit: 1 })).docs[0]
  }
  if (!item) return NextResponse.json({ error: 'Item not found' }, { status: 404 })

  const reference = `ES-${Date.now().toString(36).toUpperCase()}`
  const order = await payload.create({
    collection: 'orders',
    data: { reference, user: user.id, [kind]: item.id, itemTitle: item.title, amount: item.price, status: 'pending', shippingAddress },
    overrideAccess: true,
  })

  if (stripe) {
    const session = await stripe.checkout.sessions.create({
      mode: 'payment',
      customer_email: user.email,
      line_items: [{ quantity: 1, price_data: { currency: 'aed', unit_amount: Math.round(item.price * 100), product_data: { name: item.title } } }],
      metadata: { orderId: String(order.id), reference },
      success_url: `${site}/portal?paid=${reference}`,
      cancel_url: `${site}/${kind === 'book' ? 'books' : 'assessments'}?cancelled=1`,
    })
    await payload.update({ collection: 'orders', id: order.id, data: { stripeSessionId: session.id }, overrideAccess: true })
    return NextResponse.json({ url: session.url })
  }
  if (bypassPayments) {
    await fulfil(payload, order.id)
    return NextResponse.json({ url: `/portal?paid=${reference}&test=1` })
  }
  return NextResponse.json({ error: 'Online payments are not set up yet. Please WhatsApp us to book.' }, { status: 503 })
}
