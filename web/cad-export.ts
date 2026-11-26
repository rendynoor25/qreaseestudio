import earcut from 'earcut';
import { ACadVersion, CadDocument, Circle, DwgWriter, Face3D, Line, TextEntity, UnitsType, XYZ } from '@node-projects/acad-ts';

type Point = [number, number, number];
type Mesh = { vertices: Point[]; faces: number[][] };

function triangles(face: number[], vertices: Point[]): number[][] {
  if (face.length === 3) return [face];
  if (face.length === 4) return [[face[0], face[1], face[2]], [face[0], face[2], face[3]]];
  const a = vertices[face[0]], b = vertices[face[1]], c = vertices[face[2]];
  const ab = b.map((value, axis) => value - a[axis]);
  const ac = c.map((value, axis) => value - a[axis]);
  const normal = [ab[1] * ac[2] - ab[2] * ac[1], ab[2] * ac[0] - ab[0] * ac[2], ab[0] * ac[1] - ab[1] * ac[0]];
  const drop = normal.map(Math.abs).indexOf(Math.max(...normal.map(Math.abs)));
  const axes = [0, 1, 2].filter(axis => axis !== drop);
  const flat = face.flatMap(index => [vertices[index][axes[0]], vertices[index][axes[1]]]);
  const indices = earcut(flat);
  return Array.from({ length: indices.length / 3 }, (_, index) => [
    face[indices[index * 3]], face[indices[index * 3 + 1]], face[indices[index * 3 + 2]],
  ]);
}

/** Export rendered Qreasee geometry as native DWG model-space entities in metres. */
export function exportDwg(meshes: Mesh[]): Uint8Array {
  const document = new CadDocument();
  document.header.version = ACadVersion.AC1032;
  document.header.insUnits = UnitsType.Meters;
  const point = (value: Point) => new XYZ(value[0], value[1], value[2]);
  for (const mesh of meshes) {
    if (!mesh.vertices.every(vertex => vertex.length === 3 && vertex.every(Number.isFinite))) throw new Error('Koordinat model tidak valid.');
    if (!mesh.faces.length && mesh.vertices.length >= 2) {
      document.modelSpace!.entities.add(new Line(point(mesh.vertices[0]), point(mesh.vertices[1])));
      continue;
    }
    for (const face of mesh.faces) {
      if (face.length < 3 || face.some(index => !Number.isInteger(index) || index < 0 || index >= mesh.vertices.length)) throw new Error('Bidang model tidak valid.');
      for (const [a, b, c] of triangles(face, mesh.vertices)) {
        const entity = new Face3D();
        entity.firstCorner = point(mesh.vertices[a]);
        entity.secondCorner = point(mesh.vertices[b]);
        entity.thirdCorner = point(mesh.vertices[c]);
        entity.fourthCorner = point(mesh.vertices[c]);
        document.modelSpace!.entities.add(entity);
      }
    }
  }
  return DwgWriter.writeToBuffer(document);
}

/** Export the current A3 sheet as 2D DWG entities in millimetres. */
export function exportLayoutDwg(sheet: SVGSVGElement): Uint8Array {
  const document = new CadDocument();
  document.header.version = ACadVersion.AC1032;
  document.header.insUnits = UnitsType.Millimeters;
  const number = (element: Element, name: string) => Number(element.getAttribute(name) || 0);
  const point = (x: number, y: number) => new XYZ(x, 297 - y, 0);
  type Clip = {minX:number; minY:number; maxX:number; maxY:number};
  const line = (x1: number, y1: number, x2: number, y2: number, clip?: Clip) => {
    if (![x1, y1, x2, y2].every(Number.isFinite)) return;
    if (clip) {
      const dx=x2-x1, dy=y2-y1;
      let start=0, end=1;
      for(const [p,q] of [[-dx,x1-clip.minX],[dx,clip.maxX-x1],[-dy,y1-clip.minY],[dy,clip.maxY-y1]]) {
        if(Math.abs(p)<1e-12) {if(q<0)return;continue;}
        const ratio=q/p;
        if(p<0)start=Math.max(start,ratio);else end=Math.min(end,ratio);
      }
      if(start>end)return;
      const ax=x1+start*dx, ay=y1+start*dy;
      x2=x1+end*dx;y2=y1+end*dy;x1=ax;y1=ay;
    }
    if (Math.hypot(x2 - x1, y2 - y1) < 0.01) return;
    document.modelSpace!.entities.add(new Line(point(x1, y1), point(x2, y2)));
  };
  const walk = (element: Element, parentClip?: Clip) => {
    if (element.classList.contains('remote-cursors') || element.tagName === 'clipPath') return;
    const tag = element.tagName.toLowerCase();
    let clip=parentClip;
    const clipId=element.getAttribute('clip-path')?.match(/^url\(#([^)]*)\)$/)?.[1];
    if(clipId){
      const rectangle=sheet.querySelector(`clipPath[id="${clipId}"] rect`);
      if(rectangle){
        const x=number(rectangle,'x'),y=number(rectangle,'y');
        clip={minX:x,minY:y,maxX:x+number(rectangle,'width'),maxY:y+number(rectangle,'height')};
      }
    }
    if (tag === 'g' || tag === 'svg') {
      for (const child of element.children) walk(child,clip);
      return;
    }
    if (element.getAttribute('stroke') === 'transparent' || element.getAttribute('stroke') === 'none') return;
    if (tag === 'line') {
      line(number(element, 'x1'), number(element, 'y1'), number(element, 'x2'), number(element, 'y2'),clip);
    } else if (tag === 'rect') {
      if (element.getAttribute('stroke') === null) return;
      const x = number(element, 'x'), y = number(element, 'y');
      const w = number(element, 'width'), h = number(element, 'height');
      line(x, y, x + w, y,clip); line(x + w, y, x + w, y + h,clip);
      line(x + w, y + h, x, y + h,clip); line(x, y + h, x, y,clip);
    } else if (tag === 'polyline' || tag === 'polygon') {
      const points = (element.getAttribute('points') || '').trim().split(/\s+/).map(value => value.split(',').map(Number));
      for (let i = 1; i < points.length; i++) line(points[i-1][0], points[i-1][1], points[i][0], points[i][1],clip);
      if (tag === 'polygon' && points.length > 2) line(points.at(-1)![0], points.at(-1)![1], points[0][0], points[0][1],clip);
    } else if (tag === 'circle') {
      const radius = number(element, 'r');
      if (radius <= 0) return;
      if (clip && (number(element,'cx')-radius<clip.minX || number(element,'cx')+radius>clip.maxX ||
        number(element,'cy')-radius<clip.minY || number(element,'cy')+radius>clip.maxY)) return;
      const circle = new Circle();
      circle.center = point(number(element, 'cx'), number(element, 'cy'));
      circle.radius = radius;
      document.modelSpace!.entities.add(circle);
    } else if (tag === 'text') {
      const value = (element.textContent || '').trim();
      if (!value) return;
      if(clip && (number(element,'x')<clip.minX || number(element,'x')>clip.maxX ||
        number(element,'y')<clip.minY || number(element,'y')>clip.maxY)) return;
      const entity = new TextEntity(value);
      entity.insertPoint = point(number(element, 'x'), number(element, 'y'));
      entity.height = Math.max(0.5, number(element, 'font-size') || 3);
      document.modelSpace!.entities.add(entity);
    }
  };
  walk(sheet);
  return DwgWriter.writeToBuffer(document);
}
