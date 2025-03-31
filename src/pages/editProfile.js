import React, { useState, useEffect } from "react";
import { jwtDecode } from "jwt-decode";
import "../../src/Assets/css/main.css";
import "../../src/Assets/css/contact.css";
import HeaderComponent from "../components/header";
import Footer from "../components/footer";
import "../Assets/css/notification.css";
import { postMessage } from "../services/contactUsMessageService";

const ContactPage = () => {
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        message: "",
        userId: null
    });
    const [feedback, setFeedback] = useState({ message: "", type: "" });
    const [loading, setLoading] = useState(false);

    // Extract User ID from Token
    useEffect(() => {
        const token = sessionStorage.getItem("token");
        if (token) {
            try {
                const decoded = jwtDecode(token);
                const userId = decoded["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier"];
                setFormData((prev) => ({ ...prev, userId }));
            } catch (error) {
                console.error("Invalid token:", error);
            }
        }
    }, []);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const validateEmail = (email) => {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setFeedback({ message: "", type: "" });

        if (!formData.name.trim() || !formData.email.trim() || !formData.message.trim()) {
            setFeedback({ message: "⚠️ All fields are required!", type: "error" });
            return;
        }

        if (!validateEmail(formData.email)) {
            setFeedback({ message: "⚠️ Please enter a valid email address!", type: "error" });
            return;
        }

        setLoading(true);

        try {
            await postMessage(formData);
            setFeedback({ message: "✅ Your message has been sent successfully!", type: "success" });
            setFormData({ name: "", email: "", message: "", userId: formData.userId });
        } catch (error) {
            setFeedback({
                message: error.response?.data?.message || "❌ Failed to send message. Please try again.",
                type: "error",
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <HeaderComponent />
            <section className="contact-container">
                <div className="contact-content">
                    <h2 className="contact-title">Get in <span className="highlight">Touch</span></h2>
                    <p className="contact-text">Have questions? We’d love to hear from you!</p>

                    <div className="contact-details">
                        <p><strong>Email:</strong> <a href="mailto:support@urbncove.com">support@urbncove.com</a></p>
                        <p><strong>Phone:</strong> <a href="tel:+2544567890">+254 456 7890</a></p>
                        <p><strong>Location:</strong> Nairobi, Kenya</p>
                    </div>

                    <form className="contact-form" onSubmit={handleSubmit}>
                        <label htmlFor="name">Your Name:</label>
                        <input
                            type="text"
                            id="name"
                            name="name"
                            placeholder="Your Name"
                            value={formData.name}
                            onChange={handleChange}
                            required
                        />

                        <label htmlFor="email">Your Email:</label>
                        <input
                            type="email"
                            id="email"
                            name="email"
                            placeholder="Your Email"
                            value={formData.email}
                            onChange={handleChange}
                            required
                        />

                        <label htmlFor="message">Your Message:</label>
                        <textarea
                            id="message"
                            name="message"
                            placeholder="Your Message"
                            value={formData.message}
                            onChange={handleChange}
                            required
                        ></textarea>

                        <button type="submit" className="btn-submit" disabled={loading || !formData.name || !formData.email || !formData.message}>
                            {loading ? "Sending..." : "Send Message"}
                        </button>
                    </form>

                    {feedback.message && (
                        <p className={`feedback-message ${feedback.type === "error" ? "error-text" : "success-text"}`}>
                            {feedback.message}
                        </p>
                    )}
                </div>
            </section>
            <Footer />
        </>
    );
};

export default ContactPage;
