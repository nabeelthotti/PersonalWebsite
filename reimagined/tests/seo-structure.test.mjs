import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile, access} from 'node:fs/promises';
import path from 'node:path';
import {fileURLToPath} from 'node:url';

const root = fileURLToPath(new URL('../dist/client/', import.meta.url));
const xml = await readFile(path.join(root, 'sitemap.xml'), 'utf8');
const urls = [...xml.matchAll(/<loc>(.*?)<\/loc>/g)].map(match => match[1]);
const pages = new Map();
const key = url => new URL(url).pathname.replace(/\/$/, '') || '/';
for (const url of urls) {
  const html = await readFile(path.join(root, new URL(url).pathname, 'index.html'), 'utf8');
  pages.set(key(url), {url, html, links: [...html.matchAll(/<a\b[^>]*\bhref="([^"]+)"/g)].map(match => match[1].replaceAll('&amp;', '&'))});
}

test('all sitemap pages have distinct descriptions, one primary heading, and consistent canonical metadata', () => {
  const descriptions = new Set();
  for (const {url, html} of pages.values()) {
    // The personal site's no-JS replacement is mutually exclusive with its animated entrance.
    const activeHtml = html.replace(/<noscript>[\s\S]*?<\/noscript>/g, '');
    assert.equal((activeHtml.match(/<h1\b/g) || []).length, 1, url);
    const canonical = [...html.matchAll(/<link\b[^>]*rel="canonical"[^>]*href="([^"]+)"/g)];
    assert.equal(canonical.length, 1, url);
    assert.equal(canonical[0][1], url);
    const description = html.match(/<meta\b[^>]*name="description"[^>]*content="([^"]+)"/);
    assert.ok(description, url);
    assert.ok(!descriptions.has(description[1]), 'Duplicate description: ' + url);
    descriptions.add(description[1]);
    assert.ok(html.includes(`property="og:url" content="${url}"`), url);
    assert.ok(!/<meta[^>]*name="robots"[^>]*content="[^"]*noindex/.test(html), url);
  }
});

test('rendered local links and images resolve, and every indexed page is reachable from the homepage', async () => {
  const adjacency = new Map();
  for (const [route, {url, html, links}] of pages) {
    const destinations = [];
    for (const href of links) {
      const target = new URL(href, url);
      if (target.origin !== new URL(url).origin) continue;
      const destination = key(target.href);
      if (pages.has(destination)) {
        destinations.push(destination);
        assert.equal(target.pathname, new URL(pages.get(destination).url).pathname, `${url}: internal link redirects ${href}`);
        if (target.hash) {
          const id = decodeURIComponent(target.hash.slice(1));
          assert.ok(pages.get(destination).html.includes(`id="${id}"`), `${url}: missing anchor ${href}`);
        }
      } else {
        assert.ok(path.extname(target.pathname), `${url}: unpublished destination ${href}`);
        await access(path.join(root, decodeURIComponent(target.pathname)));
      }
    }
    adjacency.set(route, destinations);
    for (const [tag] of html.matchAll(/<img\b[^>]*>/g)) {
      assert.match(tag, /\balt="[^"]*"/, `${url}: image needs alt`);
      const source = tag.match(/\bsrc="([^"]+)"/)?.[1];
      if (source?.startsWith('/')) await access(path.join(root, decodeURIComponent(source)));
    }
  }
  const reached = new Set(), queue = ['/'];
  while (queue.length) {
    const route = queue.shift();
    if (reached.has(route)) continue;
    reached.add(route); queue.push(...(adjacency.get(route) || []));
  }
  assert.deepEqual([...pages.keys()].filter(route => !reached.has(route)), [], 'Orphan indexable pages');
});
