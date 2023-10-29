import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import Navbar from './Navbar'; // Make sure this path is correct
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

  return (
    <Router>
      <div className="App">
        <header className="App-header">
          {showText && <h1 className="animated-text">Hello World...</h1>}
          <Navbar /> {/* Navbar component is added here */}
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
