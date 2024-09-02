import React, { useState } from 'react';
import './shopvista.css';

const slides = [
    { src: "ShopVista1.png" },
    { src: "ShopVista2.png" },
    { src: "ShopVista3.png" },
    { src: "ShopVista4.png" },
    { src: "ShopVista5.png" },
    { src: "ShopVista6.png" },
    { src: "ShopVista7.png" }
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
            <h1>ShopVista</h1>
            <div className="main-content">
                <div className="carousel-container">
                    <button className="arrow left" onClick={prevSlide}>&#10094;</button>
                    <img src={slides[activeSlide].src} alt={slides[activeSlide].alt} />
                    <button className="arrow right" onClick={nextSlide}>&#10095;</button>
                </div>
                <div className="project-description">
                    <p>This e-commerce platform seamlessly integrates React for the frontend and Spring Boot for the backend, providing a comprehensive online shopping experience. React enhances the user interface, allowing customers to browse products, manage their shopping carts, and complete the checkout process efficiently. The backend, developed with Spring Boot, manages critical functionalities such as user data, product inventory, order processing, and ensures robust security protocols with Spring Security. The system uses MySQL for data storage, which includes user profiles, product details, and transaction information. Setting up the environment involves configuring Spring Boot to connect with MySQL, setting up initial database schemas, and populating them with data, while the frontend requires npm installations and running a React server. The application supports dynamic interactions, such as product selection and user authentication, facilitated by Axios and React Router for handling API requests and app navigation, respectively. An admin panel allows for easy management of products and user data, ensuring administrators can maintain the platform effectively. </p>
                </div>
            </div>
            <div className="horizontal-sections">
                <div>
                    <h2>Tools</h2>
                    <ul>
                        <li>Postman</li>
                        <li>React</li>
                        <li>SpringBoot</li>
                        <li>Docker</li>
                        <li>JWT Token</li>
                        <li>CORS</li>
                        <li>MySQL</li>
                        
                    </ul>
                </div>
                <div>
                    <h2>Languages</h2>
                    <ul>
                        <li>Java</li>
                        <li>JavaScript</li>
                        <li>HTML/CSS</li>
                        <li>SQL</li>
                    </ul>
                </div>
                <div>
                    <h2>Links</h2>
                    <ul>
                        <li><a href="https://github.com/nabeelthotti/ShopVista" target="_blank" rel="noopener noreferrer">GitHub</a></li>
                    </ul>
                </div>
            </div>
        </div>
    );
};

export default ShopVista;
