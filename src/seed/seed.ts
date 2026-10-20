/* EDUSIGHT starter content. Safe to re-run: skips anything that already exists. */
import type { Payload } from 'payload'
import { TESTS } from './tests'
import { CAREERS } from './careers'

const t = (text: string, format = 0) => ({ type: 'text', text, format, detail: 0, mode: 'normal', style: '', version: 1 })
const base = { direction: 'ltr', format: '', indent: 0, version: 1 }
/** Tiny markdown-ish → Lexical: "## " heading, "- " bullets, blank-line paragraphs. */
export function rt(src: string) {
  const children: unknown[] = []
  for (const block of src.trim().split(/\n\n+/)) {
    const lines = block.split('\n')
    if (lines[0].startsWith('## ')) children.push({ ...base, type: 'heading', tag: 'h2', children: [t(lines[0].slice(3))] })
    else if (lines.every((l) => l.startsWith('- ')))
      children.push({
        ...base, type: 'list', listType: 'bullet', tag: 'ul', start: 1,
        children: lines.map((l, i) => ({ ...base, type: 'listitem', value: i + 1, children: [t(l.slice(2))] })),
      })
    else children.push({ ...base, type: 'paragraph', textFormat: 0, children: [t(lines.join(' '))] })
  }
  return { root: { ...base, type: 'root', children } }
}

const SERVICES = [
  {
    title: 'Subject Selection & Academic Pathways', icon: 'book', tagline: 'Choose subjects that keep doors open',
    summary: 'Interest and aptitude assessments plus a subject-combination analysis, so Grade 9–11 choices support long-term goals.',
    audience: ['Students', 'Parents'],
    points: [
      ['Interest & aptitude assessment', 'Counselling sessions that identify strengths, interests and aptitudes.'],
      ['Career exploration', 'Which subjects different professions actually require.'],
      ['Academic guidance', 'How each choice affects higher education and career options.'],
      ['Subject combination analysis', 'Combinations that keep the widest range of opportunities open.'],
      ['1:1 counselling', 'Tailored recommendations based on the individual student profile.'],
      ['Parent involvement', 'Clear answers to parents’ questions and concerns.'],
    ],
  },
  {
    title: 'Career Guidance & Assessments', icon: 'compass', tagline: 'From “no idea” to a shortlist',
    summary: 'Psychometric testing (personality, interests, work values), career research and the job-market trends that shape smart choices.',
    audience: ['Students', 'Graduates'],
    points: [
      ['Psychometric assessments', 'OCEAN personality, RIASEC interests and Work Values — reviewed by a psychologist.'],
      ['Industry feasibility', 'Demand, growth and feasibility of careers, including emerging fields.'],
      ['Skills-gap analysis', 'The skills each career needs and how to build them.'],
      ['Labour-market trends', 'Current and future trends and what they mean for your choices.'],
      ['Alternative pathways', 'BTECs, diplomas, vocational training and career programmes.'],
    ],
  },
  {
    title: 'University Admissions', icon: 'cap', tagline: 'UK · US · Europe · Canada · India · UAE',
    summary: 'Profile building, country and university selection, timelines, personal statements and interview preparation.',
    audience: ['Students', 'Parents'],
    points: [
      ['Profile building', 'Academic rigour, extracurriculars, leadership and community service.'],
      ['Country selection', 'Compare quality, cost, post-study work and lifestyle.'],
      ['University & programme matching', 'Rankings, programme fit, location, culture and cost.'],
      ['Timeline planning', 'Calendars and checklists for deadlines, tests and documents.'],
      ['Personal statements & interviews', 'A compelling narrative and confident interviews.'],
      ['Summer programmes & courses', 'Choosing and applying for programmes that strengthen the profile.'],
      ['Bachelor’s or Master’s', 'Degree-level guidance based on goals and background.'],
      ['Studying abroad', 'Support with internationalisation, including visa guidance.'],
    ],
  },
  {
    title: 'Curriculum & School Selection', icon: 'school', tagline: 'IB, British, American, CBSE — decoded',
    summary: 'Seminars and 1:1 advice on national vs international curricula, assessment styles and choosing the right school.',
    audience: ['Parents', 'Schools'],
    points: [
      ['Curriculum models compared', 'Subject-, learner- and activity-based curricula and their impact.'],
      ['National vs international', 'UK, India, IB, Cambridge and American systems side by side.'],
      ['Assessment & grading', 'Exams, coursework, grading scales and certificates explained.'],
      ['School selection', 'Reputation, teaching philosophy, class size, facilities, culture and fees.'],
      ['Curriculum & university fit', 'Which curricula universities in different countries prefer.'],
      ['Transitions', 'Moving between curricula, schools or countries — and credit recognition.'],
      ['Inclusive education', 'How schools support diverse learners and special educational needs.'],
    ],
  },
  {
    title: 'Parent Mentoring', icon: 'users', tagline: 'Support your teen without the stress',
    summary: 'Helping parents guide teens through career and subject decisions while protecting wellbeing and building responsibility.',
    audience: ['Parents'],
    points: [
      ['Supporting career exploration', ''],
      ['Guiding subject and academic choices', ''],
      ['Balancing mental health and wellbeing', ''],
      ['Instilling confidence and responsibility', ''],
      ['Building life and career skills', ''],
      ['Exam preparation', ''],
      ['Social media awareness and management', ''],
      ['Bursting myths about international education and university selection', ''],
    ],
  },
  {
    title: 'Student Well-being & Resilience', icon: 'heart', tagline: 'Calm minds make better decisions',
    summary: 'Psychologist-led support for stress, anxiety and confidence during exams and big transitions — plus seminars on resilience.',
    audience: ['Students', 'Parents', 'Schools'],
    points: [
      ['1:1 well-being sessions', 'Addressing stress and anxiety in academic and career transitions.'],
      ['Resilience workshops', 'Seminars on work-life balance and bouncing back.'],
      ['School talks', 'Keynotes and workshops for students, parents and educators.'],
    ],
  },
]

const SPECS = [
  ['Medicine & Health Sciences', 'stethoscope', 'MBBS, dentistry, pharmacy, physio, allied health', 'Entry tests (UCAT, NEET, IMAT), work experience, interviews and choosing between the UK, Europe, India and beyond.'],
  ['Engineering & Technology', 'cog', 'From civil to robotics and aerospace', 'Which engineering branch fits, the maths and physics you need, and top destinations for each.'],
  ['Computer Science, Data & AI', 'chart', 'The fastest-growing careers of the decade', 'Software, data science, AI and cybersecurity — subject choices, portfolios and university options.'],
  ['Business, Finance & Accounting', 'briefcase', 'CA, ACCA, CFA, banking, consulting', 'Professional qualifications versus degrees, and when commerce subjects really matter.'],
  ['Law & Public Policy', 'scale', 'LLB, PPE, international relations', 'LNAT, CLAT and LSAT routes, essay skills and how to stand out.'],
  ['Psychology & Social Sciences', 'brain', 'Clinical, counselling, organisational', 'How to become a registered psychologist in different countries — from someone who is one.'],
  ['Design, Architecture & Creative Arts', 'palette', 'Portfolio-led pathways', 'Architecture, UX, fashion and media — building a portfolio that gets offers.'],
  ['Combination Careers', 'spark', 'Medicine + law, CS + biology and more', 'Hybrid paths such as MedTech, bioinformatics and forensic psychology — and how to plan for them.'],
]

async function upsert(payload: Payload, collection: string, where: Record<string, unknown>, data: Record<string, unknown>) {
  const found = await payload.find({ collection: collection as never, where: where as never, limit: 1, overrideAccess: true })
  if (found.docs[0]) return found.docs[0] as { id: number }
  return (await payload.create({ collection: collection as never, data: data as never, overrideAccess: true })) as { id: number }
}

export async function seedAll(payload: Payload) {
  const log = (m: string) => payload.logger.info(`seed: ${m}`)

  const adminPw = process.env.SEED_ADMIN_PASSWORD || 'ChangeMe-Edusight-2026!'
  await upsert(payload, 'users', { email: { equals: 'edusightguidance@gmail.com' } }, {
    email: 'edusightguidance@gmail.com', password: adminPw, name: 'Bhavana Sood', role: 'superadmin',
  })
  await upsert(payload, 'users', { email: { equals: 'editor@edusight.test' } }, {
    email: 'editor@edusight.test', password: 'Editor-Demo-2026!', name: 'Content Editor', role: 'editor',
  })
  log('users')

  const testIds: Record<string, number> = {}
  for (const tt of TESTS) testIds[tt.code] = (await upsert(payload, 'tests', { code: { equals: tt.code } }, tt)).id
  log('tests')

  const products = [
    {
      slug: 'complete-career-assessment', title: 'Complete Career Assessment', kind: 'assessment', featured: true, includesExplorer: true, order: 1,
      price: 699, compareAt: 899, tagline: 'Personality + Interests + Work Values',
      summary: 'All three assessments with a combined, psychologist-reviewed report and a 30-minute results call.',
      tests: [testIds.OCEAN, testIds.RIASEC, testIds.WV],
      features: ['OCEAN personality profile', 'RIASEC career interests (Holland code)', 'Work Values profile', 'Reports reviewed and personalised by Bhavana', '30-minute results discussion', '12 months Career Explorer access'],
    },
    {
      slug: 'career-interest-test', title: 'Career Interest Test', kind: 'assessment', order: 2,
      price: 299, tagline: 'RIASEC · 42 questions · 12 minutes',
      summary: 'Discover your Holland interest code and the career families that fit it.',
      tests: [testIds.RIASEC],
      features: ['42-question RIASEC test', 'Holland code and career families', 'Reviewed PDF report by email', 'Upgrade any time'],
    },
    {
      slug: 'career-explorer', title: 'Career Explorer · 12 months', kind: 'explorer', order: 3,
      price: 149, tagline: 'Research careers, subjects and routes',
      summary: 'Unlimited access to the EDUSIGHT career library matched to your interest code, with a personal shortlist.',
      features: ['Careers matched to your RIASEC code', 'Subjects, routes and entrance exams for each career', 'Save a personal shortlist', 'Share with parents and counsellor'],
    },
  ]
  for (const p of products) await upsert(payload, 'products', { slug: { equals: p.slug } }, { ...p, features: p.features.map((text) => ({ text })) })
  log('products')

  for (const [i, s] of SERVICES.entries())
    await upsert(payload, 'services', { title: { equals: s.title } }, {
      ...s, kind: 'service', order: i + 1,
      points: s.points.map(([title, text]) => ({ title, text })),
    })
  for (const [i, [title, icon, tagline, summary]] of SPECS.entries())
    await upsert(payload, 'services', { title: { equals: title } }, {
      title, icon, tagline, summary, kind: 'specialization', order: i + 1, audience: ['Students', 'Parents'],
      body: rt(`${summary}\n\n## How we help\n\n- Explore the careers in this field and what each one really involves\n- Plan subjects and grades for the strongest entry routes\n- Shortlist countries and universities that fit goals and budget\n- Prepare entrance tests, personal statements and interviews\n\nBook a consultation to build a personal plan for ${title.toLowerCase()}.`),
    })
  log('services')

  for (const [title, stream, codes, summary, subjects, routes, entryTests, outlook] of CAREERS)
    await upsert(payload, 'careers', { title: { equals: title } }, { title, stream, riasec: codes.split(''), summary, subjects, routes, entryTests, outlook })
  log('careers')

  const books = [
    ['British vs IB: The Curriculum Comparison', 'Make the right curriculum choice for your child', 'A clear, side-by-side guide to the British (IGCSE/A-Level) and IB pathways: structure, assessment, workload, university recognition and which kind of learner thrives in each.', 'Parents of Grades 6–10', '#16163F'],
    ['Careers in Healthcare', 'Beyond doctor and nurse', 'Medicine and over 30 health careers — including genetics, nutrition and cosmetic science — with subjects, entrance exams and global study routes for each.', 'Students in Grades 9–12', '#0FA3A3'],
    ['Psychology & Mind Sciences', 'Every route into psychology, worldwide', 'Nineteen chapters covering clinical, counselling, organisational and forensic paths, plus registration requirements in the UK, US, Australia, India and the UAE.', 'Students and parents', '#7C6CF0'],
    ['Building a Standout Profile', 'Activities that actually impress universities', 'MUN, Olympiads, DofE, competitions, research and volunteering — how to choose, commit and present activities with real impact.', 'Grades 8–12', '#FF6B4A'],
    ['The Parent’s University Prep Handbook', 'Your calm, step-by-step companion', 'A 46-page guide for parents: timelines, costs, myths, applications and how to support your teen without taking over.', 'Parents', '#B4772E'],
  ]
  for (const [i, [title, subtitle, description, audience, coverColor]] of books.entries())
    await upsert(payload, 'books', { title: { equals: title } }, { title, subtitle, description, audience, coverColor, price: 79, format: 'ebook', comingSoon: true, order: i + 1 })
  log('books')

  const posts = [
    {
      title: '10 myths about university requirements', category: 'myth-busters',
      excerpt: '“Only top grades matter.” “IB is always preferred.” We unpack the beliefs that lead families to the wrong choices.',
      body: rt(`Every year we meet families making big decisions based on things they have heard at the school gate. Here are the myths we hear most often — and what is actually true.\n\n## The myths\n\n- IB is always preferred by universities\n- International boards are not eligible for Indian entrance exams\n- British and IB are easier than national boards\n- Commerce is mandatory for accounting qualifications\n- Only high grades are required\n- Only top universities provide a good education\n- Getting into a top university guarantees success in life\n- All universities and courses have the same entry requirements\n- Top-ranked universities are good at every course\n- You should do a Master’s immediately after your Bachelor’s\n\n## What to do instead\n\nStart from the student: strengths, interests, values and wellbeing. Then match subjects, countries and universities to that profile. If you want a second opinion on your plan, book a call.`),
    },
    {
      title: 'How to start preparing for university admissions', category: 'guides',
      excerpt: 'A practical checklist from research to visas — and what to do in Grades 9, 10 and 11 so Grade 12 is not a panic.',
      body: rt(`Strong applications are built over years, not weeks. Use this checklist to stay ahead.\n\n## Research and requirements\n\n- Research universities and programmes in each target country\n- Note minimum grades, prerequisite subjects and extra documents\n- Track deadlines and standardised test dates\n- Choose your major and minor\n\n## Build the application\n\n- Keep a strong academic record across the last four years\n- Take part in extracurriculars and extra courses that show real interest\n- Prepare for tests, group discussions and interviews\n- Build relationships with teachers for strong recommendations\n- Draft a personal statement and tailor it to each application\n\n## Money and logistics\n\n- Research scholarships and eligibility\n- Plan the full cost: tuition, accommodation and living expenses\n- Visit campuses or attend admission events\n- Prepare visa documents early\n- Check email regularly and respond promptly to universities`),
    },
    {
      title: 'Why career guidance matters earlier than you think', category: 'parenting',
      excerpt: 'Early exploration, honest self-awareness and smart subject choices save years — and a lot of stress.',
      body: rt(`Career guidance is not a one-off conversation in Grade 12. Done well, it starts early and grows with the student.\n\n## What good guidance gives a student\n\n- Early exploration and awareness of what is out there\n- An honest view of strengths and areas to develop\n- Academic planning that keeps options open\n- Skill development and real-world exposure\n- Freedom from myths and career stereotypes\n- Support through stressful moments\n- Preparation for university and beyond`),
    },
  ]
  const CATS: [string, string][] = [['Guides', 'guides'], ['Myth busters', 'myth-busters'], ['Parenting', 'parenting'], ['Careers', 'careers'], ['Universities', 'universities'], ['Curriculum', 'curriculum'], ['Well-being', 'well-being'], ['Events & webinars', 'events'], ['News', 'news']]
  const catId: Record<string, number> = {}
  for (const [i, [title, slug]] of CATS.entries()) catId[slug] = (await upsert(payload, 'categories', { slug: { equals: slug } }, { title, slug, order: i + 1 })).id
  for (const { category, ...p } of posts)
    await upsert(payload, 'posts', { title: { equals: p.title } }, { ...p, categories: [catId[category]], _status: 'published' })
  log('posts')

  await upsert(payload, 'pages', { slug: { equals: 'privacy-policy' } }, {
    title: 'Privacy policy', slug: 'privacy-policy',
    body: rt(`DRAFT — please review with your adviser before publishing.\n\nEDUSIGHT collects the personal details you give us (such as name, email, phone, school and test answers) to provide guidance services, assessments and reports.\n\n## How we use your data\n\n- To create your account and deliver products you buy\n- To score assessments and prepare reports reviewed by our counsellor\n- To contact you about your enquiry or services\n\n## Students under 18\n\nWe ask a parent or guardian to give consent before a student under 18 can take an assessment. Reports are shared with the student and the consenting parent.\n\n## Your rights\n\nYou can ask us to see, correct or delete your data at any time by emailing edusightguidance@gmail.com.\n\n## Payments\n\nPayments are processed securely by Stripe. We never see or store full card details.`),
  })

  await payload.updateGlobal({
    slug: 'homepage',
    data: {
      stats: [
        { value: '12+', label: 'years guiding students & families' },
        { value: '6', label: 'curricula advised: IB, A-Level, IGCSE, CBSE, American, BTEC' },
        { value: '10+', label: 'awards & recognitions since 2022' },
        { value: '1:1', label: 'every report reviewed by a psychologist' },
      ],
      method: [
        { title: 'Clarity', text: 'Assessments and conversations uncover strengths, interests, values and what is really worrying the family.' },
        { title: 'Confidence', text: 'A clear plan: subjects, careers, countries and universities — with the reasons behind every choice.' },
        { title: 'Direction', text: 'Step-by-step support through timelines, applications, statements and interviews until the offer arrives.' },
      ],
    },
  })
  await payload.updateGlobal({
    slug: 'about',
    data: {
      intro: 'I’m a counselling psychologist and career advisor with over 12 years of experience in curriculum pathways, career guidance and mental health counselling. As a mother of two adults, I understand the pressure families feel in today’s fast-moving education and career landscape — because I’ve lived it.',
      story: 'I founded EDUSIGHT to give students and parents the kind of guidance I wished existed: honest, evidence-based and personal. I’ve been a keynote speaker at seminars and conferences on education and mental health, and I advise schools as well as families on curricula, subject selection and academic pathways.',
      approach: 'My style is warm, supportive and results-driven. I help students and parents make informed decisions, build confidence and reach their goals — while protecting mental well-being along the way.',
      expertise: [
        { title: 'Curriculum counselling', text: 'National and international curricula, subject selection and academic pathways for schools and families; curriculum workshops for parents and educators.' },
        { title: 'Career counselling', text: 'Comprehensive career assessments and aptitude testing; career planning, university selection and job-market navigation for students and professionals.' },
        { title: 'Mental health counselling', text: 'Stress, anxiety and well-being in academic and career transitions; seminars on work-life balance and resilience.' },
      ],
    },
  })

  for (const [i, [t, y]] of ([['Recognition Award for building awareness around future skills development of youth — Resolute Education', ''], ['WOW Patron — Spread Smiles', '2023'], ['Guest Speaker, TKAA Talent X', '2023'], ['Wonder Woman Award — She Inspires', '2022'], ['Tally MSME E-preneur Icon Award — Tally Solutions', '2022'], ['Entrepreneur — Dramatism', '2022'], ['Women Got Talent', '2022'], ['Guest Speaker, International Innovative Future Education Summit, Dubai', '2022'], ['Super Mompreneur', '2022']] as [string, string][]).entries()) {
    const [title, organisation] = t.split(' — ')
    await upsert(payload, 'awards', { title: { equals: title } }, { title, organisation, year: y || undefined, kind: /speaker/i.test(t) ? 'speaking' : 'award', order: i + 1 })
  }
  log('globals')
}
