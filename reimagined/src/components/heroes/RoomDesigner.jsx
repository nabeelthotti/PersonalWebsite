import { useEffect, useId, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { ArrowDown, ArrowLeft, ArrowRight, ArrowUp, ArrowsClockwise, Check, DownloadSimple, Lightbulb, X } from '@phosphor-icons/react';
import { ROOM_ASSETS as ASSETS, ROOM_ASPECT, ROOM_BRIEFS as BRIEFS, initialRoom, constrainObject, evaluateRoom } from '../../lib/room-design';
import './room-designer.css';

function loadImage(src) {
  return new Promise((resolve, reject) => {
    const image = new Image();
    image.onload = () => resolve(image);
    image.onerror = reject;
    image.src = src;
  });
}

async function exportRoom(objects, brief, lightOn) {
  const images = await Promise.all(objects.map(object => loadImage(ASSETS[object.type].src)));
  await document.fonts.ready;
  const canvas = document.createElement('canvas');
  const width = 1440, height = width / ROOM_ASPECT, top = 160;
  canvas.width = width;
  canvas.height = Math.round(height + top + 112);
  const context = canvas.getContext('2d');
  if (!context) throw new Error('Canvas unavailable');
  context.fillStyle = '#fff8e8'; context.fillRect(0, 0, width, canvas.height);
  context.fillStyle = '#cf251e'; context.font = '800 59px "Fraunces Variable", Georgia';
  context.fillText(BRIEFS[brief].name, 62, 84);
  context.fillStyle = '#20221e'; context.font = '25px "Source Sans 3 Variable", sans-serif';
  context.fillText('A little room, arranged by you.', 65, 125);
  context.save(); context.translate(0, top);
  context.fillStyle = '#eee5d2'; context.fillRect(0, 0, width, height);
  context.fillStyle = '#e1d4b8'; context.fillRect(0, height * .25, width, height * .75);
  context.strokeStyle = '#b2a68d'; context.lineWidth = 1; context.beginPath(); context.moveTo(0, height * .25); context.lineTo(width, height * .25); context.stroke();
  if (lightOn) {
    const lamp = objects.find(object => object.type === 'lamp');
    const lampHeight = ASSETS.lamp.width * width / ASSETS.lamp.aspect;
    const lx = lamp.x * width, ly = lamp.y * height - lampHeight * .76;
    const glow = context.createRadialGradient(lx, ly, 0, lx, ly, width * .20);
    glow.addColorStop(0, '#ffdd8299'); glow.addColorStop(1, '#ffdd8200');
    context.fillStyle = glow; context.fillRect(0, 0, width, height);
  }
  objects.map((object, index) => ({ object, image: images[index] })).sort((a, b) => a.object.y - b.object.y).forEach(({ object, image }) => {
    const drawWidth = ASSETS[object.type].width * width, drawHeight = drawWidth / ASSETS[object.type].aspect;
    context.save(); context.translate(object.x * width, object.y * height);
    if (object.type === 'chair' && object.facing === 'right') context.scale(-1, 1);
    context.drawImage(image, -drawWidth / 2, -drawHeight, drawWidth, drawHeight); context.restore();
  });
  context.restore(); context.fillStyle = '#20221e'; context.font = '23px "Source Sans 3 Variable", sans-serif';
  context.fillText('Nabeel Thotti · The room playground', 62, canvas.height - 45);
  const blob = await new Promise(resolve => canvas.toBlob(resolve, 'image/png'));
  if (!blob) throw new Error('Image unavailable');
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a'); link.href = url; link.download = `my-${brief === 'reading' ? 'reading-corner' : 'conversation-room'}.png`; link.click();
  window.setTimeout(() => URL.revokeObjectURL(url), 15000);
}

export default function RoomDesigner({ open, onClose }) {
  const dialogRef = useRef(null), stageRef = useRef(null), dragRef = useRef(null), itemRefs = useRef({});
  const titleId = useId(), instructionsId = useId();
  const [brief, setBrief] = useState('reading');
  const [objects, setObjects] = useState(() => initialRoom('reading'));
  const [selected, setSelected] = useState('chair');
  const [lightOn, setLightOn] = useState(false);
  const [alternate, setAlternate] = useState(false);
  const [dragging, setDragging] = useState(null);
  const [saveState, setSaveState] = useState('');
  const [announcement, setAnnouncement] = useState('');
  const feedback = evaluateRoom(objects, brief, lightOn);
  const complete = feedback.every(item => item.done);
  const selectedObject = objects.find(object => object.id === selected) || objects[0];
  const lamp = objects.find(object => object.type === 'lamp');
  const feedbackText = feedback.map(item => item.text).join(' ');

  useEffect(() => {
    if (!open) return;
    const dialog = dialogRef.current;
    const previousFocus = document.activeElement;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    dialog.showModal();
    return () => {
      dragRef.current = null;
      if (dialog.open) dialog.close();
      document.body.style.overflow = previousOverflow;
      if (previousFocus instanceof HTMLElement && previousFocus.isConnected) previousFocus.focus({ preventScroll: true });
    };
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const timeout = window.setTimeout(() => setAnnouncement(complete ? 'Your room works. You can save your arrangement or keep playing.' : feedbackText), 350);
    return () => window.clearTimeout(timeout);
  }, [feedbackText, complete, open]);

  function changeBrief(next) {
    dragRef.current = null; setDragging(null); setBrief(next); setObjects(initialRoom(next));
    setSelected('chair'); setAlternate(false); setLightOn(false); setSaveState('');
  }

  function reset(swap = false) {
    const nextAlternate = swap ? !alternate : false;
    setAlternate(nextAlternate); setObjects(initialRoom(brief, nextAlternate)); setLightOn(false); setSaveState('');
  }

  function move(id, x, y, relative = false) {
    setSaveState('');
    setObjects(current => current.map(object => object.id === id ? constrainObject(object, (relative ? object.x : 0) + x, (relative ? object.y : 0) + y) : object));
  }

  function pointerDown(event, object) {
    if (event.button !== 0 || !event.isPrimary) return;
    event.preventDefault(); event.currentTarget.focus({ preventScroll: true }); setSelected(object.id);
    const bounds = stageRef.current.getBoundingClientRect();
    dragRef.current = { id: event.pointerId, objectId: object.id, x: event.clientX, y: event.clientY, startX: object.x, startY: object.y, width: bounds.width, height: bounds.height };
    event.currentTarget.setPointerCapture(event.pointerId); setDragging(object.id);
  }

  function pointerMove(event) {
    const drag = dragRef.current;
    if (!drag || drag.id !== event.pointerId) return;
    move(drag.objectId, drag.startX + (event.clientX - drag.x) / drag.width, drag.startY + (event.clientY - drag.y) / drag.height);
  }

  function endDrag(event) {
    if (!dragRef.current || dragRef.current.id !== event.pointerId) return;
    dragRef.current = null; setDragging(null);
    if (event.currentTarget.hasPointerCapture(event.pointerId)) event.currentTarget.releasePointerCapture(event.pointerId);
  }

  function keyDown(event, object) {
    const directions = { ArrowLeft: [-1, 0], ArrowRight: [1, 0], ArrowUp: [0, -1], ArrowDown: [0, 1] };
    if (!directions[event.key]) return;
    event.preventDefault(); setSelected(object.id);
    const [dx, dy] = directions[event.key], step = event.shiftKey ? .05 : .015;
    move(object.id, dx * step, dy * step, true);
  }

  function turn() {
    setObjects(current => current.map(object => object.id === selectedObject.id ? { ...object, facing: object.facing === 'left' ? 'right' : 'left' } : object)); setSaveState('');
  }

  async function save() {
    setSaveState('Saving…');
    try { await exportRoom(objects, brief, lightOn); setSaveState('Your room is saved.'); }
    catch { setSaveState('The image could not be saved. Please try again.'); }
  }

  if (!open) return null;
  return createPortal(
    <dialog className="room-designer" ref={dialogRef} aria-labelledby={titleId} onCancel={event => { event.preventDefault(); onClose(); }}>
      <div className="room-designer-header">
        <div><p className="room-designer-eyebrow">Nabeel’s room playground</p><h2 className="room-designer-title" id={titleId}>Make a little room work.</h2></div>
        <button className="room-designer-close" type="button" onClick={onClose} aria-label="Close room playground"><X size={25} aria-hidden="true" /></button>
      </div>
      <p className="room-designer-story">I help people decorate their homes. Here’s a little space to try it yourself.</p>
      <fieldset className="room-designer-briefs"><legend>Choose your brief</legend>{Object.entries(BRIEFS).map(([key, value]) => <label key={key}><input type="radio" name={`${titleId}-brief`} value={key} checked={brief === key} onChange={() => changeBrief(key)} /><span>{value.name}</span></label>)}</fieldset>
      <div className="room-designer-workspace">
        <div className="room-designer-canvas-column">
          <p className="room-designer-task">{BRIEFS[brief].description}</p>
          <div className={`room-designer-stage${dragging ? ' is-dragging' : ''}`} ref={stageRef} role="group" aria-label="Your room. Movable furniture." aria-describedby={instructionsId}>
            <div className="room-designer-back-wall" aria-hidden="true" />
            <div className="room-designer-walkway" aria-hidden="true"><span>Leave a way through</span><ArrowRight size={21} /></div>
            {lightOn && <div className="room-designer-lamp-glow" aria-hidden="true" style={{ left: `${lamp.x * 100}%`, top: `${(lamp.y - .42) * 100}%` }} />}
            {objects.map(object => <button key={object.id} ref={node => { itemRefs.current[object.id] = node; }} type="button"
              className={`room-designer-object room-designer-object--${object.type}${selected === object.id ? ' is-selected' : ''}${dragging === object.id ? ' is-dragging' : ''}${object.type === 'lamp' && lightOn ? ' is-lit' : ''}`}
              style={{ left: `${object.x * 100}%`, top: `${object.y * 100}%`, width: `${ASSETS[object.type].width * 100}%`, zIndex: Math.round(object.y * 100) }}
              aria-label={`${object.name}${object.type === 'chair' ? `, facing ${object.facing}` : ''}. Position ${Math.round(object.x * 100)} percent across, ${Math.round(object.y * 100)} percent down.`}
              aria-pressed={selected === object.id} aria-describedby={instructionsId} onClick={() => setSelected(object.id)}
              onPointerDown={event => pointerDown(event, object)} onPointerMove={pointerMove} onPointerUp={endDrag} onPointerCancel={endDrag} onLostPointerCapture={endDrag}
              onKeyDown={event => keyDown(event, object)}>
              <img src={ASSETS[object.type].src} style={{ transform: object.type === 'chair' && object.facing === 'right' ? 'scaleX(-1)' : undefined }} alt="" draggable="false" />
              <span className="room-designer-object-label">{object.name}</span>
            </button>)}
          </div>
          <div className="room-designer-object-controls">
            <label className="room-designer-select">Move <select value={selected} onChange={event => { setSelected(event.target.value); itemRefs.current[event.target.value]?.focus({ preventScroll: true }); }}>{objects.map(object => <option key={object.id} value={object.id}>{object.name}</option>)}</select></label>
            <div className="room-designer-directions" role="group" aria-label={`Move ${selectedObject.name.toLowerCase()}`}>
              {[['Left', ArrowLeft, -.025, 0], ['Up', ArrowUp, 0, -.025], ['Down', ArrowDown, 0, .025], ['Right', ArrowRight, .025, 0]].map(([label, Icon, x, y]) => <button type="button" key={label} aria-label={`Move ${selectedObject.name.toLowerCase()} ${label.toLowerCase()}`} onClick={() => move(selectedObject.id, x, y, true)}><Icon size={18} aria-hidden="true" /></button>)}
            </div>
            {selectedObject.type === 'chair' && <button className="room-designer-turn" type="button" onClick={turn}><ArrowsClockwise size={17} aria-hidden="true" />Face {selectedObject.facing === 'left' ? 'right' : 'left'}</button>}
          </div>
          <p className="room-designer-instructions" id={instructionsId}>Drag a piece anywhere in the room. Or select it and use the arrows. Shift + arrow moves farther.</p>
        </div>
        <aside className="room-designer-notes" aria-label="How the room works">
          <p className="room-designer-note-label">{complete ? 'That feels good.' : 'A few things to notice'}</p>
          <ul>{feedback.map(item => <li key={item.id} className={item.done ? 'is-done' : ''}><span aria-hidden="true">{item.done ? <Check size={17} weight="bold" /> : '↳'}</span>{item.text}</li>)}</ul>
          <button className={`room-designer-light${lightOn ? ' is-on' : ''}`} type="button" aria-pressed={lightOn} onClick={() => { setLightOn(value => !value); setSaveState(''); }}><Lightbulb size={21} weight={lightOn ? 'fill' : 'regular'} aria-hidden="true" />{lightOn ? 'Reading light on' : 'Switch the light on'}</button>
          {complete && <p className="room-designer-complete">{brief === 'reading' ? 'A good book could live here.' : 'Pull up a chair. Stay a while.'} Save your room, or keep moving things around.</p>}
          <div className="room-designer-layout-actions"><button type="button" onClick={() => reset(true)}>Try another starting layout</button><button type="button" onClick={() => reset()}>Start over</button></div>
        </aside>
      </div>
      <footer className="room-designer-footer"><p>No two people arrange a room quite the same.</p><button className="room-designer-save" type="button" onClick={save} disabled={saveState === 'Saving…'}><DownloadSimple size={19} aria-hidden="true" />{saveState === 'Saving…' ? 'Saving…' : 'Save my room'}</button><span className="room-designer-save-status" role="status">{saveState === 'Saving…' ? '' : saveState}</span></footer>
      <p className="room-designer-assistive" role="status" aria-live="polite" aria-atomic="true">{announcement}</p>
    </dialog>, document.body,
  );
}
