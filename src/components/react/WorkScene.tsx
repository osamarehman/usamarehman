import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Float, Line, PresentationControls, RoundedBox, Sparkles, useTexture } from '@react-three/drei';
import { Suspense, useEffect, useMemo, useRef } from 'react';
import * as THREE from 'three';
import type { WorkItem } from './work-types';
import { useSceneEnvironment, useWebGLSupport } from './useSceneEnvironment';

const ACCENT = '#ff5a1f';

function ScreenModel({ item, exploded, reduced, theme }: { item: WorkItem; exploded: boolean; reduced: boolean; theme: 'light' | 'dark' }) {
  const group = useRef<THREE.Group>(null);
  const screen = useRef<THREE.Group>(null);
  const glass = useRef<THREE.Mesh>(null);
  const texture = useTexture(item.cover!.src);
  const viewport = useThree((state) => state.viewport);
  const aspect = item.cover!.width / item.cover!.height;
  const width = 4.35;
  const height = width / aspect;
  const scale = Math.min(1, viewport.width / 5.9);
  const nodes = useMemo(() => [[-2.55, 1.25, 0.3], [2.5, 1.05, 0.15], [2.4, -1.15, 0.25]] as [number, number, number][], []);

  useEffect(() => {
    texture.colorSpace = THREE.SRGBColorSpace;
    texture.anisotropy = 8;
    texture.needsUpdate = true;
  }, [texture]);

  useFrame(({ clock }, delta) => {
    if (screen.current) screen.current.position.z = THREE.MathUtils.damp(screen.current.position.z, exploded ? 0.75 : 0.08, 5, delta);
    if (glass.current) glass.current.position.z = THREE.MathUtils.damp(glass.current.position.z, exploded ? 1.45 : 0.12, 5, delta);
    if (group.current && !reduced) group.current.position.y = Math.sin(clock.elapsedTime * 0.65) * 0.06;
  });

  return (
    <PresentationControls global={false} enabled={!reduced} cursor snap speed={1.5} polar={[-0.18, 0.18]} azimuth={[-0.35, 0.35]}>
      <Float enabled={!reduced} speed={1.1} rotationIntensity={0.04} floatIntensity={0.18}>
        <group ref={group} scale={scale} rotation={[0.035, -0.12, 0]}>
          <RoundedBox args={[width + 0.24, height + 0.24, 0.16]} radius={0.09} smoothness={3} position={[0, 0, exploded ? -0.55 : -0.04]}>
            <meshStandardMaterial color={theme === 'dark' ? '#25252b' : '#c9c5bd'} metalness={0.75} roughness={0.25} />
          </RoundedBox>
          <group ref={screen} position={[0, 0, 0.08]}>
            <mesh><planeGeometry args={[width, height]} /><meshBasicMaterial map={texture} toneMapped={false} /></mesh>
          </group>
          <mesh ref={glass} position={[0, 0, 0.12]}>
            <planeGeometry args={[width, height]} />
            <meshPhysicalMaterial color="#ffffff" transparent opacity={0.055} roughness={0.05} metalness={0.1} />
          </mesh>
          <mesh position={[0, -height / 2 - 0.55, -0.35]} rotation={[Math.PI / 2, 0, 0]}><cylinderGeometry args={[0.06, 0.09, 0.85, 16]} /><meshStandardMaterial color="#77777e" metalness={0.8} roughness={0.25} /></mesh>
          <RoundedBox args={[1.55, 0.08, 0.75]} radius={0.04} position={[0, -height / 2 - 1, -0.35]}><meshStandardMaterial color="#55555b" metalness={0.8} roughness={0.25} /></RoundedBox>
          {nodes.map((position, index) => (
            <group key={index} position={exploded ? [position[0] * 1.18, position[1] * 1.18, position[2] + 0.7] : position}>
              <Line points={[[0, 0, 0], [-position[0] * 0.45, -position[1] * 0.45, -0.2]]} color={index === 0 ? ACCENT : '#77777e'} lineWidth={0.7} transparent opacity={0.5} />
              <mesh><sphereGeometry args={[0.07, 12, 12]} /><meshBasicMaterial color={index === 0 ? ACCENT : '#929298'} /></mesh>
              <mesh rotation={[Math.PI / 2, 0, 0]}><torusGeometry args={[0.15, 0.008, 6, 32]} /><meshBasicMaterial color={index === 0 ? ACCENT : '#77777e'} transparent opacity={0.55} /></mesh>
            </group>
          ))}
        </group>
      </Float>
    </PresentationControls>
  );
}

function AbstractModel({ item, exploded, reduced, theme }: { item: WorkItem; exploded: boolean; reduced: boolean; theme: 'light' | 'dark' }) {
  const group = useRef<THREE.Group>(null);
  const viewport = useThree((state) => state.viewport);
  const scale = Math.min(1, viewport.width / 5.8);
  const nodePositions: [number, number, number][] = [[-2.1, 1.2, 0], [2.1, 1.1, 0.2], [-2.1, -1.1, 0.2], [2.1, -1.2, 0]];

  useFrame(({ clock }, delta) => {
    if (!group.current) return;
    const target = exploded ? (item.kind === 'migration' ? -0.4 : 0.4) : 0;
    group.current.rotation.y = THREE.MathUtils.damp(group.current.rotation.y, target + (reduced ? 0 : Math.sin(clock.elapsedTime * 0.3) * 0.12), 3, delta);
  });

  return (
    <PresentationControls global={false} enabled={!reduced} cursor snap speed={1.5} polar={[-0.25, 0.25]} azimuth={[-0.5, 0.5]}>
      <Float enabled={!reduced} speed={1.2} rotationIntensity={0.08} floatIntensity={0.25}>
        <group ref={group} scale={scale} rotation={[0.12, -0.25, 0]}>
          {Array.from({ length: 4 }).map((_, index) => (
            <group key={index} position={[exploded ? (index - 1.5) * 0.2 : 0, (index - 1.5) * (exploded ? 0.75 : 0.42), exploded ? (index - 1.5) * 0.28 : 0]}>
              <RoundedBox args={[2.25, 0.25, 1.45]} radius={0.07} smoothness={3}><meshStandardMaterial color={index === 1 ? ACCENT : theme === 'dark' ? '#2b2b31' : '#d9d5cd'} metalness={0.7} roughness={0.28} /></RoundedBox>
              <mesh position={[0, 0, 0.735]}><boxGeometry args={[1.35, 0.055, 0.018]} /><meshBasicMaterial color={index === 1 ? '#ffffff' : ACCENT} transparent opacity={0.75} /></mesh>
            </group>
          ))}
          {nodePositions.map((position, index) => (
            <group key={index}>
              <Line points={[position, [Math.sign(position[0]) * 0.85, position[1] * 0.55, 0.5]]} color={index === 0 ? ACCENT : '#77777e'} lineWidth={index === 0 ? 1.2 : 0.65} transparent opacity={0.5} />
              <mesh position={position}><sphereGeometry args={[0.095, 16, 16]} /><meshStandardMaterial color={index === 0 ? ACCENT : '#96969d'} metalness={0.7} roughness={0.25} /></mesh>
              <mesh position={position} rotation={[Math.PI / 2, 0, 0]}><torusGeometry args={[0.19, 0.008, 6, 36]} /><meshBasicMaterial color={index === 0 ? ACCENT : '#77777e'} transparent opacity={0.55} /></mesh>
            </group>
          ))}
          <mesh rotation={[0.85, 0.15, 0.2]}><torusGeometry args={[2.75, 0.009, 6, 128]} /><meshBasicMaterial color={ACCENT} transparent opacity={0.35} /></mesh>
        </group>
      </Float>
    </PresentationControls>
  );
}

export default function WorkScene({ item, exploded }: { item: WorkItem; exploded: boolean }) {
  const supported = useWebGLSupport();
  const { ref, active, reduced, theme } = useSceneEnvironment<HTMLDivElement>(supported === true);

  if (supported === null) return <div className="work-scene-fallback">{item.cover && <img src={item.cover.src} alt={item.coverAlt || ''} />}</div>;
  if (!supported) return <div className="work-scene-fallback">{item.cover ? <img src={item.cover.src} alt={item.coverAlt || ''} /> : <div className="webgl-static">System diagram · WebGL unavailable</div>}</div>;

  return (
    <div className="work-webgl" ref={ref}>
      <Canvas dpr={[1, 1.5]} camera={{ position: [0, 0.25, 7], fov: 37 }} frameloop={active && !reduced ? 'always' : 'demand'} gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }} aria-label={`Interactive 3D preview of ${item.client}`}>
        <ambientLight intensity={1.45} />
        <directionalLight position={[4, 5, 6]} intensity={2.4} color="#fff3e5" />
        <directionalLight position={[-4, 0, 4]} intensity={1} color="#c5d8ff" />
        <pointLight position={[0, 0, 4]} intensity={5} color={ACCENT} distance={7} />
        <Suspense fallback={null}>
          {item.cover ? <ScreenModel item={item} exploded={exploded} reduced={reduced} theme={theme} /> : <AbstractModel item={item} exploded={exploded} reduced={reduced} theme={theme} />}
        </Suspense>
        <Sparkles count={30} scale={7} size={1} speed={reduced ? 0 : 0.15} opacity={0.25} color={ACCENT} />
        <gridHelper args={[10, 20, theme === 'dark' ? '#2d2d33' : '#aaa59d', theme === 'dark' ? '#19191d' : '#d2cdc4']} position={[0, -2.35, 0]} />
      </Canvas>
    </div>
  );
}
