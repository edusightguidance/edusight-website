import { postgresAdapter } from '@payloadcms/db-postgres'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import { resendAdapter } from '@payloadcms/email-resend'
import { s3Storage } from '@payloadcms/storage-s3'
import path from 'path'
import { buildConfig } from 'payload'
import { fileURLToPath } from 'url'
import sharp from 'sharp'

import { Users } from './collections/Users'
import { Awards, Books, Careers, Categories, Inquiries, Pages, Posts, Services, Tags, Testimonials } from './collections/content'
import { Attempts, Media, Orders, PrivateFiles, Products, Tests } from './collections/portal'
import { About, Homepage, SiteSettings } from './globals'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

const plugins = []
if (process.env.S3_BUCKET) {
  // Cloudflare R2 (S3-compatible) for images, eBooks and reports in production.
  plugins.push(
    s3Storage({
      collections: { media: true, 'private-files': true },
      bucket: process.env.S3_BUCKET,
      config: {
        endpoint: process.env.S3_ENDPOINT,
        region: process.env.S3_REGION || 'auto',
        credentials: {
          accessKeyId: process.env.S3_ACCESS_KEY_ID || '',
          secretAccessKey: process.env.S3_SECRET_ACCESS_KEY || '',
        },
      },
    }),
  )
}

export default buildConfig({
  serverURL: process.env.NEXT_PUBLIC_SITE_URL || '',
  admin: {
    user: Users.slug,
    importMap: { baseDir: path.resolve(dirname) },
    meta: { titleSuffix: ' · EDUSIGHT Admin' },
    avatar: 'default',
    components: {
      graphics: { Logo: '/components/admin/Logo#Logo', Icon: '/components/admin/Logo#Icon' },
      beforeDashboard: ['/components/admin/Welcome#Welcome'],
    },
  },
  collections: [Posts, Categories, Tags, Testimonials, Services, Careers, Awards, Pages, Media, Books, Products, Orders, PrivateFiles, Tests, Attempts, Users, Inquiries],
  globals: [Homepage, About, SiteSettings],
  editor: lexicalEditor(),
  secret: process.env.PAYLOAD_SECRET || '',
  typescript: { outputFile: path.resolve(dirname, 'payload-types.ts') },
  db: postgresAdapter({
    pool: { connectionString: process.env.DATABASE_URL || '' },
    // Database upgrades run once, before each production build ("npm run build" → payload migrate).
  }),
  email: process.env.RESEND_API_KEY
    ? resendAdapter({
        apiKey: process.env.RESEND_API_KEY,
        defaultFromAddress: process.env.EMAIL_FROM || 'hello@edusightconsulting.com',
        defaultFromName: 'EDUSIGHT',
      })
    : undefined,
  sharp,
  plugins,
})
