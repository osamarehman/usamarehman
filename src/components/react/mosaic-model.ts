export type Vec3 = [number, number, number];

export interface Rotation {
  x: number;
  y: number;
  z: number;
}

export interface MosaicTile {
  corners: [number, number, number, number];
  normal: Vec3;
  u: number;
  v: number;
}

export interface MosaicMesh {
  points: Vec3[];
  tiles: MosaicTile[];
  uSegments: number;
  vSegments: number;
}

export const MOSAIC_ROTATION: Rotation = { x: 0.65, y: 0.55, z: -0.38 };

const subtract = (a: Vec3, b: Vec3): Vec3 => [a[0] - b[0], a[1] - b[1], a[2] - b[2]];

const surface = (u: number, v: number): Vec3 => {
  const radius = 1.12 + v * Math.cos(u / 2);
  return [radius * Math.cos(u), radius * Math.sin(u), v * Math.sin(u / 2)];
};

const normalAt = (u: number, v: number): Vec3 => {
  const along = subtract(surface(u + 0.001, v), surface(u - 0.001, v));
  const across = subtract(surface(u, v + 0.001), surface(u, v - 0.001));
  const x = along[1] * across[2] - along[2] * across[1];
  const y = along[2] * across[0] - along[0] * across[2];
  const z = along[0] * across[1] - along[1] * across[0];
  const length = Math.hypot(x, y, z) || 1;
  return [x / length, y / length, z / length];
};

export function createMosaic(uSegments = 108, vSegments = 12): MosaicMesh {
  const points: Vec3[] = [];
  const tiles: MosaicTile[] = [];
  for (let u = 0; u <= uSegments; u += 1) {
    for (let v = 0; v <= vSegments; v += 1) {
      points.push(surface((u / uSegments) * Math.PI * 2, (v / vSegments - 0.5) * 0.96));
    }
  }
  for (let u = 0; u < uSegments; u += 1) {
    for (let v = 0; v < vSegments; v += 1) {
      const a = u * (vSegments + 1) + v;
      const b = (u + 1) * (vSegments + 1) + v;
      tiles.push({
        corners: [a, b, b + 1, a + 1],
        normal: normalAt(((u + 0.5) / uSegments) * Math.PI * 2, ((v + 0.5) / vSegments - 0.5) * 0.96),
        u,
        v,
      });
    }
  }
  return { points, tiles, uSegments, vSegments };
}

export function createProjector(rotation: Rotation) {
  const cosX = Math.cos(rotation.x);
  const sinX = Math.sin(rotation.x);
  const cosY = Math.cos(rotation.y);
  const sinY = Math.sin(rotation.y);
  const cosZ = Math.cos(rotation.z);
  const sinZ = Math.sin(rotation.z);
  return ([x, y, z]: Vec3): Vec3 => {
    const zx = x * cosZ - y * sinZ;
    const zy = x * sinZ + y * cosZ;
    const yx = zx * cosY + z * sinY;
    const yz = -zx * sinY + z * cosY;
    return [yx, zy * cosX - yz * sinX, zy * sinX + yz * cosX];
  };
}

export const perspective = (z: number) => 3.8 / (3.8 - z);

export function fitMosaic(points: Vec3[], rotation: Rotation, width: number, height: number) {
  const project = createProjector(rotation);
  const projected = points.map((point) => {
    const [x, y, z] = project(point);
    const depth = perspective(z);
    return [x * depth, y * depth];
  });
  const xs = projected.map(([x]) => x);
  const ys = projected.map(([, y]) => y);
  const minX = Math.min(...xs);
  const maxX = Math.max(...xs);
  const minY = Math.min(...ys);
  const maxY = Math.max(...ys);
  const scale = Math.min(width / (maxX - minX), height / (maxY - minY)) * 0.76;
  return { scale, centerX: width * 0.5 - ((minX + maxX) / 2) * scale, centerY: height * 0.49 - ((minY + maxY) / 2) * scale };
}

export function shadeMosaic(normal: Vec3, depth: number) {
  const light = Math.abs(normal[0] * -0.32 + normal[1] * -0.48 + normal[2] * 0.81);
  const depthLight = Math.max(0, Math.min(1, (depth + 1.6) / 3.2));
  return Math.round(Math.max(46, Math.min(208, 52 + Math.pow(light, 0.9) * 134 + depthLight * 22)));
}
