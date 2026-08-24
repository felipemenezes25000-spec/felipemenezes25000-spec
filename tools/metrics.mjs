import { svg, text, linearGrad, accentBar, MONO } from './lib.mjs'
import { METRICS } from './content.mjs'

const W = 1000
const H = 158
const GAP = 12

export function metrics(t) {
  const n = METRICS.tiles.length
  const tw = (W - GAP * (n - 1)) / n
  const ramp = [t.blue, t.purple, t.green, t.pink, t.amber]

  const defs = ramp.map((c, i) => linearGrad(`m${i}`, c, c)).join('\n    ')

  const tiles = METRICS.tiles.map((tile, i) => {
    const x = i * (tw + GAP)
    const c = ramp[i % ramp.length]
    const begin = (0.1 + i * 0.14).toFixed(2)
    const big = tile.value.length > 8 ? 26 : tile.value.length > 6 ? 30 : 34
    return `
    <g>
      <rect x="${x}" y="0" width="${tw}" height="${H}" rx="13" fill="${t.surface}" stroke="${t.border}"/>
      ${accentBar(x, 0, tw, `m${i % ramp.length}`, Number(begin) + 0.18)}
      ${text(x + 20, 38, tile.eyebrow, { size: 10.5, family: MONO, fill: c, spacing: 1.4, weight: 700 })}
      ${text(x + 20, 94, tile.value, { size: big, weight: 800, fill: t.text })}
      ${text(x + 20, 120, tile.caption, { size: 12, fill: t.muted })}
      ${text(x + 20, 138, tile.proof, { size: 10, family: MONO, fill: t.muted, opacity: 0.75 })}
    </g>`
  }).join('')

  return svg({ w: W, h: H, label: METRICS.alt, title: METRICS.title, defs, body: `  <g>${tiles}</g>` })
}
