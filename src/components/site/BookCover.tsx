type B = { title: string; subtitle?: string | null; coverColor?: string | null; cover?: unknown }

export function BookCover({ b }: { b: B }) {
  const img = b.cover && typeof b.cover === 'object' ? (b.cover as { url?: string; alt?: string }) : null
  // eslint-disable-next-line @next/next/no-img-element
  if (img?.url) return <img src={img.url} alt={img.alt || b.title} style={{ borderRadius: '6px 16px 16px 6px', aspectRatio: '3/4.2', objectFit: 'cover', width: '100%' }} />
  return (
    <div className="book-cover" style={{ background: b.coverColor || '#16163F' }}>
      <small>EDUSIGHT GUIDES</small>
      <div><b>{b.title}</b><p style={{ margin: '10px 0 0', fontSize: '0.88rem', opacity: 0.85 }}>{b.subtitle}</p></div>
      <small>EDUSIGHT</small>
    </div>
  )
}
