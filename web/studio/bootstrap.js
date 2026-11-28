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
  comment:'<path d="M4 5h16v11H9l-5 4z"/><path d="M8 9h8m-8 4h5"/>',
  section:'<path d="M3 5h18v14H3z"/><path d="m4 17 16-10" stroke-dasharray="3 2"/>',
  bucket:'<path d="m5 13 7-7 6 6-7 7a2 2 0 0 1-3 0l-3-3a2 2 0 0 1 0-3z"/><path d="m9 9 6 6"/><path d="M19 15.5c1.2 1.5 1.2 2.7 0 3.5-1.2-.8-1.2-2 0-3.5z"/>',
  hidden:'<path d="M2 12s4-6 10-6 10 6 10 6-4 6-10 6S2 12 2 12z"/><circle cx="12" cy="12" r="2.5"/><path d="m4 4 16 16"/>',
  bulb:'<path d="M9 18h6m-5 3h4M8 14a6 6 0 1 1 8 0c-1 .8-1.5 2-1.5 3h-5c0-1-.5-2.2-1.5-3z"/>',
  reverse:'<path d="M4 7h13m0 0-3-3m3 3-3 3M20 17H7m0 0 3-3m-3 3 3 3"/>',
  orbit:'<ellipse cx="12" cy="12" rx="9" ry="5.5" transform="rotate(-28 12 12)"/><path d="M8 4a8 8 0 0 1 12 5m-2-4 2 4 2-4M10 20a8 8 0 0 1-6-5"/>',
  pan:'<path d="M8 13V6a1.5 1.5 0 0 1 3 0v5-7a1.5 1.5 0 0 1 3 0v7-5a1.5 1.5 0 0 1 3 0v6-3a1.5 1.5 0 0 1 3 0v6c0 4-2 6-6 6h-2a5 5 0 0 1-4-2l-4-5a1.6 1.6 0 0 1 2.5-2z"/>',
  download:'<path d="M12 3v12m-5-5 5 5 5-5M4 16v4h16v-4"/>',
  upload:'<path d="M12 17V5m-5 5 5-5 5 5M4 17v4h16v-4"/>',
  pencil:'<path d="m4 20 4.5-1 11-11a2 2 0 0 0-3-3l-11 11L4 20zM14 7l3 3"/>'
};
function icon(element, name) {
  if (!Object.prototype.hasOwnProperty.call(icons,name)) return;
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
  section: ['Bidang potong', 'X', 'Klik bidang untuk menempatkan potongan; geser sepanjang normal lalu klik lagi'],
  bucket: ['Material', 'B', 'Pilih material pada palet, lalu klik objek atau Group untuk menerapkannya'],
  orbit: ['Orbit', 'O', 'Tarik untuk memutar kamera'],
  pan: ['Geser kamera', '', 'Tarik untuk menggeser kamera']
};

const identity = () => {
  if (crypto.randomUUID) return crypto.randomUUID();
  const bits = crypto.getRandomValues(new Uint8Array(16));
  bits[6] = (bits[6] & 15) | 64;
  bits[8] = (bits[8] & 63) | 128;
  const hex = [...bits].map(byte => byte.toString(16).padStart(2, '0')).join('');
  return [hex.slice(0,8),hex.slice(8,12),hex.slice(12,16),hex.slice(16,20),hex.slice(20)].join('-');
};

const storedName=(localStorage.getItem('qreasee-name') || 'Tamu')
  .replace(/[\u0000-\u001f\u007f]/g,'').trim().slice(0,32) || 'Tamu';
/** @type {QreaseeState} */
const state = {
  room: '', client: identity(), name: storedName,
  doc: null, meshes: [], plans: [], selected: new Set(), inside: null, tool: 'select', layout: false, busy: false,
  snapping: true, inference: null,
  undo: [], redo: [], drag: null, arcPending:null, linePending:null, linePress:null, drawPending:null,
  movePending:null, rotatePending:null, offsetPending:null, offsetHover:null, measurePending:null, sectionPending:null, sectionHover:null, hits: [], hoverKey: null, epoch: 0, polling: false, syncFailures:0, peers:[], cursor:null, canManageShare:!window.qreaseeCloudPost, shareRole:'edit', showHidden:false
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
/** @type {import('./editor-context').EditorContext} */
const editorContext = {state,camera,layout:{
  tool:'select',selected:null,drag:null,dimensionStart:null,activeViewId:null,
  gridPending:null,gridHover:null,selectedGridId:null,hoverGridId:null,zoom:1
}};
const layoutRuntime = editorContext.layout;
const perspectiveFov = 35*Math.PI/180;
const nearPlane = .01;
const unitFactors = {m:1,cm:100,mm:1000};
let displayUnit = unitFactors[localStorage.getItem('qreasee-unit')] ? localStorage.getItem('qreasee-unit') : 'm';
/** @type {{id: QreaseeMaterial, name: string, color: string, pattern: string, tileCm: number, image?: string}[]} */
const materialPresets = [
  {id:'brick',name:'Bata merah',color:'#a9553f',pattern:'brick',tileCm:20},
  {id:'hebel',name:'Hebel / AAC',color:'#d8d4c7',pattern:'block',tileCm:60},
  {id:'timber',name:'Kayu',color:'#a77643',pattern:'timber',tileCm:30},
  {id:'zinc',name:'Seng',color:'#9aa3a7',pattern:'zinc',tileCm:90},
  {id:'clay_tile',name:'Genteng tanah liat',color:'#b5502f',pattern:'tile',tileCm:30},
  {id:'concrete_tile',name:'Genteng beton',color:'#777b7e',pattern:'tile',tileCm:30},
  {id:'glass',name:'Kaca',color:'#b7d7e2',pattern:'glass',tileCm:60},
  {id:'grass',name:'Rumput',color:'#6e8e4b',pattern:'grass',tileCm:20},
  {id:'sand',name:'Pasir',color:'#d7c28e',pattern:'sand',tileCm:20},
  {id:'asphalt',name:'Aspal',color:'#4d5154',pattern:'asphalt',tileCm:20},
  {id:'metal',name:'Logam',color:'#959da3',pattern:'metal',tileCm:60},
  {id:'paint',name:'Cat dasar',color:'#d7d9db',pattern:'paint',tileCm:30},
  {id:'ceramic_white_40',name:'Keramik putih 40x40',color:'#ecebe6',pattern:'ceramic',tileCm:40},
  {id:'ceramic_beige_60',name:'Keramik beige 60x60',color:'#d8c6a8',pattern:'ceramic',tileCm:60},
  {id:'ceramic_black_60',name:'Keramik hitam 60x60',color:'#3a3c3f',pattern:'ceramic',tileCm:60}
];
const materialById = new Map(materialPresets.map(material=>[material.id,material]));
const CUSTOM_MATERIALS_KEY='qreasee-custom-materials-v1';
/** @type {{id: QreaseeMaterial, name: string, color: string, pattern: string, tileCm: number, image: string, custom?: boolean}[]} */
let customMaterials=[];
const materialImages=new Map();
const allMaterials = () => [...materialPresets,...customMaterials];
const safeScale = value => Math.max(1,Math.min(1000,Number(value)||30));

function storeCustomMaterials() {
  try {
    localStorage.setItem(CUSTOM_MATERIALS_KEY,JSON.stringify(customMaterials));
  } catch { /* Storage can be full or disabled; the material still works this session. */ }
}

/** @param {any} material @param {boolean=} persist */
function registerCustomMaterial(material,persist=false) {
  if (!material || typeof material.id!=='string' || !material.id.startsWith('custom:') ||
      typeof material.image!=='string' || !material.image.startsWith('data:image/')) return;
  const safe={id:material.id,name:String(material.name||'Material kustom').slice(0,32),
    color:/^#[0-9a-f]{6}$/i.test(material.color||'')?material.color:'#b9b9b9',
    pattern:'image',tileCm:safeScale(material.tileCm),
    image:material.image,custom:true};
  materialById.set(safe.id,safe);
  if (!customMaterials.some(item=>item.id===safe.id)) customMaterials.push(safe);
  const image=new Image();
  image.onload=()=>redraw();
  image.src=safe.image;
  materialImages.set(safe.id,image);
  if (persist) storeCustomMaterials();
}

function loadCustomMaterials() {
  try {
    const stored=JSON.parse(localStorage.getItem(CUSTOM_MATERIALS_KEY)||'[]');
    if (Array.isArray(stored)) {
      for (const material of stored.slice(0,12)) registerCustomMaterial(material);
    }
  } catch { /* Ignore damaged custom material storage. */ }
}
loadCustomMaterials();

/** @type {QreaseeMaterial} */
let bucketMaterial = materialById.has(/** @type {QreaseeMaterial} */ (localStorage.getItem('qreasee-bucket-material')))
  ? /** @type {QreaseeMaterial} */ (localStorage.getItem('qreasee-bucket-material')) : 'paint';
let bucketScale=safeScale(localStorage.getItem('qreasee-bucket-scale'));
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
  if (!canEditModel() && !['select','orbit','pan','measure'].includes(tool)) {
    showStatus('Akses Anda '+shareRoleLabel(shareRole()).toLowerCase()+'; alat gambar dinonaktifkan.');
    return;
  }
  if (state.tool!==tool) {
    state.drag=null;
    state.arcPending=null;
    state.linePending=null;
    state.linePress=null;
    state.drawPending=null;
    state.movePending=null;
    state.rotatePending=null;
    state.offsetPending=null;
    state.offsetHover=null;
    state.measurePending=null;
    state.sectionPending=null;
    state.sectionHover=null;
    state.hoverKey=null;
    if (state.cursor) delete state.cursor.line;
    $('#line-length').value='';
  }
  state.tool = tool;
  canvas.style.cursor='';
  renderBucketPalette();
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
  if (!layout && typeof exitLayoutView==='function') exitLayoutView();
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
  if (layout) {
    $('#layout-side-properties').append($('#sheet-form'));
    $('#inspector').hidden=true;
    $('#workspace').classList.remove('inspector-open');
    $('#inspector-toggle').setAttribute('aria-expanded','false');
    drawSheet();
  } else {
    $('#layout-inspector').append($('#sheet-form'));
    redraw();
  }
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

const recentKey=()=> 'qreasee-recent:'+(window.qreaseeAuth?.userId || 'local');
function recentProjects() {
  let local=[];
  try { local=JSON.parse(localStorage.getItem(recentKey()) || '[]'); } catch { /* Ignore damaged local history. */ }
  if (!Array.isArray(local)) local=[];
  const remote=Array.isArray(window.qreaseeAuth?.recentProjects) ? window.qreaseeAuth.recentProjects : [];
  const merged=new Map();
  for (const item of [...local,...remote]) {
    if (!item || typeof item.id!=='string' ||
        !/^[0-9a-f]{8}(-[0-9a-f]{4}){3}-[0-9a-f]{12}$/i.test(item.id)) continue;
    const safe={id:item.id,title:String(item.title||'Proyek tanpa judul').slice(0,80),
      updatedAt:Number(item.updatedAt)||0};
    if (!merged.has(safe.id) || safe.updatedAt>merged.get(safe.id).updatedAt) merged.set(safe.id,safe);
  }
  return [...merged.values()].sort((a,b)=>b.updatedAt-a.updatedAt).slice(0,30);
}
function renderProjectHome() {
  const list=$('#home-projects');
  list.replaceChildren();
  $('#home-storage-note').textContent=window.qreaseeAuth?.userId
    ? 'Tersimpan pada akun Google Anda' : 'Tersimpan di browser ini';
  const projects=recentProjects();
  if (!projects.length) {
    const empty=document.createElement('div');
    empty.className='home-empty';
    const title=document.createElement('strong');title.textContent='Belum ada proyek terbaru';
    empty.append(title,document.createTextNode('Buat proyek baru untuk mulai menggambar bersama.'));
    list.append(empty);
    return;
  }
  for (const project of projects) {
    const card=document.createElement('button');
    card.type='button';card.className='home-project-card';
    const art=document.createElement('span');art.className='home-project-art';
    const info=document.createElement('span');info.className='home-project-info';
    const title=document.createElement('strong');title.textContent=project.title || 'Proyek tanpa judul';
    const meta=document.createElement('small');
    meta.textContent='Terakhir dibuka '+new Date(project.updatedAt).toLocaleDateString('id-ID',
      {day:'numeric',month:'long',year:'numeric'});
    info.append(title,meta);card.append(art,info);
    card.onclick=()=>{history.replaceState(null,'','#'+project.id);openRoom();};
    list.append(card);
  }
}
function showProjectHome() {
  ++state.epoch;
  state.room='';
  history.replaceState(null,'',location.pathname);
  document.body.classList.add('landing');
  renderProjectHome();
}
let rememberTimer;
function rememberProject() {
  if (!state.room || !state.doc) return;
  const project={id:state.room,title:state.doc.sheet.title || 'Proyek tanpa judul',updatedAt:Date.now()};
  const projects=[project,...recentProjects().filter(item=>item.id!==project.id)].slice(0,30);
  localStorage.setItem(recentKey(),JSON.stringify(projects));
  clearTimeout(rememberTimer);
  if (window.qreaseeAuth?.rememberProject) {
    rememberTimer=setTimeout(()=>window.qreaseeAuth.rememberProject(project).catch(()=>{}),1200);
  }
}

async function openRoom(createBlank) {
  const epoch = ++state.epoch;
  layoutRuntime.selectedGridId=null;
  if (window.qreaseeAuth) {
    const session = await window.qreaseeAuth.ready;
    if (state.epoch !== epoch || !session) return;
    state.name = String(window.qreaseeAuth.displayName||'Tamu')
      .replace(/[\u0000-\u001f\u007f]/g,'').trim().slice(0,32) || 'Tamu';
  }
  state.busy = false;
  exitLayoutView();
  layoutRuntime.selected = null;
  $('#layout-selection').hidden = true;
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
  state.offsetHover = null;
  state.measurePending = null;
  state.sectionPending = null;
  state.sectionHover = null;
  activeCommentTarget=null;
  activeSectionId=null;
  closeCommentComposer();
  hideObjectMenu();
  toggleComments(false);
  toggleSections(false);
  $('#line-length-control').hidden=state.layout || !['line','rectangle','circle','arc','pull','rotate','offset'].includes(state.tool);
  $('#line-length').value='';
  state.undo = [];
  state.redo = [];
  state.polling = false;
  state.syncFailures = 0;
  state.canManageShare = !window.qreaseeCloudPost;
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
    if (!state.doc) throw new Error('Proyek tidak dapat dibuka. Periksa koneksi atau tautannya.');
    if (state.doc) {
      document.body.classList.remove('landing');
      requestAnimationFrame(()=>{ if (state.epoch===epoch) fit(); });
    }
  } catch (error) {
    if (state.epoch === epoch) {
      connection(false, 'Terputus');
      showStatus(error.message || 'Server tidak dapat dihubungi. Muat ulang halaman untuk mencoba lagi.');
      $('#home-message').textContent=error.message || 'Proyek tidak dapat dibuka.';
    }
  }
}

function accept(data) {
  if (typeof data.can_manage === 'boolean') state.canManageShare=data.can_manage;
  if (typeof data.role === 'string') state.shareRole=data.role;
  const update = data.changes;
  if (update && (!state.doc || update.document.revision >= state.doc.revision)) {
    const first = !state.doc;
    const oldTitle=state.doc?.sheet.title;
    state.doc = update.document;
    if (typeof data.role !== 'string') state.shareRole=state.doc.share?.role || 'edit';
    state.meshes = update.meshes;
    state.plans = update.plans;
    if (first) {
      const initial = state.doc.objects.find(object => object.name === 'Atap utama');
      if (initial) state.selected.add(targetId(initial));
      fit();
      showStatus('Ruang model siap.');
    }
    refresh(first);
    if (first || oldTitle!==state.doc.sheet.title) rememberProject();
  }
  const avatars = $('#avatars');
  const peers = [...(data.peers || [])].sort((a,b) => Number(b.id === state.client) - Number(a.id === state.client));
  const signature=(data.online_count ?? peers.length)+'|'+peers.map(({id,name})=>id+name).sort().join('|');
  if (avatars.dataset.signature!==signature) {
    avatars.dataset.signature=signature;
    avatars.replaceChildren();
    renderAvatars(avatars,peers,data.online_count ?? peers.length);
  }
  const others=peers.filter(peer=>peer.id!==state.client).sort((a,b)=>a.id.localeCompare(b.id));
  const cursorChanged=JSON.stringify(state.peers)!==JSON.stringify(others);
  state.peers=others;
  if ($('#share-dialog').open) renderShareDialog();
  connection(true, window.qreaseeCloudPost ? (data.online_count ?? peers.length) + ' online' :
    window.qreaseeDemoPost ? 'Lokal' : peers.length + ' online');
  if (cursorChanged) {
    if (state.layout) drawLayoutCursors();
    else redraw();
  }
}

/** @param {Element} avatars @param {QreaseePeer[]} peers @param {number} onlineCount */
function renderAvatars(avatars,peers,onlineCount) {
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
  if (onlineCount > 4) {
    const count = document.createElement('span');
    count.className = 'avatar';
    count.textContent = '+' + (onlineCount - 4);
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
    if (result.code === 200) {
      state.syncFailures=0;
      accept(result.data);
    }
    else {
      state.syncFailures=Math.min(4,state.syncFailures+1);
      showStatus(result.data.error || 'Sinkronisasi gagal.');
      connection(false, 'Tidak tersedia');
      if (result.code === 404) state.room = '';
    }
  } catch {
    if (state.epoch === epoch) {
      state.syncFailures=Math.min(4,state.syncFailures+1);
      connection(false, 'Terputus');
    }
  } finally {
    if (state.epoch === epoch) state.polling = false;
  }
}

async function commit(edit, success) {
  if (!state.doc || state.busy) return false;
  const epoch = state.epoch;
  state.busy = true;
  refreshButtons();
  const slowSave=setTimeout(()=>{
    if (state.epoch===epoch && state.busy) showStatus('Menyimpan perubahan…');
  },220);
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
    clearTimeout(slowSave);
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
  if (type === 'sheet' && before?.title !== after?.title && !state.canManageShare) {
    showStatus('Hanya pemilik proyek yang dapat mengganti nama proyek.');
    return Promise.resolve(false);
  }
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
  const editable=canEditModel(), comment=canComment();
  $('#undo').disabled = state.busy || !editable || !state.undo.length;
  $('#redo').disabled = state.busy || !editable || !state.redo.length;
  $('#import-skp-quick').disabled=state.busy || !editable;
  $('#import-skp').disabled=state.busy || !editable;
  $('#rename-project').disabled=state.busy || !editable || !state.canManageShare;
  $('#rename-project').title=state.canManageShare?'Ganti nama proyek':'Hanya pemilik yang dapat mengganti nama proyek';
  $('#sheet-form [name="title"]').disabled=!editable || !state.canManageShare;
  for (const id of ['copy-container','explode-container','remove-container','duplicate','delete']) {
    $('#'+id).disabled=state.busy || !editable;
  }
  for (const button of document.querySelectorAll('#tool-buttons .icon-button')) {
    const tool=/** @type {HTMLElement} */ (button).dataset.tool;
    /** @type {HTMLButtonElement} */ (button).disabled=!editable &&
      !['select','orbit','pan','measure'].includes(tool||'');
  }
  $('#comment-send').disabled=state.busy || !comment;
  $('#comment-text').disabled=!comment;
  $('#object-menu-comment').disabled=!comment;
  $('#section-add').disabled=state.busy || !editable;
}

function refresh(force = false) {
  const doc = state.doc;
  if (doc) {
    $('#project-title').textContent = doc.sheet.title;
    $('#sheet-code').textContent = doc.sheet.number;
    $('#revision').textContent = 'Revisi ' + doc.revision;
  }
  if (state.inside && !members(state.inside).length) state.inside=null;
  if(layoutRuntime.selectedGridId&&!grids().some(grid=>grid.id===layoutRuntime.selectedGridId))layoutRuntime.selectedGridId=null;
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
    const editable=canEditModel();
    form.querySelectorAll('input,select,button').forEach(
      /** @param {HTMLInputElement|HTMLSelectElement|HTMLButtonElement} element */ element => {
      element.disabled=!editable;
    });
  } else objectBaseline = null;
  renderMaterials();
  renderBucketPalette();
  const sheetForm = $('#sheet-form');
  if (doc && (force || sheetForm.dataset.dirty !== 'yes')) {
    for (const key of ['room_title','drawn_by','checked_by','issue_date']) sheetForm.elements.namedItem(key).value=doc.sheet[key] || '';
    Object.entries(doc.sheet).forEach(([key,value]) => {
      const input=sheetForm.elements.namedItem(key);
      if (input) input.value = key==='cut_height' ? displayLength(value) : value;
    });
    sheetBaseline = doc.sheet;
    sheetForm.dataset.dirty = '';
  }
  const editable=canEditModel();
  sheetForm.querySelectorAll('input,select,textarea,button').forEach(
    /** @param {HTMLInputElement|HTMLSelectElement|HTMLTextAreaElement|HTMLButtonElement} element */ element => {
    element.disabled=!editable;
  });
  sheetForm.elements.namedItem('title').disabled=!editable || !state.canManageShare;
  applyAccessUi();
  renderComments();
  renderSections();
  if (state.layout) drawSheet();
  else redraw();
}

function shareLinkRole() {
  const role=state.doc?.share?.role;
  return role==='comment'||role==='view'?role:'edit';
}
function shareRole() { return state.shareRole || shareLinkRole(); }
function canEditModel() { return shareRole()==='edit'; }
function canComment() { return shareRole()!=='view'; }
function shareRoleLabel(role) {
  return role==='comment'?'Dapat berkomentar':role==='view'?'Hanya melihat':'Dapat mengedit';
}

function applyAccessUi() {
  const role=shareRole();
  const badge=$('#access-badge');
  badge.hidden=role==='edit';
  if (!badge.hidden) {
    badge.textContent=shareRoleLabel(role);
    badge.dataset.role=role;
  }
  if (!canEditModel() && !['select','orbit','pan','measure'].includes(state.tool)) {
    state.drag=null;
    state.linePress=null;
    setTool('select');
    redraw();
  }
  if (!canComment() && !$('#comment-composer').hidden) closeCommentComposer();
  if ($('#share-dialog').open) renderShareDialog();
}

function renderShareDialog() {
  $('#display-name').value=state.name;
  $('#share-link').value=location.href;
  $('#share-role').value=shareLinkRole();
  $('#share-role').disabled=!state.canManageShare || state.busy;
  $('#share-role-hint').textContent=state.canManageShare
    ? 'Pemilik proyek tetap dapat mengedit. Pilih akses untuk siapa pun yang membuka tautan.'
    : 'Hanya pemilik proyek yang dapat mengubah akses. Anda: '+shareRoleLabel(shareRole())+'.';
  const people=$('#share-people');
  people.replaceChildren();
  const addPerson=(name,role,owner)=>{
    const row=document.createElement('div');row.className='share-person';
    const avatar=document.createElement('span');avatar.className='comment-avatar';
    avatar.textContent=commentInitials(name);
    const info=document.createElement('div');info.className='share-person-info';
    const label=document.createElement('strong');label.textContent=name;
    const kind=document.createElement('small');kind.textContent=owner?'Akses penuh':'Peserta aktif';
    info.append(label,kind);
    const badge=document.createElement('span');badge.className='share-person-role';
    badge.textContent=owner?'Pemilik':shareRoleLabel(role);
    row.append(avatar,info,badge);
    people.append(row);
  };
  addPerson((window.qreaseeAuth?.displayName || state.name)+' (Anda)',shareRole(),state.canManageShare);
  for (const peer of state.peers) {
    addPerson(peer.name||'Tamu',state.canManageShare?shareLinkRole():shareRole(),
      false);
  }
}

async function changeShareRole(role) {
  if (!state.canManageShare) {renderShareDialog();return;}
  const before=state.doc?.share || {role:'edit'};
  if (before.role===role) return;
  const saved=await commit({type:'share',before,after:{role}});
  if (saved) showStatus('Akses tautan: '+shareRoleLabel(role)+'.');
  else renderShareDialog();
}

/** @returns {QreaseeObject[]} */
function materialTargets() {
  const group=members(onlySelected());
  if (group.length) return group.filter(object=>object.shape!=='line');
  const object=currentObject();
  return object && object.shape!=='line' ? [object] : [];
}

function renderMaterials() {
  const panel=$('#material-panel');
  const targets=materialTargets();
  if (!targets.length) {panel.hidden=true;return;}
  panel.hidden=false;
  const materials=targets.map(object=>object.material || '');
  const current=materials.every(value=>value===materials[0])?materials[0]:'__mixed__';
  $('#material-current').textContent=current==='__mixed__'?'Campuran':
    current?materialById.get(current)?.name||'Kustom':'Tanpa material';
  const grid=$('#material-grid');
  grid.replaceChildren();
  const addOption=(id,name,color,pattern,image)=>{
    const option=document.createElement('button');
    option.type='button';
    option.className='material-option'+(id?current===id?' active':'':
      current===''?' active':'')+(id?'':' none');
    option.disabled=!canEditModel();
    option.title=name;
    option.dataset.name=name;
    option.setAttribute('aria-label',name);
    const swatch=document.createElement('span');swatch.className='material-swatch';
    if (color) swatch.style.setProperty('--swatch',color);
    if (pattern) swatch.dataset.pattern=pattern;
    if (image) {swatch.style.backgroundImage='url("'+image+'")';swatch.style.backgroundSize='cover';}
    option.append(swatch);
    option.onclick=()=>applyMaterial(id);
    grid.append(option);
  };
  addOption(null,'Tanpa material',null,'');
  for (const material of allMaterials())
    addOption(material.id,material.name,material.color,material.pattern,material.image);
  const upload=document.createElement('button');
  upload.type='button';upload.className='material-option upload';
  upload.textContent='＋';upload.title='Unggah material dari PC';
  upload.dataset.name='Unggah material';
  upload.setAttribute('aria-label','Unggah material dari PC');
  upload.disabled=!canEditModel();
  upload.onclick=()=>openMaterialUpload('inspector');
  grid.append(upload);
  const scale=targets[0].material_scale||
    materialById.get(targets[0].material)?.tileCm||30;
  const scaleInput=$('#material-scale');
  scaleInput.value=String(scale);
  scaleInput.disabled=!canEditModel();
}

function openMaterialUpload(source) {
  if (!canEditModel()) {showStatus('Akses ini tidak dapat mengubah model.');return;}
  const input=$('#material-upload');
  input.dataset.source=source;
  input.value='';
  input.click();
}

/** @param {File} file @param {string=} source */
async function importMaterialFile(file,source='') {
  if (!file || !file.type.startsWith('image/')) {
    showStatus('Pilih berkas gambar untuk material.');return;
  }
  if (file.size>8*1024*1024) {showStatus('Ukuran gambar maksimal 8 MB.');return;}
  const dataUrl=await new Promise((resolve,reject)=>{
    const reader=new FileReader();
    reader.onload=()=>resolve(String(reader.result||''));
    reader.onerror=()=>reject(reader.error);
    reader.readAsDataURL(file);
  });
  const image=await new Promise((resolve,reject)=>{
    const element=new Image();
    element.onload=()=>resolve(element);
    element.onerror=reject;
    element.src=dataUrl;
  });
  const max=384;
  const ratio=Math.min(1,max/Math.max(image.width,image.height));
  const canvas=document.createElement('canvas');
  canvas.width=Math.max(1,Math.round(image.width*ratio));
  canvas.height=Math.max(1,Math.round(image.height*ratio));
  const surface=canvas.getContext('2d',{willReadFrequently:true});
  surface.drawImage(image,0,0,canvas.width,canvas.height);
  const pixels=surface.getImageData(0,0,canvas.width,canvas.height).data;
  let red=0,green=0,blue=0;
  for (let i=0;i<pixels.length;i+=4) {red+=pixels[i];green+=pixels[i+1];blue+=pixels[i+2];}
  const count=pixels.length/4;
  const color='#'+[red,green,blue].map(value=>Math.round(value/count).toString(16)
    .padStart(2,'0')).join('');
  const name=file.name.replace(/\.[^.]+$/,'').slice(0,32)||'Material kustom';
  if (customMaterials.length>=12) {showStatus('Maksimal 12 material kustom.');return;}
  const material={id:/** @type {QreaseeMaterial} */ ('custom:'+identity()),
    name,color,pattern:'image',tileCm:bucketScale,
    image:canvas.toDataURL('image/jpeg',.82),custom:true};
  registerCustomMaterial(material,true);
  bucketMaterial=material.id;
  localStorage.setItem('qreasee-bucket-material',bucketMaterial);
  renderMaterials();
  renderBucketPalette();
  showStatus('Material "'+name+'" diunggah. Klik objek untuk menerapkannya.');
}

$('#material-upload').onchange=event=>{
  const input=/** @type {HTMLInputElement} */ (event.target);
  const file=input.files?.[0];
  const source=input.dataset.source||'';
  if (file) importMaterialFile(file,source).catch(()=>showStatus('Gambar material gagal dibaca.'));
};
$('#material-scale').onchange=async event=>{
  if (!canEditModel()) return;
  const targets=materialTargets();
  if (!targets.length) return;
  const value=safeScale(/** @type {HTMLInputElement} */ (event.target).value);
  /** @type {HTMLInputElement} */ (event.target).value=String(value);
  const after=targets.map(object=>({...object,material_scale:value}));
  const saved=await batch(targets,after,[...state.selected]);
  if (saved) {
    bucketScale=value;
    localStorage.setItem('qreasee-bucket-scale',String(value));
    showStatus('Skala pola '+value+' cm.');
  }
};
$('#bucket-scale').onchange=event=>{
  bucketScale=safeScale(/** @type {HTMLInputElement} */ (event.target).value);
  /** @type {HTMLInputElement} */ (event.target).value=String(bucketScale);
  localStorage.setItem('qreasee-bucket-scale',String(bucketScale));
  showStatus('Skala kuas '+bucketScale+' cm.');
};

/** @param {QreaseeMaterial|null} id */
async function applyMaterial(id) {
  if (!canEditModel()) {showStatus('Akses ini tidak dapat mengubah model.');return;}
  const targets=materialTargets();
  if (!targets.length) return;
  const preset=id?materialById.get(id):null;
  if (id && !preset) return;
  const after=targets.map(object=>({...object,
    material:preset?preset.id:null,
    material_scale:preset?preset.tileCm:null,
    ...(preset?{color:preset.color}:{})}));
  const saved=await batch(targets,after,[...state.selected]);
  if (saved) {
    bucketMaterial=preset?preset.id:null;
    if (preset) bucketScale=preset.tileCm;
    localStorage.setItem('qreasee-bucket-material',bucketMaterial||'');
    localStorage.setItem('qreasee-bucket-scale',String(bucketScale));
    renderBucketPalette();
    showStatus(preset?'Material '+preset.name+' diterapkan.':'Material dihapus.');
  }
}

function renderBucketPalette() {
  const palette=$('#bucket-palette');
  const visible=state.tool==='bucket'&&canEditModel()&&!state.layout&&Boolean(state.doc);
  palette.hidden=!visible;
  if (!visible) return;
  const current=materialById.get(bucketMaterial);
  $('#bucket-current').textContent=current?.name||'Tanpa material';
  const grid=$('#bucket-grid');
  grid.replaceChildren();
  const add=(id,name,color,pattern,image,tileCm)=>{
    const option=document.createElement('button');
    option.type='button';
    option.className='bucket-option'+((id?bucketMaterial===id:bucketMaterial===null)?' active':'')+
      (id?'':' none');
    option.title=name;
    option.dataset.name=name;
    option.setAttribute('aria-label',name);
    const swatch=document.createElement('span');swatch.className='material-swatch';
    if (color) swatch.style.setProperty('--swatch',color);
    if (pattern) swatch.dataset.pattern=pattern;
    if (image) {swatch.style.backgroundImage='url("'+image+'")';swatch.style.backgroundSize='cover';}
    option.append(swatch);
    option.onclick=()=>{
      bucketMaterial=id;
      if (tileCm) bucketScale=tileCm;
      localStorage.setItem('qreasee-bucket-material',id||'');
      localStorage.setItem('qreasee-bucket-scale',String(bucketScale));
      renderBucketPalette();
      showStatus((name)+' dipilih. Klik objek atau Group untuk menerapkannya.');
    };
    grid.append(option);
  };
  for (const material of allMaterials())
    add(material.id,material.name,material.color,material.pattern,material.image,material.tileCm);
  add(null,'Tanpa material',null,'');
  const upload=document.createElement('button');
  upload.type='button';upload.className='bucket-option upload';
  upload.textContent='＋';upload.title='Unggah material dari PC';
  upload.dataset.name='Unggah material';
  upload.setAttribute('aria-label','Unggah material dari PC');
  upload.onclick=()=>openMaterialUpload('bucket');
  grid.append(upload);
  const scaleInput=$('#bucket-scale');
  scaleInput.value=String(bucketScale);
}

/** @param {string} target @param {QreaseeMaterial|null} id */
async function paintMaterial(target,id) {
  if (!canEditModel()) {showStatus('Akses ini tidak dapat mengubah model.');return;}
  const targets=commentTargetObjects(target).filter(object=>object.shape!=='line');
  if (!targets.length) {showStatus('Tidak ada permukaan untuk dicat.');return;}
  const preset=id?materialById.get(id):null;
  if (id && !preset) return;
  const after=targets.map(object=>({...object,
    material:preset?preset.id:null,
    material_scale:preset?bucketScale:null,
    ...(preset?{color:preset.color}:{})}));
  const saved=await batch(targets,after,[...state.selected]);
  if (saved) showStatus(preset
    ? 'Material '+preset.name+' diterapkan ke '+commentTargetName(target)+'.'
    : 'Material dihapus dari '+commentTargetName(target)+'.');
}

const sectionPlanes = () => state.doc?.sections || [];
const activeSections = () => {
  const sections=sectionPlanes().filter(section=>section.enabled!==false&&!section.hidden);
  const preview=state.sectionPending;
  if (preview?.existing) {
    return sections.map(section=>section.id===preview.existing.id
      ? {...section,origin:preview.origin}:section);
  }
  if (preview) {
    return [...sections,{id:'__preview__',name:'Pratinjau',symbol:'§',
      origin:preview.origin,normal:preview.normal,enabled:true,hidden:false}];
  }
  if (sectionDragPreview) {
    return sections.map(section=>section.id===sectionDragPreview.section.id
      ? {...section,origin:sectionDragPreview.origin}:section);
  }
  return sections;
};
function setHiddenMode(open) {
  state.showHidden=open;
  const button=$('#hidden-toggle');
  button.setAttribute('aria-pressed',String(open));
  button.classList.toggle('active',open);
  if (!open) {
    const visible=new Set(objects().filter(object=>!object.hidden).map(targetId));
    state.selected=new Set([...state.selected].filter(id=>visible.has(id)));
  }
  renderSections();
  showStatus(open?'Mode geometri tersembunyi aktif. Objek tersembunyi disorot oranye.':
    'Mode geometri tersembunyi nonaktif.');
  redraw();
}

/** @type {string|null} */
let activeSectionId = null;
/** @type {{section:QreaseeSectionPlane,origin:QreaseePoint}|null} */
let sectionDragPreview = null;
/** @type {{id:string,quad:number[][],section:QreaseeSectionPlane}[]} */
let sectionQuads = [];

/** @param {QreaseePoint} value @returns {QreaseePoint} */
function normalizePoint(value) {
  const length=Math.hypot(value[0],value[1],value[2]);
  if (length<1e-9) return [0,0,1];
  return [value[0]/length,value[1]/length,value[2]/length];
}

/** @param {QreaseePoint[]} world @returns {QreaseePoint|null} */
function faceNormal(world) {
  if (world.length<3) return null;
  const origin=world[0];
  for (let i=1;i<world.length-1;i++) {
    const a=world[i].map((value,index)=>value-origin[index]);
    const b=world[i+1].map((value,index)=>value-origin[index]);
    const normal=[a[1]*b[2]-a[2]*b[1],a[2]*b[0]-a[0]*b[2],a[0]*b[1]-a[1]*b[0]];
    if (Math.hypot(...normal)>1e-8) return normalizePoint(/** @type {QreaseePoint} */ (normal));
  }
  return null;
}

/** @param {QreaseeSectionPlane} section */
function sectionBasis(section) {
  const normal=normalizePoint(section.normal);
  const helper=Math.abs(normal[0])<.8?[1,0,0]:[0,1,0];
  const u=normalizePoint(/** @type {QreaseePoint} */ ([
    normal[1]*helper[2]-normal[2]*helper[1],
    normal[2]*helper[0]-normal[0]*helper[2],
    normal[0]*helper[1]-normal[1]*helper[0]
  ]));
  const v=normalizePoint(/** @type {QreaseePoint} */ ([
    normal[1]*u[2]-normal[2]*u[1],
    normal[2]*u[0]-normal[0]*u[2],
    normal[0]*u[1]-normal[1]*u[0]
  ]));
  return {normal,u,v};
}

/** @param {QreaseeSectionPlane} section */
function sectionQuad(section) {
  const {normal,u,v}=sectionBasis(section);
  let min=[Infinity,Infinity,Infinity],max=[-Infinity,-Infinity,-Infinity];
  for (const mesh of state.meshes) for (const vertex of mesh.vertices) {
    for (let i=0;i<3;i++) {min[i]=Math.min(min[i],vertex[i]);max[i]=Math.max(max[i],vertex[i]);}
  }
  if (!Number.isFinite(min[0])) {min=[-3,-3,-3];max=[3,3,3];}
  const center=min.map((value,index)=>(value+max[index])/2);
  const delta=center.map((value,index)=>value-section.origin[index]);
  const along=delta[0]*normal[0]+delta[1]*normal[1]+delta[2]*normal[2];
  const planeCenter=center.map((value,index)=>value-normal[index]*along);
  let halfU=1,halfV=1;
  for (const mesh of state.meshes) for (const vertex of mesh.vertices) {
    const dx=vertex[0]-planeCenter[0],dy=vertex[1]-planeCenter[1],dz=vertex[2]-planeCenter[2];
    halfU=Math.max(halfU,Math.abs(dx*u[0]+dy*u[1]+dz*u[2]));
    halfV=Math.max(halfV,Math.abs(dx*v[0]+dy*v[1]+dz*v[2]));
  }
  halfU=clamp(halfU+1,2,80);
  halfV=clamp(halfV+1,2,80);
  return [[-1,-1],[1,-1],[1,1],[-1,1]].map(([a,b])=>
    /** @type {QreaseePoint} */ ([
      planeCenter[0]+u[0]*a*halfU+v[0]*b*halfV,
      planeCenter[1]+u[1]*a*halfU+v[1]*b*halfV,
      planeCenter[2]+u[2]*a*halfU+v[2]*b*halfV
    ]));
}

/** @param {QreaseePoint[]} world @param {QreaseeSectionPlane} section @returns {QreaseePoint[]} */
function clipSectionPolygon(world,section) {
  const {normal}=sectionBasis(section);
  const origin=section.origin;
  const values=world.map(point=>normal[0]*(point[0]-origin[0])+
    normal[1]*(point[1]-origin[1])+normal[2]*(point[2]-origin[2]));
  const epsilon=1e-6;
  if (values.every(value=>value<=epsilon)) return world;
  const output=[];
  const crossing=(a,b,da,db)=>a.map((value,index)=>
    value+(b[index]-value)*(0-da)/(db-da));
  for (let i=0;i<world.length;i++) {
    const previous=(i+world.length-1)%world.length;
    const inside=values[i]<=epsilon,wasInside=values[previous]<=epsilon;
    if (inside!==wasInside) output.push(crossing(world[previous],world[i],values[previous],values[i]));
    if (inside) output.push(world[i]);
  }
  return output;
}

/** @param {QreaseePoint2} point @param {QreaseePoint} origin @param {QreaseePoint} axis @returns {number|null} */
function sectionAxisDistance(point,origin,axis) {
  const base=stagePoint(origin);
  const tip=stagePoint([origin[0]+axis[0],origin[1]+axis[1],origin[2]+axis[2]]);
  const dx=tip[0]-base[0],dy=tip[1]-base[1],length2=dx*dx+dy*dy;
  if (!Number.isFinite(base[0])||length2<16) return null;
  const target=((point[0]-base[0])*dx+(point[1]-base[1])*dy)/length2;
  const measure=value=>{
    const projected=stagePoint([origin[0]+axis[0]*value,origin[1]+axis[1]*value,
      origin[2]+axis[2]*value]);
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
  return clamp(distance,-20000,20000);
}

function renderSections() {
  const list=$('#section-list');
  if (!list) return;
  list.replaceChildren();
  const sections=sectionPlanes();
  $('#sections-toggle').title=sections.length?'Bidang potong ('+sections.length+')':'Bidang potong';
  if (!sections.length) {
    const empty=document.createElement('div');
    empty.className='section-empty';
    empty.textContent='Belum ada bidang potong. Klik Bidang baru lalu klik sebuah bidang pada model.';
    list.append(empty);
    return;
  }
  const editable=canEditModel();
  for (const section of sections) {
    const enabled=section.enabled!==false;
    const hidden=Boolean(section.hidden);
    const row=document.createElement('div');
    row.className='section-row'+(enabled?' enabled':'')+(hidden?' hidden':'')+
      (activeSectionId===section.id?' active':'');
    row.onclick=()=>{activeSectionId=section.id;renderSections();redraw();};
    const head=document.createElement('div');head.className='section-row-head';
    const symbol=document.createElement('span');symbol.className='section-symbol';
    symbol.textContent=section.symbol || '§';
    const name=document.createElement('div');name.className='section-name';
    const title=document.createElement('strong');title.textContent=section.name;
    const detail=document.createElement('small');
    detail.textContent='Normal '+section.normal.map(value=>round(value)).join(', ');
    name.append(title,detail);
    const state=document.createElement('span');state.className='section-state';
    state.textContent=hidden?'Tersembunyi':enabled?'Aktif':'Nonaktif';
    head.append(symbol,name,state);
    const actions=document.createElement('div');actions.className='section-row-actions';
    const toggle=document.createElement('button');toggle.type='button';
    toggle.className='section-icon-action'+(enabled?' active':'');
    toggle.title=enabled?'Nonaktifkan bidang':'Aktifkan bidang';
    toggle.setAttribute('aria-label',toggle.title);
    toggle.disabled=!editable;
    icon(toggle,'bulb');
    toggle.onclick=event=>{event.stopPropagation();updateSection(section,{enabled:!enabled});};
    const hide=document.createElement('button');hide.type='button';
    hide.className='section-icon-action'+(hidden?' active':'');
    hide.title=hidden?'Tampilkan bidang':'Sembunyikan bidang';
    hide.setAttribute('aria-label',hide.title);
    hide.disabled=!editable;
    icon(hide,'hidden');
    hide.onclick=event=>{event.stopPropagation();updateSection(section,{hidden:!hidden});};
    const flip=document.createElement('button');flip.type='button';
    flip.className='section-icon-action';
    flip.title='Balik arah potong';
    flip.setAttribute('aria-label','Balik arah potong');
    flip.disabled=!editable;
    icon(flip,'reverse');
    flip.onclick=event=>{event.stopPropagation();updateSection(section,
      {normal:[-section.normal[0],-section.normal[1],-section.normal[2]]});};
    actions.append(toggle,hide,flip);
    row.append(head,actions);
    list.append(row);
  }
}

function toggleSections(force) {
  const panel=$('#sections-panel');
  const open=force===undefined?panel.hidden:force;
  panel.hidden=!open;
  $('#sections-toggle').setAttribute('aria-expanded',String(open));
  if (open) {
    $('#comments-panel').hidden=true;
    $('#comments-toggle').setAttribute('aria-expanded','false');
    renderSections();
  }
}

/** @param {QreaseeSectionPlane} section @param {Partial<QreaseeSectionPlane>} changes */
async function updateSection(section,changes) {
  if (!canEditModel()) {showStatus('Akses ini tidak dapat mengubah model.');return false;}
  const after={...section,...changes};
  const saved=await commit({type:'section',before:section,after});
  if (saved) {
    activeSectionId=after.id;
    showStatus('Bidang potong diperbarui.');
  }
  return saved;
}

/** @param {QreaseeSectionPlane} section */
async function removeSection(section) {
  if (!canEditModel()) {showStatus('Akses ini tidak dapat mengubah model.');return;}
  const saved=await commit({type:'section',before:section,after:null});
  if (saved) {
    if (activeSectionId===section.id) activeSectionId=null;
    showStatus('Bidang potong dihapus.');
  }
}

/** @param {QreaseeSectionPlane} section */
function beginSectionMove(section) {
  if (!canEditModel()) {showStatus('Akses ini tidak dapat mengubah model.');return;}
  setTool('section');
  activeSectionId=section.id;
  const normal=normalizePoint(section.normal);
  state.sectionPending={base:section.origin,origin:section.origin,normal,offset:0,existing:section};
  state.inference=null;
  renderSections();
  showStatus('Geser sepanjang normal bidang, lalu klik kedua untuk menetapkan.');
  redraw();
}

/** @param {QreaseePoint2} start */
function placeSectionAt(start) {
  if (!canEditModel()) {showStatus('Akses ini tidak dapat mengubah model.');return;}
  if (state.sectionPending) {
    const pending=state.sectionPending;
    const existing=pending.existing;
    const index=sectionPlanes().length+1;
    const after=existing
      ? {...existing,origin:roundPoint(pending.origin)}
      : {id:identity(),name:'Bidang potong '+index,symbol:String(index),
        origin:roundPoint(pending.origin),normal:roundPoint(pending.normal),enabled:true};
    const before=existing||null;
    state.sectionPending=null;
    state.inference=null;
    commit({type:'section',before,after}).then(saved=>{
      if (!saved) return;
      activeSectionId=after.id;
      showStatus('Bidang potong '+after.symbol+' dibuat.');
      toggleSections(true);
      renderSections();
    });
    redraw();
    return;
  }
  const face=pickFace(start,false);
  const normal=face?faceNormal(face.world):null;
  if (!face||!normal||face.world.length<3) {
    showStatus('Klik permukaan bidang untuk menempatkan bidang potong.');return;
  }
  const origin=face.world.reduce((sum,point)=>sum.map((value,i)=>value+point[i]/face.world.length),
    [0,0,0]);
  state.sectionPending={base:origin,origin,normal,offset:0,existing:null};
  state.inference=null;
  activeSectionId=null;
  showStatus('Bidang potong siap. Geser sepanjang normal, lalu klik kedua.');
  renderSections();
  redraw();
}

/** @param {QreaseePoint} worldOrigin @param {QreaseePoint} normal @param {string} color @param {number} alpha @param {number=} shaft @param {number=} offset */
function drawSectionNormalArrow(worldOrigin,normal,color,alpha,shaft=30,offset=6) {
  const unit=normalizePoint(normal);
  const base=stagePoint(worldOrigin);
  const tip=stagePoint([worldOrigin[0]-unit[0]*.8,worldOrigin[1]-unit[1]*.8,
    worldOrigin[2]-unit[2]*.8]);
  if (!Number.isFinite(base[0])||!Number.isFinite(tip[0])) return;
  const direction=[tip[0]-base[0],tip[1]-base[1]];
  const length=Math.hypot(...direction);
  if (length<2.5) return;
  const dx=direction[0]/length,dy=direction[1]/length;
  const start=[base[0]+dx*offset,base[1]+dy*offset];
  const end=[start[0]+dx*shaft,start[1]+dy*shaft];
  ctx.save();
  ctx.globalAlpha=alpha;
  ctx.strokeStyle=color;ctx.fillStyle=color;ctx.lineWidth=2;ctx.lineCap='round';
  ctx.beginPath();ctx.moveTo(start[0],start[1]);ctx.lineTo(end[0],end[1]);ctx.stroke();
  const side=[-dy,dx];
  ctx.beginPath();
  ctx.moveTo(end[0]+dx*7,end[1]+dy*7);
  ctx.lineTo(end[0]+side[0]*4.5,end[1]+side[1]*4.5);
  ctx.lineTo(end[0]-side[0]*4.5,end[1]-side[1]*4.5);
  ctx.closePath();ctx.fill();
  ctx.restore();
}

function drawSectionPlanes() {
  const hover=state.sectionHover&&!state.sectionPending
    ? {id:'__hover__',name:'Pratinjau',symbol:'§',origin:state.sectionHover.origin,
      normal:state.sectionHover.normal,enabled:true,hidden:false}
    : null;
  const list=[...activeSections(),
    ...(state.showHidden?sectionPlanes().filter(section=>section.hidden):[]),
    ...(hover?[hover]:[])];
  sectionQuads=[];
  if (!list.length) return;
  ctx.save();
  ctx.setLineDash([7,5]);
  ctx.lineWidth=1.5;
  for (const section of list) {
    const ghost=section.id==='__hover__';
    if (ghost) {ctx.save();ctx.globalAlpha=.72;}
    const worldQuad=sectionQuad(section);
    const quad=worldQuad.map(stagePoint);
    if (quad.some(point=>!Number.isFinite(point[0]))) {
      if (ghost) ctx.restore();
      continue;
    }
    ctx.strokeStyle=section.id==='__preview__'||ghost?'#e8a24d':
      section.hidden?'#e8932a':
      activeSectionId===section.id?'#e27f22':'#c98a42';
    polygon(quad);
    ctx.stroke();
    ctx.setLineDash([]);
    for (const point of quad) {
      ctx.beginPath();ctx.arc(point[0],point[1],ghost?4:5,0,Math.PI*2);
      ctx.fillStyle='#fffaf2';ctx.fill();
      ctx.strokeStyle='#d6842a';ctx.lineWidth=1.7;ctx.stroke();
    }
    const centerWorld=/** @type {QreaseePoint} */ (worldQuad.reduce((sum,corner)=>
      sum.map((value,index)=>value+corner[index]/worldQuad.length),[0,0,0]));
    const centerPoint=stagePoint(centerWorld);
    if (Number.isFinite(centerPoint[0])) {
      ctx.beginPath();ctx.arc(centerPoint[0],centerPoint[1],ghost?5:7,0,Math.PI*2);
      ctx.fillStyle='#fffaf2';ctx.fill();
      ctx.strokeStyle='#d6842a';ctx.lineWidth=1.7;ctx.stroke();
      ctx.beginPath();ctx.arc(centerPoint[0],centerPoint[1],2,0,Math.PI*2);
      ctx.fillStyle='#d6842a';ctx.fill();
    }
    const alpha=ghost?.95:section.id==='__preview__'?.9:activeSectionId===section.id?1:.62;
    for (const corner of worldQuad)
      drawSectionNormalArrow(corner,section.normal,'#e8932a',alpha,ghost?32:28,6);
    if (section.id!=='__preview__'&&!ghost)
      sectionQuads.push({id:section.id,quad:quad.map(point=>[point[0],point[1]]),section});
    if (ghost) ctx.restore();
    ctx.setLineDash([7,5]);
  }
  ctx.restore();
}

/** @param {QreaseePoint2} point @param {string|null=} interiorId @returns {QreaseeSectionPlane|null} */
function sectionPlaneAt(point,interiorId=null) {
  for (const entry of sectionQuads) {
    const {quad}=entry;
    for (const corner of quad) {
      if (Math.hypot(point[0]-corner[0],point[1]-corner[1])<=38) return entry.section;
    }
    const center=quad.reduce((sum,corner)=>[sum[0]+corner[0]/quad.length,
      sum[1]+corner[1]/quad.length],[0,0]);
    if (Math.hypot(point[0]-center[0],point[1]-center[1])<=18) return entry.section;
    if (pointToPolygonEdge(point,quad)<=15) return entry.section;
    if (interiorId===entry.id&&contains(point,quad)) return entry.section;
  }
  return null;
}

/** @param {number[][]} segments @returns {QreaseePoint[][]} */
function chainSectionSegments(segments) {
  const key=point=>point.map(value=>Math.round(value*10000)).join(',');
  const map=new Map();
  segments.forEach((segment,index)=>{
    for (const point of segment) {
      const id=key(point);
      if (!map.has(id)) map.set(id,[]);
      map.get(id).push(index);
    }
  });
  const used=new Set();
  const loops=[];
  for (let index=0;index<segments.length;index++) {
    if (used.has(index)) continue;
    const start=segments[index][0];
    const loop=[start];
    used.add(index);
    let current=segments[index][1];
    for (let guard=0;guard<segments.length+2;guard++) {
      loop.push(current);
      if (key(current)===key(start)) break;
      const next=(map.get(key(current))||[]).find(candidate=>!used.has(candidate));
      if (next===undefined) break;
      used.add(next);
      const segment=segments[next];
      current=key(segment[0])===key(current)?segment[1]:segment[0];
    }
    if (loop.length>3 && key(loop[0])===key(loop[loop.length-1])) {
      loop.pop();
      loops.push(loop);
    }
  }
  return loops;
}

/** @param {QreaseeMesh[]} meshes @param {QreaseeObject[]} objects @param {(point: QreaseePoint)=>number[]} projection @param {QreaseeSectionPlane[]} sections */
function sectionCaps(meshes,objects,projection,sections) {
  if (!sections.length) return [];
  const groups=new Map();
  objects.forEach((object,index)=>{
    if (object.shape==='line' || (object.hidden && !state.showHidden)) return;
    const mesh=meshes[index];
    if (!mesh?.faces?.length) return;
    const id=object.solid_id||object.id;
    if (!groups.has(id)) groups.set(id,{object,meshes:[]});
    groups.get(id).meshes.push(mesh);
  });
  const faces=[];
  for (const [groupId,group] of groups) {
    for (const section of sections) {
      const segments=[];
      for (const mesh of group.meshes) {
        for (const face of mesh.faces) {
          const world=face.map(index=>mesh.vertices[index]);
          if (world.length<3) continue;
          const normal=normalizePoint(section.normal);
          const values=world.map(point=>normal[0]*(point[0]-section.origin[0])+
            normal[1]*(point[1]-section.origin[1])+normal[2]*(point[2]-section.origin[2]));
          if (values.every(value=>Math.abs(value)<1e-6)) continue;
          const points=[];
          for (let i=0;i<world.length;i++) {
            const next=(i+1)%world.length;
            const a=world[i],b=world[next],da=values[i],db=values[next];
            if ((da>1e-6&&db<-1e-6)||(da<-1e-6&&db>1e-6)) {
              points.push(a.map((value,axis)=>value+(b[axis]-value)*(-da)/(db-da)));
            } else {
              if (Math.abs(da)<=1e-6) points.push(a);
              if (Math.abs(db)<=1e-6) points.push(b);
            }
          }
          const unique=[];
          for (const point of points) {
            if (!unique.some(item=>Math.hypot(item[0]-point[0],item[1]-point[1],
              item[2]-point[2])<1e-5)) unique.push(point);
          }
          if (unique.length>=2) {
            segments.push([unique[0],unique[1]]);
          }
        }
      }
      for (const loop of chainSectionSegments(segments)) {
        let polygonWorld=loop;
        for (const other of sections) {
          if (other.id===section.id) continue;
          polygonWorld=clipSectionPolygon(polygonWorld,other);
          if (polygonWorld.length<3) break;
        }
        if (polygonWorld.length<3) continue;
        const points=polygonWorld.map(projection);
        if (points.some(point=>!Number.isFinite(point[0]))) continue;
        const depth=points.reduce((sum,point)=>sum+point[2],0)/points.length+.05;
        faces.push({object:group.object,points,world:polygonWorld,top:false,tone:.9,
          cut:true,section:true,smooth:false,quiet:false,depth,
          key:'section:'+section.id+':'+groupId});
      }
    }
  }
  return faces;
}

const comments = () => state.doc?.comments || [];
/** @type {{target:string,x:number,y:number,width:number,height:number,count:number}[]} */
let commentPins = [];
/** @type {string|null} */
let activeCommentTarget = null;
/** @type {string|null} */
let commentComposerTarget = null;
let commentComposerPoint = null;
/** @type {QreaseeComment|null} */
let commentComposerReplyTo = null;
/** @type {Set<string>} */
const commentDraftMentions = new Set();
/** @type {string|null} */
let objectMenuTarget = null;
let objectMenuPoint = null;
/** @type {QreaseeSectionPlane|null} */
let objectMenuSection = null;
const SECTION_MENU_IDS=['object-menu-section-move','object-menu-section-flip',
  'object-menu-section-hide','object-menu-section-delete'];

const commentInitials = name => (name || 'Tamu').split(/\s+/).slice(0,2)
  .map(word => [...word][0] || '').join('').toUpperCase();
const commentTime = value => new Date(value).toLocaleString('id-ID',
  {day:'numeric',month:'short',hour:'2-digit',minute:'2-digit'});

/** @param {string} id @returns {QreaseeObject[]} */
