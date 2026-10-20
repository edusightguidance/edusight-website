'use client'
import { useRef } from 'react'

export function Carousel({ children, label }: { children: React.ReactNode; label: string }) {
  const ref = useRef<HTMLDivElement>(null)
  const go = (d: number) => ref.current?.scrollBy({ left: d * (ref.current.clientWidth * 0.9), behavior: 'smooth' })
  return (
    <div className="carousel" aria-label={label} role="region">
      <div className="carousel-track" ref={ref}>{children}</div>
      <div className="carousel-nav">
        <button type="button" onClick={() => go(-1)} aria-label="Previous reviews">←</button>
        <button type="button" onClick={() => go(1)} aria-label="Next reviews">→</button>
      </div>
    </div>
  )
}
