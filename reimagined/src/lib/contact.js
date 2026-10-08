export const CONTACT_FORM_NAME = 'personal-contact';
export const CONTACT_EMAIL = 'nabeelthotti02@gmail.com';
// After email activation, the optional provider token can replace the email in this URL.
const recipient = import.meta.env?.VITE_FORMSUBMIT_ID || CONTACT_EMAIL;
export const CONTACT_ACTION = `https://formsubmit.co/${encodeURIComponent(recipient)}`;
export const CONTACT_ENDPOINT = `https://formsubmit.co/ajax/${encodeURIComponent(recipient)}`;

export async function submitContact(fields, { fetcher = fetch } = {}) {
  const entries = fields instanceof FormData || fields instanceof URLSearchParams
    ? Object.fromEntries(fields) : fields;
  const payload = {
    name: entries.name,
    email: entries.email,
    message: entries.message,
    _honey: entries._honey || '',
    _subject: 'New message for Nabeel — personal website',
    _template: 'table',
  };
  const response = await fetcher(CONTACT_ENDPOINT, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
    body: JSON.stringify(payload),
    signal: AbortSignal.timeout(20000),
  });
  if (!response.ok) throw new Error('Contact submission failed');
  const result = await response.json();
  // Provider acceptance is not email delivery. Activation requests need a distinct state.
  if (/activat|confirm.*email|check.*email/i.test(result.message || '')) {
    return { sent: false, activationRequired: true };
  }
  if (result.success !== true && result.success !== 'true') throw new Error('Contact submission rejected');
  return { sent: true, activationRequired: false };
}
