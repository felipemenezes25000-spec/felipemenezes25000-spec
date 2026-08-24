import { svg, text, esc, linearGrad, MONO, SANS } from './lib.mjs'
import { ARCH } from './content.mjs'

const W = 1000
const H = 470
const M = 30
const INNER = W - M * 2

// distribui n caixas na largura util, com folga fixa
function lane(n, gap = 12) {
  const w = (INNER - gap * (n - 1)) / n
  return Array.from({ length: n }, (_, i) => ({ x: M + i * (w + gap), w }))
}

export function arch(t) {
  const dark = t.name === 'dark'

  const defs = [
    `<linearGradient id="api" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0" stop-color="${t.purple}" stop-opacity="${dark ? 0.2 : 0.13}"/>
      <stop offset="1" stop-color="${t.blue}" stop-opacity="${dark ? 0.16 : 0.09}"/>
    </linearGradient>`,
    linearGrad('edge', t.blue, t.purple),
  ].join('\n    ')

  const clients = lane(ARCH.clients.length)
  const infra = lane(ARCH.infra.length, 10)

  const CY = 52, CH = 66
  const AY = 158, AH = 92
  const OY = 274, OH = 52
  const IY = 372, IH = 66

  const flowDown = (x, y1, y2, color, dur) =>
    `<path d="M${x} ${y1} V${y2}" stroke="${color}" stroke-width="1.5" stroke-opacity="0.55" stroke-dasharray="5 7" fill="none">
      <animate attributeName="stroke-dashoffset" from="0" to="-24" dur="${dur}s" repeatCount="indefinite"/>
    </path>`

  const clientBoxes = ARCH.clients.map((c, i) => {
    const { x, w } = clients[i]
    return `
    <g>
      <rect x="${x}" y="${CY}" width="${w}" height="${CH}" rx="10" fill="${t.surfaceAlt}" stroke="${t.border}"/>
      <circle cx="${x + 18}" cy="${CY + 21}" r="3.5" fill="${t.blue}"/>
      ${text(x + 32, CY + 26, c.title, { size: 14.5, weight: 700, fill: t.text })}
      ${text(x + 18, CY + 50, c.sub, { size: 10.5, family: MONO, fill: t.muted })}
    </g>`
  }).join('')

  const clientFlows = clients.map((c) => flowDown(c.x + c.w / 2, CY + CH, AY, t.blue, 1.1)).join('')

  const chipN = ARCH.apiChips.length
  const chipGap = 10
  const chipW = (INNER - 44 - chipGap * (chipN - 1)) / chipN
  const apiChips = ARCH.apiChips.map((chip, i) => {
    const cw = chipW, cx = M + 22 + i * (cw + chipGap)
    return `<g>
      <rect x="${cx}" y="${AY + 46}" width="${cw}" height="28" rx="8" fill="${t.surface}" stroke="${t.borderSoft}"/>
      ${text(cx + cw / 2, AY + 65, chip, { size: 11, family: MONO, fill: t.textSoft, anchor: 'middle' })}
    </g>`
  }).join('')

  const apiBand = `
    <rect x="${M}" y="${AY}" width="${INNER}" height="${AH}" rx="12" fill="url(#api)" stroke="${t.purple}" stroke-opacity="0.45"/>
    ${text(M + 22, AY + 30, ARCH.api.title, { size: 16.5, weight: 800, fill: t.text })}
    ${text(W - M - 22, AY + 30, ARCH.api.right, { size: 11, family: MONO, fill: t.muted, anchor: 'end' })}
    ${apiChips}`

  const outboxBand = `
    <rect x="${M}" y="${OY}" width="${INNER}" height="${OH}" rx="10" fill="${t.surfaceAlt}" stroke="${t.green}" stroke-opacity="0.5" stroke-dasharray="6 4"/>
    <circle cx="${M + 24}" cy="${OY + OH / 2}" r="4" fill="${t.green}">
      <animate attributeName="fill-opacity" values="1;0.25;1" dur="2.2s" repeatCount="indefinite"/>
    </circle>
    ${text(M + 40, OY + 26, ARCH.outbox.title, { size: 13.5, weight: 700, fill: t.text })}
    ${text(M + 40, OY + 42, ARCH.outbox.sub, { size: 10.5, family: MONO, fill: t.muted })}
    ${text(W - M - 20, OY + 33, ARCH.outbox.right, { size: 11, family: MONO, fill: t.green, anchor: 'end', weight: 700 })}`

  const apiToOutbox = flowDown(W / 2, AY + AH, OY, t.purple, 1.3)
  const outboxFlows = infra.map((c) => flowDown(c.x + c.w / 2, OY + OH, IY, t.purple, 1.35)).join('')

  const infraBoxes = ARCH.infra.map((c, i) => {
    const { x, w } = infra[i]
    return `
    <g>
      <rect x="${x}" y="${IY}" width="${w}" height="${IH}" rx="10" fill="${t.surfaceAlt}" stroke="${t.border}"/>
      ${text(x + w / 2, IY + 26, c.title, { size: 12.5, weight: 700, fill: t.text, anchor: 'middle' })}
      ${text(x + w / 2, IY + 46, c.sub, { size: 9.5, family: MONO, fill: t.muted, anchor: 'middle' })}
    </g>`
  }).join('')

  const body = `
  <rect width="${W}" height="${H}" rx="14" fill="${t.surface}" stroke="${t.border}"/>
  ${text(M, 28, ARCH.eyebrow, { size: 11, family: MONO, fill: t.muted, spacing: 1.6, weight: 600 })}
  ${text(W - M, 28, ARCH.eyebrowRight, { size: 11, family: MONO, fill: t.blue, spacing: 1.2, weight: 600, anchor: 'end' })}
  ${clientFlows}
  ${apiToOutbox}
  ${outboxFlows}
  ${clientBoxes}
  ${apiBand}
  ${outboxBand}
  ${infraBoxes}
  ${text(W / 2, H - 14, ARCH.footnote, { size: 11, family: MONO, fill: t.muted, anchor: 'middle' })}`

  return svg({ w: W, h: H, label: ARCH.alt, title: ARCH.title, defs, body })
}
