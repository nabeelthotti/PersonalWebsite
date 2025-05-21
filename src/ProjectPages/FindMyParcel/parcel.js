import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import '../shared.css';

const slides = [
    { src: "Parcel1.png", alt: "FindMyParcel Tracking Interface" },
    { src: "Parcel2.png", alt: "FindMyParcel Search Results" },
    { src: "Parcel3.png", alt: "FindMyParcel Home Page" }
];

const Parcel = () => {
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
                <h1>Find My Parcel</h1>
                <p className="project-subtitle">Real-time Package Tracking Platform</p>
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
                            <p>Find My Parcel is a robust package tracking platform developed using the AfterShip API to offer real-time updates on shipments across various global couriers. The site was constructed using a mix of JavaScript, CSS, and HTML, with JavaScript handling dynamic interactions and data handling, CSS providing the layout and design, and HTML structuring the web content. This technology stack ensures that users can effortlessly track their packages by entering a tracking number, which instantly fetches and displays the latest status and location updates. The user-friendly interface was specifically designed to streamline navigation and enhance the user experience, making ParcelTracker an effective tool for personal and business logistics management. Additionally, the platform is open for contributions, allowing developers to collaborate and contribute enhancements or new features, further evolving its capabilities and utility.</p>
                        </div>
                    </div>
                </div>

                <div className="project-details">
                    <div className="detail-section">
                        <h2>Tools</h2>
                        <ul>
                            <li>Postman</li>
                            <li>React</li>
                            <li>CORS</li>
                            <li>Docker</li>
                        </ul>
                    </div>

                    <div className="detail-section">
                        <h2>Languages</h2>
                        <ul>
                            <li>JavaScript</li>
                            <li>HTML/CSS</li>
                        </ul>
                    </div>

                    <div className="detail-section">
                        <h2>Links</h2>
                        <ul>
                            <li><a href="https://github.com/nabeelthotti/FindMyParcel" target="_blank" rel="noopener noreferrer">GitHub</a></li>
                            <li><a href="https://findmyparcel.co" target="_blank" rel="noopener noreferrer">Live Site</a></li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Parcel;
