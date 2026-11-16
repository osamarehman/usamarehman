import { useEffect, useRef, useState, type PointerEvent } from 'react';
import { createMosaic, createProjector, fitMosaic, MOSAIC_ROTATION, perspective, shadeMosaic, type MosaicTile } from './mosaic-model';

interface ScreenPoint {
  x: number;
  y: number;
  z: number;
}

export default function MosaicField() {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const pointerRef = useRef({ x: 0, y: 0, active: false, tiltX: 0, tiltY: 0 });
  const reducedRef = useRef(false);
  const [ready, setReady] = useState(false);
  const [sonarActive, setSonarActive] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    const wrapper = wrapperRef.current;
    const context = canvas?.getContext('2d');
    if (!canvas || !wrapper || !context) return;

    const motionPreference = window.matchMedia('(prefers-reduced-motion: reduce)');
    reducedRef.current = motionPreference.matches;
    let mesh = createMosaic();
    let layout = { ...fitMosaic(mesh.points, MOSAIC_ROTATION, 600, 600), width: 600, height: 600 };
    let screen: ScreenPoint[] = [];
    let faces: { tile: MosaicTile; depth: number }[] = [];
    let frameId = 0;
    let resizeId = 0;
    let disposed = false;
    let visible = true;
    let dark = document.documentElement.dataset.theme !== 'light';
    let accent = getComputedStyle(document.documentElement).getPropertyValue('--accent').trim() || '#ff5a1f';

    const draw = (now: number) => {
      frameId = 0;
      if (disposed || !visible || document.hidden) return;
      const reduced = reducedRef.current;
      const pointer = pointerRef.current;
      const time = reduced ? 0 : now;
      const targetX = pointer.active ? (pointer.x / layout.width - 0.5) * 0.34 : 0;
      const targetY = pointer.active ? (pointer.y / layout.height - 0.5) * 0.26 : 0;
      pointer.tiltX = reduced ? 0 : pointer.tiltX + (targetX - pointer.tiltX) * 0.065;
      pointer.tiltY = reduced ? 0 : pointer.tiltY + (targetY - pointer.tiltY) * 0.065;
      const project = createProjector({
        x: MOSAIC_ROTATION.x + pointer.tiltY + Math.sin(time * 0.00017) * 0.045,
        y: MOSAIC_ROTATION.y + pointer.tiltX + Math.cos(time * 0.00015) * 0.055,
        z: MOSAIC_ROTATION.z + Math.sin(time * 0.00012) * 0.065,
      });

      mesh.points.forEach((point, index) => {
        const [x, y, z] = project(point);
        const depth = perspective(z);
        screen[index].x = layout.centerX + x * layout.scale * depth;
        screen[index].y = layout.centerY + y * layout.scale * depth;
        screen[index].z = z;
      });
      faces.forEach((face) => {
        face.depth = face.tile.corners.reduce((sum, index) => sum + screen[index].z, 0) / 4;
      });
      faces.sort((a, b) => a.depth - b.depth);
      context.clearRect(0, 0, layout.width, layout.height);
      context.lineWidth = 0.55;
      context.strokeStyle = dark ? 'rgba(8, 8, 10, 0.64)' : 'rgba(244, 241, 234, 0.68)';
      const phase = (time * 0.008) % mesh.uSegments;

      for (const face of faces) {
        const { tile } = face;
        const corners = tile.corners.map((index) => screen[index]);
        const centerX = corners.reduce((sum, point) => sum + point.x, 0) / 4;
        const centerY = corners.reduce((sum, point) => sum + point.y, 0) / 4;
        const proximity = pointer.active && !reduced ? Math.exp(-Math.pow(Math.hypot(centerX - pointer.x, centerY - pointer.y) / 95, 2)) : 0;
        const ripple = Math.sin(time * 0.007 - tile.u * 0.35) * proximity * 4;
        const seamDistance = Math.min(Math.abs(tile.u - phase), mesh.uSegments - Math.abs(tile.u - phase));
        const highlighted = seamDistance < 1.4 || (proximity > 0.48 && tile.u % 3 === 0);
        const shade = shadeMosaic(project(tile.normal), face.depth);
        context.globalAlpha = highlighted ? 0.88 : 0.96;
        context.fillStyle = highlighted ? accent : `rgb(${shade}, ${shade}, ${shade})`;
        context.beginPath();
        context.moveTo(corners[0].x, corners[0].y - ripple);
        context.lineTo(corners[1].x, corners[1].y - ripple);
        context.lineTo(corners[2].x, corners[2].y - ripple);
        context.lineTo(corners[3].x, corners[3].y - ripple);
        context.closePath();
        context.fill();
        context.stroke();
      }
      context.globalAlpha = 1;
      if (!reduced) frameId = requestAnimationFrame(draw);
    };

    const start = () => {
      if (!frameId && !disposed) frameId = requestAnimationFrame(draw);
    };
    const resize = () => {
      cancelAnimationFrame(resizeId);
      resizeId = requestAnimationFrame(() => {
        const rect = canvas.getBoundingClientRect();
        const width = Math.max(280, Math.round(rect.width));
        const height = Math.max(340, Math.round(rect.height));
        const dpr = Math.min(window.devicePixelRatio || 1, 2);
        canvas.width = Math.round(width * dpr);
        canvas.height = Math.round(height * dpr);
        context.setTransform(dpr, 0, 0, dpr, 0, 0);
        mesh = createMosaic(width < 480 ? 84 : 108, width < 480 ? 10 : 12);
        layout = { ...fitMosaic(mesh.points, MOSAIC_ROTATION, width, height), width, height };
        screen = mesh.points.map(() => ({ x: 0, y: 0, z: 0 }));
        faces = mesh.tiles.map((tile) => ({ tile, depth: 0 }));
        setReady(true);
        start();
      });
    };
    const motionChange = () => {
      reducedRef.current = motionPreference.matches;
      pointerRef.current.active = false;
      cancelAnimationFrame(frameId);
      frameId = 0;
      start();
    };
    const visibility = () => { if (!document.hidden) start(); };
    const themeObserver = new MutationObserver(() => {
      dark = document.documentElement.dataset.theme !== 'light';
      accent = getComputedStyle(document.documentElement).getPropertyValue('--accent').trim() || '#ff5a1f';
      start();
    });
    const intersection = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      if (visible) start();
    }, { rootMargin: '100px' });
    const resizeObserver = new ResizeObserver(resize);
    const parallax = () => {
      if (reducedRef.current) {
        canvas.style.transform = '';
        return;
      }
      const offset = Math.max(-24, Math.min(24, -wrapper.getBoundingClientRect().top * 0.035));
      canvas.style.transform = `translateY(${offset.toFixed(2)}px)`;
    };

    intersection.observe(wrapper);
    resizeObserver.observe(canvas);
    themeObserver.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });
    motionPreference.addEventListener('change', motionChange);
    document.addEventListener('visibilitychange', visibility);
    window.addEventListener('scroll', parallax, { passive: true });
    resize();
    parallax();

    return () => {
      disposed = true;
      cancelAnimationFrame(frameId);
      cancelAnimationFrame(resizeId);
      intersection.disconnect();
      resizeObserver.disconnect();
      themeObserver.disconnect();
      motionPreference.removeEventListener('change', motionChange);
      document.removeEventListener('visibilitychange', visibility);
      window.removeEventListener('scroll', parallax);
    };
  }, []);

  const movePointer = (event: PointerEvent<HTMLDivElement>) => {
    if (reducedRef.current || (event.target as HTMLElement).closest('.mosaic-sonar-toggle')) return;
    const rect = canvasRef.current?.getBoundingClientRect();
    if (!rect) return;
    pointerRef.current.x = event.clientX - rect.left;
    pointerRef.current.y = event.clientY - rect.top;
    pointerRef.current.active = true;
    setSonarActive(true);
  };

  return (
    <div className={`mosaic-field ${ready ? 'is-ready' : ''} ${sonarActive ? 'is-sonar' : ''}`} ref={wrapperRef} onPointerMove={movePointer} onPointerDown={(event) => { if (event.pointerType === 'touch') setSonarActive(true); else setSonarActive((value) => !value); }} onPointerLeave={() => { pointerRef.current.active = false; setSonarActive(false); }}>
      <div className="mosaic-diagram" aria-hidden="true">
        <svg viewBox="0 0 640 600" fill="none">
          <g>
            <ellipse className="orbit-line" cx="320" cy="273" rx="249" ry="181" transform="rotate(-18 320 273)" />
            <ellipse className="orbit-line orbit-secondary" cx="320" cy="273" rx="230" ry="213" transform="rotate(24 320 273)" />
            <ellipse className="orbit-line mosaic-dial" cx="320" cy="273" rx="260" ry="207" />
            <path className="orbit-line orbit-accent" d="M85 356C178 471 435 482 554 331" />
            <path className="orbit-line orbit-trace" d="M91 227C201 117 452 112 559 251" />
          </g>
          <g className="mosaic-crosshair"><path d="M520 187v18M511 196h18" /><circle cx="520" cy="196" r="11" /></g>
          <circle className="mosaic-node" cx="520" cy="196" r="2.5" />
          <path className="orbit-line" d="M532 196h48M77 368H42v36" />
          <text className="diagram-label" x="43" y="100">CONTINUOUS / BY DESIGN</text>
          <text className="diagram-coordinate" x="580" y="193">01</text>
          <text className="diagram-coordinate" x="42" y="425">SYSTEMS / IN MOTION</text>
          <path className="orbit-line orbit-secondary" d="M126 545h388M320 534v22" />
        </svg>
      </div>
      <div className="mosaic-canvas"><canvas ref={canvasRef} role="img" aria-label="An abstract mosaic ribbon made of individual geometric tiles. Move the pointer to tilt the sculpture and create a ripple." /></div>
      <div className="mosaic-waves" aria-hidden="true"><i /><i /><i /></div>
      <div className="mosaic-caption"><span>fig. 01 · built for the moving parts</span><button className="mosaic-sonar-toggle" type="button" aria-pressed={sonarActive} onPointerDown={(event) => event.stopPropagation()} onClick={(event) => { event.stopPropagation(); setSonarActive((value) => !value); }}>sonar: {sonarActive ? 'on' : 'off'}</button></div>
    </div>
  );
}
