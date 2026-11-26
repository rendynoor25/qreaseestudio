const path = require('node:path');
const esbuild = require('esbuild');

esbuild.buildSync({
  entryPoints: [path.resolve(__dirname, '..', 'web', 'line-geometry.ts')],
  outfile: path.resolve(__dirname, '..', 'web', 'line-geometry.js'),
  bundle: true,
  format: 'iife',
  globalName: 'QreaseeLine',
  platform: 'browser',
  target: 'es2022'
});
