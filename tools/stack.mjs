import { svg, text, MONO } from './lib.mjs'
import { STACK } from './content.mjs'

const W = 1000
const H = 128
const M = 26
const BAR_Y = 56
const BAR_H = 26

export function stack(t) {
  const total = STACK.langs.reduce((a, l) => a + l.bytes, 0)
  const usable = W - M * 2
  // a ultima faixa e o agregado 'outros': cinza neutro, para nao competir com uma linguagem real
  const ramp = [t.blue, t.purple, t.amber, t.pink, t.green, t.muted]

  let cursor = M
  const segs = []
  const legend = []
  STACK.langs.forEach((l, i) => {
    const w = Math.max(3, (l.bytes / total) * usable)
    const c = ramp[i % ramp.length]
    const first = i === 0
    const last = i === STACK.langs.length - 1
    const r = first || last ? 6 : 0
    segs.push(`<rect x="${cursor}" y="${BAR_Y}" width="${w.toFixed(1)}" height="${BAR_H}" rx="${r}" fill="${c}">
      <animate attributeName="width" from="0" to="${w.toFixed(1)}" dur="0.9s" begin="${(0.15 + i * 0.09).toFixed(2)}s" fill="freeze"/>
    </rect>`)
    const lx = M + i * ((usable) / STACK.langs.length)
    legend.push(`<g>
      <rect x="${lx}" y="${BAR_Y + 42}" width="9" height="9" rx="2.5" fill="${c}"/>
      ${text(lx + 15, BAR_Y + 50, `${l.name}`, { size: 11.5, weight: 700, fill: t.text })}
      ${text(lx + 15, BAR_Y + 65, `${l.pct}%  ${l.human}`, { size: 10.5, family: MONO, fill: t.muted })}
    </g>`)
    cursor += w
  })

  const body = `
  <rect width="${W}" height="${H}" rx="13" fill="${t.surface}" stroke="${t.border}"/>
  ${text(M, 32, STACK.eyebrow, { size: 11, family: MONO, fill: t.muted, spacing: 1.6, weight: 600 })}
  ${text(W - M, 32, STACK.right, { size: 11, family: MONO, fill: t.blue, anchor: 'end', weight: 600 })}
  <rect x="${M}" y="${BAR_Y}" width="${usable}" height="${BAR_H}" rx="6" fill="${t.surfaceAlt}"/>
  ${segs.join('')}
  ${legend.join('')}`

  return svg({ w: W, h: H, label: STACK.alt, title: STACK.title, defs: '', body })
}
