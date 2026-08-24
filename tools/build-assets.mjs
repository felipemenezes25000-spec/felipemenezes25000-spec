#!/usr/bin/env node
// Gera todos os SVGs do perfil, tema claro e escuro, a partir de tools/content.mjs.
// Sem servico de terceiros, sem link que quebra: os graficos sao arquivos versionados.
//
//   node tools/build-assets.mjs           grava em assets/
//   node tools/build-assets.mjs --check   falha se o que esta em disco divergir

import { writeFileSync, readFileSync, mkdirSync, existsSync } from 'node:fs'
import { join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'
import { THEMES } from './lib.mjs'
import { banner } from './banner.mjs'
import { metrics } from './metrics.mjs'
import { pipeline } from './pipeline.mjs'
import { stack } from './stack.mjs'
import { arch } from './arch.mjs'

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..')
const OUT = join(ROOT, 'assets')

const BUILDERS = { banner, metrics, pipeline, stack, arch }
const check = process.argv.includes('--check')

if (!existsSync(OUT)) mkdirSync(OUT, { recursive: true })

let drift = 0
let written = 0

for (const [name, build] of Object.entries(BUILDERS)) {
  for (const theme of Object.values(THEMES)) {
    const file = join(OUT, `${name}-${theme.name}.svg`)
    const next = build(theme)
    if (check) {
      const prev = existsSync(file) ? readFileSync(file, 'utf8') : ''
      if (prev !== next) {
        console.error(`divergente: assets/${name}-${theme.name}.svg`)
        drift++
      }
    } else {
      writeFileSync(file, next, 'utf8')
      written++
    }
  }
}

if (check) {
  if (drift) {
    console.error(`\n${drift} arquivo(s) fora de sincronia. Rode: node tools/build-assets.mjs`)
    process.exit(1)
  }
  console.log('assets em sincronia com tools/content.mjs')
} else {
  console.log(`${written} SVGs gerados em assets/`)
}
