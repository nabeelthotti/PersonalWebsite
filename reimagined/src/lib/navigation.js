export function resolveLocation(pathname) {
  const parts = pathname.split('/').filter(Boolean);
  // Retired edition paths remain useful bookmarks, all resolving to the red site.
  if (['red', 'workbench', 'door'].includes(parts[0])) parts.shift();
  const explicitHero = ['poke', 'room'].includes(parts[0]);
  const hero = explicitHero ? parts.shift() : 'poke';
  const base = explicitHero ? `/${hero}` : '';
  let route = '/' + parts.join('/');
  const aliases = { '/home': '/', '/projects': '/work', '/articles': '/writing', '/rekognize': '/work/rekognize', '/portchat': '/work/portchat', '/shopvista': '/work/shopvista', '/findmyparcel': '/work/find-my-parcel', '/dailycommit': '/work/daily-commit', '/chessgame': '/work/chess' };
  route = aliases[route] || route;
  const href = (path = '/') => path === '/' ? (base || '/') : base + path;
  return { variant: 'red', hero, base, route, href, canonicalPath: href(route) };
}
