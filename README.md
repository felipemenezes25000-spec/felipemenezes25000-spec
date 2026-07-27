<div align="center">

<picture>
  <source media="(prefers-color-scheme: dark)" srcset="assets/banner-dark.svg">
  <source media="(prefers-color-scheme: light)" srcset="assets/banner-light.svg">
  <img alt="Felipe Menezes — SRE @ BTG Pactual · Founder @ RenoveJá+ · Patente BR" src="assets/banner-light.svg" width="100%">
</picture>

<br>

[![LinkedIn](https://img.shields.io/badge/LinkedIn-felipe--menezes2000-0A66C2?style=flat-square&logo=linkedin&logoColor=white)](https://linkedin.com/in/felipe-menezes2000)
[![Email](https://img.shields.io/badge/Email-falar_comigo-EA4335?style=flat-square&logo=gmail&logoColor=white)](mailto:felipemenezes.contato@gmail.com)

</div>

---

> **De dia** eu mantenho de pé a operação crítica de um dos maiores bancos da América Latina.
> **De noite** eu escrevo uma plataforma de telemedicina que o poder público usa de graça.
>
> É o mesmo problema dos dois lados: **sistemas que não podem cair — e que, quando caem, machucam gente de verdade.**

<br>

<picture>
  <source media="(prefers-color-scheme: dark)" srcset="assets/metrics-dark.svg">
  <source media="(prefers-color-scheme: light)" srcset="assets/metrics-light.svg">
  <img alt="3.904 testes verdes em 4 apps · 1 patente BR de renovação digital · assinatura ICP-Brasil PAdES · R$ 0 para o poder público" src="assets/metrics-light.svg" width="100%">
</picture>

---

## RenoveJá+ — telemedicina pública, com patente

Plataforma completa de **renovação de receitas, pedidos de exame e teleconsulta**, com assinatura digital ICP-Brasil e verificação pública por QR Code. Detém **patente brasileira** de renovação digital de receitas.

**Sem gateway de pagamento. Sem monetização. Sem pegadinha.** O modelo é esse de propósito: tecnologia de saúde como serviço público. Alinhada à **Resolução CFM 2.454/2026** — a IA apoia, o médico decide e assina.

<picture>
  <source media="(prefers-color-scheme: dark)" srcset="assets/arch-dark.svg">
  <source media="(prefers-color-scheme: light)" srcset="assets/arch-light.svg">
  <img alt="Arquitetura: app do paciente, app do médico, portal web e portal RH sobre uma API .NET 8 em Clean Architecture, apoiada por PostgreSQL, Redis, AWS, assinatura ICP-Brasil e IA" src="assets/arch-light.svg" width="100%">
</picture>

O fluxo inteiro: **solicitação do paciente → triagem por IA → teleconsulta → documentos pré-preenchidos → assinatura ICP-Brasil → verificação pública por QR Code.**

---

## Os problemas difíceis (e o que eu fiz com eles)

Badge de linguagem qualquer um cola no perfil. Isto aqui é o que realmente deu trabalho:

| O problema | A solução |
| :--- | :--- |
| **Double-sign.** Assinar 40 receitas de uma vez travava a UI — e em ECS com várias tasks, duas instâncias podiam assinar o mesmo documento. | Job assíncrono com progresso real via **SignalR** (com fallback de polling) e **lock distribuído em Redis**. Com N tasks no Fargate, o documento é assinado exatamente uma vez. |
| **Documento adulterado.** Um PDF de receita é trivial de editar no Acrobat. | **PAdES ICP-Brasil** com OIDs do ITI (iText7 + BouncyCastle): qualquer byte alterado invalida a assinatura. Mais QR Code de verificação pública e integração com o `validar.iti.gov.br`. |
| **Receita controlada reusada** em várias farmácias. | Validade automática por tipo (simples 6 meses, controlada 30/60 dias, antimicrobiana 10 dias), controle de dispensação e bloqueio de reuso. |
| **IA alucinando prescrição.** O risco que mata o produto — e o paciente. | Guardrails de termos proibidos, fallback seguro e IA estritamente como **apoio à decisão**. Quem prescreve e assina é o médico, sempre. |
| **Deriva visual entre 3 frontends** feitos em stacks diferentes. | Design system com `tokens.json` como fonte única, gerador com **validador de contraste WCAG** e um `design-lint` com baseline que **só pode diminuir** — dívida de design não cresce sem alguém notar. |
| **Paciente que não consegue digitar** o nome do próprio remédio. | Preenchimento **por voz** (fala-para-texto com detecção de emergência), mapa corporal tátil, alto contraste, escala de fonte e leitor de tela. |

---

## SRE — o outro turno

Gestão de incidentes críticos P1/P2 no **BTG Pactual**, com automação em Python, n8n e Datadog.

| | Antes | Depois |
| :--- | :---: | :---: |
| **MTTR** | baseline | **−60%** |
| **Tempo de triagem** | manual | **−75%** |
| **Tickets processados** | ~200/mês | **1.000+/mês** *(OCR + IA)* |
| **Incidentes recorrentes** | reativo | **−40%** *(dashboards preditivos)* |
| **Uptime** | variável | **>99,5%** |

---

## Outros projetos

| Projeto | O que é | Stack |
| :--- | :--- | :--- |
| [**MutantArmyRun**](https://github.com/felipemenezes25000-spec/MutantArmyRun) | Runner de multidão hybrid-casual — 10 mundos, 100 fases, 19 tropas | Unity 6 · URP · C# |
| [**mascote**](https://github.com/felipemenezes25000-spec/mascote) | Companheiro emocional com criatura procedural 3D que evolui com seus hábitos | React Native · Expo · Supabase |
| **alverasaude** *(privado)* | Consulta particular online com nota fiscal e pacote de documentos | Next.js 16 · Supabase RLS |
| **atibaia-saude-360** *(privado)* | Saúde municipal ponta a ponta | Web |

---

## Stack

| | |
| :--- | :--- |
| **Backend** | .NET 8 · C# · Clean Architecture · PostgreSQL (Npgsql + Dapper) · Redis |
| **Mobile** | Expo SDK 54 · React Native 0.81 · React 19 · TypeScript 5.9 |
| **Web** | Vite 6 · React 19 · Tailwind · Radix UI · TypeScript |
| **Cloud** | AWS (ECS Fargate · RDS · S3 · CloudFront · WAF) · Terraform · Docker · GitHub Actions |
| **IA** | OpenAI (GPT-5.6 · GPT-4o) · Gemini 2.5 Flash como fallback · guardrails clínicos |
| **Tempo real** | SignalR · WebRTC (Daily.co) · Deepgram · Expo Push |
| **Assinatura** | ICP-Brasil PAdES · iText7 · BouncyCastle |
| **SRE** | Datadog · Grafana · Sentry · CloudWatch · Python · n8n · ServiceNow |

---

## Trajetória

```text
2024 → hoje   Founder & Full-Stack — RenoveJá+
              Telemedicina gratuita para o poder público. Patente BR.
              .NET 8 · React Native · React · PostgreSQL · AWS.

2022 → hoje   Sr. Gestor de Incidentes — BTG Pactual
              Automação de gestão de incidentes com Python, n8n e Datadog.
              MTTR −60%. 1.000+ tickets/mês com OCR + IA.

2021 → 2022   Analista de Command Center — Minsait (Indra)
              Monitoramento 24/7 de sistemas críticos.
              LIGHT · Enel · Energisa · Mapfre · Ferroport.
```

**Formação:** Gestão de Projetos de TI — Universidade Anhembi Morumbi · TCC 9,8/10 *(destaque acadêmico)*

---

<details>
<summary><b>🇬🇧 English version</b></summary>

<br>

**By day** I keep the critical operation of one of Latin America's largest banks running.
**By night** I build a telemedicine platform that the public sector uses for free.

Same problem on both sides: **systems that cannot go down — and when they do, real people get hurt.**

### RenoveJá+ — public telemedicine, patented

A full platform for **prescription renewal, lab orders and telehealth consultations**, with ICP-Brasil digital signatures and public QR Code verification. Holds a **Brazilian patent** for digital prescription renewal.

No payment gateway, no monetization — health technology as a public service. Compliant with **CFM Resolution 2.454/2026**: AI assists, the physician decides and signs.

**3.904 green tests** across 4 apps · **1 BR patent** · **ICP-Brasil PAdES** signing · **R$ 0** cost to the public sector.

### Hard problems I solved

- **Double-sign.** Batch-signing 40 prescriptions froze the UI, and on multi-task ECS two instances could sign the same document. Solved with an async job reporting real progress over SignalR (polling fallback) plus a **Redis distributed lock** — exactly-once signing across N Fargate tasks.
- **Document tampering.** **PAdES ICP-Brasil** signatures with ITI OIDs (iText7 + BouncyCastle): any altered byte invalidates the signature. Plus public QR verification wired to Brazil's official validator.
- **Controlled-substance reuse.** Automatic expiry per prescription class, dispensing control and reuse blocking.
- **AI hallucinating a prescription.** Forbidden-term guardrails, safe fallback, and AI strictly as **decision support** — the physician always prescribes and signs.
- **Visual drift across 3 frontends.** A design system with `tokens.json` as the single source of truth, a generator with a **WCAG contrast validator**, and a design lint whose baseline can only shrink.
- **Patients who can't type.** Voice-driven form filling with emergency detection, tactile body map, high contrast, font scaling and screen reader support.

### SRE at BTG Pactual

Critical P1/P2 incident management with Python, n8n and Datadog automation: **MTTR −60%**, triage time **−75%**, **1,000+ tickets/month** via OCR + AI, recurring incidents **−40%**, uptime **>99.5%**.

### Stack

.NET 8 · C# · Clean Architecture · PostgreSQL · Redis · Expo / React Native · React 19 · TypeScript · AWS (ECS Fargate, RDS, S3, CloudFront, WAF) · Terraform · SignalR · WebRTC · OpenAI & Gemini · ICP-Brasil PAdES · Datadog · Grafana · Sentry

### Background

Founder & Full-Stack Developer at RenoveJá+ (2024→now) · Sr. Incident Manager at BTG Pactual (2022→now) · Command Center Analyst at Minsait/Indra (2021–2022). BSc in IT Project Management, Universidade Anhembi Morumbi.

</details>

---

<div align="center">

### Construindo algo que não pode cair?

Healthtech, sistemas críticos, assinatura digital, saúde pública —
esses são os problemas que eu gosto de pegar.

[![LinkedIn](https://img.shields.io/badge/Chama_no_LinkedIn-0A66C2?style=for-the-badge&logo=linkedin&logoColor=white)](https://linkedin.com/in/felipe-menezes2000)
[![Email](https://img.shields.io/badge/Manda_um_email-EA4335?style=for-the-badge&logo=gmail&logoColor=white)](mailto:felipemenezes.contato@gmail.com)

<br>

<sub>Todos os gráficos deste perfil são SVG versionados neste repositório — sem serviço de terceiros, sem link quebrado, tema claro e escuro.</sub>

</div>
