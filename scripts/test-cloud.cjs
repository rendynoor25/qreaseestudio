'use strict';

// Integration smoke test. Creates one small room in the configured Supabase project.
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const { randomUUID } = require('node:crypto');

const envFile = path.join(__dirname, '..', '.env.local');
const local = Object.fromEntries((fs.existsSync(envFile) ? fs.readFileSync(envFile, 'utf8') : '')
  .split(/\r?\n/).filter(line => line.includes('=')).map(line => {
    const at = line.indexOf('=');
    return [line.slice(0, at), line.slice(at + 1)];
  }));
const url = process.env.NEXT_PUBLIC_SUPABASE_URL || local.NEXT_PUBLIC_SUPABASE_URL;
const key = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY || local.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;
const accessToken = process.env.QREASEE_TEST_ACCESS_TOKEN;
if (!url || !key) throw new Error('Supabase configuration is missing.');

async function rpc(name, parameters, expected = 200, token = accessToken) {
  const response = await fetch(url + '/rest/v1/rpc/' + name, {
    method: 'POST', headers: { apikey: key, 'Content-Type': 'application/json',
      ...(token ? { Authorization: 'Bearer ' + token } : {}) },
    body: JSON.stringify(parameters), signal: AbortSignal.timeout(10000)
  });
  const body = await response.json();
  assert.equal(response.status, expected, `${name}: ${body.message || response.status}`);
  return body;
}

const sheet = { title: 'Uji kolaborasi', number: 'T-001', scale: 100,
  notes: '', cut_height: 1.2 };
const object = (id, x) => ({ id, name: 'Objek uji', shape: 'rectangle', x, y: 0, z: 0,
  width: 1, depth: 1, height: 1, rotation: 0, color: '#abcdef' });
const [a, b] = [randomUUID(), randomUUID()];

(async () => {
  const room = await rpc('qreasee_create_room', { p_document: {
    revision: 0, objects: [], sheet, faces_initialized: true
  } });
  const exchange = (client, revision, edit = null) => rpc('qreasee_exchange', {
    p_room: room, p_client: client, p_name: client === a ? 'Klien A' : 'Klien B',
    p_revision: revision, p_edit: edit, p_cursor: null
  });
  const first = object(randomUUID(), 0);
  const created = await exchange(a, 0, { type: 'object', before: null, after: first });
  assert.equal(created.document.revision, 1);
  const seen = await exchange(b, 0);
  assert.equal(seen.document.objects[0].id, first.id);
  assert.equal(seen.peers.length, 2);
  assert.equal(seen.online_count, 2);
  const changed = object(first.id, 1);
  const updated = await exchange(a, 1, { type: 'object', before: first, after: changed });
  assert.equal(updated.document.revision, 2);
  const conflict = await rpc('qreasee_exchange', {
    p_room: room, p_client: b, p_name: 'Klien B', p_revision: 1,
    p_edit: { type: 'object', before: first, after: object(first.id, 2) },
    p_cursor: null
  }, 400);
  assert.equal(conflict.message, 'conflict');
  const second = object(randomUUID(), 3);
  const merged = await exchange(b, 1, { type: 'object', before: null, after: second });
  assert.equal(merged.document.revision, 3);
  assert.deepEqual(merged.document.objects.map(item => item.id), [first.id, second.id]);
  const latest = await exchange(a, 2);
  assert.equal(latest.document.revision, 3);
  const renamedSheet = { ...latest.document.sheet, title: 'Uji nama pemilik' };
  const renamed = await exchange(a, 3, {
    type: 'sheet', before: latest.document.sheet, after: renamedSheet
  });
  assert.equal(renamed.document.sheet.title, renamedSheet.title);
  if (process.env.QREASEE_TEST_COLLABORATOR_TOKEN) {
    const denied = await rpc('qreasee_exchange', {
      p_room: room, p_client: b, p_name: 'Kolaborator', p_revision: 4,
      p_edit: { type: 'sheet', before: renamedSheet,
        after: { ...renamedSheet, title: 'Tidak boleh diganti' } }, p_cursor: null
    }, 400, process.env.QREASEE_TEST_COLLABORATOR_TOKEN);
    assert.equal(denied.message, 'forbidden_project_name');
  }
  console.log('Supabase collaboration OK: revisions, conflict, merge, owner sheet name and online count.');
})().catch(error => { console.error(error.message); process.exitCode = 1; });
