import React from 'react';
import './rekognize.css';

const Rekognize = () => (
    <div className="project-page">
        <h1>Rekognize</h1>
        <div className="image-container">
            <img src="demo1.png" alt="Rekognize" />
        </div>
        <p>
            Rekognize is an innovative web-based application that harnesses the power of Convolutional Neural Networks (CNNs) to decipher handwritten characters, from numerical digits (0-9) to a comprehensive range of alphabets (A-Z, both uppercase and lowercase). Utilizing advanced machine learning algorithms trained on the expansive MNIST and EMNIST datasets, Rekognize offers a cutting-edge solution for real-time character recognition. The platform is engineered using Flask, providing a sleek, user-friendly interface, while the underlying predictive technology is powered by TensorFlow, ensuring highly accurate and swift character predictions. Rekognize stands out as a smart tool, blending modern web technology with state-of-the-art AI to revolutionize the way we interact with handwritten text.
        </p>
        <div className="github-link-box">
            <a href="https://github.com/nabeelthotti/Rekognize" target="_blank" rel="noopener noreferrer">
                View on GitHub
            </a>
        </div>
        <div className="website-link-box">
            <a href="https://rekognize.fly.dev/" target="_blank" rel="noopener noreferrer">
                View Live Site
            </a>
        </div>
    </div>
);

export default Rekognize;
