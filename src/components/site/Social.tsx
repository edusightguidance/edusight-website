import React from 'react'

const PATHS: Record<string, React.ReactNode> = {
  instagram: <><rect x="3" y="3" width="18" height="18" rx="5" /><circle cx="12" cy="12" r="4" /><circle cx="17.5" cy="6.5" r="1" fill="currentColor" /></>,
  facebook: <path d="M14 8h3V4h-3a4 4 0 00-4 4v2H8v4h2v7h4v-7h3l1-4h-4V8z" />,
  linkedin: <><rect x="3" y="3" width="18" height="18" rx="3" /><path d="M8 10v7M8 7v.01M12 17v-4a2 2 0 014 0v4M12 10v7" /></>,
  youtube: <><rect x="2.5" y="5.5" width="19" height="13" rx="4" /><path d="M10 9.5l5 2.5-5 2.5z" fill="currentColor" /></>,
  whatsapp: <path d="M4 20l1.3-3.9A8 8 0 1112 20a8 8 0 01-3.9-1L4 20zM9 9c0 3 3 6 6 6l1-1.5-2-1-1 1c-1 0-2.5-1.5-2.5-2.5l1-1-1-2z" />,
  google: <path d="M20 12.2c0-.6 0-1.1-.1-1.7H12v3.3h4.5a4 4 0 01-1.7 2.6v2.1h2.8c1.6-1.5 2.4-3.7 2.4-6.3zM12 20.5c2.3 0 4.2-.8 5.6-2l-2.8-2.1c-.8.5-1.7.8-2.8.8-2.2 0-4-1.5-4.7-3.4H4.4v2.2A8.5 8.5 0 0012 20.5zM7.3 13.8a5 5 0 010-3.3V8.3H4.4a8.5 8.5 0 000 7.7zM12 6.9c1.2 0 2.4.4 3.3 1.3l2.5-2.5A8.5 8.5 0 004.4 8.3l2.9 2.2C8 8.4 9.8 6.9 12 6.9z" />,
  x: <path d="M4 4l16 16M20 4L4 20" />,
  link: <><path d="M10 14a4 4 0 005.7 0l3-3a4 4 0 00-5.7-5.7l-1 1" /><path d="M14 10a4 4 0 00-5.7 0l-3 3a4 4 0 005.7 5.7l1-1" /></>,
  website: <><circle cx="12" cy="12" r="9" /><path d="M3 12h18M12 3a14 14 0 010 18M12 3a14 14 0 000 18" /></>,
  other: <path d="M5 12h14" />,
}
const FILLED = new Set(['google'])

export function SocialIcon({ name, size = 20 }: { name: string; size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" aria-hidden="true" fill={FILLED.has(name) ? 'currentColor' : 'none'} stroke={FILLED.has(name) ? 'none' : 'currentColor'} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      {PATHS[name] || PATHS.other}
    </svg>
  )
}

export const SOURCE_LABEL: Record<string, string> = {
  website: 'EDUSIGHT website', google: 'Google', linkedin: 'LinkedIn', facebook: 'Facebook', instagram: 'Instagram', other: 'Client',
}

type Socials = { instagram?: string | null; facebook?: string | null; linkedin?: string | null; youtube?: string | null } | null | undefined

export function SocialLinks({ socials, size = 20, className = 'socials' }: { socials: Socials; size?: number; className?: string }) {
  const items = (['instagram', 'facebook', 'linkedin', 'youtube'] as const).filter((k) => socials?.[k] && !/bhavana/i.test(socials[k] || ''))
  if (!items.length) return null
  return (
    <div className={className}>
      {items.map((k) => (
        <a key={k} href={socials![k]!} target="_blank" rel="noreferrer" aria-label={`EDUSIGHT on ${k}`}>
          <SocialIcon name={k} size={size} />
        </a>
      ))}
    </div>
  )
}
