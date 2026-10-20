import { BlogList } from '@/components/site/BlogList'
import { Hl } from '@/components/site/Icon'

export const metadata = {
  title: 'Blog — careers, universities & parenting',
  description: 'Practical articles on careers, subject choices, curricula, university admissions and parenting teens, by counselling psychologist Bhavana Sood.',
  alternates: { types: { 'application/rss+xml': '/blog/rss.xml' } },
}

export default async function Blog({ searchParams }: { searchParams: Promise<{ page?: string; q?: string }> }) {
  const { page, q } = await searchParams
  return <BlogList title={<>Straight answers, <Hl>no jargon</Hl></>} lead="Careers, subjects, universities and raising teens — written for real families." base="/blog" page={Math.max(1, Number(page) || 1)} q={q} showFeatured />
}
