import { getPayload } from 'payload'
import { headers } from 'next/headers'
import { cache } from 'react'
import config from '@payload-config'

export const db = cache(async () => getPayload({ config }))

export const getUser = cache(async () => {
  const payload = await db()
  const { user } = await payload.auth({ headers: await headers() })
  return user
})

export const getSettings = cache(async () => (await db()).findGlobal({ slug: 'site-settings' }))

export const waLink = (num?: string | null, text = 'Hi Bhavana, I would like to know more about EDUSIGHT guidance.') =>
  `https://wa.me/${(num || '971504518940').replace(/\D/g, '')}?text=${encodeURIComponent(text)}`

export const aed = (n?: number | null) => `AED ${Number(n || 0).toLocaleString('en-AE')}`
