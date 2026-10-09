import React from 'react';
import { renderToString } from 'react-dom/server';
import { App } from './App.jsx';
export { getIndexableRoutes, getMetadata, renderMetadata, SITE_URL, escapeHtml } from './lib/seo.js';
export { getPhotos } from './lib/photos.js';

export function render(path) {
  return renderToString(<App initialPath={path} />);
}
