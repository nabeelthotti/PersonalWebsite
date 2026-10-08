import { useEffect } from 'react';

export function usePersonalMotion(rootRef) {
  useEffect(() => {
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)');
    const root = rootRef.current;
    if (!root) return;
    const scenes = [...root.querySelectorAll('[data-scroll-scene]')];
    let frame = 0;
    function render() {
      frame = 0;
      for (const scene of scenes) {
        if (reduced.matches) { scene.style.setProperty('--scene-progress', '0'); continue; }
        const rect = scene.getBoundingClientRect();
        const progress = Math.min(1, Math.max(0, (innerHeight - rect.top) / (innerHeight + rect.height)));
        scene.style.setProperty('--scene-progress', progress.toFixed(4));
      }
    }
    const schedule = () => { if (!frame) frame = requestAnimationFrame(render); };
    render();
    window.addEventListener('scroll', schedule, { passive: true });
    window.addEventListener('resize', schedule);
    reduced.addEventListener('change', schedule);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener('scroll', schedule);
      window.removeEventListener('resize', schedule);
      reduced.removeEventListener('change', schedule);
    };
  }, [rootRef]);
}
