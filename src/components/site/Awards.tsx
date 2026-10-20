'use client'
import { useEffect, useState } from 'react'

type Img = { url?: string | null; alt?: string | null }
export type AwardItem = { id: number; title: string; organisation?: string | null; year?: string | null; kind?: string | null; note?: string | null; photos: Img[] }

const KIND: Record<string, string> = { award: '🏆 Award', speaking: '🎤 Speaking', recognition: '⭐ Recognition' }

export function AwardsGrid({ items, dark = false }: { items: AwardItem[]; dark?: boolean }) {
  const [open, setOpen] = useState<{ a: AwardItem; i: number } | null>(null)
  useEffect(() => {
    if (!open) return
    const key = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(null)
      if (e.key === 'ArrowRight') setOpen((o) => o && { ...o, i: (o.i + 1) % o.a.photos.length })
      if (e.key === 'ArrowLeft') setOpen((o) => o && { ...o, i: (o.i - 1 + o.a.photos.length) % o.a.photos.length })
    }
    window.addEventListener('keydown', key)
    return () => window.removeEventListener('keydown', key)
  }, [open])
  return (
    <>
      <div className={`award-grid${dark ? ' dark' : ''}`}>
        {items.map((a) => (
          <article key={a.id} className="award">
            {a.photos[0]?.url ? (
              <button type="button" className="award-photo" onClick={() => setOpen({ a, i: 0 })} aria-label={`View photos: ${a.title}`}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={a.photos[0].url} alt={a.photos[0].alt || a.title} loading="lazy" />
                {a.photos.length > 1 && <span className="award-count">+{a.photos.length - 1}</span>}
              </button>
            ) : (
              <div className="award-photo award-empty" aria-hidden="true"><span>{a.kind === 'speaking' ? '🎤' : '🏆'}</span></div>
            )}
            <div className="award-body">
              <div className="award-meta"><span>{KIND[a.kind || 'award']}</span>{a.year && <b>{a.year}</b>}</div>
              <h3>{a.title}</h3>
              {a.organisation && <p className="award-org">{a.organisation}</p>}
              {a.note && <p className="award-note">{a.note}</p>}
            </div>
          </article>
        ))}
      </div>
      {open && (
        <div className="lightbox" role="dialog" aria-modal="true" aria-label={open.a.title} onClick={() => setOpen(null)}>
          <figure onClick={(e) => e.stopPropagation()}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={open.a.photos[open.i].url || ''} alt={open.a.photos[open.i].alt || open.a.title} />
            <figcaption>{open.a.title}{open.a.year ? ` · ${open.a.year}` : ''}{open.a.photos.length > 1 ? ` · ${open.i + 1}/${open.a.photos.length}` : ''}</figcaption>
            {open.a.photos.length > 1 && (
              <>
                <button type="button" className="lb-prev" aria-label="Previous photo" onClick={() => setOpen({ ...open, i: (open.i - 1 + open.a.photos.length) % open.a.photos.length })}>←</button>
                <button type="button" className="lb-next" aria-label="Next photo" onClick={() => setOpen({ ...open, i: (open.i + 1) % open.a.photos.length })}>→</button>
              </>
            )}
            <button type="button" className="lb-close" aria-label="Close" onClick={() => setOpen(null)}>✕</button>
          </figure>
        </div>
      )}
    </>
  )
}
