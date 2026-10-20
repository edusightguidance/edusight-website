import Link from 'next/link'
import { fmtDate } from '@/lib/blog'

type Img = { url?: string | null; alt?: string | null; sizes?: unknown }
type Cat = { id: number; title: string; slug?: string | null }
export type CardPost = { id: number; slug?: string | null; title?: string | null; excerpt?: string | null; image?: unknown; categories?: unknown[] | null; publishedAt?: string | null; readingMinutes?: number | null }

const COLORS = ['#16163F', '#0FA3A3', '#FF6B4A', '#7C6CF0', '#B4772E']

export function PostCard({ p, big = false }: { p: CardPost; big?: boolean }) {
  const img = p.image && typeof p.image === 'object' ? (p.image as Img) : null
  const cats = (p.categories || []).filter((c): c is Cat => !!c && typeof c === 'object')
  return (
    <Link href={`/blog/${p.slug}`} className={`post-card${big ? ' big' : ''}`}>
      <div className="post-cover" style={{ background: COLORS[p.id % COLORS.length] }}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        {img?.url ? <img src={img.url} alt={img.alt || ''} loading="lazy" /> : <img src="/logo.png" alt="" className="post-logo" />}
      </div>
      <div className="post-body">
        {cats[0] && <span className="badge soft">{cats[0].title}</span>}
        <h3>{p.title}</h3>
        {p.excerpt && <p>{p.excerpt}</p>}
        <span className="post-meta">{fmtDate(p.publishedAt)}{p.readingMinutes ? ` · ${p.readingMinutes} min read` : ''}</span>
      </div>
    </Link>
  )
}
