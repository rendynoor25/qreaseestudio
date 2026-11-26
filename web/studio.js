// @ts-check
'use strict';

/** @param {string} selector @returns {any} */
const $ = selector => document.querySelector(selector);
const icons = {
  snap:'<path d="M5 4v9a7 7 0 0 0 14 0V4h-4v9a3 3 0 0 1-6 0V4zM5 8h4m6 0h4"/>',
  group:'<path d="M8 4H4v4m12-4h4v4m0 8v4h-4m-8 0H4v-4"/><rect x="8" y="8" width="8" height="8" rx="1"/>',
  logo:'<path d="M12 3 3 8v8l9 5 9-5V8zM3 8l9 5 9-5m-9 5v8m4-5 5 5"/>',
  folder:'<path d="M3 6h7l2 2h9v11H3z"/>',
  chevron:'<path d="m8 10 4 4 4-4"/>',
  vchevron:'<path d="m7 10 5 5 5-5"/>',
  cube:'<path d="M12 3 3.5 7.6v8.8L12 21l8.5-4.6V7.6zM3.5 7.6l8.5 4.7 8.5-4.7m-8.5 4.7V21"/>',
  page:'<path d="M5 3h10l4 4v14H5zM15 3v5h4M8 12h8m-8 4h8"/>',
  users:'<path d="M3 20v-3a3 3 0 0 1 3-3h5a3 3 0 0 1 3 3v3m2-6a4 4 0 0 1 4 4v2M16 5a3 3 0 0 1 0 6"/><circle cx="8.5" cy="8" r="3"/>',
  undo:'<path d="M9 6 4 11l5 5m-5-5h10a5 5 0 0 1 5 5v2"/>',
  redo:'<path d="m15 6 5 5-5 5m5-5H10a5 5 0 0 0-5 5v2"/>',
  fit:'<path d="M4 9V4h5m6 0h5v5m0 6v5h-5m-6 0H4v-5"/><rect x="9" y="9" width="6" height="6" rx="1"/>',
  layers:'<path d="m12 3 9 5-9 5-9-5zm9 9-9 5-9-5m18 4-9 5-9-5"/>',
  search:'<circle cx="10" cy="10" r="5.5"/><path d="m14 14 5 5"/>',
  ruler:'<path d="m3 15 12-12 6 6L9 21zm7-7 2 2m1-5 2 2m-8 4 2 2m-5 1 2 2"/>',
  sliders:'<path d="M4 7h5m4 0h7M4 17h9m4 0h3"/><circle cx="11" cy="7" r="2"/><circle cx="15" cy="17" r="2"/>',
  copy:'<path d="M8 16H4V4h12v4"/><rect x="8" y="8" width="12" height="12" rx="2"/>',
  trash:'<path d="M3 6h18M9 6V3h6v3m3 0-1 15H7L6 6m4 4v7m4-7v7"/>',
  minus:'<path d="M5 12h14"/>', plus:'<path d="M5 12h14M12 5v14"/>',
  close:'<path d="m6 6 12 12M18 6 6 18"/>',
  moon:'<path fill="currentColor" stroke="none" d="M12 3a6.4 6.4 0 0 0 9 9 9 9 0 1 1-9-9z"/>',
  sun:'<circle cx="12" cy="12" r="4"/><path d="M12 2v2m0 16v2M4.93 4.93l1.42 1.42m11.3 11.3 1.42 1.42M2 12h2m16 0h2M4.93 19.07l1.42-1.42m11.3-11.3 1.42-1.42"/>',
  select:'<path d="m5 3 14 10-7 1-3 6z"/>',
  line:'<path d="m5 19 14-14"/><circle cx="5" cy="19" r="1.6"/><circle cx="19" cy="5" r="1.6"/>',
  arc:'<path d="M3 19A16 16 0 0 1 21 19"/><circle cx="3" cy="19" r="1.4"/><circle cx="21" cy="19" r="1.4"/>',
  offset:'<rect x="3" y="3" width="18" height="18"/><rect x="8" y="8" width="8" height="8"/>',
  rectangle:'<rect x="4" y="6" width="16" height="12" rx="1"/>',
  polygon:'<path d="M3 19 5 6l10-3 6 7-5 10z"/>',
  circle:'<circle cx="12" cy="12" r="8"/>',
  pull:'<path d="m3 15 9 5 9-5-4-2m-14 2 4-2m5 3V4m-4 4 4-4 4 4"/>',
  move:'<path d="M12 3v18M3 12h18M9 6l3-3 3 3m-6 12 3 3 3-3M6 9l-3 3 3 3m12-6 3 3-3 3"/>',
  rotate:'<path d="M20 10a8 8 0 1 0-2 8M20 4v6h-6"/><circle cx="12" cy="12" r="1"/>',
  scale:'<path d="M4 20 20 4M4 14v6h6M14 4h6v6"/><rect x="2" y="18" width="4" height="4"/><rect x="18" y="2" width="4" height="4"/>',
  erase:'<path d="m3 15 9-10a2 2 0 0 1 3 0l6 6a2 2 0 0 1 0 3l-7 7H8zM9 21h12"/>',
  measure:'<path d="M3 17 17 3l4 4L7 21zM9 11l2 2m1-5 2 2m1-5 2 2"/>',
  orbit:'<ellipse cx="12" cy="12" rx="9" ry="5.5" transform="rotate(-28 12 12)"/><path d="M8 4a8 8 0 0 1 12 5m-2-4 2 4 2-4M10 20a8 8 0 0 1-6-5"/>',
  pan:'<path d="M8 13V6a1.5 1.5 0 0 1 3 0v5-7a1.5 1.5 0 0 1 3 0v7-5a1.5 1.5 0 0 1 3 0v6-3a1.5 1.5 0 0 1 3 0v6c0 4-2 6-6 6h-2a5 5 0 0 1-4-2l-4-5a1.6 1.6 0 0 1 2.5-2z"/>',
  download:'<path d="M12 3v12m-5-5 5 5 5-5M4 16v4h16v-4"/>'
};
function icon(element, name) {
  element.innerHTML = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.65" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' + icons[name] + '</svg>';
}
document.querySelectorAll('[data-icon]').forEach(
  /** @param {HTMLElement} element */ element => icon(element, element.dataset.icon));

/** @type {Record<QreaseeTool, [string, string, string]>} */
const tools = {
  select: ['Pilih', 'V', 'Tarik kiri ke kanan untuk memuat seluruh objek; kanan ke kiri untuk yang tersentuh. Klik tiga kali untuk objek terhubung'],
  line: ['Garis', 'L', 'Klik awal, ketik panjang, lalu klik arah titik akhir'],
  arc: ['Busur', 'A', 'Klik pusat, ketik radius atau radius, sudut, lalu klik arah; tanpa angka gunakan tiga klik'],
  offset: ['Offset', 'F', 'Klik perimeter bidang, lalu tentukan jarak; ketik jarak setelah klik pertama'],
  rectangle: ['Persegi panjang', 'R', 'Klik awal, ketik X × Y, lalu klik arah pada bidang horizontal atau vertikal'],
  circle: ['Lingkaran', 'C', 'Klik pusat, ketik radius, lalu klik arah'],
  pull: ['Push/Pull', 'P', 'Klik bidang, ketik jarak, lalu klik arah atas atau bawah'],
  move: ['Pindah', 'M', 'Pilih objek, klik titik awal, lalu klik titik tujuan; snap 3D dan sumbu Z dengan panah Atas/Bawah'],
  rotate: ['Rotate', '', 'Klik pusat rotasi, lalu tentukan sudut; ketik angka lalu Enter untuk presisi'],
  scale: ['Skala', 'S', 'Tarik dari objek untuk mengubah ukurannya secara proporsional'],
  erase: ['Penghapus', 'E', 'Klik objek untuk menghapus; Ctrl+Z untuk mengurungkan'],
  measure: ['Ukur', 'T', 'Klik titik awal, lalu gerakkan kursor untuk membaca jarak sampai titik akhir'],
  orbit: ['Orbit', 'O', 'Tarik untuk memutar kamera'],
  pan: ['Geser kamera', 'H', 'Tarik untuk menggeser kamera']
};

const identity = () => {
  if (crypto.randomUUID) return crypto.randomUUID();
  const bits = crypto.getRandomValues(new Uint8Array(16));
  bits[6] = (bits[6] & 15) | 64;
  bits[8] = (bits[8] & 63) | 128;
  const hex = [...bits].map(byte => byte.toString(16).padStart(2, '0')).join('');
  return [hex.slice(0,8),hex.slice(8,12),hex.slice(12,16),hex.slice(16,20),hex.slice(20)].join('-');
};

/** @type {QreaseeState} */
const state = {
  room: '', client: identity(), name: localStorage.getItem('qreasee-name') || 'Tamu',
  doc: null, meshes: [], plans: [], selected: new Set(), inside: null, tool: 'select', layout: false, busy: false,
  snapping: true, inference: null,
  undo: [], redo: [], drag: null, arcPending:null, linePending:null, linePress:null, drawPending:null,
  movePending:null, rotatePending:null, offsetPending:null, measurePending:null, hits: [], hoverKey: null, epoch: 0, polling: false, peers:[], cursor:null
};
const canvas = $('#viewport');
const ctx = canvas.getContext('2d');
/** @param {number} size @param {(surface: CanvasRenderingContext2D)=>void} paint @returns {CanvasPattern|string} */
function createSurfacePattern(size, paint) {
  const tile = document.createElement('canvas');
  tile.width = tile.height = size;
  const surface = tile.getContext('2d');
  if (surface) paint(surface);
  return ctx.createPattern(tile,'repeat') || 'transparent';
}
const selectionPattern = createSurfacePattern(7, surface => {
  surface.fillStyle = '#b86622cc';
  surface.beginPath();
  surface.arc(3.5,3.5,.75,0,Math.PI*2);
  surface.fill();
});
const hoverPattern = createSurfacePattern(9, surface => {
  surface.strokeStyle = '#c8793688';
  surface.lineWidth = .7;
  surface.beginPath();
  surface.moveTo(3,3); surface.lineTo(6,6);
  surface.moveTo(6,3); surface.lineTo(3,6);
  surface.stroke();
});
/** @type {QreaseeCamera} */
const camera = { yaw: .62, pitch: .48, axes:null, scale: 40, base: 40, baseDistance:22,
  x: 0, y: 0, center:[0,0,0], distance:22, perspective:true };
const perspectiveFov = 35*Math.PI/180;
const nearPlane = .01;
const unitFactors = {m:1,cm:100,mm:1000};
let displayUnit = unitFactors[localStorage.getItem('qreasee-unit')] ? localStorage.getItem('qreasee-unit') : 'm';
/** @type {Record<QreaseeView, QreaseePoint2>} */
const views = { perspective:[.62,.48], iso:[.62,.54], plan:[0,Math.PI/2], front:[0,0], right:[Math.PI/2,0] };
const clamp = (value,min,max) => Math.max(min,Math.min(max,value));
const round = value => Math.round(value * 1000) / 1000;
/** @param {QreaseePoint} point @returns {QreaseePoint} */
const roundPoint = point => [round(point[0]), round(point[1]), round(point[2])];
const snap = (value, step = .25) => Math.round(value / step) * step;
const snapRadius = 14;
const svgNS = 'http://www.w3.org/2000/svg';
let statusTimer;
const showStatus = message => {
  const label=$('#status');
  label.textContent=message;
  label.hidden=message==='Ruang model siap.';
  clearTimeout(statusTimer);
  if (!label.hidden) statusTimer=setTimeout(()=>{label.hidden=true;},5000);
};
/** @returns {QreaseeObject[]} */
const objects = () => state.doc?.objects || [];
/** @param {string} id @returns {QreaseeObject[]} */
const members = id => objects().filter(object => object.container?.id === id);
/** @returns {string|null} */
const onlySelected = () => state.selected.size===1 ? state.selected.values().next().value : null;
/** @returns {QreaseeObject|undefined} */
const currentObject = () => objects().find(object => object.id === onlySelected());
/** @param {QreaseeObject|null|undefined} object @returns {string|undefined} */
const targetId = object => object?.container && object.container.id!==state.inside ? object.container.id : object?.id;
/** @type {QreaseeObject|null} */
let objectBaseline = null;
/** @type {QreaseeSheet|null} */
let sheetBaseline = null;
let frame = 0;
let sceneCache = null;
const treeCache = {doc:undefined,inside:undefined,match:undefined};

for (const [id, [label, key]] of Object.entries(tools)) {
  const button = document.createElement('button');
  button.className = 'icon-button';
  const shortcut = id==='select' ? 'Space / V' : key;
  button.title = label + (shortcut ? ' (' + shortcut + ')' : '');
  button.setAttribute('aria-label', label);
  button.dataset.tool = id;
  icon(button, id);
  button.onclick = () => {setTool(id);canvas.focus({preventScroll:true});};
  $('#tool-buttons').append(button);
}

function setTool(tool) {
  if (state.tool!==tool) {
    state.arcPending=null;
    state.linePending=null;
    state.linePress=null;
    state.drawPending=null;
    state.movePending=null;
    state.rotatePending=null;
    state.offsetPending=null;
    state.measurePending=null;
    state.hoverKey=null;
    if (state.cursor) delete state.cursor.line;
    $('#line-length').value='';
  }
  state.tool = tool;
  if (tool==='erase') {
    state.selected.clear();
    state.hoverKey=null;
    state.inference=null;
  }
  const measured=['line','rectangle','circle','arc','pull','rotate','offset'].includes(tool);
  $('#line-length-control').hidden=!measured;
  $('#measure-label').textContent={line:'Panjang',rectangle:'X × Y',circle:'Radius',arc:'Radius, sudut',pull:'Jarak',rotate:'Sudut',offset:'Jarak'}[tool]||'Ukuran';
  $('#line-length').placeholder={rectangle:'2 x 3',arc:'2, 90',rotate:'30',offset:'1'}[tool]||'0';
  $('#line-length').inputMode=tool==='rectangle'||tool==='arc'?'text':'decimal';
  $('#line-length').min=tool==='rotate'?'-360':'0.001';
  $('#line-unit').textContent=tool==='rotate'?'°':displayUnit;
  $('#measure-preview').textContent='';
  $('#tool-hint').textContent = tools[tool][2];
  canvas.dataset.tool = tool;
  document.querySelectorAll('[data-tool].icon-button').forEach(
    /** @param {HTMLElement} button */ button => {
    const active = button.dataset.tool === tool;
    button.classList.toggle('active', active);
    button.setAttribute('aria-pressed', String(active));
  });
}
setTool('select');

function panel(name,open) {
  const element=$('#'+(name==='objects'?'object-panel':'inspector'));
  const button=$('#'+(name==='objects'?'browser-toggle':'inspector-toggle'));
  element.hidden=!open;
  $('#workspace').classList.toggle(name==='objects'?'objects-open':'inspector-open',open);
  button.setAttribute('aria-expanded',String(open));
  redraw();
}
$('#browser-toggle').onclick=()=>panel('objects',$('#object-panel').hidden);
$('#browser-close').onclick=()=>panel('objects',false);
$('#inspector-toggle').onclick=()=>panel('inspector',$('#inspector').hidden);
$('#inspector-close').onclick=()=>panel('inspector',false);
let railWidth=Number(localStorage.getItem('qreasee-rail-width'))||52;
let inspectorWidth=Number(localStorage.getItem('qreasee-inspector-width'))||263;
function resizePanel(kind,value) {
  const workspace=$('#workspace');
  const rail=kind==='rail';
  const minimum=rail?52:220;
  const maximum=rail?140:480;
  const reserved=rail
    ? ($('#object-panel').hidden?0:225)+($('#inspector').hidden?0:inspectorWidth)
    : railWidth+($('#object-panel').hidden?0:225);
  const limit=Math.max(minimum,Math.min(maximum,workspace.clientWidth-reserved-260));
  const width=clamp(Math.round(value),minimum,limit);
  if (rail) railWidth=width;
  else inspectorWidth=width;
  workspace.style.setProperty(rail?'--rail-width':'--inspector-width',width+'px');
  workspace.classList.toggle('wide-tools',railWidth>=94);
  $('#'+(rail?'rail-resize':'inspector-resize')).setAttribute('aria-valuenow',String(width));
  localStorage.setItem(rail?'qreasee-rail-width':'qreasee-inspector-width',String(width));
  redraw();
}
function installResize(kind) {
  const handle=$('#'+(kind==='rail'?'rail-resize':'inspector-resize'));
  let dragging=false;
  handle.onpointerdown=event=>{
    if (event.button!==0) return;
    dragging=true;
    handle.setPointerCapture(event.pointerId);
    event.preventDefault();
  };
  handle.onpointermove=event=>{
    if (!dragging) return;
    const box=$('#workspace').getBoundingClientRect();
    resizePanel(kind,kind==='rail'?event.clientX-box.left:box.right-event.clientX);
  };
  handle.onpointerup=()=>{dragging=false;};
  handle.onlostpointercapture=()=>{dragging=false;};
  handle.onkeydown=event=>{
    if (!['ArrowLeft','ArrowRight'].includes(event.key)) return;
    event.preventDefault();
    const direction=event.key==='ArrowRight'?1:-1;
    resizePanel(kind,(kind==='rail'?railWidth:inspectorWidth)+(kind==='rail'?direction:-direction)*10);
  };
}
resizePanel('rail',railWidth);
resizePanel('inspector',inspectorWidth);
installResize('rail');
installResize('inspector');

function accountMenu(open) {
  $('#account-menu').hidden=!open;
  const own=$('#avatars .self-avatar');
  if (own) own.setAttribute('aria-expanded',String(open));
  if (open) {
    $('#account-name').textContent=window.qreaseeAuth?.displayName || state.name;
    $('#sign-out').hidden=!window.qreaseeAuth?.signOut;
  }
}
$('#sign-out').onclick=async()=>{
  const button=$('#sign-out');
  button.disabled=true;
  try { await window.qreaseeAuth.signOut(); }
  catch (error) { showStatus(error.message || 'Gagal keluar.');button.disabled=false; }
};
document.addEventListener('pointerdown',event=>{
  const target=/** @type {Element} */ (event.target);
  if (!$('#account-menu').hidden && !target.closest('.avatar-area')) accountMenu(false);
});
$('#tree-toggle').onclick=()=>{
  const open=$('#objects').hidden;
  $('#objects').hidden=!open;
  $('#tree-toggle').setAttribute('aria-expanded',String(open));
};
function theme(value) {
  document.body.dataset.theme=value;
  icon($('#theme-toggle'),value==='light'?'moon':'sun');
  $('#theme-toggle').title=value==='light'?'Gunakan tema gelap':'Gunakan tema terang';
  localStorage.setItem('qreasee-theme',value);
  redraw();
}
theme(localStorage.getItem('qreasee-theme')==='light'?'light':'dark');
$('#theme-toggle').onclick=()=>theme(document.body.dataset.theme==='light'?'dark':'light');

const lengthFields=['x','y','z','width','depth','height'];
const displayLength=value=>Number((value*unitFactors[displayUnit]).toFixed(displayUnit==='m'?3:displayUnit==='cm'?2:1));
const lengthLabel=value=>displayLength(value)+' '+displayUnit;
function measurement(tool=state.tool) {
  const raw=$('#line-length').value.trim();
  if (!raw) return null;
  if (tool==='rotate') {
    const angle=Number(raw.replace(',','.'));
    return Number.isFinite(angle)?{primary:angle}:{invalid:true};
  }
  const pair=tool==='rectangle' || tool==='arc';
  const parts=pair ? raw.split(/\s*[xX,;]\s*|\s+/).filter(Boolean) : [raw.replace(',','.')];
  const first=Number(parts[0]),second=Number(parts[1]);
  if (!Number.isFinite(first) || first<=0 ||
      (tool==='rectangle' && (parts.length!==2 || !Number.isFinite(second) || second<=0)) ||
      (tool==='arc' && (parts.length>2 || (parts.length===2 && (!Number.isFinite(second) || second===0 || Math.abs(second)>360)))) ||
      (!pair && parts.length!==1)) return {invalid:true};
  return {primary:first/unitFactors[displayUnit],
    secondary:tool==='rectangle'?second/unitFactors[displayUnit]:tool==='arc'?(parts.length===2?second:90):undefined};
}
function measurementError() {
  showStatus(state.tool==='rotate'?'Masukkan sudut, misalnya 30 atau -45.':
    state.tool==='rectangle'?'Masukkan X × Y, misalnya 2 x 3.':
    state.tool==='arc'?'Masukkan radius atau radius, sudut (misalnya 2, 90).':'Masukkan ukuran positif.');
}
function updateCoordinates() {
  $('#coordinates').textContent=state.cursor
    ? 'X '+displayLength(state.cursor.x)+'  Y '+displayLength(state.cursor.y) : 'X —  Y —';
}
function updateLineLength() {
  const pending=state.linePending;
  if (!pending) return;
  const distance=pending.b ? Math.hypot(
    pending.b[0]-pending.a[0],pending.b[1]-pending.a[1],pending.b[2]-pending.a[2]) : 0;
  $('#measure-preview').textContent=distance>=.001 ? '≈ '+lengthLabel(distance) : '';
}
/** @param {QreaseePoint} world */
function beginLine(world) {
  state.linePending={a:[...world],b:null,preview:[world]};
  state.cursor={mode:'model',x:round(world[0]),y:round(world[1]),z:round(world[2])};
  $('#line-unit').textContent=displayUnit;
  $('#measure-preview').textContent='';
  $('#line-length-control').hidden=false;
  showStatus('Ketik panjang, lalu klik arah titik akhir.');
  redraw();
}
function finishLine() {
  state.linePending=null;
  state.linePress=null;
  state.inference=null;
  $('#line-length').value='';
  $('#measure-preview').textContent='';
  if (state.cursor) delete state.cursor.line;
  redraw();
}
/** @param {QreaseePoint} point @returns {Promise<boolean>} */
async function completeLinePoint(point) {
  const pending=state.linePending;
  if (!pending || state.busy) return false;
  const a=pending.a;
  const size=measurement('line');
  if (size?.invalid) {measurementError();return false;}
  if (size) {
    const exact=QreaseeLine.measuredEndpoint(a,point,size.primary);
    if (!exact) {showStatus('Klik arah menjauh dari titik awal.');return false;}
    point=exact;
  }
  const distance=Math.hypot(point[0]-a[0],point[1]-a[1],point[2]-a[2]);
  if (distance<.001) {
    showStatus('Titik akhir harus berbeda dari titik awal.');
    return false;
  }
  const object=lineObject(a,point);
  if (!object) return false;
  $('#line-length').value='';
  const loop=QreaseeLine.closedLoop(objects(),object);
  const face=loop && QreaseeLine.polygonFromLoop(loop);
  const polygon=face && {id:identity(),name:'Bidang dari garis',shape:'polygon',
    ...face,height:0,rotation:0,color:'#dfcbb8'};
  const explicit=polygon && (window.qreaseeDemoPost || polygon.plane_u);
  const split=state.inside?null:QreaseeLine.splitCrossingLines(objects(),object,identity);
  const saved=split && (split.before.length || split.after.length>1 || explicit)
    ? await batch(split.before,[...split.after,...(explicit?[polygon]:[])],[])
    : explicit ? await batch([],[object,polygon],[]) : await addObject(object);
  if (saved && state.tool==='line' && state.linePending?.a===a) {
    if (polygon) {
      finishLine();
      showStatus('Loop tertutup menjadi bidang. Gunakan Push/Pull untuk memberi tinggi.');
      return true;
    }
    state.linePending={a:[...point],b:null,preview:[[...point]]};
    if (state.cursor) delete state.cursor.line;
    $('#line-length').value='';
    canvas.focus({preventScroll:true});
    showStatus('Garis '+lengthLabel(distance)+'. Klik titik berikutnya atau Esc untuk selesai.');
  }
  return saved;
}
function applyLineLength() {
  const size=measurement();
  if (size?.invalid) {measurementError();return;}
  canvas.focus({preventScroll:true});
  showStatus('Ukuran siap. Klik arah di kanvas untuk membuat objek.');
}
$('#line-length').addEventListener('input',()=>{
  if (state.rotatePending) {
    const size=measurement('rotate');
    if (size && !size.invalid) updateRotatePreview(state.rotatePending,size.primary);
    redraw();
    return;
  }
  if (state.offsetPending) {
    const size=measurement('offset');
    if (size && !size.invalid)
      updateOffsetPreview(state.offsetPending,(state.offsetPending.sign||-1)*size.primary);
    redraw();
    return;
  }
  if (state.linePending?.raw) {
    const pending=state.linePending,size=measurement('line');
    pending.b=size && !size.invalid
      ? QreaseeLine.measuredEndpoint(pending.a,pending.raw,size.primary):pending.raw;
    pending.preview=pending.b?[pending.a,pending.b]:[pending.a];
    updateLineLength();
  }
  if (state.drawPending?.hover) {
    const pending=state.drawPending,candidate=drawingCandidate(pending,pending.hover);
    if (pending.tool==='pull') {
      const update=pullChange(pending,pending.hover);
      pending.updates=update?[update]:null;
    } else if (pending.tool==='arc') {
      const size=measurement('arc');
      pending.previewArc=candidate && size && !size.invalid
        ? QreaseeLine.radiusArc(pending.initial,candidate.world,size.primary,size.secondary)
        : candidate?[pending.initial,candidate.world]:[];
    } else pending.preview=candidate?shapePreview(pending,candidate.world):null;
  }
  redraw();
});
$('#line-length').addEventListener('keydown',event=>{
  if (event.key==='Enter') {
    event.preventDefault();
    if (state.rotatePending) applyRotateValue();
    else if (state.offsetPending) applyOffsetValue();
    else applyLineLength();
  } else if (event.key==='Escape') {
    event.preventDefault();
    $('#line-length').value='';
    state.drawPending=null;
    state.rotatePending=null;
    state.offsetPending=null;
    if (state.linePending) finishLine();
    setTool('select');
    canvas.focus({preventScroll:true});
  }
});
function convertFormUnits(form,fields,before,after) {
  for (const field of fields) {
    const input=form.elements.namedItem(field);
    if (input && input.value!=='') input.value=Number((Number(input.value)*after/before).toFixed(4));
  }
}
$('#unit-select').value=displayUnit;
$('#unit-select').onchange=event=>{
  const next=event.target.value;
  const before=unitFactors[displayUnit],after=unitFactors[next];
  convertFormUnits($('#object-form'),lengthFields,before,after);
  convertFormUnits($('#sheet-form'),['cut_height'],before,after);
  const lineLength=$('#line-length');
  const measure=measurement();
  if (measure && !measure.invalid) lineLength.value=state.tool==='rectangle'
    ? (measure.primary*after).toFixed(3)+' x '+(measure.secondary*after).toFixed(3)
    : state.tool==='arc' ? (measure.primary*after).toFixed(3)+', '+measure.secondary
    : (measure.primary*after).toFixed(3);
  displayUnit=next;
  document.querySelectorAll('.unit-label').forEach(label=>label.textContent=next);
  $('#line-unit').textContent=next;
  localStorage.setItem('qreasee-unit',next);
  updateCoordinates();
  updateLineLength();
  if (state.layout) drawSheet();
};
document.querySelectorAll('.unit-label').forEach(label=>label.textContent=displayUnit);
$('#line-unit').textContent=displayUnit;

function mode(layout) {
  state.layout = layout;
  state.cursor = null;
  state.hoverKey = null;
  state.arcPending = null;
  state.linePending = null;
  state.linePress = null;
  state.drawPending = null;
  state.movePending = null;
  state.rotatePending = null;
  state.offsetPending = null;
  $('#line-length-control').hidden=layout || !['line','rectangle','circle','arc','pull','rotate','offset'].includes(state.tool);
  $('#line-length').value='';
  for (const id of ['stage','tree','inspector']) {
    $('#model-' + id).hidden = layout;
    $('#layout-' + id).hidden = !layout;
  }
  $('#tool-buttons').hidden=layout;
  $('#model-tab').setAttribute('aria-pressed', String(!layout));
  $('#layout-tab').setAttribute('aria-pressed', String(layout));
  $('#left-title').textContent = layout ? 'Lembar gambar' : 'Struktur model';
  $('#inspector-title').textContent = layout ? 'Pengaturan lembar' : 'Properti objek';
  $('#print').hidden = !layout;
  $('#fit').hidden = layout;
  if (layout) drawSheet();
  else redraw();
}
$('#model-tab').onclick = () => mode(false);
$('#layout-tab').onclick = () => mode(true);
$('#print').onclick = () => { if (state.doc) window.print(); };

function connection(online, message) {
  const indicator = $('#connection');
  indicator.classList.toggle('online', online);
  indicator.lastElementChild.textContent = message;
}

async function post(url, data) {
  if (window.qreaseeDemoPost) return window.qreaseeDemoPost(url, data);
  const response = await fetch(url, {
    method:'POST', headers:{'Content-Type':'application/json'},
    body: JSON.stringify(data), signal: AbortSignal.timeout(5000)
  });
  return {code:response.status, data:await response.json()};
}

function roomFromHash() {
  return /^#[0-9a-f]{8}(-[0-9a-f]{4}){3}-[0-9a-f]{12}$/i.test(location.hash) ? location.hash.slice(1) : '';
}

async function openRoom(createBlank) {
  const epoch = ++state.epoch;
  if (window.qreaseeAuth) {
    const session = await window.qreaseeAuth.ready;
    if (state.epoch !== epoch || !session) return;
    state.name = window.qreaseeAuth.displayName.slice(0, 32);
  }
  state.busy = false;
  state.room = '';
  state.doc = null;
  state.meshes = [];
  state.plans = [];
  state.selected.clear();
  state.inside = null;
  state.inference = null;
  state.arcPending = null;
  state.linePending = null;
  state.linePress = null;
  state.drawPending = null;
  state.movePending = null;
  state.rotatePending = null;
  state.offsetPending = null;
  state.measurePending = null;
  $('#line-length-control').hidden=state.layout || !['line','rectangle','circle','arc','pull','rotate','offset'].includes(state.tool);
  $('#line-length').value='';
  state.undo = [];
  state.redo = [];
  state.polling = false;
  state.peers = [];
  state.cursor = null;
  state.hoverKey = null;
  objectBaseline = null;
  sheetBaseline = null;
  connection(false, 'Menghubungkan');
  $('#project-title').textContent = 'Qreasee';
  $('#revision').textContent = '';
  $('#avatars').replaceChildren();
  accountMenu(false);
  delete $('#avatars').dataset.signature;
  refresh(true);
  try {
    let id = createBlank === undefined ? roomFromHash() : '';
    if (!id) {
      const result = await post('/api/rooms', {blank:createBlank === true});
      if (result.code !== 201) throw new Error(result.data.error);
      id = result.data.room;
    }
    if (state.epoch !== epoch) return;
    state.room = id;
    history.replaceState(null, '', '#' + id);
    await sync();
  } catch (error) {
    if (state.epoch === epoch) {
      connection(false, 'Terputus');
      showStatus(error.message || 'Server tidak dapat dihubungi. Muat ulang halaman untuk mencoba lagi.');
    }
  }
}

function accept(data) {
  const update = data.changes;
  if (update && (!state.doc || update.document.revision >= state.doc.revision)) {
    const first = !state.doc;
    state.doc = update.document;
    state.meshes = update.meshes;
    state.plans = update.plans;
    if (first) {
      const initial = state.doc.objects.find(object => object.name === 'Atap utama');
      if (initial) state.selected.add(targetId(initial));
      fit();
      showStatus('Ruang model siap.');
    }
    refresh(first);
  }
  const avatars = $('#avatars');
  const peers = [...(data.peers || [])].sort((a,b) => Number(b.id === state.client) - Number(a.id === state.client));
  const signature=peers.map(({id,name})=>id+name).sort().join('|');
  if (avatars.dataset.signature!==signature) {
    avatars.dataset.signature=signature;
    avatars.replaceChildren();
    renderAvatars(avatars,peers);
  }
  const others=peers.filter(peer=>peer.id!==state.client).sort((a,b)=>a.id.localeCompare(b.id));
  const cursorChanged=JSON.stringify(state.peers)!==JSON.stringify(others);
  state.peers=others;
  connection(true, window.qreaseeCloudPost ? peers.length + ' online' :
    window.qreaseeDemoPost ? 'Lokal' : peers.length + ' online');
  if (cursorChanged) {
    if (state.layout) drawLayoutCursors();
    else redraw();
  }
}

/** @param {Element} avatars @param {QreaseePeer[]} peers */
function renderAvatars(avatars,peers) {
  for (const peer of peers.slice(0, 4)) {
    const own=peer.id===state.client;
    const item = /** @type {any} */ (document.createElement(own?'button':'span'));
    item.className = 'avatar'+(own?' self-avatar':'');
    item.title = (own?window.qreaseeAuth?.displayName:peer.name) || 'Tamu';
    if (own) {
      item.type='button';
      item.setAttribute('aria-label','Akun saya');
      item.setAttribute('aria-expanded','false');
      item.onclick=()=>accountMenu($('#account-menu').hidden);
    }
    item.textContent = (peer.name || 'Tamu').split(/\s+/).slice(0,2).map(word => [...word][0]).join('').toUpperCase();
    avatars.append(item);
  }
  if (peers.length > 4) {
    const count = document.createElement('span');
    count.className = 'avatar';
    count.textContent = '+' + (peers.length - 4);
    avatars.append(count);
  }
}

function exchange(edit) {
  return post('/api/rooms/' + state.room, {
    client:state.client, name:state.name, revision:state.doc?.revision ?? null, edit, cursor:state.cursor
  });
}

async function sync() {
  if (!state.room || state.busy || state.polling) return;
  const epoch = state.epoch;
  state.polling = true;
  try {
    const result = await exchange(null);
    if (state.epoch !== epoch || state.busy) return;
    if (result.code === 200) accept(result.data);
    else {
      showStatus(result.data.error || 'Sinkronisasi gagal.');
      connection(false, 'Tidak tersedia');
      if (result.code === 404) state.room = '';
    }
  } catch {
    if (state.epoch === epoch) connection(false, 'Terputus');
  } finally {
    if (state.epoch === epoch) state.polling = false;
  }
}

async function commit(edit, success) {
  if (!state.doc || state.busy) return false;
  const epoch = state.epoch;
  state.busy = true;
  refreshButtons();
  const rollback=previewRemoval(edit);
  try {
    const result = await exchange(edit);
    if (state.epoch !== epoch) return false;
    if (result.code !== 200) rollback?.();
    if (result.data.peers) accept(result.data);
    if (result.code !== 200) {
      if (result.code === 409) refresh(true);
      showStatus(result.data.error || 'Perubahan gagal disimpan.');
      return false;
    }
    if (success) success(result.data.topology);
    const newFaces = result.data.topology?.added.filter(object=>object.profile?.inferred).length || 0;
    showStatus(newFaces ? newFaces+' bidang baru terbentuk dari garis.' : 'Perubahan tersimpan.');
    refresh(true);
    return true;
  } catch {
    if (state.epoch === epoch) {
      rollback?.();
      showStatus('Sambungan terputus saat menyimpan. Revisi akan diperiksa ulang.');
    }
    return false;
  } finally {
    if (state.epoch === epoch) {
      state.busy = false;
      refreshButtons();
    }
  }
}

function previewRemoval(edit) {
  const removed=edit.type==='object' && edit.before && !edit.after
    ?[edit.before]:edit.type==='batch' && edit.before?.length && !edit.after?.length
      ?edit.before:null;
  if(!removed || !state.doc) return null;
  const ids=new Set(removed.map(object=>object.id));
  const snapshot={doc:state.doc,meshes:state.meshes,plans:state.plans,
    selected:new Set(state.selected),inside:state.inside};
  const keep=state.doc.objects.map(object=>!ids.has(object.id));
  state.doc={...state.doc,objects:state.doc.objects.filter((_,index)=>keep[index])};
  state.meshes=state.meshes.filter((_,index)=>keep[index]);
  state.plans=state.plans.filter((_,index)=>keep[index]);
  state.selected=new Set([...state.selected].filter(id=>!ids.has(id)));
  refresh(true);
  showStatus('Menghapus objek…');
  return ()=>{
    state.doc=snapshot.doc;state.meshes=snapshot.meshes;state.plans=snapshot.plans;
    state.selected=snapshot.selected;state.inside=snapshot.inside;
    refresh(true);
  };
}

function edit(before, after, type = 'object', select = true) {
  if (type === 'object' && before?.container?.definition) {
    const linked = linkedMembers(before);
    const updates = after ? linked.map(item=>({
      ...after, id:item.id, container:item.container,
      x:item.x+(after.x-before.x), y:item.y+(after.y-before.y), z:item.z+(after.z-before.z)
    })) : [];
    return batch(linked.map(item=>item.id===before.id?before:item), updates, after && select ? [after.id] : []);
  }
  const command = {type,before,after};
  return commit(command, topology => {
    state.undo.push(historyCommand(command,topology));
    state.redo.length = 0;
    if (type === 'object') state.selected = new Set(select && after ? [targetId(after)] : []);
  });
}

function batch(before,after,selection) {
  const command={type:'batch',before,after};
  return commit(command,topology=>{
    state.undo.push(historyCommand(command,topology));
    state.redo.length=0;
    state.selected=new Set(selection);
  });
}

function historyCommand(command, topology) {
  if (command.type==='sheet') return command;
  const collect = (items, extras) => [...new Map([...items,...extras].map(object=>[object.id,object])).values()];
  const asList = value => Array.isArray(value) ? value : value ? [value] : [];
  return {
    type:'batch',replay:true,
    before:collect(asList(command.before),topology?.removed||[]),
    after:collect(asList(command.after),topology?.added||[])
  };
}

function linkedMembers(object) {
  const {definition,slot}=object.container;
  return objects().filter(item=>item.container?.definition===definition && item.container.slot===slot);
}

function reverse(redo) {
  const source = redo ? state.redo : state.undo;
  const target = redo ? state.undo : state.redo;
  const command = source.at(-1);
  if (!command) return;
  const change = redo ? command : {...command, before:command.after, after:command.before};
  commit(change, () => {
    source.pop();
    target.push(command);
    if (change.type === 'object') state.selected = new Set(change.after ? [targetId(change.after)] : []);
    if (change.type === 'batch') {
      state.selected = new Set(change.after.map(targetId));
    }
  });
}

function refreshButtons() {
  $('#undo').disabled = state.busy || !state.undo.length;
  $('#redo').disabled = state.busy || !state.redo.length;
  for (const id of ['copy-container','explode-container','remove-container','duplicate','delete']) {
    $('#'+id).disabled=state.busy;
  }
}

function refresh(force = false) {
  const doc = state.doc;
  if (doc) {
    $('#project-title').textContent = doc.sheet.title;
    $('#sheet-code').textContent = doc.sheet.number;
    $('#revision').textContent = 'Revisi ' + doc.revision;
  }
  if (state.inside && !members(state.inside).length) state.inside=null;
  const valid=new Set(objects().map(targetId));
  state.selected=new Set([...state.selected].filter(id=>valid.has(id)));
  refreshButtons();
  renderTree();
  const object = currentObject();
  const group = members(onlySelected());
  $('#container-panel').hidden = !group.length;
  $('#exit-container').hidden = !state.inside;
  if (group.length) {
    const header=group[0].container;
    $('#container-title').textContent=header.name;
    $('#container-kind').textContent=(header.definition ? 'Component' : 'Group')+' · '+group.length+' objek';
    icon($('#container-glyph'),header.definition?'cube':'group');
  }
  const form = $('#object-form');
  form.hidden = !object;
  $('#select-prompt').hidden = Boolean(object) || group.length>0;
  $('#select-prompt').textContent=state.selected.size>1
    ? state.selected.size+' pilihan. Tekan G untuk Group atau Q untuk Component.'
    : 'Klik untuk memilih objek. Gunakan Shift + klik untuk menambah pilihan.';
  if (object) {
    $('#selection-title').textContent = object.name;
    const kind = object.shape === 'line' ? 'Garis' : object.plane_u ? 'Bidang 3D' : object.wall_axis ? 'Bidang vertikal' :
      object.height ? 'Bentuk 3D' : 'Bidang';
    $('#selection-kind').textContent = kind;
    $('#dimension-depth-label').textContent=object.plane_u?'Ukuran V':object.wall_axis?'Tinggi bidang':'Lebar';
    $('#dimension-height-label').textContent=object.plane_u||object.wall_axis?'Tebal':'Tinggi';
    icon($('#object-glyph'), object.shape === 'line' ? 'line' : object.height ? 'cube' : object.shape);
    if (force || objectBaseline?.id !== object.id || form.dataset.dirty !== 'yes') {
      Object.entries(object).forEach(([key,value]) => {
        const input = form.elements.namedItem(key);
        if (input) input.value = lengthFields.includes(key) ? displayLength(value) : value;
      });
      form.elements.height.readOnly = object.shape === 'line';
      objectBaseline = object;
      form.dataset.dirty = '';
    }
  } else objectBaseline = null;
  const sheetForm = $('#sheet-form');
  if (doc && (force || sheetForm.dataset.dirty !== 'yes')) {
    Object.entries(doc.sheet).forEach(([key,value]) => {
      sheetForm.elements.namedItem(key).value = key==='cut_height' ? displayLength(value) : value;
    });
    sheetBaseline = doc.sheet;
    sheetForm.dataset.dirty = '';
  }
  if (state.layout) drawSheet();
  else redraw();
}

function renderTree() {
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

function select(id, additive=false) {
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
  const ids=object.shape==='line'
    ? QreaseeLine.connectedLines(object.id,eligible.map(entry=>entry.object))
    : QreaseeLine.connectedFaces(object.id,eligible);
  if (object.shape!=='line') {
    for (const id of QreaseeLine.boundaryLineIds(ids,eligible)) {
      if (!ids.includes(id)) ids.push(id);
    }
  }
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

function removeObject() {
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
  edit(sheetBaseline, values, 'sheet');
};

$('#new-project').onclick = () => { $('#file-menu').open = false; openRoom(true); };
$('#demo-project').onclick = () => { $('#file-menu').open = false; openRoom(false); };
$('#share').onclick = () => {
  if (!state.room) return;
  $('#display-name').value = state.name;
  $('#share-link').value = location.href;
  $('#share-feedback').textContent = '';
  $('#share-dialog').showModal();
};
$('#display-name').onchange = event => {
  state.name = event.target.value.trim() || 'Tamu';
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
  const clip=projection===stagePoint && camera.perspective;
  meshes.forEach((mesh,index) => {
    if (!mesh.vertices.length) return;
    const projected = mesh.vertices.map(projection);
    const object = objects[index];
    const smooth = object.surface_role==='side' && object.shape==='circle';
    const quiet = Boolean(object.hide_edges) || Boolean(object.opening_id) && object.surface_role==='side';
    const entries = mesh.faces.length ? mesh.faces : [[0,1]];
    for (const [entryIndex, face] of entries.entries()) {
      const world=face.map(i=>mesh.vertices[i]);
      const visible=clip?clipNear(world):world;
      if (visible.length<Math.min(face.length,3)) continue;
      const points=visible===world?face.map(i=>projected[i]):visible.map(projection);
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
      const edges=visible===world && ring && face.length===3 ? face.map((index,i)=>{
        const delta=Math.abs(index%ring-face[(i+1)%face.length]%ring);
        return delta===1 || delta===ring-1;
      }) : null;
      faces.push({object,points,edges,world:visible,top,tone,cut:mesh.cut,
        depth:points.reduce((sum,p) => sum+p[2],0)/points.length,
        smooth,quiet,key:object.id+':'+index+':'+entryIndex});
    }
  });
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
      camera.axes,camera.center,camera.x,camera.y,camera.scale,camera.distance,camera.perspective]);
    if (sceneCache && !updates && sceneCache.meshes===meshes && sceneCache.objects===objects &&
        sceneCache.key===sceneKey) state.hits=sceneCache.faces;
    else {
      state.hits=scene(meshes,objects,stagePoint);
      if(!updates) sceneCache={meshes,objects,key:sceneKey,faces:state.hits};
    }
    for (const face of state.hits) {
      const selected = state.selected.has(targetId(face.object));
      const hovered = !selected && state.hoverKey &&
        (state.hoverKey===face.key || (face.smooth && state.hoverKey===face.object.id));
      polygon(face.points);
      if (face.points.length > 2) {
        ctx.fillStyle = shade(face.object.color,face.tone);
        ctx.fill();
        if (selected || hovered) {
          ctx.save();
          ctx.fillStyle = selected ? selectionPattern : hoverPattern;
          ctx.fill();
          ctx.restore();
        }
      }
      ctx.strokeStyle = selected ? '#c87936' : dark ? '#aeb3b7' : '#4f5150';
      ctx.lineWidth = selected ? 1.65 : .8;
      if (face.edges) {
        ctx.beginPath();
        for (let i=0;i<face.edges.length;i++) {
          if (!face.edges[i]) continue;
          ctx.moveTo(...face.points[i].slice(0,2));
          ctx.lineTo(...face.points[(i+1)%face.points.length].slice(0,2));
        }
      }
      if (!face.smooth && !face.quiet) ctx.stroke();
    }
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
  $('#snap-feedback').dataset.kind=snapLabel==='Ujung'?'endpoint':snapLabel==='Titik tengah'?'midpoint':'';
  if (state.inference) {
    const [x,y]=stagePoint(state.inference.world);
    if (Number.isFinite(x)) {
      ctx.beginPath();
      if (state.inference.label==='Ujung') ctx.rect(x-4,y-4,8,8);
      else ctx.arc(x,y,4,0,Math.PI*2);
      ctx.fillStyle='#fff';
      ctx.fill();
      ctx.strokeStyle=snapLabel==='Ujung'?'#f0913b':snapLabel==='Titik tengah'?'#e6bf19':'#00856d';
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
  drawAxes();
}

/** @param {QreaseeObject} object @returns {QreaseeMesh} */
function previewMesh(object) {
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

/** @param {number[]} point @param {number|undefined} elevation @param {Set<string>=} excluded @param {(world: QreaseePoint)=>boolean=} accept @returns {QreaseeInference|null} */
function infer(point, elevation, excluded = new Set(), accept) {
  if (!state.snapping) return null;
  let best=null;
  const add=(world,label,tier,owner)=>{
    if (elevation!==undefined && Math.abs(world[2]-elevation)>.00001) return;
    if (accept && !accept(world)) return;
    const projected=stagePoint(world);
    if (!Number.isFinite(projected[0]) || !Number.isFinite(projected[1])) return;
    const distance=Math.hypot(projected[0]-point[0],projected[1]-point[1]);
    if (!(distance<=snapRadius)) return;
    const hit=state.hits.findLast(face=>!excluded.has(face.object.id) && contains(projected,face.points));
    if (hit && hit.object.id!==owner &&
        !(hit.object.shape==='polygon' && hit.object.height===0 && Math.abs(hit.object.z-world[2])<.00001) &&
        !onFaceBoundary(world,hit.world)) return;
    const depth=Number.isFinite(projected[2])?projected[2]:-Infinity;
    if (best) {
      if (tier>best.tier) return;
      if (tier===best.tier) {
        if (distance>best.distance+.5) return;
        if (distance>=best.distance-.5 && depth<=best.depth) return;
      }
    }
    best={world,label,tier,distance,depth};
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
      add(interpolate(a,b,.5),'Titik tengah',1,owner);
      const length=dx*dx+dy*dy;
      if (length<.01) continue;
      const fraction=clamp(((point[0]-p[0])*dx+(point[1]-p[1])*dy)/length,0,1);
      const t=fraction*p[3]/((1-fraction)*q[3]+fraction*p[3]);
      add(interpolate(a,b,t),'Pada tepi',2,owner);
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
  if (candidate && ['Ujung','Titik tengah','Pada tepi'].includes(candidate.label)) return candidate;
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

canvas.addEventListener('contextmenu',event=>event.preventDefault());
canvas.addEventListener('wheel',event=>{
  event.preventDefault();
  zoom(Math.exp(-clamp(event.deltaY,-400,400)*.0015),...pointer(event));
},{passive:false});
canvas.addEventListener('pointerdown',event=>{
  if (state.drag || event.button > 2) return;
  const start=pointer(event);
  const tool=event.button === 1 ? (event.shiftKey?'pan':'orbit') : event.button === 2 ? 'pan' : state.tool;
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
    const initial=drawingPoint(start);
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
    }
  }
  canvas.setPointerCapture(event.pointerId);
});

canvas.addEventListener('pointermove',event=>{
  const point=pointer(event);
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
    const hovered=pickFace(point,false);
    state.hoverKey=hovered ? (hovered.smooth ? hovered.object.id : hovered.key) : null;
  } else state.hoverKey=null;
  if (!drag) {
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
canvas.addEventListener('pointerleave',()=>{if (!state.layout) state.cursor=null;state.hoverKey=null;state.inference=null;redraw();});
canvas.addEventListener('dblclick',event=>{
  if (state.tool==='line' && state.linePending) { finishLine(); return; }
  if (state.tool!=='select') return;
  const face=state.hits.findLast(candidate=>contains(pointer(event),candidate.points));
  if (face?.object.container) enterContainer(face.object.container.id);
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
    if (valid) {
      if (drag.tool==='rectangle') insertRectangle(object,drag.host);
      else if (drag.tool==='line') addLineObject(object);
      else placePlanarFace(object);
      $('#line-length').value='';
    }
  } else if (drag?.updates && drag.updates.some((object,i)=>JSON.stringify(object)!==JSON.stringify(drag.sources[i]))) {
    if (['move','rotate','scale'].includes(drag.tool) && targetId(drag.object)!==drag.object.id) {
      batch(drag.sources,drag.updates,[targetId(drag.object)]);
    } else if (drag.tool==='pull') commitPull(drag.object,drag.updates[0]);
    else edit(drag.object,drag.updates[0]);
    if (drag.tool==='pull') $('#line-length').value='';
  } else if (drag && ['rectangle','circle','arc','pull'].includes(drag.tool)) {
    state.drawPending={...drag,preview:null,previewArc:null,updates:null};
    showStatus('Masukkan ukuran bila perlu, lalu klik arah pada kanvas.');
  }
  redraw();
});
canvas.addEventListener('lostpointercapture',()=>{
  if (state.drag || state.linePress) { state.drag=null; state.linePress=null; redraw(); }
});
window.addEventListener('keydown',event=>{
  const dialog=document.querySelector('dialog[open]');
  const target=/** @type {HTMLElement} */ (event.target);
  const typing=['INPUT','TEXTAREA','SELECT'].includes(target.tagName) || target.isContentEditable;
  if (event.key==='Escape') {
    if (dialog) return;
    if (!$('#account-menu').hidden) {accountMenu(false);return;}
    if (state.drag) {state.drag=null;state.inference=null;setTool('select');redraw();return;}
    if (state.arcPending) {state.arcPending=null;state.inference=null;setTool('select');redraw();return;}
    if (state.drawPending) {state.drawPending=null;state.inference=null;setTool('select');redraw();return;}
    if (state.movePending) {state.movePending=null;state.inference=null;setTool('select');redraw();return;}
    if (state.rotatePending) {state.rotatePending=null;state.inference=null;setTool('select');redraw();return;}
    if (state.offsetPending) {state.offsetPending=null;state.inference=null;setTool('select');redraw();return;}
    if (state.measurePending) {state.measurePending=null;state.inference=null;
      showStatus('Pengukuran dibatalkan. Klik titik awal baru atau Esc untuk keluar.');redraw();return;}
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
    removeObject();
    return;
  }
  if (buttonFocus) return;
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
  if (key==='G' || key==='Q') { event.preventDefault();createContainer(key==='Q');return; }
  const tool=Object.entries(tools).find(([,value])=>value[1]===key);
  if (tool) setTool(tool[0]);
});

new ResizeObserver(()=>{
  if (camera.perspective) camera.scale=focalPixels()/camera.distance;
  redraw();
}).observe(canvas);


function drawSheet() {
  const sheet = $('#sheet');
  sheet.replaceChildren(svg('rect',{width:420,height:297,fill:'#fff'}));
  if (!state.doc) return;
  const {objects,sheet:settings}=state.doc;
  const add=(name,attrs,text)=>sheet.append(svg(name,attrs,text));
  add('rect',{x:9,y:9,width:402,height:279,fill:'none',stroke:'#33404c','stroke-width':.42});
  const text=(x,y,value,options={})=>add('text',{x,y,fill:'#23313b','font-family':'Segoe UI, Arial, sans-serif','font-size':3.2,...options},value);
  /** @type {Array<{x: number, y: number, w: number, h: number, mode: QreaseeView, label: string, dimensions?: boolean}>} */
  const viewports=[
    {x:14,y:14,w:222,h:130,mode:'plan',label:'01  DENAH',dimensions:true},
    {x:242,y:14,w:164,h:130,mode:'iso',label:'02  AKSONOMETRI'},
    {x:14,y:150,w:222,h:98,mode:'front',label:'03  TAMPAK DEPAN'},
    {x:242,y:150,w:164,h:98,mode:'right',label:'04  TAMPAK KANAN'}
  ];
  let clipped=false;
  for (const view of viewports) {
    const {x,y,w,h,mode,label,dimensions}=view;
    const meshes=mode==='plan'?state.plans:state.meshes;
    add('rect',{x,y,width:w,height:h,fill:'#fdfdfd',stroke:'#c1c9ce','stroke-width':.28});
    const raw=basis(...views[mode]);
    const points=meshes.flatMap(mesh=>mesh.vertices.map(raw));
    const clipId='clip-'+mode;
    const clip=svg('clipPath',{id:clipId});
    clip.append(svg('rect',{x:x+1,y:y+1,width:w-2,height:h-13}));
    sheet.append(clip);
    const drawing=svg('g',{'clip-path':'url(#'+clipId+')'});
    sheet.append(drawing);
    if(points.length) {
      const {min,max}=bounds(points);
      const spanX=Math.max(.05,max[0]-min[0]), spanY=Math.max(.05,max[1]-min[1]);
      const usableH=h-(dimensions?35:19);
      const factor=mode==='iso' ? Math.min((w-20)/spanX,usableH/spanY) : 1000/settings.scale;
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
        const line=(x1,y1,x2,y2)=>add('line',{x1,y1,x2,y2,stroke:'#566774','stroke-width':.22});
        line(start[0],end[1]+1,start[0],dy+2);
        line(end[0],end[1]+1,end[0],dy+2);
        line(start[0],dy,end[0],dy);
        line(start[0]-1,dy+1,start[0]+1,dy-1);
        line(end[0]-1,dy+1,end[0]+1,dy-1);
        text(center[0],dy-1.5,lengthLabel(max[0]-min[0]),{'text-anchor':'middle','font-size':2.9});
      }
    }
    const caption=mode==='plan'?label+'  /  POTONG '+lengthLabel(settings.cut_height):label;
    text(x+3,y+h-5,caption,{'font-weight':700});
    text(x+w-3,y+h-5,mode==='iso'?'TANPA SKALA':'1:'+settings.scale,{'text-anchor':'end',fill:'#52616d','font-size':2.9});
  }
  add('line',{x1:9,y1:254,x2:411,y2:254,stroke:'#33404c','stroke-width':.42});
  add('line',{x1:310,y1:254,x2:310,y2:288,stroke:'#33404c','stroke-width':.42});
  add('line',{x1:367,y1:254,x2:367,y2:288,stroke:'#33404c','stroke-width':.42});
  text(15,261,'PROYEK',{'font-size':2.9,'font-weight':700,fill:'#52616d'});
  text(15,271,settings.title,{'font-size':5.5,'font-weight':700});
  const noteWords=settings.notes.replace(/\s+/g,' ').trim().split(' ');
  let noteLine='', noteY=279;
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
  text(15,noteY,noteLine,{'font-size':2.8,fill:'#52616d','clip-path':'url(#clip-notes)'});
  text(315,261,'FORMAT / SKALA',{'font-size':2.9,'font-weight':700,fill:'#52616d'});
  text(315,273,'A3  /  1:'+settings.scale,{'font-size':5});
  text(372,261,'NO. GAMBAR',{'font-size':2.9,'font-weight':700,fill:'#52616d'});
  text(372,273,settings.number,{'font-size':4.6,'font-weight':700,'textLength':Math.min(33,Math.max(4,settings.number.length*2.8)),'lengthAdjust':'spacingAndGlyphs'});
  $('#scale-note').textContent=clipped
    ? 'Ada tampilan yang terpotong. Gunakan penyebut skala yang lebih besar.'
    : 'Untuk menjaga skala, cetak A3 pada ukuran aktual (100%).';
  drawLayoutCursors();
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
  const rect=event.currentTarget.getBoundingClientRect();
  state.cursor={mode:'layout',x:round((event.clientX-rect.left)*420/rect.width),
    y:round((event.clientY-rect.top)*297/rect.height)};
});
$('#sheet').addEventListener('pointerleave',()=>{if (state.layout) state.cursor=null;});

window.addEventListener('hashchange',()=>openRoom());
let lastSync=0;
setInterval(()=>{
  const fast=state.linePending || state.peers.some(peer=>peer.cursor?.line);
  const interval=window.qreaseeCloudPost ? (fast?500:1500) : 350;
  if (Date.now()-lastSync>=interval) { lastSync=Date.now(); sync(); }
},250);
openRoom();
