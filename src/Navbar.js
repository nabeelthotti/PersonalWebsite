import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './Navbar.css'; // Assuming you save the CSS in Navbar.css

function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);

  const toggleMenu = () => {
    setMenuOpen(prevState => !prevState);
  };

  return (
    <nav>
      <div className="navbar">
        <div className="container nav-container">
          <div 
            className="hamburger-lines" 
            onClick={toggleMenu} // Toggle menu on click
          >
            <span className={`line line1 ${menuOpen ? "rotateLine1" : ""}`}></span>
            <span className={`line line2 ${menuOpen ? "hideLine2" : ""}`}></span>
            <span className={`line line3 ${menuOpen ? "rotateLine3" : ""}`}></span>
          </div>
          <div className="logo">
            <h1>Navbar</h1>
          </div>
          <div className={`menu-items ${menuOpen ? "showMenu" : ""}`}>
            {/* Replace 'href' with 'to' for React Router Links */}
            <li><Link to="/">Home</Link></li>
            <li><Link to="/about">About</Link></li>
            <li><Link to="/blogs">Blogs</Link></li>
            <li><Link to="/portfolio">Portfolio</Link></li>
            <li><Link to="/contact">Contact</Link></li>
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
