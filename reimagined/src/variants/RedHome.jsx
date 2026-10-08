import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { ArrowUpRight, ChatCircle, ChatText, PhoneCall, Voicemail, EnvelopeSimple, LinkedinLogo, XLogo, InstagramLogo, FacebookLogo } from '@phosphor-icons/react';
import MotionWorkGallery from '../components/MotionWorkGallery.jsx';
import TravelGlobe from '../components/TravelGlobe.jsx';
import InteriorGallery from '../components/InteriorGallery.jsx';
import ContactForm from '../components/ContactForm.jsx';
import useFingerStory from '../components/useFingerStory.jsx';
import { projects, articles, profile } from '../data.js';
import './scroll-home.css';

const chapters = [['Story', 'my-story'], ['Beel', 'beel'], ['Work', 'work'], ['Writing', 'writing'], ['Life', 'life'], ['Contact', 'contact']];
const story = [
  ['I started with code.', 'Software engineer. Systems, testing, iteration.'],
  ['Then I got closer\nto the customer.', 'The interesting problems were happening right in front of me...'],
  ['Now I engineer\nour go-to-market.', 'I’m a GTM engineer at Syft Data. Same way of thinking. More people in the picture.'],
];
const outboundChannels = [
  {name:'iMessage',Icon:ChatCircle,x:-36,y:-16,tilt:-9},
  {name:'SMS',Icon:ChatText,x:-20,y:-28,tilt:-5},
  {name:'Call',Icon:PhoneCall,x:20,y:-28,tilt:7},
  {name:'Voicemail',Icon:Voicemail,x:0,y:-30,tilt:0},
  {name:'Email',Icon:EnvelopeSimple,x:36,y:-16,tilt:10},
  {name:'LinkedIn',Icon:LinkedinLogo,x:-36,y:16,tilt:-7},
  {name:'X',Icon:XLogo,x:-15,y:27,tilt:5},
  {name:'Instagram',Icon:InstagramLogo,x:15,y:27,tilt:-6},
  {name:'Facebook',Icon:FacebookLogo,x:36,y:16,tilt:9},
];
const clamp = n => Math.max(0, Math.min(1, n));

// Native page scrolling drives each scene; wheel zoom is local to the globe.
function useChapterMotion(rootRef,siteVisible) {
  useEffect(() => {
    if(!siteVisible)return;
    const root = rootRef.current;
    const media = matchMedia('(prefers-reduced-motion: reduce)');
    const tracks = [...root.querySelectorAll('[data-track]')];
    const sections = [...root.querySelectorAll('[data-chapter]')];
    const rail = [...root.querySelectorAll('.scroll-chapters a')];
    let frame = 0;
    const render = () => {
      frame = 0;
      const simple = media.matches || innerWidth < 760 || innerHeight < 560;
      root.dataset.motion = simple ? 'still' : 'scroll';
      for (const track of tracks) {
        const rect = track.getBoundingClientRect();
        const p = clamp(-rect.top / Math.max(1, rect.height - innerHeight));
        track.style.setProperty('--progress', simple ? 0 : p);
        const panels = [...track.querySelectorAll('[data-panel]')];
        const position = p * Math.max(0, panels.length - 1);
        panels.forEach((panel, i) => {
          const distance = i - position;
          if (track.id === 'writing') {
            // Opaque pages reveal in place while their shared stage stays pinned.
            const reveal = simple || i === 0 ? 1 : clamp((position - i + .65) / .3);
            panel.style.setProperty('--page-reveal', reveal);
            panel.style.zIndex = i + 1;
            panel.dataset.active = simple || i === Math.round(position) ? 'true' : 'false';
            panel.inert = !simple && i !== Math.round(position);
            return;
          }
          panel.style.setProperty('--reveal', simple ? 1 : clamp((.53 - Math.abs(distance)) / .18));
          panel.dataset.active = simple || Math.abs(distance) < .5 ? 'true' : 'false';
          panel.inert = !simple && Math.abs(distance) >= .5;
          panel.style.setProperty('--offset', simple ? '0px' : `${distance * 100}px`);
          panel.style.setProperty('--turn', simple ? '0deg' : `${distance * 7}deg`);
        });
      }
      let active = 0;
      sections.forEach((section, i) => { if (section.getBoundingClientRect().top <= innerHeight * .5) active = i; });
      rail.forEach((link, i) => i === active ? link.setAttribute('aria-current', 'location') : link.removeAttribute('aria-current'));
    };
    const schedule = () => { if (!frame) frame = requestAnimationFrame(render); };
    render();
    const observer = new ResizeObserver(schedule);
    tracks.forEach(track => observer.observe(track));
    addEventListener('scroll', schedule, { passive: true });
    addEventListener('resize', schedule);
    media.addEventListener('change', schedule);
    return () => { cancelAnimationFrame(frame); observer.disconnect(); removeEventListener('scroll', schedule); removeEventListener('resize', schedule); media.removeEventListener('change', schedule); };
  }, [rootRef,siteVisible]);
}

// Align the illustrated nail with the letter, including after font loading or rotation.
// The asset's nail centre is (158, 130) in its 1572 × 1001 source image.
function useMobileHand(cameraRef, phase) {
  useLayoutEffect(() => {
    if (phase !== 'closed') return;
    const camera = cameraRef.current;
    const hand = camera.querySelector('.hello-hand');
    const letter = camera.querySelector('.letter-door');
    let disposed = false;
    const align = () => {
      if (disposed) return;
      if (!matchMedia('(max-width: 1000px), (max-height: 559px)').matches) {
        hand.style.removeProperty('left'); hand.style.removeProperty('top');
        return;
      }
      const target = letter.getBoundingClientRect();
      const parent = camera.getBoundingClientRect();
      const width = hand.offsetWidth, height = width * 1001 / 1572;
      const style = getComputedStyle(hand);
      const matrix = new DOMMatrixReadOnly(style.transform);
      const origin = style.transformOrigin.split(' ').map(parseFloat);
      const x = width * 158 / 1572 - origin[0];
      const y = height * 130 / 1001 - origin[1];
      hand.style.left = `${target.right - parent.left + 9 - (origin[0] + matrix.a*x + matrix.c*y)}px`;
      hand.style.top = `${target.bottom - parent.top - 13 - (origin[1] + matrix.b*x + matrix.d*y)}px`;
    };
    align();
    const observer = new ResizeObserver(align);
    observer.observe(camera); observer.observe(letter);
    document.fonts.ready.then(align);
    window.addEventListener('resize', align);
    return () => { disposed = true; observer.disconnect(); window.removeEventListener('resize', align); };
  }, [cameraRef, phase]);
}

export default function RedHome({ href }) {
  const root = useRef(null);
  const camera = useRef(null);
  const {phase,siteVisible,onHandClick,closeEntrance,transition}=useFingerStory(camera);
  const [showHint, setShowHint] = useState(false);
  useEffect(() => {
    setShowHint(false);
    if (phase !== 'closed') return;
    let timer;
    let revealed = false;
    const reset = () => {
      clearTimeout(timer);
      if (revealed) return;
      if (!document.hidden) timer = setTimeout(() => { revealed = true; setShowHint(true); }, 2000);
    };
    const events = ['pointermove', 'pointerdown', 'keydown', 'wheel', 'touchstart'];
    events.forEach(event => window.addEventListener(event, reset, { passive: true }));
    document.addEventListener('visibilitychange', reset);
    reset();
    return () => {
      clearTimeout(timer);
      events.forEach(event => window.removeEventListener(event, reset));
      document.removeEventListener('visibilitychange', reset);
    };
  }, [phase]);
  useChapterMotion(root,siteVisible);
  useMobileHand(camera,phase);
  return <div className="scroll-home" data-entry={phase} ref={root}>


    <section className="scroll-hello" id="hello" hidden={siteVisible} inert={phase!=='closed'} aria-labelledby="hello-title">
      <div className="hello-stage"><a draggable={false} className="simple-site-link scenic-shortcut" href={href('/about')}>Skip the scenic route <ArrowUpRight size={18} aria-hidden="true" /></a><div className="hello-camera" ref={camera}>
        <h1 id="hello-title">Hi, I’m<br />Nabee<span className="hello-letter">l<span className="entrance-hint" data-visible={showHint} aria-hidden="true">Click me<svg viewBox="0 0 100 75" fill="none"><path d="M88 8C43 1 8 18 17 64m-10-9 10 10 9-12" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/></svg><svg className="hint-mobile-arrow" viewBox="0 0 100 75" fill="none"><path d="M12 55Q46 56 65 15m-14 9 14-9 2 16" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/></svg></span><button className="letter-door" type="button" aria-label="Open my story" onClick={onHandClick}><span className="letter-door-label">I started with code.</span></button></span></h1>
        <button className="hello-hand" type="button" aria-label="Open Nabeel’s website" onClick={onHandClick}><img src="/assets/heroes/poke-hand-red.png" alt="" width="1572" height="1001" fetchPriority="high" draggable="false" /></button>
      </div></div>
    </section>

    <div className="inside-site" hidden={!siteVisible} inert={!siteVisible || phase!=='open'}>
    <nav className="scroll-chapters" aria-label="Page chapters"><button type="button" onClick={closeEntrance} aria-label="Back to the finger entrance"><span>Entrance</span><i /></button>{chapters.map(([label, id]) => <a draggable={false} key={id} href={`#${id}`} aria-label={label}><span>{label}</span><i /></a>)}</nav>
    <section className="scroll-story" id="my-story" data-chapter data-track aria-label="My story">
      <div className="chapter-stage story-stage">
        <span className="chapter-label">How I got here</span>
        <div className="story-lines">{story.map(([title, copy], i) => <div className="story-moment" data-panel key={title} style={{'--reveal':i===0?1:0}}><h2>{title}</h2><p>{copy}</p></div>)}</div>
        <a draggable={false} className="scroll-link story-more" href={href('/about')}>The longer story <ArrowUpRight size={18}/></a>
        <div className="story-thread" aria-hidden="true"><span /></div>
      </div>
    </section>

    <section className="scroll-beel" id="beel" data-chapter data-track aria-labelledby="beel-title">
      <div className="chapter-stage beel-stage">
        <span className="chapter-label">What I am currently working on</span>
        <div className="beel-outbound" role="img" aria-label="Beel sends outreach through iMessage, SMS, calls, voicemail, email, LinkedIn, X, Instagram and Facebook.">{outboundChannels.map(({name,Icon,x,y,tilt},i)=><div className="beel-channel" key={name} aria-hidden="true" style={{'--x':`${x}vw`,'--y':`${y}vh`,'--mobile-y':`${44+y*(y<0?.75:1.1)}%`,'--tilt':`${tilt}deg`,'--delay':(i%4)*.035}}><Icon weight={name==='Instagram'?'bold':'fill'} /><span>{name}</span></div>)}</div>
        <h2 id="beel-title">beel.</h2>
        <div className="beel-bottom"><p>All in one outbound sequencer</p><a draggable={false} className="scroll-link" href={href('/work/beel')}>Meet Beel <ArrowUpRight size={20}/></a></div>
      </div>
    </section>

    <div className="scroll-work" id="work" data-chapter><MotionWorkGallery href={href} items={projects} compact quiet layered nextSectionId="writing" /></div>

    <section className="scroll-writing" id="writing" data-chapter data-track aria-labelledby="home-writing-title">
      <div className="chapter-stage writing-stage">
        <div className="writing-stage-heading"><h2 id="home-writing-title">Thinking out loud.</h2><a draggable={false} className="scroll-link" href={href('/writing')}>All writing <ArrowUpRight size={20}/></a></div>
        <div className="writing-scenes">{articles.map((article,i)=><article className="writing-moment" data-panel key={article.slug} style={{'--reveal':i===0?1:0}}>
          <span className="writing-number">{String(i+1).padStart(2,'0')} / {String(articles.length).padStart(2,'0')} · Essay</span>
          <h3><a draggable={false} href={href(`/writing/${article.slug}`)}>{article.shortTitle}</a></h3>
          <p>{article.subtitle}</p>
          <a draggable={false} className="scroll-link" href={href(`/writing/${article.slug}`)}>Read the essay <ArrowUpRight size={22} aria-hidden="true"/></a>
        </article>)}</div>
      </div>
    </section>

    <section className="scroll-life" id="life" data-chapter data-track aria-labelledby="home-life-title">
      <div className="chapter-stage life-stage"><h2 className="life-section-heading" id="home-life-title">Away from the screen.</h2>
        <div className="life-moment life-travel" data-panel style={{'--reveal':1}}><TravelGlobe /></div>
        <div className="life-moment life-interiors" data-panel style={{'--reveal':0}}><div className="life-copy"><span>Interiors</span><h2>A different<br />kind of building.</h2><p>I help clients decorate their houses in my free time.</p></div><InteriorGallery /></div>
      </div>
    </section>

    <section className="scroll-goodbye" id="contact" data-chapter aria-labelledby="home-contact-title">
      <div className="goodbye-conversation"><div className="goodbye-intro"><h2 id="home-contact-title">That’s a little<br/>bit of me.<span>Tell me a bit<br/>about you?</span></h2></div><ContactForm/></div>
      <div className="goodbye-notes"><a draggable={false} href={profile.linkedin} target="_blank" rel="noreferrer">LinkedIn</a><a draggable={false} href={profile.github} target="_blank" rel="noreferrer">GitHub</a><a draggable={false} href={profile.x} target="_blank" rel="noreferrer">X</a><a draggable={false} href={profile.youtube} target="_blank" rel="noreferrer">YouTube</a><a draggable={false} href={href('/about')}>About me</a><a draggable={false} className="scenic-shortcut" href={href('/about')}>Skip the scenic route</a></div>
    </section>

    </div>
    {transition}
  </div>;
}
