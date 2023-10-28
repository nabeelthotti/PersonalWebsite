import React, { useState, useEffect } from 'react';
import './App.css';

function App() {
  const [displayIntro, setDisplayIntro] = useState(true);

  useEffect(() => {
    // Set the timeout for the intro display
    const timer = setTimeout(() => {
      setDisplayIntro(false);
    }, 4000); // Time is in ms (4000 ms = 4 seconds)

    // Clear the timeout if the component is unmounted
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="App">
      {displayIntro ? (
        <header className="App-header">
          <h1 className="animated-text">Hello World...</h1>
        </header>
      ) : (
        <nav>
          <ul>
            <li>Home</li>
            <li>About</li>
            <li>Experience</li>
            <li>Download CV</li>
          </ul>
        </nav>
      )}
    </div>
  );
}

export default App;
