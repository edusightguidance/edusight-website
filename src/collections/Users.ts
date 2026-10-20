import type { CollectionConfig } from 'payload'
import crypto from 'crypto'
import { isStaff, isSuper, superField } from '../access'

export const ageFrom = (dob?: string | null) => {
  if (!dob) return null
  const d = new Date(dob)
  const now = new Date()
  let age = now.getFullYear() - d.getFullYear()
  const m = now.getMonth() - d.getMonth()
  if (m < 0 || (m === 0 && now.getDate() < d.getDate())) age--
  return age
}

export const Users: CollectionConfig = {
  slug: 'users',
  labels: { singular: 'User', plural: 'Users & Students' },
  admin: {
    useAsTitle: 'email',
    defaultColumns: ['name', 'email', 'role', 'consentStatus', 'createdAt'],
    group: 'People',
    hidden: ({ user }) => !isSuper(user as never),
  },
  auth: {
    tokenExpiration: 60 * 60 * 24 * 7,
    forgotPassword: {
      generateEmailHTML: (args) => {
        const url = `${process.env.NEXT_PUBLIC_SITE_URL || ''}/reset-password?token=${args?.token}`
        return `<p>Hello,</p><p>Reset your EDUSIGHT password here: <a href="${url}">${url}</a></p><p>If you didn't ask for this, ignore this email.</p>`
      },
    },
  },
  access: {
    admin: ({ req }) => isStaff(req.user as never),
    create: () => true,
    read: ({ req }) => (isSuper(req.user as never) ? true : req.user ? { id: { equals: req.user.id } } : false),
    update: ({ req }) => (isSuper(req.user as never) ? true : req.user ? { id: { equals: req.user.id } } : false),
    delete: ({ req }) => isSuper(req.user as never),
  },
  hooks: {
    beforeChange: [
      ({ data, req, operation, originalDoc }) => {
        // Only a super admin can grant staff roles.
        // Public API callers can't promote themselves or change consent; trusted server code (local API) can.
        if (req.payloadAPI !== 'local' && !isSuper(req.user as never)) {
          if (operation === 'create') {
            if (!['student', 'parent', 'teacher'].includes(data.role)) data.role = 'student'
          } else if (originalDoc) {
            data.role = originalDoc.role
            data.consentStatus = originalDoc.consentStatus
            data.consentToken = originalDoc.consentToken
          }
        }
        if (operation === 'create' && data.role === 'student') {
          const age = ageFrom(data.dateOfBirth)
          if (age !== null && age < 18) {
            data.consentStatus = 'pending'
            data.consentToken = crypto.randomBytes(24).toString('hex')
          } else {
            data.consentStatus = 'not_required'
          }
        }
        return data
      },
    ],
    afterChange: [
      async ({ doc, operation, req }) => {
        if (operation === 'create' && doc.consentStatus === 'pending' && doc.parentEmail) {
          const url = `${process.env.NEXT_PUBLIC_SITE_URL || ''}/consent/${doc.consentToken}`
          await req.payload
            .sendEmail({
              to: doc.parentEmail,
              subject: `Please approve ${doc.name}'s EDUSIGHT account`,
              html: `<p>Dear Parent / Guardian,</p><p><b>${doc.name}</b> has created an account on EDUSIGHT to take career guidance assessments. As they are under 18, we need your consent before they can begin.</p><p><a href="${url}" style="background:#16163F;color:#fff;padding:12px 20px;border-radius:999px;text-decoration:none">Review and give consent</a></p><p>Questions? Reply to this email or WhatsApp +971 50 451 8940.</p><p>— Bhavana Sood, EDUSIGHT</p>`,
            })
            .catch((e: unknown) => req.payload.logger.error(e))
        }
      },
    ],
  },
  fields: [
    { name: 'name', type: 'text', required: true },
    {
      name: 'role',
      type: 'select',
      required: true,
      defaultValue: 'student',
      access: { update: superField },
      options: [
        { label: 'Super Admin', value: 'superadmin' },
        { label: 'Editor (content only)', value: 'editor' },
        { label: 'Student', value: 'student' },
        { label: 'Parent', value: 'parent' },
        { label: 'Teacher / School', value: 'teacher' },
      ],
    },
    { name: 'phone', type: 'text' },
    {
      type: 'row',
      fields: [
        { name: 'dateOfBirth', type: 'date', admin: { date: { pickerAppearance: 'dayOnly' } } },
        { name: 'grade', type: 'text', label: 'Grade / Year' },
        { name: 'school', type: 'text' },
      ],
    },
    { name: 'curriculum', type: 'text', admin: { description: 'e.g. IB, A-Level, CBSE, American' } },
    { name: 'subjects', type: 'textarea' },
    { name: 'hobbies', type: 'textarea' },
    { name: 'dream', type: 'textarea', label: 'Dream / aspiration' },
    { name: 'reviewRequestedAt', type: 'date', admin: { readOnly: true, description: 'When we emailed them asking for a review' } },
    { name: 'shortlist', type: 'relationship', relationTo: 'careers', hasMany: true, label: 'Career shortlist' },
    {
      type: 'collapsible',
      label: 'Parent / guardian consent',
      fields: [
        { name: 'parentName', type: 'text' },
        { name: 'parentEmail', type: 'email' },
        {
          name: 'consentStatus',
          type: 'select',
          defaultValue: 'not_required',
          options: [
            { label: 'Not required (18+)', value: 'not_required' },
            { label: 'Pending', value: 'pending' },
            { label: 'Granted', value: 'granted' },
          ],
        },
        { name: 'consentAt', type: 'date', admin: { readOnly: true } },
        { name: 'consentToken', type: 'text', admin: { hidden: true }, access: { read: superField } },
      ],
    },
  ],
}
