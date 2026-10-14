'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useEffect, useState } from 'react'
import { Icon, Mark } from './Icon'

const LINKS = [
  ['/services', 'Services'],
  ['/assessments', 'Assessments'],
  ['/career-explorer', 'Career Explorer'],
  ['/careers', 'Careers'],
  ['/books', 'Books'],
  ['/resources', 'Resources'],
  ['/about', 'About'],
]

export function Header({ loggedIn, booking }: { loggedIn: boolean; booking: string }) {
  const path = usePathname()
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  useEffect(() => {
    const f = () => setScrolled(window.scrollY > 8)
    f()
    window.addEventListener('scroll', f)
    return () => window.removeEventListener('scroll', f)
  }, [])
  useEffect(() => setOpen(false), [path])
  return (
    <header className={`header${scrolled ? ' scrolled' : ''}`}>
      <div className="wrap">
        <Link href="/" className="logo" aria-label="EDUSIGHT home">
          <Mark />
          <span>
            <b>EDUSIGHT</b>
            <small>CLARITY · CONFIDENCE · DIRECTION</small>
          </span>
        </Link>
        <nav className="nav" aria-label="Main">
          {LINKS.map(([href, label]) => (
            <Link key={href} href={href} aria-current={path.startsWith(href) ? 'page' : undefined}>
              {label}
            </Link>
          ))}
        </nav>
        <div className="nav-cta">
          <Link href={loggedIn ? '/portal' : '/login'} className="btn btn-ghost btn-sm hide-m">
            {loggedIn ? 'My portal' : 'Log in'}
          </Link>
          <a href={booking} className="btn btn-primary btn-sm hide-m">Book a call</a>
          <button className="burger" aria-label="Open menu" aria-expanded={open} onClick={() => setOpen(!open)}>
            <Icon name="menu" size={28} />
          </button>
        </div>
      </div>
      <nav className={`mobile-nav${open ? ' open' : ''}`} aria-label="Mobile">
        {LINKS.map(([href, label]) => (
          <Link key={href} href={href}>{label}</Link>
        ))}
        <Link href={loggedIn ? '/portal' : '/login'}>{loggedIn ? 'My portal' : 'Log in / Sign up'}</Link>
        <a href={booking} className="btn btn-primary" style={{ marginTop: 12 }}>Book a call</a>
      </nav>
    </header>
  )
}
