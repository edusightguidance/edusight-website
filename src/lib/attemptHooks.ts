import type { CollectionAfterChangeHook, CollectionBeforeChangeHook } from 'payload'
import { buildReportPdf } from './report'

export const beforeAttemptChange: CollectionBeforeChangeHook = async ({ data, req, originalDoc }) => {
  const userId = data.user ?? originalDoc?.user
  const testId = data.test ?? originalDoc?.test
  if (!data.title && userId && testId) {
    const [u, t] = await Promise.all([
      req.payload.findByID({ collection: 'users', id: typeof userId === 'object' ? userId.id : userId, overrideAccess: true, depth: 0 }),
      req.payload.findByID({ collection: 'tests', id: typeof testId === 'object' ? testId.id : testId, overrideAccess: true, depth: 0 }),
    ])
    data.title = `${u.name} – ${t.name}`
  }
  return data
}

export const afterAttemptChange: CollectionAfterChangeHook = async ({ doc, previousDoc, req, context }) => {
  if (context?.skipReport) return doc
  if (doc.status !== 'approved' || previousDoc?.status === 'approved') return doc
  const { payload } = req
  const userId = typeof doc.user === 'object' ? doc.user.id : doc.user
  const testId = typeof doc.test === 'object' ? doc.test.id : doc.test
  const user = await payload.findByID({ collection: 'users', id: userId, overrideAccess: true, depth: 0 })
  const test = await payload.findByID({ collection: 'tests', id: testId, overrideAccess: true, depth: 0 })

  const pdf = await buildReportPdf({ user, test, attempt: doc })
  const safe = `${user.name}-${test.code}`.replace(/[^a-z0-9]+/gi, '-')
  const file = await payload.create({
    collection: 'private-files',
    data: { title: `${user.name} – ${test.name} report`, owner: userId },
    file: { data: pdf, mimetype: 'application/pdf', name: `EDUSIGHT-${safe}-${Date.now()}.pdf`, size: pdf.length },
    overrideAccess: true,
    req,
  })
  await payload.update({
    collection: 'attempts',
    id: doc.id,
    data: { status: 'sent', report: file.id, sentAt: new Date().toISOString() },
    overrideAccess: true,
    context: { skipReport: true },
    req,
  })

  const to = [user.email, user.parentEmail].filter(Boolean) as string[]
  await payload
    .sendEmail({
      to,
      subject: `Your EDUSIGHT ${test.name} report is ready`,
      html: `<p>Dear ${user.name.split(' ')[0]},</p><p>Your <b>${test.name}</b> report has been reviewed by the EDUSIGHT team and is attached. You can also download it anytime from your portal: <a href="${process.env.NEXT_PUBLIC_SITE_URL || ''}/portal">${process.env.NEXT_PUBLIC_SITE_URL || ''}/portal</a></p><p>To talk through your results, reply here or WhatsApp +971 50 451 8940.</p><p>— EDUSIGHT · Clarity · Confidence · Direction</p>`,
      attachments: [{ filename: `EDUSIGHT-${safe}.pdf`, content: pdf }],
    })
    .catch((e: unknown) => payload.logger.error(e))
  return doc
}
