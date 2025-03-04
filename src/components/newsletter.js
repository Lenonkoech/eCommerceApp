import React, { useState } from "react";
import '../Assets/css/main.css'

const Newsletter = () => {
    const [email, setEmail] = useState("");
    const [message, setMessage] = useState("");

    const handleSubmit = (e) => {
        e.preventDefault();

        if (!email) {
            setMessage("Please enter a valid email address.");
            return;
        }

        // Simulate an API request (replace with actual API call)
        setTimeout(() => {
            setMessage("Thank you for subscribing!");
            setEmail(""); // Reset email input
        }, 1000);
    };

    return (
        <section className="newsletter">
            <div className="newsletter-content">
                <h2>Subscribe to Our Newsletter</h2>
                <p>Stay updated with our latest offers and new arrivals!</p>
                <form onSubmit={handleSubmit} className="newsletter-form">
                    <input
                        type="email"
                        placeholder="Enter your email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                    <button type="submit">Subscribe</button>
                </form>
                {message && <p className="newsletter-message">{message}</p>}
            </div>
        </section>
    );
};

export default Newsletter;
