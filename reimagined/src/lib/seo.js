import { profile, projects, articles } from '../data.js';
import { getPhotos } from './photos.js';
import { resolveLocation } from './navigation.js';

export const SITE_URL = 'https://nabeelthotti.com';
export const absoluteUrl = path => new URL(path, `${SITE_URL}/`).href;
const personId = `${SITE_URL}/#person`;
const websiteId = `${SITE_URL}/#website`;
const identity = `${profile.name} is a ${profile.title}, with a software engineering background, and is building Beel, an all-in-one outbound sequencer.`;
const pages = {
  '/': ['Nabeel Thotti — GTM Engineer at Syft Data', identity, 'WebPage'],
  '/about': ['About Nabeel Thotti', identity, 'ProfilePage'],
  '/work': ['Work & Projects — Nabeel Thotti', 'Explore Nabeel Thotti’s GTM systems, Beel outbound sequencer, software engineering projects, career history, and résumé.', 'CollectionPage'],
  '/writing': ['Notes & Essays — Nabeel Thotti', 'Original essays by Nabeel Thotti on algorithmic bias, instant gratification, technology, and human behavior.', 'CollectionPage'],
  '/contact': ['Contact Nabeel Thotti', 'Get in touch with Nabeel Thotti, GTM engineer at Syft Data and builder of Beel.', 'ContactPage'],
  '/how-i-work': ['How I Work — Nabeel Thotti', 'How Nabeel Thotti uses AI agents, human approval, CRM verification, and customer feedback in go-to-market work.', 'WebPage'],
  '/resume': ['Résumé — Nabeel Thotti', 'View or download Nabeel Thotti’s résumé and explore his engineering and GTM work.', 'WebPage'],
  '/chess': ['A Little Chess — Nabeel Thotti', 'Play two-player chess in your browser, a software project by Nabeel Thotti.', 'WebPage'],
  '/draw': ['Draw Something — Nabeel Thotti', 'An interactive sketchpad inspired by Nabeel Thotti’s handwriting recognition project, Rekognize.', 'WebPage'],
};

export function getIndexableRoutes() {
  return [...Object.keys(pages),
    ...projects.map(project => `/work/${project.slug}`),
    ...articles.map(article => `/writing/${article.slug}`)];
}

export function getMetadata(pathname) {
  const path = resolveLocation(pathname).route;
  const canonical = absoluteUrl(path);
  const project = projects.find(project => path === `/work/${project.slug}`);
  const article = articles.find(article => path === `/writing/${article.slug}`);
  const known = Boolean(pages[path] || project || article);
  const [title, description, pageType] = pages[path] || (project
    ? [`${project.title} — Nabeel Thotti`, project.summary, 'WebPage']
    : article ? [`${article.shortTitle} — Nabeel Thotti`, article.subtitle, 'WebPage']
    : ['Page Not Found — Nabeel Thotti', 'This page could not be found. Explore Nabeel Thotti’s work, writing, and personal site.', 'WebPage']);
  const images = project ? project.images || []
    : path === '/about' ? getPhotos().map(photo => photo.src)
    : path === '/' && profile.portrait?.src ? [profile.portrait.src] : [];
  const person = {
    '@type': 'Person', '@id': personId, name: profile.name, url: absoluteUrl('/about'),
    jobTitle: profile.role, description: identity,
    worksFor: { '@type': 'Organization', name: profile.company, url: 'https://www.syftdata.com/' },
    sameAs: [profile.linkedin, profile.github, profile.x, profile.youtube],
    ...(profile.portrait?.src && { image: absoluteUrl(profile.portrait.src) }),
  };
  const page = {
    '@type': pageType, '@id': `${canonical}#webpage`, url: canonical, name: title,
    description, inLanguage: 'en', isPartOf: { '@id': websiteId }, about: { '@id': personId },
    ...(path === '/about' && { mainEntity: { '@id': personId } }),
  };
  const graph = [person, { '@type': 'WebSite', '@id': websiteId, url: `${SITE_URL}/`, name: profile.name, publisher: { '@id': personId }, inLanguage: 'en' }, page];
  if (article) graph.push({
    '@type': 'Article', '@id': `${canonical}#article`, headline: article.title,
    description: article.subtitle, url: canonical, mainEntityOfPage: { '@id': page['@id'] },
    author: { '@id': personId }, inLanguage: 'en',
    ...(article.date && { datePublished: article.date }),
  });
  for (const photo of path === '/about' ? getPhotos() : []) {
    graph.push({ '@type': 'ImageObject', '@id': `${canonical}#image-${photo.id}`, contentUrl: absoluteUrl(photo.src),
      name: photo.title, caption: photo.caption, description: photo.alt,
      ...(photo.width && photo.height && { width: photo.width, height: photo.height }) });
  }
  return {
    path, known, title, description, canonical, images: [...new Set(images)].map(absoluteUrl),
    imageAlt: project ? `${project.title} — project by Nabeel Thotti` : profile.portrait?.alt || 'Nabeel Thotti',
    type: article ? 'article' : 'website', published: article?.date,
    robots: known ? 'index, follow, max-image-preview:large' : 'noindex, follow',
    structuredData: { '@context': 'https://schema.org', '@graph': graph },
  };
}

export const escapeHtml = value => String(value).replace(/[&<>"']/g, char => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[char]);
export const serializeJsonLd = value => JSON.stringify(value).replace(/</g, '\\u003c');

function tagsFor(meta) {
  return [
    ['name', 'description', meta.description], ['name', 'robots', meta.robots], ['name', 'author', profile.name],
    ['property', 'og:site_name', profile.name], ['property', 'og:locale', 'en_US'],
    ['property', 'og:title', meta.title], ['property', 'og:description', meta.description],
    ['property', 'og:url', meta.canonical], ['property', 'og:type', meta.type],
    ['name', 'twitter:card', meta.images.length ? 'summary_large_image' : 'summary'],
    ['name', 'twitter:site', '@nabeelthotti'], ['name', 'twitter:title', meta.title], ['name', 'twitter:description', meta.description],
    ...(meta.images.length ? [['property', 'og:image', meta.images[0]], ['property', 'og:image:alt', meta.imageAlt], ['name', 'twitter:image', meta.images[0]], ['name', 'twitter:image:alt', meta.imageAlt]] : []),
    ...(meta.published ? [['property', 'article:published_time', meta.published], ['property', 'article:author', absoluteUrl('/about')]] : []),
  ];
}

export function renderMetadata(meta) {
  return `<title>${escapeHtml(meta.title)}</title>\n` +
    `<link data-seo rel="canonical" href="${escapeHtml(meta.canonical)}" />\n` +
    tagsFor(meta).map(([attr, key, value]) => `<meta data-seo ${attr}="${key}" content="${escapeHtml(value)}" />`).join('\n') +
    `\n<script data-seo type="application/ld+json">${serializeJsonLd(meta.structuredData)}</script>`;
}

export function updatePageMetadata(path) {
  const meta = getMetadata(path);
  document.title = meta.title;
  document.head.querySelectorAll('[data-seo],meta[name="description"],link[rel="canonical"]').forEach(node => node.remove());
  const canonical = document.createElement('link');
  canonical.rel = 'canonical'; canonical.href = meta.canonical; canonical.dataset.seo = '';
  document.head.append(canonical);
  for (const [attribute, key, content] of tagsFor(meta)) {
    const node = document.createElement('meta');
    node.dataset.seo = ''; node.setAttribute(attribute, key); node.content = content; document.head.append(node);
  }
  const json = document.createElement('script');
  json.type = 'application/ld+json'; json.dataset.seo = ''; json.textContent = serializeJsonLd(meta.structuredData);
  document.head.append(json);
}
