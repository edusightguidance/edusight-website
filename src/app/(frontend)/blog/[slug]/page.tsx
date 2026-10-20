import Link from 'next/link'
import { draftMode } from 'next/headers'
import { notFound, permanentRedirect } from 'next/navigation'
import { db, getSettings, getUser } from '@/lib/data'
import { SITE, fmtDate, findPosts } from '@/lib/blog'
import { Rich } from '@/components/site/Rich'
import { PostCard } from '@/components/site/PostCard'
import { ShareBar } from '@/components/site/ShareBar'

type Img = { url?: string | null; alt?: string | null }
type Rel = { id: number; title: string; slug?: string | null }

async function load(slug: string) {
  const payload = await db()
  const { isEnabled } = await draftMode()
  const preview = isEnabled && !!(await getUser())?.role?.match(/superadmin|editor/)
  const r = await payload.find({
    collection: 'posts',
    where: { slug: { equals: slug } },
    limit: 1,
    depth: 1,
    draft: preview,
    overrideAccess: preview,
  })
  // Posts created before drafts were switched on have no draft history yet — show the saved version.
  const post = r.docs[0] || (preview ? (await payload.find({ collection: 'posts', where: { slug: { equals: slug } }, limit: 1, depth: 1, overrideAccess: true })).docs[0] : undefined)
  return { post, preview }
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { post: p } = await load((await params).slug)
  if (!p) return {}
  const img = p.image && typeof p.image === 'object' ? (p.image as Img) : null
  const title = p.seo?.metaTitle || p.title || ''
  const description = p.seo?.metaDescription || p.excerpt || ''
  return {
    title,
    description,
    alternates: { canonical: `/blog/${p.slug}` },
    openGraph: { type: 'article', title, description, publishedTime: p.publishedAt, authors: [p.author || 'Bhavana Sood'], ...(img?.url ? { images: [img.url] } : {}) },
    twitter: { card: 'summary_large_image', title, description },
  }
}

export default async function Post({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const { post: p, preview } = await load(slug)
  if (!p) {
    const old = await (await db()).find({ collection: 'posts', where: { legacySlugs: { equals: slug } }, limit: 1, depth: 0, overrideAccess: true })
    if (old.docs[0]?.slug) permanentRedirect(`/blog/${old.docs[0].slug}`)
    notFound()
  }
  const settings = await getSettings()
  const img = p.image && typeof p.image === 'object' ? (p.image as Img) : null
  const cats = ((p.categories || []) as unknown[]).filter((c): c is Rel => !!c && typeof c === 'object')
  const tags = ((p.tags || []) as unknown[]).filter((c): c is Rel => !!c && typeof c === 'object')
  let related = cats[0] ? (await findPosts({ categoryId: cats[0].id, limit: 3, exclude: p.id })).docs : []
  if (related.length < 3) related = [...related, ...(await findPosts({ limit: 4, exclude: p.id })).docs.filter((d) => !related.some((r) => r.id === d.id))].slice(0, 3)
  const url = `${SITE()}/blog/${p.slug}`
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: p.title,
    description: p.excerpt,
    datePublished: p.publishedAt,
    dateModified: p.updatedAt,
    author: { '@type': 'Person', name: p.author || 'Bhavana Sood' },
    publisher: { '@type': 'Organization', name: 'EDUSIGHT', logo: { '@type': 'ImageObject', url: `${SITE()}/logo.png` } },
    mainEntityOfPage: url,
    ...(img?.url ? { image: img.url.startsWith('http') ? img.url : `${SITE()}${img.url}` } : {}),
  }
  return (
    <article className="section" style={{ paddingTop: 40 }}>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      {preview && (
        <div className="announce" style={{ position: 'sticky', top: 76, zIndex: 40 }}>
          Preview mode — {p._status === 'published' ? 'published version may differ' : 'this post is not published yet'}. <a href={`/x/preview?exit=1&slug=${p.slug}`}>Exit preview</a>
        </div>
      )}
      <div className="narrow">
        <div className="crumbs"><Link href="/blog">Blog</Link>{cats[0] && <> / <Link href={`/blog/category/${cats[0].slug}`}>{cats[0].title}</Link></>}</div>
        <h1 style={{ fontSize: 'clamp(2.2rem,5vw,3.6rem)' }}>{p.title}</h1>
        {p.excerpt && <p className="lead">{p.excerpt}</p>}
        <p className="post-meta" style={{ marginBottom: 20 }}>By {p.author || 'Bhavana Sood'} · {fmtDate(p.publishedAt)}{p.readingMinutes ? ` · ${p.readingMinutes} min read` : ''}</p>
        <ShareBar url={url} title={p.title || ''} />
        {/* eslint-disable-next-line @next/next/no-img-element */}
        {img?.url && <img src={img.url} alt={img.alt || ''} style={{ borderRadius: 24, margin: '24px 0', width: '100%' }} />}
        <Rich data={p.body} />
        {tags.length > 0 && (
          <div className="chips" style={{ margin: '28px 0' }}>
            {tags.map((t) => <Link key={t.id} href={`/blog/tag/${t.slug}`} className="chip">#{t.title}</Link>)}
          </div>
        )}
        <ShareBar url={url} title={p.title || ''} label="Found this useful? Share it" />
        <div className="panel panel-butter" style={{ marginTop: 40 }}>
          <h3>Want this applied to your child?</h3>
          <p className="muted">Book a call and we’ll look at their subjects, interests and options together.</p>
          <a href={settings.bookingLink || '/contact'} className="btn btn-primary">Book a call</a>
        </div>
      </div>
      {related.length > 0 && (
        <div className="wrap" style={{ marginTop: 64 }}>
          <h2 style={{ fontSize: '1.9rem' }}>Keep reading</h2>
          <div className="grid g3">{related.map((r) => <PostCard key={r.id} p={r} />)}</div>
        </div>
      )}
    </article>
  )
}
