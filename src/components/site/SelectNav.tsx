'use client'
import { useRouter } from 'next/navigation'

export function SelectNav({ options, value, label }: { options: { href: string; label: string; value: string }[]; value: string; label: string }) {
  const router = useRouter()
  return (
    <select aria-label={label} className="chip" value={value} onChange={(e) => router.push(options.find((o) => o.value === e.target.value)?.href || '/reviews')}>
      {options.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
    </select>
  )
}
