import React, { useState, useEffect } from 'react';
import './Voicemail.css';

export default function Voicemail() {
  const [to, setTo] = useState('');
  const [message, setMessage] = useState('');
  const [apiKey, setApiKey] = useState('');
  const [result, setResult] = useState('');
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState('');
  const [history] = useState([]);

  // TODO: replace with your real history-fetch when available
  useEffect(() => {
    // fetch call history from API
    // fetch('/api/calls', { headers: { 'X-API-Key': apiKey } })
    //   .then(r => r.json())
    //   .then(setHistory)
    //   .catch(console.error);
  }, []);

  const filtered = history.filter((call) => {
    const q = search.toLowerCase();
    return (
      call.to.toLowerCase().includes(q) ||
      call.message.toLowerCase().includes(q) ||
      call.status.toLowerCase().includes(q)
    );
  });

  const handleSubmit = async e => {
    e.preventDefault();
    if (!apiKey.trim()) {
      setResult('❌ Please enter your API key.');
      return;
    }
    setLoading(true);
    setResult('🔄 Sending your voicemail…');
    try {
      const resp = await fetch('https://vm.nabeelthotti.com/enqueue', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-API-Key': apiKey,
        },
        body: JSON.stringify({ to, message }),
      });
      const data = await resp.json();
      if (!resp.ok) throw new Error(data.detail || JSON.stringify(data));
      setResult(`✅ Success! SID: ${data.sid}`);
      // optionally append to history
    } catch (err) {
      setResult(`❌ Error: ${err.message}`);
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="voicemail-wrapper">
      <div className="voicemail-container">

        {/* ────── SEND CARD ────── */}
        <div className="card send-card">
          <h2 className="card-header">Send a Voicemail</h2>
          <p className="card-sub">Enter a phone number and your message to drop a voicemail.</p>

          <form className="send-form" onSubmit={handleSubmit}>
            <label className="field">
              <span>API Key</span>
              <input
                type="password"
                value={apiKey}
                onChange={e => setApiKey(e.target.value)}
                placeholder="Your API key"
                className="input"
                required
              />
            </label>

            <label className="field">
              <span>Phone Number</span>
              <div className="phone-input">
                <span className="material-icons phone-icon">phone</span>
                <input
                  type="tel"
                  value={to}
                  onChange={e => setTo(e.target.value)}
                  placeholder="+1XXXXXXXXXX"
                  className="input"
                  required
                />
              </div>
            </label>

            <label className="field">
              <span>Voicemail Message</span>
              <textarea
                rows={4}
                value={message}
                onChange={e => setMessage(e.target.value)}
                placeholder="Enter your message here…"
                className="textarea"
                required
              />
              <div className="char-count">{message.length} characters</div>
            </label>

            <button type="submit" className="btn-send" disabled={loading}>
              {loading ? 'Sending…' : 'Send Voicemail'}
            </button>
          </form>

          {result && (
            <div className={`result-box ${result.startsWith('✅') ? 'success' : 'error'}`}>
              {result}
            </div>
          )}
        </div>


        {/* ────── HISTORY CARD ────── */}
        <div className="card history-card">
          <h2 className="card-header">Calls</h2>
          <p className="card-sub">Recent voicemail drops and their status.</p>

          <div className="history-controls">
            <div className="tags">
              <span className="tag dialled">Dialled</span>
              <span className="tag success">VM Success</span>
              <span className="tag failed">VM Failed</span>
            </div>
            <div className="search-wrap">
              <input
                type="text"
                placeholder="Search history…"
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="input search-input"
              />
              <span className="material-icons search-icon">search</span>
            </div>
          </div>

          {filtered.length === 0 ? (
            <div className="empty-state">
              <span className="material-icons empty-icon">history</span>
              <p>No calls yet. Start by sending a voicemail.</p>
            </div>
          ) : (
            <ul className="history-list">
              {filtered.map(call => (
                <li key={call.sid} className="history-item">
                  <div className="item-left">
                    <span className="material-icons item-icon">phone_callback</span>
                    <div>
                      <div className="item-to">{call.to}</div>
                      <div className="item-msg">{call.message}</div>
                    </div>
                  </div>
                  <div className="item-right">
                    <span className={`tag ${call.status.toLowerCase()}`}>
                      {call.status.replace('_', ' ')}
                    </span>
                    <div className="item-time">{new Date(call.createdAt).toLocaleString()}</div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

      </div>
    </div>
  );
}
