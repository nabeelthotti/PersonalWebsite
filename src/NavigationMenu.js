import React from 'react';
import { Link } from 'react-router-dom';

const NavigationMenu = ({ isOpen, isHome }) => (
  <div className={`Navigation ${isOpen ? 'active' : ''} ${isHome ? 'home' : 'dropdown'}`}>
    <ul>
      <li><Link to="/about">About</Link></li>
      <li><Link to="/projects">Projects</Link></li>
      <li><Link to="/articles">Articles</Link></li>
      <li><Link to="/resume">Resume</Link></li>
      <li><Link to="/contact">Contact</Link></li>
      <li><Link to="/chess">Play Chess</Link></li>
    </ul>
  </div>
);

export default NavigationMenu;
