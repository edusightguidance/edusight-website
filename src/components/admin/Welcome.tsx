import React from 'react'
import type { Payload } from 'payload'

type Props = { payload: Payload; user?: { name?: string; role?: string } }

export async function Welcome({ payload, user }: Props) {
  const isSuper = user?.role === 'superadmin'
  const [toReview, enquiries, orders] = isSuper
    ? await Promise.all([
        payload.count({ collection: 'attempts', where: { status: { equals: 'submitted' } }, overrideAccess: true }),
        payload.count({ collection: 'inquiries', where: { status: { equals: 'new' } }, overrideAccess: true }),
        payload.count({ collection: 'orders', where: { status: { equals: 'paid' } }, overrideAccess: true }),
      ])
    : [null, null, null]
  const card: React.CSSProperties = { flex: '1 1 200px', padding: '18px 20px', borderRadius: 14, background: 'var(--theme-elevation-50)', textDecoration: 'none', color: 'inherit' }
  const big: React.CSSProperties = { fontSize: 30, fontWeight: 800, color: '#FF6B4A' }
  return (
    <div style={{ marginBottom: 32 }}>
      <h2 style={{ margin: '0 0 6px' }}>Welcome{user?.name ? `, ${user.name.split(' ')[0]}` : ''} 👋</h2>
      <p style={{ margin: '0 0 18px', opacity: 0.75 }}>
        Everything on the website is edited here with simple forms. Click a section below or in the left menu, change the text, and press Save.
      </p>
      <div style={{ display: 'flex', gap: 14, flexWrap: 'wrap' }}>
        {isSuper && (
          <>
            <a href="/admin/collections/attempts?where[status][equals]=submitted" style={card}>
              <div style={big}>{toReview?.totalDocs ?? 0}</div>
              <div>Test results to review</div>
            </a>
            <a href="/admin/collections/inquiries?where[status][equals]=new" style={card}>
              <div style={big}>{enquiries?.totalDocs ?? 0}</div>
              <div>New enquiries</div>
            </a>
            <a href="/admin/collections/orders" style={card}>
              <div style={big}>{orders?.totalDocs ?? 0}</div>
              <div>Paid orders</div>
            </a>
          </>
        )}
        <a href="/admin/globals/homepage" style={card}><b>Edit homepage</b><div style={{ opacity: 0.7 }}>Headline, stats, method</div></a>
        <a href="/admin/collections/posts/create" style={card}><b>Write an article</b><div style={{ opacity: 0.7 }}>Guides, myths, events</div></a>
        <a href="/" target="_blank" style={card}><b>View website ↗</b><div style={{ opacity: 0.7 }}>Opens in a new tab</div></a>
      </div>
    </div>
  )
}
