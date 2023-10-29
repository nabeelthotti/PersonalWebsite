// Home.js

import React from 'react';
import './Home.css'; // Make sure to import the CSS file here
import sampleImage from './Images/IMG_3743.png'; // Adjust the path as necessary

const Home = () => {
  return (
    <div className="home-container">
      <div className="image-section">
        <img src={sampleImage} alt="Sample" />
      </div>
      <div className="text-section">
        <h1>Header Content</h1>
        <p>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
        </p>
      </div>
    </div>
  );
};

export default Home;
