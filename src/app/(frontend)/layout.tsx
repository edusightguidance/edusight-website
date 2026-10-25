import React from 'react'
import type { Metadata } from 'next'
import './styles.css'
import { Header } from '@/components/site/Header'
import { Footer } from '@/components/site/Footer'
import { getSettings, getUser, waLink } from '@/lib/data'

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'https://www.edusightconsulting.com'),
  title: { default: 'EDUSIGHT · Career & University Guidance in Dubai', template: '%s · EDUSIGHT' },
  description:
    'Psychometric career assessments, subject selection, curriculum advice and university admissions guidance for students and parents in Dubai and the UAE. Led by the EDUSIGHT team.',
}

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const [s, user] = await Promise.all([getSettings(), getUser()])
  const booking = s.bookingLink || '/contact'
  return (
    <html lang="en">
      <body>
        {s.announcement ? (
          <div className="announce">
            {s.announcement} {s.announcementLink ? <a href={s.announcementLink}>Find out more →</a> : null}
          </div>
        ) : null}
        <Header loggedIn={!!user} booking={booking} />
        <main>{children}</main>
        <Footer s={s} />
        <a className="wa-float" href={waLink(s.whatsapp)} aria-label="Chat on WhatsApp" target="_blank" rel="noreferrer">
          <svg width="30" height="30" viewBox="0 0 24 24" fill="#fff" aria-hidden="true"><path d="M12 2a10 10 0 00-8.6 15.1L2 22l5-1.3A10 10 0 1012 2zm5.3 14.1c-.2.6-1.3 1.2-1.8 1.2-.5.1-1 .2-3.3-.7-2.8-1.1-4.5-4-4.7-4.2-.1-.2-1.1-1.5-1.1-2.8s.7-2 1-2.3c.2-.3.5-.3.7-.3h.5c.2 0 .4 0 .6.5l.8 2c.1.2.1.4 0 .5l-.3.5-.4.4c-.1.2-.3.3-.1.6.2.3.8 1.3 1.7 2.1 1.2 1 2.1 1.4 2.4 1.5.3.1.5.1.6-.1l.9-1c.2-.3.4-.2.7-.1l1.9.9c.3.1.5.2.5.3.1.2.1.7-.1 1.3z" /></svg>
        </a>
      </body>
    </html>
  )
}
