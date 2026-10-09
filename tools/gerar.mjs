// Gera as ilustrações animadas do perfil (SVG puro: CSS + SMIL, sem JavaScript, sem fonte externa).
// Uso: node tools/gerar.mjs        → escreve em assets/
import { writeFileSync, mkdirSync, rmSync, existsSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const RAIZ = join(dirname(fileURLToPath(import.meta.url)), '..');
const OUT = join(RAIZ, 'assets');
if (existsSync(OUT)) rmSync(OUT, { recursive: true });
mkdirSync(OUT, { recursive: true });

const SANS = "'Segoe UI', Inter, -apple-system, BlinkMacSystemFont, 'Helvetica Neue', Arial, sans-serif";
const MONO = "'Cascadia Code', 'JetBrains Mono', SFMono-Regular, Consolas, Menlo, monospace";
const C = {
  tinta: '#050816', noite: '#0B1236', fundo: '#0F172A', branco: '#F8FAFC', claro: '#E2E8F0', muted: '#94A3B8',
  ciano: '#22D3EE', menta: '#34D399', violeta: '#A78BFA', ambar: '#FBBF24', laranja: '#FB923C', rosa: '#F472B6', azul: '#60A5FA',
};
const r2 = (n) => Math.round(n * 100) / 100;
const esc = (s) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
let semente = 20261009;
const rnd = () => ((semente = (semente * 1103515245 + 12345) % 2147483648) / 2147483648);
const salvar = (nome, svg) => {
  writeFileSync(join(OUT, nome), svg.replace(/\n\s*\n/g, '\n'), 'utf8');
  console.log('ok', nome, `${(svg.length / 1024).toFixed(1)} KB`);
};
const pct = (f) => `${r2(f * 100)}%`;

// ── ícones vetoriais pequenos (sem depender de fonte de emoji) ──────────────
const iconeSol = (x, y, s, cor) => {
  const raios = Array.from({ length: 8 }, (_, i) => {
    const a = (i * Math.PI) / 4;
    return `<line x1="${r2(x + Math.cos(a) * s * 0.62)}" y1="${r2(y + Math.sin(a) * s * 0.62)}" x2="${r2(x + Math.cos(a) * s * 0.9)}" y2="${r2(y + Math.sin(a) * s * 0.9)}"/>`;
  }).join('');
  return `<g stroke="${cor}" stroke-width="${r2(s * 0.12)}" stroke-linecap="round"><circle cx="${x}" cy="${y}" r="${r2(s * 0.36)}" fill="${cor}" stroke="none"/>${raios}</g>`;
};
const iconeLua = (x, y, s, cor, id) =>
  `<mask id="${id}"><rect x="${x - s}" y="${y - s}" width="${2 * s}" height="${2 * s}" fill="#fff"/><circle cx="${r2(x + s * 0.32)}" cy="${r2(y - s * 0.22)}" r="${r2(s * 0.62)}" fill="#000"/></mask><circle cx="${x}" cy="${y}" r="${r2(s * 0.7)}" fill="${cor}" mask="url(#${id})"/>`;

// ═════════════════════════════════════════════════════════════════════════
// 1. HERÓI — cidade viva com ciclo de dia e noite (24 s = 24 h)
// ═════════════════════════════════════════════════════════════════════════
function heroi() {
  const W = 1280, H = 600, T = 24, HORIZ = 520;
  const kt = '0;0.30;0.40;0.50;0.80;0.90;1';
  const ceu = [
    ['#4FA3F7', '#3B3F8F', '#1B1F4B', '#050816', '#050816', '#2A2F6B', '#4FA3F7'],
    ['#8CC8FF', '#C2588B', '#3C2A6B', '#0B1236', '#0B1236', '#7A5BA8', '#8CC8FF'],
    ['#DDF0FF', '#FFB36B', '#8A4F7D', '#1A2150', '#1A2150', '#F2A7A0', '#DDF0FF'],
  ];
  const stops = ceu.map((v, i) => `<stop offset="${[0, 0.55, 1][i]}" stop-color="${v[0]}"><animate attributeName="stop-color" values="${v.join(';')}" keyTimes="${kt}" dur="${T}s" repeatCount="indefinite"/></stop>`).join('');

  // estrelas
  let estrelas = '';
  for (let i = 0; i < 90; i++) {
    const x = r2(rnd() * W), y = r2(rnd() * 360), r = r2(0.5 + rnd() * 1.4);
    const pisca = rnd() < 0.4 ? ` class="pisca" style="animation-duration:${r2(1.6 + rnd() * 3)}s;animation-delay:-${r2(rnd() * 3)}s"` : '';
    estrelas += `<circle cx="${x}" cy="${y}" r="${r}" fill="#FFFFFF"${pisca}/>`;
  }

  // prédios: camada de trás (mais altos e esmaecidos) e da frente (com janelas)
  const especiais = [[690, 810], [880, 1080]]; // torre do banco e UBS
  const livre = (x, w) => especiais.every(([a, b]) => x + w < a - 6 || x > b + 6);
  let tras = '', frente = '', janelas = '';
  for (let x = -20; x < W; ) {
    const w = 46 + rnd() * 70, h = 120 + rnd() * 190;
    tras += `<rect x="${r2(x)}" y="${r2(HORIZ - h)}" width="${r2(w)}" height="${r2(h)}"/>`;
    x += w - 8;
  }
  for (let x = -10; x < W; ) {
    const w = 52 + rnd() * 64;
    if (!livre(x, w)) { x += 18; continue; }
    const teto = x < 640 ? 200 : 300;
    const h = 70 + rnd() * (teto - 70);
    frente += `<rect x="${r2(x)}" y="${r2(HORIZ - h)}" width="${r2(w)}" height="${r2(h)}" rx="2"/>`;
    for (let jy = HORIZ - h + 14; jy < HORIZ - 16; jy += 20) {
      for (let jx = x + 9; jx < x + w - 14; jx += 15) {
        if (rnd() < 0.5) continue;
        janelas += `<rect x="${r2(jx)}" y="${r2(jy)}" width="7" height="10" rx="1" style="animation-delay:${r2(rnd() * 2.6)}s"/>`;
      }
    }
    x += w + 4 + rnd() * 10;
  }

  // torre do banco (SRE) e UBS
  const tx = 700, tw = 100, th = 330;
  let vidros = '';
  for (let i = 0; i < 5; i++) vidros += `<rect x="${tx + 10 + i * 18}" y="${HORIZ - th + 18}" width="10" height="${th - 30}" rx="2" fill="#FFFFFF" fill-opacity=".10"/>`;
  let janTorre = '';
  for (let jy = HORIZ - th + 26; jy < HORIZ - 20; jy += 18) for (let i = 0; i < 5; i++) if (rnd() < 0.6) janTorre += `<rect x="${tx + 11 + i * 18}" y="${jy}" width="8" height="9" rx="1" style="animation-delay:${r2(rnd() * 2.6)}s"/>`;
  const ux = 890, uw = 180, uh = 120;
  let janUbs = '';
  for (let jy = HORIZ - uh + 50; jy < HORIZ - 16; jy += 22) for (let jx = ux + 14; jx < ux + uw - 14; jx += 18) if (Math.abs(jx - (ux + uw / 2)) > 30 && rnd() < 0.7) janUbs += `<rect x="${jx}" y="${jy}" width="9" height="11" rx="1" style="animation-delay:${r2(rnd() * 2.6)}s"/>`;

  // eletrocardiograma atrás dos prédios
  let ecg = `M0 ${HORIZ - 150}`;
  for (const x0 of [540, 820, 1080]) ecg += ` H${x0} q12 -14 24 0 h14 l7 14 l12 -96 l12 112 l9 -30 h18 q20 -26 40 0`;
  ecg += ` H${W}`;

  // relógio: 24 rótulos de hora, um por "hora" do ciclo (início às 09:00)
  let horas = '', cssHoras = '';
  for (let i = 0; i < 24; i++) {
    const h = (9 + i) % 24, a = i / 24, b = (i + 1) / 24;
    cssHoras += `.h${i}{animation:h${i} ${T}s steps(1) infinite} @keyframes h${i}{0%{opacity:${i === 0 ? 1 : 0}} ${i === 0 ? '' : `${pct(a)}{opacity:1}`} ${pct(b)}{opacity:0} 100%{opacity:${i === 0 ? 1 : 0}}}\n`;
    horas += `<text class="h${i}" x="436" y="91" font-family="${MONO}" font-size="17" font-weight="700" fill="${C.branco}" opacity="0">${String(h).padStart(2, '0')}:00</text>`;
  }

  const fase = (dia, noite) => `0%,28%{opacity:${dia}} 40%{opacity:${(dia + noite) / 2}} 48%,80%{opacity:${noite}} 92%,100%{opacity:${dia}}`;

  return `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}" role="img" aria-labelledby="t d">
<title id="t">Felipe Menezes — de dia SRE, de noite telessaúde</title>
<desc id="d">Cidade animada em ciclo de 24 horas: de dia o sol cruza o céu e a torre do banco mostra o status no ar; ao anoitecer as janelas acendem, a lua sobe, a cruz da UBS brilha, um eletrocardiograma corre atrás dos prédios e uma ambulância atravessa a rua.</desc>
<defs>
  <linearGradient id="ceu" x1="0" y1="0" x2="0" y2="1">${stops}</linearGradient>
  <radialGradient id="brilhoSol"><stop offset="0" stop-color="#FFF4C2" stop-opacity=".95"/><stop offset=".35" stop-color="#FFD66B" stop-opacity=".55"/><stop offset="1" stop-color="#FFB347" stop-opacity="0"/></radialGradient>
  <radialGradient id="brilhoLua"><stop offset="0" stop-color="#E0E7FF" stop-opacity=".55"/><stop offset="1" stop-color="#E0E7FF" stop-opacity="0"/></radialGradient>
  <radialGradient id="vinheta" cx=".5" cy=".45" r=".75"><stop offset=".6" stop-color="#000" stop-opacity="0"/><stop offset="1" stop-color="#000" stop-opacity=".35"/></radialGradient>
  <linearGradient id="trilho" x1="0" x2="1"><stop offset="0" stop-color="${C.ambar}"/><stop offset=".5" stop-color="${C.ambar}"/><stop offset=".5" stop-color="${C.violeta}"/><stop offset="1" stop-color="${C.violeta}"/></linearGradient>
  <filter id="sombra" x="-10%" y="-30%" width="120%" height="160%"><feDropShadow dx="0" dy="3" stdDeviation="6" flood-color="#000" flood-opacity=".38"/></filter>
  <filter id="borra" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="6"/></filter>
  <filter id="borra2" x="-20%" y="-50%" width="140%" height="200%"><feGaussianBlur stdDeviation="3"/></filter>
  <mask id="crescente"><rect x="-40" y="-40" width="80" height="80" fill="#fff"/><circle cx="13" cy="-9" r="27" fill="#000"/></mask>
  <clipPath id="quadro"><rect width="${W}" height="${H}" rx="24"/></clipPath>
</defs>
<style>
  .noite{animation:noite ${T}s linear infinite} @keyframes noite{${fase(0, 1)}}
  .dia{animation:dia ${T}s linear infinite} @keyframes dia{${fase(1, 0)}}
  .pisca{animation:pisca 3s ease-in-out infinite} @keyframes pisca{0%,100%{opacity:1}50%{opacity:.25}}
  .sol{animation:sol ${T}s linear infinite}
  @keyframes sol{0%{transform:translate(900px,118px);opacity:1} 15%{transform:translate(1010px,100px)} 28%{transform:translate(1110px,170px)} 36%{transform:translate(1170px,300px)} 42%{transform:translate(1210px,520px);opacity:1} 43%{transform:translate(1210px,600px);opacity:0} 85%{transform:translate(760px,640px);opacity:0} 86%{transform:translate(760px,580px);opacity:1} 94%{transform:translate(850px,250px)} 100%{transform:translate(900px,118px);opacity:1}}
  .ocaso{animation:ocaso ${T}s linear infinite} @keyframes ocaso{0%,20%{opacity:0} 36%,42%{opacity:1} 50%,86%{opacity:1} 95%,100%{opacity:0}}
  .lua{animation:lua ${T}s linear infinite}
  @keyframes lua{0%,44%{transform:translate(1250px,640px);opacity:0} 46%{transform:translate(1230px,520px);opacity:1} 56%{transform:translate(1130px,200px)} 66%{transform:translate(1000px,105px)} 76%{transform:translate(880px,150px)} 84%{transform:translate(830px,380px);opacity:1} 88%{transform:translate(810px,600px);opacity:0} 100%{transform:translate(1250px,640px);opacity:0}}
  .tras{animation:tras ${T}s linear infinite} @keyframes tras{0%,26%{fill:#8FB6E8} 40%{fill:#5B4E86} 50%,80%{fill:#0E1430} 90%{fill:#6E6AA6} 100%{fill:#8FB6E8}}
  .frente{animation:frente ${T}s linear infinite} @keyframes frente{0%,26%{fill:#3B5B8C} 40%{fill:#2B2450} 50%,80%{fill:#070B1C} 90%{fill:#3D3A6E} 100%{fill:#3B5B8C}}
  .chao{animation:chao ${T}s linear infinite} @keyframes chao{0%,26%{fill:#334155} 50%,80%{fill:#04060F} 100%{fill:#334155}}
  .jan rect{opacity:0;animation:jan ${T}s linear infinite} @keyframes jan{0%,36%{opacity:0} 42%,82%{opacity:.92} 88%,100%{opacity:0}}
  .ecg{animation:ecg 4.5s linear infinite} @keyframes ecg{from{stroke-dashoffset:1000}to{stroke-dashoffset:0}}
  .farol{animation:farol 1.1s steps(1) infinite} @keyframes farol{0%,60%{opacity:1}61%,100%{opacity:.15}}
  .amb{animation:amb ${T}s linear infinite} @keyframes amb{0%,54%{transform:translateX(-160px);opacity:0} 55%{opacity:1;transform:translateX(-150px)} 76%{transform:translateX(1420px);opacity:1} 77%,100%{opacity:0;transform:translateX(1420px)}}
  .sirene-a{animation:sirA .5s steps(1) infinite} .sirene-b{animation:sirB .5s steps(1) infinite}
  @keyframes sirA{0%,49%{opacity:1}50%,100%{opacity:.1}} @keyframes sirB{0%,49%{opacity:.1}50%,100%{opacity:1}}
  .cadente{animation:cadente ${T}s linear infinite} @keyframes cadente{0%,60%{stroke-dashoffset:300;opacity:0} 60.5%{opacity:1} 63%{stroke-dashoffset:-300;opacity:0} 100%{opacity:0}}
  .marcador{animation:marcador ${T}s linear infinite} @keyframes marcador{0%{transform:translateX(55px)} 87.5%{transform:translateX(440px)} 87.51%{transform:translateX(0px)} 100%{transform:translateX(55px)}}
  .entra{animation:entra 1.2s cubic-bezier(.16,1,.3,1) both} @keyframes entra{from{opacity:0;transform:translateY(14px)}to{opacity:1;transform:none}}
  ${cssHoras}
</style>
<g clip-path="url(#quadro)">
  <rect width="${W}" height="${H}" fill="url(#ceu)"/>
  <g class="noite">${estrelas}</g>
  <line class="cadente" x1="300" y1="50" x2="560" y2="150" stroke="#FFFFFF" stroke-width="2" stroke-linecap="round" pathLength="300" stroke-dasharray="60 240" opacity="0"/>
  <g class="sol"><circle r="120" fill="url(#brilhoSol)"/><circle r="40" fill="#FFE08A"/><circle class="ocaso" r="40" fill="${C.laranja}" opacity="0"/></g>
  <g class="lua"><circle r="80" fill="url(#brilhoLua)"/><circle r="30" fill="#F1F5F9" mask="url(#crescente)"/></g>
  <g class="tras" fill-opacity=".9">${tras}</g>
  <g class="noite">
    <path d="${ecg}" fill="none" stroke="${C.ciano}" stroke-opacity=".25" stroke-width="2"/>
    <path class="ecg" d="${ecg}" pathLength="1000" fill="none" stroke="${C.ciano}" stroke-width="8" stroke-dasharray="120 880" stroke-linecap="round" filter="url(#borra)"/>
    <path class="ecg" d="${ecg}" pathLength="1000" fill="none" stroke="#CFFAFE" stroke-width="2.6" stroke-dasharray="120 880" stroke-linecap="round"/>
  </g>
  <g class="frente">${frente}</g>
  <g class="jan" fill="#FFD27A">${janelas}</g>
  <g>
    <rect class="frente" x="${tx}" y="${HORIZ - th}" width="${tw}" height="${th}" rx="4"/>
    ${vidros}
    <g class="jan" fill="#FFE7A8">${janTorre}</g>
    <rect x="${tx + tw / 2 - 2}" y="${HORIZ - th - 34}" width="4" height="34" fill="#94A3B8"/>
    <circle class="farol" cx="${tx + tw / 2}" cy="${HORIZ - th - 38}" r="6" fill="${C.menta}"/>
    <circle class="farol" cx="${tx + tw / 2}" cy="${HORIZ - th - 38}" r="14" fill="${C.menta}" opacity=".35" filter="url(#borra2)"/>
    <rect x="${tx + 8}" y="${HORIZ - th + 8}" width="${tw - 16}" height="24" rx="5" fill="#052E1A"/><text class="farol" x="${tx + tw / 2}" y="${HORIZ - th + 25}" text-anchor="middle" font-family="${MONO}" font-size="12.5" font-weight="700" fill="${C.menta}">UP 99,5%</text>
  </g>
  <g>
    <rect class="frente" x="${ux}" y="${HORIZ - uh}" width="${uw}" height="${uh}" rx="4"/>
    <rect class="frente" x="${ux + uw / 2 - 34}" y="${HORIZ - uh - 26}" width="68" height="30" rx="4"/>
    <g class="jan" fill="#BFF4FF">${janUbs}</g>
    <path d="M${ux + uw / 2 - 7} ${HORIZ - uh + 8}h14v12h12v14h-12v12h-14v-12h-12v-14h12z" fill="#E2E8F0"/>
    <g class="noite"><path d="M${ux + uw / 2 - 7} ${HORIZ - uh + 8}h14v12h12v14h-12v12h-14v-12h-12v-14h12z" fill="${C.ciano}"/><circle cx="${ux + uw / 2}" cy="${HORIZ - uh + 27}" r="34" fill="${C.ciano}" opacity=".35" filter="url(#borra)"/></g>
    <text x="${ux + uw / 2}" y="${HORIZ - uh - 6}" text-anchor="middle" font-family="${SANS}" font-size="13" font-weight="800" letter-spacing="2" fill="#E2E8F0">UBS</text>
  </g>
  <rect class="chao" y="${HORIZ}" width="${W}" height="${H - HORIZ}"/>
  <line x1="0" y1="${HORIZ + 42}" x2="${W}" y2="${HORIZ + 42}" stroke="#E2E8F0" stroke-opacity=".35" stroke-width="3" stroke-dasharray="26 22"/>
  <g class="amb" opacity="0">
    <g transform="translate(0 ${HORIZ + 14})">
      <rect x="0" y="0" width="74" height="28" rx="5" fill="#F8FAFC"/><rect x="52" y="5" width="18" height="11" rx="2" fill="#93C5FD"/>
      <path d="M22 6h6v6h6v6h-6v6h-6v-6h-6v-6h6z" fill="#EF4444"/>
      <circle cx="16" cy="29" r="6" fill="#0F172A"/><circle cx="58" cy="29" r="6" fill="#0F172A"/>
      <rect class="sirene-a" x="14" y="-6" width="10" height="6" rx="2" fill="#EF4444"/><rect class="sirene-b" x="26" y="-6" width="10" height="6" rx="2" fill="#3B82F6"/>
      <circle class="sirene-a" cx="19" cy="-3" r="12" fill="#EF4444" opacity=".4" filter="url(#borra2)"/><circle class="sirene-b" cx="31" cy="-3" r="12" fill="#3B82F6" opacity=".4" filter="url(#borra2)"/>
      <path d="M74 14 l90 -14 v30 z" fill="#FEF3C7" opacity=".18"/>
    </g>
  </g>
  <rect width="${W}" height="${H}" fill="url(#vinheta)"/>
  <g class="entra" filter="url(#sombra)">
    <rect x="64" y="64" width="356" height="38" rx="19" fill="#FFFFFF" fill-opacity=".16" stroke="#FFFFFF" stroke-opacity=".3"/>
    <g class="dia">${iconeSol(88, 83, 22, C.ambar)}<text x="108" y="90" font-family="${SANS}" font-size="15" font-weight="800" letter-spacing="2.2" fill="${C.branco}">TURNO DO DIA · SRE</text></g>
    <g class="noite"><defs/>${iconeLua(88, 83, 18, '#E0E7FF', 'luaRotulo')}<text x="108" y="90" font-family="${SANS}" font-size="15" font-weight="800" letter-spacing="2.2" fill="${C.branco}">TURNO DA NOITE · SAÚDE</text></g>
    ${horas}
    <text x="64" y="176" font-family="${SANS}" font-size="78" font-weight="800" letter-spacing="-2" fill="#FFFFFF">Felipe Menezes</text>
    <g class="dia"><text x="66" y="220" font-family="${SANS}" font-size="27" font-weight="700" fill="#FFFFFF">SRE · mantendo um banco no ar 24/7</text></g>
    <g class="noite"><text x="66" y="220" font-family="${SANS}" font-size="27" font-weight="700" fill="#FFFFFF">Full-stack · telessaúde para o SUS</text></g>
    <text x="66" y="256" font-family="${SANS}" font-size="18" font-style="italic" fill="#F1F5F9">o mesmo problema dos dois lados: sistemas que não podem cair</text>
    <g transform="translate(66 284)">
      <rect width="440" height="8" rx="4" fill="url(#trilho)" opacity=".85"/>
      <g class="marcador"><circle cy="4" r="9" fill="#FFFFFF"/><circle cy="4" r="4" fill="${C.tinta}"/></g>
      ${['06h', '12h', '18h', '00h', '06h'].map((t, i) => `<text x="${i * 110}" y="30" text-anchor="middle" font-family="${MONO}" font-size="12" fill="#F1F5F9" fill-opacity=".85">${t}</text>`).join('')}
    </g>
  </g>
</g>
</svg>`;
}

// ═════════════════════════════════════════════════════════════════════════
// 2. DOIS TURNOS — métricas em odômetro
// ═════════════════════════════════════════════════════════════════════════
let contaOdo = 0;
function odometro(texto, x, y, tam, cor, atraso, peso = 800) {
  const LH = tam * 1.25, DIG = tam * 0.6, OUTRO = tam * 0.42;
  let xx = x, corpo = '', css = '';
  for (const [idx, ch] of [...texto].entries()) {
    if (/[a-z]/i.test(ch)) {
      corpo += `<text x="${r2(xx)}" y="${y}" font-family="${SANS}" font-size="${tam}" font-weight="${peso}" fill="${cor}">${esc([...texto].slice(idx).join(''))}</text>`;
      break;
    }
    if (!/\d/.test(ch)) {
      corpo += `<text x="${r2(xx)}" y="${y}" font-family="${SANS}" font-size="${tam}" font-weight="${peso}" fill="${cor}">${esc(ch)}</text>`;
      xx += ch === ' ' ? tam * 0.3 : ch === ',' || ch === '.' ? tam * 0.3 : ch === '%' ? tam * 0.85 : ch === '+' || ch === '−' || ch === '>' ? tam * 0.62 : OUTRO;
      continue;
    }
    const d = Number(ch), alvo = 10 + d, id = `od${contaOdo++}`;
    css += `.${id}{animation:${id} ${r2(2 + rnd() * 0.6)}s ${r2(atraso)}s cubic-bezier(.16,1,.3,1) both} @keyframes ${id}{from{transform:translateY(0)}to{transform:translateY(-${r2(alvo * LH)}px)}}\n`;
    let seq = '';
    for (let j = 0; j <= alvo; j++) seq += `<text x="${r2(xx)}" y="${r2(y + j * LH)}" font-family="${SANS}" font-size="${tam}" font-weight="${peso}" fill="${cor}">${j % 10}</text>`;
    corpo += `<g class="${id}">${seq}</g>`;
    xx += DIG;
  }
  return { corpo, css, largura: xx - x, LH };
}

function turnos() {
  const W = 1280, H = 500, M = W / 2;
  let css = '', corpo = '';
  const tile = (x, y, w, num, rot, sub, cor, atraso, i) => {
    const o = odometro(num, x + 22, y + 64, 44, C.branco, atraso);
    css += o.css;
    return `<g class="sobe" style="animation-delay:${r2(atraso - 0.2)}s">
      <rect x="${x}" y="${y}" width="${w}" height="124" rx="16" fill="#FFFFFF" fill-opacity=".05" stroke="${cor}" stroke-opacity=".35"/>
      <rect x="${x}" y="${y}" width="5" height="124" rx="2.5" fill="${cor}"/>
      <clipPath id="n${i}"><rect x="${x + 14}" y="${y + 18}" width="${w - 28}" height="58"/></clipPath>
      <g clip-path="url(#n${i})">${o.corpo}</g>
      <text x="${x + 22}" y="${y + 96}" font-family="${SANS}" font-size="16" font-weight="700" fill="${C.claro}">${esc(rot)}</text>
      <text x="${x + 22}" y="${y + 114}" font-family="${SANS}" font-size="12.5" fill="${C.muted}">${esc(sub)}</text>
    </g>`;
  };
  const tw = 270, gx = 20, y1 = 150, y2 = 290;
  corpo += tile(40, y1, tw, '−60%', 'MTTR', 'tempo médio de resolução', C.ambar, 0.3, 0);
  corpo += tile(40 + tw + gx, y1, tw, '−75%', 'tempo de triagem', 'triagem automatizada', C.ambar, 0.45, 1);
  corpo += tile(40, y2, tw, '1.000+', 'tickets por mês', 'com OCR + IA (eram ~200)', C.ambar, 0.6, 2);
  corpo += tile(40 + tw + gx, y2, tw, '99,5%', 'de uptime', 'acima disso, todo mês', C.ambar, 0.75, 3);
  corpo += tile(M + 40, y1, tw, '13.987', 'casos de teste', 'xUnit · Vitest · Jest · node:test', C.ciano, 0.5, 4);
  corpo += tile(M + 40 + tw + gx, y1, tw, '929', 'endpoints HTTP', 'API .NET em 236 controllers', C.ciano, 0.65, 5);
  corpo += tile(M + 40, y2, tw, '1,1 mi', 'linhas de código', 'C#, TypeScript, SQL, Terraform', C.ciano, 0.8, 6);
  corpo += tile(M + 40 + tw + gx, y2, tw, '28', 'etapas no portão de push', 'nada sobe vermelho', C.ciano, 0.95, 7);

  let ecg = 'M0 0';
  for (const x0 of [60, 260, 460]) ecg += ` H${x0} q8 -9 16 0 h10 l5 9 l8 -54 l8 64 l6 -19 h12 q14 -16 28 0`;
  ecg += ' H600';
  let uptime = 'M0 26';
  for (let i = 1; i <= 30; i++) uptime += ` L${i * 20} ${r2(8 + rnd() * 10 + (i === 17 ? 16 : 0))}`;

  return `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}" role="img" aria-labelledby="t">
<title id="t">Dois turnos. De dia, SRE: MTTR −60%, triagem −75%, 1.000+ tickets por mês, uptime acima de 99,5%. De noite, RenoveJá+: 13.987 casos de teste, 929 endpoints, 1,1 milhão de linhas e 28 etapas no portão de push.</title>
<defs>
  <linearGradient id="gDia" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#2B1A06"/><stop offset="1" stop-color="#111827"/></linearGradient>
  <linearGradient id="gNoite" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#0B1236"/><stop offset="1" stop-color="#050816"/></linearGradient>
  <radialGradient id="aDia" cx=".1" cy=".05" r=".9"><stop offset="0" stop-color="${C.ambar}" stop-opacity=".22"/><stop offset="1" stop-color="${C.ambar}" stop-opacity="0"/></radialGradient>
  <radialGradient id="aNoite" cx=".9" cy=".05" r=".9"><stop offset="0" stop-color="${C.ciano}" stop-opacity=".2"/><stop offset="1" stop-color="${C.ciano}" stop-opacity="0"/></radialGradient>
  <filter id="borra" x="-20%" y="-50%" width="140%" height="200%"><feGaussianBlur stdDeviation="4"/></filter>
  <clipPath id="quadro"><rect width="${W}" height="${H}" rx="24"/></clipPath>
</defs>
<style>
  .sobe{animation:sobe .9s cubic-bezier(.16,1,.3,1) both} @keyframes sobe{from{opacity:0;transform:translateY(16px)}to{opacity:1;transform:none}}
  .corre{animation:corre 3.6s linear infinite} @keyframes corre{from{stroke-dashoffset:1000}to{stroke-dashoffset:0}}
  .traca{animation:traca 6s ease-in-out infinite} @keyframes traca{0%{stroke-dashoffset:1000}60%,100%{stroke-dashoffset:0}}
  .gira{animation:gira 18s linear infinite;transform-box:fill-box;transform-origin:center} @keyframes gira{to{transform:rotate(360deg)}}
  ${css}
</style>
<g clip-path="url(#quadro)">
  <rect width="${M}" height="${H}" fill="url(#gDia)"/><rect width="${M}" height="${H}" fill="url(#aDia)"/>
  <rect x="${M}" width="${M}" height="${H}" fill="url(#gNoite)"/><rect x="${M}" width="${M}" height="${H}" fill="url(#aNoite)"/>
  <line x1="${M}" y1="40" x2="${M}" y2="${H - 40}" stroke="#FFFFFF" stroke-opacity=".12" stroke-width="2" stroke-dasharray="4 8"/>
  <g class="gira">${iconeSol(78, 66, 34, C.ambar)}</g>
  <text x="112" y="62" font-family="${SANS}" font-size="27" font-weight="800" fill="${C.ambar}">De dia · SRE</text>
  <text x="112" y="88" font-family="${SANS}" font-size="15" fill="${C.claro}">incidentes críticos P1/P2 — BTG Pactual · Python, n8n e Datadog</text>
  <g>${iconeLua(M + 78, 66, 34, '#E0E7FF', 'luaT')}</g>
  <text x="${M + 112}" y="62" font-family="${SANS}" font-size="27" font-weight="800" fill="${C.ciano}">De noite · saúde pública</text>
  <text x="${M + 112}" y="88" font-family="${SANS}" font-size="15" fill="${C.claro}">desenvolvedor principal do RenoveJá+ — telessaúde para o SUS</text>
  <text x="40" y="128" font-family="${SANS}" font-size="12" font-weight="800" letter-spacing="2.5" fill="${C.ambar}" fill-opacity=".8">RESULTADOS NA OPERAÇÃO</text>
  <text x="${M + 40}" y="128" font-family="${SANS}" font-size="12" font-weight="800" letter-spacing="2.5" fill="${C.ciano}" fill-opacity=".8">A PLATAFORMA, MEDIDA EM 09/10/2026</text>
  ${corpo}
  <g transform="translate(20 ${H - 52})" opacity=".9">
    <path d="${uptime}" fill="none" stroke="${C.ambar}" stroke-opacity=".25" stroke-width="2"/>
    <path class="traca" d="${uptime}" pathLength="1000" stroke-dasharray="1000" fill="none" stroke="${C.ambar}" stroke-width="2.4" stroke-linejoin="round"/>
  </g>
  <g transform="translate(${M + 20} ${H - 22})">
    <path d="${ecg}" fill="none" stroke="${C.ciano}" stroke-opacity=".22" stroke-width="2"/>
    <path class="corre" d="${ecg}" pathLength="1000" fill="none" stroke="${C.ciano}" stroke-width="6" stroke-dasharray="140 860" filter="url(#borra)"/>
    <path class="corre" d="${ecg}" pathLength="1000" fill="none" stroke="#CFFAFE" stroke-width="2.2" stroke-dasharray="140 860" stroke-linecap="round"/>
  </g>
</g>
</svg>`;
}

// ═════════════════════════════════════════════════════════════════════════
// 3. STACK EM ÓRBITA — três órbitas inclinadas com profundidade
// ═════════════════════════════════════════════════════════════════════════
function orbita() {
  const W = 1280, H = 500, cx = 640, cy = 262, PASSOS = 36;
  const orbitas = [
    { rx: 300, ry: 64, inc: -9, per: 22, cor: C.violeta, rev: false, itens: ['.NET 8', 'C#', 'PostgreSQL', 'Redis', 'SignalR', 'Dapper'] },
    { rx: 455, ry: 118, inc: 8, per: 28, cor: C.ciano, rev: true, itens: ['React', 'TypeScript', 'React Native', 'Expo', 'Vite', 'Tailwind', 'Playwright'] },
    { rx: 590, ry: 168, inc: -5, per: 36, cor: C.menta, rev: false, itens: ['AWS', 'Terraform', 'Docker', 'Datadog', 'Python', 'n8n', 'OpenAI', 'Sentry', 'ICP-Brasil'] },
  ];
  let css = '', aneis = '', rotulos = '';
  orbitas.forEach((o, k) => {
    const a = (o.inc * Math.PI) / 180;
    let kf = '';
    for (let i = 0; i <= PASSOS; i++) {
      const t = (2 * Math.PI * i) / PASSOS;
      const lx = o.rx * Math.cos(t), ly = o.ry * Math.sin(t);
      const x = cx + lx * Math.cos(a) - ly * Math.sin(a);
      const y = cy + lx * Math.sin(a) + ly * Math.cos(a);
      const prof = (Math.sin(t) + 1) / 2; // 0 = atrás, 1 = na frente
      kf += `${r2((i / PASSOS) * 100)}%{transform:translate(${r2(x)}px,${r2(y)}px) scale(${r2(0.74 + prof * 0.36)});opacity:${r2(0.38 + prof * 0.62)}} `;
    }
    css += `@keyframes o${k}{${kf}} .o${k}{animation:o${k} ${o.per}s linear infinite${o.rev ? ' reverse' : ''}}\n`;
    aneis += `<ellipse cx="${cx}" cy="${cy}" rx="${o.rx}" ry="${o.ry}" transform="rotate(${o.inc} ${cx} ${cy})" fill="none" stroke="${o.cor}" stroke-opacity=".22" stroke-width="1.5" stroke-dasharray="3 7"/>`;
    o.itens.forEach((nome, j) => {
      const w = nome.length * 8.6 + 30;
      rotulos += `<g class="o${k}" style="animation-delay:-${r2((j / o.itens.length) * o.per)}s">
        <rect x="${r2(-w / 2)}" y="-17" width="${r2(w)}" height="34" rx="17" fill="${C.tinta}" stroke="${o.cor}" stroke-width="1.6"/>
        <circle cx="${r2(-w / 2 + 15)}" cy="0" r="4" fill="${o.cor}"/>
        <text x="${r2(-w / 2 + 26)}" y="5.5" font-family="${SANS}" font-size="15" font-weight="700" fill="${C.branco}">${esc(nome)}</text>
      </g>`;
    });
  });
  let poeira = '';
  for (let i = 0; i < 70; i++) poeira += `<circle cx="${r2(rnd() * W)}" cy="${r2(rnd() * H)}" r="${r2(0.4 + rnd() * 1.1)}" fill="#FFFFFF" opacity="${r2(0.2 + rnd() * 0.5)}"/>`;
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}" role="img" aria-labelledby="t">
<title id="t">Stack em órbita: backend (.NET 8, C#, PostgreSQL, Redis, SignalR, Dapper), frontend e mobile (React, TypeScript, React Native, Expo, Vite, Tailwind, Playwright) e nuvem, SRE e IA (AWS, Terraform, Docker, Datadog, Python, n8n, OpenAI, Sentry, ICP-Brasil).</title>
<defs>
  <radialGradient id="fundo" cx=".5" cy=".52" r=".7"><stop offset="0" stop-color="#16204A"/><stop offset=".6" stop-color="${C.noite}"/><stop offset="1" stop-color="${C.tinta}"/></radialGradient>
  <radialGradient id="nucleo"><stop offset="0" stop-color="#FFFFFF"/><stop offset=".35" stop-color="${C.ciano}"/><stop offset="1" stop-color="${C.violeta}" stop-opacity="0"/></radialGradient>
  <clipPath id="quadro"><rect width="${W}" height="${H}" rx="24"/></clipPath>
</defs>
<style>
  ${css}
  .pulso{animation:pulso 3.2s ease-in-out infinite;transform-box:fill-box;transform-origin:center} @keyframes pulso{0%,100%{transform:scale(.92);opacity:.75}50%{transform:scale(1.08);opacity:1}}
  .onda{animation:onda 3.2s ease-out infinite;transform-box:fill-box;transform-origin:center} @keyframes onda{from{transform:scale(.6);opacity:.7}to{transform:scale(2.4);opacity:0}}
</style>
<g clip-path="url(#quadro)">
  <rect width="${W}" height="${H}" fill="url(#fundo)"/>
  ${poeira}
  ${aneis}
  <circle class="onda" cx="${cx}" cy="${cy}" r="46" fill="none" stroke="${C.ciano}" stroke-width="2"/>
  <circle class="pulso" cx="${cx}" cy="${cy}" r="70" fill="url(#nucleo)" opacity=".85"/>
  <circle cx="${cx}" cy="${cy}" r="40" fill="${C.tinta}" stroke="${C.ciano}" stroke-width="2"/>
  <text x="${cx}" y="${cy + 9}" text-anchor="middle" font-family="${MONO}" font-size="26" font-weight="800" fill="${C.branco}">&lt;/&gt;</text>
  ${rotulos}
  <text x="40" y="52" font-family="${SANS}" font-size="13" font-weight="800" letter-spacing="3" fill="${C.muted}">STACK EM ÓRBITA</text>
  <g font-family="${SANS}" font-size="13" font-weight="700">
    <circle cx="44" cy="${H - 40}" r="5" fill="${C.violeta}"/><text x="56" y="${H - 35}" fill="${C.claro}">backend e dados</text>
    <circle cx="190" cy="${H - 40}" r="5" fill="${C.ciano}"/><text x="202" y="${H - 35}" fill="${C.claro}">web e mobile</text>
    <circle cx="316" cy="${H - 40}" r="5" fill="${C.menta}"/><text x="328" y="${H - 35}" fill="${C.claro}">nuvem, SRE e IA</text>
  </g>
</g>
</svg>`;
}

// ═════════════════════════════════════════════════════════════════════════
// 4. CARTÕES DE PROJETO (clicáveis no README)
// ═════════════════════════════════════════════════════════════════════════
function cartao({ arquivo, nome, linhas, chips, cor, icone, largura = 620, altura = 230, extra = '' }) {
  const W = largura, H = altura;
  const chipsSvg = chips
    .map((c, i, arr) => {
      const x = 28 + arr.slice(0, i).reduce((s, t) => s + t.length * 8.3 + 34, 0);
      const w = c.length * 8.3 + 24;
      return `<rect x="${r2(x)}" y="${H - 50}" width="${r2(w)}" height="26" rx="13" fill="${cor}" fill-opacity=".14" stroke="${cor}" stroke-opacity=".5"/><text x="${r2(x + 12)}" y="${H - 32}" font-family="${SANS}" font-size="12.5" font-weight="700" fill="${C.claro}">${esc(c)}</text>`;
    })
    .join('');
  const texto = linhas.map((l, i) => `<text x="28" y="${104 + i * 22}" font-family="${SANS}" font-size="15.5" fill="${C.claro}">${esc(l)}</text>`).join('');
  salvar(arquivo, `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}" role="img" aria-labelledby="t">
<title id="t">${esc(nome)} — ${esc(linhas.join(' '))}</title>
<defs>
  <linearGradient id="g" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#111A3A"/><stop offset="1" stop-color="${C.tinta}"/></linearGradient>
  <radialGradient id="a" cx=".95" cy="0" r=".9"><stop offset="0" stop-color="${cor}" stop-opacity=".32"/><stop offset="1" stop-color="${cor}" stop-opacity="0"/></radialGradient>
  <linearGradient id="luz" x1="0" x2="1"><stop offset="0" stop-color="#FFFFFF" stop-opacity="0"/><stop offset=".5" stop-color="#FFFFFF" stop-opacity=".12"/><stop offset="1" stop-color="#FFFFFF" stop-opacity="0"/></linearGradient>
  <linearGradient id="borda" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="${cor}"/><stop offset=".5" stop-color="${cor}" stop-opacity=".15"/><stop offset="1" stop-color="${cor}"/></linearGradient>
  <clipPath id="c"><rect width="${W}" height="${H}" rx="20"/></clipPath>
</defs>
<style>
  .varre{animation:varre 7s ease-in-out infinite} @keyframes varre{0%{transform:translateX(-200px) skewX(-20deg)}30%,100%{transform:translateX(${W + 200}px) skewX(-20deg)}}
  .brilha{animation:brilha 4s ease-in-out infinite} @keyframes brilha{0%,100%{opacity:.55}50%{opacity:1}}
  .seta{animation:seta 2.4s ease-in-out infinite} @keyframes seta{0%,100%{transform:translate(0,0)}50%{transform:translate(3px,-3px)}}
</style>
<g clip-path="url(#c)">
  <rect width="${W}" height="${H}" fill="url(#g)"/>
  <rect class="brilha" width="${W}" height="${H}" fill="url(#a)"/>
  <rect class="varre" x="0" y="0" width="140" height="${H}" fill="url(#luz)"/>
  <g transform="translate(28 30)">${icone(cor)}</g>
  <text x="84" y="62" font-family="${SANS}" font-size="27" font-weight="800" fill="${C.branco}">${esc(nome)}</text>
  <g class="seta" transform="translate(${W - 44} 30)"><path d="M0 16 L16 0 M5 0 H16 V11" fill="none" stroke="${cor}" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"/></g>
  ${texto}
  ${extra}
  ${chipsSvg}
</g>
<rect x="1" y="1" width="${W - 2}" height="${H - 2}" rx="19" fill="none" stroke="url(#borda)" stroke-width="1.6"/>
</svg>`);
}
const ic = {
  saude: (c) => `<rect width="40" height="40" rx="11" fill="${c}" fill-opacity=".18"/><path d="M16 9h8v7h7v8h-7v7h-8v-7h-7v-8h7z" fill="${c}"/>`,
  prontuario: (c) => `<rect width="40" height="40" rx="11" fill="${c}" fill-opacity=".18"/><rect x="11" y="8" width="18" height="24" rx="3" fill="none" stroke="${c}" stroke-width="2.4"/><path d="M15 16h10M15 21h10M15 26h6" stroke="${c}" stroke-width="2.2" stroke-linecap="round"/>`,
  jogo: (c) => `<rect width="40" height="40" rx="11" fill="${c}" fill-opacity=".18"/><rect x="7" y="13" width="26" height="15" rx="7.5" fill="none" stroke="${c}" stroke-width="2.4"/><path d="M14 17v7M10.5 20.5h7" stroke="${c}" stroke-width="2.2" stroke-linecap="round"/><circle cx="25" cy="18.5" r="1.8" fill="${c}"/><circle cx="28" cy="22.5" r="1.8" fill="${c}"/>`,
  mascote: (c) => `<rect width="40" height="40" rx="11" fill="${c}" fill-opacity=".18"/><circle cx="20" cy="21" r="10" fill="none" stroke="${c}" stroke-width="2.4"/><circle cx="16.5" cy="19.5" r="1.8" fill="${c}"/><circle cx="23.5" cy="19.5" r="1.8" fill="${c}"/><path d="M16.5 24.5q3.5 3 7 0" fill="none" stroke="${c}" stroke-width="2" stroke-linecap="round"/><path d="M12 13l-2-5 6 3M28 13l2-5-6 3" fill="none" stroke="${c}" stroke-width="2" stroke-linejoin="round"/>`,
  voz: (c) => `<rect width="40" height="40" rx="11" fill="${c}" fill-opacity=".18"/><rect x="16" y="8" width="8" height="15" rx="4" fill="none" stroke="${c}" stroke-width="2.4"/><path d="M12 19a8 8 0 0 0 16 0M20 27v5" fill="none" stroke="${c}" stroke-width="2.2" stroke-linecap="round"/>`,
  site: (c) => `<rect width="40" height="40" rx="11" fill="${c}" fill-opacity=".18"/><rect x="8" y="10" width="24" height="20" rx="3" fill="none" stroke="${c}" stroke-width="2.4"/><path d="M8 15h24" stroke="${c}" stroke-width="2.2"/>`,
  dente: (c) => `<rect width="40" height="40" rx="11" fill="${c}" fill-opacity=".18"/><path d="M13 11c3-2 5 0 7 0s4-2 7 0c3 2 2 8 0 11-1 3-1 8-3 8s-2-6-4-6-2 6-4 6-2-5-3-8c-2-3-3-9 0-11z" fill="none" stroke="${c}" stroke-width="2.2" stroke-linejoin="round"/>`,
};

function cartoes() {
  // projeto principal (o repositório é privado; o cartão leva ao site público)
  let ecg = 'M0 0';
  for (const x0 of [0, 200, 400, 600]) ecg += ` H${x0 + 40} q8 -9 16 0 h10 l5 9 l8 -46 l8 56 l6 -19 h12 q14 -16 28 0`;
  ecg += ' H780';
  cartao({
    arquivo: 'projeto-renoveja.svg', nome: 'RenoveJá+', cor: C.ciano, icone: ic.saude, largura: 1280, altura: 250,
    linhas: [
      'Telessaúde para o SUS e para a rede privada: renovação de receita de uso contínuo, pedido de exames,',
      'teleconsulta com prontuário assistido, balcão da UBS ligado ao CADSUS e assinatura digital ICP-Brasil.',
      'A IA confere e sugere — quem decide e assina é sempre o médico. Eu sou o desenvolvedor principal.',
    ],
    chips: ['.NET 8', 'React', 'Expo', 'PostgreSQL', 'Redis', 'AWS', 'Terraform', 'ICP-Brasil'],
    extra: `<g transform="translate(400 52)" opacity=".9"><style>.e{animation:e 3.6s linear infinite}@keyframes e{from{stroke-dashoffset:1000}to{stroke-dashoffset:0}}</style>
      <path d="${ecg}" fill="none" stroke="${C.ciano}" stroke-opacity=".18" stroke-width="2"/>
      <path class="e" d="${ecg}" pathLength="1000" fill="none" stroke="${C.ciano}" stroke-width="2.4" stroke-dasharray="120 880" stroke-linecap="round"/></g>`,
  });
  cartao({ arquivo: 'projeto-cadencia.svg', nome: 'cadencia', cor: C.violeta, icone: ic.prontuario,
    linhas: ['Prontuário eletrônico para redes públicas:', 'ente → unidade CNES → equipe INE → profissional → cidadão,', 'com CID-10, CID-11, CIAP-2 e SIGTAP versionados.'],
    chips: ['TypeScript', 'PostgreSQL', 'RLS'] });
  cartao({ arquivo: 'projeto-voxpep.svg', nome: 'VoxPEP', cor: C.rosa, icone: ic.voz,
    linhas: ['Prontuário com a voz como interface principal', 'e IA em tempo real ao lado do médico.'],
    chips: ['NestJS', 'React', 'Prisma'] });
  cartao({ arquivo: 'projeto-mutant-army-run.svg', nome: 'Mutant Army Run', cor: C.laranja, icone: ic.jogo,
    linhas: ['Jogo mobile hybrid-casual de multidão: portais,', 'mutações e chefes em 10 mundos, 100 fases e 19 tropas.'],
    chips: ['Unity 6', 'URP', 'C#'] });
  cartao({ arquivo: 'projeto-mascote.svg', nome: 'mascote', cor: C.menta, icone: ic.mascote,
    linhas: ['Companheiro emocional: uma criatura procedural 3D', 'que evolui junto com os seus hábitos.'],
    chips: ['React Native', 'Expo', 'Supabase'] });
  cartao({ arquivo: 'projeto-designer-inox.svg', nome: 'designer-inox-brasil', cor: C.azul, icone: ic.site,
    linhas: ['25 páginas pré-renderizadas no build para HTML estático:', 'zero servidor em produção.'],
    chips: ['TanStack Start', 'React'] });
  cartao({ arquivo: 'projeto-jp-clinica.svg', nome: 'jp-clinica-odontologica', cor: C.ambar, icone: ic.dente,
    linhas: ['Site institucional de uma clínica odontológica', 'na Freguesia do Ó, em São Paulo.'],
    chips: ['React', 'TanStack Start'] });
}

// ═════════════════════════════════════════════════════════════════════════
// 5. A ESCADA DE EVIDÊNCIA
// ═════════════════════════════════════════════════════════════════════════
function escada() {
  const W = 1280, H = 400, T = 9;
  const degraus = ['escrito', 'testado', 'executado no servidor', 'em produção', 'validado externamente'];
  const cores = [C.violeta, C.azul, C.ciano, C.menta, C.ambar];
  let css = '', blocos = '';
  degraus.forEach((d, i) => {
    const w = 226, h = 50 + i * 32, x = 40 + i * (w + 14), y = H - 40 - h;
    const t0 = (0.4 + i * 1.1) / T;
    css += `@keyframes d${i}{0%,${pct(t0)}{opacity:.28} ${pct(t0 + 0.04)}{opacity:1} 88%{opacity:1} 96%,100%{opacity:.28}} .d${i}{animation:d${i} ${T}s ease-out infinite}\n`;
    blocos += `<g class="d${i}">
      <rect x="${x}" y="${y}" width="${w}" height="${h}" rx="12" fill="${cores[i]}" fill-opacity=".16" stroke="${cores[i]}" stroke-width="2"/>
      <rect x="${x}" y="${y}" width="${w}" height="5" rx="2.5" fill="${cores[i]}"/>
      <text x="${x + 16}" y="${y + 32}" font-family="${MONO}" font-size="13" font-weight="700" fill="${cores[i]}">0${i + 1}</text>
      <text x="${x + 44}" y="${y + 32}" font-family="${SANS}" font-size="14.5" font-weight="800" fill="${C.branco}">${esc(d)}</text>
    </g>`;
  });
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}" role="img" aria-labelledby="t">
<title id="t">A escada de evidência: escrito, testado, executado no servidor, em produção, validado externamente. Nenhum degrau vale pelo seguinte.</title>
<defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#111A3A"/><stop offset="1" stop-color="${C.tinta}"/></linearGradient><clipPath id="c"><rect width="${W}" height="${H}" rx="24"/></clipPath></defs>
<style>${css}</style>
<g clip-path="url(#c)">
  <rect width="${W}" height="${H}" fill="url(#g)"/>
  <text x="40" y="58" font-family="${SANS}" font-size="13" font-weight="800" letter-spacing="3" fill="${C.muted}">A REGRA DA CASA</text>
  <text x="40" y="94" font-family="${SANS}" font-size="28" font-weight="800" fill="${C.branco}">Nenhum degrau vale pelo seguinte.</text>
  <text x="40" y="124" font-family="${SANS}" font-size="16" fill="${C.claro}">Teste verde não é servidor de pé. Servidor de pé não é produção. Produção não é validação externa.</text>
  ${blocos}
</g>
</svg>`;
}

// ═════════════════════════════════════════════════════════════════════════
// 6. RODAPÉ — skyline noturno com batimento
// ═════════════════════════════════════════════════════════════════════════
function rodape() {
  const W = 1280, H = 200;
  let predios = '';
  let jan = '';
  for (let x = 0; x < W; ) {
    const w = 30 + rnd() * 60, h = 30 + rnd() * 90;
    predios += `<rect x="${r2(x)}" y="${r2(H - h)}" width="${r2(w)}" height="${r2(h)}"/>`;
    for (let jy = H - h + 8; jy < H - 8; jy += 12) for (let jx = x + 6; jx < x + w - 8; jx += 10) if (rnd() < 0.18) jan += `<rect x="${r2(jx)}" y="${r2(jy)}" width="4" height="6" fill="#FFD27A" opacity="${r2(0.35 + rnd() * 0.6)}"/>`;
    x += w + 2;
  }
  let ecg = `M0 ${H - 70}`;
  for (const x0 of [150, 520, 900]) ecg += ` H${x0} q8 -10 16 0 h10 l5 10 l8 -60 l8 70 l6 -20 h12 q14 -18 28 0`;
  ecg += ` H${W}`;
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}" role="img" aria-label="Skyline noturno com um batimento cardíaco correndo por trás dos prédios">
<defs><linearGradient id="g" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${C.tinta}" stop-opacity="0"/><stop offset=".55" stop-color="${C.noite}"/><stop offset="1" stop-color="${C.tinta}"/></linearGradient><filter id="b" x="-10%" y="-50%" width="120%" height="200%"><feGaussianBlur stdDeviation="5"/></filter></defs>
<style>.c{animation:c 5s linear infinite}@keyframes c{from{stroke-dashoffset:1000}to{stroke-dashoffset:0}}</style>
<rect width="${W}" height="${H}" fill="url(#g)"/>
<path class="c" d="${ecg}" pathLength="1000" fill="none" stroke="${C.ciano}" stroke-width="7" stroke-dasharray="130 870" filter="url(#b)"/>
<path class="c" d="${ecg}" pathLength="1000" fill="none" stroke="#CFFAFE" stroke-width="2.4" stroke-dasharray="130 870" stroke-linecap="round"/>
<g fill="#070B1C">${predios}</g>
${jan}
</svg>`;
}

salvar('heroi.svg', heroi());
salvar('turnos.svg', turnos());
salvar('orbita.svg', orbita());
cartoes();
salvar('escada.svg', escada());
salvar('rodape.svg', rodape());
