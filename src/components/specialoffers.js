import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "../Assets/css/main.css";
import { fetchOfferProducts } from "../services/products";
import { BASE_IMAGE_URL } from "./products";

const SpecialOffers = () => {
    const [offers, setOffers] = useState([]);

    useEffect(() => {
        const fetchSpecialOfferProducts = async () => {
            try {
                const data = await fetchOfferProducts();
                // console.log(data);
                setOffers(data);
            } catch (error) {
                console.error("Error fetching products:", error);
            }
        };
        fetchSpecialOfferProducts();
    }, []);

    const applyDiscount = (price, discount) => {
        if (!price || isNaN(price)) return 0;  // Ensure price is valid
        return (price * ((100 - discount) / 100)).toFixed(2);  // Apply 5% discount & format to 2 decimal places
    };



    return (
        <section className="special-offers">
            <h2> Special Offers </h2>
            <div className="offers-container">
                {offers.map((product, index) => (
                    <div key={index} className="offer-card">
                        <div className="discount-badge">-{product.discount}%</div>
                        <img src={`${BASE_IMAGE_URL}${product.imageUrl}`} alt={product.name} />
                        <h3>{product.name}</h3>
                        <p className="price">
                            <span className="old-price">Ksh {product.price}</span>   Ksh {applyDiscount(product.price,product.discount)}
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
