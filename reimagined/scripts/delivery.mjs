import {readFile, writeFile} from 'node:fs/promises';
import path from 'node:path';

// Use Vite's manifest, never a wildcard: public images/PDFs have stable URLs
// and must remain revalidatable when the owner replaces them.
export async function prepareDelivery(out) {
  const manifest = JSON.parse(await readFile(path.join(out, '.vite/manifest.json'), 'utf8'));
  const assets = new Set(Object.values(manifest).flatMap(item => [item.file, ...(item.css || []), ...(item.assets || [])]));
  const font = [...assets].find(file => /\/archivo-latin-wght-normal-[\w-]+\.woff2$/.test(file));
  if (!font) throw new Error('Missing primary heading font in build manifest');
  const headers = [...assets].sort().map(file => `/${file}\n  Cache-Control: public, max-age=31536000, immutable\n`).join('\n');
  await writeFile(path.join(out, '_headers'), '# Generated: content-addressed build assets only. HTML keeps Netlify revalidation.\n' + headers);
  return `<link rel="preload" href="/${font}" as="font" type="font/woff2" crossorigin />`;
}
