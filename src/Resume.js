import React from 'react';
import './Resume.css';

const Resume = () => (
  <div className="resume-container">
    <div className="resume-content">
      <img 
        src="/NabeelsResume.png" 
        alt="Resume" 
        className="resume-image"
      />
      <div className="download-button-container">
        <a href="/NabeelsResume.pdf" download="NabeelsResume.pdf" className="download-button">
          <span className="download-icon">⬇️</span>
          <span className="download-text">Download Resume</span>
        </a>
      </div>
    </div>
  </div>
);

export default Resume;
