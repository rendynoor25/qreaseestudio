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
console.log('3D triangle faces and line intersections passed');
