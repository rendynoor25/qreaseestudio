var QreaseeLine = (() => {
  var __defProp = Object.defineProperty;
  var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
  var __getOwnPropNames = Object.getOwnPropertyNames;
  var __hasOwnProp = Object.prototype.hasOwnProperty;
  var __export = (target, all) => {
    for (var name in all)
      __defProp(target, name, { get: all[name], enumerable: true });
  };
  var __copyProps = (to, from, except, desc) => {
    if (from && typeof from === "object" || typeof from === "function") {
      for (let key2 of __getOwnPropNames(from))
        if (!__hasOwnProp.call(to, key2) && key2 !== except)
          __defProp(to, key2, { get: () => from[key2], enumerable: !(desc = __getOwnPropDesc(from, key2)) || desc.enumerable });
    }
    return to;
  };
  var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

  // web/line-geometry.ts
  var line_geometry_exports = {};
  __export(line_geometry_exports, {
    axisSnap: () => axisSnap,
    closedLoop: () => closedLoop,
    polygonFromLoop: () => polygonFromLoop,
    triangulate: () => triangulate
  });
  var precision = 1e5;
  var key = (point) => point.slice(0, 2).map((value) => Math.round(value * precision)).join(":");
  var cross = (a, b, c) => (b[0] - a[0]) * (c[1] - a[1]) - (b[1] - a[1]) * (c[0] - a[0]);
  function axisSnap(start, pointer, project, step = 0.25, tolerance = 12) {
    const origin = project(start);
    if (!Number.isFinite(origin[0]) || !Number.isFinite(origin[1])) return null;
    let best = null;
    for (let axis = 0; axis < 3; axis++) {
      const unit = [...start];
      unit[axis] += 1;
      const tip = project(unit);
      if (!Number.isFinite(tip[0]) || !Number.isFinite(tip[1])) continue;
      const dx = tip[0] - origin[0], dy = tip[1] - origin[1];
      const size = Math.hypot(dx, dy);
      if (size < 3) continue;
      const offsetX = pointer[0] - origin[0], offsetY = pointer[1] - origin[1];
      const distance = Math.abs(offsetX * dy - offsetY * dx) / size;
      if (distance > tolerance || best && distance >= best.distance) continue;
      const coordinate = Math.abs(dx) >= Math.abs(dy) ? 0 : 1;
      const first = origin[coordinate], second = tip[coordinate], observed = pointer[coordinate];
      const w0 = origin[3] ?? 1, w1 = tip[3] ?? 1;
      const denominator = second * w1 - first * w0 - observed * (w1 - w0);
      const raw = Math.abs(denominator) > 1e-9 ? w0 * (observed - first) / denominator : (offsetX * dx + offsetY * dy) / (size * size);
      if (!Number.isFinite(raw) || Math.abs(raw) > 1e4) continue;
      const length = Math.round(raw / step) * step;
      if (Math.abs(length) < 1e-3) continue;
      const world = [...start];
      world[axis] += length;
      best = { world, label: "Sumbu " + "XYZ"[axis], distance };
    }
    return best && { world: best.world, label: best.label };
  }
  function endpoints(line) {
    const angle = line.rotation * Math.PI / 180;
    const cos = Math.cos(angle), sin = Math.sin(angle);
    const dx = line.width * cos - line.depth * sin;
    const dy = line.width * sin + line.depth * cos;
    return [
      [line.x - dx / 2, line.y - dy / 2, line.z],
      [line.x + dx / 2, line.y + dy / 2, line.z + line.height]
    ];
  }
  function triangulate(points) {
    const remaining = points.map((_, index) => index);
    const triangles = [];
    while (remaining.length >= 3) {
      const length = remaining.length;
      let ear = -1;
      for (let i = 0; i < length; i++) {
        const a = remaining[(i + length - 1) % length], b = remaining[i], c = remaining[(i + 1) % length];
        if (cross(points[a], points[b], points[c]) <= 1e-12) continue;
        const blocked = remaining.some((other) => other !== a && other !== b && other !== c && cross(points[a], points[b], points[other]) >= -1e-12 && cross(points[b], points[c], points[other]) >= -1e-12 && cross(points[c], points[a], points[other]) >= -1e-12);
        if (!blocked) {
          ear = i;
          triangles.push([a, b, c]);
          break;
        }
      }
      if (ear < 0) return [];
      remaining.splice(ear, 1);
    }
    return triangles;
  }
  function closedLoop(existing, edge) {
    if (edge.shape !== "line" || Math.abs(edge.height) > 1e-5) return null;
    const [a, b] = endpoints(edge);
    const start = key(b), goal = key(a);
    if (start === goal) return null;
    const adjacency = /* @__PURE__ */ new Map();
    const points = /* @__PURE__ */ new Map();
    for (const line of existing) {
      if (line.shape !== "line" || Math.abs(line.height) > 1e-5 || Math.abs(line.z - edge.z) > 1e-5 || (line.container?.id ?? null) !== (edge.container?.id ?? null)) continue;
      const [first, second] = endpoints(line);
      const u = key(first), v = key(second);
      if (u === v) continue;
      points.set(u, first);
      points.set(v, second);
      if (!adjacency.has(u)) adjacency.set(u, /* @__PURE__ */ new Set());
      if (!adjacency.has(v)) adjacency.set(v, /* @__PURE__ */ new Set());
      adjacency.get(u).add(v);
      adjacency.get(v).add(u);
    }
    const queue = [start], previous = /* @__PURE__ */ new Map([[start, null]]);
    for (let i = 0; i < queue.length && !previous.has(goal); i++) {
      for (const next of adjacency.get(queue[i]) ?? []) {
        if (previous.has(next)) continue;
        previous.set(next, queue[i]);
        queue.push(next);
      }
    }
    if (!previous.has(goal)) return null;
    const path = [];
    for (let node = goal; node !== null; node = previous.get(node) ?? null) {
      path.push(points.get(node) ?? (node === start ? b : a));
    }
    path.reverse();
    const loop = [a, ...path.slice(0, -1)];
    return loop.length >= 3 ? loop : null;
  }
  function polygonFromLoop(loop) {
    const ring = loop.map((point) => [point[0], point[1]]);
    if (ring.length < 3 || ring.length > 250) return null;
    const area = ring.reduce((sum, point, i) => sum + point[0] * ring[(i + 1) % ring.length][1] - ring[(i + 1) % ring.length][0] * point[1], 0);
    if (Math.abs(area) < 1e-8) return null;
    if (area < 0) ring.reverse();
    for (let i = ring.length - 1; i >= 0 && ring.length > 3; i--) {
      const length = ring.length;
      if (Math.abs(cross(ring[(i + length - 1) % length], ring[i], ring[(i + 1) % length])) < 1e-8)
        ring.splice(i, 1);
    }
    if (triangulate(ring).length !== ring.length - 2) return null;
    const minX = Math.min(...ring.map((point) => point[0])), maxX = Math.max(...ring.map((point) => point[0]));
    const minY = Math.min(...ring.map((point) => point[1])), maxY = Math.max(...ring.map((point) => point[1]));
    const width = maxX - minX, depth = maxY - minY;
    if (width < 1e-3 || depth < 1e-3) return null;
    const x = (minX + maxX) / 2, y = (minY + maxY) / 2;
    return {
      x,
      y,
      z: loop[0][2],
      width,
      depth,
      profile: { points: ring.map((point) => [(point[0] - x) / width, (point[1] - y) / depth]), inferred: true }
    };
  }
  return __toCommonJS(line_geometry_exports);
})();
