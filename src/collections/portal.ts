import type { Access, CollectionConfig, Where } from 'payload'
import { isSuper, ownOrSuper, staffOnly, superOnly } from '../access'
import { afterAttemptChange, beforeAttemptChange } from '../lib/attemptHooks'

const hideUnlessSuper = ({ user }: { user: unknown }) => !isSuper(user as never)

export const Media: CollectionConfig = {
  slug: 'media',
  labels: { singular: 'Image', plural: 'Images & media' },
  admin: { group: 'Website content' },
  access: { read: () => true, create: staffOnly, update: staffOnly, delete: staffOnly },
  fields: [{ name: 'alt', type: 'text', label: 'Description (for accessibility)' }],
  upload: { mimeTypes: ['image/*', 'application/pdf'] },
}

/** Private files: eBook PDFs and student reports. Downloadable only by owners / buyers. */
const privateRead: Access = async ({ req }) => {
  const u = req.user
  if (!u) return false
  if (isSuper(u as never)) return true
  const orders = await req.payload.find({
    collection: 'orders',
    where: { and: [{ user: { equals: u.id } }, { status: { equals: 'paid' } }] },
    depth: 1,
    limit: 200,
    overrideAccess: true,
  })
  const ids: (string | number)[] = []
  for (const o of orders.docs) {
    const book = o.book as { ebookFile?: number | { id: number } } | null
    const f = book?.ebookFile
    if (f) ids.push(typeof f === 'object' ? f.id : f)
  }
  const w: Where = { or: [{ owner: { equals: u.id } }, { id: { in: ids.length ? ids : [-1] } }] }
  return w
}

export const PrivateFiles: CollectionConfig = {
  slug: 'private-files',
  labels: { singular: 'Private file', plural: 'Private files (eBooks, reports)' },
  admin: { group: 'Shop', hidden: hideUnlessSuper },
  access: { read: privateRead, create: superOnly, update: superOnly, delete: superOnly },
  upload: { mimeTypes: ['application/pdf'] },
  fields: [
    { name: 'title', type: 'text' },
    { name: 'owner', type: 'relationship', relationTo: 'users', admin: { description: 'Set for personal reports' } },
  ],
}

export const Products: CollectionConfig = {
  slug: 'products',
  labels: { singular: 'Product', plural: 'Products & prices' },
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'kind', 'price', 'published'],
    group: 'Shop',
    hidden: hideUnlessSuper,
    description: 'Anything a student or school can buy. It appears in their portal after payment.',
  },
  access: { read: () => true, create: superOnly, update: superOnly, delete: superOnly },
  defaultSort: 'order',
  fields: [
    { name: 'title', type: 'text', required: true },
    {
      name: 'kind',
      type: 'select',
      required: true,
      defaultValue: 'assessment',
      options: [
        { label: 'Assessment (online tests + report)', value: 'assessment' },
        { label: 'Career Explorer access', value: 'explorer' },
        { label: 'Consultation / session booking', value: 'booking' },
      ],
    },
    { name: 'tagline', type: 'text' },
    { name: 'summary', type: 'textarea', required: true },
    {
      type: 'row',
      fields: [
        { name: 'price', type: 'number', label: 'Price (AED)', required: true },
        { name: 'compareAt', type: 'number', label: 'Old price (optional, shown crossed out)' },
        { name: 'accessMonths', type: 'number', label: 'Access length (months)', defaultValue: 12 },
      ],
    },
    {
      name: 'tests',
      type: 'relationship',
      relationTo: 'tests',
      hasMany: true,
      admin: { condition: (d) => d?.kind === 'assessment' },
    },
    {
      name: 'includesExplorer',
      type: 'checkbox',
      label: 'Also unlocks Career Explorer',
      admin: { condition: (d) => d?.kind === 'assessment' },
    },
    { name: 'features', type: 'array', fields: [{ name: 'text', type: 'text', required: true }] },
    { name: 'featured', type: 'checkbox', admin: { position: 'sidebar', description: 'Highlight this plan' } },
    {
      name: 'slug',
      type: 'text',
      required: true,
      unique: true,
      admin: { position: 'sidebar' },
    },
    { name: 'published', type: 'checkbox', defaultValue: true, admin: { position: 'sidebar' } },
    { name: 'order', type: 'number', defaultValue: 10, admin: { position: 'sidebar' } },
  ],
}

export const Tests: CollectionConfig = {
  slug: 'tests',
  labels: { singular: 'Test', plural: 'Tests & questions' },
  admin: { useAsTitle: 'name', defaultColumns: ['name', 'code', 'minutes'], group: 'Assessments', hidden: hideUnlessSuper },
  access: { read: ({ req }) => !!req.user, create: superOnly, update: superOnly, delete: superOnly },
  fields: [
    { type: 'row', fields: [{ name: 'name', type: 'text', required: true }, { name: 'code', type: 'text', required: true, unique: true }] },
    { name: 'intro', type: 'textarea' },
    { name: 'minutes', type: 'number', label: 'Approx. minutes', defaultValue: 10 },
    {
      name: 'dimensions',
      type: 'array',
      label: 'Scales (what is scored)',
      fields: [
        { type: 'row', fields: [{ name: 'key', type: 'text', required: true }, { name: 'label', type: 'text', required: true }] },
        { name: 'description', type: 'textarea' },
      ],
    },
    {
      name: 'questions',
      type: 'array',
      admin: { description: 'Each answer is 1–5. A scale score is the sum of its questions.' },
      fields: [
        {
          type: 'row',
          fields: [
            { name: 'text', type: 'text', required: true, admin: { width: '75%' } },
            { name: 'dimension', type: 'text', required: true, label: 'Scale key', admin: { width: '25%' } },
          ],
        },
      ],
    },
  ],
}

export const Orders: CollectionConfig = {
  slug: 'orders',
  admin: {
    useAsTitle: 'reference',
    defaultColumns: ['reference', 'user', 'itemTitle', 'amount', 'status', 'createdAt'],
    group: 'Shop',
    hidden: hideUnlessSuper,
  },
  access: { read: ownOrSuper('user'), create: superOnly, update: superOnly, delete: superOnly },
  fields: [
    { name: 'reference', type: 'text', admin: { readOnly: true } },
    { name: 'user', type: 'relationship', relationTo: 'users', required: true },
    { name: 'product', type: 'relationship', relationTo: 'products' },
    { name: 'book', type: 'relationship', relationTo: 'books' },
    { name: 'itemTitle', type: 'text' },
    { name: 'amount', type: 'number', label: 'Amount (AED)' },
    {
      name: 'status',
      type: 'select',
      defaultValue: 'pending',
      options: ['pending', 'paid', 'refunded', 'cancelled'],
    },
    { name: 'shippingAddress', type: 'textarea' },
    { name: 'stripeSessionId', type: 'text', admin: { readOnly: true } },
    { name: 'paidAt', type: 'date' },
    { name: 'expiresAt', type: 'date' },
  ],
}

export const Attempts: CollectionConfig = {
  slug: 'attempts',
  labels: { singular: 'Test result', plural: 'Test results & reviews' },
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'status', 'submittedAt', 'sentAt'],
    group: 'Assessments',
    hidden: hideUnlessSuper,
    description:
      'Review a submitted test: read the scores, edit Recommendations, then set Status to "Approved – send report" and Save. The PDF is created and emailed automatically.',
  },
  access: { read: ownOrSuper('user'), create: superOnly, update: superOnly, delete: superOnly },
  hooks: { beforeChange: [beforeAttemptChange], afterChange: [afterAttemptChange] },
  fields: [
    { name: 'title', type: 'text', admin: { readOnly: true } },
    {
      name: 'status',
      type: 'select',
      defaultValue: 'not_started',
      admin: { position: 'sidebar' },
      options: [
        { label: 'Not started', value: 'not_started' },
        { label: 'In progress', value: 'in_progress' },
        { label: 'Submitted – awaiting review', value: 'submitted' },
        { label: 'Approved – send report', value: 'approved' },
        { label: 'Report sent', value: 'sent' },
      ],
    },
    { name: 'user', type: 'relationship', relationTo: 'users', required: true, admin: { position: 'sidebar' } },
    { name: 'test', type: 'relationship', relationTo: 'tests', required: true, admin: { position: 'sidebar' } },
    { name: 'order', type: 'relationship', relationTo: 'orders', admin: { position: 'sidebar' } },
    { name: 'scoreSummary', type: 'textarea', label: 'Scores', admin: { readOnly: true, rows: 9 } },
    {
      name: 'recommendations',
      type: 'textarea',
      admin: { rows: 14, description: 'Pre-filled from the scores. Edit freely — this text goes into the PDF report.' },
    },
    { name: 'counsellorNotes', type: 'textarea', label: 'Private notes (not shown to student)' },
    { name: 'report', type: 'upload', relationTo: 'private-files', admin: { readOnly: true } },
    { name: 'answers', type: 'json', admin: { hidden: true } },
    { name: 'scores', type: 'json', admin: { hidden: true } },
    { name: 'startedAt', type: 'date', admin: { readOnly: true, position: 'sidebar' } },
    { name: 'submittedAt', type: 'date', admin: { readOnly: true, position: 'sidebar' } },
    { name: 'sentAt', type: 'date', admin: { readOnly: true, position: 'sidebar' } },
  ],
}
