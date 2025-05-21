import React from 'react';
import { Link } from 'react-router-dom';

const NavigationMenu = ({ isOpen, toggleMenu }) => (
  <div className={`Navigation ${isOpen ? 'active' : ''}`}>
    <ul>
      <li><Link to="/home" onClick={toggleMenu}>Home</Link></li>
      <li><Link to="/about" onClick={toggleMenu}>Who Am I?</Link></li>
      <li><Link to="/projects" onClick={toggleMenu}>Some Work</Link></li>
      <li><Link to="/articles" onClick={toggleMenu}>Some Words</Link></li>
      <li><Link to="/resume" onClick={toggleMenu}>Resume</Link></li>
      <li><Link to="/contact" onClick={toggleMenu}>Contact Me!</Link></li>
    </ul>
  </div>
);

export default NavigationMenu;
