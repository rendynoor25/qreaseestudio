'use strict';

// Supabase-backed preview. A room UUID in the link grants edit access.
const cloudConfig = window.qreaseeCloudConfig;
document.querySelector('#demo-badge').textContent = 'DEMO BERSAMA';
document.querySelector('#demo-badge').title = 'Ruang tersimpan di Supabase; siapa pun dengan tautan dapat mengedit';
document.querySelector('#share').hidden = false;
document.querySelector('#copy-link').disabled = false;
window.qreaseeCloudPost = true;

async function cloudRpc(name, parameters) {
  const response = await fetch(cloudConfig.url + '/rest/v1/rpc/' + name, {
    method: 'POST',
    headers: { apikey: cloudConfig.key, 'Content-Type': 'application/json' },
    body: JSON.stringify(parameters),
    signal: AbortSignal.timeout(10000)
  });
  const payload = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(payload.message || 'Supabase tidak tersedia.');
  return payload;
}

window.qreaseeDemoPost = async (url, request) => {
  try {
    if (url === '/api/rooms') {
      const document = await seedDocument();
      if (request.blank) {
        document.objects = [];
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
      peers: payload.peers || [], topology: { added: [], removed: [] }
    } };
  } catch (error) {
    const code = error.message === 'room_missing' ? 404 : error.message === 'conflict' ? 409 : 503;
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
      code === 409 ? 'Objek atau lembar sudah diubah di sesi lain.' : 'Ruang tidak ditemukan.',
      changes, peers: [] } };
  }
};
