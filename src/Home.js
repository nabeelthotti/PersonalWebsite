import React from 'react';
import './Home.css';
import sampleImage from './Images/IMG_3743.jpg';

const Home = () => {
  return (
    <div className="home-container">
      <div className="image-section">
        <img src={sampleImage} alt="Sample" />
      </div>
      <div className="text-section">
        <h1>Welcome to my personal website.</h1>
        <p>
        Discover the symphony of innovation and purpose, where each project composes a note in my professional odyssey.
        </p>
      </div>
    </div>
  );
};

export default Home;
