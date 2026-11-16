import { useEffect, useRef, useState, type KeyboardEvent } from 'react';
import { ArrowUpRight, Expand } from '../Icons';
import type { WorkItem } from './work-types';

function canDriveScroll() {
  return window.innerWidth >= 1024 && window.innerHeight >= 760 && !window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

export default function WorkShowcase({ items }: { items: WorkItem[] }) {
  const [activeId, setActiveId] = useState(items[0]?.id || '');
  const tabsRef = useRef<HTMLDivElement>(null);
  const dialogRef = useRef<HTMLDialogElement>(null);
  const activeIndex = Math.max(0, items.findIndex((item) => item.id === activeId));
  const active = items[activeIndex] || items[0];

  useEffect(() => {
    let frame = 0;
    const update = () => {
      frame = 0;
      if (!canDriveScroll()) return;
      const track = document.querySelector<HTMLElement>('[data-work-track]');
      if (!track) return;
      const rect = track.getBoundingClientRect();
      const scrollable = track.offsetHeight - window.innerHeight;
      if (scrollable <= 0) return;
      const progress = Math.min(0.999, Math.max(0, -rect.top / scrollable));
      const next = Math.min(items.length - 1, Math.floor(progress * items.length));
      setActiveId((current) => current === items[next].id ? current : items[next].id);
    };
    const schedule = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };
    window.addEventListener('scroll', schedule, { passive: true });
    window.addEventListener('resize', schedule);
    update();
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener('scroll', schedule);
      window.removeEventListener('resize', schedule);
    };
  }, [items]);

  if (!active || !active.cover) return null;

  const scrollToProject = (index: number) => {
    if (!canDriveScroll()) return;
    const track = document.querySelector<HTMLElement>('[data-work-track]');
    if (!track) return;
    const top = window.scrollY + track.getBoundingClientRect().top;
    const scrollable = track.offsetHeight - window.innerHeight;
    const target = top + (index / items.length) * scrollable + 16;
    window.scrollTo({ top: target, behavior: 'smooth' });
  };

  const selectProject = (index: number, focus = false) => {
    const next = (index + items.length) % items.length;
    setActiveId(items[next].id);
    if (focus) tabsRef.current?.querySelectorAll<HTMLButtonElement>('[role="tab"]')[next]?.focus();
    scrollToProject(next);
  };

  const handleKeys = (event: KeyboardEvent<HTMLButtonElement>, index: number) => {
    if (event.key === 'ArrowRight') { event.preventDefault(); selectProject(index + 1, true); }
    if (event.key === 'ArrowLeft') { event.preventDefault(); selectProject(index - 1, true); }
    if (event.key === 'Home') { event.preventDefault(); selectProject(0, true); }
    if (event.key === 'End') { event.preventDefault(); selectProject(items.length - 1, true); }
  };

  const openViewer = () => {
    document.body.style.overflow = 'hidden';
    dialogRef.current?.showModal();
  };

  return (
    <>
      <div className="workbench" data-reveal>
        <div className="work-tabs" role="tablist" aria-label="Selected project files" ref={tabsRef}>
          {items.map((item, index) => (
            <button
              key={item.id}
              id={`work-tab-${item.id}`}
              type="button"
              role="tab"
              aria-selected={item.id === active.id}
              aria-controls={`work-panel-${item.id}`}
              tabIndex={item.id === active.id ? 0 : -1}
              className={item.id === active.id ? 'active' : ''}
              onClick={() => selectProject(index)}
              onKeyDown={(event) => handleKeys(event, index)}
            >
              <span className="tab-dot" />
              <span>{item.client}</span>
              <small>{item.type}</small>
            </button>
          ))}
        </div>

        <div className="workbench-body" id={`work-panel-${active.id}`} role="tabpanel" aria-labelledby={`work-tab-${active.id}`} key={active.id}>
          <div className="work-result">
            <div>
              <p className="mono-label">// result</p>
              {active.status && <span className="project-status">{active.status}</span>}
              <h3>{active.headlineMetric}</h3>
              <p className="work-project-title">{active.title}</p>
              <p className="work-subtitle">{active.subtitle}</p>
              <p className="work-summary">{active.summary}</p>
            </div>
            <div className="work-result-bottom">
              <div className="work-mini-metrics">
                {active.metrics.slice(0, 2).map((metric) => <div key={metric.label}><strong>{metric.value}</strong><span>{metric.label}</span></div>)}
              </div>
              <a className="button button-secondary" href={`/work/${active.id}`}>Read case study <ArrowUpRight size={14} /></a>
            </div>
          </div>

          <div className="work-preview">
            <div className="work-preview-head"><span>// project screenshot</span><span>{active.client}</span></div>
            <div className="work-scene-wrap">
              <button className="work-screenshot-button" type="button" onClick={openViewer} aria-label={`Enlarge ${active.client} screenshot`}>
                <img key={active.id} className="work-flat-screenshot" src={active.cover.src} alt={active.coverAlt || ''} width={active.cover.width} height={active.cover.height} />
                <span className="work-screenshot-expand"><Expand size={16} /></span>
              </button>
            </div>
            <div className="work-preview-controls">
              <span>{active.coverCaption}</span>
              <button type="button" onClick={openViewer}><Expand size={13} />Enlarge screenshot</button>
            </div>
          </div>
        </div>

        <div className="workbench-status">
          <span><i /> screenshots / {active.id}</span>
          <span>{String(activeIndex + 1).padStart(2, '0')} / {String(items.length).padStart(2, '0')} · scroll for next</span>
          <a href="#services">Skip to services ↓</a>
        </div>
      </div>

      <dialog className="work-viewer" ref={dialogRef} onClose={() => { document.body.style.overflow = ''; }} onClick={(event) => { if (event.target === event.currentTarget) event.currentTarget.close(); }}>
        <button className="lightbox-close" type="button" onClick={() => dialogRef.current?.close()} aria-label="Close screenshot">×</button>
        <figure>
          <img src={active.cover.src} alt={active.coverAlt || ''} width={active.cover.width} height={active.cover.height} />
          <figcaption>{active.coverCaption}</figcaption>
        </figure>
      </dialog>
    </>
  );
}
