import React from 'react'

/* Official EDUSIGHT logo (public/logo.png) */
export const Logo = () => (
  <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
    {/* eslint-disable-next-line @next/next/no-img-element */}
    <img src="/logo.png" width={84} height={84} alt="EDUSIGHT" />
    <div>
      <div style={{ fontWeight: 800, fontSize: 26, letterSpacing: 3 }}>EDUSIGHT</div>
      <div style={{ fontSize: 11, letterSpacing: 2, opacity: 0.7 }}>WEBSITE ADMIN</div>
    </div>
  </div>
)

// eslint-disable-next-line @next/next/no-img-element
export const Icon = () => <img src="/logo.png" width={30} height={30} alt="EDUSIGHT" />
