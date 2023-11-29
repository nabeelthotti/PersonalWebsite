import React from 'react';

const Resume = () => (
  <div>
    <h1>RESUME</h1>
    {/* Display the converted image of your resume */}
    <img src="NabeelsReume.jpg" alt="Resume" style={{ width: '100%', height: 'auto' }} />
    
    {/* Link to download the original PDF */}
    <a href="NabeelsResume.pdf" download="Your_Resume_Name.pdf">
      <button style={{ marginTop: '20px' }}>Download</button>
    </a>
  </div>
);

export default Resume;
