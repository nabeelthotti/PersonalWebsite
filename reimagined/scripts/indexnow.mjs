import {readFile} from 'node:fs/promises';
import {fileURLToPath} from 'node:url';
import path from 'node:path';

export function makePayload(config, urls) {
  const origin = new URL(config.site).origin;
  if (!/^https:\/\//.test(origin) || !/^[a-f0-9]{32}$/.test(config.key)) throw new Error('Invalid IndexNow configuration');
  const urlList = [...new Set(urls.map(value => {
    const url = new URL(value, origin);
    if (url.origin !== origin || url.search || url.hash || url.username || url.password) throw new Error('Only canonical URLs on this site may be submitted');
    return url.href;
  }))];
  if (!urlList.length || urlList.length > 10000) throw new Error('Submit between 1 and 10,000 URLs');
  return {host:new URL(origin).host, key:config.key, keyLocation:`${origin}/${config.key}.txt`, urlList};
}

export async function submit(payload, request = fetch) {
  const keyResponse = await request(payload.keyLocation, {redirect:'error', signal:AbortSignal.timeout(15000)});
  if (!keyResponse.ok || (await keyResponse.text()).trim() !== payload.key) throw new Error('Deploy and verify the ownership file before submitting');
  const response = await request('https://api.indexnow.org/indexnow', {
    method:'POST', headers:{'Content-Type':'application/json'}, body:JSON.stringify(payload), signal:AbortSignal.timeout(30000),
  });
  if (![200,202].includes(response.status)) throw new Error(`IndexNow rejected the request (HTTP ${response.status})`);
  return response.status === 200 ? 'Received by IndexNow; indexing is not guaranteed.' : 'Received by IndexNow; ownership validation is pending. Indexing is not guaranteed.';
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const root = fileURLToPath(new URL('..', import.meta.url));
  const config = JSON.parse(await readFile(path.join(root,'indexnow.json'),'utf8'));
  const args = process.argv.slice(2);
  const unknown = args.filter(arg => arg.startsWith('--') && !['--all','--submit'].includes(arg));
  if (unknown.length) throw new Error('Unknown flags: ' + unknown.join(', '));
  let urls = args.filter(arg => !arg.startsWith('--'));
  if (args.includes('--all')) {
    if (urls.length) throw new Error('Choose --all or explicit changed URLs');
    const sitemap = await readFile(path.join(root,'dist/client/sitemap.xml'),'utf8');
    urls = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map(match => match[1].replaceAll('&amp;','&'));
  }
  const payload = makePayload(config, urls);
  if (args.includes('--submit')) console.log(await submit(payload));
  else console.log(JSON.stringify({mode:'dry run',host:payload.host,urls:payload.urlList},null,2));
}
