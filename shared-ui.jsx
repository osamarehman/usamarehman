// shared-ui.jsx — Nav, Footer, Colophon, theme hook for notes.html + article.html
// Home page (index.html) has its own copy of Nav/Footer inline in portfolio.jsx.

const { useEffect, useRef } = React;

function useTheme(defaults) {
  const [theme, setThemeState] = React.useState(() => {
    try { return localStorage.getItem('usamar.theme') || defaults.theme || 'light'; }
    catch (e) { return defaults.theme || 'light'; }
  });
  const [accent, setAccentState] = React.useState(() => {
    try { return localStorage.getItem('usamar.accent') || defaults.accent; }
    catch (e) { return defaults.accent; }
  });
  const [density, setDensityState] = React.useState(() => {
    try { return localStorage.getItem('usamar.density') || defaults.density || 'regular'; }
    catch (e) { return defaults.density || 'regular'; }
  });
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    try { localStorage.setItem('usamar.theme', theme); } catch (e) {}
  }, [theme]);
  useEffect(() => {
    document.documentElement.setAttribute('data-density', density);
    try { localStorage.setItem('usamar.density', density); } catch (e) {}
  }, [density]);
  useEffect(() => {
    if (accent) document.documentElement.style.setProperty('--accent', accent);
    try { if (accent) localStorage.setItem('usamar.accent', accent); } catch (e) {}
  }, [accent]);
  return { theme, setTheme: setThemeState, accent, setAccent: setAccentState, density, setDensity: setDensityState };
}

function renderEm(text) {
  const parts = String(text).split(/(<em>.*?<\/em>)/g);
  return parts.map((p, i) => {
    const m = p.match(/^<em>(.*?)<\/em>$/);
    return m ? <em key={i}>{m[1]}</em> : <React.Fragment key={i}>{p}</React.Fragment>;
  });
}

function Nav({ theme, onTheme, current }) {
  const cls = (k) => current === k ? 'current' : '';
  return (
    <nav className="nav rv" style={{"--rv-d":"60ms"}}>
      <div className="left sans">
        <span><span className="dot"></span>Available · open to engagements</span>
        <span style={{color:"var(--ink-4)"}}>·</span>
        <span>Hyderabad, PK · GMT+5</span>
      </div>
      <div className="center serif">
        <a href="/"><i>Usama Rehman</i></a>
        <span className="sans" style={{fontStyle:"normal",fontSize:13,letterSpacing:".02em",color:"var(--ink-3)",marginLeft:8}}>— Solo platform engineer</span>
      </div>
      <div className="right sans">
        <a href="/#work" className={cls('work')}>Work</a>
        <a href="/#client-work" className={cls('clients')}>Clients</a>
        <a href="/notes" className={cls('notes')}>Notes</a>
        <a href="/#contact">Contact</a>
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

function Footer() {
  return (
    <footer className="foot rv" id="contact">
      <div className="big serif">
        Got an AI pilot that <em>didn’t quite</em> ship?
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

function useReveal() {
  const ref = useRef(null);
  useEffect(() => {
    const els = ref.current?.querySelectorAll('.rv') ?? [];
    els.forEach((el, i) => {
      if (!el.style.getPropertyValue('--rv-d')) {
        el.style.setProperty('--rv-d', (80 + i * 70) + 'ms');
      }
    });
  }, []);
  return ref;
}

window.useTheme = useTheme;
window.renderEm = renderEm;
window.Nav = Nav;
window.Footer = Footer;
window.Colophon = Colophon;
window.useReveal = useReveal;
