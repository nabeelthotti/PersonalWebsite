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
        <h1>Welcome to my personal website. </h1>
        <p>
        Embark on a journey through my digital portfolio, a showcase of intricate projects and hands-on experiences that mark my path in the tech landscape. Here, innovation meets expertise, inviting you to explore the milestones that have shaped my professional voyage.
        </p>
      </div>
    </div>
  );
};

export default Home;
