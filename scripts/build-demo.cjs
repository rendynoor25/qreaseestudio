const fs = require('node:fs');
const path = require('node:path');

const root = path.resolve(__dirname, '..');
const output = path.join(root, 'dist');
fs.mkdirSync(output, { recursive: true });
const html = fs.readFileSync(path.join(root, 'web', 'index.html'), 'utf8')
  .replace('<script src="/studio.js" defer></script>',
    '<script src="/demo.js" defer></script>\n  <script src="/studio.js" defer></script>');
fs.writeFileSync(path.join(output, 'index.html'), html);
for (const name of ['studio.css', 'studio.js']) {
  fs.copyFileSync(path.join(root, 'web', name), path.join(output, name));
}
fs.copyFileSync(path.join(root, 'demo', 'demo.js'), path.join(output, 'demo.js'));
fs.copyFileSync(path.join(root, 'demo', 'seed.json'), path.join(output, 'seed.json'));
