const path = require('node:path');
require('esbuild').buildSync({
  entryPoints: [path.join(__dirname, '..', 'web', 'cad-export.ts')],
  outfile: path.join(__dirname, '..', 'web', 'cad-export.js'),
  bundle: true, minify: true, format: 'esm', platform: 'browser', target: 'es2022'
});
require('esbuild').buildSync({
  entryPoints: [path.join(__dirname, '..', 'web', 'skp-import.ts')],
  outfile: path.join(__dirname, '..', 'web', 'skp-import.js'),
  bundle: true, minify: true, format: 'esm', platform: 'browser', target: 'es2022'
});
