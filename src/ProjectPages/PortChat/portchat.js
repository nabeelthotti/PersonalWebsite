import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import '../shared.css';

const slides = [
    { src: "PortChat1.png", alt: "Port Chat Interface Example"},
    { src: "PortChat2.png", alt: "Port Chat Message Example"},
    { src: "PortChat3.png", alt: "Port Chat Home Page"}
];

const PortChat = () => {
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
                <h1>Port Chat</h1>
                <p className="project-subtitle">Real-time Network Chat Application</p>
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
                            <p>This Chat Application leverages Python's capabilities to implement a server-client architecture that supports text communication across a network. Utilizing Python's socket and threading libraries, it manages real-time messaging between multiple clients simultaneously. The server component of the application listens on a specified port, handling incoming client connections each in a separate thread, allowing for scalable and concurrent user interactions. Users can connect, send messages, and disconnect using straightforward commands like 'connect', 'send', and 'exit'. Throughout the development, the focus was on ensuring robustness and thread safety, employing locks to manage access to shared resources and prevent potential data races. The application efficiently handles multiple simultaneous operations such as message sending and receiving without system blockages, making it a practical solution for network-based communication tasks.</p>
                        </div>
                    </div>
                </div>

                <div className="project-details">
                    <div className="detail-section">
                        <h2>Tools</h2>
                        <ul>
                            <li>Sockets</li>
                            <li>Threading</li>
                            <li>IDE</li>
                        </ul>
                    </div>

                    <div className="detail-section">
                        <h2>Languages</h2>
                        <ul>
                            <li>Python</li>
                        </ul>
                    </div>

                    <div className="detail-section">
                        <h2>Links</h2>
                        <ul>
                            <li><a href="https://github.com/nabeelthotti/PortChat" target="_blank" rel="noopener noreferrer">GitHub</a></li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PortChat;
