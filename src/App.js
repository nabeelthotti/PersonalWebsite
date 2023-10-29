// App.js
import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import Home from './Home';
import About from './About';
import Experience from './Experience';
import DownloadCV from './DownloadCV';
import './App.css';

function App() {
  const [showText, setShowText] = useState(true);

  useEffect(() => {
    if (showText) {
      setTimeout(() => {
        setShowText(false);
      }, 4000);  // Adjust time as needed
    }
  }, [showText]);

  return (
    <Router>
      <div className="App">
        {showText ? (
          <header className="App-header">
            <h1 className="animated-text">Hello World...</h1>
          </header>
        ) : (
          <>
            <nav>
              <ul className="App-nav">
                <li><Link to="/">Home</Link></li>
                <li><Link to="/about">About</Link></li>
                <li><Link to="/experience">Experience</Link></li>
                <li><Link to="/download-cv">Download CV</Link></li>
              </ul>
            </nav>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/about" element={<About />} />
              <Route path="/experience" element={<Experience />} />
              <Route path="/download-cv" element={<DownloadCV />} />
            </Routes>
          </>
        )}
      </div>
    </Router>
  );
}

export default App;
