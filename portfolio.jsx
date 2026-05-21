// portfolio.jsx — Usama Rehman portfolio app

const { useState, useEffect, useMemo, useRef } = React;

const TWEAK_DEFAULTS = /*EDITMODE-BEGIN*/{
  "theme": "light",
  "accent": "#0080ff",
  "density": "comfy",
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
];

// Client engagements — delivered under NDA via an agency partner.
// Described at a general level (sector + system + stack), no client names or
// proprietary project names, per the confidentiality terms of each contract.
const CLIENT_WORK = [
  {
    idx: "05",
    title: "Hotel operations intelligence portal",
    sector: "Hospitality · multi-property hotel group",
    blurb: "Real-time property KPI cockpit — occupancy, RevPAR, labor, market share — with a 16-alert engine, a 60-second GM daily confirmation flow, vendor data integrations (PMS, market feed, payroll), and n8n notification workflows. Config-driven multi-property: adding a property is an insert, not a rebuild.",
    stack: ["Next.js 16", "Supabase · Postgres RLS", "Vercel", "n8n"],
    year: "2026",
  },
  {
    idx: "06",
    title: "AI deal-origination engine",
    sector: "Private equity · M&A advisory",
    blurb: "Automated acquisition-sourcing pipeline: parallel search across multiple data vendors, a dedup engine (domain match + fuzzy name), Claude-scored fit ratings with written rationale per target, contact enrichment for qualified targets, and a client-ready Excel export.",
    stack: ["Node.js", "Claude API", "n8n", "Supabase"],
    year: "2026",
  },
  {
    idx: "07",
    title: "AI sales agent & outreach pipeline",
    sector: "Residential solar",
    blurb: "A live AI conversation agent that qualifies, educates, prices (territory-aware via a solar design API), and hands off to the sales team — wired end-to-end from cold outreach through reply detection into the agent, with infrastructure hardening and silent-failure cleanup.",
    stack: ["n8n", "OpenAI", "Airtable", "Instantly · Clay"],
    year: "2026",
  },
  {
    idx: "08",
    title: "Smart production scheduling system",
    sector: "Sign & graphics manufacturing",
    blurb: "AI proof-PDF extraction, a production-time calculator across 8+ operation types built from the client's own rate cards, and a capacity-aware scheduling engine — all migrated from custom TypeScript into maintainable n8n workflows, with operational dashboards.",
    stack: ["n8n", "Google Gemini", "Monday.com", "TypeScript"],
    year: "2026",
  },
  {
    idx: "09",
    title: "Order, freight & operations automation",
    sector: "Marine equipment distributor",
    blurb: "Layered, fault-isolated automation: PO intake (PDF OCR + EDI feeds) against a self-learning SKU/unit mapping store, automated ERP order creation with conflict-safe numbering, two-stage freight booking, and tracking loopback into one-click invoicing.",
    stack: ["n8n", "OCR", "Fishbowl ERP", "FreightView · C.H. Robinson"],
    year: "2026",
  },
  {
    idx: "10",
    title: "Automated property intelligence system",
    sector: "Real estate lead intelligence",
    blurb: "Monitors 28 municipal planning, zoning, and review boards across 7 ZIP codes; extracts property signals and contacts from meeting documents with AI; scores and tiers leads deterministically; and ships structured weekly and monthly data packages.",
    stack: ["n8n", "OpenAI", "Airtable", "Apify · Regrid"],
    year: "2026",
  },
  {
    idx: "11",
    title: "Sales backend automation — 3 modules",
    sector: "Sales consultancy",
    blurb: "An AI diagnostic-email engine, a conditional sales-script + one-page \"battle map\" PDF generator, and a Stream Deck webhook \"kill switch\" for instant contract delivery mid-call — each output mobile-responsive and delivered transactionally.",
    stack: ["Make.com", "Airtable", "Gemini · GPT", "Postmark · PDFMonkey"],
    year: "2026",
  },
  {
    idx: "12",
    title: "Personality assessment → PDF report engine",
    sector: "Coaching · assessment",
    blurb: "A 50-question Typeform feeding a scoring and classification engine (personality type, risk/reward composites, driver) that resolves conditional logic and renders a dynamic, personalized PDF report delivered to each respondent.",
    stack: ["Typeform", "n8n", "PDF generation"],
    year: "2026",
  },
];

const INDUSTRIES = ["All", "Operations", "SaaS"];

// Scroll-triggered reveal — IntersectionObserver, batches sequential reveals.
// Watches via MutationObserver so newly-added .rv elements (filter changes,
// expanded details, etc.) get observed too. Uses a data attribute instead of a
// class so React's className reconciliation can't wipe it on re-render.
function useReveal() {
  const ref = useRef(null);
  useEffect(() => {
    if (!ref.current) return;
    let queue = [];
    let frame = null;
    const flush = () => {
      queue.forEach((el, i) => {
        if (!el.style.getPropertyValue('--rv-d')) {
          el.style.setProperty('--rv-d', (i * 80) + 'ms');
        }
        el.setAttribute('data-revealed', 'true');
      });
      queue = [];
      frame = null;
    };
    const intersection = new IntersectionObserver((entries) => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          queue.push(e.target);
          intersection.unobserve(e.target);
        }
      });
      if (!frame && queue.length) frame = requestAnimationFrame(flush);
    }, { threshold: 0.12, rootMargin: '0px 0px -6% 0px' });

    const observeUnrevealed = () => {
      ref.current.querySelectorAll('.rv:not([data-revealed="true"])').forEach(el => intersection.observe(el));
    };
    observeUnrevealed();

    const mutation = new MutationObserver(() => observeUnrevealed());
    mutation.observe(ref.current, { childList: true, subtree: true });

    return () => {
      intersection.disconnect();
      mutation.disconnect();
    };
  }, []);
  return ref;
}

// Counter — animates from 0 to `to` once it enters viewport.
function Counter({ to, prefix = "", suffix = "", duration = 1400 }) {
  const [val, setVal] = useState(0);
  const elRef = useRef(null);
  const started = useRef(false);
  useEffect(() => {
    if (!elRef.current) return;
    const obs = new IntersectionObserver((entries) => {
      entries.forEach(e => {
        if (e.isIntersecting && !started.current) {
          started.current = true;
          obs.disconnect();
          const start = performance.now();
          const step = (now) => {
            const t = Math.min(1, (now - start) / duration);
            const eased = 1 - Math.pow(1 - t, 3);
            setVal(Math.round(to * eased));
            if (t < 1) requestAnimationFrame(step);
          };
          requestAnimationFrame(step);
        }
      });
    }, { threshold: 0.5 });
    obs.observe(elRef.current);
    return () => obs.disconnect();
  }, [to, duration]);
  return <span ref={elRef}>{prefix}{val}{suffix}</span>;
}

function Words({ text }) {
  return text.split(/\s+/).filter(Boolean).map((w, i) =>
    <span key={i} className="rv word">{w}</span>
  );
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
        <a href="#client-work">Clients</a>
        <a href="notes.html">Notes</a>
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
      <figure className="portrait rv">
        <img src="profile.png" alt="Usama Rehman" width="300" height="380" loading="eager" />
        <figcaption className="mono">Usama Rehman<span>Hyderabad · PK</span></figcaption>
      </figure>
      <div className="eyebrow rv"><span className="bar"></span>Solo platform engineer · 001 / Portfolio · MMXXVI</div>

      <h1>
        <span style={{display:"block"}}><Words text="I build and operate" /></span>
        <span style={{display:"block"}}><Words text="production AI platforms." /></span>
        <span style={{display:"block"}}>
          <em><span className="rv word">Solo</span></em>
          <span className="rv word" style={{color:"var(--accent)"}}>.</span>
        </span>
      </h1>

      <div className="hero-meta">
        <div className="col rv">
          <div className="k mono">Practice</div>
          <p>
            Backend, frontend, mobile, infra — all of it, end to end. I take on the
            full build of production platforms most teams would spread across four
            people. Five platforms I own and operate, plus eight documented client
            systems shipped — AI agents, automation pipelines, and the integrations
            nobody else could get to talk.
          </p>
        </div>
        <div className="col rv">
          <div className="k mono">Track record</div>
          <div className="stat-row">
            <div className="stat"><b><Counter to={5} />+<Counter to={8} /></b><span>platforms built<br/>+ client systems</span></div>
            <div className="stat"><b><Counter to={200} prefix="$" suffix="K+" /></b><span>Upwork earned<br/>47 contracts · 100% JSS</span></div>
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
            {c.image && (
              <figure className="visual">
                <img src={c.image} alt={c.imageAlt || `${c.client} — ${c.title.replace(/<[^>]+>/g,'')}`} loading="lazy" />
                <figcaption>
                  <span>Fig. {c.idx} · {c.client}</span>
                  <span>{c.imageAlt || ""}</span>
                </figcaption>
              </figure>
            )}
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

function ClientWork() {
  return (
    <div className="client-work">
      {CLIENT_WORK.map(c => (
        <article className="cw-row rv" key={c.idx}>
          <div className="cw-idx mono">{c.idx}</div>
          <div className="cw-body">
            <div className="cw-title serif">{c.title}</div>
            <div className="cw-sector sans">{c.sector}</div>
            <p className="cw-blurb">{c.blurb}</p>
            <ul className="cw-stack mono">{c.stack.map(s => <li key={s}>{s}</li>)}</ul>
          </div>
          <div className="cw-year mono">{c.year}</div>
        </article>
      ))}
    </div>
  );
}

function FeaturedNotes() {
  // NOTES is loaded as a global via notes-data.js
  if (typeof window === 'undefined' || !window.NOTES || !window.NOTES.length) return null;
  const featured = window.NOTES.filter(n => n.featured).slice(0, 3);
  if (!featured.length) return null;
  const lead = featured[0];
  const rest = featured.slice(1);
  const isDraft = (n) => n.status === 'draft';
  return (
    <div className="featured rv">
      <a className="fn lead" href={`article.html?slug=${lead.slug}`}>
        {lead.cover
          ? <div className="cover"><img src={lead.cover} alt={lead.coverAlt || ""} loading="lazy" /></div>
          : <div className="glyph"></div>}
        <div className="fn-meta">
          <span><span className="dot"></span>Featured · {lead.tag}</span>
          <span>{lead.readMin} min</span>
        </div>
        <h3>{renderEm(lead.title)}</h3>
        <p className="dek">{lead.dek}</p>
        <div className="row-bottom">
          <span className="tag">{isDraft(lead) ? <span className="badge">Draft</span> : lead.dateLabel}</span>
          <span className="read">Read essay
            <svg viewBox="0 0 10 10" fill="none"><path d="M2 8L8 2M8 2H3M8 2V7" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/></svg>
          </span>
        </div>
      </a>
      {rest.map(n => (
        <a key={n.slug} className="fn" href={`article.html?slug=${n.slug}`}>
          {n.cover && <div className="cover small"><img src={n.cover} alt={n.coverAlt || ""} loading="lazy" /></div>}
          <div className="fn-meta">
            <span className="tag">{n.tag}</span>
            <span>{n.readMin} min</span>
          </div>
          <h3>{renderEm(n.title)}</h3>
          <p className="dek">{n.dek}</p>
          <div className="row-bottom">
            <span className="tag">{isDraft(n) ? <span className="badge">Draft</span> : n.dateLabel}</span>
            <span className="read">Read
              <svg viewBox="0 0 10 10" fill="none"><path d="M2 8L8 2M8 2H3M8 2V7" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/></svg>
            </span>
          </div>
        </a>
      ))}
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

  // apply theme to <html> + persist to localStorage so it survives nav to /notes /article
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', t.theme);
    document.documentElement.setAttribute('data-density', t.density);
    document.documentElement.style.setProperty('--accent', t.accent);
    try {
      localStorage.setItem('usamar.theme', t.theme);
      localStorage.setItem('usamar.density', t.density);
      localStorage.setItem('usamar.accent', t.accent);
    } catch (e) {}
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
        <SectionHeader num="§ 02" title="Platforms I <em>build &amp; operate</em>" count={`${CASES.length} platforms`} />
        <Filters active={filter} setActive={setFilter} counts={counts} visible={t.showFilters} />
        <Cases filter={filter} />
      </div>
      <div id="client-work">
        <SectionHeader num="§ 03" title="Client <em>engagements</em>" count={`${CLIENT_WORK.length} systems · under NDA`} />
        <ClientWork />
      </div>
      <div id="notes">
        <SectionHeader num="§ 04" title="Featured <em>notes</em>" count={<a href="notes.html" style={{color:"inherit"}}>All notes ↗</a>} />
        <FeaturedNotes />
      </div>
      <Footer />
      <Colophon />

      <TweaksPanel>
        <TweakSection label="Theme" />
        <TweakRadio label="Mode" value={t.theme} options={["light","dark"]} onChange={(v) => setTweak('theme', v)} />
        <TweakColor label="Accent" value={t.accent} options={["#0080ff","#B8552E","#1F8A5B","#6B4F8E"]} onChange={(v) => setTweak('accent', v)} />
        <TweakSection label="Layout" />
        <TweakRadio label="Density" value={t.density} options={["compact","regular","comfy"]} onChange={(v) => setTweak('density', v)} />
        <TweakToggle label="Show filters" value={t.showFilters} onChange={(v) => setTweak('showFilters', v)} />
      </TweaksPanel>
    </div>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(<App />);
