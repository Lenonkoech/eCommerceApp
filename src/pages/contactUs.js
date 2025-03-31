import React, { useState, useEffect } from "react";
import "../../src/Assets/css/main.css";
import "../../src/Assets/css/contact.css";
import HeaderComponent from "../components/header";
import Footer from "../components/footer";
import { jwtDecode } from "jwt-decode";
import "../Assets/css/notification.css";
import { postMessage } from "../services/contactUsMessageService";
import { useNotification } from "../context/NotificationContext";

const ContactPage = () => {
    const [formData, setFormData] = useState({
        userId: "",
        name: "",
        email: "",
        message: "",
    });

    const [loading, setLoading] = useState(false);
    const { showNotification } = useNotification();

    // Handle input changes
    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    // Extract userId from token if available
    useEffect(() => {
        const token = sessionStorage.getItem("token");
        if (token) {
            try {
                const decoded = jwtDecode(token);
                const userId = decoded["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier"];
                if (userId) {
                    setFormData((prev) => ({ ...prev, userId }));
                }
            } catch (error) {
                console.error("Invalid token:", error);
            }
        }
    }, []);

    // Handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault();

        // Ensure all fields are filled
        if (!formData.name || !formData.email || !formData.message) {
            showNotification("All fields are required!");
            return;
        }

        setLoading(true);
        showNotification(""); // Clear previous notifications

        try {
            await postMessage(formData);
            showNotification("Your message has been sent successfully!");
            setFormData((prev) => ({
                ...prev,
                name: "",
                email: "",
                message: "",
            })); // Reset only the input fields
        } catch (error) {
            console.error("Error details:", error.response?.data || error.message);
            showNotification("Failed to send message. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <HeaderComponent />
            <section className="contact-container">
                <div className="contact-content">
                    <h2 className="contact-title">
                        Get in <span className="highlight">Touch</span>
                    </h2>
                    <p className="contact-text">Have questions? We’d love to hear from you!</p>

                    <div className="contact-details">
                        <p>
                            <strong>Email:</strong> <a href="mailto:support@urbncove.com">support@urbncove.com</a>
                        </p>
                        <p>
                            <strong>Phone:</strong> <a href="tel:+2544567890">+254 456 7890</a>
                        </p>
                        <p>
                            <strong>Location:</strong> Nairobi, Kenya
                        </p>
                    </div>

                    <form className="contact-form" onSubmit={handleSubmit}>
                        <input
                            type="text"
                            name="name"
                            placeholder="Your Name"
                            value={formData.name}
                            onChange={handleChange}
                            required
                        />
                        <input
                            type="email"
                            name="email"
                            placeholder="Your Email"
                            value={formData.email}
                            onChange={handleChange}
                            required
                        />
                        <textarea
                            name="message"
                            placeholder="Your Message"
                            value={formData.message}
                            onChange={handleChange}
                            required
                        ></textarea>
                        <button type="submit" className="btn-submit" disabled={loading}>
                            {loading ? "Sending..." : "Send Message"}
                        </button>
                    </form>
                </div>
            </section>
            <Footer />
        </>
    );
};

export default ContactPage;
