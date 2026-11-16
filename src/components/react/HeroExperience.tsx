import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Float, Line, PresentationControls, RoundedBox, Sparkles, useCursor } from '@react-three/drei';
import { Suspense, useMemo, useRef, useState } from 'react';
import * as THREE from 'three';
import { Expand, Rotate } from '../Icons';
import { useSceneEnvironment, useWebGLSupport } from './useSceneEnvironment';

const ACCENT = '#ff5a1f';
const MODES = ['Build', 'Automate', 'Operate'];
const MODE_CAPTIONS = [
  'Systems shaped around the work.',
  'Data moving without the busywork.',
  'Deployed, watched and kept running.',
];

function DataPacket({ start, end, offset, reduced }: { start: [number, number, number]; end: [number, number, number]; offset: number; reduced: boolean }) {
  const ref = useRef<THREE.Mesh>(null);
  const from = useMemo(() => new THREE.Vector3(...start), [start]);
  const to = useMemo(() => new THREE.Vector3(...end), [end]);
  useFrame(({ clock }) => {
    if (!ref.current) return;
    const progress = reduced ? 0.5 : (clock.elapsedTime * 0.22 + offset) % 1;
    ref.current.position.lerpVectors(from, to, progress);
  });
  return <mesh ref={ref}><sphereGeometry args={[0.055, 12, 12]} /><meshBasicMaterial color={ACCENT} /></mesh>;
}

function Core({ mode, exploded, reduced, theme, onToggle }: { mode: number; exploded: boolean; reduced: boolean; theme: 'light' | 'dark'; onToggle: () => void }) {
  const group = useRef<THREE.Group>(null);
  const rings = useRef<THREE.Group>(null);
  const layerRefs = useRef<(THREE.Group | null)[]>([]);
  const [hovered, setHovered] = useState(false);
  const viewport = useThree((state) => state.viewport);
  useCursor(hovered);

  const nodes: [number, number, number][] = [[-2.25, 1.15, 0], [2.25, 0.85, 0.25], [-2.1, -1.2, 0.3], [2.15, -1.15, -0.25]];
  const targets: [number, number, number][] = [[-0.9, 0.65, 0.65], [0.95, 0.45, 0.65], [-0.95, -0.6, 0.65], [0.95, -0.7, 0.65]];
  const scale = Math.min(1, viewport.width / 6.3);

  useFrame(({ clock, pointer }, delta) => {
    if (group.current) {
      const idle = reduced ? 0 : Math.sin(clock.elapsedTime * 0.25) * 0.08;
      group.current.rotation.y = THREE.MathUtils.damp(group.current.rotation.y, pointer.x * 0.18 + idle + mode * 0.08, 4, delta);
      group.current.rotation.x = THREE.MathUtils.damp(group.current.rotation.x, -pointer.y * 0.1, 4, delta);
    }
    if (rings.current && !reduced) {
      rings.current.rotation.y += delta * (0.055 + mode * 0.025);
      rings.current.rotation.z += delta * 0.025;
    }
    layerRefs.current.forEach((layer, index) => {
      if (!layer) return;
      const base = (index - 2) * 0.42;
      const spread = exploded ? (index - 2) * 0.32 : 0;
      layer.position.y = THREE.MathUtils.damp(layer.position.y, base + spread, 5, delta);
      layer.position.x = THREE.MathUtils.damp(layer.position.x, exploded ? (index - 2) * 0.12 : 0, 5, delta);
      layer.rotation.y = THREE.MathUtils.damp(layer.rotation.y, exploded ? (index - 2) * 0.08 : 0, 5, delta);
    });
  });

  const shell = theme === 'dark' ? '#a7a7ad' : '#74747a';
  const panel = theme === 'dark' ? '#202025' : '#e5e1d8';

  return (
    <PresentationControls global={false} enabled={!reduced} cursor snap speed={1.4} polar={[-0.25, 0.25]} azimuth={[-0.45, 0.45]}>
      <Float enabled={!reduced} speed={1.25} rotationIntensity={0.08} floatIntensity={0.32} floatingRange={[-0.08, 0.08]}>
        <group ref={group} scale={scale} rotation={[0.08, -0.28, 0]}>
          <group ref={rings} rotation={[0.9, 0.2, 0.25]}>
            {[2.25, 2.65, 3.05].map((radius, index) => (
              <mesh key={radius} rotation={[index * 0.35, index * 0.5, 0]}>
                <torusGeometry args={[radius, 0.008, 6, 128]} />
                <meshBasicMaterial color={index === 1 ? ACCENT : shell} transparent opacity={index === 1 ? 0.38 : 0.18} />
              </mesh>
            ))}
          </group>

          <group onClick={(event) => { event.stopPropagation(); onToggle(); }} onPointerOver={(event) => { event.stopPropagation(); setHovered(true); }} onPointerOut={() => setHovered(false)}>
            {Array.from({ length: 5 }).map((_, index) => (
              <group key={index} ref={(layer) => { layerRefs.current[index] = layer; }} position={[0, (index - 2) * 0.42, 0]}>
                <RoundedBox args={[2.2, 0.28, 1.5]} radius={0.075} smoothness={3}>
                  <meshStandardMaterial color={index === 2 && mode === 0 ? ACCENT : panel} metalness={0.72} roughness={0.28} />
                </RoundedBox>
                <mesh position={[0, 0.01, 0.758]}>
                  <boxGeometry args={[1.38, 0.055, 0.018]} />
                  <meshBasicMaterial color={index === mode + 1 ? ACCENT : shell} transparent opacity={index === mode + 1 ? 1 : 0.38} />
                </mesh>
                {[-0.82, -0.66, -0.5].map((x, light) => (
                  <mesh key={x} position={[x, -0.065, 0.762]}>
                    <sphereGeometry args={[0.025, 8, 8]} />
                    <meshBasicMaterial color={light === 0 || index === mode + 1 ? ACCENT : shell} />
                  </mesh>
                ))}
              </group>
            ))}
          </group>

          {nodes.map((position, index) => (
            <group key={index}>
              <Line points={[position, targets[index]]} color={index === mode ? ACCENT : shell} lineWidth={index === mode ? 1.3 : 0.65} transparent opacity={index === mode ? 0.8 : 0.35} />
              <group position={position}>
                <mesh><sphereGeometry args={[0.105, 16, 16]} /><meshStandardMaterial color={index === mode ? ACCENT : panel} metalness={0.65} roughness={0.25} /></mesh>
                <mesh rotation={[Math.PI / 2, 0, 0]}><torusGeometry args={[0.2, 0.009, 6, 40]} /><meshBasicMaterial color={index === mode ? ACCENT : shell} transparent opacity={0.6} /></mesh>
              </group>
              <DataPacket start={position} end={targets[index]} offset={index * 0.24} reduced={reduced} />
            </group>
          ))}
        </group>
      </Float>
    </PresentationControls>
  );
}

export default function HeroExperience() {
  const [mode, setMode] = useState(0);
  const [exploded, setExploded] = useState(false);
  const supported = useWebGLSupport();
  const { ref, active, reduced, theme } = useSceneEnvironment<HTMLDivElement>(supported === true);
  if (supported !== true) return null;

  return (
    <div className="hero-experience" ref={ref}>
      <div className="scene-topline"><span><i />Live operations core</span><span>WebGL / 01</span></div>
      <div className="scene-canvas">
        <Suspense fallback={null}>
          <Canvas dpr={[1, 1.6]} camera={{ position: [0, 0.4, 7.4], fov: 37 }} frameloop={active && !reduced ? 'always' : 'demand'} gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }} aria-label="Interactive 3D operations core. Use the mode and explode buttons for keyboard-accessible controls.">
            <ambientLight intensity={theme === 'dark' ? 1.25 : 1.7} />
            <directionalLight position={[4, 6, 5]} intensity={2.8} color="#fff4e6" />
            <directionalLight position={[-4, -1, 3]} intensity={1.2} color="#b9d2ff" />
            <pointLight position={[0, 0, 3]} intensity={8} color={ACCENT} distance={6} />
            <Core mode={mode} exploded={exploded} reduced={reduced} theme={theme} onToggle={() => setExploded((value) => !value)} />
            <Sparkles count={42} scale={7} size={1.25} speed={reduced ? 0 : 0.18} opacity={0.35} color={ACCENT} />
            <gridHelper args={[11, 22, theme === 'dark' ? '#323238' : '#a7a29a', theme === 'dark' ? '#1c1c20' : '#d3cec5']} position={[0, -2.05, 0]} />
          </Canvas>
        </Suspense>
      </div>
      <div className="scene-mode-switch" role="group" aria-label="Operations core mode">
        {MODES.map((label, index) => <button key={label} type="button" className={mode === index ? 'active' : ''} aria-pressed={mode === index} onClick={() => setMode(index)}><span>0{index + 1}</span>{label}</button>)}
      </div>
      <div className="scene-bottomline">
        <span>{MODE_CAPTIONS[mode]}</span>
        <div><button type="button" onClick={() => setExploded((value) => !value)} aria-pressed={exploded}><Expand size={12} />{exploded ? 'Assemble' : 'Explode'}</button><button type="button" onClick={() => { setMode(0); setExploded(false); }} aria-label="Reset operations core"><Rotate size={12} /></button></div>
      </div>
    </div>
  );
}
