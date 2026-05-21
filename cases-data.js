// cases-data.js - Selected work (platforms + client engagements).
// Loaded as a window global so home (portfolio.jsx) and project page
// (project.jsx) can both read from the same source.

window.CASES = [
  {
    id: "shipdeck",
    idx: "01",
    title: "An AI-native <em>operations cockpit</em> I built so I never had to glue together six SaaS tools again",
    client: "ShipDeck",
    clientNote: "Self-built, in daily production",
    industry: "Operations",
    stack: ["FastAPI · async", "React 19 · TanStack", "Postgres + pgvector"],
    impact: { value: "70+", label: "FastAPI routers · 1 engineer" },
    year: "2026",
    duration: "Ongoing",
    role: "Sole engineer, design + build + operate",
    lead: "I needed an operations cockpit that could run AI agents in real terminals, orchestrate skills across projects, and survive without a single SaaS subscription. Built it. Use it daily. Multi-tenant for whoever else wants in.",
    bullets: [
      "70+ FastAPI routers, 60+ services, 60+ Postgres tables",
      "20+ specialized AI agents orchestrated via swarm IPC",
      "Multi-pane web terminals with dtach + tmux persistence and shareable spectator links",
      "Single VPS deploy behind Caddy + Better Auth, daily encrypted snapshots",
    ],
    detailsMd: `## How it started

I'd been gluing together six SaaS tools to run my own freelance practice. Each one
worked. Together they were a mess. The mess wasn't fatal - until I tried to add
a single AI agent that needed context from all of them.

That was the trigger. I started ShipDeck on a Tuesday and have been running my
business on it since.

## The shape of the platform

- **70+ FastAPI routers** covering operations, projects, agents, terminals, search
- **60+ services** and **60+ Postgres tables** behind them
- **20+ specialized AI agents** orchestrated through a swarm IPC layer
- **Multi-pane web terminals** with \`dtach\` + \`tmux\` persistence and shareable spectator links
- **Single VPS deploy** behind Caddy + Better Auth, with daily encrypted snapshots

## Why I run it solo

The mid-2020s have a strange asymmetry: a competent solo engineer with the right
agent loop can ship things that used to take a small team. ShipDeck is my proof
of that for myself. Every router, table, and agent in here was a deliberate
choice - the kind of choices you can't make when you're optimizing for a team's
weakest contributor.

> This is the workshop. Everything else I ship goes through it first.

## What I'd do differently

Three things, in retrospect:

1. I should have committed to Postgres-as-the-event-bus from day one. I tried two
   message queues first. Both were cute. Neither survived a power loss the way a
   well-tuned Postgres setup does.
2. The terminal multiplexing was harder than it looks. \`dtach\` won over \`tmux\`
   for spectator sessions, but I burned a week proving it.
3. I delayed Better Auth too long because I assumed I'd "do it properly later".
   Doing it properly meant ripping out three layers of half-built session code.

## What's next

ShipDeck is currently multi-tenant for me, my collaborator, and two early users.
The plan is to keep it that way - small, opinionated, useful. If you'd find that
shape interesting, [send me a note](mailto:osamarehmanmughal@gmail.com).
`,
  },
  {
    id: "fitiq",
    idx: "02",
    title: "Multi-tenant gym SaaS with <em>paying gyms</em> running on it in production",
    client: "FitIQ",
    clientNote: "fitiq.com.au · live with paying customers",
    industry: "SaaS",
    stack: ["FastAPI + Celery", "Flutter · iOS + Android", "Caddy per-tenant TLS"],
    impact: { value: "180+", label: "features · 3 subscription tiers" },
    year: "2024–2026",
    duration: "18 months, ongoing",
    role: "Sole engineer - backend, web, mobile, infra",
    lead: "A multi-tenant gym SaaS that runs Lead → Allocation → Sessions → Reviews end-to-end. FastAPI + Celery on the backend, a Flutter app on both stores, Caddy provisioning per-tenant TLS on demand. Paying gyms in production.",
    bullets: [
      "Per-gym branding, custom domains, custom SMTP - full white-label",
      "Provider-agnostic SMS layer (Twilio + Cellcast) switchable with one config",
      "Flutter rewrite of an earlier React Native app - shipped to iOS + Android",
      "Field-level encryption via Fernet - rolled out without a single backfill migration",
    ],
  },
  {
    id: "transformula",
    idx: "03",
    title: "Consolidated <em>three SaaS subscriptions</em> into one self-hosted platform",
    client: "Transformula (Chasing Better)",
    clientNote: "app.transformula.com.au · coaching business platform",
    industry: "SaaS",
    stack: ["Bun + Express", "React 19 · TanStack", "Prisma 7 + Postgres"],
    impact: { value: "5", label: "marketing funnels + meal engine" },
    year: "2025",
    duration: "12 months",
    role: "Sole engineer",
    lead: "A monorepo SaaS that retired the client's Unbounce, GoHighLevel, and Typeform subscriptions. Five distinct marketing funnels, a deterministic meal-plan generation engine, multi-tenant trainer portal, server-side Meta CAPI tracking.",
    bullets: [
      "Deterministic meal-plan pipeline: intake → BMR/macros → recipe match → React-PDF → Resend",
      "Five themed marketing funnels with shared attribution + Resend webhook ingest",
      "Trainerize + Google Sheets/Drive integration as best-effort secondary stores",
      "78 endpoints, 70 frontend routes, ~66K LOC TypeScript",
    ],
  },
  {
    id: "capitol",
    idx: "04",
    title: "A roofing contractor's <em>entire operations stack</em> on a single VPS",
    client: "Capitol Improvements",
    clientNote: "improveitmd.com - production roofing business",
    industry: "Operations",
    stack: ["Caddy + Authelia SSO", "Strapi 5 + n8n", "Flask + React + Postgres"],
    impact: { value: "8", label: "containers - 5 systemd services - 1 VPS" },
    year: "2024-2026",
    duration: "14 months, ongoing",
    role: "Sole engineer + operator",
    lead: "Eight Docker containers and five systemd services behind one Caddy + Authelia SSO, all on a single ARM64 VPS. Strapi CMS with 900+ content items, a custom Flask + React CRM, n8n lead intake from Google Local Services and Yelp, encrypted nightly backups to a Google Shared Drive.",
    bullets: [
      "Custom 3-tier backup: daily DB dump + full encrypted environment snapshot + incremental media sync",
      "Authelia SSO with dual-auth fallback - rollback is removing one Caddyfile block",
      "GitHub Actions for Strapi, webhook deploys for the website builder, manual for Flask apps",
      "Flask CRM: 26 blueprints, 51 models, Anthropic Claude for assistant + measurement extraction",
    ],
  },

  // ---- Client engagements (delivered via an agency partner, now publishable) ----
  {
    id: "hotel-ops",
    idx: "05",
    title: "Hotel <em>operations</em> intelligence portal for a multi-property group",
    client: "Hotel group",
    clientNote: "Hospitality, multi-property",
    industry: "Operations",
    stack: ["Next.js 16", "Supabase · Postgres RLS", "Vercel", "n8n"],
    year: "2026",
    role: "Lead engineer",
    lead: "Real-time property KPI cockpit - occupancy, RevPAR, labor, market share - with a 16-alert engine, a 60-second GM daily confirmation flow, vendor data integrations (PMS, market feed, payroll), and n8n notification workflows. Config-driven multi-property: adding a property is an insert, not a rebuild.",
    bullets: [
      "16-alert engine across operational metrics",
      "60-second GM confirmation flow at the start of day",
      "Config-driven multi-property - adding a property is an insert, not a rebuild",
      "Vendor connectors: PMS, market feed, payroll",
    ],
  },
  {
    id: "pe-origination",
    idx: "06",
    title: "AI <em>deal-origination</em> engine for an M&A advisory firm",
    client: "M&A advisory firm",
    clientNote: "Private equity, acquisition sourcing",
    industry: "AI",
    stack: ["Node.js", "Claude API", "n8n", "Supabase"],
    year: "2026",
    role: "Lead engineer",
    lead: "Automated acquisition-sourcing pipeline: parallel search across multiple data vendors, a dedup engine (domain match + fuzzy name), Claude-scored fit ratings with written rationale per target, contact enrichment for qualified targets, and a client-ready Excel export.",
    bullets: [
      "Parallel search across multiple deal data vendors",
      "Dedup engine: exact domain match + fuzzy name",
      "Claude-scored fit ratings with written rationale per target",
      "Contact enrichment + client-ready Excel export",
    ],
  },
  {
    id: "solar-agent",
    idx: "07",
    title: "Live <em>AI sales agent</em> and outreach pipeline for residential solar",
    client: "Residential solar company",
    clientNote: "Residential solar",
    industry: "AI",
    stack: ["n8n", "OpenAI", "Airtable", "Instantly · Clay"],
    year: "2026",
    role: "Lead engineer",
    lead: "A live AI conversation agent that qualifies, educates, prices (territory-aware via a solar design API), and hands off to the sales team. Wired end-to-end from cold outreach through reply detection into the agent, with infrastructure hardening and silent-failure cleanup.",
    bullets: [
      "Live AI conversation agent: qualifies, educates, prices",
      "Territory-aware pricing via a solar design API",
      "End-to-end: cold outreach -> reply detection -> agent handoff",
      "Infrastructure hardening + silent-failure cleanup",
    ],
  },
  {
    id: "sign-scheduling",
    idx: "08",
    title: "<em>Smart production scheduling</em> for a sign & graphics manufacturer",
    client: "Sign & graphics manufacturer",
    clientNote: "Manufacturing, sign & graphics",
    industry: "Operations",
    stack: ["n8n", "Google Gemini", "Monday.com", "TypeScript"],
    year: "2026",
    role: "Lead engineer",
    lead: "AI proof-PDF extraction, a production-time calculator across 8+ operation types built from the client's own rate cards, and a capacity-aware scheduling engine - all migrated from custom TypeScript into maintainable n8n workflows, with operational dashboards.",
    bullets: [
      "AI proof-PDF extraction (Gemini)",
      "Production-time calculator across 8+ operation types from rate cards",
      "Capacity-aware scheduling engine",
      "Migrated custom TypeScript to maintainable n8n workflows",
    ],
  },
  {
    id: "marine-automation",
    idx: "09",
    title: "Order, freight & operations automation for a <em>marine equipment</em> distributor",
    client: "Marine equipment distributor",
    clientNote: "Distribution, marine equipment",
    industry: "Operations",
    stack: ["n8n", "OCR", "Fishbowl ERP", "FreightView · C.H. Robinson"],
    year: "2026",
    role: "Lead engineer",
    lead: "Layered, fault-isolated automation: PO intake (PDF OCR + EDI feeds) against a self-learning SKU/unit mapping store, automated ERP order creation with conflict-safe numbering, two-stage freight booking, and tracking loopback into one-click invoicing.",
    bullets: [
      "PO intake: PDF OCR + EDI feeds",
      "Self-learning SKU/unit mapping store",
      "Automated ERP order creation, conflict-safe numbering",
      "Two-stage freight booking + tracking loopback into invoicing",
    ],
  },
  {
    id: "property-intelligence",
    idx: "10",
    title: "<em>Automated property intelligence</em> for a real estate lead firm",
    client: "Real estate lead intelligence firm",
    clientNote: "Real estate intelligence",
    industry: "AI",
    stack: ["n8n", "OpenAI", "Airtable", "Apify · Regrid"],
    year: "2026",
    role: "Lead engineer",
    lead: "Monitors 28 municipal planning, zoning, and review boards across 7 ZIP codes; extracts property signals and contacts from meeting documents with AI; scores and tiers leads deterministically; and ships structured weekly and monthly data packages.",
    bullets: [
      "Monitors 28 municipal boards across 7 ZIP codes",
      "AI extracts property signals + contacts from meeting documents",
      "Deterministic scoring and tiering",
      "Structured weekly + monthly data packages",
    ],
  },
  {
    id: "sales-backend",
    idx: "11",
    title: "<em>Sales backend</em> automation - 3 modules for a sales consultancy",
    client: "Sales consultancy",
    clientNote: "Sales consultancy, B2B",
    industry: "AI",
    stack: ["Make.com", "Airtable", "Gemini · GPT", "Postmark · PDFMonkey"],
    year: "2026",
    role: "Lead engineer",
    lead: "An AI diagnostic-email engine, a conditional sales-script + one-page \"battle map\" PDF generator, and a Stream Deck webhook kill switch for instant contract delivery mid-call - each output mobile-responsive and delivered transactionally.",
    bullets: [
      "AI diagnostic-email engine",
      "Conditional sales-script + one-page battle-map PDF generator",
      "Stream Deck webhook kill-switch for instant contract delivery mid-call",
      "All outputs mobile-responsive and delivered transactionally",
    ],
  },
  {
    id: "personality-assessment",
    idx: "12",
    title: "Personality <em>assessment</em> to PDF report engine",
    client: "Coaching / assessment company",
    clientNote: "Coaching & assessment",
    industry: "AI",
    stack: ["Typeform", "n8n", "PDF generation"],
    year: "2026",
    role: "Lead engineer",
    lead: "A 50-question Typeform feeding a scoring and classification engine (personality type, risk/reward composites, driver) that resolves conditional logic and renders a dynamic, personalized PDF report delivered to each respondent.",
    bullets: [
      "50-question Typeform intake",
      "Scoring + classification: type, risk/reward composites, driver",
      "Conditional logic resolution at scoring time",
      "Dynamic, personalized PDF report delivered to each respondent",
    ],
  },
];

