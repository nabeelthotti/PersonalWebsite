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

//Project Pages
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

  useEffect(() => {
    const timeoutId = setTimeout(() => setShowText(false), 4000);
    return () => clearTimeout(timeoutId);
  }, []);

  const toggleMenu = () => {
    setShowMenu(!showMenu);
  };

  return (
    <Router>
      <div className="App">
        {showText ? (
          <header className="App-header">
            <h1 className="animated-text">Hello World...</h1>
          </header>
        ) : (
          <>
            <div className={showMenu ? "HamburgerMenu animate" : "HamburgerMenu"} onClick={toggleMenu}>
              <div></div>
              <div></div>
              <div></div>
            </div>
            <div style={{ display: showText ? 'none' : 'block' }}>
              <Link to="/" className="HomeButton">
                <img src={homeIcon} alt="Home" />
              </Link>
            </div>
            <NavigationMenu isOpen={showMenu} />
            <Switch>
            <Route path="/" exact component={Home} />
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
            </Switch>
          </>
        )}
      </div>
    </Router>
  );
}

export default App;
