import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Switch, Route, Link } from 'react-router-dom';
import Home from './Home';
import About from './About';
import Experience from './Experience';
import DownloadCV from './DownloadCV';
import Contact from './Contact';
import './App.css';
import homeIcon from './Images/favicon-32x32.png';

function App() {
  const [showText, setShowText] = useState(true);
  const [showMenu, setShowMenu] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false); // State to manage if the menu is open

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setShowText(false);
    }, 4000); // <- Time until the text animation is considered finished

    return () => clearTimeout(timeoutId);
  }, []);

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
    setShowMenu(!showMenu); // Toggle between showing and hiding the menu content
  };

  const renderMenu = () => {
    if (!showMenu) return null;
    return (
      <div className={`Navigation ${!showText ? 'active' : ''}`}>
        <ul>
          <li><Link to="/about">About</Link></li>
          <li><Link to="/experience">Experience</Link></li>
          <li><Link to="/download-cv">Download CV</Link></li>
          <li><Link to="/contact">Contact</Link></li>
        </ul>
      </div>
    );
  };

  const menuClasses = showMenu ? "HamburgerMenu animate" : "HamburgerMenu";

  const hamburgerIcon = (
    <div className={menuClasses} onClick={toggleMenu} style={{ display: showText ? 'none' : 'block' }}>
      <div></div> {/* Line 1 */}
      <div></div> {/* Line 2 */}
      <div></div> {/* Line 3 */}
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
        <header className="App-header">
          {showText && <h1 className="animated-text">Hello World...</h1>}
          {hamburgerIcon}
          {homeImageButton}
          {renderMenu()}
        </header>

        <Switch>
        <Route path="/" exact>
            <Home /> {/* This is your home page component */}
          </Route>
          <Route path="/about" component={About} />
          <Route path="/experience" component={Experience} />
          <Route path="/download-cv" component={DownloadCV} />
          <Route path="/contact" component={Contact} />
        </Switch>
      </div>
    </Router>
  );
}

export default App;
