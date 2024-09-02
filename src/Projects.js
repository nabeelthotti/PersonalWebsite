import React from 'react';
import './Projects.css';
import { Link } from 'react-router-dom';


const projectsData = [
  { name: "Rekognize", imgSrc: "Project1.png", path: "/rekognize" },
  { name: "2 Player Chess", imgSrc: "Project2.png", path: "/chess" },
  { name: "Find My Parcel", imgSrc: "Project3.png", path: "/findmyparcel" },
  { name: "Daily Commit Bot", imgSrc: "Project4.png", path: "/dailycommit" },
  { name: "ShopVista", imgSrc: "Project5.png", path: "/shopvista" },
  { name: "PortChat", imgSrc: "Project6.png", path: "/portchat" }
];



const Projects = () => {
  return (
    <div className="experience-container">
      <h1>PROJECTS</h1>
      <div className="grid-container">
        {projectsData.map((project, index) => (
          <div key={index} className="grid-item">
            <Link to={project.path}>
              <img src={project.imgSrc} alt={project.name} />
              <p>{project.name}</p>
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Projects;
