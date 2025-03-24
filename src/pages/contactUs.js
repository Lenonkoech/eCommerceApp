import React from "react";
import "../../src/Assets/css/main.css";
import HeaderComponent from "../components/header";
import Footer from "../components/footer";
import '../Assets/css/notification.css';

const ContactPage = () => {
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

                    <form className="contact-form">
                        <input type="text" placeholder="Your Name" required />
                        <input type="email" placeholder="Your Email" required />
                        <textarea placeholder="Your Message" required></textarea>
                        <button type="submit" className="btn-submit">Send Message</button>
                    </form>
                </div>
            </section>
            <Footer />
        </>
    );
};

export default ContactPage;
