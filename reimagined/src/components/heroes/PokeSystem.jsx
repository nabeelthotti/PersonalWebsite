import { useCallback, useEffect, useId, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { ArrowRight, ArrowUpRight, Check, Copy, DotsSixVertical, X } from '@phosphor-icons/react';
import './poke-system.css';

const signals = [
  {
    id: 'visit', label: 'A repeat website visit', short: 'Website visit', person: 'Fieldnote team', channel: 'Email',
    evidence: 'A fictional company, Fieldnote, returns to a guide about connecting product data to a CRM.',
    limit: 'Company-level activity is a clue. It does not identify a person or prove they want to buy.',
    contexts: [
      { id: 'checklist', title: 'Offer a useful starting point', reason: 'The guide suggests an integration question. Offer something practical without claiming to know who was browsing.', subject: 'A starting point for product → CRM handoffs', message: 'Hi Fieldnote team — if connecting product data to your CRM is on the roadmap, I can share a short checklist of the decisions worth making first. Would that be useful?' },
      { id: 'question', title: 'Ask before assuming', reason: 'There may be a relevant project, but the signal does not tell you the scope. A small question is more useful than an immediate pitch.', subject: 'A question about your data handoffs', message: 'Hi Fieldnote team — are you exploring ways to connect product activity with your CRM, or is that already working well? If it is a current project, what is the most awkward handoff today?' },
    ],
  },
  {
    id: 'comment', label: 'A relevant LinkedIn comment', short: 'Public comment', person: 'Maya', channel: 'LinkedIn',
    evidence: 'In this fictional example, Maya comments publicly: “Our sales-to-onboarding handoffs still live in spreadsheets.”',
    limit: 'You know the problem Maya described. You do not know their budget, tools, or willingness to change them.',
    contexts: [
      { id: 'conversation', title: 'Continue the conversation', reason: 'Refer to the problem Maya actually described and ask a specific question. Start with understanding the workflow.', subject: 'About the handoff you described', message: 'Hi Maya — your comment about sales-to-onboarding handoffs living in spreadsheets stood out. Where does the process usually get stuck: passing the customer context along, or knowing who owns the next step?' },
      { id: 'handoff', title: 'Offer a practical first step', reason: 'An explicit workflow problem makes a small, relevant resource useful. Ask before dropping a long pitch into the conversation.', subject: 'A simple handoff starting point', message: 'Hi Maya — I saw your comment about spreadsheet handoffs. A simple owner + next action + customer context checklist can be a useful place to start. Would a short example help with the workflow you described?' },
    ],
  },
  {
    id: 'role', label: 'Someone starts a new role', short: 'New role', person: 'Alex', channel: 'LinkedIn',
    evidence: 'In this fictional example, Alex announces a new role leading customer operations at Fieldnote.',
    limit: 'A new role is a change, not a buying signal by itself. Give Alex space to define their priorities.',
    contexts: [
      { id: 'priorities', title: 'Ask about their priorities', reason: 'Acknowledge the public change and make the conversation about their goals. Avoid inventing a problem for them.', subject: 'Your first priorities at Fieldnote', message: 'Hi Alex — congratulations on the customer operations role at Fieldnote. As you get settled in, is there a particular handoff or workflow you want to understand first? Happy to compare notes if it would be useful.' },
      { id: 'map', title: 'Offer a first-month framework', reason: 'A lightweight way to map the current workflow may be useful in a new role. Offer it as an option, not as proof something is broken.', subject: 'A first-month workflow map', message: 'Hi Alex — congratulations on joining Fieldnote. If useful while you get oriented, I can share a simple way to map customer handoffs, owners, and open questions. Would you like the outline?' },
    ],
  },
];

const stepNames = ['Signal', 'Context', 'Draft', 'Human review'];

export default function PokeSystem({ open, onClose, returnFocusRef, href, reducedMotion = false }) {
  const dialogRef = useRef(null);
  const headingRef = useRef(null);
  const panelHeadingRef = useRef(null);
  const pathRef = useRef(null);
  const nodeRefs = useRef([]);
  const pulseRef = useRef(null);
  const animationRef = useRef(null);
  const dragRef = useRef(null);
  const dragWireRef = useRef(null);
  const dragGhostRef = useRef(null);
  const suppressDragClickRef = useRef(false);
  const previousStageRef = useRef(0);
  const closeRef = useRef(onClose);
  const titleId = useId();
  const [signalId, setSignalId] = useState('visit');
  const [contextId, setContextId] = useState('');
  const [stage, setStage] = useState(0);
  const [furthest, setFurthest] = useState(0);
  const [draft, setDraft] = useState('');
  const [review, setReview] = useState({ grounded: false, useful: false });
  const [complete, setComplete] = useState(false);
  const [transit, setTransit] = useState(null);
  const [status, setStatus] = useState('Choose one of three fictional signals.');
  const [copied, setCopied] = useState(false);
  const [dragging, setDragging] = useState(false);
  const [overContext, setOverContext] = useState(false);
  const signal = signals.find((item) => item.id === signalId);
  const context = signal.contexts.find((item) => item.id === contextId);
  closeRef.current = onClose;

  useEffect(() => {
    if (!open) { dragRef.current = null; setDragging(false); setOverContext(false); }
  }, [open]);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!open) { if (dialog.open) dialog.close(); return undefined; }
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    dialog.showModal();
    headingRef.current?.focus({ preventScroll: true });
    return () => {
      animationRef.current?.cancel();
      document.body.style.overflow = previousOverflow;
      if (dialog.open) dialog.close();
      returnFocusRef.current?.focus({ preventScroll: true });
    };
  }, [open, returnFocusRef]);

  useEffect(() => {
    if (open && previousStageRef.current !== stage) {
      panelHeadingRef.current?.focus({ preventScroll: true });
      if (window.matchMedia('(max-width: 640px)').matches) panelHeadingRef.current?.scrollIntoView({ block: 'start', behavior: 'instant' });
    }
    previousStageRef.current = stage;
  }, [open, stage]);

  useEffect(() => {
    animationRef.current?.cancel();
    const pulse = pulseRef.current;
    if (!open || !transit || reducedMotion || !pulse?.animate) return undefined;
    const from = nodeRefs.current[transit.from];
    const to = nodeRefs.current[transit.to];
    const path = pathRef.current;
    if (!from || !to || !path) return undefined;
    const bounds = path.getBoundingClientRect();
    const point = (node) => {
      const rect = node.getBoundingClientRect();
      return `translate(${rect.left + rect.width / 2 - bounds.left - 7}px, ${rect.top + rect.height / 2 - bounds.top - 7}px)`;
    };
    animationRef.current = pulse.animate([
      { transform: point(from), opacity: 0, offset: 0 },
      { transform: point(from), opacity: 1, offset: .08 },
      { transform: point(to), opacity: 1, offset: .88 },
      { transform: point(to), opacity: 0, offset: 1 },
    ], { duration: 670, easing: 'cubic-bezier(.35,.1,.25,1)' });
    return () => animationRef.current?.cancel();
  }, [transit, open, reducedMotion]);

  const selectSignal = (id) => {
    animationRef.current?.cancel();
    dragRef.current = null;
    setDragging(false);
    setOverContext(false);
    setSignalId(id);
    setContextId('');
    setStage(0);
    setFurthest(0);
    setDraft('');
    setReview({ grounded: false, useful: false });
    setComplete(false);
    setCopied(false);
    setTransit(null);
    setStatus('New signal selected. Connect it to context to start a new draft.');
  };

  const moveTo = (next) => {
    setTransit({ from: stage, to: next, id: Date.now() });
    setStage(next);
    setFurthest((current) => Math.max(current, next));
    setStatus(`${stepNames[next]}. ${next === 1 ? 'Choose what would make a useful conversation.' : next === 2 ? 'Read and edit the draft made from your choices.' : 'Review the message before keeping it.'}`);
  };

  const isContextTarget = (x, y) => {
    const target = nodeRefs.current[1]?.getBoundingClientRect();
    return !!target && x >= target.left - 20 && x <= target.right + 20 && y >= target.top - 20 && y <= target.bottom + 20;
  };

  const positionDrag = (event) => {
    const source = nodeRefs.current[0].getBoundingClientRect();
    const bounds = dialogRef.current.getBoundingClientRect();
    const x = Math.max(bounds.left + 10, Math.min(bounds.right - 10, event.clientX));
    const y = Math.max(bounds.top + 10, Math.min(bounds.bottom - 10, event.clientY));
    const originX = source.left + source.width / 2;
    const originY = source.top + source.height / 2;
    const wire = dragWireRef.current;
    wire.style.left = `${originX}px`;
    wire.style.top = `${originY}px`;
    wire.style.width = `${Math.hypot(x - originX, y - originY)}px`;
    wire.style.transform = `rotate(${Math.atan2(y - originY, x - originX)}rad)`;
    const ghost = dragGhostRef.current;
    ghost.style.left = `${Math.max(bounds.left + 8, Math.min(bounds.right - 150, x + 13))}px`;
    ghost.style.top = `${Math.max(bounds.top + 8, Math.min(bounds.bottom - 46, y - 21))}px`;
    setOverContext(isContextTarget(event.clientX, event.clientY));
  };

  const startDrag = (event) => {
    if (!event.isPrimary || (event.pointerType === 'mouse' && event.button !== 0)) return;
    event.preventDefault();
    event.currentTarget.focus({ preventScroll: true });
    event.currentTarget.setPointerCapture(event.pointerId);
    dragRef.current = { id: event.pointerId, x: event.clientX, y: event.clientY, moved: false };
    suppressDragClickRef.current = false;
    setDragging(true);
    positionDrag(event);
  };

  const moveDrag = (event) => {
    const drag = dragRef.current;
    if (!drag || drag.id !== event.pointerId) return;
    event.preventDefault();
    if (Math.hypot(event.clientX - drag.x, event.clientY - drag.y) > 7) drag.moved = true;
    positionDrag(event);
  };

  const stopDrag = (event, cancelled = false) => {
    const drag = dragRef.current;
    if (!drag || drag.id !== event.pointerId) return;
    const connected = !cancelled && drag.moved && isContextTarget(event.clientX, event.clientY);
    suppressDragClickRef.current = drag.moved || cancelled;
    dragRef.current = null;
    setDragging(false);
    setOverContext(false);
    if (event.currentTarget.hasPointerCapture(event.pointerId)) event.currentTarget.releasePointerCapture(event.pointerId);
    if (connected) moveTo(1);
    else if (drag.moved && !cancelled) setStatus('Not connected yet. Drop onto the Context circle, or use the Connect button.');
  };

  const createDraft = () => {
    if (!context) return;
    setDraft(context.message);
    setReview({ grounded: false, useful: false });
    setComplete(false);
    setCopied(false);
    moveTo(2);
  };

  const finish = () => {
    if (!review.grounded || !review.useful || !draft.trim()) return;
    setComplete(true);
    setStatus('Draft reviewed. Nothing was sent. You can copy it or try another signal.');
  };

  const copyDraft = async () => {
    try {
      await navigator.clipboard.writeText(`${signal.channel === 'Email' ? `Subject: ${context.subject}\n\n` : ''}${draft}`);
      setCopied(true);
      setStatus('Demo draft copied. Nothing has been sent.');
    } catch {
      setStatus('Copy is unavailable. You can select the draft text and copy it manually.');
    }
  };

  const close = useCallback(() => closeRef.current(), []);

  return createPortal(<dialog ref={dialogRef} className="poke-system" aria-labelledby={titleId} onCancel={(event) => { event.preventDefault(); close(); }} onClose={() => { if (open) close(); }} onClick={(event) => {
    if (event.target !== dialogRef.current) return;
    const bounds = dialogRef.current.getBoundingClientRect();
    if (event.clientX < bounds.left || event.clientX > bounds.right || event.clientY < bounds.top || event.clientY > bounds.bottom) close();
  }}>
    <header className="ps-header">
      <div className="ps-kicker"><span>A little GTM playground</span><span>Fictional examples · Nothing gets sent</span></div>
      <button className="ps-close" type="button" onClick={close} aria-label="Close the GTM playground"><X size={27} aria-hidden="true" /></button>
      <h2 id={titleId} ref={headingRef} tabIndex={-1}>A signal is a start.<br />Make it useful.</h2>
      <p>Software can connect the dots. You decide whether the conversation makes sense.</p>
    </header>

    <div className="ps-body">
      <div className="ps-path" ref={pathRef} aria-label="Signal to context to draft to human review">
        <div className="ps-connectors" aria-hidden="true">{[0, 1, 2].map((index) => <span key={index} className={furthest > index ? 'is-connected' : ''} />)}</div>
        <span className="ps-pulse" ref={pulseRef} aria-hidden="true" />
        {stepNames.map((label, index) => <button key={label} className={`ps-node${stage === index ? ' is-current' : ''}${complete && index === 3 ? ' is-complete' : ''}${index === 1 && overContext ? ' is-drop-target' : ''}`} type="button" aria-current={stage === index ? 'step' : undefined} aria-label={`${index + 1}. ${label}${index > furthest ? ', not connected yet' : ''}`} disabled={index > furthest} onClick={() => { if (index !== stage) moveTo(index); }}>
          <span className="ps-node-circle" ref={(element) => { nodeRefs.current[index] = element; }}>{complete && index === 3 ? <Check size={23} aria-hidden="true" /> : `0${index + 1}`}</span><span>{label}</span>
        </button>)}
      </div>

      <div className="ps-workspace">
        <aside className="ps-source">
          <p className="ps-small-label">Pick a signal. These three are fictional.</p>
          <div className="ps-signals" role="group" aria-label="Choose a fictional signal">{signals.map((item, index) => <button type="button" key={item.id} aria-pressed={item.id === signalId} onClick={() => { if (item.id !== signalId) selectSignal(item.id); }}><span>0{index + 1}</span><span>{item.label}</span><ArrowRight size={20} aria-hidden="true" /></button>)}</div>
          <p className="ps-evidence">{signal.evidence}</p>
          <p className="ps-source-limit">{signal.limit}</p>
        </aside>

        <section className="ps-stage" aria-label={`${stepNames[stage]} workspace`}>
          {stage === 0 && <>
            <p className="ps-hand-note">Drag a clue. Find the reason.</p>
            <h3 ref={panelHeadingRef} tabIndex={-1}>A clue, not a pitch.</h3>
            <p className="ps-stage-intro">One signal. A few possible conversations. Drag it onto <strong>Context</strong> above, then decide what would make the next step useful.</p>
            <button className={`ps-drag-token${dragging ? ' is-dragging' : ''}`} type="button" aria-label={`Connect ${signal.short} to Context. Drag to the Context circle, or press Enter.`} onPointerDown={startDrag} onPointerMove={moveDrag} onPointerUp={stopDrag} onPointerCancel={(event) => stopDrag(event, true)} onLostPointerCapture={(event) => stopDrag(event, true)} onClick={(event) => { const suppress = suppressDragClickRef.current; suppressDragClickRef.current = false; if (suppress && event.detail !== 0) return; moveTo(1); }}><span className="ps-token-dot" aria-hidden="true" /><span>{signal.short}</span><DotsSixVertical className="ps-drag-grip" size={24} aria-hidden="true" /></button>
            <p className="ps-drag-hint">Pick it up. The yellow line is your connection.</p>
            <button type="button" className="ps-primary" onClick={() => moveTo(1)}>Connect signal to context <ArrowRight size={21} aria-hidden="true" /></button>
          </>}

          {stage === 1 && <>
            <p className="ps-small-label">02 / Give the signal a purpose</p>
            <h3 ref={panelHeadingRef} tabIndex={-1}>What would be useful?</h3>
            <div className="ps-angles" role="group" aria-label="Choose a conversation angle">{signal.contexts.map((item, index) => <button type="button" key={item.id} aria-pressed={contextId === item.id} onClick={() => { setContextId(item.id); setFurthest(1); setReview({ grounded: false, useful: false }); setComplete(false); }}><span>{index === 0 ? 'A' : 'B'}</span><span>{item.title}</span><span className="ps-angle-indicator" aria-hidden="true">{contextId === item.id ? '✓' : '+'}</span></button>)}</div>
            <div className="ps-reason"><p className="ps-small-label">Why this follows</p><p>{context?.reason || 'Pick an angle. The reason matters as much as the wording.'}</p></div>
            <button type="button" className="ps-primary" disabled={!context} onClick={createDraft}>Turn that into a draft <ArrowRight size={21} aria-hidden="true" /></button>
          </>}

          {stage === 2 && context && <>
            <p className="ps-small-label">03 / {signal.channel} · Fictional draft</p>
            <h3 ref={panelHeadingRef} tabIndex={-1}>Words with a reason.</h3>
            <p className="ps-stage-intro">This draft follows your selected angle. Make it sound like a conversation you would actually have.</p>
            <div className="ps-draft-paper">
              {signal.channel === 'Email' && <p className="ps-subject"><span>Subject</span>{context.subject}</p>}
              <label htmlFor={`${titleId}-draft`}>Edit the outreach preview</label>
              <textarea id={`${titleId}-draft`} value={draft} maxLength={1600} spellCheck onChange={(event) => { setDraft(event.target.value); setReview({ grounded: false, useful: false }); setComplete(false); setCopied(false); }} />
            </div>
            <div className="ps-stage-actions"><button type="button" className="ps-primary" disabled={!draft.trim()} onClick={() => moveTo(3)}>Hand it to a human <ArrowRight size={21} aria-hidden="true" /></button><button type="button" className="ps-text-button" onClick={() => moveTo(1)}>Try the other angle</button></div>
          </>}

          {stage === 3 && context && <>
            <p className="ps-small-label">04 / The human part</p>
            <h3 ref={panelHeadingRef} tabIndex={-1}>{complete ? 'A draft worth keeping.' : 'Would you send this?'}</h3>
            <div className="ps-review-message">{signal.channel === 'Email' && <p className="ps-subject"><span>Subject</span>{context.subject}</p>}<p>{draft}</p></div>
            {!complete ? <>
              <fieldset className="ps-review-checks"><legend>Make the call before keeping the draft.</legend><label><input type="checkbox" checked={review.grounded} onChange={(event) => setReview((current) => ({ ...current, grounded: event.target.checked }))} /><span>It follows from the signal, without guessing what the person wants.</span></label><label><input type="checkbox" checked={review.useful} onChange={(event) => setReview((current) => ({ ...current, useful: event.target.checked }))} /><span>The next step is useful, specific, and easy to say no to.</span></label></fieldset>
              <div className="ps-stage-actions"><button type="button" className="ps-primary" disabled={!review.grounded || !review.useful || !draft.trim()} onClick={finish}>Keep this as a draft <Check size={20} aria-hidden="true" /></button><button type="button" className="ps-text-button" onClick={() => moveTo(2)}>Needs an edit</button></div>
            </> : <>
              <p className="ps-complete-note"><Check size={22} aria-hidden="true" /><span>You connected the signal, chose a reason, and reviewed the words. <strong>Nothing was sent.</strong></span></p>
              <div className="ps-stage-actions"><button type="button" className="ps-primary" onClick={copyDraft}>{copied ? 'Copied' : 'Copy demo draft'}<Copy size={20} aria-hidden="true" /></button><button type="button" className="ps-text-button" onClick={() => selectSignal(signals[(signals.findIndex((item) => item.id === signalId) + 1) % signals.length].id)}>Try the next signal</button></div>
            </>}
          </>}
        </section>
      </div>

      <footer className="ps-footer"><p>A fictional example of connecting engineering with customer context. Everything stays in this playground.</p><a href={href('/work')} onClick={close}>The work behind the idea <ArrowUpRight size={19} aria-hidden="true" /></a></footer>
      <p className="ps-status" role="status" aria-live="polite" aria-atomic="true">{status}</p>
    </div>
    <span ref={dragWireRef} className="ps-drag-wire" hidden={!dragging} aria-hidden="true" />
    <span ref={dragGhostRef} className="ps-drag-ghost" hidden={!dragging} aria-hidden="true">{signal.short}</span>
  </dialog>, document.body);
}
