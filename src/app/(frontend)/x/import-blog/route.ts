import { headers } from 'next/headers'
import { db } from '@/lib/data'
import { refreshSite } from '@/lib/revalidate'

export const maxDuration = 300

/** Super admin only: copies all posts from the old Squarespace blog. Safe to run again (skips posts already imported). */
export async function GET(req: Request) {
  const payload = await db()
  const { user } = await payload.auth({ headers: await headers() })
  if (user?.role !== 'superadmin') return new Response('Please log in to /admin as the super admin first.', { status: 401 })
  const from = new URL(req.url).searchParams.get('from') || process.env.OLD_SITE_URL || 'https://www.edusightconsulting.com'
  try {
    const { importSquarespace } = await import('@/lib/importSquarespace')
    const { count, report } = await importSquarespace(payload, from)
    await refreshSite()
    const body = `<h2>Imported from ${from}</h2><p>${count} posts found.</p><pre style="white-space:pre-wrap;font:15px/1.6 system-ui">${report.join('\n')}</pre><p><a href="/admin/collections/posts">Open Blog posts in admin</a> · <a href="/blog">View blog</a></p>`
    return new Response(body, { headers: { 'Content-Type': 'text/html; charset=utf-8' } })
  } catch (e) {
    console.error('import-blog failed', e)
    return new Response(`Import failed: ${(e as Error).message}`, { status: 500, headers: { 'Content-Type': 'text/plain; charset=utf-8' } })
  }
}
