import React from 'react';
import { Link } from 'react-router-dom';

const NavigationMenu = ({ isOpen, toggleMenu }) => (
  <div className={`Navigation ${isOpen ? 'active' : ''}`}>
    <ul>
      <li><Link to="/home" onClick={toggleMenu}>Home</Link></li>
      <li><Link to="/about" onClick={toggleMenu}>About</Link></li>
      <li><Link to="/projects" onClick={toggleMenu}>Projects</Link></li>
      <li><Link to="/articles" onClick={toggleMenu}>Articles</Link></li>
      <li><Link to="/resume" onClick={toggleMenu}>Resume</Link></li>
      <li><Link to="/contact" onClick={toggleMenu}>Contact</Link></li>
      <li><Link to="/chess" onClick={toggleMenu}>Play Chess</Link></li>
    </ul>
  </div>
);

export default NavigationMenu;
