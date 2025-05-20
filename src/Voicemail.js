// src/components/Voicemail.js
import React, { useState } from 'react';
import './Voicemail.css';

export default function Voicemail() {
  const [to, setTo] = useState('');
  const [message, setMessage] = useState('');
  const [apiKey, setApiKey] = useState('');
  const [result, setResult] = useState('');

  const handleSubmit = async e => {
    e.preventDefault();
    if (!apiKey) {
      setResult('❌ Please enter your API key.');
      return;
    }
    setResult('🔄 Sending your voicemail...');

    try {
      const resp = await fetch('https://vm.nabeelthotti.co/voicemail', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-API-Key': apiKey,
        },
        body: JSON.stringify({ to, message }),
      });
      const data = await resp.json();
      if (!resp.ok) throw new Error(data.detail || JSON.stringify(data));
      setResult(`✅ Call SID: ${data.sid}, Status: ${data.status}`);
    } catch (err) {
      setResult(`❌ Error: ${err.message}`);
    }
  };

  return (
    <div className="voicemail-wrapper">
      <div className="voicemail-container">
        <h2 className="voicemail-title">EchoGram Voicemail</h2>
        <form onSubmit={handleSubmit} className="voicemail-form">
          <label className="voicemail-label">
            API Key
            <input
              type="password"
              className="voicemail-input"
              value={apiKey}
              onChange={e => setApiKey(e.target.value)}
              placeholder="Your API key"
              required
            />
          </label>
          <label className="voicemail-label">
            Phone Number
            <input
              type="tel"
              className="voicemail-input"
              value={to}
              onChange={e => setTo(e.target.value)}
              placeholder="+1234567890"
              required
            />
          </label>
          <label className="voicemail-label">
            Message
            <textarea
              className="voicemail-textarea"
              value={message}
              onChange={e => setMessage(e.target.value)}
              rows={4}
              placeholder="Your voicemail message"
              required
            />
          </label>
          <button type="submit" className="voicemail-button">
            Send Voicemail
          </button>
        </form>
        {result && <div className="voicemail-result">{result}</div>}
      </div>
    </div>
  );
}
