import { draftMode, headers } from 'next/headers'
import { redirect } from 'next/navigation'
import { db } from '@/lib/data'

/** Admin "Preview" button: shows the latest draft of a post to signed-in staff only. */
export async function GET(req: Request) {
  const u = new URL(req.url)
  const slug = (u.searchParams.get('slug') || '').replace(/[^a-z0-9-]/gi, '')
  const dm = await draftMode()
  if (u.searchParams.get('exit')) {
    dm.disable()
    redirect(slug ? `/blog/${slug}` : '/blog')
  }
  const { user } = await (await db()).auth({ headers: await headers() })
  if (!user || !['superadmin', 'editor'].includes(String(user.role))) redirect('/admin')
  if (!slug) return new Response('Save the post with a title first, then click Preview.', { status: 400 })
  dm.enable()
  redirect(`/blog/${slug}`)
}
