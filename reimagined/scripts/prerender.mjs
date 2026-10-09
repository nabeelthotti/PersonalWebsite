import { build } from 'vite';
import { readFile, writeFile, mkdir, rm, access } from 'node:fs/promises';
import { fileURLToPath, pathToFileURL } from 'node:url';
import path from 'node:path';
import { routeAliases } from '../src/lib/navigation.js';

const root = fileURLToPath(new URL('..', import.meta.url));
const client = path.join(root, 'dist/client');
const server = path.join(root, 'dist/.prerender');

// Compile the same React components used by the browser. No bot-only content,
// headless-browser dependency, or network access is needed during deployment.
await build({ root, logLevel: 'warn', build: {
  ssr: 'src/entry-server.jsx', outDir: server, emptyOutDir: true,
  rollupOptions: { output: { entryFileNames: 'entry-server.mjs' } },
} });
const { render, getIndexableRoutes, getMetadata, renderMetadata, SITE_URL, escapeHtml, getPhotos } =
  await import(pathToFileURL(path.join(server, 'entry-server.mjs')).href);
const template = (await readFile(path.join(client, 'index.html'), 'utf8'))
  .replace(/\s*<title>[\s\S]*?<\/title>/, '')
  .replace(/\s*<meta name="description"[^>]*\/>/, '');
const routes = getIndexableRoutes();
const entries = routes.map(route => getMetadata(route));

// A missing configured local photo should fail the build, not become a broken
// Google Images result. Remote photos are left to the owner's CDN to serve.
for (const entry of entries) for (const image of entry.images) {
  const url = new URL(image);
  if (url.origin === SITE_URL) await access(path.join(client, decodeURIComponent(url.pathname)));
}

const noScriptHome = `<noscript><style>.is-home{display:none}</style>
  <main class="content-page"><h1 class="page-heading">Nabeel Thotti</h1>
  <p class="page-lead">${escapeHtml(getMetadata('/').description)}</p>
  <p>The animated entrance needs JavaScript. You can read the full site here:</p>
  <nav aria-label="Website pages"><ul>${[
    ['/about', 'About Nabeel'], ['/work', 'Work and résumé'], ['/writing', 'Notes and essays'], ['/contact', 'Contact'],
  ].map(([href, label]) => `<li><a href="${href}">${label}</a></li>`).join('')}</ul></nav></main></noscript>`;

for (const route of [...routes, '/404']) {
  const meta = getMetadata(route);
  const html = template.replace('</head>', `${renderMetadata(meta)}\n</head>`)
    .replace('<div id="root"></div>', `<div id="root">${render(route)}</div>${route === '/' ? noScriptHome : ''}`);
  const file = route === '/' ? 'index.html' : route === '/404' ? '404.html' : `${route.slice(1)}/index.html`;
  await mkdir(path.dirname(path.join(client, file)), { recursive: true });
  await writeFile(path.join(client, file), html);
}

const sitemap = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">\n` +
  entries.map(entry => `  <url><loc>${escapeHtml(entry.canonical)}</loc>${entry.images.map(image => `<image:image><image:loc>${escapeHtml(image)}</image:loc></image:image>`).join('')}</url>`).join('\n') + '\n</urlset>\n';
await writeFile(path.join(client, 'sitemap.xml'), sitemap);
await writeFile(path.join(client, 'robots.txt'), `User-agent: *\nAllow: /\nDisallow: /mcp\n\nSitemap: ${SITE_URL}/sitemap.xml\n`);

const redirects = [await readFile(path.join(root, 'public/_redirects'), 'utf8')];
redirects.push('https://www.nabeelthotti.com/* https://nabeelthotti.com/:splat 301!');
for (const [from, to] of Object.entries(routeAliases)) redirects.push(`${from} ${to} 301`);
for (const prefix of ['red', 'workbench', 'door', 'poke', 'room']) {
  redirects.push(`/${prefix} / 301`, `/${prefix}/* /:splat 301`);
}
// Explicit rewrites keep direct loads working without treating unknown URLs as
// successful homepages. Existing assets continue to be served normally.
for (const route of routes.filter(route => route !== '/')) {
  redirects.push(`${route}/index.html ${route} 301!`, `${route} ${route}/index.html 200`);
}
redirects.push('/* /404.html 404');
await writeFile(path.join(client, '_redirects'), redirects.join('\n') + '\n');
await writeFile(path.join(root, 'dist/seo-manifest.json'), JSON.stringify({ entries, photos: getPhotos() }, null, 2));
await rm(server, { recursive: true, force: true });
console.log(`Pre-rendered ${routes.length} indexable pages, a 404, robots.txt, and sitemap.xml (${getPhotos().length} real personal photos).`);
