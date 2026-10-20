'use client'
import { useState } from 'react'
import { SocialIcon } from './Social'

export function ShareBar({ url, title, label = 'Share' }: { url: string; title: string; label?: string }) {
  const [copied, setCopied] = useState(false)
  const u = encodeURIComponent(url)
  const t = encodeURIComponent(title)
  const links: [string, string, string][] = [
    ['whatsapp', `https://wa.me/?text=${t}%20${u}`, 'WhatsApp'],
    ['linkedin', `https://www.linkedin.com/sharing/share-offsite/?url=${u}`, 'LinkedIn'],
    ['facebook', `https://www.facebook.com/sharer/sharer.php?u=${u}`, 'Facebook'],
    ['x', `https://twitter.com/intent/tweet?url=${u}&text=${t}`, 'X'],
  ]
  return (
    <div className="share">
      <span className="muted">{label}</span>
      {links.map(([k, href, name]) => (
        <a key={k} href={href} target="_blank" rel="noreferrer" aria-label={`Share on ${name}`}><SocialIcon name={k} size={18} /></a>
      ))}
      <button
        type="button"
        aria-label="Copy link"
        onClick={() => navigator.clipboard?.writeText(url).then(() => { setCopied(true); setTimeout(() => setCopied(false), 1800) })}
      >
        <SocialIcon name="link" size={18} />
        {copied && <small>Copied!</small>}
      </button>
    </div>
  )
}
