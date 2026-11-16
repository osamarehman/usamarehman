import { lazy, Suspense, useEffect, useRef, useState, type KeyboardEvent } from 'react';
import { ArrowUpRight, Expand } from '../Icons';
import type { WorkItem } from './work-types';

const LazyWorkScene = lazy(() => import('./WorkScene'));

function GenerativePreview({ kind }: { kind: WorkItem['kind'] }) {
  return (
    <div className={`generative-preview preview-${kind}`} aria-hidden="true">
      <div className="preview-orbit"><i /><i /><i /></div>
      <div className="preview-stack"><i /><i /><i /><i /></div>
      <div className="preview-node node-a" />
      <div className="preview-node node-b" />
      <div className="preview-node node-c" />
      <span className="preview-signal" />
    </div>
  );
}

function SceneFallback({ item }: { item: WorkItem }) {
  return (
    <div className="work-scene-fallback">
      {item.cover ? <img src={item.cover.src} alt={item.coverAlt || ''} /> : <GenerativePreview kind={item.kind} />}
    </div>
  );
}

export default function WorkShowcase({ items }: { items: WorkItem[] }) {
  const [activeId, setActiveId] = useState(items[0]?.id || '');
  const [exploded, setExploded] = useState(false);
  const [mounted, setMounted] = useState(false);
  const tabsRef = useRef<HTMLDivElement>(null);
  const activeIndex = Math.max(0, items.findIndex((item) => item.id === activeId));
  const active = items[activeIndex] || items[0];

  useEffect(() => setMounted(true), []);
  useEffect(() => setExploded(false), [activeId]);

  if (!active) return null;

  const selectTab = (index: number) => {
    const next = (index + items.length) % items.length;
    setActiveId(items[next].id);
    tabsRef.current?.querySelectorAll<HTMLButtonElement>('[role="tab"]')[next]?.focus();
  };

  const handleKeys = (event: KeyboardEvent<HTMLButtonElement>, index: number) => {
    if (event.key === 'ArrowRight') { event.preventDefault(); selectTab(index + 1); }
    if (event.key === 'ArrowLeft') { event.preventDefault(); selectTab(index - 1); }
    if (event.key === 'Home') { event.preventDefault(); selectTab(0); }
    if (event.key === 'End') { event.preventDefault(); selectTab(items.length - 1); }
  };

  return (
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
            onClick={() => setActiveId(item.id)}
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
          <div className="work-preview-head"><span>// interactive preview</span><span>{active.client}</span></div>
          <div className="work-scene-wrap">
            {mounted ? (
              <Suspense fallback={<SceneFallback item={active} />}>
                <LazyWorkScene item={active} exploded={exploded} />
              </Suspense>
            ) : <SceneFallback item={active} />}
          </div>
          <div className="work-preview-controls">
            <span>Drag to rotate · Move to inspect</span>
            <button type="button" onClick={() => setExploded((value) => !value)} aria-pressed={exploded}><Expand size={13} />{exploded ? 'Assemble view' : 'Explode view'}</button>
          </div>
        </div>
      </div>

      <div className="workbench-status">
        <span><i /> main / {active.id}</span>
        <span>{String(activeIndex + 1).padStart(2, '0')} / {String(items.length).padStart(2, '0')}</span>
        <a href="#services">Skip to services ↓</a>
      </div>
    </div>
  );
}
