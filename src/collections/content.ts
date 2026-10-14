import type { CollectionConfig, Field } from 'payload'
import { publishedOrStaff, staffOnly } from '../access'

const slugField: Field = {
  name: 'slug',
  type: 'text',
  required: true,
  unique: true,
  index: true,
  admin: { position: 'sidebar', description: 'Web address, e.g. "university-admissions"' },
  hooks: {
    beforeValidate: [
      ({ value, data }) =>
        (value || data?.title || '')
          .toString()
          .toLowerCase()
          .trim()
          .replace(/[^a-z0-9]+/g, '-')
          .replace(/(^-|-$)/g, ''),
    ],
  },
}
const published: Field = {
  name: 'published',
  type: 'checkbox',
  defaultValue: true,
  admin: { position: 'sidebar', description: 'Untick to hide from the website' },
}
const order: Field = {
  name: 'order',
  type: 'number',
  defaultValue: 10,
  admin: { position: 'sidebar', description: 'Lower numbers show first' },
}
const seo: Field = {
  name: 'seo',
  type: 'group',
  label: 'Google listing (optional)',
  fields: [
    { name: 'metaTitle', type: 'text' },
    { name: 'metaDescription', type: 'textarea' },
  ],
}
const contentAccess = { read: publishedOrStaff, create: staffOnly, update: staffOnly, delete: staffOnly }

export const Services: CollectionConfig = {
  slug: 'services',
  labels: { singular: 'Service', plural: 'Services & Specializations' },
  admin: { useAsTitle: 'title', defaultColumns: ['title', 'kind', 'published', 'order'], group: 'Website content' },
  access: contentAccess,
  defaultSort: 'order',
  fields: [
    { name: 'title', type: 'text', required: true },
    {
      name: 'kind',
      type: 'select',
      required: true,
      defaultValue: 'service',
      options: [
        { label: 'Service', value: 'service' },
        { label: 'Career specialization', value: 'specialization' },
      ],
    },
    { name: 'tagline', type: 'text' },
    { name: 'summary', type: 'textarea', required: true },
    {
      name: 'icon',
      type: 'select',
      defaultValue: 'compass',
      options: ['compass', 'book', 'cap', 'globe', 'heart', 'users', 'spark', 'chart', 'stethoscope', 'cog', 'scale', 'palette', 'brain', 'briefcase', 'leaf', 'school'],
    },
    { name: 'image', type: 'upload', relationTo: 'media' },
    { name: 'body', type: 'richText' },
    {
      name: 'points',
      type: 'array',
      label: 'What is included',
      fields: [
        { name: 'title', type: 'text', required: true },
        { name: 'text', type: 'textarea' },
      ],
    },
    {
      name: 'audience',
      type: 'select',
      hasMany: true,
      options: ['Students', 'Parents', 'Schools', 'Graduates'],
    },
    slugField,
    published,
    order,
    seo,
  ],
}

export const Careers: CollectionConfig = {
  slug: 'careers',
  labels: { singular: 'Career', plural: 'Career Library' },
  admin: { useAsTitle: 'title', defaultColumns: ['title', 'stream', 'riasec', 'published'], group: 'Website content' },
  access: contentAccess,
  defaultSort: 'title',
  fields: [
    { name: 'title', type: 'text', required: true },
    {
      name: 'stream',
      type: 'select',
      required: true,
      options: [
        { label: 'Biological & Health Sciences', value: 'bio' },
        { label: 'Engineering & Technology', value: 'eng' },
        { label: 'Commerce, Business & Finance', value: 'com' },
        { label: 'Humanities, Arts & Media', value: 'hum' },
        { label: 'Combination / Hybrid', value: 'combo' },
      ],
    },
    {
      name: 'riasec',
      type: 'select',
      hasMany: true,
      label: 'Interest codes (RIASEC)',
      admin: { description: 'Used by the Career Explorer to match students' },
      options: [
        { label: 'Realistic', value: 'R' },
        { label: 'Investigative', value: 'I' },
        { label: 'Artistic', value: 'A' },
        { label: 'Social', value: 'S' },
        { label: 'Enterprising', value: 'E' },
        { label: 'Conventional', value: 'C' },
      ],
    },
    { name: 'summary', type: 'textarea', required: true },
    { name: 'dayToDay', type: 'textarea', label: 'What you actually do' },
    { name: 'subjects', type: 'text', label: 'Helpful school subjects' },
    { name: 'routes', type: 'textarea', label: 'Study routes & degrees' },
    { name: 'entryTests', type: 'text', label: 'Entrance exams' },
    { name: 'skills', type: 'text', label: 'Key skills' },
    {
      name: 'outlook',
      type: 'select',
      defaultValue: 'growing',
      options: [
        { label: 'Growing fast', value: 'hot' },
        { label: 'Growing', value: 'growing' },
        { label: 'Stable', value: 'stable' },
      ],
    },
    slugField,
    published,
  ],
}

export const Books: CollectionConfig = {
  slug: 'books',
  admin: { useAsTitle: 'title', defaultColumns: ['title', 'format', 'price', 'published'], group: 'Shop' },
  access: contentAccess,
  defaultSort: 'order',
  fields: [
    { name: 'title', type: 'text', required: true },
    { name: 'subtitle', type: 'text' },
    { name: 'cover', type: 'upload', relationTo: 'media' },
    { name: 'coverColor', type: 'text', defaultValue: '#16163F', admin: { description: 'Used when no cover image is uploaded' } },
    { name: 'description', type: 'textarea', required: true },
    { name: 'audience', type: 'text', admin: { description: 'e.g. Grades 9–12 and parents' } },
    {
      type: 'row',
      fields: [
        { name: 'price', type: 'number', label: 'Price (AED)', required: true, defaultValue: 0 },
        {
          name: 'format',
          type: 'select',
          defaultValue: 'ebook',
          options: [
            { label: 'eBook (PDF download)', value: 'ebook' },
            { label: 'Printed copy', value: 'print' },
            { label: 'eBook + printed', value: 'both' },
          ],
        },
      ],
    },
    {
      name: 'ebookFile',
      type: 'upload',
      relationTo: 'private-files',
      admin: { description: 'PDF buyers download after paying (kept private)' },
    },
    { name: 'externalLink', type: 'text', admin: { description: 'Optional: Amazon or other store link' } },
    { name: 'comingSoon', type: 'checkbox', admin: { position: 'sidebar' } },
    slugField,
    published,
    order,
  ],
}

export const Posts: CollectionConfig = {
  slug: 'posts',
  labels: { singular: 'Article', plural: 'Articles & Resources' },
  admin: { useAsTitle: 'title', defaultColumns: ['title', 'category', 'publishedAt', 'published'], group: 'Website content' },
  access: contentAccess,
  defaultSort: '-publishedAt',
  fields: [
    { name: 'title', type: 'text', required: true },
    {
      name: 'category',
      type: 'select',
      defaultValue: 'guide',
      options: [
        { label: 'Guide', value: 'guide' },
        { label: 'Myth buster', value: 'myth' },
        { label: 'Parenting', value: 'parenting' },
        { label: 'Event / webinar', value: 'event' },
        { label: 'News', value: 'news' },
      ],
    },
    { name: 'excerpt', type: 'textarea', required: true },
    { name: 'image', type: 'upload', relationTo: 'media' },
    { name: 'body', type: 'richText' },
    { name: 'publishedAt', type: 'date', defaultValue: () => new Date().toISOString(), admin: { position: 'sidebar' } },
    slugField,
    published,
    seo,
  ],
}

export const Pages: CollectionConfig = {
  slug: 'pages',
  labels: { singular: 'Page', plural: 'Extra pages' },
  admin: {
    useAsTitle: 'title',
    group: 'Website content',
    description: 'Simple pages such as Privacy Policy or Terms. They appear at /p/your-slug',
  },
  access: contentAccess,
  fields: [{ name: 'title', type: 'text', required: true }, { name: 'body', type: 'richText' }, slugField, published, seo],
}

export const Testimonials: CollectionConfig = {
  slug: 'testimonials',
  admin: { useAsTitle: 'name', group: 'Website content' },
  access: contentAccess,
  defaultSort: 'order',
  fields: [
    { name: 'quote', type: 'textarea', required: true },
    { name: 'name', type: 'text', required: true },
    { name: 'detail', type: 'text', admin: { description: 'e.g. Parent of Grade 11 student, Dubai' } },
    published,
    order,
  ],
}

export const Inquiries: CollectionConfig = {
  slug: 'inquiries',
  labels: { singular: 'Enquiry', plural: 'Enquiries' },
  admin: { useAsTitle: 'name', defaultColumns: ['name', 'email', 'topic', 'status', 'createdAt'], group: 'People' },
  access: { create: () => true, read: staffOnly, update: staffOnly, delete: staffOnly },
  hooks: {
    afterChange: [
      async ({ doc, operation, req }) => {
        if (operation !== 'create') return
        const to = process.env.ADMIN_EMAIL || 'edusightguidance@gmail.com'
        await req.payload
          .sendEmail({
            to,
            subject: `New website enquiry: ${doc.name} (${doc.topic || 'general'})`,
            html: `<p><b>${doc.name}</b> — ${doc.email} — ${doc.phone || ''}</p><p>Topic: ${doc.topic || ''}<br/>Grade: ${doc.grade || ''}</p><p>${(doc.message || '').replace(/</g, '&lt;')}</p>`,
          })
          .catch((e: unknown) => req.payload.logger.error(e))
      },
    ],
  },
  fields: [
    { name: 'name', type: 'text', required: true },
    { name: 'email', type: 'email', required: true },
    { name: 'phone', type: 'text' },
    { name: 'grade', type: 'text' },
    { name: 'topic', type: 'text' },
    { name: 'message', type: 'textarea' },
    {
      name: 'status',
      type: 'select',
      defaultValue: 'new',
      options: ['new', 'contacted', 'converted', 'closed'],
      admin: { position: 'sidebar' },
    },
  ],
}
