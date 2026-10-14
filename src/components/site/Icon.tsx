import React from 'react'

const P: Record<string, React.ReactNode> = {
  compass: <><circle cx="12" cy="12" r="9" /><path d="M15.5 8.5l-2 5-5 2 2-5z" /></>,
  book: <><path d="M4 5a2 2 0 012-2h13v16H6a2 2 0 00-2 2z" /><path d="M4 19V5" /><path d="M9 7h6" /></>,
  cap: <><path d="M2 9l10-5 10 5-10 5z" /><path d="M6 11v5c3 2 9 2 12 0v-5" /></>,
  globe: <><circle cx="12" cy="12" r="9" /><path d="M3 12h18M12 3a14 14 0 010 18M12 3a14 14 0 000 18" /></>,
  heart: <path d="M12 20s-7-4.4-7-10a4 4 0 017-2.6A4 4 0 0119 10c0 5.6-7 10-7 10z" />,
  users: <><circle cx="9" cy="8" r="3.5" /><path d="M2.5 20a6.5 6.5 0 0113 0" /><path d="M16 4.5a3.5 3.5 0 010 7M18 14a6 6 0 013.5 6" /></>,
  spark: <path d="M12 3v4M12 17v4M3 12h4M17 12h4M6 6l2.5 2.5M15.5 15.5L18 18M18 6l-2.5 2.5M8.5 15.5L6 18" />,
  chart: <><path d="M4 20V10M10 20V4M16 20v-7M22 20H2" /></>,
  stethoscope: <><path d="M5 3v6a5 5 0 0010 0V3" /><path d="M10 14v2a5 5 0 0010 0v-2" /><circle cx="20" cy="12" r="2" /></>,
  cog: <><circle cx="12" cy="12" r="3" /><path d="M12 2v3M12 19v3M2 12h3M19 12h3M4.9 4.9l2.1 2.1M17 17l2.1 2.1M4.9 19.1L7 17M17 7l2.1-2.1" /></>,
  scale: <><path d="M12 3v18M7 21h10M5 7h14" /><path d="M5 7l-3 6a3 3 0 006 0zM19 7l-3 6a3 3 0 006 0z" /></>,
  palette: <><path d="M12 3a9 9 0 100 18c1 0 1.5-.8 1.5-1.6 0-1.3 1-2.4 2.4-2.4H18a3 3 0 003-3c0-6-4-11-9-11z" /><circle cx="7.5" cy="11" r="1" /><circle cx="10" cy="7" r="1" /><circle cx="15" cy="7.5" r="1" /></>,
  brain: <><path d="M9 4a3 3 0 00-3 3 3 3 0 00-2 5 3 3 0 002 5 3 3 0 006 0V4a3 3 0 00-3 0z" /><path d="M15 4a3 3 0 013 3 3 3 0 012 5 3 3 0 01-2 5 3 3 0 01-6 0" /></>,
  briefcase: <><rect x="3" y="7" width="18" height="13" rx="2" /><path d="M8 7V5a2 2 0 012-2h4a2 2 0 012 2v2M3 13h18" /></>,
  leaf: <><path d="M5 19c0-9 6-14 15-14 0 9-5 15-14 15" /><path d="M5 19c3-4 6-6 9-7" /></>,
  school: <><path d="M3 21h18M5 21V10l7-5 7 5v11" /><path d="M10 21v-5h4v5" /></>,
  arrow: <path d="M5 12h14M13 6l6 6-6 6" />,
  check: <path d="M5 12.5l4.5 4.5L19 7" />,
  download: <><path d="M12 3v12M7 10l5 5 5-5" /><path d="M4 19h16" /></>,
  menu: <path d="M4 7h16M4 12h16M4 17h16" />,
  lock: <><rect x="4" y="10" width="16" height="11" rx="2" /><path d="M8 10V7a4 4 0 018 0v3" /></>,
}

export function Icon({ name, size = 24, stroke = 2 }: { name: string; size?: number; stroke?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={stroke} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      {P[name] || P.compass}
    </svg>
  )
}

export const TINTS = ['t-coral', 't-lagoon', 't-marigold', 't-lilac']

export function Mark({ size = 38 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 40 40" aria-hidden="true">
      <rect width="40" height="40" rx="12" fill="#16163F" />
      <path d="M12 26 L20 10 L28 26" stroke="#FFB627" strokeWidth="3.5" fill="none" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx="20" cy="27" r="3.2" fill="#FF6B4A" />
    </svg>
  )
}

export function Hl({ children, color = '#FFB627' }: { children: React.ReactNode; color?: string }) {
  return (
    <span className="hl">
      <span className="hl-wrap">{children}</span>
      <svg viewBox="0 0 200 20" preserveAspectRatio="none" aria-hidden="true">
        <path d="M3 14 C 50 4, 120 4, 197 10" stroke={color} strokeWidth="9" fill="none" strokeLinecap="round" />
      </svg>
    </span>
  )
}
