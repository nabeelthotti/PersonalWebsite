import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Switch, Route, Link } from 'react-router-dom';
import Home from './Home';
import About from './About';
import Experience from './Experience';
import DownloadCV from './DownloadCV';
import './App.css';

function App() {
  const [showText, setShowText] = useState(true);
  const [showMenu, setShowMenu] = useState(false); // New state for managing menu visibility

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setShowText(false);
    }, 4000); // <- Time until the text animation is considered finished

    return () => clearTimeout(timeoutId);
  }, []);

  // New handler for menu toggling
  const toggleMenu = () => {
    setShowMenu(!showMenu);
  };

  // Conditional rendering of the menu based on 'showMenu' state
  const renderMenu = () => {
    if (!showMenu) return null;
    return (
      <div className={`Navigation ${!showText ? 'active' : ''}`}>
        <ul>
          <li><Link to="/">Home</Link></li>
          <li><Link to="/about">About</Link></li>
          <li><Link to="/experience">Experience</Link></li>
          <li><Link to="/download-cv">Download CV</Link></li>
        </ul>
      </div>
    );
  };

  // Hamburger icon component with click handler
  const hamburgerIcon = (
    <div className="HamburgerMenu" onClick={toggleMenu} style={{ display: showText ? 'none' : 'block' }}>
      <div></div>
      <div></div>
      <div></div>
    </div>
  );

  return (
    <Router>
      <div className="App">
        <header className="App-header">
          {showText && <h1 className="animated-text">Hello World...</h1>}
          {hamburgerIcon}
          {renderMenu()}
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
