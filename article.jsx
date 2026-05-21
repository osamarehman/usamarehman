// article.jsx - one full long-read article

const { useState, useEffect } = React;

// Article bodies, keyed by slug. Currently only the lead piece has a full body -
// other slugs render the same body (placeholder) so links from notes work end-to-end.
const ARTICLE_BODY = {
  __default__: (
    <>
      <p className="drop">
        Every workflow held together by a shared spreadsheet is a loan. The interest
        payment is paid in small, quiet increments - a dispatcher pausing to scroll
        for the right row, a controller re-typing a number for the fourth time, a
        new hire spending their first week learning which tab is the real one. None
        of it shows up on a budget line. All of it shows up in how long it takes to
        do anything.
      </p>
      <p>
        I’ve spent the last four years building software to retire these workflows.
        The pattern is so consistent it’s almost boring: a team starts with one
        clever sheet, the sheet earns its keep, the sheet grows tabs, and then -
        somewhere around year three - the sheet has become the operating system.
        Removing it is a project. Replacing it is a much bigger project. Ignoring
        it is the most expensive option of all.
      </p>
      <p>
        Here are the four signs the interest has started to compound on you. None
        of them are technical. All of them are observable from a Wednesday
        afternoon walking the floor.
      </p>

      <h2>1. The <em>onboarding</em> conversation</h2>
      <p>
        Ask a tenured operator how a new hire learns the workflow. If the answer
        includes the phrase <i>“you kind of just figure it out”</i>, or there’s a
        video buried in a Notion page that someone made in 2022, the spreadsheet
        has become tribal knowledge. That knowledge is real - it’s how the
        business runs - but it lives in exactly one person’s head, and that
        person is going on vacation next month.
      </p>

      <blockquote>
        The spreadsheet doesn’t teach you what to do. It teaches you what the last
        person did. Those are different things.
      </blockquote>

      <h2>2. The <em>parallel</em> tab</h2>
      <p>
        Watch how the team actually uses the sheet. If half the people open it,
        copy a range, paste it into their own scratch tab, and work from
        there - the source of truth has already split. You’re running two
        spreadsheets now. Soon you’ll be running four.
      </p>
      <p>
        Once a workflow has parallel tabs, the question stops being <i>“is
        this number right?”</i> and starts being <i>“whose copy of this number
        is right?”</i> That’s not a tooling problem you can solve with stricter
        validation. It’s a tooling problem that needs a different tool.
      </p>

      <p className="pull">
        A spreadsheet is a great place to <em>think</em> about a workflow.
        It’s a terrible place to <em>run</em> one.
      </p>

      <h2>3. The Monday morning <em>reconciliation</em></h2>
      <p>
        Ask whoever runs the team what they do first on Monday. If the answer
        is <i>“I open the sheet and fix it”</i> - adjusting numbers because a
        weekend automation got out of sync, or because someone left a row half
        edited Friday night - that fixing time is now a permanent line item in
        the operations budget. It scales linearly with volume. It is the
        cleanest possible signal that the spreadsheet is past its useful life.
      </p>

      <h2>4. The <em>“we can’t change that”</em> moment</h2>
      <p>
        The clearest sign of all: the team has stopped asking for changes. Someone
        proposes a new product line, a new region, a new pricing rule - and the
        answer comes back, half-apologetic, that <i>“the sheet can’t really do
        that.”</i> The spreadsheet has gone from enabling the business to
        constraining it. Every future opportunity now has to negotiate with a
        tool that was supposed to be temporary.
      </p>

      <h2>What to do about it</h2>
      <p>
        You don’t need to rip out the spreadsheet on day one. You need to model
        the workflow as it actually runs, in something real - a small app, a
        proper schema, an audit trail - and then walk the team across, one
        column at a time. The spreadsheet becomes a read-only mirror of the
        new source of truth, then a backup, then a memory.
      </p>
      <p>
        It’s not a glamorous project. The before/after screenshots don’t look
        impressive. But six months later, nobody opens the sheet on Monday
        morning to fix anything. That’s the deliverable. That’s what you’re
        paying down.
      </p>
      <ul>
        <li>Start by mapping who reads from the sheet, who writes to it, and on what cadence.</li>
        <li>Identify the three or four objects the sheet is secretly modeling. Those are your tables.</li>
        <li>Build the new tool around the team’s artifacts - the email, the scan, the form - not around the sheet’s columns.</li>
        <li>Keep the spreadsheet alive as a read-only view for as long as anyone needs it. Pride is not the goal.</li>
      </ul>
      <p>
        The first project I worked on with these patterns saved a logistics
        company about four hours a day, every day, forever. The savings weren’t
        in a single workflow. They were in the cumulative weight of all the
        little tax payments the sheet had been quietly collecting. <a href="mailto:hello@usamar.dev">Tell
        me about yours.</a>
      </p>
    </>
  ),
};

function ScrollMeter() {
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
      <span>Reading · {Math.round(p)}%</span>
      <div className="bar-out"><div className="bar-in" style={{"--p": p + "%"}}></div></div>
      <div className="toc" style={{marginTop:14}}>
        <div style={{fontFamily:"JetBrains Mono,monospace",fontSize:"10.5px",letterSpacing:".12em",textTransform:"uppercase",color:"var(--ink-3)",marginBottom:6}}>Sections</div>
        <a href="#s1">1 · Onboarding</a>
        <a href="#s2">2 · Parallel tab</a>
        <a href="#s3">3 · Reconciliation</a>
        <a href="#s4">4 · “Can’t change”</a>
        <a href="#s5">What to do</a>
      </div>
    </div>
  );
}

function ArticleApp() {
  const t = useTheme({ theme: 'light', accent: '#B8552E', density: 'regular' });
  const ref = useReveal();

  // resolve slug → note record
  const slug = (new URLSearchParams(window.location.search).get('slug')) || 'spreadsheet-debt';
  const note = NOTES.find(n => n.slug === slug) || NOTES[0];
  const idx = NOTES.findIndex(n => n.slug === note.slug);
  const prev = NOTES[idx - 1];
  const next = NOTES[idx + 1];

  // for the demo, all articles render the same long body
  const body = ARTICLE_BODY[note.slug] || ARTICLE_BODY.__default__;

  useEffect(() => {
    document.title = note.title.replace(/<[^>]+>/g,'') + ' - Usama Rehman';
  }, [note]);

  return (
    <div className="frame" ref={ref}>
      <Nav theme={t.theme} onTheme={t.setTheme} current="notes" />

      <header className="article-head">
        <div className="crumbs rv">
          <a href="index.html">Home</a>
          <span className="sep">/</span>
          <a href="notes.html">Notes</a>
          <span className="sep">/</span>
          <span style={{color:"var(--ink-2)"}}>{note.idx}</span>
        </div>
        <h1 className="rv">{renderEm(note.title)}</h1>
        <p className="dek rv">{note.dek}</p>
        <div className="byline rv">
          <div><div className="k">By</div><div className="v">Usama Rehman</div></div>
          <div><div className="k">Published</div><div className="v">{note.dateLabel}</div></div>
          <div><div className="k">Reading</div><div className="v">{note.readMin} min</div></div>
          <div><div className="k">Filed under</div><div className="v">{note.tag}</div></div>
        </div>
      </header>

      {note.cover && (
        <figure className="article-cover rv">
          <img src={note.cover} alt={note.coverAlt || ""} loading="eager" />
          {note.coverAlt && <figcaption>{note.coverAlt}</figcaption>}
        </figure>
      )}

      <div className="article-body">
        <article className="prose rv">
          {body}
        </article>
        <ScrollMeter />
      </div>

      <nav className="nextprev">
        {prev ? (
          <a href={`article.html?slug=${prev.slug}`}>
            <span className="k">← Previous · {prev.idx}</span>
            <span className="t">{renderEm(prev.title)}</span>
          </a>
        ) : <span></span>}
        {next ? (
          <a className="right" href={`article.html?slug=${next.slug}`}>
            <span className="k">Next · {next.idx} →</span>
            <span className="t">{renderEm(next.title)}</span>
          </a>
        ) : <span></span>}
      </nav>

      <Footer />
      <Colophon />
    </div>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(<ArticleApp />);
