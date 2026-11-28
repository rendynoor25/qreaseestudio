const path = require('node:path');
const fs = require('node:fs');
const esbuild = require('esbuild');
const root = path.join(__dirname, '..');
function build(source, output) {
  const outfile = path.join(root, 'web', output);
  const content = esbuild.buildSync({
    entryPoints: [path.join(root, 'web', source)],
    outfile,
    write: false,
    bundle: true, minify: true, format: 'esm', platform: 'browser', target: 'es2022'
  }).outputFiles[0].text;
  if (process.argv.includes('--check')) {
    if (fs.readFileSync(outfile, 'utf8') !== content)
      throw new Error(`web/${output} is stale. Run npm run build:cad and commit the generated file.`);
  } else fs.writeFileSync(outfile, content);
}
build('cad-export.ts', 'cad-export.js');
build('skp-import.ts', 'skp-import.js');
