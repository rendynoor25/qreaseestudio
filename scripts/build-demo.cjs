const fs = require('node:fs');
const path = require('node:path');

const root = path.resolve(__dirname, '..');
require('./build-studio.cjs');
require('./build-line.cjs');
require('./build-cad.cjs');
const output = path.join(root, 'dist');
const cloud = process.env.QREASEE_CLOUD_DEMO === '1';
const auth = process.env.QREASEE_AUTH_DEMO === '1';
if (auth && !cloud) throw new Error('Google auth requires QREASEE_CLOUD_DEMO=1.');
const local = {};
const envFile = path.join(root, '.env.local');
if (fs.existsSync(envFile)) {
  for (const line of fs.readFileSync(envFile, 'utf8').split(/\r?\n/)) {
    const index = line.indexOf('=');
    if (index > 0) local[line.slice(0, index)] = line.slice(index + 1);
  }
}
fs.mkdirSync(output, { recursive: true });
const html = fs.readFileSync(path.join(root, 'web', 'index.html'), 'utf8')
  .replace('href="/studio.css"', 'href="./studio.css"')
  .replace('src="/line-geometry.js"', 'src="./line-geometry.js"')
  .replace('</head>', (auth ? '  <link rel="stylesheet" href="./auth.css">\n' : '') + '</head>')
  .replace(/(<body\b[^>]*>)/i, (_, bodyTag) => bodyTag + (auth ? '\n  <div id="auth-gate" role="dialog" aria-modal="true" aria-labelledby="auth-title">\n    <div class="auth-card">\n      <h1 id="auth-title">Masuk ke Qreasee</h1>\n      <p>Gunakan akun Google untuk membuka dan mengedit proyek bersama.</p>\n      <button id="google-login" disabled>Masuk dengan Google</button>\n      <p id="auth-message" role="status">Memeriksa sesi…</p>\n    </div>\n  </div>' : ''))
  .replace('<script src="/studio.js" defer></script>',
    '<script src="./demo.js" defer></script>\n  ' +
    (cloud ? '<script src="./cloud-config.js" defer></script>\n  ' +
      (auth ? '<script src="./auth.js" defer></script>\n  ' : '') +
      '<script src="./cloud.js" defer></script>\n  ' : '') +
    '<script src="./studio.js" defer></script>');
if (auth && !html.includes('id="auth-gate"')) {
  throw new Error('Authenticated demo must include the sign-in gate.');
}
fs.writeFileSync(path.join(output, 'index.html'), html);
for (const name of ['studio.css', 'studio.js', 'line-geometry.js', 'cad-export.js', 'skp-import.js', 'qreasee-logo.png', 'qreasee-logo-black.png']) {
  fs.copyFileSync(path.join(root, 'web', name), path.join(output, name));
}
fs.copyFileSync(path.join(root, 'demo', 'demo.js'), path.join(output, 'demo.js'));
fs.copyFileSync(path.join(root, 'demo', 'seed.json'), path.join(output, 'seed.json'));
for (const name of ['cloud.js', 'cloud-config.js', 'auth.js', 'auth.css', 'admin.js', 'admin.css', 'admin.html', 'admin-setup.sql']) {
  const old = path.join(output, name);
  if (fs.existsSync(old)) fs.unlinkSync(old);
}
if (cloud) {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL || local.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY || local.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;
  if (!url || !key) throw new Error('Supabase URL and publishable key are required for cloud demo.');
  fs.copyFileSync(path.join(root, 'demo', 'cloud.js'), path.join(output, 'cloud.js'));
  fs.writeFileSync(path.join(output, 'cloud-config.js'),
    'window.qreaseeCloudConfig = ' + JSON.stringify({ url, key }) + ';\n');
}
if (auth) {
  require('esbuild').buildSync({
    entryPoints: [path.join(root, 'demo', 'auth-entry.js')],
    outfile: path.join(output, 'auth.js'), bundle: true, minify: true,
    format: 'iife', platform: 'browser', target: 'es2022'
  });
  fs.copyFileSync(path.join(root, 'demo', 'auth.css'), path.join(output, 'auth.css'));
  fs.copyFileSync(path.join(root, 'demo', 'admin.html'), path.join(output, 'admin.html'));
  fs.copyFileSync(path.join(root, 'demo', 'admin.css'), path.join(output, 'admin.css'));
  require('esbuild').buildSync({
    entryPoints: [path.join(root, 'demo', 'admin-entry.js')],
    outfile: path.join(output, 'admin.js'), bundle: true, minify: true,
    format: 'iife', platform: 'browser', target: 'es2022'
  });
  fs.copyFileSync(path.join(root, 'supabase', '007_admin.sql'), path.join(output, 'admin-setup.sql'));
}
