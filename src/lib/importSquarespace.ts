import { JSDOM } from 'jsdom'
import crypto from 'crypto'
import type { Payload } from 'payload'
import { convertHTMLToLexical, editorConfigFactory } from '@payloadcms/richtext-lexical'

type SqItem = {
  title?: string; urlId?: string; fullUrl?: string; body?: string; excerpt?: string; assetUrl?: string
  publishOn?: number; addedOn?: number; categories?: string[]; tags?: string[]; author?: { displayName?: string }
}
const UA = { 'User-Agent': 'Mozilla/5.0 (EDUSIGHT importer)' }
const slugify = (s: string) => s.toLowerCase().normalize('NFKD').replace(/[^\w\s-]/g, '').trim().replace(/[\s_]+/g, '-').replace(/-+/g, '-').slice(0, 80).replace(/-$/, '')
const norm = (s = '') => s.toLowerCase().replace(/[^a-z0-9]+/g, ' ').trim()
const text = (html = '') => new JSDOM(`<body>${html}</body>`).window.document.body.textContent?.replace(/\s+/g, ' ').trim() || ''

async function fetchItems(base: string): Promise<SqItem[]> {
  const items: SqItem[] = []
  let url: string | null = `${base}/blog?format=json`
  for (let guard = 0; url && guard < 50; guard++) {
    const r: Response = await fetch(url, { headers: UA })
    const j = await r.json().catch(() => null)
    if (!j || !Array.isArray(j.items)) throw new Error(`Could not read blog JSON from ${url} — is the old Squarespace site still live there?`)
    items.push(...j.items)
    url = j.pagination?.nextPage && j.pagination?.nextPageUrl ? `${base}${j.pagination.nextPageUrl}${j.pagination.nextPageUrl.includes('?') ? '&' : '?'}format=json` : null
  }
  return items
}

async function uploadImage(payload: Payload, src: string, alt: string) {
  const url = src.startsWith('//') ? `https:${src}` : src
  const full = url.includes('squarespace-cdn.com') && !url.includes('format=') ? `${url}${url.includes('?') ? '&' : '?'}format=1500w` : url
  const r = await fetch(full, { headers: UA })
  if (!r.ok) return null
  const buf = Buffer.from(await r.arrayBuffer())
  const type = r.headers.get('content-type') || 'image/jpeg'
  const ext = type.split('/')[1]?.split(';')[0].replace('jpeg', 'jpg') || 'jpg'
  const base = slugify(decodeURIComponent(url.split('?')[0].split('/').pop() || 'image').replace(/\.[a-z0-9]+$/i, '')) || 'image'
  const doc = await payload.create({
    collection: 'media',
    data: { alt: alt || '' },
    file: { data: buf, mimetype: type, name: `${base}-${crypto.randomBytes(3).toString('hex')}.${ext}`, size: buf.length },
    overrideAccess: true,
  })
  return doc.id as number
}

async function termIds(payload: Payload, collection: 'categories' | 'tags', names: string[] = []) {
  const ids: number[] = []
  for (const name of names) {
    const slug = slugify(name)
    if (!slug) continue
    const found = await payload.find({ collection, where: { slug: { equals: slug } }, limit: 1, depth: 0, overrideAccess: true })
    ids.push((found.docs[0] || (await payload.create({ collection, data: { title: name, slug }, overrideAccess: true }))).id as number)
  }
  return ids
}

type LNode = { type?: string; children?: LNode[]; text?: string; [k: string]: unknown }

/** Replace placeholder paragraphs with real image / video nodes. */
function swapPlaceholders(node: LNode): LNode {
  if (node.children) {
    node.children = node.children.map((c) => {
      const t = c.type === 'paragraph' && c.children?.length === 1 ? c.children[0].text?.trim() : null
      const img = t?.match(/^\[\[IMG:(\d+)\]\]$/)
      if (img) return { type: 'upload', version: 3, format: '', id: crypto.randomUUID(), relationTo: 'media', value: Number(img[1]), fields: null }
      const yt = t?.match(/^\[\[YT:(.+)\]\]$/)
      if (yt) return { type: 'block', version: 2, format: '', fields: { id: crypto.randomUUID(), blockName: '', blockType: 'youtube', url: yt[1] } }
      return swapPlaceholders(c)
    })
  }
  return node
}

export async function importSquarespace(payload: Payload, base: string) {
  const report: string[] = []
  const items = await fetchItems(base.replace(/\/$/, ''))
  // Default features are enough to read the HTML; videos are added as blocks afterwards.
  const editorConfig = await editorConfigFactory.default({ config: payload.config })
  const titleCount: Record<string, number> = {}
  items.forEach((i) => (titleCount[norm(i.title)] = (titleCount[norm(i.title)] || 0) + 1))

  const legacyOf = (it: SqItem) => it.urlId || it.fullUrl?.split('/').pop() || ''
  const isMessy = (l: string) => !l || /blog-post-title|[a-z0-9]{5}-[a-z0-9]{5}-[a-z0-9]{5}/.test(l) || l.length > 70
  // Posts with clean old addresses go first so they keep exactly the same URL.
  items.sort((a, b) => Number(isMessy(legacyOf(a))) - Number(isMessy(legacyOf(b))))

  for (const it of items) {
    const legacy = legacyOf(it)
    const exists = await payload.find({
      collection: 'posts',
      where: { or: [{ legacySlugs: { equals: legacy } }, { and: [{ slug: { equals: legacy } }, { title: { equals: (it.title || '').trim() } }] }] },
      limit: 1, depth: 0, overrideAccess: true, draft: true,
    })
    if (exists.docs[0]) {
      report.push(`• skipped (already imported): ${it.title}`)
      continue
    }
    const messy = isMessy(legacy)
    let slug = messy ? slugify(it.title || 'post') : legacy
    const clash = await payload.count({ collection: 'posts', where: { slug: { equals: slug } }, overrideAccess: true })
    if (clash.totalDocs) slug = `${slug}-${new Date(it.publishOn || Date.now()).getFullYear()}`

    // Clean Squarespace markup, move images/videos to our own storage.
    const dom = new JSDOM(`<body>${it.body || ''}</body>`)
    const doc = dom.window.document
    doc.querySelectorAll('noscript, script, style, .sqs-block-button, .sqs-block-spacer, .image-caption-wrapper:empty').forEach((n) => n.remove())
    let images = 0
    for (const img of Array.from(doc.querySelectorAll('img'))) {
      const src = img.getAttribute('data-src') || img.getAttribute('data-image') || img.getAttribute('src') || ''
      const id = src && !src.startsWith('data:') ? await uploadImage(payload, src, img.getAttribute('alt') || it.title || '').catch(() => null) : null
      const p = doc.createElement('p')
      p.textContent = id ? `[[IMG:${id}]]` : ''
      ;(img.closest('figure') || img).replaceWith(p)
      if (id) images++
    }
    for (const el of Array.from(doc.querySelectorAll('[data-html], iframe'))) {
      const raw = el.getAttribute('data-html') || el.outerHTML
      const m = raw.match(/(?:youtube\.com\/embed\/|youtu\.be\/|watch\?v=)([\w-]{11})/)
      const p = doc.createElement('p')
      p.textContent = m ? `[[YT:https://youtu.be/${m[1]}]]` : ''
      el.replaceWith(p)
    }
    const body = convertHTMLToLexical({ editorConfig, html: doc.body.innerHTML, JSDOM }) as unknown as { root: LNode }
    swapPlaceholders(body.root)

    const cover = it.assetUrl ? await uploadImage(payload, it.assetUrl, it.title || '').catch(() => null) : null
    const dup = (titleCount[norm(it.title)] || 0) > 1 || norm(it.title) === 'the careers of tomorrow'
    const excerpt = (text(it.excerpt) || text(it.body)).slice(0, 220) || it.title || ''
    await payload.create({
      collection: 'posts',
      overrideAccess: true,
      draft: dup,
      data: {
        title: (it.title || 'Untitled').trim(),
        slug,
        excerpt,
        body: body as never,
        image: cover || undefined,
        publishedAt: new Date(it.publishOn || it.addedOn || Date.now()).toISOString(),
        author: it.author?.displayName || 'Bhavana Sood',
        categories: await termIds(payload, 'categories', it.categories),
        tags: await termIds(payload, 'tags', it.tags),
        legacySlugs: legacy && legacy !== slug ? [legacy] : [],
        _status: dup ? 'draft' : 'published',
      },
    })
    report.push(`• ${dup ? 'imported as DRAFT (possible duplicate)' : 'imported'}: ${it.title} → /blog/${slug} (${images} image${images === 1 ? '' : 's'}${cover ? ' + cover' : ''})`)
  }
  return { count: items.length, report }
}
