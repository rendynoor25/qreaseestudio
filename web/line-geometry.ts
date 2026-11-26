export type Point = [number, number, number];
export type XY = [number, number];

export interface LineObject {
  shape: string;
  x: number;
  y: number;
  z: number;
  width: number;
  depth: number;
  height: number;
  rotation: number;
  container?: { id: string } | null;
}

const precision = 100_000;
const key = (point: Point): string => point.slice(0, 2).map(value => Math.round(value * precision)).join(':');
const cross = (a: XY, b: XY, c: XY): number =>
  (b[0] - a[0]) * (c[1] - a[1]) - (b[1] - a[1]) * (c[0] - a[0]);

export function axisSnap(
  start: Point,
  pointer: XY,
  project: (point: Point) => readonly number[],
  step = .25,
  tolerance = 12
): { world: Point; label: string } | null {
  const origin = project(start);
  if (!Number.isFinite(origin[0]) || !Number.isFinite(origin[1])) return null;
  let best: { world: Point; label: string; distance: number } | null = null;
  for (let axis = 0; axis < 3; axis++) {
    const unit: Point = [...start];
    unit[axis] += 1;
    const tip = project(unit);
    if (!Number.isFinite(tip[0]) || !Number.isFinite(tip[1])) continue;
    const dx = tip[0] - origin[0], dy = tip[1] - origin[1];
    const size = Math.hypot(dx, dy);
    if (size < 3) continue;
    const offsetX = pointer[0] - origin[0], offsetY = pointer[1] - origin[1];
    const distance = Math.abs(offsetX * dy - offsetY * dx) / size;
    if (distance > tolerance || (best && distance >= best.distance)) continue;
    const coordinate = Math.abs(dx) >= Math.abs(dy) ? 0 : 1;
    const first = origin[coordinate], second = tip[coordinate], observed = pointer[coordinate];
    const w0 = origin[3] ?? 1, w1 = tip[3] ?? 1;
    const denominator = second * w1 - first * w0 - observed * (w1 - w0);
    const raw = Math.abs(denominator) > 1e-9
      ? w0 * (observed - first) / denominator
      : (offsetX * dx + offsetY * dy) / (size * size);
    if (!Number.isFinite(raw) || Math.abs(raw) > 10_000) continue;
    const length = Math.round(raw / step) * step;
    if (Math.abs(length) < .001) continue;
    const world: Point = [...start];
    world[axis] += length;
    best = { world, label: 'Sumbu ' + 'XYZ'[axis], distance };
  }
  return best && { world: best.world, label: best.label };
}

function endpoints(line: LineObject): [Point, Point] {
  const angle = line.rotation * Math.PI / 180;
  const cos = Math.cos(angle), sin = Math.sin(angle);
  const dx = line.width * cos - line.depth * sin;
  const dy = line.width * sin + line.depth * cos;
  return [
    [line.x - dx / 2, line.y - dy / 2, line.z],
    [line.x + dx / 2, line.y + dy / 2, line.z + line.height]
  ];
}

export function triangulate(points: readonly XY[]): [number, number, number][] {
  const remaining = points.map((_, index) => index);
  const triangles: [number, number, number][] = [];
  while (remaining.length >= 3) {
    const length = remaining.length;
    let ear = -1;
    for (let i = 0; i < length; i++) {
      const a = remaining[(i + length - 1) % length], b = remaining[i], c = remaining[(i + 1) % length];
      if (cross(points[a], points[b], points[c]) <= 1e-12) continue;
      const blocked = remaining.some(other => other !== a && other !== b && other !== c &&
        cross(points[a], points[b], points[other]) >= -1e-12 &&
        cross(points[b], points[c], points[other]) >= -1e-12 &&
        cross(points[c], points[a], points[other]) >= -1e-12);
      if (!blocked) { ear = i; triangles.push([a, b, c]); break; }
    }
    if (ear < 0) return [];
    remaining.splice(ear, 1);
  }
  return triangles;
}

export function closedLoop(existing: readonly LineObject[], edge: LineObject): Point[] | null {
  if (edge.shape !== 'line' || Math.abs(edge.height) > 1e-5) return null;
  const [a, b] = endpoints(edge);
  const start = key(b), goal = key(a);
  if (start === goal) return null;
  const adjacency = new Map<string, Set<string>>();
  const points = new Map<string, Point>();
  for (const line of existing) {
    if (line.shape !== 'line' || Math.abs(line.height) > 1e-5 ||
        Math.abs(line.z - edge.z) > 1e-5 ||
        (line.container?.id ?? null) !== (edge.container?.id ?? null)) continue;
    const [first, second] = endpoints(line);
    const u = key(first), v = key(second);
    if (u === v) continue;
    points.set(u, first); points.set(v, second);
    if (!adjacency.has(u)) adjacency.set(u, new Set());
    if (!adjacency.has(v)) adjacency.set(v, new Set());
    adjacency.get(u)!.add(v); adjacency.get(v)!.add(u);
  }
  const queue = [start], previous = new Map<string, string | null>([[start, null]]);
  for (let i = 0; i < queue.length && !previous.has(goal); i++) {
    for (const next of adjacency.get(queue[i]) ?? []) {
      if (previous.has(next)) continue;
      previous.set(next, queue[i]); queue.push(next);
    }
  }
  if (!previous.has(goal)) return null;
  const path: Point[] = [];
  for (let node: string | null = goal; node !== null; node = previous.get(node) ?? null) {
    path.push(points.get(node) ?? (node === start ? b : a));
  }
  path.reverse();
  const loop = [a, ...path.slice(0, -1)];
  return loop.length >= 3 ? loop : null;
}

export function polygonFromLoop(loop: readonly Point[]): {
  x: number; y: number; z: number; width: number; depth: number;
  profile: { points: XY[]; inferred: true };
} | null {
  const ring = loop.map(point => [point[0], point[1]] as XY);
  if (ring.length < 3 || ring.length > 250) return null;
  const area = ring.reduce((sum, point, i) => sum +
    point[0] * ring[(i + 1) % ring.length][1] - ring[(i + 1) % ring.length][0] * point[1], 0);
  if (Math.abs(area) < 1e-8) return null;
  if (area < 0) ring.reverse();
  for (let i = ring.length - 1; i >= 0 && ring.length > 3; i--) {
    const length = ring.length;
    if (Math.abs(cross(ring[(i + length - 1) % length], ring[i], ring[(i + 1) % length])) < 1e-8)
      ring.splice(i, 1);
  }
  if (triangulate(ring).length !== ring.length - 2) return null;
  const minX = Math.min(...ring.map(point => point[0])), maxX = Math.max(...ring.map(point => point[0]));
  const minY = Math.min(...ring.map(point => point[1])), maxY = Math.max(...ring.map(point => point[1]));
  const width = maxX - minX, depth = maxY - minY;
  if (width < .001 || depth < .001) return null;
  const x = (minX + maxX) / 2, y = (minY + maxY) / 2;
  return { x, y, z: loop[0][2], width, depth,
    profile: { points: ring.map(point => [(point[0] - x) / width, (point[1] - y) / depth]), inferred: true } };
}
