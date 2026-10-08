import { useCallback, useEffect, useId, useLayoutEffect, useRef, useState } from 'react';
import { ArrowBendDownLeft, ArrowDown } from '@phosphor-icons/react';
import PokeSystem from './PokeSystem.jsx';
import './poke-hero.css';

const lines = ['Started', 'with code.', 'Stayed for', 'people'];
const clamp = (value, limit) => Math.max(-limit, Math.min(limit, value));

export default function PokeHero({ href }) {
  const heroRef = useRef(null);
  const titleRef = useRef(null);
  const dotRef = useRef(null);
  const handRef = useRef(null);
  const animationsRef = useRef([]);
  const lastPokeRef = useRef(-Infinity);
  const openingTimerRef = useRef(0);
  const [hasPoked, setHasPoked] = useState(false);
  const [systemOpen, setSystemOpen] = useState(false);
  const [reduced, setReduced] = useState(() => typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches);
  const titleId = useId();
  const feedbackId = useId();
  const closeSystem = useCallback(() => setSystemOpen(false), []);

  const cancelAnimations = useCallback(() => {
    animationsRef.current.forEach((animation) => animation.cancel());
    animationsRef.current = [];
  }, []);

  useEffect(() => {
    const media = window.matchMedia('(prefers-reduced-motion: reduce)');
    const update = () => {
      setReduced(media.matches);
      if (media.matches) cancelAnimations();
    };
    media.addEventListener('change', update);
    return () => { media.removeEventListener('change', update); cancelAnimations(); if (openingTimerRef.current) window.clearTimeout(openingTimerRef.current); };
  }, [cancelAnimations]);

  useLayoutEffect(() => {
    const hero = heroRef.current;
    let frame = 0;
    let mounted = true;
    const measure = () => {
      frame = 0;
      const dot = dotRef.current;
      if (!mounted || !dot) return;
      const bounds = hero.getBoundingClientRect();
      const point = dot.getBoundingClientRect();
      hero.style.setProperty('--poke-dot-right', `${point.right - bounds.left}px`);
      hero.style.setProperty('--poke-dot-y', `${point.top + point.height / 2 - bounds.top}px`);
    };
    const schedule = () => { if (!frame) frame = requestAnimationFrame(measure); };
    measure();
    const observer = new ResizeObserver(schedule);
    observer.observe(hero);
    observer.observe(titleRef.current);
    window.addEventListener('resize', schedule);
    document.fonts?.ready.then(() => { if (mounted) schedule(); });
    return () => {
      mounted = false;
      if (frame) cancelAnimationFrame(frame);
      observer.disconnect();
      window.removeEventListener('resize', schedule);
    };
  }, []);

  useEffect(() => {
    const hero = heroRef.current;
    let frame = 0;
    const current = { x: 0, y: 0 };
    const target = { x: 0, y: 0 };
    const reset = () => {
      hero.style.setProperty('--poke-follow-x', '0px');
      hero.style.setProperty('--poke-follow-y', '0px');
      hero.style.setProperty('--poke-follow-rotation', '0deg');
    };
    if (reduced) { reset(); return undefined; }
    const tick = () => {
      frame = 0;
      current.x += (target.x - current.x) * .14;
      current.y += (target.y - current.y) * .14;
      const settled = Math.abs(target.x - current.x) + Math.abs(target.y - current.y) < .04;
      if (settled) { current.x = target.x; current.y = target.y; }
      hero.style.setProperty('--poke-follow-x', `${current.x.toFixed(2)}px`);
      hero.style.setProperty('--poke-follow-y', `${current.y.toFixed(2)}px`);
      hero.style.setProperty('--poke-follow-rotation', `${(current.y * .045).toFixed(3)}deg`);
      if (!settled) frame = requestAnimationFrame(tick);
    };
    const schedule = () => { if (!frame) frame = requestAnimationFrame(tick); };
    const move = (event) => {
      if (event.pointerType !== 'mouse') return;
      const bounds = hero.getBoundingClientRect();
      target.x = clamp(((event.clientX - bounds.left) / bounds.width - .5) * 20, 10);
      target.y = clamp(((event.clientY - bounds.top) / bounds.height - .5) * 16, 8);
      schedule();
    };
    const leave = () => { target.x = 0; target.y = 0; schedule(); };
    hero.addEventListener('pointermove', move, { passive: true });
    hero.addEventListener('pointerleave', leave);
    hero.addEventListener('focusin', leave);
    return () => {
      if (frame) cancelAnimationFrame(frame);
      hero.removeEventListener('pointermove', move);
      hero.removeEventListener('pointerleave', leave);
      hero.removeEventListener('focusin', leave);
      reset();
    };
  }, [reduced]);

  const poke = (source = 'click') => {
    const now = performance.now();
    // Hover previews the physical response; activation opens the working playground.
    if (source !== 'hover') {
      setHasPoked(true);
      if (openingTimerRef.current) window.clearTimeout(openingTimerRef.current);
      openingTimerRef.current = window.setTimeout(() => { openingTimerRef.current = 0; setSystemOpen(true); }, reduced ? 0 : 430);
    }
    if (now - lastPokeRef.current < 650) return;
    if (source === 'hover' && reduced) return;
    lastPokeRef.current = now;
    cancelAnimations();
    if (reduced || !dotRef.current?.animate) return;
    const dot = dotRef.current.getBoundingClientRect();
    const origin = { x: dot.left + dot.width / 2, y: dot.top + dot.height / 2 };
    titleRef.current.querySelectorAll('.poke-letter').forEach((letter, index) => {
      const rect = letter.getBoundingClientRect();
      const distance = Math.hypot(origin.x - rect.left - rect.width / 2, origin.y - rect.top - rect.height / 2);
      const amplitude = Math.max(7, 23 - distance / 65);
      const turn = index % 2 ? 3.5 : -3.5;
      animationsRef.current.push(letter.animate([
        { transform: 'translate3d(0, 0, 0) rotate(0deg)', offset: 0 },
        { transform: `translate3d(0, ${-amplitude}px, 0) rotate(${turn}deg)`, offset: .3 },
        { transform: `translate3d(0, ${amplitude * .22}px, 0) rotate(${-turn * .3}deg)`, offset: .61 },
        { transform: `translate3d(0, ${-amplitude * .08}px, 0) rotate(${turn * .1}deg)`, offset: .8 },
        { transform: 'translate3d(0, 0, 0) rotate(0deg)', offset: 1 },
      ], { duration: 640, delay: Math.min(270, distance / 3.3), easing: 'cubic-bezier(.22,.8,.35,1)' }));
    });
    animationsRef.current.push(dotRef.current.animate([
      { transform: 'scale(1)' },
      { transform: 'translateX(-.045em) scale(.8, 1.14)', offset: .24 },
      { transform: 'scale(1.13, .88)', offset: .55 },
      { transform: 'scale(1)' },
    ], { duration: 530, easing: 'cubic-bezier(.2,.75,.3,1)' }));
    if (handRef.current) animationsRef.current.push(handRef.current.animate([
      { transform: 'translate3d(0, 0, 0)' },
      { transform: 'translate3d(-17px, -5px, 0)', offset: .22 },
      { transform: 'translate3d(5px, 2px, 0)', offset: .6 },
      { transform: 'translate3d(0, 0, 0)' },
    ], { duration: 560, easing: 'cubic-bezier(.2,.75,.3,1)' }));
  };

  return (
    <section ref={heroRef} className="personal-hero poke-hero" aria-labelledby={titleId} data-poked={hasPoked ? 'true' : 'false'}>
      <h1 id={titleId} ref={titleRef} className="poke-title" aria-label="Started with code. Stayed for people.">
        {lines.map((line, lineIndex) => <span className="poke-title-line" key={line}>
          <span aria-hidden="true">{[...line].map((letter, index) => <span className="poke-letter" key={`${lineIndex}-${index}`}>{letter === ' ' ? '\u00a0' : letter}</span>)}</span>
          {lineIndex === 3 && <button ref={dotRef} className="poke-dot" type="button" aria-label="Poke the period: open the GTM playground" aria-haspopup="dialog" aria-describedby={feedbackId} onClick={() => poke()} onPointerEnter={(event) => { if (event.pointerType === 'mouse') poke('hover'); }}><span className="poke-dot-fill" aria-hidden="true" /></button>}
        </span>)}
      </h1>

      <div className="poke-hand-position" aria-hidden="true"><div className="poke-hand-follow"><img ref={handRef} className="poke-hand-image" src="/assets/heroes/poke-hand.png" alt="" width="1572" height="1001" draggable="false" fetchPriority="high" /></div></div>

      <div className="poke-invitation"><span>Go on.<br />Give it a poke.</span><ArrowBendDownLeft size={46} weight="light" aria-hidden="true" /></div>
      <p id={feedbackId} className={`poke-feedback${hasPoked ? ' is-visible' : ''}`}>{hasPoked ? 'Make a signal useful.' : 'Open a playground: connect a fictional signal to context, a draft, and a human review.'}</p>

      <div className="poke-intro"><p>I’m Nabeel. GTM engineer at <a href="https://www.syftdata.com/" target="_blank" rel="noreferrer">Syft Data</a>, building <a href={href('/work/beel')}>Beel</a>.<br />Interiors, travel, and a few other things, too.</p></div>
      <a href="#my-story" className="poke-about-link">A little more about me <ArrowDown size={23} aria-hidden="true" /></a>
      <p className="poke-location">From LA. In Pleasanton.</p>
      <PokeSystem open={systemOpen} onClose={closeSystem} returnFocusRef={dotRef} href={href} reducedMotion={reduced} />
    </section>
  );
}
