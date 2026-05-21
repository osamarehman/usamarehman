// notes.jsx — Notes archive page

const { useState, useMemo } = React;

function NoteRow({ n }) {
  const draft = n.status === 'draft';
  return (
    <a className="nrow" href={`/article?slug=${n.slug}`}>
      <div className="idx mono">{n.idx}</div>
      <div>
        <h3>{renderEm(n.title)}</h3>
        <p className="dek">{n.dek}</p>
      </div>
      <div className="meta">
        <span className="tag">{n.tag}</span>
        <span className="min">{n.readMin} min read</span>
      </div>
      <div className="date">
        {draft
          ? <span style={{fontFamily:"JetBrains Mono,monospace",fontSize:10,letterSpacing:".12em",textTransform:"uppercase",color:"var(--accent)",border:".5px solid color-mix(in oklab, var(--accent) 50%, transparent)",borderRadius:3,padding:"1px 6px"}}>Draft</span>
          : n.dateLabel}
      </div>
      <div className="arrow">
        <svg width="10" height="10" viewBox="0 0 10 10" fill="none"><path d="M2 8L8 2M8 2H3M8 2V7" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/></svg>
      </div>
    </a>
  );
}

function NotesApp() {
  const t = useTheme({ theme: 'light', accent: '#B8552E', density: 'regular' });
  const [tag, setTag] = useState("All");
  const ref = useReveal();

  const counts = useMemo(() => {
    const c = { All: NOTES.length };
    for (const k of NOTE_TAGS.slice(1)) c[k] = NOTES.filter(n => n.tag === k).length;
    return c;
  }, []);

  const filtered = useMemo(
    () => tag === "All" ? NOTES : NOTES.filter(n => n.tag === tag),
    [tag]
  );

  // archive by year
  const byYear = useMemo(() => {
    const m = {};
    NOTES.forEach(n => {
      const y = n.date.slice(0, 4);
      m[y] = (m[y] ?? 0) + 1;
    });
    return Object.entries(m).sort((a,b) => b[0].localeCompare(a[0]));
  }, []);

  return (
    <div className="frame" ref={ref}>
      <Nav theme={t.theme} onTheme={t.setTheme} current="notes" />

      <section className="notes-hero">
        <div className="lhs">
          <div className="eyebrow rv"><span className="bar"></span>Notes · MMXXVI</div>
          <h1 className="rv">Field notes from <em>shipping</em> production AI platforms solo.</h1>
        </div>
        <div className="rhs rv">
          Short essays on what I keep getting right and wrong while building, operating,
          and selling production software end-to-end. New piece when the lesson is paid for.
        </div>
      </section>

      <div className="archive">
        <div>
          <div className="filters rv" style={{marginTop:12}}>
            {NOTE_TAGS.map(k => (
              <button key={k} className={"chip" + (tag === k ? " active" : "")} onClick={() => setTag(k)}>
                <span>{k}</span>
                <span className="n">{counts[k] ?? 0}</span>
              </button>
            ))}
          </div>

          <div className="notes-list">
            {filtered.map(n => <div key={n.slug} className="rv"><NoteRow n={n} /></div>)}
            {filtered.length === 0 && (
              <div style={{padding:"48px 4px",fontFamily:"Instrument Serif,serif",fontStyle:"italic",color:"var(--ink-3)",fontSize:20}}>
                Nothing under <i>{tag}</i> yet — keep an eye on this space.
              </div>
            )}
          </div>
        </div>

        <aside className="side rv">
          <div>
            <h4>Archive</h4>
            {byYear.map(([y, n]) => (
              <div key={y} className="yr"><b>{y}</b><span>{n} {n === 1 ? 'note' : 'notes'}</span></div>
            ))}
          </div>
          <div className="quote">
            “Write the thing you wish someone had written for you six months ago.”
            <span>— Working principle</span>
          </div>
        </aside>
      </div>

      <Footer />
      <Colophon />
    </div>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(<NotesApp />);
