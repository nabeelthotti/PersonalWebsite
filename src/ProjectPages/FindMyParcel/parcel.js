import React, { useState } from 'react';
import './parcel.css';

const slides = [
    { src: "Parcel1.png", alt: "Rekognize Alphabet Example" },
    { src: "Parcel2.png", alt: "Rekognize Digit Example" },
    { src: "Parcel3.png", alt: "Rekognize Home Page" }
];

const Parcel = () => {
    const [activeSlide, setActiveSlide] = useState(0);

    const nextSlide = () => {
        setActiveSlide((prev) => (prev + 1) % slides.length); // Cycle forward through the slides
    };

    const prevSlide = () => {
        setActiveSlide((prev) => (prev - 1 + slides.length) % slides.length); // Cycle backward through the slides
    };

    return (
        <div className="parcel-project-page">
            <h1>Find My Parcel</h1>
            <div className="parcel-main-content">
                <div className="parcel-carousel-container">
                    <button className="parcel-arrow left" onClick={prevSlide}>&#10094;</button>
                    <img src={slides[activeSlide].src} alt={slides[activeSlide].alt} />
                    <button className="parcel-arrow right" onClick={nextSlide}>&#10095;</button>
                </div>
                <div className="parcel-project-description">
                    <p>Find My Parcel is a robust package tracking platform developed using the AfterShip API to offer real-time updates on shipments across various global couriers. The site was constructed using a mix of JavaScript, CSS, and HTML, with JavaScript handling dynamic interactions and data handling, CSS providing the layout and design, and HTML structuring the web content. This technology stack ensures that users can effortlessly track their packages by entering a tracking number, which instantly fetches and displays the latest status and location updates. The user-friendly interface was specifically designed to streamline navigation and enhance the user experience, making ParcelTracker an effective tool for personal and business logistics management. Additionally, the platform is open for contributions, allowing developers to collaborate and contribute enhancements or new features, further evolving its capabilities and utility.</p>
                </div>
            </div>
            <div className="parcel-horizontal-sections">
                <div>
                    <h2>Tools</h2>
                    <ul>
                        <li>Postman</li>
                        <li>React</li>
                        <li>CORS</li>
                        <li>Docker</li>
                    </ul>
                </div>
                <div>
                    <h2>Languages</h2>
                    <ul>
                        <li>JavaScript</li>
                        <li>HTML/CSS</li>
                    </ul>
                </div>
                <div>
                    <h2>Links</h2>
                    <ul>
                        <li><a href="https://github.com/nabeelthotti/FindMyParcel" target="_blank" rel="noopener noreferrer">GitHub</a></li>
                        <li><a href="https://findmyparcel.co" target="_blank" rel="noopener noreferrer">Live Site</a></li>
                    </ul>
                </div>
            </div>
        </div>
    );
};

export default Parcel;
