import { RichText, type JSXConvertersFunction } from '@payloadcms/richtext-lexical/react'
import type { SerializedEditorState } from '@payloadcms/richtext-lexical/lexical'

const ytId = (url = '') => url.match(/(?:youtu\.be\/|v=|embed\/|shorts\/)([\w-]{11})/)?.[1]
const ICON: Record<string, string> = { tip: '💡', warn: '⚠️', info: '✨' }

const converters: JSXConvertersFunction = ({ defaultConverters }) => ({
  ...defaultConverters,
  blocks: {
    youtube: ({ node }: { node: { fields: unknown } }) => {
      const id = ytId((node.fields as { url?: string }).url)
      return id ? (
        <div className="video">
          <iframe src={`https://www.youtube-nocookie.com/embed/${id}`} title="YouTube video" loading="lazy" allowFullScreen />
        </div>
      ) : null
    },
    callout: ({ node }: { node: { fields: unknown } }) => {
      const f = node.fields as { style?: string; title?: string; text?: string }
      return (
        <aside className={`callout callout-${f.style || 'tip'}`}>
          <b>{ICON[f.style || 'tip']} {f.title}</b>
          <p>{f.text}</p>
        </aside>
      )
    },
  },
})

export function Rich({ data }: { data?: unknown }) {
  if (!data) return null
  return <div className="prose"><RichText data={data as SerializedEditorState} converters={converters} /></div>
}
