import { useId, useRef, useState } from 'react';
import { ArrowDown, ArrowDownLeft, ArrowUpRight } from '@phosphor-icons/react';
import RoomDesigner from './RoomDesigner';
import './room-hero.css';

const titleLines = ['Software.', 'Sofas.', 'Somewhere new.'];

export default function RoomHero({ href }) {
  const dragRef = useRef(null);
  const titleId = useId();
  const helpId = useId();
  const [designerOpen, setDesignerOpen] = useState(false);

  function pointerDown(event) {
    if (event.button !== 0 || !event.isPrimary) return;
    dragRef.current = { x: event.clientX, y: event.clientY, type: event.pointerType };
  }

  function pointerMove(event) {
    const start = dragRef.current;
    if (!start) return;
    const dx = Math.abs(event.clientX - start.x);
    const dy = Math.abs(event.clientY - start.y);
    // A vertical touch gesture continues scrolling the page normally.
    if (start.type === 'touch' && dy > dx && dy > 9) { dragRef.current = null; return; }
    if (dx > 10 || (start.type !== 'touch' && dy > 10)) {
      dragRef.current = null;
      event.currentTarget.focus({ preventScroll: true });
      setDesignerOpen(true);
    }
  }

  return (
    <section className="personal-hero room-hero" aria-labelledby={titleId}>
      <div className="room-floor" aria-hidden="true" />
      <h1 className="room-title" id={titleId}>{titleLines.map(line => <span key={line}>{line}</span>)}</h1>
      <div className="room-paper" aria-hidden="true"><div className="room-title room-title-ink">{titleLines.map(line => <span key={line}>{line}</span>)}</div></div>
      <div className="room-intro">
        <p>I’m Nabeel. I build GTM systems at <a href="https://www.syftdata.com/" target="_blank" rel="noreferrer">Syft Data</a>, and I’m building <a href={href('/work/beel')}>Beel</a>. There’s more to me, too.</p>
        <a className="room-meet-link" href="#my-story">Meet me<ArrowDown size={21} aria-hidden="true" /></a>
      </div>
      <div className="room-chair-area">
        <p className="room-invitation" aria-hidden="true">Make yourself<br />a little room.<ArrowDownLeft size={40} weight="light" /></p>
        <button className="room-chair" type="button" aria-label="Design a room with the yellow chair" aria-describedby={helpId}
          aria-haspopup="dialog" onClick={() => setDesignerOpen(true)} onPointerDown={pointerDown} onPointerMove={pointerMove}
          onPointerUp={() => { dragRef.current = null; }} onPointerCancel={() => { dragRef.current = null; }} onPointerLeave={() => { dragRef.current = null; }}>
          <img src="/assets/heroes/yellow-chair.png" width="1322" height="1190" alt="Sunflower yellow upholstered lounge chair" draggable="false" fetchPriority="high" />
        </button>
        <img className="room-chair-hand" src="/assets/heroes/chair-hand.png" width="1774" height="887" alt="" aria-hidden="true" draggable="false" />
      </div>
      <div className="room-footer">
        <div className="room-arrangement-controls"><button type="button" aria-haspopup="dialog" onClick={() => setDesignerOpen(true)}>Make a room work<ArrowUpRight size={19} aria-hidden="true" /></button><span className="room-playground-caption">Two briefs. Your arrangement.</span></div>
        <p>From LA. In Pleasanton.</p>
      </div>
      <p className="room-assistive" id={helpId}>Click or start dragging to open the room playground. Choose a brief, arrange the furniture, and make a little room work.</p>
      <RoomDesigner open={designerOpen} onClose={() => setDesignerOpen(false)} />
    </section>
  );
}
