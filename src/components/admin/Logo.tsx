import React from 'react'

export const Logo = () => (
  <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
    <Icon />
    <div>
      <div style={{ fontWeight: 800, fontSize: 26, letterSpacing: 3 }}>EDUSIGHT</div>
      <div style={{ fontSize: 11, letterSpacing: 2, opacity: 0.7 }}>WEBSITE ADMIN</div>
    </div>
  </div>
)

export const Icon = () => (
  <svg width="34" height="34" viewBox="0 0 40 40" aria-hidden="true">
    <rect width="40" height="40" rx="12" fill="#16163F" />
    <path d="M12 26 L20 10 L28 26" stroke="#FFB627" strokeWidth="3.5" fill="none" strokeLinecap="round" strokeLinejoin="round" />
    <circle cx="20" cy="27" r="3.2" fill="#FF6B4A" />
  </svg>
)
