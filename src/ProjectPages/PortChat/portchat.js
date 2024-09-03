import React, { useState } from 'react';
import './portchat.css';

const slides = [
    { src: "PortChat1.png", alt: "Port Chat Example" },
    { src: "PortChat2.png", alt: "Port Chat Example" }
];

const PortChat = () => {
    const [activeSlide, setActiveSlide] = useState(0);

    const nextSlide = () => {
        setActiveSlide((prev) => (prev + 1) % slides.length); // Cycle forward through the slides
    };

    const prevSlide = () => {
        setActiveSlide((prev) => (prev - 1 + slides.length) % slides.length); // Cycle backward through the slides
    };

    return (
        <div className="portchat-project-page">
            <h1>Port Chat</h1>
            <div className="portchat-main-content">
                <div className="portchat-carousel-container">
                    <button className="portchat-arrow left" onClick={prevSlide}>&#10094;</button>
                    <img src={slides[activeSlide].src} alt={slides[activeSlide].alt} />
                    <button className="portchat-arrow right" onClick={nextSlide}>&#10095;</button>
                </div>
                <div className="portchat-project-description">
                    <p>This Chat Application leverages Python’s capabilities to implement a server-client architecture that supports text communication across a network. Utilizing Python's socket and threading libraries, it manages real-time messaging between multiple clients simultaneously. The server component of the application listens on a specified port, handling incoming client connections each in a separate thread, allowing for scalable and concurrent user interactions. Users can connect, send messages, and disconnect using straightforward commands like 'connect', 'send', and 'exit'. Throughout the development, the focus was on ensuring robustness and thread safety, employing locks to manage access to shared resources and prevent potential data races. The application efficiently handles multiple simultaneous operations such as message sending and receiving without system blockages, making it a practical solution for network-based communication tasks.</p>
                </div>
            </div>
            <div className="portchat-horizontal-sections">
                <div>
                    <h2>Tools</h2>
                    <ul>
                        <li>Sockets</li>
                        <li>Threading</li>
                        <li>IDE</li>
                    </ul>
                </div>
                <div>
                    <h2>Languages</h2>
                    <ul>
                        <li>Python</li>
                      
                    </ul>
                </div>
                <div>
                    <h2>Links</h2>
                    <ul>
                        <li><a href="https://github.com/nabeelthotti/PortChat" target="_blank" rel="noopener noreferrer">GitHub</a></li>
           
                    </ul>
                </div>
            </div>
        </div>
    );
};

export default PortChat;
