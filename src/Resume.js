import React from 'react';

const Resume = () => (
  <div style={{ width: '100vw', height: '100vh', textAlign: 'center', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
    <img 
      src="/NabeelsResume.png" 
      alt="Resume" 
      style={{ maxHeight: '80vh', maxWidth: '100vw', width: 'auto', height: 'auto', objectFit: 'contain' }} 
    />
    <div style={{ marginTop: '20px' }}>
      <a href="/NabeelsResume.pdf" download="NabeelsResume.pdf">
        <button>Download</button>
      </a>
    </div>
  </div>
);

export default Resume;
