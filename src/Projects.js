import React from 'react';
import './Projects.css';
import { Link } from 'react-router-dom';

const projectsData = [
  {
    name: "Rekognize",
    imgSrc: "Project1.png",
    path: "/rekognize",
    description: "AI-powered facial recognition system for security and access control",
    tech: ["Python", "OpenCV", "TensorFlow", "React"]
  },
  {
    name: "2 Player Chess",
    imgSrc: "Project2.png",
    path: "/chessgame",
    description: "Interactive chess game with real-time multiplayer capabilities",
    tech: ["JavaScript", "React", "WebSocket", "Chess.js"]
  },
  {
    name: "Find My Parcel",
    imgSrc: "Project3.png",
    path: "/findmyparcel",
    description: "Package tracking system with real-time updates and notifications",
    tech: ["Node.js", "Express", "MongoDB", "React Native"]
  },
  {
    name: "Daily Commit Bot",
    imgSrc: "Project4.png",
    path: "/dailycommit",
    description: "Automated GitHub commit bot for maintaining coding streaks",
    tech: ["Python", "GitHub API", "AWS Lambda", "Docker"]
  },
  {
    name: "ShopVista",
    imgSrc: "Project5.png",
    path: "/shopvista",
    description: "E-commerce platform with advanced search and filtering",
    tech: ["React", "Node.js", "PostgreSQL", "Redux"]
  },
  {
    name: "PortChat",
    imgSrc: "Project6.png",
    path: "/portchat",
    description: "Real-time chat application with end-to-end encryption",
    tech: ["WebSocket", "React", "Node.js", "MongoDB"]
  }
];

const Projects = () => {
  return (
    <div className="projects-container">
      <h1 className="projects-title">My Projects</h1>
      <p className="projects-subtitle">A collection of my work and experiments</p>
      <div className="projects-grid">
        {projectsData.map((project, index) => (
          <Link to={project.path} key={index} className="project-card">
            <div className="project-image">
              <img src={project.imgSrc} alt={project.name} />
            </div>
            <div className="project-content">
              <h2>{project.name}</h2>
              <p className="project-description">{project.description}</p>
              <div className="project-tech">
                {project.tech.map((tech, techIndex) => (
                  <span key={techIndex} className="tech-tag">{tech}</span>
                ))}
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default Projects;
