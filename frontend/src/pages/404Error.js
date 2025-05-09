import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import HeaderComponent from "../components/header";
import Footer from "../components/footer";
import "../../src/Assets/css/main.css";
import '../Assets/css/notification.css';

const NotFound = () => {
    return (
        <>
            <div className="not-found-container">
                <motion.h1
                    className="not-found-title"
                    initial={{ opacity: 0, y: -50 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                >
                    404
                </motion.h1>
                <motion.p
                    className="not-found-text"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.5 }}
                >
                    Oops! The page you're looking for doesn't exist.
                </motion.p>
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.8 }}
                >
                    <Link to="/" className="not-found-link">
                        Go Home
                    </Link>
                </motion.div>
            </div>
        </>
    );
};

export default NotFound;
