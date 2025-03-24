import React from "react";
import HeaderComponent from "../components/header";
import Footer from "../components/footer";
import "../../src/Assets/css/about.css";
import '../Assets/css/notification.css';

const AboutPage = () => {
    return (
        <>
            <HeaderComponent />
            <section className="about-container">
                <div className="about-banner">
                    <h1 className="about-title">Welcome to <span className="highlight">URBNCove</span></h1>
                    <p>Your ultimate destination for premium fashion and accessories.</p>
                </div>

                <div className="about-content">
                    <h2>Who We Are</h2>
                    <p>
                        At URBNCove, we are passionate about delivering high-quality, stylish, and
                        affordable fashion to our customers. Our mission is to bring <b>modern, trendy,
                            and unique products</b> that elevate your style effortlessly.
                    </p>

                    <h2>Why Choose Us?</h2>
                    <div className="about-grid">
                        <div className="about-feature">
                            <h3>Exclusive Collections</h3>
                            <p>We offer a handpicked selection of <b>premium </b>fashion items.</p>
                        </div>
                        <div className="about-feature">
                            <h3>Affordable Pricing</h3>
                            <p>Enjoy <b>high-quality products</b> at unbeatable prices.</p>
                        </div>
                        <div className="about-feature">
                            <h3>Fast & Reliable Shipping</h3>
                            <p>We deliver your products quickly and securely.</p>
                        </div>
                        <div className="about-feature">
                            <h3>Excellent Support</h3>
                            <p>Our <b>dedicated team</b> is here to assist you 24/7.</p>
                        </div>
                    </div>

                    <h2>Our Mission</h2>
                    <p>
                        Our goal is to make <b>fashion accessible and affordable</b> while providing a seamless
                        shopping experience. We believe style should be effortless, and our collections
                        reflect the latest trends in the industry.
                    </p>
                </div>
            </section>
            <Footer />
        </>
    );
};

export default AboutPage;
