import React from 'react';
import { Link } from 'react-router-dom'; 
import './Home.css';
import sampleImage from './Images/IMG_3743.jpg';



const Home = () => {
  return (
    <div className="home-container">
      <div className="image-section">
      <div className="home-menu">
      <ul>
          <li><Link to="/about">About</Link></li>
          <li><Link to="/projects">Projects</Link></li>
          <li><Link to="/articles">Articles</Link></li>
          <li><Link to="/resume">Resume</Link></li>
          <li><Link to="/contact">Contact</Link></li>
          <li><Link to="/chess">Play Chess</Link></li>
        </ul>
      </div>
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
