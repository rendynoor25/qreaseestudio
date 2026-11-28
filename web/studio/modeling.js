
function renderTree() {
  renderModelGridList();
  const match = $('#search').value.trim().toLowerCase();
  const objects = state.doc?.objects || [];
  const list = $('#objects');
  if (treeCache.doc===state.doc && treeCache.inside===state.inside && treeCache.match===match) {
    for (const button of list.querySelectorAll('.tree-row')) {
      const selected=state.selected.has(button.dataset.objectId);
      button.classList.toggle('selected',selected);
      button.setAttribute('aria-pressed',String(selected));
    }
    return;
  }
  treeCache.doc=state.doc;
  treeCache.inside=state.inside;
  treeCache.match=match;
  $('#object-count').textContent = objects.length;
  const scroll = list.scrollTop;
  list.replaceChildren();
  const shown=new Set();
  const matchingContainers=new Set(objects.filter(item=>item.container &&
    (item.name.toLowerCase().includes(match) || item.container.name.toLowerCase().includes(match)))
    .map(item=>item.container.id));
  const row=(id,name,glyphName,child=false)=>{
    const button = document.createElement('button');
    const glyph = document.createElement('span');
    const label = document.createElement('span');
    icon(glyph,glyphName);
    label.textContent = name;
    button.className = 'tree-row' + (state.selected.has(id) ? ' selected' : '') + (child?' child-row':'');
    button.dataset.objectId=id;
    button.setAttribute('aria-pressed', String(state.selected.has(id)));
    button.append(glyph, label);
    button.onclick = event => select(id,event.shiftKey);
    if (matchingContainers.has(id)) button.ondblclick=()=>enterContainer(id);
    list.append(button);
  };
  const looseLines=objects.filter(item=>item.shape==='line' && !item.container && item.name.toLowerCase().includes(match));
  if (looseLines.length) {
    const heading=document.createElement('div');
    heading.className='tree-category';
    heading.textContent='Line / Sketch ('+looseLines.length+')';
    list.append(heading);
    for (const line of looseLines) row(line.id,line.name,'line');
  }
  for (const object of objects) {
    if (object.shape==='line' && !object.container) continue;
    const container=object.container;
    if (container) {
      if (!matchingContainers.has(container.id) && state.inside!==container.id) continue;
      if (!shown.has(container.id)) {
        row(container.id,container.name,container.definition?'cube':'group');
        shown.add(container.id);
      }
      if (state.inside!==container.id) continue;
    } else if (!object.name.toLowerCase().includes(match)) continue;
    row(object.id,object.name,object.shape==='line'?'line':object.height?'cube':object.shape,Boolean(container));
  }
  list.scrollTop = scroll;
}

function renderModelGridList() {
  const list=$('#model-grids');
  const items=grids().filter(grid=>grid.name.toLowerCase().includes($('#search').value.trim().toLowerCase()));
  $('#model-grid-count').textContent=String(grids().length);
  list.replaceChildren();
  for(const grid of items){
    const row=document.createElement('div');
    row.className='model-grid-row'+(selectedGridId===grid.id?' selected':'')+(grid.hidden?' hidden-grid':'');
    const selectButton=document.createElement('button');
    selectButton.type='button';selectButton.className='grid-select';
    selectButton.textContent='▦  '+grid.name;
    selectButton.title='Pilih grid '+grid.name;
    selectButton.onclick=()=>selectModelGrid(grid.id);
    const action=(label,title,click)=>{const button=document.createElement('button');
      button.type='button';button.className='grid-action';button.textContent=label;button.title=title;
      button.setAttribute('aria-label',title+' '+grid.name);button.disabled=!canEditModel();button.onclick=click;return button;};
    row.append(selectButton,
      action(grid.hidden?'◉':'◌',grid.hidden?'Tampilkan':'Sembunyikan',()=>updateGrid(grid.id,{hidden:!grid.hidden})),
      action('✎','Ganti nama',()=>{const name=prompt('Nama grid:',grid.name)?.trim();if(name)renameGrid(grid.id,name);} ),
      action('×','Hapus',()=>removeGrid(grid.id)));
    list.append(row);
  }
}
function selectModelGrid(id) {
  selectedGridId=id;
  state.selected.clear();
  renderTree();redraw();
  const grid=grids().find(item=>item.id===id);
  if(grid)showStatus(grid.hidden?'Grid '+grid.name+' tersembunyi. Pilih Tampilkan untuk melihatnya.':
    'Grid '+grid.name+' dipilih. Bidang datumnya terlihat di model.');
}
function updateGrid(id,changes) {
  if(!canEditModel())return;
  const layout=sheetLayout();
  saveSheetLayout({...layout,gridLines:grids().map(grid=>grid.id===id?{...grid,...changes}:grid)});
}
function renameGrid(id,name) {
  const trimmed=name.trim().slice(0,12);
  if(!trimmed)return;
  if(grids().some(grid=>grid.id!==id&&grid.name.toUpperCase()===trimmed.toUpperCase())){
    showStatus('Nama grid sudah digunakan.');return;
  }
  updateGrid(id,{name:trimmed});
}
function removeGrid(id) {
  if(!canEditModel())return;
  const layout=sheetLayout();
  if(selectedGridId===id)selectedGridId=null;
  if(layoutSelected?.kind==='grid'&&layoutSelected.id===id){layoutSelected=null;$('#layout-selection').hidden=true;}
  saveSheetLayout({...layout,gridLines:grids().filter(grid=>grid.id!==id),
    dimensions:layout.dimensions.filter(item=>item.gridA!==id&&item.gridB!==id)});
}

function select(id, additive=false) {
  if(!additive)selectedGridId=null;
  activeSectionId=null;
  if (state.movePending) {state.movePending=null;state.inference=null;}
  if (state.rotatePending) {state.rotatePending=null;state.inference=null;}
  if (state.offsetPending) {state.offsetPending=null;state.inference=null;}
  if (!additive && state.selected.size===1 && state.selected.has(id)) return;
  if (!additive) {
    state.selected.clear();
    if (id && members(id).length && state.inside!==id) state.inside=null;
  }
  if (id) {
    if(additive && state.selected.has(id)) state.selected.delete(id);
    else state.selected.add(id);
  }
  refresh();
}

/** @param {QreaseePoint2} start @param {QreaseePoint2} end */
function selectBox(start,end,additive=false) {
  const box={left:Math.min(start[0],end[0]),top:Math.min(start[1],end[1]),
    right:Math.max(start[0],end[0]),bottom:Math.max(start[1],end[1])};
  const crossing=end[0]<start[0];
  const parts=new Map();
  for (const face of state.hits) {
    const id=targetId(face.object);
    if (!id) continue;
    if (!parts.has(id)) parts.set(id,[]);
    parts.get(id).push(face.points);
  }
  const selected=additive?new Set(state.selected):new Set();
  for (const [id,faces] of parts) {
    if (crossing
      ? faces.some(points=>QreaseeLine.boxHitsGeometry(points,box,true))
      : faces.every(points=>QreaseeLine.boxHitsGeometry(points,box,false))) selected.add(id);
  }
  state.selected=selected;
  refresh();
  showStatus(selected.size+' objek dipilih ('+(crossing?'bersinggungan':'di dalam kotak')+').');
}

/** @param {QreaseeObject} object @param {boolean} additive */
function selectConnected(object,additive=false) {
  if (targetId(object)!==object.id) {select(targetId(object),additive);return;}
  const eligible=objects().map((item,index)=>({object:item,mesh:state.meshes[index]}))
    .filter(entry=>entry.mesh && targetId(entry.object)===entry.object.id &&
      (entry.object.container?.id??null)===(object.container?.id??null));
  const ids=QreaseeLine.connectedParts(object.id,eligible);
  state.selected=additive?new Set([...state.selected,...ids]):new Set(ids);
  refresh();
  showStatus(ids.length+' objek terhubung dipilih.');
}

/** @returns {QreaseeObject[]} */
function deletionTargets() {
  /** @type {Map<string, QreaseeObject>} */
  const targets=new Map();
  for (const id of state.selected) {
    const group=members(id);
    const candidates=group.length?group:objects().filter(object=>object.id===id);
    for (const object of candidates) {
      const linked=object.container?.definition && object.container.id===state.inside
        ? linkedMembers(object) : [object];
      for (const item of linked) targets.set(item.id,item);
    }
  }
  return [...targets.values()];
}

/** @param {string} target */
async function toggleHideTarget(target) {
  if (!canEditModel()) {showStatus('Akses ini tidak dapat mengubah model.');return;}
  const targets=commentTargetObjects(target).filter(object=>object.shape!=='line');
  if (!targets.length) return;
  const allHidden=targets.every(object=>object.hidden);
  const after=targets.map(object=>({...object,hidden:!allHidden}));
  const selection=!allHidden&&!state.showHidden?[]:[...state.selected];
  const saved=await batch(targets,after,selection);
  if (saved) showStatus(allHidden?'Objek ditampilkan kembali.':'Objek disembunyikan.');
}

function toggleHideSelection() {
  if (activeSectionId) {
    const section=sectionPlanes().find(item=>item.id===activeSectionId);
    if (section) {updateSection(section,{hidden:!section.hidden});return;}
  }
  if (!canEditModel()) {showStatus('Akses ini tidak dapat mengubah model.');return;}
  const targets=moveSources().filter(object=>object.shape!=='line');
  if (!targets.length) {showStatus('Pilih objek atau Group yang akan disembunyikan.');return;}
  const allHidden=targets.every(object=>object.hidden);
  const after=targets.map(object=>({...object,hidden:!allHidden}));
  const selection=!allHidden&&!state.showHidden?[]:[...state.selected];
  batch(targets,after,selection).then(saved=>{
    if (saved) showStatus(allHidden?'Objek ditampilkan kembali.':'Objek disembunyikan.');
  });
}

function removeObject() {
  if (!canEditModel()) {showStatus('Akses ini hanya dapat '+shareRoleLabel(shareRole()).toLowerCase().replace('dapat ','')+'.');return;}
  if (!state.doc || state.busy || !state.selected.size) return;
  const targets=deletionTargets();
  if (!targets.length) return;
  batch(targets,[],[]).then(deleted=>{
    if (deleted) showStatus(targets.length===1?'Objek dihapus.':targets.length+' objek dihapus.');
  });
}

/** @returns {QreaseeObject[]} */
function moveSources() {
  /** @type {Map<string, QreaseeObject>} */
  const targets=new Map();
  for (const id of state.selected) {
    const group=members(id);
    const candidates=group.length?group:objects().filter(object=>object.id===id);
    for (const object of candidates) {
      const linked=object.container?.definition && object.container.id===state.inside
        ? linkedMembers(object) : [object];
      for (const item of linked) targets.set(item.id,item);
    }
  }
  return [...targets.values()];
}

function movePreview(sources,start,destination,supportZ=null,baseZ=null) {
  if (!destination) return null;
  const dx=destination[0]-start[0],dy=destination[1]-start[1],
    dz=supportZ===null?destination[2]-start[2]:supportZ-baseZ;
  return sources.map(object=>({...object,x:object.x+dx,y:object.y+dy,z:object.z+dz}));
}

function moveBaseZ(sources) {
  return Math.min(...sources.flatMap(object=>previewMesh(object).vertices.map(point=>point[2])));
}

function moveSupportZ(point,pending) {
  if (pending.axis==='z') return null;
  const face=state.hits.findLast(candidate=>!pending.excluded.has(candidate.object.id) &&
    candidate.world.length>=3 && contains(point,candidate.points) &&
    candidate.world.every(vertex=>Math.abs(vertex[2]-candidate.world[0][2])<1e-5));
  return face?.world[0][2]??null;
}

/**
 * Resolve a destination while movement is locked to the vertical axis.
 * The cursor is projected onto the screen-space direction of +Z, then the
 * height is solved so perspective foreshortening does not distort the drag.
 * @param {QreaseePoint2} point
 * @param {{start: QreaseePoint}} pending
 * @returns {QreaseeInference|null}
 */
function verticalMoveDestination(point,pending) {
  const base=stagePoint(pending.start);
  const step=stagePoint([pending.start[0],pending.start[1],pending.start[2]+1]);
  const dx=step[0]-base[0],dy=step[1]-base[1],length2=dx*dx+dy*dy;
  if (!Number.isFinite(base[0]) || length2<16) return null;
  const target=((point[0]-base[0])*dx+(point[1]-base[1])*dy)/length2;
  const measure=value=>{
    const projected=stagePoint([pending.start[0],pending.start[1],pending.start[2]+value]);
    if (!Number.isFinite(projected[0])) return NaN;
    return ((projected[0]-base[0])*dx+(projected[1]-base[1])*dy)/length2;
  };
  let distance=target;
  for (let i=0;i<6;i++) {
    const current=measure(distance);
    const slope=(measure(distance+.01)-current)/.01;
    if (!Number.isFinite(current)||!Number.isFinite(slope)||Math.abs(slope)<1e-6) break;
    const next=distance+(target-current)/slope;
    if (!Number.isFinite(next)) break;
    if (Math.abs(next-distance)<1e-4) {distance=next;break;}
    distance=next;
  }
  distance=clamp(distance,-20000,20000);
  distance=state.snapping?snap(distance):round(distance);
  return {world:/** @type {QreaseePoint} */ ([pending.start[0],pending.start[1],pending.start[2]+distance]),
    label:'Sumbu Z'};
}

/** @param {QreaseePoint2} point @param {Set<string>} seen */
function eraseLinesAt(point,seen) {
  for (const face of state.hits) {
    if (face.object.shape!=='line' || targetId(face.object)!==face.object.id) continue;
    if (contains(point,face.points)) seen.add(face.object.id);
  }
}

/** @param {QreaseePoint2} start @param {QreaseePoint2} end @param {Set<string>} seen */
function eraseLinesAlong(start,end,seen) {
  const steps=Math.max(1,Math.ceil(Math.hypot(end[0]-start[0],end[1]-start[1])/3));
  for (let i=0;i<=steps;i++) {
    eraseLinesAt([start[0]+(end[0]-start[0])*i/steps,start[1]+(end[1]-start[1])*i/steps],seen);
  }
}

/** @param {Set<string>} ids @returns {QreaseeObject[]} */
function eraseLineTargets(ids) {
  /** @type {Map<string, QreaseeObject>} */
  const targets=new Map();
  for (const id of ids) {
    const object=objects().find(item=>item.id===id && item.shape==='line');
    if (!object) continue;
    const linked=object.container?.definition && object.container.id===state.inside
      ? linkedMembers(object) : [object];
    for (const item of linked) targets.set(item.id,item);
  }
  return [...targets.values()];
}

/** @param {QreaseePoint2} point @param {{z: number, axis?: string|null, excluded: Set<string>, start: QreaseePoint}} pending @returns {QreaseeInference|null} */
function moveDestination(point,pending) {
  if (pending.axis==='z') return verticalMoveDestination(point,pending);
  const snapped=infer(point,undefined,pending.excluded);
  if (snapped) return snapped;
  const face=pickFace(point,false);
  const elevation=face?.object && !pending.excluded.has(face.object.id) &&
    face.world.length && face.world.every(vertex=>Math.abs(vertex[2]-face.world[0][2])<.00001)
    ? face.world[0][2] : pending.z;
  return drawingPoint(point,elevation,pending.excluded);
}

const normalizeAngle = value => ((value+180)%360+360)%360-180;
/** @param {QreaseeObject} object @param {QreaseePoint} pivot @param {number} angle @returns {QreaseeObject} */
function rotateObject(object,pivot,angle) {
  const rad=angle*Math.PI/180,cos=Math.cos(rad),sin=Math.sin(rad);
  const dx=object.x-pivot[0],dy=object.y-pivot[1];
  return {...object,x:pivot[0]+dx*cos-dy*sin,y:pivot[1]+dx*sin+dy*cos,
    rotation:normalizeAngle(object.rotation+angle)};
}

function updateRotatePreview(pending,angle) {
  pending.angle=angle;
  pending.updates=pending.sources.map(object=>rotateObject(object,pending.pivot,angle));
  if (document.activeElement!==$('#line-length'))
    $('#line-length').value=Number(angle.toFixed(2));
}

function commitRotate(pending) {
  if (!pending || !Number.isFinite(pending.angle) || Math.abs(pending.angle)<.001) {
    showStatus('Sudut rotasi masih 0°. Gerakkan kursor atau ketik sudut.');
    return;
  }
  const updates=pending.updates || pending.sources.map(object=>rotateObject(object,pending.pivot,pending.angle));
  const selection=[...state.selected];
  const angle=pending.angle;
  state.rotatePending=null;
  state.inference=null;
  $('#line-length').value='';
  batch(pending.sources,updates,selection).then(rotated=>{
    if (rotated) showStatus('Rotasi '+angle.toFixed(1)+'° diterapkan.');
  });
  redraw();
}

function applyRotateValue() {
  const pending=state.rotatePending;
  if (!pending) {showStatus('Tentukan pusat rotasi terlebih dahulu.');return;}
  const size=measurement('rotate');
  if (!size || size.invalid) {measurementError();return;}
  updateRotatePreview(pending,size.primary);
  $('#line-length').value=String(size.primary);
  commitRotate(pending);
}

/** @param {QreaseeObject|null|undefined} object @returns {boolean} */
function validOffsetHost(object) {
  return Boolean(object) && object.height===0 && !object.wall_axis && !object.plane_u &&
    !object.solid_id && targetId(object)===object.id && !state.inside &&
    ['rectangle','circle','polygon'].includes(object.shape) &&
    (object.shape!=='polygon' || Boolean(object.profile));
}

/** @param {QreaseePoint2} point @returns {QreaseeObject|null} */
function offsetHostAt(point) {
  const direct=pickFace(point,false)?.object;
  if (validOffsetHost(direct)) return direct;
  let best=null;
  for (const face of state.hits) {
    if (face.world.length<3 || !validOffsetHost(face.object)) continue;
    const distance=pointToPolygonEdge(point,face.points);
    if (distance<=snapRadius && (!best || distance<best.distance))
      best={object:face.object,distance};
  }
  return best?.object??null;
}

/** @param {QreaseePoint[]} outline @param {QreaseePoint} origin @returns {{normal: QreaseePoint2, point: QreaseePoint2}|null} */
function offsetNormal(outline,origin) {
  const area=outline.reduce((sum,point,index)=>{
    const next=outline[(index+1)%outline.length];
    return sum+point[0]*next[1]-next[0]*point[1];
  },0);
  const side=area>=0?1:-1;
  let best=null;
  for (let i=0;i<outline.length;i++) {
    const a=outline[i],b=outline[(i+1)%outline.length];
    const dx=b[0]-a[0],dy=b[1]-a[1],length=Math.hypot(dx,dy);
    if (length<1e-9) continue;
    const fraction=clamp(((origin[0]-a[0])*dx+(origin[1]-a[1])*dy)/(dx*dx+dy*dy),0,1);
    const distance=Math.hypot(origin[0]-a[0]-fraction*dx,origin[1]-a[1]-fraction*dy);
    if (!best || distance<best.distance)
      best={distance,normal:[side*dy/length,-side*dx/length],
        point:[/** @type {number} */ (a[0]+fraction*dx),/** @type {number} */ (a[1]+fraction*dy)]};
  }
  return best?{normal:best.normal,point:best.point}:null;
}

function updateOffsetPreview(pending,raw) {
  const sign=raw>.000001?1:raw<-.000001?-1:(pending.sign||-1);
  const distance=state.snapping?snap(raw,.05):round(raw);
  pending.sign=Math.sign(distance)||sign;
  pending.distance=distance;
  pending.contour=Math.abs(distance)>=.001?offsetOutline(pending.outline,distance):null;
  if (document.activeElement!==$('#line-length'))
    $('#line-length').value=Math.abs(distance)>=.001?String(displayLength(Math.abs(distance))):'';
}

function offsetFace(host,contour,distance) {
  let geometry=null,shape=host.shape;
  if (host.shape==='rectangle') {
    const width=host.width+2*distance, depth=host.depth+2*distance;
    if (width<=.001 || depth<=.001) return null;
    geometry={x:host.x,y:host.y,z:host.z,width,depth,height:0,rotation:host.rotation};
  } else if (host.shape==='circle') {
    const width=host.width+2*distance, depth=host.depth+2*distance;
    if (width<=.001 || depth<=.001) return null;
    geometry={x:host.x,y:host.y,z:host.z,width,depth,height:0,rotation:host.rotation};
  } else {
    const face=QreaseeLine.polygonFromLoop(contour);
    if (!face) return null;
    shape='polygon';
    geometry={...face,height:0,rotation:0,profile:{...face.profile,inferred:false}};
  }
  return {...host,id:identity(),name:('Offset '+host.name).slice(0,64),shape,...geometry,
    solid_id:null,surface_role:null,opening_id:null,opening_origin:null,
    wall_axis:null,...(shape==='polygon'?{}:{profile:null})};
}

function commitOffset(pending) {
  if (!pending || !pending.contour || Math.abs(pending.distance)<.001) {
    showStatus('Tentukan jarak offset ke dalam atau ke luar.');
    return;
  }
  const object=offsetFace(pending.host,pending.contour,pending.distance);
  if (!object) {showStatus('Jarak offset menghasilkan bidang yang tidak valid.');return;}
  const distance=pending.distance;
  state.offsetPending=null;
  state.inference=null;
  $('#line-length').value='';
  addObject(object,false).then(created=>{
    if (created) showStatus('Offset '+lengthLabel(Math.abs(distance))+' dibuat.');
  });
  redraw();
}

function applyOffsetValue() {
  const pending=state.offsetPending;
  if (!pending) {showStatus('Klik perimeter bidang terlebih dahulu.');return;}
  const size=measurement('offset');
  if (!size || size.invalid) {measurementError();return;}
  updateOffsetPreview(pending,(pending.sign||-1)*size.primary);
  commitOffset(pending);
}

$('#search').onfocus=()=>panel('objects',true);
$('#search').oninput=()=>{
  panel('objects',true);
  $('#objects').hidden=false;
  $('#tree-toggle').setAttribute('aria-expanded','true');
  renderTree();
};
$('#undo').onclick = () => reverse(false);
$('#redo').onclick = () => reverse(true);
$('#delete').onclick = removeObject;
$('#duplicate').onclick = () => {
  const object = currentObject();
  if (!object) return;
  addObject({...object,container:null,id:identity(),name:[...object.name].slice(0,55).join('') + ' salinan',
    x:object.x+.5,y:object.y+.5});
};

function addObject(object, select = true) {
  const anchor=members(state.inside)[0];
  if (!anchor) return edit(null,object,'object',select);
  const container=anchor.container;
  const copies=container.definition ? linkedMembers(anchor) : [anchor];
  const slot=container.definition ? identity() : null;
  return batch([],copies.map(copy=>({
    ...object,id:copy.id===anchor.id ? object.id : identity(),
    container:{...copy.container,slot},
    x:object.x+(copy.x-anchor.x),y:object.y+(copy.y-anchor.y),z:object.z+(copy.z-anchor.z)
  })),select?[object.id]:[]);
}

async function addLineObject(object) {
  const split=state.inside?null:QreaseeLine.splitCrossingLines(objects(),object,identity);
  if (split && (split.before.length || split.after.length>1)) return batch(split.before,split.after,[]);
  return addObject(object);
}

/** @param {QreaseeObject} object @returns {QreaseePoint} */
function surfaceNormal(object) {
  if (object.solid_id && object.surface_role==='side') {
    const bottom=objects().find(item=>item.solid_id===object.solid_id &&
      item.surface_role==='bottom' && item.shape==='rectangle');
    const top=objects().find(item=>item.solid_id===object.solid_id &&
      item.surface_role==='top' && item.shape==='rectangle');
    if (bottom && top) {
      const {u,v,n}=faceFrame(bottom);
      const center=[(bottom.x+top.x)/2,(bottom.y+top.y)/2,(bottom.z+top.z)/2];
      const offset=[object.x-center[0],object.y-center[1],object.z-center[2]];
      const axes=[u,v,n];
      let index=0;
      for (let i=1;i<3;i++) if (Math.abs(dotPoint(offset,axes[i]))>Math.abs(dotPoint(offset,axes[index]))) index=i;
      const side=dotPoint(offset,axes[index]);
      if (Math.abs(side)>1e-6) return /** @type {QreaseePoint} */ (axes[index].map(value=>Math.sign(side)*value));
    }
  }
  if (object.plane_u && object.plane_v) {
    const [u,v]=[object.plane_u,object.plane_v];
    return [u[1]*v[2]-u[2]*v[1],u[2]*v[0]-u[0]*v[2],u[0]*v[1]-u[1]*v[0]];
  }
  if (!object.wall_axis) return [0,0,1];
  const angle=object.rotation*Math.PI/180,cos=Math.cos(angle),sin=Math.sin(angle);
  const [x,y]=object.wall_axis,u=[x*cos-y*sin,x*sin+y*cos];
  return [u[1],-u[0],0];
}
/** @param {QreaseeObject} object @returns {QreaseePoint} */
function surfaceCenter(object) {return [object.x,object.y,object.z];}
/** @param {QreaseeObject} object @returns {{u: QreaseePoint, v: QreaseePoint, n: QreaseePoint}} */
function faceFrame(object) {
  const angle=object.rotation*Math.PI/180, cos=Math.cos(angle), sin=Math.sin(angle);
  if (object.wall_axis) {
    const [x,y]=object.wall_axis;
    const u=/** @type {QreaseePoint} */ ([x*cos-y*sin,x*sin+y*cos,0]);
    return {u,v:[0,0,1],n:[u[1],-u[0],0]};
  }
  return {u:[cos,sin,0],v:[-sin,cos,0],n:[0,0,1]};
}
const dotPoint=(a,b)=>a[0]*b[0]+a[1]*b[1]+a[2]*b[2];
/** @param {QreaseePoint} point @param {number[]} delta @returns {QreaseePoint} */
function offsetPoint(point,delta) {return [point[0]+delta[0],point[1]+delta[1],point[2]+delta[2]];}
function shiftSurface(object,delta) {
  return {...object,x:object.x+delta[0],y:object.y+delta[1],z:object.z+delta[2]};
}
function connectionFaces(source,targetCenter,solidId,openingId=null,openingOrigin=null) {
  const from=surfaceCenter(source),delta=targetCenter.map((value,i)=>value-from[i]);
  if (Math.hypot(...delta)<.001) return [];
  const points=previewMesh({...source,height:0}).vertices;
  const sides=[],edges=[];
  const opening=openingId?{opening_id:openingId,opening_origin:openingOrigin}:{};
  for(let i=0;i<points.length;i++) {
    const a=points[i],b=points[(i+1)%points.length];
    const c=offsetPoint(a,delta),d=offsetPoint(b,delta);
    const edgeVector=b.map((value,j)=>value-a[j]);
    const edgeLength=Math.hypot(...edgeVector),offsetLength=Math.hypot(...delta);
    if(edgeLength<.001) continue;
    const center=[0,1,2].map(j=>(a[j]+b[j]+c[j]+d[j])/4);
    const horizontal=[edgeVector,delta].find(vector=>Math.hypot(vector[0],vector[1])>.001);
    const horizontalLength=Math.hypot(horizontal[0],horizontal[1]);
    const verticalSpan=Math.max(a[2],b[2],c[2],d[2])-Math.min(a[2],b[2],c[2],d[2]);
    const side={id:identity(),name:'Sisi '+(i+1),shape:'rectangle',
      x:center[0],y:center[1],z:center[2],height:0,color:source.color,
      container:source.container??null,solid_id:solidId,surface_role:'side',...opening};
    if(verticalSpan>.001) Object.assign(side,{width:horizontalLength,depth:verticalSpan,
      rotation:0,wall_axis:[horizontal[0]/horizontalLength,horizontal[1]/horizontalLength]});
    else Object.assign(side,{width:edgeLength,depth:offsetLength,
      rotation:Math.atan2(edgeVector[1],edgeVector[0])*180/Math.PI});
    sides.push(side);
    if (!openingId) {
      for(const [first,second] of [[a,b],[c,d]]) {
        const edge=lineObject(first,second,'Tepi');
        if(edge) edges.push({...edge,color:source.color,container:source.container??null,
          solid_id:solidId,surface_role:'edge',...opening});
      }
      const upright=lineObject(a,c,'Tepi');
      if(upright) edges.push({...upright,color:source.color,container:source.container??null,
        solid_id:solidId,surface_role:'edge',...opening});
    }
  }
  return [...sides,...edges];
}

function shellFromObject(source,extruded) {
  const solidId=identity(),normal=surfaceNormal(source);
  const origin=[extruded.x,extruded.y,extruded.z];
  const target=origin.map((value,i)=>value+normal[i]*extruded.height);
  if (!(extruded.height>.001)) return null;
  const base={...source,height:0,solid_id:solidId,opening_id:null,opening_origin:null,
    ...(source.profile?{profile:{...source.profile,inferred:false}}:{})};
  const bottom={...base,x:origin[0],y:origin[1],z:origin[2],surface_role:'bottom'};
  const top={...base,id:identity(),x:target[0],y:target[1],z:target[2],surface_role:'top'};
  return {bottom,top,pieces:[bottom,top,...connectionFaces(bottom,target,solidId)]};
}

function polygonSideFace(loop,template,solidId,name) {
  const face=QreaseeLine.polygonFromLoop(loop);
  if (!face) return null;
  return {...template,id:identity(),name,shape:'polygon',...face,height:0,rotation:0,
    profile:{...face.profile,inferred:false},solid_id:solidId,surface_role:'side',
    opening_id:null,opening_origin:null,wall_axis:null};
}

function polygonSolidPieces(loop,source,solidId,delta) {
  const base={...source,solid_id:solidId,opening_id:null,opening_origin:null,height:0};
  const top=polygonFace(loop.map(point=>offsetPoint(point,delta)),base,'Bidang atas');
  if (!top) return null;
  /** @type {any[]} */
  const pieces=[{...top,id:identity(),solid_id:solidId,surface_role:'top'}];
  for (let index=0;index<loop.length;index++) {
    const a=loop[index],b=loop[(index+1)%loop.length];
    if (Math.hypot(b[0]-a[0],b[1]-a[1],b[2]-a[2])<.001) continue;
    const c=offsetPoint(a,delta),d=offsetPoint(b,delta);
    const side=polygonSideFace([a,b,d,c],base,solidId,'Sisi '+(index+1));
    if (side) pieces.push(side);
    for (const [first,second] of [[a,b],[c,d],[a,c]]) {
      const edge=lineObject(first,second,'Tepi');
      if (edge) pieces.push({...edge,color:source.color,container:source.container??null,
        solid_id:solidId,surface_role:'edge'});
    }
  }
  return {top:pieces[0],pieces};
}

function shellFromPolygon(source,extruded) {
  if (!(extruded.height>.001)) return null;
  const loop=previewMesh({...source,height:0}).vertices;
  if (loop.length<3) return null;
  const normal=surfaceNormal(source),solidId=identity();
  const delta=normal.map(value=>value*extruded.height);
  const bottom=polygonFace(loop,{...source,solid_id:solidId},'Bidang bawah');
  const solid=polygonSolidPieces(loop,source,solidId,delta);
  if (!bottom||!solid) return null;
  return {bottom,top:solid.top,
    pieces:[{...bottom,id:source.id,solid_id:solidId,surface_role:'bottom',height:0},...solid.pieces]};
}

function rebuildPolygonSolid(before,after) {
  const normal=surfaceNormal(before);
  const bottom=objects().find(item=>item.solid_id===before.solid_id &&
    item.surface_role==='bottom'&&item.shape==='polygon');
  if (!bottom) return null;
  const bottomCenter=surfaceCenter(bottom);
  const start=dotPoint(normal,[before.x-bottomCenter[0],before.y-bottomCenter[1],
    before.z-bottomCenter[2]]);
  const moved=after.x!==before.x||after.y!==before.y||after.z!==before.z;
  const amount=moved?dotPoint(normal,[after.x-before.x,after.y-before.y,after.z-before.z])
    :after.height;
  const span=start+amount;
  if (span<.001) return null;
  const loop=previewMesh({...bottom,height:0}).vertices;
  const solid=polygonSolidPieces(loop,bottom,before.solid_id,normal.map(value=>value*span));
  if (!solid) return null;
  const removed=objects().filter(item=>item.solid_id===before.solid_id&&item.id!==bottom.id);
  return batch(removed,solid.pieces,[solid.top.id]);
}

/** @param {QreaseePoint[]} loop @returns {string|null} */
function loopPlaneKey(loop) {
  if (loop.length<3) return null;
  const a=loop[0];
  let normal=null;
  for (let i=1;i<loop.length-1;i++) {
    const ab=[loop[i][0]-a[0],loop[i][1]-a[1],loop[i][2]-a[2]];
    const ac=[loop[i+1][0]-a[0],loop[i+1][1]-a[1],loop[i+1][2]-a[2]];
    const n=[ab[1]*ac[2]-ab[2]*ac[1],ab[2]*ac[0]-ab[0]*ac[2],ab[0]*ac[1]-ab[1]*ac[0]];
    const length=Math.hypot(...n);
    if (length>1e-9) {normal=n.map(value=>value/length);break;}
  }
  if (!normal) return null;
  if (normal.find(value=>Math.abs(value)>1e-9)<0) normal=normal.map(value=>-value);
  const key=normal.map(value=>Math.round(value*1e4)).join(',')+':'+Math.round(dotPoint(normal,a)*1e4);
  return key;
}

/** @param {QreaseePoint[]} loop @param {QreaseeObject} template @param {string=} name */
function polygonFace(loop,template,name=template.name) {
  const face=QreaseeLine.polygonFromLoop(loop);
  if (!face) return null;
  return {...template,id:identity(),name:name.slice(0,64),shape:'polygon',...face,height:0,rotation:0,
    profile:{...face.profile,inferred:false},solid_id:null,surface_role:null,opening_id:null,
    opening_origin:null,wall_axis:null};
}

/** @param {QreaseeObject} object */
/** @param {QreaseeObject} object */
function placePlanarFace(object) {
  const loop=previewMesh({...object,height:0}).vertices;
  const key=loopPlaneKey(loop);
  if (!key) return addObject(object,false);
  const candidates=[];
  for (const item of objects()) {
    if (item.id===object.id || item.height!==0 || item.solid_id || item.opening_id ||
        state.inside || targetId(item)!==item.id ||
        !['rectangle','circle','polygon'].includes(item.shape)) continue;
    const shapeLoop=previewMesh({...item,height:0}).vertices;
    if (loopPlaneKey(shapeLoop)!==key) continue;
    const pair=QreaseeLine.splitOverlappingLoops(loop,shapeLoop);
    if (pair?.intersection.length) candidates.push({object:item,loop:shapeLoop,pair});
  }
  if (!candidates.length) return addObject(object,false);
  let remaining=[loop];
  for (const candidate of candidates) {
    const next=[];
    for (const region of remaining) {
      const pair=QreaseeLine.splitOverlappingLoops(region,candidate.loop);
      if (!pair) next.push(region); else next.push(...pair.first);
    }
    remaining=next;
  }
  const after=[];
  for (const candidate of candidates) {
    candidate.pair.second.forEach((piece,index)=>{
      const face=polygonFace(piece,candidate.object);
      if (face) {if(index===0) face.id=candidate.object.id;after.push(face);}
    });
    candidate.pair.intersection.forEach(piece=>{
      const face=polygonFace(piece,object,'Irisan '+object.name);
      if (face) after.push(face);
    });
  }
  remaining.forEach(piece=>{
    const face=polygonFace(piece,object);
    if (face) after.push(face);
  });
  if (!after.length) return addObject(object,false);
  return batch(candidates.map(candidate=>candidate.object),after,[]);
}

function insertRectangle(object,host) {
  const plainHost=!host || (!host.solid_id && host.height===0);
  if (!object.wall_axis && !state.inside && plainHost) return placePlanarFace(object);
  if (!host || targetId(host)!==host.id || state.inside !== (host.container?.id??null))
    return addObject(object,false);
  if (host.height===0 && !host.solid_id) {
    const pair=QreaseeLine.splitRectanglePair(host,object);
    if (!pair) return addObject(object,false);
    const container=host.container??object.container??null;
    const hostPieces=pair.host.map((geometry,index)=>({...host,...geometry,
      id:index===0?host.id:identity(),name:index===0?host.name:'Bidang tepi'}));
    const childPieces=pair.child.map((geometry,index)=>({...object,...geometry,container,
      id:identity(),name:index===0?object.name:'Bidang tepi'}));
    const intersection={...object,...pair.intersection,container,id:object.id,
      name:pair.child.length?'Bidang potong':object.name};
    return batch([host],[...hostPieces,...childPieces,intersection],[]);
  }
  let surface=host,others=[];
  if (host.height>0) {
    const shell=shellFromObject(host,host);
    if (!shell) return addObject(object,false);
    surface=shell.top;
    others=shell.pieces.filter(part=>part.id!==surface.id);
  }
  if (surface.height!==0) return addObject(object,false);
  const strips=QreaseeLine.splitRectangle(surface,object);
  if (!strips) return addObject(object,false);
  const pieces=strips.map((geometry,index)=>({...surface,...geometry,
    id:index===0?surface.id:identity(),name:index===0?surface.name:'Bidang tepi',
    ...(surface.profile?{profile:null}:{})}));
  const inner={...object,container:surface.container??null,
    ...(surface.solid_id?{solid_id:surface.solid_id,surface_role:surface.surface_role,
      opening_id:identity(),opening_origin:[object.x,object.y,object.z]}:{})};
  return batch([host],[...others,...pieces,inner],[]);
}

function openingProjection(face,bottom) {
  const normal=surfaceNormal(face);
  const distance=normal.reduce((sum,value,i)=>sum+value*(surfaceCenter(bottom)[i]-surfaceCenter(face)[i]),0);
  return shiftSurface({...face,height:0},normal.map(value=>value*distance));
}

function openingHostPieces(face,origin) {
  const normal=surfaceNormal(face),offset=dotPoint(normal,origin);
  return objects().filter(item=>item.id!==face.id && item.solid_id===face.solid_id &&
    item.surface_role==='side' && !item.opening_id &&
    Math.abs(dotPoint(surfaceNormal(item),normal)-1)<1e-4 &&
    Math.abs(dotPoint(normal,[item.x,item.y,item.z])-offset)<1e-4);
}

function cutOpening(face,bottom,origin) {
  const projected=openingProjection(face,bottom);
  const bottomStrips=QreaseeLine.splitRectangle(bottom,projected);
  if (!bottomStrips) return false;
  const oldOpening=objects().filter(item=>item.opening_id===face.opening_id && item.id!==face.id);
  const pieces=bottomStrips.map((geometry,index)=>({...bottom,...geometry,
    id:index===0?bottom.id:identity(),name:index===0?bottom.name:'Bidang bawah'}));
  const walls=connectionFaces(projected,origin,face.solid_id,face.opening_id,origin);
  const hostPieces=openingHostPieces(face,origin);
  return batch([face,bottom,...oldOpening,...hostPieces],
    [...pieces,...walls,...hostPieces.map(item=>({...item,hide_edges:true}))],[]);
}

function pocketOpening(face,bottom,target,origin) {
  const oldOpening=objects().filter(item=>item.opening_id===face.opening_id && item.id!==face.id);
  const normal=surfaceNormal(face);
  const offset=normal.reduce((sum,value,i)=>sum+value*(target[i]-origin[i]),0);
  const opposite=normal.reduce((sum,value,i)=>sum+value*(surfaceCenter(bottom)[i]-origin[i]),0);
  const hostPieces=openingHostPieces(face,origin);
  if (offset>=-.001) {
    const restored={...face,x:origin[0],y:origin[1],z:origin[2],height:0,surface_role:'top'};
    return batch([face,...oldOpening,...hostPieces],
      [restored,...hostPieces.map(item=>({...item,hide_edges:false}))],[restored.id]);
  }
  if (offset<=opposite+.001) return cutOpening(face,bottom,origin);
  const floor={...face,x:target[0],y:target[1],z:target[2],height:0,
    surface_role:'pocket',opening_origin:origin};
  const walls=connectionFaces(floor,origin,face.solid_id,face.opening_id,origin);
  return batch([face,...oldOpening,...hostPieces],
    [floor,...walls,...hostPieces.map(item=>({...item,hide_edges:true}))],[floor.id]);
}

function shellFromCircle(source,extruded) {
  if (!(extruded.height>.001)) return null;
  const solidId=identity(),normal=surfaceNormal(source);
  const origin=[extruded.x,extruded.y,extruded.z];
  const target=origin.map((value,i)=>value+normal[i]*extruded.height);
  const base={...source,height:0,solid_id:solidId,opening_id:null,opening_origin:null};
  const bottom={...base,x:origin[0],y:origin[1],z:origin[2],surface_role:'bottom',name:'Bidang bawah'};
  const top={...base,id:identity(),x:target[0],y:target[1],z:target[2],surface_role:'top',name:'Bidang atas'};
  const side={...base,id:identity(),x:origin[0],y:origin[1],z:origin[2],
    height:extruded.height,surface_role:'side',name:'Sisi silinder'};
  return {bottom,top,side,pieces:[bottom,top,side]};
}

function pullCircleTop(before,after) {
  const side=objects().find(item=>item.solid_id===before.solid_id && item.surface_role==='side'
    && item.shape==='circle');
  const bottom=objects().find(item=>item.solid_id===before.solid_id && item.surface_role==='bottom');
  if (!side || !bottom) return null;
  const normal=surfaceNormal(before);
  const center=[before.x,before.y,before.z];
  const moved=after.x!==before.x || after.y!==before.y || after.z!==before.z;
  const amount=moved?-after.height:after.height;
  const target=center.map((value,i)=>value+normal[i]*amount);
  const base=[bottom.x,bottom.y,bottom.z];
  const span=Math.max(.001,normal.reduce((sum,value,i)=>sum+value*(target[i]-base[i]),0));
  const top=base.map((value,i)=>value+normal[i]*span);
  const newSide={...side,x:base[0],y:base[1],z:base[2],height:span};
  const newTop={...before,x:top[0],y:top[1],z:top[2],height:0};
  return {top:newTop,side:newSide,previous:side};
}

function rebuildRectangleSolid(before,after) {
  const solidId=before.solid_id;
  if (!solidId) return null;
  const all=objects().filter(item=>item.solid_id===solidId);
  const bottoms=all.filter(item=>item.surface_role==='bottom' && item.shape==='rectangle');
  const tops=all.filter(item=>item.surface_role==='top' && item.shape==='rectangle');
  if (bottoms.length!==1 || tops.length!==1 || all.some(item=>item.opening_id)) return null;
  const bottom=bottoms[0],top=tops[0];
  const {u,v,n}=faceFrame(bottom);
  let origin=[bottom.x,bottom.y,bottom.z];
  let width=bottom.width, depth=bottom.depth;
  let height=dotPoint([top.x-origin[0],top.y-origin[1],top.z-origin[2]],n);
  if (!(height>.001)) return null;
  const moved=after.x!==before.x || after.y!==before.y || after.z!==before.z;
  if (before.surface_role==='top') {
    const center=[before.x,before.y,before.z];
    const amount=moved?-after.height:after.height;
    const target=center.map((value,i)=>value+n[i]*amount);
    height=Math.max(.001,dotPoint([target[0]-origin[0],target[1]-origin[1],target[2]-origin[2]],n));
  } else if (before.surface_role==='side') {
    const normal=surfaceNormal(before);
    const amount=moved
      ? dotPoint([after.x-before.x,after.y-before.y,after.z-before.z],normal)
      : after.height;
    const alongU=dotPoint(normal,u), alongV=dotPoint(normal,v);
    if (Math.abs(alongU)>.999) {
      const next=Math.max(.002,width+amount), applied=next-width;
      origin=origin.map((value,i)=>value+normal[i]*applied/2);
      width=next;
    } else if (Math.abs(alongV)>.999) {
      const next=Math.max(.002,depth+amount), applied=next-depth;
      origin=origin.map((value,i)=>value+normal[i]*applied/2);
      depth=next;
    } else return null;
  } else return null;
  const topCenter=origin.map((value,i)=>value+n[i]*height);
  const bottomNext={...bottom,x:origin[0],y:origin[1],z:origin[2],
    width,depth,height:0,solid_id:solidId,surface_role:'bottom',opening_id:null,opening_origin:null};
  const topNext={...top,x:topCenter[0],y:topCenter[1],z:topCenter[2],
    width,depth,height:0,solid_id:solidId,surface_role:'top',opening_id:null,opening_origin:null};
  const parts=connectionFaces(bottomNext,topCenter,solidId);
  const oldSides=all.filter(item=>item.surface_role==='side');
  const newSides=parts.filter(item=>item.surface_role==='side');
  newSides.forEach((side,index)=>{
    const old=oldSides[index];
    if (old) { side.id=old.id; side.name=old.name; side.color=old.color; if(old.hide_edges) side.hide_edges=true; }
  });
  const quietSolid=all.some(item=>item.hide_edges);
  const visibleParts=quietSolid?parts.filter(item=>item.surface_role!=='edge'):parts;
  const selected=before.surface_role==='top'
    ? topNext.id
    : newSides[oldSides.findIndex(item=>item.id===before.id)]?.id ?? before.id;
  return {before:all,after:[bottomNext,topNext,...visibleParts],selected};
}

function commitPull(before,after) {
  if (before.solid_id && before.opening_id && before.surface_role==='side' &&
      before.shape==='rectangle') {
    const normal=surfaceNormal(before);
    const moved=after.x!==before.x || after.y!==before.y || after.z!==before.z;
    const amount=moved
      ? dotPoint([after.x-before.x,after.y-before.y,after.z-before.z],normal)
      : after.height;
    if (amount>.001) {
      const clean={...before,solid_id:null,surface_role:null,opening_id:null,opening_origin:null};
      const extruded={...after,solid_id:null,surface_role:null,opening_id:null,opening_origin:null,
        height:Math.max(.001,amount)};
      const shell=shellFromObject(clean,extruded);
      if (shell) {
        const planePoint=[before.x,before.y,before.z];
        const planeOffset=dotPoint(normal,planePoint);
        const hostPieces=objects().filter(item=>item.id!==before.id &&
          item.solid_id===before.solid_id && item.surface_role==='side' &&
          Math.abs(dotPoint(surfaceNormal(item),normal)-1)<1e-4 &&
          Math.abs(dotPoint(normal,[item.x,item.y,item.z])-planeOffset)<1e-4);
        const mergedHost=hostPieces.map(item=>({...item,hide_edges:true}));
        const pieces=shell.pieces
          .filter(piece=>piece.surface_role!=='edge')
          .map(piece=>piece.surface_role==='side'||piece.surface_role==='bottom'
            ? {...piece,hide_edges:true}:piece);
        return batch([before,...hostPieces],[...pieces,...mergedHost],[shell.top.id]);
      }
    }
  }
  if (before.solid_id && before.opening_id &&
      ['top','side','pocket'].includes(before.surface_role)) {
    const origin=before.opening_origin??surfaceCenter(before),normal=surfaceNormal(before);
    const sideOpening=before.surface_role==='side' || (before.surface_role==='pocket' && Boolean(before.wall_axis));
    const bottom=sideOpening
      ? objects().find(item=>item.id!==before.id && item.solid_id===before.solid_id &&
          item.surface_role==='side' && item.shape==='rectangle' &&
          dotPoint(surfaceNormal(item),normal)<-.999 &&
          QreaseeLine.splitRectangle(item,openingProjection(before,item)))
      : objects().find(item=>item.solid_id===before.solid_id && item.surface_role==='bottom'
          && item.shape==='rectangle' &&
          QreaseeLine.splitRectangle(item,openingProjection(before,item)));
    const base=surfaceCenter(after);
    const baseOffset=normal.reduce((sum,value,i)=>sum+value*(base[i]-origin[i]),0);
    const target=baseOffset<-.001?base:base.map((value,i)=>value+normal[i]*after.height);
    const targetOffset=normal.reduce((sum,value,i)=>sum+value*(target[i]-origin[i]),0);
    if (bottom && (targetOffset<-.001 || before.surface_role==='pocket'))
      return pocketOpening(before,bottom,target,origin);
  }
  if (before.solid_id && before.shape==='polygon' && before.surface_role==='top') {
    const rebuilt=rebuildPolygonSolid(before,after);
    if (rebuilt) return rebuilt;
  }
  if (before.shape==='polygon' && !before.solid_id && after.height>.001) {
    const shell=shellFromPolygon(before,after);
    if (shell) return batch([before],shell.pieces,[shell.top.id]);
  }
  if (before.solid_id && before.shape==='rectangle' &&
      (before.surface_role==='top' || before.surface_role==='side')) {
    const rebuilt=rebuildRectangleSolid(before,after);
    if (rebuilt) return batch(rebuilt.before,rebuilt.after,[rebuilt.selected]);
    showStatus('Sisi balok ini belum dapat ditarik karena memiliki bukaan.');
    return Promise.resolve(false);
  }
  if (before.solid_id && before.surface_role==='top' && before.shape==='circle') {
    const pull=pullCircleTop(before,after);
    if (pull) return batch([before,pull.previous],[pull.top,pull.side],[pull.top.id]);
  }
  if (before.shape==='circle' && !before.solid_id && after.height>.001) {
    const shell=shellFromCircle(before,after);
    if (shell) return batch([before],shell.pieces,[shell.top.id]);
  }
  if (before.shape==='rectangle' && after.height>.001) {
    const shell=shellFromObject(before,after);
    if (shell) return batch([before],shell.pieces,[shell.top.id]);
  }
  return edit(before,after);
}

/** Distance from an opening's host plane to the opposite face of the same solid. */
function openingThroughOffset(face) {
  if (!face?.solid_id || !face.opening_id || !['top','side','pocket'].includes(face.surface_role))
    return null;
  const origin=face.opening_origin??surfaceCenter(face);
  const normal=surfaceNormal(face);
  const sideOpening=face.surface_role==='side'||
    (face.surface_role==='pocket'&&Boolean(face.wall_axis));
  const bottom=sideOpening
    ? objects().find(item=>item.id!==face.id&&item.solid_id===face.solid_id&&
        item.surface_role==='side'&&item.shape==='rectangle'&&
        dotPoint(surfaceNormal(item),normal)<-.999&&
        QreaseeLine.splitRectangle(item,openingProjection(face,item)))
    : objects().find(item=>item.solid_id===face.solid_id&&item.surface_role==='bottom'&&
        item.shape==='rectangle'&&
        QreaseeLine.splitRectangle(item,openingProjection(face,item)));
  if (!bottom) return null;
  return normal.reduce((sum,value,i)=>sum+value*(surfaceCenter(bottom)[i]-origin[i]),0);
}

/** Push an opening straight through its block, creating a clean hole. */
function pushThroughOpening(face) {
  const opposite=openingThroughOffset(face);
  if (opposite===null||opposite>=-.001) return false;
  const origin=face.opening_origin??surfaceCenter(face);
  const normal=surfaceNormal(face);
  const target=origin.map((value,i)=>value+normal[i]*(opposite-.002));
  state.drawPending=null;
  state.drag=null;
  state.linePress=null;
  state.inference=null;
  state.selected.delete(face.id);
  const result=commitPull(face,{...face,x:target[0],y:target[1],z:target[2],height:0});
  if (result&&typeof result.then==='function')
    result.then(saved=>{if (saved) showStatus('Bukaan menembus balok dibuat.');});
  else if (result) showStatus('Bukaan menembus balok dibuat.');
  return true;
}

function enterContainer(id) {
  if (!members(id).length) return;
  state.inside=id;
  state.selected.clear();
  refresh();
}
$('#edit-container').onclick=()=>enterContainer(onlySelected());
function exitContainer() {
  const id=state.inside;
  state.inside=null;
  state.selected=new Set(id?[id]:[]);
  refresh();
}
$('#exit-container').onclick=exitContainer;
$('#remove-container').onclick=removeObject;
$('#explode-container').onclick=()=>{
  const before=members(onlySelected());
  if (before.length) batch(before,before.map(object=>({...object,container:null})),before.map(object=>object.id));
};
$('#copy-container').onclick=()=>{
  const source=members(onlySelected());
  if (!source.length) return;
  const id=identity();
  const offset=Math.max(.5, Math.max(...source.map(o=>o.x+Math.max(Math.abs(o.width),Math.abs(o.depth))/2))-
    Math.min(...source.map(o=>o.x-Math.max(Math.abs(o.width),Math.abs(o.depth))/2))+.5);
  batch([],source.map(object=>({
    ...object,id:identity(),x:object.x+offset,container:{...object.container,id}
  })),[id]);
};
function createContainer(component) {
  const sources=objects().filter(object=>state.selected.has(object.id) && !object.container);
  if (!sources.length) return;
  const name=component?'Component':'Group';
  $('#create-title').textContent='Buat '+name;
  $('#container-name').value=name;
  const dialog=$('#container-dialog');
  dialog.showModal();
  $('#container-name').select();
  $('#container-form').onsubmit=event=>{
    event.preventDefault();
    const label=$('#container-name').value.trim();
    if(!label) return;
    const id=identity(),definition=component?identity():null;
    dialog.close();
    batch(sources,sources.map(object=>({...object,container:{id,name:label,definition,slot:definition?identity():null}})),[id]);
  };
}
$('#cancel-container').onclick=()=>$('#container-dialog').close();
$('#object-form').oninput = event => { event.currentTarget.dataset.dirty = 'yes'; };
$('#object-form').onsubmit = event => {
  event.preventDefault();
  if (!objectBaseline) return;
  const values = /** @type {Record<string, any>} */ (Object.fromEntries(new FormData(event.currentTarget)));
  for (const field of lengthFields) values[field] = Number(values[field])/unitFactors[displayUnit];
  values.rotation=Number(values.rotation);
  edit(objectBaseline, {...objectBaseline,...values});
};
$('#sheet-form').oninput = event => { event.currentTarget.dataset.dirty = 'yes'; };
$('#sheet-form').onsubmit = event => {
  event.preventDefault();
  if (!sheetBaseline) return;
  const values = /** @type {Record<string, any>} */ (Object.fromEntries(new FormData(event.currentTarget)));
  values.scale = Number(values.scale);
  values.cut_height = Number(values.cut_height)/unitFactors[displayUnit];
  edit(sheetBaseline, {...sheetBaseline,...values}, 'sheet');
};

$('#new-project').onclick = () => { $('#file-menu').open = false; openRoom(true); };
$('#demo-project').onclick = () => { $('#file-menu').open = false; openRoom(false); };
$('#all-projects').onclick = () => { $('#file-menu').open = false; showProjectHome(); };
$('#home-new').onclick = () => { $('#home-message').textContent='Membuat proyek…';openRoom(true); };
$('#home-example').onclick = () => { $('#home-message').textContent='Membuka contoh…';openRoom(false); };
$('#home-theme').onclick = () => $('#theme-toggle').click();
$('#share').onclick = () => {
  if (!state.room) return;
  renderShareDialog();
  $('#share-feedback').textContent = '';
  $('#share-dialog').showModal();
};
$('#share-role').onchange = event => {
  /** @type {HTMLSelectElement} */ (event.target).blur();
  changeShareRole(/** @type {HTMLSelectElement} */ (event.target).value);
};
$('#display-name').onchange = event => {
  state.name = String(event.target.value||'').replace(/[\u0000-\u001f\u007f]/g,'')
    .trim().slice(0,32) || 'Tamu';
  event.target.value=state.name;
  localStorage.setItem('qreasee-name', state.name);
  sync();
};
$('#copy-link').onclick = async () => {
  const input = $('#share-link');
  input.select();
  try {
    if (navigator.clipboard) await navigator.clipboard.writeText(input.value);
    else if (!document.execCommand('copy')) throw new Error('copy');
    $('#share-feedback').textContent = 'Tautan disalin.';
  } catch {
    $('#share-feedback').textContent = 'Tekan Ctrl+C untuk menyalin tautan yang dipilih.';
  }
};

function download(extension, mime, body) {
  const link = document.createElement('a');
  const url = URL.createObjectURL(new Blob([body], {type:mime}));
  link.href = url;
  link.download = (state.doc.sheet.title.replace(/[^a-z0-9_-]+/gi, '-').replace(/^-|-$/g, '') || 'qreasee') + extension;
  link.click();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
  $('#file-menu').open = false;
}
$('#export-json').onclick = () => {
  if (state.doc) download('.qreasee.json','application/json',JSON.stringify(state.doc,null,2));
};
$('#export-obj').onclick = () => {
  if (!state.doc) return;
  let offset = 1;
  const output = ['# Qreasee · meters · Z up'];
  state.meshes.forEach((mesh,index) => {
    const object = state.doc.objects[index];
    output.push('o ' + object.name.replace(/[^\p{L}\p{N}_-]+/gu,'_'));
    mesh.vertices.forEach(vertex => output.push('v ' + vertex.join(' ')));
    if (mesh.faces.length) mesh.faces.forEach(face => output.push('f ' + face.map(i => i+offset).join(' ')));
    else output.push('l ' + offset + ' ' + (offset+1));
    offset += mesh.vertices.length;
  });
  download('.obj','text/plain;charset=utf-8',output.join('\n')+'\n');
};
$('#export-dwg').onclick = async () => {
  if (!state.doc) return;
  const button = $('#export-dwg');
  button.disabled = true;
  try {
    const {exportDwg} = await import('../cad-export.js');
    const bytes = exportDwg(state.meshes);
    download('.dwg','application/acad',bytes);
    showStatus('Model DWG berhasil diunduh.');
  } catch (error) {
    showStatus('Ekspor DWG gagal: ' + (error instanceof Error ? error.message : String(error)));
  } finally {
    button.disabled = false;
  }
};
$('#export-layout-dwg').onclick = async () => {
  if (!state.doc) return;
  const button = $('#export-layout-dwg');
  button.disabled = true;
  try {
    drawSheet();
    const {exportLayoutDwg} = await import('../cad-export.js');
    const bytes = exportLayoutDwg($('#sheet'));
    download('-layout.dwg','application/acad',bytes);
    showStatus('Lembar Layout DWG berhasil diunduh.');
  } catch (error) {
    showStatus('Ekspor Layout DWG gagal: ' + (error instanceof Error ? error.message : String(error)));
  } finally {
    button.disabled = false;
  }
};
$('#import-skp').onclick = () => $('#skp-file').click();
$('#skp-file').onchange = async event => {
  const input = /** @type {HTMLInputElement} */ (event.target);
  const file = input.files?.[0];
  input.value = '';
  $('#file-menu').open = false;
  if (!file || !state.doc) return;
  const button = $('#import-skp');
  button.disabled = true;
  try {
    const {importSkp} = await import('../skp-import.js');
    const imported = importSkp(await file.arrayBuffer(), file.name);
    if (state.doc.objects.length + imported.length > 250) throw new Error('Ruang model melebihi batas 250 objek.');
    if (JSON.stringify({type:'batch',before:[],after:imported}).length > 200_000) throw new Error('Impor terlalu besar untuk satu perubahan kolaborasi.');
    const deadline=Date.now()+6000;
    while (state.busy && Date.now()<deadline)
      await new Promise(resolve=>setTimeout(resolve,100));
    if (state.busy) throw new Error('Penyimpanan masih berjalan. Coba impor lagi sesaat lagi.');
    const saved = await batch([], imported, [imported[0].container.id]);
    if (saved) showStatus(`${imported.length} bagian SketchUp berhasil diimpor.`);
  } catch (error) {
    showStatus('Impor SKP gagal: ' + (error instanceof Error ? error.message : String(error)));
  } finally {
    button.disabled = false;
  }
};


/** @param {number} yaw @param {number} pitch @returns {(point: QreaseePoint) => QreaseePoint} */
function basis(yaw, pitch) {
  const sy = Math.sin(yaw), cy = Math.cos(yaw);
  const sp = Math.sin(pitch), cp = Math.cos(pitch);
  return ([x,y,z]) => [cy*x+sy*y,sy*sp*x-cy*sp*y-cp*z,sy*cp*x-cy*cp*y+sp*z];
}

function cameraAxes() {
  if (camera.axes) return camera.axes;
  const project=basis(camera.yaw,camera.pitch);
  /** @type {QreaseePoint[]} */
  const columns=[[1,0,0],[0,1,0],[0,0,1]].map(
    /** @param {QreaseePoint} axis */ axis=>project(axis));
  camera.axes=[0,1,2].map(row=>columns.map(column=>column[row]));
  return camera.axes;
}

/** @param {number[][]} points @returns {{min: QreaseePoint, max: QreaseePoint}} */
