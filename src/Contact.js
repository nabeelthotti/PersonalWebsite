import React, { useState } from 'react';
import emailjs from 'emailjs-com';
import './Contact.css';

const Contact = () => {
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        phoneNumber: '',
        message: '',
    });
    const [isSubmitted, setIsSubmitted] = useState(false); // State to track if the form has been submitted

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value,
        }));
        if (isSubmitted) {
            setIsSubmitted(false); // Reset the submission status when the user starts editing the form again
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        emailjs.sendForm('personalweb_11178', 'template_0k9vala', e.target, 'f8ysZa1ZuLWu3S1g9')
            .then((result) => {
                console.log('Email sent successfully:', result.text);
                setFormData({ firstName: '', lastName: '', email: '', phoneNumber: '', message: '' });
                setIsSubmitted(true); // Set the submitted status to true on successful email send
            }, (error) => {
                console.log('Failed to send email:', error.text);
            });
    };

    return (
        <div className="ide-container">
            <div className="ide-header">MyIDE - ContactForm.js</div>
            <form className="ide-code-editor" onSubmit={handleSubmit}>
                <label className="ide-line">
                    {/* eslint-disable-next-line */}
                    <span className="ide-comment">// Fill out this form to contact me</span>
                </label>
                <label className="ide-line">
                    <span className="ide-code">firstName = </span>
                    <input
                        type="text"
                        name="firstName"
                        className="ide-input"
                        value={formData.firstName}
                        onChange={handleChange}
                        placeholder='"John"'
                        required
                    />
                </label>
                <label className="ide-line">
                    <span className="ide-code">lastName = </span>
                    <input
                        type="text"
                        name="lastName"
                        className="ide-input"
                        value={formData.lastName}
                        onChange={handleChange}
                        placeholder='"Doe"'
                        required
                    />
                </label>
                <label className="ide-line">
                    <span className="ide-code">email = </span>
                    <input
                        type="email"
                        name="email"
                        className="ide-input"
                        value={formData.email}
                        onChange={handleChange}
                        placeholder='"example@domain.com"'
                        required
                    />
                </label>
                <label className="ide-line">
                    <span className="ide-code">phoneNumber = </span>
                    <input
                        type="text"
                        name="phoneNumber"
                        className="ide-input"
                        value={formData.phoneNumber}
                        onChange={handleChange}
                        placeholder='"123-456-7890"'
                        required
                    />
                </label>
                <label className="ide-line">
                    <span className="ide-code">message = </span>
                    <textarea
                        name="message"
                        className="ide-input ide-textarea"
                        value={formData.message}
                        onChange={handleChange}
                        placeholder='"Hello, I would like to ..."'
                        required
                    ></textarea>
                </label>
                <button type="submit" className="ide-submit">
                    <span className="ide-code">submitContactForm()</span>
                </button>
                {isSubmitted && <div className="submission-message">Submitted!</div>} {/* Display the submission message */}
            </form>
        </div>
    );
};

export default Contact;
