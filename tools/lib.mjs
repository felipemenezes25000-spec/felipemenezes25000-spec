// Primitivas de desenho + paletas. Nada aqui conhece o conteudo do perfil.

export const THEMES = {
  light: {
    name: 'light',
    bg0: '#ffffff',
    bg1: '#f6f8fa',
    bg2: '#eef1fb',
    surface: '#ffffff',
    surfaceAlt: '#f6f8fa',
    border: '#d0d7de',
    borderSoft: '#e4e8ed',
    text: '#0d1117',
    textSoft: '#424a53',
    muted: '#5b636c',
    grid: '#0d1117',
    gridOpacity: 0.05,
    blue: '#0757ba',
    indigo: '#3444c7',
    purple: '#6224b8',
    green: '#116329',
    pink: '#a8215f',
    amber: '#9a5c00',
    shadow: '#0d1117',
  },
  dark: {
    name: 'dark',
    bg0: '#0d1117',
    bg1: '#11161f',
    bg2: '#171b2e',
    surface: '#151b23',
    surfaceAlt: '#1b222c',
    border: '#3d444d',
    borderSoft: '#2a313c',
    text: '#e6edf3',
    textSoft: '#c3ccd6',
    muted: '#9aa4af',
    grid: '#e6edf3',
    gridOpacity: 0.05,
    blue: '#6cb6ff',
    indigo: '#9ea7ff',
    purple: '#d2a8ff',
    green: '#57d364',
    pink: '#f778ba',
    amber: '#e3b341',
    shadow: '#010409',
  },
}

// Tudo que nao for ASCII vira entidade numerica: o SVG renderiza igual
// em qualquer proxy, independente do header de charset.
export function esc(s) {
  return String(s)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/[\u0080-\uFFFF]/g, (c) => `&#${c.charCodeAt(0)};`)
}

export const SANS = `'Segoe UI', system-ui, -apple-system, 'Helvetica Neue', Arial, sans-serif`
export const MONO = `ui-monospace, SFMono-Regular, 'SF Mono', Menlo, Consolas, 'Liberation Mono', monospace`

export function text(x, y, s, o = {}) {
  const {
    size = 14,
    weight = 400,
    fill = 'currentColor',
    family = SANS,
    anchor = 'start',
    spacing = null,
    opacity = null,
  } = o
  const attrs = [
    `x="${x}"`,
    `y="${y}"`,
    `font-family="${family}"`,
    `font-size="${size}"`,
    weight !== 400 ? `font-weight="${weight}"` : '',
    `fill="${fill}"`,
    anchor !== 'start' ? `text-anchor="${anchor}"` : '',
    spacing !== null ? `letter-spacing="${spacing}"` : '',
    opacity !== null ? `opacity="${opacity}"` : '',
  ].filter(Boolean).join(' ')
  return `<text ${attrs}>${esc(s)}</text>`
}

// Barra de 3px no topo de um card.
// O atributo base ja e o estado FINAL: quem nao roda animacao (rasterizador,
// leitor sem SMIL, prefers-reduced-motion) ve o grafico completo, nao vazio.
export function accentBar(x, y, w, gradId, delay) {
  return `<rect x="${x}" y="${y}" width="${w}" height="3" rx="1.5" fill="url(#${gradId})">
      <animate attributeName="width" from="0" to="${w}" dur="0.85s" begin="${delay}s" fill="freeze"/>
    </rect>`
}

export function linearGrad(id, from, to, vertical = false) {
  const c = vertical ? 'x1="0" y1="0" x2="0" y2="1"' : 'x1="0" y1="0" x2="1" y2="0"'
  return `<linearGradient id="${id}" ${c}><stop offset="0" stop-color="${from}"/><stop offset="1" stop-color="${to}"/></linearGradient>`
}

export function gridPattern(id, t, step = 40) {
  return `<pattern id="${id}" width="${step}" height="${step}" patternUnits="userSpaceOnUse">
      <path d="M${step} 0 V${step} M0 ${step} H${step}" fill="none" stroke="${t.grid}" stroke-opacity="${t.gridOpacity}" stroke-width="1"/>
    </pattern>`
}

export function svg({ w, h, label, title, defs = '', body }) {
  return `<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 ${w} ${h}" width="${w}" height="${h}" role="img" aria-label="${esc(label)}">
  <title>${esc(title)}</title>
  <defs>
${defs}
  </defs>
${body}
</svg>
`
}
