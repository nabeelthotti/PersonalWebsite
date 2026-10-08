const clamp = (value, min, max) => Math.min(max, Math.max(min, value));
const smoothstep = (value) => { const t = clamp(value, 0, 1); return t * t * (3 - 2 * t); };
const arrival = 0.55;
const itemCount = (count) => Number.isFinite(count) ? Math.max(0, Math.floor(count)) : 0;
const placements = [
  { x: -.12, y: -.02, rx: 3, ry: -9, rz: -3 },
  { x: .16, y: -.075, rx: -3, ry: 8, rz: 4 },
  { x: -.15, y: .025, rx: 4, ry: -6, rz: -4 },
  { x: .13, y: -.025, rx: -4, ry: 10, rz: 3 },
  { x: -.10, y: -.065, rx: 2, ry: -8, rz: 2 },
  { x: .11, y: .01, rx: -2, ry: 7, rz: -3 },
];

export function getGalleryProgressForIndex(index, count) {
  const total = itemCount(count);
  if (total <= 1) return 0;
  const selected = Number.isFinite(index) ? index : 0;
  return clamp((clamp(selected, 0, total - 1) + arrival) / (total - 1 + arrival), 0, 1);
}

export function getGalleryScrollScreens(count, compact = false) {
  const total = itemCount(count);
  return clamp(1.65 + total * (compact ? .56 : .59), 2.8, 8.8);
}

export function getGallerySelectorScrollLeft({ scrollLeft = 0, viewportWidth = 0, itemLeft = 0, itemWidth = 0, scrollWidth = 0, padding = 14 } = {}) {
  const finite = (value) => Number.isFinite(value) ? value : 0;
  const viewport = Math.max(0, finite(viewportWidth));
  const maximum = Math.max(0, finite(scrollWidth) - viewport);
  const current = clamp(finite(scrollLeft), 0, maximum);
  if (!viewport || !itemWidth) return current;
  const inset = Math.max(0, finite(padding));
  const left = Math.max(0, finite(itemLeft));
  const right = left + Math.max(0, finite(itemWidth));
  if (left - inset < current) return clamp(left - inset, 0, maximum);
  if (right + inset > current + viewport) return clamp(right + inset - viewport, 0, maximum);
  return current;
}

export function getGalleryFrame(progress, count, width = 1280, height = 800) {
  const p = clamp(Number.isFinite(progress) ? progress : 0, 0, 1);
  const total = itemCount(count);
  const position = total <= 1 ? 0 : p * (total - 1 + arrival) - arrival;
  return {
    progress: p,
    activeIndex: total ? clamp(Math.round(position), 0, total - 1) : -1,
    backdrop: {
      scale: .78 + smoothstep(p / .25) * .36 + p * .32,
      x: (p - .5) * width * -.13,
      y: (p - .5) * height * -.19,
      rotation: -3 + p * 6,
    },
    cards: Array.from({ length: total }, (_, index) => {
      const relative = index - position;
      const layout = placements[index % placements.length];
      const leaving = Math.max(0, -relative);
      const opacity = (1 - smoothstep((leaving - .18) / .62)) * (1 - smoothstep((relative - 2.1) / 1.1));
      return {
        x: layout.x * width + Math.sign(layout.x) * leaving * width * .37,
        y: layout.y * height + relative * height * .105,
        z: clamp(-relative * 690, -2500, 700),
        rotateX: layout.rx + relative * 2.4,
        rotateY: layout.ry - relative * 3.2,
        rotateZ: layout.rz + relative * 1.3,
        opacity,
        visible: opacity > .005,
        zIndex: Math.round(1000 - relative * 100),
      };
    }),
  };
}

// A calmer homepage treatment: one centered project, with adjacent projects
// visible only during their transition. The full work page keeps its spatial stack.
export function getQuietGalleryFrame(progress, count, width = 1280, height = 800) {
  const frame = getGalleryFrame(progress, count, width, height);
  const position = Math.max(0, frame.progress * (itemCount(count) - 1 + arrival) - arrival);
  return { ...frame, cards: frame.cards.map((card, index) => {
    const relative = index - position;
    const opacity = clamp(1 - Math.abs(relative) * 1.2, 0, 1);
    return { ...card, x: relative * width * .65, y: Math.abs(relative) * 35,
      z: -Math.abs(relative) * 180, rotateX: 0, rotateY: relative * -9,
      rotateZ: relative * 5, opacity, visible: opacity > .005 };
  }) };
}
