import { withPayload } from '@payloadcms/next/withPayload'
import type { NextConfig } from 'next'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(__filename)

const nextConfig: NextConfig = {
  // The PDF report embeds the logo from disk, so ship it with the server functions.
  // jsdom (used only by the old-blog importer) must load from node_modules, not be bundled.
  serverExternalPackages: ['jsdom'],
  async redirects() {
    return [
      { source: '/resources', destination: '/blog', permanent: true },
      { source: '/resources/:slug', destination: '/blog/:slug', permanent: true },
      // Old Squarespace pages
      { source: '/home', destination: '/', permanent: true },
      { source: '/home-1', destination: '/', permanent: true },
      { source: '/image_hosting', destination: '/', permanent: true },
      { source: '/appointments', destination: '/contact', permanent: true },
      { source: '/aboutedusight', destination: '/about', permanent: true },
      { source: '/ourcounselor', destination: '/about', permanent: true },
      { source: '/awards', destination: '/about', permanent: true },
      { source: '/curriculum-counseling', destination: '/services/curriculum-school-selection', permanent: true },
      { source: '/career-roadmap', destination: '/services/career-guidance-assessments', permanent: true },
      { source: '/mental-health', destination: '/services/student-well-being-resilience', permanent: true },
      { source: '/services-store', destination: '/services', permanent: true },
      { source: '/services-store/:path*', destination: '/services', permanent: true },
    ]
  },
  outputFileTracingIncludes: { '/**': ['./public/logo.png'] },
  images: {
    localPatterns: [
      {
        pathname: '/api/media/file/**',
      },
    ],
  },
  webpack: (webpackConfig) => {
    webpackConfig.resolve.extensionAlias = {
      '.cjs': ['.cts', '.cjs'],
      '.js': ['.ts', '.tsx', '.js', '.jsx'],
      '.mjs': ['.mts', '.mjs'],
    }

    return webpackConfig
  },
  turbopack: {
    root: path.resolve(dirname),
  },
}

export default withPayload(nextConfig, { devBundleServerPackages: false })
