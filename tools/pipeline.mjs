import { svg, text, esc, linearGrad, MONO, SANS } from './lib.mjs'
import { PIPELINE } from './content.mjs'

const W = 1000
const H = 210
const Y = 112
const X0 = 100
const X1 = 900

export function pipeline(t) {
  const dark = t.name === 'dark'
  const n = PIPELINE.steps.length
  const gap = (X1 - X0) / (n - 1)
  const xs = PIPELINE.steps.map((_, i) => X0 + i * gap)
  const ramp = [t.blue, t.indigo, t.purple, t.pink, t.green]

  const defs = [
    linearGrad('track', t.blue, t.green),
    `<filter id="glow" x="-60%" y="-60%" width="220%" height="220%">
      <feGaussianBlur stdDeviation="4" result="b"/>
      <feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge>
    </filter>`,
  ].join('\n    ')

  const trackBase = `<line x1="${X0}" y1="${Y}" x2="${X1}" y2="${Y}" stroke="${t.borderSoft}" stroke-width="3" stroke-linecap="round"/>`

  const trackFill = `<line x1="${X0}" y1="${Y}" x2="${X1}" y2="${Y}" stroke="url(#track)" stroke-width="3" stroke-linecap="round"
      stroke-dasharray="${X1 - X0}" stroke-dashoffset="0">
      <animate attributeName="stroke-dashoffset" from="${X1 - X0}" to="0" dur="2.4s" begin="0.2s" fill="freeze"/>
    </line>`

  const nodes = PIPELINE.steps.map((s, i) => {
    const x = xs[i]
    const c = ramp[i % ramp.length]
    const begin = (0.3 + i * 0.42).toFixed(2)
    const last = i === n - 1
    return `
    <g>
      ${last ? `<circle cx="${x}" cy="${Y}" r="13" fill="none" stroke="${c}" stroke-width="1.4" stroke-opacity="0.5">
        <animate attributeName="r" values="13;26" dur="2.6s" begin="${begin}s" repeatCount="indefinite"/>
        <animate attributeName="stroke-opacity" values="0.5;0" dur="2.6s" begin="${begin}s" repeatCount="indefinite"/>
      </circle>` : ''}
      <circle cx="${x}" cy="${Y}" r="11" fill="${t.surface}" stroke="${c}" stroke-width="2.4"/>
      <circle cx="${x}" cy="${Y}" r="4.5" fill="${c}" filter="url(#glow)"/>
      ${text(x, Y - 30, String(i + 1).padStart(2, '0'), { size: 11, family: MONO, fill: c, anchor: 'middle', weight: 700, spacing: 1 })}
      ${text(x, Y + 38, s.label, { size: 13.5, weight: 700, fill: t.text, anchor: 'middle' })}
      ${text(x, Y + 58, s.proof, { size: 11, family: MONO, fill: t.muted, anchor: 'middle' })}
    </g>`
  }).join('')

  const body = `
  <rect width="${W}" height="${H}" rx="14" fill="${t.surface}" stroke="${t.border}"/>
  <rect x="0" y="0" width="${W}" height="${H}" rx="14" fill="${t.blue}" fill-opacity="${dark ? 0.03 : 0.015}"/>
  ${text(30, 34, PIPELINE.eyebrow, { size: 11, family: MONO, fill: t.muted, spacing: 1.7, weight: 600 })}
  ${text(30, 62, PIPELINE.title, { size: 17, weight: 700, fill: t.text })}
  ${trackBase}
  ${trackFill}
  ${nodes}
  ${text(W / 2, H - 16, PIPELINE.footnote, { size: 12, family: MONO, fill: t.muted, anchor: 'middle' })}`

  return svg({ w: W, h: H, label: PIPELINE.alt, title: PIPELINE.title, defs, body })
}
