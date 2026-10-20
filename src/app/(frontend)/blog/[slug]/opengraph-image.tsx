import { ImageResponse } from 'next/og'
import { db } from '@/lib/data'

export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

export default async function OG({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const p = (await (await db()).find({ collection: 'posts', where: { slug: { equals: slug } }, limit: 1, depth: 0 })).docs[0]
  return new ImageResponse(
    (
      <div style={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', background: '#16163F', padding: 72, color: '#fff' }}>
        <div style={{ display: 'flex', fontSize: 30, letterSpacing: 6, color: '#FFB627', fontWeight: 700 }}>EDUSIGHT · BLOG</div>
        <div style={{ display: 'flex', fontSize: 66, fontWeight: 800, lineHeight: 1.08 }}>{p?.title || 'EDUSIGHT'}</div>
        <div style={{ display: 'flex', fontSize: 28, color: '#c9c8e6' }}>Bhavana Sood · Career & education guidance, Dubai</div>
      </div>
    ),
    size,
  )
}
