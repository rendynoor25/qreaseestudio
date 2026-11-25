const fs = require('node:fs');
const path = require('node:path');

const file = path.resolve(__dirname, '..', '.env.local');
if (!fs.existsSync(file)) {
  console.error('Missing .env.local. Copy .env.example and fill in your Supabase values.');
  process.exitCode = 1;
} else {
  const settings = {};
  for (const line of fs.readFileSync(file, 'utf8').split(/\r?\n/)) {
    const index = line.indexOf('=');
    if (index > 0) settings[line.slice(0, index).trim()] = line.slice(index + 1).trim();
  }
  const url = settings.NEXT_PUBLIC_SUPABASE_URL;
  const key = settings.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;
  if (!url?.startsWith('https://') || !key?.startsWith('sb_publishable_')) {
    console.error('Supabase URL or publishable key is missing or malformed.');
    process.exitCode = 1;
  } else {
    fetch(new URL('/auth/v1/settings', url), {
      headers: { apikey: key }, signal: AbortSignal.timeout(10000)
    }).then(response => {
      if (!response.ok) throw new Error('Supabase returned HTTP ' + response.status);
      console.log('Supabase connection OK.');
    }).catch(error => {
      console.error('Supabase connection failed: ' + error.message);
      process.exitCode = 1;
    });
  }
}
