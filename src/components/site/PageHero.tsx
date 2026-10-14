import Link from 'next/link'
import React from 'react'

export function PageHero({ eyebrow, title, lead, crumbs, children }: { eyebrow?: string; title: React.ReactNode; lead?: string | null; crumbs?: [string, string][]; children?: React.ReactNode }) {
  return (
    <section className="page-hero">
      <div className="wrap">
        {crumbs && (
          <div className="crumbs">
            {crumbs.map(([href, label]) => (
              <span key={href}><Link href={href}>{label}</Link> / </span>
            ))}
          </div>
        )}
        {eyebrow && <p className="eyebrow">{eyebrow}</p>}
        <h1>{title}</h1>
        {lead && <p className="lead">{lead}</p>}
        {children}
      </div>
    </section>
  )
}
