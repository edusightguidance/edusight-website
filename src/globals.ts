import type { GlobalConfig } from 'payload'
import { isSuper, staffOnly, superOnly } from './access'
import { refreshSite } from './lib/revalidate'

const hooks = { afterChange: [refreshSite] }

export const SiteSettings: GlobalConfig = {
  slug: 'site-settings',
  hooks,
  label: 'Site settings',
  admin: { group: 'Settings', hidden: ({ user }) => !isSuper(user as never) },
  access: { read: () => true, update: superOnly },
  fields: [
    { name: 'announcement', type: 'text', admin: { description: 'Optional banner at the very top of every page. Leave empty to hide.' } },
    { name: 'announcementLink', type: 'text' },
    {
      type: 'row',
      fields: [
        { name: 'phone', type: 'text', defaultValue: '+971 50 451 8940' },
        { name: 'whatsapp', type: 'text', defaultValue: '971504518940', admin: { description: 'Digits only, with country code' } },
        { name: 'email', type: 'email', defaultValue: 'edusightguidance@gmail.com' },
      ],
    },
    { name: 'address', type: 'text', defaultValue: 'Dubai, United Arab Emirates' },
    { name: 'licence', type: 'text', defaultValue: 'Licensed by the Department of Economy & Tourism, Dubai' },
    {
      name: 'socials',
      type: 'group',
      fields: [
        { name: 'instagram', type: 'text', defaultValue: 'https://www.instagram.com/edu.sight/' },
        { name: 'facebook', type: 'text', defaultValue: 'https://www.facebook.com/EduSightAE/' },
        { name: 'linkedin', type: 'text', defaultValue: 'https://www.linkedin.com/in/bhavanasood/' },
        { name: 'youtube', type: 'text' },
      ],
    },
    { name: 'googleReviewLink', type: 'text', admin: { description: 'Your Google Business "Write a review" link. Shows a "Review us on Google" button when filled.' } },
    { name: 'bookingLink', type: 'text', admin: { description: 'Where "Book a consultation" goes (Calendly, WhatsApp, etc.). Empty = contact page.' } },
  ],
}

export const Homepage: GlobalConfig = {
  slug: 'homepage',
  hooks,
  label: 'Homepage',
  admin: { group: 'Website content' },
  access: { read: () => true, update: staffOnly },
  fields: [
    { name: 'eyebrow', type: 'text', defaultValue: 'Career & education guidance · Dubai' },
    { name: 'heading', type: 'text', defaultValue: 'Choose your future with' },
    { name: 'highlight', type: 'text', defaultValue: 'clarity', admin: { description: 'The word shown with the hand-drawn underline' } },
    {
      name: 'subheading',
      type: 'textarea',
      defaultValue:
        'Psychometric assessments, subject choices, careers and university admissions — guided one-to-one by a counselling psychologist with 12+ years of experience.',
    },
    {
      name: 'stats',
      type: 'array',
      maxRows: 4,
      fields: [
        { name: 'value', type: 'text', required: true },
        { name: 'label', type: 'text', required: true },
      ],
    },
    { name: 'methodTitle', type: 'text', defaultValue: 'The EDUSIGHT way' },
    {
      name: 'method',
      type: 'array',
      maxRows: 5,
      fields: [
        { name: 'title', type: 'text', required: true },
        { name: 'text', type: 'textarea', required: true },
      ],
    },
    { name: 'ctaTitle', type: 'text', defaultValue: 'Not sure where to start?' },
    { name: 'ctaText', type: 'textarea', defaultValue: 'A 20-minute call is enough to map out the next step for your child. No pressure, no jargon.' },
  ],
}

export const About: GlobalConfig = {
  slug: 'about',
  hooks,
  label: 'About Bhavana',
  admin: { group: 'Website content' },
  access: { read: () => true, update: staffOnly },
  fields: [
    { name: 'photo', type: 'upload', relationTo: 'media' },
    { name: 'headline', type: 'text', defaultValue: 'Hi, I’m Bhavana.' },
    { name: 'role', type: 'text', defaultValue: 'Counselling Psychologist & Career Advisor · Founder, EDUSIGHT' },
    { name: 'intro', type: 'textarea' },
    { name: 'story', type: 'textarea' },
    { name: 'approach', type: 'textarea' },
    { name: 'expertise', type: 'array', fields: [{ name: 'title', type: 'text', required: true }, { name: 'text', type: 'textarea' }] },
    { name: 'awards', type: 'array', fields: [{ name: 'title', type: 'text', required: true }, { name: 'year', type: 'text' }] },
  ],
}

export const _staff = staffOnly
