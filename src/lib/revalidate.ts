/** Refresh every public page straight after an admin save (no 60-second wait). */
export async function refreshSite({ doc }: { doc?: unknown } = {}) {
  try {
    const { revalidatePath } = await import('next/cache')
    revalidatePath('/', 'layout')
  } catch {
    // Not running inside Next.js (e.g. seed scripts) — nothing to refresh.
  }
  return doc
}
