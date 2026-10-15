import React from 'react'
import path from 'path'
import { Document, Image, Page, Text, View, StyleSheet, renderToBuffer } from '@react-pdf/renderer'
import { band, ranked, type Scores } from './scoring'

const C = { ink: '#16163F', coral: '#FF6B4A', marigold: '#FFB627', lagoon: '#0FA3A3', lilac: '#EEEAFF', paper: '#FBF8F3', mute: '#5B5B78' }
const LOGO = path.join(process.cwd(), 'public', 'logo.png')
const BARS = [C.coral, C.lagoon, C.marigold, '#7C6CF0', '#E2557B', '#3BAA6E', '#2F7FD8', '#B4772E']

const s = StyleSheet.create({
  page: { padding: 0, fontFamily: 'Helvetica', fontSize: 10.5, color: C.ink, backgroundColor: '#FFFFFF' },
  head: { backgroundColor: C.ink, color: '#fff', paddingHorizontal: 40, paddingTop: 30, paddingBottom: 26 },
  brand: { fontFamily: 'Helvetica-Bold', fontSize: 20, letterSpacing: 3 },
  tag: { color: C.marigold, fontSize: 8.5, letterSpacing: 2, marginTop: 3 },
  title: { fontFamily: 'Helvetica-Bold', fontSize: 22, marginTop: 18 },
  body: { paddingHorizontal: 40, paddingTop: 22 },
  h2: { fontFamily: 'Helvetica-Bold', fontSize: 13, marginBottom: 8, marginTop: 14 },
  grid: { flexDirection: 'row', flexWrap: 'wrap', backgroundColor: C.paper, borderRadius: 8, padding: 12 },
  cell: { width: '50%', marginBottom: 5 },
  lab: { color: C.mute, fontSize: 8.5 },
  row: { marginBottom: 9 },
  barBg: { height: 9, backgroundColor: C.lilac, borderRadius: 5, marginTop: 3 },
  desc: { color: C.mute, fontSize: 8.5, marginTop: 2 },
  rec: { backgroundColor: C.paper, borderLeftWidth: 3, borderLeftColor: C.coral, padding: 12, lineHeight: 1.5 },
  foot: { position: 'absolute', bottom: 22, left: 40, right: 40, fontSize: 8, color: C.mute, borderTopWidth: 1, borderTopColor: '#E6E2D8', paddingTop: 8, flexDirection: 'row', justifyContent: 'space-between' },
})

type Props = {
  user: { name: string; email: string; school?: string | null; grade?: string | null; dateOfBirth?: string | null }
  test: { name: string; code: string; dimensions?: { key: string; label: string; description?: string | null }[] | null }
  attempt: { scores?: unknown; recommendations?: string | null; submittedAt?: string | null }
}

function Report({ user, test, attempt }: Props) {
  const scores = (attempt.scores || {}) as Scores
  const rows = ranked(scores)
  const desc = Object.fromEntries((test.dimensions || []).map((d) => [d.key, d.description]))
  const date = new Date(attempt.submittedAt || Date.now()).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })
  return (
    <Document title={`${user.name} – ${test.name}`} author="EDUSIGHT">
      <Page size="A4" style={s.page}>
        <View style={s.head}>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            {/* eslint-disable-next-line jsx-a11y/alt-text */}
            <Image src={LOGO} style={{ width: 54, height: 54, marginRight: 12 }} />
            <View>
              <Text style={s.brand}>EDUSIGHT</Text>
              <Text style={s.tag}>CLARITY · CONFIDENCE · DIRECTION</Text>
            </View>
          </View>
          <Text style={s.title}>{test.name} Report</Text>
        </View>
        <View style={s.body}>
          <View style={s.grid}>
            {[
              ['Student', user.name],
              ['Date', date],
              ['School', user.school || '—'],
              ['Grade', user.grade || '—'],
            ].map(([k, v]) => (
              <View key={k} style={s.cell}>
                <Text style={s.lab}>{k}</Text>
                <Text>{v}</Text>
              </View>
            ))}
          </View>

          <Text style={s.h2}>Your profile</Text>
          {rows.map(([k, v], i) => (
            <View key={k} style={s.row} wrap={false}>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                <Text style={{ fontFamily: 'Helvetica-Bold' }}>{v.label}</Text>
                <Text>
                  {v.raw}/{v.max} · {band(v.pct)}
                </Text>
              </View>
              <View style={s.barBg}>
                <View style={{ width: `${v.pct}%`, height: 9, borderRadius: 5, backgroundColor: BARS[i % BARS.length] }} />
              </View>
              {desc[k] ? <Text style={s.desc}>{desc[k]}</Text> : null}
            </View>
          ))}

          <Text style={s.h2}>Counsellor recommendations</Text>
          <View style={s.rec}>
            <Text>{attempt.recommendations || ''}</Text>
          </View>
          <Text style={[s.desc, { marginTop: 12 }]}>
            This report reflects self-reported preferences at the time of the test and is a starting point for discussion,
            not a fixed label. Reviewed by Bhavana Sood, Counselling Psychologist & Career Advisor.
          </Text>
        </View>
        <View style={s.foot} fixed>
          <Text>EDUSIGHT · Dubai, UAE · edusightconsulting.com</Text>
          <Text>+971 50 451 8940 · edusightguidance@gmail.com</Text>
        </View>
      </Page>
    </Document>
  )
}

export async function buildReportPdf(p: Props): Promise<Buffer> {
  return renderToBuffer(<Report {...p} />)
}
