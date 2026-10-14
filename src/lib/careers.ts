export const STREAMS: Record<string, string> = {
  bio: 'Biological & Health Sciences',
  eng: 'Engineering & Technology',
  com: 'Commerce, Business & Finance',
  hum: 'Humanities, Arts & Media',
  combo: 'Combination / Hybrid',
}
export const CODE_NAMES: Record<string, string> = { R: 'Realistic', I: 'Investigative', A: 'Artistic', S: 'Social', E: 'Enterprising', C: 'Conventional' }
export const OUTLOOK: Record<string, string> = { hot: '🔥 Growing fast', growing: '📈 Growing', stable: '⚖️ Stable' }

/** 0–100 fit between a student's ordered code (e.g. "IAS") and a career's codes. */
export function fit(student: string, career: string[] = []) {
  const w = [3, 2, 1]
  let s = 0
  student.split('').slice(0, 3).forEach((c, i) => {
    const j = career.indexOf(c)
    if (j >= 0) s += w[i] * (j === 0 ? 1.3 : 1)
  })
  return Math.min(100, Math.round((s / 7.8) * 100))
}
