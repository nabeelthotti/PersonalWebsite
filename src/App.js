import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Switch, Route, Link } from 'react-router-dom';
import Home from './Home';
import About from './About';
import Projects from './Projects';
import Articles from './Articles';
import Game from './Chess/src/components/game';
import Resume from './Resume';
import Contact from './Contact';
import NavigationMenu from './NavigationMenu';
import Special from './Special';

import Rekognize from './ProjectPages/Rekognize/rekognize';
import Chess from './ProjectPages/Chess/chess';
import CommitBot from './ProjectPages/CommitBot/commit';
import Parcel from './ProjectPages/FindMyParcel/parcel';
import PortChat from './ProjectPages/PortChat/portchat';
import ShopVista from './ProjectPages/ShopVista/shopvista';

import './App.css';
import homeIcon from './Images/favicon-32x32.png';

function App() {
  const [showText, setShowText] = useState(true);
  const [showMenu, setShowMenu] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(true);

  useEffect(() => {
    const timeoutId = setTimeout(() => setShowText(false), 4000); 
    return () => clearTimeout(timeoutId);
  }, []);

  const toggleMenu = () => {
    setShowMenu(!showMenu);
  };

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
    document.body.classList.toggle('light-mode');
  };

  return (
    <Router>
      <div className={`App ${isDarkMode ? 'dark-mode' : 'light-mode'}`}>
        {showText ? (
          <header className="App-header">
            <h1 className="animated-text">Hello World...</h1>
          </header>
        ) : (
          <>
            <div className="global-header">
              <Link to="/" className="header-logo">
                <img src={homeIcon} alt="Home" />
              </Link>
              <div className="header-controls">
                <button 
                  className="theme-toggle" 
                  onClick={toggleTheme}
                  aria-label={isDarkMode ? 'Switch to light mode' : 'Switch to dark mode'}
                >
                  {isDarkMode ? '☀️' : '🌙'}
                </button>
                <div className={showMenu ? "HamburgerMenu animate" : "HamburgerMenu"} onClick={toggleMenu}>
                  <div></div>
                  <div></div>
                  <div></div>
                </div>
              </div>
            </div>
            <NavigationMenu isOpen={showMenu} toggleMenu={toggleMenu} />

            <Switch>
              <Route path="/" exact component={Home} />
              <Route path="/home" component={Home} />
              <Route path="/about" component={About} />
              <Route path="/projects" component={Projects} />
              <Route path="/rekognize" component={Rekognize} />
              <Route path="/dailycommit" component={CommitBot} />
              <Route path="/findmyparcel" component={Parcel} />
              <Route path="/portchat" component={PortChat} />
              <Route path="/chessgame" component={Chess} />
              <Route path="/shopvista" component={ShopVista} />
              <Route path="/articles" component={Articles} />
              <Route path="/resume" component={Resume} />
              <Route path="/contact" component={Contact} />
              <Route path="/chess" component={Game} />
              <Route path="/special" component={Special} />
            </Switch>
          </>
        )}
        <div className="locked-footer">&copy; Nabeel Thotti 2025</div>
      </div>
    </Router>
  );
}

export default App;
