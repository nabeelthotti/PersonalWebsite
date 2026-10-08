import { useEffect, useId, useRef, useState } from 'react';
import { ArrowRight } from '@phosphor-icons/react';
import { projects } from '../data.js';
import ProjectVisual from './ProjectVisual.jsx';
import { getGalleryFrame, getQuietGalleryFrame, getGalleryScrollScreens } from '../lib/workMotion.js';
import './motion-work.css';

const matches = (query) => typeof window !== 'undefined' && window.matchMedia(query).matches;
const ROOMY = '(min-width: 801px) and (min-height: 640px)';
const kindLabel = (project) => ({ product: 'Product', gtm: 'Go-to-market', brand: 'Brand & web', engineering: 'Engineering' })[project.kind] || project.category || 'Project';

function ProjectMeta({ project }) {
  return <p className="motion-work-meta"><span>{kindLabel(project)}</span>{project.status && <span>{project.status}</span>}</p>;
}

export default function MotionWorkGallery({ href, compact = false, items = projects, archiveHref, archiveLabel = 'View all projects', showHeading = true, quiet = false, layered = !quiet, nextSectionId }) {
  const headingId = useId();
  const [wide, setWide] = useState(() => matches(ROOMY));
  const [reduced, setReduced] = useState(() => matches('(prefers-reduced-motion: reduce)'));
  const [motionChoice, setMotionChoice] = useState(null);
  const animated = wide && items.length > 1 && (motionChoice ?? !reduced);
  const [activeIndex, setActiveIndex] = useState(0);
  const [shuffling, setShuffling] = useState(false);
  const cancelShuffleRef = useRef(null);
  const sectionRef = useRef(null);
  const toggleRef = useRef(null);
  const toggleFrameRef = useRef(0);
  const trackRef = useRef(null);
  const stageRef = useRef(null);
  const backdropRef = useRef(null);
  const cardsRef = useRef([]);
  const activeRef = useRef(0);
  const selectedIndex = Math.min(activeIndex, Math.max(0, items.length - 1));
  const activeProject = items[selectedIndex];
  const archive = archiveHref === undefined ? href('/work') : archiveHref;

  useEffect(() => {
    const roomy = window.matchMedia(ROOMY);
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)');
    const update = () => { setWide(roomy.matches); setReduced(reduced.matches); };
    update();
    roomy.addEventListener('change', update);
    reduced.addEventListener('change', update);
    return () => {
      roomy.removeEventListener('change', update);
      reduced.removeEventListener('change', update);
      if (toggleFrameRef.current) cancelAnimationFrame(toggleFrameRef.current);
    };
  }, []);

  useEffect(() => {
    if (!animated || !trackRef.current || !items.length) return;
    let frame = 0;
    const render = () => {
      frame = 0;
      const track = trackRef.current;
      const stage = stageRef.current;
      if (!track || !stage) return;
      const rect = track.getBoundingClientRect();
      const distance = Math.max(1, track.offsetHeight - stage.clientHeight);
      const motion = (layered ? getGalleryFrame : getQuietGalleryFrame)(-rect.top / distance, items.length, stage.clientWidth, stage.clientHeight);
      motion.cards.forEach((card, index) => {
        const element = cardsRef.current[index];
        if (!element) return;
        element.style.transform = `translate3d(calc(-50% + ${card.x.toFixed(2)}px), calc(-50% + ${card.y.toFixed(2)}px), ${card.z.toFixed(2)}px) rotateX(${card.rotateX.toFixed(2)}deg) rotateY(${card.rotateY.toFixed(2)}deg) rotateZ(${card.rotateZ.toFixed(2)}deg)`;
        element.style.opacity = card.opacity.toFixed(3);
        element.style.visibility = card.visible ? 'visible' : 'hidden';
        element.style.pointerEvents = card.opacity > .35 ? 'auto' : 'none';
        element.style.zIndex = card.zIndex;
      });
      if (backdropRef.current) {
        const { x, y, scale, rotation } = motion.backdrop;
        backdropRef.current.style.transform = `translate3d(calc(-50% + ${x}px), calc(-50% + ${y}px), 0) scale(${scale}) rotate(${rotation}deg)`;
      }
      stage.style.setProperty('--mw-progress', motion.progress);
      if (activeRef.current !== motion.activeIndex) {
        activeRef.current = motion.activeIndex;
        setActiveIndex(motion.activeIndex);
      }
    };
    const schedule = () => { if (!frame) frame = requestAnimationFrame(render); };
    render();
    window.addEventListener('scroll', schedule, { passive: true });
    window.addEventListener('resize', schedule);
    const observer = typeof ResizeObserver !== 'undefined' ? new ResizeObserver(schedule) : null;
    observer?.observe(trackRef.current);
    observer?.observe(stageRef.current);
    return () => {
      if (frame) cancelAnimationFrame(frame);
      observer?.disconnect();
      window.removeEventListener('scroll', schedule);
      window.removeEventListener('resize', schedule);
    };
  }, [animated, items, layered]);

  // Move the real scroll position so the existing depth animation plays through
  // every remaining project, then continues into the next section.
  useEffect(() => () => cancelShuffleRef.current?.(), [animated, reduced, items.length]);

  function skipCollection() {
    if (!animated || shuffling || !trackRef.current || !stageRef.current) return;
    const track = trackRef.current;
    const start = window.scrollY;
    const lastCard = start + track.getBoundingClientRect().top + track.offsetHeight - stageRef.current.clientHeight;
    const nextSection = nextSectionId && document.getElementById(nextSectionId);
    const destination = nextSection ? start + nextSection.getBoundingClientRect().top : lastCard + stageRef.current.clientHeight;
    const focusNext = () => {
      if (!nextSection) return;
      nextSection.tabIndex = -1;
      nextSection.focus({ preventScroll: true });
    };
    if (reduced) {
      window.scrollTo({ top: destination, behavior: 'instant' });
      focusNext();
      return;
    }
    let frame = 0;
    let started;
    const shuffleDuration = selectedIndex === items.length - 1 ? 0 : Math.min(1800, Math.max(700, (items.length - 1 - selectedIndex) * 130 + 350));
    const exitDuration = 650;
    const stop = () => {
      cancelAnimationFrame(frame);
      window.removeEventListener('wheel', stop);
      window.removeEventListener('touchstart', stop);
      window.removeEventListener('pointerdown', stop);
      window.removeEventListener('keydown', onKey);
      window.removeEventListener('resize', stop);
      cancelShuffleRef.current = null;
      setShuffling(false);
    };
    const onKey = event => {
      if (['Escape', 'ArrowUp', 'ArrowDown', 'PageUp', 'PageDown', 'Home', 'End', ' '].includes(event.key)) stop();
    };
    const tick = now => {
      started ??= now;
      const elapsed = now - started;
      const leaving = elapsed >= shuffleDuration;
      const progress = Math.min(1, leaving ? (elapsed - shuffleDuration) / exitDuration : elapsed / shuffleDuration);
      const eased = progress * progress * (3 - 2 * progress);
      const from = leaving && shuffleDuration ? lastCard : start;
      const to = leaving ? destination : lastCard;
      window.scrollTo({ top: from + (to - from) * eased, behavior: 'instant' });
      if (elapsed < shuffleDuration + exitDuration) frame = requestAnimationFrame(tick);
      else { stop(); focusNext(); }
    };
    cancelShuffleRef.current = stop;
    setShuffling(true);
    window.addEventListener('wheel', stop, { passive: true });
    window.addEventListener('touchstart', stop, { passive: true });
    window.addEventListener('pointerdown', stop, { passive: true });
    window.addEventListener('keydown', onKey);
    window.addEventListener('resize', stop);
    frame = requestAnimationFrame(tick);
  }

  function toggleMotion() {
    cancelShuffleRef.current?.();
    setMotionChoice(!animated);
    if (toggleFrameRef.current) cancelAnimationFrame(toggleFrameRef.current);
    toggleFrameRef.current = requestAnimationFrame(() => {
      toggleFrameRef.current = 0;
      const button = toggleRef.current;
      if (!button) return;
      const rect = button.getBoundingClientRect();
      if (rect.top < 20 || rect.bottom > window.innerHeight) window.scrollTo({ top: window.scrollY + sectionRef.current.getBoundingClientRect().top, behavior: 'instant' });
      button.focus({ preventScroll: true });
    });
  }

  if (!items.length) return null;

  return (
    <section ref={sectionRef} className={`motion-work motion-work--red${animated ? ' motion-work--animated' : ''}${compact ? ' motion-work--compact' : ''}`} aria-labelledby={showHeading ? headingId : undefined} aria-label={showHeading ? undefined : 'Project collection'}>
      <div className={`motion-work-heading${showHeading ? '' : ' motion-work-heading--tools'}`}>
        {showHeading && <div><h2 id={headingId}>{quiet ? 'Some things I’ve built.' : 'Things I’ve worked on.'}</h2><p>Products, go-to-market work, and engineering experiments.</p></div>}
        <div className="motion-work-heading-actions">{archive && <a draggable={false} className="motion-work-archive" href={archive}>{archiveLabel}<ArrowRight size={20} aria-hidden="true" /></a>}{wide && items.length > 1 && <button ref={toggleRef} type="button" className="motion-work-toggle" onClick={toggleMotion}>{animated ? 'Still view' : 'Motion view'}</button>}</div>
      </div>

      <div ref={trackRef} className="motion-work-track" style={{ '--mw-scroll-screens': getGalleryScrollScreens(items.length, compact) }}>
        <div className="motion-work-stage" ref={stageRef}>
          <div className="motion-work-stage-top"><span>{String(selectedIndex + 1).padStart(2, '0')} / {String(items.length).padStart(2, '0')}<span className="motion-work-stage-label">A collection of work</span></span><div className="motion-work-stage-actions"><button type="button" className="motion-work-skip" onClick={skipCollection} disabled={shuffling} aria-label={shuffling ? 'Shuffling through projects' : 'Shuffle through projects and continue to Writing'} title="Shuffle through projects and continue"><ArrowRight size={24} aria-hidden="true" /></button></div></div>
          <div className="motion-work-type" ref={backdropRef} aria-hidden="true"><span>WORK WORK</span><span>IN PROGRESS</span><span>WORK WORK</span></div>
          <div className="motion-work-scene" aria-hidden="true">
            {items.map((project, index) => (
              <a draggable={false} className="motion-work-card" key={project.slug} href={href(`/work/${project.slug}`)} tabIndex={-1} ref={(element) => { cardsRef.current[index] = element; }}>
                <ProjectVisual project={project} loading={index < 2 ? 'eager' : 'lazy'} />
                <span className="motion-work-card-label"><span>{project.title}</span><span>{kindLabel(project)}</span></span>
              </a>
            ))}
          </div>
          <div className="motion-work-reading" role="region" aria-label={activeProject.title}>
            <div className="motion-work-caption"><ProjectMeta project={activeProject} /><h3>{activeProject.title}</h3><p>{activeProject.summary}</p></div>
            <a draggable={false} className="motion-work-open" href={href(`/work/${activeProject.slug}`)} aria-label={`Open ${activeProject.title}`}>Explore project<ArrowRight size={21} aria-hidden="true" /></a>
          </div>

        </div>
      </div>

      <div className="motion-work-static" aria-label={`${items.length} projects`}>
        {items.map((project, index) => (
          <article key={project.slug} className="motion-work-static-project">
            <a draggable={false} className="motion-work-static-image" href={href(`/work/${project.slug}`)} tabIndex={-1} aria-hidden="true"><ProjectVisual project={project} /></a>
            <div className="motion-work-static-kicker"><span>{String(index + 1).padStart(2, '0')}</span><ProjectMeta project={project} /></div>
            <h3><a draggable={false} href={href(`/work/${project.slug}`)}>{project.title}</a></h3>
            <p>{project.summary}</p>
            <a draggable={false} className="motion-work-static-open" href={href(`/work/${project.slug}`)}>Explore project<ArrowRight size={18} aria-hidden="true" /></a>
          </article>
        ))}
      </div>
    </section>
  );
}
