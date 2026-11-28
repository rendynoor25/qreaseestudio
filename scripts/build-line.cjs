const path = require('node:path');
const fs = require('node:fs');
const esbuild = require('esbuild');

const outfile = path.resolve(__dirname, '..', 'web', 'line-geometry.js');
const output = esbuild.buildSync({
  entryPoints: [path.resolve(__dirname, '..', 'web', 'line-geometry.ts')],
  outfile,
  write: false,
  bundle: true,
  format: 'iife',
  globalName: 'QreaseeLine',
  platform: 'browser',
  target: 'es2022'
}).outputFiles[0].text.replace(/(?:\.\.\/)+node_modules\//g, 'node_modules/');
if (process.argv.includes('--check')) {
  if (fs.readFileSync(outfile, 'utf8') !== output)
    throw new Error('web/line-geometry.js is stale. Run npm run build:line and commit the generated file.');
} else fs.writeFileSync(outfile, output);
