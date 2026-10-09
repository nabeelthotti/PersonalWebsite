import { useEffect, useRef, useState } from 'react';
import { ArrowUpRight, ArrowRight, List, X } from '@phosphor-icons/react';
import RedHome from './variants/RedHome.jsx';
import ChessGame from './components/ChessGame.jsx';
import Sketchpad from './components/Sketchpad.jsx';
import { WorkPage, ProjectPage, WritingPage, ArticlePage, AboutPage, ContactPage, ResumePage, HowIWorkPage, NotFoundPage } from './components/ContentPages.jsx';
import { resolveLocation } from './lib/navigation.js';
import { profile } from './data.js';
import { updatePageMetadata } from './lib/seo.js';
import './components/photo-pages.css';
import './variants/red.css';

const entryKey = () => `${Date.now().toString(36)}-${Math.random().toString(36).slice(2)}`;
export function App({ initialPath = '/' }) {
  const [navigation, setNavigation] = useState(() => typeof window === 'undefined'
    ? { pathname: initialPath, hash: '', type: 'initial' }
    : { pathname: window.location.pathname, hash: window.location.hash, type: 'initial', position: history.state?.portfolioScroll });
  const { pathname } = navigation;
  const scrollPositions = useRef(new Map());
  const currentEntry = useRef(typeof history === 'undefined' ? 'prerender' : history.state?.portfolioEntry || entryKey());
  const [menuOpen, setMenuOpen] = useState(false);
  useEffect(() => {
    if (!menuOpen) return;
    const dismiss = event => {
      if (event.type === 'keydown' && event.key === 'Escape') {
        setMenuOpen(false);
        document.querySelector('.menu-toggle')?.focus();
      } else if (event.type === 'pointerdown' && !event.target.closest('.site-header')) setMenuOpen(false);
    };
    document.addEventListener('keydown', dismiss);
    document.addEventListener('pointerdown', dismiss);
    return () => { document.removeEventListener('keydown', dismiss); document.removeEventListener('pointerdown', dismiss); };
  }, [menuOpen]);
  const { variant, hero, route, href } = resolveLocation(pathname);
  const home = route === '/';
  useEffect(() => {
    const previousRestoration = history.scrollRestoration;
    history.scrollRestoration = 'manual';
    history.replaceState({ ...history.state, portfolioEntry: currentEntry.current }, '', resolveLocation(window.location.pathname).canonicalPath + window.location.search + window.location.hash);
    const rememberScroll = () => {
      scrollPositions.current.set(currentEntry.current, { x: window.scrollX, y: window.scrollY });
    };
    const persistScroll = () => {
      rememberScroll();
      history.replaceState({ ...history.state, portfolioScroll: scrollPositions.current.get(currentEntry.current) }, '');
    };
    const onPop = (event) => {
      currentEntry.current = event.state?.portfolioEntry || entryKey();
      if (!event.state?.portfolioEntry) history.replaceState({ ...history.state, portfolioEntry: currentEntry.current }, '');
      setNavigation({ pathname: window.location.pathname, hash: window.location.hash, type: 'pop', position: scrollPositions.current.get(currentEntry.current) || event.state?.portfolioScroll });
    };
    const navigate = (event) => {
      const anchor = event.target.closest('a');
      if (!anchor || event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey || anchor.target || anchor.hasAttribute('download')) return;
      const url = new URL(anchor.href, window.location.href);
      if (url.origin !== location.origin || !['http:', 'https:'].includes(url.protocol) || /\.[a-z0-9]+$/i.test(url.pathname)) return;
      event.preventDefault();
      const smooth = anchor.dataset.scroll === 'smooth' && url.pathname === window.location.pathname;
      persistScroll();
      currentEntry.current = entryKey();
      history.pushState({ portfolioEntry: currentEntry.current }, '', url.pathname + url.search + url.hash);
      setNavigation({ pathname: url.pathname, hash: url.hash, type: 'push', smooth });
    };
    window.addEventListener('scroll', rememberScroll, { passive: true });
    window.addEventListener('pagehide', persistScroll);
    window.addEventListener('popstate', onPop);
    document.addEventListener('click', navigate);
    return () => {
      history.scrollRestoration = previousRestoration;
      window.removeEventListener('scroll', rememberScroll);
      window.removeEventListener('pagehide', persistScroll);
      window.removeEventListener('popstate', onPop);
      document.removeEventListener('click', navigate);
    };
  }, []);
  useEffect(() => {
    setMenuOpen(false);
    updatePageMetadata(route);
    document.documentElement.style.backgroundColor = '#cf251e';
    document.getElementById('main')?.focus({ preventScroll: true });
    const frame = requestAnimationFrame(() => {
      // Wait until React has rendered the destination before restoring its position.
      if (navigation.type === 'pop' && navigation.position) {
        window.scrollTo({ left: navigation.position.x, top: navigation.position.y, behavior: 'instant' });
        return;
      }
      let hashId = navigation.hash.slice(1);
      try { hashId = decodeURIComponent(hashId); } catch { /* Invalid fragments simply have no target. */ }
      const target = hashId && document.getElementById(hashId);
      if (target) {
        if (!target.hasAttribute('tabindex')) target.tabIndex = -1;
        target.focus({ preventScroll: true });
        const smooth = navigation.smooth && !window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        target.scrollIntoView({ behavior: smooth ? 'smooth' : 'instant', block: 'start' });
      } else window.scrollTo({ left: navigation.position?.x || 0, top: navigation.position?.y || 0, behavior: 'instant' });
    });
    return () => cancelAnimationFrame(frame);
  }, [navigation, route, variant]);
  let page;
  if (home) page = <RedHome key={hero} href={href} hero={hero} />;
  else if (route === '/work') page = <WorkPage href={href} />;
  else if (/^\/work\/[^/]+$/.test(route)) page = <ProjectPage href={href} slug={route.split('/')[2]} />;
  else if (route === '/writing') page = <WritingPage href={href} />;
  else if (/^\/writing\/[^/]+$/.test(route)) page = <ArticlePage href={href} slug={route.split('/')[2]} />;
  else if (route === '/how-i-work') page = <HowIWorkPage href={href} />;
  else if (route === '/about') page = <AboutPage href={href} />;
  else if (route === '/contact') page = <ContactPage href={href} />;
  else if (route === '/resume') page = <ResumePage href={href} />;
  else if (route === '/chess') page = <section className="content-page play-page"><a draggable={false} className="text-link page-back" href={href('/')}>Back to the good stuff</a><h1 className="page-heading">A little chess.</h1><ChessGame /></section>;
  else if (route === '/draw') page = <section className="content-page draw-page"><a draggable={false} className="text-link page-back" href={href('/work/rekognize')}>About Rekognize</a><h1 className="page-heading">Make your mark.</h1><p className="page-intro">A little space to think with your hands. Draw, erase, start over.</p><Sketchpad variant={variant} /><p className="draw-context">This drawing pad is inspired by Rekognize, my handwriting recognition project. <a draggable={false} className="text-link" href={href('/work/rekognize')}>Explore the project <ArrowRight /></a></p></section>;
  else page = <NotFoundPage href={href} />;
  const preserveTextSelection = event => {
    if (!event.detail) return; // Keyboard activation still works with selected text.
    const control = event.target.closest('a,button');
    const selection = window.getSelection();
    if (control && selection && !selection.isCollapsed && selection.toString().trim()
      && (control.contains(selection.anchorNode) || control.contains(selection.focusNode))) {
      event.preventDefault();
      event.stopPropagation();
    }
  };
  return <div onClickCapture={preserveTextSelection} className={`site theme-${variant} hero-${hero} ${home ? 'is-home' : 'is-interior'}`}>
    <a draggable={false} className="skip-link" href="#main">Skip to content</a>
    {!home && <header className="site-header">
      <div className="identity"><a draggable={false} className="wordmark" href={href('/')}>Nabeel Thotti</a></div>
      <button className="menu-toggle" aria-label={menuOpen ? 'Close navigation' : 'Open navigation'} aria-expanded={menuOpen} aria-controls="primary-nav" onClick={() => setMenuOpen(!menuOpen)}>{menuOpen ? <X size={25} /> : <List size={25} />}</button>
      <nav id="primary-nav" className={`site-nav ${menuOpen ? 'is-open' : ''}`} aria-label="Main navigation">{(home ? [['Story','#my-story'],['Work','#work'],['Life','#life']] : [['About','/about'],['Work','/work'],['Notes','/writing'],['Contact','/contact']]).map(([label,path])=><a draggable={false} key={path} href={path.startsWith('#') ? path : href(path)} aria-current={route.startsWith(path) ? 'page' : undefined}>{label}{path === '/contact' && <ArrowUpRight size={18} />}</a>)}</nav>
    </header>}
    <main id="main" tabIndex={-1}>{page}</main>
    <footer className="site-footer">
      <div><a draggable={false} className="footer-name" href={href('/')}>Nabeel Thotti</a><p>From LA to SF</p></div>
      <div className="footer-links"><a draggable={false} href="https://github.com/nabeelthotti" target="_blank" rel="noreferrer">GitHub <ArrowUpRight /></a><a draggable={false} href="https://www.linkedin.com/in/nabeelthotti" target="_blank" rel="noreferrer">LinkedIn <ArrowUpRight /></a><a draggable={false} href={profile.x} target="_blank" rel="noreferrer">X <ArrowUpRight /></a><a draggable={false} href={profile.youtube} target="_blank" rel="noreferrer">YouTube <ArrowUpRight /></a><a draggable={false} href={href('/contact')}>Say hello</a></div>

    </footer>
  </div>;
}
