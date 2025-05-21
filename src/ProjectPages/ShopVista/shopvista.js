import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import '../shared.css';

const slides = [
    { src: "ShopVista1.png", alt: "ShopVista Homepage" },
    { src: "ShopVista2.png", alt: "ShopVista Product Catalog" },
    { src: "ShopVista3.png", alt: "ShopVista Shopping Cart" },
    { src: "ShopVista4.png", alt: "ShopVista Checkout" },
    { src: "ShopVista5.png", alt: "ShopVista User Profile" },
    { src: "ShopVista6.png", alt: "ShopVista Admin Panel" },
    { src: "ShopVista7.png", alt: "ShopVista Order Management" }
];

const ShopVista = () => {
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
                <h1>ShopVista</h1>
                <p className="project-subtitle">Full-Stack E-commerce Platform</p>
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
                            <p>This e-commerce platform seamlessly integrates React for the frontend and Spring Boot for the backend, providing a comprehensive online shopping experience. React enhances the user interface, allowing customers to browse products, manage their shopping carts, and complete the checkout process efficiently. The backend, developed with Spring Boot, manages critical functionalities such as user data, product inventory, order processing, and ensures robust security protocols with Spring Security. The system uses MySQL for data storage, which includes user profiles, product details, and transaction information. Setting up the environment involves configuring Spring Boot to connect with MySQL, setting up initial database schemas, and populating them with data, while the frontend requires npm installations and running a React server. The application supports dynamic interactions, such as product selection and user authentication, facilitated by Axios and React Router for handling API requests and app navigation, respectively. An admin panel allows for easy management of products and user data, ensuring administrators can maintain the platform effectively.</p>
                        </div>
                    </div>
                </div>

                <div className="project-details">
                    <div className="detail-section">
                        <h2>Tools</h2>
                        <ul>
                            <li>Postman</li>
                            <li>React</li>
                            <li>SpringBoot</li>
                            <li>Docker</li>
                            <li>CORS</li>
                            <li>MySQL</li>
                        </ul>
                    </div>

                    <div className="detail-section">
                        <h2>Languages</h2>
                        <ul>
                            <li>Java</li>
                            <li>JavaScript</li>
                            <li>HTML/CSS</li>
                            <li>SQL</li>
                        </ul>
                    </div>

                    <div className="detail-section">
                        <h2>Links</h2>
                        <ul>
                            <li><a href="https://github.com/nabeelthotti/ShopVista" target="_blank" rel="noopener noreferrer">GitHub</a></li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ShopVista;
