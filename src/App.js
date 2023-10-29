import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Switch, Route, Link } from 'react-router-dom';
import Home from './Home';
import About from './About';
import Experience from './Experience';
import DownloadCV from './DownloadCV';
import './App.css';

function App() {
  const [showText, setShowText] = useState(true);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setShowText(false);
    }, 4000); // <- Time until the text animation is considered finished

    return () => clearTimeout(timeoutId);
  }, []);

  // Navigation markup with dynamic class
  const navigation = (
    <div className={`Navigation ${!showText ? 'active' : ''}`}>
      <ul>
        <li><Link to="/">Home</Link></li>
        <li><Link to="/about">About</Link></li>
        <li><Link to="/experience">Experience</Link></li>
        <li><Link to="/download-cv">Download CV</Link></li>
      </ul>
    </div>
  );

  return (
    <Router>
      <div className="App">
        <header className="App-header">
          {showText && <h1 className="animated-text">Hello World...</h1>}
          {navigation} {/* This is now outside the conditional rendering */}
        </header>

        <Switch>
          <Route path="/" exact component={Home} />
          <Route path="/about" component={About} />
          <Route path="/experience" component={Experience} />
          <Route path="/download-cv" component={DownloadCV} />
        </Switch>
        </div>
    </Router>
  );
}

export default App;