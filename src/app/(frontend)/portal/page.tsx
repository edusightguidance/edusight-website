import Link from 'next/link'
import { redirect } from 'next/navigation'
import { db, getUser } from '@/lib/data'
import { entitlements } from '@/lib/commerce'
import { BuyButton, LogoutButton } from '@/components/site/Buy'
import { Icon } from '@/components/site/Icon'

export const dynamic = 'force-dynamic'
export const metadata = { title: 'My portal', robots: { index: false } }

const STATUS: Record<string, string> = {
  not_started: 'Ready to start',
  in_progress: 'In progress',
  submitted: 'With the EDUSIGHT team for review',
  approved: 'Report being prepared',
  sent: 'Report ready',
}

export default async function Portal({ searchParams }: { searchParams: Promise<{ paid?: string; test?: string }> }) {
  const user = await getUser()
  if (!user) redirect('/login?next=/portal')
  const { paid, test } = await searchParams
  const payload = await db()
  const [{ orders, explorer }, attempts, products] = await Promise.all([
    entitlements(payload, user.id),
    payload.find({ collection: 'attempts', where: { user: { equals: user.id } }, depth: 1, limit: 100, overrideAccess: true, sort: 'createdAt' }),
    payload.find({ collection: 'products', where: { published: { equals: true } }, sort: 'order', depth: 0 }),
  ])
  const books = orders.filter((o) => o.book && typeof o.book === 'object')
  const owned = new Set(orders.map((o) => (o.product && typeof o.product === 'object' ? o.product.id : null)))
  const staff = user.role === 'superadmin' || user.role === 'editor'
  const pending = user.consentStatus === 'pending'
  return (
    <>
      <div className="portal-head">
        <div className="wrap" style={{ display: 'flex', justifyContent: 'space-between', gap: 20, flexWrap: 'wrap', alignItems: 'flex-end' }}>
          <div>
            <p className="eyebrow" style={{ color: 'var(--marigold)' }}>My portal</p>
            <h1 style={{ fontSize: 'clamp(2.2rem,5vw,3.4rem)', color: '#fff', margin: 0 }}>Hi {user.name.split(' ')[0]} 👋</h1>
            <p style={{ margin: '8px 0 0' }}>{user.email}{user.school ? ` · ${user.school}` : ''}{user.grade ? ` · ${user.grade}` : ''}</p>
          </div>
          <div className="btns">
            {staff && <Link href="/admin" className="btn btn-primary btn-sm">Open admin</Link>}
            <LogoutButton />
          </div>
        </div>
      </div>
      <div className="wrap portal-body">
        {paid && <div className="alert ok" style={{ marginBottom: 16 }}>Payment received — thank you! Order {paid}.{test ? ' (Test mode: no real payment was taken.)' : ''}</div>}
        {pending && (
          <div className="alert info" style={{ marginBottom: 16 }}>
            <b>Waiting for parent consent.</b> We emailed {user.parentEmail}. Once they approve, your tests unlock. You can still browse and buy.
          </div>
        )}

        <div className="auth-card" style={{ marginBottom: 22 }}>
          <h2 style={{ fontSize: '1.7rem' }}>My assessments</h2>
          {attempts.docs.length === 0 ? (
            <p className="muted">No assessments yet. Choose one below to get started.</p>
          ) : (
            attempts.docs.map((a) => {
              const t = typeof a.test === 'object' ? a.test : null
              const report = a.report && typeof a.report === 'object' ? a.report : null
              const canTake = !pending && ['not_started', 'in_progress'].includes(a.status || '')
              return (
                <div className="item" key={a.id}>
                  <span className="ico t-lilac" style={{ margin: 0 }}><Icon name="compass" /></span>
                  <div className="grow">
                    <b>{t?.name}</b>
                    <div className="muted" style={{ fontSize: '0.9rem' }}>{t?.questions?.length} questions · ~{t?.minutes} min</div>
                  </div>
                  <span className={`status st-${a.status}`}>{STATUS[a.status || 'not_started']}</span>
                  {canTake && <Link href={`/portal/test/${a.id}`} className="btn btn-primary btn-sm">{a.status === 'in_progress' ? 'Continue' : 'Start test'}</Link>}
                  {report?.url && <a href={report.url} className="btn btn-dark btn-sm" target="_blank" rel="noreferrer"><Icon name="download" size={16} /> Report</a>}
                </div>
              )
            })
          )}
        </div>

        <div className="grid g2" style={{ marginBottom: 22 }}>
          <div className="auth-card">
            <h2 style={{ fontSize: '1.5rem' }}>Career Explorer</h2>
            {explorer ? (
              <>
                <p className="muted">Careers matched to your interests, with subjects, routes and entrance exams.</p>
                <Link href="/portal/explorer" className="btn btn-primary">Open Career Explorer</Link>
              </>
            ) : (
              <>
                <p className="muted">Unlock personalised career matches and your saved shortlist.</p>
                <BuyButton product="career-explorer" label="Unlock Career Explorer" className="btn btn-dark" />
              </>
            )}
          </div>
          <div className="auth-card">
            <h2 style={{ fontSize: '1.5rem' }}>My books</h2>
            {books.length === 0 ? (
              <><p className="muted">Guides for students and parents.</p><Link href="/books" className="btn btn-ghost">Browse books</Link></>
            ) : (
              books.map((o) => {
                const b = o.book as { title: string; ebookFile?: { url?: string } | number | null }
                const file = b.ebookFile && typeof b.ebookFile === 'object' ? b.ebookFile : null
                return (
                  <div className="item" key={o.id}>
                    <div className="grow"><b>{b.title}</b></div>
                    {file?.url ? <a className="btn btn-dark btn-sm" href={file.url} target="_blank" rel="noreferrer">Download</a> : <span className="status st-submitted">{o.shippingAddress ? 'Printed copy — we’ll be in touch' : 'File coming soon'}</span>}
                  </div>
                )
              })
            )}
          </div>
        </div>

        {orders.length > 0 && (
          <div className="panel panel-butter split" style={{ marginBottom: 22, padding: 28 }}>
            <div><h2 style={{ fontSize: '1.5rem', margin: 0 }}>How was your experience?</h2><p className="muted" style={{ margin: '6px 0 0' }}>A short review helps other families — and you’ll get a ✓ Verified client badge.</p></div>
            <div className="btns" style={{ justifyContent: 'flex-end' }}><Link href="/reviews#write" className="btn btn-primary">Leave a review</Link></div>
          </div>
        )}

        {products.docs.some((p) => !owned.has(p.id)) && (
          <div className="auth-card">
            <h2 style={{ fontSize: '1.5rem' }}>Add more</h2>
            {products.docs.filter((p) => !owned.has(p.id)).map((p) => (
              <div className="item" key={p.id}>
                <div className="grow"><b>{p.title}</b><div className="muted" style={{ fontSize: '0.9rem' }}>{p.tagline}</div></div>
                <b>AED {p.price}</b>
                <BuyButton product={p.slug} label="Buy" className="btn btn-ghost btn-sm" />
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  )
}
