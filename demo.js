'use strict';

// Static Vercel preview: each browser stores its own editable copy of a room.
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
const demoMeshCache=new Map();

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
  const live=new Set(document.objects.map(object=>object.id));
  for(const id of demoMeshCache.keys()) if(!live.has(id)) demoMeshCache.delete(id);
  const meshes = document.objects.map(object => {
    const signature=JSON.stringify(object);
    const cached=demoMeshCache.get(object.id);
    if(cached?.signature===signature) return cached.mesh;
    const mesh=previewMesh(object);
    demoMeshCache.set(object.id,{signature,mesh,plan:null,cutHeight:null});
    return mesh;
  });
  const plans = document.objects.map((object, index) => {
    const cached=demoMeshCache.get(object.id);
    if(cached.plan && cached.cutHeight===document.sheet.cut_height) return cached.plan;
    let plan;
    if (object.plane_u) {
      const mesh=demoCopy(meshes[index]);
      plan=mesh.vertices.every(point=>point[2]>document.sheet.cut_height)
        ?{vertices:[],faces:[],cut:false}:mesh;
    } else if (object.wall_axis) {
      const mesh=demoCopy(meshes[index]);
      const cut=document.sheet.cut_height;
      if (object.z-object.depth/2>cut) plan={vertices:[],faces:[],cut:false};
      else if (object.z+object.depth/2>cut) {
        const angle=object.rotation*Math.PI/180,cos=Math.cos(angle),sin=Math.sin(angle);
        const [ax,ay]=object.wall_axis,u=[ax*cos-ay*sin,ax*sin+ay*cos],n=[u[1],-u[0]];
        plan={vertices:[-object.width/2,object.width/2].map(along=>
          [object.x+along*u[0]+object.height*n[0]/2,
            object.y+along*u[1]+object.height*n[1]/2,cut]),faces:[],cut:true};
      } else plan=mesh;
    } else if (object.z > document.sheet.cut_height) plan={ vertices: [], faces: [], cut: false };
    else {
      const mesh = demoCopy(meshes[index]);
      mesh.cut = object.height > 0 && object.z + object.height > document.sheet.cut_height;
      if (mesh.cut) mesh.vertices.forEach(vertex => { vertex[2] = Math.min(vertex[2], document.sheet.cut_height); });
      plan=mesh;
    }
    cached.plan=plan;
    cached.cutHeight=document.sheet.cut_height;
    return plan;
  });
  return { meshes, plans };
}

function demoCommentTargetExists(document,target) {
  return document.objects.some(object=>object.id===target || object.container?.id===target);
}

function demoApply(document, edit) {
  document.share=document.share || {role:'edit'};
  const role=document.share.role;
  if (edit.type !== 'share') {
    if (role === 'view') return 'read_only';
    if (role === 'comment' && edit.type !== 'comment') return 'comment_only';
  }
  if (edit.type === 'share') {
    if (JSON.stringify(document.share) !== JSON.stringify(edit.before)) return 'conflict';
    if (!['edit','comment','view'].includes(edit.after?.role)) return 'invalid_share';
    document.share={role:edit.after.role};
  } else if (edit.type === 'sheet') {
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
    if (document.comments) document.comments=document.comments
      .filter(comment=>demoCommentTargetExists(document,comment.target));
  } else if (edit.type === 'comment') {
    const comments=document.comments || [];
    const before=edit.before || null;
    const after=edit.after || null;
    if (after) {
      if (!after.id || !after.target || !String(after.text || '').trim()) return 'Komentar tidak valid.';
      if (!demoCommentTargetExists(document,after.target)) return 'Objek target sudah tidak ada.';
      if (before) {
        const index=comments.findIndex(comment=>comment.id===before.id);
        if (index<0 || JSON.stringify(comments[index])!==JSON.stringify(before)) return 'conflict';
        comments[index]=demoCopy(after);
      } else {
        if (comments.some(comment=>comment.id===after.id)) return 'conflict';
        if (comments.length>=200) return 'Batas demo adalah 200 komentar.';
        comments.push(demoCopy(after));
      }
      document.comments=comments;
    } else {
      if (!before) return 'Komentar tidak valid.';
      const index=comments.findIndex(comment=>comment.id===before.id);
      if (index<0 || JSON.stringify(comments[index])!==JSON.stringify(before)) return 'conflict';
      document.comments=comments.filter(comment=>comment.id!==before.id &&
        comment.parent!==before.id);
    }
  } else return 'Perintah tidak dikenal.';
  document.revision += 1;
  return null;
}

window.qreaseeDemoPost = async (url, request) => {
  if (url === '/api/rooms') {
    const document = await seedDocument();
    if (request.blank) {
      document.objects = [];
      document.comments = [];
      document.share = {role:'edit'};
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
    if (error) {
      const code=error==='conflict'?409:error==='read_only'||error==='comment_only'?403:422;
      return { code,
        data: { error: error === 'conflict' ? 'Objek ini sudah diubah di tab lain.' :
          error === 'read_only' ? 'Akses ini hanya dapat melihat proyek.' :
          error === 'comment_only' ? 'Akses ini hanya dapat menambah komentar.' : error,
          can_manage: true, role: document.share?.role || 'edit',
          changes: { document, ...demoMeshes(document) }, peers: [] } };
    }
    localStorage.setItem(demoKey(room), JSON.stringify(next));
    return { code: 200, data: { changes: { document: next, ...demoMeshes(next) },
      peers: [{ id: request.client, name: request.name || 'Anda', cursor: request.cursor || null }],
      topology: { added: [], removed: [] }, can_manage: true, role: next.share?.role || 'edit' } };
  }
  return { code: 200, data: {
    changes: request.revision === document.revision ? null : { document, ...demoMeshes(document) },
    peers: [{ id: request.client, name: request.name || 'Anda', cursor: request.cursor || null }],
    topology: null, can_manage: true, role: document.share?.role || 'edit'
  } };
};
