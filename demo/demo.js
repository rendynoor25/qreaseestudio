'use strict';

// Static Vercel preview: each browser stores its own editable copy of a room.
document.querySelector('#demo-badge').hidden = false;
document.querySelector('#share').addEventListener('click', () => {
  if (window.qreaseeCloudPost) return;
  queueMicrotask(() => {
    document.querySelector('#share-feedback').textContent =
      'Demo Vercel ini menyimpan model hanya di browser ini. Untuk uji bersama, buka ruang dari server Rust atau aktifkan penyimpanan Supabase.';
  });
});
document.querySelector('#copy-link').disabled = true;

const demoCopy = value => JSON.parse(JSON.stringify(value));
const demoKey = room => 'qreasee-demo-room:' + room;
let demoSeed;

async function seedDocument() {
  if (!demoSeed) {
    demoSeed = fetch('./seed.json').then(response => {
      if (!response.ok) throw new Error('Contoh proyek tidak tersedia.');
      return response.json();
    });
  }
  return demoCopy(await demoSeed);
}

function demoMeshes(document) {
  const meshes = document.objects.map(object => previewMesh(object));
  const plans = document.objects.map((object, index) => {
    if (object.z > document.sheet.cut_height) return { vertices: [], faces: [], cut: false };
    const mesh = demoCopy(meshes[index]);
    mesh.cut = object.height > 0 && object.z + object.height > document.sheet.cut_height;
    if (mesh.cut) mesh.vertices.forEach(vertex => { vertex[2] = Math.min(vertex[2], document.sheet.cut_height); });
    return mesh;
  });
  return { meshes, plans };
}

function demoApply(document, edit) {
  if (edit.type === 'sheet') {
    if (JSON.stringify(document.sheet) !== JSON.stringify(edit.before)) return 'conflict';
    document.sheet = demoCopy(edit.after);
  } else if (edit.type === 'object' || edit.type === 'batch') {
    const before = edit.type === 'object' ? (edit.before ? [edit.before] : []) : edit.before;
    const after = edit.type === 'object' ? (edit.after ? [edit.after] : []) : edit.after;
    if (!before.length && !after.length) return 'Perubahan kosong.';
    for (const source of before) {
      const current = document.objects.find(object => object.id === source.id);
      if (JSON.stringify(current) !== JSON.stringify(source)) return 'conflict';
    }
    if (after.some(object => document.objects.some(current => current.id === object.id) &&
      !before.some(source => source.id === object.id))) return 'conflict';
    const updates = new Map(after.map(object => [object.id, object]));
    const removed = new Set(before.map(object => object.id));
    document.objects = document.objects.flatMap(object => removed.has(object.id)
      ? updates.has(object.id) ? [demoCopy(updates.get(object.id))] : [] : [object]);
    document.objects.push(...after.filter(object => !before.some(source => source.id === object.id)).map(demoCopy));
    if (document.objects.length > 250) return 'Batas demo adalah 250 objek.';
  } else return 'Perintah tidak dikenal.';
  document.revision += 1;
  return null;
}

window.qreaseeDemoPost = async (url, request) => {
  if (url === '/api/rooms') {
    const document = await seedDocument();
    if (request.blank) {
      document.objects = [];
      document.sheet.title = 'Proyek tanpa judul';
    }
    const room = crypto.randomUUID();
    localStorage.setItem(demoKey(room), JSON.stringify(document));
    return { code: 201, data: { room } };
  }
  const room = url.match(/^\/api\/rooms\/([0-9a-f-]+)$/i)?.[1];
  const saved = room && localStorage.getItem(demoKey(room));
  if (!saved) return { code: 404, data: { error: 'Ruang demo tidak ditemukan di browser ini.' } };
  const document = JSON.parse(saved);
  if (request.edit) {
    const next = demoCopy(document);
    const error = demoApply(next, request.edit);
    if (error) return { code: error === 'conflict' ? 409 : 422,
      data: { error: error === 'conflict' ? 'Objek ini sudah diubah di tab lain.' : error,
        changes: { document, ...demoMeshes(document) }, peers: [] } };
    localStorage.setItem(demoKey(room), JSON.stringify(next));
    return { code: 200, data: { changes: { document: next, ...demoMeshes(next) },
      peers: [{ id: request.client, name: request.name || 'Anda', cursor: request.cursor || null }],
      topology: { added: [], removed: [] } } };
  }
  return { code: 200, data: {
    changes: request.revision === document.revision ? null : { document, ...demoMeshes(document) },
    peers: [{ id: request.client, name: request.name || 'Anda', cursor: request.cursor || null }],
    topology: null
  } };
};
