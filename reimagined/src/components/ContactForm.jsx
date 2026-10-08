import { useId, useRef, useState } from 'react';
import { ArrowUpRight } from '@phosphor-icons/react';
import { CONTACT_FORM_NAME, CONTACT_ACTION, CONTACT_EMAIL, submitContact } from '../lib/contact.js';
import './contact-form.css';

export default function ContactForm() {
  const id = useId();
  const busy = useRef(false);
  const [state, setState] = useState('idle');
  async function handleSubmit(event) {
    event.preventDefault();
    if (busy.current) return;
    const form = event.currentTarget;
    const fields = new FormData(form);
    busy.current = true;
    setState('sending');
    try {
      const result = await submitContact(fields);
      setState(result.sent ? 'sent' : 'activation');
      if (result.sent) form.reset();
    } catch { setState('error'); }
    finally { busy.current = false; }
  }
  return <form className="hello-form" name={CONTACT_FORM_NAME} method="POST" action={CONTACT_ACTION} onSubmit={handleSubmit} aria-label="Send Nabeel a message" aria-describedby={`${id}-notice`}>
    <div hidden><label>Leave this empty<input name="_honey" tabIndex={-1} autoComplete="off" /></label></div>
    <fieldset disabled={state === 'sending'}>
      <legend className="sr-only">Your details and message</legend>
      <div className="hello-form-field"><label htmlFor={`${id}-name`}>Your name</label><input id={`${id}-name`} name="name" autoComplete="name" required maxLength={120} placeholder="What should I call you?" /></div>
      <div className="hello-form-field"><label htmlFor={`${id}-email`}>Your email</label><input id={`${id}-email`} name="email" type="email" autoComplete="email" required maxLength={254} placeholder="So I can write back" /></div>
      <div className="hello-form-field"><label htmlFor={`${id}-message`}>What’s on your mind?</label><textarea id={`${id}-message`} name="message" rows={3} required maxLength={5000} placeholder="Tell me a little about you…" /></div>
      <button className="hello-form-send" type="submit">{state === 'sending' ? 'Sending…' : 'Send message'}<ArrowUpRight size={22} aria-hidden="true" /></button>
    </fieldset>
    <div id={`${id}-notice`} className="hello-form-notice" role="status" aria-live="polite" aria-atomic="true">
      {state === 'sent' ? 'Thanks for saying hello. Your message has been submitted.' : state === 'activation' ? <>Email delivery is awaiting confirmation. Please <a href={`mailto:${CONTACT_EMAIL}`}>email me directly</a> for now. Your draft is still here.</> : state === 'error' ? <>Your message couldn’t be sent. Please try again, or <a href={`mailto:${CONTACT_EMAIL}`}>email me directly</a>. Your draft is still here.</> : null}
    </div>
  </form>;
}
