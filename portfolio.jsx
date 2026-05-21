// portfolio.jsx - Usama Rehman portfolio app

const { useState, useEffect, useMemo, useRef } = React;

const TWEAK_DEFAULTS = /*EDITMODE-BEGIN*/{
  "theme": "light",
  "accent": "#0080ff",
  "density": "comfy",
  "showFilters": true
}/*EDITMODE-END*/;

// Tiny safe parser: splits a string on <em>...</em> tags and returns JSX nodes.
// Hardcoded content only - never feed user input through this.
function renderEm(text) {
  const parts = String(text).split(/(<em>.*?<\/em>)/g);
  return parts.map((p, i) => {
    const m = p.match(/^<em>(.*?)<\/em>$/);
    return m ? <em key={i}>{m[1]}</em> : <React.Fragment key={i}>{p}</React.Fragment>;
  });
}

// CASES is provided by cases-data.js (window.CASES)
const CASES = (typeof window !== "undefined" && window.CASES) || [];



const INDUSTRIES = ["All", "Operations", "SaaS", "AI"];

// Scroll-triggered reveal - IntersectionObserver, batches sequential reveals.
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

// Counter - animates from 0 to `to` once it enters viewport.
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
      <div className="center serif"><i>Usama Rehman</i> &nbsp;-&nbsp; <span className="sans" style={{fontStyle:"normal",fontSize:13,letterSpacing:".02em",color:"var(--ink-3)"}}>Solo platform engineer</span></div>
      <div className="right sans">
        <a href="#work">Work</a>
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
  const portraitRef = useRef(null);
  useEffect(() => {
    const fig = portraitRef.current;
    if (!fig) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    let raf = null;
    const onMove = (e) => {
      const r = fig.getBoundingClientRect();
      const x = (e.clientX - r.left) / r.width;
      const y = (e.clientY - r.top) / r.height;
      const tx = (0.5 - y) * 9;   // rotateX (max ±4.5deg)
      const ty = (x - 0.5) * 11;  // rotateY (max ±5.5deg)
      if (raf) cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        fig.style.setProperty('--tilt-x', tx.toFixed(2) + 'deg');
        fig.style.setProperty('--tilt-y', ty.toFixed(2) + 'deg');
        fig.style.setProperty('--glare-x', (x * 100).toFixed(1) + '%');
        fig.style.setProperty('--glare-y', (y * 100).toFixed(1) + '%');
      });
    };
    const onLeave = () => {
      fig.style.setProperty('--tilt-x', '0deg');
      fig.style.setProperty('--tilt-y', '0deg');
    };
    fig.addEventListener('mousemove', onMove);
    fig.addEventListener('mouseleave', onLeave);
    return () => {
      fig.removeEventListener('mousemove', onMove);
      fig.removeEventListener('mouseleave', onLeave);
    };
  }, []);
  return (
    <section className="hero">
      <figure className="portrait rv" ref={portraitRef}>
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
            Backend, frontend, mobile, infra - all of it, end to end. I take on the
            full build of production platforms most teams would spread across four
            people. Five platforms I own and operate, plus eight documented client
            systems shipped - AI agents, automation pipelines, and the integrations
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
            messy AI pilot - even if we don't end up working together.
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
  const expandable = !!(c.lead || (c.bullets && c.bullets.length) || c.image || c.detailsMd);
  return (
    <article
      className={"case rv" + (open ? " open" : "") + (expandable ? " expandable" : "")}
      onClick={expandable ? onToggle : undefined}
    >
      <div className="row">
        <div className="idx mono">{c.idx}</div>
        <div className="title serif">{renderEm(c.title)}</div>
        <div className="client sans">
          {c.client}
          {c.clientNote && <small>{c.clientNote}</small>}
        </div>
        <div className="tag mono">{c.industry}</div>
        <div className="impact serif">
          {c.impact
            ? <span><b>{c.impact.value}</b> {c.impact.label}</span>
            : <span className="impact-year mono">{c.year}</span>}
        </div>
        <div className="arrow" style={{ visibility: expandable ? 'visible' : 'hidden' }}>
          <svg width="10" height="10" viewBox="0 0 10 10" fill="none"><path d="M2 8L8 2M8 2H3M8 2V7" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/></svg>
        </div>
      </div>
      {expandable && (
        <div className="detail">
          <div className="detail-inner">
            <div className="detail-pad">
              {c.lead && <div className="lead">{c.lead}</div>}
              <div className="meta">
                {c.role && (
                  <div>
                    <div className="k">Role</div>
                    <div>{c.role}</div>
                  </div>
                )}
                {(c.year || c.duration) && (
                  <div>
                    <div className="k">{c.duration ? "Year \u00b7 Duration" : "Year"}</div>
                    <div>{c.duration ? `${c.year} \u00b7 ${c.duration}` : c.year}</div>
                  </div>
                )}
                {c.stack && c.stack.length > 0 && (
                  <div>
                    <div className="k">Stack</div>
                    <ul>{c.stack.map(s => <li key={s}>{s}</li>)}</ul>
                  </div>
                )}
                {c.bullets && c.bullets.length > 0 && (
                  <div>
                    <div className="k">What shipped</div>
                    <ul>{c.bullets.map(b => <li key={b}>{b}</li>)}</ul>
                  </div>
                )}
              </div>
              {c.detailsMd && window.marked && (
                <div
                  className="case-md"
                  dangerouslySetInnerHTML={{ __html: window.marked.parse(c.detailsMd) }}
                />
              )}
              {c.image && (
                <figure className="visual">
                  <img src={c.image} alt={c.imageAlt || `${c.client} - ${c.title.replace(/<[^>]+>/g,'')}`} loading="lazy" />
                  <figcaption>
                    <span>Fig. {c.idx} · {c.client}</span>
                    <span>{c.imageAlt || ""}</span>
                  </figcaption>
                </figure>
              )}
              <a
                className="case-readmore"
                href={`project.html?slug=${c.id}`}
                onClick={(e) => e.stopPropagation()}
              >
                <span>Read full case study</span>
                <svg width="12" height="12" viewBox="0 0 12 12" fill="none"><path d="M3 9L9 3M9 3H4M9 3V8" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/></svg>
              </a>
            </div>
          </div>
        </div>
      )}
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
          Nothing here in this slice - but I've probably done something close. <a href="#contact" style={{color:"var(--accent)"}}>Ask me.</a>
        </div>
      )}
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
          Most projects start with a paid discovery week - I sit with the system,
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
        <SectionHeader num="§ 02" title="Selected <em>work</em>" count={`${CASES.length} engagements`} />
        <Filters active={filter} setActive={setFilter} counts={counts} visible={t.showFilters} />
        <Cases filter={filter} />
      </div>
      <div id="notes">
        <SectionHeader num="§ 03" title="Featured <em>notes</em>" count={<a href="notes.html" style={{color:"inherit"}}>All notes ↗</a>} />
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
