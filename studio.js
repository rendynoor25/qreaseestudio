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
  download:'<path d="M12 3v12m-5-5 5 5 5-5M4 16v4h16v-4"/>'
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
  movePending:null, rotatePending:null, offsetPending:null, offsetHover:null, measurePending:null, sectionPending:null, sectionHover:null, hits: [], hoverKey: null, epoch: 0, polling: false, peers:[], cursor:null, canManageShare:true, shareRole:'edit', showHidden:false
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
  selectedGridId=null;
  if (window.qreaseeAuth) {
    const session = await window.qreaseeAuth.ready;
    if (state.epoch !== epoch || !session) return;
    state.name = String(window.qreaseeAuth.displayName||'Tamu')
      .replace(/[\u0000-\u001f\u007f]/g,'').trim().slice(0,32) || 'Tamu';
  }
  state.busy = false;
  exitLayoutView();
  layoutSelected = null;
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
  const signature=peers.map(({id,name})=>id+name).sort().join('|');
  if (avatars.dataset.signature!==signature) {
    avatars.dataset.signature=signature;
    avatars.replaceChildren();
    renderAvatars(avatars,peers);
  }
  const others=peers.filter(peer=>peer.id!==state.client).sort((a,b)=>a.id.localeCompare(b.id));
  const cursorChanged=JSON.stringify(state.peers)!==JSON.stringify(others);
  state.peers=others;
  if ($('#share-dialog').open) renderShareDialog();
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
  if(selectedGridId&&!grids().some(grid=>grid.id===selectedGridId))selectedGridId=null;
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
function commentTargetObjects(id) {
  const group=members(id);
  return group.length?group:objects().filter(object=>object.id===id);
}
/** @param {string} id @returns {string} */
function commentTargetName(id) {
  const group=members(id);
  if (group.length) return group[0].container?.name || 'Grup';
  return objects().find(object=>object.id===id)?.name || 'Objek';
}
/** @param {string} id */
function commentTargetExists(id) {
  return commentTargetObjects(id).length>0;
}

function updateCommentBadge() {
  const button=$('#comments-toggle');
  const all=comments();
  const count=all.filter(comment=>!comment.parent && !comment.resolved).length;
  button.dataset.count=count?String(count):'';
  button.title=count?'Komentar ('+count+' belum selesai)':'Komentar';
}

/** @param {HTMLElement} element @param {QreaseeComment} comment */
function renderCommentText(element,comment) {
  element.replaceChildren();
  const text=comment.text || '';
  const names=(comment.mentions || []).filter(Boolean).sort((a,b)=>b.length-a.length);
  let index=0;
  while (index<text.length) {
    const at=text.indexOf('@',index);
    if (at<0) {element.append(document.createTextNode(text.slice(index)));break;}
    if (at>index) element.append(document.createTextNode(text.slice(index,at)));
    let name=names.find(candidate=>text.startsWith(candidate,at+1));
    if (!name) {
      const token=/^@([^\s@]{1,32})/.exec(text.slice(at));
      if (!token) {element.append(document.createTextNode('@'));index=at+1;continue;}
      name=token[1];
    }
    const mention=document.createElement('span');
    mention.className='comment-mention';
    mention.textContent='@'+name;
    element.append(mention);
    index=at+1+name.length;
  }
  if (!text) element.textContent='';
}

function scrollToCommentTarget(target) {
  const cards=/** @type {HTMLElement[]} */ ([...document.querySelectorAll('#comment-list .comment-card')]);
  const card=cards.find(item=>item.dataset.target===target);
  card?.scrollIntoView({block:'nearest'});
}

function renderComments() {
  updateCommentBadge();
  const list=$('#comment-list');
  if (!list) return;
  list.replaceChildren();
  const all=comments();
  const items=all.filter(comment=>!comment.parent || !all.some(item=>item.id===comment.parent))
    .sort((a,b)=>Number(Boolean(a.resolved))-Number(Boolean(b.resolved)) ||
      b.created_at-a.created_at);
  if (!items.length) {
    const empty=document.createElement('div');
    empty.className='comment-empty';
    empty.textContent='Belum ada komentar. Klik kanan objek, Group, atau Component lalu pilih Komentar.';
    list.append(empty);
    return;
  }
  const buildCard=(comment,parent)=>{
    const card=document.createElement('article');
    card.className='comment-card'+(parent?' comment-reply':'')+
      (comment.resolved?' resolved':'')+
      (!parent && activeCommentTarget===comment.target?' active':'');
    card.dataset.target=comment.target;
    const head=document.createElement('div');head.className='comment-card-head';
    const avatar=document.createElement('span');avatar.className='comment-avatar';
    avatar.textContent=commentInitials(comment.author);
    const meta=document.createElement('div');meta.className='comment-meta';
    const author=document.createElement('strong');author.textContent=comment.author;
    const time=document.createElement('small');time.textContent=commentTime(comment.created_at);
    meta.append(author,time);
    head.append(avatar,meta);
    if (parent) {
      const tag=document.createElement('span');tag.className='comment-reply-tag';tag.textContent='Balasan';
      head.append(tag);
    } else {
      const target=document.createElement('button');target.type='button';target.className='comment-target';
      target.textContent=commentTargetName(comment.target);
      target.title='Pilih '+commentTargetName(comment.target);
      target.onclick=event=>{event.stopPropagation();focusCommentTarget(comment.target);};
      head.append(target);
    }
    const text=document.createElement('div');text.className='comment-text';
    renderCommentText(text,comment);
    card.append(head,text);
    if (comment.resolved) {
      const done=document.createElement('span');done.className='comment-resolved-tag';
      done.textContent='Selesai';
      card.append(done);
    }
    const foot=document.createElement('div');foot.className='comment-card-foot';
    if (!parent) {
      const reply=document.createElement('button');reply.type='button';reply.className='comment-action';
      reply.textContent='Balas';
      reply.disabled=!canComment();
      reply.onclick=event=>{event.stopPropagation();
        openCommentComposer(comment.target,event.clientX,event.clientY,comment);};
      const resolve=document.createElement('button');resolve.type='button';resolve.className='comment-action';
      resolve.textContent=comment.resolved?'Buka lagi':'Selesaikan';
      resolve.disabled=!canComment();
      resolve.onclick=event=>{event.stopPropagation();toggleCommentResolved(comment);};
      foot.append(reply,resolve);
    }
    const remove=document.createElement('button');remove.type='button';remove.className='comment-delete';
    remove.textContent='Hapus';
    remove.disabled=!canComment();
    remove.onclick=event=>{event.stopPropagation();deleteComment(comment);};
    foot.append(remove);
    card.append(foot);
    card.onclick=()=>focusCommentTarget(comment.target);
    return card;
  };
  for (const comment of items) {
    const card=buildCard(comment,false);
    const replies=all.filter(item=>item.parent===comment.id)
      .sort((a,b)=>a.created_at-b.created_at);
    if (replies.length) {
      const thread=document.createElement('div');thread.className='comment-replies';
      for (const reply of replies) thread.append(buildCard(reply,true));
      card.append(thread);
    }
    list.append(card);
  }
  if (activeCommentTarget) scrollToCommentTarget(activeCommentTarget);
}

/** @param {string} target */
function focusCommentTarget(target) {
  if (!commentTargetExists(target)) return;
  activeCommentTarget=target;
  renderComments();
  select(target);
  toggleComments(true);
  scrollToCommentTarget(target);
}

/** @param {boolean=} force */
function toggleComments(force) {
  const panel=$('#comments-panel');
  const open=force===undefined?panel.hidden:force;
  panel.hidden=!open;
  $('#comments-toggle').setAttribute('aria-expanded',String(open));
  if (open) {
    $('#sections-panel').hidden=true;
    $('#sections-toggle').setAttribute('aria-expanded','false');
    renderComments();
  }
}

/** @param {number} clientX @param {number} clientY */
function positionCommentComposer(clientX,clientY) {
  const stage=$('#model-stage');
  const composer=$('#comment-composer');
  const stageBox=stage.getBoundingClientRect();
  const box=composer.getBoundingClientRect();
  let left=clientX-stageBox.left-box.width-18;
  if (left<12 || left+box.width>stageBox.width-12)
    left=clientX-stageBox.left+18;
  left=clamp(left,8,Math.max(8,stageBox.width-box.width-8));
  const top=clamp(clientY-stageBox.top-18,58,Math.max(58,stageBox.height-box.height-12));
  composer.style.left=left+'px';
  composer.style.top=top+'px';
}

/** @param {string} target @param {number=} clientX @param {number=} clientY @param {QreaseeComment=} replyTo */
function openCommentComposer(target,clientX,clientY,replyTo) {
  if (!canComment()) {showStatus('Akses ini hanya dapat melihat proyek.');return;}
  if (!commentTargetExists(target)) {showStatus('Objek target sudah tidak ada.');return;}
  commentComposerTarget=target;
  commentComposerReplyTo=replyTo || null;
  commentComposerPoint={x:clientX??canvas.getBoundingClientRect().left+80,
    y:clientY??canvas.getBoundingClientRect().top+120};
  activeCommentTarget=target;
  commentDraftMentions.clear();
  $('#comment-text').value='';
  $('#comment-compose-status').textContent='';
  $('#comment-composer-title').textContent=commentComposerReplyTo?'Balas komentar':'Tambah komentar';
  $('#comment-target-name').textContent=commentComposerReplyTo
    ? 'Untuk '+commentTargetName(target)+' · balasan untuk '+commentComposerReplyTo.author
    : commentTargetName(target);
  $('#comment-mentions').hidden=true;
  $('#comment-mentions').replaceChildren();
  const composer=$('#comment-composer');
  composer.hidden=false;
  positionCommentComposer(commentComposerPoint.x,commentComposerPoint.y);
  select(target);
  toggleComments(true);
  renderComments();
  $('#comment-text').focus({preventScroll:true});
}

function closeCommentComposer() {
  $('#comment-composer').hidden=true;
  $('#comment-mentions').hidden=true;
  $('#comment-text').value='';
  $('#comment-compose-status').textContent='';
  commentComposerTarget=null;
  commentComposerReplyTo=null;
  commentDraftMentions.clear();
}

/** @returns {{start:number,query:string}|null} */
function commentMentionMatch() {
  const input=$('#comment-text');
  const caret=input.selectionStart??input.value.length;
  const before=input.value.slice(0,caret);
  const match=/(?:^|\s)@([^\s@]*)$/.exec(before);
  if (!match) return null;
  return {start:caret-match[1].length-1,query:match[1]};
}

/** @returns {string[]} */
function commentMentionPeople() {
  const names=[...state.peers.map(peer=>peer.name),...comments().map(comment=>comment.author),state.name];
  return [...new Set(names.filter(name=>name && name!==state.name))].slice(0,12);
}

function renderCommentMentions() {
  const box=$('#comment-mentions');
  const match=commentMentionMatch();
  if (!match) {
    box.hidden=true;box.replaceChildren();
    if (commentComposerPoint) positionCommentComposer(commentComposerPoint.x,commentComposerPoint.y);
    return;
  }
  const query=match.query.toLowerCase();
  const people=commentMentionPeople().filter(name=>name.toLowerCase().includes(query));
  if (!people.length) {
    box.hidden=true;box.replaceChildren();
    if (commentComposerPoint) positionCommentComposer(commentComposerPoint.x,commentComposerPoint.y);
    return;
  }
  box.replaceChildren();
  box.hidden=false;
  for (const name of people) {
    const option=document.createElement('button');
    option.type='button';
    option.className='comment-mention-option';
    const avatar=document.createElement('span');avatar.className='comment-avatar';
    avatar.textContent=commentInitials(name);
    const label=document.createElement('span');label.textContent=name;
    option.append(avatar,label);
    option.onmousedown=event=>event.preventDefault();
    option.onclick=()=>insertCommentMention(name);
    box.append(option);
  }
  if (commentComposerPoint) positionCommentComposer(commentComposerPoint.x,commentComposerPoint.y);
}

/** @param {string} name */
function insertCommentMention(name) {
  const input=$('#comment-text');
  const caret=input.selectionStart??input.value.length;
  const before=input.value.slice(0,caret);
  const at=before.lastIndexOf('@');
  if (at<0) return;
  const after=input.value.slice(caret);
  input.value=before.slice(0,at)+'@'+name+' '+after;
  const position=at+name.length+2;
  input.setSelectionRange(position,position);
  commentDraftMentions.add(name);
  renderCommentMentions();
  input.focus({preventScroll:true});
}

async function submitComment() {
  if (!canComment()) {showStatus('Akses ini hanya dapat melihat proyek.');return;}
  const input=$('#comment-text');
  const text=input.value.trim();
  if (!text) {$('#comment-compose-status').textContent='Tulis komentar terlebih dahulu.';return;}
  if (!commentComposerTarget || !commentTargetExists(commentComposerTarget)) {
    $('#comment-compose-status').textContent='Objek target sudah tidak ada.';
    return;
  }
  const known=commentMentionPeople();
  const mentions=[...new Set([...commentDraftMentions,...known])]
    .filter(name=>text.includes('@'+name));
  const button=$('#comment-send');
  button.disabled=true;
  $('#comment-compose-status').textContent='Mengirim…';
  const saved=await commit({
    type:'comment',before:null,
    after:{id:identity(),target:commentComposerTarget,author:state.name,text:text.slice(0,1000),
      created_at:Date.now(),mentions,
      ...(commentComposerReplyTo?{parent:commentComposerReplyTo.id}:{})}
  });
  button.disabled=false;
  if (saved) {
    closeCommentComposer();
    showStatus('Komentar ditambahkan.');
  } else $('#comment-compose-status').textContent='Komentar gagal dikirim.';
}

/** @param {QreaseeComment} comment */
async function deleteComment(comment) {
  if (!canComment()) {showStatus('Akses ini hanya dapat melihat proyek.');return;}
  if (!window.confirm('Hapus komentar dari '+comment.author+'?')) return;
  const saved=await commit({type:'comment',before:comment,after:null});
  if (saved) showStatus('Komentar dihapus.');
}

/** @param {QreaseeComment} comment */
async function toggleCommentResolved(comment) {
  if (!canComment()) {showStatus('Akses ini hanya dapat melihat proyek.');return;}
  const resolved=!comment.resolved;
  const saved=await commit({type:'comment',before:comment,
    after:{...comment,resolved}});
  if (saved) showStatus(resolved?'Komentar ditandai selesai.':'Komentar dibuka lagi.');
}

/** @param {number} clientX @param {number} clientY */
function placeObjectMenu(clientX,clientY) {
  const menu=$('#object-menu');
  menu.hidden=false;
  const box=menu.getBoundingClientRect();
  menu.style.left=clamp(clientX,8,window.innerWidth-box.width-8)+'px';
  menu.style.top=clamp(clientY,8,window.innerHeight-box.height-8)+'px';
}

function showObjectMenu(target,clientX,clientY) {
  objectMenuTarget=target;
  objectMenuPoint={x:clientX,y:clientY};
  objectMenuSection=null;
  const group=members(target);
  const kind=group.length?(group[0].container?.definition?'Component':'Group'):'Objek';
  $('#object-menu-title').textContent=kind+' · '+commentTargetName(target);
  const commentButton=$('#object-menu-comment');
  commentButton.hidden=false;
  commentButton.disabled=!canComment();
  commentButton.title=canComment()?'Tambah komentar':'Akses ini hanya dapat melihat proyek.';
  for (const id of SECTION_MENU_IDS) $('#'+id).hidden=true;
  const hideButton=$('#object-menu-hide');
  const allHidden=commentTargetObjects(target).filter(object=>object.shape!=='line')
    .every(object=>object.hidden);
  hideButton.hidden=false;
  hideButton.textContent=allHidden?'Tampilkan objek':'Sembunyikan objek';
  hideButton.disabled=!canEditModel();
  placeObjectMenu(clientX,clientY);
}

function showSectionMenu(section,clientX,clientY) {
  objectMenuTarget=null;
  objectMenuPoint=null;
  objectMenuSection=section;
  activeSectionId=section.id;
  $('#object-menu-title').textContent='Bidang potong '+(section.symbol||'');
  $('#object-menu-comment').hidden=true;
  $('#object-menu-hide').hidden=true;
  for (const id of SECTION_MENU_IDS) {
    const button=$('#'+id);
    button.hidden=false;
    button.disabled=!canEditModel();
  }
  $('#object-menu-section-hide').textContent=section.hidden?'Tampilkan bidang':'Sembunyikan bidang';
  renderSections();
  placeObjectMenu(clientX,clientY);
  redraw();
}

function hideObjectMenu() {
  $('#object-menu').hidden=true;
  $('#object-menu-comment').hidden=false;
  for (const id of SECTION_MENU_IDS) $('#'+id).hidden=true;
  $('#object-menu-hide').hidden=true;
  objectMenuTarget=null;
  objectMenuPoint=null;
  objectMenuSection=null;
}

/** @param {string} target */
function commentTargetBox(target) {
  let left=Infinity,top=Infinity,right=-Infinity,bottom=-Infinity;
  for (const face of state.hits) {
    if (targetId(face.object)!==target) continue;
    for (const [x,y] of face.points) {
      if (!Number.isFinite(x)||!Number.isFinite(y)) continue;
      left=Math.min(left,x);right=Math.max(right,x);
      top=Math.min(top,y);bottom=Math.max(bottom,y);
    }
  }
  return Number.isFinite(left)?{left,top,right,bottom}:null;
}

function drawCommentPins() {
  commentPins=[];
  const counts=new Map();
  for (const comment of comments()) {
    if (comment.parent || comment.resolved) continue;
    counts.set(comment.target,(counts.get(comment.target)||0)+1);
  }
  if (!counts.size) return;
  ctx.save();
  ctx.font='bold 10px Segoe UI, sans-serif';
  for (const [target,count] of counts) {
    const box=commentTargetBox(target);
    if (!box) continue;
    const label=String(count);
    const width=30+Math.max(0,label.length-1)*6,height=21;
    const x=clamp(box.left-width-8,4,canvas.clientWidth-width-4);
    const y=clamp((box.top+box.bottom)/2-height/2,4,canvas.clientHeight-height-4);
    ctx.shadowColor='#1b2b3a45';
    ctx.shadowBlur=10;
    ctx.shadowOffsetY=3;
    ctx.beginPath();
    if (ctx.roundRect) ctx.roundRect(x,y,width,height,10);
    else ctx.rect(x,y,width,height);
    ctx.fillStyle='#fffdf8';ctx.fill();
    ctx.shadowColor='transparent';
    ctx.strokeStyle=activeCommentTarget===target?'#d27a2b':'#d9c7b1';
    ctx.lineWidth=activeCommentTarget===target?1.7:1;
    ctx.stroke();
    ctx.strokeStyle='#b46a2b';ctx.lineWidth=1.2;
    ctx.beginPath();
    if (ctx.roundRect) ctx.roundRect(x+6,y+6,10,8,2);
    else ctx.rect(x+6,y+6,10,8);
    ctx.stroke();
    ctx.beginPath();ctx.moveTo(x+9,y+14);ctx.lineTo(x+8,y+17);ctx.lineTo(x+12,y+14);
    ctx.stroke();
    ctx.fillStyle='#7c4a1c';
    ctx.fillText(label,x+20,y+15);
    commentPins.push({target,x,y,width,height,count});
  }
  ctx.restore();
}

/** @param {QreaseePoint2} point */
function commentPinAt(point) {
  return commentPins.find(pin=>point[0]>=pin.x-2&&point[0]<=pin.x+pin.width+2&&
    point[1]>=pin.y-2&&point[1]<=pin.y+pin.height+2) || null;
}

$('#comments-toggle').onclick=()=>toggleComments($('#comments-panel').hidden);
$('#comments-close').onclick=()=>toggleComments(false);
$('#sections-toggle').onclick=()=>toggleSections($('#sections-panel').hidden);
$('#sections-close').onclick=()=>toggleSections(false);
$('#hidden-toggle').onclick=()=>setHiddenMode(!state.showHidden);
$('#section-add').onclick=()=>{
  setTool('section');
  toggleSections(false);
  showStatus('Klik sebuah bidang pada model untuk menempatkan bidang potong.');
};
$('#comment-cancel').onclick=closeCommentComposer;
$('#comment-send').onclick=submitComment;
$('#comment-text').addEventListener('input',renderCommentMentions);
$('#comment-text').addEventListener('keydown',event=>{
  if (event.key==='Enter' && (event.ctrlKey||event.metaKey)) {
    event.preventDefault();event.stopPropagation();submitComment();return;
  }
  if (event.key==='Escape') {event.preventDefault();event.stopPropagation();closeCommentComposer();}
});
$('#object-menu-comment').onclick=()=>{
  const target=objectMenuTarget;
  const point=objectMenuPoint;
  hideObjectMenu();
  if (target) openCommentComposer(target,point?.x,point?.y);
};
$('#object-menu-section-move').onclick=()=>{
  const section=objectMenuSection;
  hideObjectMenu();
  if (section) beginSectionMove(section);
};
$('#object-menu-section-flip').onclick=()=>{
  const section=objectMenuSection;
  hideObjectMenu();
  if (section) updateSection(section,
    {normal:[-section.normal[0],-section.normal[1],-section.normal[2]]});
};
$('#object-menu-section-hide').onclick=()=>{
  const section=objectMenuSection;
  hideObjectMenu();
  if (section) updateSection(section,{hidden:!section.hidden});
};
$('#object-menu-hide').onclick=()=>{
  const target=objectMenuTarget;
  hideObjectMenu();
  if (target) toggleHideTarget(target);
};
$('#object-menu-section-delete').onclick=()=>{
  const section=objectMenuSection;
  hideObjectMenu();
  if (section) removeSection(section);
};
window.addEventListener('pointerdown',event=>{
  if (!$('#object-menu').hidden && !$('#object-menu').contains(/** @type {Node} */ (event.target)))
    hideObjectMenu();
});

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
    const {exportDwg} = await import('./cad-export.js');
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
    const {exportLayoutDwg} = await import('./cad-export.js');
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
    const {importSkp} = await import('./skp-import.js');
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
  if(hoverGridId!==gridHover?.id){hoverGridId=gridHover?.id||null;redraw();}
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
canvas.addEventListener('pointerleave',()=>{if (!state.layout) state.cursor=null;state.hoverKey=null;state.sectionHover=null;state.offsetHover=null;hoverGridId=null;state.inference=null;redraw();});
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

const layoutDefaults=()=>({
  views:[
    {id:'base-plan',mode:'plan',x:14,y:14,w:222,h:130,title:'DENAH',scale:undefined,grid:false},
    {id:'base-iso',mode:'iso',x:242,y:14,w:164,h:130,title:'AKSONOMETRI',scale:undefined,grid:false},
    {id:'base-front',mode:'front',x:14,y:150,w:222,h:98,title:'TAMPAK DEPAN',scale:undefined,grid:false},
    {id:'base-right',mode:'right',x:242,y:150,w:164,h:98,title:'TAMPAK KANAN',scale:undefined,grid:false}
  ],texts:[],dimensions:[],gridLines:[]
});
const sheetLayout=()=>state.doc?.sheet.layout || layoutDefaults();
let layoutTool='select',layoutSelected=null,layoutDrag=null,layoutDimensionStart=null;
let layoutActiveViewId=null,layoutGridPending=null,layoutGridHover=null;
let selectedGridId=null,hoverGridId=null;
let layoutZoom=1;
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
  if(layoutDrag?.kind==='grid'&&layoutDrag.id===grid.id&&layoutDrag.viewId===view.id)
    return segment.map(([x,y])=>[x+layoutDrag.dx,y+layoutDrag.dy]);
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
    const selected=grid.id===selectedGridId,hovered=grid.id===hoverGridId;
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
  layoutSelected={kind,id};
  selectedGridId=kind==='grid'?id:null;
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
  if(tool!=='select'&&!layoutActiveViewId)return;
  layoutTool=tool;layoutDimensionStart=null;
  layoutGridPending=null;layoutGridHover=null;
  $('#layout-stage').dataset.tool=tool;
  document.querySelectorAll('.layout-tool').forEach(/** @param {HTMLElement} button */ button=>button.classList.toggle('active',button.dataset.layoutTool===tool));
  drawSheet();
}
function enterLayoutView(id) {
  const view=sheetLayout().views.find(item=>item.id===id);
  if(!view)return;
  layoutActiveViewId=id;
  $('#layout-stage').classList.add('editing-view');
  $('#layout-mode-label').textContent='Mengedit view: '+view.title;
  $('#layout-finish').hidden=false;
  $('#layout-view-tools').hidden=false;
  $('.layout-title-details').open=false;
  setLayoutTool('select');
  selectLayoutItem('view',id);
}
function exitLayoutView() {
  layoutActiveViewId=null;
  layoutGridPending=null;layoutGridHover=null;layoutDimensionStart=null;
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
  const viewports=layout.views.map(view=>layoutDrag?.kind==='view'&&layoutDrag.id===view.id
    ?{...view,x:layoutDrag.x,y:layoutDrag.y}:view);
  let clipped=false;
  for (const view of viewports) {
    const {id,x,y,w,h,mode}=view,dimensions=mode==='plan';
    const viewScale=view.scale||settings.scale;
    const frame=svg('g',{'data-view-id':id,class:[layoutSelected?.kind==='view'&&layoutSelected.id===id?'layout-selected':'',layoutActiveViewId===id?'layout-active':''].filter(Boolean).join(' ')});
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
      const mark=svg('g',{'data-grid-id':grid.id,class:'layout-grid'+(selectedGridId===grid.id?' layout-selected':'')});
      mark.append(svg('line',{x1:head[0],y1:head[1],x2:tail[0],y2:tail[1],stroke:'#437a9e','stroke-width':.34,'stroke-dasharray':'3 1.4'}));
      mark.append(svg('line',{x1:head[0],y1:head[1],x2:tail[0],y2:tail[1],stroke:'transparent','stroke-width':5}));
      mark.append(svg('circle',{cx:head[0],cy:head[1],r:3.1,fill:'#fff',stroke:'#366b91','stroke-width':.45}));
      mark.append(svg('text',{x:head[0],y:head[1]+1,'text-anchor':'middle',fill:'#225579','font-family':'Segoe UI, Arial, sans-serif','font-size':2.7,'font-weight':700},grid.name));
      mark.append(svg('circle',{cx:tail[0],cy:tail[1],r:.65,fill:'#366b91'}));
      frame.append(mark);
    }
    if(layoutGridPending?.viewId===id) {
      const [ax,ay]=layoutGridPending.a,[bx,by]=layoutGridHover||layoutGridPending.a;
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
      const dimensionGroup=svg('g',{'data-dimension-id':dimension.id,class:layoutSelected?.kind==='dimension'&&layoutSelected.id===dimension.id?'layout-selected':''});
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
    const draft=layoutDrag?.kind==='text'&&layoutDrag.id===item.id?layoutDrag:null;
    const x=draft?.x??item.x,y=draft?.y??item.y;
    const group=svg('g',{'data-text-id':item.id,class:[layoutSelected?.kind==='text'&&layoutSelected.id===item.id?'layout-selected':'',item.viewId===layoutActiveViewId?'layout-active':''].filter(Boolean).join(' ')});
    group.append(svg('rect',{x:x-1,y:y-item.size,width:Math.max(12,item.text.length*item.size*.55),height:item.size+2,fill:'transparent',stroke:layoutSelected?.id===item.id?'#ec8d35':'none','stroke-width':.5}));
    group.append(svg('text',{x,y,fill:'#23313b','font-family':'Segoe UI, Arial, sans-serif','font-size':item.size},item.text));
    sheet.append(group);
  }
  $('#scale-note').textContent=clipped
    ? 'Ada tampilan yang terpotong. Gunakan penyebut skala yang lebih besar.'
    : 'Untuk menjaga skala, cetak A3 pada ukuran aktual (100%).';
  drawLayoutCursors();
  if (!layoutDrag && !layoutGridPending) {
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
  if(layoutGridPending) {
    const view=sheetLayout().views.find(item=>item.id===layoutGridPending.viewId);
    if(view)layoutGridHover=layoutSnap(view,point);
    drawSheet();
    return;
  }
  if (layoutDrag) {
    if(layoutDrag.kind==='grid'){
      layoutDrag.dx=point[0]-layoutDrag.start[0];
      layoutDrag.dy=point[1]-layoutDrag.start[1];
      drawSheet();return;
    }
    const source=layoutDrag.kind==='view'?sheetLayout().views.find(item=>item.id===layoutDrag.id)
      :sheetLayout().texts.find(item=>item.id===layoutDrag.id);
    if (!source) return;
    layoutDrag.x=source.x+point[0]-layoutDrag.start[0];
    layoutDrag.y=source.y+point[1]-layoutDrag.start[1];
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
  if(layoutTool!=='select' && (!layoutActiveViewId || view?.id!==layoutActiveViewId)) {
    showStatus('Double click view yang ingin diedit terlebih dahulu.');return;
  }
  if(layoutTool==='text') {
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
  if(layoutTool==='grid') {
    if (!view || view.mode==='iso') {showStatus('Grid tersedia pada denah dan tampak ortografis.');return;}
    const local=layoutSnap(view,point);
    if(!layoutGridPending || layoutGridPending.viewId!==view.id) {
      layoutGridPending={viewId:view.id,a:local};
      layoutGridHover=local;
      showStatus('Kepala grid ditetapkan. Klik titik ekornya.');
      drawSheet();return;
    }
    const start=layoutGridPending;
    if(Math.hypot(local[0]-start.a[0],local[1]-start.a[1])<2)return;
    const layout=sheetLayout(),name=nextGridName();
    const world=gridWorldFromLocal(view,start.a,local);
    if(!world){showStatus('Grid tidak dapat dibuat pada view ini.');return;}
    const line={id:identity(),viewId:view.id,a:start.a,b:local,name,worldA:world[0],worldB:world[1],hidden:false};
    layoutGridPending=null;layoutGridHover=null;
    saveSheetLayout({...layout,gridLines:[...(layout.gridLines||[]),line]}).then(saved=>{
      if(saved)selectLayoutItem('grid',line.id);
    });
    showStatus('Grid '+line.name+' dibuat. Klik kepala grid berikutnya.');
    return;
  }
  if(layoutTool==='dimension') {
    if (!view || view.mode==='iso') {showStatus('Dimensi tersedia pada denah dan tampak ortografis.');return;}
    const gridId=event.target.closest('[data-grid-id]')?.getAttribute('data-grid-id');
    const layout=sheetLayout(),grid=(layout.gridLines||[]).find(item=>item.id===gridId&&gridSegment(item,view));
    if(!grid) {showStatus('Klik batang grid pertama, lalu batang grid sebelahnya.');return;}
    if(!layoutDimensionStart || layoutDimensionStart.viewId!==view.id) {
      layoutDimensionStart={viewId:view.id,gridId:grid.id};
      showStatus('Grid '+grid.name+' dipilih. Klik batang grid kedua.');
    } else {
      const first=(layout.gridLines||[]).find(item=>item.id===layoutDimensionStart.gridId);
      if(!first || first.id===grid.id)return;
      const firstSegment=gridSegment(first,view),secondSegment=gridSegment(grid,view);
      if(!firstSegment||!secondSegment)return;
      const ad=[firstSegment[1][0]-firstSegment[0][0],firstSegment[1][1]-firstSegment[0][1]],
        bd=[secondSegment[1][0]-secondSegment[0][0],secondSegment[1][1]-secondSegment[0][1]];
      const parallel=Math.abs((ad[0]*bd[0]+ad[1]*bd[1])/(Math.hypot(...ad)*Math.hypot(...bd)));
      if(parallel<.98){showStatus('Dimensi antar-grid memerlukan dua garis sejajar.');return;}
      const dimension={id:identity(),viewId:view.id,a:firstSegment[0],b:secondSegment[0],gridA:first.id,gridB:grid.id};
      saveSheetLayout({...layout,dimensions:[...layout.dimensions,dimension]});
      layoutDimensionStart=null;
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
    if(layoutActiveViewId && kind==='view' && id!==layoutActiveViewId) {
      showStatus('Double click view lain untuk beralih.');return;
    }
    if(layoutActiveViewId && kind==='grid' && (!view || view.id!==layoutActiveViewId ||
      !grids().some(item=>item.id===id&&gridSegment(item,view))))return;
    selectLayoutItem(kind,id);
    if(layoutActiveViewId && kind==='grid'){
      layoutDrag={kind:'grid',id,viewId:view.id,start:point,dx:0,dy:0};
      event.currentTarget.setPointerCapture(event.pointerId);return;
    }
    if(layoutActiveViewId && kind!=='text')return;
    const source=kind==='view'?sheetLayout().views.find(item=>item.id===id)
      :sheetLayout().texts.find(item=>item.id===id);
    if(!source)return;
    layoutDrag={kind,id,start:point,x:source.x,y:source.y};
    event.currentTarget.setPointerCapture(event.pointerId);
  } else if(point[1]>=254) {
    $('.layout-title-details').open=true;
    $('.layout-title-details').scrollIntoView({block:'nearest'});
  } else {layoutSelected=null;$('#layout-selection').hidden=true;drawSheet();}
});
$('#sheet').addEventListener('pointerup',event=>{
  if (!layoutDrag) return;
  const drag=layoutDrag;layoutDrag=null;
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
$('#sheet').addEventListener('pointercancel',()=>{layoutDrag=null;drawSheet();});
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
  if(event.key==='Escape' && state.layout && layoutActiveViewId &&
    !['INPUT','TEXTAREA'].includes(document.activeElement?.tagName)) {
    event.preventDefault();event.stopPropagation();
    if(layoutGridPending || layoutDimensionStart)setLayoutTool('select');
    else exitLayoutView();
  }
},true);
document.querySelectorAll('.layout-tool').forEach(/** @param {HTMLElement} button */ button=>button.onclick=()=>setLayoutTool(button.dataset.layoutTool));
$('#layout-zoom').onchange=event=>{
  layoutZoom=Number(event.target.value);
  $('#layout-stage').style.setProperty('--layout-sheet-width',(840*layoutZoom)+'px');
};
function stepLayoutZoom(direction) {
  const levels=[.5,.75,1,1.25,1.5,2,3];
  const index=levels.indexOf(layoutZoom);
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
  if(layoutSelected?.kind!=='view')return;
  const layout=sheetLayout(),title=event.target.value.trim();if(!title)return;
  saveSheetLayout({...layout,views:layout.views.map(item=>item.id===layoutSelected.id?{...item,title}:item)});
};
$('#layout-view-scale').onchange=event=>{
  if(layoutSelected?.kind!=='view')return;
  const scale=Number(event.target.value);
  if(![25,50,75,100,150,200,500].includes(scale))return;
  const layout=sheetLayout();
  saveSheetLayout({...layout,views:layout.views.map(item=>item.id===layoutSelected.id?{...item,scale}:item)});
};
$('#layout-text-value').onchange=event=>{
  if(layoutSelected?.kind!=='text')return;
  const layout=sheetLayout(),value=event.target.value.trim();if(!value)return;
  saveSheetLayout({...layout,texts:layout.texts.map(item=>item.id===layoutSelected.id?{...item,text:value}:item)});
};
$('#layout-grid-name').onchange=event=>{
  if(layoutSelected?.kind!=='grid')return;
  renameGrid(layoutSelected.id,event.target.value);
};
$('#layout-grid-visibility').onclick=()=>{
  if(layoutSelected?.kind!=='grid')return;
  const grid=grids().find(item=>item.id===layoutSelected.id);
  if(!grid)return;
  updateGrid(grid.id,{hidden:!grid.hidden});
  $('#layout-grid-visibility').textContent=grid.hidden?'Sembunyikan grid':'Tampilkan grid';
};
$('#layout-delete').onclick=()=>{
  if(!layoutSelected)return;
  if(layoutSelected.kind==='grid'){removeGrid(layoutSelected.id);return;}
  const layout=sheetLayout();
  const deletingActiveView=layoutSelected.kind==='view'&&layoutSelected.id===layoutActiveViewId;
  const next=layoutSelected.kind==='view'
    ?{...layout,views:layout.views.filter(item=>item.id!==layoutSelected.id),
      gridLines:(layout.gridLines||[]).filter(item=>item.viewId!==layoutSelected.id||item.worldA),
      texts:layout.texts.filter(item=>item.viewId!==layoutSelected.id),
      dimensions:layout.dimensions.filter(item=>item.viewId!==layoutSelected.id)}
    :layoutSelected.kind==='dimension'
    ?{...layout,dimensions:layout.dimensions.filter(item=>item.id!==layoutSelected.id)}
    :{...layout,texts:layout.texts.filter(item=>item.id!==layoutSelected.id)};
  layoutSelected=null;$('#layout-selection').hidden=true;
  if(deletingActiveView)exitLayoutView();
  saveSheetLayout(next);
};

window.addEventListener('hashchange',()=>roomFromHash()?openRoom():showProjectHome());
let lastSync=0;
setInterval(()=>{
  const fast=state.linePending || state.peers.some(peer=>peer.cursor?.line);
  const interval=window.qreaseeCloudPost ? (fast?500:1500) : 350;
  if (Date.now()-lastSync>=interval) { lastSync=Date.now(); sync(); }
},250);
if (roomFromHash()) openRoom();
else if (window.qreaseeAuth) window.qreaseeAuth.ready.then(()=>renderProjectHome());
else renderProjectHome();
