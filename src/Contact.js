import React, { useState } from 'react';
import './Contact.css'; 

const Contact = () => {
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        phoneNumber: '',
        message: '',
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log('User Submitted:', formData);
        setFormData({ firstName: '', lastName: '', email: '', phoneNumber: '', message: '' });
    };
    return (
        <div className="ide-container">
            <div className="ide-header">MyIDE - ContactForm.js</div>
            <form className="ide-code-editor" onSubmit={handleSubmit}>
                <label className="ide-line">
                    {/* eslint-disable-next-line react/jsx-no-comment-textnodes */}
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
            </form>
        </div>
    );
};

export default Contact;