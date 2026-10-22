import test from 'node:test';
import assert from 'node:assert/strict';
import { resolveLocation, pagePath } from '../src/lib/navigation.js';
test('Retired edition bookmarks retain their destination on the single red site', () => {
  for (const prefix of ['red', 'workbench', 'door']) {
    const page = resolveLocation(`/${prefix}/work/rekognize`);
    assert.equal(page.variant, 'red');
    assert.equal(page.route, '/work/rekognize');
    assert.equal(page.href('/writing'), '/writing/');
  }
});
test('Canonical navigation has no edition prefix', () => {
  const page = resolveLocation('/how-i-work');
  assert.equal(page.route, '/how-i-work');
  assert.equal(page.href('/'), '/');
  assert.equal(page.href('/work/beel'), '/work/beel/');
});
test('Existing portfolio routes resolve to current destinations', () => {
  assert.equal(resolveLocation('/rekognize').route, '/work/rekognize');
  assert.equal(resolveLocation('/projects').route, '/work');
  assert.equal(resolveLocation('/articles').route, '/writing');
});
test('Each interactive entrance preserves its full-site navigation and deep links', () => {
  for (const hero of ['poke', 'room']) {
    const page = resolveLocation(`/${hero}/work/beel`);
    assert.equal(page.hero, hero);
    assert.equal(page.route, '/work/beel');
    assert.equal(page.canonicalPath, `/${hero}/work/beel/`);
    assert.equal(page.href('/'), `/${hero}/`);
    assert.equal(page.href('/writing#videos'), `/${hero}/writing/#videos`);
    assert.equal(resolveLocation(`/${hero}`).route, '/');
  }
});

test('page URLs match directory serving without changing files or anchors', () => {
  for (const [input, expected] of [
    ['/about', '/about/'], ['/about/', '/about/'],
    ['/work/chess?source=test#details', '/work/chess/?source=test#details'],
    ['/assets/photos/portrait.jpg', '/assets/photos/portrait.jpg'],
    ['/sitemap.xml', '/sitemap.xml'], ['/#life', '/#life'],
    ['#main', '#main'], ['https://trybeel.app/', 'https://trybeel.app/'],
  ]) assert.equal(pagePath(input), expected);
  assert.equal(resolveLocation('/about/').canonicalPath, '/about/');
});
