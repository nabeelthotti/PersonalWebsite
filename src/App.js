import React, { useState, useEffect } from 'react';
import './App.css';

function App() {
  const [showText, setShowText] = useState(true);

  useEffect(() => {
    // When the component is mounted, wait for 4 seconds, then hide the text.
    const timeoutId = setTimeout(() => {
      setShowText(false);
    }, 4000); // 4000ms = 4s

    // Cleanup function
    return () => {
      clearTimeout(timeoutId);
    };
  }, []);

  return (
    <div className="App">
      <header className="App-header">
        {showText ? (
          <h1 className="animated-text">Hello World...</h1>
        ) : (
          <div className="Navigation">
            <ul>
              <li>Home</li>
              <li>About</li>
              <li>Experience</li>
              <li>Download CV</li>
            </ul>
          </div>
        )}
      </header>
    </div>
  );
}

export default App;
