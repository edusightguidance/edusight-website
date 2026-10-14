import type { Payload } from 'payload'
import Stripe from 'stripe'

export const stripe = process.env.STRIPE_SECRET_KEY ? new Stripe(process.env.STRIPE_SECRET_KEY) : null
export const bypassPayments = !stripe && process.env.PAYMENTS_TEST_BYPASS === 'true'

const id = (v: unknown) => (v && typeof v === 'object' ? (v as { id: number }).id : (v as number))

/** Mark an order paid and unlock what it contains. Safe to call twice. */
export async function fulfil(payload: Payload, orderId: number | string) {
  const order = await payload.findByID({ collection: 'orders', id: orderId, depth: 1, overrideAccess: true })
  if (order.status === 'paid') return order
  const product = order.product && typeof order.product === 'object' ? order.product : null
  const months = product?.accessMonths || 12
  const expires = new Date()
  expires.setMonth(expires.getMonth() + months)
  await payload.update({
    collection: 'orders',
    id: order.id,
    data: { status: 'paid', paidAt: new Date().toISOString(), expiresAt: product ? expires.toISOString() : undefined },
    overrideAccess: true,
  })
  if (product?.kind === 'assessment') {
    for (const t of product.tests || []) {
      await payload.create({
        collection: 'attempts',
        data: { user: id(order.user), test: id(t), order: order.id, status: 'not_started' },
        overrideAccess: true,
      })
    }
  }
  const to = process.env.ADMIN_EMAIL || 'edusightguidance@gmail.com'
  await payload
    .sendEmail({ to, subject: `New order ${order.reference}: ${order.itemTitle} (AED ${order.amount})`, html: `<p>${order.itemTitle} — AED ${order.amount}</p><p>Order ${order.reference}</p>` })
    .catch(() => null)
  return order
}

/** What a user owns, for the portal and access checks. */
export async function entitlements(payload: Payload, userId: number | string) {
  const orders = await payload.find({
    collection: 'orders',
    where: { and: [{ user: { equals: userId } }, { status: { equals: 'paid' } }] },
    depth: 2,
    limit: 200,
    overrideAccess: true,
    sort: '-paidAt',
  })
  const now = Date.now()
  const live = (o: { expiresAt?: string | null }) => !o.expiresAt || new Date(o.expiresAt).getTime() > now
  const explorer = orders.docs.some((o) => {
    const p = o.product && typeof o.product === 'object' ? o.product : null
    return live(o) && p && (p.kind === 'explorer' || p.includesExplorer)
  })
  return { orders: orders.docs, explorer }
}
