function bounds(points) {
  /** @type {QreaseePoint} */
  const min = [Infinity,Infinity,Infinity];
  /** @type {QreaseePoint} */
  const max = [-Infinity,-Infinity,-Infinity];
  for (const point of points) {
    point.forEach((value,index) => {
      min[index] = Math.min(min[index],value);
      max[index] = Math.max(max[index],value);
    });
  }
  return {min,max};
}

function focalPixels(height=canvas.clientHeight || 500) {
  return height/(2*Math.tan(perspectiveFov/2));
}

function fit() {
  const world = state.meshes.flatMap(mesh => mesh.vertices);
  if (!world.length) world.push([-6,-4,0],[6,4,0]);
  const box=bounds(world);
  camera.center=/** @type {QreaseePoint} */ (box.min.map((low,i)=>(low+box.max[i])/2));
  const width = canvas.clientWidth || $('#layout-stage').clientWidth || 800;
  const height = canvas.clientHeight || 500;
  if (camera.perspective) {
    const focal=focalPixels(height);
    const [right,down,depth]=cameraAxes();
    let distance=1;
    for (const point of world) {
      const relative=point.map((value,i)=>value-camera.center[i]);
      const [u,v,d]=[right,down,depth].map(axis=>axis.reduce((sum,value,i)=>sum+value*relative[i],0));
      distance=Math.max(distance,d+Math.abs(u)*focal/(width*.69/2),
        d+Math.abs(v)*focal/(height*.63/2));
    }
    camera.distance=distance*1.05;
    camera.scale=focal/camera.distance;
    camera.baseDistance=camera.distance;
  } else {
    camera.distance=Math.max(8, 1.75*Math.hypot(...box.max.map((high,i)=>high-box.min[i]))/2);
    const {min,max}=bounds(world.map(projectPoint));
    camera.scale=clamp(Math.min(width*.69/Math.max(1,max[0]-min[0]),
      height*.63/Math.max(1,max[1]-min[1])),.05,300);
  }
  const {min,max}=bounds(world.map(projectPoint));
  camera.base = camera.scale;
  camera.x = -(min[0]+max[0])/2*camera.scale;
  camera.y = -(min[1]+max[1])/2*camera.scale;
  redraw();
}

/** @param {QreaseeView} value */
function cameraView(value) {
  [camera.yaw,camera.pitch] = views[value];
  camera.axes=null;
  camera.perspective=value==='perspective';
  state.inference=null;
  $('#camera').value = value;
  fit();
}

function zoom(factor,x=canvas.clientWidth/2,y=canvas.clientHeight/2) {
  if (camera.perspective) {
    const pivot=orbitPivot([x,y]);
    const [,,depth]=cameraAxes();
    const eye=camera.center.map((value,i)=>value+camera.distance*depth[i]);
    const fromEye=Math.hypot(...eye.map((value,i)=>value-pivot[i]));
    const ratio=1/factor;
    const direction=fromEye>1e-9
      ? pivot.map((value,i)=>(value-eye[i])/fromEye) : depth.map(value=>-value);
    const step=(1-ratio)*Math.max(fromEye,1.2);
    const nextEye=eye.map((value,i)=>value+step*direction[i]);
    camera.distance=clamp(camera.distance*ratio,.1,100000);
    camera.center=/** @type {QreaseePoint} */ (nextEye.map((value,i)=>value-camera.distance*depth[i]));
    camera.scale=focalPixels()/camera.distance;
    redraw();
    return;
  }
  const before = camera.scale;
  camera.scale = clamp(camera.scale*factor,.02,750);
  const ratio = camera.scale / before;
  const dx = x - canvas.clientWidth/2, dy = y - canvas.clientHeight/2;
  camera.x = dx + (camera.x-dx)*ratio;
  camera.y = dy + (camera.y-dy)*ratio;
  redraw();
}
$('#camera').onchange = event => cameraView(event.target.value);
$('#fit').onclick = fit;
$('#zoom-in').onclick = () => zoom(1.2);
$('#zoom-out').onclick = () => zoom(1/1.2);

/** @param {QreaseePoint} point @returns {[number, number, number, number]} */
function projectPoint(point) {
  const relative=point.map((value,i)=>value-camera.center[i]);
  const [u,v,d]=cameraAxes().map(axis=>axis.reduce((sum,value,i)=>sum+value*relative[i],0));
  const w=camera.perspective ? 1-d/camera.distance : 1;
  return w>(camera.perspective ? nearPlane/camera.distance-1e-9 : 0) ? [u/w,v/w,d/w,w] : [NaN,NaN,d,w];
}

/** @param {QreaseePoint} point @returns {[number, number, number, number]} */
function stagePoint(point) {
  const [x,y,depth,w] = projectPoint(point);
  return [canvas.clientWidth/2+camera.x+x*camera.scale,
    canvas.clientHeight/2+camera.y+y*camera.scale,depth,w];
}

/** @param {QreaseePoint2} position @param {number=} z @returns {QreaseePoint2|null} */
function ground(position, z=0) {
  const [x,y]=position;
  const [rightAxis,downAxis,depthAxis]=cameraAxes();
  const u=(x-canvas.clientWidth/2-camera.x)/camera.scale;
  const v=(y-canvas.clientHeight/2-camera.y)/camera.scale;
  const vertical=u*rightAxis[2]+v*downAxis[2];
  let depth, factor=1;
  if (camera.perspective) {
    depth=(z-camera.center[2]-vertical)/(depthAxis[2]-vertical/camera.distance);
    factor=1-depth/camera.distance;
    if (!Number.isFinite(factor) || factor<=nearPlane/camera.distance) return null;
  } else {
    if (Math.abs(depthAxis[2])<.03) return null;
    depth=(z-camera.center[2]-vertical)/depthAxis[2];
  }
  const point=/** @type {QreaseePoint2} */ ([0,1].map(i=>camera.center[i]+factor*(u*rightAxis[i]+v*downAxis[i])+depth*depthAxis[i]));
  return point.every(value=>Math.abs(value)<=20000) ? point : null;
}

function redraw() {
  if (!frame) frame = requestAnimationFrame(draw);
}

function polygon(points) {
  ctx.beginPath();
  points.forEach(([x,y],index) => index ? ctx.lineTo(x,y) : ctx.moveTo(x,y));
  if (points.length > 2) ctx.closePath();
}

function strokeLine(a,b,color,width=1) {
  polygon([a,b]);
  ctx.strokeStyle = color;
  ctx.lineWidth = width;
  ctx.stroke();
}

function clipNear(world) {
  const [,,depth]=cameraAxes();
  const near=nearPlane;
  const distance=point=>camera.distance-depth.reduce((sum,value,i)=>
    sum+value*(point[i]-camera.center[i]),0);
  const values=world.map(distance);
  if (values.every(value=>value>=near)) return world;
  if (values.every(value=>value<near)) return [];
  const crossing=(a,b,da,db)=>a.map((value,i)=>
    value+(b[i]-value)*(near-da)/(db-da));
  if (world.length===2) {
    const cut=crossing(world[0],world[1],values[0],values[1]);
    return values[0]>=near ? [world[0],cut] : [cut,world[1]];
  }
  const clipped=[];
  for (let i=0;i<world.length;i++) {
    const previous=(i+world.length-1)%world.length;
    const inside=values[i]>=near, wasInside=values[previous]>=near;
    if (inside!==wasInside) clipped.push(crossing(world[previous],world[i],values[previous],values[i]));
    if (inside) clipped.push(world[i]);
  }
  return clipped;
}

function scene(meshes, objects, projection) {
  const faces = [];
  const sections=projection===stagePoint?activeSections():[];
  const clip=projection===stagePoint && camera.perspective;
  meshes.forEach((mesh,index) => {
    if (!mesh.vertices.length) return;
    const object = objects[index];
    if (object.hidden && !state.showHidden) return;
    const projected = mesh.vertices.map(projection);
    const smooth = object.surface_role==='side' && object.shape==='circle';
    const quiet = Boolean(object.hide_edges) || Boolean(object.opening_id) && object.surface_role==='side';
    const entries = mesh.faces.length ? mesh.faces : [[0,1]];
    for (const [entryIndex, face] of entries.entries()) {
      const original=face.map(i=>mesh.vertices[i]);
      let world=original;
      for (const section of sections) {
        world=clipSectionPolygon(world,section);
        if (!world.length) break;
      }
      if (!world.length) continue;
      const visible=clip?clipNear(world):world;
      if (visible.length<Math.min(face.length,3)) continue;
      const points=visible===original?face.map(i=>projected[i]):visible.map(projection);
      if (points.some(point=>!Number.isFinite(point[0]))) continue;
      const area = points.reduce((sum,p,i) => {
        const q = points[(i+1)%points.length];
        return sum + p[0]*q[1]-q[0]*p[1];
      },0);
      if (face.length > 2 && (Math.abs(area) < 1e-6 ||
        (projection!==stagePoint && area>0 && object.height))) continue;
      let tone = 1, top = false;
      if (mesh.faces.length) {
        const heights = face.map(i => mesh.vertices[i][2]);
        top = heights.every(h => h === object.z+object.height);
        if (smooth) {
          tone = smoothTone(world);
        } else if (!top) {
          const a = mesh.vertices[face[0]], b = mesh.vertices[face[1]];
          tone = (b[1]-a[1]) - (b[0]-a[0]) > 0 ? .82 : .69;
        }
      }
      const ring=object.profile?.points.length;
      const edges=visible===original && ring && face.length===3 ? face.map((index,i)=>{
        const delta=Math.abs(index%ring-face[(i+1)%face.length]%ring);
        return delta===1 || delta===ring-1;
      }) : null;
      faces.push({object,points,edges,world:visible,top,tone,cut:mesh.cut,
        hidden:Boolean(object.hidden),
        depth:points.reduce((sum,p) => sum+p[2],0)/points.length,
        smooth,quiet,key:object.id+':'+index+':'+entryIndex});
    }
  });
  if (sections.length) faces.push(...sectionCaps(meshes,objects,projection,sections));
  return orderFaces(faces);
}

function orderFaces(faces) {
  faces.sort((a,b)=>a.depth-b.depth);
  if (faces.length>700) return faces;
  const geometry=faces.map(face=>{
    const points=face.points;
    if (points.length<3) return null;
    const [a,b]=points;
    const c=points.find(point=>Math.abs(side(a,b,point))>1e-7);
    if (!c) return null;
    const determinant=side(a,b,c);
    const dx=((b[2]-a[2])*(c[1]-a[1])-(c[2]-a[2])*(b[1]-a[1]))/determinant;
    const dy=((b[0]-a[0])*(c[2]-a[2])-(c[0]-a[0])*(b[2]-a[2]))/determinant;
    const area=points.reduce((sum,point,i)=>sum+side([0,0],point,points[(i+1)%points.length]),0);
    return {points,sign:Math.sign(area),box:bounds(points),depth:([x,y])=>a[2]+dx*(x-a[0])+dy*(y-a[1])};
  });
  const edges=faces.map(()=>[]);
  const incoming=faces.map(()=>0);
  for(let i=0;i<geometry.length;i++){
    const a=geometry[i];
    if (!a) continue;
    for(let j=i+1;j<geometry.length;j++){
      const b=geometry[j];
      if (!b || a.box.max.slice(0,2).some((max,k)=>max<=b.box.min[k] || b.box.max[k]<=a.box.min[k])) continue;
      const shared=overlap(a,b);
      if (shared.length<3) continue;
      const area=shared.reduce((sum,point,k)=>sum+side([0,0],point,shared[(k+1)%shared.length]),0);
      if (Math.abs(area)<1e-7) continue;
      const delta=shared.reduce((sum,p)=>sum+a.depth(p)-b.depth(p),0)/shared.length;
      if (Math.abs(delta)<1e-7) continue;
      const back=delta>0?j:i, front=delta>0?i:j;
      edges[back].push(front);
      incoming[front]++;
    }
  }
  const output=[];
  while(output.length<faces.length){
    let i=incoming.findIndex(count=>count===0);
    // Intersecting geometry can create a painter cycle. Retain depth order for that break.
    if (i===-1) i=incoming.findIndex(count=>count>0);
    incoming[i]=-1;
    output.push(faces[i]);
    edges[i].forEach(index=>{if(incoming[index]>0) incoming[index]--;});
  }
  return output;
}

const side=(a,b,p)=>(b[0]-a[0])*(p[1]-a[1])-(b[1]-a[1])*(p[0]-a[0]);

function overlap(a,b) {
  let shape=a.points;
  for(let i=0;i<b.points.length && shape.length;i++){
    const start=b.points[i], end=b.points[(i+1)%b.points.length];
    const clipped=[];
    for(let j=0;j<shape.length;j++){
      const p=shape[j], q=shape[(j+1)%shape.length];
      const here=b.sign*side(start,end,p), there=b.sign*side(start,end,q);
      if(here>=0) clipped.push(p);
      if((here>=0)!==(there>=0)){
        const t=here/(here-there);
        clipped.push([p[0]+(q[0]-p[0])*t,p[1]+(q[1]-p[1])*t]);
      }
    }
    shape=clipped;
  }
  return shape;
}

function shade(color,multiplier) {
  const value = parseInt(color.slice(1),16);
  return 'rgb(' + [16,8,0].map(shift => Math.round(((value >> shift) & 255)*multiplier)).join(',') + ')';
}

/** @param {QreaseeHit} face */
function drawMaterialTexture(face) {
  const material=face.object.material;
  const preset=material?materialById.get(material):null;
  if (!preset||preset.pattern==='paint'||face.points.length<3) return;
  const world=face.world&&face.world.length===face.points.length?face.world:[];
  if (world.length<3) return;
  const origin=world[0];
  let u=null;
  for (let i=1;i<world.length;i++) {
    const delta=[world[i][0]-origin[0],world[i][1]-origin[1],world[i][2]-origin[2]];
    const length=Math.hypot(delta[0],delta[1],delta[2]);
    if (length>1e-6) {u=delta.map(value=>value/length);break;}
  }
  const normal=u?faceNormal(world):null;
  if (!u||!normal) return;
  const cross=[normal[1]*u[2]-normal[2]*u[1],normal[2]*u[0]-normal[0]*u[2],
    normal[0]*u[1]-normal[1]*u[0]];
  const crossLength=Math.hypot(cross[0],cross[1],cross[2]);
  if (crossLength<1e-6) return;
  const v=cross.map(value=>value/crossLength);
  const plane=world.map(point=>{
    const delta=[point[0]-origin[0],point[1]-origin[1],point[2]-origin[2]];
    return [dotPoint(delta,u),dotPoint(delta,v)];
  });
  const minU=Math.min(...plane.map(point=>point[0])),maxU=Math.max(...plane.map(point=>point[0]));
  const minV=Math.min(...plane.map(point=>point[1])),maxV=Math.max(...plane.map(point=>point[1]));
  const spanU=maxU-minU,spanV=maxV-minV;
  if (spanU<1e-4||spanV<1e-4) return;
  const at=(a,b)=>/** @type {QreaseePoint} */ ([
    origin[0]+u[0]*a+v[0]*b,origin[1]+u[1]*a+v[1]*b,origin[2]+u[2]*a+v[2]*b]);
  const project=(a,b)=>stagePoint(at(a,b));
  const scaleCm=safeScale(face.object.material_scale||preset.tileCm);
  const tile=Math.max(.02,scaleCm/100,spanU/220,spanV/220);
  let seed=2166136261;
  for (const character of face.object.id+preset.pattern) {
    seed^=character.charCodeAt(0);
    seed=Math.imul(seed,16777619);
  }
  const random=()=>{
    seed=(Math.imul(seed,1664525)+1013904223)>>>0;
    return seed/4294967296;
  };
  const xs=face.points.map(point=>point[0]),ys=face.points.map(point=>point[1]);
  const left=Math.min(...xs),right=Math.max(...xs),top=Math.min(...ys),bottom=Math.max(...ys);
  ctx.save();
  polygon(face.points);
  ctx.clip();
  const line=(a1,b1,a2,b2,color,width=.85)=>{
    const first=project(a1,b1),second=project(a2,b2);
    if (!Number.isFinite(first[0])||!Number.isFinite(second[0])) return;
    ctx.strokeStyle=color;ctx.lineWidth=width;
    ctx.beginPath();ctx.moveTo(first[0],first[1]);ctx.lineTo(second[0],second[1]);ctx.stroke();
  };
  const rows=(step,color='#00000038')=>{
    for (let value=Math.ceil(minV/step)*step;value<=maxV;value+=step)
      line(minU,value,maxU,value,color);
  };
  if (preset.pattern==='image') {
    const image=materialImages.get(material);
    if (image&&image.complete&&image.naturalWidth) {
      const centerU=(minU+maxU)/2,centerV=(minV+maxV)/2;
      const base=project(centerU,centerV),alongU=project(centerU+1,centerV),
        alongV=project(centerU,centerV+1);
      const perPixel=tile/image.naturalWidth;
      const mx=(alongU[0]-base[0])*perPixel,my=(alongU[1]-base[1])*perPixel;
      const nx=(alongV[0]-base[0])*perPixel,ny=(alongV[1]-base[1])*perPixel;
      if (Number.isFinite(mx)&&Number.isFinite(my)&&Number.isFinite(nx)&&
          Number.isFinite(ny)&&Math.abs(mx*ny-my*nx)>1e-9) {
        const pattern=ctx.createPattern(image,'repeat');
        if (pattern&&pattern.setTransform&&typeof DOMMatrix!=='undefined') {
          pattern.setTransform(new DOMMatrix([mx,my,nx,ny,base[0],base[1]]));
          ctx.fillStyle=pattern;
          ctx.fillRect(left,top,right-left,bottom-top);
        } else {
          const step=Math.max(tile,spanU/24,spanV/24);
          const scale=(step/tile);
          ctx.transform(mx*scale,my*scale,nx*scale,ny*scale,base[0],base[1]);
          const startU=Math.floor((minU-centerU)/step),endU=Math.ceil((maxU-centerU)/step);
          const startV=Math.floor((minV-centerV)/step),endV=Math.ceil((maxV-centerV)/step);
          for (let row=startV;row<=endV;row++) for (let column=startU;column<=endU;column++)
            ctx.drawImage(image,column*image.naturalWidth,row*image.naturalHeight);
        }
      }
    }
    ctx.restore();
    return;
  }
  const color=preset.color||'#cccccc';
  const light=(Number('0x'+color.slice(1,3))*299+Number('0x'+color.slice(3,5))*587+
    Number('0x'+color.slice(5,7))*114)/1000>140;
  if (preset.pattern==='brick') {
    const row=tile*.5;
    rows(row,'#00000042');
    for (let value=Math.ceil(minV/row)*row;value<=maxV;value+=row) {
      const offset=Math.round(value/row)%2?tile*.5:0;
      for (let a=Math.ceil((minU-offset)/tile)*tile+offset;a<=maxU;a+=tile)
        line(a,value,a,Math.min(maxV,value+row),'#00000038');
    }
  } else if (preset.pattern==='block') {
    const row=tile*.4,width=tile*.8;
    rows(row,'#00000036');
    for (let value=Math.ceil(minV/row)*row;value<=maxV;value+=row) {
      const offset=Math.round(value/row)%2?width*.5:0;
      for (let a=Math.ceil((minU-offset)/width)*width+offset;a<=maxU;a+=width)
        line(a,value,a,Math.min(maxV,value+row),'#00000030');
    }
  } else if (preset.pattern==='timber') {
    for (let value=Math.ceil(minV/tile)*tile;value<=maxV;value+=tile) {
      line(minU,value,maxU,value,'#0000003c',1);
      line(minU,value+tile*.18,maxU,value+tile*.18,'#00000024',.6);
      line(minU,value+tile*.46,maxU,value+tile*.46,'#00000018',.6);
      line(minU,value+tile*.72,maxU,value+tile*.72,'#ffffff1c',.6);
    }
  } else if (preset.pattern==='zinc'||preset.pattern==='metal') {
    for (let a=Math.ceil(minU/tile)*tile;a<=maxU;a+=tile) {
      line(a,minV,a,maxV,'#00000036');
      line(a+tile*.03,minV,a+tile*.03,maxV,'#ffffff50',.8);
    }
  } else if (preset.pattern==='tile') {
    const row=tile*.42,width=tile*.55;
    rows(row,'#00000044');
    for (let value=Math.ceil(minV/row)*row;value<=maxV;value+=row) {
      const offset=Math.round(value/row)%2?width*.5:0;
      for (let a=Math.ceil((minU-offset)/width)*width+offset;a<=maxU;a+=width) {
        line(a,value,a,Math.min(maxV,value+row),'#00000038');
        line(a+.008,value,a+.008,Math.min(maxV,value+row),'#ffffff40',.7);
      }
    }
  } else if (preset.pattern==='ceramic') {
    const grout=light?'#0000002e':'#ffffff26',bevel=light?'#ffffff55':'#00000030';
    for (let a=Math.ceil(minU/tile)*tile;a<=maxU;a+=tile) {
      line(a,minV,a,maxV,grout,1.1);
      line(a+.012,minV,a+.012,maxV,bevel,.6);
    }
    for (let value=Math.ceil(minV/tile)*tile;value<=maxV;value+=tile) {
      line(minU,value,maxU,value,grout,1.1);
      line(minU,value+.012,maxU,value+.012,bevel,.6);
    }
  } else if (preset.pattern==='glass') {
    ctx.fillStyle='#ffffff12';ctx.fillRect(left,top,right-left,bottom-top);
    const step=tile*1.4;
    for (let offset=minV-minU;offset<=maxV-minU;offset+=step)
      line(minU,minU+offset,maxU,maxU+offset,'#ffffff3a',1.2);
  } else if (preset.pattern==='grass'||preset.pattern==='sand'||preset.pattern==='asphalt') {
    const count=clamp(Math.round(spanU*spanV/(tile*tile)*6),16,140);
    for (let i=0;i<count;i++) {
      const point=project(minU+random()*spanU,minV+random()*spanV);
      if (!Number.isFinite(point[0])) continue;
      if (preset.pattern==='grass') {
        ctx.strokeStyle=i%3?'#ffffff42':'#00000038';ctx.lineWidth=.8;
        ctx.beginPath();ctx.moveTo(point[0],point[1]);
        ctx.lineTo(point[0]+(random()-.5)*2,point[1]-2-random()*3);ctx.stroke();
      } else {
        ctx.fillStyle=i%3?'#ffffff45':(preset.pattern==='asphalt'?'#0000004a':'#00000028');
        ctx.beginPath();ctx.arc(point[0],point[1],random()*1.4+.5,0,Math.PI*2);ctx.fill();
      }
    }
  }
  ctx.restore();
}

/** @param {QreaseePoint[]} face @returns {number} */
function smoothTone(face) {
  const [a,b,c]=face;
  const ab=[b[0]-a[0],b[1]-a[1],b[2]-a[2]];
  const ac=[c[0]-a[0],c[1]-a[1],c[2]-a[2]];
  const normal=[ab[1]*ac[2]-ab[2]*ac[1],ab[2]*ac[0]-ab[0]*ac[2],ab[0]*ac[1]-ab[1]*ac[0]];
  const length=Math.hypot(normal[0],normal[1],normal[2])||1;
  return .68+.24*Math.abs((normal[0]*.55+normal[1]*.45)/length);
}

function drawGrid(width,height) {
  const dark=document.body.dataset.theme!=='light';
  const minor=dark?'#3f4447':'#c4cfd1';
  const major=dark?'#51575b':'#acb9bd';
  const xAxis=dark?'#5b8a76':'#619a83';
  const yAxis=dark?'#9c6661':'#bd7f78';
  const samples=[];
  for(let i=0;i<=4;i++) for(let j=0;j<=4;j++) {
    const point=ground([width*i/4,height*j/4]);
    if(point) samples.push(point);
  }
  if (!samples.length) return;
  const corners=samples;
  const {min,max} = bounds(corners);
  const gridLine=(start,end,color,weight)=>{
    const a=stagePoint(start), b=stagePoint(end);
    if (Number.isFinite(a[0]) && Number.isFinite(b[0])) strokeLine(a,b,color,weight);
  };
  const step = Math.max(1, 10**Math.ceil(Math.log10(Math.max(max[0]-min[0],max[1]-min[1])/150)));
  for (let x=Math.floor(min[0]/step)*step; x<=max[0]; x+=step) {
    gridLine([x,min[1],0],[x,max[1],0],
      x === 0 ? xAxis : x%(5*step)===0 ? major : minor, x === 0 ? 1.1 : .75);
  }
  for (let y=Math.floor(min[1]/step)*step; y<=max[1]; y+=step) {
    gridLine([min[0],y,0],[max[0],y,0],
      y === 0 ? yAxis : y%(5*step)===0 ? major : minor, y === 0 ? 1.1 : .75);
  }
}

function svg(name, attributes={}, content) {
  const element = document.createElementNS(svgNS,name);
  for (const [key,value] of Object.entries(attributes)) element.setAttribute(key,value);
  if (content !== undefined) element.textContent = content;
  return element;
}

function drawAxes() {
  const holder = $('#orientation');
  const axes = svg('svg',{viewBox:'0 0 83 76','aria-hidden':true});
  const orientation=cameraAxes();
  const project=point=>orientation.map(axis=>axis.reduce((sum,value,i)=>sum+value*point[i],0));
  axes.append(svg('circle',{cx:42,cy:37,r:30,fill:'#f9fbfc',stroke:'#b9c2ca'}));
  [[1,0,0,'X','#ae554d'],[0,1,0,'Y','#2c725a'],[0,0,1,'Z','#395f9a']].forEach(([x,y,z,label,color]) => {
    const [dx,dy] = project([x,y,z]);
    if (Math.hypot(dx,dy)<.01) return;
    const a = [42+dx*19,37+dy*19];
    axes.append(svg('line',{x1:42,y1:37,x2:a[0],y2:a[1],stroke:color,'stroke-width':1.4}));
    axes.append(svg('text',{x:42+dx*24,y:39+dy*24,'text-anchor':'middle',fill:color,'font-size':8,'font-weight':700},label));
  });
  axes.append(svg('circle',{cx:42,cy:37,r:2,fill:'#35404d'}));
  holder.replaceChildren(axes);
}

function draw() {
  frame = 0;
  if (state.layout) return;
  const width = canvas.clientWidth, height = canvas.clientHeight;
  const pixel = Math.min(2,window.devicePixelRatio || 1);
  if (!width || !height) return;
  canvas.width = Math.max(1, Math.round(width*pixel));
  canvas.height = Math.max(1, Math.round(height*pixel));
  ctx.setTransform(pixel,0,0,pixel,0,0);
  const dark=document.body.dataset.theme!=='light';
  const backdrop = ctx.createLinearGradient(0,0,0,height);
  backdrop.addColorStop(0,dark?'#353a3d':'#f2f4f4');
  backdrop.addColorStop(1,dark?'#23272a':'#d4dcdd');
  ctx.fillStyle = backdrop;
  ctx.fillRect(0,0,width,height);
  drawGrid(width,height);
  const drag = state.drag;
  const pending = state.drawPending;
  if (state.doc) {
    let meshes = state.meshes, objects = state.doc.objects;
    const updates=drag?.updates || pending?.updates || state.movePending?.updates || state.rotatePending?.updates;
    if (updates) {
      const preview=new Map(updates.map(object=>[object.id,object]));
      meshes=objects.map((object,i)=>preview.has(object.id)?previewMesh(preview.get(object.id)):meshes[i]);
      objects=objects.map(object=>preview.get(object.id)||object);
    }
    const sceneKey=updates?null:JSON.stringify([width,height,camera.yaw,camera.pitch,
      camera.axes,camera.center,camera.x,camera.y,camera.scale,camera.distance,camera.perspective,
      state.doc.sections||[], state.sectionPending?.origin, state.sectionPending?.normal,
      sectionDragPreview?.origin, state.showHidden]);
    if (sceneCache && !updates && sceneCache.meshes===meshes && sceneCache.objects===objects &&
        sceneCache.key===sceneKey) state.hits=sceneCache.faces;
    else {
      state.hits=scene(meshes,objects,stagePoint);
      if(!updates) sceneCache={meshes,objects,key:sceneKey,faces:state.hits};
    }
    const pocketFloors=new Map(state.hits.filter(face=>face.object.opening_id &&
      face.object.surface_role==='pocket').map(face=>[face.object.opening_id,face.object]));
    const segmentKey=(a,b)=>{
      const first=a.map(value=>Math.round(value*10000)/10000);
      const second=b.map(value=>Math.round(value*10000)/10000);
      return JSON.stringify([first,second].sort());
    };
    const pocketRim=new Set();
    if (pocketFloors.size) {
      for (const face of state.hits) {
        const object=face.object;
        const floor=pocketFloors.get(object?.opening_id);
        if (!floor||object.surface_role!=='side'||face.world.length<2) continue;
        const origin=object.opening_origin||floor.opening_origin||[floor.x,floor.y,floor.z];
        const normal=surfaceNormal(floor);
        const onPlane=point=>Math.abs(dotPoint([point[0]-origin[0],point[1]-origin[1],
          point[2]-origin[2]],normal))<1e-4;
        for (let index=0;index<face.world.length;index++) {
          const next=(index+1)%face.world.length;
          if (onPlane(face.world[index])&&onPlane(face.world[next]))
            pocketRim.add(segmentKey(face.world[index],face.world[next]));
        }
      }
    }
    for (const face of state.hits) {
      const selected = state.selected.has(targetId(face.object));
      const hovered = !selected && state.hoverKey &&
        (state.hoverKey===face.key || (face.smooth && state.hoverKey===face.object.id));
      polygon(face.points);
      if (face.points.length > 2) {
        const hiddenFace=state.showHidden&&face.object.hidden;
        const grayFace=state.showHidden&&!face.object.hidden;
        const outsideContext=Boolean(state.inside)&&face.object.container?.id!==state.inside;
        const glassFace=face.object.material==='glass'&&!hiddenFace&&!grayFace&&
          !outsideContext&&!face.section;
        ctx.fillStyle = hiddenFace ? shade('#e8932a',Math.max(.8,face.tone)) :
          grayFace||outsideContext ? shade('#aeb4ba',face.tone) :
          shade(face.object.color,face.section ? .9 : face.tone);
        if (glassFace) {
          ctx.save();
          ctx.globalAlpha=.26;
          ctx.fill();
          ctx.restore();
        } else ctx.fill();
        if (!state.showHidden&&!outsideContext) drawMaterialTexture(face);
        if (selected || hovered) {
          ctx.save();
          ctx.fillStyle = selected ? selectionPattern : hoverPattern;
          ctx.fill();
          ctx.restore();
        }
      }
      const hiddenFace=state.showHidden&&face.object.hidden;
      ctx.strokeStyle = hiddenFace ? '#e8932a' : face.section ? '#c87936' :
        state.showHidden ? '#7f8a94' :
        selected ? '#c87936' : dark ? '#aeb3b7' : '#4f5150';
      ctx.lineWidth = hiddenFace ? 1.6 : face.section ? 1.35 : selected ? 1.65 : .8;
      if (!face.smooth && !face.quiet) {
        ctx.beginPath();
        const world=face.world;
        for (let i=0;i<face.points.length;i++) {
          if (face.edges && !face.edges[i]) continue;
          const next=(i+1)%face.points.length;
          if (pocketRim.size&&world.length===face.points.length&&
              pocketRim.has(segmentKey(world[i],world[next]))) continue;
          ctx.moveTo(...face.points[i].slice(0,2));
          ctx.lineTo(...face.points[next].slice(0,2));
        }
        ctx.stroke();
      }
    }
    if (state.tool==='offset'&&state.offsetHover?.edge) {
      const [a,b]=state.offsetHover.edge;
      strokeLine(a,b,'#3a444e',5);
      strokeLine(a,b,'#ffffff',2.5);
    }
    drawSectionPlanes();
    drawModelGrids();
  } else state.hits = [];
  if (state.drag?.tool==='erase' && state.drag.seen?.size) {
    for (const face of state.hits) {
      if (face.object.shape!=='line' || !state.drag.seen.has(face.object.id)) continue;
      polygon(face.points);
      ctx.strokeStyle='#d9534f';
      ctx.lineWidth=2.2;
      ctx.stroke();
    }
  }
  if (drag?.tool==='select' && drag.current) {
    const left=Math.min(drag.start[0],drag.current[0]), top=Math.min(drag.start[1],drag.current[1]);
    const width=Math.abs(drag.current[0]-drag.start[0]), height=Math.abs(drag.current[1]-drag.start[1]);
    const crossing=drag.current[0]<drag.start[0];
    ctx.fillStyle=crossing?'#3677c522':'#168a6522';
    ctx.fillRect(left,top,width,height);
    ctx.save();
    ctx.setLineDash(crossing?[5,4]:[]);
    ctx.strokeStyle=crossing?'#3677c5':'#168a65';
    ctx.lineWidth=1.3;
    ctx.strokeRect(left,top,width,height);
    ctx.restore();
  }
  if (drag?.preview || pending?.preview) {
    const mesh = previewMesh(drag?.preview || pending.preview);
    polygon(mesh.vertices.map(stagePoint));
    if (mesh.faces.length) { ctx.fillStyle = '#f0913b38'; ctx.fill(); }
    ctx.strokeStyle = '#bf671c'; ctx.lineWidth = 1.5; ctx.stroke();
  }
  const measurement=state.measurePending;
  if (measurement) {
    const a=stagePoint(measurement.origin), b=measurement.end?stagePoint(measurement.end):null;
    if (Number.isFinite(a[0]) && (!b || Number.isFinite(b[0]))) {
      ctx.save();
      if (b) {
        strokeLine(a,b,'#bf671c',2);
        for (const [x,y] of [a,b]) {
          ctx.beginPath();ctx.arc(x,y,4,0,Math.PI*2);
          ctx.fillStyle='#fff';ctx.fill();ctx.strokeStyle='#bf671c';ctx.stroke();
        }
        const label=lengthLabel(measurement.distance);
        ctx.font='bold 12px Segoe UI, sans-serif';
        const width=ctx.measureText(label).width+14,height=20;
        const left=clamp(b[0]+10,4,canvas.clientWidth-width-4);
        const top=clamp(b[1]-height-8,4,canvas.clientHeight-height-4);
        ctx.beginPath();
        if (ctx.roundRect) ctx.roundRect(left,top,width,height,4);
        else ctx.rect(left,top,width,height);
        ctx.fillStyle='#fffdf8';ctx.fill();
        ctx.strokeStyle='#bf671c';ctx.lineWidth=1;ctx.stroke();
        ctx.fillStyle='#703b11';ctx.fillText(label,left+7,top+14);
      } else {
        ctx.beginPath();ctx.arc(a[0],a[1],4,0,Math.PI*2);
        ctx.fillStyle='#fff';ctx.fill();ctx.strokeStyle='#bf671c';ctx.stroke();
      }
      ctx.restore();
    }
  }
  if (state.movePending?.destination) {
    const a=stagePoint(state.movePending.start), b=stagePoint(state.movePending.destination);
    if (Number.isFinite(a[0]) && Number.isFinite(b[0])) {
      strokeLine(a,b,'#c87936',1.3);
      for (const [x,y] of [a,b]) {
        ctx.beginPath();ctx.arc(x,y,3.5,0,Math.PI*2);
        ctx.fillStyle='#fff';ctx.fill();ctx.strokeStyle='#c87936';ctx.lineWidth=1.5;ctx.stroke();
      }
    }
  }
  if (state.rotatePending) {
    const pivot=stagePoint(state.rotatePending.pivot);
    if (Number.isFinite(pivot[0])) {
      if (state.rotatePending.destination) {
        const end=stagePoint(state.rotatePending.destination);
        if (Number.isFinite(end[0])) strokeLine(pivot,end,'#c87936',1.3);
      }
      ctx.beginPath();ctx.arc(pivot[0],pivot[1],42,0,Math.PI*2);
      ctx.setLineDash([4,4]);ctx.strokeStyle='#c8793688';ctx.lineWidth=1;ctx.stroke();
      ctx.setLineDash([]);
      ctx.beginPath();ctx.arc(pivot[0],pivot[1],4,0,Math.PI*2);
      ctx.fillStyle='#fff';ctx.fill();ctx.strokeStyle='#c87936';ctx.lineWidth=1.6;ctx.stroke();
    }
  }
  const arcPreview=pending?.previewArc || (drag?.tool==='arc' && drag.end ? [drag.initial,drag.end] : state.arcPending?.preview);
  if (arcPreview?.length>1) {
    ctx.beginPath();
    arcPreview.forEach((world,i)=>{const [x,y]=stagePoint(world);if(i)ctx.lineTo(x,y);else ctx.moveTo(x,y);});
    ctx.strokeStyle='#bf671c';ctx.lineWidth=2;ctx.stroke();
  }
  const linePreview=state.linePending?.preview;
  if (linePreview?.length>1) {
    const a=stagePoint(linePreview[0]), b=stagePoint(linePreview[1]);
    if (Number.isFinite(a[0]) && Number.isFinite(b[0])) {
      strokeLine(a,b,'#bf671c',2);
      for (const [x,y] of [a,b]) {
        ctx.beginPath();ctx.arc(x,y,3.5,0,Math.PI*2);
        ctx.fillStyle='#fff';ctx.fill();ctx.strokeStyle='#bf671c';ctx.lineWidth=1.5;ctx.stroke();
      }
    }
  }
  const offsetContour=state.drag?.tool==='offset'?state.drag.contour:state.offsetPending?.contour;
  if (offsetContour?.length) {
    polygon(offsetContour.map(stagePoint));
    ctx.strokeStyle='#bf671c';ctx.lineWidth=2;ctx.stroke();
  }
  if (state.offsetPending?.contour) {
    const pending=state.offsetPending;
    const a=stagePoint(pending.origin);
    const b=stagePoint([pending.origin[0]+pending.normal[0]*pending.distance,
      pending.origin[1]+pending.normal[1]*pending.distance,pending.z]);
    if (Number.isFinite(a[0]) && Number.isFinite(b[0])) {
      strokeLine(a,b,'#bf671c',1.2);
      for (const [x,y] of [a,b]) {
        ctx.beginPath();ctx.arc(x,y,3.5,0,Math.PI*2);
        ctx.fillStyle='#fff';ctx.fill();ctx.strokeStyle='#bf671c';ctx.lineWidth=1.5;ctx.stroke();
      }
    }
  }
  if (drag?.tool==='move' && drag.updates) {
    const anchor=stagePoint([drag.anchor[0]+drag.delta[0],drag.anchor[1]+drag.delta[1],drag.elevation]);
    if (Number.isFinite(anchor[0])) {
      ctx.beginPath();ctx.arc(anchor[0],anchor[1],5,0,Math.PI*2);
      ctx.fillStyle='#fff';ctx.fill();ctx.strokeStyle='#bf671c';ctx.lineWidth=2;ctx.stroke();
    }
  }
  if (drag?.tool==='rotate') {
    const pivot=stagePoint(drag.pivot);
    if (Number.isFinite(pivot[0])) {
      strokeLine(pivot,drag.cursor||drag.start,'#c87936',1.4);
      ctx.beginPath();
      ctx.arc(pivot[0],pivot[1],5,0,Math.PI*2);
      ctx.stroke();
    }
  }
  const snapLabel=state.inference?.label || '';
  $('#snap-feedback').textContent=snapLabel;
  $('#snap-feedback').dataset.kind=snapLabel==='Ujung'?'endpoint':
    snapLabel==='Titik tengah'?'midpoint':snapLabel==='Perpotongan'?'intersection':'';
  if (state.inference) {
    const [x,y]=stagePoint(state.inference.world);
    if (Number.isFinite(x)) {
      ctx.beginPath();
      if (state.inference.label==='Ujung') ctx.rect(x-4,y-4,8,8);
      else ctx.arc(x,y,4,0,Math.PI*2);
      ctx.fillStyle='#fff';
      ctx.fill();
      ctx.strokeStyle=snapLabel==='Ujung'?'#f0913b':snapLabel==='Titik tengah'?'#e6bf19':
        snapLabel==='Perpotongan'?'#9b59b6':'#00856d';
      ctx.lineWidth=2;
      ctx.stroke();
    }
  }
  $('#zoom-label').textContent = Math.round((camera.perspective
    ? camera.baseDistance/camera.distance : camera.scale/camera.base)*100) + '%';
  for (const peer of state.peers) {
    if (peer.cursor?.mode!=='model') continue;
    if (peer.cursor.line?.a && peer.cursor.line?.b) {
      const a=stagePoint(peer.cursor.line.a), b=stagePoint(peer.cursor.line.b);
      if (Number.isFinite(a[0]) && Number.isFinite(b[0])) {
        ctx.save();
        ctx.setLineDash([4,3]);
        strokeLine(a,b,'#673dac',1.4);
        ctx.restore();
      }
    }
    const [x,y]=stagePoint([peer.cursor.x,peer.cursor.y,peer.cursor.z ?? 0]);
    if(!Number.isFinite(x)) continue;
    polygon([[x,y],[x+4,y+12],[x+7,y+7],[x+13,y+7]]);
    ctx.fillStyle='#673dac';
    ctx.fill();
    ctx.font='11px Segoe UI, sans-serif';
    const name=peer.name||'Tamu';
    ctx.fillRect(x+10,y+11,ctx.measureText(name).width+10,16);
    ctx.fillStyle='#fff';
    ctx.fillText(name,x+15,y+22);
  }
  drawCommentPins();
  drawAxes();
}

/** @param {QreaseeObject} object @returns {QreaseeMesh} */
function previewMesh(object) {
  if(object.shape==='mesh' && object.geometry){
    const angle=object.rotation*Math.PI/180, sin=Math.sin(angle), cos=Math.cos(angle);
    const spans=[object.width,object.depth,object.height].map((size,axis)=>{
      const positions=object.geometry.vertices.map(point=>point[axis]);
      const original=Math.max(...positions)-Math.min(...positions);
      return original<1e-9?1:size/original;
    });
    return {vertices:object.geometry.vertices.map(([x,y,z])=>/** @type {QreaseePoint} */ ([
      object.x+x*spans[0]*cos-y*spans[1]*sin,
      object.y+x*spans[0]*sin+y*spans[1]*cos,
      object.z+z*spans[2]])),
      faces:object.geometry.faces,cut:false};
  }
  if (object.shape==='circle' && object.surface_role==='side') {
    if (object.height<=0) return {vertices:[],faces:[],cut:false};
    const w=object.width/2, d=object.depth/2;
    if (object.wall_axis) {
      const angle=object.rotation*Math.PI/180, sin=Math.sin(angle), cos=Math.cos(angle);
      const [ux,uy]=object.wall_axis;
      const u=[ux*cos-uy*sin,ux*sin+uy*cos],n=[u[1],-u[0]];
      /** @type {QreaseePoint[]} */
      const bottom=Array.from({length:48},(_,i)=>{
        const theta=i*Math.PI/24, along=w*Math.cos(theta), vertical=d*Math.sin(theta);
        return [object.x+along*u[0],object.y+along*u[1],object.z+vertical];
      });
      const vertices=/** @type {QreaseePoint[]} */ ([
        ...bottom,
        ...bottom.map(point=>/** @type {QreaseePoint} */ ([
          point[0]+n[0]*object.height,point[1]+n[1]*object.height,point[2]]))
      ]);
      const faces=Array.from({length:48},(_,i)=>[i,(i+1)%48,(i+1)%48+48,i+48]);
      return {vertices,faces,cut:false};
    }
    const angle=object.rotation*Math.PI/180, sin=Math.sin(angle), cos=Math.cos(angle);
    const outline=Array.from({length:48},(_,i)=>{
      const theta=i*Math.PI/24;
      return [object.x+w*Math.cos(theta)*cos-d*Math.sin(theta)*sin,
        object.y+w*Math.cos(theta)*sin+d*Math.sin(theta)*cos];
    });
    const vertices=/** @type {QreaseePoint[]} */ ([
      ...outline.map(point=>/** @type {QreaseePoint} */ ([point[0],point[1],object.z])),
      ...outline.map(point=>/** @type {QreaseePoint} */ ([point[0],point[1],object.z+object.height]))
    ]);
    const faces=Array.from({length:48},(_,i)=>[i,(i+1)%48,(i+1)%48+48,i+48]);
    return {vertices,faces,cut:false};
  }
  if (object.plane_u && object.plane_v && object.profile) {
    const u=object.plane_u,v=object.plane_v,normal=surfaceNormal(object);
    const vertices=object.profile.points.map(([a,b])=>/** @type {QreaseePoint} */ ([
      object.x+u[0]*a*object.width+v[0]*b*object.depth,
      object.y+u[1]*a*object.width+v[1]*b*object.depth,
      object.z+u[2]*a*object.width+v[2]*b*object.depth]));
    const top=QreaseeLine.triangulate(object.profile.points);
    const faces=object.height>0?top.map(face=>[...face].reverse()):top.map(face=>[...face]);
    if(object.height>0){
      const count=vertices.length;
      vertices.push(...vertices.map(point=>offsetPoint(point,normal.map(value=>value*object.height))));
      for(let i=0;i<count;i++) faces.push([i,(i+1)%count,(i+1)%count+count,i+count]);
      faces.push(...top.map(face=>face.map(index=>index+count)));
    }
    return {vertices,faces,cut:false};
  }
  if (object.wall_axis) {
    const angle=object.rotation*Math.PI/180;
    const cos=Math.cos(angle),sin=Math.sin(angle);
    const [ux,uy]=object.wall_axis;
    const u=[ux*cos-uy*sin,ux*sin+uy*cos], n=[u[1],-u[0]];
    const w=object.width/2,d=object.depth/2;
    /** @type {QreaseePoint2[]} */
    const outline=object.shape==='circle'
      ? Array.from({length:48},(_,i)=>{const theta=i*Math.PI/24;return [w*Math.cos(theta),d*Math.sin(theta)];})
      : [[-w,-d],[w,-d],[w,d],[-w,d]];
    const count=outline.length;
    /** @type {QreaseePoint[]} */
    const vertices=outline.map(([along,vertical])=>
      /** @type {QreaseePoint} */ ([object.x+along*u[0],object.y+along*u[1],object.z+vertical]));
    /** @type {number[][]} */
    const faces=[Array.from({length:count},(_,i)=>i)];
    if (object.height>0) {
      vertices.push(...vertices.map(([x,y,z])=>/** @type {QreaseePoint} */ ([x+object.height*n[0],y+object.height*n[1],z])));
      faces.splice(0,1,Array.from({length:count},(_,i)=>count-1-i));
      for(let i=0;i<count;i++) faces.push([i,(i+1)%count,(i+1)%count+count,i+count]);
      faces.push(Array.from({length:count},(_,i)=>i+count));
    }
    return {vertices,faces,cut:false};
  }
  const w=object.width/2, d=object.depth/2;
  const angle=object.rotation*Math.PI/180, sin=Math.sin(angle), cos=Math.cos(angle);
  /** @type {QreaseePoint2[]} */
  const outline = object.shape === 'line' ? [[-w,-d],[w,d]]
    : object.shape === 'rectangle' ? [[-w,-d],[w,-d],[w,d],[-w,d]]
    : object.shape==='polygon' ? object.profile.points.map(([x,y])=>[x*object.width,y*object.depth])
    : Array.from({length:48},(_,i) => [w*Math.cos(i*Math.PI/24),d*Math.sin(i*Math.PI/24)]);
  /** @param {number} z @returns {QreaseePoint[]} */
  const layer = z => outline.map(([x,y]) => [object.x+x*cos-y*sin,object.y+x*sin+y*cos,z]);
  const n=outline.length;
  const vertices=layer(object.z);
  /** @type {number[][]} */
  const faces=[];
  if (object.shape==='line') {
    vertices[1][2]+=object.height || 0;
    return {vertices,faces,cut:false};
  }
  if (n>2) {
    const base=Array.from({length:n},(_,i)=>i);
    const top=object.shape==='polygon'
      ? QreaseeLine.triangulate(object.profile.points) : [base];
    if (object.height>0) {
      vertices.push(...layer(object.z+object.height));
      faces.push(...top.map(face=>[...face].reverse()),...base.map(i=>[i,(i+1)%n,(i+1)%n+n,i+n]),
        ...top.map(face=>face.map(i=>i+n)));
    } else faces.push(...top);
  }
  return {vertices,faces,cut:false};
}

function contains(point,polygonPoints) {
  if (polygonPoints.length === 2) {
    const [[ax,ay],[bx,by]] = polygonPoints;
    const dx=bx-ax, dy=by-ay;
    const t=clamp(((point[0]-ax)*dx+(point[1]-ay)*dy)/Math.max(.01,dx*dx+dy*dy),0,1);
    return Math.hypot(point[0]-ax-t*dx,point[1]-ay-t*dy)<6;
  }
  let inside = false;
  const [x,y] = point;
  for (let i=0,j=polygonPoints.length-1;i<polygonPoints.length;j=i++) {
    const [a,b]=polygonPoints[i], [c,d]=polygonPoints[j];
    if ((b>y)!==(d>y) && x<(c-a)*(y-b)/(d-b)+a) inside=!inside;
  }
  return inside;
}

/** @param {PointerEvent} event @returns {QreaseePoint2} */
function pointer(event) {
  const rect=canvas.getBoundingClientRect();
  return [event.clientX-rect.left,event.clientY-rect.top];
}

/** @param {QreaseePoint2} point @param {boolean} preferLine @returns {QreaseeHit|undefined} */
function pickFace(point, preferLine) {
  const face=state.hits.findLast(candidate=>contains(point,candidate.points));
  if (preferLine && face?.object.shape==='polygon' && face.object.height===0) {
    return state.hits.findLast(candidate=>candidate.object.shape==='line'
      && Math.abs(candidate.object.z-face.object.z)<.00001
      && contains(point,candidate.points)) || face;
  }
  return face;
}

/** @param {QreaseePoint2} point @param {number[][]} points @returns {number} */
function pointToPolygonEdge(point,points) {
  let best=Infinity;
  for (let i=0;i<points.length;i++) {
    const a=points[i],b=points[(i+1)%points.length];
    const abx=b[0]-a[0],aby=b[1]-a[1];
    const length=abx*abx+aby*aby;
    const t=length>1e-9?clamp(((point[0]-a[0])*abx+(point[1]-a[1])*aby)/length,0,1):0;
    best=Math.min(best,Math.hypot(point[0]-a[0]-abx*t,point[1]-a[1]-aby*t));
  }
  return best;
}

/** @param {QreaseeHit} face @param {{normal: QreaseePoint2}} wall @returns {boolean} */
function verticalFaceVisible(face,wall) {
  const point=face.world[0],depth=cameraAxes()[2];
  if (camera.perspective) {
    const eye=camera.center.map((value,i)=>value+camera.distance*depth[i]);
    return wall.normal[0]*(eye[0]-point[0])+wall.normal[1]*(eye[1]-point[1])>1e-5;
  }
  return wall.normal[0]*depth[0]+wall.normal[1]*depth[1]>1e-5;
}

/** @param {QreaseePoint2} point @returns {{face: QreaseeHit|undefined, wall: {origin: QreaseePoint, axis: QreaseePoint2, normal: QreaseePoint2}|null}} */
function pickRectangleFace(point) {
  let containing=null,fallback=null;
  for (let index=0;index<state.hits.length;index++) {
    const face=state.hits[index];
    if (face.world.length<3) continue;
    const wall=QreaseeLine.verticalWall(face.world);
    if (!wall || !verticalFaceVisible(face,wall)) continue;
    if (contains(point,face.points)) containing={face,wall};
    const distance=pointToPolygonEdge(point,face.points);
    if (distance<=snapRadius &&
        (!fallback || index>fallback.index ||
          (index===fallback.index && distance<fallback.distance)))
      fallback={face,wall,distance,index};
  }
  if (containing) return {face:containing.face,wall:containing.wall};
  if (fallback) return {face:fallback.face,wall:fallback.wall};
  return {face:pickFace(point,false),wall:null};
}

function orbitPivot(point) {
  const face=pickFace(point,false);
  if (!face) {
    const xy=ground(point,camera.center[2]);
    return xy ? [...xy,camera.center[2]] : [...camera.center];
  }
  if (face.world.length<3) {
    const xy=ground(point,face.object.z);
    return xy ? [...xy,face.object.z] : [...face.world[0]];
  }
  const [right,down,depth]=cameraAxes();
  const u=(point[0]-canvas.clientWidth/2-camera.x)/camera.scale;
  const v=(point[1]-canvas.clientHeight/2-camera.y)/camera.scale;
  const origin=camera.perspective
    ? camera.center.map((value,i)=>value+camera.distance*depth[i])
    : camera.center.map((value,i)=>value+u*right[i]+v*down[i]);
  const ray=camera.perspective
    ? depth.map((value,i)=>u*right[i]+v*down[i]-camera.distance*value)
    : depth;
  const [a,b,c]=face.world;
  const ab=b.map((value,i)=>value-a[i]), ac=c.map((value,i)=>value-a[i]);
  const normal=[ab[1]*ac[2]-ab[2]*ac[1],ab[2]*ac[0]-ab[0]*ac[2],ab[0]*ac[1]-ab[1]*ac[0]];
  const dot=(left,right)=>left.reduce((sum,value,i)=>sum+value*right[i],0);
  const divisor=dot(normal,ray);
  if (Math.abs(divisor)<1e-9) return [...a];
  const t=dot(normal,a.map((value,i)=>value-origin[i]))/divisor;
  if (!Number.isFinite(t) || (camera.perspective && t<0)) return [...a];
  return origin.map((value,i)=>value+t*ray[i]);
}

/** @param {QreaseePoint2} point @param {QreaseePoint} origin @param {QreaseePoint2} horizontalNormal @returns {QreaseePoint|null} */
function pointOnVerticalPlane(point,origin,horizontalNormal) {
  const [right,down,depth]=cameraAxes();
  const u=(point[0]-canvas.clientWidth/2-camera.x)/camera.scale;
  const v=(point[1]-canvas.clientHeight/2-camera.y)/camera.scale;
  const eye=camera.perspective
    ? camera.center.map((value,i)=>value+camera.distance*depth[i])
    : camera.center.map((value,i)=>value+u*right[i]+v*down[i]);
  const ray=camera.perspective
    ? depth.map((value,i)=>u*right[i]+v*down[i]-camera.distance*value)
    : depth;
  const divisor=horizontalNormal[0]*ray[0]+horizontalNormal[1]*ray[1];
  if (Math.abs(divisor)<1e-8) return null;
  const t=(horizontalNormal[0]*(origin[0]-eye[0])+horizontalNormal[1]*(origin[1]-eye[1]))/divisor;
  if (!Number.isFinite(t) || (camera.perspective && t<0)) return null;
  return /** @type {QreaseePoint} */ (eye.map((value,i)=>value+t*ray[i]));
}

/** @param {QreaseePoint} world @param {QreaseePoint} origin @param {QreaseePoint2} normal */
function onVerticalPlane(world,origin,normal) {
  return Math.abs((world[0]-origin[0])*normal[0]+(world[1]-origin[1])*normal[1])<1e-4;
}

/** @param {QreaseePoint2} point @param {{origin: QreaseePoint, axis: QreaseePoint2, normal: QreaseePoint2}} wall @param {QreaseePoint=} base @returns {QreaseeInference|null} */
function wallDrawingPoint(point,wall,base) {
  const hit=infer(point,undefined,new Set(),world=>onVerticalPlane(world,wall.origin,wall.normal));
  if (hit) return hit;
  const raw=pointOnVerticalPlane(point,wall.origin,wall.normal);
  if (!raw) return null;
  if (!state.snapping) return {world:raw,label:'Bidang vertikal'};
  const anchor=base??wall.origin;
  const along=snap((raw[0]-anchor[0])*wall.axis[0]+(raw[1]-anchor[1])*wall.axis[1]);
  const vertical=snap(raw[2]-anchor[2]);
  return {world:[anchor[0]+along*wall.axis[0],anchor[1]+along*wall.axis[1],anchor[2]+vertical],
    label:'Grid '+lengthLabel(.25)};
}

/** @param {number[]} point @param {number[]} a @param {number[]} b @returns {number} */
function distanceToSegment(point,a,b) {
  const ab=[b[0]-a[0],b[1]-a[1],b[2]-a[2]];
  const ap=[point[0]-a[0],point[1]-a[1],point[2]-a[2]];
  const length=dotPoint(ab,ab);
  const t=length>1e-12?clamp(dotPoint(ap,ab)/length,0,1):0;
  return Math.hypot(point[0]-a[0]-ab[0]*t,point[1]-a[1]-ab[1]*t,point[2]-a[2]-ab[2]*t);
}

/** @param {QreaseePoint} point @param {QreaseePoint[]} vertices @returns {boolean} */
function onFaceBoundary(point,vertices) {
  if (vertices.length<2) return false;
  const count=vertices.length===2?1:vertices.length;
  for (let i=0;i<count;i++) {
    if (distanceToSegment(point,vertices[i],vertices[(i+1)%vertices.length])<1e-4) return true;
  }
  return false;
}

/** @param {QreaseePoint} a @param {QreaseePoint} b @param {QreaseePoint} c @param {QreaseePoint} d @returns {{point: QreaseePoint, distance: number}|null} */
function segmentClosestPoint(a,b,c,d) {
  const u=b.map((value,index)=>value-a[index]);
  const v=d.map((value,index)=>value-c[index]);
  const w=a.map((value,index)=>value-c[index]);
  const dot=(left,right)=>left.reduce((sum,value,index)=>sum+value*right[index],0);
  const a2=dot(u,u),b2=dot(u,v),c2=dot(v,v),d2=dot(u,w),e2=dot(v,w);
  const denominator=a2*c2-b2*b2;
  let sc=0,tc=0;
  if (denominator>1e-12) {
    sc=clamp((b2*e2-c2*d2)/denominator,0,1);
    tc=clamp((a2*e2-b2*d2)/denominator,0,1);
  } else {
    sc=0;
    tc=c2>1e-12?clamp(e2/c2,0,1):0;
  }
  const p=a.map((value,index)=>value+u[index]*sc);
  const q=c.map((value,index)=>value+v[index]*tc);
  return {point:/** @type {QreaseePoint} */ (p.map((value,index)=>(value+q[index])/2)),
    distance:Math.hypot(p[0]-q[0],p[1]-q[1],p[2]-q[2])};
}

/** @param {number[]} point @param {number|undefined} elevation @param {Set<string>=} excluded @param {(world: QreaseePoint)=>boolean=} accept @returns {QreaseeInference|null} */
function infer(point, elevation, excluded = new Set(), accept) {
  if (!state.snapping) return null;
  let best=null;
  const add=(world,label,penalty,owner,force=false)=>{
    if (elevation!==undefined && Math.abs(world[2]-elevation)>.00001) return;
    if (accept && !accept(world)) return;
    const projected=stagePoint(world);
    if (!Number.isFinite(projected[0]) || !Number.isFinite(projected[1])) return;
    const distance=Math.hypot(projected[0]-point[0],projected[1]-point[1]);
    if (!(distance<=snapRadius)) return;
    const hit=!force&&state.hits.findLast(face=>!excluded.has(face.object.id) &&
      contains(projected,face.points));
    if (hit && hit.object.id!==owner &&
        !(hit.object.shape==='polygon' && hit.object.height===0 && Math.abs(hit.object.z-world[2])<.00001) &&
        !onFaceBoundary(world,hit.world)) return;
    const score=distance+penalty;
    const depth=Number.isFinite(projected[2])?projected[2]:-Infinity;
    if (best) {
      if (score>best.score+1.5) return;
      if (score>=best.score-1.5 && depth<=best.depth) return;
    }
    best={world,label,score,depth};
  };
  const interpolate=(a,b,t)=>a.map((value,i)=>value+(b[i]-value)*t);
  for (const face of state.hits) {
    if (excluded.has(face.object.id)) continue;
    const count=face.world.length;
    for (let i=0;i<(count===2 ? 1 : count);i++) {
      if (face.edges && !face.edges[i]) continue;
      const next=(i+1)%count, a=face.world[i], b=face.world[next];
      const p=face.points[i], q=face.points[next], dx=q[0]-p[0], dy=q[1]-p[1];
      const owner=face.object.id;
      add(a,'Ujung',0,owner);
      if (count===2) add(b,'Ujung',0,owner);
      add(interpolate(a,b,.5),'Titik tengah',4,owner);
      const length=dx*dx+dy*dy;
      if (length<.01) continue;
      const fraction=clamp(((point[0]-p[0])*dx+(point[1]-p[1])*dy)/length,0,1);
      const t=fraction*p[3]/((1-fraction)*q[3]+fraction*p[3]);
      add(interpolate(a,b,t),'Pada tepi',10,owner);
    }
  }
  const nearLines=state.hits.filter(face=>{
    if (face.object.shape!=='line' || face.world.length!==2 || excluded.has(face.object.id))
      return false;
    const xs=face.points.map(item=>item[0]),ys=face.points.map(item=>item[1]);
    return point[0]>=Math.min(...xs)-snapRadius && point[0]<=Math.max(...xs)+snapRadius &&
      point[1]>=Math.min(...ys)-snapRadius && point[1]<=Math.max(...ys)+snapRadius;
  });
  for (let i=0;i<nearLines.length;i++) {
    for (let j=i+1;j<nearLines.length;j++) {
      const first=nearLines[i],second=nearLines[j];
      if (first.object.id===second.object.id) continue;
      const hit=segmentClosestPoint(first.world[0],first.world[1],
        second.world[0],second.world[1]);
      if (!hit || hit.distance>1e-4) continue;
      add(hit.point,'Perpotongan',1.5,null,true);
    }
  }
  return best;
}

/** @param {QreaseePoint2} point @param {number=} elevation @param {Set<string>=} excluded @returns {QreaseeInference|null} */
function drawingPoint(point,elevation,excluded=new Set()) {
  const face=elevation===undefined?pickFace(point,false):null;
  const surface=face?.world?.length && face.world.every(vertex=>Math.abs(vertex[2]-face.world[0][2])<.00001)
    ? face.world[0][2] : 0;
  const z=elevation??surface;
  const hit=infer(point,z,excluded);
  if(hit) return hit;
  const xy=ground(point,z);
  if (!xy) return null;
  return {world:/** @type {QreaseePoint} */ ([...(state.snapping?xy.map(value=>snap(value)):xy.map(round)),z]),
    label:state.snapping?'Grid '+lengthLabel(.25):''};
}

function drawingCandidate(drag,point) {
  let candidate=drag.wall && (drag.tool==='rectangle'||drag.tool==='circle')
    ? wallDrawingPoint(point,drag.wall,drag.initial)
    : drawingPoint(point,drag.tool==='line'?undefined:drag.initial[2]);
  if (!candidate?.world) return null;
  if (drag.tool==='line' && state.snapping &&
      !['Ujung','Titik tengah','Pada tepi'].includes(candidate.label))
    candidate=QreaseeLine.axisSnap(drag.initial,point,stagePoint)||candidate;
  return candidate;
}

function shapePreview(drag,b) {
  const a=drag.initial,tool=drag.tool,size=measurement(tool);
  if (size?.invalid) return null;
  const dx=b[0]-a[0],dy=b[1]-a[1];
  const radius=drag.wall?Math.hypot(dx,dy,b[2]-a[2]):Math.hypot(dx,dy);
  if (tool==='rectangle') {
    const dimensions=size?{x:size.primary,y:size.secondary}:undefined;
    const geometry=drag.host?.shape==='rectangle' && (!drag.wall || drag.host.wall_axis)
      ? QreaseeLine.rectangleInFrame(a,b,drag.host,dimensions)
      : size
      ? QreaseeLine.measuredRectangle(a,b,size.primary,size.secondary,drag.wall?.axis)
      : drag.wall ? QreaseeLine.verticalRectangle(a,b,drag.wall.axis)
      : {x:(a[0]+b[0])/2,y:(a[1]+b[1])/2,z:a[2],width:Math.abs(dx),depth:Math.abs(dy)};
    return geometry && {id:drag.id,name:'Bidang persegi',shape:'rectangle',...geometry,
      height:0,rotation:0,color:'#dfcbb8'};
  }
  if (tool==='circle') {
    if (radius<.001) return null;
    const exact=size?.primary??radius;
    return {id:drag.id,name:'Bidang lingkaran',shape:'circle',x:a[0],y:a[1],z:a[2],
      width:exact*2,depth:exact*2,height:0,rotation:0,
      ...(drag.wall?{wall_axis:drag.wall.axis}:{}),color:'#dfcbb8'};
  }
  if (tool==='line') {
    const end=size?QreaseeLine.measuredEndpoint(a,b,size.primary):b;
    return end&&lineObject(a,end);
  }
  return null;
}

function pullChange(drag,point) {
  const size=measurement('pull');
  if (size?.invalid) return null;
  const {height}=drag.object,normal=surfaceNormal(drag.object),base=surfaceCenter(drag.object);
  const current=stagePoint(offsetPoint(base,normal.map(value=>value*height)));
  const next=stagePoint(offsetPoint(base,normal.map(value=>value*(height+1))));
  const direction=[next[0]-current[0],next[1]-current[1]];
  const movement=[point[0]-drag.start[0],point[1]-drag.start[1]];
  const projected=movement[0]*direction[0]+movement[1]*direction[1];
  const magnitude=direction[0]**2+direction[1]**2;
  if (magnitude<1e-6 || Math.abs(projected)<1e-5) return null;
  const amount=size ? Math.sign(projected)*size.primary :
    (state.snapping?snap(projected/magnitude,.05):round(projected/magnitude));
  return height===0 && amount<0
    ? {...shiftSurface(drag.object,normal.map(value=>value*amount)),height:-amount}
    : {...drag.object,height:Math.max(0,height+amount)};
}

/** @param {QreaseePoint2} point @returns {QreaseeInference|null} */
function lineTarget(point) {
  const candidate=drawingPoint(point);
  if (!state.linePending || !state.snapping) return candidate;
  if (candidate && ['Ujung','Titik tengah','Pada tepi','Perpotongan'].includes(candidate.label))
    return candidate;
  const axis=QreaseeLine.axisSnap(state.linePending.a,point,stagePoint);
  return axis || candidate;
}

/** @param {QreaseePoint} a @param {QreaseePoint} b @param {QreaseePoint} bulge @returns {QreaseePoint[]} */
function arcPoints(a,b,bulge) {
  const dx=b[0]-a[0],dy=b[1]-a[1],chord=Math.hypot(dx,dy);
  if (chord<.001) return [];
  const normal=[-dy/chord,dx/chord];
  const midpoint=[(a[0]+b[0])/2,(a[1]+b[1])/2];
  const height=(bulge[0]-midpoint[0])*normal[0]+(bulge[1]-midpoint[1])*normal[1];
  if (Math.abs(height)<.001) return [];
  const radius=chord*chord/(8*height)+height/2;
  const center=[midpoint[0]+(height-radius)*normal[0],midpoint[1]+(height-radius)*normal[1]];
  const start=Math.atan2(a[1]-center[1],a[0]-center[0]);
  const finish=Math.atan2(b[1]-center[1],b[0]-center[0]);
  const tau=Math.PI*2;
  const sweep=height>0 ? -((start-finish+tau)%tau) : (finish-start+tau)%tau;
  const count=clamp(Math.ceil(Math.abs(sweep)*16),8,64);
  return Array.from({length:count+1},(_,i)=>{
    const angle=start+sweep*i/count;
    return [center[0]+Math.abs(radius)*Math.cos(angle),center[1]+Math.abs(radius)*Math.sin(angle),a[2]];
  });
}

function addArc(points) {
  addLineChain(points,false,'Busur');
}

/** @param {QreaseePoint} a @param {QreaseePoint} b @param {string=} name @returns {QreaseeObject|null} */
function lineObject(a,b,name='Garis') {
  const width=b[0]-a[0], depth=b[1]-a[1], height=b[2]-a[2];
  if (Math.hypot(width,depth,height)<=.001) return null;
  return {id:identity(),name,shape:'line',x:(a[0]+b[0])/2,y:(a[1]+b[1])/2,z:a[2],
    width,depth,height,rotation:0,color:'#dfcbb8'};
}

/** @param {QreaseePoint[]} points @param {boolean} closed @param {string} name */
function addLineChain(points,closed,name) {
  const segments=Array.from({length:closed?points.length:points.length-1},(_,i)=>
    lineObject(points[i],points[(i+1)%points.length],name)).filter(Boolean);
  if (segments.length) batch([],segments,[]);
}

/** @param {QreaseePoint[]} outline @param {number} distance @returns {QreaseePoint[]} */
function offsetOutline(outline,distance) {
  const count=outline.length;
  const area=outline.reduce((sum,p,i)=>{const q=outline[(i+1)%count];return sum+p[0]*q[1]-q[0]*p[1]},0);
  const side=area>=0?1:-1;
  const edges=outline.map((a,i)=>{
    const b=outline[(i+1)%count],dx=b[0]-a[0],dy=b[1]-a[1],length=Math.hypot(dx,dy);
    return {direction:[dx,dy],normal:[side*dy/length,-side*dx/length]};
  });
  return outline.map((vertex,i)=>{
    const previous=edges[(i+count-1)%count],next=edges[i];
    const a=[vertex[0]+previous.normal[0]*distance,vertex[1]+previous.normal[1]*distance];
    const b=[vertex[0]+next.normal[0]*distance,vertex[1]+next.normal[1]*distance];
    const cross=(p,q)=>p[0]*q[1]-p[1]*q[0];
    const divisor=cross(previous.direction,next.direction);
    if (Math.abs(divisor)<1e-9) return [(a[0]+b[0])/2,(a[1]+b[1])/2,vertex[2]];
    const shift=cross([b[0]-a[0],b[1]-a[1]],next.direction)/divisor;
    return [a[0]+shift*previous.direction[0],a[1]+shift*previous.direction[1],vertex[2]];
  });
}

canvas.addEventListener('contextmenu',event=>{
  event.preventDefault();
  if (state.layout || !state.doc) return;
  const point=pointer(event);
  const section=sectionPlaneAt(point,activeSectionId);
  if (section) {showSectionMenu(section,event.clientX,event.clientY);return;}
  const face=pickFace(point,false);
  if (!face) {hideObjectMenu();return;}
  showObjectMenu(targetId(face.object),event.clientX,event.clientY);
});
canvas.addEventListener('wheel',event=>{
  event.preventDefault();
  zoom(Math.exp(-clamp(event.deltaY,-400,400)*.0015),...pointer(event));
},{passive:false});
canvas.addEventListener('pointerdown',event=>{
  if (state.drag || event.button > 2) return;
  const start=pointer(event);
  const tool=event.button === 1 ? (event.shiftKey?'pan':'orbit') : event.button === 2 ? 'pan' : state.tool;
  if (!canEditModel() && !['select','orbit','pan','measure'].includes(tool)) {
    showStatus('Akses ini tidak dapat mengubah model.');return;
  }
  if (event.button===0 && tool==='select') {
    const pin=commentPinAt(start);
    if (pin) {focusCommentTarget(pin.target);return;}
    const grid=modelGridAt(start);
    if(grid){selectModelGrid(grid.id);return;}
  }
  if (event.button===0 && ['select','section'].includes(tool) && !state.sectionPending) {
    const section=sectionPlaneAt(start,activeSectionId);
    if (section) {
      activeSectionId=section.id;
      state.drag={tool:'section-move',start,section,base:section.origin,
        normal:normalizePoint(section.normal),origin:section.origin,moved:false,offset:0};
      canvas.setPointerCapture(event.pointerId);
      toggleSections(true);
      renderSections();
      showStatus('Geser bidang sepanjang normal; lepas untuk menetapkan.');
      redraw();
      return;
    }
  }
  if (event.button===0 && state.drawPending?.tool===tool) {
    const pending=state.drawPending,size=measurement(tool);
    if (size?.invalid) {measurementError();return;}
    if (tool==='pull') {
      const update=pullChange(pending,start);
      if (!update) {showStatus('Klik pada arah tarik yang jelas.');return;}
      state.drawPending=null;
      $('#line-length').value='';
      commitPull(pending.object,update);
      return;
    }
    const candidate=drawingCandidate(pending,start);
    if (!candidate) {showStatus('Arahkan klik kedua pada bidang gambar.');return;}
    if (tool==='arc') {
      if (size) {
        const points=QreaseeLine.radiusArc(pending.initial,candidate.world,size.primary,size.secondary);
        if (!points.length) {showStatus('Klik menjauh dari titik pusat untuk menentukan arah busur.');return;}
        state.drawPending=null;
        $('#line-length').value='';
        addArc(points);
      } else {
        state.drawPending=null;
        state.arcPending={a:pending.initial,b:candidate.world,preview:[pending.initial,candidate.world]};
        showStatus('Klik ketiga untuk menentukan lengkung busur.');
      }
      redraw();
      return;
    }
    const object=shapePreview(pending,candidate.world);
    if (!object || object.width<.001 || object.depth<.001) {
      showStatus('Klik pada arah yang membentuk ukuran bidang.');return;
    }
    state.drawPending=null;
    $('#line-length').value='';
    if (tool==='rectangle') insertRectangle(object,pending.host);
    else placePlanarFace(/** @type {QreaseeObject} */ (object));
    redraw();
    return;
  }
  if (tool==='arc' && state.arcPending) {
    if (!state.doc || state.busy) return;
    const pending=state.arcPending;
    const candidate=drawingPoint(start,pending.a[2]);
    const points=candidate?arcPoints(pending.a,pending.b,candidate.world):[];
    if (!points.length) { showStatus('Gerakkan kursor menjauh dari garis untuk menentukan lengkung busur.');return; }
    state.arcPending=null;
    addArc(points);
    redraw();
    return;
  }
  if (tool==='line') {
    if (!state.doc || state.busy) return;
    if (state.linePending) {
      const candidate=lineTarget(start);
      if (!candidate) { showStatus('Arahkan kursor ke bidang untuk melanjutkan garis.');return; }
      completeLinePoint(candidate.world);
      return;
    }
    const initial=infer(start,undefined) || drawingPoint(start);
    if (!initial) { showStatus('Gunakan denah atau tampilan 3D untuk menggambar.');return; }
    state.linePress={start,initial:initial.world};
    state.inference=initial;
    canvas.setPointerCapture(event.pointerId);
    return;
  }
  if (tool === 'orbit' || tool === 'pan') {
    const axes=cameraAxes().map(axis=>[...axis]);
    const pivot=tool==='orbit'?orbitPivot(start):null;
    const relative=pivot?.map((value,i)=>value-camera.center[i]);
    const coordinates=relative?.length?axes.map(axis=>axis.reduce((sum,value,i)=>sum+value*relative[i],0)):null;
    state.drag={tool,start,camera:{...camera},axes,pivot,coordinates};
  } else {
    if (!state.doc || state.busy) return;
    if (tool==='erase') {
      const seen=new Set();
      eraseLinesAt(start,seen);
      state.drag={tool:'erase',start,seen,last:start};
      state.inference=null;
      state.hoverKey=null;
      canvas.setPointerCapture(event.pointerId);
      redraw();
      return;
    }
    if (tool==='section') {placeSectionAt(start);return;}
    if (tool==='bucket') {
      const face=pickFace(start,false);
      if (!face) {showStatus('Klik permukaan objek untuk menerapkan material.');return;}
      if (state.inside && face.object.container?.id!==state.inside) {
        showStatus('Klik bidang di dalam Group/Component, atau keluar dari Edit isi.');return;
      }
      paintMaterial(targetId(face.object),bucketMaterial);
      return;
    }
    let face=pickFace(start,tool!=='pull');
    let planeWall=null;
    if (tool==='rectangle'||tool==='circle') {
      const picked=pickRectangleFace(start);
      face=picked.face;
      planeWall=picked.wall;
    }
    if (tool==='select') {
      if (face) select(targetId(face.object),event.shiftKey);
      else {
        state.drag={tool:'select',start,current:start,additive:event.shiftKey};
        canvas.setPointerCapture(event.pointerId);
      }
      return;
    }
    if (tool==='move') {
      if (state.movePending) {
        const pending=state.movePending;
        const destination=moveDestination(start,pending);
        if (!destination) {showStatus('Arahkan klik tujuan pada bidang yang terlihat.');return;}
        const supportZ=event.altKey?moveSupportZ(start,pending):null;
        if (event.altKey && supportZ===null) {
          showStatus('Alt + klik memerlukan bidang horizontal yang terlihat.');return;
        }
        const updates=movePreview(pending.sources,pending.start,destination.world,supportZ,pending.baseZ);
        const dx=updates[0].x-pending.sources[0].x,dy=updates[0].y-pending.sources[0].y,
          dz=updates[0].z-pending.sources[0].z;
        if (Math.hypot(dx,dy,dz)<.001) {showStatus('Titik tujuan masih sama dengan titik awal.');return;}
        const selection=[...state.selected];
        const lifted=Math.abs(dz)>=.001;
        state.movePending=null;
        state.inference=null;
        batch(pending.sources,updates,selection).then(moved=>{
          if (moved) showStatus(pending.sources.length+' objek dipindahkan'+
            (supportZ!==null?' · dasar pada Z '+lengthLabel(supportZ):
              lifted?' (ΔZ '+lengthLabel(dz)+').':'.'));
        });
        redraw();
        return;
      }
      const sources=moveSources();
      if (!sources.length) {showStatus('Pilih objek terlebih dahulu, lalu tentukan titik awal.');return;}
      const hit=infer(start,undefined) || drawingPoint(start);
      if (!hit) {showStatus('Tentukan titik awal pada bidang yang terlihat.');return;}
      state.movePending={start:hit.world,z:hit.world[2],sources,baseZ:moveBaseZ(sources),axis:null,pointer:start,
        excluded:new Set(sources.map(object=>object.id)),destination:null,updates:null};
      state.inference=hit.label?hit:null;
      showStatus('Klik titik tujuan untuk memindahkan '+sources.length+
        ' objek. Alt + klik pada lantai untuk menumpukan dasar objek; panah Atas/Bawah mengunci Z.');
      redraw();
      return;
    }
    if (tool==='rotate') {
      if (state.rotatePending) {
        const pending=state.rotatePending;
        const destination=moveDestination(start,pending);
        if (!destination) {showStatus('Arahkan kursor pada bidang untuk menentukan sudut.');return;}
        let angle=Math.atan2(destination.world[1]-pending.pivot[1],
          destination.world[0]-pending.pivot[0])*180/Math.PI;
        angle=state.snapping?snap(angle,5):round(angle);
        updateRotatePreview(pending,angle);
        commitRotate(pending);
        return;
      }
      const sources=moveSources();
      if (!sources.length) {showStatus('Pilih objek terlebih dahulu, lalu klik pusat rotasi.');return;}
      const hit=infer(start,undefined) || drawingPoint(start);
      if (!hit) {showStatus('Tentukan pusat rotasi pada bidang yang terlihat.');return;}
      state.rotatePending={sources,pivot:hit.world,z:hit.world[2],
        excluded:new Set(sources.map(object=>object.id)),angle:0,updates:null};
      state.inference=hit.label?hit:null;
      $('#line-length').value='';
      showStatus('Pusat rotasi ditetapkan. Gerakkan kursor atau ketik sudut lalu Enter.');
      redraw();
      return;
    }
    if (tool==='offset') {
      if (state.offsetPending) {
        const pending=state.offsetPending;
        const end=ground(start,pending.z);
        if (end) updateOffsetPreview(pending,
          (end[0]-pending.origin[0])*pending.normal[0]+(end[1]-pending.origin[1])*pending.normal[1]);
        commitOffset(pending);
        return;
      }
      const host=offsetHostAt(start);
      if (!host) {showStatus('Klik perimeter bidang datar yang akan di-offset.');return;}
      const outline=previewMesh({...host,height:0}).vertices;
      const origin=ground(start,host.z);
      if (!origin || outline.length<3) {showStatus('Gunakan denah atau tampilan 3D untuk Offset.');return;}
      const point=/** @type {QreaseePoint} */ ([origin[0],origin[1],host.z]);
      const edge=offsetNormal(outline,point);
      if (!edge) {showStatus('Perimeter bidang tidak valid untuk Offset.');return;}
      const startPoint=/** @type {QreaseePoint} */ ([edge.point[0],edge.point[1],host.z]);
      state.offsetPending={host,outline,origin:startPoint,z:host.z,normal:edge.normal,
        distance:0,sign:-1,contour:null};
      state.inference=null;
      $('#line-length').value='';
      showStatus('Gerakkan ke dalam atau ke luar bidang; klik kedua atau ketik jarak lalu Enter.');
      redraw();
      return;
    }
    const object=face?.object;
    if (tool==='measure') {
      const origin=infer(start,undefined) || drawingPoint(start);
      if (!origin) {showStatus('Gunakan denah atau tampilan 3D untuk mengukur.');return;}
      state.measurePending={origin:origin.world,elevation:origin.world[2],end:null,distance:0};
      state.inference=origin.label?origin:null;
      showStatus('Titik awal ukur ditetapkan. Gerakkan kursor ke titik akhir.');
      redraw();
      return;
    }
    if (tool==='scale') {
      const id=targetId(object);
      const group=members(id);
      const sources=group.length?group:object?[object]:[];
      if (!sources.length || (group.length && group[0].container.definition)) {
        showStatus('Pilih objek atau Group. Untuk Component, gunakan Edit isi.');
        return;
      }
      const pivot=[sources.reduce((sum,item)=>sum+item.x,0)/sources.length,
        sources.reduce((sum,item)=>sum+item.y,0)/sources.length];
      const initial=ground(start,object.z);
      const radius=initial && Math.hypot(initial[0]-pivot[0],initial[1]-pivot[1]);
      if (!radius || radius<.01) { showStatus('Mulai tarik di luar pusat objek.'); return; }
      select(id);
      state.drag={tool,start,object,sources,pivot,radius,elevation:object.z};
    } else if (tool==='pull') {
      if (!object || (!face.top && !object.wall_axis && !object.plane_u)) {
        showStatus('Pilih bidang yang akan ditarik.');
        return;
      }
      if (targetId(object)!==object.id) {
        showStatus('Gunakan tampilan 3D dan buka Edit isi untuk mengubah permukaan Group atau Component.');
        return;
      }
      const id=targetId(object);
      const selected=members(id);
      const sources=selected.length?selected:[object];
      const owned=new Set(sources.map(item=>item.id));
      const elevation=object.z;
      const origin=ground(start,elevation);
      select(id);
      state.drag={tool,start,object,sources,owned,elevation,origin,anchor:[...(origin||[0,0]),elevation]};
      showStatus('Tarik permukaan sepanjang normal, atau ketik jarak lalu Enter.');
      redraw();
    } else if (tool==='arc' && state.inside) {
      showStatus('Keluar dari Edit isi sebelum menggambar busur.');return;
    } else if (tool==='arc') {
      const initial=drawingPoint(start);
      if (!initial) { showStatus('Gunakan denah atau tampilan 3D untuk memasang busur.');return; }
      state.drag={tool,start,initial:initial.world};
    } else {
      if ((tool==='rectangle'||tool==='circle') && planeWall) {
        const initial=wallDrawingPoint(start,planeWall);
        if (!initial) {showStatus('Arah pandang sejajar bidang vertikal. Putar kamera sedikit.');return;}
        state.drag={tool,start,initial:initial.world,id:identity(),wall:planeWall,host:face?.object};
        state.inference=initial;
        showStatus(tool==='rectangle'
          ? 'Sudut pertama ditetapkan. Klik sudut berlawanan atau ketik X x Y lalu Enter.'
          : 'Pusat ditetapkan. Klik titik tepi atau ketik radius lalu Enter.');
        redraw();
        canvas.setPointerCapture(event.pointerId);
        return;
      }
      const planeZ=(tool==='rectangle'||tool==='circle') && face && face.world.length>=3 &&
        face.world.every(vertex=>Math.abs(vertex[2]-face.world[0][2])<.00001)
        ?face.world[0][2]:null;
      const initial=planeZ===null?drawingPoint(start):drawingPoint(start,planeZ);
      if (!initial) { showStatus('Gunakan denah atau aksonometri untuk menggambar.');return; }
      state.drag={tool,start,initial:initial.world,id:identity(),
        host:tool==='rectangle'||tool==='circle'?face?.object:null};
      state.inference=initial;
      showStatus(tool==='rectangle'
        ? 'Sudut pertama ditetapkan. Klik sudut berlawanan atau ketik X x Y lalu Enter.'
        : 'Pusat ditetapkan. Klik titik tepi atau ketik radius lalu Enter.');
      redraw();
    }
  }
  canvas.setPointerCapture(event.pointerId);
});

canvas.addEventListener('pointermove',event=>{
  const point=pointer(event);
  const gridHover=!state.drag&&state.tool==='select'?modelGridAt(point):null;
  if(layoutRuntime.hoverGridId!==gridHover?.id){layoutRuntime.hoverGridId=gridHover?.id||null;redraw();}
  if (!state.drag && state.tool==='select')
    canvas.style.cursor=commentPinAt(point)||gridHover?'pointer':'';
  const onGround=ground(point);
  state.cursor=onGround?{mode:'model',x:round(onGround[0]),y:round(onGround[1]),z:0}:null;
  updateCoordinates();
  let drag=state.drag;
  if (!drag && state.linePress &&
      Math.hypot(point[0]-state.linePress.start[0],point[1]-state.linePress.start[1])>4) {
    state.drag={tool:'line',start:state.linePress.start,initial:state.linePress.initial,id:identity()};
    state.linePress=null;
    drag=state.drag;
  }
  if (!drag && state.tool==='select' && !state.drawPending) {
    const hovered=gridHover?null:pickFace(point,false);
    state.hoverKey=hovered ? (hovered.smooth ? hovered.object.id : hovered.key) : null;
  } else state.hoverKey=null;
  if (!drag) {
    if (state.sectionPending) {
      const pending=state.sectionPending;
      const distance=sectionAxisDistance(point,pending.base,pending.normal);
      if (distance!==null) {
        const value=state.snapping?snap(distance,.05):round(distance);
        pending.offset=value;
        pending.origin=/** @type {QreaseePoint} */ (pending.base.map(
          (coordinate,index)=>coordinate+pending.normal[index]*value));
        showStatus('Geser bidang '+lengthLabel(value)+' sepanjang normal; klik kedua untuk menetapkan.');
      }
      state.inference=null;
      redraw();
      return;
    }
    if (state.measurePending) {
      const pending=state.measurePending;
      const candidate=infer(point,undefined) || drawingPoint(point,pending.elevation);
      pending.end=candidate?.world||null;
      pending.distance=pending.end
        ? Math.hypot(pending.end[0]-pending.origin[0],pending.end[1]-pending.origin[1],
          pending.end[2]-pending.origin[2]) : 0;
      state.inference=candidate?.label?candidate:null;
      if (pending.end) {
        state.cursor={mode:'model',x:round(pending.end[0]),y:round(pending.end[1]),z:round(pending.end[2])};
        updateCoordinates();
        showStatus('Jarak '+lengthLabel(pending.distance)+' · klik untuk titik awal baru.');
      }
      redraw();
      return;
    }
    if (state.movePending) {
      const pending=state.movePending;
      pending.pointer=point;
      const destination=moveDestination(point,pending);
      const supportZ=event.altKey?moveSupportZ(point,pending):null;
      pending.destination=destination?.world||null;
      pending.updates=destination?movePreview(pending.sources,pending.start,destination.world,
        supportZ,pending.baseZ):null;
      state.inference=destination?.label?destination:null;
      if (destination) {
        const dz=pending.updates[0].z-pending.sources[0].z;
        showStatus(supportZ!==null
          ? 'Dasar objek pada bidang Z '+lengthLabel(supportZ)+' · Alt + klik untuk menetapkan'
          : pending.axis==='z'
          ? 'Sumbu Z terkunci · ΔZ '+lengthLabel(dz)+' · klik kedua untuk menetapkan'
          : 'Pindah · ΔZ '+lengthLabel(dz)+(destination.label?' · '+destination.label:''));
      } else if (pending.axis==='z') {
        showStatus('Sumbu Z tidak terlihat pada arah kamera ini. Putar tampilan atau tekan panah lagi.');
      }
      redraw();
      return;
    }
    if (state.rotatePending) {
      const pending=state.rotatePending;
      const destination=moveDestination(point,pending);
      pending.destination=destination?.world||null;
      if (destination && document.activeElement!==$('#line-length')) {
        let angle=Math.atan2(destination.world[1]-pending.pivot[1],
          destination.world[0]-pending.pivot[0])*180/Math.PI;
        angle=state.snapping?snap(angle,5):round(angle);
        updateRotatePreview(pending,angle);
        showStatus('Sudut '+angle.toFixed(1)+'°');
      } else if (!destination) pending.updates=null;
      state.inference=destination?.label?destination:null;
      redraw();
      return;
    }
    if (state.offsetPending) {
      const pending=state.offsetPending;
      const end=ground(point,pending.z);
      if (end && document.activeElement!==$('#line-length')) {
        const raw=(end[0]-pending.origin[0])*pending.normal[0]+(end[1]-pending.origin[1])*pending.normal[1];
        updateOffsetPreview(pending,raw);
        showStatus('Offset '+lengthLabel(Math.abs(pending.distance))+
          (pending.distance<0?' ke dalam':' ke luar'));
      }
      state.inference=null;
      redraw();
      return;
    }
    if (state.tool==='offset' && !state.offsetPending) {
      const host=offsetHostAt(point);
      if (host) {
        const outline=previewMesh({...host,height:0}).vertices;
        const projected=outline.map(stagePoint);
        let edge=null,bestDistance=Infinity;
        for (let index=0;index<projected.length;index++) {
          const next=(index+1)%projected.length;
          if (!Number.isFinite(projected[index][0])||!Number.isFinite(projected[next][0])) continue;
          const distance=pointToPolygonEdge(point,[projected[index],projected[next]]);
          if (distance<bestDistance) {
            bestDistance=distance;
            edge=[projected[index],projected[next]];
          }
        }
        state.offsetHover={host,outline,edge:bestDistance<=30?edge:null};
        state.inference=infer(point,undefined,new Set(),world=>onFaceBoundary(world,outline));
      } else {
        state.offsetHover=null;
        state.inference=null;
      }
      redraw();
      return;
    }
    if (state.drawPending) {
      const pending=state.drawPending;
      pending.hover=point;
      if (pending.tool==='pull') {
        const update=pullChange(pending,point);
        pending.updates=update?[update]:null;
      } else {
        const candidate=drawingCandidate(pending,point);
        state.inference=candidate?.label?candidate:null;
        if (pending.tool==='arc') {
          const size=measurement('arc');
          pending.previewArc=candidate && size && !size.invalid
            ? QreaseeLine.radiusArc(pending.initial,candidate.world,size.primary,size.secondary)
            : candidate?[pending.initial,candidate.world]:[];
        } else pending.preview=candidate?shapePreview(pending,candidate.world):null;
      }
    } else if (state.tool==='line' && state.linePending) {
      if (document.activeElement!==$('#line-length') || !state.linePending.b) {
        const candidate=lineTarget(point);
        const size=measurement('line');
        const exact=candidate && size && !size.invalid
          ? QreaseeLine.measuredEndpoint(state.linePending.a,candidate.world,size.primary) : null;
        state.linePending.raw=candidate?.world||null;
        state.linePending.b=exact||candidate?.world||null;
        state.linePending.preview=state.linePending.b
          ? [state.linePending.a,state.linePending.b]:[state.linePending.a];
        state.inference=candidate?.label?{...candidate,world:exact||candidate.world}:null;
        updateLineLength();
      }
      const end=state.linePending.b;
      if (end) {
        state.cursor={mode:'model',x:round(end[0]),y:round(end[1]),z:round(end[2]),
          line:{a:roundPoint(state.linePending.a),b:roundPoint(end)}};
        updateCoordinates();
      }
    } else if (state.tool==='arc' && state.arcPending) {
      const candidate=drawingPoint(point,state.arcPending.a[2]);
      state.arcPending.preview=candidate?arcPoints(state.arcPending.a,state.arcPending.b,candidate.world):[];
      state.inference=candidate?.label?candidate:null;
      showStatus('Klik untuk menetapkan lengkung busur. Esc untuk membatalkan.');
    } else if (state.tool==='move') {
      const hovered=pickFace(point,true)?.object;
      const id=targetId(hovered);
      const owned=new Set(members(id).length?members(id).map(item=>item.id):hovered?[hovered.id]:[]);
      state.inference=owned.size ? infer(point,undefined,new Set(objects().filter(item=>!owned.has(item.id)).map(item=>item.id))) : null;
    } else if (state.tool==='section') {
      const face=pickFace(point,false);
      const normal=face?faceNormal(face.world):null;
      state.sectionHover=face&&normal&&face.world.length>=3
        ? {origin:face.world.reduce((sum,vertex)=>sum.map((value,index)=>value+vertex[index]/
          face.world.length),[0,0,0]),normal}
        : null;
      state.inference=null;
    } else {
      const hit=['line','rectangle','circle','measure'].includes(state.tool) ? drawingPoint(point) : null;
      state.inference=hit?.label?hit:null;
      if (hit) state.cursor={mode:'model',x:round(hit.world[0]),y:round(hit.world[1]),z:round(hit.world[2])};
    }
    if (!state.inference?.label) state.inference=null;
    redraw();
    return;
  }
  if (drag.tool==='select') {
    drag.current=point;
    redraw();
    return;
  }
  state.inference=null;
  const dx=point[0]-drag.start[0], dy=point[1]-drag.start[1];
  if ((drag.tool==='rectangle'||drag.tool==='circle') &&
      Math.hypot(dx,dy)>=4) drag.moved=true;
  if (drag.tool==='section-move') {
    const distance=sectionAxisDistance(point,drag.base,drag.normal);
    if (distance!==null) {
      const value=state.snapping?snap(distance,.05):round(distance);
      drag.offset=value;
      drag.origin=/** @type {QreaseePoint} */ (drag.base.map(
        (coordinate,index)=>coordinate+drag.normal[index]*value));
      drag.moved=Math.abs(value)>.001||drag.moved;
      sectionDragPreview={section:drag.section,origin:drag.origin};
      showStatus('Geser bidang '+lengthLabel(value)+' sepanjang normal.');
    }
    redraw();
    return;
  }
  if (drag.tool==='erase') {
    eraseLinesAlong(drag.last,point,drag.seen);
    drag.last=point;
    redraw();
    return;
  }
  if (drag.tool==='orbit') {
    const speed=2*Math.PI/Math.max(480,canvas.clientHeight);
    camera.yaw=drag.camera.yaw-dx*speed;
    camera.pitch=clamp(drag.camera.pitch+dy*speed,-Math.PI/2+.01,Math.PI/2-.01);
    camera.axes=null;
    const axes=cameraAxes();
    camera.center=drag.pivot.map((value,i)=>value-
      drag.coordinates.reduce((sum,coordinate,j)=>sum+coordinate*axes[j][i],0));
    if (!camera.perspective) $('#camera').value='iso';
  } else if (drag.tool==='pan') {
    camera.x=drag.camera.x+dx;
    camera.y=drag.camera.y+dy;
  } else if (drag.tool==='offset') {
    const end=ground(point,drag.elevation);
    if (!end) {drag.contour=null;redraw();return;}
    const raw=(end[0]-drag.origin[0])*drag.normal[0]+(end[1]-drag.origin[1])*drag.normal[1];
    const limit=Math.min(drag.object.width,drag.object.depth)/2-.01;
    drag.distance=clamp(state.snapping?snap(raw,.05):round(raw),-limit,100);
    drag.contour=Math.abs(drag.distance)>.001?offsetOutline(drag.outline,drag.distance):null;
    showStatus('Offset '+lengthLabel(drag.distance));
  } else if (drag.tool==='arc') {
    const candidate=drawingPoint(point,drag.initial[2]);
    drag.end=candidate?.world||null;
    state.inference=candidate?.label?candidate:null;
    if (drag.end) showStatus('Klik berikutnya untuk menentukan lengkung busur.');
  } else if (drag.tool==='scale') {
    const end=ground(point,drag.elevation);
    if (!end) { drag.updates=null;redraw();return; }
    const ratio=clamp(Math.hypot(end[0]-drag.pivot[0],end[1]-drag.pivot[1])/drag.radius,.01,100);
    const factor=state.snapping?Math.max(.05,snap(ratio,.05)):ratio;
    drag.updates=drag.sources.map(object=>({...object,
      x:drag.pivot[0]+(object.x-drag.pivot[0])*factor,
      y:drag.pivot[1]+(object.y-drag.pivot[1])*factor,
      width:object.width*factor,depth:object.depth*factor,height:object.height*factor
    }));
    showStatus('Skala '+factor.toFixed(2)+'×');
  } else if (drag.tool==='rotate') {
    const end=ground(point,drag.pivot[2]);
    if (!end) { drag.updates=null;redraw();return; }
    drag.cursor=point;
    const [x,y]=drag.pivot;
    const rad=Math.atan2(end[1]-y,end[0]-x)-drag.initial;
    const degrees=(rad*180/Math.PI+540)%360-180;
    const angle=state.snapping?snap(degrees,5):round(degrees);
    const cos=Math.cos(angle*Math.PI/180), sin=Math.sin(angle*Math.PI/180);
    drag.updates=drag.sources.map(object=>({...object,
      x:x+(object.x-x)*cos-(object.y-y)*sin,
      y:y+(object.x-x)*sin+(object.y-y)*cos,
      rotation:((object.rotation+angle+180)%360+360)%360-180
    }));
    showStatus('Rotasi '+angle.toFixed(1)+'°');
  } else if (drag.tool==='pull') {
    const update=pullChange(drag,point);
    drag.updates=update?[update]:null;
    if (update) showStatus('Tinggi '+lengthLabel(update.height));
  } else if (drag.tool==='move') {
    const end=ground(point,drag.elevation);
    if (!end) { drag.updates=null;redraw();return; }
    const projected=stagePoint([drag.anchor[0]+end[0]-drag.origin[0],drag.anchor[1]+end[1]-drag.origin[1],drag.elevation]);
    state.inference=infer(projected,drag.elevation,drag.owned);
    const delta=state.inference ? state.inference.world.slice(0,2).map((value,i)=>value-drag.anchor[i])
      : end.map((value,i)=>state.snapping?snap(value-drag.origin[i]):round(value-drag.origin[i]));
    drag.delta=delta;
    drag.updates=drag.sources.map(object=>({...object,x:object.x+delta[0],y:object.y+delta[1]}));
    showStatus(state.inference ? 'Snap '+state.inference.label+' · X '+state.inference.world[0].toFixed(3)+'  Y '+state.inference.world[1].toFixed(3)
      : 'Pindah · ΔX '+delta[0].toFixed(3)+'  ΔY '+delta[1].toFixed(3));
  } else {
    const a=drag.initial;
    const candidate=drawingCandidate(drag,point);
    if (!candidate) { drag.preview=null;redraw();return; }
    state.inference=candidate.label?candidate:null;
    const b=candidate.world;
    drag.preview=drag.tool==='arc'?null:shapePreview(drag,b);
    if (drag.tool==='line') state.cursor={mode:'model',x:round(b[0]),y:round(b[1]),z:round(b[2]),
      line:{a:roundPoint(a),b:roundPoint(b)}};
  }
  redraw();
});
canvas.addEventListener('pointerleave',()=>{if (!state.layout) state.cursor=null;state.hoverKey=null;state.sectionHover=null;state.offsetHover=null;layoutRuntime.hoverGridId=null;state.inference=null;redraw();});
canvas.addEventListener('dblclick',event=>{
  if (state.tool==='line' && state.linePending) { finishLine(); return; }
  if (!['select','bucket','pull'].includes(state.tool)) return;
  const point=pointer(event);
  const under=state.hits.filter(candidate=>contains(point,candidate.points));
  const face=under.findLast(candidate=>candidate.object.opening_id)||under.at(-1);
  if (!face) return;
  const sameContext=!face.object.container||state.inside===face.object.container.id;
  if (sameContext&&['select','pull'].includes(state.tool)&&pushThroughOpening(face.object)) return;
  if (!['select','bucket'].includes(state.tool)) return;
  if (face.object.container) enterContainer(face.object.container.id);
});

canvas.addEventListener('click',event=>{
  if (event.detail!==3 || state.tool!=='select' || state.layout || !state.doc) return;
  const face=pickFace(pointer(event),true);
  if (face) selectConnected(face.object,event.shiftKey);
});

canvas.addEventListener('pointerup',()=>{
  const drag=state.drag;
  state.drag=null;
  if (state.cursor) delete state.cursor.line;
  if (drag?.tool==='section-move') {
    if (drag.moved) {
      const after={...drag.section,origin:roundPoint(drag.origin)};
      commit({type:'section',before:drag.section,after}).then(saved=>{
        sectionDragPreview=null;
        if (saved) {
          activeSectionId=after.id;
          showStatus('Bidang potong digeser.');
        }
        redraw();
      });
    } else {
      sectionDragPreview=null;
      showStatus('Bidang potong dipilih. Geser atau tekan Delete untuk menghapus.');
    }
    redraw();
    return;
  }
  if (drag?.tool==='erase') {
    const targets=eraseLineTargets(drag.seen);
    if (targets.length) batch(targets,[],[]).then(deleted=>{
      if (deleted) showStatus(targets.length===1?'Garis dihapus.':targets.length+' garis dihapus.');
    });
    redraw();
    return;
  }
  if (state.linePress && !drag) {
    const initial=state.linePress.initial;
    state.linePress=null;
    if (initial) beginLine(initial);
    redraw();
    return;
  }
  state.linePress=null;
  if (drag?.tool==='select') {
    if (Math.hypot(drag.current[0]-drag.start[0],drag.current[1]-drag.start[1])>=4)
      selectBox(drag.start,drag.current,drag.additive);
    else if (!drag.additive) select(null);
  } else if (drag?.tool==='arc' && drag.end && Math.hypot(drag.end[0]-drag.initial[0],drag.end[1]-drag.initial[1])>.001) {
    const size=measurement('arc');
    if (size && !size.invalid) {
      const points=QreaseeLine.radiusArc(drag.initial,drag.end,size.primary,size.secondary);
      if (points.length) {addArc(points);$('#line-length').value='';}
    } else state.arcPending={a:drag.initial,b:drag.end,preview:[drag.initial,drag.end]};
  } else if (drag?.tool==='offset' && drag.contour) {
    addLineChain(drag.contour,true,'Kontur offset');
  } else if (drag?.preview) {
    const object=drag.preview;
    const valid=object.shape==='line' ? Math.hypot(object.width,object.depth,object.height)>.001
      : object.width>.001 && object.depth>.001;
    const clickLike=(drag.tool==='rectangle'||drag.tool==='circle')&&!drag.moved;
    if (valid&&!clickLike) {
      if (drag.tool==='rectangle') insertRectangle(object,drag.host);
      else if (drag.tool==='line') addLineObject(object);
      else placePlanarFace(object);
      $('#line-length').value='';
    } else if (clickLike || (drag.tool!=='line' && !valid)) {
      state.drawPending={...drag,preview:null,previewArc:null,updates:null};
      showStatus(drag.tool==='rectangle'
        ? 'Sudut pertama ditetapkan. Klik sudut berlawanan atau ketik X x Y lalu Enter.'
        : drag.tool==='circle'
        ? 'Pusat ditetapkan. Klik titik tepi atau ketik radius lalu Enter.'
        : 'Masukkan ukuran bila perlu, lalu klik arah pada kanvas.');
    }
  } else if (drag?.updates && drag.updates.some((object,i)=>JSON.stringify(object)!==JSON.stringify(drag.sources[i]))) {
    if (['move','rotate','scale'].includes(drag.tool) && targetId(drag.object)!==drag.object.id) {
      batch(drag.sources,drag.updates,[targetId(drag.object)]);
    } else if (drag.tool==='pull') commitPull(drag.object,drag.updates[0]);
    else edit(drag.object,drag.updates[0]);
    if (drag.tool==='pull') $('#line-length').value='';
  } else if (drag && ['rectangle','circle','arc','pull'].includes(drag.tool)) {
    state.drawPending={...drag,preview:null,previewArc:null,updates:null};
    showStatus(drag.tool==='rectangle'
      ? 'Sudut pertama ditetapkan. Klik sudut berlawanan atau ketik X x Y lalu Enter.'
      : drag.tool==='circle'
      ? 'Pusat ditetapkan. Klik titik tepi atau ketik radius lalu Enter.'
      : 'Masukkan ukuran bila perlu, lalu klik arah pada kanvas.');
  }
  redraw();
});
canvas.addEventListener('lostpointercapture',()=>{
  if (state.drag || state.linePress) {
    state.drag=null; state.linePress=null; sectionDragPreview=null; redraw();
  }
});
window.addEventListener('keydown',event=>{
  const dialog=document.querySelector('dialog[open]');
  const target=/** @type {HTMLElement} */ (event.target);
  const typing=['INPUT','TEXTAREA','SELECT'].includes(target.tagName) || target.isContentEditable;
  if (event.key==='Escape') {
    if (dialog) return;
    if (!$('#account-menu').hidden) {accountMenu(false);return;}
    if (!$('#object-menu').hidden) {hideObjectMenu();return;}
    if (!$('#comment-composer').hidden) {closeCommentComposer();return;}
    if (!$('#sections-panel').hidden) {toggleSections(false);return;}
    if (state.drag) {state.drag=null;state.inference=null;setTool('select');redraw();return;}
    if (state.arcPending) {state.arcPending=null;state.inference=null;setTool('select');redraw();return;}
    if (state.drawPending) {state.drawPending=null;state.inference=null;setTool('select');redraw();return;}
    if (state.movePending) {state.movePending=null;state.inference=null;setTool('select');redraw();return;}
    if (state.rotatePending) {state.rotatePending=null;state.inference=null;setTool('select');redraw();return;}
    if (state.offsetPending) {state.offsetPending=null;state.inference=null;setTool('select');redraw();return;}
    if (state.measurePending) {state.measurePending=null;state.inference=null;
      showStatus('Pengukuran dibatalkan. Klik titik awal baru atau Esc untuk keluar.');redraw();return;}
    if (state.sectionPending) {state.sectionPending=null;state.inference=null;
      showStatus('Bidang potong dibatalkan.');redraw();return;}
    if (state.linePending) {finishLine();setTool('select');return;}
    if (typing) return;
    if (state.inside) {exitContainer();return;}
    if (!state.layout && state.tool!=='select') {setTool('select');state.inference=null;redraw();return;}
    if (state.selected.size) select(null);
    return;
  }
  if (dialog || typing) return;
  const key=event.key.toUpperCase();
  const buttonFocus=['BUTTON','SUMMARY'].includes(target.tagName);
  if (state.movePending && (event.key==='ArrowUp' || event.key==='ArrowDown')) {
    event.preventDefault();
    const pending=state.movePending;
    pending.axis=pending.axis==='z'?null:'z';
    const destination=pending.pointer?moveDestination(pending.pointer,pending):null;
    pending.destination=destination?.world||null;
    pending.updates=destination?movePreview(pending.sources,pending.start,destination.world):null;
    state.inference=destination?.label?destination:null;
    if (pending.axis==='z' && destination) {
      showStatus('Sumbu Z terkunci · ΔZ '+lengthLabel(destination.world[2]-pending.start[2])+
        ' · klik kedua untuk menetapkan');
    } else if (pending.axis==='z') {
      pending.axis=null;
      showStatus('Sumbu Z tidak terlihat pada arah kamera ini. Putar tampilan lalu coba lagi.');
    } else {
      showStatus('Gerak bebas pada bidang dan snap 3D. Tekan panah lagi untuk sumbu Z.');
    }
    redraw();
    return;
  }
  if (key==='DELETE' || key==='BACKSPACE') {
    if (state.layout || event.ctrlKey || event.metaKey || event.altKey) return;
    event.preventDefault();
    const section=activeSectionId
      ? sectionPlanes().find(item=>item.id===activeSectionId) : null;
    if (section) {removeSection(section);return;}
    removeObject();
    return;
  }
  if (buttonFocus && !/^[a-z]$/i.test(event.key)) return;
  if ((['line','rectangle','circle','arc','pull'].includes(state.tool) ||
      (state.tool==='rotate'&&state.rotatePending) ||
      (state.tool==='offset'&&state.offsetPending)) && !state.layout &&
      !event.ctrlKey && !event.metaKey && !event.altKey) {
    const pattern=state.tool==='rotate'?/^[0-9.\-]$/:/^[0-9.,;xX.]$/;
    if (pattern.test(event.key)) {
      event.preventDefault();
      const input=$('#line-length');
      input.focus({preventScroll:true});
      input.value=event.key==='.'?'0.':event.key;
      input.dispatchEvent(new Event('input',{bubbles:true}));
      return;
    }
  }
  if ((event.ctrlKey||event.metaKey) && ['Z','Y'].includes(key)) {
    event.preventDefault();reverse(event.shiftKey||key==='Y');return;
  }
  if (state.layout || event.ctrlKey || event.metaKey || event.altKey) return;
  if (event.code==='Space') {
    event.preventDefault();
    state.drag=null;state.inference=null;
    setTool('select');redraw();return;
  }
  if (key==='F' && event.shiftKey) { event.preventDefault(); fit();return; }
  if (key==='H') {
    event.preventDefault();
    if (event.shiftKey) setHiddenMode(!state.showHidden);
    else toggleHideSelection();
    return;
  }
  if (key==='G' || key==='Q') {
    if (!canEditModel()) {showStatus('Akses ini tidak dapat mengubah model.');return;}
    event.preventDefault();createContainer(key==='Q');return;
  }
  const tool=Object.entries(tools).find(([,value])=>value[1]===key);
  if (tool) setTool(tool[0]);
});

new ResizeObserver(()=>{
  if (camera.perspective) camera.scale=focalPixels()/camera.distance;
  redraw();
}).observe(canvas);
