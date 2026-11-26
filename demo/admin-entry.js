import { createClient } from '@supabase/supabase-js';

const config = window.qreaseeCloudConfig || {};
const supabase = config.url && config.key ? createClient(config.url, config.key, {
  auth: { flowType: 'pkce', detectSessionInUrl: true, persistSession: true, autoRefreshToken: true }
}) : null;

const $ = selector => document.querySelector(selector);
const $$ = selector => [...document.querySelectorAll(selector)];
const SVG_NS = 'http://www.w3.org/2000/svg';

const state = {
  me: null,
  section: 'overview',
  data: Object.create(null),
  search: { users: '', projects: '' },
  loading: false,
  latency: null,
  generatedAt: null,
  timer: null
};

const numberFormat = new Intl.NumberFormat('id-ID');
const dateFormat = new Intl.DateTimeFormat('id-ID', { dateStyle: 'medium', timeStyle: 'short' });
const dateOnly = new Intl.DateTimeFormat('id-ID', { dateStyle: 'medium' });
const fmtInt = value => numberFormat.format(Number(value) || 0);
const fmtBytes = bytes => {
  let value = Number(bytes) || 0;
  if (!value) return '0 B';
  const units = ['B', 'KB', 'MB', 'GB'];
  let index = 0;
  while (value >= 1024 && index < units.length - 1) { value /= 1024; index += 1; }
  return (value >= 10 || index === 0 ? Math.round(value) : value.toFixed(1)) + ' ' + units[index];
};
const timestamp = value => {
  if (value === null || value === undefined) return NaN;
  if (typeof value === 'number') return value;
  const numeric = Number(value);
  if (Number.isFinite(numeric) && String(value).length >= 12) return numeric;
  return Date.parse(value);
};
const fmtWhen = value => {
  const ms = timestamp(value);
  return Number.isFinite(ms) ? dateFormat.format(new Date(ms)) : '—';
};
const relTime = value => {
  const ms = timestamp(value);
  if (!Number.isFinite(ms)) return '—';
  const diff = Date.now() - ms;
  if (diff < 45000) return 'baru saja';
  const minutes = Math.floor(diff / 60000);
  if (minutes < 60) return minutes + ' mnt lalu';
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return hours + ' jam lalu';
  const days = Math.floor(hours / 24);
  if (days < 30) return days + ' hari lalu';
  return dateOnly.format(new Date(ms));
};
const initials = value => String(value || '?').trim().split(/\s+/).slice(0, 2)
  .map(part => [...part][0] || '').join('').toUpperCase() || '?';

function element(tag, className, text) {
  const node = document.createElement(tag);
  if (className) node.className = className;
  if (text !== undefined) node.textContent = text;
  return node;
}
function empty(message) { return element('div', 'empty', message); }
function badge(text, className) { return element('span', 'badge ' + (className || ''), text); }
function roleBadge(role) {
  if (role === 'super') return badge('Super admin', 'super');
  if (role === 'admin') return badge('Admin', 'admin');
  return badge('Pengguna', '');
}
function accessBadge(role) {
  const label = role === 'comment' ? 'Komentar' : role === 'view' ? 'Lihat' : 'Edit';
  return badge(label, 'role-' + (role || 'edit'));
}
function uuidLink(id, label) {
  if (!/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id || '')) {
    return element('span', 'cell-title', label || '—');
  }
  const link = element('a', 'row-link', label || 'Buka');
  link.href = './#' + id;
  link.title = 'Buka proyek di Studio';
  return link;
}
function table(headers, rows, emptyText, options = {}) {
  if (!rows.length) return empty(emptyText || 'Belum ada data.');
  const wrap = element('table');
  const head = element('thead');
  const headRow = element('tr');
  for (const header of headers) {
    const th = element('th', header.className || '', header.label);
    headRow.append(th);
  }
  head.append(headRow);
  const body = element('tbody');
  for (const cells of rows) {
    const tr = element('tr');
    for (const cell of cells) {
      const td = element('td', cell?.className || '');
      if (cell instanceof Node) td.append(cell);
      else if (cell && typeof cell === 'object' && 'node' in cell) {
        td.className = cell.className || td.className;
        td.append(cell.node);
      } else td.textContent = cell === null || cell === undefined ? '—' : String(cell);
      tr.append(td);
    }
    body.append(tr);
  }
  wrap.append(head, body);
  if (options.maxHeight) wrap.parentElement && wrap.parentElement.classList.add('short');
  return wrap;
}
const cellNode = (node, className) => ({ node, className });

function showToast(message, isError = false) {
  const toast = $('#toast');
  toast.textContent = message;
  toast.classList.toggle('error', Boolean(isError));
  toast.hidden = false;
  clearTimeout(showToast.timer);
  showToast.timer = setTimeout(() => { toast.hidden = true; }, 4200);
}

function setLoading(loading) {
  state.loading = loading;
  const button = $('#refresh');
  button.disabled = loading;
  button.textContent = loading ? 'Memuat…' : 'Muat ulang';
  $('#app').classList.toggle('is-loading', loading);
}

function showGate(kind, detail = {}) {
  $('#app').hidden = true;
  $('#gate').hidden = false;
  const title = $('#gate-title');
  const message = $('#gate-message');
  const actions = $('#gate-actions');
  const extra = $('#gate-extra');
  actions.replaceChildren();
  extra.replaceChildren();
  title.textContent = 'Akses admin Qreasee';
  if (kind === 'loading') {
    message.textContent = 'Memeriksa sesi dan izin administrator.';
    return;
  }
  if (kind === 'login') {
    message.textContent = 'Masuk dengan akun Google yang terdaftar sebagai administrator.';
    const login = element('button', 'button primary', 'Masuk dengan Google');
    login.type = 'button';
    login.onclick = signIn;
    const back = element('a', 'button ghost', 'Buka Studio');
    back.href = './';
    actions.append(login, back);
    extra.append(element('p', 'form-note',
      'Jika Google mengembalikan Anda ke Studio, buka menu akun lalu pilih Dashboard admin.'));
  } else if (kind === 'denied') {
    title.textContent = 'Akun ini belum menjadi admin';
    message.textContent = (detail.email ? detail.email + ' ' : 'Akun Anda ') +
      'tidak ada dalam daftar administrator Qreasee.';
    const out = element('button', 'button', 'Keluar dari akun');
    out.type = 'button';
    out.onclick = signOut;
    const back = element('a', 'button ghost', 'Buka Studio');
    back.href = './';
    actions.append(back, out);
  } else if (kind === 'setup') {
    title.textContent = 'Aktifkan dashboard admin';
    message.textContent = 'Tabel dan fungsi admin belum ada di Supabase. Unduh skrip migrasi, jalankan satu kali di SQL Editor, lalu muat ulang halaman ini.';
    extra.append(element('code', 'gate-code', 'supabase/007_admin.sql'));
    const download = element('a', 'button ghost', 'Buka skrip migrasi');
    download.href = './admin-setup.sql';
    download.target = '_blank';
    download.rel = 'noopener';
    const editor = element('a', 'button ghost', 'Buka SQL Editor');
    editor.href = 'https://supabase.com/dashboard/project/aalfaqitfmhujoludqsr/sql/new';
    editor.target = '_blank';
    editor.rel = 'noopener';
    extra.append(download, editor);
    const retry = element('button', 'button primary', 'Muat ulang');
    retry.type = 'button';
    retry.onclick = () => location.reload();
    const back = element('a', 'button ghost', 'Buka Studio');
    back.href = './';
    actions.append(retry, back);
  } else {
    title.textContent = 'Dashboard tidak dapat dimuat';
    message.textContent = detail.message || 'Terjadi kesalahan saat menghubungi Supabase.';
    const retry = element('button', 'button primary', 'Coba lagi');
    retry.type = 'button';
    retry.onclick = boot;
    actions.append(retry);
  }
}

async function signIn() {
  if (!supabase) return;
  const { error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: { redirectTo: location.origin + location.pathname }
  });
  if (error) showToast(error.message, true);
}
async function signOut() {
  if (!supabase) return;
  await supabase.auth.signOut().catch(() => {});
  location.reload();
}

function handleError(error) {
  const message = String(error?.message || error || '');
  if (message === 'login_required') { showGate('login'); return; }
  if (message === 'forbidden') { showGate('denied', { email: state.me?.email }); return; }
  if (error?.code === 'PGRST202' || /could not find the function|does not exist/i.test(message)) {
    showGate('setup');
    return;
  }
  if (/invalid_email/.test(message)) showToast('Format email tidak valid.', true);
  else if (/invalid_role/.test(message)) showToast('Peran admin tidak valid.', true);
  else if (/last_super/.test(message)) showToast('Tidak dapat menghapus super admin terakhir.', true);
  else showToast(message || 'Permintaan gagal.', true);
}

async function rpc(name, parameters = {}) {
  if (!supabase) throw new Error('Supabase belum dikonfigurasi.');
  const { data: sessionData } = await supabase.auth.getSession();
  const session = sessionData?.session;
  if (!session) { const error = new Error('login_required'); error.code = 'login_required'; throw error; }
  const started = performance.now();
  const response = await fetch(config.url + '/rest/v1/rpc/' + name, {
    method: 'POST',
    headers: {
      apikey: config.key,
      'Content-Type': 'application/json',
      Authorization: 'Bearer ' + session.access_token
    },
    body: JSON.stringify(parameters),
    signal: AbortSignal.timeout(15000)
  });
  const payload = await response.json().catch(() => ({}));
  state.latency = Math.round(performance.now() - started);
  $('#latency').textContent = 'RPC ' + state.latency + ' ms';
  if (!response.ok) {
    const error = new Error(payload.message || payload.details || payload.hint || 'Permintaan gagal');
    error.code = payload.code;
    error.status = response.status;
    throw error;
  }
  return payload;
}

function updateMeta() {
  if (state.me) {
    $('#account-chip').textContent = (state.me.name || state.me.email || 'Admin') +
      (state.me.role === 'super' ? ' · Super admin' : ' · Admin');
    $('#account-chip').title = state.me.email || '';
  }
  $('#updated').textContent = state.generatedAt ? 'Diperbarui ' + relTime(state.generatedAt) : '';
}

function kpi({ label, value, sub, kind, title }) {
  const card = element('article', 'kpi' + (kind ? ' k-' + kind : ''));
  if (title) card.title = title;
  card.append(element('p', 'kpi-label', label), element('div', 'kpi-value', value));
  if (sub) {
    const line = element('div', 'kpi-sub');
    line.append(sub);
    card.append(line);
  }
  return card;
}

/* ---------- overview ---------- */
function renderChart(series) {
  const holder = $('#chart');
  holder.replaceChildren();
  if (!Array.isArray(series) || !series.length) { holder.append(empty('Belum ada data aktivitas.')); return; }
  const width = 760, height = 300;
  const pad = { left: 34, right: 10, top: 12, bottom: 26 };
  const innerW = width - pad.left - pad.right;
  const innerH = height - pad.top - pad.bottom;
  const maximum = Math.max(1, ...series.map(day => Math.max(Number(day.signups) || 0, Number(day.projects) || 0, Number(day.active) || 0)));
  const scale = value => innerH - (Number(value) || 0) / maximum * innerH;
  const step = innerW / series.length;
  const barWidth = Math.max(2.2, step * 0.2);
  const svg = document.createElementNS(SVG_NS, 'svg');
  svg.setAttribute('viewBox', '0 0 ' + width + ' ' + height);
  svg.setAttribute('role', 'img');
  svg.setAttribute('aria-label', 'Aktivitas 30 hari terakhir');
  const grid = document.createElementNS(SVG_NS, 'g');
  for (let line = 0; line <= 4; line += 1) {
    const y = pad.top + innerH * line / 4;
    const rule = document.createElementNS(SVG_NS, 'line');
    rule.setAttribute('x1', pad.left); rule.setAttribute('x2', width - pad.right);
    rule.setAttribute('y1', y); rule.setAttribute('y2', y);
    rule.setAttribute('stroke', '#223039'); rule.setAttribute('stroke-width', '1');
    grid.append(rule);
    const label = document.createElementNS(SVG_NS, 'text');
    label.setAttribute('x', pad.left - 7); label.setAttribute('y', y + 3.5);
    label.setAttribute('text-anchor', 'end'); label.setAttribute('font-size', '9');
    label.setAttribute('fill', '#6c7c89');
    label.textContent = String(Math.round(maximum * (4 - line) / 4));
    grid.append(label);
  }
  svg.append(grid);
  const colors = { signups: '#f0913b', projects: '#6aa6e6', active: '#5fbf8f' };
  series.forEach((day, index) => {
    const baseX = pad.left + step * index + step * 0.5;
    ['signups', 'projects', 'active'].forEach((key, offset) => {
      const value = Number(day[key]) || 0;
      const barHeight = value ? Math.max(1.5, innerH - scale(value)) : 0;
      const bar = document.createElementNS(SVG_NS, 'rect');
      bar.setAttribute('x', baseX + (offset - 1.5) * (barWidth + 1.2));
      bar.setAttribute('y', pad.top + innerH - barHeight);
      bar.setAttribute('width', barWidth);
      bar.setAttribute('height', barHeight);
      bar.setAttribute('rx', 1.5);
      bar.setAttribute('fill', colors[key]);
      bar.setAttribute('opacity', value ? '0.9' : '0.25');
      const title = document.createElementNS(SVG_NS, 'title');
      title.textContent = day.date + ' · ' + key + ': ' + value;
      bar.append(title);
      svg.append(bar);
    });
    if (index % 5 === 0 || index === series.length - 1) {
      const label = document.createElementNS(SVG_NS, 'text');
      label.setAttribute('x', baseX);
      label.setAttribute('y', height - 8);
      label.setAttribute('text-anchor', 'middle');
      label.setAttribute('font-size', '9');
      label.setAttribute('fill', '#6c7c89');
      label.textContent = String(day.date || '').slice(5);
      svg.append(label);
    }
  });
  holder.append(svg);
}

function renderOverview(data) {
  state.data.overview = data;
  state.generatedAt = data?.generated_at || new Date().toISOString();
  const totals = data?.totals || {};
  const series = data?.series || [];
  $('#overview-range').textContent = series.length
    ? '30 hari terakhir · ' + relTime(state.generatedAt)
    : 'Diperbarui ' + relTime(state.generatedAt);
  $('#kpi-grid').replaceChildren(
    kpi({ kind: 'users', label: 'Pengguna', value: fmtInt(totals.users),
      sub: '+' + fmtInt(totals.users_7d) + ' dalam 7 hari · +' + fmtInt(totals.users_today) + ' hari ini' }),
    kpi({ kind: 'projects', label: 'Proyek', value: fmtInt(totals.projects),
      sub: '+' + fmtInt(totals.projects_7d) + ' dalam 7 hari · ' + fmtInt(totals.active_24h) + ' aktif 24 jam' }),
    kpi({ kind: 'objects', label: 'Objek', value: fmtInt(totals.objects),
      sub: 'Rata-rata ' + Number(totals.avg_objects || 0) + ' per proyek' }),
    kpi({ kind: 'comments', label: 'Komentar', value: fmtInt(totals.comments),
      sub: '+' + fmtInt(totals.comments_7d) + ' dalam 7 hari' }),
    kpi({ kind: 'online', label: 'Online sekarang', value: fmtInt(totals.online),
      sub: fmtInt(totals.online_rooms) + ' proyek dibuka' }),
    kpi({ kind: 'storage', label: 'Penyimpanan', value: fmtBytes(totals.bytes),
      sub: 'Terbesar ' + fmtBytes(totals.largest_bytes) + ' · ' + fmtInt(totals.empty_projects) + ' proyek kosong' }),
    kpi({ kind: 'admin', label: 'Admin', value: fmtInt(totals.admins),
      sub: fmtInt(totals.sections) + ' bidang potong tersimpan' })
  );
  renderChart(series);
  renderOverviewProjects(data?.projects || []);
  renderOverviewOnline(data?.online || []);
  updateMeta();
  if (state.section === 'system') renderSystem(data);
}

function renderOverviewProjects(projects) {
  const holder = $('#overview-projects');
  holder.replaceChildren(table(
    [{ label: 'Proyek' }, { label: 'Pemilik' }, { label: 'Objek', className: 'num' }, { label: 'Diperbarui' }, { label: '' }],
    projects.map(project => [
      cellNode((() => {
        const wrap = element('div');
        const title = uuidLink(project.id, project.title || 'Proyek tanpa judul');
        title.className = 'cell-title row-link';
        wrap.append(title, element('div', 'cell-sub mono', String(project.id || '').slice(0, 8)));
        return wrap;
      })()),
      cellNode((() => {
        const wrap = element('div');
        wrap.append(element('div', 'cell-title', project.owner_email || 'Tanpa pemilik'));
        if (project.owner_name) wrap.append(element('div', 'cell-sub', project.owner_name));
        return wrap;
      })()),
      cellNode(String(fmtInt(project.objects)), 'num'),
      cellNode(relTime(project.updated_at)),
      cellNode(uuidLink(project.id, 'Buka'), 'num')
    ]),
    'Belum ada proyek.'
  ));
}

function renderOverviewOnline(online) {
  const holder = $('#overview-online');
  holder.replaceChildren();
  if (!online.length) { holder.append(empty('Tidak ada editor online saat ini.')); return; }
  for (const peer of online) {
    const item = element('div', 'list-item');
    const main = element('div', 'list-main');
    main.append(element('div', 'list-title', peer.name || 'Tamu'));
    const sub = element('div', 'list-sub');
    sub.append(uuidLink(peer.room, peer.title || 'Proyek tanpa judul'));
    main.append(sub);
    item.append(main, element('span', 'list-time', relTime(peer.seen_at)));
    holder.append(item);
  }
}

/* ---------- users ---------- */
function renderUsers(users) {
  state.data.users = users;
  $('#user-count').textContent = fmtInt(users.length) + ' akun';
  const holder = $('#users-table');
  holder.replaceChildren(table(
    [{ label: 'Pengguna' }, { label: 'Bergabung' }, { label: 'Login terakhir' }, { label: 'Proyek', className: 'num' }, { label: 'Objek', className: 'num' }, { label: 'Proyek terakhir' }, { label: 'Peran' }],
    users.map(user => [
      cellNode((() => {
        const wrap = element('div');
        wrap.append(element('div', 'cell-title', user.name || user.email || 'Tanpa nama'));
        wrap.append(element('div', 'cell-sub mono', user.email || ''));
        return wrap;
      })()),
      cellNode(fmtWhen(user.created_at)),
      cellNode(user.last_sign_in_at ? relTime(user.last_sign_in_at) : 'Belum pernah'),
      cellNode(fmtInt(user.projects), 'num'),
      cellNode(fmtInt(user.objects), 'num'),
      cellNode(user.last_project_at ? relTime(user.last_project_at) : '—'),
      cellNode(roleBadge(user.role))
    ]),
    state.search.users ? 'Tidak ada akun yang cocok.' : 'Belum ada pengguna.'
  ));
}

/* ---------- projects ---------- */
function renderProjects(projects) {
  state.data.projects = projects;
  $('#project-count').textContent = fmtInt(projects.length) + ' proyek';
  const holder = $('#projects-table');
  holder.replaceChildren(table(
    [{ label: 'Proyek' }, { label: 'Pemilik' }, { label: 'Objek', className: 'num' }, { label: 'Komentar', className: 'num' }, { label: 'Section', className: 'num' }, { label: 'Ukuran', className: 'num' }, { label: 'Akses' }, { label: 'Diperbarui' }, { label: '' }],
    projects.map(project => [
      cellNode((() => {
        const wrap = element('div');
        const title = uuidLink(project.id, project.title || 'Proyek tanpa judul');
        title.className = 'cell-title row-link';
        wrap.append(title, element('div', 'cell-sub mono', String(project.id || '').slice(0, 8)));
        return wrap;
      })()),
      cellNode((() => {
        const wrap = element('div');
        wrap.append(element('div', 'cell-title', project.owner_email || 'Tanpa pemilik'));
        if (project.owner_name) wrap.append(element('div', 'cell-sub', project.owner_name));
        return wrap;
      })()),
      cellNode(fmtInt(project.objects), 'num'),
      cellNode(fmtInt(project.comments), 'num'),
      cellNode(fmtInt(project.sections), 'num'),
      cellNode(fmtBytes(project.bytes), 'num'),
      cellNode(accessBadge(project.role)),
      cellNode(relTime(project.updated_at)),
      cellNode(uuidLink(project.id, 'Buka'), 'num')
    ]),
    state.search.projects ? 'Tidak ada proyek yang cocok.' : 'Belum ada proyek.'
  ));
}

/* ---------- comments ---------- */
function renderComments(comments) {
  state.data.comments = comments;
  const holder = $('#comments-list');
  holder.replaceChildren();
  if (!comments.length) { holder.append(empty('Belum ada komentar.')); return; }
  for (const comment of comments) {
    const card = element('article', 'comment-card');
    const head = element('div', 'comment-head');
    const author = element('div', 'comment-author');
    author.append(element('span', 'avatar-sm', initials(comment.author)), element('span', '', comment.author || 'Tanpa nama'));
    head.append(author, element('span', 'list-time', relTime(comment.created_at)));
    card.append(head, element('p', 'comment-text', comment.text || ''));
    const foot = element('div', 'comment-foot');
    foot.append(
      cellNode(uuidLink(comment.room, comment.title || 'Proyek tanpa judul')),
      badge(comment.resolved ? 'Selesai' : 'Terbuka', comment.resolved ? 'done' : 'open')
    );
    if (comment.reply) foot.append(badge('Balasan', ''));
    card.append(foot);
    holder.append(card);
  }
}

/* ---------- system ---------- */
function renderSystem(data) {
  const totals = data?.totals || {};
  $('#system-grid').replaceChildren(
    kpi({ kind: 'storage', label: 'Total dokumen', value: fmtBytes(totals.bytes),
      sub: 'Terbesar ' + fmtBytes(totals.largest_bytes) }),
    kpi({ kind: 'objects', label: 'Rata-rata objek', value: String(Number(totals.avg_objects || 0)),
      sub: fmtInt(totals.projects) + ' proyek' }),
    kpi({ kind: 'projects', label: 'Proyek kosong', value: fmtInt(totals.empty_projects),
      sub: 'belum punya objek' }),
    kpi({ kind: 'online', label: 'Proyek online', value: fmtInt(totals.online_rooms),
      sub: fmtInt(totals.online) + ' editor' })
  );
  const roles = [
    ['Edit', Number(totals.role_edit) || 0, ''],
    ['Komentar', Number(totals.role_comment) || 0, 'comment'],
    ['Lihat', Number(totals.role_view) || 0, 'view']
  ];
  const maximum = Math.max(1, ...roles.map(role => role[1]));
  const bars = $('#share-bars');
  bars.replaceChildren();
  for (const [label, value, kind] of roles) {
    const row = element('div', 'bar-row');
    const track = element('div', 'bar-track');
    const fill = element('div', 'bar-fill ' + kind);
    fill.style.width = (value / maximum * 100).toFixed(1) + '%';
    track.append(fill);
    row.append(element('span', '', label), track, element('b', '', fmtInt(value)));
    bars.append(row);
  }
  const health = $('#system-health');
  health.replaceChildren();
  const lines = [
    ['RPC terakhir', state.latency === null ? '—' : state.latency + ' ms'],
    ['Data dihitung', fmtWhen(state.generatedAt)],
    ['Total pengguna', fmtInt(totals.users)],
    ['Total proyek', fmtInt(totals.projects)],
    ['Total komentar', fmtInt(totals.comments)],
    ['Bidang potong', fmtInt(totals.sections)],
    ['Admin', fmtInt(totals.admins)],
    ['Zona waktu', 'UTC']
  ];
  for (const [label, value] of lines) {
    const row = element('div', 'stat-line');
    row.append(element('span', '', label), element('b', '', value));
    health.append(row);
  }
}

/* ---------- admins ---------- */
function renderAdmins(admins) {
  state.data.admins = admins;
  $('#admin-count').textContent = fmtInt(admins.length) + ' administrator';
  const holder = $('#admins-table');
  holder.replaceChildren(table(
    [{ label: 'Email' }, { label: 'Nama' }, { label: 'Peran' }, { label: 'Ditambahkan' }, { label: 'Login terakhir' }, { label: '' }],
    admins.map(admin => [
      cellNode((() => {
        const wrap = element('div');
        wrap.append(element('div', 'cell-title mono', admin.email));
        if (admin.added_by) wrap.append(element('div', 'cell-sub', 'oleh ' + admin.added_by));
        return wrap;
      })()),
      cellNode(admin.name || '—'),
      cellNode(roleBadge(admin.role)),
      cellNode(fmtWhen(admin.created_at)),
      cellNode(admin.last_sign_in_at ? relTime(admin.last_sign_in_at) : 'Belum pernah'),
      cellNode((() => {
        if (state.me?.role !== 'super') return element('span', 'cell-sub', '—');
        const button = element('button', 'button danger', 'Hapus');
        button.type = 'button';
        button.onclick = () => removeAdmin(admin.email);
        return button;
      })(), 'num')
    ]),
    'Belum ada admin.'
  ));
  $('#admin-form').hidden = state.me?.role !== 'super';
}

async function addAdmin(event) {
  event.preventDefault();
  if (state.me?.role !== 'super') return;
  const email = $('#admin-email').value.trim();
  const role = $('#admin-role').value;
  const button = event.submitter;
  if (button) button.disabled = true;
  try {
    await rpc('qreasee_admin_add', { p_email: email, p_role: role });
    $('#admin-email').value = '';
    showToast('Admin ' + email + ' disimpan.');
    await loadSection('admins', true);
    if (state.data.overview) await loadSection('overview', true);
  } catch (error) { handleError(error); }
  finally { if (button) button.disabled = false; }
}

async function removeAdmin(email) {
  if (!confirm('Hapus akses admin untuk ' + email + '?')) return;
  try {
    await rpc('qreasee_admin_remove', { p_email: email });
    showToast('Akses admin ' + email + ' dihapus.');
    await loadSection('admins', true);
    if (state.data.overview) await loadSection('overview', true);
  } catch (error) { handleError(error); }
}

/* ---------- sections ---------- */
const sectionLoaders = {
  overview: () => rpc('qreasee_admin_overview'),
  users: () => rpc('qreasee_admin_users', { p_search: state.search.users || null, p_limit: 300 }),
  projects: () => rpc('qreasee_admin_projects', { p_search: state.search.projects || null, p_limit: 300 }),
  comments: () => rpc('qreasee_admin_comments', { p_limit: 200 }),
  system: () => rpc('qreasee_admin_overview'),
  admins: () => rpc('qreasee_admin_list')
};
const renderers = {
  overview: renderOverview,
  users: renderUsers,
  projects: renderProjects,
  comments: renderComments,
  system: renderSystem,
  admins: renderAdmins
};

async function loadSection(section, force = false) {
  if (!state.me) return;
  if (section === 'system' && state.data.overview && !force) { renderSystem(state.data.overview); return; }
  if (!force && state.data[section]) {
    renderers[section](state.data[section]);
    return;
  }
  setLoading(true);
  try {
    const data = await sectionLoaders[section]();
    state.data[section] = data;
    if (section === 'overview' || section === 'system') {
      state.generatedAt = data?.generated_at || state.generatedAt;
      renderOverview(data);
      if (section === 'system') renderSystem(data);
    } else {
      renderers[section](data);
    }
  } catch (error) {
    handleError(error);
  } finally {
    setLoading(false);
  }
}

function activate(section) {
  state.section = section;
  $$('.nav-item').forEach(button => {
    const active = button.dataset.section === section;
    button.classList.toggle('active', active);
    button.setAttribute('aria-current', active ? 'page' : 'false');
  });
  $$('.panel').forEach(panel => { panel.hidden = panel.dataset.panel !== section; });
  loadSection(section);
}

function debounce(callback, delay = 320) {
  let timer;
  return (...args) => {
    clearTimeout(timer);
    timer = setTimeout(() => callback(...args), delay);
  };
}

function showApp() {
  $('#gate').hidden = true;
  $('#app').hidden = false;
  updateMeta();
}

async function boot() {
  if (!supabase || !config.url) { showGate('setup'); return; }
  showGate('loading');
  const { data: sessionData } = await supabase.auth.getSession();
  if (!sessionData?.session) { showGate('login'); return; }
  try {
    const me = await rpc('qreasee_admin_me');
    if (!me?.authenticated) { showGate('login'); return; }
    if (!me.admin) { showGate('denied', me); return; }
    state.me = me;
    showApp();
    activate('overview');
  } catch (error) { handleError(error); }
}

function wire() {
  $$('.nav-item').forEach(button => {
    button.onclick = () => activate(button.dataset.section);
  });
  $('#refresh').onclick = () => {
    if (state.section === 'system') { loadSection('overview', true); return; }
    loadSection(state.section, true);
  };
  $('#sign-out').onclick = signOut;
  $('#user-search').oninput = debounce(event => {
    state.search.users = event.target.value.trim();
    loadSection('users', true);
  });
  $('#project-search').oninput = debounce(event => {
    state.search.projects = event.target.value.trim();
    loadSection('projects', true);
  });
  $('#admin-form').onsubmit = addAdmin;
  document.addEventListener('visibilitychange', () => {
    if (!document.hidden && state.section === 'overview' && state.me && !state.loading)
      loadSection('overview', true);
  });
  state.timer = setInterval(() => {
    if (!document.hidden && state.section === 'overview' && state.me && !state.loading)
      loadSection('overview', true);
  }, 60000);
  supabase?.auth.onAuthStateChange((event) => {
    if (event === 'SIGNED_OUT') showGate('login');
  });
}

wire();
boot();

if (new URLSearchParams(location.search).has('debug')) {
  window.__qreaseeAdmin = { state, showGate, renderOverview, renderUsers, renderProjects, renderComments, renderSystem, renderAdmins, activate, loadSection };
}
