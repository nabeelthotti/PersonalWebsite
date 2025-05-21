import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import '../shared.css';

const slides = [
    { src: "CommitBot1.png", alt: "CommitBot Dashboard Example"},
    { src: "CommitBot2.png", alt: "CommitBot Activity Example"},
    { src: "CommitBot3.png", alt: "CommitBot Home Page"}
];

const CommitBot = () => {
    const [activeSlide, setActiveSlide] = useState(0);

    const nextSlide = () => {
        setActiveSlide((prev) => (prev + 1) % slides.length);
    };

    const prevSlide = () => {
        setActiveSlide((prev) => (prev - 1 + slides.length) % slides.length);
    };

    return (
        <div className="project-page">
            <Link to="/projects" className="back-button">
                ← Back to Projects
            </Link>
            
            <div className="project-header">
                <h1>CI/CD Bot</h1>
                <p className="project-subtitle">Automated GitHub Commit Bot</p>
            </div>

            <div className="project-content">
                <div className="project-showcase">
                    <div className="project-carousel">
                        <div className="carousel-container">
                            <img src={slides[activeSlide].src} alt={slides[activeSlide].alt} />
                            <button className="carousel-arrow left" onClick={prevSlide}>&#10094;</button>
                            <button className="carousel-arrow right" onClick={nextSlide}>&#10095;</button>
                        </div>
                    </div>

                    <div className="project-info">
                        <div className="project-description">
                            <p>The Daily Commit Bot is an automation tool designed to enhance repository activity by performing scheduled commits to a GitHub repository from an AWS EC2 instance. It operates by appending the current date and time to a daily_commit.txt file and pushing updates to GitHub five times a day, ensuring continuous activity which is crucial for repositories involved in demonstration or CI/CD pipelines. This bot uses a bash script scheduled with Cron, a time-based job scheduler, to automate commits, simulating an active development environment essential for triggering CI/CD workflows. Such automation ensures that the repository can reliably demonstrate continuous integration tools and practices by maintaining a steady flow of changes, which is critical for catching issues early and deploying software more frequently and reliably.</p>
                        </div>
                    </div>
                </div>

                <div className="project-details">
                    <div className="detail-section">
                        <h2>Tools</h2>
                        <ul>
                            <li>AWS Microservices</li>
                            <li>Cron</li>
                            <li>Github</li>
                        </ul>
                    </div>

                    <div className="detail-section">
                        <h2>Languages</h2>
                        <ul>
                            <li>Bash Script</li>
                            <li>Python</li>
                            <li>HTML</li>
                        </ul>
                    </div>

                    <div className="detail-section">
                        <h2>Links</h2>
                        <ul>
                            <li><a href="https://github.com/nabeelthotti/DailyCommitBot" target="_blank" rel="noopener noreferrer">GitHub</a></li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CommitBot;
