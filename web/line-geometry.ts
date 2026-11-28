import { intersection as intersectPolygons, difference as differencePolygons } from 'polygon-clipping';
import earcut from 'earcut';

export type Point = [number, number, number];
export type XY = [number, number];

export function verticalWall(vertices: readonly Point[]): { origin: Point; axis: XY; normal: XY } | null {
  if (vertices.length < 3) return null;
  const origin = vertices[0];
  for (let i = 1; i < vertices.length - 1; i++) {
    const a = vertices[i].map((value, index) => value - origin[index]);
    const b = vertices[i + 1].map((value, index) => value - origin[index]);
    const normal: Point = [a[1] * b[2] - a[2] * b[1],
      a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]];
    const length = Math.hypot(...normal);
    if (length < 1e-8) continue;
    if (Math.abs(normal[2]) > length * .05) return null;
    const horizontal: XY = [normal[0] / length, normal[1] / length];
    return { origin, axis: [-horizontal[1], horizontal[0]], normal: horizontal };
  }
  return null;
}

export function verticalRectangle(a: Point, b: Point, axis: XY): {
  x: number; y: number; z: number; width: number; depth: number; wall_axis: XY;
} {
  const along = (b[0] - a[0]) * axis[0] + (b[1] - a[1]) * axis[1];
  return { x: a[0] + axis[0] * along / 2, y: a[1] + axis[1] * along / 2,
    z: (a[2] + b[2]) / 2, width: Math.abs(along), depth: Math.abs(b[2] - a[2]),
    wall_axis: axis };
}

export function measuredEndpoint(a: Point, b: Point, length: number): Point | null {
  const delta = b.map((value, i) => value - a[i]);
  const distance = Math.hypot(...delta);
  if (distance < 1e-9 || !Number.isFinite(length) || length <= 0) return null;
  return a.map((value, i) => value + delta[i] * length / distance) as Point;
}

export function measuredRectangle(a: Point, b: Point, x: number, y: number, wallAxis?: XY): {
  x: number; y: number; z: number; width: number; depth: number; wall_axis?: XY;
} | null {
  if (!(x > 0 && y > 0)) return null;
  if (wallAxis) {
    const along = (b[0] - a[0]) * wallAxis[0] + (b[1] - a[1]) * wallAxis[1];
    const vertical = b[2] - a[2];
    if (Math.abs(along) < 1e-9 || Math.abs(vertical) < 1e-9) return null;
    return { x: a[0] + Math.sign(along) * x * wallAxis[0] / 2,
      y: a[1] + Math.sign(along) * x * wallAxis[1] / 2,
      z: a[2] + Math.sign(vertical) * y / 2,
      width: x, depth: y, wall_axis: wallAxis };
  }
  const dx = b[0] - a[0], dy = b[1] - a[1];
  if (Math.abs(dx) < 1e-9 || Math.abs(dy) < 1e-9) return null;
  return { x: a[0] + Math.sign(dx) * x / 2,
    y: a[1] + Math.sign(dy) * y / 2, z: a[2], width: x, depth: y };
}

export interface RectFace {
  shape: string; x: number; y: number; z: number;
  width: number; depth: number; height: number; rotation: number;
  wall_axis?: XY | null;
}

function frame(face: RectFace): { u: Point; v: Point; n: Point } {
  const angle = face.rotation * Math.PI / 180, cos = Math.cos(angle), sin = Math.sin(angle);
  if (face.wall_axis) {
    const [x, y] = face.wall_axis;
    const u: Point = [x * cos - y * sin, x * sin + y * cos, 0];
    return { u, v: [0, 0, 1], n: [u[1], -u[0], 0] };
  }
  return { u: [cos, sin, 0], v: [-sin, cos, 0], n: [0, 0, 1] };
}

const dot3 = (a: readonly number[], b: readonly number[]): number =>
  a[0] * b[0] + a[1] * b[1] + a[2] * b[2];

export function rectangleInFrame(a: Point, b: Point, face: RectFace,
  dimensions?: { x: number; y: number }): RectFace | null {
  const { u, v } = frame(face);
  const delta = b.map((value, i) => value - a[i]);
  const along = dot3(delta, u), across = dot3(delta, v);
  if (Math.abs(along) < 1e-9 || Math.abs(across) < 1e-9) return null;
  const width = dimensions?.x ?? Math.abs(along), depth = dimensions?.y ?? Math.abs(across);
  const center = a.map((value, i) => value +
    (Math.sign(along) * width * u[i] + Math.sign(across) * depth * v[i]) / 2);
  return { shape: 'rectangle', x: center[0], y: center[1], z: center[2],
    width, depth, height: 0, rotation: face.rotation,
    ...(face.wall_axis ? { wall_axis: face.wall_axis } : {}) };
}

export function splitRectangle(host: RectFace, child: RectFace):
  { x: number; y: number; z: number; width: number; depth: number }[] | null {
  if (host.shape !== 'rectangle' || child.shape !== 'rectangle' ||
      host.height !== 0 || child.height !== 0 ||
      Boolean(host.wall_axis) !== Boolean(child.wall_axis)) return null;
  const outer = frame(host), inner = frame(child);
  if (Math.abs(dot3(outer.u, inner.u)) < 1 - 1e-5 ||
      Math.abs(dot3(outer.v, inner.v)) < 1 - 1e-5) return null;
  const delta = [child.x - host.x, child.y - host.y, child.z - host.z];
  if (Math.abs(dot3(delta, outer.n)) > 1e-4) return null;
  const centerU = dot3(delta, outer.u), centerV = dot3(delta, outer.v);
  const [left, right] = [centerU - child.width / 2, centerU + child.width / 2];
  const [bottom, top] = [centerV - child.depth / 2, centerV + child.depth / 2];
  const w = host.width / 2, d = host.depth / 2;
  const cutLeft = Math.max(-w, left), cutRight = Math.min(w, right);
  const cutBottom = Math.max(-d, bottom), cutTop = Math.min(d, top);
  if (cutRight - cutLeft <= 1e-4 || cutTop - cutBottom <= 1e-4) return null;
  const regions: [number, number, number, number][] = [];
  if (cutLeft > -w + 1e-4) regions.push([-w, cutLeft, -d, d]);
  if (cutRight < w - 1e-4) regions.push([cutRight, w, -d, d]);
  if (cutBottom > -d + 1e-4) regions.push([cutLeft, cutRight, -d, cutBottom]);
  if (cutTop < d - 1e-4) regions.push([cutLeft, cutRight, cutTop, d]);
  return regions.map(([u0, u1, v0, v1]) => {
    const u = (u0 + u1) / 2, v = (v0 + v1) / 2;
    return { x: host.x + u * outer.u[0] + v * outer.v[0],
      y: host.y + u * outer.u[1] + v * outer.v[1],
      z: host.z + u * outer.u[2] + v * outer.v[2],
      width: u1 - u0, depth: v1 - v0 };
  });
}

export function splitRectanglePair(host: RectFace, child: RectFace): {
  host: { x: number; y: number; z: number; width: number; depth: number }[];
  child: { x: number; y: number; z: number; width: number; depth: number }[];
  intersection: { x: number; y: number; z: number; width: number; depth: number };
} | null {
  if (host.shape !== 'rectangle' || child.shape !== 'rectangle' ||
      host.height !== 0 || child.height !== 0 ||
      Boolean(host.wall_axis) !== Boolean(child.wall_axis)) return null;
  const outer = frame(host), inner = frame(child);
  if (Math.abs(dot3(outer.u, inner.u)) < 1 - 1e-5 ||
      Math.abs(dot3(outer.v, inner.v)) < 1 - 1e-5) return null;
  const delta = [child.x - host.x, child.y - host.y, child.z - host.z];
  if (Math.abs(dot3(delta, outer.n)) > 1e-4) return null;
  const centerU = dot3(delta, outer.u), centerV = dot3(delta, outer.v);
  const w = host.width / 2, d = host.depth / 2;
  const cutLeft = Math.max(-w, centerU - child.width / 2);
  const cutRight = Math.min(w, centerU + child.width / 2);
  const cutBottom = Math.max(-d, centerV - child.depth / 2);
  const cutTop = Math.min(d, centerV + child.depth / 2);
  if (cutRight - cutLeft <= 1e-4 || cutTop - cutBottom <= 1e-4) return null;
  const u = (cutLeft + cutRight) / 2, v = (cutBottom + cutTop) / 2;
  const intersection = {
    x: host.x + u * outer.u[0] + v * outer.v[0],
    y: host.y + u * outer.u[1] + v * outer.v[1],
    z: host.z + u * outer.u[2] + v * outer.v[2],
    width: cutRight - cutLeft, depth: cutTop - cutBottom
  };
  const overlap: RectFace = { ...host, ...intersection };
  return {
    host: splitRectangle(host, overlap) ?? [],
    child: splitRectangle(child, overlap) ?? [],
    intersection
  };
}

export function radiusArc(center: Point, direction: Point, radius: number, angleDegrees = 90): Point[] {
  const dx = direction[0] - center[0], dy = direction[1] - center[1];
  const length = Math.hypot(dx, dy);
  if (length < 1e-9 || !(radius > 0) || !(Math.abs(angleDegrees) > 0 && Math.abs(angleDegrees) <= 360)) return [];
  const start = Math.atan2(dy, dx), sweep = angleDegrees * Math.PI / 180;
  const count = Math.max(8, Math.ceil(Math.abs(sweep) * 16));
  return Array.from({ length: count + 1 }, (_, i) => {
    const angle = start + sweep * i / count;
    return [center[0] + radius * Math.cos(angle), center[1] + radius * Math.sin(angle), center[2]];
  });
}

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
  solid_id?: string | null;
}

const precision = 100_000;
const key = (point: Point): string => point.map(value => Math.round(value * precision)).join(':');
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

const difference3 = (a: Point, b: Point): Point =>
  [a[0]-b[0],a[1]-b[1],a[2]-b[2]];
const along3 = (a: Point, direction: Point, t: number): Point =>
  [a[0]+direction[0]*t,a[1]+direction[1]*t,a[2]+direction[2]*t];

function crossings(first: LineObject, second: LineObject): [number,number][] {
  const [a,b]=endpoints(first),[c,d]=endpoints(second);
  const u=difference3(b,a),v=difference3(d,c),w=difference3(c,a);
  const aa=dot3(u,u),bb=dot3(u,v),cc=dot3(v,v),denominator=aa*cc-bb*bb;
  if (aa<1e-10 || cc<1e-10) return [];
  if (denominator>1e-10*aa*cc) {
    const t=(dot3(w,u)*cc-dot3(w,v)*bb)/denominator;
    const s=(dot3(w,u)*bb-dot3(w,v)*aa)/denominator;
    return t>=-1e-6 && t<=1+1e-6 && s>=-1e-6 && s<=1+1e-6 &&
      Math.hypot(...difference3(along3(a,u,t),along3(c,v,s)))<1e-5?[[t,s]]:[];
  }
  const projected=(point:Point,start:Point,direction:Point,length:number)=>
    dot3(difference3(point,start),direction)/length;
  if (Math.hypot(...difference3(along3(a,u,projected(c,a,u,aa)),c))>1e-5) return [];
  const pairs: [number,number][]=[];
  for (const [point,t] of [[a,0],[b,1]] as [Point,number][]) {
    const s=projected(point,c,v,cc);
    if(s>=-1e-6&&s<=1+1e-6) pairs.push([t,s]);
  }
  for (const [point,s] of [[c,0],[d,1]] as [Point,number][]) {
    const t=projected(point,a,u,aa);
    if(t>=-1e-6&&t<=1+1e-6) pairs.push([t,s]);
  }
  return pairs;
}

export function splitCrossingLines<T extends LineObject & {id:string}>(
  existing: readonly T[],incoming:T,newId:()=>string): {before:T[];after:T[]} {
  const scope=incoming.container?.id??null;
  const sources=existing.filter(line=>line.shape==='line'&&!line.solid_id&&
    (line.container?.id??null)===scope);
  const fractions=new Map<T,number[]>([[incoming,[0,1]]]);
  for(const line of sources) {
    const pairs=crossings(incoming,line);
    if(!pairs.length) continue;
    const cuts=fractions.get(line)??[0,1];
    for(const [t,s] of pairs){fractions.get(incoming)!.push(t);cuts.push(s);}
    fractions.set(line,cuts);
  }
  const before:T[]=[],after:T[]=[];
  for(const [line,cuts] of fractions) {
    const ordered=[...new Set(cuts.filter(t=>t>=-1e-6&&t<=1+1e-6)
      .map(t=>Math.max(0,Math.min(1,t)).toFixed(8)))].map(Number).sort((a,b)=>a-b);
    if(ordered.length<=2) {if(line===incoming) after.push(line);continue;}
    const [start,end]=endpoints(line),direction=difference3(end,start);
    const pieces=ordered.slice(0,-1).map((t,index)=>{
      const a=along3(start,direction,t),b=along3(start,direction,ordered[index+1]);
      return {...line,id:index?newId():line.id,rotation:0,
        x:(a[0]+b[0])/2,y:(a[1]+b[1])/2,z:a[2],
        width:b[0]-a[0],depth:b[1]-a[1],height:b[2]-a[2]} as T;
    }).filter(part=>Math.hypot(part.width,part.depth,part.height)>.001);
    if(line!==incoming) before.push(line);
    after.push(...pieces);
  }
  const unique=new Map<string,T>();
  for(const piece of after) {
    const [start,end]=endpoints(piece);
    const identity=[key(start),key(end)].sort().join('|');
    if(!unique.has(identity)) unique.set(identity,piece);
  }
  return {before,after:[...unique.values()]};
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

/** Triangulate a ring with optional inner holes; all points are in one plane. */
export function triangulateWithHoles(
  outer: readonly XY[],
  holes: readonly (readonly XY[])[] = []
): [number, number, number][] {
  const data: number[] = [];
  const holeIndices: number[] = [];
  for (const point of outer) data.push(point[0], point[1]);
  for (const hole of holes) {
    if (hole.length < 3) continue;
    holeIndices.push(data.length / 2);
    for (const point of hole) data.push(point[0], point[1]);
  }
  const indices = earcut(data, holeIndices, 2);
  const triangles: [number, number, number][] = [];
  for (let i = 0; i + 2 < indices.length; i += 3)
    triangles.push([indices[i], indices[i + 1], indices[i + 2]]);
  return triangles;
}

export function closedLoop(existing: readonly LineObject[], edge: LineObject): Point[] | null {
  if (edge.shape !== 'line' || edge.solid_id) return null;
  const [a, b] = endpoints(edge);
  const start = key(b), goal = key(a);
  if (start === goal) return null;
  const adjacency = new Map<string, Set<string>>();
  const points = new Map<string, Point>();
  for (const line of existing) {
    if (line.shape !== 'line' || line.solid_id ||
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
  plane_u?: Point; plane_v?: Point;
  profile: { points: XY[]; inferred: true };
} | null {
  const horizontal=loop.every(point=>Math.abs(point[2]-loop[0][2])<1e-5);
  let basisU:Point|undefined,basisV:Point|undefined;
  if (!horizontal) {
    const origin=loop[0];
    const first=loop.find(point=>Math.hypot(...difference3(point,origin))>1e-5);
    if(!first)return null;
    const direction=difference3(first,origin),length=Math.hypot(...direction);
    basisU=direction.map(value=>value/length) as Point;
    const second=loop.find(point=>{
      const delta=difference3(point,origin),parallel=dot3(delta,basisU!);
      return Math.hypot(...difference3(delta,basisU!.map(value=>value*parallel) as Point))>1e-5;
    });
    if(!second)return null;
    const delta=difference3(second,origin),along=dot3(delta,basisU);
    const transverse=difference3(delta,basisU.map(value=>value*along) as Point);
    const span=Math.hypot(...transverse);
    basisV=transverse.map(value=>value/span) as Point;
    const normal:Point=[basisU[1]*basisV[2]-basisU[2]*basisV[1],
      basisU[2]*basisV[0]-basisU[0]*basisV[2],basisU[0]*basisV[1]-basisU[1]*basisV[0]];
    if(loop.some(point=>Math.abs(dot3(difference3(point,origin),normal))>1e-5))return null;
  }
  const ring = loop.map(point => horizontal?[point[0],point[1]] as XY:
    [dot3(difference3(point,loop[0]),basisU!),dot3(difference3(point,loop[0]),basisV!)] as XY);
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
  return { x:horizontal?x:loop[0][0]+x*basisU![0]+y*basisV![0],
    y:horizontal?y:loop[0][1]+x*basisU![1]+y*basisV![1],
    z:horizontal?loop[0][2]:loop[0][2]+x*basisU![2]+y*basisV![2],width,depth,
    ...(horizontal?{}:{plane_u:basisU!,plane_v:basisV!}),
    profile: { points: ring.map(point => [(point[0] - x) / width, (point[1] - y) / depth]), inferred: true } };
}

export function splitOverlappingLoops(first: readonly Point[], second: readonly Point[]):
  { first: Point[][]; second: Point[][]; intersection: Point[][] } | null {
  if (first.length < 3 || second.length < 3) return null;
  const horizontal = [...first, ...second].every(point =>
    Math.abs(point[2] - first[0][2]) < 1e-5);
  let u: Point, v: Point, origin: Point;
  if (horizontal) {
    u = [1,0,0]; v = [0,1,0]; origin = [0,0,first[0][2]];
  } else {
    origin = first[0];
    const direction = first.find(point => Math.hypot(...difference3(point,origin)) > 1e-5);
    if (!direction) return null;
    const delta = difference3(direction,origin), length = Math.hypot(...delta);
    u = delta.map(value => value/length) as Point;
    const secondPoint = first.find(point => {
      const offset = difference3(point,origin), along = dot3(offset,u);
      return Math.hypot(...difference3(offset,u.map(value => value*along) as Point)) > 1e-5;
    });
    if (!secondPoint) return null;
    const offset = difference3(secondPoint,origin), along = dot3(offset,u);
    const transverse = difference3(offset,u.map(value => value*along) as Point);
    const span = Math.hypot(...transverse);
    v = transverse.map(value => value/span) as Point;
    const normal = cross3(u,v);
    if ([...first,...second].some(point =>
      Math.abs(dot3(difference3(point,origin),normal)) > 1e-5)) return null;
  }
  const project = (loop: readonly Point[]): XY[] => loop.map(point => {
    const delta = difference3(point,origin);
    return [dot3(delta,u),dot3(delta,v)] as XY;
  });
  const unproject = (ring: readonly [number,number][]): Point[] => {
    const cleaned = ring.length > 1 &&
      Math.abs(ring[0][0]-ring[ring.length-1][0]) < 1e-9 &&
      Math.abs(ring[0][1]-ring[ring.length-1][1]) < 1e-9
      ? ring.slice(0,-1) : ring;
    return cleaned.map(point => /** @type {Point} */ ([
      origin[0]+point[0]*u[0]+point[1]*v[0],
      origin[1]+point[0]*u[1]+point[1]*v[1],
      origin[2]+point[0]*u[2]+point[1]*v[2]
    ]));
  };
  const toLoops = (multi: [number,number][][][]): Point[][] | null => {
    const loops: Point[][] = [];
    for (const polygon of multi) {
      if (polygon.length !== 1) return null;
      const loop = unproject(polygon[0]);
      if (loop.length < 3) continue;
      const area = loop.reduce((sum, point, index) => {
        const next = loop[(index+1)%loop.length];
        return sum + point[0]*next[1]-next[0]*point[1];
      },0);
      if (Math.abs(area) > 1e-8) loops.push(loop);
    }
    return loops;
  };
  const ringA = project(first), ringB = project(second);
  const firstOnly = toLoops(differencePolygons([ringA],[ringB]));
  const secondOnly = toLoops(differencePolygons([ringB],[ringA]));
  const common = toLoops(intersectPolygons([ringA],[ringB]));
  if (!firstOnly || !secondOnly || !common || !common.length) return null;
  return {first:firstOnly,second:secondOnly,intersection:common};
}

export type Box = { left: number; top: number; right: number; bottom: number };

const insideBox = (point: readonly number[], box: Box): boolean =>
  point[0] >= box.left && point[0] <= box.right &&
  point[1] >= box.top && point[1] <= box.bottom;

function segmentCrossesBox(a: readonly number[], b: readonly number[], box: Box): boolean {
  if (insideBox(a, box) || insideBox(b, box)) return true;
  const dx = b[0] - a[0], dy = b[1] - a[1];
  let low = 0, high = 1;
  for (const [p, q] of [
    [-dx, a[0] - box.left], [dx, box.right - a[0]],
    [-dy, a[1] - box.top], [dy, box.bottom - a[1]]
  ]) {
    if (Math.abs(p) < 1e-12) { if (q < 0) return false; }
    else {
      const t = q / p;
      if (p < 0) low = Math.max(low, t);
      else high = Math.min(high, t);
      if (low > high) return false;
    }
  }
  return true;
}

function pointInPolygon(point: readonly number[], polygon: readonly (readonly number[])[]): boolean {
  let inside = false;
  for (let i = 0, j = polygon.length - 1; i < polygon.length; j = i++) {
    const a = polygon[i], b = polygon[j];
    if ((a[1] > point[1]) !== (b[1] > point[1]) &&
        point[0] < (b[0] - a[0]) * (point[1] - a[1]) / (b[1] - a[1]) + a[0]) inside = !inside;
  }
  return inside;
}

export function boxHitsGeometry(points: readonly (readonly number[])[], box: Box, crossing: boolean): boolean {
  if (!points.length) return false;
  if (!crossing) return points.every(point => insideBox(point, box));
  if (points.some(point => insideBox(point, box))) return true;
  const count = points.length;
  for (let i = 0; i < (count === 2 ? 1 : count); i++) {
    if (segmentCrossesBox(points[i], points[(i + 1) % count], box)) return true;
  }
  return count > 2 && [
    [box.left, box.top], [box.right, box.top],
    [box.right, box.bottom], [box.left, box.bottom]
  ].some(corner => pointInPolygon(corner, points));
}

export function connectedLines(seedId: string, lines: readonly (LineObject & { id: string })[]): string[] {
  const byPoint = new Map<string, Set<string>>();
  for (const line of lines) {
    if (line.shape !== 'line') continue;
    for (const point of endpoints(line)) {
      const vertex = point.map(value => Math.round(value * precision)).join(':');
      if (!byPoint.has(vertex)) byPoint.set(vertex, new Set());
      byPoint.get(vertex)!.add(line.id);
    }
  }
  const seed = lines.find(line => line.id === seedId);
  if (!seed || seed.shape !== 'line') return [];
  const selected = new Set<string>([seedId]), queue = [seedId];
  const byId = new Map(lines.map(line => [line.id, line]));
  for (const id of queue) {
    for (const point of endpoints(byId.get(id)!)) {
      const vertex = point.map(value => Math.round(value * precision)).join(':');
      for (const next of byPoint.get(vertex) ?? []) {
        if (!selected.has(next)) { selected.add(next); queue.push(next); }
      }
    }
  }
  return queue;
}

export interface MeshGeometry { vertices: Point[]; faces: number[][] }

const cross3 = (a: readonly number[], b: readonly number[]): Point =>
  [a[1]*b[2]-a[2]*b[1],a[2]*b[0]-a[0]*b[2],a[0]*b[1]-a[1]*b[0]];
const normalize3 = (a: readonly number[]): Point | null => {
  const length=Math.hypot(a[0],a[1],a[2]);
  return length>1e-9?[a[0]/length,a[1]/length,a[2]/length]:null;
};
const roundKey=(value:number,digits=4):number=>Math.round(value*10**digits)/10**digits;

interface PlaneFace { id: string; points: XY[]; min: XY; max: XY; }

function faceOnPlane(vertices: readonly Point[]): { key: string; points: XY[] } | null {
  if (vertices.length < 3) return null;
  let normal: Point | null = null;
  for (let i = 1; i < vertices.length - 1; i++) {
    normal = normalize3(cross3(
      [vertices[i][0]-vertices[0][0],vertices[i][1]-vertices[0][1],vertices[i][2]-vertices[0][2]],
      [vertices[i+1][0]-vertices[0][0],vertices[i+1][1]-vertices[0][1],vertices[i+1][2]-vertices[0][2]]));
    if (normal) break;
  }
  if (!normal) return null;
  let flipped = false;
  for (const value of normal) {
    if (Math.abs(value) <= 1e-9) continue;
    flipped = value < 0;
    break;
  }
  if (flipped) normal = [-normal[0],-normal[1],-normal[2]];
  const offset = roundKey(dot3(normal, vertices[0]));
  const key = normal.map(value => roundKey(value)).join(',') + ':' + offset;
  const helper: Point = Math.abs(normal[0]) < .9 ? [1,0,0] : [0,1,0];
  const u = normalize3(cross3(normal,helper));
  if (!u) return null;
  const v = cross3(normal,u);
  const points = vertices.map(point => [
    dot3(point,u),
    dot3(point,v)
  ] as XY);
  return { key, points };
}

function polygonTouches(a: PlaneFace, b: PlaneFace): boolean {
  if (a.max[0] < b.min[0]-1e-5 || b.max[0] < a.min[0]-1e-5 ||
      a.max[1] < b.min[1]-1e-5 || b.max[1] < a.min[1]-1e-5) return false;
  if (a.points.some(point => pointInPolygon(point,b.points))) return true;
  if (b.points.some(point => pointInPolygon(point,a.points))) return true;
  const orient=(p:XY,q:XY,r:XY)=>cross(p,q,r);
  const crosses=(p:XY,q:XY,r:XY,s:XY)=>{
    const o1=orient(p,q,r),o2=orient(p,q,s),o3=orient(r,s,p),o4=orient(r,s,q);
    return o1*o2 < -1e-12 && o3*o4 < -1e-12;
  };
  for (let i=0;i<a.points.length;i++) {
    for (let j=0;j<b.points.length;j++) {
      if (crosses(a.points[i],a.points[(i+1)%a.points.length],
        b.points[j],b.points[(j+1)%b.points.length])) return true;
    }
  }
  return false;
}

function addTouch(byTouch: Map<string,Set<string>>, first: string, second: string): void {
  if (first === second) return;
  if (!byTouch.has(first)) byTouch.set(first,new Set());
  if (!byTouch.has(second)) byTouch.set(second,new Set());
  byTouch.get(first)!.add(second);
  byTouch.get(second)!.add(first);
}

export function boundaryLineIds(
  faceIds: readonly string[],
  entries: readonly { object: { id: string; shape: string }; mesh: MeshGeometry }[]
): string[] {
  const selected = new Set(faceIds);
  const vertexKey = (point: Point): string => point.map(value => Math.round(value * precision)).join(':');
  const edgeKey = (a: Point, b: Point): string => [vertexKey(a), vertexKey(b)].sort().join('|');
  const edges = new Set<string>();
  for (const { object, mesh } of entries) {
    if (!selected.has(object.id) || object.shape === 'line') continue;
    for (const face of mesh.faces) {
      for (let i = 0; i < face.length; i++) {
        const a = mesh.vertices[face[i]], b = mesh.vertices[face[(i + 1) % face.length]];
        if (a && b) edges.add(edgeKey(a, b));
      }
    }
  }
  const result: string[] = [];
  for (const { object, mesh } of entries) {
    if (object.shape !== 'line' || mesh.vertices.length < 2) continue;
    if (edges.has(edgeKey(mesh.vertices[0], mesh.vertices[1]))) result.push(object.id);
  }
  return result;
}

export function connectedFaces(
  seedId: string,
  entries: readonly { object: { id: string; shape: string }; mesh: MeshGeometry }[]
): string[] {
  const byEdge = new Map<string, Set<string>>();
  const edgesById = new Map<string, Set<string>>();
  const byPlane = new Map<string, PlaneFace[]>();
  const vertexKey = (point: Point): string => point.map(value => Math.round(value * precision)).join(':');
  for (const { object, mesh } of entries) {
    if (object.shape === 'line') continue;
    const edges = new Set<string>();
    for (const face of mesh.faces) {
      for (let i = 0; i < face.length; i++) {
        const a = mesh.vertices[face[i]], b = mesh.vertices[face[(i + 1) % face.length]];
        if (!a || !b) continue;
        const ends = [vertexKey(a), vertexKey(b)].sort();
        if (ends[0] === ends[1]) continue;
        const edge = ends.join('|');
        edges.add(edge);
        if (!byEdge.has(edge)) byEdge.set(edge, new Set());
        byEdge.get(edge)!.add(object.id);
      }
      const vertices = face.map(index => mesh.vertices[index]).filter((point): point is Point => Boolean(point));
      const plane = faceOnPlane(vertices);
      if (!plane) continue;
      const xs = plane.points.map(point => point[0]), ys = plane.points.map(point => point[1]);
      const min: XY = [Math.min(...xs), Math.min(...ys)];
      const max: XY = [Math.max(...xs), Math.max(...ys)];
      if (!byPlane.has(plane.key)) byPlane.set(plane.key, []);
      byPlane.get(plane.key)!.push({ id: object.id, points: plane.points, min, max });
    }
    edgesById.set(object.id, edges);
  }
  const byTouch = new Map<string, Set<string>>();
  for (const faces of byPlane.values()) {
    for (let i = 0; i < faces.length; i++) {
      for (let j = i + 1; j < faces.length; j++) {
        if (faces[i].id !== faces[j].id && polygonTouches(faces[i], faces[j]))
          addTouch(byTouch, faces[i].id, faces[j].id);
      }
    }
  }
  if (!edgesById.has(seedId)) return [];
  const selected = new Set<string>([seedId]), queue = [seedId];
  for (const id of queue) {
    for (const edge of edgesById.get(id) ?? []) {
      for (const next of byEdge.get(edge) ?? []) {
        if (!selected.has(next)) { selected.add(next); queue.push(next); }
      }
    }
    for (const next of byTouch.get(id) ?? []) {
      if (!selected.has(next)) { selected.add(next); queue.push(next); }
    }
  }
  return queue;
}

const segmentDirection = (a: Point, b: Point): Point | null => {
  const dx = b[0]-a[0], dy = b[1]-a[1], dz = b[2]-a[2];
  const length = Math.hypot(dx,dy,dz);
  return length < 1e-9 ? null : [dx/length,dy/length,dz/length];
};

const segmentsOverlap = (a1: Point, a2: Point, b1: Point, b2: Point, tolerance = 1e-4): boolean => {
  const direction = segmentDirection(b1,b2);
  if (!direction) return false;
  const offset = (point: Point): number =>
    (point[0]-b1[0])*direction[0]+(point[1]-b1[1])*direction[1]+(point[2]-b1[2])*direction[2];
  const distance = (point: Point): number => {
    const t = offset(point);
    return Math.hypot(point[0]-b1[0]-direction[0]*t,
      point[1]-b1[1]-direction[1]*t,point[2]-b1[2]-direction[2]*t);
  };
  if (distance(a1) > tolerance || distance(a2) > tolerance) return false;
  const length = Math.hypot(b2[0]-b1[0],b2[1]-b1[1],b2[2]-b1[2]);
  const low = Math.min(offset(a1),offset(a2)), high = Math.max(offset(a1),offset(a2));
  return Math.max(low,0) <= Math.min(high,length)+tolerance;
};

/** Faces and lines that touch the seed through shared edges or endpoints. */
export function connectedParts(
  seedId: string,
  entries: readonly { object: { id: string; shape: string }; mesh: MeshGeometry }[]
): string[] {
  const vertexKey = (point: Point): string => point.map(value => Math.round(value * precision)).join(':');
  const adjacency = new Map<string, Set<string>>();
  const link = (first: string, second: string): void => {
    if (first === second) return;
    if (!adjacency.has(first)) adjacency.set(first, new Set());
    if (!adjacency.has(second)) adjacency.set(second, new Set());
    adjacency.get(first)!.add(second);
    adjacency.get(second)!.add(first);
  };
  const byEdge = new Map<string, Set<string>>();
  const byPlane = new Map<string, PlaneFace[]>();
  const faceEdges = new Map<string, [Point, Point][]>();
  for (const { object, mesh } of entries) {
    if (object.shape === 'line' || !mesh) continue;
    const edges: [Point, Point][] = [];
    for (const face of mesh.faces) {
      for (let i = 0; i < face.length; i++) {
        const a = mesh.vertices[face[i]], b = mesh.vertices[face[(i+1)%face.length]];
        if (!a || !b) continue;
        const ends = [vertexKey(a),vertexKey(b)].sort();
        if (ends[0] === ends[1]) continue;
        edges.push([a,b]);
        const edge = ends.join('|');
        if (!byEdge.has(edge)) byEdge.set(edge,new Set());
        byEdge.get(edge)!.add(object.id);
      }
      const vertices = face.map(index => mesh.vertices[index]).filter((point): point is Point => Boolean(point));
      const plane = faceOnPlane(vertices);
      if (!plane) continue;
      const xs = plane.points.map(point => point[0]), ys = plane.points.map(point => point[1]);
      const min: XY = [Math.min(...xs),Math.min(...ys)];
      const max: XY = [Math.max(...xs),Math.max(...ys)];
      if (!byPlane.has(plane.key)) byPlane.set(plane.key,[]);
      byPlane.get(plane.key)!.push({id:object.id,points:plane.points,min,max});
    }
    faceEdges.set(object.id,edges);
  }
  for (const ids of byEdge.values()) {
    const list = [...ids];
    for (let i = 1; i < list.length; i++) link(list[0],list[i]);
  }
  for (const faces of byPlane.values()) {
    for (let i = 0; i < faces.length; i++) {
      for (let j = i+1; j < faces.length; j++) {
        if (faces[i].id !== faces[j].id && polygonTouches(faces[i],faces[j]))
          link(faces[i].id,faces[j].id);
      }
    }
  }
  const lineSegments = new Map<string, [Point, Point]>();
  const byPoint = new Map<string, Set<string>>();
  for (const { object, mesh } of entries) {
    if (object.shape !== 'line' || !mesh || mesh.vertices.length < 2) continue;
    const a = mesh.vertices[0], b = mesh.vertices[1];
    lineSegments.set(object.id,[a,b]);
    for (const point of [a,b]) {
      const vertex = vertexKey(point);
      if (!byPoint.has(vertex)) byPoint.set(vertex,new Set());
      byPoint.get(vertex)!.add(object.id);
    }
  }
  for (const ids of byPoint.values()) {
    const list = [...ids];
    for (let i = 1; i < list.length; i++) link(list[0],list[i]);
  }
  const lines = [...lineSegments.entries()];
  for (let i = 0; i < lines.length; i++) {
    for (let j = i+1; j < lines.length; j++) {
      if (segmentsOverlap(lines[i][1][0],lines[i][1][1],lines[j][1][0],lines[j][1][1]))
        link(lines[i][0],lines[j][0]);
    }
  }
  const linesByEdge = new Map<string, string[]>();
  for (const [id,[a,b]] of lineSegments) {
    const edge = [vertexKey(a),vertexKey(b)].sort().join('|');
    if (!linesByEdge.has(edge)) linesByEdge.set(edge,[]);
    linesByEdge.get(edge)!.push(id);
  }
  for (const [edge,ids] of byEdge) {
    const related = linesByEdge.get(edge);
    if (!related) continue;
    for (const face of ids) for (const line of related) link(face,line);
  }
  for (const [faceId,edges] of faceEdges) {
    for (const [lineId,[a,b]] of lineSegments) {
      if (adjacency.get(faceId)?.has(lineId)) continue;
      if (edges.some(([c,d]) => segmentsOverlap(a,b,c,d))) link(faceId,lineId);
    }
  }
  if (!adjacency.has(seedId)) return [seedId];
  const selected = new Set<string>([seedId]), queue = [seedId];
  for (const id of queue) {
    for (const next of adjacency.get(id) ?? []) {
      if (!selected.has(next)) { selected.add(next); queue.push(next); }
    }
  }
  return queue;
}
