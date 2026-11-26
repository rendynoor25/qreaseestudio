const assert=require('node:assert/strict');
const fs=require('node:fs');
const vm=require('node:vm');
const geometry=vm.runInNewContext(fs.readFileSync(require.resolve('../web/line-geometry.js'),'utf8')+'\nQreaseeLine');
const line=(id,a,b)=>({id,name:'Garis',shape:'line',x:(a[0]+b[0])/2,
  y:(a[1]+b[1])/2,z:a[2],width:b[0]-a[0],depth:b[1]-a[1],
  height:b[2]-a[2],rotation:0,color:'#000000'});

for(const points of [
  [[0,0,0],[2,0,0],[1,0,2]],
  [[0,0,0],[2,0,1],[1,2,2]]
]) {
  const edges=points.map((point,i)=>line(String(i),point,points[(i+1)%3]));
  const loop=geometry.closedLoop(edges.slice(0,2),edges[2]);
  assert.ok(loop,'three connected coplanar edges close a loop');
  const face=geometry.polygonFromLoop(loop);
  assert.ok(face?.plane_u && face?.plane_v,'an inclined face has a plane basis');
  assert.equal(geometry.triangulate(face.profile.points).length,1);
}
const crossing=geometry.splitCrossingLines(
  [line('horizontal',[-2,0,0],[2,0,0])],
  line('vertical',[0,-2,0],[0,2,0]),()=>crypto.randomUUID());
assert.equal(crossing.before.length,1);
assert.equal(crossing.after.length,4);
assert.equal(new Set(crossing.after.map(item=>item.id)).size,4);
assert.equal(geometry.splitCrossingLines(
  [line('slope-a',[0,0,0],[2,2,2])],
  line('slope-b',[0,2,2],[2,0,0]),()=>crypto.randomUUID()).after.length,4,
  'inclined lines meeting in 3D also split');
assert.equal(geometry.splitCrossingLines(
  [line('low',[-2,0,0],[2,0,0])],
  line('high',[0,-2,1],[0,2,1]),()=>crypto.randomUUID()).after.length,1,
  'lines at different elevations do not split');
const overlap=geometry.splitCrossingLines(
  [line('long',[-5,0,0],[5,0,0])],
  line('short',[-2,0,0],[2,0,0]),()=>crypto.randomUUID());
assert.equal(overlap.before.length,1,'the old overlapping line is replaced');
assert.equal(overlap.after.length,3,'the old line and short line share one split segment');
const extent=item=>[item.x-item.width/2,item.x+item.width/2].map(value=>value.toFixed(4));
assert.equal(
  JSON.stringify(overlap.after.map(extent).sort((a,b)=>Number(a[0])-Number(b[0]))),
  JSON.stringify([['-5.0000','-2.0000'],['-2.0000','2.0000'],['2.0000','5.0000']]),
  'a short overlap divides the long line at its endpoints');
const rect=(x,y,width,depth)=>({shape:'rectangle',x,y,z:0,width,depth,height:0,rotation:0});
const area=parts=>parts.reduce((sum,part)=>sum+part.width*part.depth,0);
const inside=geometry.splitRectangle(rect(0,0,10,6),rect(0,0,4,2));
assert.equal(inside.length,4,'a rectangle fully inside leaves four surrounding faces');
assert.ok(Math.abs(area(inside)-(60-8))<1e-6);
const partial=geometry.splitRectangle(rect(0,0,10,6),rect(4,0,8,2));
assert.equal(partial.length,3,'a partially overlapping rectangle cuts only the overlapping part');
assert.ok(Math.abs(area(partial)-(60-10))<1e-6);
assert.equal(geometry.splitRectangle(rect(0,0,10,6),rect(0,0,12,8)).length,0,
  'a rectangle that covers the old face removes it');
assert.equal(geometry.splitRectangle(rect(0,0,10,6),rect(20,0,2,2)),null,
  'a rectangle outside the face does not split it');
const pair=geometry.splitRectanglePair(rect(0,0,10,6),rect(4,0,8,2));
assert.ok(pair);
assert.ok(Math.abs(area(pair.host)-50)<1e-6,'host keeps only its non-overlapping part');
assert.ok(Math.abs(area(pair.child)-6)<1e-6,'the new rectangle keeps only its non-overlapping part');
assert.ok(Math.abs(pair.intersection.width*pair.intersection.depth-10)<1e-6,
  'the overlap becomes its own face');
const nested=geometry.splitRectanglePair(rect(0,0,10,6),rect(0,0,4,2));
assert.equal(nested.host.length,4);
assert.equal(nested.child.length,0,'a fully nested rectangle is the intersection face');
assert.ok(Math.abs(nested.intersection.width*nested.intersection.depth-8)<1e-6);
const covering=geometry.splitRectanglePair(rect(0,0,10,6),rect(0,0,12,8));
assert.equal(covering.host.length,0);
assert.ok(Math.abs(covering.intersection.width*covering.intersection.depth-60)<1e-6);
assert.ok(Math.abs(area(covering.child)-36)<1e-6);
assert.equal(geometry.splitRectanglePair(rect(0,0,10,6),rect(20,0,2,2)),null);
console.log('3D triangle faces, line intersections, and rectangle cuts passed');
