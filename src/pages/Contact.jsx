import React, { useState } from "react";
import "./Contact.css";

function Contact() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: ""
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    setSuccess(false);

    try {
      const res = await fetch("https://greencart-backend-z9tq.onrender.com/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          senderEmail: formData.email,
          message: `Name: ${formData.name}\nEmail: ${formData.email}\nMessage: ${formData.message}`
        }),
      });

      if (!res.ok) {
        throw new Error("Failed to send message");
      }

      setSuccess(true);
      setFormData({
        name: "",
        email: "",
        message: ""
      });
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="page contact">
      <h2>Contact Us 📞</h2>
      <p>We'd love to hear from you!</p>

      <div className="contact-wrapper">
        <div className="contact-form-section">
          {success && (
            <div className="alert success">
              Message sent successfully! We'll get back to you soon. ✅
            </div>
          )}

          {error && (
            <div className="alert error">
              {error} ❌
            </div>
          )}

          <form className="contact-form" onSubmit={handleSubmit}>
            <label htmlFor="name">Name</label>
            <input
              id="name"
              name="name"
              type="text"
              placeholder="Your name"
              value={formData.name}
              onChange={handleChange}
            />

            <label htmlFor="email">Email</label>
            <input
              id="email"
              name="email"
              type="email"
              placeholder="Your email"
              value={formData.email}
              onChange={handleChange}
              required
            />

            <label htmlFor="message">Message</label>
            <textarea
              id="message"
              name="message"
              placeholder="Write your message here"
              value={formData.message}
              onChange={handleChange}
              required
              rows="5"
            />

            <button type="submit" disabled={isLoading}>
              {isLoading ? "Sending..." : "Send"}
            </button>
          </form>
        </div>
        
        <div className="map-section">
          <h3>Find Us 📍</h3>
          <iframe
            title="nursery-map"
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d5406.456210712724!2d78.15025637547144!3d11.477054746560002!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3babe9b9ae7bc1d5%3A0xc415e0074edf930b!2sSri%20Vaari%20Nursery%20and%20Gardens!5e0!3m2!1sen!2sin!4v1743993122763!5m2!1sen!2sin"
            width="100%"
            height="100%"
            allowFullScreen=""
            loading="lazy"
            style={{ border: 0 }}
          ></iframe>
        </div>


      </div>
    </div>
  );
}

export default Contact;
