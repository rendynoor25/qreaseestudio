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
    boxHitsGeometry: () => boxHitsGeometry,
    closedLoop: () => closedLoop,
    connectedFaces: () => connectedFaces,
    connectedLines: () => connectedLines,
    polygonFromLoop: () => polygonFromLoop,
    triangulate: () => triangulate,
    verticalRectangle: () => verticalRectangle,
    verticalWall: () => verticalWall
  });
  function verticalWall(vertices) {
    if (vertices.length < 3) return null;
    const origin = vertices[0];
    for (let i = 1; i < vertices.length - 1; i++) {
      const a = vertices[i].map((value, index) => value - origin[index]);
      const b = vertices[i + 1].map((value, index) => value - origin[index]);
      const normal = [
        a[1] * b[2] - a[2] * b[1],
        a[2] * b[0] - a[0] * b[2],
        a[0] * b[1] - a[1] * b[0]
      ];
      const length = Math.hypot(...normal);
      if (length < 1e-8) continue;
      if (Math.abs(normal[2]) > length * 0.05) return null;
      const horizontal = [normal[0] / length, normal[1] / length];
      return { origin, axis: [-horizontal[1], horizontal[0]], normal: horizontal };
    }
    return null;
  }
  function verticalRectangle(a, b, axis) {
    const along = (b[0] - a[0]) * axis[0] + (b[1] - a[1]) * axis[1];
    return {
      x: a[0] + axis[0] * along / 2,
      y: a[1] + axis[1] * along / 2,
      z: (a[2] + b[2]) / 2,
      width: Math.abs(along),
      depth: Math.abs(b[2] - a[2]),
      wall_axis: axis
    };
  }
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
  var insideBox = (point, box) => point[0] >= box.left && point[0] <= box.right && point[1] >= box.top && point[1] <= box.bottom;
  function segmentCrossesBox(a, b, box) {
    if (insideBox(a, box) || insideBox(b, box)) return true;
    const dx = b[0] - a[0], dy = b[1] - a[1];
    let low = 0, high = 1;
    for (const [p, q] of [
      [-dx, a[0] - box.left],
      [dx, box.right - a[0]],
      [-dy, a[1] - box.top],
      [dy, box.bottom - a[1]]
    ]) {
      if (Math.abs(p) < 1e-12) {
        if (q < 0) return false;
      } else {
        const t = q / p;
        if (p < 0) low = Math.max(low, t);
        else high = Math.min(high, t);
        if (low > high) return false;
      }
    }
    return true;
  }
  function pointInPolygon(point, polygon) {
    let inside = false;
    for (let i = 0, j = polygon.length - 1; i < polygon.length; j = i++) {
      const a = polygon[i], b = polygon[j];
      if (a[1] > point[1] !== b[1] > point[1] && point[0] < (b[0] - a[0]) * (point[1] - a[1]) / (b[1] - a[1]) + a[0]) inside = !inside;
    }
    return inside;
  }
  function boxHitsGeometry(points, box, crossing) {
    if (!points.length) return false;
    if (!crossing) return points.every((point) => insideBox(point, box));
    if (points.some((point) => insideBox(point, box))) return true;
    const count = points.length;
    for (let i = 0; i < (count === 2 ? 1 : count); i++) {
      if (segmentCrossesBox(points[i], points[(i + 1) % count], box)) return true;
    }
    return count > 2 && [
      [box.left, box.top],
      [box.right, box.top],
      [box.right, box.bottom],
      [box.left, box.bottom]
    ].some((corner) => pointInPolygon(corner, points));
  }
  function connectedLines(seedId, lines) {
    const byPoint = /* @__PURE__ */ new Map();
    for (const line of lines) {
      if (line.shape !== "line") continue;
      for (const point of endpoints(line)) {
        const vertex = point.map((value) => Math.round(value * precision)).join(":");
        if (!byPoint.has(vertex)) byPoint.set(vertex, /* @__PURE__ */ new Set());
        byPoint.get(vertex).add(line.id);
      }
    }
    const seed = lines.find((line) => line.id === seedId);
    if (!seed || seed.shape !== "line") return [];
    const selected = /* @__PURE__ */ new Set([seedId]), queue = [seedId];
    const byId = new Map(lines.map((line) => [line.id, line]));
    for (const id of queue) {
      for (const point of endpoints(byId.get(id))) {
        const vertex = point.map((value) => Math.round(value * precision)).join(":");
        for (const next of byPoint.get(vertex) ?? []) {
          if (!selected.has(next)) {
            selected.add(next);
            queue.push(next);
          }
        }
      }
    }
    return queue;
  }
  function connectedFaces(seedId, entries) {
    const byEdge = /* @__PURE__ */ new Map();
    const edgesById = /* @__PURE__ */ new Map();
    const vertexKey = (point) => point.map((value) => Math.round(value * precision)).join(":");
    for (const { object, mesh } of entries) {
      if (object.shape === "line") continue;
      const edges = /* @__PURE__ */ new Set();
      for (const face of mesh.faces) {
        for (let i = 0; i < face.length; i++) {
          const a = mesh.vertices[face[i]], b = mesh.vertices[face[(i + 1) % face.length]];
          if (!a || !b) continue;
          const ends = [vertexKey(a), vertexKey(b)].sort();
          if (ends[0] === ends[1]) continue;
          const edge = ends.join("|");
          edges.add(edge);
          if (!byEdge.has(edge)) byEdge.set(edge, /* @__PURE__ */ new Set());
          byEdge.get(edge).add(object.id);
        }
      }
      edgesById.set(object.id, edges);
    }
    if (!edgesById.has(seedId)) return [];
    const selected = /* @__PURE__ */ new Set([seedId]), queue = [seedId];
    for (const id of queue) {
      for (const edge of edgesById.get(id) ?? []) {
        for (const next of byEdge.get(edge) ?? []) {
          if (!selected.has(next)) {
            selected.add(next);
            queue.push(next);
          }
        }
      }
    }
    return queue;
  }
  return __toCommonJS(line_geometry_exports);
})();
