import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile, access} from 'node:fs/promises';
import {makePayload, submit} from '../scripts/indexnow.mjs';
const out = new URL('../dist/client/', import.meta.url);
const read = file => readFile(new URL(file,out),'utf8');
const config = JSON.parse(await readFile(new URL('../indexnow.json',import.meta.url),'utf8'));

test('only versioned build assets receive immutable caching; heading preload resolves', async () => {
  const manifest = JSON.parse(await read('.vite/manifest.json'));
  const assets = new Set(Object.values(manifest).flatMap(item=>[item.file,...(item.css||[]),...(item.assets||[])]));
  const headers = await read('_headers');
  const rules = [...headers.matchAll(/^\/(\S+)\n  Cache-Control: public, max-age=31536000, immutable$/gm)].map(match=>match[1]);
  assert.deepEqual(new Set(rules),assets);
  assert.ok(!headers.includes('/*'), 'No wildcard can freeze stable public URLs');
  const sitemap = await read('sitemap.xml');
  for (const [,url] of sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)) {
    const pathname = new URL(url).pathname.replace(/\/$/,'');
    const html = await read((pathname==='/'?'':pathname.slice(1)+'/').replace(/^\//,'')+'index.html');
    const preloads = [...html.matchAll(/<link rel="preload" href="([^"]+)" as="font" type="font\/woff2" crossorigin\s*\/>/g)];
    assert.equal(preloads.length,1,url);
    assert.match(preloads[0][1],/archivo-latin-wght-normal/);
    await access(new URL('.'+preloads[0][1],out));
  }
});

test('IndexNow ownership file is deployed and payload refuses off-site/query/fragment URLs', async () => {
  assert.equal((await read(config.key+'.txt')).trim(),config.key);
  const payload=makePayload(config,['/','/']);
  assert.deepEqual(payload.urlList,[config.site+'/']);
  for(const url of ['https://example.com/','/?private=value','/#section']) assert.throws(()=>makePayload(config,[url]));
  assert.throws(()=>makePayload(config,[]));
});

test('public search crawlers can read pages and their supporting assets', async () => {
  const robots=await read('robots.txt');
  assert.match(robots,/User-agent: \*\nAllow: \//);
  assert.equal((robots.match(/User-agent:/g)||[]).length,1,'Specific bot groups must not accidentally override wildcard access');
  const blocked=[...robots.matchAll(/^Disallow:\s*(.*)$/gm)].map(match=>match[1]);
  assert.ok(blocked.every(rule=>rule==='/mcp'),'Only the non-content MCP endpoint is restricted');
  assert.ok(robots.includes(`Sitemap: ${config.site}/sitemap.xml`));
});

test('IndexNow checks live ownership before sending and distinguishes pending validation from receipt', async () => {
  const payload=makePayload(config,['/']);
  let calls=0;
  await assert.rejects(submit(payload,async()=>{calls++;return new Response('wrong');}),/ownership/);
  assert.equal(calls,1);
  for(const status of [200,202,429]) {
    const request=async(url,options)=> {
      if(url===payload.keyLocation)return new Response(config.key);
      assert.equal(url,'https://api.indexnow.org/indexnow');
      assert.equal(options.method,'POST');
      assert.deepEqual(JSON.parse(options.body),payload);
      return new Response('',{status});
    };
    if(status===429)await assert.rejects(submit(payload,request),/429/);
    else assert.match(await submit(payload,request),status===202?/pending/:/not guaranteed/);
  }
});
