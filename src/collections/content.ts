import type { Access, CollectionConfig, Field, Where } from 'payload'
import { BlocksFeature, FixedToolbarFeature, lexicalEditor } from '@payloadcms/richtext-lexical'
import { isStaff, publishedOrStaff, staffOnly, superOnly } from '../access'
import { refreshSite } from '../lib/revalidate'

const refresh = { afterChange: [refreshSite], afterDelete: [refreshSite] }

/** Rich text with a fixed toolbar plus YouTube and callout blocks. */
export const articleEditor = lexicalEditor({
  features: ({ defaultFeatures }) => [
    ...defaultFeatures,
    FixedToolbarFeature(),
    BlocksFeature({
      blocks: [
        {
          slug: 'youtube',
          labels: { singular: 'YouTube video', plural: 'YouTube videos' },
          fields: [{ name: 'url', type: 'text', required: true, admin: { description: 'Paste the YouTube link' } }],
        },
        {
          slug: 'callout',
          labels: { singular: 'Callout box', plural: 'Callout boxes' },
          fields: [
            { name: 'style', type: 'select', defaultValue: 'tip', options: [{ label: 'Tip', value: 'tip' }, { label: 'Important', value: 'warn' }, { label: 'Did you know?', value: 'info' }] },
            { name: 'title', type: 'text' },
            { name: 'text', type: 'textarea', required: true },
          ],
        },
      ],
    }),
  ],
})

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
  hooks: refresh,
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
  hooks: refresh,
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
  hooks: refresh,
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

/** Public sees only published articles whose publish date has arrived (future date = scheduled). */
export const livePosts = (): Where => ({
  and: [{ _status: { equals: 'published' } }, { publishedAt: { less_than_equal: new Date().toISOString() } }],
})
const postRead: Access = ({ req }) => (isStaff(req.user as never) ? true : livePosts())

const words = (node: unknown): number => {
  if (!node || typeof node !== 'object') return 0
  const n = node as { text?: string; children?: unknown[]; root?: unknown }
  if (n.root) return words(n.root)
  return (n.text ? n.text.split(/\s+/).filter(Boolean).length : 0) + (n.children || []).reduce((a: number, c) => a + words(c), 0)
}

export const Categories: CollectionConfig = {
  slug: 'categories',
  labels: { singular: 'Blog category', plural: 'Blog categories' },
  admin: { useAsTitle: 'title', defaultColumns: ['title', 'slug', 'order'], group: 'Blog' },
  access: { read: () => true, create: staffOnly, update: staffOnly, delete: staffOnly },
  defaultSort: 'order',
  hooks: refresh,
  fields: [{ name: 'title', type: 'text', required: true }, { name: 'description', type: 'textarea' }, slugField, order],
}

export const Tags: CollectionConfig = {
  slug: 'tags',
  labels: { singular: 'Tag', plural: 'Tags' },
  admin: { useAsTitle: 'title', group: 'Blog' },
  access: { read: () => true, create: staffOnly, update: staffOnly, delete: staffOnly },
  defaultSort: 'title',
  hooks: refresh,
  fields: [{ name: 'title', type: 'text', required: true }, slugField],
}

export const Posts: CollectionConfig = {
  slug: 'posts',
  labels: { singular: 'Blog post', plural: 'Blog posts' },
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'categories', 'publishedAt', '_status'],
    group: 'Blog',
    description:
      'Write, then click "Publish changes". To schedule a post, set "Publish date" in the future: it appears automatically on that date. Use "Preview" to see it before publishing.',
    preview: (doc) => `${process.env.NEXT_PUBLIC_SITE_URL || ''}/x/preview?slug=${doc?.slug || ''}`,
  },
  versions: { drafts: { autosave: { interval: 2000 } }, maxPerDoc: 25 },
  access: { read: postRead, create: staffOnly, update: staffOnly, delete: staffOnly, readVersions: staffOnly },
  defaultSort: '-publishedAt',
  hooks: {
    ...refresh,
    beforeChange: [
      ({ data }) => {
        data.readingMinutes = Math.max(1, Math.round(words(data.body) / 220))
        return data
      },
    ],
  },
  fields: [
    { name: 'title', type: 'text', required: true },
    { name: 'excerpt', type: 'textarea', required: true, admin: { description: 'One or two sentences shown on blog cards and in Google.' } },
    { name: 'image', type: 'upload', relationTo: 'media', label: 'Cover image' },
    { name: 'body', type: 'richText', editor: articleEditor },
    {
      name: 'publishedAt',
      type: 'date',
      label: 'Publish date',
      required: true,
      defaultValue: () => new Date().toISOString(),
      admin: { position: 'sidebar', date: { pickerAppearance: 'dayAndTime' }, description: 'Future date = scheduled' },
    },
    { name: 'categories', type: 'relationship', relationTo: 'categories', hasMany: true, admin: { position: 'sidebar' } },
    { name: 'tags', type: 'relationship', relationTo: 'tags', hasMany: true, admin: { position: 'sidebar' } },
    { name: 'author', type: 'text', defaultValue: 'Bhavana Sood', admin: { position: 'sidebar' } },
    { name: 'featured', type: 'checkbox', label: 'Feature at top of blog', admin: { position: 'sidebar' } },
    { name: 'readingMinutes', type: 'number', admin: { readOnly: true, position: 'sidebar' } },
    {
      name: 'legacySlugs',
      label: 'Old web addresses',
      type: 'text',
      hasMany: true,
      admin: { position: 'sidebar', description: 'Old web addresses that should redirect here' },
    },
    slugField,
    seo,
  ],
}

export const Pages: CollectionConfig = {
  slug: 'pages',
  hooks: refresh,
  labels: { singular: 'Page', plural: 'Extra pages' },
  admin: {
    useAsTitle: 'title',
    group: 'Website content',
    description: 'Simple pages such as Privacy Policy or Terms. They appear at /p/your-slug',
  },
  access: contentAccess,
  fields: [{ name: 'title', type: 'text', required: true }, { name: 'body', type: 'richText' }, slugField, published, seo],
}

const reviewRead: Access = ({ req }) => (isStaff(req.user as never) ? true : { status: { equals: 'approved' } })
const staffFieldRead = ({ req }: { req: { user: unknown } }) => isStaff(req.user as never)

export const Testimonials: CollectionConfig = {
  slug: 'testimonials',
  labels: { singular: 'Review', plural: 'Reviews' },
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'source', 'rating', 'status', 'date'],
    group: 'Reviews',
    description: 'Add reviews from LinkedIn, Facebook, Instagram or Google, and approve reviews left on the website. Only "Approved" reviews are shown.',
  },
  access: { read: reviewRead, create: staffOnly, update: staffOnly, delete: superOnly },
  defaultSort: '-date',
  hooks: refresh,
  fields: [
    {
      type: 'row',
      fields: [
        {
          name: 'status',
          type: 'select',
          defaultValue: 'approved',
          required: true,
          options: [
            { label: 'Pending – needs your approval', value: 'pending' },
            { label: 'Approved – shown on website', value: 'approved' },
            { label: 'Hidden', value: 'rejected' },
          ],
        },
        {
          name: 'source',
          type: 'select',
          defaultValue: 'website',
          required: true,
          options: [
            { label: 'This website', value: 'website' },
            { label: 'Google', value: 'google' },
            { label: 'LinkedIn', value: 'linkedin' },
            { label: 'Facebook', value: 'facebook' },
            { label: 'Instagram', value: 'instagram' },
            { label: 'Other', value: 'other' },
          ],
        },
        { name: 'rating', type: 'number', min: 1, max: 5, admin: { description: '1–5 stars (optional)' } },
      ],
    },
    { name: 'quote', type: 'textarea', required: true, label: 'Review text' },
    {
      type: 'row',
      fields: [
        { name: 'name', type: 'text', required: true, admin: { description: 'For under-18 students use first name + initial, e.g. "Aisha K."' } },
        { name: 'detail', type: 'text', label: 'Who they are', admin: { description: 'e.g. Parent of Grade 11 student, Dubai' } },
      ],
    },
    {
      type: 'row',
      fields: [
        { name: 'date', type: 'date', defaultValue: () => new Date().toISOString(), admin: { date: { pickerAppearance: 'dayOnly' } } },
        { name: 'service', type: 'relationship', relationTo: 'services', label: 'Related service' },
      ],
    },
    { name: 'sourceUrl', type: 'text', label: 'Link to the original post (optional)' },
    { name: 'screenshot', type: 'upload', relationTo: 'media', label: 'Screenshot (optional)' },
    { name: 'featured', type: 'checkbox', label: 'Show on homepage', admin: { position: 'sidebar' } },
    { name: 'verified', type: 'checkbox', label: 'Verified client', admin: { position: 'sidebar' } },
    { name: 'email', type: 'email', admin: { position: 'sidebar' }, access: { read: staffFieldRead } },
    { name: 'user', type: 'relationship', relationTo: 'users', admin: { position: 'sidebar', readOnly: true }, access: { read: staffFieldRead } },
    { name: 'consent', type: 'checkbox', label: 'Permission to publish', defaultValue: true, admin: { position: 'sidebar' } },
    order,
  ],
}

export const Awards: CollectionConfig = {
  slug: 'awards',
  labels: { singular: 'Award', plural: 'Awards & recognition' },
  admin: { useAsTitle: 'title', defaultColumns: ['title', 'organisation', 'year', 'published'], group: 'Website content' },
  access: contentAccess,
  defaultSort: 'order',
  hooks: refresh,
  fields: [
    { name: 'title', type: 'text', required: true },
    {
      type: 'row',
      fields: [
        { name: 'organisation', type: 'text', label: 'Given by' },
        { name: 'year', type: 'text' },
        {
          name: 'kind',
          type: 'select',
          defaultValue: 'award',
          options: [
            { label: 'Award', value: 'award' },
            { label: 'Speaking / event', value: 'speaking' },
            { label: 'Recognition', value: 'recognition' },
          ],
        },
      ],
    },
    { name: 'image', type: 'upload', relationTo: 'media', label: 'Main photo' },
    { name: 'gallery', type: 'upload', relationTo: 'media', hasMany: true, label: 'More photos (optional)' },
    { name: 'note', type: 'textarea', label: 'Short description (optional)' },
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
