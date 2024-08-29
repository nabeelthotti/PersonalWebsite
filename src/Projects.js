import React from 'react';
import './Projects.css'; // Make sure to link the CSS file

const Projects = () => (
    <div className="experience-container">
        <h1>PROJECTS</h1>
        <div className="grid-container">
            {[...Array(9)].map((_, index) => (
                <a href={`#project${index + 1}`} key={index} className="grid-item">
                    <img src={`Project${index + 1}.png`} alt={`Project ${index + 1}`} />
                    <p>Project {index + 1}</p>
                </a>
            ))}
        </div>
    </div>
);

export default Projects;
