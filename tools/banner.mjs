import { svg, text, esc, linearGrad, gridPattern, SANS, MONO } from './lib.mjs'
import { PROFILE } from './content.mjs'

const W = 1000
const H = 280

export function banner(t) {
  const dark = t.name === 'dark'

  const defs = [
    `<linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="${t.bg0}"/>
      <stop offset="0.55" stop-color="${t.bg1}"/>
      <stop offset="1" stop-color="${t.bg2}"/>
    </linearGradient>`,
    `<linearGradient id="rail" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="${t.blue}"/>
      <stop offset="0.5" stop-color="${t.indigo}"/>
      <stop offset="1" stop-color="${t.purple}"/>
    </linearGradient>`,
    linearGrad('accent', t.blue, t.purple),
    `<linearGradient id="name" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0" stop-color="${t.text}"/>
      <stop offset="0.68" stop-color="${dark ? '#a9c7ff' : '#1b3f70'}"/>
      <stop offset="1" stop-color="${t.purple}"/>
    </linearGradient>`,
    gridPattern('grid', t, 40),
    `<clipPath id="round"><rect x="0" y="0" width="${W}" height="${H}" rx="16"/></clipPath>`,
    // batimento: linha de base com 3 complexos QRS
    `<path id="ecg" fill="none" d="M 0 244 H 120 l 18 0 l 11 -9 l 11 20 l 13 -44 l 13 44 l 11 -13 l 11 0 H 400 l 18 0 l 11 -7 l 11 16 l 13 -34 l 13 34 l 11 -11 l 11 0 H 690 l 18 0 l 11 -9 l 11 20 l 13 -44 l 13 44 l 11 -13 l 11 0 H ${W}"/>`,
  ].join('\n    ')

  const chip = `
    <g transform="translate(56 34)">
      <rect x="0" y="0" width="${PROFILE.chip.length * 8 + 46}" height="26" rx="13" fill="${t.blue}" fill-opacity="${dark ? 0.16 : 0.08}" stroke="${t.blue}" stroke-opacity="0.34"/>
      <circle cx="17" cy="13" r="4" fill="${t.green}">
        <animate attributeName="fill-opacity" values="1;0.2;1" dur="2.4s" repeatCount="indefinite"/>
      </circle>
      ${text(30, 17.5, PROFILE.chip, { size: 11, family: MONO, fill: t.blue, spacing: 1.5, weight: 600 })}
    </g>`

  // ping de monitoracao no canto direito
  const ping = `
    <g transform="translate(886 104)">
      <circle r="5.5" fill="${t.blue}" fill-opacity="0.95"/>
      ${[0, 1, 2].map((i) => `
      <circle r="9" fill="none" stroke="${[t.blue, t.indigo, t.purple][i]}" stroke-width="1.4" stroke-opacity="0.4">
        <animate attributeName="r" values="9;58" dur="3.3s" begin="${(i * 1.1).toFixed(2)}s" repeatCount="indefinite"/>
        <animate attributeName="stroke-opacity" values="0.45;0" dur="3.3s" begin="${(i * 1.1).toFixed(2)}s" repeatCount="indefinite"/>
      </circle>`).join('')}
    </g>`

  const roles = `
    <text x="56" y="166" font-family="${SANS}" font-size="18" font-weight="600" fill="${t.textSoft}">${PROFILE.roles
      .map((r, i) => (i === 0 ? esc(r) : `<tspan fill="${i % 2 ? t.purple : t.blue}" font-weight="700">&#160;&#160;/&#160;&#160;</tspan>${esc(r)}`))
      .join('')}</text>`

  const ecg = `
    <use xlink:href="#ecg" stroke="url(#accent)" stroke-width="9" stroke-opacity="0.14" stroke-linecap="round" stroke-linejoin="round" stroke-dasharray="1400" stroke-dashoffset="0">
      <animate attributeName="stroke-dashoffset" from="1400" to="0" dur="3.2s" fill="freeze"/>
    </use>
    <use xlink:href="#ecg" stroke="url(#accent)" stroke-width="2.3" stroke-linecap="round" stroke-linejoin="round" stroke-dasharray="1400" stroke-dashoffset="0">
      <animate attributeName="stroke-dashoffset" from="1400" to="0" dur="3.2s" fill="freeze"/>
    </use>
    <circle r="4" fill="${t.text}" fill-opacity="0.85">
      <animateMotion dur="6.5s" repeatCount="indefinite" begin="3s" rotate="auto"><mpath xlink:href="#ecg"/></animateMotion>
    </circle>`

  const body = `
  <g clip-path="url(#round)">
    <rect width="${W}" height="${H}" fill="url(#bg)"/>
    <rect width="${W}" height="${H}" fill="url(#grid)"/>
    ${ping}
    <rect x="0" y="0" width="5" height="${H}" fill="url(#rail)"/>
    ${chip}
    <text x="54" y="130" font-family="${SANS}" font-size="52" font-weight="800" letter-spacing="0.4" fill="url(#name)">${esc(PROFILE.name)}</text>
    ${roles}
    ${text(56, 196, PROFILE.tagline, { size: 13.5, family: MONO, fill: t.muted })}
    ${ecg}
    <rect x="0.5" y="0.5" width="${W - 1}" height="${H - 1}" rx="16" fill="none" stroke="${t.border}"/>
  </g>`

  return svg({ w: W, h: H, label: PROFILE.bannerAlt, title: `${PROFILE.name} — ${PROFILE.roles.join(' / ')}`, defs, body })
}
