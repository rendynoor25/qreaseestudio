import { createClient } from '@supabase/supabase-js';

const config = window.qreaseeCloudConfig;
const supabase = createClient(config.url, config.key, {
  auth: { flowType: 'pkce', detectSessionInUrl: true,
    persistSession: true, autoRefreshToken: true }
});
const gate = document.querySelector('#auth-gate');
const message = document.querySelector('#auth-message');
const login = document.querySelector('#google-login');
const pendingRoomKey = 'qreasee-auth-pending-room';
const roomHashPattern = /^#[0-9a-f]{8}(-[0-9a-f]{4}){3}-[0-9a-f]{12}$/i;
let currentUser = null;

function showAccount(user) {
  currentUser = user;
  gate.hidden = true;
}

async function revealAdmin(session) {
  const link = document.querySelector('#admin-link');
  if (!link) return;
  try {
    const response = await fetch(config.url + '/rest/v1/rpc/qreasee_admin_me', {
      method: 'POST',
      headers: { apikey: config.key, 'Content-Type': 'application/json',
        Authorization: 'Bearer ' + session.access_token },
      body: '{}'
    });
    if (!response.ok) return;
    const me = await response.json();
    if (me && me.admin) link.hidden = false;
  } catch { /* The admin dashboard may not be enabled yet. */ }
}

login.onclick = async () => {
  login.disabled = true;
  message.textContent = 'Membuka Google…';
  if (roomHashPattern.test(location.hash)) sessionStorage.setItem(pendingRoomKey, location.hash);
  const { error } = await supabase.auth.signInWithOAuth({
    provider: 'google', options: { redirectTo: location.origin + location.pathname }
  });
  if (error) { message.textContent = error.message; login.disabled = false; }
};

const ready = (async () => {
  const { data, error } = await supabase.auth.getSession();
  if (error) message.textContent = error.message;
  if (!data.session?.user) {
    login.disabled = false;
    if (!error) message.textContent = new URLSearchParams(location.search).get('error_description') ||
      'Gunakan akun Google untuk membuka proyek.';
    return null;
  }
  const stored = sessionStorage.getItem(pendingRoomKey);
  const pending = stored && roomHashPattern.test(stored) ? stored : '';
  const roomHash = roomHashPattern.test(location.hash) ? location.hash : pending;
  if (pending || location.search) {
    history.replaceState(null, '', location.pathname + roomHash);
  }
  sessionStorage.removeItem(pendingRoomKey);
  showAccount(data.session.user);
  revealAdmin(data.session);
  document.querySelector('#share-dialog > p').textContent =
    'Akun Google yang memiliki tautan ini dapat mengedit proyek.';
  return data.session;
})();

window.qreaseeAuth = {
  ready,
  get userId() { return currentUser?.id || ''; },
  get recentProjects() {
    const projects=currentUser?.user_metadata?.qreasee_recent_projects;
    return Array.isArray(projects)?projects:[];
  },
  async rememberProject(project) {
    await ready;
    if (!project || !roomHashPattern.test('#'+project.id)) return;
    const safeProject={id:project.id,title:String(project.title||'Proyek tanpa judul').slice(0,80),
      updatedAt:Number(project.updatedAt)||Date.now()};
    const current = Array.isArray(currentUser?.user_metadata?.qreasee_recent_projects)
      ? currentUser.user_metadata.qreasee_recent_projects.filter(item =>
        item && roomHashPattern.test('#'+item.id)) : [];
    const recent = [safeProject, ...current.filter(item => item.id !== safeProject.id)].slice(0, 30);
    const { data, error } = await supabase.auth.updateUser({ data: { qreasee_recent_projects: recent } });
    if (!error && data.user) currentUser = data.user;
  },
  async session() {
    await ready;
    const { data, error } = await supabase.auth.getSession();
    if (error || !data.session) throw new Error('login_required');
    return data.session;
  },
  get displayName() {
    return currentUser?.user_metadata?.full_name || currentUser?.email || 'Akun Google';
  },
  get avatarUrl() {
    const meta=currentUser?.user_metadata;
    return meta?.avatar_url || meta?.picture || '';
  },
  get email() {
    return currentUser?.email || '';
  },
  async signOut() {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
    location.reload();
  }
};
