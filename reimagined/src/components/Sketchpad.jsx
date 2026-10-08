import { useCallback, useEffect, useId, useRef, useState } from 'react';
import { ArrowCounterClockwise, DownloadSimple, Eraser, PencilSimple, Trash } from '@phosphor-icons/react';
import './sketchpad.css';

const WIDTH = 1000;
const HEIGHT = 640;

function paintStroke(context, stroke, ink, paper) {
  if (stroke.type === 'clear') {
    context.fillStyle = paper;
    context.fillRect(0, 0, WIDTH, HEIGHT);
    return;
  }
  const { points, size, tool } = stroke;
  if (!points.length) return;
  context.strokeStyle = tool === 'eraser' ? paper : ink;
  context.fillStyle = context.strokeStyle;
  context.lineCap = 'round';
  context.lineJoin = 'round';
  const radius = (tool === 'eraser' ? size * 3 : size) / 2;
  if (points.length === 1) {
    context.beginPath();
    context.arc(points[0].x, points[0].y, radius, 0, Math.PI * 2);
    context.fill();
    return;
  }
  for (let index = 1; index < points.length; index += 1) {
    const previous = points[index - 1];
    const current = points[index];
    context.lineWidth = radius * 2 * (tool === 'eraser' ? 1 : .8 + current.pressure * .4);
    context.beginPath();
    context.moveTo(previous.x, previous.y);
    context.lineTo(current.x, current.y);
    context.stroke();
  }
}

export default function Sketchpad({ variant = 'workbench', ink: customInk, paper: customPaper, downloadName = 'a-little-doodle.png' }) {
  const isRed = variant === 'red';
  const ink = customInk ?? (isRed ? '#f9d63b' : '#173ca0');
  const paper = customPaper ?? (isRed ? '#cf251e' : '#ffffff');
  const canvasRef = useRef(null);
  const strokesRef = useRef([]);
  const activeRef = useRef(null);
  const pointerRef = useRef(null);
  const keyboardRef = useRef({ x: WIDTH / 2, y: HEIGHT / 2 });
  const keyboardVisibleRef = useRef(false);
  const [tool, setTool] = useState('pen');
  const [size, setSize] = useState(7);
  const [revision, setRevision] = useState(0);
  const [drawing, setDrawing] = useState(false);
  const [announcement, setAnnouncement] = useState('Your canvas is ready.');
  const helpId = useId();
  const sizeId = useId();

  const render = useCallback((target, includeCursor = false) => {
    const canvas = target || canvasRef.current;
    if (!canvas) return;
    const context = canvas.getContext('2d');
    if (!context) return;
    context.setTransform(canvas.width / WIDTH, 0, 0, canvas.height / HEIGHT, 0, 0);
    context.fillStyle = paper;
    context.fillRect(0, 0, WIDTH, HEIGHT);
    strokesRef.current.forEach((stroke) => paintStroke(context, stroke, ink, paper));
    if (activeRef.current) paintStroke(context, activeRef.current, ink, paper);
    if (includeCursor && keyboardVisibleRef.current) {
      const { x, y } = keyboardRef.current;
      context.strokeStyle = ink;
      context.lineWidth = 1.5;
      context.beginPath();
      context.arc(x, y, 12, 0, Math.PI * 2);
      context.moveTo(x - 19, y);
      context.lineTo(x + 19, y);
      context.moveTo(x, y - 19);
      context.lineTo(x, y + 19);
      context.stroke();
    }
  }, [ink, paper]);

  useEffect(() => {
    const canvas = canvasRef.current;
    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      const ratio = Math.min(window.devicePixelRatio || 1, 3);
      canvas.width = Math.max(1, Math.round(rect.width * ratio));
      canvas.height = Math.max(1, Math.round(rect.height * ratio));
      render(undefined, true);
    };
    resize();
    const observer = new ResizeObserver(resize);
    observer.observe(canvas);
    return () => observer.disconnect();
  }, [render]);

  const finishStroke = useCallback(() => {
    if (activeRef.current) {
      strokesRef.current.push(activeRef.current);
      activeRef.current = null;
      setRevision((value) => value + 1);
      setDrawing(false);
    }
    pointerRef.current = null;
    render(undefined, true);
  }, [render]);

  const pointFor = (event) => {
    const rect = canvasRef.current.getBoundingClientRect();
    return {
      x: Math.max(0, Math.min(WIDTH, (event.clientX - rect.left) / rect.width * WIDTH)),
      y: Math.max(0, Math.min(HEIGHT, (event.clientY - rect.top) / rect.height * HEIGHT)),
      pressure: event.pointerType === 'pen' ? event.pressure || .5 : .5,
    };
  };

  const startPointer = (event) => {
    if (!event.isPrimary || (event.pointerType === 'mouse' && event.button !== 0)) return;
    event.preventDefault();
    finishStroke();
    keyboardVisibleRef.current = false;
    canvasRef.current.focus({ preventScroll: true });
    canvasRef.current.setPointerCapture(event.pointerId);
    pointerRef.current = event.pointerId;
    activeRef.current = { tool, size, points: [pointFor(event)] };
    setDrawing(true);
    render();
  };

  const movePointer = (event) => {
    if (pointerRef.current !== event.pointerId || !activeRef.current) return;
    event.preventDefault();
    const points = event.nativeEvent.getCoalescedEvents?.() || [event];
    points.forEach((point) => activeRef.current.points.push(pointFor(point)));
    render();
  };

  const endPointer = (event) => {
    if (pointerRef.current !== event.pointerId) return;
    finishStroke();
    if (canvasRef.current.hasPointerCapture(event.pointerId)) {
      canvasRef.current.releasePointerCapture(event.pointerId);
    }
  };

  const undo = () => {
    finishStroke();
    if (!strokesRef.current.length) return;
    strokesRef.current.pop();
    setRevision((value) => value + 1);
    setAnnouncement('Last action undone.');
    render(undefined, true);
  };

  const clear = () => {
    finishStroke();
    strokesRef.current.push({ type: 'clear' });
    setRevision((value) => value + 1);
    setAnnouncement('Canvas cleared. Undo will bring your drawing back.');
    render(undefined, true);
  };

  const download = () => {
    finishStroke();
    const image = document.createElement('canvas');
    image.width = WIDTH * 2;
    image.height = HEIGHT * 2;
    render(image);
    image.toBlob((blob) => {
      if (!blob) {
        setAnnouncement('The download could not be created. Please try again.');
        return;
      }
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.download = downloadName;
      link.href = url;
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.setTimeout(() => URL.revokeObjectURL(url), 1000);
      setAnnouncement('Your drawing has been downloaded as a PNG.');
    }, 'image/png');
  };

  const handleKey = (event) => {
    if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === 'z') {
      event.preventDefault();
      undo();
      return;
    }
    if (event.key === 'Escape') {
      finishStroke();
      setAnnouncement('Line finished.');
      return;
    }
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      keyboardVisibleRef.current = true;
      if (activeRef.current) {
        finishStroke();
        setAnnouncement('Line finished.');
      } else {
        activeRef.current = { tool, size, points: [{ ...keyboardRef.current, pressure: .5 }] };
        setDrawing(true);
        setAnnouncement('Drawing. Use arrow keys to move; Enter finishes the line.');
        render(undefined, true);
      }
      return;
    }
    const directions = { ArrowLeft: [-1, 0], ArrowRight: [1, 0], ArrowUp: [0, -1], ArrowDown: [0, 1] };
    if (!directions[event.key]) return;
    event.preventDefault();
    keyboardVisibleRef.current = true;
    const [dx, dy] = directions[event.key];
    const step = event.shiftKey ? 30 : 8;
    keyboardRef.current = {
      x: Math.max(0, Math.min(WIDTH, keyboardRef.current.x + dx * step)),
      y: Math.max(0, Math.min(HEIGHT, keyboardRef.current.y + dy * step)),
    };
    if (activeRef.current) activeRef.current.points.push({ ...keyboardRef.current, pressure: .5 });
    render(undefined, true);
  };

  // Clear remains in the history so an accidental clear is always reversible.
  const latestClear = strokesRef.current.findLastIndex((stroke) => stroke.type === 'clear');
  const hasMarks = strokesRef.current.slice(latestClear + 1).some((stroke) => stroke.tool === 'pen');
  const hasHistory = revision > 0 && strokesRef.current.length > 0;

  return (
    <section className={`sketchpad sketchpad--${isRed ? 'red' : 'aqua'}`} aria-label="Freehand sketchpad" style={{ '--drawing-ink': ink, '--drawing-paper': paper }}>
      <div className="sketchpad-toolbar" aria-label="Drawing controls">
        <div className="sketchpad-tools" role="group" aria-label="Drawing tool">
          <button type="button" aria-pressed={tool === 'pen'} onClick={() => { finishStroke(); setTool('pen'); }}>
            <PencilSimple aria-hidden="true" size={20} /> <span>Pen</span>
          </button>
          <button type="button" aria-pressed={tool === 'eraser'} onClick={() => { finishStroke(); setTool('eraser'); }}>
            <Eraser aria-hidden="true" size={20} /> <span>Eraser</span>
          </button>
        </div>
        <label className="sketchpad-size" htmlFor={sizeId}>
          <span>Size</span>
          <input id={sizeId} type="range" min="2" max="24" value={size} onChange={(event) => setSize(Number(event.target.value))} aria-label="Brush size" aria-valuetext={`${size} pixels`} />
          <output htmlFor={sizeId}>{size}</output>
        </label>
        <div className="sketchpad-history" role="group" aria-label="Edit drawing">
          <button type="button" onClick={undo} disabled={!hasHistory && !drawing} aria-label="Undo last drawing action"><ArrowCounterClockwise aria-hidden="true" size={20} /><span>Undo</span></button>
          <button type="button" onClick={clear} disabled={!hasMarks && !drawing} aria-label="Clear canvas"><Trash aria-hidden="true" size={20} /><span>Clear</span></button>
        </div>
      </div>

      <div className={`sketchpad-paper ${tool === 'eraser' ? 'sketchpad-paper--eraser' : ''}`}>
        <canvas
          ref={canvasRef}
          width={WIDTH}
          height={HEIGHT}
          tabIndex={0}
          role="application"
          aria-label="Drawing canvas"
          aria-describedby={helpId}
          onPointerDown={startPointer}
          onPointerMove={movePointer}
          onPointerUp={endPointer}
          onPointerCancel={endPointer}
          onLostPointerCapture={endPointer}
          onKeyDown={handleKey}
          onBlur={() => { keyboardVisibleRef.current = false; finishStroke(); }}
        >Your browser needs canvas support to use this drawing pad.</canvas>
        {!hasMarks && !drawing && <div className="sketchpad-prompt" aria-hidden="true"><span>A number. A thought.</span><span>A really bad doodle.</span><small>Make your mark.</small></div>}
      </div>

      <div className="sketchpad-footer">
        <p>Nothing to get right. Just draw.</p>
        <button type="button" className="sketchpad-download" onClick={download}><DownloadSimple size={20} aria-hidden="true" />Keep your doodle <span className="sketchpad-format">PNG</span></button>
      </div>
      <p className="sketchpad-help" id={helpId}>Use your mouse, finger, or pen. With a keyboard, focus the canvas and use the arrow keys to move. Enter starts or finishes a line; Shift moves farther.</p>
      <p className="sketchpad-announcement" role="status" aria-live="polite">{announcement}</p>
    </section>
  );
}
