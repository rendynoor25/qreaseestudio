'use strict';

// Presence-only RPC load probe. Use a disposable room and an authenticated staging project.
const { randomUUID } = require('node:crypto');
const { performance } = require('node:perf_hooks');

const url = process.env.QREASEE_LOAD_URL;
const key = process.env.QREASEE_LOAD_KEY;
const token = process.env.QREASEE_LOAD_TOKEN;
const room = process.env.QREASEE_LOAD_ROOM;
const clients = Number(process.env.QREASEE_LOAD_CLIENTS || 50);
const seconds = Number(process.env.QREASEE_LOAD_SECONDS || 30);
const interval = Number(process.env.QREASEE_LOAD_INTERVAL_MS || 2000);
if (process.env.QREASEE_LOAD_ACK !== 'staging' || !url || !key || !token || !room) {
  throw new Error('Set QREASEE_LOAD_ACK=staging, URL, KEY, TOKEN, and ROOM for a disposable staging project.');
}
if (!Number.isInteger(clients) || clients < 1 || clients > 1000 ||
    !Number.isInteger(seconds) || seconds < 5 || seconds > 120 ||
    !Number.isInteger(interval) || interval < 500 || interval > 30000 ||
    !/^[0-9a-f]{8}(-[0-9a-f]{4}){3}-[0-9a-f]{12}$/i.test(room)) {
  throw new Error('Invalid load parameters. Use 1-1000 clients, 5-120 seconds, 500-30000 ms interval, and a room UUID.');
}

const sleep = ms => new Promise(resolve => setTimeout(resolve, ms));
const elapsed = [];
const statuses = new Map();
let bytes = 0;
const until = Date.now() + seconds * 1000;

async function client(index) {
  const id = randomUUID();
  let revision = null;
  await sleep(Math.floor(index * interval / clients));
  while (Date.now() < until) {
    const started = performance.now();
    try {
      const response = await fetch(url + '/rest/v1/rpc/qreasee_exchange', {
        method: 'POST',
        headers: { apikey: key, Authorization: 'Bearer ' + token,
          'Content-Type': 'application/json' },
        body: JSON.stringify({ p_room: room, p_client: id, p_name: 'Load ' + index,
          p_revision: revision, p_edit: null, p_cursor: null }),
        signal: AbortSignal.timeout(10000)
      });
      const body = await response.text();
      bytes += Buffer.byteLength(body);
      statuses.set(response.status, (statuses.get(response.status) || 0) + 1);
      elapsed.push(performance.now() - started);
      if (response.ok) revision = JSON.parse(body).document?.revision ?? revision;
    } catch {
      statuses.set('network', (statuses.get('network') || 0) + 1);
      elapsed.push(performance.now() - started);
    }
    await sleep(Math.max(0, interval - (performance.now() - started)));
  }
}

(async () => {
  await Promise.all(Array.from({ length: clients }, (_, index) => client(index)));
  elapsed.sort((a, b) => a - b);
  const percentile = p => elapsed[Math.min(elapsed.length - 1,
    Math.ceil(elapsed.length * p) - 1)]?.toFixed(0) ?? 'n/a';
  console.log(JSON.stringify({ clients, seconds, requests: elapsed.length,
    requestsPerSecond: Number((elapsed.length / seconds).toFixed(1)),
    p50ms: percentile(.5), p95ms: percentile(.95), p99ms: percentile(.99),
    responseMB: Number((bytes / 1048576).toFixed(2)),
    statuses: Object.fromEntries(statuses) }, null, 2));
})().catch(error => { console.error(error); process.exitCode = 1; });
