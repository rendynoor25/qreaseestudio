
const layoutDefaults=()=>({
  views:[
    {id:'base-plan',mode:'plan',x:14,y:14,w:222,h:130,title:'DENAH',scale:undefined,grid:false},
    {id:'base-iso',mode:'iso',x:242,y:14,w:164,h:130,title:'AKSONOMETRI',scale:undefined,grid:false},
    {id:'base-front',mode:'front',x:14,y:150,w:222,h:98,title:'TAMPAK DEPAN',scale:undefined,grid:false},
    {id:'base-right',mode:'right',x:242,y:150,w:164,h:98,title:'TAMPAK KANAN',scale:undefined,grid:false}
  ],texts:[],dimensions:[],gridLines:[]
});
const sheetLayout=()=>state.doc?.sheet.layout || layoutDefaults();
const grids=()=>sheetLayout().gridLines||[];
let gridProjectionCache={meshes:null,plans:null,scale:null,entries:new Map()};
function nextGridName() {
  const taken=new Set(grids().map(grid=>grid.name.toUpperCase()));
  const last=grids().at(-1)?.name?.trim().toUpperCase()||'';
  const nextAlpha=name=>{
    let value=0;
    for(const letter of name)value=value*26+letter.charCodeAt(0)-64;
    value++;
    let result='';
    while(value){value--;result=String.fromCharCode(65+value%26)+result;value=Math.floor(value/26);}
    return result;
  };
  let candidate=/^\d+$/.test(last)?String(Number(last)+1):/^[A-Z]+$/.test(last)?nextAlpha(last):'A';
  while(taken.has(candidate)) candidate=/^\d+$/.test(candidate)?String(Number(candidate)+1):nextAlpha(candidate);
  return candidate;
}
function layoutProjection(view) {
  const scale=view.scale||state.doc?.sheet.scale;
  if(gridProjectionCache.meshes!==state.meshes||gridProjectionCache.plans!==state.plans||gridProjectionCache.scale!==state.doc?.sheet.scale){
    gridProjectionCache={meshes:state.meshes,plans:state.plans,scale:state.doc?.sheet.scale,entries:new Map()};
  }
  const key=[view.id,view.mode,view.x,view.y,view.w,view.h,scale].join(':');
  if(gridProjectionCache.entries.has(key))return gridProjectionCache.entries.get(key);
  const raw=basis(views[view.mode][0],views[view.mode][1]);
  const meshes=view.mode==='plan'?state.plans:state.meshes;
  const points=meshes.flatMap(mesh=>mesh.vertices.map(raw));
  const {min,max}=points.length?bounds(points):{min:[-5,-5,-1],max:[5,5,3]};
  const spanX=Math.max(.05,max[0]-min[0]),spanY=Math.max(.05,max[1]-min[1]);
  const usableH=view.h-(view.mode==='plan'?35:19);
  const factor=view.mode==='iso'?Math.min((view.w-20)/spanX,usableH/spanY):1000/scale;
  const center=[view.x+view.w/2,view.y+7+usableH/2];
  const project=world=>{const [a,b]=raw(world);return [
    center[0]+(a-(min[0]+max[0])/2)*factor-view.x,
    center[1]+(b-(min[1]+max[1])/2)*factor-view.y];};
  const unprojectX=localX=>(view.x+localX-center[0])/factor+(min[0]+max[0])/2;
  const unprojectY=localY=>(view.y+localY-center[1])/factor+(min[1]+max[1])/2;
  const result={project,unprojectX,unprojectY,factor};
  gridProjectionCache.entries.set(key,result);
  return result;
}
function gridWorldFromLocal(view,a,b) {
  const projection=layoutProjection(view);
  if(view.mode==='plan')return [
    [projection.unprojectX(a[0]),-projection.unprojectY(a[1])],
    [projection.unprojectX(b[0]),-projection.unprojectY(b[1])]];
  let minX=Infinity,maxX=-Infinity,minY=Infinity,maxY=-Infinity;
  for(const mesh of state.meshes)for(const point of mesh.vertices){
    minX=Math.min(minX,point[0]);maxX=Math.max(maxX,point[0]);
    minY=Math.min(minY,point[1]);maxY=Math.max(maxY,point[1]);
  }
  if(!Number.isFinite(minX)){minX=minY=-5;maxX=maxY=5;}
  else {minX-=1;minY-=1;maxX+=1;maxY+=1;}
  const coordinate=projection.unprojectX((a[0]+b[0])/2);
  if(view.mode==='front')return [[coordinate,minY],[coordinate,maxY]];
  if(view.mode==='right')return [[minX,coordinate],[maxX,coordinate]];
  return null;
}
function gridWorldEndpoints(grid) {
  if(grid.worldA&&grid.worldB)return [grid.worldA,grid.worldB];
  const view=sheetLayout().views.find(item=>item.id===grid.viewId);
  return view?gridWorldFromLocal(view,grid.a,grid.b):null;
}
function gridBaseSegment(grid,view) {
  if(grid.hidden||view.mode==='iso')return null;
  if(grid.viewId===view.id&&!grid.worldA)return [grid.a,grid.b];
  const world=gridWorldEndpoints(grid);
  if(!world)return null;
  const projection=layoutProjection(view);
  if(view.mode==='plan')return world.map(([x,y])=>projection.project([x,y,0]));
  if(view.mode==='front'&&Math.abs(world[0][0]-world[1][0])<.05){
    const x=projection.project([world[0][0],0,0])[0];
    return [[x,5],[x,view.h-15]];
  }
  if(view.mode==='right'&&Math.abs(world[0][1]-world[1][1])<.05){
    const x=projection.project([0,world[0][1],0])[0];
    return [[x,5],[x,view.h-15]];
  }
  return null;
}
function gridSegment(grid,view) {
  const segment=gridBaseSegment(grid,view);
  if(!segment)return null;
  const drag=layoutRuntime.drag;
  if(drag?.kind==='grid'&&drag.id===grid.id&&drag.viewId===view.id)
    return segment.map(([x,y])=>[x+drag.dx,y+drag.dy]);
  return segment;
}
function modelGridHeight() {
  let low=Infinity,high=-Infinity;
  for(const mesh of state.meshes)for(const point of mesh.vertices){low=Math.min(low,point[2]);high=Math.max(high,point[2]);}
  return Number.isFinite(low)?[low-.3,high+.5]:[0,3];
}
function modelGridScreenLine(grid,z=modelGridHeight()[0]) {
  const world=gridWorldEndpoints(grid);
  if(!world)return null;
  const points=world.map(([x,y])=>stagePoint([x,y,z]));
  return points.every(point=>point.slice(0,2).every(Number.isFinite))?points:null;
}
function modelGridAt(point) {
  let best=null,distance=9;
  const bottom=modelGridHeight()[0];
  for(const grid of grids()){
    if(grid.hidden)continue;
    const segment=modelGridScreenLine(grid,bottom);
    if(!segment)continue;
    const [a,b]=segment,dx=b[0]-a[0],dy=b[1]-a[1],length=dx*dx+dy*dy;
    const t=length>1e-9?clamp(((point[0]-a[0])*dx+(point[1]-a[1])*dy)/length,0,1):0;
    const gap=Math.hypot(point[0]-a[0]-dx*t,point[1]-a[1]-dy*t);
    if(gap<distance){distance=gap;best=grid;}
  }
  return best;
}
function drawModelGrids() {
  const [bottom,top]=modelGridHeight();
  for(const grid of grids()){
    if(grid.hidden)continue;
    const world=gridWorldEndpoints(grid),low=modelGridScreenLine(grid,bottom);
    if(!world||!low)continue;
    const selected=grid.id===layoutRuntime.selectedGridId,hovered=grid.id===layoutRuntime.hoverGridId;
    const high=world.map(([x,y])=>stagePoint([x,y,top]));
    if(selected&&high.every(point=>point.slice(0,2).every(Number.isFinite))){
      ctx.beginPath();ctx.moveTo(low[0][0],low[0][1]);ctx.lineTo(low[1][0],low[1][1]);
      ctx.lineTo(high[1][0],high[1][1]);ctx.lineTo(high[0][0],high[0][1]);ctx.closePath();
      ctx.fillStyle='#299ce83b';ctx.fill();ctx.strokeStyle='#1685d0';ctx.lineWidth=1.3;ctx.stroke();
    }
    ctx.save();ctx.setLineDash([6,4]);ctx.strokeStyle=selected||hovered?'#1596ef':'#4c8db7';
    ctx.lineWidth=selected||hovered?2:1.25;ctx.beginPath();
    ctx.moveTo(low[0][0],low[0][1]);ctx.lineTo(low[1][0],low[1][1]);ctx.stroke();ctx.restore();
    const [x,y]=low[0];ctx.beginPath();ctx.arc(x,y,selected||hovered?10:8,0,Math.PI*2);
    ctx.fillStyle=selected?'#d7efff':'#f7fbfd';ctx.fill();ctx.strokeStyle='#2879ac';ctx.stroke();
    ctx.fillStyle='#215b81';ctx.font='bold 10px Segoe UI, sans-serif';ctx.textAlign='center';
    ctx.fillText(grid.name,x,y+3.3);
  }
}
function saveSheetLayout(layout) {
  if (!state.doc || state.busy) return Promise.resolve(false);
  return edit(state.doc.sheet,{...state.doc.sheet,layout},'sheet');
}
function sheetPoint(event) {
  const matrix=$('#sheet').getScreenCTM();
  if (!matrix) return null;
  const point=new DOMPoint(event.clientX,event.clientY).matrixTransform(matrix.inverse());
  return [point.x,point.y];
}
function inlineLayoutEdit(element,value,maxLength,onSave) {
  const box=element.getBBox();
  const width=Math.min(285,Math.max(35,box.width+12));
  const x=clamp(box.x,10,410-width),y=clamp(box.y-1,10,281);
  const editor=svg('foreignObject',{x,y,width,height:9});
  const input=document.createElement('input');
  input.setAttribute('xmlns','http://www.w3.org/1999/xhtml');
  input.setAttribute('aria-label','Edit teks pada lembar');
  input.style.cssText='box-sizing:border-box;width:100%;height:100%;border:1px solid #ec8d35;border-radius:2px;background:white;color:#23313b;font:5px Segoe UI,sans-serif;padding:0 2px';
  input.maxLength=maxLength;input.value=value;
  editor.append(input);$('#sheet').append(editor);
  input.focus();input.select();
  let finished=false;
  const finish=commit=>{
    if(finished)return;
    finished=true;editor.remove();
    const next=input.value.trim();
    if(commit&&next!==value)onSave(next);
    else drawSheet();
  };
  input.addEventListener('pointerdown',event=>event.stopPropagation());
  input.addEventListener('dblclick',event=>event.stopPropagation());
  input.addEventListener('keydown',event=>{
    if(event.key==='Enter'){event.preventDefault();finish(true);}
    if(event.key==='Escape'){event.preventDefault();finish(false);}
  });
  input.addEventListener('blur',()=>finish(true));
}
function layoutViewAt(point) {
  return [...sheetLayout().views].reverse().find(view=>point[0]>=view.x && point[0]<=view.x+view.w &&
    point[1]>=view.y && point[1]<=view.y+view.h);
}
function selectLayoutItem(kind,id) {
  layoutRuntime.selected={kind,id};
  layoutRuntime.selectedGridId=kind==='grid'?id:null;
  const panel=$('#layout-selection');
  panel.hidden=false;
  const view=kind==='view'?sheetLayout().views.find(item=>item.id===id):null;
  const item=kind==='text'?sheetLayout().texts.find(item=>item.id===id):null;
  const grid=kind==='grid'?(sheetLayout().gridLines||[]).find(item=>item.id===id):null;
  $('#layout-view-title-row').hidden=!view;
  $('#layout-view-scale-row').hidden=!view||view.mode==='iso';
  $('#layout-text-row').hidden=!item;
  $('#layout-grid-name-row').hidden=!grid;
  $('#layout-grid-visibility').hidden=!grid;
  if(view){$('#layout-view-title').value=view.title;$('#layout-view-scale').value=String(view.scale||state.doc.sheet.scale);}
  if(item) $('#layout-text-value').value=item.text;
  if(grid) $('#layout-grid-name').value=grid.name;
  if(grid) $('#layout-grid-visibility').textContent=grid.hidden?'Tampilkan grid':'Sembunyikan grid';
  drawSheet();
}
function setLayoutTool(tool) {
  if(tool!=='select'&&!layoutRuntime.activeViewId)return;
  layoutRuntime.tool=tool;layoutRuntime.dimensionStart=null;
  layoutRuntime.gridPending=null;layoutRuntime.gridHover=null;
  $('#layout-stage').dataset.tool=tool;
  document.querySelectorAll('.layout-tool').forEach(/** @param {HTMLElement} button */ button=>button.classList.toggle('active',button.dataset.layoutTool===tool));
  drawSheet();
}
function enterLayoutView(id) {
  const view=sheetLayout().views.find(item=>item.id===id);
  if(!view)return;
  layoutRuntime.activeViewId=id;
  $('#layout-stage').classList.add('editing-view');
  $('#layout-mode-label').textContent='Mengedit view: '+view.title;
  $('#layout-finish').hidden=false;
  $('#layout-view-tools').hidden=false;
  $('.layout-title-details').open=false;
  setLayoutTool('select');
  selectLayoutItem('view',id);
}
function exitLayoutView() {
  layoutRuntime.activeViewId=null;
  layoutRuntime.gridPending=null;layoutRuntime.gridHover=null;layoutRuntime.dimensionStart=null;
  $('#layout-stage').classList.remove('editing-view');
  $('#layout-mode-label').textContent='Double click view untuk mengedit isinya';
  $('#layout-finish').hidden=true;
  $('#layout-view-tools').hidden=true;
  setLayoutTool('select');
}

function drawSheet() {
  const sheet = $('#sheet');
  sheet.replaceChildren(svg('rect',{width:420,height:297,fill:'#fff'}));
  if (!state.doc) return;
  const {objects,sheet:settings}=state.doc;
  const add=(name,attrs,text)=>sheet.append(svg(name,attrs,text));
  add('rect',{x:9,y:9,width:402,height:279,fill:'none',stroke:'#33404c','stroke-width':.42});
  const text=(x,y,value,options={})=>add('text',{x,y,fill:'#23313b','font-family':'Segoe UI, Arial, sans-serif','font-size':3.2,...options},value);
  const layout=sheetLayout();
  const viewports=layout.views.map(view=>layoutRuntime.drag?.kind==='view'&&layoutRuntime.drag.id===view.id
    ?{...view,x:layoutRuntime.drag.x,y:layoutRuntime.drag.y}:view);
  let clipped=false;
  for (const view of viewports) {
    const {id,x,y,w,h,mode}=view,dimensions=mode==='plan';
    const viewScale=view.scale||settings.scale;
    const frame=svg('g',{'data-view-id':id,class:[layoutRuntime.selected?.kind==='view'&&layoutRuntime.selected.id===id?'layout-selected':'',layoutRuntime.activeViewId===id?'layout-active':''].filter(Boolean).join(' ')});
    sheet.append(frame);
    const addView=(name,attrs,value)=>frame.append(svg(name,attrs,value));
    const viewText=(tx,ty,value,options={})=>addView('text',{x:tx,y:ty,fill:'#23313b','font-family':'Segoe UI, Arial, sans-serif','font-size':3.2,...options},value);
    const meshes=mode==='plan'?state.plans:state.meshes;
    addView('rect',{x,y,width:w,height:h,fill:'#fdfdfd',stroke:'#c1c9ce','stroke-width':.28});
    const raw=basis(views[mode][0],views[mode][1]);
    const points=meshes.flatMap(mesh=>mesh.vertices.map(raw));
    const clipId='clip-'+id;
    const clip=svg('clipPath',{id:clipId});
    clip.append(svg('rect',{x:x+1,y:y+1,width:w-2,height:h-13}));
    sheet.append(clip);
    const drawing=svg('g',{'clip-path':'url(#'+clipId+')'});
    frame.append(drawing);
    if(view.grid && mode!=='iso') {
      const spacing=Math.max(18,Math.min(70,5000/viewScale));
      const grid=svg('g',{'clip-path':'url(#'+clipId+')',stroke:'#c4cfd4','stroke-width':.18});
      for(let gx=x+spacing,i=0;gx<x+w-4;gx+=spacing,i++) {
        grid.append(svg('line',{x1:gx,y1:y+3,x2:gx,y2:y+h-14}));
        viewText(gx,y+5,String.fromCharCode(65+i),{'text-anchor':'middle','font-size':2.7,fill:'#58707d'});
      }
      for(let gy=y+spacing,i=1;gy<y+h-14;gy+=spacing,i++) {
        grid.append(svg('line',{x1:x+3,y1:gy,x2:x+w-3,y2:gy}));
        viewText(x+5,gy-1,String(i),{'font-size':2.7,fill:'#58707d'});
      }
      frame.insertBefore(grid,drawing);
    }
    if(points.length) {
      const {min,max}=bounds(points);
      const spanX=Math.max(.05,max[0]-min[0]), spanY=Math.max(.05,max[1]-min[1]);
      const usableH=h-(dimensions?35:19);
      const factor=mode==='iso' ? Math.min((w-20)/spanX,usableH/spanY) : 1000/viewScale;
      const center=[x+w/2,y+7+usableH/2];
      const convert = ([a,b,c]) => [center[0]+(a-(min[0]+max[0])/2)*factor,
        center[1]+(b-(min[1]+max[1])/2)*factor,c];
      if (mode!=='iso' && (spanX*factor>w-12 || spanY*factor>usableH)) clipped=true;
      for(const face of scene(meshes,objects,point=>convert(raw(point)))) {
        drawing.append(svg(face.points.length===2?'polyline':'polygon',{
          points:face.points.map(([px,py])=>round(px)+','+round(py)).join(' '),
          fill:face.points.length===2?'none':mode==='iso'?shade(face.object.color,face.tone):face.cut?'#626c73':'#f6f5f0',
          stroke:face.smooth||face.quiet?'none':face.edges?'none':'#2e3941','stroke-width':.24,'stroke-linejoin':'round'
        }));
        face.edges?.forEach((edge,i)=>{
          if (!edge) return;
          const [x1,y1]=face.points[i], [x2,y2]=face.points[(i+1)%face.points.length];
          drawing.append(svg('line',{x1,y1,x2,y2,stroke:'#2e3941','stroke-width':.24}));
        });
      }
      if (dimensions && spanX*factor<=w-12 && spanY*factor<=usableH) {
        const start=convert(min), end=convert(max), dy=end[1]+7;
        const line=(x1,y1,x2,y2)=>addView('line',{x1,y1,x2,y2,stroke:'#566774','stroke-width':.22});
        line(start[0],end[1]+1,start[0],dy+2);
        line(end[0],end[1]+1,end[0],dy+2);
        line(start[0],dy,end[0],dy);
        line(start[0]-1,dy+1,start[0]+1,dy-1);
        line(end[0]-1,dy+1,end[0]+1,dy-1);
        viewText(center[0],dy-1.5,lengthLabel(max[0]-min[0]),{'text-anchor':'middle','font-size':2.9});
      }
    }
    for(const grid of (layout.gridLines||[])) {
      const segment=gridSegment(grid,view);
      if(!segment)continue;
      const [ax,ay]=segment[0],[bx,by]=segment[1];
      const head=[x+ax,y+ay],tail=[x+bx,y+by];
      const mark=svg('g',{'data-grid-id':grid.id,class:'layout-grid'+(layoutRuntime.selectedGridId===grid.id?' layout-selected':'')});
      mark.append(svg('line',{x1:head[0],y1:head[1],x2:tail[0],y2:tail[1],stroke:'#437a9e','stroke-width':.34,'stroke-dasharray':'3 1.4'}));
      mark.append(svg('line',{x1:head[0],y1:head[1],x2:tail[0],y2:tail[1],stroke:'transparent','stroke-width':5}));
      mark.append(svg('circle',{cx:head[0],cy:head[1],r:3.1,fill:'#fff',stroke:'#366b91','stroke-width':.45}));
      mark.append(svg('text',{x:head[0],y:head[1]+1,'text-anchor':'middle',fill:'#225579','font-family':'Segoe UI, Arial, sans-serif','font-size':2.7,'font-weight':700},grid.name));
      mark.append(svg('circle',{cx:tail[0],cy:tail[1],r:.65,fill:'#366b91'}));
      frame.append(mark);
    }
    if(layoutRuntime.gridPending?.viewId===id) {
      const [ax,ay]=layoutRuntime.gridPending.a,[bx,by]=layoutRuntime.gridHover||layoutRuntime.gridPending.a;
      addView('line',{x1:x+ax,y1:y+ay,x2:x+bx,y2:y+by,stroke:'#e78c38','stroke-width':.45,'stroke-dasharray':'2 1'});
      addView('circle',{cx:x+ax,cy:y+ay,r:3,fill:'#fff',stroke:'#e78c38','stroke-width':.5});
    }
    for(const dimension of layout.dimensions.filter(item=>item.viewId===id)) {
      let aLocal=dimension.a,bLocal=dimension.b;
      const gridA=dimension.gridA&&(layout.gridLines||[]).find(item=>item.id===dimension.gridA);
      const gridB=dimension.gridB&&(layout.gridLines||[]).find(item=>item.id===dimension.gridB);
      if(gridA&&gridB) {
        const segmentA=gridSegment({...gridA,hidden:false},view),segmentB=gridSegment({...gridB,hidden:false},view);
        if(!segmentA||!segmentB)continue;
        const dx=segmentA[1][0]-segmentA[0][0],dy=segmentA[1][1]-segmentA[0][1],len=Math.hypot(dx,dy)||1;
        const normal=[-dy/len,dx/len],distance=(segmentB[0][0]-segmentA[0][0])*normal[0]+(segmentB[0][1]-segmentA[0][1])*normal[1];
        aLocal=[segmentA[0][0]-dx/len*7,segmentA[0][1]-dy/len*7];
        bLocal=[aLocal[0]+normal[0]*distance,aLocal[1]+normal[1]*distance];
      }
      const [ax,ay]=aLocal,[bx,by]=bLocal;
      const horizontal=Math.abs(bx-ax)>=Math.abs(by-ay);
      const offset=gridA?0:6;
      const a=[x+ax,y+ay],b=[x+bx,y+by];
      const p1=horizontal?[a[0],a[1]+offset]:[a[0]+offset,a[1]];
      const p2=horizontal?[b[0],a[1]+offset]:[a[0]+offset,b[1]];
      const dimensionGroup=svg('g',{'data-dimension-id':dimension.id,class:layoutRuntime.selected?.kind==='dimension'&&layoutRuntime.selected.id===dimension.id?'layout-selected':''});
      for(const [s,e] of [[a,p1],[b,p2],[p1,p2]]) dimensionGroup.append(svg('line',{x1:s[0],y1:s[1],x2:e[0],y2:e[1],stroke:'#284c5e','stroke-width':.3}));
      dimensionGroup.append(svg('line',{x1:p1[0],y1:p1[1],x2:p2[0],y2:p2[1],stroke:'transparent','stroke-width':5}));
      for(const p of [p1,p2]) addView('circle',{cx:p[0],cy:p[1],r:.7,fill:'#284c5e'});
      const metres=Math.hypot(bx-ax,by-ay)*viewScale/1000;
      dimensionGroup.append(svg('text',{x:(p1[0]+p2[0])/2,y:(p1[1]+p2[1])/2-1.2,'text-anchor':'middle','font-family':'Segoe UI, Arial, sans-serif','font-size':3,fill:'#284c5e'},lengthLabel(metres)));
      frame.append(dimensionGroup);
    }
    const caption=mode==='plan'?view.title+'  /  POTONG '+lengthLabel(settings.cut_height):view.title;
    viewText(x+3,y+h-5,caption,{'font-weight':700,'data-view-caption':id});
    viewText(x+w-3,y+h-5,mode==='iso'?'TANPA SKALA':'1:'+viewScale,{'text-anchor':'end',fill:'#52616d','font-size':2.9});
  }
  add('line',{x1:9,y1:254,x2:411,y2:254,stroke:'#33404c','stroke-width':.42});
  add('line',{x1:310,y1:254,x2:310,y2:288,stroke:'#33404c','stroke-width':.42});
  add('line',{x1:367,y1:254,x2:367,y2:288,stroke:'#33404c','stroke-width':.42});
  text(15,261,'PROYEK',{'font-size':2.9,'font-weight':700,fill:'#52616d'});
  text(15,271,settings.title,{'font-size':5.5,'font-weight':700,'data-sheet-field':'title'});
  if(settings.room_title) text(15,278,settings.room_title,{'font-size':3.4,'font-weight':600,'data-sheet-field':'room_title'});
  const noteWords=settings.notes.replace(/\s+/g,' ').trim().split(' ');
  let noteLine='', noteY=284;
  for (const word of noteWords) {
    if ((noteLine+' '+word).length>135 && noteLine) {
      text(15,noteY,noteLine,{'font-size':2.8,fill:'#52616d'});
      noteY+=4;
      noteLine='';
    }
    noteLine+=(noteLine?' ':'')+word;
  }
  const noteClip=svg('clipPath',{id:'clip-notes'});
  noteClip.append(svg('rect',{x:15,y:275,width:289,height:12}));
  sheet.append(noteClip);
  text(15,noteY,noteLine,{'font-size':2.5,fill:'#52616d','clip-path':'url(#clip-notes)','data-sheet-field':'notes'});
  text(315,261,'FORMAT / SKALA',{'font-size':2.9,'font-weight':700,fill:'#52616d'});
  const viewportScales=new Set(layout.views.filter(view=>view.mode!=='iso').map(view=>view.scale||settings.scale));
  text(315,269,'A3  /  '+(viewportScales.size>1?'BERAGAM':'1:'+(viewportScales.values().next().value||settings.scale)),{'font-size':4.5});
  text(315,276,'DIGAMBAR  '+(settings.drawn_by||'—'),{'font-size':2.6,'data-sheet-field':'drawn_by'});
  text(315,282,'DIPERIKSA  '+(settings.checked_by||'—'),{'font-size':2.6,'data-sheet-field':'checked_by'});
  text(372,261,'NO. GAMBAR',{'font-size':2.9,'font-weight':700,fill:'#52616d'});
  text(372,272,settings.number,{'font-size':4.6,'font-weight':700,'textLength':Math.min(33,Math.max(4,settings.number.length*2.8)),'lengthAdjust':'spacingAndGlyphs','data-sheet-field':'number'});
  if(settings.issue_date) text(372,283,settings.issue_date,{'font-size':2.7,fill:'#52616d','data-sheet-field':'issue_date'});
  for(const item of layout.texts) {
    const draft=layoutRuntime.drag?.kind==='text'&&layoutRuntime.drag.id===item.id?layoutRuntime.drag:null;
    const x=draft?.x??item.x,y=draft?.y??item.y;
    const group=svg('g',{'data-text-id':item.id,class:[layoutRuntime.selected?.kind==='text'&&layoutRuntime.selected.id===item.id?'layout-selected':'',item.viewId===layoutRuntime.activeViewId?'layout-active':''].filter(Boolean).join(' ')});
    group.append(svg('rect',{x:x-1,y:y-item.size,width:Math.max(12,item.text.length*item.size*.55),height:item.size+2,fill:'transparent',stroke:layoutRuntime.selected?.id===item.id?'#ec8d35':'none','stroke-width':.5}));
    group.append(svg('text',{x,y,fill:'#23313b','font-family':'Segoe UI, Arial, sans-serif','font-size':item.size},item.text));
    sheet.append(group);
  }
  $('#scale-note').textContent=clipped
    ? 'Ada tampilan yang terpotong. Gunakan penyebut skala yang lebih besar.'
    : 'Untuk menjaga skala, cetak A3 pada ukuran aktual (100%).';
  drawLayoutCursors();
  if (!layoutRuntime.drag && !layoutRuntime.gridPending) {
    const thumbnail=sheet.cloneNode(true);
    thumbnail.id='sheet-mini';
    thumbnail.querySelector('.remote-cursors')?.remove();
    $('#layout-mini').replaceChildren(thumbnail);
  }
}

function drawLayoutCursors() {
  const sheet=$('#sheet');
  sheet.querySelector('.remote-cursors')?.remove();
  const group=svg('g',{class:'remote-cursors','pointer-events':'none'});
  for (const peer of state.peers) {
    if (peer.cursor?.mode!=='layout') continue;
    const {x,y}=peer.cursor;
    const cursor=svg('g',{transform:'translate('+x+' '+y+')',fill:'#673dac'});
    cursor.append(svg('path',{d:'M0 0l2 6 1.4-2.4 3.2-.2z'}));
    cursor.append(svg('text',{x:4,y:8,'font-size':3.2,'font-weight':700},peer.name||'Tamu'));
    group.append(cursor);
  }
  sheet.append(group);
}

$('#sheet').addEventListener('pointermove',event=>{
  const point=sheetPoint(event);
  if (!point) return;
  state.cursor={mode:'layout',x:round(point[0]),y:round(point[1])};
  if(layoutRuntime.gridPending) {
    const view=sheetLayout().views.find(item=>item.id===layoutRuntime.gridPending.viewId);
    if(view)layoutRuntime.gridHover=layoutSnap(view,point);
    drawSheet();
    return;
  }
  if (layoutRuntime.drag) {
    if(layoutRuntime.drag.kind==='grid'){
      layoutRuntime.drag.dx=point[0]-layoutRuntime.drag.start[0];
      layoutRuntime.drag.dy=point[1]-layoutRuntime.drag.start[1];
      drawSheet();return;
    }
    const source=layoutRuntime.drag.kind==='view'?sheetLayout().views.find(item=>item.id===layoutRuntime.drag.id)
      :sheetLayout().texts.find(item=>item.id===layoutRuntime.drag.id);
    if (!source) return;
    layoutRuntime.drag.x=source.x+point[0]-layoutRuntime.drag.start[0];
    layoutRuntime.drag.y=source.y+point[1]-layoutRuntime.drag.start[1];
    drawSheet();
  }
});
$('#sheet').addEventListener('pointerleave',()=>{if (state.layout) state.cursor=null;});

function addLayoutView(mode,point=[26,22]) {
  if (!state.doc || sheetLayout().views.length>=24) return;
  const names={plan:'DENAH',front:'TAMPAK DEPAN',right:'TAMPAK KANAN',iso:'AKSONOMETRI'};
  const view={id:identity(),mode,x:clamp(point[0],9,291),y:clamp(point[1],9,172),w:120,h:80,
    title:names[mode],scale:mode==='iso'?undefined:state.doc.sheet.scale,grid:false};
  const layout=sheetLayout();
  saveSheetLayout({...layout,views:[...layout.views,view]}).then(saved=>{
    if(saved) selectLayoutItem('view',view.id);
  });
}
function layoutSnap(view,point) {
  const meshes=view.mode==='plan'?state.plans:state.meshes;
  const raw=basis(views[view.mode][0],views[view.mode][1]);
  const projected=meshes.flatMap(mesh=>mesh.vertices.map(raw));
  if (!projected.length) return [point[0]-view.x,point[1]-view.y];
  const {min,max}=bounds(projected),spanX=Math.max(.05,max[0]-min[0]),spanY=Math.max(.05,max[1]-min[1]);
  const usableH=view.h-(view.mode==='plan'?35:19),factor=1000/(view.scale||state.doc.sheet.scale);
  const center=[view.x+view.w/2,view.y+7+usableH/2];
  const candidates=projected.map(([a,b])=>[center[0]+(a-(min[0]+max[0])/2)*factor,
    center[1]+(b-(min[1]+max[1])/2)*factor]);
  const nearest=candidates.reduce((best,item)=>Math.hypot(item[0]-point[0],item[1]-point[1])<
    Math.hypot(best[0]-point[0],best[1]-point[1])?item:best,point);
  const snapPoint=Math.hypot(nearest[0]-point[0],nearest[1]-point[1])<5?nearest:point;
  return [clamp(snapPoint[0]-view.x,0,view.w),clamp(snapPoint[1]-view.y,0,view.h)];
}
$('#sheet').addEventListener('pointerdown',event=>{
  if (event.button!==0 || !state.doc) return;
  if(event.target.closest('[data-sheet-field],[data-view-caption]'))return;
  const point=sheetPoint(event);
  if (!point) return;
  const view=layoutViewAt(point);
  if(layoutRuntime.tool!=='select' && (!layoutRuntime.activeViewId || view?.id!==layoutRuntime.activeViewId)) {
    showStatus('Double click view yang ingin diedit terlebih dahulu.');return;
  }
  if(layoutRuntime.tool==='text') {
    const value=prompt('Teks dalam view:');
    if(value?.trim()) {
      const layout=sheetLayout();
      const item={id:identity(),viewId:view.id,x:clamp(point[0],view.x+2,view.x+view.w-2),
        y:clamp(point[1],view.y+6,view.y+view.h-13),text:value.trim().slice(0,150),size:4};
      saveSheetLayout({...layout,texts:[...layout.texts,item]}).then(saved=>{
        if(saved) selectLayoutItem('text',item.id);
      });
    }
    setLayoutTool('select');return;
  }
  if(layoutRuntime.tool==='grid') {
    if (!view || view.mode==='iso') {showStatus('Grid tersedia pada denah dan tampak ortografis.');return;}
    const local=layoutSnap(view,point);
    if(!layoutRuntime.gridPending || layoutRuntime.gridPending.viewId!==view.id) {
      layoutRuntime.gridPending={viewId:view.id,a:local};
      layoutRuntime.gridHover=local;
      showStatus('Kepala grid ditetapkan. Klik titik ekornya.');
      drawSheet();return;
    }
    const start=layoutRuntime.gridPending;
    if(Math.hypot(local[0]-start.a[0],local[1]-start.a[1])<2)return;
    const layout=sheetLayout(),name=nextGridName();
    const world=gridWorldFromLocal(view,start.a,local);
    if(!world){showStatus('Grid tidak dapat dibuat pada view ini.');return;}
    const line={id:identity(),viewId:view.id,a:start.a,b:local,name,worldA:world[0],worldB:world[1],hidden:false};
    layoutRuntime.gridPending=null;layoutRuntime.gridHover=null;
    saveSheetLayout({...layout,gridLines:[...(layout.gridLines||[]),line]}).then(saved=>{
      if(saved)selectLayoutItem('grid',line.id);
    });
    showStatus('Grid '+line.name+' dibuat. Klik kepala grid berikutnya.');
    return;
  }
  if(layoutRuntime.tool==='dimension') {
    if (!view || view.mode==='iso') {showStatus('Dimensi tersedia pada denah dan tampak ortografis.');return;}
    const gridId=event.target.closest('[data-grid-id]')?.getAttribute('data-grid-id');
    const layout=sheetLayout(),grid=(layout.gridLines||[]).find(item=>item.id===gridId&&gridSegment(item,view));
    if(!grid) {showStatus('Klik batang grid pertama, lalu batang grid sebelahnya.');return;}
    if(!layoutRuntime.dimensionStart || layoutRuntime.dimensionStart.viewId!==view.id) {
      layoutRuntime.dimensionStart={viewId:view.id,gridId:grid.id};
      showStatus('Grid '+grid.name+' dipilih. Klik batang grid kedua.');
    } else {
      const first=(layout.gridLines||[]).find(item=>item.id===layoutRuntime.dimensionStart.gridId);
      if(!first || first.id===grid.id)return;
      const firstSegment=gridSegment(first,view),secondSegment=gridSegment(grid,view);
      if(!firstSegment||!secondSegment)return;
      const ad=[firstSegment[1][0]-firstSegment[0][0],firstSegment[1][1]-firstSegment[0][1]],
        bd=[secondSegment[1][0]-secondSegment[0][0],secondSegment[1][1]-secondSegment[0][1]];
      const parallel=Math.abs((ad[0]*bd[0]+ad[1]*bd[1])/(Math.hypot(...ad)*Math.hypot(...bd)));
      if(parallel<.98){showStatus('Dimensi antar-grid memerlukan dua garis sejajar.');return;}
      const dimension={id:identity(),viewId:view.id,a:firstSegment[0],b:secondSegment[0],gridA:first.id,gridB:grid.id};
      saveSheetLayout({...layout,dimensions:[...layout.dimensions,dimension]});
      layoutRuntime.dimensionStart=null;
      showStatus('Dimensi antar-grid dibuat. Pilih pasangan berikutnya.');
    }
    return;
  }
  const target=event.target.closest('[data-grid-id],[data-dimension-id],[data-text-id],[data-view-id]');
  const kind=target?.hasAttribute('data-grid-id')?'grid':target?.hasAttribute('data-dimension-id')?'dimension':
    target?.hasAttribute('data-text-id')?'text':target?.hasAttribute('data-view-id')?'view':null;
  if(kind) {
    const attribute={grid:'data-grid-id',dimension:'data-dimension-id',text:'data-text-id',view:'data-view-id'}[kind];
    const id=target.getAttribute(attribute);
    if(layoutRuntime.activeViewId && kind==='view' && id!==layoutRuntime.activeViewId) {
      showStatus('Double click view lain untuk beralih.');return;
    }
    if(layoutRuntime.activeViewId && kind==='grid' && (!view || view.id!==layoutRuntime.activeViewId ||
      !grids().some(item=>item.id===id&&gridSegment(item,view))))return;
    selectLayoutItem(kind,id);
    if(layoutRuntime.activeViewId && kind==='grid'){
      layoutRuntime.drag={kind:'grid',id,viewId:view.id,start:point,dx:0,dy:0};
      event.currentTarget.setPointerCapture(event.pointerId);return;
    }
    if(layoutRuntime.activeViewId && kind!=='text')return;
    const source=kind==='view'?sheetLayout().views.find(item=>item.id===id)
      :sheetLayout().texts.find(item=>item.id===id);
    if(!source)return;
    layoutRuntime.drag={kind:kind==='view'?'view':'text',id,start:point,x:source.x,y:source.y};
    event.currentTarget.setPointerCapture(event.pointerId);
  } else if(point[1]>=254) {
    $('.layout-title-details').open=true;
    $('.layout-title-details').scrollIntoView({block:'nearest'});
  } else {layoutRuntime.selected=null;$('#layout-selection').hidden=true;drawSheet();}
});
$('#sheet').addEventListener('pointerup',event=>{
  if (!layoutRuntime.drag) return;
  const drag=layoutRuntime.drag;layoutRuntime.drag=null;
  if(drag.kind==='grid'){
    const grid=grids().find(item=>item.id===drag.id);
    const view=sheetLayout().views.find(item=>item.id===drag.viewId);
    if(!grid||!view)return;
    if(Math.hypot(drag.dx,drag.dy)<.5){drawSheet();return;}
    const world=gridWorldEndpoints(grid),factor=layoutProjection(view).factor;
    if(!world||!factor)return;
    const delta=view.mode==='plan'?[drag.dx/factor,-drag.dy/factor]:
      view.mode==='front'?[drag.dx/factor,0]:[0,drag.dx/factor];
    if(Math.hypot(...delta)<1e-5){drawSheet();return;}
    updateGrid(grid.id,{worldA:[world[0][0]+delta[0],world[0][1]+delta[1]],
      worldB:[world[1][0]+delta[0],world[1][1]+delta[1]]});
    return;
  }
  const source=drag.kind==='view'?sheetLayout().views.find(item=>item.id===drag.id)
    :sheetLayout().texts.find(item=>item.id===drag.id);
  if (!source) return;
  const host=drag.kind==='text'&&source.viewId?sheetLayout().views.find(item=>item.id===source.viewId):null;
  const x=drag.kind==='view'?clamp(drag.x,9,411-source.w):host?clamp(drag.x,host.x+2,host.x+host.w-2):clamp(drag.x,9,411);
  const y=drag.kind==='view'?clamp(drag.y,9,252-source.h):host?clamp(drag.y,host.y+6,host.y+host.h-13):clamp(drag.y,9,288);
  if(Math.hypot(x-source.x,y-source.y)<.5){drawSheet();return;}
  const layout=sheetLayout();
  const key=drag.kind==='view'?'views':'texts';
  saveSheetLayout({...layout,[key]:layout[key].map(item=>item.id===drag.id?{...item,x,y}:item)});
});
$('#sheet').addEventListener('pointercancel',()=>{layoutRuntime.drag=null;drawSheet();});
$('#sheet').addEventListener('dblclick',event=>{
  const caption=event.target.closest('[data-view-caption]');
  if(caption){
    const id=caption.getAttribute('data-view-caption');
    const view=sheetLayout().views.find(item=>item.id===id);
    if(view)inlineLayoutEdit(caption,view.title,80,title=>{
      if(!title)return;
      const layout=sheetLayout();
      saveSheetLayout({...layout,views:layout.views.map(item=>item.id===id?{...item,title}:item)});
    });
    return;
  }
  const fieldElement=event.target.closest('[data-sheet-field]');
  if(fieldElement){
    const field=fieldElement.getAttribute('data-sheet-field');
    const limits={title:80,room_title:80,notes:200,number:20,drawn_by:40,checked_by:40,issue_date:10};
    if(!(field in limits))return;
    if(field==='title'&&!state.canManageShare){
      showStatus('Hanya pemilik proyek yang dapat mengganti nama proyek.');
      return;
    }
    inlineLayoutEdit(fieldElement,state.doc.sheet[field]||'',limits[field],value=>{
      if((field==='title'||field==='number')&&!value)return;
      if(field==='issue_date'&&value&&!/^\d{4}-\d{2}-\d{2}$/.test(value)){
        showStatus('Tanggal gunakan format YYYY-MM-DD.');drawSheet();return;
      }
      edit(state.doc.sheet,{...state.doc.sheet,[field]:value},'sheet');
    });
    return;
  }
  const id=event.target.closest('[data-view-id]')?.getAttribute('data-view-id') ||
    layoutViewAt(sheetPoint(event))?.id;
  if(id)enterLayoutView(id);
});
$('#layout-finish').onclick=exitLayoutView;
document.addEventListener('keydown',event=>{
  if(event.key==='Escape' && state.layout && layoutRuntime.activeViewId &&
    !['INPUT','TEXTAREA'].includes(document.activeElement?.tagName)) {
    event.preventDefault();event.stopPropagation();
    if(layoutRuntime.gridPending || layoutRuntime.dimensionStart)setLayoutTool('select');
    else exitLayoutView();
  }
},true);
document.querySelectorAll('.layout-tool').forEach(/** @param {HTMLElement} button */ button=>button.onclick=()=>setLayoutTool(button.dataset.layoutTool));
$('#layout-zoom').onchange=event=>{
  layoutRuntime.zoom=Number(event.target.value);
  $('#layout-stage').style.setProperty('--layout-sheet-width',(840*layoutRuntime.zoom)+'px');
};
function stepLayoutZoom(direction) {
  const levels=[.5,.75,1,1.25,1.5,2,3];
  const index=levels.indexOf(layoutRuntime.zoom);
  $('#layout-zoom').value=String(levels[clamp(index+direction,0,levels.length-1)]);
  $('#layout-zoom').dispatchEvent(new Event('change'));
}
$('#layout-zoom-out').onclick=()=>stepLayoutZoom(-1);
$('#layout-zoom-in').onclick=()=>stepLayoutZoom(1);
$('#layout-canvas').addEventListener('wheel',event=>{
  if(!event.ctrlKey) return;
  event.preventDefault();stepLayoutZoom(event.deltaY<0?1:-1);
},{passive:false});
$('#layout-mini').onclick=()=>{$('#layout-canvas').scrollTo({left:0,top:0,behavior:'smooth'});};
document.querySelectorAll('[data-view-mode]').forEach(/** @param {HTMLElement} button */ button=>{
  button.onclick=()=>addLayoutView(button.dataset.viewMode);
  button.ondragstart=event=>event.dataTransfer.setData('text/qreasee-view',button.dataset.viewMode);
});
$('#sheet').ondragover=event=>{if(event.dataTransfer.types.includes('text/qreasee-view')) event.preventDefault();};
$('#sheet').ondrop=event=>{event.preventDefault();const mode=event.dataTransfer.getData('text/qreasee-view');const point=sheetPoint(event);if(mode&&point)addLayoutView(mode,point);};
$('#layout-view-title').onchange=event=>{
  if(layoutRuntime.selected?.kind!=='view')return;
  const layout=sheetLayout(),title=event.target.value.trim();if(!title)return;
  saveSheetLayout({...layout,views:layout.views.map(item=>item.id===layoutRuntime.selected.id?{...item,title}:item)});
};
$('#layout-view-scale').onchange=event=>{
  if(layoutRuntime.selected?.kind!=='view')return;
  const scale=Number(event.target.value);
  if(![25,50,75,100,150,200,500].includes(scale))return;
  const layout=sheetLayout();
  saveSheetLayout({...layout,views:layout.views.map(item=>item.id===layoutRuntime.selected.id?{...item,scale}:item)});
};
$('#layout-text-value').onchange=event=>{
  if(layoutRuntime.selected?.kind!=='text')return;
  const layout=sheetLayout(),value=event.target.value.trim();if(!value)return;
  saveSheetLayout({...layout,texts:layout.texts.map(item=>item.id===layoutRuntime.selected.id?{...item,text:value}:item)});
};
$('#layout-grid-name').onchange=event=>{
  if(layoutRuntime.selected?.kind!=='grid')return;
  renameGrid(layoutRuntime.selected.id,event.target.value);
};
$('#layout-grid-visibility').onclick=()=>{
  if(layoutRuntime.selected?.kind!=='grid')return;
  const grid=grids().find(item=>item.id===layoutRuntime.selected.id);
  if(!grid)return;
  updateGrid(grid.id,{hidden:!grid.hidden});
  $('#layout-grid-visibility').textContent=grid.hidden?'Sembunyikan grid':'Tampilkan grid';
};
$('#layout-delete').onclick=()=>{
  if(!layoutRuntime.selected)return;
  if(layoutRuntime.selected.kind==='grid'){removeGrid(layoutRuntime.selected.id);return;}
  const layout=sheetLayout();
  const deletingActiveView=layoutRuntime.selected.kind==='view'&&layoutRuntime.selected.id===layoutRuntime.activeViewId;
  const next=layoutRuntime.selected.kind==='view'
    ?{...layout,views:layout.views.filter(item=>item.id!==layoutRuntime.selected.id),
      gridLines:(layout.gridLines||[]).filter(item=>item.viewId!==layoutRuntime.selected.id||item.worldA),
      texts:layout.texts.filter(item=>item.viewId!==layoutRuntime.selected.id),
      dimensions:layout.dimensions.filter(item=>item.viewId!==layoutRuntime.selected.id)}
    :layoutRuntime.selected.kind==='dimension'
    ?{...layout,dimensions:layout.dimensions.filter(item=>item.id!==layoutRuntime.selected.id)}
    :{...layout,texts:layout.texts.filter(item=>item.id!==layoutRuntime.selected.id)};
  layoutRuntime.selected=null;$('#layout-selection').hidden=true;
  if(deletingActiveView)exitLayoutView();
  saveSheetLayout(next);
};

window.addEventListener('hashchange',()=>roomFromHash()?openRoom():showProjectHome());
let lastSync=Date.now()+Math.random()*1200;
setInterval(()=>{
  if(document.hidden || !state.room)return;
  const fast=state.linePending || state.peers.some(peer=>peer.cursor?.line);
  const base=window.qreaseeCloudPost ? (fast?750:2000) : 350;
  const interval=Math.min(30000,base*2**state.syncFailures);
  if (Date.now()-lastSync>=interval) {
    lastSync=Date.now()+Math.random()*Math.min(interval*.2,1000);
    sync();
  }
},250);
document.addEventListener('visibilitychange',()=>{
  if(!document.hidden){lastSync=Date.now();sync();}
});
window.addEventListener('online',()=>{lastSync=Date.now();sync();});
if (roomFromHash()) openRoom();
else if (window.qreaseeAuth) window.qreaseeAuth.ready.then(()=>renderProjectHome());
else renderProjectHome();
