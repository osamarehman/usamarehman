// project.jsx - Full project journey detail page (parallel to article.jsx for notes).
// Reads window.CASES + the ?slug=<id> URL param.

const { useState, useEffect } = React;

function ScrollMeter({ toc }) {
  const [p, setP] = useState(0);
  useEffect(() => {
    const onScroll = () => {
      const doc = document.documentElement;
      const scrolled = doc.scrollTop;
      const total = doc.scrollHeight - doc.clientHeight;
      setP(total > 0 ? Math.min(100, Math.max(0, (scrolled / total) * 100)) : 0);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener('scroll', onScroll);
  }, []);
  return (
    <div className="meter">
      <span>Reading - {Math.round(p)}%</span>
      <div className="bar-out"><div className="bar-in" style={{"--p": p + "%"}}></div></div>
      {toc && toc.length > 0 && (
        <div className="toc" style={{marginTop:14}}>
          <div style={{fontFamily:"JetBrains Mono,monospace",fontSize:"10.5px",letterSpacing:".12em",textTransform:"uppercase",color:"var(--ink-3)",marginBottom:6}}>Sections</div>
          {toc.map(h => <a key={h.id} href={`#${h.id}`}>{h.text}</a>)}
        </div>
      )}
    </div>
  );
}

function ProjectApp() {
  const t = useTheme({ theme: 'light', accent: '#0080ff', density: 'comfy' });
  const ref = useReveal();

  // resolve slug -> case
  const slug = (new URLSearchParams(window.location.search).get('slug')) || (window.CASES && window.CASES[0] && window.CASES[0].id);
  const cases = window.CASES || [];
  const c = cases.find(x => x.id === slug) || cases[0] || null;
  const idx = c ? cases.findIndex(x => x.id === c.id) : -1;
  const prev = idx > 0 ? cases[idx - 1] : null;
  const next = idx >= 0 && idx < cases.length - 1 ? cases[idx + 1] : null;

  // render markdown -> html, and extract h2 headings for the TOC
  const { bodyHtml, toc } = React.useMemo(() => {
    if (!c || !c.detailsMd || !window.marked) return { bodyHtml: '', toc: [] };
    let html = window.marked.parse(c.detailsMd);
    const headings = [];
    // Add ids to h2 elements and capture for TOC
    html = html.replace(/<h2>([^<]+)<\/h2>/g, (_, text) => {
      const id = text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
      headings.push({ id, text });
      return `<h2 id="${id}">${text}</h2>`;
    });
    return { bodyHtml: html, toc: headings };
  }, [c && c.id]);

  useEffect(() => {
    if (!c) return;
    document.title = c.title.replace(/<[^>]+>/g,'') + ' - Usama Rehman';
  }, [c]);

  if (!c) {
    return (
      <div className="frame" ref={ref}>
        <Nav theme={t.theme} onTheme={t.setTheme} current="work" />
        <section className="article-head">
          <h1 className="rv">Project not found</h1>
          <p className="dek rv">
            No case study matches <code>?slug={slug}</code>.
            Try <a href="index.html#work">browsing the work section</a>.
          </p>
        </section>
        <Footer />
        <Colophon />
      </div>
    );
  }

  return (
    <div className="frame" ref={ref}>
      <Nav theme={t.theme} onTheme={t.setTheme} current="work" />

      <header className="article-head">
        <div className="crumbs rv">
          <a href="index.html">Home</a>
          <span className="sep">/</span>
          <a href="index.html#work">Work</a>
          <span className="sep">/</span>
          <span style={{color:"var(--ink-2)"}}>{c.idx}</span>
        </div>
        <h1 className="rv">{renderEm(c.title)}</h1>
        {c.lead && <p className="dek rv">{c.lead}</p>}
        <div className="byline rv">
          {c.client && <div><div className="k">Client</div><div className="v">{c.client}</div></div>}
          {c.role && <div><div className="k">Role</div><div className="v">{c.role}</div></div>}
          {c.year && <div><div className="k">{c.duration ? "Year \u00b7 Duration" : "Year"}</div><div className="v">{c.duration ? `${c.year} \u00b7 ${c.duration}` : c.year}</div></div>}
          {c.industry && <div><div className="k">Filed under</div><div className="v">{c.industry}</div></div>}
        </div>
      </header>

      {c.image && (
        <figure className="article-cover rv">
          <img src={c.image} alt={c.imageAlt || ""} loading="eager" />
          {c.imageAlt && <figcaption>{c.imageAlt}</figcaption>}
        </figure>
      )}

      <div className="article-body">
        <article className="prose rv">
          {bodyHtml
            ? <div dangerouslySetInnerHTML={{ __html: bodyHtml }} />
            : (
              <div>
                <p className="drop">
                  This case study is still being written. The high-level shape is in the
                  expanded preview on the <a href="index.html#work">home page</a> -
                  the long-form journey, decisions, and screenshots will live here.
                </p>
                {c.bullets && c.bullets.length > 0 && (
                  <>
                    <h2>What shipped</h2>
                    <ul>{c.bullets.map(b => <li key={b}>{b}</li>)}</ul>
                  </>
                )}
                <p>
                  Want the long version now? <a href="mailto:osamarehmanmughal@gmail.com">Ask me</a> -
                  happy to walk through the build.
                </p>
              </div>
            )}
          {c.stack && c.stack.length > 0 && (
            <>
              <h2 style={{marginTop:"2em"}}>Stack</h2>
              <ul>{c.stack.map(s => <li key={s}>{s}</li>)}</ul>
            </>
          )}
        </article>
        <ScrollMeter toc={toc} />
      </div>

      <nav className="nextprev">
        {prev ? (
          <a href={`project.html?slug=${prev.id}`}>
            <span className="k">{"\u2190 Previous \u00b7 "}{prev.idx}</span>
            <span className="t">{renderEm(prev.title)}</span>
          </a>
        ) : <span></span>}
        {next ? (
          <a className="right" href={`project.html?slug=${next.id}`}>
            <span className="k">{"Next \u00b7 "}{next.idx}{" \u2192"}</span>
            <span className="t">{renderEm(next.title)}</span>
          </a>
        ) : <span></span>}
      </nav>

      <Footer />
      <Colophon />
    </div>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(<ProjectApp />);
