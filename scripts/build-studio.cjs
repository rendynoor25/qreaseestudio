const fs = require('node:fs');
const path = require('node:path');

const root = path.resolve(__dirname, '..');
const sources = ['bootstrap.js', 'comments.js', 'modeling.js', 'viewport.js', 'layout.js'];
const output = sources.map(name => fs.readFileSync(path.join(root, 'web', 'studio', name), 'utf8')).join('')
  .replaceAll("import('../cad-export.js')", "import('./cad-export.js')")
  .replaceAll("import('../skp-import.js')", "import('./skp-import.js')");
const target = path.join(root, 'web', 'studio.js');
if (process.argv.includes('--check')) {
  if (fs.readFileSync(target, 'utf8').replace(/\r\n/g, '\n') !== output.replace(/\r\n/g, '\n'))
    throw new Error('web/studio.js is stale. Run npm run build:studio and commit the generated file.');
} else fs.writeFileSync(target, output);
