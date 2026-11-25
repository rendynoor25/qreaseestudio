'use strict';

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
  select:'<path d="m5 3 14 10-7 1-3 6z"/>',
  line:'<path d="m5 19 14-14"/><circle cx="5" cy="19" r="1.6"/><circle cx="19" cy="5" r="1.6"/>',
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
document.querySelectorAll('[data-icon]').forEach(element => icon(element, element.dataset.icon));

const tools = {
  select: ['Pilih', 'V', 'Klik objek untuk memilih'],
  line: ['Garis', 'L', 'Tarik garis pada bidang dasar'],
  rectangle: ['Persegi panjang', 'R', 'Tarik persegi panjang pada bidang dasar'],
  circle: ['Lingkaran', 'C', 'Tarik dari pusat untuk mengatur radius'],
  pull: ['Push/Pull', 'P', 'Tarik bidang atas ke atas atau ke bawah'],
  move: ['Pindah', 'M', 'Tarik objek sejajar bidang dasar'],
  rotate: ['Rotate', 'Q', 'Tarik mengelilingi pusat objek untuk memutar pada sumbu Z'],
  scale: ['Skala', 'S', 'Tarik dari objek untuk mengubah ukurannya secara proporsional'],
  erase: ['Penghapus', 'E', 'Klik objek untuk menghapus; Ctrl+Z untuk mengurungkan'],
  measure: ['Ukur', 'T', 'Tarik antara dua titik untuk membaca jarak pada bidang gambar'],
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

const state = {
  room: '', client: identity(), name: localStorage.getItem('qreasee-name') || 'Tamu',
  doc: null, meshes: [], plans: [], selected: new Set(), inside: null, tool: 'select', layout: false, busy: false,
  snapping: localStorage.getItem('qreasee-snap') !== 'off', inference: null,
  undo: [], redo: [], drag: null, hits: [], epoch: 0, polling: false, peers:[], cursor:null
};
const canvas = $('#viewport');
const ctx = canvas.getContext('2d');
const camera = { yaw: .62, pitch: .48, scale: 40, base: 40, x: 0, y: 0, center:[0,0,0], distance:22, perspective:true };
const views = { perspective:[.62,.48], iso:[.62,.54], plan:[0,Math.PI/2], front:[0,0], right:[Math.PI/2,0] };
const clamp = (value,min,max) => Math.max(min,Math.min(max,value));
const round = value => Math.round(value * 1000) / 1000;
const snap = (value, step = .25) => Math.round(value / step) * step;
const svgNS = 'http://www.w3.org/2000/svg';
const status = message => { $('#status').textContent = message; };
const objects = () => state.doc?.objects || [];
const members = id => objects().filter(object => object.container?.id === id);
const onlySelected = () => state.selected.size===1 ? state.selected.values().next().value : null;
const currentObject = () => objects().find(object => object.id === onlySelected());
const targetId = object => object?.container && object.container.id!==state.inside ? object.container.id : object?.id;
let objectBaseline = null;
let sheetBaseline = null;
let frame = 0;

for (const [id, [label, key]] of Object.entries(tools)) {
  const button = document.createElement('button');
  button.className = 'icon-button';
  button.title = label + ' (' + key + ')';
  button.setAttribute('aria-label', label);
  button.dataset.tool = id;
  icon(button, id);
  button.onclick = () => setTool(id);
  $('#tool-buttons').append(button);
}

function setTool(tool) {
  state.tool = tool;
  $('#tool-hint').textContent = tools[tool][2];
  canvas.dataset.tool = tool;
  document.querySelectorAll('[data-tool].icon-button').forEach(button => {
    const active = button.dataset.tool === tool;
    button.classList.toggle('active', active);
    button.setAttribute('aria-pressed', String(active));
  });
}
setTool('select');

function mode(layout) {
  state.layout = layout;
  state.cursor = null;
  for (const id of ['tools','stage','tree','inspector']) {
    $('#model-' + id).hidden = layout;
    $('#layout-' + id).hidden = !layout;
  }
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
  state.busy = false;
  state.room = '';
  state.doc = null;
  state.meshes = [];
  state.plans = [];
  state.selected.clear();
  state.inside = null;
  state.inference = null;
  state.undo = [];
  state.redo = [];
  state.polling = false;
  state.peers = [];
  state.cursor = null;
  objectBaseline = null;
  sheetBaseline = null;
  connection(false, 'Menghubungkan');
  $('#project-title').textContent = 'Qreasee Studio';
  $('#revision').textContent = '';
  $('#avatars').replaceChildren();
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
  } catch {
    if (state.epoch === epoch) {
      connection(false, 'Terputus');
      status('Server tidak dapat dihubungi. Muat ulang halaman untuk mencoba lagi.');
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
      status('Ruang model siap.');
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
  connection(true, peers.length + ' online');
  if (cursorChanged) {
    if (state.layout) drawLayoutCursors();
    else redraw();
  }
}

function renderAvatars(avatars,peers) {
  for (const peer of peers.slice(0, 4)) {
    const item = document.createElement('span');
    item.className = 'avatar';
    item.title = (peer.name || 'Tamu') + (peer.id === state.client ? ' (Anda)' : '');
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
      status(result.data.error || 'Sinkronisasi gagal.');
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
  try {
    const result = await exchange(edit);
    if (state.epoch !== epoch) return false;
    if (result.data.peers) accept(result.data);
    if (result.code !== 200) {
      if (result.code === 409) refresh(true);
      status(result.data.error || 'Perubahan gagal disimpan.');
      return false;
    }
    if (success) success(result.data.topology);
    const newFaces = result.data.topology?.added.filter(object=>object.profile?.inferred).length || 0;
    status(newFaces ? newFaces+' bidang baru terbentuk dari garis.' : 'Perubahan tersimpan.');
    refresh(true);
    return true;
  } catch {
    if (state.epoch === epoch) status('Sambungan terputus saat menyimpan. Revisi akan diperiksa ulang.');
    return false;
  } finally {
    if (state.epoch === epoch) {
      state.busy = false;
      refreshButtons();
    }
  }
}

function edit(before, after, type = 'object') {
  if (type === 'object' && before?.container?.definition) {
    const linked = linkedMembers(before);
    const updates = after ? linked.map(item=>({
      ...after, id:item.id, container:item.container,
      x:item.x+(after.x-before.x), y:item.y+(after.y-before.y), z:item.z+(after.z-before.z)
    })) : [];
    return batch(linked.map(item=>item.id===before.id?before:item), updates, after ? [after.id] : []);
  }
  const command = {type,before,after};
  return commit(command, topology => {
    state.undo.push(historyCommand(command,topology));
    state.redo.length = 0;
    if (type === 'object') state.selected = new Set(after ? [targetId(after)] : []);
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
  const loose=state.selected.size>0 && [...state.selected].every(id=>objects().some(object=>object.id===id && !object.container));
  $('#make-group').disabled = state.busy || !loose;
  $('#make-component').disabled = state.busy || !loose;
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
    ? state.selected.size+' pilihan. Gunakan Group atau Component untuk menggabungkan objek lepas.'
    : 'Klik untuk memilih objek. Gunakan Shift + klik untuk menambah pilihan.';
  if (object) {
    $('#selection-title').textContent = object.name;
    const kind = object.shape === 'line' ? 'Garis' : object.height ? 'Bentuk 3D' : 'Bidang';
    $('#selection-kind').textContent = kind;
    icon($('#object-glyph'), object.shape === 'line' ? 'line' : object.height ? 'cube' : object.shape);
    if (force || objectBaseline?.id !== object.id || form.dataset.dirty !== 'yes') {
      Object.entries(object).forEach(([key,value]) => {
        const input = form.elements.namedItem(key);
        if (input) input.value = value;
      });
      form.elements.height.readOnly = object.shape === 'line';
      objectBaseline = object;
      form.dataset.dirty = '';
    }
  } else objectBaseline = null;
  const sheetForm = $('#sheet-form');
  if (doc && (force || sheetForm.dataset.dirty !== 'yes')) {
    Object.entries(doc.sheet).forEach(([key,value]) => { sheetForm.elements.namedItem(key).value = value; });
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
    button.setAttribute('aria-pressed', String(state.selected.has(id)));
    button.append(glyph, label);
    button.onclick = event => select(id,event.shiftKey);
    if (matchingContainers.has(id)) button.ondblclick=()=>enterContainer(id);
    list.append(button);
  };
  for (const object of objects) {
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

function removeObject() {
  const object = currentObject();
  if (object) { edit(object, null); return; }
  const group=members(onlySelected());
  if (group.length) batch(group,[],[]);
}

$('#search').oninput = renderTree;
$('#undo').onclick = () => reverse(false);
$('#redo').onclick = () => reverse(true);
$('#delete').onclick = removeObject;
$('#duplicate').onclick = () => {
  const object = currentObject();
  if (!object) return;
  addObject({...object,container:null,id:identity(),name:[...object.name].slice(0,55).join('') + ' salinan',
    x:object.x+.5,y:object.y+.5});
};

function addObject(object) {
  const anchor=members(state.inside)[0];
  if (!anchor) return edit(null,object);
  const container=anchor.container;
  const copies=container.definition ? linkedMembers(anchor) : [anchor];
  const slot=container.definition ? identity() : null;
  return batch([],copies.map(copy=>({
    ...object,id:copy.id===anchor.id ? object.id : identity(),
    container:{...copy.container,slot},
    x:object.x+(copy.x-anchor.x),y:object.y+(copy.y-anchor.y),z:object.z+(copy.z-anchor.z)
  })),[object.id]);
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
$('#make-group').onclick=()=>createContainer(false);
$('#make-component').onclick=()=>createContainer(true);
$('#cancel-container').onclick=()=>$('#container-dialog').close();
$('#object-form').oninput = event => { event.currentTarget.dataset.dirty = 'yes'; };
$('#object-form').onsubmit = event => {
  event.preventDefault();
  if (!objectBaseline) return;
  const values = Object.fromEntries(new FormData(event.currentTarget));
  for (const field of ['x','y','z','width','depth','height','rotation']) values[field] = Number(values[field]);
  edit(objectBaseline, {...objectBaseline,...values});
};
$('#sheet-form').oninput = event => { event.currentTarget.dataset.dirty = 'yes'; };
$('#sheet-form').onsubmit = event => {
  event.preventDefault();
  if (!sheetBaseline) return;
  const values = Object.fromEntries(new FormData(event.currentTarget));
  values.scale = Number(values.scale);
  values.cut_height = Number(values.cut_height);
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
  const output = ['# Qreasee Studio · meters · Z up'];
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


function basis(yaw, pitch) {
  const sy = Math.sin(yaw), cy = Math.cos(yaw);
  const sp = Math.sin(pitch), cp = Math.cos(pitch);
  return ([x,y,z]) => [cy*x+sy*y,sy*sp*x-cy*sp*y-cp*z,sy*cp*x-cy*cp*y+sp*z];
}

function bounds(points) {
  const min = [Infinity,Infinity,Infinity], max = [-Infinity,-Infinity,-Infinity];
  for (const point of points) {
    point.forEach((value,index) => {
      min[index] = Math.min(min[index],value);
      max[index] = Math.max(max[index],value);
    });
  }
  return {min,max};
}

function fit() {
  const world = state.meshes.flatMap(mesh => mesh.vertices);
  if (!world.length) world.push([-6,-4,0],[6,4,0]);
  const box=bounds(world);
  camera.center=box.min.map((low,i)=>(low+box.max[i])/2);
  camera.distance=Math.max(8, 1.75*Math.hypot(...box.max.map((high,i)=>high-box.min[i]))/2);
  const points=world.map(projectPoint);
  const {min,max} = bounds(points);
  const width = canvas.clientWidth || $('#layout-stage').clientWidth || 800;
  const height = canvas.clientHeight || 500;
  camera.scale = clamp(Math.min(width*.69 / Math.max(1,max[0]-min[0]),
    height*.63 / Math.max(1,max[1]-min[1])), .05, 300);
  camera.base = camera.scale;
  camera.x = -(min[0]+max[0])/2*camera.scale;
  camera.y = -(min[1]+max[1])/2*camera.scale;
  redraw();
}

function cameraView(value) {
  [camera.yaw,camera.pitch] = views[value];
  camera.perspective=value==='perspective';
  state.inference=null;
  $('#camera').value = value;
  fit();
}

function zoom(factor,x=canvas.clientWidth/2,y=canvas.clientHeight/2) {
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

function projectPoint(point) {
  const [u,v,d] = basis(camera.yaw,camera.pitch)(point.map((value,i)=>value-camera.center[i]));
  const w=camera.perspective ? 1-d/camera.distance : 1;
  return w>.025 ? [u/w,v/w,d/w,w] : [NaN,NaN,d,w];
}

function stagePoint(point) {
  const [x,y,depth,w] = projectPoint(point);
  return [canvas.clientWidth/2+camera.x+x*camera.scale,
    canvas.clientHeight/2+camera.y+y*camera.scale,depth,w];
}

function ground([x,y], z=0) {
  const sp=Math.sin(camera.pitch), cp=Math.cos(camera.pitch);
  const sy=Math.sin(camera.yaw), cy=Math.cos(camera.yaw);
  const u=(x-canvas.clientWidth/2-camera.x)/camera.scale;
  const v=(y-canvas.clientHeight/2-camera.y)/camera.scale;
  let right=u, vertical=v, depth;
  if (camera.perspective) {
    const t=(camera.center[2]+camera.distance*sp-z)/(v*cp+camera.distance*sp);
    if (!Number.isFinite(t) || t<=.025) return null;
    right*=t;
    vertical*=t;
    depth=camera.distance*(1-t);
  } else {
    if (Math.abs(sp)<.03) return null;
    depth=(z-camera.center[2]+v*cp)/sp;
  }
  const point=[camera.center[0]+cy*right+sy*sp*vertical+sy*cp*depth,
    camera.center[1]+sy*right-cy*sp*vertical-cy*cp*depth];
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

function scene(meshes, objects, projection) {
  const faces = [];
  meshes.forEach((mesh,index) => {
    if (!mesh.vertices.length) return;
    const projected = mesh.vertices.map(projection);
    const object = objects[index];
    const entries = mesh.faces.length ? mesh.faces : [[0,1]];
    for (const face of entries) {
      const points = face.map(i => projected[i]);
      if (points.some(point=>!Number.isFinite(point[0]))) continue;
      const area = points.reduce((sum,p,i) => {
        const q = points[(i+1)%points.length];
        return sum + p[0]*q[1]-q[0]*p[1];
      },0);
      if (face.length > 2 && (Math.abs(area) < 1e-6 || (area > 0 && object.height))) continue;
      let tone = 1, top = false;
      if (mesh.faces.length) {
        const heights = face.map(i => mesh.vertices[i][2]);
        top = heights.every(h => h === object.z+object.height);
        if (!top) {
          const a = mesh.vertices[face[0]], b = mesh.vertices[face[1]];
          tone = (b[1]-a[1]) - (b[0]-a[0]) > 0 ? .82 : .69;
        }
      }
      const ring=object.profile?.points.length;
      const edges=ring && face.length===3 ? face.map((index,i)=>{
        const delta=Math.abs(index%ring-face[(i+1)%face.length]%ring);
        return delta===1 || delta===ring-1;
      }) : null;
      faces.push({object,points,edges,world:face.map(i=>mesh.vertices[i]),top,tone,cut:mesh.cut,depth:points.reduce((sum,p) => sum+p[2],0)/points.length});
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

function drawGrid(width,height) {
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
      x === 0 ? '#619a83' : x%(5*step)===0 ? '#acb9bd' : '#c4cfd1', x === 0 ? 1.1 : .75);
  }
  for (let y=Math.floor(min[1]/step)*step; y<=max[1]; y+=step) {
    gridLine([min[0],y,0],[max[0],y,0],
      y === 0 ? '#bd7f78' : y%(5*step)===0 ? '#acb9bd' : '#c4cfd1', y === 0 ? 1.1 : .75);
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
  const project = basis(camera.yaw,camera.pitch);
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
  const backdrop = ctx.createLinearGradient(0,0,0,height);
  backdrop.addColorStop(0,'#f2f4f4');
  backdrop.addColorStop(1,'#d4dcdd');
  ctx.fillStyle = backdrop;
  ctx.fillRect(0,0,width,height);
  drawGrid(width,height);
  const drag = state.drag;
  if (state.doc) {
    let meshes = state.meshes, objects = state.doc.objects;
    if (drag?.updates) {
      const preview=new Map(drag.updates.map(object=>[object.id,object]));
      meshes=objects.map((object,i)=>preview.has(object.id)?previewMesh(preview.get(object.id)):meshes[i]);
      objects=objects.map(object=>preview.get(object.id)||object);
    }
    state.hits = scene(meshes,objects,stagePoint);
    for (const face of state.hits) {
      const selected = state.selected.has(targetId(face.object));
      polygon(face.points);
      if (face.points.length > 2) {
        ctx.fillStyle = shade(face.object.color,face.tone);
        ctx.fill();
      }
      ctx.strokeStyle = selected ? '#c87936' : '#4f5150';
      ctx.lineWidth = selected ? 1.65 : .8;
      if (face.edges) {
        ctx.beginPath();
        for (let i=0;i<face.edges.length;i++) {
          if (!face.edges[i]) continue;
          ctx.moveTo(...face.points[i].slice(0,2));
          ctx.lineTo(...face.points[(i+1)%face.points.length].slice(0,2));
        }
      }
      ctx.stroke();
    }
  } else state.hits = [];
  if (drag?.preview) {
    const mesh = previewMesh(drag.preview);
    polygon(mesh.vertices.map(stagePoint));
    if (mesh.faces.length) { ctx.fillStyle = '#f0913b38'; ctx.fill(); }
    ctx.strokeStyle = '#bf671c'; ctx.lineWidth = 1.5; ctx.stroke();
  }
  if (drag?.tool==='measure' && drag.end) {
    const a=stagePoint(drag.initial), b=stagePoint(drag.end);
    if (Number.isFinite(a[0]) && Number.isFinite(b[0])) {
      strokeLine(a,b,'#bf671c',2);
      for (const [x,y] of [a,b]) { ctx.beginPath();ctx.arc(x,y,4,0,Math.PI*2);ctx.fillStyle='#fff';ctx.fill();ctx.strokeStyle='#bf671c';ctx.stroke(); }
      const label=drag.distance.toFixed(3)+' m';
      ctx.font='bold 12px Segoe UI, sans-serif';
      ctx.fillStyle='#fff';ctx.fillRect((a[0]+b[0])/2-5,(a[1]+b[1])/2-18,ctx.measureText(label).width+10,19);
      ctx.fillStyle='#703b11';ctx.fillText(label,(a[0]+b[0])/2,(a[1]+b[1])/2-4);
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
  $('#snap-feedback').textContent=state.inference?.label || '';
  if (state.inference) {
    const [x,y]=stagePoint(state.inference.world);
    if (Number.isFinite(x)) {
      ctx.beginPath();
      if (state.inference.label==='Ujung') ctx.rect(x-4,y-4,8,8);
      else ctx.arc(x,y,4,0,Math.PI*2);
      ctx.fillStyle='#fff';
      ctx.fill();
      ctx.strokeStyle='#00856d';
      ctx.lineWidth=2;
      ctx.stroke();
    }
  }
  $('#zoom-label').textContent = Math.round(camera.scale / camera.base * 100) + '%';
  for (const peer of state.peers) {
    if (peer.cursor?.mode!=='model') continue;
    const [x,y]=stagePoint([peer.cursor.x,peer.cursor.y,0]);
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

function previewMesh(object) {
  const w=object.width/2, d=object.depth/2;
  const angle=object.rotation*Math.PI/180, sin=Math.sin(angle), cos=Math.cos(angle);
  const outline = object.shape === 'line' ? [[-w,-d],[w,d]]
    : object.shape === 'rectangle' ? [[-w,-d],[w,-d],[w,d],[-w,d]]
    : object.shape==='polygon' ? object.profile.points.map(([x,y])=>[x*object.width,y*object.depth])
    : Array.from({length:48},(_,i) => [w*Math.cos(i*Math.PI/24),d*Math.sin(i*Math.PI/24)]);
  const layer = z => outline.map(([x,y]) => [object.x+x*cos-y*sin,object.y+x*sin+y*cos,z]);
  const n=outline.length;
  const vertices=layer(object.z);
  const faces=[];
  if (n>2) {
    const base=Array.from({length:n},(_,i)=>i);
    const source=state.doc?.objects.findIndex(item=>item.id===object.id);
    const top=state.meshes[source]?.cap || [base];
    if (object.height>0) {
      vertices.push(...layer(object.z+object.height));
      faces.push(...top.map(face=>[...face].reverse()),...base.map(i=>[i,(i+1)%n,(i+1)%n+n,i+n]),
        ...top.map(face=>face.map(i=>i+n)));
    } else faces.push(...top);
  }
  return {vertices,faces};
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

function pointer(event) {
  const rect=canvas.getBoundingClientRect();
  return [event.clientX-rect.left,event.clientY-rect.top];
}

function pickFace(point, preferLine) {
  const face=state.hits.findLast(candidate=>contains(point,candidate.points));
  if (preferLine && face?.object.shape==='polygon' && face.object.height===0) {
    return state.hits.findLast(candidate=>candidate.object.shape==='line'
      && Math.abs(candidate.object.z-face.object.z)<.00001
      && contains(point,candidate.points)) || face;
  }
  return face;
}

function infer(point, elevation, excluded = new Set()) {
  if (!state.snapping) return null;
  let best=null;
  const add=(world,label,penalty,owner)=>{
    if (elevation!==undefined && Math.abs(world[2]-elevation)>.00001) return;
    const projected=stagePoint(world);
    const distance=Math.hypot(projected[0]-point[0],projected[1]-point[1]);
    if (!(distance<=9) || (best && distance+penalty>=best.score)) return;
    const hit=state.hits.findLast(face=>!excluded.has(face.object.id) && contains(projected,face.points));
    if (hit && hit.object.id!==owner &&
        !(hit.object.shape==='polygon' && hit.object.height===0 && Math.abs(hit.object.z-world[2])<.00001)) return;
    best={world,label,score:distance+penalty};
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
      add(interpolate(a,b,t),'Pada tepi',4,owner);
    }
  }
  return best;
}

function drawingPoint(point,elevation) {
  const hit=infer(point,elevation);
  if(hit) return hit;
  const z=elevation??0;
  const xy=ground(point,z);
  if (!xy) return null;
  return {world:[...(state.snapping?xy.map(value=>snap(value)):xy.map(round)),z],
    label:state.snapping?'Grid 0,25 m':''};
}

function setSnapping(enabled) {
  state.snapping=enabled;
  state.inference=null;
  $('#snap-toggle').setAttribute('aria-pressed',String(enabled));
  localStorage.setItem('qreasee-snap',enabled?'on':'off');
  redraw();
}
setSnapping(state.snapping);
$('#snap-toggle').onclick=()=>setSnapping(!state.snapping);

canvas.addEventListener('contextmenu',event=>event.preventDefault());
canvas.addEventListener('wheel',event=>{
  event.preventDefault();
  zoom(Math.exp(-clamp(event.deltaY,-400,400)*.0015),...pointer(event));
},{passive:false});
canvas.addEventListener('pointerdown',event=>{
  if (state.drag || event.button > 2) return;
  const start=pointer(event);
  const tool=event.button === 1 ? (event.shiftKey?'pan':'orbit') : event.button === 2 ? 'pan' : state.tool;
  if (tool === 'orbit' || tool === 'pan') {
    state.drag={tool,start,camera:{...camera}};
  } else {
    if (!state.doc || state.busy) return;
    const face=pickFace(start,tool!=='pull');
    if (tool==='select') { select(targetId(face?.object),event.shiftKey); return; }
    const object=face?.object;
    if (tool==='erase') {
      if (object) { select(targetId(object)); removeObject(); }
      return;
    }
    if (tool==='scale') {
      const id=targetId(object);
      const group=members(id);
      const sources=group.length?group:object?[object]:[];
      if (!sources.length || (group.length && group[0].container.definition)) {
        status('Pilih objek atau Group. Untuk Component, gunakan Edit isi.');
        return;
      }
      const pivot=[sources.reduce((sum,item)=>sum+item.x,0)/sources.length,
        sources.reduce((sum,item)=>sum+item.y,0)/sources.length];
      const initial=ground(start,object.z);
      const radius=initial && Math.hypot(initial[0]-pivot[0],initial[1]-pivot[1]);
      if (!radius || radius<.01) { status('Mulai tarik di luar pusat objek.'); return; }
      select(id);
      state.drag={tool,start,object,sources,pivot,radius,elevation:object.z};
    } else if (tool==='rotate') {
      const id=targetId(object);
      const group=members(id);
      const sources=group.length?group:object?[object]:[];
      if (!sources.length || (group.length && group[0].container.definition)) {
        status('Pilih objek atau Group. Untuk Component, gunakan Edit isi.');
        return;
      }
      const midpoint=key=>sources.reduce((sum,item)=>sum+item[key],0)/sources.length;
      const pivot=[midpoint('x'),midpoint('y'),face.top?object.z+object.height:object.z];
      const initial=ground(start,pivot[2]);
      if (!initial || Math.hypot(initial[0]-pivot[0],initial[1]-pivot[1])<.01) {
        status('Putar dari titik di luar pusat objek pada denah atau tampilan 3D.');
        return;
      }
      select(id);
      state.drag={tool,start,object,sources,pivot,initial:Math.atan2(initial[1]-pivot[1],initial[0]-pivot[0])};
    } else if (tool==='pull' || tool==='move') {
      if (!object || (tool==='pull' && !face.top)) {
        status(tool==='pull'?'Pilih permukaan horizontal atas.':'Pilih objek yang akan dipindah.');
        return;
      }
      if (tool==='pull' && (Math.abs(Math.cos(camera.pitch))<.03 || targetId(object)!==object.id)) {
        status('Gunakan tampilan 3D dan buka Edit isi untuk mengubah permukaan Group atau Component.');
        return;
      }
      const id=targetId(object);
      const selected=members(id);
      const sources=selected.length?selected:[object];
      const owned=new Set(sources.map(item=>item.id));
      const anchor=tool==='move' ? infer(start,undefined,new Set(objects().filter(item=>!owned.has(item.id)).map(item=>item.id))) : null;
      const elevation=anchor?.world[2]??object.z;
      const origin=ground(start,elevation);
      if (tool==='move' && !origin) { status('Gunakan denah atau tampilan 3D untuk memindah.');return; }
      select(id);
      state.drag={tool,start,object,sources,owned,elevation,origin,anchor:anchor?.world??[...(origin||[0,0]),elevation]};
    } else if (tool==='measure') {
      const initial=drawingPoint(start);
      if (!initial) { status('Gunakan denah atau tampilan 3D untuk mengukur.');return; }
      state.drag={tool,start,initial:initial.world};
    } else {
      const initial=drawingPoint(start);
      if (!initial) { status('Gunakan denah atau aksonometri untuk menggambar.');return; }
      state.drag={tool,start,initial:initial.world,id:identity()};
    }
  }
  canvas.setPointerCapture(event.pointerId);
});

canvas.addEventListener('pointermove',event=>{
  const point=pointer(event);
  const onGround=ground(point);
  state.cursor=onGround?{mode:'model',x:round(onGround[0]),y:round(onGround[1])}:null;
  $('#coordinates').textContent=onGround ? 'X '+onGround[0].toFixed(2)+'  Y '+onGround[1].toFixed(2) : 'X —  Y —';
  const drag=state.drag;
  if (!drag) {
    state.inference=['line','rectangle','circle'].includes(state.tool) ? drawingPoint(point) : null;
    if (!state.inference?.label) state.inference=null;
    redraw();
    return;
  }
  state.inference=null;
  const dx=point[0]-drag.start[0], dy=point[1]-drag.start[1];
  if (drag.tool==='orbit') {
    camera.yaw=drag.camera.yaw-dx*.009;
    camera.pitch=clamp(drag.camera.pitch-dy*.008,-Math.PI/2+.02,Math.PI/2-.02);
    if (!camera.perspective) $('#camera').value='iso';
  } else if (drag.tool==='pan') {
    camera.x=drag.camera.x+dx;
    camera.y=drag.camera.y+dy;
  } else if (drag.tool==='measure') {
    const candidate=drawingPoint(point,drag.initial[2]);
    if (!candidate) { drag.end=null;redraw();return; }
    drag.end=candidate.world;
    drag.distance=Math.hypot(drag.end[0]-drag.initial[0],drag.end[1]-drag.initial[1]);
    state.inference=candidate.label?candidate:null;
    status('Jarak '+drag.distance.toFixed(3)+' m');
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
    status('Skala '+factor.toFixed(2)+'×');
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
    status('Rotasi '+angle.toFixed(1)+'°');
  } else if (drag.tool==='pull') {
    const {x,y,z,height}=drag.object;
    const current=stagePoint([x,y,z+height]), next=stagePoint([x,y,z+height+.1]);
    const slope=(next[1]-current[1])/.1;
    if (!Number.isFinite(slope) || Math.abs(slope)<.01) return;
    const value=height+dy/slope;
    drag.updates=[{...drag.object,height:Math.max(0,state.snapping?snap(value,.05):round(value))}];
    status('Tinggi '+drag.updates[0].height.toFixed(2)+' m');
  } else if (drag.tool==='move') {
    const end=ground(point,drag.elevation);
    if (!end) { drag.updates=null;redraw();return; }
    const projected=stagePoint([drag.anchor[0]+end[0]-drag.origin[0],drag.anchor[1]+end[1]-drag.origin[1],drag.elevation]);
    state.inference=infer(projected,drag.elevation,drag.owned);
    const delta=state.inference ? state.inference.world.slice(0,2).map((value,i)=>value-drag.anchor[i])
      : end.map((value,i)=>state.snapping?snap(value-drag.origin[i]):round(value-drag.origin[i]));
    drag.updates=drag.sources.map(object=>({...object,x:object.x+delta[0],y:object.y+delta[1]}));
  } else {
    const a=drag.initial;
    const candidate=drawingPoint(point,a[2]);
    if (!candidate) { drag.preview=null;redraw();return; }
    state.inference=candidate.label?candidate:null;
    const b=candidate.world;
    const x=b[0]-a[0], y=b[1]-a[1];
    const radius=Math.hypot(x,y);
    const circle=drag.tool==='circle', line=drag.tool==='line';
    drag.preview={id:drag.id,name:{line:'Garis',rectangle:'Bidang persegi',circle:'Bidang lingkaran'}[drag.tool],
      shape:drag.tool,x:circle?a[0]:(a[0]+b[0])/2,y:circle?a[1]:(a[1]+b[1])/2,z:a[2],
      width:circle?radius*2:line?x:Math.abs(x),depth:circle?radius*2:line?y:Math.abs(y),
      height:0,rotation:0,color:'#dfcbb8'};
  }
  redraw();
});
canvas.addEventListener('pointerleave',()=>{if (!state.layout) state.cursor=null;state.inference=null;redraw();});
canvas.addEventListener('dblclick',event=>{
  if (state.tool!=='select') return;
  const face=state.hits.findLast(candidate=>contains(pointer(event),candidate.points));
  if (face?.object.container) enterContainer(face.object.container.id);
});

canvas.addEventListener('pointerup',()=>{
  const drag=state.drag;
  state.drag=null;
  if (drag?.preview) {
    const object=drag.preview;
    const valid=object.shape==='line' ? Math.hypot(object.width,object.depth)>.001
      : object.width>.001 && object.depth>.001;
    if (valid) addObject(object);
  } else if (drag?.updates && drag.updates.some((object,i)=>JSON.stringify(object)!==JSON.stringify(drag.sources[i]))) {
    if (['move','rotate','scale'].includes(drag.tool) && targetId(drag.object)!==drag.object.id) {
      batch(drag.sources,drag.updates,[targetId(drag.object)]);
    } else edit(drag.object,drag.updates[0]);
  }
  redraw();
});
canvas.addEventListener('lostpointercapture',()=>{
  if (state.drag) { state.drag=null;redraw(); }
});
window.addEventListener('keydown',event=>{
  if (event.key==='Escape' && state.drag) {
    state.drag=null;redraw();return;
  }
  if (event.key==='Escape' && state.inside && !document.querySelector('dialog[open]')) { exitContainer();return; }
  if (document.querySelector('dialog[open]') ||
      ['INPUT','TEXTAREA','SELECT','BUTTON','SUMMARY'].includes(event.target.tagName)) return;
  const key=event.key.toUpperCase();
  if ((event.ctrlKey||event.metaKey) && ['Z','Y'].includes(key)) {
    event.preventDefault();reverse(event.shiftKey||key==='Y');return;
  }
  if (state.layout || event.ctrlKey || event.metaKey || event.altKey) return;
  if (key==='DELETE' || key==='BACKSPACE') { event.preventDefault();removeObject();return; }
  if (key==='F') { fit();return; }
  const tool=Object.entries(tools).find(([,value])=>value[1]===key);
  if (tool) setTool(tool[0]);
});

new ResizeObserver(redraw).observe(canvas);


function drawSheet() {
  const sheet = $('#sheet');
  sheet.replaceChildren(svg('rect',{width:420,height:297,fill:'#fff'}));
  if (!state.doc) return;
  const {objects,sheet:settings}=state.doc;
  const add=(name,attrs,text)=>sheet.append(svg(name,attrs,text));
  add('rect',{x:9,y:9,width:402,height:279,fill:'none',stroke:'#33404c','stroke-width':.42});
  const text=(x,y,value,options={})=>add('text',{x,y,fill:'#23313b','font-family':'Segoe UI, Arial, sans-serif','font-size':3.2,...options},value);
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
          stroke:face.edges?'none':'#2e3941','stroke-width':.24,'stroke-linejoin':'round'
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
        text(center[0],dy-1.5,(max[0]-min[0]).toFixed(2)+' m',{'text-anchor':'middle','font-size':2.9});
      }
    }
    const caption=mode==='plan'?label+'  /  POTONG '+settings.cut_height.toFixed(2)+' m':label;
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
setInterval(sync,350);
openRoom();
