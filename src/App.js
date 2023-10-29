// App.js
import React, { useState, useEffect } from 'react';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link,
} from 'react-router-dom';
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
            <Switch>
              <Route path="/about"><About /></Route>
              <Route path="/experience"><Experience /></Route>
              <Route path="/download-cv"><DownloadCV /></Route>
              <Route path="/"><Home /></Route>
            </Switch>
          </>
        )}
      </div>
    </Router>
  );
}

export default App;
