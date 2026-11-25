const fs = require('node:fs');
const path = require('node:path');

const root = path.resolve(__dirname, '..');
const output = path.join(root, 'dist');
const cloud = process.env.QREASEE_CLOUD_DEMO === '1';
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
  .replace('<script src="/studio.js" defer></script>',
    '<script src="/demo.js" defer></script>\n  ' +
    (cloud ? '<script src="/cloud-config.js" defer></script>\n  <script src="/cloud.js" defer></script>\n  ' : '') +
    '<script src="/studio.js" defer></script>');
fs.writeFileSync(path.join(output, 'index.html'), html);
for (const name of ['studio.css', 'studio.js']) {
  fs.copyFileSync(path.join(root, 'web', name), path.join(output, name));
}
fs.copyFileSync(path.join(root, 'demo', 'demo.js'), path.join(output, 'demo.js'));
fs.copyFileSync(path.join(root, 'demo', 'seed.json'), path.join(output, 'seed.json'));
for (const name of ['cloud.js', 'cloud-config.js']) {
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
