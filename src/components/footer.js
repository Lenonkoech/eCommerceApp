import React from "react";
import '../Assets/css/footer.css'
import { FaFacebookF, FaTwitter, FaInstagram, FaLinkedin } from "react-icons/fa";
import { Link } from "react-router-dom";

const Footer = () => {
    return (
        <footer className="footer">
            <div className="footer-container">
                <div className="footer-about">
                    <h2 className="logo">URB<span className="highlight-footer">NCove</span></h2>
                    <p>Your ultimate destination for premium products. Shop with confidence and style.</p>
                </div>

                {/* Navigation Links */}
                <div className="footer-links">
                  
                    <ul>
                    <h3 className="footer-h3" >Quick Links</h3>
                        <li><Link to={'/'}>Home</Link></li>
                        <li><Link to="/products">Products</Link></li>
                        <li><Link to="/about">About</Link></li>
                        <li><Link to="/contact">Contact</Link></li>
                    </ul>
                </div>

                {/* Contact Section */}
                <div className="footer-contact">
                    <h3 className="footer-h3" >Contact Us</h3>
                    <p>Email: support@urbncove.com</p>
                    <p>Phone: +254 456 7890</p>
                    <p>Location: Nairobi, Kenya</p>
                </div>

                {/* Social Media Icons */}
                <div className="footer-social">
                    <h3 className="footer-h3" >Follow Us</h3>
                    <div className="social-icons">
                        <a href="#fb"><FaFacebookF /></a>
                        <a href="#tw"><FaTwitter /></a>
                        <a href="#ig"><FaInstagram /></a>
                        <a href="#li"><FaLinkedin /></a>
                    </div>
                </div>
            </div>

            {/* Copyright */}
            <div className="footer-bottom">
                <p>© {new Date().getFullYear()} URBNCove. All rights reserved.</p>
            </div>
        </footer>
    );
};

export default Footer;
