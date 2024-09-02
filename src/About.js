import React from 'react';
import './About.css'; 


function About() {
   
    return (
        <div>
            <div className="container">
                <div className="about-container">
                  
                    <img src="Nabeel.jpg" alt="Profile" />
                    <h1>Hello World ..</h1>
                    <p>My name is Nabeel. I am a passionate software developer based in Los Angeles. I specialize in using modern programming technologies to create scalable and efficient applications. My experience spans several frameworks and tools, aiming to deliver innovative solutions that enhance engagement and productivity. I'm eager to collaborate on projects that challenge the technological status quo and drive societal progress further.</p>
                    <p>Thank you for visiting my website! Feel free to connect with me below. 😊 </p>
                    <div className="social-links">
                        <a href="https://www.linkedin.com/in/nabeelthotti"><img src="linkedin.png" alt="LinkedIn Logo" /></a>
                        <a href="https://github.com/nabeelthotti"><img src="github.png" alt="GitHub Logo" /></a>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default About;
