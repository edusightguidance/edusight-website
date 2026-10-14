export type Dim = { key: string; label: string; description?: string | null }
export type TestDoc = {
  id: number | string
  code: string
  name: string
  dimensions?: Dim[] | null
  questions?: { text: string; dimension: string }[] | null
}
export type Scores = Record<string, { label: string; raw: number; max: number; pct: number }>

export function score(test: TestDoc, answers: Record<string, number>): Scores {
  const out: Scores = {}
  for (const d of test.dimensions || []) out[d.key] = { label: d.label, raw: 0, max: 0, pct: 0 }
  ;(test.questions || []).forEach((q, i) => {
    const s = out[q.dimension]
    if (!s) return
    s.max += 5
    s.raw += Number(answers[String(i)] || 0)
  })
  for (const s of Object.values(out)) s.pct = s.max ? Math.round((s.raw / s.max) * 100) : 0
  return out
}

export const ranked = (s: Scores) => Object.entries(s).sort((a, b) => b[1].raw - a[1].raw)

export const band = (pct: number) => (pct >= 75 ? 'High' : pct >= 50 ? 'Moderate' : 'Lower')

export function summaryText(s: Scores) {
  return ranked(s)
    .map(([, v]) => `${v.label}: ${v.raw}/${v.max} (${v.pct}%) – ${band(v.pct)}`)
    .join('\n')
}

const RIASEC_CAREERS: Record<string, string> = {
  R: 'engineering, architecture, aviation, physiotherapy, agriculture and environmental work, culinary arts',
  I: 'medicine, research science, data science, pharmacy, psychology, biotechnology, actuarial science',
  A: 'design, architecture, media, content creation, writing, performing arts, advertising',
  S: 'teaching, nursing and healthcare, psychology and counselling, social work, HR, hospitality',
  E: 'business management, law, entrepreneurship, marketing, sales, politics and public policy',
  C: 'accounting, finance, banking, data analysis, operations, administration, actuarial work',
}

const TIPS: Record<string, Record<string, string>> = {
  OCEAN: {
    O: 'thrives on new ideas and variety — consider creative, research or innovation-focused paths.',
    C: 'is organised and dependable — a strong fit for demanding, structured study routes.',
    E: 'gains energy from people — roles with teamwork, presenting or leading will suit.',
    A: 'is caring and cooperative — helping and people-centred careers will feel meaningful.',
    ES: 'stays steady under pressure — high-stakes environments are manageable.',
  },
  WV: {
    PSI: 'wants work that makes a difference to people or society.',
    AC: 'values freedom and room to create.',
    GC: 'is motivated by learning and challenge.',
    SS: 'values security, steady income and predictability.',
    RA: 'is driven by recognition and moving up.',
    CB: 'does best in supportive, collaborative teams.',
    LF: 'places high value on balance and flexibility.',
    ED: 'shows entrepreneurial drive and initiative.',
  },
}

/** Draft recommendations the counsellor can edit before the report is sent. */
export function draftRecommendations(code: string, s: Scores, name = 'The student') {
  const top = ranked(s).slice(0, 3)
  const first = name.split(' ')[0]
  if (code === 'RIASEC') {
    const codeStr = top.map(([k]) => k).join('')
    return [
      `Holland code: ${codeStr}`,
      '',
      `${first}'s strongest interest areas are ${top.map(([, v]) => v.label).join(', ')}.`,
      '',
      ...top.map(([k, v]) => `• ${v.label}: careers to explore include ${RIASEC_CAREERS[k] || '—'}.`),
      '',
      'Next steps:',
      '• Shortlist 3–5 careers from the areas above and research the subjects each one needs.',
      '• Check that current subject choices keep these options open.',
      '• Book a 1:1 session to turn these interests into a subject and university plan.',
    ].join('\n')
  }
  const tips = TIPS[code] || {}
  return [
    `${first}'s strongest areas: ${top.map(([, v]) => v.label).join(', ')}.`,
    '',
    ...top.map(([k, v]) => `• ${v.label}: ${first} ${tips[k] || 'shows a clear preference here.'}`),
    '',
    'Next steps:',
    '• Read these results together with the Career Interests (RIASEC) profile.',
    '• Discuss in a 1:1 session how these strengths shape subject and career choices.',
  ].join('\n')
}
