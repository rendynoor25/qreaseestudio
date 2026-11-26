'use strict';

// Supabase-backed preview. A room UUID in the link grants edit access.
const cloudConfig = window.qreaseeCloudConfig;
document.querySelector('#share').hidden = false;
document.querySelector('#copy-link').disabled = false;
window.qreaseeCloudPost = true;

async function cloudRpc(name, parameters) {
  const session = window.qreaseeAuth ? await window.qreaseeAuth.session() : null;
  const response = await fetch(cloudConfig.url + '/rest/v1/rpc/' + name, {
    method: 'POST',
    headers: { apikey: cloudConfig.key, 'Content-Type': 'application/json',
      ...(session ? { Authorization: 'Bearer ' + session.access_token } : {}) },
    body: JSON.stringify(parameters),
    signal: AbortSignal.timeout(10000)
  });
  const payload = await response.json().catch(() => ({}));
  if (!response.ok) {
    const error = new Error(payload.message || 'Supabase tidak tersedia.');
    error.status = response.status;
    throw error;
  }
  return payload;
}

window.qreaseeDemoPost = async (url, request) => {
  try {
    if (url === '/api/rooms') {
      const document = await seedDocument();
      if (request.blank) {
        document.objects = [];
        document.comments = [];
        document.share = {role:'edit'};
        document.sheet.title = 'Proyek tanpa judul';
      }
      const room = await cloudRpc('qreasee_create_room', { p_document: document });
      return { code: 201, data: { room } };
    }
    const room = url.match(/^\/api\/rooms\/([0-9a-f-]+)$/i)?.[1];
    if (!room) return { code: 404, data: { error: 'Ruang tidak ditemukan.' } };
    const payload = await cloudRpc('qreasee_exchange', {
      p_room: room, p_client: request.client, p_name: request.name || 'Tamu',
      p_revision: request.revision, p_edit: request.edit || null, p_cursor: request.cursor || null
    });
    const document = payload.document;
    return { code: 200, data: {
      changes: document ? { document, ...demoMeshes(document) } : null,
      peers: payload.peers || [], topology: { added: [], removed: [] },
      can_manage: Boolean(payload.can_manage), role: payload.role || 'edit'
    } };
  } catch (error) {
    const commentError=['invalid_comment','invalid_target','comment_limit','invalid_share'].includes(error.message);
    const accessError=['forbidden','read_only','comment_only'].includes(error.message);
    const code = error.message === 'room_missing' ? 404 : error.message === 'conflict' ? 409 :
      commentError ? 422 : accessError ? 403 :
      error.message === 'login_required' || error.status === 401 || error.status === 403 ? 401 : 503;
    let changes;
    if (code === 409) {
      try {
        const latest = await cloudRpc('qreasee_exchange', {
          p_room: url.slice('/api/rooms/'.length), p_client: request.client,
          p_name: request.name || 'Tamu', p_revision: null, p_edit: null,
          p_cursor: request.cursor || null
        });
        changes = latest.document ? { document: latest.document, ...demoMeshes(latest.document) } : null;
      } catch { /* The next poll will retry. */ }
    }
    return { code, data: { error: code === 503 ? 'Ruang bersama belum siap: ' + error.message :
      code === 401 ? 'Sesi berakhir. Masuk kembali dengan Google.' :
      code === 403 ? (error.message === 'forbidden' ? 'Hanya pemilik proyek yang dapat mengubah akses.' :
        error.message === 'comment_only' ? 'Akses ini hanya dapat menambah komentar.' :
        'Akses ini hanya dapat melihat proyek.') :
      code === 422 ? 'Komentar atau akses tidak valid.' :
      code === 409 ? 'Objek atau lembar sudah diubah di sesi lain.' : 'Ruang tidak ditemukan.',
      changes, peers: [] } };
  }
};
