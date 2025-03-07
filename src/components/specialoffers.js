import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "../Assets/css/main.css";
import { fetchProducts } from "../services/products";

const SpecialOffers = () => {
    const [offers, setOffers] = useState([]);

    useEffect(() => {
        const fetchSpecialOffers = async () => {
            const data = await fetchProducts();
            setOffers(data);
        };
        fetchSpecialOffers();
    }, []);

    const applyDiscount = (price) => {
        if (!price || isNaN(price)) return 0;  // Ensure price is valid
        return (price * 0.95).toFixed(2);  // Apply 5% discount & format to 2 decimal places
    };



    return (
        <section className="special-offers">
            <h2> Special Offers </h2>
            <div className="offers-container">
                {offers.map((product, index) => (
                    <div key={index} className="offer-card">
                        <div className="discount-badge">-5{product.discount}%</div>
                        <img src={product.imageUrl} alt={product.name} />
                        <h3>{product.name}</h3>
                        <p className="price">
                            <span className="old-price">Ksh {product.price}</span>   Ksh {applyDiscount(product.price)}
                        </p>
                        <Link to={`/product/${product.productId}`} className="buy-now">
                            Buy Now
                        </Link>
                    </div>
                ))}
            </div>
        </section>
    );
};

export default SpecialOffers;
