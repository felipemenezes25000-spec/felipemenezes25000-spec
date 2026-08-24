// Fonte unica de conteudo dos graficos do perfil.
//
// Regra deste arquivo: todo numero aqui foi MEDIDO, nao estimado, e a
// medicao esta anotada ao lado. Se um numero nao puder ser reproduzido
// por um comando, ele nao entra.
//
// Ultima medicao: 23/08/2026.

export const PROFILE = {
  name: 'FELIPE MENEZES',
  chip: 'SAÚDE PÚBLICA DIGITAL / SISTEMAS CRÍTICOS / 24x7',
  roles: ['SRE @ BTG Pactual', 'Founder & Full-Stack @ RenoveJá+', 'Healthtech B2G'],
  tagline: 'De dia um banco não cai. De noite uma receita chega ao paciente certo.',
  bannerAlt:
    'Felipe Menezes — SRE no BTG Pactual e fundador da RenoveJá+, plataforma de telessaúde para o setor público',
}

export const PIPELINE = {
  eyebrow: 'REGRA DE HONESTIDADE OPERACIONAL',
  title: 'Nenhuma etapa vale pela seguinte.',
  footnote: 'Código na main não é prova de deploy. Pedido ao DATASUS não é homologação.',
  alt:
    'Escada de evidência em cinco degraus: escrito, testado, executado no servidor, em produção e validado externamente',
  steps: [
    { label: 'escrito', proof: 'commit' },
    { label: 'testado', proof: '6.533 testes' },
    { label: 'executado no servidor', proof: 'log do ambiente' },
    { label: 'em produção', proof: 'evidência de deploy' },
    { label: 'validado externamente', proof: 'homologação do órgão' },
  ],
}

export const METRICS = {
  title: 'RenoveJá+ em números medidos',
  alt:
    '6.533 testes automatizados, 127 recursos Terraform versionados, 132 de 132 pares de contraste WCAG aprovados e assinatura com certificado ICP-Brasil A1',
  tiles: [
    {
      eyebrow: 'COBERTURA',
      value: '6.533',
      caption: 'testes automatizados',
      proof: 'backend · web · mobile · RH',
    },
    {
      eyebrow: 'INFRAESTRUTURA',
      value: '127',
      caption: 'recursos Terraform versionados',
      proof: '14 workflows · 8 jobs de CI',
    },
    {
      eyebrow: 'ACESSIBILIDADE',
      value: '132/132',
      caption: 'pares de contraste WCAG',
      proof: 'reprovou um par, o build cai',
    },
    {
      eyebrow: 'ASSINATURA',
      value: 'ICP-Brasil',
      caption: 'certificado A1 do médico',
      proof: 'CMS com OIDs do ITI',
    },
  ],
}

export const STACK = {
  eyebrow: 'CÓDIGO PRÓPRIO POR LINGUAGEM · 46 REPOSITÓRIOS',
  right: '84,7 MB · API do GitHub · 23/08/2026',
  title: 'Distribuição de linguagens nos repositórios próprios',
  alt:
    'Barra empilhada de linguagens: TypeScript 59,5%, C# 24,3%, JavaScript 10,8%, CSS 1,3%, PL/pgSQL 1,1% e outros 2,9%, em 84,7 MB de código',
  langs: [
    { name: 'TypeScript', bytes: 52903000, pct: '59,5', human: '50,4 MB' },
    { name: 'C#', bytes: 21548000, pct: '24,3', human: '20,5 MB' },
    { name: 'JavaScript', bytes: 9615000, pct: '10,8', human: '9,2 MB' },
    { name: 'CSS', bytes: 1195000, pct: '1,3', human: '1,1 MB' },
    { name: 'PL/pgSQL', bytes: 1007000, pct: '1,1', human: '1,0 MB' },
    { name: 'outros', bytes: 2581000, pct: '2,9', human: '2,4 MB' },
  ],
}

export const ARCH = {
  eyebrow: 'RENOVEJÁ+ · MONOREPO · 3 FRONTENDS + 1 API',
  eyebrowRight: '.NET 8 · REACT 19 · EXPO 54',
  title: 'RenoveJá+ — arquitetura da plataforma',
  alt:
    'Quatro clientes sobre uma API .NET 8 em Clean Architecture, com outbox transacional fail-closed alimentando PostgreSQL, Redis, S3, assinatura ICP-Brasil, IA de apoio e os adapters do DATASUS',
  clients: [
    { title: 'App Paciente', sub: 'Expo 54 · voz · emergência' },
    { title: 'App Médico', sub: 'fila · teleconsulta · assinatura' },
    { title: 'Portal Web', sub: 'UBS · gestor · TCE · admin' },
    { title: 'Portal RH', sub: 'cadastro · LGPD' },
  ],
  api: {
    title: '.NET 8 · ASP.NET Core · Clean Architecture',
    right: '7 regras NetArchTest travam as camadas',
  },
  apiChips: ['Domain', 'Application', 'Infrastructure', 'Api', 'SignalR · Redis'],
  outbox: {
    title: 'Outbox transacional — o handoff para o SUS',
    sub: 'FOR UPDATE SKIP LOCKED · retry com backoff · dead-letter · pending / processing / blocked_prerequisite',
    right: 'fail-closed',
  },
  infra: [
    { title: 'PostgreSQL', sub: 'RDS · Multi-AZ' },
    { title: 'Redis', sub: 'lock · SignalR' },
    { title: 'S3 + CloudFront', sub: 'documentos · WAF' },
    { title: 'ICP-Brasil A1', sub: 'iText 7 · OIDs do ITI' },
    { title: 'IA de apoio', sub: 'trilha ai_suggestions' },
    { title: 'DATASUS', sub: 'CNES · SIGTAP · RNDS' },
  ],
  footnote:
    'Sem credencial, mapper ou homologação o evento vira blocked_prerequisite — nunca falso sucesso.',
}
