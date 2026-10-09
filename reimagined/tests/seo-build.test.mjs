import test, { after } from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { createServer } from 'vite';

const client = new URL('../dist/client/', import.meta.url);
const read = file => readFile(new URL(file, client), 'utf8');
const { entries } = JSON.parse(await readFile(new URL('../dist/seo-manifest.json', import.meta.url), 'utf8'));
const server = await createServer({ root: fileURLToPath(new URL('..', import.meta.url)), server: { middlewareMode: true, hmr: false, ws: false }, optimizeDeps: { noDiscovery: true, include: [] }, appType: 'custom', logLevel: 'error' });
after(() => server.close());
const seo = await server.ssrLoadModule('/src/lib/seo.js');
const data = await server.ssrLoadModule('/src/data.js');
const travel = await server.ssrLoadModule('/src/data/travel.js');
const interiors = await server.ssrLoadModule('/src/data/interiors.js');

test('every indexable route has real HTML, unique metadata, a canonical and parseable structured data', async () => {
  const titles = new Set();
  for (const entry of entries) {
    const html = await read(entry.path === '/' ? 'index.html' : `${entry.path.slice(1)}/index.html`);
    assert.ok(!html.includes('<div id="root"></div>'), entry.path);
    assert.match(html, /<h1\b/);
    assert.ok(html.includes(`href="${entry.canonical}"`));
    assert.match(html, /content="index, follow, max-image-preview:large"/);
    assert.equal((html.match(/<title>/g) || []).length, 1);
    assert.equal((html.match(/name="description"/g) || []).length, 1);
    const title = html.match(/<title>(.*?)<\/title>/)[1];
    assert.ok(!titles.has(title), `Duplicate title: ${title}`); titles.add(title);
    const graph = JSON.parse(html.match(/<script data-seo type="application\/ld\+json">([\s\S]*?)<\/script>/)[1]);
    assert.equal(graph['@graph'].find(node => node['@type'] === 'Person').name, 'Nabeel Thotti');
    assert.ok(!entry.canonical.includes('localhost'));
  }
});

test('biography, all project links, and complete essays are present before JavaScript runs', async () => {
  const about = await read('about/index.html');
  for (const paragraph of data.profile.about) assert.ok(about.includes(seo.escapeHtml(paragraph)), paragraph);
  const work = await read('work/index.html');
  for (const project of data.projects) assert.ok(work.includes(`href="/work/${project.slug}"`));
  for (const article of data.articles) {
    const html = await read(`writing/${article.slug}/index.html`);
    for (const block of article.blocks) assert.ok(html.replaceAll('&#x27;', '&#39;').includes(seo.escapeHtml(block.text)), `${article.slug}: ${block.text.slice(0, 80)}`);
    assert.match(html, /rel="author"/);
  }
  const home = await read('index.html');
  assert.match(home, /<noscript>/);
  assert.match(home, /href="\/about"/);
});

test('sitemap only lists canonical pages and real image files', async () => {
  const xml = await read('sitemap.xml');
  const urls = [...xml.matchAll(/<loc>(.*?)<\/loc>/g)].map(match => match[1]);
  assert.deepEqual(urls, entries.map(entry => entry.canonical));
  assert.equal(new Set(urls).size, urls.length);
  assert.ok(!urls.some(url => /\/(poke|room|red|404)(\/|$)/.test(url)));
  assert.ok(!xml.includes('placeholder'));
  assert.match(xml, /<image:loc>https:\/\/nabeelthotti.com\/assets\/legacy\//);
});

test('all supplied slideshow images are in About HTML before interaction', async () => {
  const html = await read('about/index.html');
  const imageTags = [...html.matchAll(/<img\b[^>]*>/g)].map(match => match[0]);
  const photos = [
    ...travel.travelPlaces.filter(place => place.photo).map(place => ({ src: place.photo, alt: place.alt })),
    ...interiors.interiorPhotos.filter(photo => photo.src),
  ];
  for (const photo of photos) {
    const tag = imageTags.find(tag => tag.includes(`src="${seo.escapeHtml(photo.src)}"`));
    assert.ok(tag, `Photo missing from HTML: ${photo.src}`);
    assert.ok(tag.includes(`alt="${seo.escapeHtml(photo.alt)}"`));
    assert.ok(tag.includes('loading="lazy"'));
  }
  assert.ok(!html.includes('All photos &amp; memories'));
});

test('unknown routes cannot become indexable successful homepages on Netlify', async () => {
  const rules = await read('_redirects');
  assert.match(rules, /\/\* \/404.html 404/);
  assert.ok(!rules.includes('/* /index.html 200'));
  assert.match(rules, /\/mcp https:\/\/tech-detect-mcp/);
  assert.match(rules, /\/projects \/work 301/);
  assert.match(rules, /\/poke\/\* \/:splat 301/);
  assert.match(await read('404.html'), /content="noindex, follow"/);
  assert.equal(seo.getMetadata('/not-real').robots, 'noindex, follow');
  assert.equal(seo.getMetadata('/work/not-real').known, false);
});

test('search crawlers can access public pages and the real sitemap', async () => {
  const robots = await read('robots.txt');
  assert.match(robots, /^User-agent: \*\nAllow: \/\n/);
  assert.match(robots, /Sitemap: https:\/\/nabeelthotti.com\/sitemap.xml/);
  assert.ok(!robots.includes('<html'));
});

test('photos stay discoverable on About without standalone album pages', () => {
  const before = data.profile.portrait;
  const previousTravel = { ...travel.travelPlaces[0] };
  const previousInterior = { ...interiors.interiorPhotos[0] };
  try {
    data.profile.portrait = { src: '/assets/photos/nabeel-thotti.jpg', alt: 'Nabeel Thotti in San Francisco', width: 1200, height: 1500 };
    travel.travelPlaces[0].photo = '/assets/photos/nabeel-thotti-usa.jpg';
    interiors.interiorPhotos[0].src = '/assets/photos/living-room.jpg';
    const routes = seo.getIndexableRoutes();
    assert.ok(!routes.some(route => route.startsWith('/photos')));
    const portrait = seo.getMetadata('/about');
    assert.equal(portrait.images[0], 'https://nabeelthotti.com/assets/photos/nabeel-thotti.jpg');
    const imageObjects = portrait.structuredData['@graph'].filter(node => node['@type'] === 'ImageObject');
    for (const image of ['nabeel-thotti.jpg', 'nabeel-thotti-usa.jpg', 'living-room.jpg']) {
      const url = `https://nabeelthotti.com/assets/photos/${image}`;
      assert.ok(portrait.images.includes(url));
      assert.ok(imageObjects.some(node => node.contentUrl === url));
    }
    assert.equal(imageObjects.length, portrait.images.length);
    assert.equal(seo.getMetadata('/about').structuredData['@graph'][0].image, portrait.images[0]);
    assert.equal(seo.getMetadata('/photos/travel-canada').known, false);
  } finally {
    data.profile.portrait = before;
    Object.assign(travel.travelPlaces[0], previousTravel);
    Object.assign(interiors.interiorPhotos[0], previousInterior);
  }
  if (!before?.src) assert.ok(!seo.getMetadata('/about').structuredData['@graph'][0].image);
});

test('metadata safely escapes user-edited copy and canonicals discard retired editions', () => {
  assert.equal(seo.getMetadata('/poke/work/beel').canonical, 'https://nabeelthotti.com/work/beel');
  const value = { text: '</script><script>alert("test")</script>' };
  const json = seo.serializeJsonLd(value);
  assert.ok(!json.includes('</script>'));
  assert.deepEqual(JSON.parse(json), value);
  assert.equal(seo.escapeHtml('A & "B" < C'), 'A &amp; &quot;B&quot; &lt; C');
});
