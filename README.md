# EDUSIGHT website

Next.js + Payload CMS: public site, admin panel (/admin), student portal (/portal), psychometric tests with psychologist-reviewed PDF reports, Career Explorer and books shop.

- Go live: see **GO-LIVE.md**
- Local: `cp .env.example .env`, set `DATABASE_URL`, then `npm install`, `npm run dev`, and visit `/x/setup` once (or `npm run seed`).
- Roles: **superadmin** (everything), **editor** (website content only), **student / parent / teacher** (portal).
- Test questions live in Admin → Tests & questions (seeded from `src/seed/tests.ts`). Scores are sums per scale (1–5 answers).
