import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import "../Assets/css/main.css";

const SpecialOffers = () => {
    const [offers, setOffers] = useState([]);

    useEffect(() => {
        axios
            .get("http://localhost:5294/api/Product")
            .then((response) => setOffers(response.data))
            .catch((error) => console.error("Error fetching special offers:", error));
    }, []);
    const applyDiscount = (price) => {
        if (!price || isNaN(price)) return 0;  // Ensure price is valid
        return (price * 0.95).toFixed(2);  // Apply 5% discount & format to 2 decimal places
    };



    return (
        <section className="special-offers">
            <h2> Special Offers </h2>
            <div className="offers-container">
                {offers.map((product) => (
                    <div key={product.id} className="offer-card">
                        <div className="discount-badge">-5{product.discount}%</div>
                        <img src={product.imageUrl} alt={product.name} />
                        <h3>{product.name}</h3>
                        <p className="price">
                            <span className="old-price">Ksh {product.price}</span>   Ksh {applyDiscount(product.price)}
                        </p>
                        <Link to={`/product/${product.id}`} className="buy-now">
                            Buy Now
                        </Link>
                    </div>
                ))}
            </div>
        </section>
    );
};

export default SpecialOffers;
