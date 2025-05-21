import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import '../shared.css';

const slides = [
    { src: "Chess1.png", alt: "Chess Gameplay Example"},
    { src: "Chess2.png", alt: "Chess Piece Archive Example"},
    { src: "Chess3.png", alt: "Chess Board Example"}
];

const Chess = () => {
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
                <h1>2 Player Chess</h1>
                <p className="project-subtitle">Interactive Web-Based Chess Game</p>
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
                            <p>This Chess game is a web-based chess application that allows players to engage in the classic game using intuitive drag-and-drop functionality. Built using HTML, CSS, and JavaScript, this interactive game perfectly simulates traditional chess with a modern twist. The game enforces all standard chess rules, including piece-specific movements and turn-based gameplay. It features a dynamic display that indicates player turns and validates the legality of moves to prevent invalid actions. The application also detects 'check' and 'checkmate' conditions, notifying players of critical game states. A reversible board feature enhances gameplay by allowing players to switch perspectives mid-game. This project combines the strategic depth of chess with the accessibility of an online interface, making it suitable for both beginners and experienced players.</p>
                        </div>
                    </div>
                </div>

                <div className="project-details">
                    <div className="detail-section">
                        <h2>DSA / Methods</h2>
                        <ul>
                            <li>Event Listeners</li>
                            <li>Objects & Arrays</li>
                            <li>Classes and Inheritance</li>
                        </ul>
                    </div>

                    <div className="detail-section">
                        <h2>Languages</h2>
                        <ul>
                            <li>HTML</li>
                            <li>JavaScript</li>
                            <li>CSS</li>
                        </ul>
                    </div>

                    <div className="detail-section">
                        <h2>Links</h2>
                        <ul>
                            <li><a href="https://github.com/nabeelthotti/PersonalWebsite/tree/master/src/Chess" target="_blank" rel="noopener noreferrer">GitHub</a></li>
                            <li><a href="https://nabeelthotti.co/chess" target="_blank" rel="noopener noreferrer">Live Site</a></li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Chess;
