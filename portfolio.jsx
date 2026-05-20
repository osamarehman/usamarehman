// portfolio.jsx — Usama Rehman portfolio app

const { useState, useEffect, useMemo, useRef } = React;

const TWEAK_DEFAULTS = /*EDITMODE-BEGIN*/{
  "theme": "light",
  "accent": "#B8552E",
  "density": "regular",
  "showFilters": true
}/*EDITMODE-END*/;

// Tiny safe parser: splits a string on <em>...</em> tags and returns JSX nodes.
// Hardcoded content only — never feed user input through this.
function renderEm(text) {
  const parts = String(text).split(/(<em>.*?<\/em>)/g);
  return parts.map((p, i) => {
    const m = p.match(/^<em>(.*?)<\/em>$/);
    return m ? <em key={i}>{m[1]}</em> : <React.Fragment key={i}>{p}</React.Fragment>;
  });
}

const CASES = [
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
    role: "Sole engineer — backend, web, mobile, infra",
    lead: "A multi-tenant gym SaaS that runs Lead → Allocation → Sessions → Reviews end-to-end. FastAPI + Celery on the backend, a Flutter app on both stores, Caddy provisioning per-tenant TLS on demand. Paying gyms in production.",
    bullets: [
      "Per-gym branding, custom domains, custom SMTP — full white-label",
      "Provider-agnostic SMS layer (Twilio + Cellcast) switchable with one config",
      "Flutter rewrite of an earlier React Native app — shipped to iOS + Android",
      "Field-level encryption via Fernet — rolled out without a single backfill migration",
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
    clientNote: "improveitmd.com · production roofing business",
    industry: "Operations",
    stack: ["Caddy + Authelia SSO", "Strapi 5 + n8n", "Flask + React + Postgres"],
    impact: { value: "8", label: "containers · 5 systemd services · 1 VPS" },
    year: "2024–2026",
    duration: "14 months, ongoing",
    role: "Sole engineer + operator",
    lead: "Eight Docker containers and five systemd services behind one Caddy + Authelia SSO, all on a single ARM64 VPS. Strapi CMS with 900+ content items, a custom Flask + React CRM, n8n lead intake from Google Local Services and Yelp, encrypted nightly backups to a Google Shared Drive.",
    bullets: [
      "Custom 3-tier backup: daily DB dump + full encrypted environment snapshot + incremental media sync",
      "Authelia SSO with dual-auth fallback — rollback is removing one Caddyfile block",
      "GitHub Actions for Strapi, webhook deploys for the website builder, manual for Flask apps",
      "Flask CRM: 26 blueprints, 51 models, Anthropic Claude for assistant + measurement extraction",
    ],
  },
  {
    id: "ai-automation",
    idx: "05",
    title: "Recent <em>Upwork engagements</em> — AI agents, n8n workflows, and the integrations nobody else could get to talk",
    client: "Multiple clients via Upwork",
    clientNote: "47 contracts · $200K+ earned · 100% JSS · Top Rated Plus",
    industry: "AI",
    stack: ["n8n · Zapier · Make", "OpenAI + Claude SDKs", "Python · Node · FastAPI"],
    impact: { value: "5.0", label: "every reviewed contract since Oct 2025" },
    year: "2022–present",
    duration: "Five-year track record",
    role: "Sole engineer · multiple clients",
    lead: "Recent Upwork engagements share a shape: n8n + an AI workflow + a stack of named APIs that need to actually talk to each other. AI Sales Coach (Fathom + n8n + Slack + AI analysis). WhatsApp pizza delivery automation (n8n + SQL). Trainerize + GoHighLevel + Meta Leads system rebuild. Content generation tool with vector RAG. Every reviewed contract since October 2025: 5.0.",
    bullets: [
      "Two multi-year anchor clients: $103K Webflow Page Speed + ongoing $56K Company Website engagement since 2023",
      "Recent recurring stack: n8n, GoHighLevel, Trainerize, Fathom, OpenAI, Claude, Meta CAPI, Slack",
      "Verbatim feedback: \"tech wizard\", \"one of the best developers I've found on this platform\", \"EXACTLY what we needed, and more\"",
      "4,560 hours billed across the 5 years · current rate $50/hr",
    ],
  },
];

const INDUSTRIES = ["All", "Operations", "SaaS", "AI"];

function useReveal() {
  const ref = useRef(null);
  useEffect(() => {
    const els = ref.current?.querySelectorAll('.rv') ?? [];
    els.forEach((el, i) => {
      el.style.setProperty('--rv-d', (80 + i * 90) + 'ms');
    });
  }, []);
  return ref;
}

function Nav({ theme, onTheme }) {
  return (
    <nav className="nav rv">
      <div className="left sans">
        <span><span className="dot"></span>Available · open to engagements</span>
        <span style={{color:"var(--ink-4)"}}>·</span>
        <span>Hyderabad, PK · GMT+5</span>
      </div>
      <div className="center serif"><i>Usama Rehman</i> &nbsp;—&nbsp; <span className="sans" style={{fontStyle:"normal",fontSize:13,letterSpacing:".02em",color:"var(--ink-3)"}}>Solo platform engineer</span></div>
      <div className="right sans">
        <a href="#work">Work</a>
        <a href="#contact">Contact</a>
        <a href="https://www.upwork.com/freelancers/usamamughal95" target="_blank" rel="noreferrer">Upwork</a>
        <a href="https://github.com/osamarehman" target="_blank" rel="noreferrer">GitHub</a>
        <button className="theme-btn" onClick={() => onTheme(theme === 'light' ? 'dark' : 'light')}>
          <span className="glyph"></span>
          <span>{theme === 'light' ? 'Light' : 'Dark'}</span>
        </button>
      </div>
    </nav>
  );
}

function Hero() {
  return (
    <section className="hero">
      <div className="eyebrow rv"><span className="bar"></span>Solo platform engineer · 001 / Portfolio · MMXXVI</div>

      <h1>
        <span className="rv" style={{display:"block"}}>I build and operate</span>
        <span className="rv" style={{display:"block"}}>production AI platforms.</span>
        <span className="rv" style={{display:"block"}}><em>Solo<span style={{color:"var(--accent)"}}>.</span></em></span>
      </h1>

      <div className="hero-meta">
        <div className="col rv">
          <div className="k mono">Practice</div>
          <p>
            Backend, frontend, mobile, infra — all of it, end to end. I take on the
            full build of production platforms most teams would spread across four
            people. Five shipped since 2022. Three still operate under me.
          </p>
        </div>
        <div className="col rv">
          <div className="k mono">Track record</div>
          <div className="stat-row">
            <div className="stat"><b>5</b><span>production<br/>platforms shipped</span></div>
            <div className="stat"><b>$200K+</b><span>Upwork earned<br/>47 contracts · 100% JSS</span></div>
          </div>
        </div>
        <div className="col rv">
          <div className="k mono">Currently</div>
          <p>
            Top Rated Plus on Upwork with a 5-year track record and two multi-year
            anchor clients. Open to multi-month engagements where the build needs
            an owner-operator, not a contractor. Always happy to talk through a
            messy AI pilot — even if we don't end up working together.
          </p>
        </div>
      </div>
    </section>
  );
}

function SectionHeader({ num, title, count }) {
  return (
    <div className="sec-h rv">
      <span className="num mono">{num}</span>
      <h2>{renderEm(title)}</h2>
      <span className="count mono">{count}</span>
    </div>
  );
}

function Filters({ active, setActive, counts, visible }) {
  if (!visible) return null;
  return (
    <div className="filters rv">
      {INDUSTRIES.map(ind => (
        <button
          key={ind}
          className={"chip" + (active === ind ? " active" : "")}
          onClick={() => setActive(ind)}
        >
          <span>{ind}</span>
          <span className="n">{counts[ind] ?? 0}</span>
        </button>
      ))}
      <div style={{flex:1}}></div>
      <button className="chip" style={{borderStyle:"dashed"}} disabled>
        <span>Sort: Newest</span>
        <span className="n">↓</span>
      </button>
    </div>
  );
}

function CaseRow({ c, open, onToggle }) {
  return (
    <article className={"case rv" + (open ? " open" : "")} onClick={onToggle}>
      <div className="row">
        <div className="idx mono">{c.idx}</div>
        <div className="title serif">{renderEm(c.title)}</div>
        <div className="client sans">
          {c.client}
          <small>{c.clientNote}</small>
        </div>
        <div className="tag mono">{c.industry}</div>
        <div className="impact serif"><b>{c.impact.value}</b> {c.impact.label}</div>
        <div className="arrow">
          <svg width="10" height="10" viewBox="0 0 10 10" fill="none"><path d="M2 8L8 2M8 2H3M8 2V7" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/></svg>
        </div>
      </div>
      <div className="detail">
        <div className="detail-inner">
          <div className="detail-pad">
            <div className="lead">
              {c.lead}
            </div>
            <div className="meta">
              <div>
                <div className="k">Role</div>
                <div>{c.role}</div>
              </div>
              <div>
                <div className="k">Year · Duration</div>
                <div>{c.year} · {c.duration}</div>
              </div>
              <div>
                <div className="k">Stack</div>
                <ul>{c.stack.map(s => <li key={s}>{s}</li>)}</ul>
              </div>
              <div>
                <div className="k">What shipped</div>
                <ul>{c.bullets.map(b => <li key={b}>{b}</li>)}</ul>
              </div>
            </div>
            <div className="visual">
              <span>Fig. {c.idx} · {c.client}</span>
              <span>Placeholder · UI screenshot</span>
            </div>
          </div>
        </div>
      </div>
    </article>
  );
}

function Cases({ filter }) {
  const [openId, setOpenId] = useState(null);
  const filtered = useMemo(() => filter === "All" ? CASES : CASES.filter(c => c.industry === filter), [filter]);
  return (
    <div className="cases">
      {filtered.map(c => (
        <CaseRow key={c.id} c={c} open={openId === c.id} onToggle={() => setOpenId(openId === c.id ? null : c.id)} />
      ))}
      {filtered.length === 0 && (
        <div style={{padding:"48px 4px",fontFamily:"Instrument Serif,serif",fontStyle:"italic",color:"var(--ink-3)",fontSize:20}}>
          Nothing here in this slice — but I've probably done something close. <a href="#contact" style={{color:"var(--accent)"}}>Ask me.</a>
        </div>
      )}
    </div>
  );
}

function Footer() {
  return (
    <footer className="foot rv" id="contact">
      <div className="big serif">
        Got an AI pilot that <em>didn't quite</em> ship?
      </div>
      <div className="col">
        <h4>Direct</h4>
        <a className="big-link" href="mailto:osamarehmanmughal@gmail.com">osamarehmanmughal@gmail.com</a>
        <a className="big-link" href="https://www.upwork.com/freelancers/usamamughal95" target="_blank" rel="noreferrer">upwork.com/freelancers/usamamughal95</a>
        <a className="big-link" href="https://github.com/osamarehman" target="_blank" rel="noreferrer">github.com/osamarehman</a>
        <p className="note">I read every inquiry myself. No intake form, no funnel. Replies within one business day.</p>
      </div>
      <div className="col">
        <h4>Engagement</h4>
        <p style={{fontFamily:"Instrument Serif,serif",fontSize:17,lineHeight:1.45,color:"var(--ink-2)",margin:0}}>
          Most projects start with a paid discovery week — I sit with the system,
          map the workflow, and write a build plan you keep regardless of whether
          we continue. Fixed-price or hourly from there.
        </p>
        <p className="note">Top Rated Plus on Upwork · ID verified · Military veteran.</p>
      </div>
    </footer>
  );
}

function Colophon() {
  return (
    <div className="colophon">
      <div>© MMXXVI · Usama Rehman</div>
      <div className="dots"><i></i><i></i><i></i></div>
      <div>Set in Instrument Serif &amp; Sans · Built by hand</div>
    </div>
  );
}

function App() {
  const [t, setTweak] = useTweaks(TWEAK_DEFAULTS);
  const [filter, setFilter] = useState("All");
  const ref = useReveal();

  // apply theme to <html>
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', t.theme);
    document.documentElement.setAttribute('data-density', t.density);
    document.documentElement.style.setProperty('--accent', t.accent);
  }, [t.theme, t.density, t.accent]);

  const counts = useMemo(() => {
    const c = { All: CASES.length };
    for (const ind of INDUSTRIES.slice(1)) c[ind] = CASES.filter(x => x.industry === ind).length;
    return c;
  }, []);

  return (
    <div className="frame" ref={ref}>
      <Nav theme={t.theme} onTheme={(v) => setTweak('theme', v)} />
      <Hero />
      <div id="work">
        <SectionHeader num="§ 02" title="Selected <em>work</em>" count={`${CASES.length} platforms`} />
        <Filters active={filter} setActive={setFilter} counts={counts} visible={t.showFilters} />
        <Cases filter={filter} />
      </div>
      <Footer />
      <Colophon />

      <TweaksPanel>
        <TweakSection label="Theme" />
        <TweakRadio label="Mode" value={t.theme} options={["light","dark"]} onChange={(v) => setTweak('theme', v)} />
        <TweakColor label="Accent" value={t.accent} onChange={(v) => setTweak('accent', v)} />
        <TweakSection label="Layout" />
        <TweakRadio label="Density" value={t.density} options={["compact","regular","comfy"]} onChange={(v) => setTweak('density', v)} />
        <TweakToggle label="Show filters" value={t.showFilters} onChange={(v) => setTweak('showFilters', v)} />
      </TweaksPanel>
    </div>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(<App />);
