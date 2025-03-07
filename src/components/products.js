import React, { useState, useEffect, useRef } from "react";
import "../Assets/css/main.css";
import "../Assets/css/featured.css";
import { Link } from "react-router-dom";
import { fetchProducts } from "../services/products";

const FeaturedProducts = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchFeaturedProducts = async () => {
            try {
                const data = await fetchProducts();
                setProducts(data);
            } catch (error) {
                console.error("Error fetching products:", error);
                setError("Failed to load products. Please try again.");
            } finally {
                setLoading(false);
            }
        };
        fetchFeaturedProducts();
    }, []);


    if (loading) return <p className="loading">Loading products...</p>;
    if (error) return <p className="error">{error}</p>;

    return (
        <section className="featured">
            <h2>Featured Products</h2>
            <div className="product-grid">
                {products.map((product) => (
                    <div key={product.productId} className="product-card">
                        <h3>
                            <Link className="link" to={`/productDetails/${product.productId}`}>
                                {product.name}
                            </Link>
                        </h3>
                        <Link className="link" to={`/productDetails/${product.productId}`}>
                            <img
                                src={product.imageUrl.startsWith("http") ? product.imageUrl : `${process.env.PUBLIC_URL}${product.imageUrl}`}
                                alt={product.name}
                            />
                        </Link>
                        <p className="price">Ksh {product.price}</p>
                        <Link className="link" to={`/productDetails/${product.productId}`}>
                            <button className="btn">Shop Now</button>
                        </Link>
                    </div>
                ))}
            </div>
        </section >
    );
};

export default FeaturedProducts;
