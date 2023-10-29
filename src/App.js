import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Switch, Route, Link } from 'react-router-dom';
import Home from './Home';
import About from './About';
import Experience from './Experience';
import DownloadCV from './Resume';
import Contact from './Contact';
import './App.css';
import homeIcon from './Images/favicon-32x32.png';

function App() {
  const [showText, setShowText] = useState(true);
  const [showMenu, setShowMenu] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setShowText(false);
    }, 4000); // Adjust time as needed

    return () => clearTimeout(timeoutId);
  }, []);

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
    setShowMenu(!showMenu);
  };

  const renderMenu = () => {
    if (!showMenu) return null;
    return (
      <div className={`Navigation ${menuOpen ? 'active' : ''}`}>
        <ul>
          <li><Link to="/about">About</Link></li>
          <li><Link to="/experience">Experience</Link></li>
          <li><Link to="/download-cv">Resume</Link></li>
          <li><Link to="/contact">Contact</Link></li>
        </ul>
      </div>
    );
  };

  const hamburgerIcon = (
    <div className={menuOpen ? "HamburgerMenu animate" : "HamburgerMenu"} onClick={toggleMenu} style={{ display: showText ? 'none' : 'block' }}>
      <div></div>
      <div></div>
      <div></div>
    </div>
  );

  const homeImageButton = (
    <div style={{ display: showText ? 'none' : 'block' }}>
      <Link to="/" className="HomeButton">
        <img src={homeIcon} alt="Home" />
      </Link>
    </div>
  );

  return (
    <Router>
      <div className="App">
        {/* Conditionally rendering the animated text or the actual content */}
        {showText ? (
          <header className="App-header">
            <h1 className="animated-text">Hello World...</h1>
          </header>
        ) : (
          <>
            {hamburgerIcon}
            {homeImageButton}
            {renderMenu()}
            <Switch>
              <Route path="/" exact component={Home} />
              <Route path="/about" component={About} />
              <Route path="/experience" component={Experience} />
              <Route path="/download-cv" component={DownloadCV} />
              <Route path="/contact" component={Contact} />
            </Switch>
          </>
        )}
      </div>
    </Router>
  );
}

export default App;
