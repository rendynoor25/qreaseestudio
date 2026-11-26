import { buildScene } from 'openskp';

type Point = [number, number, number];
type Group = {vertices: Point[]; faces: [number, number, number][]; lookup: Map<string, number>};

/** Convert a compact SketchUp scene into editable Qreasee mesh objects. */
export function importSkp(buffer: ArrayBuffer, fileName: string): QreaseeObject[] {
  if (buffer.byteLength > 20 * 1024 * 1024) throw new Error('File SKP melebihi batas impor 20 MB.');
  const scene = buildScene(buffer);
  if (scene.unreadRootEntities) throw new Error('Sebagian geometri SKP tidak terbaca; impor dibatalkan.');
  const groups = new Map<number, Group>();
  let triangleCount = 0;
  for (const primitive of scene.surfacePrimitives || scene.glbPrimitives.filter(item => !item.unpaintedBack)) {
    const group = groups.get(primitive.materialIndex) || {vertices: [], faces: [], lookup: new Map()};
    groups.set(primitive.materialIndex, group);
    const positions = primitive.positions;
    for (let i = 0; i < primitive.indices.length; i += 3) {
      const face: number[] = [];
      for (let corner = 0; corner < 3; corner++) {
        const source = primitive.indices[i + corner] * 3;
        // OpenSKP scenes are Y-up metres; Qreasee is Z-up metres.
        const position: Point = [positions[source], -positions[source + 2], positions[source + 1]];
        if (!position.every(Number.isFinite)) throw new Error('Koordinat SKP tidak valid.');
        const key = position.join(',');
        let index = group.lookup.get(key);
        if (index === undefined) {
          index = group.vertices.length;
          group.vertices.push(position);
          group.lookup.set(key, index);
        }
        face.push(index);
      }
      if (new Set(face).size === 3) {
        group.faces.push(face as [number, number, number]);
        if (++triangleCount > 2_000) throw new Error('Model SKP terlalu rinci untuk ruang bersama saat ini (maksimum 2.000 segitiga).');
      }
    }
  }
  if (!triangleCount) throw new Error('File SKP tidak berisi bidang yang bisa diimpor.');
  const name = (fileName.replace(/\.skp$/i, '').trim() || 'Model SketchUp').slice(0, 55);
  const groupId = crypto.randomUUID();
  const objects: QreaseeObject[] = [];
  for (const [materialIndex, geometry] of groups) {
    if (!geometry.faces.length) continue;
    const min = [0, 1, 2].map(axis => Math.min(...geometry.vertices.map(point => point[axis])));
    const max = [0, 1, 2].map(axis => Math.max(...geometry.vertices.map(point => point[axis])));
    const center: Point = [0, 1, 2].map(axis => (min[axis] + max[axis]) / 2) as Point;
    const material = scene.gltfMaterials[materialIndex] as {pbrMetallicRoughness?: {baseColorFactor?: number[]}} | undefined;
    const factor = material?.pbrMetallicRoughness?.baseColorFactor || [0.76, 0.71, 0.64];
    const color = '#' + factor.slice(0, 3).map(value => Math.round(Math.max(0, Math.min(1, value)) * 255).toString(16).padStart(2, '0')).join('');
    objects.push({
      id: crypto.randomUUID(), name: `${name} · ${objects.length + 1}`.slice(0, 64),
      shape: 'mesh', x: center[0], y: center[1], z: center[2],
      width: max[0] - min[0], depth: max[1] - min[1], height: max[2] - min[2],
      rotation: 0, color, hide_edges: true,
      container: {id: groupId, name, definition: null, slot: null},
      geometry: {vertices: geometry.vertices.map(point => [point[0] - center[0], point[1] - center[1], point[2] - center[2]]), faces: geometry.faces},
    });
  }
  if (JSON.stringify(objects).length > 150_000) throw new Error('Geometri SKP melebihi batas data kolaborasi (150 KB).');
  return objects;
}
