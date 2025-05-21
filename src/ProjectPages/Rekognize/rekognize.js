import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import '../shared.css';

const slides = [
    { src: "Rekognize1.png", alt: "Rekognize Alphabet Example", description: "This is an example of high confidence handwritten digit detection." },
    { src: "Rekognize2.png", alt: "Rekognize Digit Example", description: "This is an example of high confidence handwritten alphabet detection." },
    { src: "Rekognize3.png", alt: "Rekognize Home Page", description: "This is the home page for this website." }
];

const Rekognize = () => {
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
                <h1>Rekognize</h1>
                <p className="project-subtitle">AI-Powered Handwritten Character Recognition</p>
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
                            <p>Rekognize is an innovative web-based application that harnesses the power of Convolutional Neural Networks (CNNs) to decipher handwritten characters, from numerical digits (0-9) to a comprehensive range of alphabets (A-Z, both uppercase and lowercase). Utilizing advanced machine learning algorithms trained on the expansive MNIST and EMNIST datasets, Rekognize offers a cutting-edge solution for real-time character recognition. The platform is engineered using Flask, providing a sleek, user-friendly interface, while the underlying predictive technology is powered by TensorFlow, ensuring highly accurate and swift character predictions. Rekognize stands out as a smart tool, blending modern web technology with state-of-the-art AI to revolutionize the way we interact with handwritten text.</p>
                        </div>
                    </div>
                </div>

                <div className="project-details">
                    <div className="detail-section">
                        <h2>Tools</h2>
                        <ul>
                            <li>TensorFlow</li>
                            <li>Flask</li>
                            <li>React</li>
                        </ul>
                    </div>

                    <div className="detail-section">
                        <h2>Languages</h2>
                        <ul>
                            <li>Python</li>
                            <li>JavaScript</li>
                            <li>HTML/CSS</li>
                        </ul>
                    </div>

                    <div className="detail-section">
                        <h2>Links</h2>
                        <ul>
                            <li><a href="https://github.com/nabeelthotti/Rekognize" target="_blank" rel="noopener noreferrer">GitHub</a></li>
                            <li><a href="https://rekognize.fly.dev/" target="_blank" rel="noopener noreferrer">Live Site</a></li>
                            <li><a href="https://www.kaggle.com/datasets/hojjatk/mnist-dataset" target="_blank" rel="noopener noreferrer">Dataset</a></li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Rekognize;
