import Link from 'next/link'
import { Mark } from './Icon'
import { SocialLinks } from './Social'
import { waLink } from '@/lib/data'

type S = {
  phone?: string | null
  whatsapp?: string | null
  email?: string | null
  address?: string | null
  licence?: string | null
  socials?: { instagram?: string | null; facebook?: string | null; linkedin?: string | null; youtube?: string | null } | null
}

export function Footer({ s }: { s: S }) {
  return (
    <footer className="footer">
      <div className="wrap">
        <div className="footer-grid">
          <div>
            <div className="logo" style={{ color: '#fff', marginBottom: 16 }}>
              <Mark />
              <b>EDUSIGHT</b>
            </div>
            <p>Career, curriculum and university guidance for students and families — led by counselling psychologist Bhavana Sood.</p>
            <p style={{ fontSize: '0.86rem' }}>{s.licence}</p>
          </div>
          <div>
            <h4>Explore</h4>
            <ul>
              <li><Link href="/services">Services</Link></li>
              <li><Link href="/assessments">Psychometric assessments</Link></li>
              <li><Link href="/career-explorer">Career Explorer</Link></li>
              <li><Link href="/careers">Career library</Link></li>
              <li><Link href="/books">Books</Link></li>
            </ul>
          </div>
          <div>
            <h4>EDUSIGHT</h4>
            <ul>
              <li><Link href="/about">About Bhavana</Link></li>
              <li><Link href="/awards">Awards</Link></li>
              <li><Link href="/blog">Blog</Link></li>
              <li><Link href="/reviews">Reviews</Link></li>
              <li><Link href="/contact">Contact</Link></li>
              <li><Link href="/portal">Student portal</Link></li>
              <li><Link href="/p/privacy-policy">Privacy policy</Link></li>
            </ul>
          </div>
          <div>
            <h4>Talk to us</h4>
            <ul>
              <li><a href={waLink(s.whatsapp)}>WhatsApp {s.phone}</a></li>
              <li><a href={`mailto:${s.email}`}>{s.email}</a></li>
              <li>{s.address}</li>
            </ul>
            <SocialLinks socials={s.socials} size={22} className="socials socials-dark" />
          </div>
        </div>
        <div className="footer-bottom">
          <span>© {new Date().getFullYear()} EDUSIGHT. All rights reserved.</span>
          <span>Made with care in Dubai</span>
        </div>
      </div>
    </footer>
  )
}
