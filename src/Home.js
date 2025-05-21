import React, { useEffect } from 'react';
import './Home.css';
import sampleImage from './Images/IMG_3743.jpg';

const Home = () => {
  useEffect(() => {
    document.body.classList.add('home-scroll-lock');
    document.documentElement.classList.add('home-scroll-lock');
    return () => {
      document.body.classList.remove('home-scroll-lock');
      document.documentElement.classList.remove('home-scroll-lock');
    };
  }, []);

  return (
    <div className="home-container">
      <div className="image-section">
        <img src={sampleImage} alt="Sample" />
      </div>
      
      <div className="text-section">
        <h1>Welcome to my personal website.</h1>
        <p>
          Have fun while you're here!
        </p>
      </div>
    </div>
  );
};

export default Home;