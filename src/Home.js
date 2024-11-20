import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import './Home.css';
import sampleImage from './Images/IMG_3743.jpg';

const Home = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <div className="home-container">
      <div className="home-menu">
        {/* Desktop Menu */}
        <div className="desktop-menu">
          <ul>
            <li><Link to="/about">About</Link></li>
            <li><Link to="/projects">Projects</Link></li>
            <li><Link to="/articles">Articles</Link></li>
            <li><Link to="/resume">Resume</Link></li>
            <li><Link to="/contact">Contact</Link></li>
            <li><Link to="/chess">Play Chess</Link></li>
          </ul>
        </div>
        
        {/* Mobile Menu Button */}
        <button 
          className="hamburger" 
          onClick={toggleMenu}
          aria-label="Toggle menu"
        >
          {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
        
        {/* Mobile Menu Dropdown */}
        {isMenuOpen && (
          <div className="mobile-menu">
            <ul>
              <li><Link to="/about" onClick={toggleMenu}>About</Link></li>
              <li><Link to="/projects" onClick={toggleMenu}>Projects</Link></li>
              <li><Link to="/articles" onClick={toggleMenu}>Articles</Link></li>
              <li><Link to="/resume" onClick={toggleMenu}>Resume</Link></li>
              <li><Link to="/contact" onClick={toggleMenu}>Contact</Link></li>
              <li><Link to="/chess" onClick={toggleMenu}>Play Chess</Link></li>
            </ul>
          </div>
        )}
      </div>

      <div className="image-section">
        <img src={sampleImage} alt="Sample" />
      </div>
      
      <div className="text-section">
        <h1>Welcome to my personal website.</h1>
        Discover the symphony of innovation and purpose,
        <p>
          where each project composes a note in my professional odyssey.
        </p>
      </div>
    </div>
  );
};

export default Home;